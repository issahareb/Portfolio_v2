import { BEREICHE, type Gehirn, type Raum } from './modell'
import type { Szene } from './szene'
import type { BrainProgress } from '@/lib/lukas-motion'

let sceneId = 0

/** The same anonymous 3D positions, projected without requiring a GPU context. */
export function createSvgScene(box: HTMLDivElement, graph: Gehirn, room: Raum, select: (id: string | null) => void,
  options: { canvasLabel?: string; progress?: BrainProgress } = {}): Szene {
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('viewBox', '-200 -160 400 320')
  svg.setAttribute('aria-label', options.canvasLabel ?? 'L.U.K.A.S.')
  svg.setAttribute('role', 'img')
  svg.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y'
  box.appendChild(svg)
  const id = `neural-${++sceneId}`
  const defs = document.createElementNS(ns, 'defs')
  svg.appendChild(defs)
  BEREICHE.forEach((region, i) => {
    const gradient = document.createElementNS(ns, 'radialGradient')
    gradient.setAttribute('id', `${id}-${i}`)
    for (const [offset, opacity] of [['0%', '.6'], ['30%', '.2'], ['100%', '0']]) {
      const stop = document.createElementNS(ns, 'stop')
      stop.setAttribute('offset', offset); stop.setAttribute('stop-color', region.farbe); stop.setAttribute('stop-opacity', opacity)
      gradient.appendChild(stop)
    }
    defs.appendChild(gradient)
  })
  const surface = box.parentElement ?? box
  const originalTouch = surface.style.touchAction
  const indices = new Map(graph.knoten.map((node, i) => [node.id, i]))
  const stride = Math.max(1, Math.ceil(graph.knoten.length / 650))
  const nodeIndices = graph.knoten.flatMap((node, i) => i % stride === 0 || node.art === 'identitaet' ? [i] : [])
  const lines = graph.kanten.filter((_, i) => i % Math.max(1, Math.ceil(graph.kanten.length / 1000)) === 0).map(edge => {
    const el = document.createElementNS(ns, 'line')
    const a = indices.get(edge.von)!, b = indices.get(edge.nach)!
    el.setAttribute('stroke', BEREICHE[room.regionen[a]].farbe)
    el.setAttribute('stroke-opacity', '.25'); el.setAttribute('stroke-width', '.45')
    svg.appendChild(el)
    return { el, a, b }
  })
  const nodes = nodeIndices.map(i => {
    const halo = document.createElementNS(ns, 'circle')
    halo.setAttribute('fill', `url(#${id}-${room.regionen[i]})`)
    halo.setAttribute('pointer-events', 'none')
    svg.appendChild(halo)
    const el = document.createElementNS(ns, 'circle')
    el.setAttribute('fill', BEREICHE[room.regionen[i]].farbe)
    el.dataset.id = graph.knoten[i].id
    svg.appendChild(el)
    return { el, halo, i }
  })
  // A bounded number of signals adds life without filters or a second renderer.
  const pulses = lines.filter((_, i) => i % Math.max(1, Math.ceil(lines.length / 18)) === 0).map((line, i) => {
    const el = document.createElementNS(ns, 'circle')
    el.setAttribute('r', '1.3'); el.setAttribute('fill', '#f1e8ff'); el.setAttribute('pointer-events', 'none')
    svg.appendChild(el)
    return { el, line, phase: i * .618 % 1 }
  })
  let yaw = .12, pitch = -.08, scale = 1, panX = 0, panY = 0, active = false, moving = false
  let selected: string | null = null, disposed = false, dirty = true, frame = 0, previous = 0, lastProgress = -1
  let focus = [0, 0, 0]
  const radius = Math.max(25, ...graph.knoten.map((_, i) => Math.hypot(...room.positionen.slice(i * 3, i * 3 + 3))))
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const pointers = new Map<number, { x: number; y: number }>()
  let tap: { x: number; y: number; id?: string } | null = null
  const project = (i: number) => {
    const x = room.positionen[i * 3] - focus[0], y = room.positionen[i * 3 + 1] - focus[1], z = room.positionen[i * 3 + 2] - focus[2]
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw), rz = z * Math.cos(yaw) - x * Math.sin(yaw)
    const ry = y * Math.cos(pitch) - rz * Math.sin(pitch), depth = y * Math.sin(pitch) + rz * Math.cos(pitch)
    const perspective = 3 * radius / (3 * radius + depth)
    const unit = 122 / radius * scale * perspective
    return [rx * unit + panX, -ry * unit + panY, Math.max(.65, unit), Math.max(.18, Math.min(1, .62 - depth / radius * .42))]
  }
  let points = graph.knoten.map((_, i) => project(i))
  let lastPaint = 0, signalTime = 0
  const draw = (time: number) => {
    if (disposed) return
    const dt = Math.min(.05, (time - previous) / 1000 || .016); previous = time
    if (options.progress && lastProgress !== options.progress.current.p) {
      lastProgress = options.progress.current.p; yaw = .12 + lastProgress * Math.PI * 2; dirty = true
    }
    // 30 fps for ambient movement, full event responsiveness for direct gestures.
    const animate = moving && !reduced.matches && !document.hidden
    if (animate) { yaw += dt * .07; signalTime += dt; }
    if ((dirty || (animate && time - lastPaint > 32)) && !document.hidden) {
      lastPaint = time
      points = graph.knoten.map((_, i) => project(i))
      lines.forEach(({ el, a, b }) => {
        el.setAttribute('x1', String(points[a][0])); el.setAttribute('y1', String(points[a][1]))
        el.setAttribute('x2', String(points[b][0])); el.setAttribute('y2', String(points[b][1]))
        el.setAttribute('stroke-opacity', String(.07 + (points[a][3] + points[b][3]) * .17))
      })
      nodes.forEach(({ el, halo, i }) => {
        const point = points[i], chosen = graph.knoten[i].id === selected
        el.setAttribute('cx', String(point[0])); el.setAttribute('cy', String(point[1]))
        const r = (chosen ? 4 : graph.knoten[i].art === 'identitaet' ? 3 : 1.25) * point[2]
        el.setAttribute('r', String(r))
        el.setAttribute('opacity', String((chosen || !selected ? 1 : .5) * point[3]))
        halo.setAttribute('cx', String(point[0])); halo.setAttribute('cy', String(point[1]))
        halo.setAttribute('r', String(r * (chosen ? 7 : 5)))
        halo.setAttribute('opacity', String(point[3] * (selected && !chosen ? .25 : .85)))
      })
      pulses.forEach(({ el, line, phase }) => {
        const p = (signalTime * .16 + phase) % 1, a = points[line.a], b = points[line.b]
        el.setAttribute('cx', String(a[0] + (b[0] - a[0]) * p)); el.setAttribute('cy', String(a[1] + (b[1] - a[1]) * p))
        el.setAttribute('opacity', String(Math.sin(p * Math.PI) * .85))
      })
      dirty = false
    }
    frame = requestAnimationFrame(draw)
  }
  const zoom = (factor: number) => { if (!Number.isFinite(factor) || factor <= 0) return; scale = Math.max(.35, Math.min(12, scale / factor)); dirty = true }
  const down = (event: PointerEvent) => {
    if (!active || event.pointerType === 'touch') return
    if (event.pointerType !== 'direct-touch') surface.setPointerCapture(event.pointerId)
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    tap = pointers.size === 1 ? { x: event.clientX, y: event.clientY, id: (event.target as SVGElement).dataset.id } : null
    moving = false
  }
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    const old = pointers.get(event.pointerId)
    if (!active || !old) return
    const next = { x: event.clientX, y: event.clientY }
    const dx = next.x - old.x, dy = next.y - old.y
    if (tap && Math.hypot(next.x - tap.x, next.y - tap.y) > 6) tap = null
    const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)?.[1]
    if (other) {
      const before = Math.hypot(old.x - other.x, old.y - other.y), after = Math.hypot(next.x - other.x, next.y - other.y)
      if (before > 0 && after > 0) zoom(before / after)
    }
    if (other || event.button === 2 || event.buttons === 2 || event.shiftKey) {
      const unit = 400 / Math.max(1, svg.getBoundingClientRect().width)
      panX += dx * unit / (other ? 2 : 1); panY += dy * unit / (other ? 2 : 1)
    } else { yaw += dx * .008; pitch = Math.max(-1.45, Math.min(1.45, pitch + dy * .008)) }
    pointers.set(event.pointerId, next); dirty = true
  }
  const up = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return
    if (!pointers.has(event.pointerId)) return
    if (event.type === 'pointerup' && tap) select(tap.id ?? null)
    pointers.delete(event.pointerId); tap = null
    if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId)
  }
  const wheel = (event: WheelEvent) => { if (active) { event.preventDefault(); zoom(Math.exp(Math.max(-1, Math.min(1, event.deltaY * .001)))); moving = false } }
  const context = (event: Event) => { if (active) event.preventDefault() }
  // Safari gestures are handled directly, without relying on compatibility
  // pointer events or letting the page's scroll recognizer cancel the drag.
  const touch = (event: TouchEvent) => {
    if (!active) return
    if (event.cancelable) event.preventDefault()
    for (const point of Array.from(event.changedTouches)) {
      const input = { type: event.type === 'touchcancel' ? 'pointercancel' : 'pointerup', pointerType: 'direct-touch', pointerId: point.identifier, clientX: point.clientX, clientY: point.clientY, target: point.target, buttons: 1 } as PointerEvent
      if (event.type === 'touchstart') down(input)
      else if (event.type === 'touchmove') move(input)
      else up(input)
    }
  }
  for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) surface.addEventListener(type, touch as EventListener, { passive: false })
  surface.addEventListener('pointerdown', down); surface.addEventListener('pointermove', move)
  surface.addEventListener('pointerup', up); surface.addEventListener('pointercancel', up)
  surface.addEventListener('wheel', wheel, { passive: false }); surface.addEventListener('contextmenu', context)
  frame = requestAnimationFrame(draw)
  const fokus = (id: string | null) => {
    selected = id
    const i = id ? indices.get(id) : undefined
    focus = i === undefined ? [0, 0, 0] : [...room.positionen.slice(i * 3, i * 3 + 3)]
    scale = i === undefined ? 1 : 1.8; panX = 0; panY = 0
    if (i === undefined) { yaw = .12; pitch = -.08 }
    dirty = true
  }
  return {
    update: state => { selected = state.auswahl; moving = state.bewegung; dirty = true },
    interact: enabled => { active = enabled && !options.progress; surface.style.touchAction = active ? 'none' : 'pan-y'; svg.style.touchAction = surface.style.touchAction; svg.style.cursor = active ? 'grab' : ''; if (!active) { pointers.clear(); tap = null } },
    zoom, fokus, eintauchen: fokus,
    dispose: () => {
      disposed = true; cancelAnimationFrame(frame)
      surface.removeEventListener('pointerdown', down); surface.removeEventListener('pointermove', move)
      surface.removeEventListener('pointerup', up); surface.removeEventListener('pointercancel', up)
      surface.removeEventListener('wheel', wheel); surface.removeEventListener('contextmenu', context)
      for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) surface.removeEventListener(type, touch as EventListener)
      surface.style.touchAction = originalTouch; svg.remove()
    },
  }
}
