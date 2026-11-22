import 'server-only';
import {requireEnv} from './env';
import {verifiedMailUrl,verifiedRecipient,verifiedSender} from '@/core/email-transport';
export async function sendAuthEmail(input:{to:string;url:string;kind:'verify'|'password-reset'}):Promise<void>{
 // This mechanism is disabled until a verified sender and explicit staging allowlist are configured.
 const key=requireEnv('RESEND_API_KEY');
 const from=requireEnv('XORA_EMAIL_FROM');
 const base=requireEnv('BETTER_AUTH_URL');
 const allowed=requireEnv('XORA_STAGING_EMAIL_ALLOWLIST_DOMAINS');
 if(process.env.XORA_ENVIRONMENT!=='staging'||process.env.XORA_PUBLIC_LAUNCH==='true'||!verifiedMailUrl(input.url,base)||!verifiedSender(from)||!verifiedRecipient(input.to,allowed))throw Error('EMAIL_POLICY_REJECTED');
 const subject=input.kind==='verify'?'Confirm your XORA email':'Reset your XORA password';
 const copy=input.kind==='verify'?'Confirm your email with the link below.':'If you requested a password reset, use the link below.';
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),7000);
 try{
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[input.to],subject,text:`${copy}\n\n${input.url}\n\nThis link may expire. If you did not make this request, ignore this email.`}),signal:controller.signal,cache:'no-store'});
  if(!response.ok)throw Error('EMAIL_DELIVERY_FAILED');
 }finally{clearTimeout(timer);}
}
