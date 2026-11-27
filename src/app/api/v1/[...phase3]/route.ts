import {NextResponse,type NextRequest} from 'next/server';
import {Phase3Error,reject,phase3Gate,registrationGate} from '@/core/phase3';
import {sameOrigin} from '@/core/security';
import {jsonOk,requestId} from '@/lib/request';
import * as db from '@/lib/phase3-db';
import {boundedBody} from '@/lib/phase3-media';
import {register} from '@/lib/phase3-auth';
export const runtime='nodejs';export const dynamic='force-dynamic';
async function body(req:NextRequest):Promise<unknown>{if(!(req.headers.get('content-type')??'').startsWith('application/json'))reject(415,'JSON_REQUIRED');try{return JSON.parse((await boundedBody(req,16384)).toString('utf8'));}catch(e){if(e instanceof Phase3Error)throw e;reject(400,'INVALID_JSON');}}
function photo(bytes:Uint8Array){return new NextResponse(new Uint8Array(bytes),{headers:{'Content-Type':'image/webp','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':'inline'}});}
async function handler(req:NextRequest,context:{params:Promise<{phase3:string[]}>}){
 const rid=requestId();try{
 const parts=(await context.params).phase3,p=parts.join('/'),m=req.method;
 if(m!=='GET'&&!sameOrigin(req.headers.get('origin'),process.env.BETTER_AUTH_URL))reject(403,'ORIGIN_NOT_ALLOWED');
 if(p==='onboarding/status'&&m==='GET')return jsonOk({onboarding_open:registrationGate(process.env),account_enabled:phase3Gate(process.env),media_enabled:phase3Gate(process.env)&&process.env.XORA_PHASE3_MEDIA_APPROVED==='true',...db.policies(),matching_enabled:false,payments_enabled:false},rid);
 if(p==='auth/register'&&m==='POST')return jsonOk(await register(req,await body(req)),rid,202);
 if(parts[0]==='admin'&&parts[1]==='reviews'){
  const [, ,kind,id,action,mediaId]=parts;
  if(m==='GET'&&parts.length===3)return jsonOk(await db.reviewQueue(req,kind),rid);
  if(m==='POST'&&action==='claim'&&parts.length===5)return jsonOk(await db.claimReview(req,kind,id,rid),rid);
  if(m==='GET'&&parts.length===4)return jsonOk(await db.reviewDetail(req,kind,id,rid),rid);
  if(m==='POST'&&action==='decision'&&parts.length===5)return jsonOk(await db.decideReview(req,kind,id,await body(req),rid),rid);
  if(m==='GET'&&kind==='profile'&&action==='media'&&parts.length===6)return photo(await db.reviewerPhoto(req,id,mediaId,rid));
  reject(404,'NOT_FOUND');
 }
 // Explicit allowlist; no discover, payment, invitation or member-to-member endpoint.
 if(parts[0]!=='me')reject(404,'NOT_FOUND');const a=await db.member(req);
 if(p==='me/profile'&&m==='GET')return jsonOk(await db.summary(a),rid);
 if(p==='me/consents'&&m==='GET')return jsonOk(await db.getConsents(a),rid);
 if(p==='me/consents'&&m==='POST')return jsonOk(await db.recordConsent(a,await body(req),rid),rid);
 if(p==='me/profile'&&['PATCH','PUT'].includes(m))return jsonOk(await db.saveDraft(a,await body(req),rid),rid);
 if(p==='me/verification'&&m==='GET')return jsonOk((await db.summary(a)).eligibility,rid);
 if(p==='me/verification/submit'&&m==='POST')return jsonOk(await db.submitEligibility(a,rid),rid,202);
 if(parts.length===3&&parts[1]==='profile'&&['submit','pause','activate','resume'].includes(parts[2])&&m==='POST')return jsonOk(await db.profileAction(a,parts[2]==='resume'?'activate':parts[2],await body(req),rid),rid);
 if(p==='me/profile/media'&&m==='GET')return jsonOk((await db.summary(a)).photos,rid);
 if(p==='me/profile/media'&&m==='POST')return jsonOk(await db.uploadPhoto(a,req,rid),rid,201);
 if(parts.length===5&&parts[1]==='profile'&&parts[2]==='media'&&parts[4]==='view'&&m==='GET')return photo(await db.ownPhoto(a,parts[3],rid));
 if(parts.length===4&&parts[1]==='profile'&&parts[2]==='media'&&m==='DELETE')return jsonOk(await db.removePhoto(a,parts[3],rid),rid);
 if(['me/privacy/requests','me/privacy-requests'].includes(p)&&m==='GET')return jsonOk(await db.listPrivacy(a),rid);
 if(['me/privacy/requests','me/privacy-requests'].includes(p)&&m==='POST')return jsonOk(await db.privacy(a,await body(req),rid),rid,202);
 if(p==='me/security/sessions'&&m==='GET')return jsonOk(await db.sessions(a),rid);
 if(parts.length===4&&parts[1]==='security'&&parts[2]==='sessions'&&m==='DELETE')return jsonOk(await db.revokeSession(a,parts[3],rid),rid);
 reject(404,'NOT_FOUND');
 }catch(e){const status=e instanceof Phase3Error?e.status:503,code=e instanceof Phase3Error?e.code:'SERVICE_UNAVAILABLE';return NextResponse.json({title:'Request could not be completed',status,code,request_id:rid},{status,headers:{'Cache-Control':'no-store','X-Request-Id':rid}});}
}
export const GET=handler;export const POST=handler;export const PATCH=handler;export const PUT=handler;export const DELETE=handler;
