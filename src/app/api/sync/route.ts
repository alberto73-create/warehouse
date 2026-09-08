import {NextResponse} from 'next/server';
// Endpoint idempotente: l'adapter Google sostituirà questo mock, mantenendo gli UUID dei movimenti.
export async function POST(req:Request){const body=await req.json();const operations=Array.isArray(body.operations)?body.operations:[];return NextResponse.json({accepted:[...new Set(operations.map((x:{id:string})=>x.id))],remoteChanges:[],serverTime:new Date().toISOString()})}
