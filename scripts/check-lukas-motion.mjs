import fs from 'node:fs'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import ts from 'typescript'

const code = ts.transpileModule(fs.readFileSync('lib/lukas-motion.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const module = { exports: {} }
vm.runInNewContext(code, { module, exports: module.exports })
const { followProgress, cameraParameter, chapterOpacity, CHAPTER_CENTERS } = module.exports
const follow = fps => {
  let progress = 0.1
  for (let frame = 0; frame < fps; frame++) progress = followProgress(progress, 0.8, 1 / fps)
  return progress
}
for (const fps of [15, 30, 60, 120, 144]) assert.ok(Math.abs(follow(fps) - follow(60)) < 1e-9, `Frame-rate independence at ${fps} fps`)
let up = 0, down = 1
for (let i = 0; i < 240; i++) {
  const nextUp = followProgress(up, 1, 1 / 60), nextDown = followProgress(down, 0, 1 / 60)
  assert.ok(nextUp >= up && nextUp <= 1 && nextDown <= down && nextDown >= 0, 'No overshoot in either direction')
  up = nextUp; down = nextDown
}
assert.equal(up, 1); assert.equal(down, 0)
for (const p of CHAPTER_CENTERS) assert.ok(Math.abs(cameraParameter(p + 0.0001) - cameraParameter(p - 0.0001)) < 1e-7, 'Smooth camera at chapter boundaries')
for (let i = 0; i <= 1000; i++) {
  const p = i / 1000
  assert.ok(cameraParameter(p) >= 0 && cameraParameter(p) <= 1)
  if (i) assert.ok(cameraParameter(p) >= cameraParameter(p - 0.001) - 1e-12)
  for (let j = 0; j < 4; j++) assert.ok(chapterOpacity(p, j) >= 0 && chapterOpacity(p, j) <= 1)
}
CHAPTER_CENTERS.forEach((p, i) => assert.equal(chapterOpacity(p, i), 1))
console.log('Lukas motion: frame-rate independence, bidirectional scrolling and continuous camera verified.')
