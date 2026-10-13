/**
 * Structural fixes for the L.U.K.A.S. chat panel.
 *
 * The panel itself is built by the backend's widget.js, which is not part of
 * this repository. It ships without a shadow DOM by design ("die Host-Seite
 * kann mit normalem CSS ALLES überschreiben"), so its *look* is re-skinned
 * purely in CSS — see the `.lukas-w` block in app/globals.css.
 *
 * Two things CSS cannot do, and this module does:
 *
 * 1. **Give the panel back its scroll.** Lenis intercepts wheel/touch on the
 *    whole document; it walks the event's composed path and only stands down
 *    when it finds `data-lenis-prevent`. Without that attribute every swipe
 *    inside the message list was being consumed as page scroll — which is
 *    why the conversation could not be scrolled back up, most visibly on
 *    mobile where the panel covers the entire viewport.
 *
 * 2. **Replace the emoji glyphs with real icons.** widget.js writes 🎤 / ➤ /
 *    ✕ as text content. Emoji render in the OS colour font, at a size and
 *    weight nothing else on the page shares — the single loudest reason the
 *    panel read as dated next to the rest of the site.
 *
 * Both are idempotent and applied once, when widget.js has finished building
 * the panel; its buttons are populated at construction and never rewritten
 * afterwards (only classes and `display` change), so a one-shot swap holds.
 */

const ICONS: Record<string, string> = {
  '.lukas-mic': `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/></svg>`,
  '.lukas-send': `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`,
  '.lukas-close': `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
}

export function skinLukasPanel(): () => void {
  if (typeof window === 'undefined') return () => {}

  let disposed = false
  let poll = 0
  let cleanup: (() => void) | undefined

  const apply = (panel: HTMLElement) => {
    // Lenis hands the gesture back the moment it finds this on the path —
    // one attribute on the panel covers the message list, the chips and the
    // input row in one go.
    panel.setAttribute('data-lenis-prevent', '')

    for (const [sel, svg] of Object.entries(ICONS)) {
      const btn = panel.querySelector<HTMLElement>(sel)
      // Guard on the emoji still being there: if widget.js ever ships real
      // icons of its own, leave them alone rather than fighting it.
      if (btn && !btn.querySelector('svg')) btn.innerHTML = svg
    }
    panel.setAttribute('role', 'dialog')
    panel.setAttribute('aria-modal', 'true')
    panel.setAttribute('aria-label', 'L.U.K.A.S.')
    const messages = panel.querySelector<HTMLElement>('.lukas-msgs')
    const close = panel.querySelector<HTMLButtonElement>('.lukas-close')
    const input = panel.querySelector<HTMLInputElement>('.lukas-in')
    const lang = document.documentElement.lang
    const copy = lang.startsWith('en') ? ['What shall we create?', 'A question. An idea. A beginning.', 'Your message', 'Speak', 'Send']
      : lang.startsWith('es') ? ['¿Qué creamos hoy?', 'Una pregunta. Una idea. Un comienzo.', 'Tu mensaje', 'Hablar', 'Enviar']
      : ['Was bewegen wir heute?', 'Eine Frage. Eine Idee. Ein Anfang.', 'Deine Nachricht', 'Sprechen', 'Senden']
    input?.setAttribute('aria-label', copy[2])
    panel.querySelector('.lukas-mic')?.setAttribute('aria-label', copy[3])
    panel.querySelector('.lukas-send')?.setAttribute('aria-label', copy[4])
    const welcome = document.createElement('div')
    welcome.className = 'lukas-welcome'
    const orb = document.createElement('div')
    orb.className = 'lukas-welcome-orb'; orb.setAttribute('aria-hidden', 'true')
    const title = document.createElement('h2'); title.textContent = copy[0]
    const subtitle = document.createElement('p'); subtitle.textContent = copy[1]
    welcome.append(orb, title, subtitle); messages?.prepend(welcome)
    let wasOpen = false
    const viewport = () => {
      panel.style.setProperty('--lukas-vh', `${window.visualViewport?.height ?? window.innerHeight}px`)
      panel.style.setProperty('--lukas-vtop', `${window.visualViewport?.offsetTop ?? 0}px`)
    }
    const sync = () => {
      panel.dataset.conversation = String(!!messages?.querySelector('.lukas-m.u'))
      const open = panel.classList.contains('open')
      if (open && !wasOpen) {
        viewport()
        if (messages && !messages.querySelector('.lukas-m.u')) messages.scrollTop = 0
        // Let phone visitors see the welcome before opening their keyboard.
        if (matchMedia('(pointer: coarse)').matches) close?.focus({ preventScroll: true })
      }
      if (!open && wasOpen) document.querySelector<HTMLElement>('[data-lukas-launcher]')?.focus({ preventScroll: true })
      wasOpen = open
    }
    const key = (event: KeyboardEvent) => {
      if (!panel.classList.contains('open')) return
      if (event.key === 'Escape') { event.preventDefault(); close?.click(); return }
      if (event.key !== 'Tab') return
      const items = [...panel.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href]')].filter(el => el.getClientRects().length)
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    const observer = new MutationObserver(sync)
    observer.observe(panel, { attributes: true, attributeFilter: ['class'] })
    if (messages) observer.observe(messages, { childList: true })
    window.visualViewport?.addEventListener('resize', viewport)
    window.visualViewport?.addEventListener('scroll', viewport)
    window.addEventListener('resize', viewport)
    document.addEventListener('keydown', key)
    sync()
    cleanup = () => {
      observer.disconnect(); welcome.remove()
      window.visualViewport?.removeEventListener('resize', viewport)
      window.visualViewport?.removeEventListener('scroll', viewport)
      window.removeEventListener('resize', viewport)
      document.removeEventListener('keydown', key)
    }
  }

  let tries = 0
  const wait = () => {
    if (disposed) return
    const panel = document.querySelector<HTMLElement>('.lukas-panel')
    if (panel) {
      apply(panel)
      return
    }
    if (tries++ < 120) poll = window.setTimeout(wait, 250) // up to ~30s
  }
  wait()

  return () => {
    disposed = true
    window.clearTimeout(poll)
    cleanup?.()
  }
}
