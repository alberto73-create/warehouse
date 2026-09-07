import type { Movement,Part,Place } from './types';
export const physical: Place[]=['buoni-1','buoni-3','buoni-7','guasti','vandalici','a001'];
export function applyMovement(part:Part,m:Movement):Part {
 const stock={...part.stock}; const take=(p:Place)=>stock[p]=Math.max(0,(stock[p]??0)-m.quantity); const add=(p:Place)=>stock[p]=(stock[p]??0)+m.quantity;
 if(m.from) take(m.from); if(m.to) add(m.to);
 // "Richiesto" è scalato soltanto quando una fornitura entra per la prima volta nel flusso.
 if(!m.from && m.to && (m.to==='viaggio'||physical.includes(m.to)) && (stock.richiesto??0)>0) stock.richiesto=Math.max(0,(stock.richiesto??0)-m.quantity);
 return {...part,stock};
}
export const goodQuantity=(part:Part)=>Object.entries(part.stock).filter(([p])=>p.startsWith('buoni-')).reduce((n,[,q])=>n+(q??0),0);
