import test from 'node:test';import assert from 'node:assert/strict';import {permittedPrivateKey,signedDownloadTtl,privateBuckets} from '../src/core/private-files.ts';
const owner='00000000-0000-4000-8000-000000000001',item='00000000-0000-4000-8000-000000000002';
test('allow exact owner media prefix',()=>assert.equal(permittedPrivateKey('profile_photo',`profile/${owner}/${item}.webp`,owner),true));
test('reject path traversal',()=>assert.equal(permittedPrivateKey('profile_photo',`profile/${owner}/../other/${item}.webp`,owner),false));
test('reject cross-account media',()=>assert.equal(permittedPrivateKey('profile_photo',`profile/${owner}/${item}.webp`,item),false));
test('reject unsupported purpose',()=>assert.equal(permittedPrivateKey('gibberish',`profile/${owner}/${item}.webp`,owner),false));
test('evidence bucket remains separate from profile bucket',()=>assert.notEqual(privateBuckets.verification_evidence,privateBuckets.profile_photo));
test('download URLs are short-lived',()=>assert.equal(signedDownloadTtl('profile_photo')<=60,true));
test('synthetic fixtures stay separate',()=>assert.equal(permittedPrivateKey('synthetic_test',`fixtures/phase2/${item}.txt`,owner),true));
