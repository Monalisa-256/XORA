import 'server-only';
import { betterAuth } from 'better-auth';
import { twoFactor } from 'better-auth/plugins';
import { getPool } from './db';
import { features,requireEnv } from './env';
import {sendAuthEmail} from './email';
import {registrationGate} from '@/core/phase3';
function createAuth(){
  // The schema must be generated and reviewed using the installed Better Auth version.
  // Do not enable this until the auth tables, email sender and tests are in place.
  requireEnv('BETTER_AUTH_SECRET'); requireEnv('BETTER_AUTH_URL');
  return betterAuth({
    database:getPool(),
    baseURL:process.env.BETTER_AUTH_URL,
    secret:process.env.BETTER_AUTH_SECRET,
    emailAndPassword:{enabled:true,disableSignUp:!registrationGate(process.env),minPasswordLength:12,maxPasswordLength:128,revokeSessionsOnPasswordReset:true,requireEmailVerification:true,sendResetPassword:async({user,url})=>sendAuthEmail({to:user.email,url,kind:'password-reset'})},
    emailVerification:{
      sendOnSignUp:true,autoSignInAfterVerification:false,
      sendVerificationEmail: async({user,url})=>sendAuthEmail({to:user.email,url,kind:'verify'})
    },
    advanced:{useSecureCookies:true},
    session:{cookieCache:{enabled:false}},
    rateLimit:{enabled:true,window:60,max:50,storage:'database'},
    plugins:[twoFactor({issuer:'XORA'})]
  });
}
let singleton: ReturnType<typeof createAuth>|undefined;
export function getAuth(){if(!features.authEnabled) throw new Error('AUTH_DISABLED');return singleton??(singleton=createAuth());}
