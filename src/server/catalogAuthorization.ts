import type {SyncCatalog} from '@/sync/protocol';

const canonical=(value:unknown):unknown=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>[key,canonical(item)])):value;
const stable=(value:unknown)=>JSON.stringify(canonical(value));
const protectedPart=(part:SyncCatalog['parts'][number])=>({code:part.code,name:part.name,description:part.description,minimum:part.minimum,favorite:part.favorite});
export function hasProtectedCatalogChanges(current:SyncCatalog,incoming:SyncCatalog){
 if(current.parts.length===0)return incoming.parts.length>0||incoming.bins.length>0||incoming.locations.length>0;
 const currentParts=new Map(current.parts.map(value=>[value.code,stable(protectedPart(value))]));
 return incoming.parts.some(value=>currentParts.get(value.code)!==stable(protectedPart(value)))
  ||stable(current.bins)!==stable(incoming.bins)||stable(current.locations)!==stable(incoming.locations)||stable(current.configuration)!==stable(incoming.configuration);
}

export class ManagerAuthorizationError extends Error{constructor(){super('Autorizzazione Manager richiesta');this.name='ManagerAuthorizationError'}}

export function mergeProtectedParts(current:SyncCatalog['parts'],incoming:SyncCatalog['parts']){const map=new Map(incoming.map(value=>[value.code,value])),known=new Set(current.map(value=>value.code));return [...current.map(value=>{const update=map.get(value.code);return update?{...value,name:update.name,description:update.description,minimum:update.minimum,favorite:update.favorite,updatedAt:update.updatedAt,updatedBy:update.updatedBy}:value}),...incoming.filter(value=>!known.has(value.code))]}
