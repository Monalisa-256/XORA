import {toNextJsHandler} from 'better-auth/next-js';
import {features} from '@/lib/env';
import {getAuth} from '@/lib/auth';
import {NextResponse, type NextRequest} from 'next/server';
export const runtime='nodejs';
async function handler(request:NextRequest){
  if(!features.authEnabled)return NextResponse.json({code:'AUTH_NOT_AVAILABLE'}, {status:503,headers:{'Cache-Control':'no-store'}});
  const authHandler=toNextJsHandler(getAuth());
  return request.method==='POST'?authHandler.POST(request):authHandler.GET(request);
}
export const GET=handler;
export const POST=handler;
