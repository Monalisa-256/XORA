import type {NextRequest} from 'next/server';
import {resolveAccountSession} from '@/lib/session';
import {staffStepUp} from '@/lib/staff-mfa-db';
import {jsonError,jsonOk,requestId} from '@/lib/request';
export const runtime='nodejs';
export async function POST(req:NextRequest){const id=requestId();try{
 const member=await resolveAccountSession(req);if(!member)return jsonError('UNAUTHORIZED',401,id);
 if(Number(req.headers.get('content-length')||0)>500)return jsonError('INVALID_REQUEST',413,id);
 const body=await req.json();if(!body||Object.keys(body).length!==1||typeof body.code!=='string'||!/^[0-9]{6}$/.test(body.code))return jsonError('INVALID_REQUEST',422,id);
 const ok=await staffStepUp(member.accountId,member.authSessionId,body.code,true,id);
 return ok?jsonOk({mfa:'confirmed',step_up_expires_in_seconds:600},id):jsonError('FORBIDDEN',403,id);
}catch{return jsonError('SERVICE_UNAVAILABLE',503,id)}}
