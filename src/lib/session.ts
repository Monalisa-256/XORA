import 'server-only';
import type { NextRequest } from 'next/server';
import { getAuth } from './auth';
import { features } from './env';
import { getPool } from './db';
import { mayReadOwnAccount, staffAccess, type StaffDecisionContext } from '@/core/policy';
import {hasFreshStaffMfa} from './staff-mfa-db';
export type AccountSession = {accountId:string;authUserId:string;authSessionId:string;signedInAt:number;accountStatus:'pending_email'|'active'|'restricted'|'closed';emailVerified:boolean};
export async function resolveAccountSession(req:NextRequest):Promise<AccountSession|null>{
 if(!features.authEnabled)return null;
 const session=await getAuth().api.getSession({headers:req.headers});
 if(!session||!session.user?.emailVerified||!session.session?.id)return null;
 const data=await getPool().query('SELECT id,status FROM accounts WHERE auth_user_id=$1',[session.user.id]);
 const row=data.rows[0];
 if(!row||!mayReadOwnAccount(row.status,true).allow)return null;
 const signedInAt=new Date(session.session.createdAt).getTime();
 if(!Number.isFinite(signedInAt))return null;
 return {accountId:row.id,authUserId:session.user.id,authSessionId:session.session.id,signedInAt,accountStatus:row.status,emailVerified:true};
}
export async function authorizeStaff(req:NextRequest,permission:string):Promise<{accountId:string}|null>{
 const member=await resolveAccountSession(req);if(!member)return null;
 const staff=await getPool().query(`SELECT sm.status,array_remove(array_agg(DISTINCT rp.permission_code),NULL) AS permissions
 FROM staff_memberships sm
 LEFT JOIN staff_role_grants srg ON srg.staff_membership_id=sm.id AND srg.revoked_at IS NULL
 LEFT JOIN roles r ON r.code=srg.role_code AND r.enabled=true
 LEFT JOIN role_permissions rp ON rp.role_code=r.code
 WHERE sm.account_id=$1 GROUP BY sm.id`,[member.accountId]);
 const row=staff.rows[0];
 const mfaVerified=row?.status==='active' ? await hasFreshStaffMfa(member.accountId,member.authSessionId) : false;
 const ctx:StaffDecisionContext={accountStatus:member.accountStatus,emailVerified:member.emailVerified,staffStatus:row?.status??null,mfaVerified,permissions:row?.permissions??[]};
 if(!staffAccess(ctx,permission).allow)return null;
 return {accountId:member.accountId};
}
