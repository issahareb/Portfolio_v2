'use client'

import { useEffect, type RefObject } from 'react'
import { animate, inView } from 'motion'

/** Progressive enhancement: no hidden server-rendered or first-screen copy. */
export function useAffiliateReveals(root: RefObject<HTMLDivElement | null>, language: string) {
  useEffect(() => {
    const page = root.current
    if (!page || typeof IntersectionObserver === 'undefined') return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (preference.matches) return
    const cleanups: (() => void)[] = []
    const elements = Array.from(page.querySelectorAll<HTMLElement>('[data-affiliate-reveal]'))

    for (const element of elements) {
      // Do not hide a visible element, including a restored scroll position.
      if (element.getBoundingClientRect().top < window.innerHeight) continue
      const saved = { opacity: element.style.opacity, transform: element.style.transform }
      const card = element.dataset.affiliateReveal === 'card'
      let animation: ReturnType<typeof animate> | undefined
      let finished = false
      const show = () => {
        finished = true
        animation?.stop()
        element.style.opacity = saved.opacity
        element.style.transform = saved.transform
      }
      const stop = inView(element, () => {
        if (finished || preference.matches) { show(); return }
        animation = animate(element,
          { opacity: [0, 1], transform: [card ? 'translateY(24px) scale(0.97)' : 'translateY(24px)', 'none'] },
          { duration: 0.6, delay: Number(element.dataset.revealDelay || 0), ease: [0.22, 1, 0.36, 1], onComplete: show },
        )
      }, { amount: 0.12 })
      element.style.opacity = '0'
      element.style.transform = card ? 'translateY(24px) scale(0.97)' : 'translateY(24px)'
      // Keyboard users must never land on an invisible contact action.
      element.addEventListener('focusin', show)
      cleanups.push(() => { stop(); show(); element.removeEventListener('focusin', show) })
    }
    const revealAll = () => { if (preference.matches) cleanups.forEach(cleanup => cleanup()) }
    preference.addEventListener('change', revealAll)
    return () => {
      preference.removeEventListener('change', revealAll)
      cleanups.forEach(cleanup => cleanup())
    }
  }, [root, language])
}
