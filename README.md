# Glasser skills

One key, no contract, pay per call, across paid APIs bought wholesale.

Business skills for agents working on top of [Glasser](https://glasser.ai): each
one is a task an agent is actually asked to do — enrich a lead list, research a
competitor, audit a site's backlinks — written as a recipe over the Glasser
catalog rather than over one vendor's API.

Markdown only. A skill here ships no executable code and no install script; it
tells an agent which endpoints to search for, what to inspect before spending,
and how to report what a run cost.

> **Nothing here yet.** The first skills land as they are written. To use
> Glasser today, install the plugin — it carries the `glasser` skill and the MCP
> server: [glasser-ai/plugins](https://github.com/glasser-ai/plugins).

## Why a separate repository

[`glasser-ai/plugins`](https://github.com/glasser-ai/plugins) is the
distribution package: one skill that teaches an agent the Glasser surface —
search, inspect, run, and the rules that keep a balance safe. It is versioned
and reviewed as one unit by every marketplace it ships to.

The skills here sit a layer above that. They are per-task, they arrive and
change on their own schedule, and a reader picks the one that matches the job
in front of them. Folding them into the plugin would make every marketplace
re-review the package each time one recipe changes.

## Using a skill

Each skill is a directory with a `SKILL.md`. Point your agent at the one you
want, or copy it into the skills directory your client reads.

Prerequisites are the same for all of them: an agent with the Glasser MCP tools
or the CLI, and a workspace with a balance. See
[glasser.ai/docs](https://glasser.ai/docs).

## Contributing

A skill earns its place by being a task someone repeats, not a wrapper around a
single endpoint — `inspect` already documents endpoints better than prose can.
Keep the money rules the Glasser skill states: inspect the price before running,
no speculative or bulk runs without the user's go-ahead, report the charge after.

## License

MIT — see [LICENSE](LICENSE).
