import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'

// Run the real component effect with a changing browser viewport and fixed
// svh layout, as happens when Safari expands its address bar mid-scroll.
const source = ts.transpileModule(fs.readFileSync('components/about-intro.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText
const root = { offsetHeight: 2100 }, stage = { offsetHeight: 700 }
const seeks = [], effects = [], tickers = new Set()
const refs = [{ current: root }, { current: stage }, { current: .6 },
  { current: { seek: p => seeks.push(p) } }, { current: { setProgress() {} } }]
let refIndex = 0, config, progress = .65, killed = false
const trigger = { progress, isActive: true, kill() { killed = true } }
const scroll = { create(value) { config = value; return trigger }, refresh() {} }
const module = { exports: {} }
const window = { innerHeight: 700, requestAnimationFrame() { return 1 }, cancelAnimationFrame() {},
  matchMedia() { return { matches: false, addEventListener() {}, removeEventListener() {} } } }
vm.runInNewContext(source, { module, exports: module.exports, document: { hidden: false }, window,
  require(name) {
    if (name === 'react') return { useRef: () => refs[refIndex++], useState: () => [false, () => {}], useEffect: fn => effects.push(fn) }
    if (name === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null }
    if (name === 'gsap') return { gsap: { registerPlugin() {}, ticker: { add: fn => tickers.add(fn), remove: fn => tickers.delete(fn) } } }
    if (name === 'gsap/ScrollTrigger') return { ScrollTrigger: scroll }
    if (name === './use-near-viewport') return { useNearViewport: () => ({ ref: { current: null }, near: true }) }
    if (name === '@/lib/lukas-motion') return { followProgress: (a,b) => a + (b-a)*.5 }
    return {}
  },
})
module.exports.AboutIntro({ hero: true })
const cleanup = effects[1]()
assert.deepEqual(seeks, [.65], 'mount at restored scroll must not enqueue frame zero')
assert.equal(config.end(), '+=1400')
window.innerHeight = 780
assert.equal(config.end(), '+=1400', 'toolbar collapse must not move the video endpoint')
window.innerHeight = 700
assert.equal(config.end(), '+=1400', 'toolbar expansion must not move the video endpoint')
config.onRefresh({ progress: .65 })
for (const tick of tickers) tick(1,16)
assert.equal(seeks.at(-1), .65, 'refresh at unchanged scroll keeps the same frame')
assert.equal(seeks.length, 1, 'stationary visible intro must not keep rendering');
config.onUpdate({ progress: .8 }); for (const tick of tickers) tick(2,16)
assert.ok(seeks.at(-1) > .65, 'forward scroll advances')
config.onUpdate({ progress: .4 }); for (const tick of tickers) tick(3,16)
assert.ok(seeks.at(-1) < .725, 'intentional reverse scroll still works')
root.offsetHeight = 1200; stage.offsetHeight = 400
assert.equal(config.end(), '+=800', 'real layout/orientation changes still recalculate the range')
cleanup(); assert.equal(tickers.size,0); assert.ok(killed)
console.log('Intro scroll: stable toolbar range, restored position, refresh, forward/reverse and cleanup passed.')
