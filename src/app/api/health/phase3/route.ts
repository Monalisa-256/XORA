import {NextResponse,type NextRequest} from 'next/server';
import {constantTimeEqual} from '@/core/security';
import {phase3Gate,registrationGate} from '@/core/phase3';
import {getPool} from '@/lib/db';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:NextRequest){const headers={'Cache-Control':'no-store'};if(!constantTimeEqual(process.env.XORA_INTERNAL_MONITOR_TOKEN,req.headers.get('X-Xora-Monitor-Token')))return new NextResponse(null,{status:404,headers});try{
 const r=await getPool().query(`SELECT EXISTS(SELECT 1 FROM app_schema_migrations WHERE version='0011') AS auth_schema, EXISTS(SELECT 1 FROM app_schema_migrations WHERE version='0012') AS member_schema, EXISTS(SELECT 1 FROM app_schema_migrations WHERE version='0013') AS write_grant_marker`);const row=r.rows[0];
 const ready=row.auth_schema===true&&row.member_schema===true;let writePrivileges=false;
 if(ready){const p=await getPool().query(`SELECT has_table_privilege(current_user,'profiles','INSERT') AND has_table_privilege(current_user,'profiles','UPDATE') AND has_table_privilege(current_user,'member_consents','INSERT') AND has_table_privilege(current_user,'"user"','INSERT') AND has_table_privilege(current_user,'"session"','DELETE') AND has_column_privilege(current_user,'accounts','status','UPDATE') AND has_column_privilege(current_user,'audit_events','action','INSERT') AS ok`);writePrivileges=p.rows[0]?.ok===true;}
 const open=registrationGate(process.env);const status=ready&&(!phase3Gate(process.env)||(row.write_grant_marker&&writePrivileges))?'ready':'unavailable';return NextResponse.json({status,schema_ready:ready,write_grant_marker:row.write_grant_marker===true,write_privileges:writePrivileges,registration_open:open,discovery_enabled:false,payments_enabled:false,contact_enabled:false},{status:status==='ready'?200:503,headers});
 }catch{return NextResponse.json({status:'unavailable'},{status:503,headers});}}
