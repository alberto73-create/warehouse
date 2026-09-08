# Prima fase di completamento core

| Funzione | Prima | Dopo | Test |
|---|---|---|---|
| QR | Codice demo fisso | Fotocamera posteriore, `BarcodeDetector`, permesso/errore, chiusura, fallback manuale e ricerca locale | Unit test codice valido/sconosciuto; test fotocamera E2E ancora necessario |
| Operatori | `MR` hardcoded | Inserimento numerico iniziale, sessione Dexie, indicazione header, cambio da Impostazioni, operatore in ogni movimento | Verifica statica; E2E IndexedDB ancora necessario |
| Ruoli | Voci decorative | Sessione Base/Manager, PIN, UI Manager condizionale; rettifiche/soglie/griglia/export non renderizzate al Base | E2E autorizzazioni ancora necessario |
| Richiesto | Solo quantità demo | Nuova quantità: aumenta, riduce o porta a zero tramite movimento append-only | Unit test CRUD quantità e quattro casi obbligatori |
| In viaggio | Quantità generica | Azione “Gestisci arrivo”, origine forzata In viaggio, destinazione fisica | Unit test Viaggio→Buoni |
| Griglia | 9 celle hardcoded | Tabella Dexie `bins`, default 3×3, generazione dai dati, cella apribile, contenuto, aggiunta/rinomina/abilita/ordina Manager, span nel modello | Test UI/IndexedDB ancora necessario |
| Rettifiche | Solo enum | Form Manager con registrata/reale/differenza, motivo obbligatorio e movimento append-only | Unit test differenza positiva |
| Centrale | Destinazione generica | Azione dedicata, origine/quantità/nota/conferma, movimento `shipment` con descrizione storico | Unit test rimozione disponibilità |
| A001 | Nota demo | Lotti annotati separati e persistenti; dettaglio li mostra separatamente | Unit test due note separate |
| Scorta minima | Solo lettura | Modifica dalla scheda esclusivamente Manager; calcolo resta sui soli `buoni-*` | Calcolo coperto dal dominio; E2E permessi mancante |

## Limiti residui di questa fase

- `BarcodeDetector` non è disponibile in tutti i browser Android; il fallback manuale resta sempre operativo. Serve test su dispositivo reale.
- Il PIN è una protezione locale coerente con il requisito “non enterprise”, non una barriera di sicurezza contro un utente con accesso agli strumenti sviluppatore.
- La modifica del codice tecnico di uno scomparto esistente non è ancora esposta: nome, stato e ordine sono configurabili; l'ID viene mantenuto stabile per non rompere le giacenze.
- I test browser per IndexedDB, fotocamera e permessi richiedono dipendenze e un browser installabile.
