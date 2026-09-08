import {createHmac,timingSafeEqual} from 'node:crypto';
const secret=()=>process.env.MANAGER_TOKEN_SECRET||'';
const sign=(payload:string)=>createHmac('sha256',secret()).update(payload).digest('base64url');
export function issueManagerToken(){if(!secret())throw new Error('MANAGER_TOKEN_SECRET mancante');const payload=Buffer.from(JSON.stringify({role:'manager',exp:Date.now()+8*60*60*1000})).toString('base64url');return `${payload}.${sign(payload)}`}
export function verifyManagerToken(token?:string){if(!token||!secret())return false;const [payload,signature]=token.split('.');if(!payload||!signature)return false;const expected=sign(payload);if(signature.length!==expected.length||!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return false;try{return (JSON.parse(Buffer.from(payload,'base64url').toString()) as {role:string;exp:number}).role==='manager'&&Date.now()<(JSON.parse(Buffer.from(payload,'base64url').toString()) as {exp:number}).exp}catch{return false}}
