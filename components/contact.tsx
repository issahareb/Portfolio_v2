'use client'

import { Mail, Phone, MapPin } from 'lucide-react'
import { Reveal } from './anim'
import { GradientOrbs } from './gradient-orbs'
import { useT } from './language-context'
import styles from './portfolio.module.css'

export function Contact() {
  const t = useT()
  const details = [
    {
      icon: Mail,
      label: t.contact.emailLabel,
      value: 'info@hareb.org',
      href: 'mailto:info@hareb.org',
    },
    {
      icon: Phone,
      label: t.contact.phoneLabel,
      value: '01525 9559708',
      href: 'tel:+4915259559708',
    },
    {
      icon: MapPin,
      label: t.contact.locationLabel,
      value: t.contact.locationValue,
      href: null,
    },
  ]

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32 sm:py-40">
      <GradientOrbs />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal className={styles.sectionIntro}><p className={styles.eyebrow}>{t.contact.kicker}</p><h2>{t.contact.heading}</h2><p>{t.contact.subtitle}</p></Reveal>

        <Reveal delay={0.15}>
          <dl className="grid max-w-3xl gap-x-10 gap-y-8 border-y border-white/10 py-10 sm:grid-cols-3">
            {details.map((detail) => (
              <div key={detail.label} className="text-left">
                <dt className="flex items-center justify-start gap-2 text-[14px] font-medium tracking-tight text-foreground/70 sm:justify-start">
                  <detail.icon className="h-3.5 w-3.5 text-blue/70" aria-hidden />
                  {detail.label}
                </dt>
                <dd className="mt-3">
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="inline-block text-lg font-medium tracking-tight text-foreground underline decoration-blue/40 decoration-1 underline-offset-[6px] transition-colors hover:decoration-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue sm:text-xl"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-[19px] font-medium tracking-tight text-foreground/80 sm:text-xl">
                      {detail.value}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-8 flex justify-start">
            <a
              href={`mailto:info@hareb.org?subject=${encodeURIComponent(t.contact.ctaSubject)}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-[15px] font-medium tracking-tight text-foreground/75 underline decoration-white/15 underline-offset-[6px] transition-colors hover:text-foreground hover:decoration-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              {t.contact.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
