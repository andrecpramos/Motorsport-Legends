# Documentation map — Motorsport Legends

Documentation fails most often because one document is trying to be four things at once. A tutorial
that pauses to explain design rationale loses the beginner; a reference page written as a narrative
is useless to the person who already knows what they want and needs one exact answer.

Diátaxis separates them by what the reader is doing at the moment they arrive.

| | **Practical** | **Theoretical** |
|---|---|---|
| **Learning** | **Tutorial** — take a beginner through a first success. Never explain more than needed to keep going. | **Explanation** — why it is built this way. Read at leisure, out of curiosity. |
| **Working** | **How-to** — solve one specific problem for someone who already knows the basics. | **Reference** — exact, complete, dry. Consulted, never read through. |

The most useful thing to internalise: **the four quadrants have different failure modes and
different tests for quality.** A good reference page is boring, and a tutorial that is boring has
failed.

---

## Where each kind lives here

| Kind | Location | Status |
|---|---|---|
| Tutorial | TODO(setup) | |
| How-to | TODO(setup) | |
| Reference | TODO(setup) | |
| Explanation | [../adr/](../adr/) — the decision log is explanation documentation | Exists |

The ADR log doing double duty is not a compromise. Decision records are the purest explanation
documents most projects have: they answer "why is it like this" with the alternatives attached.

## Documentation is agent context now

This is the part that is genuinely new, and it changes the cost-benefit of keeping docs current.

Your documentation is read by the assistants working in this repository, and it shapes every change
they make. Stale documentation does not just mislead people who will eventually work it out — it
silently degrades every AI-assisted change made against this codebase, and it does so invisibly.

Two practical consequences:

1. **The instruction files are documentation with the highest leverage in the repository.**
   `AGENTS.md` is read on every single agent run. It deserves more care per line than anything else
   here.
2. **Structure helps machines the same way it helps people.** Clear headings, explicit file paths,
   stated invariants and worked examples with real numbers all improve retrieval. Prose that gestures
   at concepts without naming them is as unhelpful to a model as it is to a new hire.

## Drift detection

`node tools/doc-drift.mjs` checks the mechanically checkable part: internal links that resolve, and
placeholders left unfilled.

The insight that makes this worth automating is that **most drift is mechanically detectable**. A
link to a moved file, a `TODO(setup)` nobody came back to, a reference to a function that was
deleted — none of that needs a language model, it needs a script in CI.

Reserve AI for the part that genuinely requires reading: *does this paragraph still describe what
this function does?* Running the cheap check first means the expensive one has less to look at.

## The rule that keeps this alive

Documentation changes ship in the same pull request as the change they describe. A follow-up ticket
to update the docs is a ticket that will not be done, and everybody involved knows it at the moment
it is filed.
