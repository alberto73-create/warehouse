import {describe,expect,it} from 'vitest';
import {parseSyncRequest} from './syncValidation';
import {defaultConfiguration} from '@/sync/catalog';
const valid={deviceId:'phone-a',cursor:0,operations:[],catalog:{parts:[],bins:[],locations:[],configuration:defaultConfiguration}};
describe('validazione runtime sync',()=>{it('rifiuta device e cursore invalidi',()=>{expect(()=>parseSyncRequest({...valid,deviceId:'',cursor:-1})).toThrow('non valida')});it('rifiuta quantità e UUID movimento invalidi',()=>{expect(()=>parseSyncRequest({...valid,operations:[{id:'fake',code:'A',quantity:0,operator:'1',createdAt:'x'}]})).toThrow('non valida')});it('accetta un payload minimo valido',()=>expect(parseSyncRequest(valid).deviceId).toBe('phone-a'))});
