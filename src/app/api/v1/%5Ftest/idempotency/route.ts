import {NextResponse,type NextRequest} from 'next/server';
import {authorizedTestRequest} from '@/lib/staging-guard';
import {jsonOk,jsonError,requestId} from '@/lib/request';
import {reserveSyntheticAction} from '@/lib/idempotency-db';
export const runtime='nodejs';
export async function POST(req:NextRequest){const id=requestId();
 if(!authorizedTestRequest(req))return new NextResponse(null,{status:404});
 try{
  const payload=await req.json() as unknown;
  if(!payload||typeof payload!=='object'||Array.isArray(payload)||JSON.stringify(payload).length>1024)return jsonError('INVALID_REQUEST',422,id);
  const key=req.headers.get('Idempotency-Key')||'';
  const result=await reserveSyntheticAction('phase2-fixture','test.idempotency',key,payload);
  if(result.kind==='conflict')return jsonError('KEY_REUSED',409,id);
  if(result.kind==='pending')return jsonError('RETRY_LATER',409,id);
  return jsonOk({action_id:result.resultRef,replayed:result.kind==='replay'},id,result.kind==='replay'?200:201);
 }catch{return jsonError('INVALID_REQUEST',422,id);}
}
