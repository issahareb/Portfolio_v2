'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { onConsentChange, setConsent, OPEN_CONSENT_EVENT } from '@/lib/consent'
import { startActivityTracker } from '@/lib/activity-tracker'

export function ActivityTracker() {
  const path=usePathname()
  const [open,setOpen]=useState(false)
  const [lang,setLang]=useState('de')
  useEffect(()=>{setLang(document.documentElement.lang.slice(0,2));let stop:((revoked?:boolean)=>void)|undefined
    const unsubscribe=onConsentChange(s=>{setOpen(s?.analytics==null);if(s?.analytics===true){if(!stop)stop=startActivityTracker(path)}else{stop?.(true);stop=undefined}})
    const show=()=>setOpen(true);window.addEventListener(OPEN_CONSENT_EVENT,show)
    return ()=>{unsubscribe();stop?.();window.removeEventListener(OPEN_CONSENT_EVENT,show)}
  },[path])
  const en=lang==='en',es=lang==='es'
  const title=en?'Optional website analytics':es?'Analítica web opcional':'Optionale Website-Analyse'
  const detail=en?'With your permission we measure active time, viewed sections, scroll stops, button positions, video use and form steps (including abandonment), but never your entered text or chats. A random visit ID in sessionStorage connects events for up to 30 minutes of inactivity. No cross-site matching. Data is available only in our private LUKAS dashboard, hosted by Railway in the USA, and deleted after 90 days at the next data ingestion. You can withdraw here at any time.':es?'Con tu permiso medimos tiempo activo, secciones vistas, pausas al desplazar, botones, vídeos y pasos de formularios (incluido abandono), nunca textos introducidos ni chats. Un identificador aleatorio en sessionStorage une eventos hasta 30 minutos de inactividad, sin seguimiento entre sitios. Datos solo en nuestro panel privado LUKAS, alojado por Railway en EE. UU.; eliminación tras 90 días en la siguiente recepción. Puedes retirar el permiso aquí.':'Mit deiner Zustimmung messen wir aktive Verweildauer, sichtbare Abschnitte, Scrollstopps, Buttonpositionen, Videonutzung und Formularschritte einschließlich Abbrüchen. Keine eingegebenen Texte oder Chats. Eine zufällige Besuchs-ID in sessionStorage verbindet Ereignisse bis zu 30 Minuten Inaktivität, ohne websiteübergreifende Zuordnung. Die Daten erscheinen nur in unserem privaten LUKAS-Dashboard, gehostet bei Railway in den USA. Löschung nach 90 Tagen bei der nächsten Datenannahme. Hier jederzeit widerrufbar.'
  const choose=(yes:boolean)=>{setConsent('analytics',yes);setOpen(false)}
  const button={border:'1px solid #777',borderRadius:8,padding:'10px 14px',background:'#202626',color:'#fff',cursor:'pointer'} as const
  return <div data-track-ignore>
    {open?<section role="dialog" aria-label={title} style={{position:'fixed',bottom:16,left:16,right:16,maxWidth:520,zIndex:99999,background:'#121818',color:'#fff',border:'1px solid #657974',borderRadius:16,padding:20,boxShadow:'0 10px 50px #0008',fontSize:14,lineHeight:1.5}}>
      <strong>{title}</strong><p style={{margin:'12px 0'}}>{detail}</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button style={button} onClick={()=>choose(false)}>{en?'Decline / withdraw':es?'Rechazar / retirar':'Ablehnen / widerrufen'}</button><button style={button} onClick={()=>choose(true)}>{en?'Allow analytics':es?'Permitir analítica':'Analyse erlauben'}</button></div>
    </section>:<button style={{...button,position:'fixed',bottom:8,left:8,zIndex:9999,fontSize:11,padding:'5px 9px'}} onClick={()=>setOpen(true)}>{en?'Analytics settings':es?'Ajustes de analítica':'Analyse-Einstellungen'}</button>}
  </div>
}
