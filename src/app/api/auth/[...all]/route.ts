import {toNextJsHandler} from 'better-auth/next-js';
import {features} from '@/lib/env';
import {getAuth} from '@/lib/auth';
import {NextResponse, type NextRequest} from 'next/server';
import {sameOrigin} from '@/core/security';
export const runtime='nodejs';
const allowedPost=new Set(['sign-in/email','sign-out','send-verification-email','request-password-reset','reset-password','change-password','two-factor/verify-totp']);
const allowedGet=new Set(['verify-email','reset-password','get-session']);
async function handler(request:NextRequest){
 if(!features.authEnabled)return NextResponse.json({code:'AUTH_NOT_AVAILABLE'},{status:503,headers:{'Cache-Control':'no-store'}});
 const path=request.nextUrl.pathname.replace(/^\/api\/auth\//,'');
 if(!(request.method==='POST'?allowedPost.has(path):(allowedGet.has(path)||/^reset-password\/[A-Za-z0-9_-]{16,256}$/.test(path))))return NextResponse.json({code:'NOT_FOUND'},{status:404,headers:{'Cache-Control':'no-store'}});
 if(request.method==='POST'&&!sameOrigin(request.headers.get('origin'),process.env.BETTER_AUTH_URL))return NextResponse.json({code:'FORBIDDEN'},{status:403,headers:{'Cache-Control':'no-store'}});
 const authHandler=toNextJsHandler(getAuth());return request.method==='POST'?authHandler.POST(request):authHandler.GET(request);
}
export const GET=handler;export const POST=handler;
