---
description: "Security baseline — always loaded"
---

# Security Baseline

## Secrets
- Secrets must never appear in committed files
- Use environment variables; reference them in code, never hardcode
- `.env` is gitignored; `.env.example` contains only placeholder values

## Input handling
- Validate all input crossing a trust boundary (HTTP, file upload, IPC)
- Use parameterized queries for any database access
- Escape output appropriate to the target context (HTML, shell, SQL)

## Output and logging
- Never log credentials, tokens, or full personal identifiers
- Error responses to clients must not leak internal details (paths, stack traces, query structure)
