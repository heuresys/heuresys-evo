# ADR-0005: GitHub mirror privato come backup, non workflow

**Status**: ⚠️ **SUPERSEDED** by ADR-0019 (S9 repo visibility flip + S10 branch protection)
**Date**: 2026-05-01 (original) · Superseded: 2026-05-04 (S9/S10)
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B0/B6

> **Nota di supersessione (S10, 2026-05-04)**: questo ADR riflette la situazione iniziale (repo privato, push direct su main, no branch protection). Dal 2026-05-04 il repo è **PUBLIC** (flippato in S9 dopo CI billing exhausted) e ha **branch protection attiva** su main (7 required checks + linear history + no force push). La sezione "Public repo: rejected" è quindi superata. Vedi `docs/decisions/0019-repo-visibility-flip-and-branch-protection.md` per la nuova decision corrente.

## Context

Pre-B0 il repo `/home/ubuntu/heuresys-evo` era una working dir senza versioning. Lo SoT primary del progetto Heuresys (legacy `.com.evo`) è Windows + GitHub mirror via Cowork orchestrator (vedi `ADR-WRITER-AUTHORITY` nel repo legacy). Il greenfield evo ha esigenze diverse:

- **Bus factor**: una sola working copy su una VM ARM64 OCI è single point of failure (corruzione disco, snapshot rollback, terminazione VM).
- **Off-site backup**: serve copia replicata fuori dalla VM, accessibile per recovery anche se la VM è perduta.
- **Workflow PR/review**: il Cantiere B opera in autonomous mode, non c'è un secondo developer che apre PR. Il workflow centralizzato GitHub PR review non è necessario.

## Decision

GitHub mirror **privato** `heuresys/heuresys-evo` come **backup** + sola fonte off-site, **non** come hub di workflow PR/review.

Implicazioni:

- `git push origin main` direttamente da VM su ogni RTGB commit (no PR intermediate).
- Branch protection NON imposta `require pull request` — solo eventuale `require status checks` quando i workflow CI sono attivi (B10).
- Tag `rtgb/init`, `rtgb/phase<N>/done` pushati come riferimenti recovery.
- Le credenziali GitHub (`gh` CLI con account `Spen-Zosky`, scope `repo`) sono già provisionate sulla VM.

## Alternatives considered

- **Public repo**: rejected — il codice contiene migration SQL con schema specifico Heuresys e riferimenti interni; private è la scelta corretta.
- **GitHub org with PR workflow**: rejected — non c'è secondo developer attivo nel Cantiere B; il workflow PR/review aggiungerebbe friction senza beneficio.
- **Self-hosted Gitea/Forgejo on a second VM**: rejected — costo operativo (manutenzione, backup, TLS) sproporzionato per un singolo repo.
- **Bare git remote on a separate OCI VM**: rejected — meno robusto di GitHub (no UI, no Releases, no Actions).

## Consequences

Positive:

- Backup automatico cross-region (GitHub).
- Tag namespace `rtgb/*` interrogabile via UI per audit phase progression.
- GitHub Actions abilitate da B10 senza migration di repo.

Negative:

- Push direttamente su main bypassa il review pre-merge. Mitigato da: (a) commit signature `[RTGB][PHx-Ty]` deterministica, (b) ADR per ogni decisione architetturale, (c) `scripts/hardening/rollback.sh` per revert rapido, (d) tag-based phase gates leggibili.
- Dipendenza da disponibilità GitHub.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §5 Phase B0, §11 Phase B6
- ADR-WRITER-AUTHORITY (legacy `.com.evo`) — nota: il workflow legacy è diverso (Cowork/CLI exchange) e non si applica a evo.
