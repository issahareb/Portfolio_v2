import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
import ts from 'typescript'
const module = { exports: {} }, timers = new Map()
let timerId = 0
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/video-seek-queue.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
  module, exports: module.exports,
  setTimeout: fn => { timers.set(++timerId, fn); return timerId }, clearTimeout: id => timers.delete(id),
})
const events = new Map(), writes = []
let position = 0
const video = { duration: 8, readyState: 4, seeking: false,
  get currentTime() { return position },
  set currentTime(value) { writes.push(value); position = value; this.seeking = true },
  addEventListener: (type, fn) => events.set(type, fn), removeEventListener: type => events.delete(type),
}
const queue = module.exports.createVideoSeekQueue(video, () => {})
queue.seek(2); queue.seek(5); queue.seek(1)
assert.deepEqual(writes, [2], 'rapid and reverse scroll must not interrupt an outstanding seek')
events.get('canplay')()
assert.deepEqual(writes, [2], 'canplay must not unlock an unfinished decode')
const runTimer = () => { const [id, fn] = timers.entries().next().value; timers.delete(id); fn() }
runTimer(); assert.deepEqual(writes, [2], 'a slow decode is not restarted by the watchdog')
video.seeking = false; events.get('seeked')()
assert.deepEqual(writes, [2, 1], 'only the latest reversed target is decoded next')
queue.seek(6); video.seeking = false; runTimer()
assert.deepEqual(writes, [2, 1, 6], 'missing seeked event recovers to latest target')
queue.seek(NaN); video.seeking = false; events.get('seeked')()
assert.equal(writes.length, 3)
queue.dispose(); assert.equal(events.size, 0); assert.equal(timers.size, 0)
console.log('Video seek queue: rapid/reverse scroll, slow decoding, missing seeked recovery and cleanup passed.')
