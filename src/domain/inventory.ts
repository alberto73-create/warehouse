import type { Movement,Part,Place } from './types';
export const isPhysical=(place:Place)=>place.startsWith('buoni-')||place==='guasti'||place==='vandalici'||place==='a001';
export function applyMovement(part:Part,m:Movement):Part {
 if(!Number.isInteger(m.quantity)||m.quantity<=0)throw new Error('La quantità deve essere un intero positivo');
 if(m.kind==='adjustment'){
  if(!m.to||!Number.isInteger(m.delta)||!m.note?.trim())throw new Error('Rettifica non valida');
  const delta=m.delta as number;
  const next=(part.stock[m.to]??0)+delta;
  if(next<0)throw new Error('La rettifica produrrebbe una quantità negativa');
  return {...part,stock:{...part.stock,[m.to]:next}};
 }
 if(m.kind==='request'){
  if(!Number.isInteger(m.delta))throw new Error('Variazione richiesta non valida');
  const next=(part.stock.richiesto??0)+(m.delta as number);
  if(next<0)throw new Error('La richiesta non può diventare negativa');
  return {...part,stock:{...part.stock,richiesto:next}};
 }
 if(m.from&&(part.stock[m.from]??0)<m.quantity)throw new Error('Quantità non disponibile nella posizione di origine');
 const stock={...part.stock}; const take=(p:Place)=>stock[p]=Math.max(0,(stock[p]??0)-m.quantity); const add=(p:Place)=>stock[p]=(stock[p]??0)+m.quantity;
 if(m.from) take(m.from); if(m.to) add(m.to);
 // "Richiesto" è scalato soltanto quando una fornitura entra per la prima volta nel flusso.
 if(!m.from && m.to && (m.to==='viaggio'||isPhysical(m.to)) && (stock.richiesto??0)>0) stock.richiesto=Math.max(0,(stock.richiesto??0)-m.quantity);
 let notes=part.notes?.map(note=>({...note}));
 if(m.to==='a001'&&m.note){notes=[...(notes??[]),{place:'a001',text:m.note,quantity:m.quantity}]}
 if(m.from==='a001'&&notes){let remaining=m.quantity;notes=notes.map(note=>{if(note.place!=='a001'||remaining===0)return note;const removed=Math.min(note.quantity,remaining);remaining-=removed;return {...note,quantity:note.quantity-removed}}).filter(note=>note.quantity>0)}
 return {...part,stock,notes};
}
export const goodQuantity=(part:Part)=>Object.entries(part.stock).filter(([p])=>p.startsWith('buoni-')).reduce((n,[,q])=>n+(q??0),0);
