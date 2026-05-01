# services/playground — ARCHIVED 2026-05-01

Status: archived during RTGB Phase B9 (services placeholder cleanup).

Original location: `services/playground/`
Archive location: `archive/services-playground-2026-05-01/`

Reason: pure placeholder shell (only `package.json` + `README.md`, no real code). Removed from `package.json#workspaces` to clean up the npm workspace install graph.

To restore: move back to `services/playground/`, re-add to `workspaces`, run `npm install`.

See ADR-0015 (services lifecycle policy).
