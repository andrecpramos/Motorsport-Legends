# Code review — Motorsport Legends

Review is where the volume problem lands. If authoring gets faster and review does not, the queue
forms here, and the way teams relieve the pressure is by reviewing less carefully — which is
invisible until something ships.

Human review rule for AI-authored changes: **risk-based — hot paths always reviewed, low-risk changes may auto-merge**.

---

## Split the work by what each reviewer is good at

The mistake is treating AI review and human review as the same activity done by different agents.
They are good at different layers, and the value comes from not spending human attention on the
layer a machine covers reliably.

### What AI review is genuinely good at

Run it first, on every change, and treat it as a filter rather than a verdict.

- Missing null and error handling on paths that clearly have them elsewhere.
- Resources opened and not closed.
- Inconsistency with a convention that is written down in `AGENTS.md`.
- Obvious injection and unsafe-deserialisation shapes.
- Tests that assert nothing — see below, this is the highest-value automated check in this list.
- Copy-paste divergence: two nearly identical blocks where only one was updated.

### What only a human can do here

- **Should this change exist at all?** No model will tell you the requirement was misunderstood.
- Does it fit the architecture, and does it contradict a decision in [../adr/](../adr/)?
- Is the abstraction right, or is it an abstraction over two things that only look similar today?
- Is the failure mode acceptable in production, for real users, at real volume?
- Is this the *simplest* change that satisfies the requirement, or is it the first one that worked?

## The checklist

### Scope and traceability

- [ ] The diff contains only what the description says it contains. Unrelated reformatting hides
      real changes and is the most common reason an AI-authored pull request becomes unreviewable.
- [ ] The description names the issue or decision it implements.
- [ ] The change is small enough to actually read. If it is not, the correct review outcome is
      "split this", not a fast approval.

### Correctness

- [ ] Boundary values are handled, and there is a test on **both** sides of each boundary.
- [ ] Error paths are handled, not just the happy path.
- [ ] No invariant from [../adr/0002-project-invariants.md](../adr/0002-project-invariants.md) is
      violated.
- [ ] Anything removed was removed deliberately. Deleted guards leave no trace in the diff for
      review to reason about, which makes deletions the easiest defect to miss.

### Tests

- [ ] New behaviour has a test that would fail without the change. Check this by asking: if I
      reverted the source change and kept the test, would it go red?
- [ ] Tests assert specific expected values, not `not null` or `> 0`.
- [ ] The test names describe behaviour, not the function they call.

### Security

- [ ] No secret, key or credential in the diff, including in test fixtures and example config.
- [ ] Untrusted input is validated at the boundary it enters.
- [ ] No new dependency, or one that was explicitly approved. See `AGENTS.md`.

### The AI-specific ones

- [ ] **Does every part of this do something?** Generated code accumulates plausible scaffolding —
      a defensive branch that cannot be reached, an option nobody passes, an abstraction with one
      implementation. It is correct, and it is permanent maintenance cost.
- [ ] **Do the comments match the code?** Generated comments describe intent, and survive edits to
      the code they describe.
- [ ] **Is the error handling real, or is it a `catch` that swallows?**
- [ ] **Are the identifiers the ones this codebase uses**, or the ones the model uses by default?

## Tuning the automated reviewer

The trap is a reviewer with a high false-positive rate. It gets ignored, then muted, then disabled
— and at that point its true positives are worth nothing either. This is the single most common way
an AI review integration fails, and it fails quietly.

So: **tune for precision over recall.** A reviewer that reports three real problems and nothing
else is worth more than one that reports thirty findings of which six are real. If a rule produces
noise, delete the rule; do not ask people to filter it themselves.

## Reviewing a change you prompted

Get someone else to. The person who wrote the prompt has already accepted the model's framing of
the problem, and they will read the diff looking for whether it matches what they asked for rather
than whether what they asked for was right.

### Working alone

There is no second person here, so that substitution has to come from somewhere else. What actually
works, in rough order of effectiveness:

1. **Mechanism over intention.** The automated checks are not a convenience when you work alone,
   they are the review. Anything you would have relied on a colleague to notice needs to become a
   test, a lint rule, or a line in `AGENTS.md`.
2. **Separate the prompting from the reviewing in time.** Do not merge generated code in the same
   sitting you prompted it. An hour is enough to stop reading it as "what I asked for" and start
   reading it as "what is here".
3. **Review the diff, never the conversation.** Reading back through the exchange re-accepts every
   framing you already accepted. Open the diff cold, as though someone else opened the pull
   request.
4. **Use the agents as the second opinion**, knowing what they are weak at. `code-reviewer` will
   not tell you the requirement was misunderstood. That check remains entirely yours, which means
   `requirements-auditor` before you build is worth more to you than to a team.
