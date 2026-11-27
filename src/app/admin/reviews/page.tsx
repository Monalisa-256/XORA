import Link from 'next/link';
import ReviewConsole from './review-console';
import {phase3Gate} from '@/core/phase3';
export const dynamic='force-dynamic';
export default function Reviews(){return <main id="content" className="shell phase3"><Link className="back" href="/account">← Account</Link><section className="account-panel"><span className="eyebrow">RESTRICTED STAFF ACCESS</span><h1>Review desk</h1><p>Assigned cases only. Profile content and adulthood checks are separate. Never paste identity documents, credentials or private contact information into review records.</p>{phase3Gate(process.env)?<ReviewConsole/>:<p className="notice">The review desk is closed pending production approval.</p>}</section></main>}
