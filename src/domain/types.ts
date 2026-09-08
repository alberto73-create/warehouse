export type Place=`buoni-${number}`|'guasti'|'vandalici'|'a001'|'viaggio'|'richiesto'|'centrale';
export type Stock=Partial<Record<Place,number>>;
export interface Part { code:string; name:string; description:string; minimum:number; favorite:boolean; stock:Stock; notes?:{place:Place;text:string;quantity:number}[]; updatedAt?:string; updatedBy?:string }
export interface Movement { id:string; code:string; quantity:number; from?:Place; to?:Place; operator:string; note?:string; createdAt:string; sync:'pending'|'synced'; kind?:'move'|'request'|'adjustment'|'shipment'; delta?:number }
export interface Bin { id:`buoni-${number}`; label:string; row:number; column:number; rowSpan:number; columnSpan:number; enabled:boolean; updatedAt?:string; updatedBy?:string }
export interface Session { id:'current'; operator:string; role:'base'|'manager' }
export interface LocationConfig {id:Exclude<Place,`buoni-${number}`>;label:string;kind:'physical'|'logistic'|'request'|'external'}
export interface WarehouseConfig {id:'warehouse';name:string;updatedAt:string;updatedBy:string}
