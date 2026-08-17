# Test strategy — {{project.name}}

The suite runs with `{{project.testCommand}}`.

---

## The coverage trap, which is the thing to understand first

A model asked to raise coverage will write tests that execute code without asserting anything
meaningful about it. Coverage goes up, the dashboard goes green, and the suite catches nothing.

That is **worse than having no tests**, and the reason is not subtle: the number is now lying to
you. A team with 40% coverage knows it has a testing problem. A team with 95% coverage made of
assertion-free tests believes it is protected, and finds out otherwise in production.

Concretely, the shape to reject in review:

```
test('calculates the total', () => {
  const result = calculateTotal(order);
  expect(result).toBeDefined();        // passes for every bug
  expect(typeof result).toBe('number'); // passes for every wrong number
});
```

Versus the version that pins behaviour:

```
test('graduated tiers price each band at its own rate', () => {
  expect(calculateTotal(150_000)).toBe(63_000);  // one specific number, from the requirement
});
```

The first one raises coverage. Only the second one can fail.

{{#unless answers.coverageGate}}
## Why coverage is not a merge gate here

Gate on a percentage and you will get tests written to move the percentage — which is exactly the
first example above. Coverage is reported so the trend is visible, and it is never enforced.

Falling coverage is worth a conversation. It is not worth a blocked merge, because the cheapest way
to unblock a merge is to write a bad test.
{{/unless}}
{{#if answers.coverageGate}}
## The coverage gate

This project gates on coverage. Be aware of what that incentivises — the assertion-free test above
satisfies a coverage gate perfectly — and compensate in review by checking that new tests assert
specific values. The gate measures what ran, not what is pinned down.
{{/if}}

## Mutation testing: how you tell the difference

Coverage tells you which lines ran. It cannot tell you whether anything would have noticed if those
lines were wrong. Mutation testing answers that directly.

The method: deliberately break the source — flip a comparison, change a constant, remove a guard,
negate a condition — then run the suite. If a test fails, the mutant is **killed** and that
behaviour is genuinely pinned. If every test still passes, the mutant **survived**, and you have
found a missing assertion with a line number attached.

A surviving mutant is the most actionable test-quality signal available, because it does not say
"your tests are weak", it says "nothing in your suite noticed when line 47 changed".

Run it as a diagnostic on pull requests that touch important logic. **Do not threshold it.** A
mutation score used as a gate produces tests written to satisfy the mutation harness, which is the
coverage failure one level up.

TODO(setup): name the mutation tool for {{project.stackLabel}} and wire it in — the shape that
matters is a script that mutates, runs `{{project.testCommand}}`, and reports survivors with file
and line.

## What to test, in priority order

1. **The invariants** in [../adr/0002-project-invariants.md](../adr/0002-project-invariants.md).
   Each one should name the test that pins it. An invariant with no test is an aspiration.
2. **Boundaries, on both sides.** If behaviour changes at 10,000, test 10,000 and 10,001. A single
   test in the middle of a range proves almost nothing.
3. **Error paths.** Most incidents live here and most suites ignore them.
4. **The specific values in the acceptance criteria.** These transfer directly out of the story
   with no translation, which is the payoff for having written testable criteria in the first place.

## Rules for tests in this repository

{{#if answers.assertionRule}}
- Assert specific expected values. Never `not null`, never `> 0`, never `typeof`.
{{/if}}
- One behaviour per test. A test that asserts six things fails ambiguously.
- Test names describe the behaviour, not the function: "rejects a negative quantity", not
  "test calculateTotal 3".
- No logic in tests. A loop or a conditional in a test is a second implementation that can also be
  wrong, and nothing tests it.
- Fixtures are synthetic. Never real or realistic user data, even scrubbed.

## Using AI on tests, well

Where it genuinely helps:

- **Generating boundary cases.** Ask for every edge case for a function and you will get a longer
  list than you would have written, including several worth having.
- **Turning acceptance criteria into test skeletons.** Mechanical work, done reliably.
- **Explaining a surviving mutant.** "This mutant survived — what assertion is missing?" is a
  question models answer well, because the answer is local.

Where it does not:

- Asking for "more tests" or "better coverage" without a specific target. That instruction produces
  the assertion-free shape above, every time. The instruction has to name the behaviour to pin.
