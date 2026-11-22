import 'server-only';
import {getPool} from './db';
import {sanitizeAuditMetadata} from '@/core/security';
export async function recordAudit(input:{actorId?:string|null;action:string;resourceType:string;outcome:'allowed'|'denied'|'error';requestId:string;metadata?:Record<string,unknown>}):Promise<void>{
  const metadata=sanitizeAuditMetadata(input.metadata||{});
  await getPool().query(`INSERT INTO audit_events(actor_id,action,resource_type,outcome,request_id,metadata)
    VALUES($1,$2,$3,$4,$5,$6)`,[input.actorId??null,input.action,input.resourceType,input.outcome,input.requestId,JSON.stringify(metadata)]);
}
