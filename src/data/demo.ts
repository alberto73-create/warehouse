import type { Bin,Movement,Part } from '@/domain/types';
export const demoBins:Bin[]=Array.from({length:9},(_,index)=>({id:`buoni-${index+1}` as const,label:`Scomparto ${index+1}`,row:Math.floor(index/3)+1,column:index%3+1,rowSpan:1,columnSpan:1,enabled:true}));
export const demoParts:Part[]=[
 {code:'93000114900',name:'Contactless iUC150B + adattatore',description:'Lettore contactless completo di adattatore e cablaggio',minimum:2,favorite:true,stock:{'buoni-3':1,'buoni-7':1,guasti:1,a001:1,viaggio:1,richiesto:2},notes:[{place:'a001',text:'Biglietteria Santa Maria Novella',quantity:1}]},
 {code:'92000412018',name:'Stampante termica TG2480',description:'Modulo stampante per emettitrice automatica',minimum:2,favorite:true,stock:{'buoni-1':1,richiesto:1}},
 {code:'81000239441',name:'Scheda CPU controllo varchi',description:'Scheda elettronica revisione C',minimum:1,favorite:false,stock:{guasti:2}},
 {code:'70000182009',name:'Sensore ottico passaggio',description:'Sensore IR completo di staffa',minimum:3,favorite:false,stock:{'buoni-3':5}},
 {code:'61000077320',name:'Cinghia dentata 420 mm',description:'Ricambio meccanico trasmissione',minimum:2,favorite:false,stock:{}}
];
export const demoMovements:Movement[]=[
 {id:'demo-1',code:'93000114900',quantity:1,from:'viaggio',to:'buoni-3',operator:'MR',note:'Ricezione verificata',createdAt:'2026-09-07T08:42:00Z',sync:'synced'},
 {id:'demo-2',code:'93000114900',quantity:1,to:'viaggio',operator:'Operatore',createdAt:'2026-09-06T15:18:00Z',sync:'synced'}
];
