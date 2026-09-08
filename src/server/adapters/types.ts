import type {Movement} from '@/domain/types';
import type {SyncRequest,SyncResponse} from '@/sync/protocol';
export interface RemoteStore{sync(request:SyncRequest):Promise<SyncResponse>;allMovements():Promise<Movement[]>}
