import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.cwd(),'src');
const all=[];
function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,d.name);if(d.isDirectory())walk(p);else if(/\.(ts|tsx)$/.test(p))all.push(p);}}
walk(root);
const failures=[];
if(fs.existsSync(path.join(root,'app/api/v1/_test')))failures.push('Next.js private folder _test would not expose the intended endpoint; use %5Ftest');
for(const filename of all){const src=fs.readFileSync(filename,'utf8');const rel=path.relative(root,filename);
 if(/(sk_live_|BEGIN PRIVATE KEY|postgresql:\/\/[^\s"']+:[^\s"']+@)/i.test(src)) failures.push(`${rel}: embedded secret`);
 if(/getPool\(/.test(src)&&!rel.startsWith('lib/')&&!rel.startsWith('app/api/'))failures.push(`${rel}: DB client outside server API/lib`);
 if(/dangerouslySetInnerHTML/.test(src))failures.push(`${rel}: dangerous HTML rendering`);
 if(rel.startsWith('app/')&&/localStorage.*(?:role|admin|auth)/i.test(src))failures.push(`${rel}: client-controlled authority`);
}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Checked ${all.length} XORA TS/TSX files; no hardcoded credentials or client-owned role decisions detected.`);
