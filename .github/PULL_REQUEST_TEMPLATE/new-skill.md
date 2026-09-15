## New skill: `skills/<name>`

### The task

One or two sentences: what the user asks for and what they get back.

### Checklist

- [ ] `node .github/scripts/validate.mjs` passes locally
- [ ] `node .github/scripts/sync.mjs` was run; README table and marketplace count include this skill
- [ ] The skill is a repeated task, not a wrapper around one endpoint
- [ ] It stops at a result; nothing is sent, posted, published, or bought
- [ ] No provider names in the name or the process steps
- [ ] Nothing in it restates the Glasser mechanism; it links https://glasser.ai/SKILL.md instead
- [ ] It declares inputs; it does not script the conversation that obtains them
- [ ] Tested with an agent end to end on a real query
