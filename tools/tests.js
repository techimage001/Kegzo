/* Kegzo QA: node tools/tests.js  (run after build) */
const fs=require('fs'),path=require('path');const ROOT=path.resolve(__dirname,'..');
let fail=0,checks=0;const bad=(m)=>{fail++;console.log('FAIL',m)};const ok=(c,m)=>{checks++;if(!c)bad(m)};
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);if(['node_modules','.git','src','tools'].includes(e.name))return[];return e.isDirectory()?walk(p):[p]});
const files=walk(ROOT),html=files.filter(f=>f.endsWith('.html'));
const rel=f=>'/'+path.relative(ROOT,f).replace(/\\/g,'/');
const BANNED=[/—/,/free forever/i,/for life/i,/no sign-?up/i,/no account needed/i,/without an account/i,/Kegel Men\b/,/Dr\.? Kegel/,/Stamena/,/kegelmen/i,/adsbygoogle|pub-\d{10,}/,/Regori/i,/Glenrothes|Scotland/i];
const textFiles=files.filter(f=>/\.(html|js|css|php|xml|txt|webmanifest)$/.test(f)&&!/LICENSE/.test(f));
for(const f of textFiles){const s=fs.readFileSync(f,'utf8');for(const b of BANNED)ok(!b.test(s),`${rel(f)} contains banned pattern ${b}`)}
/* v57: writer articles live only on the server (git-ignored). Links to the keepers named in src/redirects.js are allowed; they were checked live when the map was made. */
const {MOVED,RETIRE,BROKEN}=require(path.join(ROOT,'src','redirects.js'));const {DEEP}=require(path.join(ROOT,'src','exercise-deep.js'));const DEEPG=Object.values(DEEP).flatMap(d=>[...(d.guides||[]).map(g=>g[0]),...[...(d.sections||[]).map(x=>x[1]).join(' ').matchAll(/href="(\/guides\/[^"]+)"/g)].map(m=>m[1])]);const SERVER_ONLY=new Set([...DEEPG,...Object.values(MOVED),...Object.values(RETIRE),...Object.values(BROKEN)].filter(u=>/^\/guides\/[^/]+\/$/.test(u)));
const titles={},descs={};
for(const f of html){const s=fs.readFileSync(f,'utf8'),r=rel(f);
 ok(/<meta name="viewport" content="width=device-width/.test(s),r+' viewport');
 const t=(s.match(/<title>([^<]+)<\/title>/)||[])[1];ok(t,r+' title');if(t){ok(!titles[t],r+' duplicate title '+t);titles[t]=r}
 const d=(s.match(/<meta name="description" content="([^"]+)"/)||[])[1];ok(d,r+' description');if(d&&r!=='/404.html'){ok(!descs[d],r+' duplicate description');descs[d]=r}
 ok(/<link rel="canonical"/.test(s),r+' canonical');
 ok(/rel="icon" href="\/favicon.ico"/.test(s),r+' favicon');
 const vers=new Set([...s.matchAll(/\?v=(\d+)/g)].map(m=>m[1]));ok(vers.size<=1,r+' mixed asset versions '+[...vers]);
 for(const m of s.matchAll(/href="(\/[^"#?]*)/g)){let u=m[1];if(u.startsWith("/api/")||u.includes("${")||SERVER_ONLY.has(u))continue;let p=path.join(ROOT,u);if(u.endsWith('/'))p=fs.existsSync(path.join(p,'index.html'))?path.join(p,'index.html'):path.join(p,'index.php');ok(fs.existsSync(p),`${r} broken link ${u}`)}
 for(const m of s.matchAll(/src="(\/[^"?]+)/g))ok(fs.existsSync(path.join(ROOT,m[1])),`${r} missing asset ${m[1]}`);
 const faqVis=(s.match(/<details>/g)||[]).length,faqLd=(s.match(/"@type":"Question"/g)||[]).length;ok(faqVis===faqLd,`${r} FAQ schema ${faqLd} vs visible ${faqVis}`);
 if(r!=='/app.html'&&r!=='/404.html'){if(r!=='/welcome.html')ok(/class="lead answer"/.test(s),r+' answer-first block');ok(/General fitness information, not medical advice/.test(s),r+' disclaimer')}
 for(const m of s.matchAll(/<img [^>]*>/g))ok(/alt="[^"]*"/.test(m[0]),r+' img alt')}
const sm=fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8'),locs=[...sm.matchAll(/<loc>https:\/\/kegzo.com([^<]+)<\/loc>/g)].map(m=>m[1]);
const pages=JSON.parse(fs.readFileSync(path.join(__dirname,'.pages.json'),'utf8'));ok(locs.length===pages.length,'sitemap count');
const indexable=html.filter(f=>!/noindex/.test(fs.readFileSync(f,'utf8'))).length;ok(indexable===locs.length,`sitemap ${locs.length} vs indexable ${indexable}`);
for(const u of locs){let p=path.join(ROOT,u);if(u.endsWith('/'))p=fs.existsSync(path.join(p,'index.html'))?path.join(p,'index.html'):path.join(p,'index.php');ok(fs.existsSync(p),'sitemap url exists '+u)}
for(const f of files.filter(f=>f.endsWith('.php')&&!/SECRETS/.test(f))){const s=fs.readFileSync(f,'utf8');ok(!/@[a-z0-9-]+\.(com|co|net)\b/i.test(s.replace(/kegzo\.com/g,'')),rel(f)+' hard-coded email address')}
ok(fs.existsSync(path.join(ROOT,'60ccb4a970104b1b83b9eb9cc6826746.txt')),'indexnow key');
console.log(`${html.length} html files, ${checks} checks, ${fail} failures`);process.exit(fail?1:0);
