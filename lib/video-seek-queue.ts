/** At most one decode request at a time, also for the visible iOS video. */
export function createVideoSeekQueue(video: HTMLVideoElement, paint: () => void) {
  const epsilon = 1 / 48
  let target = 0, busy = false, disposed = false, timer: ReturnType<typeof setTimeout> | undefined
  const clamp = (time: number) => Math.max(0, Math.min(Math.max(0, video.duration - epsilon), time))
  const drain = () => {
    if (disposed || !Number.isFinite(video.duration) || video.duration <= 0 || video.readyState < 1) return
    if (busy || video.seeking) return
    const next = clamp(target)
    if (Math.abs(video.currentTime - next) < epsilon) { paint(); return }
    busy = true
    try { video.currentTime = next } catch { busy = false }
    // Recover a missing seeked event without cancelling a decoder that is
    // still seeking (Safari can take longer than a frame on an older phone).
    clearTimeout(timer)
    const check = () => {
      if (disposed) return
      if (video.seeking) { timer = setTimeout(check, 500); return }
      busy = false; paint(); drain()
    }
    timer = setTimeout(check, 500)
  }
  const settled = () => { paint(); if (video.seeking) return; clearTimeout(timer); busy = false; drain() }
  video.addEventListener('seeked', settled)
  video.addEventListener('loadeddata', settled)
  video.addEventListener('canplay', settled)
  return {
    seek: (time: number) => { if (!Number.isFinite(time)) return; target = time; drain() },
    resume: () => { if (!video.seeking) busy = false; drain() },
    dispose: () => {
      disposed = true; clearTimeout(timer)
      video.removeEventListener('seeked', settled); video.removeEventListener('loadeddata', settled); video.removeEventListener('canplay', settled)
    },
  }
}
