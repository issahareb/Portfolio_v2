import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as THREE from 'three'

const module = { exports: {} }
const source = ts.transpileModule(fs.readFileSync('components/lukas-memory/native-touch.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
vm.runInNewContext(source, { module, exports: module.exports, require: () => THREE })
const listeners = new Map()
const surface = { clientHeight: 430, addEventListener: (type, fn) => listeners.set(type, fn), removeEventListener: type => listeners.delete(type) }
const camera = new THREE.PerspectiveCamera(44, 1, .1, 5000)
camera.position.set(0, 0, 300); camera.lookAt(0, 0, 0); camera.updateMatrix()
let starts = 0, prevented = 0
const controls = { enabled: true, target: new THREE.Vector3(), enableDamping: true, rotateSpeed: .65, enableZoom: true, enablePan: true, minDistance: 3, maxDistance: 1600, dispatchEvent: e => { if (e.type === 'start') starts++ } }
const dispose = module.exports.bindNativeBrainTouch(camera, controls, surface)
const touch = (type, points) => listeners.get(type)({ type, cancelable: true, preventDefault: () => prevented++, touches: points.map(([clientX, clientY]) => ({ clientX, clientY })) })
touch('touchstart', [[100, 100]])
touch('touchmove', [[170, 120]])
assert.ok(Math.abs(camera.position.x) > 50, 'One finger rotates camera meaningfully')
assert.ok(Math.abs(camera.position.length() - 300) < .001, 'Rotation preserves camera distance')
touch('touchstart', [[170, 120], [270, 120]])
const distance = camera.position.distanceTo(controls.target)
touch('touchmove', [[140, 140], [300, 140]])
assert.ok(camera.position.distanceTo(controls.target) < distance * .7, 'Pinch directly zooms without delayed flights')
assert.ok(controls.target.length() > 0, 'Two-finger centroid pans the target')
touch('touchend', [[140, 140]])
const afterPinch = camera.position.clone()
touch('touchmove', [[141, 140]])
assert.ok(camera.position.distanceTo(afterPinch) < 5, 'Lifting one finger does not jump')
touch('touchend', [])
assert.equal(controls.enableDamping, true, 'Damping restored after touch')
assert.equal(starts, 1, 'Multi-touch belongs to one gesture')
let blocked = false
listeners.get('pointerdown')({ pointerType: 'touch', stopImmediatePropagation: () => { blocked = true } })
assert.ok(blocked, 'Compatibility pointer events cannot double-apply gestures')
controls.enabled = false
const disabledPosition = camera.position.clone()
touch('touchstart', [[0, 0]]); touch('touchmove', [[200, 200]])
assert.ok(camera.position.equals(disabledPosition), 'Disabled input leaves camera alone')
assert.ok(prevented > 0)
dispose(); assert.equal(listeners.size, 0, 'All native listeners removed')
console.log('Native brain touch: rotate, pinch, pan, finger lift, disabled state and cleanup passed.')
