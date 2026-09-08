import type {RemoteStore} from './types';
import {mockStore} from './mock';
export async function getRemoteStore():Promise<RemoteStore>{if(process.env.DATA_ADAPTER==='google'){const {GoogleSheetsStore}=await import('./googleSheets');return new GoogleSheetsStore()}return mockStore}
