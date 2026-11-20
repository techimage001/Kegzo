/* ================= STORE (versioned, portable to a future native app) ================= */
const KEY='kegzo.v1';
const dk=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const wkOf=d=>{const x=new Date(d);x.setHours(12);return dk(addD(x,-((x.getDay()+6)%7)))};
const dOf=s=>new Date(s+'T12:00');
const fresh=()=>({v:1,created:dk(new Date()),ob:{done:false,track:'strength',flags:[]},sessions:[],tests:[],xp:0,badges:[],settings:{voice:true,snd:true,vib:true,discreet:false},gate:{dismissed:false,email:'',state:''}});
let mem=null;
function load(){try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);return Object.assign(fresh(),o,{settings:Object.assign(fresh().settings,o.settings||{}),gate:Object.assign(fresh().gate,o.gate||{})})}}catch(e){}return mem||fresh()}
function save(){mem=S;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
let S=load();S.settings=Object.assign({voice:true,snd:true,vib:true,discreet:false},S.settings||{});
function ping(e){try{const b=JSON.stringify({e});if(navigator.sendBeacon)navigator.sendBeacon('/api/hit.php',new Blob([b],{type:'application/json'}));else fetch('/api/hit.php',{method:'POST',body:b,keepalive:true}).catch(()=>{})}catch(_){}}

/* ================= GAME ================= */
const TITLES=['Rookie','Base Builder','Steady Hand','Floor Captain','Iron Core','Control Pro','Elevator Ace','Calm Commander','Grandmaster','Legend'];
const lvlOf=xp=>Math.min(50,Math.floor((1+Math.sqrt(1+xp/5))/2)),xpFor=l=>20*l*(l-1),title=l=>TITLES[Math.min(9,Math.floor((l-1)/5))];
function streak(){const days=new Set(S.sessions.map(s=>s.d)),today=new Date();today.setHours(12);if(!days.size)return{n:0,shield:true};
 const first=[...days].sort()[0],used={};let n=0,d=days.has(dk(today))?today:addD(today,-1);
 for(let i=0;i<600;i++){const k=dk(d);if(k<first)break;if(days.has(k))n++;else{const w=wkOf(d);if(used[w])break;used[w]=1}d=addD(d,-1)}return{n,shield:!used[wkOf(today)]}}
const bestHold=()=>S.tests.reduce((m,t)=>Math.max(m,t.hold),0),totalMin=()=>Math.round(S.sessions.reduce((a,s)=>a+s.min,0));
const totalSq=()=>S.sessions.reduce((a,s)=>a+(s.sq||0),0);
const BADGES=[['first','First session',()=>S.sessions.length>=1],['found','Muscle found',()=>S.ob.done],['s3','3-day streak',()=>streak().n>=3],['s7','7-day streak',()=>streak().n>=7],
 ['test','Self-tester',()=>S.tests.length>=1],['w1','Week 1 done',()=>progDays()>=7],['sq500','500 squeezes',()=>totalSq()>=500],['l5','Level 5',()=>lvlOf(S.xp)>=5],['l10','Level 10',()=>lvlOf(S.xp)>=10],['d28','28 days',()=>progDays()>=28]];
function newBadges(){const got=[];for(const[b,n,f]of BADGES)if(!S.badges.includes(b)&&f()){S.badges.push(b);got.push(n)}return got}
const hex=(on,lab)=>`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3l18 10v22L24 45 6 35V13z" fill="${on?'#FF6B4A':'none'}" stroke="${on?'#FF6B4A':'currentColor'}" stroke-width="2"/><text x="24" y="29" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="700" font-size="13" fill="${on?'#2A0E07':'currentColor'}">${lab}</text></svg>`;
/* programme: one programme day per calendar day with a completed daily session */
const dayDates=()=>[...new Set(S.sessions.filter(s=>s.kind==='day').map(s=>s.d))].sort();
const progDays=()=>dayDates().length;
function todayInfo(){const done=dayDates().includes(dk(new Date())),n=progDays(),day=Math.min(28,done?n:n+1),week=Math.min(4,Math.ceil(day/7)),track=S.ob.track==='relax'?'relax':'strength';
 return{day,week,done,pos:PORDER[week-1],list:DAYPLAN[track][week-1]}}
const lvl=()=>lvlOf(S.xp);
const stepsOf=id=>EX[id].steps(lvl());
const secOfL=id=>stepsOf(id).reduce((a,s)=>a+s.d,0);

/* ================= UI HELPERS ================= */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2600)}
let onClose=null;
function sheet(h,cb){$('#sheet').innerHTML=h;$('#sw').classList.add('on');onClose=cb||null;const f=$('#sheet').querySelector('button,input');f&&f.focus()}
function closeSheet(){$('#sw').classList.remove('on');const c=onClose;onClose=null;c&&c()}
$('#sw').addEventListener('click',e=>{if(e.target.id==='sw'||e.target.closest('[data-close]'))closeSheet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#sw').classList.contains('on'))closeSheet()});
const ico=(k,cls='')=>`<span class="ico ${cls}">${icon(k)}</span>`;
const svgI=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const NOTE=svgI('<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>');

/* ================= ACCOUNT / SOFT GATE ================= */
function acct(){const a=$('#acct');if(S.gate.email&&S.gate.state==='verified'){a.innerHTML=`<button class="avatar" id="avB" aria-label="Account">${esc(S.gate.email[0].toUpperCase())}</button>`;$('#avB').onclick=()=>{sheet(`<h2>Account</h2><p class="mut">${esc(S.gate.email)}</p><p class="small">Progress saving is on. Kegzo is currently free.</p><button class="btn ghost wide" id="soB">Sign out on this device</button><button class="btn hot wide" data-close>Close</button>`);$('#soB').onclick=()=>{S.gate={dismissed:true,email:'',state:''};save();closeSheet();render()}}}
 else{a.innerHTML=`<button class="acct" id="siB">${S.gate.state==='pending'?'Check email':'Sign in'}</button>`;$('#siB').onclick=()=>gate(false)}}
function maybeGate(){if(S.sessions.filter(s=>s.kind!=='test').length>=3&&!S.gate.email&&!S.gate.dismissed)gate(true)}
function gate(auto){sheet(`<h2>${auto?'Nice work. Keep your progress safe':'Sign up or sign in'}</h2>
 <p class="mut">Save your level, streak and charts so they follow you to any device. Training stays open either way.</p>
 <form id="gF" class="grid" novalidate><label class="small" for="gE">Email address</label><input class="field" id="gE" type="email" autocomplete="email" required placeholder="you@example.com" value="${esc(S.gate.email||'')}">
 <input type="text" name="website" id="gH" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
 <p class="small"><b>Sign up is 100% free. No payment or card details.</b></p>
 <button class="btn hot wide" id="gB">Send my link</button><p class="tiny mut" id="gM" aria-live="polite"></p></form>
 <p class="tiny mut">Already signed up? Enter the same email and tap the link we send to unlock this device.</p>
 <button class="btn ghost wide" data-close>${auto?'Not now':'Close'}</button>`,()=>{if(auto&&!S.gate.email){S.gate.dismissed=true;save()}});
 const t0=Date.now();
 $('#gF').addEventListener('submit',async e=>{e.preventDefault();const v=$('#gE').value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){$('#gM').textContent='Please enter a valid email address.';return}
  $('#gB').disabled=true;$('#gM').textContent='Sending…';
  try{const fd=new FormData();fd.append('email',v);fd.append('website',$('#gH').value);fd.append('t',String(Date.now()-t0));fd.append('src','app');
   const r=await fetch('/api/subscribe.php',{method:'POST',body:fd});const j=await r.json().catch(()=>({}));
   if(!r.ok||!j.ok)throw new Error(j.error||'Something went wrong. Please try again.');
   S.gate.email=v;S.gate.state=j.state||'pending';save();render();
   $('#sheet').innerHTML=j.state==='verified'?`<h2>You're signed in</h2><p class="mut">Progress saving is on for <b>${esc(v)}</b>.</p><button class="btn hot wide" data-close>Done</button>`:`<h2>Check your inbox</h2><p class="mut">We sent a one-click link to <b>${esc(v)}</b>. Tap it to confirm. If it's not there in a few minutes, check your spam folder.</p><button class="btn hot wide" data-close>Done</button>`;ping('signup')}
  catch(err){$('#gB').disabled=false;$('#gM').textContent=err.message||'Could not send. Check your connection and try again.'}})}
/* verified link lands on /app.html#verified */
function checkVerified(){if(location.hash==='#verified'){S.gate.state='verified';S.gate.dismissed=true;save();toast('Email confirmed. Progress saving is on');try{history.replaceState(null,'','#today')}catch(e){}}}

/* ================= SELF-TEST (weekly boss) ================= */
function selfTest(){const T={hold:0,flicks:0,relax:0};ping('test_start');
 const s1=()=>{sheet(`<div class="row between"><h2>Boss test 1 of 3</h2><span class="tag">Max hold</span></div>
 <p class="mut">Press and hold the button while you squeeze. Let go of the button the moment your squeeze fades. Keep breathing.</p>
 <div class="big" id="tv">0.0s</div><button class="holdbtn" id="hb">Hold</button><button class="btn hot wide" id="n1" disabled>Next</button>`);
  let t0=0,iv;const hb=$('#hb');
  const dn=e=>{e.preventDefault();t0=performance.now();hb.classList.add('on');buzz([30]);iv=setInterval(()=>$('#tv').textContent=((performance.now()-t0)/1000).toFixed(1)+'s',100)};
  const up=()=>{if(!t0)return;clearInterval(iv);hb.classList.remove('on');T.hold=Math.min(120,Math.round((performance.now()-t0)/100)/10);t0=0;$('#tv').textContent=T.hold.toFixed(1)+'s';$('#n1').disabled=T.hold<1};
  hb.addEventListener('pointerdown',dn);['pointerup','pointerleave','pointercancel'].forEach(ev=>hb.addEventListener(ev,up));$('#n1').onclick=s2};
 const s2=()=>{sheet(`<div class="row between"><h2>Boss test 2 of 3</h2><span class="tag">Quick flicks</span></div>
 <p class="mut">You get 10 seconds. Tap once for every full squeeze and release.</p><div class="big" id="fv">0</div><p class="small mut" id="fl" style="text-align:center">Press Start</p>
 <button class="holdbtn" id="fb">Start</button><button class="btn hot wide" id="n2" disabled>Next</button>`);
  let n=0,on=false,left=10;const fb=$('#fb');
  fb.addEventListener('click',()=>{if(!on&&left===10){on=true;fb.textContent='Tap';$('#fl').textContent='10s left';const iv=setInterval(()=>{left--;$('#fl').textContent=left+'s left';if(left<=0){clearInterval(iv);on=false;fb.textContent='Done';fb.disabled=true;T.flicks=n;$('#n2').disabled=false;buzz([60,40,60])}},1000);return}if(on){n++;$('#fv').textContent=n;buzz([12])}});$('#n2').onclick=s3};
 const s3=()=>{sheet(`<div class="row between"><h2>Boss test 3 of 3</h2><span class="tag">Relax score</span></div>
 <p class="mut">After a squeeze, how fully could you let go? 1 means it stayed tight, 5 means completely loose.</p>
 <div class="rate" id="rt">${[1,2,3,4,5].map(i=>`<button aria-pressed="false" data-r="${i}">${i}</button>`).join('')}</div><button class="btn hot wide" id="n3" disabled>Save results</button>`);
  $('#rt').addEventListener('click',e=>{const b=e.target.closest('[data-r]');if(!b)return;T.relax=+b.dataset.r;$$('#rt button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#n3').disabled=false});
  $('#n3').onclick=()=>{const prev=bestHold();S.tests.push({d:dk(new Date()),hold:T.hold,flicks:T.flicks,relax:T.relax});S.xp+=30;const nb=newBadges();save();ping('test_done');
   sheet(`<h2>${T.hold>prev&&prev?'New best hold!':'Results saved'}</h2><div class="kpis4"><div class="k"><b>${T.hold.toFixed(1)}s</b><span>Max hold</span></div><div class="k"><b>${T.flicks}</b><span>Flicks in 10s</span></div><div class="k"><b>${T.relax}/5</b><span>Relax score</span></div><div class="k"><b>+30</b><span>XP</span></div></div>${nb.length?`<div class="note">${NOTE}<p>New badge: <b>${nb.map(esc).join(', ')}</b></p></div>`:''}<button class="btn hot wide" data-close>See my progress</button>`,()=>go('progress'));render()}};
 s1()}

/* ================= ONBOARDING + SAFETY CHECK ================= */
const QS=[['Do you feel pain or aching in your pelvis, groin, lower back or when sitting?','pain'],['Is it hard to fully relax down there, or do you often feel you need to pee urgently?','tight'],['Do you feel tense or sore after tightening those muscles?','sore'],['Have you had surgery in the pelvic area in the last few months?','surg']];
let OB={step:0,ans:{},checks:[false,false,false],track:'strength'};
const obFig=Fig('bridge');
function ob(){const o=$('#ob');o.classList.add('on');const s=OB.step,dots=n=>`<div class="dots">${Array.from({length:7},(_,i)=>`<i class="${i===n?'on':''}"></i>`).join('')}</div>`;let h='';
 if(s===0)h=`<div class="hero2"><canvas id="obCv" aria-label="Animated pelvic floor guide"></canvas></div><h1>Kegel training, built like a game.</h1><p class="mut">A 28-day programme of short guided kegel sessions with levels, streaks and a progress dashboard. Start straight away. Your training stays on this device.</p><button class="btn hot wide" data-ob="next">Let's start</button><p class="tiny mut" style="text-align:center">General fitness information, not medical advice.</p>`;
 else if(s>=1&&s<=4){const[q,k]=QS[s-1];h=`${dots(s-1)}<p class="tiny mut">Safety check ${s} of 4</p><h2>${q}</h2><div class="yn"><button class="opt" data-a="yes" aria-pressed="${OB.ans[k]===true}"><span class="dot"></span>Yes</button><button class="opt" data-a="no" aria-pressed="${OB.ans[k]===false}"><span class="dot"></span>No</button></div><p class="tiny mut">This picks your starting track. It is not a diagnosis.</p><button class="btn ghost" data-ob="back">Back</button>`}
 else if(s===5){const flag=OB.ans.pain||OB.ans.tight||OB.ans.sore;OB.track=flag?'relax':'strength';
  h=`${dots(4)}<span class="tag" style="justify-self:start">${OB.track==='relax'?'Relax track':'Strength track'}</span><h2>${OB.track==='relax'?"We'll start with letting go.":"You're set for the Strength track."}</h2>
  <p class="mut">${OB.track==='relax'?'Your answers suggest your pelvic floor may already be working hard. More squeezing can make that worse, so your sessions focus on reverse kegels and gentle holds.':'Your sessions build strength, speed and control, and every session also trains letting go with reverse kegels.'}</p>
  ${flag?`<div class="note">${NOTE}<p>If you have pain or ongoing symptoms, a GP or pelvic floor physiotherapist can check what's going on.</p></div>`:''}${OB.ans.surg?`<div class="note">${NOTE}<p>After recent surgery, check with your doctor before starting pelvic floor training.</p></div>`:''}
  <button class="btn hot wide" data-ob="next">Next: find the muscle</button><button class="btn ghost" data-ob="back">Back</button>`}
 else if(s===6)h=`${dots(5)}<h2>Find the right muscle</h2><ol class="steps2"><li><p><b>Relax</b> your belly, bum and thighs.</p></li><li><p><b>Draw up and in</b>, as if stopping wind and the flow of urine at the same time. Just imagine it.</p></li><li><p><b>Feel for it:</b> the base of the penis pulls in slightly and the testicles lift. That's the right muscle.</p></li><li><p><b>Let go completely</b> before the next one.</p></li></ol>
  <div class="wrong">${[['Glutes clench','Your bum stays soft'],['Belly pushes','Your stomach stays relaxed'],['Breath held','Keep breathing'],['Thighs squeeze','Your legs stay loose']].map(([a,b])=>`<div><b>✕ ${a}</b><br><span class="mut">${b}</span></div>`).join('')}</div>
  <button class="btn hot wide" data-ob="next">Try it, then check yourself</button><button class="btn ghost" data-ob="back">Back</button>`;
 else if(s===7){const ok=OB.checks.every(Boolean);h=`${dots(6)}<h2>Quick self-check</h2><p class="mut">Do one gentle squeeze for 3 seconds, then let go. Tick what was true.</p><div class="grid">${["My bum stayed soft","I kept breathing","My belly didn't push out"].map((t,i)=>`<button class="opt" data-ck="${i}" aria-pressed="${OB.checks[i]}"><span class="dot"></span>${t}</button>`).join('')}</div>
  <p class="small mut">${ok?"That's the right muscle. Day 1 unlocked.":'All three need to be true. Try again slowly, most people need a few goes.'}</p><button class="btn hot wide" data-ob="finish" ${ok?'':'disabled'}>Unlock Day 1</button><button class="btn ghost" data-ob="back">Back</button>`}
 o.innerHTML=`<div class="ob">${h}</div>`;o.scrollTop=0}
$('#ob').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.a){OB.ans[QS[OB.step-1][1]]=b.dataset.a==='yes';OB.step++;ob();return}
 if(b.dataset.ck){OB.checks[+b.dataset.ck]=!OB.checks[+b.dataset.ck];ob();return}
 const a=b.dataset.ob;if(a==='next'){OB.step++;ob()}else if(a==='back'){OB.step=Math.max(0,OB.step-1);ob()}
 else if(a==='finish'){const first=!S.ob.done;S.ob={done:true,track:OB.track,flags:Object.keys(OB.ans).filter(k=>OB.ans[k])};if(first)S.xp+=20;newBadges();save();$('#ob').classList.remove('on');ping('onboarded');toast(first?'Day 1 unlocked. +20 XP':'Track updated');render();if(PENDING){const id=PENDING;PENDING=null;startSession([id],'single')}}});

/* ================= VIEWS ================= */
function today(){const T=todayInfo(),l=lvl(),lo=xpFor(l),hi=xpFor(l+1),pc=l>=50?100:Math.round((S.xp-lo)/(hi-lo)*100),st=streak();
 const thisW=wkOf(new Date()),daysW=new Set(S.sessions.filter(s=>wkOf(dOf(s.d))===thisW).map(s=>s.d)).size;
 const prevBest=S.tests.filter(t=>wkOf(dOf(t.d))!==thisW).reduce((m,t)=>Math.max(m,t.hold),0),target=prevBest?Math.ceil(prevBest+1):0,beat=target&&S.tests.some(t=>wkOf(dOf(t.d))===thisW&&t.hold>=target),testedW=S.tests.some(t=>wkOf(dOf(t.d))===thisW);
 const mins=Math.round((T.list.reduce((a,id)=>a+secOfL(id)+READY,0)+REST*(T.list.length-1))/60);
 return`<div class="grid tgrid">
 <div class="grid">
  <div class="today"><p class="tiny" style="font-weight:700">Week ${T.week} · Day ${T.day} of 28 · ${POS[T.pos].n}</p><h2>${T.done?"Today's session is done":'Your session for today'}</h2><p>${T.done?'Nice work. Come back tomorrow for the next day, or train again for extra XP.':`${T.list.length} kegel exercises, about ${mins} minutes.`}</p><button class="btn wide" id="goDay">${T.done?'Train again':'Start Day '+T.day}</button></div>
  <div class="hero2"><canvas id="heroCv" aria-label="Animated preview of this week's position"></canvas><div class="lab"><span>${POS[T.pos].n}</span><span class="chip" style="background:#2A2450">Week ${T.week}</span></div></div>
  <div class="weeks">${PORDER.map((p,i)=>`<div class="wk ${i===T.week-1?'on':''}">Week ${i+1}<b>${POS[p].n.replace(' down','')}</b></div>`).join('')}</div>
  <div>${T.list.map((id,i)=>`<button class="item" data-try="${id}">${ico(EX[id].ic,EX[id].rel?'c':'')}<span><b>${String(i+1).padStart(2,'0')}  ${EX[id].n}</b><small>${EXMETA[id].sets}</small></span><em class="num">${Math.max(1,Math.round(secOfL(id)/60))} min</em></button>`).join('')}</div>
 </div>
 <div class="grid">
  <div class="card"><div class="lvl">${hex(true,l)}<div style="flex:1"><p class="tiny mut">Level ${l}</p><h2>${title(l)}</h2></div><div style="text-align:right"><b class="num" style="font:700 22px Outfit,sans-serif">${st.n}</b><p class="tiny mut">day streak</p></div></div>
   <div style="margin-top:12px"><div class="row between tiny mut"><span class="num">${S.xp-lo} / ${hi-lo} XP</span><span>${st.shield?'Rest-day shield ready':'Shield used this week'}</span></div><div class="bar" style="margin-top:6px"><i style="width:${pc}%"></i></div></div></div>
  <div class="card quest"><div class="qhead">${ico('hold')}<div style="flex:1"><p class="tiny mut">Weekly boss</p><h3>${target?`Hold for ${target} seconds`:'Take your first max-hold test'}</h3><p class="small mut">${target?(beat?'Beaten. Boss down!':"Beat your best hold in this week's test."):'It sets the target for your weekly boss challenges.'}</p></div></div><button class="btn ${beat||testedW?'ghost':'cool'} wide" id="testB">${testedW?'Retake the test':'Take the test'}</button></div>
  <div class="card quest"><div class="qhead">${ico('endure','c')}<div style="flex:1"><p class="tiny mut">Weekly quest</p><h3>Train on 4 days this week</h3></div><b class="num">${Math.min(daysW,4)}/4</b></div><div class="bar c"><i style="width:${Math.min(100,daysW/4*100)}%"></i></div></div>
  <div class="sechead" style="margin:6px 0 0"><h2>All exercises</h2><span class="tiny mut">Tap to try one</span></div>
  <div>${Object.keys(EX).map(id=>`<button class="item" data-try="${id}">${ico(EX[id].ic,EX[id].rel?'c':'')}<span><b>${EX[id].n}</b><small>${EX[id].type} · ${EXMETA[id].sets}</small></span><span class="lock">${EX[id].wk?'Week '+EX[id].wk:'Bonus'}</span></button>`).join('')}</div>
 </div></div>`}
function progress(){const st=streak(),t=S.tests,last=t[t.length-1],today_=dk(new Date());
 const start=addD(dOf(wkOf(new Date())),-77),cnt={};S.sessions.forEach(s=>cnt[s.d]=(cnt[s.d]||0)+1);
 let heat='';['M','','W','','F','','S'].forEach((lab,r)=>{heat+=`<span>${lab}</span>`;for(let c=0;c<12;c++){const d=dk(addD(start,c*7+r)),n=cnt[d]||0;heat+=`<i class="${d>today_?'fut':n>1?'l2':n?'l1':''}" title="${d}: ${n}"></i>`}});
 const thisW=wkOf(new Date()),lastW=dk(addD(dOf(thisW),-7)),sum=w=>S.sessions.filter(s=>wkOf(dOf(s.d))===w).reduce((a,s)=>({n:a.n+1,m:a.m+s.min,q:a.q+(s.sq||0)}),{n:0,m:0,q:0}),a=sum(thisW),b=sum(lastW);
 const diff=(x,y)=>y?`<span class="tiny mut">${x>=y?'+':'−'}${Math.abs(Math.round(x-y))} vs last week</span>`:'<span class="tiny mut">First week</span>';
 return`<div class="row between" style="margin-bottom:14px"><h1>Progress</h1><button class="btn cool sm" id="testB2">Max-hold test</button></div>
 <div class="kpis4"><div class="k"><b>${lvl()}</b><span>Level</span></div><div class="k"><b>${st.n}</b><span>Day streak</span></div><div class="k"><b>${totalSq()}</b><span>Squeezes</span></div><div class="k"><b>${bestHold()?bestHold().toFixed(1)+'s':'–'}</b><span>Best hold</span></div></div>
 <div class="grid two" style="margin-top:14px">
  <div class="card"><div class="sechead" style="margin-top:0"><h3>Max hold trend</h3><span class="tiny mut">${t.length} test${t.length===1?'':'s'}</span></div>${t.length>1?'<div class="chart" id="hc"><svg></svg></div>':`<div class="empty">Take the weekly max-hold test ${t.length?'once more':'twice'} to see your trend.</div>`}</div>
  <div class="card"><div class="sechead" style="margin-top:0"><h3>Consistency</h3><span class="tiny mut">Last 12 weeks</span></div><div class="heat">${heat}</div></div>
  <div class="card"><div class="sechead" style="margin-top:0"><h3>Quick flicks in 10 seconds</h3></div>${t.length?t.slice(-6).map(x=>`<div class="hrow"><span class="mut">${x.d.slice(5).replace('-','/')}</span><div class="bar"><i style="width:${Math.min(100,x.flicks/20*100)}%"></i></div><b class="num">${x.flicks}</b></div>`).join(''):'<div class="empty">Your flick counts from each test appear here.</div>'}</div>
  <div class="card"><div class="sechead" style="margin-top:0"><h3>Relax score</h3><span class="tiny mut">Out of 5</span></div>${t.length?t.slice(-6).map(x=>`<div class="hrow"><span class="mut">${x.d.slice(5).replace('-','/')}</span><div class="bar c"><i style="width:${x.relax/5*100}%"></i></div><b class="num">${x.relax}</b></div>`).join(''):'<div class="empty">Letting go matters as much as squeezing.</div>'}</div>
 </div>
 <div class="sechead"><h2>This week</h2></div>
 <div class="kpis4"><div class="k"><b>${a.n}</b><span>Sessions</span><br>${diff(a.n,b.n)}</div><div class="k"><b>${Math.round(a.m)}</b><span>Minutes</span><br>${diff(a.m,b.m)}</div><div class="k"><b>${a.q}</b><span>Squeezes</span><br>${diff(a.q,b.q)}</div><div class="k"><b>${last?last.relax+'/5':'–'}</b><span>Latest relax score</span></div></div>
 <div class="sechead"><h2>Badges</h2><span class="tiny mut">${S.badges.length} of ${BADGES.length}</span></div>
 <div class="badges">${BADGES.map(([k,n])=>{const on=S.badges.includes(k),m=n.match(/\d+/);return`<div class="bdg ${on?'':'off'}">${hex(on,m?m[0]:n[0])}${n}</div>`}).join('')}</div>`}
function learn(){const G=[['kegel-exercises-for-men','Kegel exercises for men','The complete beginner guide'],['how-to-find-your-pelvic-floor-muscle','How to find the right muscle','The cues that work for men'],['what-is-a-reverse-kegel','What is a reverse kegel?','Why letting go matters'],['how-long-do-kegels-take-to-work','How long do kegels take?','Realistic timelines'],['kegel-mistakes','Common kegel mistakes','And how to fix them'],['tight-pelvic-floor-men','Signs of a tight pelvic floor','When not to squeeze harder'],['kegel-positions','Lying, seated, standing, walking','Why the position changes']];
 return`<h1>Learn</h1><p class="mut" style="margin:8px 0 16px">Short, plain guides. Everything here is currently free.</p>
 <div class="grid two"><div class="links">${G.map(([s,t,d])=>`<a class="lk" href="/guides/${s}.html"><span>${t}<small>${d}</small></span><span aria-hidden="true">›</span></a>`).join('')}</div>
 <div class="grid"><div class="card grid"><h3>When to stop</h3><p class="small">Stop if anything hurts, and don't push through soreness. If you have pain, tension or symptoms that don't settle, see a GP or a pelvic floor physiotherapist.</p><div class="note">${NOTE}<p>Kegzo is an exercise app for general fitness. It is not a medical service.</p></div><button class="btn ghost" id="retake">Retake the safety check</button></div>
 <div class="card grid"><h3>Exercise guides</h3><div class="links">${Object.keys(EX).map(id=>`<a class="lk" href="/exercises/${EXMETA[id].slug}.html"><span>${EX[id].n}<small>${EXMETA[id].sets}</small></span><span aria-hidden="true">›</span></a>`).join('')}</div></div></div></div>`}
function me(){const s=S.settings,sw=(k,t,d)=>`<div class="switch"><div><b>${t}</b><p class="tiny mut">${d}</p></div><button class="tg" role="switch" aria-checked="${!!s[k]}" data-set="${k}" aria-label="${t}"></button></div>`;
 return`<h1>Me</h1><div class="grid two" style="margin-top:16px">
 <div class="card"><h3>Training</h3><div class="switch"><div><b>Track</b><p class="tiny mut">${S.ob.track==='relax'?'Relax: letting go first':'Strength: lift and release'}</p></div><div class="seg2" id="trk"><button data-t="strength" aria-pressed="${S.ob.track!=='relax'}">Strength</button><button data-t="relax" aria-pressed="${S.ob.track==='relax'}">Relax</button></div></div>
  ${sw('voice','Voice coach','Speaks each step out loud')}${sw('snd','Sound cues','A rising beep to squeeze, a falling beep to let go')}${sw('vib','Vibration cues','Buzzes on each squeeze and drop (Android)')}${sw('discreet','Discreet mode','Silent, no voice, vibration only')}</div>
 <div class="card grid"><h3>Account</h3>${S.gate.email?`<p class="small">${S.gate.state==='verified'?'Signed in as':'Waiting for you to confirm'} <b>${esc(S.gate.email)}</b>.</p>`:`<p class="small mut">Sign up to keep your progress across devices. <b>100% free, no payment or card details.</b></p>`}<button class="btn ${S.gate.email?'ghost':'hot'}" id="meG">${S.gate.email?'Manage':'Sign up or sign in'}</button>
  <h3 style="margin-top:6px">Your data</h3><p class="small mut">Your training is stored in this browser on this device. Nothing about your sessions is sent anywhere. Only your email is stored on our server if you sign up.</p>
  <div class="row"><button class="btn ghost danger" id="delB">Delete everything</button></div><p class="tiny mut" id="delM"></p></div>
 </div>
 <div class="foot"><a href="/about.html">About</a><a href="/how-we-write.html">How we write</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/contact.html">Contact</a></div>`}

/* ================= CHART ================= */
function chart(){const el=$('#hc');if(!el)return;const s=el.querySelector('svg'),t=S.tests.slice(-8);
 const draw=()=>{const W=el.clientWidth,H=el.clientHeight,pl=34,pr=12,pt=14,pb=24,mx=Math.ceil(Math.max(...t.map(x=>x.hold))/5)*5||5,X=i=>pl+(W-pl-pr)*(i/(t.length-1)),Y=v=>pt+(H-pt-pb)*(1-v/mx),pts=t.map((x,i)=>[X(i),Y(x.hold)]);
  let g='';[0,mx/2,mx].forEach(v=>g+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--line)"/><text x="${pl-8}" y="${Y(v)+4}" text-anchor="end" font-size="12" style="fill:var(--mut)">${v}s</text>`);
  t.forEach((x,i)=>{if(W>420||i===0||i===t.length-1)g+=`<text x="${X(i)}" y="${H-5}" text-anchor="middle" font-size="12" style="fill:var(--mut)">${x.d.slice(5).replace('-','/')}</text>`});
  const ln=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');g+=`<path d="${ln}L${pts[pts.length-1][0]} ${Y(0)}L${pts[0][0]} ${Y(0)}Z" fill="#FF6B4A" opacity=".12"/><path d="${ln}" fill="none" stroke="#FF6B4A" stroke-width="3" stroke-linejoin="round"/>`;
  pts.forEach((p,i)=>g+=`<circle cx="${p[0]}" cy="${p[1]}" r="${i===pts.length-1?6:4}" fill="${i===pts.length-1?'#FF6B4A':'#1F1A3D'}" stroke="#FF6B4A" stroke-width="2.5"/>`);s.innerHTML=g};
 new ResizeObserver(draw).observe(el)}

/* ================= ROUTER / RENDER ================= */
const VIEWS=['today','progress','learn','me'];let cur='today',PENDING=null;
function go(v){if(!VIEWS.includes(v))v='today';cur=v;VIEWS.forEach(x=>$('#v-'+x).classList.toggle('on',x===v));$$('.tabs button').forEach(b=>b.dataset.v===v?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current'));
 if(location.hash.slice(1)!==v)try{history.replaceState(null,'','#'+v)}catch(e){}render();window.scrollTo(0,0)}
function render(){$('#topLv').textContent='Lv '+lvl();const st=streak().n;$('#topSt').textContent=st+' day'+(st===1?'':'s');acct();
 if(cur==='today'){$('#v-today').innerHTML=today();$('#goDay').onclick=()=>{const T=todayInfo();startSession(T.list,'day')};$('#testB').onclick=selfTest;{const hp=todayInfo().pos;heroF=Fig(hp==='lying'?'bridge':hp)}}
 if(cur==='progress'){$('#v-progress').innerHTML=progress();$('#testB2').onclick=selfTest;chart()}
 if(cur==='learn'){$('#v-learn').innerHTML=learn();$('#retake').onclick=()=>{OB={step:1,ans:{},checks:[false,false,false],track:'strength'};ob()}}
 if(cur==='me'){$('#v-me').innerHTML=me();bindMe()}}
function bindMe(){const v=$('#v-me');
 v.querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>{const k=b.dataset.set;S.settings[k]=!S.settings[k];save();render()});
 v.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{S.ob.track=b.dataset.t;save();render();toast(b.dataset.t==='relax'?'Relax track on':'Strength track on')});
 $('#meG').onclick=()=>gate(false);
 let armed=false;$('#delB').onclick=()=>{if(!armed){armed=true;$('#delB').textContent='Tap again to delete';$('#delM').textContent='This removes every session, test and setting from this device.';return}
  try{localStorage.removeItem(KEY)}catch(e){}S=fresh();mem=null;OB={step:0,ans:{},checks:[false,false,false],track:'strength'};render();ob()}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-try]');if(b){if(!S.ob.done){PENDING=b.dataset.try;OB.step=0;ob();return}startSession([b.dataset.try],'single')}});
$('.tabs').addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b)go(b.dataset.v)});

/* ================= PLAYER ================= */
const W={list:[],kind:'day',i:0,ph:'ready',t:0,si:0,st:0,rep:0,L:0,from:0,lift:0,liftFrom:0,paused:false,fig:null,pos:'lying',cueI:0,sq:0};
let STEPS=[],CUM=[];
const WORD={squeeze:'Squeeze',hold:'Hold',relax:'Relax',rest:'Rest',drop:'Drop',out:'Return',up:'Up a floor',down:'Down a floor',bridge:'Lift hips',lower:'Lower hips'};
const CUES={squeeze:'Draw up and in',hold:['Keep breathing','Bum stays soft','Belly relaxed','Thighs loose'],relax:'Let go completely',rest:'Rest. Nothing to do',drop:'Breathe in, let it soften and drop',out:'Breathe out, back to neutral',up:'Lift a little more',down:'Lower slowly, stay in control',bridge:'Press through your heels, hips up',lower:'Lower slowly and let everything go'};
function voiceOn(){return S.settings.voice&&!S.settings.discreet}
let AC=null,AU=false,UTT=null,VOICE=null;
function sndOn(){return S.settings.snd!==false&&!S.settings.discreet}
function pickVoice(){try{const vs=speechSynthesis.getVoices();VOICE=vs.find(v=>/en-GB/i.test(v.lang)&&/natural|google|daniel|serena|libby|ryan/i.test(v.name))||vs.find(v=>/en-GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null}catch(e){}}
if('speechSynthesis' in window){pickVoice();try{speechSynthesis.addEventListener('voiceschanged',pickVoice)}catch(e){}}
function unlockAudio(){try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
 try{if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C()}if(AC){if(AC.state!=='running')AC.resume();const b=AC.createBuffer(1,1,22050),src=AC.createBufferSource();src.buffer=b;src.connect(AC.destination);src.start(0)}}catch(e){}
 if(!AU&&'speechSynthesis' in window){try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);pickVoice()}catch(e){}}AU=true}
['pointerdown','touchend','keydown','click'].forEach(ev=>document.addEventListener(ev,unlockAudio,{passive:true,capture:true}));
function tone(f1,f2,d,vol){if(!sndOn()||!AC)return;try{if(AC.state!=='running')AC.resume();const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.35,t+.02);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.05)}catch(e){}}
const SFX={up:()=>tone(520,880,.22),down:()=>tone(620,330,.28,.3),tick:()=>tone(900,900,.08,.25),done:()=>{tone(660,660,.15);setTimeout(()=>tone(880,880,.15),160);setTimeout(()=>tone(1320,1320,.35),320)}};
function say(t){if(!voiceOn()||!('speechSynthesis' in window))return;try{const go=()=>{UTT=new SpeechSynthesisUtterance(t);if(VOICE){UTT.voice=VOICE;UTT.lang=VOICE.lang}else UTT.lang='en-GB';UTT.rate=1;UTT.volume=1;speechSynthesis.speak(UTT)};if(speechSynthesis.speaking||speechSynthesis.pending){speechSynthesis.cancel();setTimeout(go,90)}else go();speechSynthesis.resume()}catch(e){}}
function buzz(p){if(p&&S.settings.vib&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
const RC=276.5;function ring(left,tot,lab,col){$('#ringT').textContent=Math.max(0,Math.ceil(left));$('#ringL').textContent=lab;const p=$('#ringP');p.setAttribute('stroke',col);p.setAttribute('stroke-dashoffset',RC*(1-Math.max(0,left)/tot))}
function howHTML(id,i){const e=EX[id],m=EXMETA[id],p=POS[W.pos];return`<div><p class="tiny mut" style="font-weight:600">${String(i+1).padStart(2,'0')} · ${e.type} · ${m.sets}</p><h2>${e.n}</h2></div><ol>${e.how.map(s=>`<li>${s}</li>`).join('')}</ol>
 <div class="cols"><div class="box"><h3>Feel it</h3><p>${e.feel}</p></div><div class="box"><h3>Avoid</h3><ul>${e.avoid.map(a=>`<li>${a}</li>`).join('')}</ul></div><div class="box"><h3>Coach tip</h3><p>${e.tip}</p></div></div>
 <div class="note">${NOTE}<p><b>Position: ${p.n}.</b> ${p.how}</p></div>`}
function updReps(){const tot=STEPS.filter(s=>s.r).length;$('#reps').innerHTML=`${W.rep}<span style="font-size:.55em;color:#B6AFD8"> / ${tot}</span><small>${W.list[W.i]==='endure'?'Long holds':'Reps'}</small>`}
function loadEx(i){W.i=i;W.ph='ready';W.t=0;W.si=0;W.st=0;W.rep=0;W.lift=0;W.from=W.L;const id=W.list[i],e=EX[id];W.pos=e.pos||W.basePos;W.fig=Fig(W.pos);
 STEPS=stepsOf(id);CUM=[0];STEPS.forEach((s,j)=>CUM.push(CUM[j]+s.d));
 $('#exN').textContent=String(i+1).padStart(2,'0');$('#exT').textContent=e.n;$('#exS').textContent=EXMETA[id].sets;$('#pos').textContent=POS[W.pos].n;
 $('#how').innerHTML=howHTML(id,i);$('#stage').classList.remove('rest');updReps();$('#phase').textContent='Get ready';$('#phase').style.color='var(--ink)';$('#cue').textContent=POS[W.pos].how;
 const nx=W.list[i+1];$('#nextUp').innerHTML=nx?`${ico(EX[nx].ic,EX[nx].rel?'c':'')}<span>Next: <b style="color:var(--ink)">${EX[nx].n}</b></span>`:'<span>Last exercise of the session</span>';
 $$('#bars i').forEach((b,j)=>b.firstChild.style.width=j<i?'100%':'0%');say(e.n)}
function enterStep(){const s=STEPS[W.si];W.from=W.L;W.liftFrom=W.lift;W.st=0;const ph=$('#phase');ph.textContent=WORD[s.k];
 ph.style.color=s.to<0||s.k==='drop'?'#6FB7FF':(s.k==='squeeze'||s.k==='up'||s.k==='hold')?'#3DDC84':'var(--ink)';
 const c=CUES[s.k];$('#cue').textContent=Array.isArray(c)?c[W.cueI++%c.length]:c;
 if(s.k==='squeeze'||s.k==='up'){buzz([50]);SFX.up();if(s.d>=1)say(WORD[s.k])}else if(s.k==='drop'){buzz([25,40,25]);SFX.down();say('Drop')}else if(s.k==='bridge'){buzz([40]);SFX.up();say('Lift your hips')}else if(s.k==='lower'){SFX.down();say('Lower')}else if(s.k==='relax'){SFX.down();if(s.d>=1.5)say('Relax')}else if(s.k==='hold'&&s.d>=3){say('Hold')}}
const easeF=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function startSession(list,kind){unlockAudio();W.list=list;W.kind=kind;W.basePos=kind==='day'?todayInfo().pos:(EX[list[0]].pos||PORDER[Math.max(0,Math.min(3,(EX[list[0]].wk||1)-1))]);
 W.paused=false;W.sq=0;W.L=0;W.started=performance.now();$('#playB').textContent='Pause';$('#plLabel').textContent=kind==='day'?`Week ${todayInfo().week} · Day ${todayInfo().day}`:'Single exercise';
 $('#bars').innerHTML=list.map(id=>`<i class="${EX[id].rel?'c':''}"><b></b></i>`).join('');$('#pl').classList.add('on');$('#pl').scrollTop=0;document.body.style.overflow='hidden';
 if('wakeLock' in navigator)navigator.wakeLock.request('screen').then(l=>W.lock=l).catch(()=>{});ping('session_start');loadEx(0)}
function nextEx(){if(W.i>=W.list.length-1){finish();return}W.ph='rest';W.t=0;$('#stage').classList.add('rest');$$('#bars i')[W.i].firstChild.style.width='100%';$('#phase').textContent='Rest';$('#phase').style.color='var(--cool)';$('#cue').textContent='Breathe easy. Next up: '+EX[W.list[W.i+1]].n;say('Rest')}
function tick(dt){const tot=CUM[CUM.length-1];
 if(W.ph==='ready'){const pv=Math.ceil(READY-W.t);W.t+=dt;const nv=Math.ceil(READY-W.t);if(nv<pv&&nv>=1&&nv<=3)SFX.tick();ring(READY-W.t,READY,'Get ready','#6FB7FF');W.L+=(0-W.L)*Math.min(1,dt*4);W.lift+=(0-W.lift)*Math.min(1,dt*4);mvDraw(W.L,0);if(W.t>=READY){W.ph='work';W.si=0;enterStep()}}
 else if(W.ph==='work'){const s=STEPS[W.si];W.st+=dt;const ramp=s.k==='hold'||s.k==='rest'?.3:s.d*.8;W.L=W.from+(s.to-W.from)*easeF(Math.min(1,W.st/ramp));if(s.lift!=null)W.lift=W.liftFrom+(s.lift-W.liftFrom)*easeF(Math.min(1,W.st/s.d));
  const e=CUM[W.si]+W.st;ring(tot-e,tot,'Seconds',EX[W.list[W.i]].rel?'#6FB7FF':'#FF6B4A');mvDraw(W.L,Math.min(1,W.st/s.d));$$('#bars i')[W.i].firstChild.style.width=Math.min(100,e/tot*100)+'%';
  if(W.st>=s.d){if(s.k==='squeeze'||s.k==='up')W.sq++;if(s.r){W.rep++;updReps()}W.si++;if(W.si>=STEPS.length)nextEx();else enterStep()}}
 else if(W.ph==='rest'){W.t+=dt;ring(REST-W.t,REST,'Rest','#6FB7FF');W.L+=(0-W.L)*Math.min(1,dt*3);mvDraw(W.L,0);if(W.t>=REST)loadEx(W.i+1)}}
function closePl(){$('#pl').classList.remove('on');document.body.style.overflow='';try{speechSynthesis.cancel()}catch(e){}try{W.lock&&W.lock.release()}catch(e){}W.ph='off'}
function finish(){const min=Math.max(.5,Math.round((performance.now()-W.started)/6000)/10),today_=dk(new Date()),firstDay=W.kind==='day'&&!dayDates().includes(today_);
 const before=lvl(),xp=W.sq*2+(W.kind==='day'?30:10)+(firstDay?20:0);S.sessions.push({d:today_,kind:W.kind,ids:W.list,min,sq:W.sq,xp});S.xp+=xp;const nb=newBadges();save();closePl();ping('session_done');
 const after=lvl();$('#fMin').textContent=Math.max(1,Math.round(min));$('#fSq').textContent=W.sq;$('#fXp').textContent='+'+xp;
 $('#finT').textContent=W.kind==='day'?`Day ${todayInfo().day} complete`:'Exercise complete';
 $('#finExtra').innerHTML=(after>before?`<div class="note">${NOTE}<p><b>Level ${after}: ${title(after)}.</b> Your holds just got a little longer.</p></div>`:'')+(nb.length?`<div class="note">${NOTE}<p>New badge${nb.length>1?'s':''}: <b>${nb.map(esc).join(', ')}</b></p></div>`:'')+`<p class="mut small">Streak: <b>${streak().n} day${streak().n===1?'':'s'}</b>. Most programmes take around 3 months of steady practice, so consistency beats intensity.</p>`;
 $('#fin').classList.add('on');SFX.done();say('Session complete. Great work.');finF=Fig(W.pos)}
$('#finB').onclick=()=>{$('#fin').classList.remove('on');go('today');maybeGate()};
$('#playB').onclick=()=>{W.paused=!W.paused;$('#playB').textContent=W.paused?'Resume':'Pause';if(W.paused){try{speechSynthesis.cancel()}catch(e){}$('#phase').textContent='Paused';$('#phase').style.color='var(--ink)'}else if(W.ph==='work')enterStep()};
$('#nextB').onclick=()=>{if(W.i<W.list.length-1)loadEx(W.i+1);else finish()};
$('#prevB').onclick=()=>loadEx(Math.max(0,W.ph==='ready'&&W.t<2?W.i-1:W.i));
$('#voiceB').onclick=()=>{S.settings.voice=!S.settings.voice;if(S.settings.voice)S.settings.discreet=false;save();$('#voiceB').setAttribute('aria-pressed',voiceOn());if(!voiceOn())try{speechSynthesis.cancel()}catch(e){}toast(voiceOn()?'Voice coach on':'Voice coach off')};
$('#quitB').onclick=()=>{closePl();render();toast('Session ended. Finish a session to earn XP')};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&$('#pl').classList.contains('on')&&!W.paused){W.paused=true;$('#playB').textContent='Resume';$('#phase').textContent='Paused';try{speechSynthesis.cancel()}catch(e){}}});

/* ================= LOOP ================= */
let heroF=Fig('lying'),finF=Fig('standing'),last=0;
function frame(ts){const dt=Math.min(.1,(ts-(last||ts))/1000);last=ts;const lf=.5-.5*Math.cos(ts/1000*Math.PI*2/3.4),lpf=lf>.72?Math.min(1,(lf-.72)/.2):0;const u=(ts/1000%3)/3,pf=u<.15?u/.15:u<.55?1:u<.7?1-(u-.55)/.15:u<.85?-(u-.7)/.15*.7:-.7+(u-.85)/.15*.7;
 if($('#ob').classList.contains('on')){const c=$('#obCv');if(c){obFig.step(dt);obFig.render(c,lpf,1,lf)}}
 else if($('#pl').classList.contains('on')){if(!W.paused&&W.ph!=='off'){tick(dt);W.fig.step(dt)}W.fig.render($('#cv'),W.L,1,W.lift)}
 else if($('#fin').classList.contains('on')){finF.step(dt);finF.render($('#finCv'),.5+.5*Math.sin(ts/600))}
 else if(cur==='today'){const c=$('#heroCv');if(c){heroF.step(dt);heroF.P.sprite?heroF.render(c,lpf,1,lf):heroF.render(c,pf)}}
 requestAnimationFrame(frame)}

/* ================= BOOT ================= */
mvInit();mvDraw(0,0);$('#voiceB').setAttribute('aria-pressed',voiceOn());
checkVerified();
const h=location.hash.slice(1),exH=h.startsWith('ex-')?Object.keys(EXMETA).find(k=>'ex-'+EXMETA[k].slug===h):null;
go(VIEWS.includes(h)?h:'today');
if(!S.ob.done){if(exH)PENDING=exH;ob()}else if(exH)startSession([exH],'single');
requestAnimationFrame(frame);ping('app_open');
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('/sw.js').catch(()=>{});
window.addEventListener('hashchange',()=>{const x=location.hash.slice(1);if(VIEWS.includes(x)&&x!==cur)go(x)});
