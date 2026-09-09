import {NextResponse} from 'next/server';
import {getRemoteStore} from '@/server/adapters';
import {managerTokenFromRequest,verifyManagerToken} from '@/server/managerAuth';
import {ManagerAuthorizationError} from '@/server/catalogAuthorization';
import {parseSyncRequest} from '@/server/syncValidation';
export async function POST(request:Request){
 try{
  const input=parseSyncRequest(await request.json());
  const manager=verifyManagerToken(managerTokenFromRequest(request));
  if(input.operations.some(operation=>operation.kind==='adjustment')&&!manager)return NextResponse.json({error:'Autorizzazione Manager richiesta'},{status:403});
  const store=await getRemoteStore();
  return NextResponse.json(await store.sync(input,{manager}));
 }catch(error){if(error instanceof ManagerAuthorizationError)return NextResponse.json({error:error.message},{status:403});const message=error instanceof Error?error.message:'Errore sync';const invalid=/non valid|Catalogo|Articolo/.test(message);return NextResponse.json({error:invalid?message:'Servizio di sincronizzazione non disponibile'},{status:invalid?400:500})}
}
