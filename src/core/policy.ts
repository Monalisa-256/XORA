/** Pure, dependency-free authorization decisions, usable by Node's test runner. */
export type AccountStatus = 'pending_email' | 'active' | 'restricted' | 'closed';
export type StaffStatus = 'active' | 'suspended' | 'revoked';
export interface StaffDecisionContext {
  accountStatus: AccountStatus;
  emailVerified: boolean;
  staffStatus: StaffStatus | null;
  mfaVerified: boolean;
  permissions: readonly string[];
}
export type Decision = { allow: true } | { allow: false; code: string };
export function mayReadOwnAccount(status: AccountStatus, emailVerified: boolean): Decision {
  if (!emailVerified) return { allow:false, code:'EMAIL_NOT_VERIFIED' };
  if (status !== 'active') return { allow:false, code:'ACCOUNT_NOT_ACTIVE' };
  return { allow:true };
}
export function staffAccess(ctx: StaffDecisionContext, permission: string): Decision {
  if (ctx.accountStatus !== 'active' || !ctx.emailVerified) return { allow:false, code:'ACCOUNT_NOT_ACTIVE' };
  if (ctx.staffStatus !== 'active') return { allow:false, code:'NOT_STAFF' };
  if (!ctx.mfaVerified) return { allow:false, code:'MFA_REQUIRED' };
  if (!ctx.permissions.includes(permission)) return { allow:false, code:'INSUFFICIENT_PERMISSION' };
  return { allow:true };
}
export interface FileAccessContext {
  ownerId: string;
  actorId: string;
  state: 'pending' | 'confirmed' | 'quarantined' | 'deleted';
  purpose: string;
  staffCaseAuthorized: boolean;
  permission?: string;
}
export function mayDownloadFile(ctx: FileAccessContext): Decision {
  if (ctx.state !== 'confirmed') return { allow:false, code:'FILE_NOT_AVAILABLE' };
  if (ctx.purpose === 'verification_evidence' || ctx.purpose === 'payment_proof') {
    if (ctx.staffCaseAuthorized && ctx.permission === 'verification_evidence.read_case') return { allow:true };
    return { allow:false, code:'CASE_AUTH_REQUIRED' };
  }
  if (ctx.actorId === ctx.ownerId) return { allow:true };
  return { allow:false, code:'FILE_NOT_FOUND' };
}
export function mayServeTestRoutes(flags: {nodeEnv?: string; vercelEnv?: string; xoraEnvironment?: string; publicLaunch: boolean; testEndpoints: boolean}): boolean {
  const safeEnvironment = (flags.nodeEnv !== 'production' && flags.xoraEnvironment === 'development') ||
    (flags.vercelEnv === 'preview' && flags.xoraEnvironment === 'staging');
  return safeEnvironment && !flags.publicLaunch && flags.testEndpoints;
}
export function canSelfRegister(flags: {authEnabled: boolean; signupEnabled: boolean; adultVerificationReady: boolean; legalReviewDone: boolean}): boolean {
  return flags.authEnabled && flags.signupEnabled && flags.adultVerificationReady && flags.legalReviewDone;
}
