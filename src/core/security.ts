import { timingSafeEqual } from 'node:crypto';
export function constantTimeEqual(expected: string|undefined, provided: string|null): boolean {
  if (!expected || !provided) return false;
  const left = Buffer.from(expected,'utf8');
  const right = Buffer.from(provided,'utf8');
  if (left.length!==right.length || left.length<24) return false;
  return timingSafeEqual(left,right);
}
export function sameOrigin(requestOrigin: string|null, baseUrl: string|undefined): boolean {
  if (!requestOrigin || !baseUrl) return false;
  try {
    const o = new URL(requestOrigin); const b = new URL(baseUrl);
    return (o.protocol==='https:' || (o.protocol==='http:' && o.hostname==='localhost')) && o.origin===b.origin;
  } catch { return false; }
}
export function sanitizeAuditMetadata(source: Record<string,unknown>): Record<string,string> {
  const allowed=['category','decision_code','resource_kind','review_state'];
  return Object.fromEntries(allowed.filter(k=>typeof source[k]==='string').map(k=>[k,String(source[k]).slice(0,100)]));
}
export function isUuid(value: string): boolean { return /^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(value); }
