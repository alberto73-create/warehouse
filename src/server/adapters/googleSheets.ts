import {createSign} from 'node:crypto';
import type {Bin,Movement,Part} from '@/domain/types';
import {applyMovement} from '@/domain/inventory';
import {defaultConfiguration,defaultLocations,mergeBins,mergeParts} from '@/sync/catalog';
import type {RemoteStore} from './types';
const b64=(value:string|Buffer)=>Buffer.from(value).toString('base64url');
async function token(){const email=process.env.GOOGLE_CLIENT_EMAIL,key=process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,'\n');if(!email||!key)throw new Error('Credenziali Google incomplete');const now=Math.floor(Date.now()/1000),unsigned=`${b64(JSON.stringify({alg:'RS256',typ:'JWT'}))}.${b64(JSON.stringify({iss:email,scope:'https://www.googleapis.com/auth/spreadsheets',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}))}`,assertion=`${unsigned}.${b64(createSign('RSA-SHA256').update(unsigned).sign(key))}`;const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});if(!response.ok)throw new Error(`OAuth Google: ${response.status}`);return (await response.json() as {access_token:string}).access_token}
async function values(range:string,rows?:unknown[][]){const id=process.env.GOOGLE_SHEET_ID;if(!id)throw new Error('GOOGLE_SHEET_ID mancante');const suffix=rows?':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS':'';const response=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}${suffix}`,{method:rows?'POST':'GET',headers:{authorization:`Bearer ${await token()}`,'content-type':'application/json'},body:rows?JSON.stringify({values:rows}):undefined});if(!response.ok)throw new Error(`Google Sheets: ${response.status} ${await response.text()}`);return response.json() as Promise<{values?:unknown[][]}>}
const decodeMovement=(row:unknown[]):Movement=>({id:String(row[0]),createdAt:String(row[1]),code:String(row[2]),quantity:Number(row[3]),from:row[4]?String(row[4]) as Movement['from']:undefined,to:row[5]?String(row[5]) as Movement['to']:undefined,operator:String(row[6]),note:row[7]?String(row[7]):undefined,kind:row[8]?String(row[8]) as Movement['kind']:undefined,delta:row[9]===''?undefined:Number(row[9]),sync:'synced'});
async function readJson<T>(sheet:string){const data=await values(`${sheet}!A2:D`);const parsed=(data.values??[]).flatMap(row=>{try{return [JSON.parse(String(row[3])) as T]}catch{return []}});return parsed}
async function appendVersions<T extends {updatedAt?:string;updatedBy?:string}>(sheet:string,key:(value:T)=>string,current:T[],incoming:T[]){
 const known=new Set(current.map(value=>`${key(value)}|${value.updatedAt??''}|${value.updatedBy??''}`));
 const fresh=incoming.filter(value=>!known.has(`${key(value)}|${value.updatedAt??''}|${value.updatedBy??''}`));
 if(fresh.length)await values(`${sheet}!A:D`,fresh.map(value=>[key(value),value.updatedAt??'',value.updatedBy??'',JSON.stringify(value)]));
}
export class GoogleSheetsStore implements RemoteStore{
 async allMovements(){const data=await values('MOVIMENTI!A2:J');return (data.values??[]).map(decodeMovement)}
 async sync({cursor,operations,catalog}:Parameters<RemoteStore['sync']>[0]){
  const [log,storedParts,storedBins]=await Promise.all([this.allMovements(),readJson<Part>('ARTICOLI'),readJson<Bin>('SCOMPARTI')]);
  const inConflict=cursor<log.length,serverHasNewer=inConflict;
  let parts=storedParts.length===0||!inConflict?mergeParts(storedParts,catalog.parts):storedParts;
  const bins=mergeBins(storedBins,catalog.bins);
  const ids=new Set(log.map(value=>value.id)),fresh=operations.filter(value=>!ids.has(value.id));
  if(inConflict)for(const operation of fresh)parts=parts.map(part=>part.code===operation.code?applyMovement(part,operation):part);
  await Promise.all([appendVersions('ARTICOLI',value=>value.code,storedParts,parts),appendVersions('SCOMPARTI',value=>value.id,storedBins,bins),fresh.length?values('MOVIMENTI!A:J',fresh.map(value=>[value.id,value.createdAt,value.code,value.quantity,value.from??'',value.to??'',value.operator,value.note??'',value.kind??'move',value.delta??''])):Promise.resolve({})]);
  const all=[...log,...fresh.map(value=>({...value,sync:'synced' as const}))];
  return {accepted:operations.map(value=>value.id),changes:all.slice(cursor),cursor:all.length,serverHasNewer,catalog:{parts,bins,locations:defaultLocations,configuration:defaultConfiguration}};
 }
}
