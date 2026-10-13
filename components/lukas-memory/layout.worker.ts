import { lege, type Gehirn } from './modell'
self.onmessage = (event: MessageEvent<Gehirn>) => {
  try {
    const room = lege(event.data)
    self.postMessage({ room }, { transfer: [room.positionen.buffer, room.regionen.buffer, room.grad.buffer] })
  } catch { self.postMessage({ error: true }) }
}
