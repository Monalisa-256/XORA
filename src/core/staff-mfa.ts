/** XORA server-side staff TOTP/step-up policy. No browser-managed roles or MFA flags. */
import { createCipheriv,createDecipheriv,createHmac,randomBytes,timingSafeEqual } from 'node:crypto';

const ALPHABET='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export const STEP_SECONDS=30;
export const MFA_ASSERTION_SECONDS=600;
export const ENROLL_SESSION_MAX_SECONDS=600;
export const MAX_FAILED_ATTEMPTS=5;
export const LOCK_SECONDS=900;
export type TotpResult={valid:true;step:number}|{valid:false;step:null};

export function base32(bytes:Uint8Array):string {
 let bits=0,buffer=0,out='';
 for(const byte of bytes){buffer=(buffer<<8)|byte;bits+=8;while(bits>=5){out+=ALPHABET[(buffer >>> (bits-5)) & 31];bits-=5;buffer&=(1<<bits)-1;}}
 if(bits>0)out+=ALPHABET[(buffer << (5-bits)) & 31];return out;
}
export function fromBase32(encoded:string):Buffer{
 if(!/^[A-Z2-7]{32,64}$/.test(encoded))throw Error('INVALID_MFA_SECRET');
 let bits=0,buffer=0;const output:number[]=[];
 for(const char of encoded){const n=ALPHABET.indexOf(char);if(n<0)throw Error('INVALID_MFA_SECRET');buffer=(buffer<<5)|n;bits+=5;if(bits>=8){output.push((buffer>>>(bits-8))&255);bits-=8;buffer&=(1<<bits)-1;}}
 return Buffer.from(output);
}
export function newTotpSecret():string{return base32(randomBytes(20));}
export function totpCode(secret:string,step:number):string{
 if(!Number.isSafeInteger(step)||step<0)throw Error('INVALID_MFA_TIME');
 const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(step));
 const digest=createHmac('sha1',fromBase32(secret)).update(counter).digest();
 const offset=digest[19]&15;
 const value=(digest.readUInt32BE(offset)&0x7fffffff)%1000000;
 return String(value).padStart(6,'0');
}
export function verifyTotp(secret:string,code:string,nowMs:number,lastAcceptedStep:number=-1):TotpResult{
 if(!/^\d{6}$/.test(code)||!Number.isSafeInteger(nowMs)||nowMs<0)return{valid:false,step:null};
 const current=Math.floor(nowMs/(1000*STEP_SECONDS));
 for(const step of [current-1,current,current+1]){
  if(step<0||step<=lastAcceptedStep)continue;
  const expected=Buffer.from(totpCode(secret,step));const actual=Buffer.from(code);
  if(timingSafeEqual(expected,actual))return {valid:true,step};
 }
 return {valid:false,step:null};
}
function keyFromEnv(keyB64:string):Buffer{
 if(!/^[a-zA-Z0-9+/]{43}=$/.test(keyB64))throw Error('INVALID_MFA_KEY');
 const key=Buffer.from(keyB64,'base64');if(key.length!==32)throw Error('INVALID_MFA_KEY');return key;
}
export function encryptTotpSecret(secret:string,keyB64:string):string{
 fromBase32(secret);const iv=randomBytes(12);const cipher=createCipheriv('aes-256-gcm',keyFromEnv(keyB64),iv);
 const data=Buffer.concat([cipher.update(secret,'utf8'),cipher.final()]);
 return ['v1',iv.toString('base64url'),cipher.getAuthTag().toString('base64url'),data.toString('base64url')].join('.');
}
function decodeCanonicalBase64Url(encoded:string):Buffer{
 // Node's Base64 decoder accepts alternate spellings with ignored trailing bits.
 // Reject them before authenticating the exact ciphertext bytes.
 if(!/^[A-Za-z0-9_-]+$/.test(encoded))throw Error('INVALID_MFA_CIPHERTEXT');
 const decoded=Buffer.from(encoded,'base64url');
 if(decoded.toString('base64url')!==encoded)throw Error('INVALID_MFA_CIPHERTEXT');
 return decoded;
}
export function decryptTotpSecret(ciphertext:string,keyB64:string):string{
 const parts=ciphertext.split('.');if(parts.length!==4||parts[0]!=='v1')throw Error('INVALID_MFA_CIPHERTEXT');
 const iv=decodeCanonicalBase64Url(parts[1]),tag=decodeCanonicalBase64Url(parts[2]),data=decodeCanonicalBase64Url(parts[3]);
 if(iv.length!==12||tag.length!==16||data.length===0)throw Error('INVALID_MFA_CIPHERTEXT');
 const decipher=createDecipheriv('aes-256-gcm',keyFromEnv(keyB64),iv);decipher.setAuthTag(tag);
 const plaintext=Buffer.concat([decipher.update(data),decipher.final()]).toString('utf8');fromBase32(plaintext);return plaintext;
}
export function sessionBinding(sessionId:string,keyB64:string):string{
 if(!sessionId||sessionId.length>512)throw Error('INVALID_SESSION');
 return createHmac('sha256',keyFromEnv(keyB64)).update('xora:staff-mfa:session:v1:').update(sessionId).digest('hex');
}
export function enrolmentAllowed(input:{staffStatus:string|null;accountStatus:string;emailVerified:boolean;sessionAgeMs:number;alreadyConfirmed:boolean}):boolean{
 return input.staffStatus==='active'&&input.accountStatus==='active'&&input.emailVerified&&!input.alreadyConfirmed&&Number.isFinite(input.sessionAgeMs)&&input.sessionAgeMs>=0&&input.sessionAgeMs<=ENROLL_SESSION_MAX_SECONDS*1000;
}
export function toOtpAuthUri(accountLabel:string,secret:string):string{
 const label=`XORA Staff:${accountLabel}`;
 return `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=XORA%20Staff&algorithm=SHA1&digits=6&period=30`;
}
