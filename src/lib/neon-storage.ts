import 'server-only';
import {S3Client,PutObjectCommand,GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {requireEnv} from './env';
import {evaluateUpload, type UploadInput} from '@/core/upload-policy';
import {privateBuckets,permittedPrivateKey,signedDownloadTtl,type FilePurpose} from '@/core/private-files';

let client:S3Client|undefined;
function getStorage(){
 if(client)return client;
 const endpoint=requireEnv('AWS_ENDPOINT_URL_S3');
 const url=new URL(endpoint);
 const expected='br-proud-base-bgx1lcns.storage.c-9.eu-central-1.aws.neon.tech';
 if(url.protocol!=='https:'||url.hostname!==expected||url.pathname!=='/'||process.env.XORA_DATABASE_NEON_BRANCH_ID!=='br-proud-base-bgx1lcns')throw Error('WRONG_XORA_STORAGE_BRANCH');
 client=new S3Client({region:'eu-central-1',endpoint,forcePathStyle:true,credentials:{accessKeyId:requireEnv('AWS_ACCESS_KEY_ID'),secretAccessKey:requireEnv('AWS_SECRET_ACCESS_KEY')}});
 return client;
}
export async function presignSyntheticUpload(input:UploadInput,key:string){
 const decision=evaluateUpload(input);
 if(!decision.ok)throw Error(decision.code);
 if(input.purpose!=='synthetic_test'||!/^fixtures\/phase2\/[a-f0-9-]{36}\.(png|txt)$/.test(key))throw Error('UNSAFE_KEY');
 const cmd=new PutObjectCommand({Bucket:decision.bucket,Key:key,ContentType:input.contentType,ContentLength:input.sizeBytes});
 const url=await getSignedUrl(getStorage(),cmd,{expiresIn:90});
 return {url,method:'PUT',contentType:input.contentType,expiresSeconds:90};
}
export async function presignPrivateDownload(input:{purpose:FilePurpose;key:string;ownerId:string}){
 if(input.purpose==='synthetic_test')throw Error('SYNTHETIC_DOWNLOAD_DISABLED');
 if(!permittedPrivateKey(input.purpose,input.key,input.ownerId))throw Error('INVALID_PRIVATE_OBJECT_KEY');
 const ttl=signedDownloadTtl(input.purpose);
 const command=new GetObjectCommand({Bucket:privateBuckets[input.purpose],Key:input.key,ResponseContentDisposition:'attachment',ResponseCacheControl:'private,no-store'});
 const signed=await getSignedUrl(getStorage(),command,{expiresIn:ttl});
 if(!signed.startsWith('https://'))throw Error('INVALID_SIGNED_URL');
 return {url:signed,expires_in_seconds:ttl};
}
