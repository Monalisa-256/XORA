import {NextResponse} from 'next/server';
export const dynamic='force-dynamic';
export async function GET(){return NextResponse.json({status:'ok',component:'xora-web'},{headers:{'Cache-Control':'no-store'}});}
