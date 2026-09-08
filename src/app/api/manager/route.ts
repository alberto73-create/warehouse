import {NextResponse} from 'next/server';
import {issueManagerToken} from '@/server/managerAuth';
export async function POST(request:Request){const {pin}=await request.json() as {pin?:string};if(!process.env.MANAGER_PIN||pin!==process.env.MANAGER_PIN)return NextResponse.json({error:'PIN non corretto'},{status:401});return NextResponse.json({token:issueManagerToken()})}
