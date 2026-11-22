import {NextResponse,type NextRequest} from 'next/server';
import {constantTimeEqual} from '@/core/security';
import {dbReady} from '@/lib/db';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
  if(!constantTimeEqual(process.env.XORA_INTERNAL_MONITOR_TOKEN,req.headers.get('X-Xora-Monitor-Token')))
    return new NextResponse(null,{status:404,headers:{'Cache-Control':'no-store'}});
  try{const ready=await dbReady();return NextResponse.json({status:ready?'ready':'unavailable'}, {status:ready?200:503,headers:{'Cache-Control':'no-store'}});}
  catch{return NextResponse.json({status:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
