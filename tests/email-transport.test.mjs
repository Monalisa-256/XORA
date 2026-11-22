import test from 'node:test';import assert from 'node:assert/strict';import {verifiedMailUrl,verifiedRecipient,verifiedSender} from '../src/core/email-transport.ts';
test('allow verified auth link from same origin',()=>assert.equal(verifiedMailUrl('https://stage.xora.test/api/auth/verify-email?token=test','https://stage.xora.test'),true));
test('deny offsite auth link',()=>assert.equal(verifiedMailUrl('https://attacker.invalid/api/auth/verify-email','https://stage.xora.test'),false));
test('deny http reset link',()=>assert.equal(verifiedMailUrl('http://stage.xora.test/api/auth/reset-password','https://stage.xora.test'),false));
test('deny unrelated path',()=>assert.equal(verifiedMailUrl('https://stage.xora.test/redirect?to=malicious','https://stage.xora.test'),false));
test('require explicit valid sender address',()=>assert.equal(verifiedSender('XORA <noreply@xora.test>'),true));
test('reject unverified sender syntax',()=>assert.equal(verifiedSender('evil@xora.test'),false));
test('staging email allowlist accepts exact domain',()=>assert.equal(verifiedRecipient('tester@example.invalid','example.invalid'),true));
test('staging email deny other domain',()=>assert.equal(verifiedRecipient('tester@else.invalid','example.invalid'),false));
