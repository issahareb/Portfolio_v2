/** Consent-gated first-party telemetry. Never reads field values or query strings. */
export function startActivityTracker(path: string) {
  if (navigator.doNotTrack === '1' || (navigator as Navigator & {globalPrivacyControl?: boolean}).globalPrivacyControl) return () => {}
  const uuid = () => crypto.randomUUID()
  let session = uuid(), page = uuid(), order = 0, alive = true, busy = false
  let last = Date.now(), tickAt = last, seconds = 0, maxDepth = 0, milestone = 0
  try { const s = JSON.parse(sessionStorage.getItem('portfolio-visit') || 'null'); if (s && Date.now()-s.at < 1800000) session=s.id } catch {}
  const remember = () => { try { sessionStorage.setItem('portfolio-visit',JSON.stringify({id:session,at:Date.now()})) } catch {} }
  remember()
  type Data = Record<string,string|number>
  type E = {id:string;event:string;at:number;data:Data}
  let queue:E[]=[]
  const ignored = (e:Element) => !!e.closest('[data-track-ignore],[contenteditable],#lukas-widget,#lukas-panel,.lukas-w,.lukas-widget,.lw-root,.lukas-root')
  const clean = (s:string) => s.replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,160)
  const section = (e:Element|null) => {
    const el=e?.closest('[data-track-section],section,header,footer,article')
    return el ? clean(el.getAttribute('data-track-section') || el.id || `${el.tagName.toLowerCase()}-${Array.from(document.querySelectorAll(el.tagName)).indexOf(el)}`) : 'page'
  }
  const current = () => section(document.elementFromPoint(innerWidth/2,innerHeight*.45))
  const depth = () => Math.round(Math.min(100,Math.max(0,(scrollY+innerHeight)/Math.max(innerHeight,document.documentElement.scrollHeight)*100)))
  const target = (el:Element) => { const id=el.getAttribute('data-track-id') || el.id; const peers=id?Array.from(document.querySelectorAll('[data-track-id], [id]')).filter(e=>(e.getAttribute('data-track-id')||e.id)===id):[];return clean(id ? id+(peers.length>1?'-'+peers.indexOf(el):'') : `${el.tagName.toLowerCase()}-${Array.from(document.querySelectorAll('a,button,[role=button],summary,form,video')).indexOf(el)}`) }
  const emit = (event:string,data:Data={}) => { if(alive) {queue.push({id:uuid(),event,at:Date.now(),data:{...data,order:order++}}); if(queue.length>200)queue.shift()} }
  const flush = async (beacon=false) => {
    if(!alive || !queue.length || (busy&&!beacon))return
    const events=queue.splice(0,40), old=session
    const body=JSON.stringify({version:1,session,page,path,events})
    if(beacon && navigator.sendBeacon('/api/activity/',new Blob([body],{type:'application/json'})))return
    busy=true
    try { const r=await fetch('/api/activity/',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true,signal:AbortSignal.timeout(8000)}); if(!r.ok)throw new Error() }
    catch { if(alive&&session===old)queue=[...events,...queue].slice(-200) }
    finally {busy=false}
  }
  const view = () => { let referrer='';try {referrer=new URL(document.referrer).hostname}catch{};emit('page_view',{referrer,device:innerWidth<768?'mobile':innerWidth<1024?'tablet':'desktop',width:innerWidth,height:innerHeight}) }
  const activeSections = new Map<string,number>(), seen=new Set<string>()
  const checkpoint = () => {emit('engagement',{seconds,depth:maxDepth,currentDepth:depth(),section:current()});for(const [section,seconds] of activeSections)emit('section_time',{section,seconds});activeSections.clear()}
  const touch = () => {
    if(Date.now()-last>1800000){queue=[];session=uuid();page=uuid();seconds=0;order=0;maxDepth=0;milestone=0;seen.clear();activeSections.clear();view()}
    last=Date.now();remember()
  }
  const listeners:Array<()=>void>=[]
  const on=(obj:EventTarget,name:string,fn:EventListener,capture=false)=>{obj.addEventListener(name,fn,{capture,passive:true});listeners.push(()=>obj.removeEventListener(name,fn,capture))}
  for(const name of ['pointerdown','keydown','touchstart'])on(document,name,touch)
  let scrollTimer:ReturnType<typeof setTimeout>|undefined
  on(window,'scroll',()=>{touch();clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{emit('scroll_stop',{section:current(),depth:depth(),maxDepth,scrollY:Math.round(scrollY)});void flush()},900)})
  on(document,'click',e=>{const el=(e.target as Element)?.closest?.('a,button,[role=button],summary');if(!el||ignored(el))return;let destination='';const href=el.getAttribute('href');if(href)try{const u=new URL(href,location.href);destination=['mailto:','tel:'].includes(u.protocol)?u.protocol:['https:','http:'].includes(u.protocol)?u.origin+u.pathname:''}catch{};const m=e as MouseEvent;emit('click',{section:section(el),target:target(el),destination:destination.slice(0,240),x:Math.round(m.clientX/innerWidth*100),y:Math.round((m.clientY+scrollY)/document.documentElement.scrollHeight*100)});void flush(true)})
  const forms=new Map<HTMLFormElement,{id:string;field:string;success:boolean}>()
  const formEvent=(e:Event,kind:string)=>{const el=e.target as HTMLInputElement;const form=el instanceof HTMLFormElement?el:el.form;if(!form||ignored(form)||ignored(el))return;let f=forms.get(form);if(!f){f={id:uuid(),field:'',success:false};forms.set(form,f);emit('form_start',{form:f.id,target:target(form)})}const field=clean(el.name||el.id||'');if(kind==='form_field'&&f.field===field)return;f.field=field;emit(kind,{form:f.id,target:target(form),field});void flush()}
  on(document,'input',e=>formEvent(e,'form_field'),true)
  on(document,'change',e=>formEvent(e,'form_field'),true)
  on(document,'invalid',e=>formEvent(e,'form_invalid'),true)
  on(document,'submit',e=>formEvent(e,'form_attempt'),true)
  on(window,'hd-form-result',e=>{const {form,ok}=(e as CustomEvent).detail||{};const f=forms.get(form);if(!f||f.success)return;f.success=ok===true;emit(ok?'form_success':'form_error',{form:f.id,target:target(form),field:f.field});void flush(true)})
  for(const name of ['play','pause','ended'])on(document,name,e=>{const el=e.target;if(el instanceof HTMLVideoElement&&!ignored(el)){emit('video_'+name,{target:target(el),section:section(el),seconds:Math.round(el.currentTime),muted:el.muted?1:0});void flush()}},true)
  view();void flush()
  const tick=setInterval(()=>{const now=Date.now(),delta=Math.min(2,(now-tickAt)/1000);tickAt=now;if(document.visibilityState!=='visible'||!document.hasFocus()||now-last>30000)return;seconds+=delta;const s=current();activeSections.set(s,(activeSections.get(s)||0)+delta);if(!seen.has(s)){seen.add(s);emit('section_view',{section:s})}maxDepth=Math.max(maxDepth,depth());while(milestone+5<=maxDepth){milestone+=5;emit('scroll_depth',{depth:milestone,section:s})}},1000)
  const send=setInterval(()=>{if(document.visibilityState==='visible'&&document.hasFocus()&&Date.now()-last<30000){checkpoint();void flush()}},5000)
  on(document,'visibilitychange',()=>{if(document.visibilityState==='hidden'){checkpoint();void flush(true)}})
  on(window,'pagehide',()=>{checkpoint();emit('page_exit',{seconds,depth:maxDepth,currentDepth:depth(),section:current()});void flush(true)})
  return (revoked=false) => {if(!revoked){checkpoint();emit('page_exit',{seconds,depth:maxDepth,currentDepth:depth(),section:current()});void flush(true)}alive=false;queue=[];clearInterval(tick);clearInterval(send);clearTimeout(scrollTimer);listeners.forEach(f=>f());if(revoked)try{sessionStorage.removeItem('portfolio-visit')}catch{}}
}
