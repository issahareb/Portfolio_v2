'use client'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useLanguage, useT } from './language-context'
import { smoothStep } from '@/lib/lukas-motion'
import styles from './portfolio.module.css'
export type NameSequenceHandle = { setProgress: (progress: number) => void }
/** Soft word reveals with no decoding glyphs or flashing scan lines. */
export const NameSequence = forwardRef<NameSequenceHandle, { hero?: boolean }>(function NameSequence({ hero = false }, ref) {
  const t = useT()
  const { lang } = useLanguage()
  const root = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const apply = useRef((_: number) => {})
  useImperativeHandle(ref, () => ({ setProgress: value => apply.current(value) }), [])
  useEffect(() => {
    const words = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-name-word]') ?? [])
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    apply.current = value => {
      progress.current = value
      words.forEach((word, i) => {
        const alpha = reduced ? 1 : smoothStep((value - i * .18) / .32)
        word.style.opacity = String(alpha)
        word.style.transform = `translate3d(0,${(1 - alpha) * 18}px,0)`
      })
    }
    apply.current(progress.current)
    return () => { apply.current = () => {} }
  }, [lang])
  const Heading = hero ? 'h1' : 'h2'
  return <div ref={root} className={styles.personalName}>
    <p>{t.about.introTitle}</p>
    <Heading><span data-name-word className={styles.namePrelude}>{lang === 'de' ? 'Ich bin' : lang === 'es' ? 'Soy' : 'I am'}</span><span data-name-word>Issa Hareb.</span></Heading>
  </div>
})
