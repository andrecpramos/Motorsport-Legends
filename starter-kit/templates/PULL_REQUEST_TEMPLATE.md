<!--
  Keep this short. A template long enough to be annoying gets filled in with "n/a", at which point
  it costs everyone time and tells the reviewer nothing.
-->

## What and why

<!-- One paragraph. What changes, and what problem that solves. -->

{{#if answers.traceabilityRule}}
## Traceability

Implements: <!-- issue number, or ADR number. A change traceable to nothing gets closed. -->
{{/if}}

## How this was verified

- [ ] `{{project.testCommand}}` passes locally
{{#if project.lintCommand}}
- [ ] `{{project.lintCommand}}` is clean
{{/if}}
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

{{#if answers.humanReviewAlways}}
Reviewer must be someone other than the person who prompted the change.
{{/if}}

## Risk

<!-- Anything that makes this harder to roll back than a normal change: schema migrations, data
     backfills, config that must land in a particular order, feature flags. Say it here rather
     than discovering it at 2am. -->
