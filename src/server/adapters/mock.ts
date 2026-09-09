import type {Bin,LocationConfig,Movement,Part,WarehouseConfig} from '@/domain/types';
import {applyMovement} from '@/domain/inventory';
import {defaultConfiguration,defaultLocations,mergeBins,mergeLww,mergeParts,mergeByKey} from '@/sync/catalog';
import type {RemoteStore} from './types';
import {hasProtectedCatalogChanges,ManagerAuthorizationError,mergeProtectedParts} from '@/server/catalogAuthorization';
export class MockStore implements RemoteStore{
 private log:Movement[]=[];private parts:Part[]=[];private bins:Bin[]=[];private locations:LocationConfig[]=[];private configuration:WarehouseConfig=defaultConfiguration;
 async sync({cursor,operations,catalog}:Parameters<RemoteStore['sync']>[0],authorization:Parameters<RemoteStore['sync']>[1]={manager:true}){
  if(hasProtectedCatalogChanges({parts:this.parts,bins:this.bins,locations:this.locations,configuration:this.configuration},catalog)&&!authorization.manager)throw new ManagerAuthorizationError();
  const serverHasNewer=cursor<this.log.length;
  const initial=this.parts.length===0;this.parts=initial?mergeParts([],catalog.parts):authorization.manager?mergeProtectedParts(this.parts,catalog.parts):this.parts;this.bins=authorization.manager?mergeBins(this.bins,catalog.bins):this.bins;this.locations=authorization.manager?mergeByKey(this.locations,catalog.locations,value=>value.id):this.locations;this.configuration=authorization.manager?mergeLww(this.configuration,catalog.configuration):this.configuration;
  const ids=new Set(this.log.map(value=>value.id));
  for(const operation of operations)if(!ids.has(operation.id)){this.log.push({...operation,sync:'synced'});ids.add(operation.id);if(!initial)this.parts=this.parts.map(part=>part.code===operation.code?({...applyMovement(part,operation),updatedAt:operation.createdAt,updatedBy:operation.operator}):part)}
  return {accepted:operations.map(value=>value.id),changes:this.log.slice(cursor),cursor:this.log.length,serverHasNewer,catalog:{parts:this.parts,bins:this.bins,locations:this.locations.length?this.locations:defaultLocations,configuration:this.configuration}};
 }
 async allMovements(){return [...this.log]}
}
export const mockStore=new MockStore();
