'use client'

import { AboutIntro } from './about-intro'
import { Reveal } from './anim'
import { useLanguage, useT } from './language-context'
import { PORTFOLIO_COPY } from '@/lib/portfolio-copy'
import styles from './portfolio.module.css'

export function About() {
  const t = useT()
  const { lang } = useLanguage()
  const copy = PORTFOLIO_COPY[lang].resume

  return (
    <section id="about" className="relative">
      <AboutIntro />

      <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-32 pt-24 lg:grid-cols-[1.08fr_1fr] 2xl:max-w-[96rem]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className={styles.sectionIntro}><p className={styles.eyebrow}>{t.about.kicker}</p><h2>{t.about.heading}</h2><p>{t.about.intro}</p></Reveal>

          <Reveal>
            <dl className="mt-10 divide-y divide-white/10 border-t border-white/10">
              {[
                [copy.location, lang === 'de' ? 'Essen, Deutschland' : lang === 'es' ? 'Essen, Alemania' : 'Essen, Germany'],
                [copy.learning, copy.learningValue],
                [copy.focus, copy.focusValue],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-2 py-5 sm:grid-cols-[0.8fr_1.2fr]">
                  <dt className="font-label text-xs uppercase tracking-[0.16em] text-foreground/65">{label}</dt>
                  <dd className="text-lg text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          <div className="mt-3">
            {t.about.pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={Math.min(index, 3) * 0.05} y={24}>
                <article className="group border-t border-white/10 py-7 transition-colors duration-200 hover:border-blue/30">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 max-w-[48ch] text-pretty text-[17px] leading-[1.6] text-foreground/80">
                    {pillar.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
