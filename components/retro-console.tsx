'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowUpRight, Power, X } from 'lucide-react'
import { useLanguage } from './language-context'
import { langPath } from '@/lib/i18n'
import { OPEN_CONSENT_EVENT } from '@/lib/consent'
import { ConsoleProjects } from './console-projects'
import styles from './retro-console.module.css'

const EnquiryForm = dynamic(
  () => import('./enquiry-form').then((m) => m.EnquiryForm),
  { ssr: false },
)
type Phase = 'standby' | 'booting' | 'ready'
type Panel = 'projects' | 'contact' | null
const COPY = {
  de: {
    hello: 'Ich bin Issa.',
    intro:
      'Design, Motion und Entwicklung. Willkommen in meiner digitalen Welt.',
    hint: 'Drück auf Start.',
    power: 'Konsole einschalten',
    off: 'Konsole ausschalten',
    boot: 'Gleich geht’s los.',
    welcome: 'Schön, dass du da bist.',
    menu: 'Was möchtest du entdecken?',
    portfolio: 'Portfolio ansehen',
    projects: 'Projekte',
    contact: 'Kontakt aufnehmen',
    studio: 'Hareb Digital besuchen',
    close: 'Fenster schließen',
    ready: 'Bereit für deine Neugier.',
    skip: 'Direkt zum Portfolio',
    legal: 'Impressum',
    privacy: 'Datenschutz',
    contactTitle: 'Lass uns sprechen.',
    contactIntro: 'Schreib mir von deiner Idee oder melde dich direkt.',
    lang: 'Sprache',
    cookies: 'Cookie-Einstellungen',
  },
  en: {
    hello: 'I’m Issa.',
    intro: 'Design, motion and development. Welcome to my digital world.',
    hint: 'Press Start.',
    power: 'Turn on console',
    off: 'Turn off console',
    boot: 'Here we go.',
    welcome: 'Glad you’re here.',
    menu: 'What would you like to explore?',
    portfolio: 'View portfolio',
    projects: 'Projects',
    contact: 'Get in touch',
    studio: 'Visit Hareb Digital',
    close: 'Close window',
    ready: 'Ready for your curiosity.',
    skip: 'Go straight to portfolio',
    legal: 'Legal notice',
    privacy: 'Privacy',
    contactTitle: 'Let’s talk.',
    contactIntro: 'Tell me about your idea or contact me directly.',
    lang: 'Language',
    cookies: 'Cookie settings',
  },
  es: {
    hello: 'Soy Issa.',
    intro: 'Diseño, motion y desarrollo. Bienvenido a mi mundo digital.',
    hint: 'Pulsa Start.',
    power: 'Encender la consola',
    off: 'Apagar la consola',
    boot: 'Empezamos.',
    welcome: 'Me alegra verte.',
    menu: '¿Qué quieres descubrir?',
    portfolio: 'Ver portfolio',
    projects: 'Proyectos',
    contact: 'Contactar',
    studio: 'Visitar Hareb Digital',
    close: 'Cerrar ventana',
    ready: 'Lista para tu curiosidad.',
    skip: 'Ir al portfolio',
    legal: 'Aviso legal',
    privacy: 'Privacidad',
    contactTitle: 'Hablemos.',
    contactIntro: 'Cuéntame tu idea o contacta directamente.',
    lang: 'Idioma',
    cookies: 'Preferencias de cookies',
  },
}
function Speaker({ className = '' }: { className?: string }) {
  return (
    <div className={`${styles.speaker} ${className}`} aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  )
}
export function RetroConsole() {
  const { lang, setLang } = useLanguage()
  const t = COPY[lang]
  const [phase, setPhase] = useState<Phase>('standby')
  const [panel, setPanel] = useState<Panel>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const firstKey = useRef<HTMLAnchorElement>(null)
  const panelOpener = useRef<HTMLElement | null>(null)
  const ready = phase === 'ready'
  useEffect(() => {
    if (phase !== 'booting') return
    const timer = window.setTimeout(
      () => setPhase('ready'),
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1050,
    )
    return () => window.clearTimeout(timer)
  }, [phase])
  useEffect(() => {
    if (!ready) return
    const frame = requestAnimationFrame(() =>
      firstKey.current?.focus({ preventScroll: true }),
    )
    return () => cancelAnimationFrame(frame)
  }, [ready])
  useEffect(() => {
    if (!panel || !dialog.current) return
    const element = dialog.current
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = overflow
      panelOpener.current?.focus({ preventScroll: true })
    }
  }, [panel])
  // Preserve existing section deep links after adding the entrance.
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#contact') {
      setPhase('ready')
      setPanel('contact')
    } else if (hash === '#work') {
      setPhase('ready')
      setPanel('projects')
    } else if (
      ['#lukas', '#about', '#stack', '#creative-skills'].includes(hash)
    )
      window.location.replace(`${langPath(lang, '/portfolio')}${hash}`)
  }, [lang])
  function openPanel(value: Panel, opener: HTMLElement) {
    panelOpener.current = opener
    setPanel(value)
  }
  return (
    <main
      id="main-content"
      className={styles.entrance}
      data-console-phase={phase}
    >
      <section
        id="top"
        className={styles.stage}
        aria-label="Issa Hareb Portfolio"
      >
        <div className={styles.cabinet} data-ready={ready}>
          {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((c) => (
            <span
              key={c}
              className={`${styles.screw} ${styles[c]}`}
              aria-hidden="true"
            />
          ))}
          <div className={styles.caseHeader}>
            <span className={styles.wordmark}>
              ISSA<span>HAREB.</span>
            </span>
            <div className={styles.status}>
              <i aria-hidden="true" />
              {ready ? 'ONLINE' : 'STANDBY'}
            </div>
          </div>
          <div className={styles.face}>
            <div className={styles.monitor} aria-busy={phase === 'booting'}>
              <div className={styles.screen}>
                <div className={styles.screenRail}>
                  <span>DESIGN · MOTION · DEVELOPMENT</span>
                  <span aria-hidden="true">IH / 01</span>
                </div>
                {ready ? (
                  <div className={styles.welcome}>
                    <div className={styles.monogram} aria-hidden="true">
                      <span>i</span>
                      <span>h</span>
                      <b>.</b>
                    </div>
                    <h1>{t.welcome}</h1>
                    <p>{t.menu}</p>
                  </div>
                ) : (
                  <div className={styles.intro}>
                    <h1>{t.hello}</h1>
                    <p>
                      {phase === 'booting' ? t.boot : t.intro}
                      <span className={styles.cursor} aria-hidden="true" />
                    </p>
                  </div>
                )}
                {phase === 'booting' && (
                  <div className={styles.bootTrack} aria-hidden="true">
                    <span />
                  </div>
                )}
                <div className={styles.screenBottom}>
                  <span>ISSA HAREB · ESSEN</span>
                  <span>{ready ? '01 — 04' : 'PRESS START'}</span>
                </div>
              </div>
            </div>
            <div className={styles.hardware}>
              {!ready && (
                <span className={styles.clickHint} aria-hidden="true">
                  {t.hint}
                </span>
              )}
              <button
                className={styles.power}
                type="button"
                aria-label={phase !== 'standby' ? t.off : t.power}
                aria-pressed={phase !== 'standby'}
                aria-controls={ready ? 'console-menu' : undefined}
                onClick={() =>
                  setPhase(phase === 'standby' ? 'booting' : 'standby')
                }
              >
                {ready ? (
                  <X aria-hidden="true" />
                ) : (
                  <Power aria-hidden="true" />
                )}
              </button>
              <Speaker />
              <span className={styles.powerLabel}>
                {ready ? 'POWER OFF' : 'START'}
              </span>
            </div>
          </div>
          {ready && (
            <>
              <Speaker className={styles.centerSpeaker} />
              <nav
                id="console-menu"
                className={styles.keys}
                aria-label={t.menu}
              >
                <Link
                  ref={firstKey}
                  href={langPath(lang, '/portfolio')}
                  className={`${styles.key} ${styles.primaryKey}`}
                >
                  <span>01</span>
                  <strong>{t.portfolio}</strong>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  className={styles.key}
                  onClick={(e) => openPanel('projects', e.currentTarget)}
                >
                  <span>02</span>
                  <strong>{t.projects}</strong>
                  <ArrowUpRight aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.key}
                  onClick={(e) => openPanel('contact', e.currentTarget)}
                >
                  <span>03</span>
                  <strong>{t.contact}</strong>
                  <ArrowUpRight aria-hidden="true" />
                </button>
                <a
                  href={`https://hareb.digital/${lang === 'de' ? '' : `${lang}/`}`}
                  className={`${styles.key} ${styles.darkKey}`}
                >
                  <span>04</span>
                  <strong>{t.studio}</strong>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </nav>
              <div className={styles.caseFooter}>
                <span>{t.ready}</span>
                <span aria-hidden="true">● ● ━</span>
              </div>
            </>
          )}
          <span className={styles.connector} aria-hidden="true" />
        </div>
        <footer className={styles.footer}>
          <Link href={langPath(lang, '/portfolio')}>{t.skip}</Link>
          <div>
            <Link href={langPath(lang, '/impressum')}>{t.legal}</Link>
            <Link href={langPath(lang, '/datenschutz')}>{t.privacy}</Link>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
              }
            >
              {t.cookies}
            </button>
            <select
              aria-label={t.lang}
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
            >
              <option value="de">DE</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>
        </footer>
      </section>
      <span className={styles.srOnly} role="status">
        {phase === 'booting' ? t.boot : ready ? t.menu : t.hint}
      </span>
      {panel && (
        <dialog
          ref={dialog}
          className={`${styles.dialog} ${panel === 'projects' ? styles.projectDialog : ''}`}
          aria-labelledby="console-panel-title"
          onCancel={(e) => {
            e.preventDefault()
            setPanel(null)
          }}
          onClose={() => setPanel(null)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPanel(null)
          }}
        >
          <div className={styles.dialogInner}>
            <header className={styles.dialogHeader}>
              <h2 id="console-panel-title">
                {panel === 'projects' ? t.projects : t.contactTitle}
              </h2>
              <button
                type="button"
                aria-label={t.close}
                onClick={() => setPanel(null)}
                autoFocus
              >
                <X aria-hidden="true" />
              </button>
            </header>
            {panel === 'projects' ? (
              <ConsoleProjects />
            ) : (
              <div className={styles.contactPanel}>
                <p>{t.contactIntro}</p>
                <div className={styles.directContact}>
                  <a href="mailto:kontakt@hareb.digital">
                    kontakt@hareb.digital
                  </a>
                  <a href="tel:+4915259559708">01525 9559708</a>
                </div>
                <div className={styles.contactForm}>
                  <EnquiryForm />
                </div>
              </div>
            )}
          </div>
        </dialog>
      )}
    </main>
  )
}
