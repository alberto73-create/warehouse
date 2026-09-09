import {NextResponse} from 'next/server';
import {GoogleSheetsStore,GoogleSheetsError} from '@/server/adapters/googleSheets';
import {managerTokenFromRequest,verifyManagerToken} from '@/server/managerAuth';

export async function GET(request:Request){
 if(!verifyManagerToken(managerTokenFromRequest(request)))return NextResponse.json({error:'Autorizzazione Manager richiesta'},{status:403});
 const adapter=process.env.DATA_ADAPTER??'mock',environment={clientEmail:Boolean(process.env.GOOGLE_CLIENT_EMAIL),privateKey:Boolean(process.env.GOOGLE_PRIVATE_KEY),sheetId:Boolean(process.env.GOOGLE_SHEET_ID),managerTokenSecret:Boolean(process.env.MANAGER_TOKEN_SECRET)};
 if(adapter!=='google')return NextResponse.json({adapter,environment,googleAuth:'not_configured',spreadsheetAccess:'not_checked',sheets:{}});
 try{return NextResponse.json({adapter,environment,...await new GoogleSheetsStore().diagnostics()})}catch(error){const message=error instanceof GoogleSheetsError?error.message:'Diagnostica Google non disponibile';return NextResponse.json({adapter,environment,googleAuth:/Autenticazione|Credenziali/.test(message)?'error':'ok',spreadsheetAccess:'error',sheets:{},error:message},{status:error instanceof GoogleSheetsError?error.status:500})}
}
