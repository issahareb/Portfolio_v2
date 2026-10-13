'use client'

import { useEffect, useRef } from 'react'
import styles from './ambient-background.module.css'

/** One slow clock for all dark surfaces; only visible fields animate. */
export function AmbientBackground({ local = false }: { local?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = root.current
    if (!element) return
    const visible = new Set<Element>()
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const update = () => {
      const running = visible.size > 0 && !document.hidden && !connection?.saveData
      element.dataset.running = String(running)
      if (running) {
        // Re-entering picks up the common clock, without a JS frame loop.
        const time = Number(document.timeline.currentTime ?? 0)
        for (const animation of element.getAnimations({ subtree: true })) animation.currentTime = time % 48000
      }
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      update()
    }, { rootMargin: '160px' })
    const targets = local ? [element.parentElement!] : document.querySelectorAll('#main-content')
    targets.forEach(target => observer.observe(target))
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [local])
  return <div ref={root} data-ambient-background data-running="false" aria-hidden className={`${styles.field} ${local ? styles.local : ''}`}>
    <span className={styles.blue} /><span className={styles.violet} /><span className={styles.slate} />
  </div>
}
