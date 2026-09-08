# Magazzino tecnico

PWA italiana, mobile-first e local-first per gestire un piccolo magazzino di ricambi. La UI legge subito IndexedDB; ogni movimento aggiorna localmente la giacenza e crea un'operazione UUID `pending`, poi l'endpoint di sync la acquisisce in modo idempotente.

## Avvio

```bash
npm install
cp .env.example .env.local
npm run dev
```

Aprire `http://localhost:3000`. La prima visita inizializza dati demo realistici. Per verificare la versione di produzione: `npm run build && npm start`.

## Architettura

- **Next.js App Router / TypeScript**: shell PWA, UI e API Vercel.
- **Dexie / IndexedDB**: tabelle `parts` (snapshot corrente), `movements` (registro append-only) e `meta` (cursore/versione sync).
- **Service worker**: cache dell'application shell e strategia network-first con fallback cache. I dati operativi non dipendono dalla cache HTTP.
- **Sync**: l'UI salva prima snapshot e movimento nella stessa transazione locale. `POST /api/sync` accetta UUID e restituisce quelli acquisiti; l'adapter mock è già usabile senza credenziali.
- **Dominio**: `Richiesto` è una quantità attesa, `In viaggio` uno stato logistico e le altre destinazioni sono fisiche. L'ingresso di una fornitura scala `Richiesto`; il passaggio successivo da `In viaggio` a una posizione fisica non lo scala di nuovo.

## Google Sheets — struttura definitiva

Creare **esattamente sette tab**, con i nomi maiuscoli riportati sotto. La riga 1 contiene le intestazioni; i dati iniziano dalla riga 2.

| Tab | Colonne, in ordine | Lettura/scrittura | Chiave e strategia |
|---|---|---|---|
| `ARTICOLI` | A `code`, B `updatedAt`, C `updatedBy`, D `json` | Catalogo, descrizione, soglia, note e snapshot giacenze | `(code, updatedAt, updatedBy)`; versionato append-only, ultimo LWW |
| `LOCAZIONI` | A `id`, B `updatedAt`, C `updatedBy`, D `json` | Nome e tipo delle aree fisiche/logistiche | `(id, updatedAt, updatedBy)`; versionato append-only |
| `SCOMPARTI` | A `id`, B `updatedAt`, C `updatedBy`, D `json` | Etichetta, posizione, span e abilitazione | `(id, updatedAt, updatedBy)`; versionato append-only |
| `MOVIMENTI` | A `id`, B `createdAt`, C `code`, D `quantity`, E `from`, F `to`, G `operator`, H `note`, I `kind`, J `delta` | Registro eventi completo | `id` UUID; append-only e idempotente |
| `RICHIESTE` | A `code`, B `updatedAt`, C `updatedBy`, D `json` | Quantità richiesta e in viaggio per codice | `(code, updatedAt, updatedBy)`; versionato append-only |
| `CONFIGURAZIONE` | A `id`, B `updatedAt`, C `updatedBy`, D `json` | Configurazione generale del magazzino | `(id, updatedAt, updatedBy)`; versionato append-only |
| `SYNC_META` | A `key`, B `value`, C `updatedAt`, D `deviceId` | Audit del cursore dopo ogni sync | append-only; `key=cursor` |

Il campo `json` contiene l'intero record JSON ed è il payload letto dal bootstrap. `ARTICOLI.stock` contiene le giacenze correnti riconciliate; `MOVIMENTI` consente audit e ricostruzione; `RICHIESTE` rende espliciti `requested` e `travelling`. Le collisioni delle entità versionate sono risolte deterministicamente sulla coppia `(updatedAt, updatedBy)`.

### Configurazione

1. Creare un progetto Google Cloud, abilitare **Google Sheets API** e creare un Service Account.
2. Condividere il foglio con `GOOGLE_CLIENT_EMAIL` come editor.
3. Creare i sette tab e le intestazioni sopra, senza rinominarli.
4. In Vercel impostare `DATA_ADAPTER=google`, `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `MANAGER_PIN` e `MANAGER_TOKEN_SECRET`. Nella chiave privata rappresentare gli a-capo con `\n`.
5. `MANAGER_TOKEN_SECRET` deve essere una stringa casuale lunga (almeno 32 caratteri) usata per firmare token Manager con scadenza di 8 ore. Non usare prefissi `NEXT_PUBLIC_`: l'adapter e le credenziali restano esclusivamente server-side.

La modalità `DATA_ADAPTER=mock` serve solo allo sviluppo e non offre persistenza tra cold start serverless.

## Deploy Vercel

Importare il repository in Vercel, selezionare Next.js, aggiungere le variabili precedenti e distribuire. HTTPS è necessario per installazione PWA, Service Worker, fotocamera QR e Web Share API.

## Offline e conflitti

Le azioni rimangono utilizzabili offline e sono indicate come “da inviare”. Al ritorno dell'evento `online` possono essere sincronizzate; il pulsante di stato permette sempre il tentativo manuale. In produzione, se il cursore remoto è avanzato mentre esistono operazioni locali, mantenere entrambe le serie append-only, applicarle in ordine `(createdAt, UUID)` e mostrare “Dati non allineati” fino alla riconciliazione. Una correzione è sempre un nuovo movimento/rettifica, mai la cancellazione dello storico.

## Comandi

- `npm run lint` — lint Next/React.
- `npm run typecheck` — controllo TypeScript.
- `npm test` — regole quantitative principali.
- `npm run build` — build di produzione.

## Stato di implementazione e decisioni V1

Questa revisione è un prototipo parziale e non implementa ancora tutti i requisiti della specifica originale. L'[audit completo in 35 punti](docs/AUDIT_COMPLETO.md) verifica comportamento, problemi e priorità; la [verifica sintetica precedente](docs/VERIFICA_REQUISITI.md) resta disponibile come cronologia.

La [prima fase di completamento core](docs/FASE_CORE.md) documenta il confronto prima/dopo per scanner QR, operatori, ruoli, richieste, arrivi, griglia, rettifiche, spedizioni, A001 e scorta minima.


## Risoluzione errore Vercel `404: NOT_FOUND`

La route `/` è presente in `src/app/page.tsx`. Una pagina Vercel bianca con codice globale `NOT_FOUND` (anziché la pagina 404 di Next.js) indica normalmente che l'URL di deployment non esiste più, è stato sostituito oppure non è quello assegnato al deployment corrente.

1. In Vercel aprire **Project → Settings → General** e impostare **Framework Preset: Next.js** e **Root Directory: `.`** (la cartella contenente `package.json`).
2. In **Deployments**, aprire l'ultimo deployment riuscito e usare **Visit**; non riutilizzare un vecchio URL preview copiato prima di un redeploy.
3. Verificare che la branch collegata contenga il commit più recente e avviare **Redeploy** senza usare la cache se il deployment precedente è incompleto.
4. Controllare i log: devono essere eseguiti `npm install` e `npm run build`. Il file `vercel.json` nel repository fissa esplicitamente framework e comandi.
5. Dopo il deploy verificare prima `/api/health`: deve rispondere con `{"status":"ok","application":"magazzino-tecnico"}`, poi aprire `/`.
6. Se un dominio personalizzato o alias continua a dare 404, riassegnarlo al deployment corrente da **Settings → Domains**.

Non impostare **Output Directory**: Next.js la gestisce automaticamente. Non configurare il progetto come “Other” o come sito statico, perché l'app contiene route API server-side.

## Sincronizzazione V1 e Google Sheets

L’adapter legge e scrive tutti i sette tab descritti nella sezione **Google Sheets — struttura definitiva**. Il client mantiene il cursore in IndexedDB, invia operazioni pending e catalogo locale, quindi persiste atomicamente il bootstrap remoto. La specifica tabellare estesa è disponibile in [`docs/GOOGLE_SHEETS_SCHEMA.md`](docs/GOOGLE_SHEETS_SCHEMA.md).

## Fase 2

La [verifica della Fase 2](docs/FASE_2.md) descrive implementazione e limiti; l’[audit finale in 35 punti](docs/AUDIT_FINALE_V1.md) non dichiara la V1 pronta finché build, Android/offline e Google staging non sono verificati.
