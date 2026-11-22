/** Filename and object-key guards are pure so they can be tested without cloud credentials. */
export const privateBuckets = {
  synthetic_test:'xora-synthetic-fixtures',
  profile_photo:'xora-profile-media',
  verification_evidence:'xora-eligibility-evidence',
  payment_proof:'xora-payment-proofs',
  support_attachment:'xora-payment-proofs'
} as const;
export type FilePurpose=keyof typeof privateBuckets;
export function permittedPrivateKey(purpose:string,key:string,ownerId:string):boolean{
 if(!/^[0-9a-f-]{36}$/i.test(ownerId)||key.length>512||key.includes('..')||key.includes('\\')||key.includes('%'))return false;
 if(purpose==='synthetic_test')return /^fixtures\/phase2\/[0-9a-f-]{36}\.(png|txt)$/.test(key);
 if(purpose==='profile_photo')return key.startsWith(`profile/${ownerId}/`)&&/^profile\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key);
 if(purpose==='verification_evidence')return key.startsWith(`evidence/${ownerId}/`)&&/^evidence\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key);
 if(purpose==='payment_proof')return key.startsWith(`proof/${ownerId}/`)&&/^proof\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key);
 if(purpose==='support_attachment')return key.startsWith(`support/${ownerId}/`)&&/^support\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key);
 return false;
}
export function signedDownloadTtl(purpose:string){return purpose==='profile_photo'?45:20;}
