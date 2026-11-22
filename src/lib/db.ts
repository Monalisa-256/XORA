import 'server-only';
import { Pool } from 'pg';
import { validateDatabaseTarget } from '@/core/db-target';
import { requireEnv } from './env';
let pool:Pool|undefined;
export function getPool():Pool {
  if (!pool) {
    const url=requireEnv('DATABASE_URL');
    validateDatabaseTarget(url,requireEnv('XORA_DATABASE_NAME'),requireEnv('XORA_DATABASE_NEON_PROJECT_ID'),requireEnv('XORA_DATABASE_ALLOWED_HOST'),requireEnv('XORA_DATABASE_ALLOWED_USER'));
    pool=new Pool({connectionString:url,max:5,idleTimeoutMillis:15000,connectionTimeoutMillis:5000,application_name:'xora-web-phase2'});
  }
  return pool;
}
export async function dbReady():Promise<boolean>{const client=await getPool().connect();try{const r=await client.query('SELECT current_database() AS db');return r.rows[0]?.db==='xora';}finally{client.release();}}
