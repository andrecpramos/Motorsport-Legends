# ADR-0002: The invariants of {{project.name}}

- **Status:** Accepted
- **Date:** {{meta.date}}
- **Deciders:** TODO(setup)

## Context

{{project.description}}

Some properties of this system are always true, and a plausible-looking change can break them
without breaking anything visible. Those are the properties that need writing down — not because
the team does not know them, but because the team is no longer the only thing writing code here.

An invariant that lives only in someone's head is enforced only when that person reviews the pull
request. An invariant written here can be referenced in review, pinned by a test, and read by every
assistant that touches the repository.

## Decision

> The following properties of {{project.name}} hold everywhere and always. A change that violates
> one is a defect regardless of whether any test failed, and relaxing one requires a new ADR that
> supersedes this record.

{{#each answers.invariants}}
### {{.}}

**Why it holds:** TODO(setup) — the reason this is true, in one or two sentences.

**What breaks it:** TODO(setup) — the plausible-looking change that would violate it. This is the
sentence that does the work; name the tempting mistake specifically enough that a reader recognises
it in a diff.

**Pinned by:** TODO(setup) — the test that fails if this is violated. If there is no such test, say
so plainly, and treat writing one as the next task rather than a nice-to-have.

{{/each}}

## Consequences

### What this makes easy

- Review has something concrete to point at. "This violates invariant two" ends a discussion that
  "I don't like this" would not.
- Assistants working in this repository read these through `AGENTS.md` and stop proposing changes
  that contradict them.

### What this makes hard

- Every invariant is a constraint on future design, including designs nobody has thought of yet.
  That is the intended cost — but it is a real one, which is why the list should be short and
  every entry should be load-bearing.

### What this forbids

Any change that violates an invariant above, including changes that are otherwise improvements.
An invariant that yields to a sufficiently nice refactor was never an invariant.

## How this is enforced

- Restated in `AGENTS.md`, which every agent working here reads.
- Each invariant names the test that pins it. **An invariant with no test is an aspiration**, and
  the honest thing to do is write that down rather than assume review will catch it.
