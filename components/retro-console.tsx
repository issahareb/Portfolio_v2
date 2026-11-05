'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const modules = [
  { id: 'work', label: 'PROJECTS', title: 'Selected work', detail: 'Hareb Digital · LUKAS · GuardianGrid · TENSA · TaxiBB Essen', href: '#work' },
  { id: 'about', label: 'ABOUT', title: 'Issa Hareb', detail: 'Development, design and intelligent systems.', href: '#about' },
  { id: 'stack', label: 'SYSTEM', title: 'Technology', detail: 'Full-stack engineering · AI · 3D · Automation', href: '#stack' },
  { id: 'contact', label: 'CONTACT', title: 'Start a project', detail: 'Let’s build something useful.', href: '#contact' },
]

export function RetroConsole() {
  const [powered, setPowered] = useState(false)
  const [active, setActive] = useState(0)
  const reducedMotion = useReducedMotion()
  const duration = reducedMotion ? 0 : 0.85
  const selected = modules[active]

  return (
    <section aria-label="Interactive portfolio console" className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#11130f] px-4 py-24 text-[#f2eddf]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40" style={{background:'radial-gradient(ellipse at 50% 60%, #343b26 0%, transparent 58%)'}} />
      <motion.div layout transition={{duration, ease:[0.22,1,0.36,1]}} className="relative w-full max-w-[860px]" style={{perspective:1200}}>
        <motion.div layout transition={{duration}} className="relative rounded-[2.5rem] border border-[#fff9e8]/50 bg-[#e9e2d0] p-4 text-[#141612] shadow-[0_35px_100px_#000b,inset_0_3px_3px_#fff9e8] sm:p-7">
          <div className="mb-5 flex items-center justify-between px-2 font-mono text-[10px] font-bold tracking-[.3em] sm:text-xs">
            <span>HAREB / DIGITAL</span><span>IH—01 <span className="text-[#71813a]">●</span></span>
          </div>
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_140px]">
            <div className="relative overflow-hidden rounded-[1.5rem] border-[10px] border-[#252922] bg-[#0b100c] shadow-[inset_0_8px_25px_#000,0_3px_3px_#fff8]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 opacity-[.13]" style={{background:'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,#c8ff52 4px)'}} />
              <div className="relative flex min-h-[270px] flex-col justify-between p-6 sm:min-h-[330px] sm:p-9">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[.2em] text-[#c7ff54]"><span>ISSA HAREB / PORTFOLIO</span><span>{powered?'ONLINE':'STANDBY'}</span></div>
                {!powered ? <div><p className="mb-3 font-mono text-xs text-[#c7ff54]">READY TO EXPLORE_</p><h2 className="text-4xl font-semibold tracking-tight text-[#f3eedf] sm:text-6xl">Made to<br/>build.</h2><p className="mt-4 text-sm text-[#c0c5b8]">Press the illuminated power button.</p></div> :
                <motion.div initial={reducedMotion?false:{opacity:0,y:15}} animate={{opacity:1,y:0}} key={selected.id} className="py-5">
                  <p className="font-mono text-xs text-[#c7ff54]">0{active+1} / 04 — {selected.label}</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#f3eedf] sm:text-5xl">{selected.title}</h2>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#c0c5b8]">{selected.detail}</p>
                  <a className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#c7ff54] px-5 font-mono text-xs font-bold text-[#11130f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c7ff54]" href={selected.href}>EXPLORE ↗</a>
                </motion.div>}
                <div className="flex gap-1.5" aria-hidden="true">{[0,1,2,3].map(i=><span key={i} className={'h-1 w-7 rounded-full '+(powered&&i===active?'bg-[#c7ff54]':'bg-[#455143]')}/>)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-5 px-2 md:flex-col md:justify-center md:px-0">
              <button type="button" aria-label={powered?'Turn console off':'Turn console on'} aria-pressed={powered} onClick={()=>setPowered(!powered)} className={'grid size-20 shrink-0 place-items-center rounded-full border-[7px] border-[#292d25] font-mono text-3xl shadow-[0_5px_0_#777969,0_10px_20px_#0004] transition-all focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#c7ff54] active:translate-y-1 '+(powered?'bg-[#c7ff54] text-[#171a12] shadow-[0_0_38px_#c7ff54a0,0_5px_0_#777969]':'bg-[#b2c777] text-[#171a12] shadow-[0_0_24px_#c7ff5460,0_5px_0_#777969]')}>⏻</button>
              <div className="grid grid-cols-2 gap-2" aria-label="Console navigation">{modules.map((m,i)=><button key={m.id} type="button" disabled={!powered} aria-label={m.label} aria-pressed={powered&&active===i} onClick={()=>setActive(i)} className={'min-h-11 min-w-11 rounded-xl border border-[#777c6f] px-2 font-mono text-[9px] font-bold shadow-[0_3px_0_#777c6f] transition disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#485f13] '+(powered&&active===i?'bg-[#c7ff54]':'bg-[#c5c4b6]')}>{m.label}</button>)}</div>
            </div>
          </div>
          <motion.div initial={false} animate={{height:powered?42:8,opacity:powered?1:.55}} transition={{duration}} className="mt-5 overflow-hidden rounded-xl bg-[#292d25]">
            {powered&&<div className="flex h-full items-center justify-around gap-2 px-4 font-mono text-[9px] tracking-widest text-[#c7ff54]"><span>CORE ACTIVE</span><span>● SYSTEM READY</span><span>HAREB OS</span></div>}
          </motion.div>
          <div className="mt-4 flex items-center justify-between px-2 font-mono text-[9px] tracking-widest text-[#686b60]"><span>INTERACTIVE SYSTEM / 2026</span><span>DESIGNED IN ESSEN</span></div>
        </motion.div>
      </motion.div>
    </section>
  )
}
