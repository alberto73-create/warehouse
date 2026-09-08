'use client';
import Dexie,{type EntityTable} from 'dexie'; import type {Bin,Movement,Part,Session} from '@/domain/types';
export const db=new Dexie('magazzino-tecnico') as Dexie & {parts:EntityTable<Part,'code'>;movements:EntityTable<Movement,'id'>;bins:EntityTable<Bin,'id'>;sessions:EntityTable<Session,'id'>;meta:EntityTable<{key:string;value:string},'key'>};
db.version(1).stores({parts:'code,name,favorite',movements:'id,code,createdAt,sync',meta:'key'});
db.version(2).stores({parts:'code,name,favorite',movements:'id,code,createdAt,sync',bins:'id,enabled,row,column',sessions:'id',meta:'key'});
