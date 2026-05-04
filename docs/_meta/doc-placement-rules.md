# Doc placement rules (machine-readable companion)

> **Audience**: Claude Code agent + automation tools
> **Reference**: `doc-architecture.md` (human-readable canonical SoT)

Quando l'utente chiede "aggiungi una doc su X", "documenta Y", "scrivi un readme
per Z", consultare questa tabella prima di scegliere il path. Match il primo
trigger applicabile dall'alto.

## Pattern → target path

| Trigger keyword nel request                                                    | Target path                                                                             | ADR riferimento                                |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ---------------------------------------------- |
| "decisione architetturale", "ADR", "alternatives + consequences", "supersedes" | `docs/50-reference/decisions/NNNN-<slug>.md` (incrementa NNNN da `decisions/README.md`) | template in `50-reference/decisions/README.md` |
| "pattern", "schema", "topology", "how it works", "architecture overview"       | `docs/20-architecture/<topic>.md`                                                       | `_meta/doc-architecture.md` Q2                 |
| "how to", "guida sviluppatore", "workflow", "step-by-step" (per dev)           | `docs/30-developer/<task>.md`                                                           | `_meta/doc-architecture.md` Q3                 |
| "runbook", "playbook", "incident", "ops procedure", "deploy"                   | `docs/40-operations/<area>.md` o `docs/40-operations/runbooks/<scenario>.md`            | `_meta/doc-architecture.md` Q4                 |
| "strategy", "vision", "business case", "competitive landscape"                 | `docs/10-strategy/<topic>.md`                                                           | `_meta/doc-architecture.md` Q5                 |
| "roadmap", "plan", "Q1/Q2/Q3", "milestones"                                    | `docs/70-planning/<plan>.md`                                                            | `_meta/doc-architecture.md` Q6                 |
| "glossary", "term definition", "domain dictionary"                             | `docs/_meta/glossary.md` (single file, append)                                          | `_meta/doc-architecture.md` Q7                 |
| "API spec", "OpenAPI", "endpoint reference"                                    | `docs/50-reference/api/<service>.yaml`                                                  | `_meta/doc-architecture.md` Q7                 |
| "snapshot", "audit", "closure report", "post-mortem", "frozen state"           | `docs/90-archive/<topic>/<file>.md`                                                     | `_meta/doc-architecture.md` Q8                 |
| "governance", "doc architecture", "ownership", "review process"                | `docs/_meta/<topic>.md`                                                                 | `_meta/doc-architecture.md` Q9                 |

## Hard rules (no exceptions)

1. **Naming**: kebab-case sempre. Mai SCREAMING_SNAKE, PascalCase, snake_case.
2. **ADR numbering**: NNNN zero-padded 4 cifre, sequenziale, mai riusare numeri ritirati.
3. **Date in filenames**: ISO 8601 `YYYY-MM-DD` (es. `parity-audit-2026-05-01.md`).
4. **No file `.md` in `docs/` root** se non `README.md` o `CONTRIBUTING.md` (tutto il resto va in subdir).
5. **No empty directories**: se sub-dir è vuota, non crearla finché non c'è almeno 1 file.
6. **Subdir README.md mandatory**: ogni subdir top-level (`10-strategy/`, `20-architecture/`, ecc.) ha un `README.md` di orientation con index dei file presenti.

## Soft rules (con justification possibile)

- Se la doc copre 2+ categorie: scegliere quella PIÙ specifica, lasciare cross-link dalle altre. Non duplicare.
- Se la doc è temporary (es. session plan): può vivere in `.handoff/` invece di `docs/`. `.handoff/` è working journal, `docs/` è sustained reference.

## Pattern legacy (transizione S11 completata)

Tutti i path legacy sono stati migrati in S11 doc consolidation (PR #34, #35, #36, #37, #38, #39):

- ~~`docs/architecture/`~~ → ✅ `docs/20-architecture/`
- ~~`docs/strategy/` (SCREAMING)~~ → ✅ `docs/10-strategy/` (kebab-case)
- ~~`docs/runbooks/`~~ → ✅ `docs/40-operations/runbooks/`
- ~~`docs/guides/onboarding.md`~~ → ✅ `docs/30-developer/onboarding.md`
- ~~`docs/guides/security.md` + `.claude/rules/security.md`~~ → ✅ `docs/30-developer/security-baseline.md` (consolidated)
- ~~`docs/guides/prisma-workflow.md`~~ → ✅ appendix in `docs/30-developer/prisma-migration-workflow.md`
- ~~`docs/cutover/`~~ → ✅ `docs/90-archive/cutover-event-paradigm/` (paradigm abbandonato)
- ~~`docs/hardening/`, `docs/audits/`, `docs/test-coverage/`, `docs/migration/`~~ → ✅ `docs/90-archive/<topic>/`
- ~~`docs/decisions/`~~ → ✅ `docs/50-reference/decisions/`
- ~~`docs/glossary.md`~~ → ✅ `docs/_meta/glossary.md`

**Per nuove doc**: USARE il path canonical numbered (vedi tabella sopra). Non re-creare path legacy.

## Self-test

```bash
# Doc fuori schema canonical (post-S11)
find docs/ -name "*.md" -type f | grep -v -E "docs/(README|CONTRIBUTING)\.md$|docs/(_meta|10-strategy|20-architecture|30-developer|40-operations|50-reference|70-planning|90-archive)/"
# expected (post-S11): empty
# expected (during S11): file in path legacy ancora migrandi

# Subdir senza README
for d in docs/_meta docs/10-strategy docs/20-architecture docs/30-developer docs/40-operations docs/50-reference docs/70-planning docs/90-archive; do
  test -f "$d/README.md" || echo "MISSING: $d"
done
# expected: empty
```
