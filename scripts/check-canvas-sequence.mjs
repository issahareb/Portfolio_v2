import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'
const module = { exports: {} }, frames = new Map(), loads = [], draws = []
let id = 0, failures = 0
const context = { save() {}, restore() {}, translate() {}, scale() {}, clearRect() {}, fillRect() {},
  createRadialGradient: () => ({ addColorStop() {} }), drawImage: (...args) => draws.push(args) }
const canvas = { style: {}, getContext: () => context }, poster = { style: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/canvas-sequence.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
  module, exports: module.exports, document: { createElement: () => ({ getContext: () => context }) },
  Image: class { decode() { return new Promise((resolve, reject) => loads.push({ resolve, reject })) } },
  requestAnimationFrame: fn => { frames.set(++id, fn); return id }, cancelAnimationFrame: id => frames.delete(id),
})
const flush = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn()) }
const sequence = module.exports.createCanvasSequence(canvas, poster, {
  sheets: ['first', 'last'], count: 20, width: 512, height: 356, columns: 4, perSheet: 16,
}, () => failures++)
sequence.seek(1); sequence.seek(0.5); sequence.seek(1)
assert.equal(frames.size, 1, 'scroll updates coalesce into one animation frame')
flush(); assert.equal(draws.length, 0, 'unloaded target retains poster')
loads[0].resolve(); await Promise.resolve(); flush()
assert.equal(draws.length, 0, 'out-of-order loading must not display an older target')
loads[1].resolve(); await Promise.resolve(); flush()
assert.equal(draws[0][1], 3 * 512, 'last frame selects the correct atlas cell')
assert.equal(poster.style.opacity, '0')
sequence.seek(0); flush(); assert.equal(draws[2][1], 0, 'reverse scroll reaches first frame')
sequence.seek(NaN); assert.equal(frames.size, 0)
sequence.seek(0.1); sequence.dispose(); assert.equal(frames.size, 0)
assert.equal(canvas.width, 0, 'cleanup releases canvas storage')
assert.equal(failures, 0)
console.log('Canvas sequence: coalescing, delayed/out-of-order loads, first/last/reverse frames and cleanup passed.')
