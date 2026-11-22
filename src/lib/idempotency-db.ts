import 'server-only';
import {getPool} from './db';
import {canonicalJson,hashValue,normalizeIdempotencyKey,evaluateReplay} from '@/core/idempotency';
export type IdempotentResult={kind:'new'|'replay'|'conflict'|'pending';resultRef?:string};
export async function reserveSyntheticAction(actorScope:string,operation:string,idempotencyKey:string,payload:unknown):Promise<IdempotentResult>{
  const client=await getPool().connect();
  try {
    const keyHash=hashValue(normalizeIdempotencyKey(idempotencyKey));
    const payloadHash=hashValue(canonicalJson(payload));
    await client.query('BEGIN');
    const created=await client.query(`INSERT INTO idempotency_records(actor_scope,operation,key_hash,payload_hash,status,expires_at)
      VALUES($1,$2,$3,$4,'reserved',now()+interval '1 day') ON CONFLICT DO NOTHING RETURNING id`,
      [actorScope,operation,keyHash,payloadHash]);
    if(created.rowCount){
      const id=created.rows[0].id;
      await client.query('UPDATE idempotency_records SET status=$1,result_ref=$2 WHERE id=$3',['committed',id,id]);
      await client.query('COMMIT');return {kind:'new',resultRef:id};
    }
    const existing=await client.query(`SELECT payload_hash,status,result_ref FROM idempotency_records
      WHERE actor_scope=$1 AND operation=$2 AND key_hash=$3 FOR UPDATE`,[actorScope,operation,keyHash]);
    const row=existing.rows[0];
    const decision=evaluateReplay(row?{payloadHash:row.payload_hash,status:row.status,resultRef:row.result_ref}:null,payloadHash);
    await client.query('COMMIT');
    return decision==='REPLAY'?{kind:'replay',resultRef:row.result_ref}:decision==='CONFLICT'?{kind:'conflict'}:{kind:'pending'};
  }catch(err){await client.query('ROLLBACK').catch(()=>{});throw err;}
  finally{client.release();}
}
