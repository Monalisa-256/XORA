import test from 'node:test';
import assert from 'node:assert/strict';
import {constantTimeEqual,sameOrigin,sanitizeAuditMetadata,isUuid} from '../src/core/security.ts';
test('monitor tokens accept exact long token',()=>assert.equal(constantTimeEqual('abcdefghijklmnopqrstuvwxyz123456789','abcdefghijklmnopqrstuvwxyz123456789'),true));
test('monitor tokens reject short, incorrect or absent',()=>{assert.equal(constantTimeEqual('abc','abc'),false);assert.equal(constantTimeEqual('abcdefghijklmnopqrstuvwxyz123456789','abcdefghijklmnopqrstuvwxyz123456788'),false);assert.equal(constantTimeEqual(undefined,null),false)});
test('same origin accepts exact https origin',()=>assert.equal(sameOrigin('https://staging.xora.example','https://staging.xora.example/'),true));
test('same origin rejects deceptive suffix and http',()=>{assert.equal(sameOrigin('https://staging.xora.example.evil.test','https://staging.xora.example'),false);assert.equal(sameOrigin('http://staging.xora.example','https://staging.xora.example'),false)});
test('audit metadata strips PII and secret keys',()=>assert.deepEqual(sanitizeAuditMetadata({decision_code:'APPROVED',access_token:'secret',email:'user@example.com'}),{decision_code:'APPROVED'}));
test('uuid validation rejects invalid IDs',()=>{assert.equal(isUuid('fake'),false);assert.equal(isUuid('550e8400-e29b-41d4-a716-446655440000'),true)});
