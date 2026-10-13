'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { ArrowDown, Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react'
import { Reveal } from './anim'
import { useLanguage } from './language-context'
import { EDITORIAL } from '@/lib/portfolio-editorial'
import { BEREICHE, bereich } from './lukas-memory/modell'
import { createPublicBrain, REGION_NAMES } from './lukas-memory/demo'
import { DashboardBrainCanvas } from './lukas-memory/canvas'
import type { Szene } from './lukas-memory/szene'
import { handleAnchorClick } from '@/lib/scroll-to'
import styles from './portfolio.module.css'

export function LukasOverview() {
  const { lang } = useLanguage()
  const t = EDITORIAL[lang].brain
  const graph = useMemo(() => createPublicBrain(lang), [lang])
  const [selected, setSelected] = useState<string | null>(null)
  const [interactive, setInteractive] = useState(false)
  const [motion, setMotion] = useState(false)
  const scene = useRef<Szene | null>(null)
  const onReady = useCallback((value: Szene) => { scene.current = value }, [])
  const index = selected ? bereich(graph.knoten.find(n => n.id === selected)?.art ?? 'erinnerung') : -1
  return (
    <section id="lukas" className={styles.brainSection} aria-labelledby="brain-heading">
      <Reveal className={styles.sectionIntro}>
        <p className={styles.eyebrow}>{t.label}</p>
        <h2 id="brain-heading">{t.title}</h2><p>{t.intro}</p>
      </Reveal>
      <Reveal y={24} className={styles.lukasDemo}>
        <figure className={styles.mobileRecording}>
          <video controls playsInline preload="none" poster="/videos/lukas-interface.jpg" width={640} height={1318} aria-label={t.videoTitle}>
            <source src="/videos/lukas-interface.mp4" type="video/mp4" />
            <a href="/videos/lukas-interface.mp4">{t.videoTitle}</a>
          </video>
          <figcaption>{t.videoCaption}</figcaption>
        </figure>
        <div className={styles.demoCopy}><p className={styles.eyebrow}>{t.videoLabel}</p><h3>{t.videoTitle}</h3><p>{t.videoBody}</p></div>
      </Reveal>
      <Reveal y={24} className={styles.brainExhibit}>
        <div className={styles.brainToolbar}>
          <span className={styles.sampleLabel}>{t.sample}</span>
          <div className={styles.brainActions}>
            <button type="button" aria-label={t.closer} onClick={() => scene.current?.zoom(0.8)}><Plus size={17} /></button>
            <button type="button" aria-label={t.farther} onClick={() => scene.current?.zoom(1.25)}><Minus size={17} /></button>
            <button type="button" aria-label={t.reset} onClick={() => { setSelected(null); scene.current?.fokus(null) }}><RotateCcw size={17} /></button>
            <button type="button" aria-label={motion ? t.pause : t.play} aria-pressed={motion} onClick={() => setMotion(value => !value)}>{motion ? <Pause size={17} /> : <Play size={17} />}</button>
          </div>
        </div>
        <div className={styles.brainStage} data-lenis-prevent={interactive ? 'true' : undefined}>
          <DashboardBrainCanvas selected={selected} interactive={interactive} motion={motion} onSelect={setSelected} onReady={onReady} />
          <button className={styles.exploreButton} type="button" aria-pressed={interactive} onClick={() => setInteractive(value => !value)}>{interactive ? t.finish : t.explore}</button>
        </div>
        <div className={styles.brainLegend} aria-label={t.hint}>
          {REGION_NAMES[lang].map((name, i) => <button key={name} type="button" aria-pressed={index === i} onClick={() => setSelected(index === i ? null : `region-${i}`)}><span style={{ background: BEREICHE[i].farbe }} aria-hidden />{name}</button>)}
        </div>
        <p className={styles.brainContext} aria-live="polite">{index < 0 ? t.hint : t.regions[index]}</p>
      </Reveal>
      <a className={styles.textLink} href="#lukas-story" onClick={e => handleAnchorClick(e, '#lukas-story', -90)}>{t.storyLink}<ArrowDown size={17} aria-hidden /></a>
    </section>
  )
}
