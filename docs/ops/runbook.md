# Runbook — Motorsport Legends

Written for someone woken at 3am who did not build this system. Assume no context, and optimise
for the reader being tired rather than for the writer being brief.

> **There is no on-call rotation for this service.** That is a legitimate choice for some systems.
> It is only a problem if the alerts in [slos-and-telemetry.md](slos-and-telemetry.md) assume
> someone is watching. Make sure those two facts agree.

---

## Before anything else

1. **Is it actually broken, or is the monitoring broken?** Check the user-facing signal directly,
   not the dashboard about it.
2. **What changed?** Deploys, config, dependencies, upstream services, traffic. In that order —
   that is roughly the order of likelihood.
3. **Is it getting worse?** This decides whether you stabilise first or diagnose first. When in
   doubt, stabilise first; understanding can wait, degradation compounds.

## How a change reaches production

Push to main - Vercel builds from the app/ root directory and deploys to production

## The rollback

TODO(setup): write the exact commands. Not a description of the approach — the commands, in order,
with what to check after each one.

```
# TODO(setup)
```

**Rolling back is not an admission of failure and does not need a meeting.** Restore service, then
understand. Teams that reverse this order have longer incidents and no better understanding at the
end of them.

> **This rollback path has never been deliberately exercised.** That was stated during setup, and
> recording it here is the honest thing to do: until someone runs it on purpose, it is a hypothesis
> rather than a procedure. The moment you need it is the worst possible moment to find out which.
>
> Book an afternoon. Run it. Then delete this block and write down what actually happened —
> including the steps that turned out to be missing, because there always are some.

## Common failures

### <Symptom the user reports>

- **Looks like:** what you will see on the dashboard.
- **Usually caused by:** the two or three most likely causes, most likely first.
- **Check:** the specific query or command that distinguishes them.
- **Fix:** the action, and what confirms it worked.

<!-- Add an entry here after every incident. This section is the compounding one: a runbook grown
     from real incidents is worth more than any amount of anticipated documentation, because it
     covers what actually happens rather than what someone imagined might. -->

## Escalation

- TODO(setup): who owns the service, who owns the platform it runs on, who to call about the
  upstream dependency.
- The threshold for waking someone else up should be written here, because at 3am nobody wants to
  make that judgment about a colleague.

## After the incident

Write the postmortem within two working days, while the details are still recoverable, using
[postmortem-template.md](postmortem-template.md). Then add the failure to "Common failures" above —
that step is the one that gets skipped, and it is the one that makes the next incident shorter.
