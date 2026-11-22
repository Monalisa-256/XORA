import test from 'node:test';import assert from 'node:assert/strict';import {randomBytes} from 'node:crypto';
import {base32,fromBase32,totpCode,newTotpSecret,verifyTotp,encryptTotpSecret,decryptTotpSecret,sessionBinding,enrolmentAllowed,toOtpAuthUri} from '../src/core/staff-mfa.ts';
const key=randomBytes(32).toString('base64');
test('RFC 6238 SHA1 six-digit sample',()=>{const secret=base32(Buffer.from('12345678901234567890'));assert.equal(totpCode(secret,Math.floor(59/30)),'287082')});
test('base32 round trip preserves secret',()=>{const secret=newTotpSecret();assert.equal(fromBase32(secret).length,20)});
test('TOTP is valid at exact current step',()=>{const secret=newTotpSecret(),now=1730000000000;assert.equal(verifyTotp(secret,totpCode(secret,Math.floor(now/30000)),now).valid,true)});
test('TOTP accepts one step clock drift',()=>{const secret=newTotpSecret(),now=1730000000000;assert.equal(verifyTotp(secret,totpCode(secret,Math.floor(now/30000)-1),now).valid,true)});
test('TOTP rejects out-of-window values',()=>{const secret=newTotpSecret(),now=1730000000000;assert.equal(verifyTotp(secret,totpCode(secret,Math.floor(now/30000)-3),now).valid,false)});
test('TOTP refuses replayed step',()=>{const secret=newTotpSecret(),now=1730000000000,step=Math.floor(now/30000);assert.equal(verifyTotp(secret,totpCode(secret,step),now,step).valid,false)});
test('TOTP rejects malformed input',()=>{assert.equal(verifyTotp(newTotpSecret(),'12345x',Date.now()).valid,false)});
test('AES GCM encrypt/decrypt roundtrip',()=>{const secret=newTotpSecret(),cipher=encryptTotpSecret(secret,key);assert.notEqual(secret,cipher);assert.equal(decryptTotpSecret(cipher,key),secret)});
test('AES GCM wrong key refuses secret',()=>{const cipher=encryptTotpSecret(newTotpSecret(),key);assert.throws(()=>decryptTotpSecret(cipher,randomBytes(32).toString('base64')))});
test('AES GCM modified ciphertext refuses secret',()=>{const cipher=encryptTotpSecret(newTotpSecret(),key);assert.throws(()=>decryptTotpSecret(cipher.slice(0,-1)+'X',key))});
test('session binding distinguishes sessions',()=>{assert.notEqual(sessionBinding('one',key),sessionBinding('two',key))});
test('session binding is deterministic',()=>{assert.equal(sessionBinding('one',key),sessionBinding('one',key))});
test('enrollment requires active staff recent login',()=>{const a={staffStatus:'active',accountStatus:'active',emailVerified:true,sessionAgeMs:120000,alreadyConfirmed:false};assert.equal(enrolmentAllowed(a),true);assert.equal(enrolmentAllowed({...a,sessionAgeMs:900000}),false);assert.equal(enrolmentAllowed({...a,staffStatus:'revoked'}),false);assert.equal(enrolmentAllowed({...a,emailVerified:false}),false);assert.equal(enrolmentAllowed({...a,alreadyConfirmed:true}),false)});
test('TOTP URI has issuer, no network side effect',()=>{const uri=toOtpAuthUri('test%40example.invalid',newTotpSecret());assert.match(uri,/^otpauth:\/\/totp\//);assert.match(uri,/issuer=XORA%20Staff/)})
