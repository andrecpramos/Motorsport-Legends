# Copilot instructions — {{project.name}}

> **The canonical instructions are in [AGENTS.md](../AGENTS.md).** Copilot code review reads
> `AGENTS.md` from the repository root automatically, and so do most other agents. This file exists
> for the inline-completion path, which benefits from a shorter, denser prompt than a full
> contributing guide. It restates only the rules that matter at the keystroke.

## Fast rules for completions

{{#each answers.invariants}}
- {{.}}
{{/each}}
- Match the surrounding code — its naming, its error handling, its comment density.
{{#if answers.dependencyPolicyNever}}
- No new dependencies. Standard library first.
{{/if}}

## When completing a test

Assert a specific expected value, not a shape. `assert.equal(total, 63000)`, never
`assert.ok(total > 0)`. Boundary tests come in pairs: the value at the boundary and the value one
past it.

## When completing a comment

Explain why, not what. If the comment would restate the code below it, write nothing.

## When completing anything that touches money, time, identity or permissions

Stop and be conservative. These are the places where a plausible-looking completion is most likely
to be subtly wrong, and where being subtly wrong is most expensive.
