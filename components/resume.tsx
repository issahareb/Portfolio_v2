'use client'

import { Reveal } from './anim'
import { SectionHeading } from './section-heading'
import { useLanguage } from './language-context'
import { PORTFOLIO_COPY } from '@/lib/portfolio-copy'

export function Resume() {
  const { lang } = useLanguage()
  const t = PORTFOLIO_COPY[lang].resume
  const entries = [
    { category: t.development, date: t.developmentDate, title: t.developmentTitle, organisation: t.developmentContext, body: t.developmentBody, placeholder: false },
    { category: t.experience, date: t.datePlaceholder, title: t.rolePlaceholder, organisation: t.employerPlaceholder, body: t.experienceBody, placeholder: true },
    { category: t.education, date: t.datePlaceholder, title: t.educationTitle, organisation: t.schoolPlaceholder, body: t.educationBody, placeholder: true },
  ]

  return (
    <section id="resume" aria-label={t.heading} className="relative mx-auto max-w-7xl scroll-mt-28 px-6 py-32">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading label={t.kicker} heading={t.heading} align="left" description={t.intro} tone="blue" />
          <Reveal>
            <p className="mt-8 max-w-[42ch] border-l-2 border-purple/50 pl-4 text-base leading-relaxed text-foreground/70">{t.notice}</p>
          </Reveal>
        </div>
        <div>
          <ol className="border-l border-white/15 pl-6 sm:pl-8">
            {entries.map(entry => (
              <li key={entry.category} className="relative pb-12 last:pb-0">
                <span aria-hidden className="absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full border border-blue/70 bg-background sm:-left-[37px]" />
                <Reveal y={24}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="font-label text-xs uppercase tracking-[0.2em] text-blue">{entry.category}</p>
                    {entry.placeholder && <span className="font-label text-xs uppercase tracking-[0.12em] text-foreground/60">{t.placeholder}</span>}
                  </div>
                  <p className="mt-4 text-sm tabular-nums text-foreground/65">{entry.date}</p>
                  <h3 className="mt-2 text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">{entry.title}</h3>
                  <p className="mt-2 text-lg text-foreground/85">{entry.organisation}</p>
                  <p className="mt-4 max-w-[52ch] text-pretty text-[17px] leading-relaxed text-foreground/70">{entry.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
