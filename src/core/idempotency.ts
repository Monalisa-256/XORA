import { createHash } from 'node:crypto';
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']';
  const entries = Object.entries(value as Record<string, unknown>).filter(([,v])=>v!==undefined).sort(([a],[b])=>a.localeCompare(b));
  return '{' + entries.map(([k,v])=>JSON.stringify(k)+':'+canonicalJson(v)).join(',') + '}';
}
export function hashValue(value: string): string { return createHash('sha256').update(value).digest('hex'); }
export function normalizeIdempotencyKey(value: string | null): string {
  if (!value || !/^[A-Za-z0-9._:-]{16,128}$/.test(value)) throw new Error('INVALID_IDEMPOTENCY_KEY');
  return value;
}
export type ExistingRecord = { payloadHash: string; status: 'reserved'|'committed'|'failed'; resultRef: string | null };
export type ReplayDecision = 'NEW'|'REPLAY'|'CONFLICT'|'RETRY_LATER';
export function evaluateReplay(existing: ExistingRecord|null, newPayloadHash: string): ReplayDecision {
  if (!existing) return 'NEW';
  if (existing.payloadHash !== newPayloadHash) return 'CONFLICT';
  if (existing.status === 'committed') return 'REPLAY';
  return 'RETRY_LATER';
}
