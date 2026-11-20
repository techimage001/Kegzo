/* Kegzo service worker v3: network-first for pages, cache-first for assets */
const C='kegzo-v3',CORE=['/app.html','/assets/img/pos-lying.webp','/assets/img/pos-seated.webp','/assets/img/pos-standing.webp','/assets/img/pos-walking.webp','/assets/fonts/inter-400.woff2?v=3','/assets/fonts/outfit-700.woff2?v=3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;
 if(r.mode==='navigate'||r.destination==='document'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('/app.html'))));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))});
