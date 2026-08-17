# Agent permissions — {{project.name}}

The line is **side effects, not intelligence**. An agent may read, reason and propose freely. It
needs an accountable human before anything with a consequence that outlives the session.

Current configuration: **{{answers.agentPrivilegesLabel}}**.

---

## The matrix

| Action | Unattended | Needs approval | Never |
|---|---|---|---|
| Read source, tests, documentation | ✅ | | |
| Run the test suite | ✅ | | |
| Run linters and formatters | ✅ | | |
| Write files inside the working tree | ✅ | | |
| Create a branch | ✅ | | |
| Open a pull request | {{answers.cellOpenPr}} |
| Merge a pull request | | ✅ | |
| Install or add a dependency | {{answers.cellAddDependency}} |
| Run an arbitrary shell command | | ✅ | |
| Make an outbound network call to a new host | | ✅ | |
| Push to the default branch | | | ✅ |
| Deploy | | ✅ | |
| Read {{answers.secretPathList}} | | | ✅ |
| Modify `AGENTS.md`, `CLAUDE.md` or CI workflows | | ✅ | |
| Rewrite git history | | | ✅ |

The last two rows are the ones people get wrong. An agent that can edit its own instruction file
can widen its own permissions, and an agent that can edit the pipeline can disable the check that
would have caught it. Both are privilege escalation even though neither looks like it.

## Least privilege in the pipeline

Default the CI token to read-only and widen it per job, never globally:

```yaml
permissions:
  contents: read
```

An agent that runs in CI inherits whatever the token can do. A broad default token is not a
convenience, it is the blast radius in the [threat model](threat-model.md), pre-authorised.

{{#if answers.agentPrivilegesCi}}
## Because agents here have CI access

This configuration deserves specific controls, because the usual assumption — that CI is the thing
that catches a bad change — stops holding when the agent can change CI.

- Workflow files require review from someone who is not the agent's operator.
- Secrets are scoped per environment, never available to pull request builds from forks.
- The agent's token cannot approve or merge its own pull request.
- Instruction-file changes are surfaced in CI as a security review item, not a docs change.
- TODO(setup): confirm each of the above is actually configured, rather than intended.
{{/if}}

## Approval is not a formality

An approval that is always granted is a log entry, not a control. If every agent action gets waved
through, the gate has been removed and nobody noticed — which is worse than not having one, because
the risk register still says it is there.

If approvals are being rubber-stamped, the honest fix is to widen the unattended column for the
actions that genuinely do not matter, so the remaining approvals get real attention.
