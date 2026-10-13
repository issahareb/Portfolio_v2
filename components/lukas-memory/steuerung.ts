/** Source: issahareb/Lukas_autonom @ e2a0a716, dashboard brain. */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { bindNativeBrainTouch } from './native-touch';

/** One finger rotates; two fingers zoom and move the view. */
export function neuronSteuerung(
  camera: THREE.PerspectiveCamera,
  surface: HTMLElement,
  invertiert = true,
) {
  const controls = new OrbitControls(camera, surface);
  controls.enableDamping = true;
  controls.dampingFactor = 0.18;
  controls.rotateSpeed = invertiert ? -0.65 : 0.65;
  controls.zoomSpeed = 0.9;
  controls.panSpeed = 0.5;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  controls.minDistance = 3;
  controls.maxDistance = 1600;
  controls.autoRotateSpeed = 0.16;
  const unbindTouch = bindNativeBrainTouch(camera, controls, surface);
  const dispose = controls.dispose.bind(controls);
  controls.dispose = () => { unbindTouch(); dispose(); };
  return controls;
}
