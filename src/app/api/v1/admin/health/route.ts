import type {NextRequest} from 'next/server';
import {authorizeStaff} from '@/lib/session';
import {jsonOk,jsonError,requestId} from '@/lib/request';
export const runtime='nodejs';
export async function GET(req:NextRequest){const id=requestId();try{
 const staff=await authorizeStaff(req,'staff.dashboard.read');if(!staff)return jsonError('FORBIDDEN',403,id);
 return jsonOk({status:'available',components:['staff','security','finance','safety']},id);
}catch{return jsonError('SERVICE_UNAVAILABLE',503,id);}}
