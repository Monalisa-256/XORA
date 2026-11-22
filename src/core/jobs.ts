export type JobState='queued'|'leased'|'done'|'dead';
export function retryDecision(attempts: number, maxAttempts: number, transient: boolean): {next:JobState; delaySeconds:number} {
  if (!transient || attempts>=maxAttempts) return {next:'dead',delaySeconds:0};
  const backoff = Math.min(3600, Math.pow(2, Math.max(0,attempts)) * 30);
  return {next:'queued',delaySeconds:backoff};
}
export function canClaimJob(state:JobState, scheduledAt:number, leaseUntil:number|null, now:number):boolean {
  return (state==='queued'&&scheduledAt<=now)||(state==='leased'&&leaseUntil!==null&&leaseUntil<now);
}
