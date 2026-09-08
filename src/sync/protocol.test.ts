import {describe,expect,it} from 'vitest';
import type {Movement,Part} from '@/domain/types';
import {demoBins} from '@/data/demo';
import {applyMovement} from '@/domain/inventory';
import {MockStore} from '@/server/adapters/mock';
const movement=(id:string,from:'buoni-1'|undefined,to:'guasti'|'a001'|'viaggio'):Movement=>({id,code:'ABC',quantity:1,from,to,operator:'12',createdAt:'2026-01-01T00:00:00Z',sync:'pending'});
const initial:Part={code:'ABC',name:'Test',description:'',minimum:1,favorite:false,stock:{'buoni-1':2,richiesto:3},updatedAt:'2026-01-01T00:00:00Z',updatedBy:'A'};
const request=(deviceId:string,cursor:number,parts:Part[],operations:Movement[]=[])=>({deviceId,cursor,operations,catalog:{parts,bins:demoBins}});
describe('sincronizzazione multi-dispositivo',()=>{
 it('è idempotente per UUID anche tra chiamate',async()=>{const store=new MockStore(),op=movement('same','buoni-1','guasti'),snapshot=applyMovement(initial,op);await store.sync(request('A',0,[snapshot],[op]));await store.sync(request('A',1,[snapshot],[op]));expect(await store.allMovements()).toHaveLength(1)});
 it('fa bootstrap completo di un telefono con archivio vuoto',async()=>{const store=new MockStore();await store.sync(request('A',0,[initial]));const result=await store.sync(request('B',0,[]));expect(result.catalog.parts[0]).toMatchObject({code:'ABC',minimum:1,stock:{richiesto:3}});expect(result.catalog.bins).toHaveLength(9);expect(result.catalog.locations.length).toBeGreaterThan(0)});
 it('riconcilia due dispositivi senza perdere movimenti',async()=>{const store=new MockStore(),toTravel=movement('a',undefined,'viaggio');const afterA=applyMovement(initial,toTravel);await store.sync(request('A',0,[afterA],[toTravel]));const toFault=movement('b','buoni-1','guasti');const response=await store.sync(request('B',0,[applyMovement(initial,toFault)],[toFault]));expect(response.serverHasNewer).toBe(true);expect(new Set(response.changes.map(value=>value.id))).toEqual(new Set(['a','b']));expect(response.catalog.parts[0].stock).toMatchObject({richiesto:2,viaggio:1,'buoni-1':1,guasti:1})});
});
