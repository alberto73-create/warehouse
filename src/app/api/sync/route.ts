import {NextResponse} from 'next/server';
import {getRemoteStore} from '@/server/adapters';
import type {SyncRequest} from '@/sync/protocol';
export async function POST(request:Request){try{const body=await request.json() as Partial<SyncRequest>;const input:SyncRequest={deviceId:String(body.deviceId??'unknown'),cursor:Number(body.cursor??0),operations:Array.isArray(body.operations)?body.operations:[]};const store=await getRemoteStore();return NextResponse.json(await store.sync(input))}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Errore sync'},{status:500})}}
