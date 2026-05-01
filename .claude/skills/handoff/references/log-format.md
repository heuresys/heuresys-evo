# PROJECT-LOG.md format reference (`.evo` edition)

The `PROJECT-LOG.md` file is **append-only**. NEVER modify past entries. Each session adds exactly one entry.

Convention: **newest at top** (reverse-chronological). Pick once and stick with it.

This is **dev-facing**: captures the "how" of each session — what was attempted, what worked, what didn't, why. CHANGELOG.md is the user-facing equivalent.

## File header (only at first creation)

```markdown
# Project log

> Append-only journal of every working session. Newest entries at the top.
> User-facing changes go in `CHANGELOG.md`.

---
```

## Per-session entry format

```markdown
## YYYY-MM-DD — Sessione N · <topic 3-5 words>

**Duration**: ~Xh (HH:MM start → HH:MM end, or estimated from git log)
**Branch**: `main` (or feature branch)
**Agent**: Claude Opus 4.7 (or whichever)
**Commits this session**: N

### Mandato

The briefing received at the start of the session: what the user asked, what was the goal. Distilled in 1-3 sentences. Without this, future sessions don't know what was IN scope vs OUT of scope.

### Tasks completati

- ✅ <task subject> — see commit `abc1234`
- ✅ <another> — files: `path/to/foo.py`, `path/to/bar.tsx`
- ❌ <attempted but not finished> — blocker: <reason, see Decisions>

### Files changed

Aggregated stats from `git diff --stat <last-handoff-commit>..HEAD`:

```
M  web-interface/backend/app/services/pages_io.py   (+45, -12)
A  web-interface/frontend/src/components/w-sigil/WSigil.tsx   (+98, -0)
D  web-interface/frontend/src/components/pulse-orb/PulseOrb.tsx   (-152)
```

If huge (>30 files), summarize ("removed 18 R3F-related files") and link to squash commit.

### Commits

Bullet list, one line each:

```
- abc1234 chore(handoff): YYYY-MM-DD — topic
- def5678 fix(backend): pin uvicorn args
```

If zero commits: `_(no commits — work-in-progress only)_`.

### Decisions

Decisions made that are NOT obvious from the diff. Most valuable section. Each item: decision + rationale (1-3 sentences).

```markdown
- **Pivoted from R3F orb to static W-Sigil**. Reason: Three.js + Paper Shaders consumed too much CPU/GPU on user's hardware. The W-Sigil is pure SVG, scales 16-240px, gives more brand identity.
- **Adopted baseline-squash strategy**. Reason: VM container v1 has 201 migrations; replaying them in `.evo` adds no value when state is known. Industry standard for refactor-from-consolidated-DB.
```

### Blockers / failures

Things that didn't work. Each item: symptom + what tried + state.

```markdown
- **ruamel race condition** (P0): blocks 5/9 routes under concurrent load. Tried: standalone curl works (200). Confirmed: singleton `YAML(typ='rt')` state issue. NOT FIXED — escalated next session.
- **pg_dump format mismatch**: client 18 (apt default on VM) generated dump format 1.16, unreadable by pg_restore 16. Tried: PATH override no effect. RESOLVED: dump from inside Docker container (forces client 16.13).
```

If empty: omit section.

### Lezione operativa cross-project

Distillable lessons valid beyond this project. Future sessions on OTHER projects benefit.

```markdown
- **Windows env var precedence**: User-scope persistent env vars (set via Pannello di Controllo or `setx`) override `.env` for default in apps using `python-dotenv`. Always use `load_dotenv(override=True)` if `.env` should win.
- **Git Bash on Windows**: `docker exec` commands with `/tmp/...` paths get translated to Windows paths. Prefix `MSYS_NO_PATHCONV=1` to avoid.
- **SSH in while-read loops**: `ssh` consumes stdin, breaking the loop after first iteration. Use `ssh -n` to disable stdin.
```

If empty: omit section. Do not invent lessons just to fill space.

### References

External links, screenshots, error logs, related PRs. Optional.

```markdown
- `web-interface/QA-REPORT.md` — full E2E results
- `.handoff/snapshots/HANDOFF-YYYY-MM-DD.md` — frozen plan snapshot
- ADR-0001, ADR-0002 in docs/decisions/
```

---
```

## Rules

- **Append-only**: once written, frozen. To correct, add new entry that supersedes (e.g. "Sessione N+1 · correzione log precedente").
- 3 dashes (`---`) between entries.
- Date format: `YYYY-MM-DD`. Add HH:MM only inside entry, not in heading.
- Topic in heading: 3-5 words, lowercase, no punctuation. Used as anchor.
- Commit list: short SHA (7 chars) + subject as committed.
- Entry length: typically 50-200 lines. Big sessions: 300+. >500: split into `### Sezione 1`, etc.
- **Italian** for prose, **English** for code/commands/file paths.

## Sample full entry

```markdown
## 2026-04-27 — Sessione 1 · scaffold .evo + DBMS bare-metal

**Duration**: ~14h (03:50 first commit → 17:35 last)
**Branch**: `main`
**Agent**: Claude Opus 4.7
**Commits this session**: 14

### Mandato

Bootstrap del nuovo progetto `.evo` (rebuild di heuresys.com.evo) partendo da directory vuota: scaffold repo, setup DBMS bare-metal sulla VM, importare baseline da v1, garantire accesso DBMS dal PC.

### Tasks completati

- ✅ Scaffold completo via skill scaffold-fullstack-project — see commit `9aa1587`
- ✅ Setup PostgreSQL 16.13 + pgvector bare-metal su VM — see commits `3d6a64a`, `ed9beed`
- ...

[etc.]
```
