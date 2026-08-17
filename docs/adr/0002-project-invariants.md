# ADR-0002: The invariants of Motorsport Legends

- **Status:** Accepted
- **Date:** 2026-08-16
- **Deciders:** TODO(setup)

## Context

A scroll-driven 3D showroom for classic and modern performance cars, with an enquiry form that captures buyer leads.

Some properties of this system are always true, and a plausible-looking change can break them
without breaking anything visible. Those are the properties that need writing down — not because
the team does not know them, but because the team is no longer the only thing writing code here.

An invariant that lives only in someone's head is enforced only when that person reviews the pull
request. An invariant written here can be referenced in review, pinned by a test, and read by every
assistant that touches the repository.

## Decision

> The following properties of Motorsport Legends hold everywhere and always. A change that violates
> one is a defect regardless of whether any test failed, and relaxing one requires a new ADR that
> supersedes this record.

### Nothing in the entry graph (main.tsx, HomePage and everything it reaches) may statically import three, @react-three/* or gsap - it ships the 1.35 MB three chunk to every homepage visitor

**Why it holds:** TODO(setup) — the reason this is true, in one or two sentences.

**What breaks it:** TODO(setup) — the plausible-looking change that would violate it. This is the
sentence that does the work; name the tempting mistake specifically enough that a reader recognises
it in a diff.

**Pinned by:** TODO(setup) — the test that fails if this is violated. If there is no such test, say
so plainly, and treat writing one as the next task rather than a nice-to-have.

### manualChunks must claim react/react-dom/scheduler before the three rule, or React is swallowed into the three chunk and the entry downloads all of Three.js just to boot

**Why it holds:** TODO(setup) — the reason this is true, in one or two sentences.

**What breaks it:** TODO(setup) — the plausible-looking change that would violate it. This is the
sentence that does the work; name the tempting mistake specifically enough that a reader recognises
it in a diff.

**Pinned by:** TODO(setup) — the test that fails if this is violated. If there is no such test, say
so plainly, and treat writing one as the next task rather than a nice-to-have.

### Never use the drei `Environment preset` prop - it resolves to raw.githack.com and suspends inside the Canvas; pass `files={WAREHOUSE_HDR}` instead

**Why it holds:** TODO(setup) — the reason this is true, in one or two sentences.

**What breaks it:** TODO(setup) — the plausible-looking change that would violate it. This is the
sentence that does the work; name the tempting mistake specifically enough that a reader recognises
it in a diff.

**Pinned by:** TODO(setup) — the test that fails if this is violated. If there is no such test, say
so plainly, and treat writing one as the next task rather than a nice-to-have.

### The SPA rewrite in app/vercel.json must keep excluding api/, assets/, models/, draco/, hdri/, videos/ and any dotted path - a blanket rewrite answers a missing .glb with HTML and a 200

**Why it holds:** TODO(setup) — the reason this is true, in one or two sentences.

**What breaks it:** TODO(setup) — the plausible-looking change that would violate it. This is the
sentence that does the work; name the tempting mistake specifically enough that a reader recognises
it in a diff.

**Pinned by:** TODO(setup) — the test that fails if this is violated. If there is no such test, say
so plainly, and treat writing one as the next task rather than a nice-to-have.

### Colours are space-separated RGB tuples, never hex, so Tailwind opacity modifiers like bg-accent/60 work

**Why it holds:** TODO(setup) — the reason this is true, in one or two sentences.

**What breaks it:** TODO(setup) — the plausible-looking change that would violate it. This is the
sentence that does the work; name the tempting mistake specifically enough that a reader recognises
it in a diff.

**Pinned by:** TODO(setup) — the test that fails if this is violated. If there is no such test, say
so plainly, and treat writing one as the next task rather than a nice-to-have.

### setDecoderPath must run before the first useGLTF call - every GLB in public/models declares Draco compression as required

**Why it holds:** TODO(setup) — the reason this is true, in one or two sentences.

**What breaks it:** TODO(setup) — the plausible-looking change that would violate it. This is the
sentence that does the work; name the tempting mistake specifically enough that a reader recognises
it in a diff.

**Pinned by:** TODO(setup) — the test that fails if this is violated. If there is no such test, say
so plainly, and treat writing one as the next task rather than a nice-to-have.


## Consequences

### What this makes easy

- Review has something concrete to point at. "This violates invariant two" ends a discussion that
  "I don't like this" would not.
- Assistants working in this repository read these through `AGENTS.md` and stop proposing changes
  that contradict them.

### What this makes hard

- Every invariant is a constraint on future design, including designs nobody has thought of yet.
  That is the intended cost — but it is a real one, which is why the list should be short and
  every entry should be load-bearing.

### What this forbids

Any change that violates an invariant above, including changes that are otherwise improvements.
An invariant that yields to a sufficiently nice refactor was never an invariant.

## How this is enforced

- Restated in `AGENTS.md`, which every agent working here reads.
- Each invariant names the test that pins it. **An invariant with no test is an aspiration**, and
  the honest thing to do is write that down rather than assume review will catch it.
