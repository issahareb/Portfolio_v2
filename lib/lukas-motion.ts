/** One continuous clock for the camera and the chapter copy. */
export const STORY_STOPS = [0, 0.19, 0.39, 0.59, 0.79, 1] as const
export const CHAPTER_CENTERS = STORY_STOPS.slice(1, -1)
export const clampProgress = (value: number) => Math.max(0, Math.min(1, value))
export function smoothStep(value: number) {
  const t = clampProgress(value)
  return clampProgress(t * t * t * (t * (t * 6 - 15) + 10))
}
export function followProgress(current: number, target: number, delta: number) {
  const dt = Math.max(0, Math.min(delta, 0.1))
  const next = current + (clampProgress(target) - current) * (1 - Math.exp(-dt * 10))
  return Math.abs(next - target) < 0.00005 ? clampProgress(target) : clampProgress(next)
}
export function cameraParameter(progress: number) {
  const p = clampProgress(progress)
  let segment = 0
  while (segment < STORY_STOPS.length - 2 && p > STORY_STOPS[segment + 1]) segment++
  const start = STORY_STOPS[segment]
  const end = STORY_STOPS[segment + 1]
  return (segment + smoothStep((p - start) / (end - start))) / (STORY_STOPS.length - 1)
}
export function chapterOpacity(progress: number, index: number) {
  const center = CHAPTER_CENTERS[index]
  return smoothStep((progress - center + 0.1) / 0.045) *
    (1 - smoothStep((progress - center - 0.055) / 0.045))
}
export function chapterAt(progress: number) {
  return CHAPTER_CENTERS.reduce<number>((best, center, index) =>
    Math.abs(progress - center) < Math.abs(progress - CHAPTER_CENTERS[best]) ? index : best, 0)
}
export type BrainProgress = { current: { p: number } }
