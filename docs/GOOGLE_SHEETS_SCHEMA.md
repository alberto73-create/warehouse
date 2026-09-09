# Schema Google Sheets definitivo

Tutti i tab sono letti e/o scritti dall'adapter `GoogleSheetsStore`. La riga 1 è obbligatoria e contiene le intestazioni indicate.

Prima di ogni sincronizzazione l'adapter convalida tutti e sette i tab e le intestazioni, evitando scritture su uno schema incompleto o rinominato. La diagnostica Manager `GET /api/diagnostics` esegue la stessa verifica e una lettura minima senza restituire credenziali.

## ARTICOLI

| Colonna | Intestazione | Contenuto |
|---|---|---|
| A | `code` | Codice articolo, chiave logica |
| B | `updatedAt` | Timestamp ISO della versione |
| C | `updatedBy` | Operatore/autore, spareggio LWW |
| D | `json` | Articolo completo: descrizione, soglia, stock e note A001 |

Registro versionato append-only. Chiave versione: `(code, updatedAt, updatedBy)`. In bootstrap viene scelta l'ultima versione LWW.

## LOCAZIONI

A `id`; B `updatedAt`; C `updatedBy`; D `json`. Contiene etichetta e tipo (`physical`, `logistic`, `request`, `external`). Registro versionato append-only, chiave `(id, updatedAt, updatedBy)`.

## SCOMPARTI

A `id`; B `updatedAt`; C `updatedBy`; D `json`. Il JSON contiene nome, riga, colonna, `rowSpan`, `columnSpan` e stato abilitato. Registro versionato append-only, chiave `(id, updatedAt, updatedBy)`.

## MOVIMENTI

A `id`; B `createdAt`; C `code`; D `quantity`; E `from`; F `to`; G `operator`; H `note`; I `kind`; J `delta`. Registro append-only. La chiave primaria/idempotente è l'UUID in A: un UUID già presente non viene scritto di nuovo.

## RICHIESTE

A `code`; B `updatedAt`; C `updatedBy`; D `json`. Il JSON contiene `code`, `requested` e `travelling`. Registro versionato append-only, chiave `(code, updatedAt, updatedBy)`. Viene letto nel bootstrap e sovrapposto allo stato articolo.

## CONFIGURAZIONE

A `id`; B `updatedAt`; C `updatedBy`; D `json`. Contiene la configurazione generale necessaria all'avvio. Registro versionato append-only, chiave `(id, updatedAt, updatedBy)`.

## SYNC_META

A `key`; B `value`; C `updatedAt`; D `deviceId`. Ogni sincronizzazione accoda `key=cursor`, numero totale movimenti, timestamp e dispositivo. È append-only e serve per diagnosi/audit; il cursore operativo è anche restituito dalla risposta API e persistito in IndexedDB.

## Ricostruzione telefono nuovo

Il bootstrap legge le ultime versioni di ARTICOLI, LOCAZIONI, SCOMPARTI, RICHIESTE e CONFIGURAZIONE, più MOVIMENTI. Le giacenze correnti provengono dallo snapshot `ARTICOLI.json.stock` e restano riconciliabili tramite il registro MOVIMENTI. Nessun valore necessario al bootstrap Google proviene più da sole costanti client: le costanti sono usate esclusivamente per inizializzare un archivio remoto vuoto.
