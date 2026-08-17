# Agents and skills — {{project.name}}

Subagent definitions live in [`.claude/agents/`](../../.claude/agents/). Each is a named role with
a scoped toolset and a system prompt carrying the lesson from the lifecycle phase it belongs to.
{{#if answers.hasSkills}}
Skills live in [`.claude/skills/`](../../.claude/skills/) and are listed further down.

**The difference is worth stating, because installing both without understanding it produces a pile
of overlapping definitions nobody uses.** An *agent* is a role you hand work to: its own context,
its own tools, and it reports back with findings. A *skill* is a procedure the assistant you are
already talking to loads when it becomes relevant, so a recurring job is done the same way every
time rather than reinvented from whatever happens to be in the window.

Reviewing code is an agent. Writing an ADR in this repository's format is a skill.
{{/if}}

## Why a roster rather than ad-hoc prompts

Three reasons, in increasing order of importance.

**Consistency.** A review prompt written from memory at 5pm is not the review prompt written at
10am. A defined agent produces the same standard of work regardless of who invoked it or how much
of a hurry they were in.

**Scoped tools.** Each agent gets the minimum it needs. The reviewers are read-only, because a
reviewer has no business writing to the tree. That is the least-privilege principle from
[../security/agent-permissions.md](../security/agent-permissions.md) applied at the level where it
is cheapest to enforce.

**Somewhere for corrections to accumulate.** This is the one that compounds. When an agent gets
something wrong, the fix goes into its definition, and every future invocation inherits it. Prompts
typed into a chat window teach nobody anything; a file that gets edited after each mistake is how a
team's review standard actually improves.

## The roster

| Agent | Phase | What it is for |
|---|---|---|
{{#each answers.agentRosterRows}}
| [`{{name}}`](../../.claude/agents/{{name}}.md) | {{phase}} | {{purpose}} |
{{/each}}

{{#if answers.hasSkills}}
## The skills

| Skill | Phase | What it is for |
|---|---|---|
{{#each answers.skillRows}}
| [`{{name}}`](../../.claude/skills/{{name}}/SKILL.md) | {{phase}} | {{purpose}} |
{{/each}}

Each one drives a document written by the same setup — the ADR format, the review checklist, the
threat model, the postmortem template. That pairing is the point: a procedure with no document to
reference is just a prompt, and a document with no procedure attached is one nobody opens at the
moment it would have helped.

Skills are loaded on demand rather than delegated to, so they carry the same authority as the
assistant running them. That is exactly why none of them approve, merge, deploy or touch
production — see below.

{{/if}}
## How they are meant to be used

- **Before writing code:** `requirements-auditor` on the issue. Cheapest possible time to find that
  a requirement contradicts itself.
- **When a choice is expensive to reverse:** `adr-author`, and open the decision as its own pull
  request.
- **After writing code, before the pull request:** `code-reviewer`, then `test-strategist`. In that
  order — the reviewer finds what is wrong, the strategist finds what would not have been noticed.
- **On anything touching input handling, auth, dependencies, CI or instruction files:**
  `security-reviewer`. Especially instruction files, which are the highest-value target in the
  repository.
- **When CI goes red:** `build-triage`. Classify before fixing.
- **During and after an incident:** `incident-responder`, which never touches production.
- **After behaviour changes:** `doc-keeper`.

## What none of them do

**None of them approve anything, and none of them merge.** They produce findings and drafts; a
human decides. The line is side effects, not intelligence — an agent may read, reason and propose
freely, and anything with a consequence that outlives the session needs an accountable person.

They also do not replace human review. They cover the mechanical layer well and the judgment layer
badly, and the judgment layer is where the expensive mistakes live: should this change exist, does
it fit the architecture, was the requirement understood.

## Maintaining them

Treat these files the way you treat [`AGENTS.md`](../../AGENTS.md): **a record of corrections, not a
style guide.** When an agent produces a bad review, do not just fix the review — add the rule to
the agent that would have prevented it.

Changes to these files are a security-relevant event. They persist across every future run, which
puts them in the same category as any other agent instruction file. See
[../security/threat-model.md](../security/threat-model.md).
