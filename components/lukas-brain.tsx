'use client'
import { DashboardBrainCanvas } from './lukas-memory/canvas'
import type { BrainProgress } from '@/lib/lukas-motion'
import type { Szene } from './lukas-memory/szene'
/** Scroll and exploration share the dashboard's original neurons and fibers. */
export function LukasBrain({ progress, onReady }: { progress: BrainProgress; onReady?: (scene: Szene) => void }) {
  return <DashboardBrainCanvas progress={progress} onReady={onReady} />
}
