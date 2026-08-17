# ADR-0001: Record architecture decisions

- **Status:** Accepted
- **Date:** {{meta.date}}
- **Deciders:** TODO(setup)

## Context

{{project.name}} is a **{{project.architectureLabel}}** built in {{project.stackLabel}}. Decisions
that are expensive to reverse are being made now, at the point where the alternatives and the
reasoning are still fresh and therefore cheap to write down. In a few months only the outcome will
remain, and a reader will not be able to tell a reasoned choice from an accident.

Two forces make this more valuable here than it would have been a few years ago.

The first is AI assistance. Assistants generate plausible code quickly, and plausible is exactly
the failure mode a decision log defends against — a change that looks right in isolation and
violates a constraint the codebase depends on. An assistant that can read the reasoning stops
re-proposing the rejected alternative.

The second is onboarding. The same document that orients a new engineer orients an agent, and it
is the only artifact in the repository where that is true without adaptation.

## Decision

> We will record architecturally significant decisions as numbered Markdown files in `docs/adr/`,
> using the template in [0000-template.md](0000-template.md). A decision is significant if
> reversing it would require changing many files, migrating data, or renegotiating an interface
> with another team.
>
> Accepted ADRs are binding. Code that contradicts one is a defect, and changing course requires a
> new ADR that supersedes the old one rather than an edit to it.

## Consequences

### What this makes easy

- Reviewers can reject a change by pointing at a decision instead of arguing from taste, which
  takes the heat out of the disagreement.
- Agents get load-bearing context in a form they already read well.
- The reasoning behind constraints survives the people who made them.

### What this makes hard

- There is friction in the moment a decision is made, and the log rots if that friction is not
  accepted. A stale ADR log is worse than none, because it is trusted and wrong.

### What this forbids

- Silently changing an accepted decision in an implementation pull request.
- Deleting superseded ADRs.

## Alternatives considered

### Keep architecture documentation in a wiki

Rejected because it drifts from the code with nothing to detect the drift. ADRs live next to the
code, are reviewed with the code, and appear in the diff when someone changes the thing they
describe.

### Document only the current state, not the decisions

Rejected because it loses the alternatives. The most common expensive mistake in a codebase is
re-litigating a decision without knowing it was already made and why, and a current-state document
cannot prevent that.

## How this is enforced

- `AGENTS.md` points here and says the log is binding.
- The pull request template asks which decision a change implements.
{{#if answers.installDocDrift}}
- `tools/doc-drift.mjs` fails the build on links into `docs/adr/` that no longer resolve, so
  renaming an ADR cannot silently orphan the references to it.
{{/if}}
