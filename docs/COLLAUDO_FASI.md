# Collaudo conclusivo Fase 1 e Fase 2

## Metodo e limiti

Sono stati verificati codice, transazioni, protocollo e test automatici. Il collaudo browser/device non è dichiarato superato: il registry del runner impedisce l'installazione, quindi non è stato possibile avviare Chromium, usare una fotocamera reale o riaprire IndexedDB in un browser.

## Fase 1

| Caso | Stato | Evidenza / limite |
|---|---|---|
| QR valido/sconosciuto | 🟡 | Ricerca testata; fotocamera reale non collaudata |
| Permesso negato/fallback/chiusura stream | 🟡 | Rami e cleanup implementati; test browser assente |
| Operatore e riapertura | 🟡 | Sessione in tabella Dexie; test lifecycle browser assente |
| Base/Manager | ⚠️ | UI nega controlli Manager al Base, ma manca autorizzazione server forte per modifiche catalogo |
| Richiesto/In viaggio | ✅ | Quattro regole dominio coperte |
| A001 due note | ✅ | Lotti separati persistiti nel record articolo |
| Griglia e riapertura | 🟡 | Tabella Dexie e contenuto celle; lifecycle browser non collaudato |
| Rettifica | ✅ | Movimento append-only con operatore, delta e motivo |
| Movimento offline/riapertura | 🟡 | Transazione e pending implementati; E2E offline assente |

## Cosa viene sincronizzato realmente

| Area | Stato | Persistente locale | Sync remoto | Recuperabile da nuovo dispositivo | Problemi |
|---|---|---:|---:|---:|---|
| Articoli | SYNC REMOTO | Sì | Sì, versioni JSON append-only `ARTICOLI` | Sì | Adapter Google non collaudato staging |
| Movimenti | SYNC REMOTO | Sì | Sì, append-only UUID `MOVIMENTI` | Sì | Richiede foglio e intestazioni corretti |
| Richieste | SYNC REMOTO | Sì, nello stock e movimento | Sì | Sì | Deriva da snapshot + registro |
| Locazioni | SYNC REMOTO | Sì | Sì, configurazione server corrente | Sì | Attualmente catalogo fisso, non editor remoto |
| Scomparti | SYNC REMOTO | Sì | Sì, versioni LWW `SCOMPARTI` | Sì | Collisioni risolte per updatedAt/device |
| Soglie minime | SYNC REMOTO | Sì nell'articolo | Sì in `ARTICOLI` | Sì | Modifica concorrente LWW |
| Configurazione | SYNC REMOTO | Sì | Sì | Sì | Configurazione generale ancora minima |
| Giacenze | SYNC REMOTO | Sì nello snapshot | Sì in `ARTICOLI`, riconciliate coi movimenti | Sì | Va collaudato con concorrenza reale |
| Operatore/sessione | LOCAL ONLY | Sì | No, intenzionale | No | Ogni telefono identifica il proprio operatore |

## Bootstrap telefono nuovo

Il protocollo ora restituisce un catalogo completo (`parts`, `bins`, `locations`, `configuration`) oltre al registro incrementale. Il client sostituisce il catalogo locale, salva tutte le entità e il cursore in un'unica transazione. Il mock contiene un test con dispositivo B vuoto. Questo chiude il vuoto architetturale precedente, ma Google Sheets deve ancora essere collaudato con credenziali reali.

## Concorrenza

- Movimenti: append-only, UUID, deduplica; se il cursore è arretrato, le operazioni pendenti vengono applicate in ordine al snapshot server.
- Articoli/soglie e scomparti: last-write-wins deterministico su `(updatedAt, updatedBy)`; a parità di timestamp vince lessicograficamente `updatedBy`.
- Il comportamento è testato sul mock con due dispositivi e su record LWW.

## Blocchi residui

1. Collaudo reale Google Sheets con Service Account, fogli preparati e cold start Vercel.
2. Test browser su Android per fotocamera, permesso negato, Service Worker, offline, chiusura/riapertura e IndexedDB.
3. Autorizzazione server-side delle mutazioni Manager: il PIN/UI locale non basta a proteggere richieste forgiate.
4. Toolchain completa (`lint`, `typecheck`, `test`, `build`) non eseguibile nel runner finché il registry restituisce 403.
