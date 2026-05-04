# 30-developer — how-to per sviluppatori

TASK-level documentation: come fare X come dev sul progetto.

## File index

| Doc                                                                                              | Scope                                                                                 |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [`onboarding.md`](onboarding.md)                                                                 | Dev setup da zero a primo commit (~30min)                                             |
| [`security-baseline.md`](security-baseline.md)                                                   | P1-P10 enforcement + commands + incident response (canonical SoT)                     |
| [`prisma-migration-workflow.md`](prisma-migration-workflow.md)                                   | `migrate dev/deploy/status`, naming, baseline, rollback (+ appendix legacy `db pull`) |
| [`nextjs-app-router-conventions.md`](nextjs-app-router-conventions.md)                           | RSC, Server Actions, parallel routes                                                  |
| [`typescript-strict-evo.md`](typescript-strict-evo.md)                                           | TS strict mode, zero `any`, type-safe boundaries                                      |
| [`dto-validation-with-zod-or-class-validator.md`](dto-validation-with-zod-or-class-validator.md) | Input validation con zod schemas                                                      |
| [`feature-parity-tracking.md`](feature-parity-tracking.md)                                       | Tracker 33 functional area legacy → evo                                               |
| [`rbp-data-model.md`](rbp-data-model.md)                                                         | RBP data model: roles, areas, perspectives, joins                                     |

## When to add here

Use the decision tree in [`../_meta/doc-architecture.md`](../_meta/doc-architecture.md) Q3: "La doc è how-to per chi sviluppa?".

Per **decisioni** architetturali: vedi [`../decisions/`](../decisions/).
Per **pattern** descritti: vedi [`../20-architecture/`](../20-architecture/).
Per **operational playbook**: vedi [`../40-operations/`](../40-operations/).

## See also

- [`../../CLAUDE.md`](../../CLAUDE.md) (project root) — mission, stack, comandi quotidiani, P1-P10
- [`../../.claude/CLAUDE.md`](../../.claude/CLAUDE.md) — cross-context behavioral rules
- [`../../.claude/rules/security.md`](../../.claude/rules/security.md) — pointer a security-baseline.md
