/* Kegzo site generator: node tools/build.js
   Single source of truth for head, nav, footer, sitemap, robots, manifest and the app bundle.
   Output goes to the repo root (the folder Hostinger serves as public_html). */
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..'),SRC=path.join(ROOT,'src');
const {EX,EXMETA,DAYPLAN,ICONS}=require(path.join(SRC,'exercises.js'));
const {GUIDES,STUDY}=require(path.join(SRC,'guides.js'));
const SITE='https://kegzo.com',V='3',INDEXNOW='60ccb4a970104b1b83b9eb9cc6826746';
const POSN={fours:'On all fours',climber:'Plank',bridge:'Lying down',lying:'Lying down',seated:'Seated',standing:'Standing',walking:'Walking'},PORDER=['lying','seated','standing','walking'],VID={bridge:'bridge',fours:'fours',climber:'climber'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const strip=h=>String(h).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const w=(rel,content)=>{const f=path.join(ROOT,rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,content)};
const pages=[];/* [path, priority] for the sitemap */
const icon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
const FONTS=`@font-face{font-family:Inter;font-style:normal;font-weight:400;font-display:swap;src:url(/assets/fonts/inter-400.woff2?v=${V}) format('woff2')}
@font-face{font-family:Inter;font-style:normal;font-weight:500;font-display:swap;src:url(/assets/fonts/inter-500.woff2?v=${V}) format('woff2')}
@font-face{font-family:Inter;font-style:normal;font-weight:600;font-display:swap;src:url(/assets/fonts/inter-600.woff2?v=${V}) format('woff2')}
@font-face{font-family:Outfit;font-style:normal;font-weight:600;font-display:swap;src:url(/assets/fonts/outfit-600.woff2?v=${V}) format('woff2')}
@font-face{font-family:Outfit;font-style:normal;font-weight:700;font-display:swap;src:url(/assets/fonts/outfit-700.woff2?v=${V}) format('woff2')}
@font-face{font-family:Outfit;font-style:normal;font-weight:800;font-display:swap;src:url(/assets/fonts/outfit-800.woff2?v=${V}) format('woff2')}`;
const ORG={'@type':'Organization','@id':SITE+'/#org',name:'Kegzo',url:SITE+'/',logo:SITE+'/assets/icons/icon-512.png'};
function head({title,desc,url,img='/assets/og.png',schema=[],robots='index,follow,max-image-preview:large'}){
 const g={'@context':'https://schema.org','@graph':[ORG,{'@type':'WebSite','@id':SITE+'/#site',name:'Kegzo',url:SITE+'/',publisher:{'@id':SITE+'/#org'},inLanguage:'en'},...schema]};
 return`<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${url}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#14112A">
<meta property="og:type" content="website"><meta property="og:site_name" content="Kegzo"><meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}${url}"><meta property="og:image" content="${SITE}${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml"><link rel="icon" href="/assets/icons/icon-96.png" sizes="96x96" type="image/png"><link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/assets/fonts/outfit-700.woff2?v=${V}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-400.woff2?v=${V}" as="font" type="font/woff2" crossorigin>
<script type="application/ld+json">${JSON.stringify(g)}</script>`}
const crumbs=list=>({'@type':'BreadcrumbList',itemListElement:list.map(([n,u],i)=>({'@type':'ListItem',position:i+1,name:n,item:SITE+u}))});
const faqSchema=faq=>({'@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:strip(a)}}))});
const MARK=`<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#FF6B4A"/><path d="M7 19c4 4 14 4 18 0" stroke="#2A0E07" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="16" cy="12" r="3.2" fill="#2A0E07"/></svg>`;
const NAV=`<header class="top"><div class="wrap topin"><a class="brand" href="/">${MARK}Kegzo</a><button class="menu" id="menuB" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span><span></span></button>
<nav id="nav" aria-label="Main"><a href="/exercises/">Exercises</a><a href="/guides/">Guides</a><a href="/about.html">About</a><a class="btn hot sm" href="/app.html">Start training</a></nav></div></header>`;
const FOOT=`<footer class="foot"><div class="wrap">
<div class="fcols">
<div><p class="fh"><a href="/app.html">Programme</a></p><a href="/app.html">Start training</a><a href="/#programme">The 28-day plan</a><a href="/#how">How it works</a></div>
<div><p class="fh"><a href="/exercises/">Exercises</a></p>${Object.keys(EX).slice(0,6).map(id=>`<a href="/exercises/${EXMETA[id].slug}.html">${EX[id].n}</a>`).join('')}<a href="/exercises/">All exercises</a></div>
<div><p class="fh"><a href="/guides/">Guides</a></p>${GUIDES.slice(0,5).map(g=>`<a href="/guides/${g.slug}.html">${esc(g.h1.split(':')[0].replace(/,.*$/,''))}</a>`).join('')}<a href="/guides/">All guides</a></div>
<div><p class="fh">Kegzo</p><a href="/about.html">About</a><a href="/how-we-write.html">How we write</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></div>
</div>
<p class="fdisc">General fitness information, not medical advice. Kegzo is a training game for the pelvic floor and does not diagnose or treat any condition. If you have pain or a health concern, speak to a qualified professional.</p>
<p class="fdisc">© Kegzo</p></div></footer>
<script>{const b=document.getElementById('menuB'),n=document.getElementById('nav');b&&b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)})}</script>`;
function page({url,title,desc,schema,body,crumb,img}){
 const bc=crumb?`<nav class="bc" aria-label="Breadcrumb">${crumb.map(([n,u],i)=>i<crumb.length-1?`<a href="${u}">${esc(n)}</a><span aria-hidden="true">›</span>`:`<span aria-current="page">${esc(n)}</span>`).join('')}</nav>`:'';
 return`<!DOCTYPE html><html lang="en"><head>${head({title,desc,url,img,schema:[...(schema||[]),...(crumb?[crumbs(crumb)]:[])]})}
<link rel="stylesheet" href="/assets/site.css?v=${V}"></head><body>${NAV}<main class="wrap">${bc}${body}</main>${FOOT}</body></html>`}
const cta=(t='Start training now',href='/app.html')=>`<p class="ctar"><a class="btn hot" href="${href}">${t}</a><span class="tiny mut">Currently free. Start straight away on any phone.</span></p>`;
const faqHTML=faq=>`<section class="faq"><h2>Frequently asked questions</h2>${faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}</section>`;

/* ---------- app ---------- */
{const tpl=fs.readFileSync(path.join(SRC,'app.html'),'utf8');
 const appHead=head({title:'Kegzo Trainer: Kegel Exercise Game for Men',desc:'Follow the 28-day kegel programme: guided sessions, a live animated coach, levels, streaks and a progress dashboard.',url:'/app.html',schema:[{'@type':'WebApplication',name:'Kegzo Trainer',url:SITE+'/app.html',applicationCategory:'HealthApplication',operatingSystem:'Any (web browser)',isAccessibleForFree:true,publisher:{'@id':SITE+'/#org'}}]});
 const out=tpl.replace('{{HEAD}}',appHead).replace('{{BASECSS}}',FONTS+'\n'+fs.readFileSync(path.join(SRC,'base.css'),'utf8'))
  .replace('{{ENGINE}}',()=>fs.readFileSync(path.join(SRC,'engine.js'),'utf8'))
  .replace('{{EXERCISES}}',()=>fs.readFileSync(path.join(SRC,'exercises.js'),'utf8').replace(/if\(typeof module[^\n]*\n?/,''))
  .replace('{{INSIDE}}',()=>fs.readFileSync(path.join(SRC,'inside.js'),'utf8'))
  .replace('{{APPJS}}',()=>fs.readFileSync(path.join(SRC,'app.js'),'utf8'));
 w('app.html',out);pages.push(['/app.html','0.9'])}

/* ---------- home ---------- */
{const HF=[['What is Kegzo?','Kegzo is a 28-day kegel training programme for men, built like a game. Each day you follow a short guided session with a live animated coach, earn XP, keep a streak and track real progress with a weekly max-hold test.'],
 ['Is Kegzo free?','Kegzo is currently free and you can start straight away. Signing up, which is also free, lets your progress follow you to other devices.'],
 ['How long does a session take?','Most daily sessions take around 6 to 8 minutes, including short rests.'],
 ['Is my training private?','Yes. Your sessions and test results are stored in your browser on your device. Nothing about your training is sent to us. If you sign up, we store only your email address.']];
 const body=`<section class="hero"><div class="htxt"><p class="eyebrow">Kegel exercises for men</p><h1>Kegel training, built like a game</h1>
<p class="lead answer">Kegzo is a 28-day kegel programme for men with no subscription and no paywall. A live animated coach shows you when to squeeze, hold and let go, you level up as you train, and a weekly max-hold test shows your real progress. Sessions take about 7 minutes and need no equipment.</p>
<p class="ctar"><a class="btn hot" href="/app.html">Start Day 1</a><a class="btn ghost" href="/exercises/">See the exercises</a></p><p class="tiny mut">Currently free. No subscription. Start straight away on any phone.</p></div>
<div class="hfig"><span class="vbox"><video class="hvid" src="/assets/video/bridge.mp4?v=${V}" poster="/assets/img/pos-bridge.webp" autoplay muted loop playsinline preload="metadata" aria-label="Glowing hologram figure lifting into a bridge and lowering, looping"></video></span></div></section>
<section id="how"><h2>How does Kegzo work?</h2><p class="answer">You answer four quick safety questions, learn to find the right muscle, then follow one short guided session a day. The coach counts every squeeze, hold and release with you, and the programme gets harder each week as you move from lying down to walking.</p>
<div class="cards3"><div class="c"><b>1. Safety check</b><p>Four questions decide your starting track. If your pelvic floor sounds tense, you start on the Relax track instead of squeezing harder.</p></div><div class="c"><b>2. Find the muscle</b><p>A guided check makes sure you are training the pelvic floor, not your bum, belly or thighs.</p></div><div class="c"><b>3. Train and level up</b><p>Daily sessions with a live animated coach, XP, streaks with a weekly rest-day shield, and a boss challenge every week.</p></div></div></section>
<section id="programme"><h2>What is in the 28-day programme?</h2><p class="answer">Each week adds a harder position and new exercises. Week 1 is lying down, week 2 seated, week 3 standing and week 4 walking. Every session mixes strength holds, quick flicks, control work and reverse kegels for a full release.</p>
<div class="weeks4">${PORDER.map((p,i)=>`<div class="wkc">${i===0?`<span class="vbox"><video class="wvid" src="/assets/video/bridge.mp4?v=${V}" poster="/assets/img/pos-bridge.webp" autoplay muted loop playsinline preload="metadata" aria-label="Hologram figure lying down and lifting into a bridge"></video></span>`:`<img src="/assets/img/pos-${p}.webp" width="1448" height="1086" alt="Hologram figure ${POSN[p].toLowerCase()}" loading="lazy">`}<b>Week ${i+1}: ${POSN[p]}</b><span>${DAYPLAN.strength[i].map(id=>EX[id].n).filter((v,j,a)=>a.indexOf(v)===j).join(', ')}</span></div>`).join('')}</div></section>
<section><h2>Which kegel exercises are included?</h2><p class="answer">Twelve exercises cover every part of pelvic floor training: finding the muscle, strength, speed, stamina, control and release, plus three bonus moves that add a kegel to a bridge, a plank and a slow knee drive.</p>
<div class="exgrid">${Object.keys(EX).map(id=>`<a class="exc" href="/exercises/${EXMETA[id].slug}.html"><span class="ico ${EX[id].rel?'c':''}">${icon(EX[id].ic)}</span><span><b>${EX[id].n}</b><small>${EXMETA[id].sets}</small></span></a>`).join('')}</div></section>
<section><h2>Why train your pelvic floor?</h2><p class="answer">Your pelvic floor is a group of muscles like any other: it can be trained for strength, speed, stamina, control and the ability to relax. Kegzo gives that training a clear structure, a coach to follow and numbers that show your progress.</p>
<div class="note"><b>Currently free.</b> No subscription, no paywall and no trial that turns into a charge. Just open the app and train.</div></section>
<section><h2>How is Kegzo different from typical kegel apps?</h2>
<div class="scroll"><table class="cmp"><thead><tr><th>Feature</th><th>Typical kegel apps</th><th>Kegzo</th></tr></thead><tbody>
${[['Safety check before you start','Rarely','Yes, with a Relax track'],['Reverse kegels in every session','Often missing','Yes'],['Real progress tests','Session counts','Weekly max hold, flicks and relax score'],['Start training straight away','Often a long quiz first','Yes'],['Your training stays on your device','Varies','Yes'],['Live animated coach','Timers and sounds','Moving figure and inside view']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><b>${r[2]}</b></td></tr>`).join('')}
</tbody></table></div></section>
${faqHTML(HF)}${cta('Start Day 1 now')}`;
 w('index.html',page({url:'/',title:'Kegzo: Kegel Exercises for Men, Built Like a Game',desc:'A 28-day kegel programme for men with a live animated coach, levels, streaks and real progress tests. Currently free. Start on any phone, no download.',body,schema:[faqSchema(HF),{'@type':'WebApplication',name:'Kegzo Trainer',url:SITE+'/app.html',applicationCategory:'HealthApplication',operatingSystem:'Any (web browser)',isAccessibleForFree:true}]}));pages.push(['/','1.0'])}

/* ---------- exercises ---------- */
{const ids=Object.keys(EX);
 for(const id of ids){const e=EX[id],m=EXMETA[id],pos=e.pos||PORDER[Math.max(0,(e.wk||1)-1)],u=`/exercises/${m.slug}.html`;
  const weekTxt=e.wk?`It unlocks in week ${e.wk} of the programme and is first practised ${POSN[pos].toLowerCase()}.`:`It is a bonus exercise you can try any time, practised ${POSN[pos].toLowerCase()}.`;
  const rel=ids.filter(x=>x!==id).slice(0,4);
  const body=`<article class="art"><p class="eyebrow">${e.type} · ${esc(m.sets)}</p><h1>${e.n}: how to do it</h1>
<p class="lead answer">${m.why}</p>
<figure class="exfig">${VID[pos]?`<span class="vbox${pos==='climber'?' wide':''}"><video class="xvid" src="/assets/video/${VID[pos]}.mp4?v=${V}" poster="/assets/img/pos-${pos}.webp" autoplay muted loop playsinline preload="metadata" aria-label="Hologram figure, ${POSN[pos].toLowerCase()}, looping"></video></span>`:`<img src="/assets/img/pos-${pos}.webp" width="1448" height="1086" alt="Hologram figure ${POSN[pos].toLowerCase()}, the position for ${e.n.toLowerCase()}" loading="lazy">`}<figcaption>${POSN[pos]}: ${esc(m.sets)}</figcaption></figure>
${cta('Try '+e.n+' with the coach','/app.html#ex-'+m.slug)}
<h2>How do you do ${e.n.toLowerCase()}?</h2><ol>${e.how.map(s=>`<li>${s}</li>`).join('')}</ol>
<h2>What should you feel?</h2><p>${e.feel}</p>
<h2>What should you avoid?</h2><ul>${e.avoid.map(a=>`<li>${a}</li>`).join('')}</ul>
<div class="note"><b>Coach tip:</b> ${e.tip}</div>
<h2>When does it appear in the programme?</h2><p>${weekTxt} Sets: ${esc(m.sets)}.</p>
${faqHTML(m.faq)}
<h2>Related exercises</h2><div class="exgrid">${rel.map(x=>`<a class="exc" href="/exercises/${EXMETA[x].slug}.html"><span class="ico ${EX[x].rel?'c':''}">${icon(EX[x].ic)}</span><span><b>${EX[x].n}</b><small>${EXMETA[x].sets}</small></span></a>`).join('')}</div></article>`;
  const howto={'@type':'HowTo',name:'How to do '+e.n,description:m.short,step:e.how.map((s,i)=>({'@type':'HowToStep',position:i+1,text:strip(s)}))};
  w(u.slice(1),page({url:u,title:`${e.n}: How to Do This Kegel Exercise | Kegzo`,desc:`${m.short} Step-by-step guide, what to feel, mistakes to avoid and how it fits the 28-day programme.`,body,crumb:[['Home','/'],['Exercises','/exercises/'],[e.n,u]],schema:[howto,faqSchema(m.faq)]}));pages.push([u,'0.8'])}
 const body=`<h1>Kegel exercises for men</h1><p class="lead answer">These ten kegel exercises train every part of the pelvic floor: finding the muscle, strength, speed, stamina, control and release. In the Kegzo programme they unlock week by week, from lying down to walking.</p>
${[1,2,3,4,0].map(wk=>{const list=ids.filter(id=>(EX[id].wk||0)===wk);return list.length?`<h2>${wk?`Week ${wk}: ${POSN[PORDER[wk-1]]}`:'Bonus'}</h2><div class="exgrid">${list.map(id=>`<a class="exc" href="/exercises/${EXMETA[id].slug}.html"><span class="ico ${EX[id].rel?'c':''}">${icon(EX[id].ic)}</span><span><b>${EX[id].n}</b><small>${EXMETA[id].short}</small></span></a>`).join('')}</div>`:''}).join('')}${cta()}`;
 w('exercises/index.html',page({url:'/exercises/',title:'Kegel Exercises for Men: All 10 Exercises | Kegzo',desc:'Every kegel exercise in the Kegzo programme, from finding the muscle to walking holds, with step-by-step guides.',body,crumb:[['Home','/'],['Exercises','/exercises/']]}));pages.push(['/exercises/','0.9'])}

/* ---------- guides ---------- */
for(const g of GUIDES){const u=`/guides/${g.slug}.html`;
 const body=`<article class="art"><p class="eyebrow">Guide</p><h1>${esc(g.h1)}</h1><p class="lead answer">${g.answer}</p>
${g.sections.map(([h,c])=>`<h2>${h}</h2>${c}`).join('')}
${cta()}${faqHTML(g.faq)}
<h2>Keep reading</h2><div class="links">${g.related.map(s=>{const r=GUIDES.find(x=>x.slug===s);return`<a class="lk" href="/guides/${s}.html">${esc(r.h1)}</a>`}).join('')}</div></article>`;
 w(u.slice(1),page({url:u,title:g.title+' | Kegzo',desc:g.desc,body,crumb:[['Home','/'],['Guides','/guides/'],[g.h1.split(':')[0],u]],schema:[{'@type':'Article',headline:g.h1,description:g.desc,author:{'@id':SITE+'/#org'},publisher:{'@id':SITE+'/#org'},mainEntityOfPage:SITE+u,image:SITE+'/assets/og.png'},faqSchema(g.faq)]}));pages.push([u,'0.8'])}
w('guides/index.html',page({url:'/guides/',title:'Kegel Guides for Men: Plain-English Answers | Kegzo',desc:'Short, plain-English guides to kegel exercises for men: technique, timelines, mistakes, reverse kegels and what the research says.',crumb:[['Home','/'],['Guides','/guides/']],
 body:`<h1>Kegel guides for men</h1><p class="lead answer">Plain-English answers to the questions men ask most about kegel exercises: how to find the right muscle, how long training takes, the common mistakes, reverse kegels and the positions to train in.</p><div class="links">${GUIDES.map(g=>`<a class="lk" href="/guides/${g.slug}.html"><span>${esc(g.h1)}<small>${esc(g.desc)}</small></span></a>`).join('')}</div>${cta()}`}));pages.push(['/guides/','0.9']);

/* ---------- static pages ---------- */
const S=(u,t,d,b,crumbName)=>{w(u.slice(1),page({url:u,title:t,desc:d,body:b,crumb:[['Home','/'],[crumbName,u]]}));pages.push([u,'0.4'])};
S('/about.html','About Kegzo','Why Kegzo exists and the principles behind the kegel training game.',`<article class="art"><h1>About Kegzo</h1><p class="lead answer">Kegzo is a kegel training game for men. It turns pelvic floor exercises into short daily sessions with a live animated coach, levels and real progress tests, and it is currently free to use.</p>
<h2>Why we built it</h2><p>Most kegel apps for men lock their programmes behind subscriptions, skip the release half of training and never ask whether squeezing is right for you in the first place. We wanted something honest, simple and genuinely useful.</p>
<h2>What we believe</h2><ul><li><b>Safety first.</b> A short safety check comes before any squeezing, and tense users start with relaxation.</li><li><b>Release matters.</b> Reverse kegels are in every session.</li><li><b>Measure what matters.</b> Weekly tests track hold time, speed and relaxation, not just sessions.</li><li><b>Your data stays yours.</b> Training is stored on your device.</li><li><b>No promises.</b> We explain the research and never promise medical results.</li></ul>
<h2>Important</h2><p>Kegzo provides general fitness information, not medical advice. It does not diagnose or treat any condition. If you have pain or ongoing symptoms, speak to a GP or pelvic floor physiotherapist.</p></article>`,'About');
S('/how-we-write.html','How We Write and Check Our Guides | Kegzo','How Kegzo researches, writes and checks its kegel guides and exercise instructions.',`<article class="art"><h1>How we write and check our guides</h1><p class="lead answer">Every Kegzo guide is written in plain English, based on published research and recognised physiotherapy practice, and checked so it never promises results we cannot back up. Kegzo is the publisher of all content on this site.</p>
<h2>Our sources</h2><p>We draw on peer-reviewed research, and on widely used pelvic floor physiotherapy guidance. Where we refer to a study, we link to it.</p>
<h2>Our rules</h2><ul><li>Answer the question first, in plain words.</li><li>Describe what exercises train, never promise what they will cure.</li><li>Always include when to stop and when to see a professional.</li><li>Never name or copy other apps.</li><li>Correct mistakes quickly when we find them.</li></ul>
<h2>Spotted something wrong?</h2><p>Please <a href="/contact.html">tell us through the contact form</a>.</p></article>`,'How we write');
S('/privacy.html','Privacy Policy | Kegzo','What Kegzo stores, what it does not, and how to delete your data.',`<article class="art"><h1>Privacy policy</h1><p class="lead answer">Your training stays on your device. Kegzo stores your sessions, tests and settings in your own browser, sets no tracking or advertising cookies and shows no ads. If you sign up, we store your email address so your progress can follow you and we can send you a sign-in link.</p>
<h2>What stays on your device</h2><p>Sessions, test results, levels, streaks and settings are saved in your browser's local storage. We cannot see them. Use <b>Me, Delete everything</b> in the app to remove them at any time.</p>
<h2>What we store on our server</h2><ul><li><b>Your email address</b>, if you sign up, with the date and whether you confirmed it. We use it to send sign-in links and occasional Kegzo updates. Every update email includes a way to unsubscribe.</li><li><b>Contact form messages</b>, with the name and email you give, so we can reply. We keep them for up to 12 months.</li><li><b>Anonymous usage counts</b>, such as how many sessions were started each day. These contain no personal data, no IP address and no identifier.</li></ul>
<h2>What we do not do</h2><ul><li>No advertising, no ad networks and no tracking cookies.</li><li>No selling or sharing of your data.</li><li>No third-party fonts or scripts: everything loads from this site.</li></ul>
<h2>Your rights</h2><p>You can ask us to access, correct or delete the email address we hold. Use the <a href="/contact.html">contact form</a> and we will respond within 30 days.</p>
<h2>Age</h2><p>Kegzo is for adults aged 18 and over.</p></article>`,'Privacy');
S('/terms.html','Terms of Use | Kegzo','The terms for using Kegzo, a kegel training game for men.',`<article class="art"><h1>Terms of use</h1><p class="lead answer">Kegzo is a training game that provides general fitness information, not medical advice. By using it you agree to train sensibly, stop if anything hurts, and speak to a qualified professional about any health concern.</p>
<h2>Not medical advice</h2><p>Kegzo does not diagnose, treat or prevent any condition. Nothing on this site replaces advice from a doctor or physiotherapist. If you have pain, recent surgery or ongoing symptoms, get professional advice before starting.</p>
<h2>Using Kegzo</h2><ul><li>You must be 18 or over.</li><li>Stop any exercise that causes pain or discomfort.</li><li>Kegzo is currently free. Features may change over time.</li><li>Don't misuse the service, for example by sending automated sign-ups or messages.</li></ul>
<h2>No guarantees</h2><p>We work hard to keep Kegzo accurate and available, but we provide it as it is, without guarantees of results or uninterrupted access.</p>
<h2>Changes</h2><p>We may update these terms. The current version is always on this page.</p><p>Questions? Use the <a href="/contact.html">contact form</a>.</p></article>`,'Terms');
S('/contact.html','Contact Kegzo','Send a message to the Kegzo team.',`<article class="art"><h1>Contact us</h1><p class="lead answer">Questions, feedback or a correction to suggest? Send us a message using the form below and we will reply by email, usually within a few working days.</p>
<p class="note" id="sentMsg" hidden><b>Thanks, your message has been sent.</b> We'll reply by email.</p>
<form class="form" method="post" action="/api/contact.php"><label for="cn">Your name</label><input id="cn" name="name" autocomplete="name" required maxlength="100">
<label for="ce">Your email</label><input id="ce" name="email" type="email" autocomplete="email" required maxlength="200">
<label for="cm">Message</label><textarea id="cm" name="message" rows="6" required maxlength="4000"></textarea>
<input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true"><input type="hidden" name="t" id="ct" value="">
<button class="btn hot" type="submit">Send message</button><p class="tiny mut">We use your details only to reply. See our <a href="/privacy.html">privacy policy</a>.</p></form>
<script>{document.getElementById('ct').value=Date.now();if(/[?&]sent=1/.test(location.search))document.getElementById('sentMsg').hidden=false;if(/[?&]error=/.test(location.search)){const m=document.getElementById('sentMsg');m.hidden=false;m.innerHTML='<b>Sorry, your message could not be sent.</b> Please check the form and try again.'}}</script></article>`,'Contact');
w('404.html',`<!DOCTYPE html><html lang="en"><head>${head({title:'Page not found | Kegzo',desc:'This page could not be found.',url:'/404.html',robots:'noindex'})}<link rel="stylesheet" href="/assets/site.css?v=${V}"></head><body>${NAV}<main class="wrap"><article class="art"><h1>Page not found</h1><p class="lead">That page doesn't exist or has moved.</p>${cta('Go to the trainer')}<p><a href="/">Home</a> · <a href="/exercises/">Exercises</a> · <a href="/guides/">Guides</a></p></article></main>${FOOT}</body></html>`);

/* ---------- css ---------- */
w('assets/site.css',FONTS+`
:root{color-scheme:dark;--bg:#14112A;--surf:#1F1A3D;--surf2:#2A2450;--ink:#F4F1FF;--mut:#B6AFD8;--line:#383163;--hot:#FF6B4A;--hotInk:#2A0E07;--cool:#5BD6C9;--coolSoft:#1D3B47;--hotSoft:#46283A}
*{box-sizing:border-box;min-width:0}html{-webkit-text-size-adjust:100%;scroll-padding-top:76px}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.65 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;overflow-x:clip}
@supports not (overflow-x:clip){body{overflow-x:hidden}}
a{color:var(--cool)}img{max-width:100%;height:auto;display:block}
h1,h2,h3{font-family:Outfit,Inter,system-ui,sans-serif;line-height:1.1;text-wrap:balance}
h1{font-size:clamp(32px,7vw,52px);margin:.3em 0 .35em}h2{font-size:clamp(23px,4.6vw,30px);margin:1.6em 0 .5em}h3{font-size:19px}
.wrap{max-width:1120px;margin:0 auto;padding:0 max(18px,env(safe-area-inset-left))}
.top{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.topin{display:flex;align-items:center;gap:12px;min-height:62px}
.brand{display:flex;align-items:center;gap:9px;font:700 22px Outfit,sans-serif;color:var(--ink);text-decoration:none;margin-right:auto}.brand svg{width:32px;height:32px}
#nav{display:flex;align-items:center;gap:22px}#nav a{color:var(--ink);text-decoration:none;font-weight:500}#nav a.btn{color:var(--hotInk)}
.menu{display:none;width:46px;height:46px;border:1px solid var(--line);border-radius:12px;background:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer}
.menu span{width:20px;height:2px;background:var(--ink);border-radius:2px}
@media (max-width:760px){.menu{display:flex}#nav{display:none;position:absolute;left:0;right:0;top:62px;flex-direction:column;align-items:stretch;gap:0;background:var(--surf);border-bottom:1px solid var(--line);padding:8px 18px 16px}#nav.open{display:flex}#nav a{padding:14px 4px;border-bottom:1px solid var(--line)}#nav a.btn{margin-top:12px;border:0}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:0 22px;border-radius:999px;font-weight:600;font-size:16px;text-decoration:none;background:var(--surf2);color:var(--ink);border:0;cursor:pointer;font-family:inherit}
.btn.hot{background:var(--hot);color:var(--hotInk)}.btn.ghost{background:transparent;border:1px solid var(--line);color:var(--ink)}.btn.sm{min-height:42px;padding:0 16px;font-size:15px}
:focus-visible{outline:3px solid var(--cool);outline-offset:2px;border-radius:8px}
.eyebrow{font-size:14px;font-weight:600;color:var(--hot);margin:28px 0 0}.lead{font-size:clamp(18px,2.4vw,20px);color:#E6E1FF}.mut{color:var(--mut)}.tiny{font-size:14px}
.ctar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:22px 0}
.hero{display:grid;gap:10px;align-items:center;padding:6px 0 10px}
.hfig{position:relative;border-radius:24px;overflow:hidden;background:#100C28;border:1px solid var(--line)}
.vbox{display:block;position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:#12012B}@supports not (aspect-ratio:1){.vbox{height:0;padding-top:75%}}.vbox.wide{aspect-ratio:2/1}@supports not (aspect-ratio:1){.vbox.wide{padding-top:50%}}.vbox video{position:absolute;top:0;left:0;width:100%;height:100%;max-height:none;object-fit:cover;object-position:50% 58%;display:block}
.pulse{position:absolute;left:33%;top:56%;width:20%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(61,220,132,.8),rgba(61,220,132,0) 68%);mix-blend-mode:screen;animation:pul 4s ease-in-out infinite}
@keyframes pul{0%,100%{opacity:.25;transform:translate(-50%,-50%) scale(.75)}45%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}}
.cards3{display:grid;gap:12px}.c{background:var(--surf);border:1px solid var(--line);border-radius:18px;padding:18px}.c p{margin:.4em 0 0;color:var(--mut);font-size:16px}
.weeks4{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.wkc{background:var(--surf);border:1px solid var(--line);border-radius:18px;overflow:hidden;font-size:15px}.wkc img{background:#100C28}.wkc b,.wkc span{display:block;padding:0 14px}.wkc b{padding-top:12px}.wkc span{color:var(--mut);padding-bottom:14px;font-size:14px}
.exgrid{display:grid;gap:10px}.exc{display:grid;grid-template-columns:46px 1fr;gap:12px;align-items:center;padding:12px 14px;border-radius:16px;background:var(--surf);border:1px solid var(--line);color:var(--ink);text-decoration:none}
.exc b{display:block}.exc small{color:var(--mut);font-size:14px;line-height:1.4;display:block}
.ico{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;background:var(--hotSoft);color:var(--hot)}.ico.c{background:var(--coolSoft);color:var(--cool)}.ico svg{width:26px;height:26px}
.note{padding:14px 16px;border-radius:14px;background:var(--coolSoft);font-size:16px;margin:18px 0}
.scroll{overflow-x:auto}.cmp{width:100%;border-collapse:collapse;font-size:15px;min-width:520px}.cmp th,.cmp td{text-align:left;padding:12px 10px;border-bottom:1px solid var(--line);vertical-align:top}.cmp th{color:var(--mut);font-weight:600}
.faq details{background:var(--surf);border:1px solid var(--line);border-radius:14px;padding:4px 16px;margin:8px 0}.faq summary{cursor:pointer;font-weight:600;padding:12px 0;min-height:44px}.faq details p{margin:0 0 14px;color:#DCD6F7}
.art{max-width:760px}.art li{margin:.35em 0}.art ol,.art ul{padding-left:1.3em}
.exfig{margin:18px 0;border-radius:20px;overflow:hidden;border:1px solid var(--line);background:#100C28}.exfig figcaption{padding:10px 14px;font-size:14px;color:var(--mut)}
.links{display:grid;gap:8px}.lk{display:block;padding:14px 16px;border-radius:14px;background:var(--surf);border:1px solid var(--line);color:var(--ink);text-decoration:none;font-weight:600}.lk small{display:block;color:var(--mut);font-weight:400;font-size:14px;margin-top:2px}
.bc{display:flex;flex-wrap:wrap;gap:8px;font-size:14px;color:var(--mut);margin-top:18px}.bc a{color:var(--mut)}
.form{display:grid;gap:8px;max-width:560px}.form input,.form textarea{width:100%;font:16px Inter,sans-serif;color:var(--ink);background:var(--surf);border:1px solid var(--line);border-radius:12px;padding:13px 14px}.form label{font-weight:600;font-size:15px;margin-top:6px}.form .btn{margin-top:10px;justify-self:start}.hp{position:absolute;left:-9999px}
.foot{margin-top:56px;border-top:1px solid var(--line);padding:32px 0 calc(28px + env(safe-area-inset-bottom));font-size:15px}
.fcols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.fcols a{display:block;color:var(--mut);text-decoration:none;padding:5px 0}.fcols .fh{margin:0 0 4px;font-weight:700}.fcols .fh a{color:var(--ink);padding:0}
.fdisc{color:var(--mut);font-size:13px;margin-top:20px}
@media (min-width:760px){.hero{grid-template-columns:1.05fr 1fr;gap:34px;padding:24px 0}.cards3{grid-template-columns:repeat(3,minmax(0,1fr))}.weeks4{grid-template-columns:repeat(4,minmax(0,1fr))}.exgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.fcols{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
@media print{.top,.foot,.ctar{display:none}}
`);

/* ---------- sitemap, robots, manifest, sw, indexnow ---------- */
w('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([u,p])=>`<url><loc>${SITE}${u}</loc><priority>${p}</priority></url>`).join('\n')}\n</urlset>\n`);
w('robots.txt',`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /src/\nDisallow: /tools/\n\nUser-agent: OAI-SearchBot\nAllow: /\nUser-agent: ChatGPT-User\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Claude-SearchBot\nAllow: /\nUser-agent: Bingbot\nAllow: /\nUser-agent: Googlebot\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
w('manifest.webmanifest',JSON.stringify({name:'Kegzo: Kegel Training Game',short_name:'Kegzo',start_url:'/app.html',scope:'/',display:'standalone',background_color:'#14112A',theme_color:'#14112A',description:'A 28-day kegel training programme for men, built like a game.',icons:[{src:'/assets/icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/assets/icons/icon-512.png',sizes:'512x512',type:'image/png'},{src:'/assets/icons/icon-512-maskable.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,1));
w('sw.js',`/* Kegzo service worker v${V}: network-first for pages, cache-first for assets */
const C='kegzo-v${V}',CORE=['/app.html','/assets/img/pos-lying.webp','/assets/img/pos-seated.webp','/assets/img/pos-standing.webp','/assets/img/pos-walking.webp','/assets/fonts/inter-400.woff2?v=${V}','/assets/fonts/outfit-700.woff2?v=${V}'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;
 if(r.mode==='navigate'||r.destination==='document'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('/app.html'))));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))});
`);
w(INDEXNOW+'.txt',INDEXNOW);
console.log('built',pages.length,'indexable pages');
fs.writeFileSync(path.join(ROOT,'tools','.pages.json'),JSON.stringify(pages));
