# Audit completo del progetto

Data verifica: 8 settembre 2026. Audit eseguito sul commit base `f53a076` e aggiornato dopo le correzioni sicure descritte in fondo.

> **Nota successiva:** questo documento fotografa lo stato precedente alla prima fase core. Per lo stato aggiornato di QR, operatori, ruoli, richieste, arrivi, griglia, rettifiche, centrale, A001 e soglie consultare [`FASE_CORE.md`](FASE_CORE.md).

## Criterio

Gli stati non indicano la semplice presenza di un nome nell'interfaccia, ma il comportamento verificabile nel codice e, quando possibile, tramite test. I link temporanei dei mockup non sono accessibili dal container; pertanto la fedeltà visuale pixel-level non è verificabile.

## Verifica analitica

### 1. Architettura generale — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `package.json`, `src/app/`, `src/data/db.ts`, `src/app/api/sync/route.ts`, `.env.example`, `README.md`. Next.js App Router, React, TypeScript, Dexie, API route, manifest e configurazione Vercel sono predisposti. Le credenziali sono solo variabili server. L'API è però un mock in memoria senza vero adapter Google, pull o riconciliazione. La build non è verificabile finché il registry blocca le dipendenze. **Da correggere:** adapter remoto completo e build CI riproducibile.

### 2. Grafica e design — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/app/globals.css`, `src/components/WarehouseApp.tsx`. Palette antracite/corallo, card, bordi arrotondati, bottom navigation e layout mobile-first sono coerenti internamente; non sono usati sfondi Sigma né nomi reali. I mockup non erano accessibili e non esiste una verifica visual regression. **Da correggere:** confronto reale con file persistenti, screenshot smartphone/tablet/desktop, integrazione del logo fornito.

### 3. Home — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/components/WarehouseApp.tsx` (`Home`, header, nav). Sono raggiungibili Magazzino, Ricambi, Richieste, Storico e Impostazioni; esistono badge Aggiornato/pending/Offline e controllo manuale cliccabile. Mancano Ricezione ricambi e Ordini come flussi distinti; “Aggiorna” non è etichettato esplicitamente e non esiste sync automatica al ritorno online.

### 4. Ricerca ricambi — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `WarehouseApp.tsx` (`filtered`, `Parts`), `src/data/db.ts`. Filtra localmente codice, nome e descrizione, include articoli a quantità zero e mostra “Ricambio non trovato”. Preferiti sono mostrati in Home. Mancano recenti, indicizzazione esplicita/benchmark e test automatici. Il dataset in memoria proviene da IndexedDB dopo il boot, quindi lavora offline.

### 5. QR code — ❌ NON IMPLEMENTATO
**File:** `WarehouseApp.tsx` bottom nav. Il pulsante inserisce un codice demo fisso; non apre fotocamera, non decodifica QR e non testa codice sconosciuto. Serve scanner reale con permessi Android e fallback.

### 6. Scheda ricambio — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `WarehouseApp.tsx` (`Detail`). Mostra descrizione, codice, quantità buoni, minimo, distribuzione delle sole locazioni non vuote, note persistenti presenti nel record e ultimi tre movimenti; offre Movimenta, Copia e Condividi. Mancano azioni dedicate Richiedi/Centrale/storico completo, categorie a zero visibili e deep route reale.

### 7. Ricambi buoni e griglia — ⚠️ IMPLEMENTATO MA CON PROBLEMI
**File:** `WarehouseApp.tsx` (`Warehouse`), `src/domain/types.ts`. La griglia grafica è rigidamente `Array.from({length:9})`; le celle non sono cliccabili. Prima della correzione il tipo ammetteva solo scomparti 1, 3 e 7; ora ammette scomparti dinamici e il modello `Bin` prevede posizione, span e abilitazione, ma nessuna UI/configurazione/persistenza li usa. Manager non può aggiungere, rimuovere o disabilitare celle.

### 8. Ricambi guasti — ✅ IMPLEMENTATO CORRETTAMENTE
**File:** `src/domain/inventory.ts`, `WarehouseApp.tsx` (`MoveSheet`, `saveMove`). Una movimentazione sottrae dall'origine, aggiunge a `guasti` e salva articolo e movimento nella stessa transazione Dexie. Il nuovo controllo impedisce stock negativo. Il comportamento base è coperto indirettamente dal test Buoni→Guasti.

### 9. Atti vandalici e straordinarie — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/domain/types.ts`, `WarehouseApp.tsx`. È una destinazione selezionabile e viene trattata come stock separato dalla logica generica. Non ha vista dedicata, dati demo o test specifico.

### 10. A001 — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/domain/inventory.ts`, `WarehouseApp.tsx`, `src/data/demo.ts`. A001 è stock separato e il form accetta nota opzionale. La correzione salva ogni ingresso annotato come lotto distinto e scala i lotti in uscita. Manca selezione esplicita del lotto da scaricare e test UI; il nuovo test dominio copre note separate.

### 11. In viaggio — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/domain/types.ts`, `WarehouseApp.tsx` (`Requests`). È visualizzato separatamente e movimentabile, ma il tipo dati non distingue formalmente stato logistico da locazione fisica e manca un flusso “registra in viaggio” dedicato.

### 12. Richiesto — ⚠️ IMPLEMENTATO MA CON PROBLEMI
**File:** `src/domain/inventory.ts`, `src/domain/inventory.test.ts`. I quattro casi quantitativi richiesti sono codificati e testati: primo ingresso scala richiesto, Viaggio→Buoni non lo riscala, arrivo diretto A001 lo scala, Buoni→Guasti non lo modifica. Tuttavia l'UI non può creare/aumentare, ridurre o annullare una richiesta e non offre normalmente un movimento senza origine, quindi parte della logica non è raggiungibile.

### 13. Movimentazioni — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `WarehouseApp.tsx` (`MoveSheet`, `saveMove`), `src/data/db.ts`. Origine, destinazione, quantità, nota, riepilogo, Annulla e Conferma esistono; update articolo+movimento è transazionale e immediato. La “conferma” è nello stesso sheet, non un secondo passo; manca feedback successo/error handling e prima della correzione il dominio non respingeva quantità invalide.

### 14. Storico — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `WarehouseApp.tsx` (`History`, `MovementRow`). Esiste registro completo globale e ultimi tre sul dettaglio; mostra data/ora, operatore, origine/destinazione, quantità e nota. Non esiste link dal dettaglio allo storico filtrato né protezione tecnica append-only contro delete.

### 15. Rettifiche — ❌ NON IMPLEMENTATO
**File:** solo enum `kind` in `src/domain/types.ts`. Nessun form Manager, differenza calcolata, motivo obbligatorio o movimento di rettifica operativo.

### 16. Invia al magazzino centrale — ⚠️ IMPLEMENTATO MA CON PROBLEMI
**File:** `WarehouseApp.tsx` (`labels`, `MoveSheet`). `centrale` è una destinazione generica, quindi quantità e nota sono disponibili e la sorgente diminuisce. Però viene incrementato uno stock `centrale`, non c'è azione dedicata dalla scheda né descrizione storico “Spedito al magazzino centrale”.

### 17. Copia codice — ✅ IMPLEMENTATO CORRETTAMENTE
**File:** `WarehouseApp.tsx` (`Detail`). Entrambi i controlli chiamano `navigator.clipboard.writeText(part.code)` e copiano esclusivamente il codice. Manca solo feedback visivo/fallback per browser senza Clipboard API.

### 18. Condividi — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `WarehouseApp.tsx` (`Detail`). Usa Web Share con nome, codice e `location.href`. Non esiste fallback e `location.href` resta la home perché non esiste route `/ricambi/[codice]`; quindi il deep link non è realmente implementato.

### 19. Scorta minima — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/domain/inventory.ts` (`goodQuantity`), `WarehouseApp.tsx` (`Home`, `Parts`, `Detail`). Il calcolo include solo chiavi `buoni-*`, correttamente escludendo guasti, vandalici, A001, viaggio e richiesto; alert e colore sotto soglia esistono. Manager non può modificare la soglia.

### 20. Operatori — ❌ NON IMPLEMENTATO
**File:** `WarehouseApp.tsx`. Ogni nuovo movimento usa sempre `MR`; non esiste schermata identificazione né persistenza del numero operatore.

### 21. Ruoli Base e Manager — ❌ NON IMPLEMENTATO
**File:** `WarehouseApp.tsx` (`Settings`). Le righe “Ruolo base” e “Accesso Manager” sono statiche e senza handler. Nessun PIN, autorizzazione o funzione Manager è realmente disponibile.

### 22. Export Excel — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `WarehouseApp.tsx` (`Settings.exportData`). `xlsx` crea realmente un workbook e invoca `writeFile`, ma contiene soltanto Articoli, Giacenze e Movimenti. Mancano Locazioni, Richieste, Configurazione e test del file generato. L'export non è limitato al Manager.

### 23. Tutorial — ❌ NON IMPLEMENTATO
**File:** `WarehouseApp.tsx` (`Settings`). Esiste soltanto una riga statica “Rivedi tutorial”; nessun tutorial alla prima apertura, passaggi o salta.

### 24. Offline-first — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/data/db.ts`, `WarehouseApp.tsx`, `public/sw.js`. Ricerca e movimenti usano dati locali; salvataggio articolo+movimento avviene prima della rete e il pending è visibile. Il Service Worker può servire shell/cache. Scenario browser completo non eseguito; apertura iniziale offline non è garantita finché una visita online non ha popolato asset e IndexedDB; ritorno online non avvia sync.

### 25. Sincronizzazione — ⚠️ IMPLEMENTATO MA CON PROBLEMI
**File:** `WarehouseApp.tsx` (`sync`), `src/app/api/sync/route.ts`. I nuovi movimenti hanno `crypto.randomUUID`; una singola richiesta mock deduplica gli ID e il pulsante invia pending. Mancano persistenza server idempotente tra richieste, pull remoto, auto-sync online, stato “Dati non allineati” ed error feedback. Il badge “pending” non equivale al conflitto richiesto.

### 26. Conflitti tra dispositivi — ❌ NON IMPLEMENTATO
**File:** `src/app/api/sync/route.ts`. `remoteChanges` è sempre vuoto; non ci sono cursori/versioni, simulazione, merge o UI “Dati non allineati”.

### 27. IndexedDB — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/data/db.ts`, `WarehouseApp.tsx` boot/persist. Parti e movimenti sono tabelle Dexie persistenti e vengono riletti all'avvio; il movimento è transazionale con snapshot. Meta esiste ma non viene usato; non ci sono test browser di refresh/chiusura e schema per locazioni/configurazione/richieste autonome.

### 28. Google Sheets — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `.env.example`, `README.md`, `src/app/api/sync/route.ts`. Segreti non sono referenziati dal client e mock locale esiste. README descrive il setup, ma afferma esplicitamente che l'adapter reale deve essere scritto: quindi Google Sheets non è implementato.

### 29. PWA — ⚠️ IMPLEMENTATO MA CON PROBLEMI
**File:** `public/manifest.webmanifest`, `public/icon.svg`, `public/sw.js`, `src/app/layout.tsx`. Manifest standalone, lingua, colori, icona SVG e registrazione SW esistono. Mancano icone PNG nelle misure comunemente attese, screenshot manifest e test installabilità/Lighthouse. Il SW non rimuove cache vecchie e la strategia network-first può tentare rete a ogni navigazione.

### 30. Responsive — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/app/globals.css`. Layout con massimo 760px, breakpoint desktop, griglie e bottom nav mobile sono predisposti. Nessuna verifica reale a viewport Android/tablet/desktop; alcuni controlli hanno font 10–12px e touch target/nav non sempre esplicitamente 48px.

### 31. Prestazioni — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `WarehouseApp.tsx`. Ricerca in memoria usa `useMemo` ed è adeguata per ~200 elementi; non fa richieste server durante la ricerca. Il monolite ricalcola diverse aggregazioni ad ogni render e non esistono benchmark/profiling. Il bundle include import dinamico xlsx solo all'export, elemento positivo.

### 32. Stati UI — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `WarehouseApp.tsx`, `globals.css`. Presenti no-results/empty, Offline, pending/syncing e conferma movimento. Mancano loading iniziale esplicito, errore sync, successo azione, errori clipboard/share/camera e empty state per richieste/storico.

### 33. Test automatici — 🟡 IMPLEMENTATO PARZIALMENTE
**File:** `src/domain/inventory.test.ts`. Esistono quattro test richiesti sulla logica Richiesto; dopo l'audit sono stati aggiunti test per note A001 e quantità invalide. Mancano offline/IndexedDB, idempotenza tra richieste, QR valido/sconosciuto, export, PWA e test componenti/E2E.

### 34. Build e qualità codice — ⚠️ IMPLEMENTATO MA CON PROBLEMI
**File:** intero progetto. I comandi sono definiti. `npm install` fallisce con 403 del registry su `@eslint/eslintrc`; di conseguenza lint/typecheck/test/build non possono essere eseguiti con dipendenze complete. `WarehouseApp.tsx` è un componente monolitico e fortemente minificato, difficile da mantenere. `git diff --check` passa.

### 35. Verifica finale — 🟡 IMPLEMENTATO PARZIALMENTE
Il repository è un prototipo local-first utile, ma non soddisfa l'intera specifica e non è pronto per produzione o multi-device. Le mancanze critiche sono sincronizzazione/conflitti reali, ruoli/autenticazione, flussi richieste/rettifiche e verifica build/browser.

## Correzioni sicure applicate durante l'audit

1. Generalizzato `Place` per supportare qualunque scomparto `buoni-N` e aggiunto modello `Bin` con coordinate, span e abilitazione.
2. Aggiunta validazione dominio per quantità intere positive e disponibilità sufficiente, evitando stock negativo.
3. Resa persistente nel record articolo ogni nota A001 come lotto separato; lo scarico A001 riduce coerentemente i lotti.
4. Aggiunti test unitari per note A001 separate e quantità non valide.

## Tabella riassuntiva

| # | Funzione | Stato | Nota essenziale |
|---:|---|---|---|
| 1 | Architettura | 🟡 | Stack corretto, backend remoto incompleto |
| 2 | Design | 🟡 | Coerente internamente, mockup non verificabili |
| 3 | Home | 🟡 | Mancano Ricezione e Ordini |
| 4 | Ricerca | 🟡 | Locale corretta, recenti/test mancanti |
| 5 | QR | ❌ | Solo scorciatoia demo |
| 6 | Dettaglio | 🟡 | Informazioni principali, azioni incomplete |
| 7 | Griglia | ⚠️ | Visiva ma hardcoded/non cliccabile |
| 8 | Guasti | ✅ | Movimento transazionale corretto |
| 9 | Vandalici | 🟡 | Locazione generica, nessun flusso/test dedicato |
| 10 | A001 | 🟡 | Note ora persistenti; scelta lotto assente |
| 11 | In viaggio | 🟡 | Visualizzato, modello concettuale debole |
| 12 | Richiesto | ⚠️ | Regole testate, gestione UI assente |
| 13 | Movimenti | 🟡 | Core locale presente, feedback carente |
| 14 | Storico | 🟡 | Registro presente, filtro dettaglio assente |
| 15 | Rettifiche | ❌ | Nessun flusso operativo |
| 16 | Centrale | ⚠️ | Destinazione generica, semantica errata |
| 17 | Copia codice | ✅ | Copia solo codice |
| 18 | Condividi | 🟡 | Web Share sì, deep link no |
| 19 | Scorta minima | 🟡 | Calcolo corretto, modifica Manager no |
| 20 | Operatori | ❌ | Operatore hardcoded |
| 21 | Ruoli | ❌ | UI statica, nessun controllo |
| 22 | Excel | 🟡 | 3 fogli su 6, non testato |
| 23 | Tutorial | ❌ | Solo voce statica |
| 24 | Offline-first | 🟡 | Scrittura locale sì, E2E/auto-sync no |
| 25 | Sync | ⚠️ | Mock non persistente, stati incompleti |
| 26 | Conflitti | ❌ | Nessuna riconciliazione |
| 27 | IndexedDB | 🟡 | Persistenza core sì, test browser no |
| 28 | Google Sheets | 🟡 | Configurazione sì, adapter reale no |
| 29 | PWA | ⚠️ | Asset base sì, installabilità non verificata |
| 30 | Responsive | 🟡 | CSS mobile-first, nessun test viewport |
| 31 | Prestazioni | 🟡 | Adatto a 200 record, nessun benchmark |
| 32 | Stati UI | 🟡 | Stati base, errori/feedback mancanti |
| 33 | Test | 🟡 | 7 test dominio, molti scenari mancanti |
| 34 | Build/qualità | ⚠️ | Install bloccata; monolite da rifattorizzare |
| 35 | Completezza | 🟡 | Prototipo, non V1 pronta |

## Mancanze da completare

### CRITICA
- Implementare pull incrementale, cursore server, idempotenza persistente e riconciliazione multi-device con stato “Dati non allineati”.
- Implementare adapter Google Sheets reale e testarlo con credenziali di staging.
- Rendere operativi ruoli/autorizzazioni e PIN Manager server-side.
- Ripristinare installazione dipendenze ed eseguire con successo lint, typecheck, test e build.

### ALTA
- Scanner QR reale con fotocamera Android e test QR valido/sconosciuto.
- CRUD richieste (aumenta/riduci/annulla), ricezione diretta e passaggio In viaggio.
- Rettifica Manager append-only con motivo obbligatorio.
- Griglia persistente/configurabile e contenuto cella cliccabile.
- Flusso dedicato “Invia al magazzino centrale”.
- Identificazione operatore persistente.

### MEDIA
- Export a sei fogli con test del workbook.
- Deep route `/ricambi/[codice]`, storico ricambio completo, recenti e feedback azioni/errori.
- Tutorial reale e configurazione soglia/articoli/locazioni Manager.
- Test E2E offline, refresh IndexedDB e viewport multipli.

### BASSA
- Icone PWA PNG/screenshot manifest, Lighthouse e visual regression.
- Rifattorizzare il componente monolitico in moduli e aggiungere benchmark ricerca.
