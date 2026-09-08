import {describe,expect,it} from 'vitest';
import type {Movement,Part} from '@/domain/types';
import {MockStore} from '@/server/adapters/mock';
import {mergeRemote} from './protocol';
const movement=(id:string,from:'buoni-1'|undefined,to:'guasti'|'a001'):Movement=>({id,code:'ABC',quantity:1,from,to,operator:'12',createdAt:'2026-01-01T00:00:00Z',sync:'pending'});
const part:Part={code:'ABC',name:'Test',description:'',minimum:1,favorite:false,stock:{'buoni-1':2}};
describe('sincronizzazione',()=>{
 it('è idempotente per UUID anche tra chiamate',async()=>{const store=new MockStore(),op=movement('same','buoni-1','guasti');await store.sync({deviceId:'a',cursor:0,operations:[op]});await store.sync({deviceId:'a',cursor:0,operations:[op]});expect(await store.allMovements()).toHaveLength(1)});
 it('riconcilia due dispositivi senza perdere movimenti',async()=>{const store=new MockStore(),a=movement('a','buoni-1','guasti'),b=movement('b','buoni-1','a001');await store.sync({deviceId:'a',cursor:0,operations:[a]});const response=await store.sync({deviceId:'b',cursor:0,operations:[b]});expect(response.serverHasNewer).toBe(true);expect(response.changes.map(value=>value.id)).toEqual(['a','b']);const merged=mergeRemote([part],[b],response.changes);expect(new Set(merged.movements.map(value=>value.id))).toEqual(new Set(['a','b']))});
});
