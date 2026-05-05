# MANIFEST.json schema — `studio.manifest.v1`

Documenta lo schema del file `MANIFEST.json` che `promote.sh` scrive in ogni backup `.ux-design/.backups/<route>/<TS>-pre-promote/MANIFEST.json`.

## Versione

Identificatore: `studio.manifest.v1`. Field `$schema` nel JSON. Cambia versione (`v2`, ecc.) solo per breaking change incompatibili.

## Schema completo

| Campo                        | Tipo            | Obbligatorio | Note                                                                                              |
| ---------------------------- | --------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `$schema`                    | string          | sì           | Sempre `"studio.manifest.v1"`                                                                     |
| `version`                    | string          | sì           | Versione semver del documento, es. `"1.0.0"`                                                      |
| `route`                      | string          | sì           | Route name (es. `"dashboard"`, `"admin/users"`)                                                   |
| `route_source`               | string          | sì           | Path produzione assoluto al progetto, es. `"services/app/src/app/dashboard/"`                     |
| `backup_timestamp`           | string          | sì           | TS backup `YYYY-MM-DD-HHMM` (senza suffix `-pre-promote`)                                         |
| `backup_path`                | string          | sì           | Path completo cartella backup, es. `".ux-design/.backups/dashboard/2026-05-05-2030-pre-promote/"` |
| `staging_source`             | string          | sì           | Path completo staging che ha generato la promozione                                               |
| `staging_timestamp`          | string          | sì           | TS staging `YYYY-MM-DD-HHMM`                                                                      |
| `operation`                  | string          | sì           | `"promote"` o `"restore"`                                                                         |
| `author`                     | object          | sì           | `{ name: string, email: string }` da `git config`                                                 |
| `git.pre_promote_commit`     | string          | sì           | SHA-1 del commit prima della promozione                                                           |
| `git.pre_promote_branch`     | string          | sì           | Branch attivo al momento del promote                                                              |
| `git.post_promote_commit`    | string\|null    | no           | SHA-1 del commit creato dal promote (popolato post-commit)                                        |
| `git.remote`                 | string          | no           | Default `"origin"`                                                                                |
| `git.pushed`                 | boolean         | no           | Default `false`. Aggiornato manualmente se push eseguito                                          |
| `reason`                     | string          | sì           | Motivazione estratta da `README.md § Motivazione` dello staging                                   |
| `files`                      | array\<object\> | sì           | Lista file copiati: `[{ path, size, sha256 }]`                                                    |
| `files[].path`               | string          | sì           | Path relativo al backup dir                                                                       |
| `files[].size`               | integer         | sì           | Bytes                                                                                             |
| `files[].sha256`             | string          | sì           | Hash sha256 hex (64 char)                                                                         |
| `checks_passed.brand_audit`  | object\|null    | no           | `{ score: number, p0_count: int, p1_count: int }` se gate B eseguito                              |
| `checks_passed.anti_slop`    | object\|null    | no           | `{ fingerprints_clean: boolean }` se gate C eseguito                                              |
| `checks_passed.verification` | object\|null    | no           | `{ self_integrity_check: string }` (es. `"5/5"`) se gate D eseguito                               |
| `iso_timestamp`              | string          | sì           | ISO 8601 UTC del momento del backup                                                               |

## Esempio popolato

```json
{
  "$schema": "studio.manifest.v1",
  "version": "1.0.0",
  "route": "dashboard",
  "route_source": "services/app/src/app/dashboard/",
  "backup_timestamp": "2026-05-05-2030",
  "backup_path": ".ux-design/.backups/dashboard/2026-05-05-2030-pre-promote/",
  "staging_source": ".ux-design/10-staging/dashboard/2026-05-05-1815/",
  "staging_timestamp": "2026-05-05-1815",
  "operation": "promote",
  "author": {
    "name": "Enzo Spenuso",
    "email": "enzo.spenuso@outlook.com"
  },
  "git": {
    "pre_promote_commit": "abc1234567890abcdef0987654321abcdefabcd",
    "pre_promote_branch": "main",
    "post_promote_commit": "def4567890abcdef1234567890abcdefabcdef12",
    "remote": "origin",
    "pushed": false
  },
  "reason": "Refactor dashboard hero per allineare a direction zeta + risolvere P1 audit del 2026-05-04 sulla typography scale.",
  "files": [
    {
      "path": "page.tsx",
      "size": 4823,
      "sha256": "1a2b3c4d5e6f7g8h9i0j1a2b3c4d5e6f7g8h9i0j1a2b3c4d5e6f7g8h9i0j1a2b"
    },
    {
      "path": "_components/HeroStats.tsx",
      "size": 1204,
      "sha256": "9z8y7x6w5v4u3t2s1r0q9z8y7x6w5v4u3t2s1r0q9z8y7x6w5v4u3t2s1r0q9z8y"
    },
    {
      "path": "_components/RecentActivity.tsx",
      "size": 2890,
      "sha256": "5e4f3d2c1b0a9z8y5e4f3d2c1b0a9z8y5e4f3d2c1b0a9z8y5e4f3d2c1b0a9z8y"
    }
  ],
  "checks_passed": {
    "brand_audit": { "score": 8.2, "p0_count": 0, "p1_count": 1 },
    "anti_slop": { "fingerprints_clean": true },
    "verification": { "self_integrity_check": "5/5" }
  },
  "iso_timestamp": "2026-05-05T20:30:14Z"
}
```

## Validazione

Lo script `promote.sh` esegue `python3 -c "import json; json.load(open('MANIFEST.json'))"` post-write per validare il parse JSON. Se fallisce, il backup viene rimosso e il promote abortito (`PROMOTE_E312`).

Per validazione schema completa (campi obbligatori), usa:

```bash
python3 -c "
import json, sys
m = json.load(open(sys.argv[1]))
required = ['version','route','backup_timestamp','staging_timestamp','operation',
            'author','git','reason','files','iso_timestamp']
missing = [k for k in required if k not in m]
if missing: print('MISSING:', missing); sys.exit(1)
if 'pre_promote_commit' not in m['git']: print('MISSING: git.pre_promote_commit'); sys.exit(1)
print('OK')
" .ux-design/.backups/<route>/<TS>-pre-promote/MANIFEST.json
```

## Immutabilità

`MANIFEST.json` è immutabile per design dopo la creazione, con UN'ECCEZIONE: il campo `git.post_promote_commit` viene aggiornato da `promote.sh` immediatamente dopo il commit (perché lo SHA del nuovo commit non è noto prima). Tutti gli altri campi sono fissati al momento della creazione.

Se serve correggere un MANIFEST (es. campo `reason` errato), creare un file annesso `MANIFEST.note.md` nella stessa cartella backup, NON modificare MANIFEST.json (preserva audit trail).

## Riferimenti

- Skill principale: [`../SKILL.md`](../SKILL.md)
- Template letterale: [`../templates/MANIFEST.template.json`](../templates/MANIFEST.template.json)
- Promote flow: [`promote-flow.md`](promote-flow.md)
- Script che lo scrive: [`../scripts/promote.sh`](../scripts/promote.sh)
- Script che lo legge: [`../scripts/list-backups.sh`](../scripts/list-backups.sh), [`../scripts/status.sh`](../scripts/status.sh), [`../scripts/restore.sh`](../scripts/restore.sh)
