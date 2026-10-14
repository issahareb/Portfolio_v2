type Widget = { panel: HTMLElement; button: HTMLElement }
let pending: Promise<Widget> | null = null

function currentWidget(): Widget | null {
  const panel = document.querySelector<HTMLElement>('.lukas-panel')
  const button = document.querySelector<HTMLElement>('.lukas-btn')
  return panel && button ? { panel, button } : null
}

/** Share the actual script readiness, including on slow mobile connections. */
export function loadLukasWidget(src: string, attributes: Record<string, string>): Promise<Widget> {
  const ready = currentWidget()
  if (ready) return Promise.resolve(ready)
  if (pending) return pending

  pending = new Promise<Widget>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.setAttribute('data-lukas-widget-script', '')
    for (const [key, value] of Object.entries(attributes)) script.setAttribute(key, value)
    const finish = (error?: Error) => {
      window.clearTimeout(timer)
      script.onload = script.onerror = null
      const widget = currentWidget()
      if (widget) resolve(widget)
      else {
        script.remove()
        reject(error ?? new Error('LUKAS widget did not initialise'))
      }
    }
    const timer = window.setTimeout(() => finish(new Error('LUKAS load timed out')), 30000)
    script.onload = () => finish()
    script.onerror = () => finish(new Error('LUKAS script could not be loaded'))
    document.body.appendChild(script)
  }).finally(() => { pending = null })
  return pending
}

/** Opening is idempotent: repeated taps must never close the conversation. */
export function showLukasWidget(widget: Widget) {
  if (!widget.panel.classList.contains('open')) widget.button.click()
}
