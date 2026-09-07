'use client';
import Dexie,{type EntityTable} from 'dexie'; import type {Movement,Part} from '@/domain/types';
export const db=new Dexie('magazzino-tecnico') as Dexie & {parts:EntityTable<Part,'code'>;movements:EntityTable<Movement,'id'>;meta:EntityTable<{key:string;value:string},'key'>};
db.version(1).stores({parts:'code,name,favorite',movements:'id,code,createdAt,sync',meta:'key'});
