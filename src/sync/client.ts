'use client';
import {db} from '@/data/db';
import {mergeRemote,type SyncRequest,type SyncResponse} from './protocol';
export type SyncState='updated'|'misaligned'|'offline'|'syncing'|'error';
function deviceId(){let id=localStorage.getItem('warehouse-device-id');if(!id){id=crypto.randomUUID();localStorage.setItem('warehouse-device-id',id)}return id}
export async function synchronize(){
 const [parts,movements,cursorRow]=await Promise.all([db.parts.toArray(),db.movements.toArray(),db.meta.get('sync-cursor')]);
 const pending=movements.filter(movement=>movement.sync==='pending');
 const cursor=Number(cursorRow?.value??0);
 const bins=await db.bins.toArray();
 const body:SyncRequest={deviceId:deviceId(),cursor,operations:pending,catalog:{parts,bins}};
 const result=await fetch('/api/sync',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 if(!result.ok)throw new Error('Sincronizzazione non riuscita');
 const remote=await result.json() as SyncResponse;
 const acknowledged=new Set(remote.accepted);
 const marked=movements.map(movement=>acknowledged.has(movement.id)?{...movement,sync:'synced' as const}:movement);
 const merged=mergeRemote(remote.catalog.parts,marked,remote.changes.filter(change=>!remote.accepted.includes(change.id)));
 await db.transaction('rw',db.parts,db.movements,db.bins,db.locations,db.config,db.meta,async()=>{
  await db.parts.bulkPut(merged.parts);
  await db.movements.bulkPut(merged.movements);
  await db.bins.clear();
  await db.bins.bulkPut(remote.catalog.bins);
  await db.locations.clear();
  await db.locations.bulkPut(remote.catalog.locations);
  await db.config.put(remote.catalog.configuration);
  await db.meta.put({key:'sync-cursor',value:String(remote.cursor)});
 });
 return {...merged,bins:remote.catalog.bins,hadConflict:remote.serverHasNewer&&pending.length>0};
}
