/** Production topology checks. No user-controlled destination or secret-bearing redirects. */
export const renderOrigin = 'https://xora-production.onrender.com';
export const vercelOrigin = 'https://xora-production.vercel.app';
type Env = Record<string, string | undefined>;
export type Provider = 'vercel' | 'render' | 'unknown';
export type Check = 'ready' | 'unavailable';
export type RevisionCheck = 'matched' | 'different' | 'unknown';
export type Topology = {status: Check; local: Check; render: Check; revision: RevisionCheck};
export function deploymentIdentity(env: Env): {provider: Provider; revision: string | null} {
  const vercel = env.VERCEL === '1';
  const render = env.RENDER === 'true';
  if (vercel === render) return {provider:'unknown', revision:null};
  const raw = vercel ? env.VERCEL_GIT_COMMIT_SHA : env.RENDER_GIT_COMMIT;
  return {provider:vercel?'vercel':'render',revision:typeof raw==='string' && /^[a-f0-9]{40}$/i.test(raw)?raw.toLowerCase():null};
}
export function validMonitorToken(token: string | undefined): token is string {
  return typeof token === 'string' && /^[!-~]{24,512}$/.test(token);
}
export function isRenderTarget(value: string | undefined): boolean {
  // Exact origin, optional trailing slash; reject paths, credentials, alternate hosts and query strings.
  return value === renderOrigin || value === renderOrigin + '/';
}
export async function checkTopology(options: {
  env: Env;
  localReady: () => Promise<boolean>;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}): Promise<Topology> {
  const fail: Topology = {status:'unavailable',local:'unavailable',render:'unavailable',revision:'unknown'};
  const identity = deploymentIdentity(options.env);
  const token = options.env.XORA_RENDER_MONITOR_TOKEN ?? options.env.XORA_INTERNAL_MONITOR_TOKEN;
  if (identity.provider !== 'vercel' || options.env.XORA_ENVIRONMENT !== 'production' || options.env.VERCEL_ENV !== 'production' || !isRenderTarget(options.env.XORA_RENDER_API_URL) || !validMonitorToken(token)) return fail;
  const fetcher = options.fetcher ?? fetch;
  const timeoutMs = Math.min(Math.max(options.timeoutMs ?? 8000, 1), 10000);
  const local = Promise.resolve().then(options.localReady).then(ok => ok?'ready' as const:'unavailable' as const, () => 'unavailable' as const);
  const peer = (async (): Promise<{check:Check; revision:RevisionCheck}> => {
    try {
      const res = await fetcher(renderOrigin+'/api/health/ready', {method:'GET',headers:{'X-Xora-Monitor-Token':token,Accept:'application/json'},redirect:'error',cache:'no-store',signal:AbortSignal.timeout(timeoutMs)});
      if (res.status!==200 || !res.headers.get('content-type')?.includes('application/json')) return {check:'unavailable',revision:'unknown'};
      // Read only a small, bounded response even if the upstream misbehaves.
      const reader=res.body?.getReader();
      if (!reader) return {check:'unavailable',revision:'unknown'};
      const decoder=new TextDecoder();let body='',bytes=0;
      try {
        for (;;) {
          const {done,value}=await reader.read();if(done)break;
          bytes+=value.byteLength;if(bytes>4096){await reader.cancel();return {check:'unavailable',revision:'unknown'};}
          body+=decoder.decode(value,{stream:true});
        }
        body+=decoder.decode();
      } finally {reader.releaseLock();}
      const data:unknown=JSON.parse(body);
      if (typeof data!=='object'||data===null) return {check:'unavailable',revision:'unknown'};
      const item=data as Record<string,unknown>;
      if(item.status!=='ready'||item.provider!=='render')return {check:'unavailable',revision:'unknown'};
      const revision=identity.revision && typeof item.revision==='string' && /^[a-f0-9]{40}$/i.test(item.revision)
        ? identity.revision===item.revision.toLowerCase()?'matched':'different' : 'unknown';
      return {check:'ready',revision};
    } catch {return {check:'unavailable',revision:'unknown'};}
  })();
  // Bound both checks, including local callback; underlying DB query has its own timeout.
  let timer:ReturnType<typeof setTimeout>|undefined;
  try {
    return await Promise.race([Promise.all([local,peer]).then(([local,peer]):Topology=>({status:local==='ready'&&peer.check==='ready'&&peer.revision==='matched'?'ready':'unavailable',local,render:peer.check,revision:peer.revision})),new Promise<Topology>(resolve=>{timer=setTimeout(()=>resolve(fail),timeoutMs+250);})]);
  } finally {if(timer)clearTimeout(timer);}
}
