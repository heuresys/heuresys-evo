# Tabelle escluse dal data dictionary

> Le tabelle seguenti sono **escluse** da `catalog.json`, `schema.sql` filtered, e dai markdown di dominio. Sono presenti in `schema-raw.sql` per reference.

| Tabella              | Famiglia        | Motivo                                                                      |
| -------------------- | --------------- | --------------------------------------------------------------------------- |
| `_prisma_migrations` | Prisma infra    | Prisma migration state · strumentale, non dato applicativo                  |
| `account`            | NextAuth        | NextAuth provider account link · transiente · agente target ha proprio auth |
| `audit_logs`         | Audit           | Log eventi runtime · non importabile cross-DB · ricostruibile post-ingest   |
| `kg_edges`           | Knowledge graph | Knowledge graph derivato · ricomputabile da esco\_\*                        |
| `kg_nodes`           | Knowledge graph | Knowledge graph derivato · ricomputabile da esco\_\*                        |
| `session`            | NextAuth        | NextAuth session store · transiente · regenerable                           |
| `verification_token` | NextAuth        | NextAuth email-verify tokens · transiente                                   |

## Implicazioni FK

Foreign key che referenzano tabelle escluse sono mantenute nel catalog (`ref_excluded: true`) ma non hanno entry nei domain markdown sul lato target. La maggior parte dei riferimenti riguarda `users → account` (NextAuth account link) o `audit_logs` derivate, gestibili dall'agente target ridichiarando i propri equivalenti.
