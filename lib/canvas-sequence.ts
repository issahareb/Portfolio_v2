export type FrameSequence = {
  sheets: string[]
  count: number
  width: number
  height: number
  columns: number
  perSheet: number
}

/** Scroll paints decoded images, without starting a media seek on every tick. */
export function createCanvasSequence(
  canvas: HTMLCanvasElement,
  poster: HTMLImageElement,
  sequence: FrameSequence,
  failed: () => void,
) {
  const context = canvas.getContext('2d')
  if (!context) { failed(); return { seek: (_: number) => {}, dispose: () => {} } }
  canvas.width = sequence.width
  canvas.height = sequence.height
  canvas.style.objectFit = 'contain'
  const mask = document.createElement('canvas')
  mask.width = sequence.width
  mask.height = sequence.height
  const maskContext = mask.getContext('2d')!
  maskContext.save()
  maskContext.translate(mask.width / 2, mask.height / 2)
  maskContext.scale(mask.width * 0.84, mask.height * 0.9)
  const gradient = maskContext.createRadialGradient(0, 0, 0, 0, 0, 1)
  gradient.addColorStop(0, '#000')
  gradient.addColorStop(0.68, '#000')
  gradient.addColorStop(0.8, 'rgba(0,0,0,.88)')
  gradient.addColorStop(0.92, 'rgba(0,0,0,.36)')
  gradient.addColorStop(1, 'transparent')
  maskContext.fillStyle = gradient
  maskContext.fillRect(-1, -1, 2, 2)
  maskContext.restore()

  let disposed = false, pending = 0, target = 0, painted = -1
  const images: HTMLImageElement[] = []
  const ready = new Set<number>()
  const render = () => {
    pending = 0
    if (disposed || target === painted) return
    const sheet = Math.floor(target / sequence.perSheet)
    if (!ready.has(sheet)) return // Hold the current image, never an unrelated frame.
    const cell = target % sequence.perSheet
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(images[sheet],
      (cell % sequence.columns) * sequence.width,
      Math.floor(cell / sequence.columns) * sequence.height,
      sequence.width, sequence.height, 0, 0, canvas.width, canvas.height)
    context.globalCompositeOperation = 'destination-in'
    context.drawImage(mask, 0, 0)
    context.globalCompositeOperation = 'source-over'
    painted = target
    poster.style.opacity = '0'
  }
  const schedule = () => { if (!disposed && !pending) pending = requestAnimationFrame(render) }
  // Eight small requests, decoded ahead of scrolling. No canvases or
  // React state per frame; the entire decoded sequence is about 89 MiB.
  sequence.sheets.forEach((src, index) => {
    const image = new Image()
    images.push(image)
    image.decoding = 'async'
    image.src = src
    image.decode().then(() => {
      if (disposed) return
      ready.add(index)
      schedule()
    }).catch(() => { if (!disposed) failed() })
  })
  return {
    seek(progress: number) {
      if (!Number.isFinite(progress) || disposed) return
      target = Math.round(Math.max(0, Math.min(1, progress)) * (sequence.count - 1))
      schedule()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(pending)
      images.forEach(image => { image.src = '' })
      images.length = 0
      ready.clear()
      canvas.width = canvas.height = 0
    },
  }
}
