# Glasser skills

Business skills for agents working on top of [Glasser](https://glasser.ai): each one is a task an agent is actually asked to do, written as a recipe over the Glasser catalog rather than over one vendor's API. One Key, no contract, pay per call.

Other marketing skill libraries hand you the recipe and leave the plumbing to you. This one does not.

| | Typical marketing skill library | Glasser skills |
|---|---|---|
| **Data access** | One environment variable per vendor; a 35-key `.env` is not unusual | `glasser login`, once |
| **Vendor lock** | Each skill is written against one API; swap the vendor and the skill breaks | Skills name capabilities; the catalog picks the endpoint |
| **Spend control** | Each key bills separately, with no view across them | One balance, price shown before every call, charge reported after |
| **Code in the skill** | Wrapper scripts per vendor to keep in step with each API | Markdown only; no scripts, no install step |

## Prerequisites

Skills here run on Glasser, and Glasser is installed separately so the two repositories can be reviewed and released on their own schedules.

Install one of:

- [glasser-ai/plugins](https://github.com/glasser-ai/plugins), which carries the `glasser` skill and the MCP server for Claude Code and other plugin-aware agents.
- The CLI: `npm i -g @glasser-ai/cli`, then `glasser login`.

How an agent calls Glasser is documented in one place: [glasser.ai/SKILL.md](https://glasser.ai/SKILL.md). Every skill here links to it and none of them repeat it.

## Installation

**With the skills CLI** ([vercel-labs/skills](https://github.com/vercel-labs/skills)):

```bash
npx skills add glasser-ai/skills                       # everything
npx skills add glasser-ai/skills --skill seo-audit     # one skill
npx skills add glasser-ai/skills --list                # see what is available
```

**As a Claude Code plugin:**

```
/plugin marketplace add glasser-ai/skills
/plugin install glasser-skills
```

**By hand:**

```bash
git clone https://github.com/glasser-ai/skills.git
cp -r skills/skills/* .agents/skills/
```

Each skill is one directory with one `SKILL.md` and stands on its own; copy only the ones you want.

## Skills

<!-- SKILLS:START -->
### Research

| Skill | What it does |
|---|---|
| [competitor-research](skills/competitor-research/) | When the user wants to research competitors or a rival product in depth — who is behind them, how they are funded, what they sell, how they get traffic, what they are hiring for, and where they are spending. |
| [investor-diligence](skills/investor-diligence/) | When an investor wants to research a company before putting money in — who runs it, how it is funded, whether the traction is real, what the risks are, and what has changed recently. |

### Go-to-market

| Skill | What it does |
|---|---|
| [prospect-list](skills/prospect-list/) | When the user wants a list of companies to sell to and the people to contact at them — from an ICP, a set of filters, a known source such as an investor portfolio or a directory, or a list of company names. |

### SEO

| Skill | What it does |
|---|---|
| [seo-audit](skills/seo-audit/) | When the user wants to know how their own website is doing in search and what to do about it — an audit of technical health, rankings, keywords, backlinks and competitors, followed by a prioritised action plan; or a repeat of that audit to see what has changed. |
<!-- SKILLS:END -->

## How the pieces fit

Three things have to be true for an agent to do paid research well, and they live in three places on purpose.

- **The mechanism** lives at [glasser.ai/SKILL.md](https://glasser.ai/SKILL.md): how to search the catalog, inspect an endpoint, run it, and the rules that keep a balance safe.
- **The recipe** lives here: for a given task, which capabilities to search for, what to confirm before spending, how to assemble and report the result.
- **The business context** lives with the user's own agent: their product, their customers, their exclusions. Skills declare what they need; they do not go and ask for it.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The short version: a skill is a repeated task, not a wrapper around one endpoint; it names capabilities, not vendors; it stops at the result and does not send, post, or buy anything.

## License

MIT, see [LICENSE](LICENSE).
