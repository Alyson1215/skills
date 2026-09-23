#!/usr/bin/env node
// Validates every skill under skills/ against the rules in CONTRIBUTING.md,
// then checks the README skills table and marketplace.json against the
// skills/ directory. Zero dependencies; Node 20+.
//
//   node .github/scripts/validate.mjs
//
// Exit code 1 on any error. Warnings never fail the run.

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SKILLS_DIR = join(ROOT, "skills");
const PREREQ_FILE = join(ROOT, "templates/glasser-prereq.md");
const MARKETPLACE_FILE = join(ROOT, ".claude-plugin/marketplace.json");
const PLUGIN_FILE = join(ROOT, ".claude-plugin/plugin.json");
const SYNC_SCRIPT = join(ROOT, ".github/scripts/sync.mjs");

const MAX_LINES = 500;
const ALLOWED_TOP_KEYS = ["name", "description", "metadata"];
const ALLOWED_META_KEYS = ["version", "category"];

// Mirrors of a skill published elsewhere. The body is byte-identical to the
// source, so the prerequisite block and the process-section rules do not
// apply; the frontmatter is the shape scripts/sync-glasser-skill.mjs writes:
// top-level `version` (the source's release) and `metadata.source`.
const MIRRORS = { glasser: "https://glasser.ai/SKILL.md" };
const MIRROR_TOP_KEYS = ["name", "description", "version", "metadata"];
const MIRROR_META_KEYS = ["source", "category"];
const NAME_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const CJK_RE = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯＀-￯]/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;

// Vendor names that must not appear in a skill's process steps. Matching any
// of these is a warning for a human to look at, not a hard failure: a skill may
// legitimately mention a vendor when explaining what to confirm on inspect.
const PROVIDER_NAMES = [
  "apollo", "semrush", "dataforseo", "ahrefs", "moz", "similarweb", "builtwith",
  "clearbit", "hunter", "zoominfo", "lusha", "crunchbase", "pitchbook",
  "peopledatalabs", "proxycurl", "serpapi", "serper", "brightdata", "apify",
  "rocketreach", "snov", "dropcontact", "wappalyzer", "spyfu", "majestic",
];

const errors = [];
const warnings = [];
const error = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

// ---------------------------------------------------------------------------
// Frontmatter. The shape is fixed (see CONTRIBUTING.md), so this parser is
// deliberately strict: it accepts exactly the layout we require and reports
// anything else as an error rather than guessing.
// ---------------------------------------------------------------------------

function parseFrontmatter(text, where, mirror = false) {
  const topKeys = mirror ? MIRROR_TOP_KEYS : ALLOWED_TOP_KEYS;
  const metaKeys = mirror ? MIRROR_META_KEYS : ALLOWED_META_KEYS;
  const lines = text.split("\n");
  if (lines[0] !== "---") {
    error(where, "file must start with a '---' frontmatter line");
    return null;
  }
  const end = lines.indexOf("---", 1);
  if (end === -1) {
    error(where, "frontmatter is not closed with a second '---'");
    return null;
  }
  const fm = { metadata: {} };
  let inMetadata = false;
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;
    const indented = /^\s+/.test(line);
    if (!indented) {
      inMetadata = false;
      const m = line.match(/^([A-Za-z_]+):(?:\s(.*))?$/);
      if (!m) {
        error(where, `unparseable frontmatter line ${i + 1}: ${JSON.stringify(line)}`);
        continue;
      }
      const [, key, rawValue = ""] = m;
      if (!topKeys.includes(key)) {
        error(where, `frontmatter key '${key}' is not allowed (only ${topKeys.join(", ")})`);
        continue;
      }
      if (key === "metadata") {
        if (rawValue.trim() !== "") error(where, "'metadata:' must be a block, not an inline value");
        inMetadata = true;
        continue;
      }
      if (key in fm) error(where, `duplicate frontmatter key '${key}'`);
      const value = rawValue.trim();
      if (value === ">" || value === "|" || value.startsWith(">") || value.startsWith("|")) {
        error(where, `'${key}' must be on the same line as '${key}:' (no YAML folded or literal block)`);
        fm[key] = "";
        continue;
      }
      fm[key] = unquote(value);
    } else {
      if (!inMetadata) {
        error(where, `unexpected indented frontmatter line ${i + 1}: ${JSON.stringify(line)}`);
        continue;
      }
      const m = line.match(/^\s+([A-Za-z_]+):\s(.*)$/);
      if (!m) {
        error(where, `unparseable metadata line ${i + 1}: ${JSON.stringify(line)}`);
        continue;
      }
      const [, key, rawValue] = m;
      if (!metaKeys.includes(key)) {
        error(where, `metadata key '${key}' is not allowed (only ${metaKeys.join(", ")})`);
        continue;
      }
      fm.metadata[key] = unquote(rawValue.trim());
    }
  }
  return { fm, bodyStart: end + 1, lines };
}

function unquote(v) {
  if (v.length >= 2 && ((v[0] === '"' && v.at(-1) === '"') || (v[0] === "'" && v.at(-1) === "'"))) {
    return v.slice(1, -1);
  }
  return v;
}

// ---------------------------------------------------------------------------
// Per-skill checks
// ---------------------------------------------------------------------------

function validateSkill(dir) {
  const where = `skills/${dir}/SKILL.md`;
  const file = join(SKILLS_DIR, dir, "SKILL.md");
  if (!existsSync(file)) {
    error(`skills/${dir}`, "missing SKILL.md");
    return null;
  }
  const text = readFileSync(file, "utf8");
  const mirror = Object.hasOwn(MIRRORS, dir);
  const parsed = parseFrontmatter(text, where, mirror);
  if (!parsed) return null;
  const { fm, bodyStart, lines } = parsed;

  // name
  if (!fm.name) error(where, "missing 'name'");
  else {
    if (fm.name !== dir) error(where, `name '${fm.name}' does not match directory '${dir}'`);
    if (fm.name.length < 1 || fm.name.length > 64) error(where, `name must be 1-64 chars (is ${fm.name.length})`);
    if (!NAME_RE.test(fm.name)) error(where, `name '${fm.name}' must be lowercase letters, digits and single hyphens, not starting or ending with a hyphen`);
    if (fm.name.includes("--")) error(where, "name must not contain consecutive hyphens");
  }

  // description
  if (!fm.description) error(where, "missing 'description'");
  else if (fm.description.length > 1024) error(where, `description must be 1-1024 chars (is ${fm.description.length})`);

  // version: a mirror carries the source's release at the top level, a skill
  // authored here carries its own under metadata.
  if (mirror) {
    if (!fm.version) error(where, "missing 'version' (the source's release)");
    else if (!SEMVER_RE.test(fm.version)) error(where, `version '${fm.version}' is not x.y.z`);
    if (fm.metadata.source !== MIRRORS[dir]) error(where, `metadata.source must be ${MIRRORS[dir]}`);
  } else {
    if (!fm.metadata.version) error(where, "missing 'metadata.version'");
    else if (!SEMVER_RE.test(fm.metadata.version)) error(where, `metadata.version '${fm.metadata.version}' is not x.y.z`);
  }
  if (!fm.metadata.category) error(where, "missing 'metadata.category'");
  else if (!NAME_RE.test(fm.metadata.category)) error(where, `metadata.category '${fm.metadata.category}' must be lowercase letters, digits and hyphens`);

  // whole-file checks
  if (lines.length > MAX_LINES) error(where, `SKILL.md is ${lines.length} lines (max ${MAX_LINES})`);
  if (text.includes("<!--")) error(where, "HTML comments are not allowed");
  const cjkLine = lines.findIndex((l) => CJK_RE.test(l));
  if (cjkLine !== -1) error(where, `CJK characters on line ${cjkLine + 1}; the repository is English only`);

  const body = lines.slice(bodyStart);
  body.forEach((l, i) => {
    const n = bodyStart + i + 1;
    if (l.includes("](../")) error(where, `line ${n}: link to a parent directory; skills are copied out alone, so only same-directory paths and https URLs work`);
    if (l.includes("](/")) error(where, `line ${n}: root-relative link; only same-directory paths and https URLs work`);
  });

  // The body of a mirror is the published document, not a recipe on top of it.
  if (!mirror) {
    checkPrereqBlock(where, body);
    checkProviderNames(where, body, bodyStart);
  }

  // sibling files inside the skill directory
  for (const entry of readdirSync(join(SKILLS_DIR, dir))) {
    if (entry === "SKILL.md") continue;
    const p = join(SKILLS_DIR, dir, entry);
    if (statSync(p).isDirectory()) {
      if (existsSync(join(p, "SKILL.md"))) error(`skills/${dir}/${entry}`, "nested SKILL.md; skills do not nest");
    }
  }

  return { dir, ...fm };
}

let prereqLines = null;
function checkPrereqBlock(where, body) {
  if (prereqLines === null) {
    if (!existsSync(PREREQ_FILE)) {
      error("templates/glasser-prereq.md", "missing; it is the single source of the prerequisite block");
      prereqLines = [];
    } else {
      prereqLines = readFileSync(PREREQ_FILE, "utf8").replace(/\s+$/, "").split("\n");
    }
  }
  if (prereqLines.length === 0) return;

  const h1 = body.findIndex((l) => /^# /.test(l));
  if (h1 === -1) {
    error(where, "no H1 title after the frontmatter");
    return;
  }
  const firstH2 = body.findIndex((l, i) => i > h1 && /^## /.test(l));
  const between = body.slice(h1 + 1, firstH2 === -1 ? body.length : firstH2);

  // The block must appear verbatim, as a contiguous run of lines, between the
  // H1 and the first H2.
  let found = false;
  for (let i = 0; i + prereqLines.length <= between.length; i++) {
    if (prereqLines.every((pl, k) => between[i + k] === pl)) { found = true; break; }
  }
  if (!found) {
    error(where, "prerequisite block missing or altered; it must appear verbatim between the H1 and the first '##' (source: templates/glasser-prereq.md)");
  }
}

function checkProviderNames(where, body, bodyStart) {
  const start = body.findIndex((l) => /^## Process\b/i.test(l));
  if (start === -1) {
    warn(where, "no '## Process' section");
    return;
  }
  const end = body.findIndex((l, i) => i > start && /^## /.test(l));
  const section = body.slice(start + 1, end === -1 ? body.length : end);
  const re = new RegExp(`\\b(${PROVIDER_NAMES.join("|")})\\b`, "i");
  section.forEach((l, i) => {
    const m = l.match(re);
    if (m) warn(where, `line ${bodyStart + start + i + 2}: provider name '${m[1]}' in the Process section; skills describe capabilities, not vendors`);
  });
}

// ---------------------------------------------------------------------------
// Repository-level checks
// ---------------------------------------------------------------------------

function validateManifests(skills) {
  for (const f of [PLUGIN_FILE, MARKETPLACE_FILE]) {
    const rel = f.slice(ROOT.length + 1);
    if (!existsSync(f)) { error(rel, "missing"); continue; }
    try { JSON.parse(readFileSync(f, "utf8")); } catch (e) { error(rel, `invalid JSON: ${e.message}`); }
  }
  if (errors.some((e) => e.startsWith(".claude-plugin/"))) return;

  const plugin = JSON.parse(readFileSync(PLUGIN_FILE, "utf8"));
  const marketplace = JSON.parse(readFileSync(MARKETPLACE_FILE, "utf8"));
  if (plugin.skills !== "./skills") error(".claude-plugin/plugin.json", "'skills' must be \"./skills\"");
  if (!marketplace.plugins?.length) error(".claude-plugin/marketplace.json", "'plugins' must list one plugin");
  else {
    if (marketplace.plugins[0].source !== "./") error(".claude-plugin/marketplace.json", "plugins[0].source must be \"./\"");
    if (marketplace.plugins[0].name !== plugin.name) error(".claude-plugin/marketplace.json", `plugins[0].name '${marketplace.plugins[0].name}' != plugin.json name '${plugin.name}'`);
  }
  if (marketplace.metadata?.version !== plugin.version) {
    error(".claude-plugin", `version mismatch: plugin.json ${plugin.version} vs marketplace.json ${marketplace.metadata?.version}`);
  }
  if (existsSync(join(ROOT, ".mcp.json"))) error(".mcp.json", "must not exist here; MCP configuration lives in glasser-ai/plugins");
}

function checkStrayTemplates() {
  // The installer treats any directory containing a SKILL.md as a skill, so a
  // template that is literally named SKILL.md would be installed as one.
  const tpl = join(ROOT, "templates");
  if (!existsSync(tpl)) return;
  for (const entry of readdirSync(tpl)) {
    if (entry === "SKILL.md") error("templates/SKILL.md", "rename to SKILL.template.md; installers pick up any SKILL.md");
  }
}

function checkReadmeInSync() {
  if (!existsSync(SYNC_SCRIPT)) { error(".github/scripts/sync.mjs", "missing"); return; }
  const r = spawnSync(process.execPath, [SYNC_SCRIPT, "--check"], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) {
    for (const line of (r.stdout + r.stderr).trim().split("\n")) if (line) error("sync", line);
  }
}

// ---------------------------------------------------------------------------

function main() {
  if (!existsSync(SKILLS_DIR)) { error("skills/", "missing"); }
  const dirs = existsSync(SKILLS_DIR)
    ? readdirSync(SKILLS_DIR, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => e.name).sort()
    : [];
  const skills = dirs.map(validateSkill).filter(Boolean);

  validateManifests(skills);
  checkStrayTemplates();
  checkReadmeInSync();

  for (const w of warnings) console.log(`warning  ${w}`);
  for (const e of errors) console.log(`error    ${e}`);
  console.log("");
  console.log(`${dirs.length} skill(s) checked, ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}

main();
