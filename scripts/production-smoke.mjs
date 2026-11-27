// Run from an authorized network. Secrets are read only from the environment and never printed.
const origins=['https://xora-production.onrender.com','https://xora-production.vercel.app'];
const token=process.env.XORA_INTERNAL_MONITOR_TOKEN;
let failed=false;
async function check(origin,path,headers,expected){
  try {
    const res=await fetch(origin+path,{headers,redirect:'manual',signal:AbortSignal.timeout(90000)});
    const type=res.headers.get('content-type')??'';
    const data=type.includes('application/json')?await res.json():null;
    const ok=res.status===200&&data?.status===expected;
    console.log(`${origin}${path}: ${res.status} ${ok?'PASS':'FAIL'}`);
    if(!ok)failed=true;
  }catch{console.log(`${origin}${path}: request failed`);failed=true;}
}
for(const origin of origins){
  const headers={};
  if(origin.includes('vercel.app')&&process.env.XORA_VERCEL_BYPASS)headers['x-vercel-protection-bypass']=process.env.XORA_VERCEL_BYPASS;
  await check(origin,'/api/health/live',headers,'ok');
  if(token)await check(origin,'/api/health/ready',{...headers,'X-Xora-Monitor-Token':token},'ready');
  else {console.log(`${origin}: authenticated readiness not tested; monitor token unavailable`);failed=true;}
}
if(failed)process.exitCode=1;
