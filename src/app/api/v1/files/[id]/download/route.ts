import type {NextRequest} from 'next/server';
import {resolveAccountSession} from '@/lib/session';
import {getPool} from '@/lib/db';
import {mayDownloadFile} from '@/core/policy';
import {isUuid} from '@/core/security';
import {permittedPrivateKey,type FilePurpose} from '@/core/private-files';
import {presignPrivateDownload} from '@/lib/neon-storage';
import {requestId,jsonOk,jsonError} from '@/lib/request';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest,context:{params:Promise<{id:string}>}){
 const id=requestId();
 try{
  const user=await resolveAccountSession(req);if(!user)return jsonError('UNAUTHORIZED',401,id);
  const {id:fileId}=await context.params;
  if(!isUuid(fileId))return jsonError('NOT_FOUND',404,id);
  const result=await getPool().query(`SELECT owner_id,purpose,object_key,state FROM file_objects WHERE id=$1 LIMIT 1`,[fileId]);
  const file=result.rows[0];
  // Sensitive evidence is never directly retrievable via this owner-only route.
  const ok=file && mayDownloadFile({ownerId:file.owner_id,actorId:user.accountId,state:file.state,purpose:file.purpose,staffCaseAuthorized:false}).allow && permittedPrivateKey(file.purpose,file.object_key,file.owner_id);
  if(!ok)return jsonError('NOT_FOUND',404,id);
  const signed=await presignPrivateDownload({purpose:file.purpose as FilePurpose,key:file.object_key,ownerId:file.owner_id});
  await getPool().query(`INSERT INTO file_access_events(file_id,actor_id,purpose,outcome) VALUES ($1,$2,'private_download','allowed')`,[fileId,user.accountId]);
  return jsonOk(signed,id);
 }catch{return jsonError('SERVICE_UNAVAILABLE',503,id)}
}
