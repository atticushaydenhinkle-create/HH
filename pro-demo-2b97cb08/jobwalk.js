/* Papa's Shop - Job Walk module. Self-contained, offline, no deps.
   API: JobWalk.mount(el) -> Promise; JobWalk.unmount(); JobWalk.db (helpers); JobWalk.version */
(function(){
'use strict';
var VERSION='1.1.0', DBN='hhproJobWalk';
var CSS=`
.jw{--bg:#0b0d10;--pn:#1d222a;--pn2:#222831;--bd:#2a313c;--tx:#f2f4f7;--mu:#9aa4b2;--am:#ffb020;--am2:#8a5606;--bl:#4da3ff;--rd:#ff5d5d;color:var(--tx);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;padding:10px;box-sizing:border-box;max-width:760px;margin:0 auto}
.jw *{box-sizing:border-box}
.jw h2{font-size:20px;margin:4px 0 10px;color:var(--am)}.jw h3{font-size:16px;margin:14px 0 8px;color:var(--am)}
.jw .card{background:var(--pn);border:1px solid var(--bd);border-radius:12px;padding:12px;margin:8px 0}
.jw .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.jw .grow{flex:1;min-width:0}
.jw button,.jw .btn{background:var(--pn2);color:var(--tx);border:1px solid var(--bd);border-radius:10px;padding:10px 14px;font:inherit;font-weight:600;min-height:44px;cursor:pointer}
.jw button.pri,.jw .btn.pri{background:var(--am);color:#111;border-color:var(--am)}.jw button.dng{color:var(--rd);border-color:#5a2a2a}
.jw button.sm{min-height:36px;padding:6px 10px;font-size:13px}.jw button.on{background:var(--am2);border-color:var(--am)}
.jw input,.jw select,.jw textarea{background:#000;color:var(--tx);border:2px solid var(--bd);border-radius:10px;padding:9px;font:inherit;width:100%;min-height:44px}
.jw label{display:block;font-size:13px;color:var(--mu);margin:6px 0 2px}
.jw .g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.jw .g3{display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px}
.jw .mu{color:var(--mu);font-size:13px}.jw .tag{display:inline-block;background:#2b3442;color:var(--bl);border-radius:20px;padding:2px 9px;font-size:12px;margin:2px}
.jw .st{display:inline-block;border-radius:6px;padding:2px 7px;font-size:12px;font-weight:700;background:#2b3442}
.jw .st-Active{background:#14532d;color:#86efac}.jw .st-Bid{background:#1e3a5f;color:#93c5fd}.jw .st-Hold{background:#713f12;color:#fde68a}.jw .st-Done{background:#333;color:#aaa}
.jw .job{cursor:pointer}.jw .job b{font-size:16px}
.jw .thumbs{display:flex;gap:6px;flex-wrap:wrap}.jw .thumbs .th{position:relative;width:96px}.jw .thumbs img{width:96px;height:96px;object-fit:cover;border-radius:8px;border:1px solid var(--bd);display:block}
.jw .thumbs .mk{position:absolute;top:3px;left:3px;background:var(--am);color:#111;font-size:10px;font-weight:800;border-radius:4px;padding:1px 4px}
.jw table{width:100%;border-collapse:collapse;font-size:13px}.jw td,.jw th{padding:6px 4px;border-bottom:1px solid var(--bd);text-align:left}.jw td.r,.jw th.r{text-align:right}
.jw .tot{font-size:18px;font-weight:800;color:var(--am)}
.jw .note{background:#2a2410;border-left:4px solid var(--am);padding:8px;border-radius:6px;font-size:13px;color:#ffe2a6;margin:6px 0}
.jw .bar{height:8px;background:#000;border-radius:5px;overflow:hidden}.jw .bar i{display:block;height:100%;background:var(--am)}
.jw-ov{position:fixed;inset:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg,#0b0d10);z-index:9000;display:flex;flex-direction:column;color:#f2f4f7}
.jw-ov .tb{display:flex;gap:5px;padding:6px;overflow-x:auto;background:#1d222a;border-bottom:1px solid #2a313c;flex-wrap:nowrap}
.jw-ov .tb button{flex:0 0 auto}
.jw-ov>.tb:first-child{padding-top:max(10px,calc(env(safe-area-inset-top) + 8px))}
.jw-ov .tb{padding-left:max(6px,env(safe-area-inset-left));padding-right:max(6px,env(safe-area-inset-right));-webkit-overflow-scrolling:touch}
.jw-ov .tb.wrap{flex-wrap:wrap;overflow-x:visible}
.jw-ov>:last-child{padding-bottom:max(6px,env(safe-area-inset-bottom))}
.jw-ov .cw:last-child{padding-bottom:env(safe-area-inset-bottom)}
.jw-ov>.jw-report:last-child{padding-bottom:max(16px,env(safe-area-inset-bottom))}
.jw-ov .cw{flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#000;position:relative}
.jw-ov canvas{touch-action:none;max-width:100%;max-height:100%;display:block}
.jw-ov .sw{width:32px;height:32px;border-radius:50%;border:3px solid #333;min-height:0;padding:0}.jw-ov .sw.on{border-color:#fff}
.jw-ov .hint{position:absolute;bottom:6px;left:6px;right:6px;text-align:center;font-size:12px;color:#ffe2a6;background:rgba(0,0,0,.6);border-radius:6px;padding:4px;pointer-events:none}
.jw-md{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9500;display:flex;align-items:center;justify-content:center;padding:max(16px,calc(env(safe-area-inset-top) + 8px)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}
.jw-md .card{width:100%;max-width:420px;max-height:calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 32px);overflow:auto}
.jw-report{background:#fff;color:#111;font-family:system-ui,sans-serif;padding:16px;overflow:auto;flex:1}
.jw-report h1{font-size:22px;margin:0 0 4px}.jw-report h2{font-size:17px;border-bottom:2px solid #ffb020;padding-bottom:3px;margin:18px 0 8px}
.jw-report table{width:100%;border-collapse:collapse;font-size:13px}.jw-report td,.jw-report th{border:1px solid #ccc;padding:4px 6px;text-align:left}.jw-report .r{text-align:right}
.jw-report img{max-width:100%;max-height:420px;border:1px solid #ccc;border-radius:4px;margin:4px 0;page-break-inside:avoid}
.jw-report .ent{page-break-inside:avoid;margin-bottom:12px}
@media print{body.jw-printing>*:not(.jw-ov){display:none!important}body.jw-printing .jw-ov{position:static;display:block}body.jw-printing .jw-ov .tb{display:none}body.jw-printing .jw-report{overflow:visible}}
`;
// ---------- utils ----------
function $(s,r){return (r||document).querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function num(v){var n=parseFloat(String(v).replace(/[$,]/g,''));return isFinite(n)?n:0}
function dec(n,d){if(d==null)d=2;var s=(+n).toFixed(d).replace(/\.?0+$/,'');return s.replace(/^(-?)0\./,'$1.')||'0'}
function money(n){var neg=n<0;n=Math.abs(n);var s=n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');return (neg?'-$':'$')+s}
function bytes(b){if(b<1024)return b+' B';if(b<1048576)return dec(b/1024,1)+' KB';if(b<1073741824)return dec(b/1048576,1)+' MB';return dec(b/1073741824,2)+' GB'}
function dt(t){var d=new Date(t);return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})+' '+d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}
function dOnly(s){if(!s)return '';var d=new Date(s+'T12:00:00');return isNaN(d)?s:d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function fracIn(inches){ // 36.5 -> 36 1/2"
  var neg=inches<0;inches=Math.abs(inches);var s=Math.round(inches*16),w=Math.floor(s/16),f=s%16,den=16;
  while(f&&f%2===0){f/=2;den/=2}
  var fs=f?f+'/'+den:'';var out;
  if(w>=48){var ft=Math.floor(w/12),i=w%12;out=ft+"' "+i+(fs?' '+fs:'')+'"'}
  else out=(w?w:'')+(w&&fs?' ':'')+(fs||(!w?'0':''))+'"';
  return (neg?'-':'')+out}
function parseLen(s){ // returns inches from 36 1/2, 3' 4", 3.5ft, 900mm
  s=String(s||'').trim().toLowerCase();if(!s)return NaN;
  var m=s.match(/^([\d.]+)\s*(mm|cm|m)$/);if(m){var v=+m[1];return m[2]==='mm'?v/25.4:m[2]==='cm'?v/2.54:v/.0254}
  var ft=0,inch=0,mf=s.match(/([\d.]+)\s*(?:'|ft|feet)/);if(mf){ft=+mf[1];s=s.replace(mf[0],' ')}
  s=s.replace(/"|in(ches)?/g,' ').trim();
  if(s){var p=s.split(/[\s-]+/).filter(Boolean);p.forEach(function(x){if(x.indexOf('/')>0){var q=x.split('/');inch+=(+q[0])/(+q[1])}else inch+=+x})}
  var r=ft*12+inch;return isFinite(r)?r:NaN}
function blobToDataURL(b){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result)};r.onerror=rej;r.readAsDataURL(b)})}
function dataURLToBlob(u){var p=u.split(','),mime=(p[0].match(/:(.*?);/)||[])[1]||'image/jpeg',bin=atob(p[1]),a=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)a[i]=bin.charCodeAt(i);return new Blob([a],{type:mime})}
function loadImg(blob){return new Promise(function(res,rej){var u=URL.createObjectURL(blob),i=new Image();i.onload=function(){res(i)};i.onerror=function(){URL.revokeObjectURL(u);rej(new Error('Could not read image'))};i.src=u})}
function downscale(file,max){max=max||2000;return loadImg(file).then(function(img){
  var w=img.naturalWidth,h=img.naturalHeight,k=Math.min(1,max/Math.max(w,h));var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(img.src);
  return new Promise(function(res){c.toBlob(function(b){res({blob:b,w:c.width,h:c.height})},'image/jpeg',.85)})})}
function download(blob,name){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000)}
var urls=[];function ourl(b){var u=URL.createObjectURL(b);urls.push(u);return u}
function freeUrls(){urls.forEach(function(u){URL.revokeObjectURL(u)});urls=[]}

// ---------- DB ----------
var dbp=null,XSTORES=['crew','labor','mats'],ALLS=['jobs','entries','costs','photos','crew','labor','mats'];
function open(){if(dbp)return dbp;dbp=new Promise(function(res,rej){var r=indexedDB.open(DBN,2);
  r.onupgradeneeded=function(ev){var d=r.result,ov=ev.oldVersion||0;
    if(ov<1){d.createObjectStore('jobs',{keyPath:'id'});
      ['entries','costs','photos'].forEach(function(n){var s=d.createObjectStore(n,{keyPath:'id'});s.createIndex('jobId','jobId')});
      r.transaction.objectStore('photos').createIndex('entryId','entryId')}
    // v2: crew roster, labor entries, materials (existing stores/data untouched)
    XSTORES.forEach(function(n){if(!d.objectStoreNames.contains(n)){var s=d.createObjectStore(n,{keyPath:'id'});s.createIndex('jobId','jobId')}})};
  r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}});return dbp}
function tx(store,mode,fn){return open().then(function(d){return new Promise(function(res,rej){var t=d.transaction(store,mode),s=t.objectStore(store),out;var rq=fn(s);if(rq)rq.onsuccess=function(){out=rq.result};t.oncomplete=function(){res(out)};t.onerror=t.onabort=function(){rej(t.error)}})})}
var db={
  all:function(st){return tx(st,'readonly',function(s){return s.getAll()})},
  get:function(st,id){return tx(st,'readonly',function(s){return s.get(id)})},
  put:function(st,o){return tx(st,'readwrite',function(s){return s.put(o)}).then(function(){return o})},
  del:function(st,id){return tx(st,'readwrite',function(s){return s.delete(id)})},
  by:function(st,idx,v){return tx(st,'readonly',function(s){return s.index(idx).getAll(v)})},
  delJob:function(id){return Promise.all(['entries','costs','photos','crew','labor','mats'].map(function(st){return db.by(st,'jobId',id).then(function(rs){return Promise.all(rs.map(function(r){return db.del(st,r.id)}))})})).then(function(){return db.del('jobs',id)})},
  delEntry:function(id){return db.by('photos','entryId',id).then(function(ps){return Promise.all(ps.map(function(p){return db.del('photos',p.id)}))}).then(function(){return db.del('entries',id)})}
};

// ---------- modal helpers ----------
function modal(html,onBind){return new Promise(function(res){var m=document.createElement('div');m.className='jw jw-md';m.style.cssText='max-width:none;padding:16px';m.innerHTML='<div class="card">'+html+'</div>';document.body.appendChild(m);
  function done(v){m.remove();res(v)}onBind(m,done);m.addEventListener('click',function(e){if(e.target===m)done(null)})})}
function confirmBox(msg,okText){return modal('<p style="margin:0 0 12px">'+esc(msg)+'</p><div class="row"><button class="grow" data-x>Cancel</button><button class="grow dng" data-ok>'+esc(okText||'Delete')+'</button></div>',function(m,done){$('[data-x]',m).onclick=function(){done(false)};$('[data-ok]',m).onclick=function(){done(true)}})}
function ask(title,def,hint){return modal('<b>'+esc(title)+'</b>'+(hint?'<div class="mu">'+esc(hint)+'</div>':'')+'<input data-v style="margin:10px 0" value="'+esc(def||'')+'"><div class="row"><button class="grow" data-x>Cancel</button><button class="grow pri" data-ok>OK</button></div>',function(m,done){var i=$('[data-v]',m);setTimeout(function(){i.focus();i.select()},30);$('[data-x]',m).onclick=function(){done(null)};$('[data-ok]',m).onclick=function(){done(i.value)};i.onkeydown=function(e){if(e.key==='Enter')done(i.value)}})}
function toast(msg){var t=document.createElement('div');t.textContent=msg;t.style.cssText='position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#ffb020;color:#111;font-weight:700;padding:10px 16px;border-radius:10px;z-index:9999;font-family:system-ui;pointer-events:none;max-width:90vw;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.5)';document.body.appendChild(t);setTimeout(function(){t.remove()},2200)}

// ---------- state & routing ----------
var root=null,view={name:'list'},filt={q:'',status:'',group:'none',sort:'date',from:'',to:''};
var STATUSES=['Bid','Active','Hold','Done'],CATS=['labor','material','equipment','sub','other'];
function go(v){view=v;render()}
function render(){if(!root)return;freeUrls();var f={list:vList,job:vJob,jobEdit:vJobEdit,entry:vEntry,bid:vBid}[view.name]||vList;return f().catch(function(e){console.warn(e);root.innerHTML='<div class="card">Error: '+esc(e.message)+'</div>'})}
function city(addr){var p=String(addr||'').split(',').map(function(s){return s.trim()}).filter(Boolean);if(p.length>=3)return p[p.length-2];if(p.length===2)return p[1].replace(/\s+\d{5}.*$/,'');return p[0]||'No address'}
function mapLinks(j){var q=j.lat!=null?j.lat+','+j.lng:j.address;if(!q)return '';q=encodeURIComponent(q);return '<a class="btn sm" style="text-decoration:none;display:inline-flex;align-items:center" target="_blank" rel="noopener" href="https://maps.apple.com/?q='+q+'">Apple Maps</a> <a class="btn sm" style="text-decoration:none;display:inline-flex;align-items:center" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+q+'">Google Maps</a>'}

// ----- list -----
function vList(){return Promise.all([db.all('jobs'),db.all('entries'),db.all('costs'),db.all('labor'),db.all('mats')]).then(function(r){var jobs=r[0],ents=r[1],costs=r[2],labs=r[3]||[],mats=r[4]||[];var byJ=function(a,id){return a.filter(function(x){return x.jobId===id})};
  var q=filt.q.toLowerCase();
  var list=jobs.filter(function(j){if(filt.status&&j.status!==filt.status)return false;var d=j.start||'';if(filt.from&&d<filt.from)return false;if(filt.to&&d>filt.to)return false;
    if(!q)return true;var hay=[j.name,j.client,j.address,j.notes].join(' ').toLowerCase();ents.forEach(function(e){if(e.jobId===j.id)hay+=' '+[e.area,e.notes,(e.tags||[]).join(' ')].join(' ').toLowerCase()});return hay.indexOf(q)>=0});
  list.sort(function(a,b){if(filt.sort==='name')return (a.name||'').localeCompare(b.name||'');if(filt.sort==='loc')return city(a.address).localeCompare(city(b.address));return (b.updated||0)-(a.updated||0)});
  var groups={};list.forEach(function(j){var k=filt.group==='loc'?city(j.address):filt.group==='status'?j.status:filt.group==='month'?(j.start||'No date').slice(0,7):'';(groups[k]=groups[k]||[]).push(j)});
  var h='<div class="row"><h2 class="grow">Job Walk</h2><button class="pri" data-act="newJob">+ New Job</button></div>'+
  '<input data-f="q" placeholder="Search jobs, clients, areas, tags, notes" value="'+esc(filt.q)+'">'+
  '<div class="g2" style="margin-top:6px"><select data-f="status"><option value="">All statuses</option>'+STATUSES.map(function(s){return '<option'+(filt.status===s?' selected':'')+'>'+s+'</option>'}).join('')+'</select>'+
  '<select data-f="group">'+[['none','No grouping'],['loc','Group by location'],['status','Group by status'],['month','Group by month']].map(function(o){return '<option value="'+o[0]+'"'+(filt.group===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select>'+
  '<select data-f="sort">'+[['date','Newest activity'],['name','Job name A-Z'],['loc','Location A-Z']].map(function(o){return '<option value="'+o[0]+'"'+(filt.sort===o[0]?' selected':'')+'>Sort: '+o[1]+'</option>'}).join('')+'</select>'+
  '<div class="row" style="gap:4px"><input type="date" data-f="from" value="'+filt.from+'" title="Start from" style="flex:1;padding:6px"><input type="date" data-f="to" value="'+filt.to+'" title="Start to" style="flex:1;padding:6px"></div></div>';
  if(!jobs.length)h+='<div class="card mu">No jobs yet. Tap <b>+ New Job</b> to start your first job walk.</div>';
  else if(!list.length)h+='<div class="card mu">No jobs match your filters.</div>';
  Object.keys(groups).sort().forEach(function(k){if(k)h+='<h3>'+esc(k)+' <span class="mu">('+groups[k].length+')</span></h3>';
    groups[k].forEach(function(j){var ne=ents.filter(function(e){return e.jobId===j.id}).length,tc=sums({labor:byJ(labs,j.id),mats:byJ(mats,j.id),costs:byJ(costs,j.id)}).T;
      h+='<div class="card job" data-act="openJob" data-id="'+j.id+'"><div class="row"><b class="grow">'+esc(j.name||'Untitled job')+'</b><span class="st st-'+esc(j.status)+'">'+esc(j.status||'')+'</span></div>'+
      '<div class="mu">'+esc(j.client||'')+(j.client&&j.address?' · ':'')+esc(j.address||'')+'</div>'+
      '<div class="mu">'+ne+' walk'+(ne===1?'':'s')+' · '+money(tc)+(j.start?' · Start '+dOnly(j.start):'')+'</div></div>'})});
  h+='<h3>Backup &amp; storage</h3><div class="card"><div class="row"><button class="grow sm" data-act="exportJson">Export backup (JSON)</button><button class="grow sm" data-act="importJson">Import backup</button></div><div class="row" style="margin-top:6px"><button class="grow sm" data-act="prefsBk">App settings &amp; favorites backup</button></div><div id="jwStore" class="mu" style="margin-top:8px">Checking storage…</div></div>';
  root.innerHTML=h;storageInfo()})}
function storageInfo(){Promise.all([db.all('photos'),navigator.storage&&navigator.storage.estimate?navigator.storage.estimate():Promise.resolve(null)]).then(function(r){
  var ps=r[0],sz=ps.reduce(function(s,p){return s+(p.blob?p.blob.size:0)+(p.marked?p.marked.size:0)},0),e=r[1],el=$('#jwStore',root);if(!el)return;
  var h=ps.length+' photo'+(ps.length===1?'':'s')+' using '+bytes(sz)+'.';
  if(e&&e.quota){var pc=Math.min(100,e.usage/e.quota*100);h+='<br>Device storage for this app: '+bytes(e.usage)+' of '+bytes(e.quota)+' ('+dec(pc,1)+'%)<div class="bar" style="margin-top:4px"><i style="width:'+Math.max(1,pc)+'%"></i></div>'}
  el.innerHTML=h})}

// ----- job edit -----
function vJobEdit(){var p=view.id?db.get('jobs',view.id):Promise.resolve({id:uid(),status:'Active',start:today(),created:Date.now()});
 return p.then(function(j){view.draft=j;root.innerHTML='<div class="row"><button class="sm" data-act="back">‹ Back</button><h2 class="grow" style="margin:0 6px">'+(view.id?'Edit job':'New job')+'</h2></div><div class="card">'+
  '<label>Job name</label><input data-j="name" value="'+esc(j.name||'')+'" placeholder="Main St parking garage">'+
  '<label>Client / GC</label><input data-j="client" value="'+esc(j.client||'')+'">'+
  '<label>Address</label><input data-j="address" value="'+esc(j.address||'')+'" placeholder="123 Main St, Fresno, CA 93721">'+
  '<label>GPS location</label><div class="row"><input data-j="gps" class="grow" style="width:auto" value="'+(j.lat!=null?j.lat+', '+j.lng:'')+'" placeholder="lat, lng"><button class="sm" data-act="gps">📍 Use my location</button></div><div class="row" style="margin-top:6px" id="jwMaps">'+mapLinks(j)+'</div>'+
  '<div class="g2"><div><label>Status</label><select data-j="status">'+STATUSES.map(function(s){return '<option'+(j.status===s?' selected':'')+'>'+s+'</option>'}).join('')+'</select></div><div></div>'+
  '<div><label>Start date</label><input type="date" data-j="start" value="'+esc(j.start||'')+'"></div><div><label>Due / end date</label><input type="date" data-j="end" value="'+esc(j.end||'')+'"></div></div>'+
  '<label>Job notes</label><textarea data-j="notes" rows="3">'+esc(j.notes||'')+'</textarea>'+
  '<div class="row" style="margin-top:10px"><button class="grow pri" data-act="saveJob">Save job</button></div></div>'})}
function readJob(){var j=view.draft;root.querySelectorAll('[data-j]').forEach(function(i){var k=i.getAttribute('data-j');if(k==='gps'){var m=i.value.split(',').map(function(s){return parseFloat(s)});if(m.length===2&&isFinite(m[0])&&isFinite(m[1])){j.lat=+m[0].toFixed(6);j.lng=+m[1].toFixed(6)}else{delete j.lat;delete j.lng}}else j[k]=i.value.trim()});return j}

// ----- labor / materials / bid math -----
function bad(v){return '<span style="color:#ff4d4d;font-weight:700" title="Negative entry — counted as 0">– (invalid)</span>'}
function badV(v){if(v===''||v==null)return false;var n=parseFloat(String(v).replace(/[$,]/g,''));return !isFinite(n)||n<0||n>=1e9}
function qv(v){return badV(v)?bad():dec(num(v))}function mv(v){return badV(v)?bad():money(num(v))}
function pos(v){var n=num(v);return n>0&&n<1e9?n:0}// v35: negative/blank/huge entries count as 0
function lCost(l){var b=pos(l.burden),m=pos(l.otMult);return pos(l.hours)*pos(l.rate)*(b>=1?b:1)*(l.ot?(m>=1?m:1.5):1)}
function mCost(m){return pos(m.qty)*pos(m.price)}
function oCost(c){return pos(c.qty)*pos(c.unitCost)}
function sums(d){var L=0,M=0,O=0;(d.labor||[]).forEach(function(l){L+=lCost(l)});(d.mats||[]).forEach(function(m){M+=mCost(m)});(d.costs||[]).forEach(function(c){O+=oCost(c)});return {L:L,M:M,O:O,T:L+M+O}}
function bidCalc(t,b){b=b||{};var pc=function(k){return Math.min(pos(b[k]),1000)/100};var tax=t.M*pc('tax'),base=t.L+t.M+tax+t.O,oh=base*pc('overhead'),ct=base*pc('contingency'),sub=base+oh+ct,pr=sub*pc('profit');
 return {L:t.L,M:t.M,O:t.O,tax:tax,base:base,oh:oh,ct:ct,sub:sub,pr:pr,total:sub+pr}}
function pctS(v){return pos(v)?dec(Math.min(pos(v),1000))+'%':'0%'}
function bidRows(c,b,cls){var r=function(l,v,bold){return '<tr'+(bold?' style="font-weight:800"':'')+'><td>'+l+'</td><td class="'+(cls||'r')+'">'+money(v)+'</td></tr>'};
 return r('Labor',c.L)+r('Materials',c.M)+r('Sales tax on materials ('+pctS(b.tax)+')',c.tax)+r('Other costs',c.O)+r('Direct cost',c.base,1)+
  r('Overhead ('+pctS(b.overhead)+' of direct)',c.oh)+r('Contingency ('+pctS(b.contingency)+' of direct)',c.ct)+r('Subtotal',c.sub,1)+r('Profit / markup ('+pctS(b.profit)+' of subtotal)',c.pr)}
function jobData(id){return Promise.all([db.get('jobs',id),db.by('crew','jobId',id),db.by('labor','jobId',id),db.by('mats','jobId',id),db.by('costs','jobId',id)]).then(function(r){
 var by=function(a,b){return (a.created||0)-(b.created||0)};return {job:r[0],crew:r[1].sort(by),labor:r[2].sort(function(a,b){return (a.date||'').localeCompare(b.date||'')||by(a,b)}),mats:r[3].sort(by),costs:r[4].sort(by)}})}
function crewName(d,id){var e=(d.crew||[]).filter(function(c){return c.id===id})[0];return e?e.name:'(removed)'}
function laborHtml(d){var t=sums(d);
 var h='<h3>Employees &amp; Labor</h3><div class="card"><b>Crew roster</b><table><tr><th>Name</th><th>Trade / role</th><th class="r">Rate</th><th class="r">Burden</th><th class="r">OT x</th><th></th></tr>'+
 d.crew.map(function(c){return '<tr><td>'+esc(c.name)+'</td><td>'+esc(c.role||'')+'</td><td class="r">'+money(num(c.rate))+'/hr</td><td class="r">'+dec(num(c.burden)||1)+'</td><td class="r">'+dec(num(c.otMult)||1.5)+'</td><td class="r"><button class="sm dng" data-act="delCrew" data-id="'+c.id+'" aria-label="Remove">✕</button></td></tr>'}).join('')+
 (d.crew.length?'':'<tr><td colspan="6" class="mu">No crew yet.</td></tr>')+'</table>'+
 '<div class="g2" style="margin-top:6px"><div><label>Name</label><input data-cr="name" placeholder="Jed"></div><div><label>Trade / role</label><input data-cr="role" placeholder="Welder"></div></div>'+
 '<div class="g3"><div><label>Hourly rate $</label><input data-cr="rate" inputmode="decimal" placeholder="0"></div><div><label>Burden x (opt.)</label><input data-cr="burden" inputmode="decimal" placeholder="1.0"></div><div><label>OT x (opt.)</label><input data-cr="otMult" inputmode="decimal" placeholder="1.5"></div></div>'+
 '<button style="width:100%;margin-top:6px" data-act="addCrew">+ Add employee</button>'+
 '<div style="margin-top:12px;border-top:1px solid #2a313c;padding-top:8px"><b>Labor entries</b><table><tr><th>Date</th><th>Employee</th><th class="r">Hrs</th><th class="r">Cost</th><th></th></tr>'+
 d.labor.map(function(l){return '<tr><td>'+esc(dOnly(l.date))+'</td><td>'+esc(l.empName||crewName(d,l.empId))+(l.ot?' <span class="tag">OT</span>':'')+'</td><td class="r">'+qv(l.hours)+'</td><td class="r">'+((l.rate===''||l.rate==null)?'<button class="sm" data-act="editLabor" data-id="'+l.id+'">set $/hr</button>':money(lCost(l)))+'</td><td class="r"><button class="sm dng" data-act="delLabor" data-id="'+l.id+'" aria-label="Delete">✕</button></td></tr>'}).join('')+
 (d.labor.length?'':'<tr><td colspan="5" class="mu">No labor logged yet.</td></tr>')+'</table>'+
 (d.crew.length?'<div class="g3" style="margin-top:6px"><div><label>Employee</label><select data-lb="empId">'+d.crew.map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>'}).join('')+'</select></div><div><label>Date</label><input type="date" data-lb="date" value="'+today()+'"></div><div><label>Hours</label><input data-lb="hours" inputmode="decimal" placeholder="8"></div></div>'+
  '<label style="display:flex;align-items:center;gap:8px;color:#f2f4f7"><input type="checkbox" data-lb="ot" style="width:22px;min-height:22px"> Overtime</label><button style="width:100%;margin-top:6px" data-act="addLabor">+ Add labor</button>':'<div class="mu" style="margin-top:6px">Add an employee to log hours. Cost = hours × rate × burden (× OT multiplier if OT).</div>')+
 '<div class="row" style="margin-top:8px"><b class="grow">Labor subtotal</b><span class="tot">'+money(t.L)+'</span></div></div></div>';
 h+='<h3>Materials</h3><div class="card"><table><tr><th>Item</th><th class="r">Qty</th><th class="r">Unit $</th><th class="r">Total</th><th></th></tr>'+
 d.mats.map(function(m){return '<tr><td>'+esc(m.item)+(m.supplier?'<div class="mu">'+esc(m.supplier)+'</div>':'')+'</td><td class="r">'+qv(m.qty)+' '+esc(m.unit||'')+'</td><td class="r"><button class="sm" data-act="editMat" data-id="'+m.id+'" aria-label="Edit price">'+(m.price===''||m.price==null?'set $':mv(m.price))+'</button></td><td class="r">'+money(mCost(m))+'</td><td class="r"><button class="sm dng" data-act="delMat" data-id="'+m.id+'" aria-label="Delete">✕</button></td></tr>'}).join('')+
 (d.mats.length?'':'<tr><td colspan="5" class="mu">No materials yet.</td></tr>')+'</table>'+
 '<div class="g2" style="margin-top:6px"><div><label>Item</label><input data-mt="item" placeholder="2x2x1/4 angle"></div><div><label>Supplier</label><input data-mt="supplier" placeholder="optional"></div></div>'+
 '<div class="g3"><div><label>Qty</label><input data-mt="qty" inputmode="decimal" placeholder="1"></div><div><label>Unit</label><input data-mt="unit" placeholder="ft, ea"></div><div><label>Unit price $</label><input data-mt="price" inputmode="decimal" placeholder="0"></div></div>'+
 '<button style="width:100%;margin-top:6px" data-act="addMat">+ Add material</button>'+
 '<div class="row" style="margin-top:8px"><b class="grow">Materials subtotal</b><span class="tot">'+money(t.M)+'</span></div></div>';return h}
function totalsHtml(d){var t=sums(d);return '<h3>Job totals</h3><div class="card"><div class="row"><span class="grow">Labor</span><span>'+money(t.L)+'</span></div><div class="row"><span class="grow">Materials</span><span>'+money(t.M)+'</span></div><div class="row"><span class="grow">Other costs</span><span>'+money(t.O)+'</span></div>'+
 '<div class="row" style="border-top:1px solid #2a313c;margin-top:6px;padding-top:6px"><b class="grow">Grand job total</b><span class="tot" id="jwGrand">'+money(t.T)+'</span></div>'+
 (d.job.bid&&d.job.bid.saved?'<div class="mu" style="margin-top:4px">Saved bid: <b style="color:#ffb020">'+money(bidCalc(t,d.job.bid).total)+'</b></div>':'')+
 '<button class="pri" style="width:100%;margin-top:8px" data-act="buildBid">📋 Build Bid</button></div>'}
function vBid(){return jobData(view.id).then(function(d){var j=d.job;if(!j){go({name:'list'});return}var b=view.bid||(view.bid=Object.assign({overhead:'',profit:'',contingency:'',tax:'',scope:'',date:today(),valid:''},j.bid||{}));
 var f=function(k,l){return '<div><label>'+l+'</label><input data-b="'+k+'" inputmode="decimal" placeholder="0" value="'+esc(b[k])+'"></div>'};
 root.innerHTML='<div class="row"><button class="sm" data-act="bidBack">‹ Job</button><div class="grow"></div><button class="sm pri" data-act="bidSheet">Bid sheet</button></div>'+
 '<div class="card"><h2 style="margin:0">Bid: '+esc(j.name||'')+'</h2><div class="mu">'+esc(j.client||'')+(j.address?' · '+esc(j.address):'')+'</div></div>'+
 '<div class="card"><div class="note">Set your own percentages. Nothing is filled in for you; blank = 0%.</div><div class="g2">'+f('overhead','Overhead %')+f('profit','Profit / markup %')+f('contingency','Contingency %')+f('tax','Sales tax on materials %')+'</div>'+
 '<div class="g2"><div><label>Bid date</label><input type="date" data-b="date" value="'+esc(b.date||'')+'"></div><div><label>Valid until</label><input type="date" data-b="valid" value="'+esc(b.valid||'')+'"></div></div>'+
 '<label>Scope of work / notes</label><textarea data-b="scope" rows="4" placeholder="Fabricate and install…">'+esc(b.scope||'')+'</textarea></div>'+
 '<div class="card"><table id="jwBidT"></table></div><div class="row"><button class="grow pri" data-act="saveBid">Save bid</button><button class="grow" data-act="bidSheet">🖨 Bid sheet</button></div>';
 view.bidData=d;bidRefresh()})}
function readBid(){var b=view.bid;root.querySelectorAll('[data-b]').forEach(function(i){b[i.getAttribute('data-b')]=i.value.trim()});return b}
function bidRefresh(){var t=$('#jwBidT',root);if(!t)return;var b=readBid(),c=bidCalc(sums(view.bidData),b);t.innerHTML=bidRows(c,b)+'<tr><td><b style="font-size:17px">BID TOTAL</b></td><td class="r"><span class="tot" id="jwBidTot">'+money(c.total)+'</span></td></tr>'}
function saveBid(){var b=readBid();return db.get('jobs',view.id).then(function(j){j.bid=Object.assign({},b,{saved:Date.now()});j.updated=Date.now();return db.put('jobs',j)})}
function bidSheetHtml(d){var j=d.job,b=j.bid||{},c=bidCalc(sums(d),b);
 return '<h1>Bid / Estimate</h1><div style="color:#555;font-size:13px">'+(b.date?'Date: '+dOnly(b.date):'')+(b.valid?' · Valid until: '+dOnly(b.valid):'')+'</div>'+
 '<h2>Customer</h2><div><b>'+esc(j.client||'')+'</b></div><div>Job: '+esc(j.name||'')+'</div><div>'+esc(j.address||'')+'</div>'+
 (b.scope?'<h2>Scope of work</h2><p style="white-space:pre-wrap">'+esc(b.scope)+'</p>':'')+
 '<h2>Pricing</h2><table>'+bidRows(c,b)+'<tr><td><b style="font-size:18px">BID TOTAL</b></td><td class="r"><b style="font-size:18px">'+money(c.total)+'</b></td></tr></table>'+
 '<p style="margin-top:28px">Accepted by: ______________________ &nbsp; Date: __________</p><p style="color:#777;font-size:11px;margin-top:16px">Papa\'s Shop · Bid sheet</p>'}
// ----- job detail -----
function vJob(){var id=view.id;return Promise.all([db.get('jobs',id),db.by('entries','jobId',id),db.by('costs','jobId',id),db.by('photos','jobId',id)]).then(function(r){
  var j=r[0];if(!j){go({name:'list'});return}var ents=r[1].sort(function(a,b){return b.ts-a.ts}),costs=r[2].sort(function(a,b){return a.created-b.created}),ph=r[3];
  var h='<div class="row"><button class="sm" data-act="back">‹ Jobs</button><div class="grow"></div><button class="sm" data-act="editJob">Edit</button><button class="sm pri" data-act="report">Report</button></div>'+
  '<div class="card"><div class="row"><h2 class="grow" style="margin:0">'+esc(j.name||'Untitled job')+'</h2><span class="st st-'+esc(j.status)+'">'+esc(j.status)+'</span></div>'+
  '<div class="mu">'+esc(j.client||'')+'</div><div>'+esc(j.address||'')+'</div>'+(j.lat!=null?'<div class="mu">GPS '+j.lat+', '+j.lng+'</div>':'')+
  '<div class="mu">'+(j.start?'Start '+dOnly(j.start):'')+(j.end?' · Due '+dOnly(j.end):'')+'</div><div class="row" style="margin-top:6px">'+mapLinks(j)+'</div>'+(j.notes?'<p style="white-space:pre-wrap;margin:8px 0 0">'+esc(j.notes)+'</p>':'')+'</div>';
  h+='<div class="row"><h3 class="grow">Walks / entries ('+ents.length+')</h3><button class="sm pri" data-act="newEntry">+ New walk entry</button></div>';
  if(!ents.length)h+='<div class="card mu">No entries yet. Add one for each area you walk.</div>';
  ents.forEach(function(e){var pp=ph.filter(function(p){return p.entryId===e.id});h+='<div class="card job" data-act="openEntry" data-id="'+e.id+'"><div class="row"><b class="grow">'+esc(e.area||'General')+'</b><span class="mu">'+dt(e.ts)+'</span></div>'+
    (e.notes?'<div style="white-space:pre-wrap;max-height:3.6em;overflow:hidden">'+esc(e.notes)+'</div>':'')+'<div>'+(e.tags||[]).map(function(t){return '<span class="tag">'+esc(t)+'</span>'}).join('')+'</div>'+
    '<div class="mu">'+pp.length+' photo'+(pp.length===1?'':'s')+' · '+(e.meas||[]).length+' measurement'+((e.meas||[]).length===1?'':'s')+'</div>'+
    (pp.length?'<div class="thumbs" style="margin-top:6px">'+pp.slice(0,4).map(function(p){return '<div class="th"><img src="'+ourl(p.marked||p.blob)+'" style="width:64px;height:64px"></div>'}).join('')+'</div>':'')+'</div>'});
  return jobData(id).then(function(d){h+=laborHtml(d)+costHtml(costs)+totalsHtml(d);
  h+='<div class="row" style="margin-top:14px"><button class="grow dng" data-act="delJob">Delete job</button></div>';
  root.innerHTML=h})})}
function costHtml(costs){var sub={},tot=0;CATS.forEach(function(c){sub[c]=0});costs.forEach(function(c){var t=oCost(c);sub[c.cat]=(sub[c.cat]||0)+t;tot+=t});
  var h='<h3>Other costs</h3><div class="card"><table><tr><th>Item</th><th class="r">Qty</th><th class="r">Unit $</th><th class="r">Total</th><th></th></tr>';
  costs.forEach(function(c){h+='<tr><td><span class="tag">'+esc(c.cat)+'</span> '+esc(c.desc)+'</td><td class="r">'+qv(c.qty)+' '+esc(c.unit||'')+'</td><td class="r">'+mv(c.unitCost)+'</td><td class="r">'+money(oCost(c))+'</td><td class="r"><button class="sm dng" data-act="delCost" data-id="'+c.id+'" aria-label="Delete">✕</button></td></tr>'});
  if(!costs.length)h+='<tr><td colspan="5" class="mu">No cost items yet.</td></tr>';
  h+='</table><div style="margin-top:8px">'+CATS.filter(function(c){return sub[c]}).map(function(c){return '<div class="row"><span class="grow mu" style="text-transform:capitalize">'+c+'</span><span>'+money(sub[c])+'</span></div>'}).join('')+
  '<div class="row"><b class="grow">Other costs subtotal</b><span class="tot" id="jwTot">'+money(tot)+'</span></div></div>'+
  '<div style="margin-top:10px;border-top:1px solid #2a313c;padding-top:8px"><b>Add cost item</b><div class="g2"><div><label>Category</label><select data-c="cat">'+CATS.map(function(c){return '<option value="'+c+'">'+c[0].toUpperCase()+c.slice(1)+'</option>'}).join('')+'</select></div><div><label>Unit</label><input data-c="unit" placeholder="hr, ea, lf"></div></div>'+
  '<label>Description</label><input data-c="desc" placeholder="Welder 2 days">'+
  '<div class="g2"><div><label>Qty</label><input data-c="qty" inputmode="decimal" placeholder="16"></div><div><label>Unit cost $</label><input data-c="unitCost" inputmode="decimal" placeholder="85"></div></div>'+
  '<button class="pri" style="width:100%;margin-top:8px" data-act="addCost">Add cost</button></div></div>';return h}

// ----- entry -----
function vEntry(){return Promise.all([db.get('entries',view.id),db.by('photos','entryId',view.id)]).then(function(r){var e=r[0];if(!e){go({name:'job',id:view.job});return}var ph=r[1].sort(function(a,b){return a.created-b.created});
  var h='<div class="row"><button class="sm" data-act="saveEntryBack">‹ Save &amp; back</button><div class="grow"></div><span class="mu">'+dt(e.ts)+'</span></div><div class="card">'+
  '<label>Area / room</label><input data-e="area" value="'+esc(e.area||'')+'" placeholder="Level 2 east stair">'+
  '<label>Notes</label><textarea data-e="notes" rows="4" placeholder="What did you see? Punch items, conflicts, access…">'+esc(e.notes||'')+'</textarea>'+
  '<label>Tags (comma separated)</label><input data-e="tags" value="'+esc((e.tags||[]).join(', '))+'" placeholder="punch, safety, rfi">'+
  '<label>Date / time</label><input type="datetime-local" data-e="ts" value="'+new Date(e.ts-new Date(e.ts).getTimezoneOffset()*6e4).toISOString().slice(0,16)+'"></div>';
  h+='<h3>Photos ('+ph.length+')</h3><div class="card"><div class="row"><label class="btn pri grow" style="text-align:center;color:#111;margin:0;display:flex;align-items:center;justify-content:center">📷 Take photo<input type="file" accept="image/*" capture="environment" data-act="addPhoto" hidden></label>'+
  '<label class="btn grow" style="text-align:center;margin:0;color:#f2f4f7;display:flex;align-items:center;justify-content:center">🖼 From library<input type="file" accept="image/*" multiple data-act="addPhoto" id="jwLib" hidden></label></div>'+
  '<div class="thumbs" style="margin-top:8px">'+ph.map(function(p){return '<div class="th"><img src="'+ourl(p.marked||p.blob)+'" data-act="markup" data-id="'+p.id+'" alt="photo">'+(p.marked?'<span class="mk">MARKED</span>':'')+
   '<div class="row" style="gap:3px;margin-top:3px"><button class="sm grow" data-act="markup" data-id="'+p.id+'" style="padding:4px">✏️</button><button class="sm dng" data-act="delPhoto" data-id="'+p.id+'" style="padding:4px 8px">✕</button></div></div>'}).join('')+'</div>'+
  (ph.length?'<div class="mu" style="margin-top:6px">Tap a photo to mark it up. The original is always kept.</div>':'')+'</div>';
  h+='<h3>Measurements</h3><div class="card"><div class="note">Use your iPhone Measure app and type the result here, or draw a dimension on the photo.</div><table>'+
  (e.meas||[]).map(function(m,i){return '<tr><td>'+esc(m.label)+(m.est?' <span class="tag">estimate</span>':'')+'</td><td class="r"><b>'+esc(m.value)+'</b> '+esc(m.unit)+'</td><td class="r"><button class="sm dng" data-act="delMeas" data-i="'+i+'">✕</button></td></tr>'}).join('')+'</table>'+
  '<div class="g3" style="margin-top:8px"><input data-m="label" placeholder="Label (opening width)"><input data-m="value" placeholder="36 1/2"><select data-m="unit"><option>in</option><option>ft</option><option>ft-in</option><option>mm</option><option>cm</option><option>m</option><option>sq ft</option><option>deg</option></select></div>'+
  '<button style="width:100%;margin-top:6px" data-act="addMeas">+ Add measurement</button></div>';
  h+='<div class="row" style="margin-top:14px"><button class="grow pri" data-act="saveEntryBack">Save entry</button><button class="dng" data-act="delEntry">Delete entry</button></div>';
  root.innerHTML=h;view.entry=e})}
function readEntry(){var e=view.entry;root.querySelectorAll('[data-e]').forEach(function(i){var k=i.getAttribute('data-e'),v=i.value;if(k==='tags')e.tags=v.split(',').map(function(s){return s.trim()}).filter(Boolean);else if(k==='ts'){var t=new Date(v).getTime();if(t)e.ts=t}else e[k]=v.trim()});return e}
function touchJob(id){return db.get('jobs',id).then(function(j){if(j){j.updated=Date.now();return db.put('jobs',j)}})}

// ---------- events ----------
function onClick(ev){var t=ev.target.closest('[data-act]');if(!t||!root.contains(t)||t.tagName==='INPUT')return;var a=t.getAttribute('data-act'),id=t.getAttribute('data-id');if(/^(addCost|addLabor|addMat|addCrew|saveBid)$/.test(a)){var bx=[].filter.call(root.querySelectorAll('input[inputmode="decimal"]'),function(i){return badV(i.value)});if(bx.length){bx.forEach(function(i){i.style.outline='2px solid #ff4d4d'});toast('Fix the red field'+(bx.length>1?'s':'')+': numbers 0 or more only');bx[0].focus();return}}
 var A={
  newJob:function(){go({name:'jobEdit'})},openJob:function(){go({name:'job',id:id})},editJob:function(){go({name:'jobEdit',id:view.id})},
  back:function(){go(view.name==='jobEdit'&&view.id?{name:'job',id:view.id}:{name:'list'})},
  gps:function(){if(!navigator.geolocation){toast('Location not available');return}t.textContent='Locating…';navigator.geolocation.getCurrentPosition(function(p){var i=$('[data-j="gps"]',root);i.value=p.coords.latitude.toFixed(6)+', '+p.coords.longitude.toFixed(6);t.textContent='📍 Use my location';$('#jwMaps',root).innerHTML=mapLinks(readJob());toast('Location set (±'+Math.round(p.coords.accuracy)+' m)')},function(er){t.textContent='📍 Use my location';toast('Location failed: '+er.message)},{enableHighAccuracy:true,timeout:15000,maximumAge:60000})},
  saveJob:function(){var j=readJob();if(!j.name){toast('Give the job a name');return}j.updated=Date.now();db.put('jobs',j).then(function(){go({name:'job',id:j.id})})},
  delJob:function(){confirmBox('Delete this job and ALL its walks, photos and costs? This cannot be undone.').then(function(ok){if(ok)db.delJob(view.id).then(function(){toast('Job deleted');go({name:'list'})})})},
  newEntry:function(){var e={id:uid(),jobId:view.id,ts:Date.now(),area:'',notes:'',tags:[],meas:[]};db.put('entries',e).then(function(){touchJob(e.jobId);go({name:'entry',id:e.id,job:e.jobId})})},
  openEntry:function(){go({name:'entry',id:id,job:view.id})},
  saveEntryBack:function(){var e=readEntry();db.put('entries',e).then(function(){touchJob(e.jobId);go({name:'job',id:e.jobId})})},
  delEntry:function(){confirmBox('Delete this entry and its photos?').then(function(ok){if(ok)db.delEntry(view.id).then(function(){go({name:'job',id:view.job})})})},
  addMeas:function(){var g=function(k){return $('[data-m="'+k+'"]',root).value.trim()};if(!g('value')){toast('Enter a value');return}var e=readEntry();e.meas=e.meas||[];e.meas.push({label:g('label')||'Measurement',value:g('value'),unit:g('unit')});db.put('entries',e).then(render)},
  delMeas:function(){var e=readEntry();e.meas.splice(+t.getAttribute('data-i'),1);db.put('entries',e).then(render)},
  delPhoto:function(){confirmBox('Delete this photo (original and markup)?').then(function(ok){if(ok)db.del('photos',id).then(render)})},
  markup:function(){var e=readEntry();db.put('entries',e).then(function(){return db.get('photos',id)}).then(function(p){openEditor(p)})},
  addCost:function(){var g=function(k){return $('[data-c="'+k+'"]',root).value.trim()};if(!g('desc')&&!g('unitCost')){toast('Enter a description and cost');return}
    db.put('costs',{id:uid(),jobId:view.id,cat:g('cat'),desc:g('desc'),qty:g('qty')===''?1:num(g('qty')),unit:g('unit'),unitCost:num(g('unitCost')),created:Date.now()}).then(function(){touchJob(view.id);render()})},
  delCost:function(){confirmBox('Delete this cost item?').then(function(ok){if(ok)db.del('costs',id).then(render)})},
  addCrew:function(){var g=function(k){return $('[data-cr="'+k+'"]',root).value.trim()};if(!g('name')){toast('Enter a name');return}
    db.put('crew',{id:uid(),jobId:view.id,name:g('name'),role:g('role'),rate:num(g('rate')),burden:g('burden')===''?1:num(g('burden')),otMult:g('otMult')===''?1.5:num(g('otMult')),created:Date.now()}).then(function(){touchJob(view.id);render()})},
  delCrew:function(){confirmBox('Remove this employee from the roster? Their logged labor stays.','Remove').then(function(ok){if(ok)db.del('crew',id).then(render)})},
  addLabor:function(){var g=function(k){return $('[data-lb="'+k+'"]',root)};var hrs=num(g('hours').value);if(!hrs){toast('Enter hours');return}var eid=g('empId').value;
    db.get('crew',eid).then(function(c){if(!c)return;return db.put('labor',{id:uid(),jobId:view.id,empId:eid,empName:c.name,date:g('date').value,hours:hrs,ot:g('ot').checked,rate:num(c.rate),burden:num(c.burden)||1,otMult:num(c.otMult)||1.5,created:Date.now()})}).then(function(){touchJob(view.id);render()})},
  editMat:function(){db.get('mats',id).then(function(m){if(!m)return;return ask('Unit price $ for '+(m.item||'item'),m.price===''?'':String(m.price),'Qty '+dec(num(m.qty))+' '+(m.unit||'')).then(function(v){if(v==null)return;if(badV(v)){toast('Enter a price of 0 or more');return}m.price=String(v).trim()===''?'':num(v);return db.put('mats',m).then(function(){touchJob(view.id);render()})})})},
  editLabor:function(){db.get('labor',id).then(function(l){if(!l)return;return ask('Hourly rate $ for '+(l.empName||'labor'),'',dec(num(l.hours))+' hr').then(function(v){if(v==null||String(v).trim()==='')return;if(badV(v)){toast('Enter a rate of 0 or more');return}l.rate=num(v);return db.put('labor',l).then(function(){touchJob(view.id);render()})})})},
  delLabor:function(){confirmBox('Delete this labor entry?').then(function(ok){if(ok)db.del('labor',id).then(render)})},
  addMat:function(){var g=function(k){return $('[data-mt="'+k+'"]',root).value.trim()};if(!g('item')){toast('Enter an item');return}
    db.put('mats',{id:uid(),jobId:view.id,item:g('item'),qty:g('qty')===''?1:num(g('qty')),unit:g('unit'),price:num(g('price')),supplier:g('supplier'),created:Date.now()}).then(function(){touchJob(view.id);render()})},
  delMat:function(){confirmBox('Delete this material?').then(function(ok){if(ok)db.del('mats',id).then(render)})},
  buildBid:function(){go({name:'bid',id:view.id})},
  bidBack:function(){go({name:'job',id:view.id})},
  saveBid:function(){saveBid().then(function(){toast('Bid saved with the job')})},
  bidSheet:function(){saveBid().then(function(){return jobData(view.id)}).then(function(d){openDoc(d.job.name+' bid',function(){return bidSheetHtml(d)},function(){return Promise.resolve(bidSheetHtml(d))},(d.job.name||'job').replace(/[^\w-]+/g,'_')+'_bid.html',function(){var c=bidCalc(sums(d),d.job.bid);return d.job.name+' bid: '+money(c.total)})})},
  prefsBk:function(){if(window.hhPrefs)hhPrefs.bkSheet()},
  report:function(){openReport(view.id)},exportJson:exportJson,
  importJson:function(){var i=document.createElement('input');i.type='file';i.accept='application/json,.json';i.onchange=function(){if(i.files[0])importJson(i.files[0])};i.click()}
 };if(A[a]){ev.preventDefault();A[a]()}}
function onChange(ev){var t=ev.target;if(t.getAttribute&&t.hasAttribute('data-b')){bidRefresh();return}var f=t.getAttribute&&t.getAttribute('data-f');if(f){filt[f]=t.value;if(f==='q'){clearTimeout(onChange.tm);onChange.tm=setTimeout(function(){var pos=t.selectionStart;render().then(function(){var i=$('[data-f="q"]',root);if(i){i.focus();try{i.setSelectionRange(pos,pos)}catch(e){}}})},250)}else render();return}
 if(t.getAttribute&&t.getAttribute('data-act')==='addPhoto'&&t.files&&t.files.length&&ev.type==='change'){addPhotos([].slice.call(t.files))}}
function addPhotos(files){var e=readEntry();toast('Saving '+files.length+' photo'+(files.length>1?'s':'')+'…');
 return db.put('entries',e).then(function(){return files.reduce(function(p,f){return p.then(function(){return downscale(f,2000).then(function(r){return db.put('photos',{id:uid(),entryId:e.id,jobId:e.jobId,blob:r.blob,w:r.w,h:r.h,name:f.name||'photo.jpg',created:Date.now()})})})},Promise.resolve())}).then(function(){touchJob(e.jobId);return render()}).catch(function(er){toast(er.message)})}

// ---------- markup editor ----------
var COLORS=['#ff3b30','#ffb020','#ffd600','#34c759','#4da3ff','#ffffff','#000000'];
function openEditor(photo){return loadImg(photo.blob).then(function(img){
 var ov=document.createElement('div');ov.className='jw-ov';
 var tools=[['pen','✏️ Pen'],['arrow','➚ Arrow'],['rect','▭ Box'],['circle','◯ Circle'],['text','T Text'],['dim','↔ Dim'],['cal','📏 Scale']];
 ov.innerHTML='<div class="tb">'+'<button data-x>✕</button>'+tools.map(function(t){return '<button data-t="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div>'+
 '<div class="tb">'+COLORS.map(function(c){return '<button class="sw" data-c="'+c+'" style="background:'+c+'"></button>'}).join('')+'<button data-w>Thin</button><button data-u>↶ Undo</button><button data-r>↷ Redo</button><button data-clr>Clear</button><button data-s style="background:#ffb020;color:#111">Save</button></div>'+
 '<div class="cw"><canvas></canvas><div class="hint"></div></div>';
 ov.querySelectorAll('button').forEach(function(b){b.style.cssText+=';background:'+(b.style.background||'#222831')+';color:'+(b.hasAttribute('data-s')?'#111':'#f2f4f7')+';border:1px solid #2a313c;border-radius:10px;min-height:40px;padding:6px 10px;font:600 14px system-ui'});
 ov.querySelectorAll('.sw').forEach(function(b){b.style.width=b.style.height='34px';b.style.minHeight='0';b.style.borderRadius='50%';b.style.padding='0'});
 document.body.appendChild(ov);
 var cv=$('canvas',ov),ctx=cv.getContext('2d'),hint=$('.hint',ov);cv.width=img.naturalWidth;cv.height=img.naturalHeight;
 var K=Math.max(cv.width,cv.height)/1000,st={tool:'arrow',color:'#ff3b30',w:1,shapes:JSON.parse(JSON.stringify(photo.markup||[])),redo:[],scale:photo.scale||null,cur:null};
 function hintTxt(){hint.textContent=st.tool==='cal'?'Draw a line over something you know the length of (door, block, tape). Then other lines show estimated lengths.':st.tool==='dim'?'Drag to draw a dimension, then type the measurement (e.g. 36 1/2").'+(st.scale?' Estimate pre-filled from scale.':''):st.scale?'Scale set: '+fracIn(st.scale.inches)+' reference. Lengths on arrows/dims are estimates.':'Pick a tool and draw with your finger.'}
 function sel(){ov.querySelectorAll('[data-t]').forEach(function(b){b.style.background=b.getAttribute('data-t')===st.tool?'#8a5606':'#222831';b.style.borderColor=b.getAttribute('data-t')===st.tool?'#ffb020':'#2a313c'});ov.querySelectorAll('[data-c]').forEach(function(b){b.style.borderColor=b.getAttribute('data-c')===st.color?'#fff':'#333';b.style.borderWidth='3px'});$('[data-w]',ov).textContent=['Thin','Med','Thick'][st.w-1]||'Med';hintTxt()}
 st.w=2;sel();
 function len(s){return Math.hypot(s.x2-s.x1,s.y2-s.y1)}
 function est(s){return st.scale?len(s)/st.scale.px*st.scale.inches:null}
 function label(c,x,y,txt,col,size){c.font='bold '+size+'px system-ui,sans-serif';var w=c.measureText(txt).width,p=size*.3;c.fillStyle='rgba(0,0,0,.72)';c.fillRect(x-w/2-p,y-size/2-p,w+2*p,size+2*p);c.fillStyle=col;c.textAlign='center';c.textBaseline='middle';c.fillText(txt,x,y)}
 function head(c,x1,y1,x2,y2,sz){var a=Math.atan2(y2-y1,x2-x1);c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-sz*Math.cos(a-.45),y2-sz*Math.sin(a-.45));c.lineTo(x2-sz*Math.cos(a+.45),y2-sz*Math.sin(a+.45));c.closePath();c.fill()}
 function draw(c,s){var lw=s.w*3*K;c.strokeStyle=c.fillStyle=s.c;c.lineWidth=lw;c.lineCap=c.lineJoin='round';var fs=Math.max(14,(12+s.w*6)*K);
  if(s.t==='pen'){c.beginPath();s.pts.forEach(function(p,i){i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])});c.stroke()}
  else if(s.t==='rect'){c.strokeRect(Math.min(s.x1,s.x2),Math.min(s.y1,s.y2),Math.abs(s.x2-s.x1),Math.abs(s.y2-s.y1))}
  else if(s.t==='circle'){c.beginPath();c.ellipse((s.x1+s.x2)/2,(s.y1+s.y2)/2,Math.abs(s.x2-s.x1)/2||1,Math.abs(s.y2-s.y1)/2||1,0,0,Math.PI*2);c.stroke()}
  else if(s.t==='arrow'){c.beginPath();c.moveTo(s.x1,s.y1);c.lineTo(s.x2,s.y2);c.stroke();head(c,s.x1,s.y1,s.x2,s.y2,lw*4+8*K);var e=est(s);if(e!=null&&len(s)>40*K)label(c,(s.x1+s.x2)/2,(s.y1+s.y2)/2,'≈'+fracIn(e)+' est.',s.c,fs*.8)}
  else if(s.t==='dim'||s.t==='cal'){var a=Math.atan2(s.y2-s.y1,s.x2-s.x1),tk=lw*3+6*K,nx=-Math.sin(a)*tk,ny=Math.cos(a)*tk;if(s.t==='cal'){c.setLineDash([lw*3,lw*2])}
   c.beginPath();c.moveTo(s.x1,s.y1);c.lineTo(s.x2,s.y2);c.stroke();c.setLineDash([]);c.beginPath();c.moveTo(s.x1+nx,s.y1+ny);c.lineTo(s.x1-nx,s.y1-ny);c.moveTo(s.x2+nx,s.y2+ny);c.lineTo(s.x2-nx,s.y2-ny);c.stroke();
   head(c,s.x2,s.y2,s.x1,s.y1,lw*3+6*K);head(c,s.x1,s.y1,s.x2,s.y2,lw*3+6*K);
   var t=s.t==='cal'?'REF '+(s.label||''):(s.label||(est(s)!=null?'≈'+fracIn(est(s))+' est.':''));if(t)label(c,(s.x1+s.x2)/2,(s.y1+s.y2)/2,t,s.c,fs)}
  else if(s.t==='text'){c.font='bold '+fs*1.2+'px system-ui,sans-serif';c.textAlign='left';c.textBaseline='top';c.lineWidth=Math.max(2,fs/8);c.strokeStyle=s.c==='#000000'?'#fff':'#000';c.strokeText(s.text,s.x1,s.y1);c.fillStyle=s.c;c.fillText(s.text,s.x1,s.y1)}}
 function paint(){ctx.clearRect(0,0,cv.width,cv.height);ctx.drawImage(img,0,0);st.shapes.forEach(function(s){draw(ctx,s)});if(st.cur)draw(ctx,st.cur)}
 function fit(){var cw=$('.cw',ov),k=Math.min(cw.clientWidth/cv.width,cw.clientHeight/cv.height);cv.style.width=Math.floor(cv.width*k)+'px';cv.style.height=Math.floor(cv.height*k)+'px'}
 function pt(e){var r=cv.getBoundingClientRect();return [(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]}
 function commit(s){st.shapes.push(s);st.redo=[];paint()}
 cv.addEventListener('pointerdown',function(e){e.preventDefault();var p=pt(e);try{cv.setPointerCapture(e.pointerId)}catch(_){}
  if(st.tool==='text'){ask('Text label','',null).then(function(v){if(v)commit({t:'text',c:st.color,w:st.w,x1:p[0],y1:p[1],text:v})});return}
  st.cur=st.tool==='pen'?{t:'pen',c:st.color,w:st.w,pts:[p]}:{t:st.tool,c:st.color,w:st.w,x1:p[0],y1:p[1],x2:p[0],y2:p[1]};paint()});
 cv.addEventListener('pointermove',function(e){if(!st.cur)return;e.preventDefault();var p=pt(e);if(st.cur.t==='pen')st.cur.pts.push(p);else{st.cur.x2=p[0];st.cur.y2=p[1]}paint()});
 function up(){var s=st.cur;if(!s)return;st.cur=null;
  if(s.t==='pen'){if(s.pts.length>1)commit(s);else paint();return}
  if(len(s)<8*K&&s.t!=='rect'&&s.t!=='circle'){paint();return}
  if(s.t==='dim'){var e0=est(s);paint();draw(ctx,s);ask('Dimension','',e0!=null?'Estimate from scale: '+fracIn(e0)+' (leave blank to show the estimate)':'Type the measurement, e.g. 36 1/2"').then(function(v){if(v===null){paint();return}v=v.trim();if(v&&/^[\d\s\/.]+$/.test(v))v+='"';s.label=v;commit(s)});return}
  if(s.t==='cal'){paint();draw(ctx,s);ask('Reference length','','How long is the thing you traced? e.g. 80" door, 16" block, 3\' 6"').then(function(v){var inch=parseLen(v);if(!(inch>0)){if(v!==null)toast('Could not read that length');paint();return}
    st.shapes=st.shapes.filter(function(x){return x.t!=='cal'});s.label=fracIn(inch);st.scale={px:len(s),inches:inch};commit(s);sel();toast('Scale set. Lengths are estimates.')});return}
  commit(s)}
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 ov.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-t')){st.tool=b.getAttribute('data-t');sel()}
  else if(b.hasAttribute('data-c')){st.color=b.getAttribute('data-c');sel()}
  else if(b.hasAttribute('data-w')){st.w=st.w%3+1;sel()}
  else if(b.hasAttribute('data-u')){if(st.shapes.length){var s=st.shapes.pop();st.redo.push(s);if(s.t==='cal')st.scale=null;paint();sel()}}
  else if(b.hasAttribute('data-r')){if(st.redo.length){var r=st.redo.pop();st.shapes.push(r);if(r.t==='cal')st.scale={px:len(r),inches:parseLen(r.label)};paint();sel()}}
  else if(b.hasAttribute('data-clr')){if(st.shapes.length){st.redo=st.shapes.reverse();st.shapes=[];st.scale=null;paint();sel()}}
  else if(b.hasAttribute('data-x')){if(st.shapes.length&&JSON.stringify(st.shapes)!==JSON.stringify(photo.markup||[]))confirmBox('Discard markup changes?','Discard').then(function(ok){if(ok)close()});else close()}
  else if(b.hasAttribute('data-s')){b.textContent='Saving…';paint();cv.toBlob(function(bl){photo.markup=st.shapes;photo.scale=st.scale;photo.marked=st.shapes.length?bl:null;photo.edited=Date.now();
    // dims become measurements on the entry
    db.put('photos',photo).then(function(){return db.get('entries',photo.entryId)}).then(function(en){if(!en)return;en.meas=(en.meas||[]).filter(function(m){return m.photo!==photo.id});
      var dn=0;st.shapes.forEach(function(s){if(s.t==='dim'){dn++;var v=s.label||(est(s)!=null?fracIn(est(s)):'');if(v)en.meas.push({label:'Photo dim '+dn,value:v.replace(/"$/,''),unit:/'/.test(v)?'ft-in':'in',est:!s.label,photo:photo.id})}});return db.put('entries',en)})
    .then(function(){toast('Marked-up copy saved. Original kept.');close()})},'image/jpeg',.88)}});
 function close(){window.removeEventListener('resize',fit);URL.revokeObjectURL(img.src);ov.remove();render()}
 window.addEventListener('resize',fit);fit();paint();return ov})}

// ---------- report ----------
function reportData(jobId){return Promise.all([db.get('jobs',jobId),db.by('entries','jobId',jobId),db.by('costs','jobId',jobId),db.by('photos','jobId',jobId),jobData(jobId)]).then(function(r){return {crew:r[4].crew,labor:r[4].labor,mats:r[4].mats,job:r[0],ents:r[1].sort(function(a,b){return a.ts-b.ts}),costs:r[2].sort(function(a,b){return a.created-b.created}),photos:r[3].sort(function(a,b){return a.created-b.created})}})}
function reportHtml(d,src){var j=d.job,tot=0,sub={};d.costs.forEach(function(c){var t=oCost(c);tot+=t;sub[c.cat]=(sub[c.cat]||0)+t});
 var h='<h1>'+esc(j.name)+'</h1><div>'+esc(j.client||'')+'</div><div>'+esc(j.address||'')+(j.lat!=null?' · GPS '+j.lat+', '+j.lng:'')+'</div><div style="color:#555;font-size:13px">Status: '+esc(j.status)+(j.start?' · Start '+dOnly(j.start):'')+(j.end?' · Due '+dOnly(j.end):'')+' · Report '+dt(Date.now())+'</div>'+(j.notes?'<p style="white-space:pre-wrap">'+esc(j.notes)+'</p>':'');
 h+='<h2>Job walk entries ('+d.ents.length+')</h2>';
 d.ents.forEach(function(e){var ps=d.photos.filter(function(p){return p.entryId===e.id});h+='<div class="ent"><b>'+esc(e.area||'General')+'</b> <span style="color:#555;font-size:13px">'+dt(e.ts)+'</span>'+((e.tags||[]).length?' <i style="color:#555">['+e.tags.map(esc).join(', ')+']</i>':'')+
  (e.notes?'<p style="white-space:pre-wrap;margin:4px 0">'+esc(e.notes)+'</p>':'')+
  ((e.meas||[]).length?'<table><tr><th>Measurement</th><th class="r">Value</th></tr>'+e.meas.map(function(m){return '<tr><td>'+esc(m.label)+(m.est?' (estimate from photo scale)':'')+'</td><td class="r">'+esc(m.value)+' '+esc(m.unit)+'</td></tr>'}).join('')+'</table>':'')+
  ps.map(function(p){return '<div><img src="'+src(p)+'" alt="photo">'+(p.marked?'<div style="font-size:11px;color:#555">Marked-up photo (original kept on device)</div>':'')+'</div>'}).join('')+'</div>'});
 var t3=sums(d);h+='<h2>Labor</h2><table><tr><th>Date</th><th>Employee</th><th class="r">Hours</th><th class="r">Rate</th><th class="r">Cost</th></tr>'+d.labor.map(function(l){return '<tr><td>'+esc(dOnly(l.date))+'</td><td>'+esc(l.empName||crewName(d,l.empId))+(l.ot?' (OT x'+dec(num(l.otMult)||1.5)+')':'')+'</td><td class="r">'+qv(l.hours)+'</td><td class="r">'+mv(l.rate)+(num(l.burden)&&num(l.burden)!==1?' x'+dec(num(l.burden)):'')+'</td><td class="r">'+money(lCost(l))+'</td></tr>'}).join('')+'<tr><td colspan="4" class="r"><b>Labor subtotal</b></td><td class="r"><b>'+money(t3.L)+'</b></td></tr></table>';
 h+='<h2>Materials</h2><table><tr><th>Item</th><th>Supplier</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Total</th></tr>'+d.mats.map(function(m){return '<tr><td>'+esc(m.item)+'</td><td>'+esc(m.supplier||'')+'</td><td class="r">'+qv(m.qty)+' '+esc(m.unit||'')+'</td><td class="r">'+mv(m.price)+'</td><td class="r">'+money(mCost(m))+'</td></tr>'}).join('')+'<tr><td colspan="4" class="r"><b>Materials subtotal</b></td><td class="r"><b>'+money(t3.M)+'</b></td></tr></table>';
 h+='<h2>Other costs</h2><table><tr><th>Category</th><th>Description</th><th class="r">Qty</th><th class="r">Unit cost</th><th class="r">Total</th></tr>'+d.costs.map(function(c){return '<tr><td>'+esc(c.cat)+'</td><td>'+esc(c.desc)+'</td><td class="r">'+qv(c.qty)+' '+esc(c.unit||'')+'</td><td class="r">'+mv(c.unitCost)+'</td><td class="r">'+money(oCost(c))+'</td></tr>'}).join('')+
 CATS.filter(function(c){return sub[c]}).map(function(c){return '<tr><td colspan="4" class="r" style="text-transform:capitalize">'+c+' subtotal</td><td class="r">'+money(sub[c])+'</td></tr>'}).join('')+
 '<tr><td colspan="4" class="r"><b>Other costs subtotal</b></td><td class="r"><b>'+money(tot)+'</b></td></tr></table><h2>Job totals</h2><table><tr><td>Labor</td><td class="r">'+money(t3.L)+'</td></tr><tr><td>Materials</td><td class="r">'+money(t3.M)+'</td></tr><tr><td>Other costs</td><td class="r">'+money(t3.O)+'</td></tr><tr><td><b>Grand job total</b></td><td class="r"><b>'+money(t3.T)+'</b></td></tr></table>'+(j.bid&&j.bid.saved?'<p><b>Saved bid total: '+money(bidCalc(t3,j.bid).total)+'</b></p>':'')+'<p style="color:#777;font-size:11px;margin-top:16px">Papa\'s Shop · Job Walk report</p>';return h}
function openReport(jobId){return reportData(jobId).then(function(d){return openDoc(d.job.name+' job walk',function(){return reportHtml(d,function(p){return ourl(p.marked||p.blob)})},
 function(){return Promise.all(d.photos.map(function(p){return blobToDataURL(p.marked||p.blob).then(function(u){p._u=u})})).then(function(){return reportHtml(d,function(p){return p._u})})},(d.job.name||'job').replace(/[^\w-]+/g,'_')+'_jobwalk.html',function(){return reportText(d)})})}
function openDoc(title,liveHtml,fileHtml,fname,textFn){var ov=document.createElement('div');ov.className='jw-ov';
 ov.innerHTML='<div class="tb jw wrap"><button data-x style="min-height:40px">‹ Close</button><button data-p class="pri" style="min-height:40px">🖨 Print / PDF</button><button data-sh style="min-height:40px">Share</button><button data-dl style="min-height:40px">Save HTML</button></div><div class="jw-report">'+liveHtml()+'</div>';
 document.body.appendChild(ov);
 function file(){return fileHtml().then(function(body){var html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><style>'+CSS.match(/\.jw-report[^@]*/g).join('').replace(/\.jw-report /g,'')+'body{font-family:system-ui,sans-serif;padding:16px;color:#111}</style></head><body>'+body+'</body></html>';
   return new File([html],fname,{type:'text/html'})})}
 ov.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-x')){document.body.classList.remove('jw-printing');ov.remove()}
  else if(b.hasAttribute('data-p')){document.body.classList.add('jw-printing');setTimeout(function(){window.print();setTimeout(function(){document.body.classList.remove('jw-printing')},500)},50)}
  else if(b.hasAttribute('data-dl'))file().then(function(f){download(f,f.name)});
  else if(b.hasAttribute('data-sh'))file().then(function(f){var files=[f];if(navigator.canShare&&navigator.canShare({files:files}))return navigator.share({files:files,title:title}).catch(function(){});
    if(navigator.share)return navigator.share({title:title,text:textFn()}).catch(function(){});download(f,f.name);toast('Sharing not supported here, saved the file instead')})});
 return ov}
function reportText(d){var t=d.job.name+'\n'+(d.job.address||'')+'\n';d.ents.forEach(function(e){t+='\n'+(e.area||'General')+': '+(e.notes||'')});var t3=sums(d);return t+'\n\nLabor: '+money(t3.L)+'\nMaterials: '+money(t3.M)+'\nOther: '+money(t3.O)+'\nTotal: '+money(t3.T)}

// ---------- backup ----------
function exportJson(){return Promise.all(ALLS.map(function(s){return db.all(s)})).then(function(r){
 return Promise.all(r[3].map(function(p){return Promise.all([blobToDataURL(p.blob),p.marked?blobToDataURL(p.marked):null]).then(function(u){var o=Object.assign({},p);o.blob=u[0];o.marked=u[1];return o})})).then(function(ph){
  var data={app:'hhJobWalk',v:2,exported:new Date().toISOString(),jobs:r[0],entries:r[1],costs:r[2],photos:ph,crew:r[4],labor:r[5],mats:r[6]};
  var f=new File([JSON.stringify(data)],'jobwalk-backup-'+today()+'.json',{type:'application/json'});download(f,f.name);toast('Backup saved');return data})})}
function importJson(file){return file.text().then(function(t){var d=JSON.parse(t);if(d.app!=='hhJobWalk')throw new Error('Not a Job Walk backup');
 var ops=[];d.jobs.forEach(function(x){ops.push(db.put('jobs',x))});d.entries.forEach(function(x){ops.push(db.put('entries',x))});(d.costs||[]).forEach(function(x){ops.push(db.put('costs',x))});XSTORES.forEach(function(st){(d[st]||[]).forEach(function(x){ops.push(db.put(st,x))})});
 d.photos.forEach(function(p){p.blob=dataURLToBlob(p.blob);p.marked=p.marked?dataURLToBlob(p.marked):null;ops.push(db.put('photos',p))});
 return Promise.all(ops).then(function(){toast('Imported '+d.jobs.length+' job'+(d.jobs.length===1?'':'s'));render()})}).catch(function(e){toast('Import failed: '+e.message)})}

// ---------- mount ----------
function badMark(e){var t=e.target;if(!t||t.tagName!=='INPUT'||t.getAttribute('inputmode')!=='decimal')return;var v=t.value.trim(),n=parseFloat(v.replace(/[$,]/g,''));t.style.outline=badV(v)?'2px solid #ff4d4d':'';t.title=t.style.outline?'Must be 0 or more — counted as 0':''}
function mount(el){if(!document.getElementById('jw-css')){var s=document.createElement('style');s.id='jw-css';s.textContent=CSS;document.head.appendChild(s)}
 unmount();root=el;el.classList.add('jw');el.addEventListener('click',onClick);el.addEventListener('change',onChange);el.addEventListener('input',onChange);el.addEventListener('input',badMark);view=window.__jwOpen?{name:'job',id:window.__jwOpen}:{name:'list'};window.__jwOpen=null;return open().then(render)}
function unmount(){if(!root)return;root.removeEventListener('click',onClick);root.removeEventListener('change',onChange);root.removeEventListener('input',onChange);root.removeEventListener('input',badMark);root.classList.remove('jw');root.innerHTML='';freeUrls();root=null}

// ---------- public helpers (work without mount) ----------
function listJobs(all){return db.all('jobs').then(function(js){return js.filter(function(j){return all||j.status!=='Done'}).sort(function(a,b){return (b.updated||b.created||0)-(a.updated||a.created||0)})})}
function createJob(name,addr){var j={id:uid(),name:name,address:addr||'',status:'Active',start:today(),created:Date.now(),updated:Date.now()};return db.put('jobs',j)}
function pz(v){return v===''||v==null||!isFinite(parseFloat(v))?'':num(v)}
function addItems(jobId,it){it=it||{};return db.get('jobs',jobId).then(function(j){if(!j)throw new Error('Job not found');var t=Date.now(),k=0,ps=[];
 (it.materials||[]).forEach(function(m){ps.push(db.put('mats',{id:uid(),jobId:jobId,item:String(m.item||''),qty:m.qty===''||m.qty==null?1:num(m.qty),unit:m.unit||'',price:pz(m.price),supplier:m.supplier||'',src:m.src||'',created:t+(k++)}))});
 (it.labor||[]).forEach(function(l){ps.push(db.put('labor',{id:uid(),jobId:jobId,empId:null,empName:String(l.desc||l.name||'Labor'),date:l.date||today(),hours:num(l.hours),ot:false,rate:pz(l.rate),burden:1,otMult:1.5,created:t+(k++)}))});
 return Promise.all(ps).then(function(){return touchJob(jobId)}).then(function(){return j})})}
function openJob(id){if(root)go({name:'job',id:id});else window.__jwOpen=id}
window.JobWalk={version:VERSION,listJobs:listJobs,createJob:createJob,addItems:addItems,openJob:openJob,mount:mount,unmount:unmount,go:go,db:db,openReport:openReport,exportJson:exportJson,importJson:importJson,_util:{fracIn:fracIn,parseLen:parseLen,money:money,dec:dec}};
})();
