'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, LayoutDashboard, MoveUpRight, Wallet } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { langPath } from '@/lib/i18n'
import { useLanguage, type Lang } from './language-context'
import styles from './affiliate-page.module.css'

const LANGUAGE_LABELS: Record<Lang, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
}

const COPY = {
  de: {
    label: 'Partnerprogramm',
    benefits: 'Vorteile',
    process: 'Ablauf',
    portfolio: 'Zum Portfolio',
    portfolioAria: 'Zum Portfolio von Issa Hareb',
    headline: ['Gute Kontakte.', 'Gutes Geschäft.'],
    eyebrow: 'Dein Netzwerk. Dein Vorteil.',
    pass: 'Dein Partner-Vorteil',
    together: 'Du empfiehlst. Ich setze um.',
    benefitTitle: 'Dein Kontakt macht den Unterschied.',
    processTitle: 'Ein Kontakt. Drei Schritte.',
    start: 'Lass uns zusammenarbeiten.',
    skip: 'Zum Inhalt',
    intro: 'Du stellst den Kontakt her. Ich übernehme Beratung, Umsetzung und Betreuung.',
    cta: 'Partnerprogramm anfragen',
    subject: 'Anfrage zum Affiliate-Partnerprogramm',
    minimum: 'Mindestens',
    amount: '660,00 €+',
    amountNote: 'Provision pro erfolgreichem Kundenprojekt.',
    earning: 'Mit 2 bis 3 Kunden bereits mehr als 3.000 € verdienen.',
    earningNote: 'Je nach Projektart und Umfang.',
    dashboard: 'Eigenes Partner-Dashboard',
    payout: 'Wöchentliche oder monatliche Auszahlung',
    workload: 'Kein Entwicklungs- oder Supportaufwand',
    step1: 'Kontakt herstellen',
    step1Body: 'Du empfiehlst ein passendes Unternehmen.',
    step2: 'Projekt abschließen',
    step2Body: 'Ich übernehme Angebot und Umsetzung.',
    step3: 'Provision erhalten',
    step3Body: 'Nach Zahlung wird dein Anteil freigegeben.',
    finalTitle: 'Du kennst ein passendes Unternehmen?',
    finalBody: 'Eine kurze Vorstellung reicht für den Start.',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
  },
  en: {
    label: 'Partner programme',
    benefits: 'Benefits',
    process: 'Process',
    portfolio: 'View portfolio',
    portfolioAria: "View Issa Hareb's portfolio",
    headline: ['Good connections.', 'Great potential.'],
    eyebrow: 'Your network. Your opportunity.',
    pass: 'Your partner advantage',
    together: 'You refer. I deliver.',
    benefitTitle: 'Your introduction makes a difference.',
    processTitle: 'One introduction. Three steps.',
    start: 'Let’s work together.',
    skip: 'Skip to content',
    intro: 'You make the introduction. I handle consulting, delivery and support.',
    cta: 'Ask about the partner programme',
    subject: 'Affiliate partner programme inquiry',
    minimum: 'At least',
    amount: '€660.00+',
    amountNote: 'Commission per successful client project.',
    earning: 'Earn more than €3,000 with just two or three clients.',
    earningNote: 'Depending on the project type and scope.',
    dashboard: 'Your own partner dashboard',
    payout: 'Weekly or monthly payouts',
    workload: 'No development or support work',
    step1: 'Make the introduction',
    step1Body: 'Refer a suitable business.',
    step2: 'Close the project',
    step2Body: 'I handle the proposal and delivery.',
    step3: 'Receive commission',
    step3Body: 'Your share is approved after payment.',
    finalTitle: 'Know a suitable business?',
    finalBody: 'A short introduction is enough to get started.',
    imprint: 'Imprint',
    privacy: 'Privacy',
  },
  es: {
    label: 'Programa de socios',
    benefits: 'Ventajas',
    process: 'Proceso',
    portfolio: 'Ver portfolio',
    portfolioAria: 'Ver el portfolio de Issa Hareb',
    headline: ['Buenos contactos.', 'Grandes oportunidades.'],
    eyebrow: 'Tu red. Tu oportunidad.',
    pass: 'Tu ventaja como socio',
    together: 'Tú recomiendas. Yo lo hago realidad.',
    benefitTitle: 'Tu recomendación marca la diferencia.',
    processTitle: 'Un contacto. Tres pasos.',
    start: 'Trabajemos juntos.',
    skip: 'Ir al contenido',
    intro: 'Tú haces la presentación. Yo me encargo de la consultoría, el desarrollo y el soporte.',
    cta: 'Consultar el programa',
    subject: 'Consulta sobre el programa de socios',
    minimum: 'Como mínimo',
    amount: '660,00 €+',
    amountNote: 'Comisión por cada proyecto de cliente completado.',
    earning: 'Con solo dos o tres clientes puedes superar los 3.000 €.',
    earningNote: 'Según el tipo y el alcance del proyecto.',
    dashboard: 'Panel propio para socios',
    payout: 'Pagos semanales o mensuales',
    workload: 'Sin desarrollo ni soporte por tu parte',
    step1: 'Hacer la presentación',
    step1Body: 'Recomiendas una empresa adecuada.',
    step2: 'Cerrar el proyecto',
    step2Body: 'Yo me encargo de la propuesta y la ejecución.',
    step3: 'Recibir la comisión',
    step3Body: 'Tu parte se libera después del pago.',
    finalTitle: '¿Conoces una empresa adecuada?',
    finalBody: 'Una breve presentación es suficiente para empezar.',
    imprint: 'Aviso legal',
    privacy: 'Privacidad',
  },
} as const

export function AffiliatePage() {
  const { lang, setLang } = useLanguage()
  const t = COPY[lang]
  const reducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const passRotation = useTransform(scrollYProgress, [0, 1], [-5, 2])
  const passY = useTransform(scrollYProgress, [0, 1], [0, 36])
  const mailto = `mailto:info@hareb.org?subject=${encodeURIComponent(t.subject)}`
  const features = [
    { title: t.dashboard, icon: LayoutDashboard },
    { title: t.payout, icon: Wallet },
    { title: t.workload, icon: Code2 },
  ]
  const steps = [
    [t.step1, t.step1Body],
    [t.step2, t.step2Body],
    [t.step3, t.step3Body],
  ] as const

  return (
    <div className={styles.page} data-language={lang}>
      <a className={styles.skipLink} href="#main-content">{t.skip}</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href={langPath(lang, '/')} aria-label={t.portfolioAria}>
            issa hareb<span>.</span>
          </Link>
          <nav className={styles.nav} aria-label={t.label}>
            <a href="#benefits">{t.benefits}</a>
            <a href="#process">{t.process}</a>
            <Link href={langPath(lang, '/')}>{t.portfolio}<ArrowUpRight size={15} aria-hidden /></Link>
          </nav>
          <div className={styles.languages} role="group" aria-label="Language">
            {(['de', 'en', 'es'] as const).map((language) => (
              <button key={language} type="button" onClick={() => setLang(language)}
                aria-pressed={lang === language} aria-label={LANGUAGE_LABELS[language]}>
                {language.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="main-content">
        <section ref={heroRef} className={styles.hero} aria-labelledby="affiliate-title">
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow}><span aria-hidden />{t.label}</p>
                <h1 id="affiliate-title" className={styles.headline}>
                  <span>{t.headline[0]}</span><span>{t.headline[1]}</span>
                </h1>
                <p className={styles.intro}>{t.intro}</p>
                <div className={styles.heroActions}>
                  <a className={styles.primaryButton} href={mailto}>{t.cta}<ArrowUpRight size={21} aria-hidden /></a>
                  <a className={styles.processLink} href="#process">{t.process}<ArrowDown size={16} aria-hidden /></a>
                </div>
                <p className={styles.heroFootnote}><Check size={15} aria-hidden />{t.workload}</p>
              </div>

              <div className={styles.passScene}>
                <div className={styles.orbits} aria-hidden><span /><span /><span /></div>
                <span className={styles.sceneLabel} aria-hidden>{t.eyebrow}</span>
                <motion.aside className={styles.partnerPass} aria-label={t.pass}
                  style={{ rotate: reducedMotion ? 0 : passRotation, y: reducedMotion ? 0 : passY }}>
                  <div className={styles.passTop}>
                    <div className={styles.passHeading}><span>{t.pass}</span><ArrowUpRight size={23} aria-hidden /></div>
                    <p className={styles.minimum}>{t.minimum}</p>
                    <p className={styles.amount}><span className={styles.srOnly}>{t.amount}</span><span aria-hidden>660<span>€+</span></span></p>
                    <p className={styles.amountNote}>{t.amountNote}</p>
                    <div className={styles.passLine}><span /> <span /></div>
                  </div>
                  <div className={styles.passBottom}>
                    <span className={styles.passMonogram} aria-hidden>ih.</span>
                    <div><strong>{t.together}</strong><span>{t.step3Body}</span></div>
                  </div>
                </motion.aside>
                <span className={styles.sceneCaption} aria-hidden>ISSA HAREB / PARTNER PROGRAMME</span>
              </div>
            </div>
            <div className={styles.earningStrip}>
              <MoveUpRight className={styles.earningArrow} size={32} strokeWidth={1.4} aria-hidden />
              <p>{t.earning}</p><span>{t.earningNote}</span>
            </div>
          </div>
        </section>

        <section id="benefits" className={styles.benefits} aria-labelledby="benefits-title">
          <div className={styles.container}>
            <div className={styles.benefitGrid}>
              <div><p className={styles.sectionLabel}>{t.benefits}</p><h2 id="benefits-title">{t.benefitTitle}</h2></div>
              <ul className={styles.benefitList}>
                {features.map(({ title, icon: Icon }) => (
                  <li key={title}><Icon size={24} strokeWidth={1.5} aria-hidden /><span>{title}</span><Check size={18} aria-hidden /></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="process" className={styles.process} aria-labelledby="process-title">
          <div className={styles.container}>
            <div className={styles.processHeading}>
              <p className={styles.sectionLabel}>{t.process}</p>
              <h2 id="process-title">{t.processTitle}</h2>
              <ArrowDown size={32} strokeWidth={1.4} aria-hidden />
            </div>
            <ol className={styles.steps}>
              {steps.map(([title, body], index) => (
                <li key={title}>
                  <div className={styles.stepTop}><span>{String(index + 1).padStart(2, '0')}</span>{index < 2 ? <ArrowRight size={24} strokeWidth={1.4} aria-hidden /> : <Check size={24} strokeWidth={1.4} aria-hidden />}</div>
                  <h3>{title}</h3><p>{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.contact} aria-labelledby="contact-title">
          <div className={styles.container}>
            <p className={styles.sectionLabel}>{t.start}</p>
            <div className={styles.contactGrid}>
              <h2 id="contact-title">{t.finalTitle}</h2>
              <div><p>{t.finalBody}</p><a className={styles.primaryButton} href={mailto}>{t.cta}<ArrowUpRight size={21} aria-hidden /></a></div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerTop}>
            <Link className={styles.brand} href={langPath(lang, '/')} aria-label={t.portfolioAria}>issa hareb<span>.</span></Link>
            <span>{t.label}</span>
            <Link className={styles.footerPortfolio} href={langPath(lang, '/')}>{t.portfolio}<ArrowUpRight size={16} aria-hidden /></Link>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Issa Hareb</p>
            <nav aria-label="Legal"><Link href={langPath(lang, '/impressum')}>{t.imprint}</Link><Link href={langPath(lang, '/datenschutz')}>{t.privacy}</Link></nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
