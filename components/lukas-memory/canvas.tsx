'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../language-context'
import { useNearViewport } from '../use-near-viewport'
import { EDITORIAL } from '@/lib/portfolio-editorial'
import type { BrainProgress } from '@/lib/lukas-motion'
import { BEREICHE, lege, umfeld } from './modell'
import { createPublicBrain } from './demo'
import type { Szene } from './szene'
import styles from '../portfolio.module.css'

export function DashboardBrainCanvas({ progress, selected = null, motion = false, interactive = false, onSelect, onReady }: {
  progress?: BrainProgress; selected?: string | null; motion?: boolean; interactive?: boolean;
  onSelect?: (id: string | null) => void; onReady?: (scene: Szene) => void;
}) {
  const { lang } = useLanguage()
  const copy = EDITORIAL[lang].brain
  const graph = useMemo(() => createPublicBrain(lang), [lang])
  const room = useMemo(() => lege(graph), [graph])
  const visible = useMemo(() => new Set(graph.knoten.map(node => node.id)), [graph])
  const { ref: frame, near } = useNearViewport<HTMLDivElement>('600px')
  const box = useRef<HTMLDivElement>(null)
  const labels = useRef<HTMLDivElement>(null)
  const scene = useRef<Szene | null>(null)
  const callbacks = useRef({ onSelect, onReady })
  callbacks.current = { onSelect, onReady }
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!near || !box.current || !labels.current) return
    let cancelled = false
    let current: Szene | null = null
    setReady(false)
    setFailed(false)
    import('./szene').then(({ erschaffeSzene }) => {
      if (cancelled || !box.current || !labels.current) return
      try {
        current = erschaffeSzene(box.current, labels.current, graph, room,
          id => callbacks.current.onSelect?.(id), () => { setFailed(true); setReady(false) },
          { progress, canvasLabel: copy.canvas })
        scene.current = current
        current.interact(false)
        callbacks.current.onReady?.(current)
        setReady(true)
      } catch { setFailed(true) }
    }).catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true; current?.dispose(); scene.current = null }
  }, [near, graph, room, progress, copy.canvas])
  useEffect(() => {
    if (!scene.current || progress) return
    scene.current.update({ sichtbar: visible, umfeld: umfeld(graph, selected, visible, 2), treffer: null, auswahl: selected, bewegung: motion, invertiert: false })
  }, [selected, motion, ready, graph, visible, progress])
  useEffect(() => { if (!progress) scene.current?.fokus(selected) }, [selected, ready, progress])
  useEffect(() => { scene.current?.interact(interactive) }, [interactive, ready])
  return (
    <div ref={frame} className={`${styles.brainCanvas} ${ready && !failed ? styles.brainReady : ''}`} data-brain-ready={ready && !failed}>
      <svg aria-hidden={ready && !failed} className={styles.brainFallback} viewBox="-150 -140 300 280" role="img" aria-label={copy.canvas}>
        {graph.kanten.map((edge, i) => {
          const a = graph.knoten.findIndex(n => n.id === edge.von)
          const b = graph.knoten.findIndex(n => n.id === edge.nach)
          return <line key={i} x1={room.positionen[a * 3]} y1={-room.positionen[a * 3 + 1]} x2={room.positionen[b * 3]} y2={-room.positionen[b * 3 + 1]} stroke={BEREICHE[room.regionen[a]].farbe} strokeOpacity="0.2" strokeWidth="0.3" />
        })}
        {graph.knoten.map((node, i) => <circle key={node.id} cx={room.positionen[i * 3]} cy={-room.positionen[i * 3 + 1]} r={node.art === 'identitaet' ? 3 : 1.2} fill={BEREICHE[room.regionen[i]].farbe} />)}
      </svg>
      <div ref={box} className={styles.brainMount} aria-hidden={!ready || failed} />
      <div ref={labels} className={styles.brainLabels} />
      {failed && !progress && <p className={styles.brainError}>{copy.fallback}</p>}
    </div>
  )
}
