/** Strict delivery policy: no implicit email vendor, never send to arbitrary destinations. */
export function verifiedMailUrl(url:string,appUrl:string):boolean{
 try{
  const requested=new URL(url),base=new URL(appUrl);
  return requested.protocol==='https:'&&base.protocol==='https:'&&requested.origin===base.origin&&requested.pathname.startsWith('/api/auth/')&&!requested.username&&!requested.password&&!requested.hash;
 }catch{return false;}
}
export function verifiedSender(value:string):boolean{
 return /^[a-z0-9][a-z0-9 ._-]{0,48}\s*<([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})>$/.test(value.toLowerCase());
}
export function verifiedRecipient(value:string,allowedDomains:string):boolean{
 const mail=value.toLowerCase().trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))return false;
 const domain=mail.split('@')[1];
 return allowedDomains.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean).includes(domain);
}
