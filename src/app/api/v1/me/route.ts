import type {NextRequest} from 'next/server';
import {resolveAccountSession} from '@/lib/session';
import {jsonOk,jsonError,requestId} from '@/lib/request';
export const runtime='nodejs';
export async function GET(req:NextRequest){
 const id=requestId();try{
  const session=await resolveAccountSession(req);if(!session)return jsonError('UNAUTHORIZED',401,id);
  return jsonOk({account_id:session.accountId,account_status:session.accountStatus,email_verified:true,eligibility_status:'unavailable_phase_2',profile_status:'unavailable_phase_2'},id);
 }catch{return jsonError('SERVICE_UNAVAILABLE',503,id);}
}
