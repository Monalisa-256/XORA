import {test} from 'node:test';import assert from 'node:assert/strict';
import {evaluateUpload,fileConfirmationAllowed} from '../src/core/upload-policy.ts';
const good={purpose:'synthetic_test',contentType:'image/png',sizeBytes:1000,enabled:true,syntheticOnly:true};
for(const [name,delta,code] of [
 ['disabled',{enabled:false},'UPLOADS_DISABLED'],['never real proof',{purpose:'payment_proof'},'SYNTHETIC_ONLY'],['disallow svg',{contentType:'image/svg+xml'},'UNSUPPORTED_MIME'],['disallow pdf',{contentType:'application/pdf'},'UNSUPPORTED_MIME'],['reject zero',{sizeBytes:0},'INVALID_SIZE'],['reject negative',{sizeBytes:-1},'INVALID_SIZE'],['reject overflow',{sizeBytes:1024*1024+1},'INVALID_SIZE'],['reject decimal',{sizeBytes:1.2},'INVALID_SIZE'],['reject nonhex checksum',{sha256:'X'.repeat(64)},'INVALID_CHECKSUM']]){
 test(name,()=>{assert.deepEqual(evaluateUpload({...good,...delta}),{ok:false,code})});
}
test('allow small synthetic png',()=>{assert.equal(evaluateUpload(good).ok,true)});
test('do not confirm unscanned files',()=>{assert.equal(fileConfirmationAllowed({uploaded:true,actualType:'image/png',declaredType:'image/png',actualSize:10,declaredSize:10,scanResult:'pending',checksumMatched:true}),false)});
test('do not confirm mismatched files',()=>{assert.equal(fileConfirmationAllowed({uploaded:true,actualType:'image/jpeg',declaredType:'image/png',actualSize:10,declaredSize:10,scanResult:'clean',checksumMatched:true}),false)});
test('only clean exact inspected uploads confirm',()=>{assert.equal(fileConfirmationAllowed({uploaded:true,actualType:'image/png',declaredType:'image/png',actualSize:10,declaredSize:10,scanResult:'clean',checksumMatched:true}),true)});
