import type {NextRequest} from 'next/server';
import {authorizeStaff} from '@/lib/session';
import {getPool} from '@/lib/db';
import {jsonOk,jsonError,requestId} from '@/lib/request';
export const runtime='nodejs';
export async function GET(req:NextRequest){const id=requestId();try{
 const staff=await authorizeStaff(req,'staff.audit.read');if(!staff)return jsonError('FORBIDDEN',403,id);
 const records=await getPool().query(`SELECT id,action,resource_type,outcome,reason_code,created_at FROM audit_events
    ORDER BY created_at DESC,id DESC LIMIT 50`);
 return jsonOk({events:records.rows},id);
}catch{return jsonError('SERVICE_UNAVAILABLE',503,id);}}
