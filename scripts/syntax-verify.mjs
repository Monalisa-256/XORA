import ts from 'typescript';
import fs from 'node:fs'; import path from 'node:path';
const files=[]; const root=path.resolve('src');
function rec(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())rec(f);else if(/\.(ts|tsx)$/.test(f))files.push(f)}}
rec(root);
const problems=[];
for(const f of files){const source=fs.readFileSync(f,'utf8');const result=ts.transpileModule(source,{fileName:f,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX,isolatedModules:true}}); for(const d of result.diagnostics||[]){if(d.category===ts.DiagnosticCategory.Error)problems.push({file:path.relative(root,f),code:d.code,message:ts.flattenDiagnosticMessageText(d.messageText,' ')});}}
console.log(`${files.length} TS/TSX source files parsed and transpiled, syntax errors: ${problems.length}`);
if(problems.length){console.error(problems);process.exit(1)}
