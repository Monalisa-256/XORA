/** Phase 3 validation is independent of HTTP, storage and database adapters. */
export const intentions=['date','casual','both'] as const;
export const cities=['Kampala','Entebbe','Wakiso','Mukono','Jinja','Mbarara','Gulu','Mbale','Fort Portal','Other Uganda'] as const;
export const interests=['Music','Reading','Cooking','Travel','Fitness','Art','Film','Nature','Sports','Culture','Photography','Gaming'] as const;
export type Intent=typeof intentions[number];
export const profileStates=['draft','review','changes_requested','approved','active','paused','restricted','rejected'] as const;
export type ProfileState=typeof profileStates[number];
export type Eligibility='not_started'|'pending'|'approved'|'uncertain'|'underage'|'rejected';
export const maxPhotoBytes=3*1024*1024;
export const maxPhotos=3;
export const policyVersion='phase3-review-1';
export class Phase3Error extends Error {status:number;code:string;constructor(status:number,code:string){super(code);this.status=status;this.code=code;this.name='Phase3Error';}}
export function reject(status:number,code:string):never{throw new Phase3Error(status,code)}
export function object(value:unknown,keys:readonly string[]):Record<string,unknown>{
 if(!value||typeof value!=='object'||Array.isArray(value))reject(422,'INVALID_FIELDS');
 const v=value as Record<string,unknown>;if(Object.keys(v).some(k=>!keys.includes(k)))reject(422,'UNSUPPORTED_FIELD');return v;
}
function str(v:unknown,max:number,required=false):string{
 if(typeof v!=='string')reject(422,'INVALID_TEXT');const s=v.trim().normalize('NFC');
 if(s.length>max||(required&&!s)||/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u.test(s))reject(422,'INVALID_TEXT');return s;
}
export function version(v:unknown):number{if(typeof v!=='number'||!Number.isSafeInteger(v)||v<1)reject(422,'VERSION_REQUIRED');return v;}
export function flag(v:unknown):boolean{if(typeof v!=='boolean')reject(422,'INVALID_BOOLEAN');return v;}
export function choice<T extends string>(v:unknown,allowed:readonly T[]):T{if(typeof v!=='string'||!allowed.includes(v as T))reject(422,'INVALID_CHOICE');return v as T;}
export function validateConsent(input:unknown,terms:string,privacy:string){const b=object(input,['adult','terms_version','privacy_version','marketing']);
 if(b.adult!==true||b.terms_version!==terms||b.privacy_version!==privacy)reject(422,'CURRENT_POLICIES_REQUIRED');
 return {marketing:flag(b.marketing)};
}
export function validateRegistration(input:unknown,terms:string,privacy:string){const b=object(input,['email','password','confirm_password','adult','terms_version','privacy_version','marketing']);
 const email=str(b.email,254,true).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))reject(422,'INVALID_EMAIL');
 if(typeof b.password!=='string'||b.password.length<12||b.password.length>128||b.password!==b.confirm_password)reject(422,'PASSWORD_REQUIREMENTS');
 const c=validateConsent({adult:b.adult,terms_version:b.terms_version,privacy_version:b.privacy_version,marketing:b.marketing},terms,privacy);
 return {email,password:b.password,marketing:c.marketing};
}
export function validateDraft(input:unknown){const b=object(input,['version','display_name','city','intent','bio','interests','show_intent','show_area','show_activity','preference']);
 const display_name=str(b.display_name,40),bio=str(b.bio,500);
 if(/(?:https?:\/\/|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){7,})/i.test(display_name+' '+bio))reject(422,'PRIVATE_CONTACT_NOT_ALLOWED');
 if(!Array.isArray(b.interests)||b.interests.length>5||new Set(b.interests).size!==b.interests.length||b.interests.some(i=>!interests.includes(i as typeof interests[number])))reject(422,'INVALID_INTERESTS');
 return {version:version(b.version),display_name,city:choice(b.city,['',...cities] as const),intent:choice(b.intent,intentions),bio,interests:b.interests as string[],show_intent:flag(b.show_intent),show_area:flag(b.show_area),show_activity:flag(b.show_activity),preference:choice(b.preference,['not_set','women','men','everyone'] as const)};
}
export function completeProfile(p:{display_name:string;city:string;bio:string;interests:unknown},photos:number):boolean{return p.display_name.trim().length>=2&&cities.includes(p.city as typeof cities[number])&&p.bio.trim().length>=10&&Array.isArray(p.interests)&&p.interests.length>=3&&photos>=1&&photos<=maxPhotos;}
export function canDiscover(p:{accountStatus:string;emailVerified:boolean;eligibility:Eligibility;validUntil:string|null;profileStatus:ProfileState;approvedPhotos:number;consented:boolean},enabled=false,now=Date.now()):boolean{return enabled&&p.accountStatus==='active'&&p.emailVerified&&p.eligibility==='approved'&&!!p.validUntil&&Date.parse(p.validUntil)>now&&p.profileStatus==='active'&&p.approvedPhotos>0&&p.consented;}
export function canEdit(state:ProfileState):boolean{return !['review','restricted'].includes(state);}
export function nextEditedState(state:ProfileState):ProfileState{if(!canEdit(state))reject(409,'PROFILE_LOCKED');return 'draft';}
export function mediaFormat(bytes:Uint8Array):'jpeg'|'png'|'webp'|null{
 if(bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'jpeg';
 if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))return 'png';
 if(bytes.length>=12&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'webp';return null;
}
export function validMediaDeclaration(type:string,bytes:number):boolean{return ['image/jpeg','image/png','image/webp'].includes(type)&&Number.isSafeInteger(bytes)&&bytes>0&&bytes<=maxPhotoBytes;}
export function approvedPolicyUrl(value:string|undefined):boolean{try{const u=new URL(value??'');return u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash;}catch{return false;}}
export function phase3Gate(e:Record<string,string|undefined>):boolean{return e.XORA_ENVIRONMENT==='production'&&e.XORA_AUTH_ENABLED==='true'&&e.XORA_PHASE3_DRAFTS_ENABLED==='true'&&e.XORA_PHASE3_ONBOARDING_APPROVED==='true'&&e.XORA_PHASE3_POLICY_APPROVED==='true'&&!!e.XORA_APPROVED_TERMS_VERSION&&!!e.XORA_APPROVED_PRIVACY_VERSION&&approvedPolicyUrl(e.XORA_APPROVED_TERMS_URL)&&approvedPolicyUrl(e.XORA_APPROVED_PRIVACY_URL)&&e.XORA_PHASE3_EMAIL_APPROVED==='true'&&!!e.RESEND_API_KEY&&!!e.XORA_EMAIL_FROM&&!!e.XORA_PHASE3_EMAIL_ALLOWLIST_DOMAINS;}
export function registrationGate(e:Record<string,string|undefined>):boolean{return phase3Gate(e)&&e.XORA_SIGNUP_ENABLED==='true'&&e.XORA_PHASE3_ELIGIBILITY_APPROVED==='true'&&['approved_provider','in_person_check'].includes(e.XORA_PHASE3_ELIGIBILITY_METHOD??'');}
export function safePreview(p:ReturnType<typeof validateDraft>){return {display_name:p.display_name,bio:p.bio,city:p.show_area?p.city:null,intent:p.show_intent?p.intent:null,interests:p.interests};}

/** Coarse device label. Never disclose raw user-agent or IP address in session responses. */
export function deviceLabel(agent:unknown):string{if(typeof agent!=='string'||!agent)return 'Unknown device';const os=/Android/i.test(agent)?'Android':/iPhone|iPad/i.test(agent)?'iOS':/Windows/i.test(agent)?'Windows':/Macintosh|Mac OS/i.test(agent)?'macOS':/Linux/i.test(agent)?'Linux':'Unknown device';const browser=/Edg\//i.test(agent)?'Edge':/Firefox|FxiOS/i.test(agent)?'Firefox':/Chrome|CriOS/i.test(agent)?'Chrome':/Safari/i.test(agent)?'Safari':'Browser';return `${os} · ${browser}`;}
export function sameSavedDraft(saved:Record<string,unknown>,incoming:ReturnType<typeof validateDraft>):boolean{const {version:ignored,...rest}=incoming;return Object.entries(rest).every(([k,v])=>Array.isArray(v)?Array.isArray(saved[k])&&JSON.stringify(v)===JSON.stringify(saved[k]):saved[k]===v);}
