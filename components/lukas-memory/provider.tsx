'use client'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLanguage } from '../language-context'
import { useNearViewport } from '../use-near-viewport'
import { parsePublicBrain, type PublicBrain } from '@/lib/public-brain'
import { brainGraph } from './regions'
import type { Gehirn, Raum } from './modell'

type BrainData = { graph: Gehirn | null; room: Raum | null; status: 'loading' | 'ready' | 'unavailable' }
const BrainContext = createContext<BrainData>({ graph: null, room: null, status: 'loading' })
export function BrainDataProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage()
  const { ref, near } = useNearViewport<HTMLDivElement>('400px')
  const [data, setData] = useState<PublicBrain | null>(null)
  const [room, setRoom] = useState<Raum | null>(null)
  const [failed, setFailed] = useState(false)
  const graph = useMemo(() => data ? brainGraph(data, lang) : null, [data, lang])
  useEffect(() => {
    if (!near) return
    const controller = new AbortController()
    fetch('/api/brain', { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Unavailable')
      return response.json()
    }).then(value => setData(parsePublicBrain(value))).catch(error => { if (error.name !== 'AbortError') setFailed(true) })
    return () => controller.abort()
  }, [near])
  useEffect(() => {
    if (!graph) return
    setRoom(null)
    const worker = new Worker(new URL('./layout.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = event => { if (event.data.room) setRoom(event.data.room); else setFailed(true); worker.terminate() }
    worker.onerror = () => { setFailed(true); worker.terminate() }
    worker.postMessage(graph)
    return () => worker.terminate()
  }, [graph])
  return <BrainContext.Provider value={{ graph, room, status: failed ? 'unavailable' : room ? 'ready' : 'loading' }}><div ref={ref}>{children}</div></BrainContext.Provider>
}
export const useBrainData = () => useContext(BrainContext)
