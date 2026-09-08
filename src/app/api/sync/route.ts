import {NextResponse} from 'next/server';
import {getRemoteStore} from '@/server/adapters';
import type {SyncRequest} from '@/sync/protocol';
import {verifyManagerToken} from '@/server/managerAuth';
export async function POST(request:Request){
 try{
  const body=await request.json() as Partial<SyncRequest>;
  const input:SyncRequest={
   deviceId:String(body.deviceId??'unknown'),
   cursor:Number(body.cursor??0),
   operations:Array.isArray(body.operations)?body.operations:[],
   catalog:{parts:Array.isArray(body.catalog?.parts)?body.catalog.parts:[],bins:Array.isArray(body.catalog?.bins)?body.catalog.bins:[],locations:Array.isArray(body.catalog?.locations)?body.catalog.locations:[],configuration:body.catalog?.configuration??{id:'warehouse',name:'Magazzino tecnico',updatedAt:'1970-01-01T00:00:00.000Z',updatedBy:'system'}},managerMutation:Boolean(body.managerMutation),managerToken:body.managerToken
  };
  if((input.managerMutation||input.operations.some(operation=>operation.kind==='adjustment'))&&!verifyManagerToken(input.managerToken))return NextResponse.json({error:'Autorizzazione Manager richiesta'},{status:403});
  const store=await getRemoteStore();
  return NextResponse.json(await store.sync(input));
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Errore sync'},{status:500})}
}
