# Fase 2 — esito

## Implementato

- Adapter Google Sheets server-only con Service Account JWT e append idempotente di `MOVIMENTI`.
- Protocollo sync con UUID, acknowledgement, cursore, pull modifiche, merge senza duplicati e stato di disallineamento.
- Sync ad apertura, ritorno online, foreground e pulsante manuale; UI updated/misaligned/offline/syncing/error-retry.
- Export Excel verificabile a sei fogli.
- Route stabile `/ricambi/[code]` e condivisione con descrizione, codice e URL.
- Tutorial in cinque passaggi, salta, persistenza locale e “Rivedi tutorial”.
- Home con Ricezione e Ordini/Richieste; PWA con cache versionata e cleanup.
- Test aggiunti per sync due dispositivi/idempotenza, export, permessi, griglia e deep link.

## Ancora parziale

- La lettura Google Sheets è corretta ma un deploy di staging con credenziali reali è indispensabile prima dell'uso operativo.
- Lo stato “Dati non allineati” viene mostrato durante la riconciliazione, ma non esiste una UI manuale di scelta conflitto: il merge è deterministico append-only.
- Lo storico globale non offre ancora filtri per operatore/periodo; il dettaglio mostra solo gli ultimi tre movimenti.
- Non sono stati eseguiti test browser reali a 360/768/1440 px né installazione Android perché le dipendenze non sono installabili nel container.
- `WarehouseApp` usa servizi separati per sync/export/auth/grid, ma la suddivisione dei componenti visuali resta incompleta.
- L'export Excel è completo, ma rimane volutamente semplice e non include formattazione avanzata.
