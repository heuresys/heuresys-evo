# prompts

Prompt library versionata — system prompts, user prompts e template usati dai servizi LLM (principalmente `services/enrichment/`).

## Perché qui e non inline nel codice
- **Versionamento esplicito**: cambi al prompt visibili in diff, recensibili in PR
- **Riuso cross-service**: stesso prompt può essere consumato da `enrichment`, `app` (chat features), tooling
- **A/B testing**: facilita confronto tra varianti senza ricompilare codice
- **Audit**: history dei prompt = audit trail di come si è guidato il modello

## Struttura suggerita

```
prompts/
├── system/             # System prompt per ruoli LLM
│   ├── esco-extractor.md
│   ├── nace-classifier.md
│   └── skill-validator.md
├── tasks/              # Prompt task-specifici
│   ├── enrich-occupation.md
│   ├── verify-skill-mapping.md
│   └── generate-career-path.md
├── templates/          # Template parametrizzati (Mustache, Handlebars-like)
│   └── ...
└── evals/              # Eval set per benchmarking prompt
    └── <prompt-name>/cases.jsonl
```

## Convenzioni
- Un prompt per file `.md`
- Frontmatter obbligatorio: `name`, `version`, `model_target`, `last_eval_date`
- Versioning: bump major se cambia significato semantico, minor se rifinitura
- Codice carica prompt via path relativo, mai duplica testo prompt nel sorgente
- Eval set in `prompts/evals/<prompt-name>/cases.jsonl` — uno per riga, con expected output
- Diff di prompt in PR sempre revisionati da chi conosce il dominio (non solo dev)
