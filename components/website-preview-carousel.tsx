'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useLanguage } from './language-context'
import { PORTFOLIO_COPY } from '@/lib/portfolio-copy'
import styles from './website-preview-carousel.module.css'
import { PortfolioVideo } from './portfolio-video'
import { AmbientBackground } from './ambient-background'

/** Adapted from Harebdigital's WebsiteShowcase (1cc76f3), using our local archive. */
const PREVIEWS = ['IRIS_AI', 'MachinaFusion', 'Jacket Masters'].map((name, i) => ({
  name, poster: `/videos/schau-${i + 1}.jpg`, video: `/videos/schau-${i + 1}.mp4`,
}))
const LABELS = {
  de: { previous: 'Vorherige Vorschau', next: 'Nächste Vorschau', carousel: 'Webseitenvorschauen', scroll: 'Scrollen, um die Vorschauen zu entdecken', swipe: 'Wischen oder die Pfeile verwenden' },
  en: { previous: 'Previous preview', next: 'Next preview', carousel: 'Website previews', scroll: 'Scroll to explore the previews', swipe: 'Swipe or use the arrows' },
  es: { previous: 'Vista previa anterior', next: 'Siguiente vista previa', carousel: 'Vistas previas de webs', scroll: 'Desplázate para explorar las vistas previas', swipe: 'Desliza o usa las flechas' },
}
const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function WebsitePreviewCarousel() {
  const { lang } = useLanguage()
  const copy = PORTFOLIO_COPY[lang].work
  const labels = LABELS[lang]
  const titleId = useId()
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const surround = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const distance = useRef(0)
  const position = useRef(0)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (!mounted) return
    const section = root.current, frame = stage.current, strip = rail.current, windowEl = viewport.current
    if (!section || !frame || !strip || !windowEl) return
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let request = 0, enabled = false, stickyTop = 0, focused = false
    const select = (amount: number) => {
      const index = Math.round(amount * (PREVIEWS.length - 1))
      // Hysteresis keeps small finger movements from repeatedly changing the active clip.
      if (index !== position.current && Math.abs(amount * (PREVIEWS.length - 1) - position.current) > 0.58) {
        position.current = index; setActive(index)
      }
      bar.current?.style.setProperty('--progress', String(amount))
    }
    const draw = () => {
      request = 0
      const rect = section.getBoundingClientRect()
      const focus = document.hidden ? 0 : Math.min(clamp((innerHeight * .88 - rect.top) / (innerHeight * .45)), clamp((rect.bottom - stickyTop) / (innerHeight * .65)))
      surround.current?.style.setProperty('opacity', String(focus * .88))
      const nowFocused = focus > .5
      if (nowFocused !== focused) {
        focused = nowFocused
        document.documentElement.dataset.workFocus = String(focused)
        window.dispatchEvent(new Event('portfolio-focus-change'))
      }
      if (!enabled) return
      const amount = clamp((stickyTop - rect.top) / Math.max(1, distance.current))
      strip.style.transform = `translate3d(${-amount * distance.current}px,0,0)`
      select(amount)
    }
    const schedule = () => { if (!request) request = requestAnimationFrame(draw) }
    const measure = () => {
      const top = parseFloat(getComputedStyle(frame).top) || 0
      stickyTop = top
      const style = getComputedStyle(frame)
      const content = Array.from(frame.children).filter(child => !child.hasAttribute('data-ambient-background'))
      const contentHeight = content.reduce((height, child) => height + (child as HTMLElement).offsetHeight, 0)
        + Math.max(0, content.length - 1) * (parseFloat(style.rowGap) || 0)
        + (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0)
      enabled = !preference.matches && innerHeight > 600 && innerHeight - top >= contentHeight
      distance.current = (strip.lastElementChild as HTMLElement)?.offsetLeft || 0
      section.style.setProperty('--distance', `${distance.current}px`)
      section.dataset.pinned = String(enabled)
      setPinned(enabled)
      if (!enabled) {
        strip.style.transform = ''
        select(clamp(windowEl.scrollLeft / Math.max(1, distance.current)))
      } else windowEl.scrollLeft = 0
      draw()
    }
    const resize = new ResizeObserver(measure)
    resize.observe(windowEl)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    document.addEventListener('visibilitychange', schedule)
    preference.addEventListener('change', measure)
    measure()
    return () => {
      cancelAnimationFrame(request); resize.disconnect()
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure)
      preference.removeEventListener('change', measure)
      document.removeEventListener('visibilitychange', schedule)
      delete document.documentElement.dataset.workFocus
      window.dispatchEvent(new Event('portfolio-focus-change'))
    }
  }, [mounted])

  const moveTo = (index: number) => {
    const next = Math.max(0, Math.min(PREVIEWS.length - 1, index))
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (pinned && root.current && stage.current) {
      const top = parseFloat(getComputedStyle(stage.current).top) || 0
      const target = scrollY + root.current.getBoundingClientRect().top - top + distance.current * next / (PREVIEWS.length - 1)
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number) => void } }).__lenis
      if (lenis) lenis.scrollTo(target)
      else window.scrollTo({ top: target, behavior: reduced ? 'instant' : 'smooth' })
    } else {
      const card = rail.current?.children[next] as HTMLElement | undefined
      if (card) viewport.current?.scrollTo({ left: card.offsetLeft, behavior: reduced ? 'instant' : 'smooth' })
    }
  }

  return (
    <section id="hareb-designarchiv" ref={root} className={styles.showcase} aria-labelledby={titleId} data-pinned="false">
      {mounted && createPortal(<div ref={surround} className={styles.surround} aria-hidden />, document.body)}
      <div ref={stage} className={styles.stage}>
        <AmbientBackground local />
        <div className={styles.heading}><h4 id={titleId}>{copy.archiveTitle}</h4><p>{copy.archiveBody}</p></div>
        <div ref={viewport} className={styles.viewport} role="group" aria-roledescription={labels.carousel} aria-label={copy.archiveTitle} tabIndex={0}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); moveTo(active + (event.key === 'ArrowRight' ? 1 : -1)) }
          }}
          onScroll={() => {
            if (pinned || !viewport.current) return
            const amount = clamp(viewport.current.scrollLeft / Math.max(1, distance.current))
            const index = Math.round(amount * (PREVIEWS.length - 1))
            position.current = index; setActive(index); bar.current?.style.setProperty('--progress', String(amount))
          }}>
          <div ref={rail} className={styles.rail}>
            {PREVIEWS.map((preview, i) => <article key={preview.name} className={styles.card} aria-label={`${i + 1} / ${PREVIEWS.length}: ${preview.name}`}>
              <div className={styles.media}><PortfolioVideo src={preview.video} poster={preview.poster} label={`${preview.name} — ${copy.previewLabel}`} active={i === active} /></div>
              <div className={styles.caption}><h5>{preview.name}</h5><span>{copy.previewLabel}</span></div>
            </article>)}
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.status}><span aria-live="polite">{String(active + 1).padStart(2, '0')} / 03</span><span ref={bar} className={styles.progress} aria-hidden><i /></span></div>
          <p className={styles.hint}>{pinned ? labels.scroll : labels.swipe}</p>
          <div className={styles.buttons}>
            <button type="button" onClick={() => moveTo(active - 1)} disabled={active === 0} aria-label={labels.previous}><ArrowLeft size={20} aria-hidden /><span>{lang === 'de' ? 'Zurück' : lang === 'en' ? 'Back' : 'Atrás'}</span></button>
            <button type="button" onClick={() => moveTo(active + 1)} disabled={active === PREVIEWS.length - 1} aria-label={labels.next}><span>{lang === 'de' ? 'Weiter' : lang === 'en' ? 'Next' : 'Siguiente'}</span><ArrowRight size={20} aria-hidden /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
