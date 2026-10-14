'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { onLukasReached } from '@/lib/lukas-presence'
import { mountLukasVoiceViz } from '@/lib/lukas-voice-viz'
import { skinLukasPanel } from '@/lib/lukas-panel-skin'
import { hasConsent, onConsentChange, setConsent } from '@/lib/consent'
import { LukasConsentPrompt } from './lukas-consent-prompt'
import { useT, useLanguage } from './language-context'
import { loadLukasWidget, showLukasWidget } from '@/lib/lukas-widget-loader'

/**
 * L.U.K.A.S. voice/chat launcher.
 *
 * The conversation itself is the Lukas-Autonom backend's own embeddable
 * widget (`<domain>/widget.js` — a self-contained chat/voice panel, voice via
 * the OpenAI Realtime API). This component owns the on-brand *entry*:
 *   • the backend widget is loaded only once the visitor has travelled
 *     through the L.U.K.A.S. scroll story (see lib/lukas-presence.ts);
 *   • the widget's own default button is hidden (CSS — it has no shadow
 *     DOM), and our branded launcher pill takes its place;
 *   • the in-section "Sprich mit L.U.K.A.S." panel opens the same thing.
 *
 * Config (public → NEXT_PUBLIC_, inlined at build time):
 *   NEXT_PUBLIC_LUKAS_WIDGET_DOMAIN  backend origin serving widget.js +
 *                                    the chat API. Defaults to the current
 *                                    Railway deployment; override to move it.
 */
const WIDGET_DOMAIN =
  process.env.NEXT_PUBLIC_LUKAS_WIDGET_DOMAIN ||
  'https://portfoliov2-production-992f.up.railway.app'

/** Fired by the in-section invite panel (components/lukas.tsx) so its CTA
 *  opens the same conversation as the floating launcher. */
export const OPEN_CHAT_EVENT = 'lukas:open-chat'

export function LukasVoiceWidget() {
  const t = useT()
  const { lang } = useLanguage()
  const copy = {
    de: { loading: 'L.U.K.A.S. wird geöffnet …', error: 'L.U.K.A.S. konnte nicht geladen werden.', retry: 'Erneut versuchen', close: 'Schließen' },
    en: { loading: 'Opening L.U.K.A.S. …', error: 'L.U.K.A.S. could not load.', retry: 'Try again', close: 'Close' },
    es: { loading: 'Abriendo L.U.K.A.S. …', error: 'No se pudo cargar L.U.K.A.S.', retry: 'Reintentar', close: 'Cerrar' },
  }[lang]
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'error'>('idle')
  const openingRef = useRef(false)
  const requestRef = useRef(0)
  const [reached, setReached] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  const vizCleanupRef = useRef<(() => void) | null>(null)

  // Appear only once the visitor has been through the L.U.K.A.S. section.
  useEffect(() => onLukasReached(() => setReached(true)), [])

  // widget.js is third-party code that transmits the conversation to the
  // agent backend, and in voice mode streams microphone audio straight to
  // api.openai.com. It must not load before the visitor has opted in, and it
  // must stop being loadable the moment they withdraw.
  useEffect(() => onConsentChange((s) => {
    setAllowed(s?.lukas === true)
    if (!s?.lukas) {
      requestRef.current++
      openingRef.current = false
      setLoadState('idle')
    }
  }), [])

  const loadWidget = async () => {
    if (!hasConsent('lukas')) throw new Error('Consent required')
    if (!document.querySelector('[data-lukas-widget-style]')) {
      const style = document.createElement('style')
      style.setAttribute('data-lukas-widget-style', '')
      style.textContent = '.lukas-btn{display:none!important}'
      document.head.appendChild(style)
    }
    const attrs: Record<string, string> = {
      'data-api': WIDGET_DOMAIN,
      'data-voice': 'agent',
      'data-theme': 'dark',
      'data-accent': '#a78bfa',
      'data-accent2': '#5b93f6',
      'data-radius': '20px',
      'data-position': 'bottom-right',
      'data-title': 'L.U.K.A.S.',
      'data-subtitle': t.lukasVoice.panelSubtitle,
      'data-greeting': t.lukasVoice.panelGreeting,
      'data-placeholder': t.lukasVoice.panelPlaceholder,
    }
    const widget = await loadLukasWidget(`${WIDGET_DOMAIN}/widget.js`, attrs)
    if (!vizCleanupRef.current) {
      const disposeViz = mountLukasVoiceViz()
      const disposeSkin = skinLukasPanel()
      vizCleanupRef.current = () => { disposeViz(); disposeSkin() }
    }
    return widget
  }

  useEffect(() => {
    if (reached && allowed) void loadWidget().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reached, allowed])

  useEffect(() => () => {
    requestRef.current++
    openingRef.current = false
    vizCleanupRef.current?.()
    vizCleanupRef.current = null
  }, [])

  const cancelOpen = () => {
    requestRef.current++
    openingRef.current = false
    setLoadState('idle')
  }

  const openPanel = async () => {
    if (openingRef.current) return
    openingRef.current = true
    const request = ++requestRef.current
    setLoadState('loading')
    try {
      const widget = await loadWidget()
      if (request !== requestRef.current || !hasConsent('lukas')) return
      showLukasWidget(widget)
      setLoadState('idle')
    } catch {
      if (request === requestRef.current) setLoadState('error')
    } finally {
      if (request === requestRef.current) openingRef.current = false
    }
  }

  const openChat = () => {
    // No permission yet: ask right here, in a prompt about this one thing.
    // The visitor pressed "talk to L.U.K.A.S.", so the question they get is
    // about L.U.K.A.S. — not a cookie list they have to find the agent in.
    if (!hasConsent('lukas')) {
      setAskOpen(true)
      return
    }
    openPanel()
  }

  // Keep the event listener current without stacking handlers.
  const openChatRef = useRef(openChat)
  openChatRef.current = openChat
  useEffect(() => {
    const open = () => openChatRef.current()
    window.addEventListener(OPEN_CHAT_EVENT, open)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, open)
  }, [])

  const allow = () => {
    setConsent('lukas', true)
    setAskOpen(false)
    // Straight into the conversation they asked for — the prompt is a step
    // on the way, not a destination.
    openPanel()
  }

  return (
    <>
      <LukasConsentPrompt
        open={askOpen}
        onAllow={allow}
        onClose={() => setAskOpen(false)}
      />
      {loadState !== 'idle' && (
        <div className="lukas-load-notice" data-lenis-prevent>
          <p role="status" aria-live="polite">{loadState === 'loading' ? copy.loading : copy.error}</p>
          {loadState === 'error' && <button type="button" onClick={openChat}>{copy.retry}</button>}
          <button type="button" onClick={cancelOpen} aria-label={copy.close}>×</button>
        </div>
      )}
      {reached && (
        <AnimatePresence>
        <motion.button
          type="button"
          onClick={openChat}
          data-lukas-launcher
          aria-label={t.lukasVoice.launcherAria}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-6 right-5 z-[95] flex items-center gap-3 rounded-full border border-white/15 bg-black/55 py-2.5 pl-2.5 pr-4 shadow-[0_18px_50px_-16px_rgba(0,0,0,0.85)] backdrop-blur-md transition-colors hover:border-purple/60 sm:right-9"
        >
          {/* Neuron orb — the section's motif, distilled into one pulsing node. */}
          <span className="lukas-launcher-orb" aria-hidden="true" />
          <span className="flex flex-col items-start leading-tight">
            <span className="font-label text-[13px] uppercase tracking-[0.25em] text-purple/80">
              {t.lukasVoice.launcherKicker}
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              {t.lukasVoice.launcherLabel}
            </span>
          </span>
          </motion.button>
        </AnimatePresence>
      )}
    </>
  )
}
