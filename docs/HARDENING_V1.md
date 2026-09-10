# Hardening V1 e limiti noti

## Confine di autorizzazione

La sessione Manager è firmata HMAC dal server, dura otto ore ed è trasportata esclusivamente in cookie `HttpOnly`, `SameSite=Strict` e `Secure` in produzione. PIN e segreto non entrano nel bundle client. `/api/sync` ricava l'autorizzazione dal cookie, valida il payload a runtime e non legge flag di ruolo dal JSON.

Rettifiche e modifiche protette (anagrafica/soglia articolo, locazioni, scomparti e configurazione generale, incluso il bootstrap iniziale) vengono classificate lato server. Un catalogo client non autorizzato viene respinto anziché accettato o silenziosamente sovrascritto. Movimenti ordinari e richieste restano disponibili al ruolo Base.

## Consistenza e recupero

I movimenti hanno UUID e sono append-only. Il server deduplica sia la lettura sia ogni retry prima dell'append; il client marca `synced` soltanto gli UUID confermati e aggiorna catalogo, movimenti e cursore in una singola transazione Dexie. Le versioni di catalogo usano `(chiave, updatedAt, updatedBy)` e LWW deterministico. Una singola istanza server evita duplicati dopo timeout; Google Sheets non offre confronti atomici tra istanze, quindi un raro append simultaneo può lasciare righe fisiche duplicate, comunque deduplicate semanticamente in lettura. Questa limitazione va osservata nel collaudo staging e non viene nascosta.

## Dipendenze

`xlsx@0.18.x` era la dipendenza indicata dall'audit preesistente come area da verificare. Non viene applicato `npm audit fix --force`: un eventuale cambio di libreria Excel richiede un task controllato e test di compatibilità. Il report definitivo dipende dall'esecuzione di `npm audit` con accesso al registry.
