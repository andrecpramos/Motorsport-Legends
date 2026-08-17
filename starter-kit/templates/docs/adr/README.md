# Architecture decision records

A decision belongs here when it is **expensive to reverse**. Not every design choice — the ones
where changing your mind later means changing many files, migrating data, or renegotiating with
another team.

## Why this log exists

The old reason still holds: six months after a decision, all that survives is the outcome, and
nobody can tell whether it was reasoned or accidental. An ADR preserves the alternatives and the
reasoning while they are still in someone's head, which is the only time they are cheap to record.

There is a newer reason, and for a repository with AI assistants working in it, it may be the
larger one. **An ADR log is the highest-value context you can give a coding agent.** A decision
record saying "amounts are integer cents, floating point was considered and rejected because of
accumulation error" stops an assistant proposing floating-point money every week — and it will,
confidently, forever, unless something in the repository tells it not to.

That is why [0002-project-invariants.md](0002-project-invariants.md) is referenced directly from
`AGENTS.md`. The decisions here are not documentation of the system; they are inputs to it.

## How to add one

1. Copy [0000-template.md](0000-template.md) to `NNNN-short-title.md`, taking the next number.
2. Fill in the context before the decision. If the context section is thin, the decision is
   probably not ready.
3. Open it as a pull request on its own, so the decision gets reviewed as a decision rather than
   sliding through inside an implementation.

## Status values

- **Proposed** — under discussion, not yet binding.
- **Accepted** — binding. Code that contradicts it is a bug, not a style disagreement.
- **Superseded by NNNN** — kept, never deleted. The history is the point; a superseded ADR explains
  why the current one exists.

Never delete an ADR. An empty log looks like a project with no hard decisions, which is a project
nobody has looked at closely.

## The log

| # | Decision | Status |
|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](0002-project-invariants.md) | The invariants of {{project.name}} | Accepted |
