import fs from 'node:fs'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import ts from 'typescript'
import { Worker } from 'node:worker_threads'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

function compile(path) {
  return ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
}
function moduleFrom(code, require = () => ({})) {
  const module = { exports: {} }
  vm.runInNewContext(code, { module, exports: module.exports, require })
  return module.exports
}
const { parsePublicBrain } = moduleFrom(compile('lib/public-brain.ts'))
const model = moduleFrom(compile('components/lukas-memory/modell.ts'))
const { brainGraph, regionIds } = moduleFrom(compile('components/lukas-memory/regions.ts'), () => model)
const input = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : { version: 1, nodes: [{ id: 0, type: 'identitaet', weight: 1 }, { id: 1, type: 'erinnerung', weight: .5 }], edges: [{ source: 0, target: 1, weight: .8 }] }
const projected = parsePublicBrain({ ...input, secret: 'PRIVATE', nodes: input.nodes.map(node => ({ ...node, text: 'PRIVATE', title: 'PRIVATE', path: 'PRIVATE' })) })
assert.equal(JSON.stringify(projected).includes('PRIVATE'), false)
assert.throws(() => parsePublicBrain({ ...input, nodes: [{ id: 'PRIVATE', type: 'erinnerung', weight: 1 }] }))
assert.throws(() => parsePublicBrain({ ...input, edges: [{ source: -1, target: 0, weight: 1 }] }))
const graph = brainGraph(projected, 'de')
assert.equal(graph.knoten.length, input.nodes.length)
assert.equal(graph.kanten.length, input.edges.length)
for (const id of regionIds(graph).filter(Boolean)) assert.ok(graph.knoten.some(node => node.id === id))
const dir = await mkdtemp(join(tmpdir(), 'brain-layout-'))
try {
  const file = join(dir, 'model.cjs')
  await writeFile(file, compile('components/lukas-memory/modell.ts'))
  let heartbeat = 0
  const timer = setInterval(() => heartbeat++, 1)
  const result = await new Promise((resolve, reject) => {
    const worker = new Worker(`const {parentPort,workerData}=require('node:worker_threads');const {lege}=require(workerData.file);const start=performance.now();const room=lege(workerData.graph);parentPort.postMessage({nodes:room.regionen.length,positions:room.positionen.length,invalid:[...room.positionen].some(x=>!Number.isFinite(x)),milliseconds:performance.now()-start});`, { eval: true, workerData: { file, graph } })
    worker.once('message', resolve); worker.once('error', reject)
  })
  clearInterval(timer)
  assert.equal(result.nodes, graph.knoten.length)
  assert.equal(result.positions, graph.knoten.length * 3)
  assert.equal(result.invalid, false)
  assert.ok(heartbeat > 0)
  console.log(JSON.stringify({ nodes: graph.knoten.length, edges: graph.kanten.length, workerMilliseconds: Math.round(result.milliseconds), mainThreadResponsive: true, privateFieldsExcluded: true }))
} finally { await rm(dir, { recursive: true, force: true }) }
