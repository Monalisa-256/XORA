import 'server-only';
import {getPool} from './db';
export async function enqueueSyntheticOutbox(dedupeKey:string):Promise<{eventId:string;replay:boolean}>{
  const client=await getPool().connect();
  try{
    await client.query('BEGIN');
    const created=await client.query(`INSERT INTO outbox_events(type,dedupe_key,payload_ref) VALUES('demo.phase2',$1,'staging-only')
      ON CONFLICT(dedupe_key) DO NOTHING RETURNING id`,[dedupeKey]);
    const replay=created.rowCount===0;
    const eventId=replay?(await client.query('SELECT id FROM outbox_events WHERE dedupe_key=$1',[dedupeKey])).rows[0].id:created.rows[0].id;
    await client.query('INSERT INTO background_jobs(event_id) VALUES($1) ON CONFLICT(event_id) DO NOTHING',[eventId]);
    await client.query('COMMIT');
    return {eventId,replay};
  }catch(err){await client.query('ROLLBACK').catch(()=>{});throw err;}finally{client.release();}
}
