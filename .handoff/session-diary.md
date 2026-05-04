# Session Diary

> **Append-only working journal for the CURRENT session.** Cleared at the end
> of every `/handoff` once the entries are metabolized into the new
> `PROJECT-LOG.md` entry.
>
> **Purpose**: shift PROJECT-LOG composition cost from "reconstruct after 4h"
> to "review + merge during handoff". The journal captures context as work
> happens; the skill `handoff` reads this in Step 3 + 4a to assemble the
> session entry instead of recomposing from memory + git log + breadcrumbs.
>
> **Format**: `- HH:MM <type> — <one-line description>`
>
> **Types**:
> - `pr` — PR opened, merged, conflict, rebased
> - `decision` — architectural choice; alternative chosen + 1-line rationale
> - `blocker` — what blocked work, what unblocked it
> - `discovery` — surprising finding, unexpected dependency, version pin reason
> - `commit` — significant commit on main outside the standard PR cascade
> - `note` — general observation worth keeping but not fitting other types
>
> **Lifecycle**:
> 1. During session, agents append entries here as events happen.
> 2. At `/handoff` Step 3, skill reads + parses entries → feeds delta calculation.
> 3. At `/handoff` Step 4a, entries are metabolized into `PROJECT-LOG.md` S<N>.
> 4. At `/handoff` Step 4f (post-snapshot), this file is truncated back to header-only.
>
> The entry history lives in `PROJECT-LOG.md` and dated snapshots; this file
> is "scratchpad for current session" only.

---

## Current session

<!-- Entries below this line. Newest at the bottom. Empty between sessions. -->
