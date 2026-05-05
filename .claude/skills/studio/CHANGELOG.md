# studio skill — CHANGELOG

Versioning [semver](https://semver.org/) skill-level. Bump al cambio di:

- **MAJOR**: breaking change in API slash command, MANIFEST schema, script contracts
- **MINOR**: nuovo sub-command, nuova reference, nuova capability
- **PATCH**: bug fix, miglioramenti documentazione, fix stylistici

Ogni entry: data, riassunto, hash commit principale.

## [1.1.0] — 2026-05-05

### Added

- `/studio:bootstrap <mockup> <route>` — prima promozione greenfield (mockup HTML standalone → React Server Components). Wrapper su `clone-route.sh` con copia mockup come `source-mockup.html` + README § Motivazione pre-popolata + arricchimento `.source-hashes.json` con `bootstrap_source` e `operation_intent: first_promote`.
- `/studio:doctor` — self-check + auto-fix + self-learning. 8 categorie di check (file integrity, commands ↔ SKILL.md alignment, bash syntax, executable bit, JSON templates, error catalog coverage, version coherence, self-learning data). Modi `--apply`, `--learn`, `--version`.
- `scripts/_helpers.sh` — funzioni shared `_log_invocation`, `_capture_lesson`, `_studio_version`. Source da ogni script principale per logging append-only in `.logs/usage.jsonl` (gitignored).
- `references/lessons-learned.md` — file append-only di pattern operativi emersi.
- `references/self-evolution.md` — doc dei 3 meccanismi (self-learning, self-correcting, self-updating).
- `CHANGELOG.md` (questo file) — versioning skill-level.

### Changed

- `SKILL.md` frontmatter ora include `version: 1.1.0`.
- `SKILL.md` tabella sub-command 8 → 9 (incluso `bootstrap` + `doctor`).
- `CLAUDE.md` root tabella sub-command sincronizzata.

### Fixed

- Lesson `[drift-crlf]` — drift detection generava falsi positivi su Windows Git Bash a causa di trailing `\r` da `python3 print()`. Fix in `promote.sh`, `restore.sh`, `status.sh`: strip `\r` esplicito + `sys.stdout.write` con `chr(10)` esplicito.

## [1.0.0] — 2026-05-05

### Added

- Skeleton skill `studio` (Phase 1-5 della implementazione).
- 7 sub-command iniziali: `/studio` (entry), `/studio:clone`, `/studio:diff`, `/studio:promote` (5-gate flow), `/studio:restore`, `/studio:backup-list`, `/studio:status`.
- 6 references: `route-mapping`, `error-catalog`, `promote-flow`, `manifest-schema`, `orchestration-map`, `staging-readme-template`.
- 6 scripts bash POSIX cross-platform: `clone-route.sh`, `diff-staging.sh`, `promote.sh`, `restore.sh`, `list-backups.sh`, `status.sh`.
- 2 templates: `MANIFEST.template.json`, `README-staging.template.md`.
- Auto-memory tier-3 fallback: `feedback_studio_workstream.md`.
- Decisione registrata in `.ux-design/DECISIONS-LOG.md` § L26.

### Workflow

- 5-gate flow obbligatorio per promote: A motivazione (brainstorming), B brand audit, C anti-slop, D verification 5/5, E user explicit confirm.
- 2 fail-safe: F repo clean check, G husky pre-commit (lint-staged + gitleaks + commitlint).
- NO auto-push post-promote — push è opt-in esplicito.
- Drift detection sha256 per rilevare modifiche out-of-band fra clone e promote.
- Backup append-only immutabile in `.ux-design/.backups/<route>/<TS>-pre-promote/` con `MANIFEST.json` schema `studio.manifest.v1`.

### Commits principali

- `6ef3764` — Phase 1: scaffold skill + entry command
- `e2311cf` — Phase 2: clone-route command + templates
- `cea3452` — Phase 3: diff/status/backup-list read-only commands
- `10523d2` — Phase 4: promote command with 5-gate flow
- `6218568` — Phase 5: restore command + workstream docs integration
- `e46d6be` — Fix CR/LF drift detection (vedi lesson `[drift-crlf]`)
- `9af7643` — Phase 6: bootstrap command per prima promozione greenfield
