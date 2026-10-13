'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from './language-context'
import { EDITORIAL } from '@/lib/portfolio-editorial'
import { chapterAt, chapterOpacity, followProgress, smoothStep } from '@/lib/lukas-motion'
import { LukasBrain } from './lukas-brain'
import { regionIds } from './lukas-memory/regions'
import { useBrainData } from './lukas-memory/provider'
import { umfeld } from './lukas-memory/modell'
import type { Szene } from './lukas-memory/szene'
import { markLukasReached } from '@/lib/lukas-presence'
import { OPEN_CHAT_EVENT } from './lukas-voice-widget'
import styles from './portfolio.module.css'

gsap.registerPlugin(ScrollTrigger)
const REGIONS = [0, 1, 3, 2]

export function Lukas() {
  const { lang } = useLanguage()
  const t = EDITORIAL[lang].story
  const { graph } = useBrainData()
  const representatives = useMemo(() => graph ? regionIds(graph) : [], [graph])
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const target = useRef(0)
  const progress = useRef({ p: 0 })
  const scene = useRef<Szene | null>(null)
  const active = useRef(-1)
  const [reduced, setReduced] = useState(false)
  const onReady = useCallback((value: Szene | null) => { scene.current = value; active.current = -1 }, [])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!root.current || !stage.current || reduced || !graph) return
    const element = stage.current
    const chapters = Array.from(element.querySelectorAll<HTMLElement>('[data-story-beat]'))
    const title = element.querySelector<HTMLElement>('[data-story-title]')!
    const closing = element.querySelector<HTMLElement>('[data-story-closing]')!
    const bar = element.querySelector<HTMLElement>('[data-story-bar]')!
    const visible = new Set(graph.knoten.map(n => n.id))
    let inView = false
    const trigger = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom bottom',
      onUpdate: value => { target.current = value.progress },
      onRefresh: value => { target.current = value.progress },
      onToggle: value => { inView = value.isActive },
    })
    target.current = trigger.progress
    progress.current.p = trigger.progress
    inView = trigger.isActive
    const paint = (p: number) => {
      element.dataset.progress = p.toFixed(4)
      const set = (node: HTMLElement, opacity: number, y: number) => {
        node.style.opacity = opacity.toFixed(4)
        node.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`
        node.style.visibility = opacity < 0.001 ? 'hidden' : 'visible'
      }
      const entry = 1 - smoothStep((p - 0.045) / 0.05)
      set(title, entry, -14 * (1 - entry))
      chapters.forEach((node, i) => {
        const alpha = chapterOpacity(p, i)
        set(node, alpha, 18 * (1 - alpha) * (p < 0.19 + i * 0.2 ? 1 : -1))
      })
      const end = smoothStep((p - 0.89) / 0.07)
      set(closing, end, 16 * (1 - end))
      closing.style.pointerEvents = end > 0.8 ? 'auto' : 'none'
      bar.style.transform = `scaleX(${p.toFixed(5)})`
      const chapter = chapterAt(p)
      const selection = p < 0.1 || p > 0.88 ? -1 : chapter
      if (active.current !== selection && scene.current) {
        active.current = selection
        const selected = selection < 0 ? null : representatives[REGIONS[chapter]]
        scene.current.update({ sichtbar: visible, umfeld: umfeld(graph, selected, visible, 2), treffer: null, auswahl: selected, bewegung: true })
      }
      if (p >= 0.85) markLukasReached()
    }
    paint(progress.current.p)
    const tick = (_time: number, deltaMs: number) => {
      if (document.hidden || (!inView && Math.abs(progress.current.p - target.current) < 0.00005)) return
      progress.current.p = followProgress(progress.current.p, target.current, deltaMs / 1000)
      paint(progress.current.p)
    }
    gsap.ticker.add(tick)
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(frame); gsap.ticker.remove(tick); trigger.kill()
      ;[title, closing, ...chapters].forEach(node => {
        node.style.removeProperty('opacity'); node.style.removeProperty('visibility'); node.style.removeProperty('transform')
      })
      closing.style.removeProperty('pointer-events')
    }
  }, [reduced, graph, lang, representatives])
  const chat = () => { markLukasReached(); window.dispatchEvent(new Event(OPEN_CHAT_EVENT)) }
  return (
    <section id="lukas-story" ref={root} className={`${styles.story} ${reduced ? styles.storyStatic : ''}`} aria-label={t.title}>
      <div ref={stage} className={styles.storyStage}>
        <div className={styles.storyBrain}><LukasBrain progress={progress} onReady={onReady} /></div>
        <div className={styles.storyScrim} aria-hidden />
        <p className={styles.storyLabel}>{t.label}</p>
        <div className={styles.storyCopy}>
          <div data-story-title className={styles.storyChapter}><h2>{t.title}</h2><p>{t.intro}</p></div>
          {t.chapters.map((chapter, i) => <article key={chapter.title} data-story-beat className={styles.storyChapter}>
            <span className={styles.chapterNumber}>{String(i + 1).padStart(2, '0')} / 04</span><h3>{chapter.title}</h3><p>{chapter.body}</p>
          </article>)}
          <div data-story-closing className={styles.storyChapter}><h3>{t.closing}</h3><p>{t.closingBody}</p>
            <button className={styles.primaryLink} type="button" onClick={chat}>{t.cta}<span aria-hidden>↗</span></button>
          </div>
        </div>
        <div className={styles.storyProgress} aria-hidden><div data-story-bar /></div>
      </div>
    </section>
  )
}
