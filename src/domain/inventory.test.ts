import {describe,expect,it} from 'vitest'; import {applyMovement} from './inventory'; import type {Movement,Part,Place} from './types';
const part=(stock:Part['stock']):Part=>({code:'ABC',name:'Test',description:'',minimum:1,favorite:false,stock});
const move=(from:Place|undefined,to:Place):Movement=>({id:crypto.randomUUID(),code:'ABC',quantity:1,from,to,operator:'MR',createdAt:new Date().toISOString(),sync:'pending'});
describe('regole richieste',()=>{
 it('richiesto → viaggio scala la richiesta una volta',()=>{const p=applyMovement(part({richiesto:3}),move(undefined,'viaggio'));expect(p.stock).toMatchObject({richiesto:2,viaggio:1})});
 it('viaggio → buoni non scala nuovamente richiesto',()=>{const p=applyMovement(part({richiesto:2,viaggio:1}),move('viaggio','buoni-3'));expect(p.stock).toMatchObject({richiesto:2,viaggio:0,'buoni-3':1})});
 it('arrivo diretto in A001 scala la richiesta',()=>{const p=applyMovement(part({richiesto:3}),move(undefined,'a001'));expect(p.stock).toMatchObject({richiesto:2,a001:1})});
 it('spostamento fisico non modifica richiesto',()=>{const p=applyMovement(part({richiesto:2,'buoni-3':1}),move('buoni-3','guasti'));expect(p.stock).toMatchObject({richiesto:2,'buoni-3':0,guasti:1})});
 it('salva lotti A001 con note separate',()=>{const first={...move('buoni-3','a001'),note:'Biglietteria'};const second={...move('buoni-3','a001'),id:'secondo',note:'Lasciato al collega'};const p=applyMovement(applyMovement(part({'buoni-3':2}),first),second);expect(p.notes).toEqual([{place:'a001',text:'Biglietteria',quantity:1},{place:'a001',text:'Lasciato al collega',quantity:1}])});
 it('impedisce quantità superiori alla disponibilità',()=>{expect(()=>applyMovement(part({'buoni-3':1}),{...move('buoni-3','guasti'),quantity:2})).toThrow('Quantità non disponibile')});
 it('impedisce quantità non positive',()=>{expect(()=>applyMovement(part({'buoni-3':1}),{...move('buoni-3','guasti'),quantity:0})).toThrow('intero positivo')});
});
