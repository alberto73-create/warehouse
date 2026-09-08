# Verifica dei requisiti

Data verifica: 7 settembre 2026.

## Allegati grafici

Le sei immagini indicate nella richiesta originale **non sono presenti nel repository**. Il tentativo di aprire i link temporanei `chatgpt.com/backend-api/estuary` ha restituito `401 Unauthorized`; non è quindi corretto affermare che l'interfaccia attuale sia stata confrontata visivamente con i mockup. Per una verifica grafica attendibile gli allegati devono essere caricati nuovamente nella conversazione oppure aggiunti al repository.

## Stato reale della V1

Legenda: ✅ implementato; 🟡 parziale/prototipo; ❌ mancante.

| Area | Stato | Evidenza / limite |
| --- | --- | --- |
| Next.js, React, TypeScript | ✅ | App Router, componenti client e tipi dominio. |
| UI italiana, mobile-first | ✅ | Home, ricerca, dettaglio, magazzino, richieste, storico e impostazioni. |
| IndexedDB con Dexie | ✅ | Tabelle articoli, movimenti e metadati; scrittura transazionale locale. |
| UUID e coda pending | ✅ | Ogni movimento locale riceve un UUID e parte come `pending`. |
| Ricerca locale anche a quantità zero | ✅ | Ricerca su codice, nome e descrizione senza filtro sulla giacenza. |
| Dettaglio per ubicazione e note A001 | ✅ | Quantità separate e note demo visualizzate. |
| Copia codice e Web Share | ✅ | Azioni presenti nel dettaglio. |
| Scorta minima sui soli ricambi buoni | ✅ | Calcolo limitato alle ubicazioni `buoni-*`. |
| Movimentazione fisica e conferma | ✅ | Origine, destinazione, quantità, nota e riepilogo. |
| Regole Richiesto / In viaggio | 🟡 | Funzioni dominio e quattro unit test presenti; manca una UI completa per creare/modificare/annullare richieste. |
| Storico append-only | 🟡 | I movimenti non vengono cancellati, ma rettifiche e filtri dello storico non hanno ancora una UI dedicata. |
| Sync idempotente | 🟡 | Endpoint mock deduplica gli UUID del singolo payload; manca persistenza remota, pull incrementale, retry automatico e riconciliazione multi-dispositivo. |
| Google Sheets reale | ❌ | Sono presenti variabili e istruzioni, non l'adapter operativo. |
| Stato “Dati non allineati” | ❌ | La UI distingue aggiornato, pending e offline, ma non rileva ancora il conflitto con modifiche remote. |
| Scanner QR con fotocamera | ❌ | Il pulsante è soltanto un ingresso dimostrativo alla ricerca; non richiede la fotocamera e non decodifica QR. |
| Deep link `/ricambi/[codice]` | ❌ | L'app usa stato client in una sola route. |
| Invio al magazzino centrale | 🟡 | La destinazione esiste nel movimento generico, ma manca il flusso dedicato richiesto. |
| Griglia configurabile dal Manager | ❌ | La vista 3×3 è hardcoded; non esistono editor, celle estese o persistenza della configurazione. |
| Ruoli Base/Manager e PIN | ❌ | La schermata mostra voci illustrative ma non applica autorizzazioni. |
| Rettifiche tracciate | ❌ | Il tipo dominio è predisposto, ma manca il flusso Manager. |
| Export Excel completo | 🟡 | Esporta Articoli, Giacenze e Movimenti; mancano Locazioni, Richieste e Configurazione. |
| Splash, identificazione operatore, tutorial | ❌ | Non implementati. |
| PWA installabile | 🟡 | Manifest, icona e Service Worker presenti; non è stato possibile validare installazione e comportamento offline con una build eseguibile. |
| Test, lint, typecheck e build | ❌ | Non eseguiti: l'installazione dipendenze restituisce `403 Forbidden` dal registry dell'ambiente. |
| Verifica visuale e screenshot mobile | ❌ | Impossibile avviare il progetto senza dipendenze e confrontarlo con allegati non accessibili. |

## Conclusione

Il commit iniziale è un **prototipo funzionale parziale**, non una web app completa pronta per la produzione. Copre la base visuale, il modello quantitativo essenziale e il salvataggio locale, ma non soddisfa ancora integralmente la richiesta originale. Le priorità per rendere la V1 utilizzabile sono:

1. recuperare e confrontare i mockup originali;
2. rendere eseguibili lint, typecheck, test e build;
3. implementare scanner QR reale, onboarding e identificazione operatore;
4. completare richieste, ricezione, invio centrale e rettifiche;
5. aggiungere ruoli Manager, configurazione dinamica della griglia ed export completo;
6. implementare adapter Google Sheets, pull incrementale, retry e conflitti multi-dispositivo;
7. eseguire test end-to-end offline/mobile e produrre screenshot di confronto.
