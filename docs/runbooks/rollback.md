# Runbook: Rollback

## Scenario

Una phase RTGB o un commit produce regressioni inaspettate. Bisogna tornare allo stato pre-modifica con minimal disruption.

## Prerequisiti

- Accesso al repo locale `/home/ubuntu/heuresys-evo`
- Credenziali GitHub `gh auth status` OK
- Tag RTGB `rtgb/phase<N>/done` corrispondente al pre-stato disponibile (`git tag | grep rtgb`)

## Decision tree

| Scope                          | Strumento                                                   |
| ------------------------------ | ----------------------------------------------------------- |
| Singolo commit RTGB            | `scripts/hardening/rollback.sh` (revert commit, no rewrite) |
| Multipli commit, ancora locali | `git reset --hard <pre-tag>` (richiede force-push)          |
| Phase intera, già pushata      | Sequence di `git revert` su tutti i commit della phase      |
| Repository corrupto (estremo)  | Re-clone da `rtgb/<tag>`                                    |

## Steps — singolo commit (più comune)

```bash
cd /home/ubuntu/heuresys-evo
./scripts/hardening/rollback.sh
# Conferma con y; il script crea un commit revert e lascia state.json invariato
```

Lo script chiede conferma esplicita prima di operare.

## Steps — phase intera (rara)

```bash
cd /home/ubuntu/heuresys-evo

# 1. Identifica la phase target e i commit della phase
PHASE=B7
git log --grep "\[RTGB\]\[PH${PHASE}-" --format=%H | tac > /tmp/commits-to-revert.txt

# 2. Revert ogni commit in ordine cronologico
while read sha; do
  git revert --no-edit "$sha"
done < /tmp/commits-to-revert.txt

# 3. Push
git push

# 4. Aggiorna state.json: phase tornata a "pending"
jq ".phases.B${PHASE}.status = \"pending\"" .rtg-state-evo/state.json > /tmp/s.json && \
  mv /tmp/s.json .rtg-state-evo/state.json
git add -A && git commit -m "[RTGB][REVERT] phase B${PHASE} fully reverted; state.json reset"
git push
```

## Steps — re-clone (estremo, distructive)

```bash
# ATTENZIONE: distrugge il working dir locale. Usa solo se il repo è inservibile.

cd /home/ubuntu
mv heuresys-evo heuresys-evo.broken-$(date +%Y%m%d-%H%M%S)

git clone https://github.com/heuresys/heuresys-evo.git
cd heuresys-evo
git checkout rtgb/phase6/done   # o altro tag stabile
npm install
```

## Validation

Dopo qualsiasi rollback:

```bash
npm run typecheck   # 0 errori
npx vitest run      # tutti i test verdi
git status          # clean
git log --oneline | head -5   # vedi gli ultimi commit
```

## Common pitfalls

- **Force push su main**: NON usare `git push --force` su main mai (ADR-0005 conferma push diretto, ma il --force riscrive la storia condivisa con GitHub mirror). Preferire revert commit.
- **State.json drift**: dopo revert, lo state.json può divergere dal git log. Allineare manualmente.
- **Migration revert**: i revert su `db/migrations/*.sql` NON applicano automaticamente. Bisogna scrivere migration di reverse manualmente OPPURE `db/scripts/reset-test.sh` su DB target.
- **Tag già pushato**: tag pushati non si cancellano facilmente. `git tag -d <tag> && git push --delete origin <tag>` solo se il tag era errato; preferire creare un nuovo tag che sostituisce.
