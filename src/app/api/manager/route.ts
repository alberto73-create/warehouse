import {NextResponse} from 'next/server';
import {issueManagerToken,managerCookieName} from '@/server/managerAuth';
export async function POST(request:Request){const {pin}=await request.json() as {pin?:string};if(!process.env.MANAGER_PIN||pin!==process.env.MANAGER_PIN)return NextResponse.json({error:'PIN non corretto'},{status:401});const response=NextResponse.json({role:'manager'});response.cookies.set(managerCookieName,issueManagerToken(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:8*60*60});return response}
export async function DELETE(){const response=NextResponse.json({role:'base'});response.cookies.set(managerCookieName,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0});return response}
