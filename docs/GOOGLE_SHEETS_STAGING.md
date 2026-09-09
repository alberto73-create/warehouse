# Configurazione Google Sheets STAGING

1. In **Google Cloud Console**, creare un progetto dedicato allo staging.
2. Abilitare **Google Sheets API** (non Firebase).
3. Creare un **Service Account** con un nome riconoscibile.
4. Generare una chiave JSON e conservarla nel password manager; non commetterla.
5. Creare un normale Google Sheet vuoto.
6. Condividere il foglio come **Editor** con `client_email` del Service Account.
7. Creare esattamente i tab `ARTICOLI`, `LOCAZIONI`, `SCOMPARTI`, `MOVIMENTI`, `RICHIESTE`, `CONFIGURAZIONE`, `SYNC_META`.
8. Copiare nella riga 1 le intestazioni esatte descritte in [GOOGLE_SHEETS_SCHEMA.md](GOOGLE_SHEETS_SCHEMA.md). Non aggiungere colonne alle intestazioni.
9. Copiare dalla URL l'identificativo tra `/d/` e `/edit`: è `GOOGLE_SHEET_ID`.
10. In Vercel configurare `DATA_ADAPTER=google`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `MANAGER_PIN` e un `MANAGER_TOKEN_SECRET` casuale lungo. Nessuna variabile deve iniziare con `NEXT_PUBLIC_`.
11. Eseguire un nuovo deploy. Accedere come Manager e chiamare `GET /api/diagnostics`: ambiente, autenticazione, accesso, sette tab, intestazioni e lettura devono risultare `ok`.
12. Solo dopo una diagnostica positiva effettuare il primo sync Manager dal dispositivo A. Il bootstrap iniziale è una mutazione protetta.
13. Verificare nel foglio versioni e movimenti, senza modificare manualmente UUID o JSON.
14. Su un dispositivo B con IndexedDB vuoto eseguire la prima sincronizzazione e confrontare articoli, soglie, giacenze, richieste, viaggio, A001, locazioni, scomparti, configurazione, storico e cursore.

## Errori e dati manualmente corrotti

La diagnostica distingue credenziali mancanti, accesso negato, foglio/tab assente e intestazioni errate senza esporre segreti. Righe completamente vuote e righe movimento incomplete vengono ignorate in lettura; JSON di versione malformato viene scartato. Le versioni duplicate sono ridotte con LWW deterministico e gli UUID movimento duplicati sono deduplicati. Correggere la riga sorgente e ripetere la diagnostica prima di sincronizzare.
