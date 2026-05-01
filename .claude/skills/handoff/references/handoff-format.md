# HANDOFF.md format reference (`.evo` edition)

The `HANDOFF.md` file is **overwritten** at every session close. It is the **single read target** of the next session bootstrap.

Keep it short, scannable, action-oriented. Target: 80-250 lines.

## Required sections (in this exact order)

```markdown
# Handoff — <project name>

> Updated: YYYY-MM-DD HH:MM (Sessione N) · See `PROJECT-STATE.md` for full state · See `PROJECT-LOG.md` for history

## Recap last session

One paragraph (3-6 sentences) describing what happened, decisions made, what's now in a different state than before. Reference commits if relevant. No fluff.

## Priorities for next session

Ordered list of 3-5 actionable items. Each item:
- Single short subject line + effort estimate
- 1-2 sentences of context
- Files: absolute paths
- Done when: verifiable condition

Effort scale (use these tags exactly):
- **S** ≤ 30 minutes
- **M** 1-3 hours
- **L** 3-6 hours
- **XL** > 6 hours (multi-session, escalate to user)

```markdown
1. **<top priority subject>** (S/M/L/XL)
   <1-2 sentences of context>
   Files: `path/to/foo.py`, `path/to/bar.tsx`
   Done when: <verifiable condition>

2. **<next priority>** ...
```

## Open questions

Things that need a **decision** before proceeding. Each item phrased as a question with the alternatives if known.

```markdown
- Should we use OAuth or JWT for auth? (current: undecided — see PROJECT-LOG entry 2026-04-26)
- Migration 221: apply now or defer pending TOTP backfill?
```

If empty: write `_(none)_` — never delete the section.

### Carry-forward (still open, exploratory)

Items from previous sessions that are still open and **NOT being actively worked on next session**. Separated from current Open questions to keep the read target clean.

```markdown
- (Sx) decision X — exploratory, no urgency
- (Sy) decision Y — blocked by external dependency
```

If empty: omit subsection entirely.

## Known issues

Categorized by area + severity tag. Each item: 1 line, severity + 1-line description + reference if exists.

Severity scale:
- **P0** blocker — must be fixed before any other work
- **P1** high — fix in next session
- **P2** medium — fix soon
- **P3** low — fix later, or accept as-is

Severity tag conventions:
- `**P2**` — established issue
- `**P2 NEW S<N>**` — new issue identified in session N
- `**P3 carry-forward**` — issue being deferred for >2 sessions

```markdown
### Webapp

- **P0** ruamel race condition on YAML reads (see QA-REPORT.md §Issue #1)
- **P3** Bundle max chunk 533kB warning (code-split needed)

### Engine

- **P2 NEW S9** Backend uvicorn stale process can survive standard kill on Windows
- **P3 carry-forward** Bash array silently drops accented keys (workaround Python)

### Operational

- **P2** Off-VM backup not yet enabled (OCI Object Storage upload TODO in script)
```

If a category is empty: omit the subsection.

## Verification commands

Commands to run on next session start to confirm the project is still in a working state. Maximum 3-5 areas. Each block: comment + command + expected output.

```bash
# Backend up
curl -sf http://localhost:8000/api/system/health
# → expected: {"status":"ok"}

# Frontend up
curl -sfI http://localhost:5173/ | head -1
# → expected: HTTP/1.1 200

# Tests pass
cd backend && pytest -q
# → expected: 40 passed (15 scaffold + 15 repair + 7 smoke + 3 system)
```

For non-runnable phases (docs / planning / spec): replace with read-only checks like `wc -l <key files>`, `git log --oneline -5`, `git status --short`.

## How to start the next session

1. Read this file (you're doing it).
2. Read `.handoff/PROJECT-STATE.md` for full architecture / components state.
3. Scan `.handoff/auto/` for breadcrumbs newer than this file's mtime — surface them if any.
4. Run verification commands above.
5. Ask user: "Continuiamo dalla priority #1, scegli un'altra, o qualcosa di nuovo?"
6. Wait for direction before doing anything.

## Optional sections

Add only if they bring concrete value, never as filler:
- **`## Context for next agent`** — domain knowledge hard to derive from code (1-3 paragraphs max)
- **`## Reference links`** — external URLs, design docs, related issues
- **`## Skipped / deferred`** — things explicitly NOT done this session, with reason

## Rules

- Section names must match exactly (the bootstrap reader scans for them)
- Use absolute paths (or paths relative to project root with leading `./`)
- Never link to a snapshot file that hasn't been written yet
- Never write more than 5 priorities — overflow goes to `PROJECT-STATE.md` Backlog
- Italian for prose, English for technical terms (commands, code, file paths)
```
