# User communication template (RTG Phase 5 task 5.11)

**Audience**: 4 active tenant stakeholders (Heuresys System, RTL Bank, SmartFood, EcoNova)
**Owner-action**: OA-6.2 (Enzo to send 24h before cutover)

> Use these templates verbatim or with minor copy edits. Keep tone professional,
> action-oriented, calibrated to enterprise HR audience.

---

## 1. T-24h banner (in-app + email)

### In-app banner (top of every page on legacy `.com.evo`)

```
🔧 Manutenzione programmata — Heuresys evo lancio il <DATE> alle <TIME> CEST.
   Il sistema sarà offline per ~10 minuti. Tutti i dati saranno preservati.
   Vedi maggiori dettagli: <link to status page>
```

### Email (HTML + plaintext)

**Subject**: Manutenzione programmata Heuresys — passaggio a evo `<DATE>` alle `<TIME>`

**Body**:

```
Buongiorno,

Vi informiamo che il prossimo <DATE> tra le <TIME> e le <TIME+30min> CEST
effettueremo il passaggio della piattaforma Heuresys all'ambiente evo
(infrastruttura aggiornata).

Cosa cambia per voi:
- Disservizio breve: ~10 minuti durante il passaggio
- Tutti i dati e le configurazioni sono preservati identici
- Login con le stesse credenziali
- URL invariato (heuresys.com.evo)
- Workflow operativi (employee portal, leave approval, performance reviews,
  audit logs) preservati 1:1
- Nuove pagine secondarie (admin recruiting, compensation analytics, ecc.)
  presentano un design rinnovato — funzionalità invariata

Cosa fare:
1. Programmare di evitare attività critiche durante la finestra <TIME> CEST
2. Salvare il lavoro in corso prima delle <TIME-15min> CEST
3. Dopo le <TIME+15min> CEST, fare logout e nuovo login per ricaricare la sessione

In caso di problemi post-cutover, contattare:
- Email: support@heuresys.com
- Telefono d'emergenza: <TBD>

Grazie per la collaborazione.

Team Heuresys
```

---

## 2. T-15min cutover-imminent banner (legacy only)

```
⏱️ Cutover Heuresys evo IN CORSO tra 15 minuti — alle <TIME> CEST.
   Salvare il lavoro in corso. Sistema offline ~10 minuti dalle <TIME>.
```

---

## 3. T0 cutover-active page (during 5-10min downtime)

Replace legacy + evo with maintenance HTML (Nginx 503 with custom body):

```html
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><title>Heuresys — Manutenzione in corso</title>
<style>
body{font-family:system-ui;max-width:600px;margin:8rem auto;padding:0 1rem;text-align:center;color:#222}
h1{color:#0a3d62}
.spinner{display:inline-block;width:40px;height:40px;border:4px solid #f0f4f8;border-top-color:#0a3d62;border-radius:50%;animation:spin 1s linear infinite;margin:1rem 0}
@keyframes spin{to{transform:rotate(360deg)}}
</style></head>
<body>
<div class="spinner"></div>
<h1>Heuresys — Manutenzione programmata in corso</h1>
<p>Stiamo aggiornando la piattaforma all'infrastruttura evo.<br>
Tornerà online entro pochi minuti.</p>
<p><small>Inizio: <TIME> CEST · Fine prevista: <TIME+10min> CEST</small></p>
</body>
</html>
```

Configurato in Nginx vhost durante cutover step 2:

```nginx
# Temporary during cutover
location / {
  return 503;
  error_page 503 /maintenance.html;
}
location = /maintenance.html {
  root /var/www/heuresys;
  internal;
}
```

---

## 4. T+5min cutover-complete email

**Subject**: ✅ Heuresys evo online — manutenzione completata

**Body**:

```
Buongiorno,

Il passaggio a Heuresys evo è stato completato con successo alle <TIME> CEST.

Il sistema è ora pienamente operativo all'indirizzo abituale (heuresys.com.evo).

Vi invitiamo a:
1. Effettuare logout + nuovo login per ricaricare la sessione
2. Verificare brevemente i workflow critici (employee portal, leave management)
3. Segnalare eventuali anomalie a support@heuresys.com entro le prossime 48h
   (finestra di rollback in caso di issue critiche)

Grazie per la pazienza durante la manutenzione.

Team Heuresys
```

---

## 5. T+48h close-rollback-window email (internal-only)

**Audience**: Heuresys team + Enzo

**Subject**: Heuresys evo cutover — rollback window CHIUSA

**Body**:

```
Cutover evo completato 48h fa, finestra di rollback ora chiusa.

Stato attuale:
- Tickets ricevuti: <N>
- P0 issues: <N> (tutti risolti / in corso)
- P1/P2 issues: <N>
- Performance: p95 evo <X>ms vs legacy <Y>ms (regressione: <Z>%)

Prossimo step: avvio Phase 6 task 6.10 — decommissioning legacy stack
(window di osservazione +2 settimane stabilizzazione, poi shutdown legacy).

— ops
```

---

## 6. Rollback comm (in caso di STOP-AUTONOMO-5)

**Subject**: 🔄 Heuresys — rollback temporaneo per problema tecnico

**Body**:

```
Buongiorno,

Durante il passaggio a Heuresys evo abbiamo identificato un problema critico
relativo a <X> e abbiamo ripristinato il sistema legacy precedente.

Il sistema è operativo all'indirizzo abituale.

Stiamo lavorando per risolvere il problema; comunicheremo una nuova data
per il passaggio appena risolto.

Nessun dato è stato perso. Le attività della scorsa giornata sul sistema
evo (post-cutover) sono state preservate e saranno integrate al prossimo
tentativo.

Grazie per la pazienza.

Team Heuresys
```

---

## Comm channel matrix

| Audience                                           | Channel               | When                                       |
| -------------------------------------------------- | --------------------- | ------------------------------------------ |
| Tenant admins                                      | Email + in-app banner | T-24h                                      |
| All users                                          | In-app banner         | T-15min, T0 (maintenance), T+0min (online) |
| Tenant admins                                      | Email                 | T+5min (online)                            |
| Heuresys ops                                       | Slack/Teams internal  | T-24h, T-1h, T0, T+5min, T+24h, T+48h      |
| Stakeholders (CEO Enzo + investitori se rilevante) | Email summary         | T+24h, T+7d                                |

## Translation note

Templates sono in italiano (audience B2B Italia). Per tenant internazionali
(es. SmartFood se UK) preparare versione inglese parallela. Mantenere
consistency su orario CEST + tempi (10min downtime, 48h rollback).
