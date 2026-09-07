export type Place='buoni-1'|'buoni-3'|'buoni-7'|'guasti'|'vandalici'|'a001'|'viaggio'|'richiesto'|'centrale';
export type Stock=Partial<Record<Place,number>>;
export interface Part { code:string; name:string; description:string; minimum:number; favorite:boolean; stock:Stock; notes?:{place:Place;text:string;quantity:number}[] }
export interface Movement { id:string; code:string; quantity:number; from?:Place; to?:Place; operator:string; note?:string; createdAt:string; sync:'pending'|'synced'; kind?:'move'|'adjustment' }
