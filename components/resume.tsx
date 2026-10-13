'use client'

import { Reveal, WordReveal } from './anim'
import { useLanguage } from './language-context'
import { PORTFOLIO_COPY } from '@/lib/portfolio-copy'

export function Resume() {
  const { lang } = useLanguage()
  const t = PORTFOLIO_COPY[lang].resume
  const entries = [
    { category: t.experience, date: t.datePlaceholder, title: t.rolePlaceholder, organisation: t.employerPlaceholder, body: t.experienceBody, placeholder: true },
    { category: t.education, date: t.datePlaceholder, title: t.educationTitle, organisation: t.schoolPlaceholder, body: t.educationBody, placeholder: true },
  ]

  return (
    <section id="resume" aria-label={t.heading} className="relative mx-auto max-w-7xl scroll-mt-28 px-6 py-20 sm:py-24">
      <Reveal>
        <p className="font-label text-xs uppercase tracking-[0.2em] text-blue">{t.kicker}</p>
      </Reveal>
      <WordReveal as="h2" text={t.heading} className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl" />
      <Reveal>
        <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-foreground/70">{t.intro}</p>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-foreground/60">{t.notice}</p>
      </Reveal>
      <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
        {entries.map(entry => (
          <li key={entry.category}>
            <Reveal y={16}>
              <details className="group/resume py-5">
                <summary className="grid min-h-11 cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-x-6 gap-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue sm:grid-cols-[160px_1fr_auto] [&::-webkit-details-marker]:hidden">
                  <span className="col-start-1 text-sm tabular-nums text-foreground/65 sm:pt-1">{entry.date}</span>
                  <div className="col-start-1 min-w-0 sm:col-start-2 sm:row-start-1">
                    <p className="font-label text-xs uppercase tracking-[0.16em] text-blue">{entry.category} {entry.placeholder && <span className="ml-3 text-foreground/60">{t.placeholder}</span>}</p>
                    <h3 className="mt-1 text-balance font-display text-lg font-semibold tracking-tight sm:text-xl">{entry.title}</h3>
                    <p className="mt-1 text-base text-foreground/70">{entry.organisation}</p>
                  </div>
                  <span aria-hidden className="col-start-2 row-start-1 text-xl text-blue transition-transform group-open/resume:rotate-45 motion-reduce:transition-none sm:col-start-3">+</span>
                </summary>
                <p className="mt-4 max-w-[65ch] text-pretty text-base leading-relaxed text-foreground/70 sm:ml-[184px]">{entry.body}</p>
              </details>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
