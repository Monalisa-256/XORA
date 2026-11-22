import {test} from 'node:test';import assert from 'node:assert/strict';
import {genericEmail} from '../src/core/email-policy.ts';
for(const event of ['verify_email','security_alert','account_update','support_notice'])test('generic '+event,()=>{const msg=genericEmail(event);assert.match(msg.subject,/XORA/i);assert.doesNotMatch(msg.body,/hookup|casual|desire|payment|match|receipt/i)});
test('external links rejected',()=>assert.throws(()=>genericEmail('verify_email','https://evil.example.com/a')));
test('internal secure link allowed',()=>assert.match(genericEmail('verify_email','https://app.xora.ug/verify').body,/https:/));
