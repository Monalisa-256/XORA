import test from 'node:test';
import assert from 'node:assert/strict';
import {retryDecision,canClaimJob} from '../src/core/jobs.ts';
test('retries transient jobs with backoff',()=>assert.deepEqual(retryDecision(1,5,true),{next:'queued',delaySeconds:60}));
test('permanent errors end in dead-letter',()=>assert.equal(retryDecision(1,5,false).next,'dead'));
test('max attempts ends in dead-letter',()=>assert.equal(retryDecision(5,5,true).next,'dead'));
test('queued job can be claimed when due',()=>assert.equal(canClaimJob('queued',10,null,20),true));
test('leased job cannot be claimed until expired',()=>assert.equal(canClaimJob('leased',10,30,20),false));
test('expired lease may be reclaimed',()=>assert.equal(canClaimJob('leased',10,15,20),true));
