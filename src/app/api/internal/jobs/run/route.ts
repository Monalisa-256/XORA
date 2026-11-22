import {NextResponse,type NextRequest} from 'next/server';
import {constantTimeEqual} from '@/core/security';
import {features} from '@/lib/env';
import {mayServeTestRoutes} from '@/core/policy';
import {getPool} from '@/lib/db';
export const runtime='nodejs';
export async function POST(req:NextRequest){
  if (!mayServeTestRoutes({nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV,xoraEnvironment:process.env.XORA_ENVIRONMENT,publicLaunch:features.publicLaunch,testEndpoints:features.testEndpoints}) ||
      !constantTimeEqual(process.env.XORA_INTERNAL_MONITOR_TOKEN,req.headers.get('X-Xora-Monitor-Token')))
    return new NextResponse(null,{status:404});
  const client=await getPool().connect();
  try{
    await client.query('BEGIN');
    // Claim ONLY Phase 2 synthetic jobs; no member messages or payments.
    const claimed=await client.query(`SELECT j.id, j.event_id, j.attempts
      FROM background_jobs j JOIN outbox_events e ON e.id=j.event_id
      WHERE e.type='demo.phase2' AND j.state IN ('queued','leased')
      AND ((j.state='queued' AND j.scheduled_at<=now()) OR (j.state='leased' AND j.lease_until<now()))
      ORDER BY j.scheduled_at,j.id FOR UPDATE OF j SKIP LOCKED LIMIT 5`);
    for(const job of claimed.rows){
      await client.query(`UPDATE background_jobs SET state='done',attempts=attempts+1,lease_until=NULL,updated_at=now()
        WHERE id=$1`,[job.id]);
      await client.query(`INSERT INTO job_attempts(job_id,finished_at,outcome) VALUES($1,now(),'success')`,[job.id]);
      await client.query(`UPDATE outbox_events SET state='dispatched',updated_at=now() WHERE id=$1`,[job.event_id]);
    }
    await client.query('COMMIT');
    return NextResponse.json({processed:claimed.rows.length},{headers:{'Cache-Control':'no-store'}});
  }catch{
    await client.query('ROLLBACK').catch(()=>{});
    return NextResponse.json({status:'unavailable'},{status:503});
  }finally{client.release();}
}
