/** Source: issahareb/Lukas_autonom @ e2a0a716, dashboard brain. */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** One gesture owner: never translate the orbit target as a side effect of zoom. */
export function neuronSteuerung(
  camera: THREE.PerspectiveCamera,
  surface: HTMLElement,
  invertiert = true,
) {
  const controls = new OrbitControls(camera, surface);
  controls.enableDamping = true;
  controls.dampingFactor = 0.18;
  controls.rotateSpeed = invertiert ? -0.18 : 0.18;
  controls.zoomSpeed = 0.45;
  controls.panSpeed = 0.5;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  controls.minDistance = 3;
  controls.maxDistance = 1600;
  controls.autoRotateSpeed = 0.16;
  return controls;
}
