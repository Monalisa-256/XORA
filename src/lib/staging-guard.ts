import 'server-only';
import type {NextRequest} from 'next/server';
import {constantTimeEqual} from '@/core/security';
import {mayServeTestRoutes} from '@/core/policy';
import {features} from './env';
export function authorizedTestRequest(req:NextRequest):boolean {
  if(!mayServeTestRoutes({nodeEnv:process.env.NODE_ENV,vercelEnv:process.env.VERCEL_ENV,xoraEnvironment:process.env.XORA_ENVIRONMENT,publicLaunch:features.publicLaunch,testEndpoints:features.testEndpoints}))return false;
  const presented=req.headers.get('X-Xora-Test-Token');
  return constantTimeEqual(process.env.XORA_TEST_ACCESS_TOKEN,presented);
}
