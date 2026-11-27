import Link from 'next/link';
import Account from './wizard';
import {phase3Gate,registrationGate} from '@/core/phase3';
export const dynamic='force-dynamic';
export default function AccountPage(){return <main id="content" className="shell phase3"><header className="nav"><Link href="/" className="brand">XORA <span className="tiny">18+</span></Link><Link href="/policies">Safety & privacy</Link></header><Account enabled={phase3Gate(process.env)} signup={registrationGate(process.env)} terms={process.env.XORA_APPROVED_TERMS_VERSION??''} privacy={process.env.XORA_APPROVED_PRIVACY_VERSION??''}/></main>}
