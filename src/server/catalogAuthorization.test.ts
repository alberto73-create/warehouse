import {describe,expect,it} from 'vitest';
import {MockStore} from './adapters/mock';
import {defaultConfiguration,defaultLocations} from '@/sync/catalog';
import type {SyncRequest} from '@/sync/protocol';
const base={code:'ABC',name:'Parte',description:'',minimum:1,favorite:false,stock:{'buoni-1':2},updatedAt:'2026-01-01T00:00:00Z',updatedBy:'manager'} as const;
const request=(overrides:Partial<SyncRequest['catalog']>={}):SyncRequest=>({deviceId:'device-a',cursor:0,operations:[],catalog:{parts:[base],bins:[],locations:defaultLocations,configuration:defaultConfiguration,...overrides}});
describe('autorizzazione catalogo lato server',()=>{
 it('richiede Manager per bootstrap e soglia, indipendentemente da flag client',async()=>{const store=new MockStore();await expect(store.sync(request(),{manager:false})).rejects.toThrow('Manager');await store.sync(request(),{manager:true});await expect(store.sync(request({parts:[{...base,minimum:9}]}),{manager:false})).rejects.toThrow('Manager')});
 it('protegge scomparti, locazioni e configurazione',async()=>{const store=new MockStore();await store.sync(request(),{manager:true});await expect(store.sync(request({bins:[{id:'buoni-1',label:'Uno',row:1,column:1,rowSpan:1,columnSpan:1,enabled:true}]}),{manager:false})).rejects.toThrow('Manager');await expect(store.sync(request({locations:defaultLocations.map((value,index)=>index?value:{...value,label:'Alterata'})}),{manager:false})).rejects.toThrow('Manager');await expect(store.sync(request({configuration:{...defaultConfiguration,name:'Alterata'}}),{manager:false})).rejects.toThrow('Manager')});
 it('consente mutazioni protette a un Manager valido',async()=>{const store=new MockStore();await store.sync(request(),{manager:true});const result=await store.sync(request({parts:[{...base,minimum:4}]}),{manager:true});expect(result.catalog.parts[0].minimum).toBe(4)});
});
