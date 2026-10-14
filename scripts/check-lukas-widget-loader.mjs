import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function moduleAt(path, globals) {
  const output = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  const context = vm.createContext({ exports: {}, ...globals })
  vm.runInContext(output, context)
  return context.exports
}
let clock = 0, next = 0, widget = null, clicks = 0
const timers = new Map(), scripts = []
const window = {
  setTimeout(fn, delay) { const id = ++next; timers.set(id, { at: clock + delay, fn }); return id },
  clearTimeout(id) { timers.delete(id) },
}
function advance(ms) {
  clock += ms
  for (const [id, timer] of timers) if (timer.at <= clock) { timers.delete(id); timer.fn() }
}
const document = {
  querySelector(selector) { return widget?.[selector === '.lukas-panel' ? 'panel' : 'button'] ?? null },
  createElement() { return { setAttribute() {}, remove() { this.removed = true } } },
  body: { appendChild(script) { scripts.push(script) } },
}
const api = moduleAt('lib/lukas-widget-loader.ts', { window, document })
const first = api.loadLukasWidget('/widget.js', {})
assert.equal(first, api.loadLukasWidget('/widget.js', {}), 'Concurrent taps/preload share a single script')
let settled = false
first.then(() => { settled = true })
advance(12000)
await Promise.resolve()
assert.equal(settled, false, 'A slow connection remains pending beyond the old 4.5-second cutoff')
let open = false
widget = { panel: { classList: { contains() { return open } } }, button: { click() { clicks++; open = !open } } }
scripts[0].onload()
const ready = await first
api.showLukasWidget(ready); api.showLukasWidget(ready)
assert.equal(clicks, 1, 'Repeated open requests never toggle the panel closed')
assert.equal(open, true)
widget = null
const failed = api.loadLukasWidget('/widget.js', {})
const rejected = assert.rejects(failed, /could not be loaded/)
scripts[1].onerror()
await rejected
assert.equal(scripts[1].removed, true)
const retry = api.loadLukasWidget('/widget.js', {})
assert.equal(scripts.length, 3, 'Network errors allow a new attempt')
const timedOut = assert.rejects(retry, /timed out/)
advance(30000)
await timedOut
const afterTimeout = api.loadLukasWidget('/widget.js', {})
const afterRejected = assert.rejects(afterTimeout, /could not be loaded/)
scripts[3].onerror()
await afterRejected
assert.equal(timers.size, 0, 'Finished attempts clean up their timers')

const consent = moduleAt('lib/consent.ts', {
  window: { localStorage: { getItem() { throw Error('Storage blocked') }, setItem() { throw Error('Storage blocked') }, removeItem() { throw Error('Storage blocked') } }, dispatchEvent() {} },
  CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail } },
})
assert.equal(consent.hasConsent('lukas'), false)
consent.setConsent('lukas', true)
assert.equal(consent.hasConsent('lukas'), true, 'An explicit choice works even if Safari storage is unavailable')
assert.equal(consent.getConsent('analytics'), null, 'LUKAS consent does not grant analytics consent')
consent.setConsent('lukas', false)
assert.equal(consent.hasConsent('lukas'), false)
consent.resetConsent()
assert.equal(consent.readConsent(), null)
console.log('Passed: slow loading, concurrent requests, idempotent open, failure retry, timeout cleanup, blocked storage and consent withdrawal.')
