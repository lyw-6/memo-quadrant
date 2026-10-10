/* 备忘录四象限 Service Worker：cache-first 单文件缓存，版本号递增即换新 */
const C='memo-v1';
const CORE=['./备忘录四象限.html'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      if(resp&&resp.ok){const cl=resp.clone();caches.open(C).then(c=>c.put(e.request,cl)).catch(()=>{});}
      return resp;
    }).catch(()=>caches.match(CORE[0])))
  );
});
