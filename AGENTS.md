# AGENTS.md

Guidance for agents working in this repository. Humans: read CONTRIBUTING.md instead; it is the same rules with the reasoning.

## What this repository is

Markdown skills for agents that run paid research on [Glasser](https://glasser.ai). It is also a Claude Code plugin marketplace (`.claude-plugin/`) and is installable with `npx skills add glasser-ai/skills`. There is no build step and no runtime code outside `.github/scripts/`.

The Glasser mechanism (auth, search, inspect, run, balance rules) is documented at https://glasser.ai/SKILL.md and shipped by [glasser-ai/plugins](https://github.com/glasser-ai/plugins). Nothing here duplicates it.

## Layout

```
.claude-plugin/
  plugin.json          plugin manifest; "skills": "./skills"
  marketplace.json     marketplace manifest; one plugin, source "./"
.github/
  scripts/validate.mjs check every skill and the repo-level invariants
  scripts/sync.mjs     regenerate the README table, marketplace count and per-skill prerequisite block
  workflows/           validate on PR and push to main; sync check on main
skills/<name>/SKILL.md one skill per directory
templates/             SKILL.template.md and glasser-prereq.md; outside skills/ on purpose
```

## Invariants

- `name` in frontmatter equals the directory name.
- Frontmatter has exactly `name`, `description`, `metadata.version`, `metadata.category`.
- `description` is on one line with `description:`, 1 to 1024 characters.
- Every `SKILL.md` carries the block in `templates/glasser-prereq.md` verbatim, between the H1 and the first `##`.
- No `](../` or `](/` links; skills are copied out alone.
- No HTML comments, no CJK characters, under 500 lines.
- No provider names in skill names or process steps. Describe the capability to search for and what to confirm on inspect.
- No execution channels: a skill ends at a result, it does not send, post, publish, or buy.
- No `.mcp.json` here, no `tools/` directory, no `shared/` directory.
- `skills/glasser/` is the one mirror of glasser.ai/SKILL.md: body byte-identical to the source, frontmatter `name`, `description`, `version`, `metadata.source`, `metadata.category`, no prerequisite block. Regenerate it with `node scripts/sync-glasser-skill.mjs`; never edit it by hand.
- Nothing under `templates/` is named `SKILL.md`; installers would treat it as a skill.
- README table, marketplace skill count and every skill's prerequisite block are generated; `sync.mjs --check` enforces all three.

## Commands

```bash
node .github/scripts/validate.mjs   # all checks; exit 1 on any error
node .github/scripts/sync.mjs       # rewrite README table, marketplace count, prerequisite blocks
node .github/scripts/sync.mjs --check
```

Node 20 or later, no dependencies.

## Adding a skill

1. `cp templates/SKILL.template.md skills/<name>/SKILL.md` and write it.
2. `node .github/scripts/sync.mjs`
3. `node .github/scripts/validate.mjs`
4. Branch `skills/<name>`, conventional commit `feat(<name>): add skill`, PR with the new-skill template.

## Changing a skill

Bump `metadata.version` in the same PR. Patch for fixes, minor for new dimensions or triggers. To change the prerequisite wording, edit `templates/glasser-prereq.md` and run `sync.mjs`; commit the source and the rewritten skills together.

## Versioning

`plugin.json` `version` and `marketplace.json` `metadata.version` share one number and move together: minor for a new skill, patch for changes to existing ones, major for repo-wide restructuring. Per-skill versions live in each `SKILL.md` and move independently.
