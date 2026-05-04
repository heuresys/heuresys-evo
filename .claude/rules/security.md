---
description: 'Security baseline — always loaded'
---

# Security Baseline (pointer)

> **SoT**: vedi `docs/30-developer/security-baseline.md` per regole P1-P10 complete + comandi + pattern + incident response.

Questo file resta come **pointer** per il loading automatico di Claude Code CLI (`.claude/rules/*.md` viene auto-caricato come project context). Le regole effettive sono migrate in `docs/30-developer/security-baseline.md` come parte di S11 doc consolidation Phase B3 (single SoT).

## Riferimenti rapidi (subset critico)

- **P1 Multi-tenant**: ogni query Prisma su tabelle tenant-scoped DEVE includere `tenantId` in `where`. Mai trust da request body alone.
- **P3 Authorization**: `requirePermission(area, action)` Express middleware. Mai `requireRole(...)` hardcoded — è data-driven (P9).
- **P4 Audit**: ogni write operation produce `audit_logs` row pre-commit. Use `auditedTransaction()` helper.
- **P5 RLS**: ogni nuova tabella tenant-aware include policy RLS nella stessa migration che la crea.
- **P6 Secrets**: mai hardcode. `.env` gitignored. Pre-commit hook `gitleaks-lite` enforced (no `--no-verify`).
- **P7 Input validation**: zod schemas su ogni boundary HTTP/file/IPC.
- **P8 Output/logging**: pino redaction su `password|token|cookie|Authorization`. No `console.log` in prod path (lint rule).

## Reference completo

[`docs/30-developer/security-baseline.md`](../../docs/30-developer/security-baseline.md)
