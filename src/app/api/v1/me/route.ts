import type {NextRequest} from 'next/server';
import {phase3Gate,Phase3Error} from '@/core/phase3';
import {member,summary} from '@/lib/phase3-db';
import {resolveAccountSession} from '@/lib/session';
import {jsonOk,jsonError,requestId} from '@/lib/request';
export const runtime='nodejs';
export async function GET(req:NextRequest){
 const id=requestId();try{
  if(phase3Gate(process.env))return jsonOk(await summary(await member(req)),id);
  const session=await resolveAccountSession(req);if(!session)return jsonError('UNAUTHORIZED',401,id);
  return jsonOk({account_id:session.accountId,account_status:session.accountStatus,email_verified:true,eligibility_status:'unavailable_phase_2',profile_status:'unavailable_phase_2'},id);
 }catch(e){if(e instanceof Phase3Error&&e.status===401)return jsonError('UNAUTHORIZED',401,id);if(e instanceof Phase3Error&&e.status===403)return jsonError('FORBIDDEN',403,id);return jsonError('SERVICE_UNAVAILABLE',503,id);}
}
