/** Strictly generic operational email. Never include an intent, match, receipt or identity result. */
export type EmailEvent = 'verify_email'|'security_alert'|'account_update'|'support_notice';
export function genericEmail(event:EmailEvent, url?:string):{subject:string;body:string}{
  const copy:Record<EmailEvent,[string,string]>={
    verify_email:['Confirm your XORA email','A confirmation was requested for your XORA account.'],
    security_alert:['XORA account security notice','An account security action was recorded. If this was not you, contact support.'],
    account_update:['XORA account notice','Your XORA account has an update. Sign in to review it.'],
    support_notice:['XORA support update','A new support response is available in your account.']
  };
  const c=copy[event];
  if(url){const u=new URL(url);if(u.protocol!=='https:'||!u.hostname.endsWith('.xora.ug'))throw new Error('UNSAFE_EMAIL_LINK');}
  return {subject:c[0],body:c[1]+(url?' Open the secure app to continue: '+url:'')+'\n\nXORA Support'};
}
