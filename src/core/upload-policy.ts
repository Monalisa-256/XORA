/** Strict synthetic-file policy. Never equate browser-declared content type with verified content. */
export type FilePurpose = 'synthetic_test'|'profile_photo'|'verification_evidence'|'payment_proof'|'support_attachment';
export type UploadInput = { purpose:FilePurpose; contentType:string; sizeBytes:number; sha256?:string; enabled:boolean; syntheticOnly:boolean };
export type UploadDecision = {ok:true;bucket:string;sizeLimit:number}|{ok:false;code:string};
const IMAGE_TYPES = new Set(['image/jpeg','image/png','image/webp']);
const LIMITS: Record<FilePurpose,number>={synthetic_test:1024*1024,profile_photo:8*1024*1024,verification_evidence:10*1024*1024,payment_proof:6*1024*1024,support_attachment:6*1024*1024};
const BUCKETS:Record<FilePurpose,string>={synthetic_test:'xora-synthetic-fixtures',profile_photo:'xora-profile-media',verification_evidence:'xora-eligibility-evidence',payment_proof:'xora-payment-proofs',support_attachment:'xora-payment-proofs'};
export function evaluateUpload(input:UploadInput):UploadDecision{
  if(!input.enabled)return {ok:false,code:'UPLOADS_DISABLED'};
  if(input.syntheticOnly&&input.purpose!=='synthetic_test')return {ok:false,code:'SYNTHETIC_ONLY'};
  if(input.purpose==='synthetic_test'){
    if(!['text/plain','image/png'].includes(input.contentType))return {ok:false,code:'UNSUPPORTED_MIME'};
  }else if(!IMAGE_TYPES.has(input.contentType))return {ok:false,code:'UNSUPPORTED_MIME'};
  if(!Number.isSafeInteger(input.sizeBytes)||input.sizeBytes<1||input.sizeBytes>LIMITS[input.purpose])return {ok:false,code:'INVALID_SIZE'};
  if(input.sha256&&!/^[a-f0-9]{64}$/.test(input.sha256))return {ok:false,code:'INVALID_CHECKSUM'};
  return {ok:true,bucket:BUCKETS[input.purpose],sizeLimit:LIMITS[input.purpose]};
}
/** Only a quarantined, server-inspected object may become a confirmed visible file. */
export function fileConfirmationAllowed(input:{uploaded:boolean;actualType:string;declaredType:string;actualSize:number;declaredSize:number;scanResult:'clean'|'malicious'|'pending'|'error';checksumMatched:boolean}):boolean {
  return input.uploaded&&input.actualType===input.declaredType&&input.actualSize===input.declaredSize&&input.actualSize>0&&input.checksumMatched&&input.scanResult==='clean';
}
