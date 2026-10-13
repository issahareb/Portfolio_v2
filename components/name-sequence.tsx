'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useLanguage, useT } from './language-context'
import { smoothStep } from '@/lib/lukas-motion'
import styles from './portfolio.module.css'

export type NameSequenceHandle = { setProgress: (progress: number) => void }

/** One reversible scroll composition: invitation, then a floating signature. */
export const NameSequence = forwardRef<NameSequenceHandle, { hero?: boolean }>(function NameSequence({ hero = false }, ref) {
  const t = useT()
  const { lang } = useLanguage()
  const root = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const apply = useRef((_: number) => {})
  useImperativeHandle(ref, () => ({ setProgress: value => apply.current(value) }), [])

  useEffect(() => {
    const invitation = root.current?.querySelector<HTMLElement>('[data-name-invitation]')
    const prelude = root.current?.querySelector<HTMLElement>('[data-name-prelude]')
    const letters = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-name-letter]') ?? [])
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    apply.current = value => {
      progress.current = value
      const exit = preference.matches ? 0 : smoothStep((value - .10) / .16)
      if (invitation) {
        invitation.style.opacity = String(1 - exit)
        invitation.style.transform = `translate3d(0,${-24 * exit}px,0) scale(${1 - .035 * exit})`
      }
      const entrance = preference.matches ? 1 : smoothStep((value - .29) / .12)
      if (prelude) {
        prelude.style.opacity = String(entrance)
        prelude.style.transform = `translate3d(0,${(1 - entrance) * 24}px,0)`
      }
      letters.forEach((letter, i) => {
        const reveal = preference.matches ? 1 : smoothStep((value - .34 - i * .015) / .16)
        letter.style.opacity = String(reveal)
        letter.style.transform = `translate3d(${(1 - reveal) * (i - 4.5) * 3}px,${(1 - reveal) * 42}px,0) rotateX(${(1 - reveal) * -42}deg) rotateZ(${(1 - reveal) * (i % 2 ? 4 : -4)}deg)`
        letter.style.filter = reveal === 1 ? 'none' : `blur(${(1 - reveal) * 5}px)`
      })
    }
    const refresh = () => apply.current(progress.current)
    refresh()
    preference.addEventListener('change', refresh)
    return () => { preference.removeEventListener('change', refresh); apply.current = () => {} }
  }, [lang])

  const Heading = hero ? 'h1' : 'h2'
  const prelude = lang === 'de' ? 'Ich bin' : lang === 'es' ? 'Soy' : 'I am'
  return <div ref={root} className={styles.personalName}>
    <p data-name-invitation>{t.about.introTitle}</p>
    <Heading aria-label={`${prelude} Issa Hareb.`}>
      <span data-name-word data-name-prelude aria-hidden className={styles.namePrelude}>{prelude}</span>
      <span data-name-word aria-hidden className={styles.nameSignature}>
        {Array.from('Issa Hareb.').map((letter, i) => <span className={styles.nameLetter} key={i}><span data-name-letter>{letter === ' ' ? '\u00a0' : letter}</span></span>)}
      </span>
    </Heading>
  </div>
})
