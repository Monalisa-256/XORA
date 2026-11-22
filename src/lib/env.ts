import 'server-only';
export const features = {
  authEnabled:process.env.XORA_AUTH_ENABLED==='true',
  signupEnabled:process.env.XORA_SIGNUP_ENABLED==='true',
  publicLaunch:process.env.XORA_PUBLIC_LAUNCH==='true',
  testEndpoints:process.env.XORA_TEST_ENDPOINTS==='true',
  paymentsEnabled:process.env.XORA_MOMO_PAYMENTS==='true',
};
export function requireEnv(name:string):string {const val=process.env[name];if(!val)throw new Error(`Missing required configuration: ${name}`);return val;}
