/* Static VM smoke test. Browser rendering is unavailable under managed Chromium policy. */
const fs=require('fs');const vm=require('vm');const assert=require('assert');
const src=fs.readFileSync(__dirname+'/prototype/app.js','utf8');
const elements={app:{innerHTML:''},toast:{textContent:'',classList:{add(){},remove(){}}}};
const document={title:'',getElementById(id){return elements[id]},addEventListener(){}};
const window={scrollTo(){},addEventListener(){}};
const location={hash:''};
const ctx=vm.createContext({document,window,location,console,setTimeout(){return 1},clearTimeout(){},Date,Intl,FormData:function(){},Math,Number,String,Array,JSON,Boolean});
vm.runInContext(src,ctx,{filename:'app.js'});
function run(s){return vm.runInContext(s,ctx)}
function check(cond,label){assert(cond,label);console.log('PASS',label)}
check(elements.app.innerHTML.includes('Meet people.'),'public landing renders');
const views=['home','how','pricing','safety','signup','onboarding','review','discover','profile','invitations','messages','membership','promote','checkout','payment-status','settings','support','state-gallery'];
for(const v of views){run(`state.view='${v}'; state.admin=false; render()`);check(elements.app.innerHTML.includes('<main'),'member/public view '+v+' renders');}
run("state.loggedIn=true; state.profileApproved=true; state.admin=false; nav('discover')");
check(elements.app.innerHTML.includes('Suggested profiles'),'member discovery loads');
run("sendInvite('amina')");
check(run("state.invites.filter(i=>i.origin==='outgoing'&&i.status==='pending').length")===1,'free outgoing pending');
check(!run('state.freeUsed'),'pending does not consume free allowance');
run("acceptInvite(state.invites.find(i=>i.origin==='outgoing').id,true)");
check(run('state.freeUsed'),'acceptance consumes first outgoing allowance');
run("sendInvite('daniel')");check(run("state.view")==='membership','second outgoing without pass is gated');
run("state.chosenPlan='connect-month'; state.flags.orderterms=true; state.orders.push({id:'XORA-DEMO-9999',product:'connect-month',owner:'demo-member',amount:25000,status:'submitted',createdAt:Date.now(),review:{recipient:true,settled:true,amount:true,unique:true,eligible:true},tx:'TEST-TXN-9999',method:'MTN',payer:'masked'}); state.activeOrder='XORA-DEMO-9999'; approveOrder('XORA-DEMO-9999')");
check(run("state.orders.find(x=>x.id==='XORA-DEMO-9999').status")==='approved','manual approval changes state');
check(run('state.passes.length')===1,'approval creates one pass');
run("approveOrder('XORA-DEMO-9999')");check(run('state.passes.length')===1,'double approval does not create another pass');
run("state.orders.push({id:'XORA-DEMO-10000',product:'connect-week',owner:'demo-member',amount:10000,status:'submitted',createdAt:Date.now(),review:{recipient:true,settled:true,amount:true,unique:true,eligible:true},tx:'TEST-TXN-10000'});approveOrder('XORA-DEMO-10000')");
check(run('state.passes.length')===2,'renewal creates next pass');
check(run('state.passes[1].start===state.passes[0].end'),'early renewal queues after current paid period');
run('state.admin=true');
for(const v of ['admin','admin-finance','admin-payment-detail','admin-profiles','admin-safety','admin-members','admin-settings']){run(`state.view='${v}'; render()`);check(elements.app.innerHTML.includes('STAFF DEMO'),'admin view '+v+' renders');}
check(!src.includes('https://'),'prototype has no external network links');
check(fs.existsSync(__dirname+'/prototype/styles.css'),'CSS exists');
console.log('ALL STATIC/LOGIC TESTS PASSED');
