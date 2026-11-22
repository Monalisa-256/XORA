import {NextResponse,type NextRequest} from 'next/server';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {getPool} from '@/lib/db';
import {authorizedTestRequest} from '@/lib/staging-guard';
import {presignSyntheticUpload} from '@/lib/neon-storage';
import {jsonOk,jsonError,requestId} from '@/lib/request';
export const runtime='nodejs';
const Input=z.object({contentType:z.enum(['text/plain','image/png']),sizeBytes:z.number().int().min(1).max(1024*1024)}).strict();
export async function POST(req:NextRequest){
 const request=requestId();
 if(!authorizedTestRequest(req))return new NextResponse(null,{status:404});
 try{
  if(Number(req.headers.get('content-length')||0)>2048)return jsonError('INVALID_REQUEST',413,request);
  const parsed=Input.safeParse(await req.json());
  if(!parsed.success)return jsonError('INVALID_REQUEST',422,request);
  const key=`fixtures/phase2/${randomUUID()}.${parsed.data.contentType==='image/png'?'png':'txt'}`;
  const result=await presignSyntheticUpload({purpose:'synthetic_test',contentType:parsed.data.contentType,sizeBytes:parsed.data.sizeBytes,enabled:true,syntheticOnly:true},key);
  const record=await getPool().query(`INSERT INTO file_objects(owner_id,purpose,object_key,content_type,size_bytes)
   SELECT id,'synthetic_test',$1,$2,$3 FROM accounts WHERE auth_user_id='phase2-demo-001@xora.invalid' RETURNING id`,
  [key,parsed.data.contentType,parsed.data.sizeBytes]);
  if(!record.rows.length)return jsonError('SERVICE_UNAVAILABLE',503,request);
  return jsonOk({upload_id:record.rows[0].id,put_url:result.url,method:result.method,content_type:result.contentType,expires_in_seconds:result.expiresSeconds,inspection_status:'pending'},request,201);
 }catch{return jsonError('SERVICE_UNAVAILABLE',503,request)}
}
