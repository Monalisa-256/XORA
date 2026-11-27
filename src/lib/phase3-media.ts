import 'server-only';
import {S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand} from '@aws-sdk/client-s3';
import {createHash} from 'node:crypto';
import {maxPhotoBytes,reject} from '@/core/phase3';
import {requireEnv} from './env';
import {normalizePhoto} from '@/core/phase3-image';
const bucket='xora-profile-media';
function client(){
 if(process.env.XORA_PHASE3_MEDIA_APPROVED!=='true'||process.env.XORA_ENVIRONMENT!=='production'||process.env.XORA_DATABASE_NEON_BRANCH_ID!=='br-young-hill-bgijo9jk')reject(503,'MEDIA_NOT_AVAILABLE');
 const endpoint=new URL(requireEnv('AWS_ENDPOINT_URL_S3'));
 if(endpoint.protocol!=='https:'||endpoint.hostname!=='br-young-hill-bgijo9jk.storage.c-9.eu-central-1.aws.neon.tech'||endpoint.pathname!=='/'||endpoint.username||endpoint.password||endpoint.search||endpoint.hash||endpoint.port)reject(503,'MEDIA_TARGET_MISMATCH');
 return new S3Client({endpoint:endpoint.origin,region:'eu-central-1',forcePathStyle:true,credentials:{accessKeyId:requireEnv('AWS_ACCESS_KEY_ID'),secretAccessKey:requireEnv('AWS_SECRET_ACCESS_KEY')},maxAttempts:2});
}
export async function boundedBody(req:Request,limit:number):Promise<Buffer>{
 const length=req.headers.get('content-length');if(length&&(!/^\d+$/.test(length)||Number(length)>limit))reject(413,'BODY_TOO_LARGE');
 if(!req.body)reject(400,'BODY_REQUIRED');const reader=req.body.getReader();let total=0;const chunks:Uint8Array[]=[];
 try{while(true){const item=await reader.read();if(item.done)break;total+=item.value.length;if(total>limit){await reader.cancel();reject(413,'BODY_TOO_LARGE');}chunks.push(item.value);}}finally{reader.releaseLock();}
 return Buffer.concat(chunks);
}
export async function transformPhoto(req:Request){const mime=req.headers.get('content-type')??'';if(!['image/jpeg','image/png','image/webp'].includes(mime))reject(415,'UNSUPPORTED_PHOTO');return normalizePhoto(await boundedBody(req,maxPhotoBytes),mime);}
function checkKey(key:string){if(!/^profile\/[a-f0-9-]{36}\/[a-f0-9-]{36}\.webp$/i.test(key))reject(503,'MEDIA_KEY_INVALID');}
export async function storePhoto(key:string,data:Buffer){checkKey(key);const s=client();try{await s.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:data,ContentType:'image/webp',CacheControl:'private, no-store'}),{abortSignal:AbortSignal.timeout(12000)});}finally{s.destroy();}}
export async function deletePhoto(key:string){checkKey(key);const s=client();try{await s.send(new DeleteObjectCommand({Bucket:bucket,Key:key}),{abortSignal:AbortSignal.timeout(10000)});}finally{s.destroy();}}
export async function readPhoto(key:string,expectedSha:string):Promise<Uint8Array>{checkKey(key);const s=client();try{const obj=await s.send(new GetObjectCommand({Bucket:bucket,Key:key}),{abortSignal:AbortSignal.timeout(10000)});if(!obj.Body||!obj.ContentLength||obj.ContentLength>1048576)reject(503,'MEDIA_UNAVAILABLE');const data=await obj.Body.transformToByteArray();if(data.length>1048576||createHash('sha256').update(data).digest('hex')!==expectedSha)reject(503,'MEDIA_INTEGRITY_FAILURE');return data;}finally{s.destroy();}}
