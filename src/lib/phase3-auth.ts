import 'server-only';
import {NextRequest,NextResponse} from 'next/server';
import {toNextJsHandler} from 'better-auth/next-js';
import {getAuth} from './auth';
import {registrationGate,validateRegistration,reject} from '@/core/phase3';
import {sameOrigin} from '@/core/security';
import {policies,requirePhase3Schema} from './phase3-db';
import {verifiedRecipient} from '@/core/email-transport';
import {getPool} from './db';
export async function register(req:NextRequest,input:unknown){
 if(!registrationGate(process.env))reject(503,'REGISTRATION_CLOSED');if(!sameOrigin(req.headers.get('origin'),process.env.BETTER_AUTH_URL))reject(403,'ORIGIN_NOT_ALLOWED');
 await requirePhase3Schema();const p=policies(),v=validateRegistration(input,p.terms,p.privacy);
 if(!verifiedRecipient(v.email,process.env.XORA_PHASE3_EMAIL_ALLOWLIST_DOMAINS??''))reject(503,'REGISTRATION_NOT_AVAILABLE');
 const base=process.env.BETTER_AUTH_URL!;const headers=new Headers(req.headers);headers.set('content-type','application/json');headers.delete('content-length');
 const response=await toNextJsHandler(getAuth()).POST(new NextRequest(new URL('/api/auth/sign-up/email',base),{method:'POST',headers,body:JSON.stringify({email:v.email,password:v.password,name:'Member',callbackURL:'/account'})}));
 if(response.status===429)reject(429,'RETRY_LATER');if(response.status>=500)reject(503,'REGISTRATION_NOT_AVAILABLE');
 // Capture registration agreement only for an actual provider-created user. The verified user must reconfirm before any draft action.
 if(response.ok){const data=await response.json().catch(()=>null);const uid=data?.user?.id;if(typeof uid==='string'&&uid.length<=128){await getPool().query(`INSERT INTO registration_agreements(auth_user_id,terms_version,privacy_version,marketing) SELECT id,$2,$3,$4 FROM "user" WHERE id=$1 AND lower(email)=$5 AND "emailVerified"=false ON CONFLICT(auth_user_id) DO NOTHING`,[uid,p.terms,p.privacy,v.marketing,v.email]);}}
 return {status:'check_email',message:'If the address can be registered, check your email. You will confirm your policies after verification.'};
}
export function authClosed(){return NextResponse.json({code:'AUTH_NOT_AVAILABLE'},{status:503,headers:{'Cache-Control':'no-store'}});}
