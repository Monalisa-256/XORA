import {NextResponse,type NextRequest} from 'next/server';
import {constantTimeEqual} from '@/core/security';
import {checkTopology, deploymentIdentity} from '@/core/topology';
import {dbReady} from '@/lib/db';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=15;
const headers={'Cache-Control':'no-store'};
export async function GET(req:NextRequest){
  if(deploymentIdentity(process.env).provider!=='vercel'||!constantTimeEqual(process.env.XORA_INTERNAL_MONITOR_TOKEN,req.headers.get('X-Xora-Monitor-Token'))) return new NextResponse(null,{status:404,headers});
  const result=await checkTopology({env:process.env,localReady:dbReady});
  return NextResponse.json(result,{status:result.status==='ready'?200:503,headers});
}
