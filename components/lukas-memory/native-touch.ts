import * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/** Native iOS gestures update one camera, never hundreds of DOM elements.
 * Mouse/keyboard input stays with OrbitControls. Touch compatibility pointer
 * events are stopped before OrbitControls so a gesture cannot run twice. */
export function bindNativeBrainTouch(camera: THREE.PerspectiveCamera, controls: OrbitControls, surface: HTMLElement) {
  let previous: { x: number; y: number; distance: number; count: number } | null = null
  let damping = controls.enableDamping
  const offset = new THREE.Vector3(), pan = new THREE.Vector3(), side = new THREE.Vector3(), up = new THREE.Vector3()
  const spherical = new THREE.Spherical()
  const measure = (touches: TouchList) => {
    const a = touches[0], b = touches[1]
    return { x: b ? (a.clientX + b.clientX) / 2 : a.clientX, y: b ? (a.clientY + b.clientY) / 2 : a.clientY,
      distance: b ? Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) : 0, count: Math.min(touches.length, 2) }
  }
  const blockCompatibility = (event: PointerEvent) => {
    if (controls.enabled && event.pointerType === 'touch') event.stopImmediatePropagation()
  }
  const touch = (event: TouchEvent) => {
    if (!controls.enabled) { previous = null; return }
    if (event.cancelable) event.preventDefault()
    if (event.type === 'touchcancel' || !event.touches.length) {
      previous = null; controls.enableDamping = damping
      controls.dispatchEvent({ type: 'end' }); return
    }
    const next = measure(event.touches)
    if (event.type === 'touchstart' || !previous || previous.count !== next.count) {
      if (!previous) { damping = controls.enableDamping; controls.enableDamping = false; controls.dispatchEvent({ type: 'start' }) }
      previous = next; return
    }
    if (event.type === 'touchmove') {
      const height = Math.max(1, surface.clientHeight)
      offset.copy(camera.position).sub(controls.target)
      if (next.count === 1) {
        spherical.setFromVector3(offset)
        spherical.theta -= (next.x - previous.x) / height * Math.PI * 2 * controls.rotateSpeed
        spherical.phi -= (next.y - previous.y) / height * Math.PI * 2 * Math.abs(controls.rotateSpeed)
        spherical.makeSafe()
        camera.position.copy(controls.target).add(offset.setFromSpherical(spherical))
      } else {
        if (controls.enableZoom && previous.distance > 0 && next.distance > 0) {
          offset.multiplyScalar(previous.distance / next.distance).clampLength(controls.minDistance, controls.maxDistance)
          camera.position.copy(controls.target).add(offset)
        }
        if (controls.enablePan) {
          const units = 2 * offset.length() * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / height
          side.setFromMatrixColumn(camera.matrix, 0); up.setFromMatrixColumn(camera.matrix, 1)
          pan.copy(side).multiplyScalar(-(next.x - previous.x) * units).addScaledVector(up, (next.y - previous.y) * units)
          camera.position.add(pan); controls.target.add(pan)
        }
      }
      // The scene's animation loop performs the single controls update/render.
    }
    previous = next
  }
  const pointerTypes = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']
  const touchTypes = ['touchstart', 'touchmove', 'touchend', 'touchcancel']
  pointerTypes.forEach(type => surface.addEventListener(type, blockCompatibility as EventListener, true))
  touchTypes.forEach(type => surface.addEventListener(type, touch as EventListener, { passive: false }))
  return () => {
    pointerTypes.forEach(type => surface.removeEventListener(type, blockCompatibility as EventListener, true))
    touchTypes.forEach(type => surface.removeEventListener(type, touch as EventListener))
    controls.enableDamping = damping; previous = null
  }
}
