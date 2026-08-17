---
name: write-adr
description: Draft an architecture decision record for Motorsport Legends in this repository's format, including the alternatives rejected and what the decision forbids. Use when a choice would be expensive to reverse, or when a change contradicts an existing decision.
---

# Writing a decision record

Decision records exist because six months from now the only thing that survives a decision is its
outcome, and nobody can tell whether it was reasoned or accidental. They are also the highest-value
context this repository can give an assistant: a rejected alternative written down once stops the
same wrong suggestion arriving every week, forever.

## When this applies

Write an ADR when the decision is **expensive to reverse**. That is the whole test — not how much
code it touches, not how long the discussion was.

Typical triggers: a new dependency that will spread, a data model or storage format, a boundary
between components, an auth or session approach, a public API shape, a build or deployment change.

Do **not** write one for a choice that a later change could simply undo. An ADR log padded with
reversible decisions is one people stop reading, and then the load-bearing ones get missed too.

## Before drafting

1. Read [`docs/adr/README.md`](../../../docs/adr/README.md) for the log's conventions.
2. Read the existing records. If this decision **contradicts** one, that is the most important thing
   to say — the new record supersedes the old one and must name it. Never silently reverse a
   decision; a log with an invisible contradiction in it is worse than no log.
3. Read [`docs/adr/0002-project-invariants.md`](../../../docs/adr/0002-project-invariants.md). A
   decision that breaks an invariant needs that stated explicitly and deliberately, not glossed.
4. Number the new file as the next in sequence: `docs/adr/NNNN-short-kebab-title.md`.

## Drafting

Copy [`docs/adr/0000-template.md`](../../../docs/adr/0000-template.md) and fill it in. Four things
carry the weight:

**Context.** The forces in play, written so someone who was not in the room understands why this was
even a question. Present tense, no solution in it.

**Decision.** One sentence, active voice: "We will…". If it takes a paragraph, it is more than one
decision — split it.

**Alternatives considered, and why each was rejected.** This is the section that pays for the whole
document, and the one most often left thin. For each: what it was, and the specific reason it lost.
"Simpler" is not a reason. "Would require a second write path for the migration window" is.

**Consequences — including what this now forbids.** Write the negative space explicitly. "This means
we do not do X" is what makes the record usable as agent context later, because it converts a
decision into a rule something can be checked against.

## After drafting

- Open the ADR as its own pull request when the decision is still open. Reviewing a decision is a
  different conversation from reviewing an implementation, and merging them means neither gets done
  properly.
- If the decision produces a new invariant, add it to `docs/adr/0002-project-invariants.md` and to
  [`AGENTS.md`](../../../AGENTS.md) — that is where an assistant will actually read it.
- Status starts as `Proposed`. Only a human moves it to `Accepted`.

## What not to do

Do not invent context you were not given. If the reason for the decision is not in the conversation,
the honest draft has `TODO(setup):` where the reasoning goes — an ADR with plausible-sounding
invented rationale is actively harmful, because it will be trusted.

Do not mark a record `Accepted` yourself, and do not delete or edit a superseded record. Supersede
it by writing a new one that names it.
