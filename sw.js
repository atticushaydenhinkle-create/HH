const C='hhfab-v41',F=['./','jobwalk.js','index.html','manifest.json','version.json','logo.svg','logo-icon.svg','logo.png','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))))});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('hhfab-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);
 const net=q.mode==='navigate'||(u.origin===location.origin&&(/\/(index\.html)?$/.test(u.pathname)||/version\.json$/.test(u.pathname)));
 if(net){e.respondWith(fetch(q,{cache:'no-store'}).then(n=>{if(n.ok&&!/version\.json$/.test(u.pathname)){const cp=n.clone();caches.open(C).then(c=>c.put('index.html',cp))}return n}).catch(()=>caches.match(/version\.json$/.test(u.pathname)?'version.json':'index.html')));return}
 e.respondWith(caches.match(q,{ignoreSearch:true}).then(r=>r||fetch(q).then(n=>{if(n.ok&&u.origin===location.origin){const cp=n.clone();caches.open(C).then(c=>c.put(q,cp))}return n}).catch(()=>caches.match('index.html'))))});
