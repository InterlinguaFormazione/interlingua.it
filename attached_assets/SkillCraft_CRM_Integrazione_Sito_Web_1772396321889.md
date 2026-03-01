# SkillCraft CRM --- Guida Integrazione Sito Web

## Panoramica

Il CRM espone un'API webhook che permette al sito web di registrare
automaticamente nuove richieste dei clienti. Ogni richiesta dal sito:

1.  Crea un nuovo cliente (o aggiorna uno esistente se l'email è già
    presente)
2.  Registra l'interesse per un corso (se specificato)
3.  Crea un log attività tracciabile nel CRM

------------------------------------------------------------------------

## Autenticazione

Tutte le chiamate richiedono un'**API key** nell'header:

    X-Api-Key: sk-webhook-test123

La chiave è configurata nel `.env` del CRM come `WEBHOOK_API_KEY`:

    WEBHOOK_API_KEY=sk-webhook-test123

------------------------------------------------------------------------

## Endpoint

### `POST /api/webhook/nuova-richiesta`

Registra una nuova richiesta dal sito web.

**URL completo:**\
`https://crm-privati.skillcraft.it/api/webhook/nuova-richiesta`

#### Request Body (JSON)

  -----------------------------------------------------------------------------
  Campo               Tipo      Obbligatorio  Descrizione
  ------------------- -------- -------------- ---------------------------------
  `email`             string         ✅       Email del cliente

  `nome`              string         ✅       Nome del cliente

  `cognome`           string         ❌       Cognome

  `cellulare`         string         ❌       Numero cellulare

  `telefono`          string         ❌       Telefono fisso

  `citta`             string         ❌       Città di residenza

  `provincia`         string         ❌       Sigla provincia (es. "MI")

  `corso_interesse`   string         ❌       Nome del corso richiesto

  `livello`           string         ❌       Livello autovalutazione (es.
                                              "B1")

  `messaggio`         string         ❌       Messaggio libero del cliente

  `come_conosciuto`   string         ❌       Come ha trovato SkillCraft
                                              (default: "Sito Web")

  `source`            string         ❌       Pagina/form di provenienza
                                              (default: "website")
  -----------------------------------------------------------------------------

------------------------------------------------------------------------

### Esempio richiesta (JavaScript)

``` javascript
const response = await fetch('https://crm-privati.skillcraft.it/api/webhook/nuova-richiesta', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'sk-webhook-test123',
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
```

------------------------------------------------------------------------

### Esempio con Python

``` python
import requests

response = requests.post(
    'https://crm-privati.skillcraft.it/api/webhook/nuova-richiesta',
    headers={
        'Content-Type': 'application/json',
        'X-Api-Key': 'sk-webhook-test123',
    },
    json={
        'email': 'mario.rossi@email.com',
        'nome': 'Mario',
        'corso_interesse': 'Inglese B2',
    }
)

print(response.json())
```

------------------------------------------------------------------------

### GET /api/webhook/status

``` bash
curl -H "X-Api-Key: sk-webhook-test123" https://crm-privati.skillcraft.it/api/webhook/status
```

------------------------------------------------------------------------

### GET /api/webhook/corsi-disponibili

``` bash
curl -H "X-Api-Key: sk-webhook-test123" https://crm-privati.skillcraft.it/api/webhook/corsi-disponibili
```

------------------------------------------------------------------------

## Setup nel CRM

Nel file `.env`:

    WEBHOOK_API_KEY=sk-webhook-test123
    CORS_ORIGIN=http://localhost:5173,https://il-tuo-sito.replit.app

Test con curl:

``` bash
curl -X POST https://crm-privati.skillcraft.it/api/webhook/nuova-richiesta   -H "Content-Type: application/json"   -H "X-Api-Key: sk-webhook-test123"   -d '{"email":"test@test.com","nome":"Test","corso_interesse":"Inglese B1"}'
```
