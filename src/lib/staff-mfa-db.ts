import 'server-only';
import {getPool} from './db';
import {requireEnv} from './env';
import {newTotpSecret,encryptTotpSecret,decryptTotpSecret,verifyTotp,sessionBinding,LOCK_SECONDS,MAX_FAILED_ATTEMPTS,MFA_ASSERTION_SECONDS} from '@/core/staff-mfa';

export async function staffStatus(accountId:string):Promise<string|null>{
 const r=await getPool().query('SELECT status FROM staff_memberships WHERE account_id=$1',[accountId]);return r.rows[0]?.status??null;
}
export async function beginStaffMfaEnrollment(accountId:string,requestId:string):Promise<{secret:string}|null>{
 const cipherKey=requireEnv('XORA_STAFF_MFA_KEY');
 const secret=newTotpSecret();const encrypted=encryptTotpSecret(secret,cipherKey);
 const client=await getPool().connect();
 try{
  await client.query('BEGIN');
  const inserted=await client.query(`INSERT INTO staff_mfa_credentials(account_id,encrypted_secret)
   VALUES($1,$2) ON CONFLICT (account_id) DO NOTHING RETURNING account_id`,[accountId,encrypted]);
  if(inserted.rowCount!==1){await client.query('ROLLBACK');return null;}
  await client.query(`INSERT INTO audit_events(actor_id,action,resource_type,outcome,request_id)
   VALUES($1,'staff.mfa.enrolled_pending','staff_mfa_credentials','allowed',$2)`,[accountId,requestId]);
  await client.query('COMMIT');return {secret};
 }catch(err){await client.query('ROLLBACK').catch(()=>{});throw err;}finally{client.release();}
}
export async function staffStepUp(accountId:string,sessionId:string,code:string,requiresConfirmation:boolean,requestId:string):Promise<boolean>{
 const pool=getPool();const client=await pool.connect();
 try{
  await client.query('BEGIN');
  const r=await client.query(`SELECT c.encrypted_secret,c.confirmed_at,c.last_accepted_step,c.failed_attempts,c.locked_until,
    sm.status AS staff_status FROM staff_mfa_credentials c JOIN staff_memberships sm ON sm.account_id=c.account_id
    WHERE c.account_id=$1 FOR UPDATE OF c`,[accountId]);
  const row=r.rows[0];
  if(!row||row.staff_status!=='active'||(Boolean(row.confirmed_at)!==!requiresConfirmation)){
   await client.query('ROLLBACK');return false;
  }
  const now=Date.now();
  if(row.locked_until&&new Date(row.locked_until).getTime()>now){await client.query('ROLLBACK');return false;}
  const secret=decryptTotpSecret(row.encrypted_secret,requireEnv('XORA_STAFF_MFA_KEY'));
  const result=verifyTotp(secret,code,now,Number(row.last_accepted_step));
  if(!result.valid){
   const failures=Number(row.failed_attempts)+1;
   await client.query(`UPDATE staff_mfa_credentials SET failed_attempts=$2,locked_until=CASE WHEN $2 >= $3 THEN now() + ($4 * interval '1 second') ELSE NULL END WHERE account_id=$1`,[accountId,failures,MAX_FAILED_ATTEMPTS,LOCK_SECONDS]);
   await client.query(`INSERT INTO audit_events(actor_id,action,resource_type,outcome,reason_code,request_id) VALUES($1,'staff.mfa.step_up','staff_mfa_credentials','denied','BAD_OR_REPLAYED_CODE',$2)`,[accountId,requestId]);
   await client.query('COMMIT');return false;
  }
  await client.query(`UPDATE staff_mfa_credentials SET confirmed_at=COALESCE(confirmed_at,now()),last_accepted_step=$2,failed_attempts=0,locked_until=NULL WHERE account_id=$1`,[accountId,result.step]);
  const digest=sessionBinding(sessionId,requireEnv('XORA_STAFF_MFA_KEY'));
  await client.query(`INSERT INTO staff_mfa_assertions(account_id,session_digest,expires_at)
     VALUES($1,$2,now() + ($3 * interval '1 second'))
     ON CONFLICT(account_id,session_digest) DO UPDATE SET verified_at=now(),expires_at=excluded.expires_at`,[accountId,digest,MFA_ASSERTION_SECONDS]);
  await client.query(`INSERT INTO audit_events(actor_id,action,resource_type,outcome,request_id) VALUES($1,'staff.mfa.step_up','staff_mfa_credentials','allowed',$2)`,[accountId,requestId]);
  await client.query('COMMIT');return true;
 }catch(e){await client.query('ROLLBACK').catch(()=>{});throw e;}finally{client.release();}
}
export async function hasFreshStaffMfa(accountId:string,sessionId:string):Promise<boolean>{
 const digest=sessionBinding(sessionId,requireEnv('XORA_STAFF_MFA_KEY'));
 const r=await getPool().query(`SELECT EXISTS (
    SELECT 1 FROM staff_mfa_assertions a JOIN staff_mfa_credentials c ON c.account_id=a.account_id
    WHERE a.account_id=$1 AND a.session_digest=$2 AND a.expires_at>now() AND c.confirmed_at IS NOT NULL
  ) AS ok`,[accountId,digest]);return r.rows[0]?.ok===true;
}
