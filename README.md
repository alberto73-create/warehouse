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

## Decisioni V1

La griglia demo è 3×3 ma le ubicazioni sono chiavi dati, non quantità aggregate hardcoded. Lo scanner nel prototipo porta al flusso ricerca; l'integrazione fotocamera può usare `BarcodeDetector` con fallback a una libreria QR. Il numero operatore demo è `MR`; nessun nome reale è incluso. L'export `.xlsx` genera i fogli Articoli, Giacenze e Movimenti ed è strutturato per aggiungere Locazioni, Richieste e Configurazione.
