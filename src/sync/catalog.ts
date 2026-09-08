import type {Bin,LocationConfig,Part,WarehouseConfig} from '@/domain/types';
export const defaultLocations:LocationConfig[]=[{id:'guasti',label:'Ricambi guasti',kind:'physical'},{id:'vandalici',label:'Atti vandalici e straordinarie',kind:'physical'},{id:'a001',label:'A001',kind:'physical'},{id:'viaggio',label:'In viaggio',kind:'logistic'},{id:'richiesto',label:'Richiesto',kind:'request'},{id:'centrale',label:'Magazzino centrale',kind:'external'}];
export const defaultConfiguration:WarehouseConfig={id:'warehouse',name:'Magazzino tecnico',updatedAt:'1970-01-01T00:00:00.000Z',updatedBy:'system'};
const rank=(record:{updatedAt?:string;updatedBy?:string})=>`${record.updatedAt??''}|${record.updatedBy??''}`;
export function mergeLww<T extends {updatedAt?:string;updatedBy?:string}>(local:T,remote:T){return rank(remote)>=rank(local)?remote:local}
export function mergeByKey<T extends {updatedAt?:string;updatedBy?:string}>(current:T[],incoming:T[],key:(value:T)=>string){const map=new Map<string,T>();for(const value of [...current,...incoming]){const existing=map.get(key(value));map.set(key(value),existing?mergeLww(existing,value):value)}return [...map.values()]}
export const mergeParts=(current:Part[],incoming:Part[])=>mergeByKey(current,incoming,value=>value.code);
export const mergeBins=(current:Bin[],incoming:Bin[])=>mergeByKey(current,incoming,value=>value.id);
