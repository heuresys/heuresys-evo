# RTGB hardening — Cantiere B

Source of Truth: `/home/ubuntu/heuresys.com.evo/ROAD_TO_GLORY_EVO_HARDENING.md`

Repo target: `/home/ubuntu/heuresys-evo` — mirror GitHub privato `heuresys/heuresys-evo`.

## Comandi giornalieri

```bash
cd /home/ubuntu/heuresys-evo
./scripts/hardening/next.sh      # cosa devo fare adesso?
./scripts/hardening/check.sh     # gate tier corrente
./scripts/hardening/done.sh      # commit + tag task completato
./scripts/hardening/status.sh    # dashboard HTML hardening progress
```

## State machine

`.rtg-state-evo/state.json` contiene l'indice completo task B0..B12 + progress.

Phase corrente e task corrente sono campi top-level: `current_phase`, `current_task`.

## Tag namespace

- `rtgb/init` — baseline iniziale (post B0.1)
- `rtgb/phase<N>/done` — gate Phase chiuso (N = 0..11)
- `rtgb/v1.0-evo-hardened` — milestone finale Cantiere B (post B12)

## Closure report

Al gate B12, generare `docs/hardening/closure-report.md` che mappa ogni red flag della §2 → fix commit → metric finale.
