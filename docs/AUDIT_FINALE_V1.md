# Audit finale V1 — 35 punti

| # | Area | Stato | Verifica attuale |
|---:|---|---|---|
| 1 | Architettura | ✅ | Next App Router, React/TS, Dexie, API e adapter server |
| 2 | Design | 🟡 | UI coerente; confronto pixel mockup non ripetibile |
| 3 | Home | ✅ | Magazzino, Ricambi, Ricezione, Ordini/Richieste, Impostazioni e sync |
| 4 | Ricerca | 🟡 | Locale/offline/zero stock; recenti assenti |
| 5 | QR | 🟡 | Fotocamera BarcodeDetector e fallback; manca test device Android |
| 6 | Dettaglio | ✅ | Distribuzione, stati, note, azioni e ultimi movimenti |
| 7 | Griglia | 🟡 | Data-driven e configurabile; codice interno non rinominabile |
| 8 | Guasti | ✅ | Movimento fisico transazionale |
| 9 | Vandalici | ✅ | Locazione fisica separata |
| 10 | A001 | 🟡 | Lotti annotati distinti; uscita FIFO, non lotto manuale |
| 11 | In viaggio | ✅ | Stato e flusso arrivo dedicato |
| 12 | Richiesto | ✅ | Aumento, riduzione, annullo e quattro regole testate |
| 13 | Movimenti | ✅ | Conferma, UUID, transazione locale e pending |
| 14 | Storico | 🟡 | Globale e ultimi del ricambio; filtri assenti |
| 15 | Rettifiche | ✅ | Solo Manager, differenza e motivo append-only |
| 16 | Centrale | ✅ | Azione dedicata e storico specifico |
| 17 | Copia codice | ✅ | Copia esclusivamente il codice |
| 18 | Condividi | ✅ | Web Share/fallback e deep link stabile |
| 19 | Scorta minima | ✅ | Solo buoni; modifica Manager |
| 20 | Operatori | ✅ | Identificazione e persistenza locale |
| 21 | Ruoli | 🟡 | Permessi UI e test; PIN locale non è sicurezza enterprise |
| 22 | Excel | ✅ | Sei fogli e test round-trip workbook |
| 23 | Tutorial | ✅ | 5 passi, salta, persistenza e replay |
| 24 | Offline-first | 🟡 | Persistenza immediata; E2E browser non eseguito |
| 25 | Sync | ✅ | UUID, pending/ack/synced, cursore, auto/manual sync |
| 26 | Conflitti | 🟡 | Merge append-only testato; nessuna scelta manuale conflitto |
| 27 | IndexedDB | ✅ | Parti, movimenti, bins, sessione, meta/cursore persistenti |
| 28 | Google Sheets | 🟡 | Adapter reale implementato; staging con credenziali non verificato |
| 29 | PWA | 🟡 | Manifest/SW/update cache; Android/Lighthouse non verificati |
| 30 | Responsive | 🟡 | CSS 360/tablet/desktop predisposto; screenshot reali non eseguiti |
| 31 | Prestazioni | 🟡 | Ricerca locale memoizzata; benchmark escluso dalla fase |
| 32 | Stati UI | ✅ | Loading, empty, no-results, offline, syncing, conflict, error/retry, camera |
| 33 | Test | 🟡 | Suite dominio/sync/export/auth/grid/link; browser E2E assenti |
| 34 | Build/qualità | ⚠️ | Codice sintatticamente valido; registry 403 blocca toolchain completa |
| 35 | Completezza | 🟡 | V1 funzionale nel codice, non dichiarabile pronta senza build e staging |

## Decisione

La V1 **non viene dichiarata pronta alla produzione** finché non passano installazione, lint, typecheck, test, build, test Android/offline e sincronizzazione Google Sheets con credenziali di staging.
