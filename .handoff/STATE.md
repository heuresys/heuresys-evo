# heuresys-evo — Current State

> Updated: 2026-05-10T18:15Z · S27 closed · ACQ-AUDIT-2026-05 acquisition-grade audit shipped

## Last session brief (S27 — full session dedicated to acquisition audit)

**S27 (17:00-18:15Z)** — 3 commit pushed `7d79f98` → `52a6c1e` → `7ce5e9f`. Forensic acquisition-grade audit completo (20 deliverable, 11 dimensioni, 12 subagent + 2 Devil's Advocate + rebuttal + decision brief signed).

- **Sessione 1 (Fase A+B)**: 12 deliverable. 10 subagent specialisti (D1 architect-review · D2 database-admin · D3 security-auditor · D4 frontend+a11y · D5 devops-troubleshooter · D6 test-automator · D8 business-analyst · D9 market-research+comprehensive-researcher) + tech debt registry consolidato + executive summary preliminary. Verdict prelim: NEGOTIATE.
- **Sessione 2 (Fase C+D+E)**: 7 deliverable. DA-tech (7 attacchi) + DA-business (9 attacchi) kill-the-deal mode → rebuttal (7 accepted · 5 mitigated · 2 rejected · 2 partial) → PRD reality + cost-to-date + roadmap M+1→M+18 + decision brief signed.
- **Sessione 2 ext**: file 18 Q&A delle 8 open questions (3 verified: 0 fork · NESSUN LICENSE · legacy repo 584 commit verified · cost-to-date REVISED €664k mid both repos).

**Verdict finale signed**: **NEGOTIATE strutturato** asset+acqui-hire+earnout, sweet spot **€500-600k** (solo evo) o **€650-800k** (both repos). 8 condition precedent + 5 walk-away triggers. Acquirer profile preferito: EU HCM tier-2 (Zucchetti/TeamSystem).

## Top priorities S28+

1. **`[STRATEGIC]` Decisioni audit pre-LOI** (Enzo decision-only, ≤7 giorni) — 3 azioni immediate: (a) aggiungere `LICENSE` file (Q5 verified gap critico, repo PUBLIC senza license attualmente), (b) EUIPO/UIBM trademark check "Heuresys" + registration se gap (~€1.4-2k), (c) decisione strategic legacy repo include/exclude nel deal scope (impact +15-25% pricing). Ref: [`docs/_audit/2026-05-10-acquisition-audit/18-open-questions-suggested-answers.md`](../docs/_audit/2026-05-10-acquisition-audit/18-open-questions-suggested-answers.md)

2. **`[ARCH-S28]` § 1.2 vertical-split Phase 2 + view audit** (~15-25h FTE — invariato da S26) — sequenza: audit 65 view via `pg_depend`, salva definitions, DROP CASCADE, apply `phase16o_employees_to_view.DRAFT-DEFERRED.sql`, ricreare 65 view refactorate, verify mat view + 12 hot view. Backup pre-attempt: `heuresys_platform-pre-phase16o-20260510T044105Z.dump`. Ora **prioritario** se decisione audit → "NEGOTIATE proceed" (è C1 della decision brief).

3. **`[ARCH]` 4 process_* secondary nav `_v2`** (~2-3h, non-blocking — invariato) — preset HR_DIRECTOR/HR_MANAGER mancano suffix `_v2` + elements seedati.

## Open questions

- **Procedere con audit-driven actions o tornare a roadmap originale?** L'audit è meta-work strategico. Le 8 open questions Q&A in file 18 richiedono decisioni Enzo PRIMA di rimettere mano al codice (LICENSE/trademark/repo scope). Senza queste, deal value uncertainty rimane ±10-15%.
- **Brand v1.0 promotion** (16-25h, S26 priority) ancora rilevante? Audit ha riconfermato brand workstream maturo (Phase 4 chiusa, Brand Book v0 shipped) — promotion v1.0 può ancora essere milestone M+12 roadmap.

## Stack snapshot (changed this session)

- DBMS: **invariato** dal S26 (audit read-only, zero migration applicate, zero schema changes)
- Code: **invariato** (audit puro, zero edit a `services/` o `packages/`)
- Tests: **invariato** 865 verdi
- Docs: **NEW directory `docs/_audit/2026-05-10-acquisition-audit/`** con 20 deliverable / 4406 righe (audit + DA + rebuttal + decision brief + Q&A)
- Memory: nessun update (audit non ha richiesto memoria persistente cross-session)
- Repo: 3 commit aggiunti su origin/main (`7d79f98`, `52a6c1e`, `7ce5e9f`)

## Verification

```bash
git log --oneline -5  # expected: 7ce5e9f file 18 Q&A → 52a6c1e Sessione 2 → 7d79f98 Sessione 1 → 7860769 S26 close
ls docs/_audit/2026-05-10-acquisition-audit/ | wc -l  # expected 20 (00 + 01 + 02 + 03 + 04 + 05 + 05b + 06 + 07 + 08 + 09 + 10 + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18)
ls LICENSE 2>/dev/null && echo "LICENSE present" || echo "LICENSE STILL MISSING — Q5 action pending"
```

Riferimenti: [`docs/_audit/2026-05-10-acquisition-audit/16-final-decision-brief.md`](../docs/_audit/2026-05-10-acquisition-audit/16-final-decision-brief.md) (signed verdict) · [`docs/_audit/2026-05-10-acquisition-audit/18-open-questions-suggested-answers.md`](../docs/_audit/2026-05-10-acquisition-audit/18-open-questions-suggested-answers.md) (Q&A + cost revised) · `~/.claude/plans/mi-piacerebbe-un-dreamy-creek.md` (plan canonical audit eseguito).
