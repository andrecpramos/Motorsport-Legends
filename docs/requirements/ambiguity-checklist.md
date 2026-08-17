# Ambiguity audit — how to attack a requirement before building it

*For Motorsport Legends. Requirements arrive via **GitHub Issues**.*

A language model will not tell you that your requirements contradict each other. It will resolve
the contradiction silently, pick a reading, and implement it with complete confidence. That makes
ambiguity more expensive than it used to be, because it now gets built before anyone notices.

So the highest-value use of AI in this phase is not writing requirements. It is **attacking** them.

---

## The prompt

Paste this with the requirement text. It is written to produce a list you can act on rather than a
paragraph of reassurance.

```text
You are a requirements analyst reviewing a brief before any code is written. Be adversarial.

For the document below, produce four separate lists:

1. AMBIGUITIES — statements with more than one reasonable reading. For each, give the readings
   and say which you would assume, so the assumption is visible rather than silent.
2. CONTRADICTIONS — places where two statements cannot both be true. Quote both.
3. GAPS — behaviour a working implementation must define that the document does not mention.
   Cover at minimum: empty and zero cases, boundary values, concurrent access, partial failure,
   time zones and clock skew, and what happens on retry.
4. UNTESTABLE CRITERIA — every acceptance criterion that could not be turned into a passing or
   failing test as written. Rewrite each one so it could be.

Do not propose a design. Do not fill in what you think was meant. Where the document is silent,
say it is silent.

---
<paste the requirement here>
```

## The checklist, for when you are reading it yourself

- [ ] **Numbers.** Every quantity has a unit and a rounding rule. Is 150 units priced at each
      tier's own rate, or all at the tier the total lands in? These give different answers and
      documents routinely contain both.
- [ ] **Boundaries.** For every threshold, which side does the boundary value fall on? "Up to
      10,000" — is the 10,000th included?
- [ ] **Intervals.** Start-inclusive and end-exclusive, or both inclusive? Pick one and use it
      everywhere. Mixed conventions produce off-by-ones that no example in the spec will reveal.
- [ ] **Time.** Which time zone, whose clock, and what happens across a daylight-saving boundary.
- [ ] **Empty and zero.** What does the system do with none of the thing? Zero is not an error
      unless the document says so.
- [ ] **Failure.** What happens when the downstream call fails halfway through? Is the operation
      safe to retry, and if so what makes it safe?
- [ ] **Identity.** What makes two of these the same thing? This is the question that decides
      whether idempotency is even expressible.
- [ ] **Words that hide decisions.** "Appropriate", "efficient", "as needed", "handle gracefully",
      "large", "quickly". Each of these is an unmade decision wearing a disguise.

## The rule that makes this pay off

**An acceptance criterion that cannot fail is not a criterion.** "Handles large volumes correctly"
cannot fail. "150,000 units is charged €630.00" can, and it becomes a test in
[../testing/test-strategy.md](../testing/test-strategy.md) without a translation step.

Write criteria you could hand to someone who has never seen the system, and have them tell you
whether it passed.

## What to do with the findings

Ambiguities and contradictions go back to whoever wrote the brief — resolved, not guessed. Gaps
become either new criteria or an explicit "out of scope for now" line in the issue. Untestable
criteria get rewritten before the issue is picked up.

The one thing not to do is answer them yourself and start building. That converts someone else's
ambiguity into your assumption, and assumptions do not survive contact with the person who
originally wanted the feature.
