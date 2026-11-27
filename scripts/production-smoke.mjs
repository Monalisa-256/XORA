// Execute from an authorized network. Never print credentials, headers or response payloads.
const render='https://xora-production.onrender.com';
const vercel='https://xora-production.vercel.app';
const vercelToken=process.env.XORA_INTERNAL_MONITOR_TOKEN;
const renderToken=process.env.XORA_RENDER_MONITOR_TOKEN??vercelToken;
const valid=t=>typeof t==='string'&&/^[!-~]{24,512}$/.test(t);
let failed=false;
async function check(origin,path,headers,expected){
  try {
    const res=await fetch(origin+path,{headers,redirect:'error',cache:'no-store',signal:AbortSignal.timeout(90000)});
    const type=res.headers.get('content-type')??'';
    const data=type.includes('application/json')?await res.json():null;
    const ok=res.status===200&&data?.status===expected;
    console.log(`${origin}${path}: ${res.status} ${ok?'PASS':'FAIL'}`);
    if(!ok)failed=true;
    return ok?data:null;
  }catch{console.log(`${origin}${path}: request failed`);failed=true;return null;}
}
// Wake Render first on free plan. A cold start is not a successful health check.
const renderHeaders={};
const vercelHeaders={};
if(process.env.XORA_VERCEL_BYPASS)vercelHeaders['x-vercel-protection-bypass']=process.env.XORA_VERCEL_BYPASS;
await check(render,'/api/health/live',renderHeaders,'ok');
await check(vercel,'/api/health/live',vercelHeaders,'ok');
if(!valid(vercelToken)||!valid(renderToken)){
  console.log('Authenticated readiness not tested: required monitor credential unavailable or invalid.');failed=true;
}else{
  const r=await check(render,'/api/health/ready',{'X-Xora-Monitor-Token':renderToken},'ready');
  const headers={...vercelHeaders,'X-Xora-Monitor-Token':vercelToken};
  const v=await check(vercel,'/api/health/ready',headers,'ready');
  const aligned=r?.provider==='render'&&v?.provider==='vercel'&&/^[a-f0-9]{40}$/.test(r?.revision??'')&&r.revision===v?.revision;
  console.log(`Production revision alignment: ${aligned?'PASS':'FAIL'}`);if(!aligned)failed=true;
  const topology=await check(vercel,'/api/health/topology',headers,'ready');
  const linked=topology?.local==='ready'&&topology?.render==='ready'&&topology?.revision==='matched';
  console.log(`Vercel-to-Render authenticated topology: ${linked?'PASS':'FAIL'}`);if(!linked)failed=true;
}
if(failed)process.exitCode=1;
