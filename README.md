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

## Google Sheets

1. Creare un progetto Google Cloud, abilitare **Google Sheets API** e creare un Service Account.
2. Condividere il foglio con l'e-mail del Service Account come editor.
3. Creare i tab `ARTICOLI`, `LOCAZIONI`, `SCOMPARTI`, `MOVIMENTI`, `RICHIESTE`, `CONFIGURAZIONE`, `SYNC_META`. `MOVIMENTI` deve rimanere append-only e avere `id` UUID come chiave idempotente.
4. In Vercel configurare `DATA_ADAPTER=google`, `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` e `MANAGER_PIN`. Nella chiave privata codificare gli a-capo come `\n`.
5. Sostituire l'implementazione mock di `src/app/api/sync/route.ts` con un adapter server-only che: indicizza gli UUID già acquisiti, accoda soltanto i nuovi movimenti, aggiorna snapshot e `SYNC_META`, quindi restituisce modifiche successive al cursore client. Non importare mai credenziali in componenti client.

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

La griglia demo è attualmente 3×3 e deve ancora essere resa configurabile. Lo scanner nel prototipo porta al flusso ricerca; l'integrazione fotocamera potrà usare `BarcodeDetector` con fallback a una libreria QR. Il numero operatore demo è `MR`; nessun nome reale è incluso. L'export `.xlsx` genera per ora i fogli Articoli, Giacenze e Movimenti.

## Risoluzione errore Vercel `404: NOT_FOUND`

La route `/` è presente in `src/app/page.tsx`. Una pagina Vercel bianca con codice globale `NOT_FOUND` (anziché la pagina 404 di Next.js) indica normalmente che l'URL di deployment non esiste più, è stato sostituito oppure non è quello assegnato al deployment corrente.

1. In Vercel aprire **Project → Settings → General** e impostare **Framework Preset: Next.js** e **Root Directory: `.`** (la cartella contenente `package.json`).
2. In **Deployments**, aprire l'ultimo deployment riuscito e usare **Visit**; non riutilizzare un vecchio URL preview copiato prima di un redeploy.
3. Verificare che la branch collegata contenga il commit più recente e avviare **Redeploy** senza usare la cache se il deployment precedente è incompleto.
4. Controllare i log: devono essere eseguiti `npm install` e `npm run build`. Il file `vercel.json` nel repository fissa esplicitamente framework e comandi.
5. Dopo il deploy verificare prima `/api/health`: deve rispondere con `{"status":"ok","application":"magazzino-tecnico"}`, poi aprire `/`.
6. Se un dominio personalizzato o alias continua a dare 404, riassegnarlo al deployment corrente da **Settings → Domains**.

Non impostare **Output Directory**: Next.js la gestisce automaticamente. Non configurare il progetto come “Other” o come sito statico, perché l'app contiene route API server-side.
