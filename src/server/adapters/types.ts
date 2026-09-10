import type {Movement} from '@/domain/types';
import type {SyncRequest,SyncResponse} from '@/sync/protocol';
export interface SyncAuthorization {manager:boolean}
export interface RemoteStore{sync(request:SyncRequest,authorization?:SyncAuthorization):Promise<SyncResponse>;allMovements():Promise<Movement[]>}
