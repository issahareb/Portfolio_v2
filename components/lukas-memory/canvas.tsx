'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../language-context'
import { useNearViewport } from '../use-near-viewport'
import { EDITORIAL } from '@/lib/portfolio-editorial'
import type { BrainProgress } from '@/lib/lukas-motion'
import { BEREICHE, umfeld } from './modell'
import { REGION_NAMES, regionIds } from './regions'
import { useBrainData } from './provider'
import type { Szene } from './szene'
import { createSvgScene } from './svg-scene'
import styles from '../portfolio.module.css'

export function DashboardBrainCanvas({ progress, selected = null, motion = false, interactive = false, onSelect, onReady }: {
  progress?: BrainProgress; selected?: string | null; motion?: boolean; interactive?: boolean;
  onSelect?: (id: string | null) => void; onReady?: (scene: Szene | null) => void;
}) {
  const { lang } = useLanguage()
  const copy = EDITORIAL[lang].brain
  const { graph, room, status } = useBrainData()
  const visible = useMemo(() => new Set(graph?.knoten.map(node => node.id) ?? []), [graph])
  const indices = useMemo(() => new Map(graph?.knoten.map((node, i) => [node.id, i]) ?? []), [graph])
  const regionNodes = useMemo(() => graph ? regionIds(graph) : [], [graph])
  const { ref: frame, near } = useNearViewport<HTMLDivElement>('150px')
  const box = useRef<HTMLDivElement>(null)
  const labels = useRef<HTMLDivElement>(null)
  const scene = useRef<Szene | null>(null)
  const callbacks = useRef({ onSelect, onReady, interactive })
  callbacks.current = { onSelect, onReady, interactive }
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!frame.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' })
    observer.observe(frame.current)
    return () => observer.disconnect()
  }, [frame])
  useEffect(() => {
    if (!near || !inView || !graph || !room || !box.current || !labels.current) return
    let cancelled = false
    let current: Szene | null = null
    setReady(false)
    setFailed(false)
    const attach = (value: Szene) => {
      current = value
      scene.current = value
      value.interact(callbacks.current.interactive)
      callbacks.current.onReady?.(value)
      setReady(true)
    }
    const fallback = () => {
      if (cancelled || !box.current) return
      current?.dispose()
      box.current.replaceChildren()
      labels.current?.replaceChildren()
      try {
        attach(createSvgScene(box.current, graph, room, id => callbacks.current.onSelect?.(id), { progress, canvasLabel: copy.canvas }))
        setFailed(false)
      } catch { setFailed(true); callbacks.current.onReady?.(null) }
    }
    import('./szene').then(({ erschaffeSzene }) => {
      if (cancelled || !box.current || !labels.current) return
      try {
        attach(erschaffeSzene(box.current, labels.current, graph, room,
          id => callbacks.current.onSelect?.(id), fallback,
          { progress, canvasLabel: copy.canvas, regionNames: REGION_NAMES[lang], regionIds: regionNodes }))
      } catch { fallback() }
    }).catch(fallback)
    return () => { cancelled = true; current?.dispose(); scene.current = null; callbacks.current.onReady?.(null); setReady(false) }
  }, [near, inView, graph, room, progress, copy.canvas, lang, regionNodes])
  useEffect(() => {
    if (!scene.current || !graph || progress) return
    scene.current.update({ sichtbar: visible, umfeld: umfeld(graph, selected, visible, 2), treffer: null, auswahl: selected, bewegung: motion, invertiert: false })
  }, [selected, motion, ready, graph, visible, progress])
  useEffect(() => { if (!progress) scene.current?.fokus(selected) }, [selected, ready, progress])
  useEffect(() => { scene.current?.interact(interactive) }, [interactive, ready])
  return (
    <div ref={frame} className={`${styles.brainCanvas} ${ready && !failed ? styles.brainReady : ''}`} data-brain-ready={ready && !failed}>
      {graph && room ? <svg aria-hidden className={styles.brainFallback} viewBox="-150 -140 300 280">
        {graph.kanten.filter((_, i) => i % Math.max(1, Math.ceil(graph.kanten.length / 180)) === 0).map((edge, i) => {
          const a = indices.get(edge.von)!, b = indices.get(edge.nach)!
          return <line key={i} x1={room.positionen[a * 3]} y1={-room.positionen[a * 3 + 1]} x2={room.positionen[b * 3]} y2={-room.positionen[b * 3 + 1]} stroke={BEREICHE[room.regionen[a]].farbe} strokeOpacity="0.2" strokeWidth="0.3" />
        })}
        {graph.knoten.filter((_, i) => i % Math.max(1, Math.ceil(graph.knoten.length / 180)) === 0).map(node => {
          const i = indices.get(node.id)!
          return <circle key={node.id} cx={room.positionen[i * 3]} cy={-room.positionen[i * 3 + 1]} r={node.art === 'identitaet' ? 3 : 1.2} fill={BEREICHE[room.regionen[i]].farbe} />
        })}
      </svg> : <div className={styles.brainLoading}><p>{status === 'unavailable' ? copy.unavailable : copy.loading}</p></div>}
      <div ref={box} className={styles.brainMount} aria-hidden={!ready || failed} />
      <div ref={labels} className={styles.brainLabels} />
      {failed && !progress && <p className={styles.brainError}>{copy.fallback}</p>}
    </div>
  )
}
