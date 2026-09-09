import type {Bin,LocationConfig,Movement,Part,WarehouseConfig} from '@/domain/types';
import {applyMovement} from '@/domain/inventory';
export interface SyncCatalog{parts:Part[];bins:Bin[];locations:LocationConfig[];configuration:WarehouseConfig}
export interface SyncRequest{deviceId:string;cursor:number;operations:Movement[];catalog:SyncCatalog}
export interface SyncResponse{accepted:string[];changes:Movement[];cursor:number;serverHasNewer:boolean;catalog:SyncCatalog}
export function mergeRemote(parts:Part[],localMovements:Movement[],changes:Movement[]){const known=new Set(localMovements.map(m=>m.id));const fresh=changes.filter(m=>!known.has(m.id));const next=parts.map(part=>fresh.filter(m=>m.code===part.code).reduce((value,movement)=>applyMovement(value,{...movement,sync:'synced'}),part));return {parts:next,movements:[...localMovements,...fresh.map(m=>({...m,sync:'synced' as const}))],applied:fresh.map(m=>m.id)}}
