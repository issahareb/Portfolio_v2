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
import { Manrope } from 'next/font/google'
import { useLanguage } from './language-context'
import styles from './retro-console.module.css'

const manrope = Manrope({ subsets: ['latin'], display: 'swap', preload: false, variable: '--font-manrope' })

type Module = 'work' | 'about' | 'system' | 'contact'
type Phase = 'standby' | 'booting' | 'ready'
const projects = [
  {
    name: 'GuardianGrid',
    image: '/projects/guardiangrid-login.jpg',
    category: ['Gaming · Plattform', 'Gaming · Platform', 'Gaming · Plataforma'],
    detail: [
      'Ein digitales Zuhause für Guardians. Inventar, Loadouts und intelligente Tools für Destiny.',
      'A digital home for Guardians. Inventory, loadouts and intelligent tools for Destiny.',
      'Un hogar digital para los Guardianes. Inventario, equipamiento y herramientas inteligentes para Destiny.',
    ],
    target: '#work',
  },
  {
    name: 'L.U.K.A.S.',
    image: '/projects/lukas.png',
    category: ['KI · Automatisierung', 'AI · Automation', 'IA · Automatización'],
    detail: [
      'Ein persönlicher Assistent, der Aufgaben verbindet. Von Sprache bis zu autonomen Abläufen.',
      'A personal assistant connecting tasks. From voice to autonomous workflows.',
      'Un asistente personal que conecta tareas, desde la voz hasta los procesos autónomos.',
    ],
    target: '#lukas',
  },
  {
    name: 'TaxiBB Essen',
    image: '/projects/taxibb.png',
    category: ['Web · Kundenprojekt', 'Web · Client project', 'Web · Proyecto de cliente'],
    detail: [
      'Vom ersten Klick zur Fahrt. Eine Website mit direkter Online-Anfrage und eigener Verwaltung.',
      'From first click to the journey. A website with online enquiries and its own administration.',
      'Del primer clic al viaje. Una web con consultas en línea y administración propia.',
    ],
    target: '#work',
  },
] as const

export function RetroConsole() {
  const { lang } = useLanguage()
  const locale = lang === 'de' ? 0 : lang === 'es' ? 2 : 1
  const copy = (de: string, en: string, es: string) => lang === 'de' ? de : lang === 'es' ? es : en
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
    work: copy('Projekte', 'Projects', 'Proyectos'),
    about: copy('Über mich', 'About', 'Sobre mí'),
    system: copy('Technik', 'System', 'Tecnología'),
    contact: copy('Kontakt', 'Contact', 'Contacto'),
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
      lenis.scrollTo(element, { offset: -100, immediate: !!reducedMotion })
    else
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 100, behavior: reducedMotion ? 'instant' : 'smooth' })
    if (element instanceof HTMLElement) {
      if (!element.hasAttribute('tabindex'))
        element.setAttribute('tabindex', '-1')
      element.focus({ preventScroll: true })
    }
  }

  return (
    <section
      id="top"
      className={`${manrope.variable} ${styles.section}`}
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
          {copy('Design. Entwicklung. Ein bisschen Magie.', 'Design. Development. A little magic.', 'Diseño. Desarrollo. Un poco de magia.')}
        </p>
        <h1 id="console-heading">
          {copy('Gute Ideen', 'Good ideas', 'Las buenas ideas')}
          <br />
          <span>{copy('brauchen Strom.', 'need a spark.', 'necesitan energía.')}</span>
        </h1>
        <p>
          {copy('Ich bin Issa. Ich mache aus Ideen digitale Erlebnisse.', 'I’m Issa. I turn ideas into digital experiences.', 'Soy Issa. Transformo ideas en experiencias digitales.')}
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
                        <h2>{copy('Bereit für mehr?', 'Ready for more?', '¿Listo para más?')}</h2>
                        <p>
                          {copy('Drück den leuchtenden Powerbutton.', 'Press the illuminated power button.', 'Pulsa el botón de encendido iluminado.')}
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
                          {copy('Ideen werden geladen.', 'Loading possibilities.', 'Cargando posibilidades.')}
                        </strong>
                        <div className={styles.bootTrack}>
                          <span />
                        </div>
                        <p>
                          {copy('Verbindungen herstellen. Möglichkeiten öffnen.', 'Connecting ideas. Opening possibilities.', 'Conectando ideas. Abriendo posibilidades.')}
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
                                {copy('Projekt entdecken', 'Explore project', 'Explorar proyecto')}
                                <ArrowUpRight size={16} aria-hidden="true" />
                              </a>
                            </div>
                            <div
                              className={styles.projectControls}
                              aria-label={
                                copy('Projektauswahl', 'Project selection', 'Selección de proyectos')
                              }
                            >
                              <button
                                type="button"
                                onClick={() => nextProject(-1)}
                                aria-label={
                                  copy('Vorheriges Projekt', 'Previous project', 'Proyecto anterior')
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
                                  copy('Nächstes Projekt', 'Next project', 'Siguiente proyecto')
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
                              {copy('Neugier als Antrieb.', 'Curiosity, by default.', 'La curiosidad como motor.')}
                            </h2>
                            <p>
                              {copy('Ich bin Issa Hareb aus Essen. Mit Hareb Digital verbinde ich Design, Entwicklung und intelligente Systeme. Mein Anspruch: Dinge bauen, die gut aussehen und wirklich etwas können.', 'I’m Issa Hareb from Essen. At Hareb Digital, I connect design, development and intelligent systems. I build things that look good and do something useful.', 'Soy Issa Hareb, de Essen. En Hareb Digital conecto diseño, desarrollo y sistemas inteligentes. Creo productos atractivos y útiles.')}
                            </p>
                            <a
                              className={styles.screenLink}
                              href="#about"
                              onClick={(event) => goTo(event, '#about')}
                            >
                              {copy('Meine Geschichte', 'My story', 'Mi historia')}
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
                              {copy('Von Idee bis Interface.', 'From idea to interface.', 'De la idea a la interfaz.')}
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
                              {copy('Technik ansehen', 'Explore the stack', 'Explorar la tecnología')}
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
                              {copy('Was bauen wir als Nächstes?', 'What shall we build next?', '¿Qué creamos ahora?')}
                            </h2>
                            <p>
                              {copy('Eine Website, eine Plattform oder eine Idee, die noch keinen Namen hat. Lass uns darüber sprechen.', 'A website, a platform, or an idea that doesn’t have a name yet. Let’s talk.', 'Una web, una plataforma o una idea que aún no tiene nombre. Hablemos.')}
                            </p>
                            <a
                              className={styles.screenLink}
                              href="mailto:kontakt@hareb.digital"
                            >
                              {copy('Projekt besprechen', 'Discuss a project', 'Hablemos de tu proyecto')}
                              <ArrowUpRight size={16} />
                            </a>
                            <a
                              className={styles.textLink}
                              href="#contact"
                              onClick={(event) => goTo(event, '#contact')}
                            >
                              {copy('Alle Kontaktmöglichkeiten', 'All contact options', 'Todas las formas de contacto')}
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
                aria-label={copy('Konsolensteuerung', 'Console controls', 'Controles de la consola')}
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
                        ? copy('Konsole ausschalten', 'Power off console', 'Apagar la consola')
                        : copy('Konsole einschalten', 'Power on console', 'Encender la consola')
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
                aria-label={copy('Konsolenmodule', 'Console modules', 'Módulos de la consola')}
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
          ? copy('Ein Knopfdruck. Viele Möglichkeiten.', 'One button. Endless possibilities.', 'Un botón. Muchas posibilidades.')
          : phase === 'booting'
            ? copy('Die Konsole startet …', 'Starting the console …', 'Iniciando la consola…')
            : copy('System bereit. Wähle dein Modul.', 'System ready. Choose your module.', 'Sistema listo. Elige un módulo.')}
      </p>
      <a
        className={styles.skip}
        href="#work"
        onClick={(event) => goTo(event, '#work')}
      >
        {copy('Direkt zum Portfolio', 'Go straight to the portfolio', 'Ir directamente al portfolio')}
        <ArrowDown size={14} aria-hidden="true" />
      </a>
      <noscript>
        <p>
          Portfolio: <a href="#work">{copy('Projekte', 'Projects', 'Proyectos')}</a> ·{' '}
          <a href="#about">{copy('Über mich', 'About', 'Sobre mí')}</a> ·{' '}
          <a href="#contact">{copy('Kontakt', 'Contact', 'Contacto')}</a>
        </p>
      </noscript>
    </section>
  )
}
