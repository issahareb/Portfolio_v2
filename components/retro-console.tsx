'use client'

import {
  useEffect,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Power,
} from 'lucide-react'
import { useLanguage } from './language-context'
import styles from './retro-console.module.css'

type Module = 'work' | 'about' | 'system' | 'contact'
type Phase = 'standby' | 'booting' | 'ready'
const projects = [
  {
    name: 'GuardianGrid',
    image: '/projects/guardiangrid-login.jpg',
    category: ['Gaming · Plattform', 'Gaming · Platform'],
    detail: [
      'Ein digitales Zuhause für Guardians. Inventar, Loadouts und intelligente Tools für Destiny.',
      'A digital home for Guardians. Inventory, loadouts and intelligent tools for Destiny.',
    ],
    target: '#work',
  },
  {
    name: 'L.U.K.A.S.',
    image: '/projects/lukas.png',
    category: ['KI · Automatisierung', 'AI · Automation'],
    detail: [
      'Ein persönlicher Assistent, der Aufgaben verbindet. Von Sprache bis zu autonomen Abläufen.',
      'A personal assistant connecting tasks. From voice to autonomous workflows.',
    ],
    target: '#lukas',
  },
  {
    name: 'TaxiBB Essen',
    image: '/projects/taxibb.png',
    category: ['Web · Kundenprojekt', 'Web · Client project'],
    detail: [
      'Vom ersten Klick zur Fahrt. Eine Website mit direkter Online-Anfrage und eigener Verwaltung.',
      'From first click to the journey. A website with online enquiries and its own administration.',
    ],
    target: '#work',
  },
] as const

export function RetroConsole() {
  const { lang } = useLanguage()
  const de = lang === 'de'
  const locale = de ? 0 : 1
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('standby')
  const [module, setModule] = useState<Module>('work')
  const [projectIndex, setProjectIndex] = useState(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(x, { stiffness: 110, damping: 24 })
  const rotateY = useSpring(y, { stiffness: 110, damping: 24 })
  const on = phase !== 'standby'
  const ready = phase === 'ready'
  const project = projects[projectIndex]
  const labels: Record<Module, string> = {
    work: de ? 'Projekte' : 'Projects',
    about: de ? 'Über mich' : 'About',
    system: de ? 'Technik' : 'System',
    contact: de ? 'Kontakt' : 'Contact',
  }

  useEffect(() => {
    if (phase !== 'booting') return
    const timer = window.setTimeout(
      () => setPhase('ready'),
      reducedMotion ? 0 : 1350,
    )
    return () => window.clearTimeout(timer)
  }, [phase, reducedMotion])

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((0.5 - (event.clientY - rect.top) / rect.height) * 3)
    y.set(((event.clientX - rect.left) / rect.width - 0.5) * 5)
  }
  function resetTilt() {
    x.set(0)
    y.set(0)
  }
  function togglePower() {
    setPhase(on ? 'standby' : 'booting')
    setModule('work')
  }
  function nextProject(direction: number) {
    setProjectIndex(
      (index) => (index + direction + projects.length) % projects.length,
    )
  }
  function goTo(event: React.MouseEvent<HTMLAnchorElement>, target: string) {
    const element = document.querySelector(target)
    if (!element) return
    event.preventDefault()
    history.replaceState(null, '', target)
    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (target: Element, options?: object) => void }
      }
    ).__lenis
    if (lenis)
      lenis.scrollTo(element, { offset: -60, immediate: !!reducedMotion })
    else
      element.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' })
    if (element instanceof HTMLElement) {
      if (!element.hasAttribute('tabindex'))
        element.setAttribute('tabindex', '-1')
      element.focus({ preventScroll: true })
    }
  }

  return (
    <section
      id="intro"
      className={styles.section}
      aria-labelledby="console-heading"
      data-phase={phase}
    >
      <header className={styles.masthead}>
        <a
          href="https://hareb.digital/"
          className={styles.brand}
          aria-label="Hareb Digital"
        >
          <span className={styles.brandMark} aria-hidden="true">
            h.
          </span>
          <span>
            HAREB
            <br />
            DIGITAL
          </span>
        </a>
        <span className={styles.edition}>
          ISSA HAREB / PORTFOLIO
          <br />
          <span>INTERACTIVE EDITION · 2026</span>
        </span>
      </header>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>
          {de
            ? 'Design. Entwicklung. Ein bisschen Magie.'
            : 'Design. Development. A little magic.'}
        </p>
        <h1 id="console-heading">
          {de ? 'Gute Ideen' : 'Good ideas'}
          <br />
          <span>{de ? 'brauchen Strom.' : 'need a spark.'}</span>
        </h1>
        <p>
          {de
            ? 'Ich bin Issa. Ich mache aus Ideen digitale Erlebnisse.'
            : 'I’m Issa. I turn ideas into digital experiences.'}
        </p>
      </div>
      <div className={styles.stage}>
        <div className={styles.floorShadow} aria-hidden="true" />
        <motion.div
          className={styles.machine}
          style={{ rotateX, rotateY }}
          onPointerMove={tilt}
          onPointerLeave={resetTilt}
        >
          <div className={styles.cabinet}>
            <div className={styles.topRail}>
              <span>HAREB DIGITAL</span>
              <span>CREATIVE SYSTEM / IH–01</span>
            </div>
            <div className={styles.face}>
              <div className={styles.monitor}>
                <div
                  className={styles.screen}
                  id="console-screen"
                  aria-busy={phase === 'booting'}
                >
                  <div className={styles.screenStatus}>
                    <span>
                      <i /> HAREB OS
                    </span>
                    <span>{ready ? 'ONLINE' : on ? 'BOOT' : 'STANDBY'}</span>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    {phase === 'standby' && (
                      <motion.div
                        key="standby"
                        className={styles.standby}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.15 }}
                      >
                        <div
                          className={styles.standbyGraphic}
                          aria-hidden="true"
                        >
                          <span />
                          <span />
                          <span />
                          <b>h.</b>
                        </div>
                        <h2>{de ? 'Bereit für mehr?' : 'Ready for more?'}</h2>
                        <p>
                          {de
                            ? 'Drück den leuchtenden Powerbutton.'
                            : 'Press the illuminated power button.'}
                        </p>
                      </motion.div>
                    )}
                    {phase === 'booting' && (
                      <motion.div
                        key="boot"
                        className={styles.boot}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span>HAREB DIGITAL / CREATIVE SYSTEM</span>
                        <strong>
                          {de
                            ? 'Ideen werden geladen.'
                            : 'Loading possibilities.'}
                        </strong>
                        <div className={styles.bootTrack}>
                          <span />
                        </div>
                        <p>
                          {de
                            ? 'Verbindungen herstellen. Möglichkeiten öffnen.'
                            : 'Connecting ideas. Opening possibilities.'}
                        </p>
                      </motion.div>
                    )}
                    {ready && (
                      <motion.div
                        key={module}
                        id="console-content"
                        className={styles.content}
                        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.2 }}
                      >
                        {module === 'work' && (
                          <>
                            <div
                              className={styles.projectVisual}
                              style={
                                {
                                  '--project-image': `url("${project.image}")`,
                                } as CSSProperties
                              }
                              aria-hidden="true"
                            >
                              <span>SELECTED WORK / 0{projectIndex + 1}</span>
                            </div>
                            <div className={styles.projectCopy}>
                              <p className={styles.screenEyebrow}>
                                {project.category[locale]}
                              </p>
                              <h2>{project.name}</h2>
                              <p>{project.detail[locale]}</p>
                              <a
                                className={styles.screenLink}
                                href={project.target}
                                onClick={(event) => goTo(event, project.target)}
                              >
                                {de ? 'Projekt entdecken' : 'Explore project'}
                                <ArrowUpRight size={16} aria-hidden="true" />
                              </a>
                            </div>
                            <div
                              className={styles.projectControls}
                              aria-label={
                                de ? 'Projektauswahl' : 'Project selection'
                              }
                            >
                              <button
                                type="button"
                                onClick={() => nextProject(-1)}
                                aria-label={
                                  de ? 'Vorheriges Projekt' : 'Previous project'
                                }
                              >
                                <ArrowLeft size={16} />
                              </button>
                              <span aria-live="polite">
                                0{projectIndex + 1} / 0{projects.length}{' '}
                                <span className={styles.srOnly}>
                                  {project.name}
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => nextProject(1)}
                                aria-label={
                                  de ? 'Nächstes Projekt' : 'Next project'
                                }
                              >
                                <ArrowRight size={16} />
                              </button>
                            </div>
                          </>
                        )}
                        {module === 'about' && (
                          <div className={styles.textPanel}>
                            <span className={styles.screenEyebrow}>
                              01 / {labels.about}
                            </span>
                            <h2>
                              {de
                                ? 'Neugier als Antrieb.'
                                : 'Curiosity, by default.'}
                            </h2>
                            <p>
                              {de
                                ? 'Ich bin Issa Hareb aus Essen. Mit Hareb Digital verbinde ich Design, Entwicklung und intelligente Systeme. Mein Anspruch: Dinge bauen, die gut aussehen und wirklich etwas können.'
                                : 'I’m Issa Hareb from Essen. At Hareb Digital, I connect design, development and intelligent systems. I build things that look good and do something useful.'}
                            </p>
                            <a
                              className={styles.screenLink}
                              href="#about"
                              onClick={(event) => goTo(event, '#about')}
                            >
                              {de ? 'Meine Geschichte' : 'My story'}
                              <ArrowUpRight size={16} />
                            </a>
                          </div>
                        )}
                        {module === 'system' && (
                          <div className={styles.textPanel}>
                            <span className={styles.screenEyebrow}>
                              02 / {labels.system}
                            </span>
                            <h2>
                              {de
                                ? 'Von Idee bis Interface.'
                                : 'From idea to interface.'}
                            </h2>
                            <ul className={styles.stackList}>
                              <li>
                                <span>01</span> React / Next.js / TypeScript
                              </li>
                              <li>
                                <span>02</span> Node.js / Python / PostgreSQL
                              </li>
                              <li>
                                <span>03</span> AI / Automation / Three.js
                              </li>
                            </ul>
                            <a
                              className={styles.screenLink}
                              href="#stack"
                              onClick={(event) => goTo(event, '#stack')}
                            >
                              {de ? 'Technik ansehen' : 'Explore the stack'}
                              <ArrowUpRight size={16} />
                            </a>
                          </div>
                        )}
                        {module === 'contact' && (
                          <div className={styles.textPanel}>
                            <span className={styles.screenEyebrow}>
                              03 / {labels.contact}
                            </span>
                            <h2>
                              {de
                                ? 'Was bauen wir als Nächstes?'
                                : 'What shall we build next?'}
                            </h2>
                            <p>
                              {de
                                ? 'Eine Website, eine Plattform oder eine Idee, die noch keinen Namen hat. Lass uns darüber sprechen.'
                                : 'A website, a platform, or an idea that doesn’t have a name yet. Let’s talk.'}
                            </p>
                            <a
                              className={styles.screenLink}
                              href="mailto:info@hareb.org"
                            >
                              {de ? 'Projekt besprechen' : 'Discuss a project'}
                              <ArrowUpRight size={16} />
                            </a>
                            <a
                              className={styles.textLink}
                              href="#contact"
                              onClick={(event) => goTo(event, '#contact')}
                            >
                              {de
                                ? 'Alle Kontaktmöglichkeiten'
                                : 'All contact options'}
                            </a>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className={styles.screenFooter}>
                    <span>DESIGNED IN ESSEN</span>
                    <span>
                      {ready ? 'INPUT READY' : 'AWAITING INPUT'} <b>_</b>
                    </span>
                  </div>
                </div>
              </div>
              <aside
                className={styles.hardware}
                aria-label={de ? 'Konsolensteuerung' : 'Console controls'}
              >
                <div className={styles.powerGroup}>
                  <span className={styles.hardwareLabel}>POWER</span>
                  <button
                    type="button"
                    onClick={togglePower}
                    className={styles.power}
                    aria-controls="console-screen"
                    aria-pressed={on}
                    aria-label={
                      on
                        ? de
                          ? 'Konsole ausschalten'
                          : 'Power off console'
                        : de
                          ? 'Konsole einschalten'
                          : 'Power on console'
                    }
                  >
                    <Power aria-hidden="true" strokeWidth={1.6} />
                  </button>
                  <span className={styles.powerCaption}>
                    {on ? 'ON' : 'PUSH TO START'}
                  </span>
                </div>
                <div className={styles.speaker} aria-hidden="true">
                  {Array.from({ length: 7 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <div className={styles.statusLed}>
                  <i className={on ? styles.ledOn : undefined} />
                  <span>SYSTEM {on ? 'ACTIVE' : 'IDLE'}</span>
                </div>
              </aside>
            </div>
            <div className={styles.bottomRail}>
              <span className={styles.serial}>IH–01 / PERSONAL PORTFOLIO</span>
              <div className={styles.vents} aria-hidden="true" />
              <span className={styles.screw} aria-hidden="true" />
            </div>
            <span
              className={`${styles.screw} ${styles.screwLeft}`}
              aria-hidden="true"
            />
            <span
              className={`${styles.screw} ${styles.screwRight}`}
              aria-hidden="true"
            />
          </div>
          <div className={styles.deck}>
            <div className={styles.deckInset}>
              <div
                className={styles.moduleKeys}
                role="group"
                aria-label={de ? 'Konsolenmodule' : 'Console modules'}
                onKeyDown={(event) => {
                  if (
                    !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(
                      event.key,
                    )
                  )
                    return
                  const buttons = Array.from(
                    event.currentTarget.querySelectorAll('button'),
                  )
                  const current = buttons.indexOf(
                    document.activeElement as HTMLButtonElement,
                  )
                  const next =
                    event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? buttons.length - 1
                        : (current +
                            (event.key === 'ArrowRight' ? 1 : -1) +
                            buttons.length) %
                          buttons.length
                  event.preventDefault()
                  buttons[next]?.focus()
                }}
              >
                {(Object.keys(labels) as Module[]).map((item, i) => (
                  <button
                    type="button"
                    key={item}
                    disabled={!ready}
                    aria-pressed={ready && module === item}
                    aria-controls="console-screen"
                    onClick={() => setModule(item)}
                  >
                    <span>0{i + 1}</span>
                    <strong>{labels[item]}</strong>
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className={styles.deckLabel}>
                <span>IDEAS IN. POSSIBILITIES OUT.</span>
                <span>HAREB / DIGITAL</span>
              </div>
            </div>
          </div>
          <div className={styles.feet} aria-hidden="true">
            <i />
            <i />
          </div>
        </motion.div>
      </div>
      <p className={styles.status} role="status">
        {phase === 'standby'
          ? de
            ? 'Ein Knopfdruck. Viele Möglichkeiten.'
            : 'One button. Endless possibilities.'
          : phase === 'booting'
            ? de
              ? 'Die Konsole startet …'
              : 'Starting the console …'
            : de
              ? 'System bereit. Wähle dein Modul.'
              : 'System ready. Choose your module.'}
      </p>
      <a
        className={styles.skip}
        href="#work"
        onClick={(event) => goTo(event, '#work')}
      >
        {de ? 'Direkt zum Portfolio' : 'Go straight to the portfolio'}
        <ArrowDown size={14} aria-hidden="true" />
      </a>
      <noscript>
        <p>
          Portfolio: <a href="#work">Projekte / Projects</a> ·{' '}
          <a href="#about">Über mich / About</a> ·{' '}
          <a href="#contact">Kontakt / Contact</a>
        </p>
      </noscript>
    </section>
  )
}
