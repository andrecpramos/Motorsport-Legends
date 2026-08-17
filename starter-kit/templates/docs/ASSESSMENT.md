# Readiness assessment — {{project.name}}

*Generated {{meta.date}} by the AI-SDLC starter kit, before any questions were asked.*

## Verdict: {{assessment.readiness}}

{{assessment.verdict}}

---

## Why this is the question

The finding worth internalising about AI in the software lifecycle is that adoption correlates with
higher throughput and better code quality, **and simultaneously with higher delivery instability**.
Those are not in tension by accident — they share a mechanism, and the mechanism is volume. Code
gets generated faster than review, testing and deployment can absorb it. The work is not removed,
it is relocated downstream.

Which makes AI an amplifier rather than a fix. In a project with good tests and a real pipeline it
improves speed and stability together, because the absorptive capacity is already there. In a
project without them it magnifies the friction that was already present. **The same tooling
produces opposite outcomes, and the variable is the project, not the tooling.**

So the useful question is not "is AI tooling configured here". It is: *can this project absorb more
code than it is currently producing?* Everything below is organised around that.

## What is here

| | |
|---|---|
| Files scanned | {{assessment.facts.files}} |
| Source files | {{assessment.facts.sourceFiles}} |
| Test files | {{assessment.facts.testFiles}} (ratio {{assessment.facts.testRatio}}) |
| Pipeline files | {{assessment.facts.workflows}} |
| Commits | {{assessment.facts.commits}} from {{assessment.facts.contributors}} contributor(s) |

Most common file types:
{{#each assessment.facts.topExtensions}}
- `{{extension}}` — {{count}}
{{/each}}

## The checks

{{assessment.counts.summary}}

{{#each assessment.checks}}
### {{statusMark}} {{title}}

*{{dimension}}{{severityNote}}*

{{finding}}

**What happens about it:** {{action}}

{{/each}}

## Reading this honestly

Every check above is a heuristic run against the file tree. It can see that test files exist; it
cannot see whether those tests assert anything meaningful, and a suite of assertion-free tests
passes this assessment while protecting nothing. See
[testing/test-strategy.md](testing/test-strategy.md) for why that distinction matters more than the
count.

It also cannot see the things that are not in the repository: whether branch protection is on,
whether anyone reads the pipeline output, whether the rollback path has ever been exercised. Those
are usually where the real gaps are, and the wizard asks about them directly because no amount of
scanning would find them.

Treat this as the starting point of a conversation with your team, not as a score.

## What to do with the gaps

In this order, because the order is what makes the difference:

1. **Critical gaps first, before broad AI enablement.** A project with no tests and no pipeline
   does not need a better instruction file first. It needs somewhere for the extra output to land.
2. **Then agent context** — `AGENTS.md` and the decision log. Highest ratio of impact to effort
   once the foundations hold.
3. **Then everything else**, at whatever pace the team can sustain.

Re-run `node starter-kit/setup.mjs --dry-run` after closing a gap to see this assessment change.
