# CLAUDE.md

**Read [AGENTS.md](AGENTS.md) — it is the canonical instruction file for this repository and applies
in full.**

Keeping one source of truth is the point. Several drifting instruction files are worse than one,
because you lose the ability to predict which rule an agent actually saw. Add to `AGENTS.md`; add
here only what is specific to working interactively rather than as a background agent.

## Working here interactively

- The decision log lives in [docs/adr/](docs/adr/). If a change contradicts a decision there, that
  is a new ADR, not a code change — say so and stop.
- Run `{{project.testCommand}}` before claiming anything works. Reporting a change as done without
  running the suite is the failure mode that costs the most trust.
{{#if answers.installDocDrift}}
- `node tools/doc-drift.mjs` finds broken internal links and unfilled `TODO(setup)` placeholders.
  Run it after moving or renaming any documentation file.
{{/if}}
{{#if answers.installRiskCheck}}
- `node tools/release-risk.mjs` scores the current diff. Worth running before proposing a large
  change — if it comes back HIGH, the right response is usually to split the change, not to argue
  with the score.
{{/if}}

## What to ask about rather than assume

- Anything touching {{answers.firstInvariant}}.
- Adding a dependency. See the policy in [AGENTS.md](AGENTS.md).
- Changing a file listed as a hot path in `.sdlc-kit.json`. Those are the ones where being wrong is
  expensive, and they are named there precisely so an assistant can recognise them.
