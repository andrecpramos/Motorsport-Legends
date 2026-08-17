<!--
  Keep this short. A template long enough to be annoying gets filled in with "n/a", at which point
  it costs everyone time and tells the reviewer nothing.
-->

## What and why

<!-- One paragraph. What changes, and what problem that solves. -->

## Traceability

Implements: <!-- issue number, or ADR number. A change traceable to nothing gets closed. -->

## How this was verified

- [ ] `TODO(setup): no test runner is configured yet` passes locally
- [ ] `cd app && npm run lint --if-present` is clean
- [ ] New behaviour has a test that fails without this change

<!-- If any invariant in docs/adr/0002-project-invariants.md is near this change, say which and how
     you know it still holds. -->

## AI assistance

- [ ] Parts of this change were AI-generated

<!--
  This box is not a confession, and nothing about it is discouraged. It exists for two reasons:
  the reviewer knows to look for the specific failure modes in docs/review/review-checklist.md,
  and the team can attribute stability metrics later. See docs/governance/measurement-plan.md.
-->


## Risk

<!-- Anything that makes this harder to roll back than a normal change: schema migrations, data
     backfills, config that must land in a particular order, feature flags. Say it here rather
     than discovering it at 2am. -->
