import type {NextRequest} from 'next/server';
import {resolveAccountSession} from '@/lib/session';
import {beginStaffMfaEnrollment,staffStatus} from '@/lib/staff-mfa-db';
import {enrolmentAllowed,toOtpAuthUri} from '@/core/staff-mfa';
import {jsonError,jsonOk,requestId} from '@/lib/request';
export const runtime='nodejs';
export async function POST(req:NextRequest){const id=requestId();try{
 const member=await resolveAccountSession(req);if(!member)return jsonError('UNAUTHORIZED',401,id);
 const state=await staffStatus(member.accountId);
 if(!enrolmentAllowed({staffStatus:state,accountStatus:member.accountStatus,emailVerified:member.emailVerified,sessionAgeMs:Date.now()-member.signedInAt,alreadyConfirmed:false}))return jsonError('FORBIDDEN',403,id);
 const challenge=await beginStaffMfaEnrollment(member.accountId,id);
 if(!challenge)return jsonError('CONFLICT',409,id);
 return jsonOk({setup_uri:toOtpAuthUri('XORA Staff',challenge.secret),secret:challenge.secret,expires_instructions:'Scan into an authenticator and confirm the first code. Never share the secret.'},id,201);
}catch{return jsonError('SERVICE_UNAVAILABLE',503,id)}}
