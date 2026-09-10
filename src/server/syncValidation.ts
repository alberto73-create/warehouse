import type {Movement} from '@/domain/types';
import type {SyncRequest} from '@/sync/protocol';

const places=/^(buoni-\d+|guasti|vandalici|a001|viaggio|richiesto|centrale)$/;
const kinds=new Set(['move','request','adjustment','shipment']);
const text=(value:unknown,max=300)=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
const date=(value:unknown)=>text(value,64)&&!Number.isNaN(Date.parse(value as string));
const uuid=(value:unknown)=>typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

function movement(value:unknown):value is Movement{
 if(!value||typeof value!=='object')return false;
 const m=value as Record<string,unknown>,kind=m.kind??'move';
 return uuid(m.id)&&text(m.code,100)&&Number.isInteger(m.quantity)&&(m.quantity as number)>0&&text(m.operator,100)&&date(m.createdAt)
  &&(m.from===undefined||(typeof m.from==='string'&&places.test(m.from)))&&(m.to===undefined||(typeof m.to==='string'&&places.test(m.to)))
  &&typeof kind==='string'&&kinds.has(kind)&& (m.note===undefined||typeof m.note==='string')
  &&(kind!=='adjustment'||(Number.isInteger(m.delta)&&text(m.note)))&&(kind!=='request'||Number.isInteger(m.delta));
}

export function parseSyncRequest(value:unknown):SyncRequest{
 if(!value||typeof value!=='object')throw new Error('Payload non valido');
 const body=value as Record<string,unknown>,catalog=body.catalog as Record<string,unknown>|undefined;
 if(!text(body.deviceId,128)||!Number.isSafeInteger(body.cursor)||(body.cursor as number)<0||!Array.isArray(body.operations)||body.operations.length>1000||!body.operations.every(movement))throw new Error('Richiesta di sincronizzazione non valida');
 if(!catalog||!Array.isArray(catalog.parts)||!Array.isArray(catalog.bins)||!Array.isArray(catalog.locations)||!catalog.configuration||typeof catalog.configuration!=='object')throw new Error('Catalogo non valido');
 for(const part of catalog.parts){const p=part as Record<string,unknown>,stock=p.stock as Record<string,unknown>|undefined;if(!text(p.code,100)||!text(p.name,300)||!Number.isInteger(p.minimum)||(p.minimum as number)<0||!stock||Object.entries(stock).some(([place,quantity])=>!places.test(place)||!Number.isInteger(quantity)||(quantity as number)<0))throw new Error('Articolo non valido')}
 for(const bin of catalog.bins){const b=bin as Record<string,unknown>;if(typeof b.id!=='string'||!/^buoni-\d+$/.test(b.id)||!text(b.label,200)||!['row','column','rowSpan','columnSpan'].every(key=>Number.isInteger(b[key])&&(b[key] as number)>0)||typeof b.enabled!=='boolean')throw new Error('Scomparto non valido')}
 for(const location of catalog.locations){const item=location as Record<string,unknown>;if(typeof item.id!=='string'||!places.test(item.id)||!text(item.label,200)||!['physical','logistic','request','external'].includes(String(item.kind)))throw new Error('Locazione non valida')}
 const configuration=catalog.configuration as Record<string,unknown>;if(configuration.id!=='warehouse'||!text(configuration.name,200)||!date(configuration.updatedAt)||!text(configuration.updatedBy,100))throw new Error('Configurazione non valida');
 return body as unknown as SyncRequest;
}
