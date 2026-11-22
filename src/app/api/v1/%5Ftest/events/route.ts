import {NextResponse,type NextRequest} from 'next/server';
import {authorizedTestRequest} from '@/lib/staging-guard';
import {jsonOk,jsonError,requestId} from '@/lib/request';
import {enqueueSyntheticOutbox} from '@/lib/outbox-db';
export const runtime='nodejs';
export async function POST(req:NextRequest){const id=requestId();
 if(!authorizedTestRequest(req))return new NextResponse(null,{status:404});
 try{const body=await req.json() as {dedupe_key?:string};
  if(!body||typeof body.dedupe_key!=='string'||!/^[a-zA-Z0-9:_-]{16,128}$/.test(body.dedupe_key))return jsonError('INVALID_REQUEST',422,id);
  const result=await enqueueSyntheticOutbox(body.dedupe_key);
  return jsonOk({event_id:result.eventId,replayed:result.replay},id,result.replay?200:202);
 }catch{return jsonError('SERVICE_UNAVAILABLE',503,id);}
}
