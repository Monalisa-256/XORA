export type OperationDecision={allow:true}|{allow:false;code:string};
/** All mutations are explicitly closed until business, security and identity checks pass. */
export function canPerformMutation(p:{environment:string;publicLaunch:boolean;authEnabled:boolean;signupEnabled:boolean;emailVerified:boolean;adultEligible:boolean;legalApproved:boolean;paymentProviderApproved:boolean;operation:'create_profile'|'send_introduction'|'submit_payment'|'activate_payment'}):OperationDecision {
  if(!p.authEnabled||!p.emailVerified)return {allow:false,code:'AUTH_NOT_READY'};
  if(!p.legalApproved)return {allow:false,code:'LEGAL_REVIEW_REQUIRED'};
  if(!p.adultEligible)return {allow:false,code:'ADULT_ELIGIBILITY_REQUIRED'};
  if(p.operation==='submit_payment'||p.operation==='activate_payment'){
    if(!p.paymentProviderApproved)return {allow:false,code:'PAYMENT_PROVIDER_NOT_APPROVED'};
  }
  if(!p.publicLaunch||p.environment!=='production')return {allow:false,code:'MUTATIONS_NOT_LIVE'};
  return {allow:true};
}
