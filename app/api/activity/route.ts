export const runtime = 'nodejs'
const limits = new Map<string,{at:number;n:number}>()
export async function POST(req:Request) {
  const origin=req.headers.get('origin')
  if(!['https://issahareb.me','https://www.issahareb.me',...(process.env.NODE_ENV==='development'?[new URL(req.url).origin]:[])].includes(origin||'')||req.headers.get('sec-fetch-site')==='cross-site')return new Response(null,{status:403})
  const now=Date.now()
  for(const [key,v] of limits)if(now-v.at>60000)limits.delete(key)
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown'
  const rate=limits.get(ip)||{at:now,n:0}
  if(++rate.n>180||limits.size>10000)return new Response(null,{status:429})
  limits.set(ip,rate)
  if(!process.env.ACTIVITY_WRITE_TOKEN)return new Response(null,{status:503})
  if(Number(req.headers.get('content-length'))>48000)return new Response(null,{status:413})
  try{
    const reader=req.body?.getReader();if(!reader)return new Response(null,{status:400})
    let size=0;const chunks:Uint8Array[]=[]
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>48000){await reader.cancel();return new Response(null,{status:413})}chunks.push(value)}
    let payload:Record<string,unknown>;try{payload=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{return new Response(null,{status:400})}
    const upstream=await fetch('https://lukas.issahareb.me/api/public/website-events',{method:'POST',headers:{'Content-Type':'application/json','x-activity-token':process.env.ACTIVITY_WRITE_TOKEN},body:JSON.stringify({...payload,site:'issahareb.me'}),signal:AbortSignal.timeout(7000),redirect:'error',cache:'no-store'})
    return new Response(null,{status:upstream.ok?202:upstream.status,headers:{'Cache-Control':'no-store'}})
  }catch{return new Response(null,{status:503})}
}
