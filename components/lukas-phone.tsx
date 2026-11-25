import { Phone, ArrowUpRight } from 'lucide-react'
import styles from './lukas-phone.module.css'

const COPY = {
  de: { label: 'L.U.K.A.S. / Telefonie', title: 'Sprich mit L.U.K.A.S.', description: 'Lerne meinen KI-Assistenten im echten Telefonat kennen. Frag ihn nach meinen Projekten oder Hareb Digital.', call: 'L.U.K.A.S. anrufen', note: 'Du sprichst mit einer KI. Es gelten die Telefonkosten deines Tarifs.' },
  en: { label: 'L.U.K.A.S. / Phone', title: 'Talk to L.U.K.A.S.', description: 'Meet my AI assistant in a real phone call. Ask about my projects or Hareb Digital.', call: 'Call L.U.K.A.S.', note: 'You are speaking with AI. Your usual call charges apply.' },
  es: { label: 'L.U.K.A.S. / Teléfono', title: 'Habla con L.U.K.A.S.', description: 'Conoce a mi asistente de IA por teléfono. Pregúntale por mis proyectos o Hareb Digital.', call: 'Llamar a L.U.K.A.S.', note: 'Hablarás con una IA. Se aplican las tarifas habituales de tu operador.' },
} as const

export function LukasPhone({ lang, console = false }: { lang: keyof typeof COPY; console?: boolean }) {
  const t = COPY[lang]
  return (
    <section id="lukas-telefonie" className={styles.section} data-console={console} aria-labelledby="lukas-phone-title">
      <div className={styles.copy}>
        <p className={styles.label}><Phone size={15} strokeWidth={1.7} aria-hidden="true" />{t.label}</p>
        <h2 id="lukas-phone-title">{t.title}</h2>
        <p className={styles.description}>{t.description}</p>
      </div>
      <div className={styles.action}>
        <a className={styles.call} href="tel:+4920185393123" data-track-id="lukas-portfolio-call">
          <span>{t.call}<small>+49 201 85393123</small></span>
          <ArrowUpRight size={21} strokeWidth={1.7} aria-hidden="true" />
        </a>
        <p className={styles.note}>{t.note}</p>
      </div>
    </section>
  )
}
