import 'server-only';
import { Pool } from 'pg';
import { validateDatabaseTarget } from '@/core/db-target';
import { assertProductionTarget } from '@/core/production-target';
import { requireEnv } from './env';
let pool:Pool|undefined;
export function getPool():Pool {
  if (!pool) {
    assertProductionTarget(process.env);
    const url=requireEnv('DATABASE_URL');
    validateDatabaseTarget(url,requireEnv('XORA_DATABASE_NAME'),requireEnv('XORA_DATABASE_NEON_PROJECT_ID'),requireEnv('XORA_DATABASE_ALLOWED_HOST'),requireEnv('XORA_DATABASE_ALLOWED_USER'));
    pool=new Pool({connectionString:url,max:5,idleTimeoutMillis:15000,connectionTimeoutMillis:5000,statement_timeout:5000,application_name:'xora-production'});
  }
  return pool;
}
export async function dbReady():Promise<boolean>{const client=await getPool().connect();try{const r=await client.query('SELECT current_database() AS db, current_user AS role');return r.rows[0]?.db==='xora' && r.rows[0]?.role===requireEnv('XORA_DATABASE_ALLOWED_USER');}finally{client.release();}}
