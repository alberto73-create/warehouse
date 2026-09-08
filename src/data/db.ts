'use client';
import Dexie,{type EntityTable} from 'dexie'; import type {Bin,LocationConfig,Movement,Part,Session,WarehouseConfig} from '@/domain/types';
export const db=new Dexie('magazzino-tecnico') as Dexie & {parts:EntityTable<Part,'code'>;movements:EntityTable<Movement,'id'>;bins:EntityTable<Bin,'id'>;locations:EntityTable<LocationConfig,'id'>;config:EntityTable<WarehouseConfig,'id'>;sessions:EntityTable<Session,'id'>;meta:EntityTable<{key:string;value:string},'key'>};
db.version(1).stores({parts:'code,name,favorite',movements:'id,code,createdAt,sync',meta:'key'});
db.version(2).stores({parts:'code,name,favorite',movements:'id,code,createdAt,sync',bins:'id,enabled,row,column',sessions:'id',meta:'key'});
db.version(3).stores({parts:'code,name,favorite',movements:'id,code,createdAt,sync',bins:'id,enabled,row,column',locations:'id,kind',config:'id',sessions:'id',meta:'key'});
