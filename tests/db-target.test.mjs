import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDatabaseTarget} from '../src/core/db-target.ts';
const expectedHost='ep-cold-dream-bgawtzwi-pooler.c-9.eu-central-1.aws.neon.tech';
const expectedUser='xora_app_staging';
const good='postgresql://xora_app_staging:password@ep-cold-dream-bgawtzwi-pooler.c-9.eu-central-1.aws.neon.tech/xora?sslmode=require';
test('XORA database target accepts only XORA name and ID configuration',()=>assert.doesNotThrow(()=>validateDatabaseTarget(good,'xora','sweet-meadow-04731447',expectedHost,expectedUser)));
test('reject unrelated Neon database name',()=>assert.throws(()=>validateDatabaseTarget(good,'other','sweet-meadow-04731447',expectedHost,expectedUser),/WRONG_DATABASE_NAME/));
test('reject unrelated project ID',()=>assert.throws(()=>validateDatabaseTarget(good,'xora','foreign-id',expectedHost,expectedUser),/WRONG_XORA_PROJECT_ID/));
test('reject non-Neon hosts',()=>assert.throws(()=>validateDatabaseTarget('postgres://x:y@db.example.com/xora','xora','sweet-meadow-04731447',expectedHost,expectedUser),/DATABASE_HOST_NOT_NEON/));
test('reject disabled SSL',()=>assert.throws(()=>validateDatabaseTarget(good.replace('sslmode=require','sslmode=disable'),'xora','sweet-meadow-04731447',expectedHost,expectedUser),/DATABASE_TLS_REQUIRED/));

test('reject valid Neon host for a different XORA branch',()=>assert.throws(()=>validateDatabaseTarget(good,'xora','sweet-meadow-04731447','ep-dark-rice-bg6gloaq-pooler.c-9.eu-central-1.aws.neon.tech',expectedUser),/WRONG_XORA_BRANCH_HOST/));

test('owner account not accepted as application credential',()=>assert.throws(()=>validateDatabaseTarget(good.replace('xora_app_staging','xora_owner'),'xora','sweet-meadow-04731447',expectedHost,expectedUser),/UNSAFE_DATABASE_LOGIN_ROLE/));
