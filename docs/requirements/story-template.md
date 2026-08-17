# Story template

Copy this into GitHub Issues when opening work. The headings exist because each one is a
place work goes wrong when it is left implicit.

---

## Title

A single outcome, in the user's language. If the title needs "and", it is two stories.

## Story

> As a **<role>**, I want **<capability>**, so that **<outcome>**.

The "so that" clause is the one that earns its place. It is what lets a reviewer — or an agent —
tell the difference between a change that satisfies the letter of the request and one that
achieves what was actually wanted.

## Acceptance criteria

Each criterion must be something that can pass or fail. Specific values, not shapes.

- [ ] Given <state>, when <action>, then <specific observable result>.
- [ ] Given <boundary value>, when <action>, then <specific result>.
- [ ] Given <the value one past the boundary>, when <action>, then <the different result>.
- [ ] Given <the error condition>, when <action>, then <the specific failure behaviour>.

## Explicitly out of scope

The list that prevents scope creep, and the one that matters most when an agent implements the
story. Without it, "improve the checkout flow" quietly becomes a refactor of the payment module.

- <thing a reasonable reader might assume is included, and is not>

## Invariants this must not break

Name them. See [../adr/0002-project-invariants.md](../adr/0002-project-invariants.md).

## Traceability

- Decision: <ADR number, if this implements one>
- Depends on: <issue>

---

### INVEST, as a quick check before you open it

- **Independent** — can ship without waiting on another story.
- **Negotiable** — describes the outcome, not the implementation.
- **Valuable** — someone outside the team can say why they want it.
- **Estimable** — the team can size it; if not, the unknown is the real first story.
- **Small** — fits comfortably in a sprint, and produces a diff a person will actually read.
- **Testable** — every criterion above can fail.

The two that break most often are Small and Testable, and they are the two that matter most when
the implementation is AI-assisted. A large story produces a large diff, and a large diff gets
reviewed less carefully per line at exactly the moment care is most needed.
