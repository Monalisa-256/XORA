import {test} from 'node:test';import assert from 'node:assert/strict';
import {canPerformMutation} from '../src/core/operation-policy.ts';
const b={environment:'production',publicLaunch:true,authEnabled:true,signupEnabled:true,emailVerified:true,adultEligible:true,legalApproved:true,paymentProviderApproved:true,operation:'create_profile'};
for(const [name,patch,code] of [
 ['deny unauthenticated',{authEnabled:false},'AUTH_NOT_READY'],['deny unverified email',{emailVerified:false},'AUTH_NOT_READY'],['deny no legal clearance',{legalApproved:false},'LEGAL_REVIEW_REQUIRED'],['deny unverified adult',{adultEligible:false},'ADULT_ELIGIBILITY_REQUIRED'],['deny staging',{environment:'staging'},'MUTATIONS_NOT_LIVE'],['deny closed site',{publicLaunch:false},'MUTATIONS_NOT_LIVE'],['deny unapproved receiving account',{paymentProviderApproved:false,operation:'submit_payment'},'PAYMENT_PROVIDER_NOT_APPROVED']])
 test(name,()=>assert.deepEqual(canPerformMutation({...b,...patch}),{allow:false,code}));
test('real features depend on all required approvals',()=>assert.deepEqual(canPerformMutation(b),{allow:true}));
