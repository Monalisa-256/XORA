import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {mediaFormat,reject,validMediaDeclaration} from './phase3.ts';
export async function normalizePhoto(bytes:Buffer,mime:string){
 if(!['image/jpeg','image/png','image/webp'].includes(mime))reject(415,'UNSUPPORTED_PHOTO');
 const format=mediaFormat(bytes);
 if(!format||!validMediaDeclaration(mime,bytes.length)||mime!==`image/${format}`)reject(422,'INVALID_PHOTO');
 try{
  const img=sharp(bytes,{limitInputPixels:16_000_000,failOn:'error',animated:false});
  const meta=await img.metadata();if(meta.format!==format||(meta.pages??1)!==1||!meta.width||!meta.height||meta.width<128||meta.height<128)reject(422,'INVALID_PHOTO');
  const data=await img.rotate().resize(1200,1200,{fit:'inside',withoutEnlargement:true}).webp({quality:76}).toBuffer();
  if(data.length>1048576)reject(413,'TRANSFORMED_PHOTO_TOO_LARGE');return {data,sha:createHash('sha256').update(data).digest('hex')};
 }catch(e){if(e instanceof Error&&e.name==='Phase3Error')throw e;reject(422,'INVALID_PHOTO');}
}
