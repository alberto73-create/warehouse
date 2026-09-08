import type {Bin,Movement,Part} from '@/domain/types';
import {applyMovement} from '@/domain/inventory';
import {defaultConfiguration,defaultLocations,mergeBins,mergeParts} from '@/sync/catalog';
import type {RemoteStore} from './types';
export class MockStore implements RemoteStore{
 private log:Movement[]=[];private parts:Part[]=[];private bins:Bin[]=[];
 async sync({cursor,operations,catalog}:Parameters<RemoteStore['sync']>[0]){
  const serverHasNewer=cursor<this.log.length;
  const inConflict=cursor<this.log.length;this.parts=this.parts.length===0||!inConflict?mergeParts(this.parts,catalog.parts):this.parts;this.bins=mergeBins(this.bins,catalog.bins);
  const ids=new Set(this.log.map(value=>value.id));
  for(const operation of operations)if(!ids.has(operation.id)){this.log.push({...operation,sync:'synced'});ids.add(operation.id);if(inConflict)this.parts=this.parts.map(part=>part.code===operation.code?applyMovement(part,operation):part)}
  return {accepted:operations.map(value=>value.id),changes:this.log.slice(cursor),cursor:this.log.length,serverHasNewer,catalog:{parts:this.parts,bins:this.bins,locations:defaultLocations,configuration:defaultConfiguration}};
 }
 async allMovements(){return [...this.log]}
}
export const mockStore=new MockStore();
