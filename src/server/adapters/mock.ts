import type {Movement} from '@/domain/types';
import type {RemoteStore} from './types';
export class MockStore implements RemoteStore{
 private log:Movement[]=[];
 async sync({cursor,operations}:Parameters<RemoteStore['sync']>[0]){
  const serverHasNewer=cursor<this.log.length;
  const ids=new Set(this.log.map(movement=>movement.id));
  for(const operation of operations)if(!ids.has(operation.id)){this.log.push({...operation,sync:'synced'});ids.add(operation.id)}
  return {accepted:operations.map(movement=>movement.id),changes:this.log.slice(cursor),cursor:this.log.length,serverHasNewer};
 }
 async allMovements(){return [...this.log]}
}
export const mockStore=new MockStore();
