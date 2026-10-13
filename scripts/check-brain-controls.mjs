import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

// Exercise the no-WebGL renderer through its DOM events and public scene API.
class Element {
  children = []; attrs = {}; dataset = {}; style = {}; listeners = new Map(); captures = new Set()
  appendChild(child) { this.children.push(child); child.parentElement = this }
  setAttribute(key, value) { this.attrs[key] = value }
  addEventListener(key, fn) { this.listeners.set(key, fn) }
  removeEventListener(key) { this.listeners.delete(key) }
  getBoundingClientRect() { return { width: 400 } }
  setPointerCapture(id) { this.captures.add(id) }
  hasPointerCapture(id) { return this.captures.has(id) }
  releasePointerCapture(id) { this.captures.delete(id) }
  remove() { this.parentElement.children = this.parentElement.children.filter(x => x !== this) }
  dispatch(type, values) { this.listeners.get(type)?.({ type, target: this, pointerId: 1, clientX: 100, clientY: 100, buttons: 1, ...values }) }
}
let tick
const context = { document: { createElementNS: () => new Element(), hidden: false }, matchMedia: () => ({ matches: false }), requestAnimationFrame: fn => { tick = fn; return 1 }, cancelAnimationFrame: () => { tick = null } }
const compile = (path, require = () => ({})) => {
  const module = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  vm.runInNewContext(source, { ...context, module, exports: module.exports, require })
  return module.exports
}
const model = compile('components/lukas-memory/modell.ts')
const { createSvgScene } = compile('components/lukas-memory/svg-scene.ts', () => model)
const surface = new Element(), box = new Element()
surface.appendChild(box)
const graph = { knoten: [{ id: 'a', art: 'identitaet' }, { id: 'b', art: 'wissen' }], kanten: [{ von: 'a', nach: 'b' }] }
const room = { positionen: new Float32Array([40, 10, 25, -40, -10, -25]), regionen: new Uint8Array([0, 1]) }
let selected
const scene = createSvgScene(box, graph, room, id => { selected = id })
const svg = box.children[0], circle = svg.children.find(node => node.dataset.id === 'a')
const position = () => [circle.attrs.cx, circle.attrs.cy].join(',')
tick(16); const home = position()
scene.interact(true)
assert.equal(surface.style.touchAction, 'none')
surface.dispatch('pointerdown', {})
surface.dispatch('pointermove', { clientX: 170, clientY: 130 })
surface.dispatch('pointerup', { clientX: 170, clientY: 130 })
tick(32); assert.notEqual(position(), home, 'drag rotates the projection')
const rotated = position()
scene.zoom(.8); tick(48); assert.notEqual(position(), rotated, 'toolbar zoom changes projection')
scene.fokus(null); tick(64); assert.equal(position(), home, 'reset restores the overview')
surface.dispatch('pointerdown', {})
surface.dispatch('pointerdown', { pointerId: 2, clientX: 200 })
surface.dispatch('pointermove', { pointerId: 2, clientX: 250, clientY: 130 })
surface.dispatch('pointercancel', {})
surface.dispatch('pointerup', { pointerId: 2 })
tick(80); assert.notEqual(position(), home, 'two-finger pinch and pan changes projection')
assert.equal(selected, undefined, 'drag and multi-touch do not select nodes')
scene.interact(false); const paused = position()
surface.dispatch('pointerdown', {}); surface.dispatch('pointermove', { clientX: 300 }); tick(96)
assert.equal(position(), paused, 'scroll mode leaves projection unchanged')
assert.equal(surface.style.touchAction, 'pan-y')
scene.interact(true)
let prevented = false
surface.dispatch('wheel', { deltaY: -150, preventDefault: () => { prevented = true } }); tick(112)
assert.ok(prevented); assert.notEqual(position(), paused, 'wheel zoom works')
const touchEvent = (type, touches) => surface.dispatch(type, { cancelable: true, preventDefault: () => {}, changedTouches: touches.map(([identifier, clientX, clientY]) => ({ identifier, clientX, clientY, target: svg })) })
const beforeTouch = position()
touchEvent('touchstart', [[8, 100, 100]])
touchEvent('touchmove', [[8, 150, 120]])
touchEvent('touchend', [[8, 150, 120]])
tick(128); assert.notEqual(position(), beforeTouch, 'native touch drag rotates without pointer compatibility events')
const beforePinch = position()
touchEvent('touchstart', [[9, 100, 100], [10, 200, 100]])
touchEvent('touchmove', [[9, 75, 120], [10, 225, 120]])
touchEvent('touchend', [[9, 75, 120], [10, 225, 120]])
tick(144); assert.notEqual(position(), beforePinch, 'native pinch zoom and pan work')
for (const node of svg.children) for (const value of Object.values(node.attrs)) assert.ok(!/NaN|Infinity/.test(value))
scene.dispose()
assert.equal(box.children.length, 0); assert.equal(surface.listeners.size, 0); assert.equal(tick, null)
console.log('Brain controls: rotate, toolbar zoom, reset, pinch/pan, scroll mode, wheel and cleanup passed without WebGL.')
