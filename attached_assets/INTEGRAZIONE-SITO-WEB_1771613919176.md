# SkillCraft CRM — Guida Integrazione Sito Web

## Panoramica

Il CRM espone un'API webhook che permette al sito web di registrare automaticamente nuove richieste dei clienti. Ogni richiesta dal sito:

1. Crea un nuovo cliente (o aggiorna uno esistente se l'email è già presente)
2. Registra l'interesse per un corso (se specificato)
3. Crea un log attività tracciabile nel CRM

---

## Autenticazione

Tutte le chiamate richiedono un'**API key** nell'header:

```
X-Api-Key: sk-webhook-LA-TUA-CHIAVE-SEGRETA
```

La chiave è configurata nel `.env` del CRM come `WEBHOOK_API_KEY`.

---

## Endpoint

### `POST /api/webhook/nuova-richiesta`

Registra una nuova richiesta dal sito web.

**URL completo (esempio):** `https://crm.skillcraft.it/api/webhook/nuova-richiesta`

#### Request Body (JSON)

| Campo              | Tipo   | Obbligatorio | Descrizione                          |
|--------------------|--------|:------------:|--------------------------------------|
| `email`            | string | ✅           | Email del cliente                    |
| `nome`             | string | ✅           | Nome del cliente                     |
| `cognome`          | string | ❌           | Cognome                              |
| `cellulare`        | string | ❌           | Numero cellulare                     |
| `telefono`         | string | ❌           | Telefono fisso                       |
| `citta`            | string | ❌           | Città di residenza                   |
| `provincia`        | string | ❌           | Sigla provincia (es. "MI")           |
| `corso_interesse`  | string | ❌           | Nome del corso richiesto             |
| `livello`          | string | ❌           | Livello autovalutazione (es. "B1")   |
| `messaggio`        | string | ❌           | Messaggio libero del cliente         |
| `come_conosciuto`  | string | ❌           | Come ha trovato SkillCraft (default: "Sito Web") |
| `source`           | string | ❌           | Pagina/form di provenienza (default: "website")  |

#### Esempio richiesta

```javascript
// JavaScript / Replit
const response = await fetch('https://crm.skillcraft.it/api/webhook/nuova-richiesta', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'sk-webhook-LA-TUA-CHIAVE-SEGRETA',
  },
  body: JSON.stringify({
    email: 'mario.rossi@email.com',
    nome: 'Mario',
    cognome: 'Rossi',
    cellulare: '333-1234567',
    citta: 'Milano',
    corso_interesse: 'Inglese B2',
    livello: 'B1',
    messaggio: 'Vorrei informazioni sui corsi serali',
    source: 'form-contatti',
  }),
});

const data = await response.json();
console.log(data);
// {
//   success: true,
//   cliente_id: 42,
//   iscrizione_id: 15,
//   is_new_client: true,
//   message: 'Nuovo cliente "Mario Rossi" creato con successo'
// }
```

#### Esempio con Python

```python
import requests

response = requests.post(
    'https://crm.skillcraft.it/api/webhook/nuova-richiesta',
    headers={
        'Content-Type': 'application/json',
        'X-Api-Key': 'sk-webhook-LA-TUA-CHIAVE-SEGRETA',
    },
    json={
        'email': 'mario.rossi@email.com',
        'nome': 'Mario',
        'cognome': 'Rossi',
        'cellulare': '333-1234567',
        'corso_interesse': 'Inglese B2',
        'messaggio': 'Vorrei informazioni sui corsi serali',
    }
)

print(response.json())
```

#### Risposte

**201 Created — Successo:**
```json
{
  "success": true,
  "cliente_id": 42,
  "iscrizione_id": 15,
  "is_new_client": true,
  "message": "Nuovo cliente \"Mario Rossi\" creato con successo"
}
```

**400 Bad Request — Dati non validi:**
```json
{
  "error": "Dati non validi",
  "dettagli": ["email: Email non valida", "nome: Nome obbligatorio"]
}
```

**401 Unauthorized — API key errata:**
```json
{
  "error": "API key invalida"
}
```

---

### `GET /api/webhook/status`

Health check dell'integrazione.

```bash
curl -H "X-Api-Key: LA-TUA-CHIAVE" https://crm.skillcraft.it/api/webhook/status
```

Risposta:
```json
{
  "status": "ok",
  "service": "SkillCraft CRM Webhook",
  "timestamp": "2025-02-12T10:30:00.000Z"
}
```

---

### `GET /api/webhook/corsi-disponibili`

Restituisce la lista dei corsi/materie disponibili (utile per popolare dropdown nel form del sito).

```bash
curl -H "X-Api-Key: LA-TUA-CHIAVE" https://crm.skillcraft.it/api/webhook/corsi-disponibili
```

Risposta:
```json
{
  "corsi": ["Inglese A1", "Inglese B2", "Spagnolo A2", "Tedesco B1"]
}
```

---

## Comportamento

### Cliente nuovo (email non presente nel CRM)
- Viene creato un nuovo record cliente
- Status impostato a "Nuovo" (se esiste nel CRM)
- Urgenza impostata a 1
- `come_conosciuto` = "Sito Web" (default)
- Compare nella Dashboard tra i clienti da gestire

### Cliente esistente (email già nel CRM)
- Il record esistente viene aggiornato SOLO per i campi vuoti (cellulare, telefono, città, provincia)
- I campi già compilati NON vengono sovrascritti
- Viene comunque creata una nuova iscrizione/richiesta e un log

### Log attività
Ogni richiesta genera un log visibile nella scheda del cliente:
```
📩 Richiesta dal sito web (form-contatti) — Corso: Inglese B2 — Livello: B1 — Messaggio: Vorrei informazioni sui corsi serali
```

---

## Integrazione nel form HTML del sito

Ecco un esempio base di come collegare un form HTML esistente:

```html
<form id="contact-form">
  <input type="text" name="nome" placeholder="Nome" required />
  <input type="text" name="cognome" placeholder="Cognome" />
  <input type="email" name="email" placeholder="Email" required />
  <input type="tel" name="cellulare" placeholder="Cellulare" />
  <input type="text" name="citta" placeholder="Città" />
  <select name="corso_interesse">
    <option value="">Seleziona un corso...</option>
    <!-- Popolato dinamicamente o statico -->
  </select>
  <textarea name="messaggio" placeholder="Il tuo messaggio"></textarea>
  <button type="submit">Invia richiesta</button>
</form>

<script>
  const CRM_URL = 'https://crm.skillcraft.it/api/webhook/nuova-richiesta';
  const API_KEY = 'sk-webhook-LA-TUA-CHIAVE';

  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    data.source = 'pagina-contatti'; // Traccia da quale pagina arriva

    try {
      const res = await fetch(CRM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        alert('Grazie! Ti ricontatteremo al più presto.');
        e.target.reset();
      } else {
        alert('Errore: ' + (result.error || 'Riprova più tardi'));
      }
    } catch (err) {
      alert('Errore di connessione. Riprova più tardi.');
    }
  });
</script>
```

> **⚠️ Nota sicurezza:** L'API key è visibile nel codice client-side. Questo è accettabile perché l'endpoint può SOLO creare clienti e richieste (non leggere, modificare o cancellare dati). Per maggiore sicurezza, il sito Replit può fare la chiamata server-side dal proprio backend.

---

## Setup nel CRM

1. Aggiungi al file `.env` del backend CRM:
   ```
   WEBHOOK_API_KEY=sk-webhook-GENERA-UNA-CHIAVE-CASUALE
   CORS_ORIGIN=http://localhost:5173,https://il-tuo-sito.replit.app
   ```

2. Riavvia il backend

3. Testa con curl:
   ```bash
   curl -X POST https://localhost:3001/api/webhook/nuova-richiesta \
     -H "Content-Type: application/json" \
     -H "X-Api-Key: sk-webhook-LA-TUA-CHIAVE" \
     -d '{"email":"test@test.com","nome":"Test","corso_interesse":"Inglese B1"}'
   ```

---

## FAQ

**D: Cosa succede se lo stesso cliente invia più richieste?**
R: Viene riconosciuto tramite email. Il profilo non viene sovrascritto, ma viene creata una nuova iscrizione e un nuovo log per ogni richiesta.

**D: Posso personalizzare i campi?**
R: Sì. Tutti i campi tranne `email` e `nome` sono opzionali. Invia solo quelli che hai nel form.

**D: Come genero una chiave API sicura?**
R: Usa un generatore di password o esegui: `node -e "console.log('sk-webhook-' + require('crypto').randomBytes(32).toString('hex'))"`
