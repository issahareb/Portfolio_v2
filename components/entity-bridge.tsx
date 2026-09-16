const PERSON_ID = 'https://issahareb.me/#issa-hareb'
const ORGANIZATION_ID = 'https://issahareb.me/#hareb-digital'
const HAREB_DIGITAL_URL = 'https://hareb.digital/'
const GOOGLE_BUSINESS_URL = 'https://share.google/EUZlSQOOkoXIK0AMM'
const INSTAGRAM_URL = 'https://www.instagram.com/issa3701__/'
const TIKTOK_URL = 'https://www.tiktok.com/@issa3701'

const ENTITY_GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Issa Hareb',
      url: 'https://issahareb.me/',
      sameAs: [INSTAGRAM_URL, TIKTOK_URL],
      worksFor: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'ProfessionalService',
      '@id': ORGANIZATION_ID,
      name: 'Hareb Digital',
      url: HAREB_DIGITAL_URL,
      founder: { '@id': PERSON_ID },
      employee: { '@id': PERSON_ID },
      sameAs: [HAREB_DIGITAL_URL, GOOGLE_BUSINESS_URL],
    },
  ],
}

/**
 * Sichtbare und maschinenlesbare Brücke zwischen der Person, ihrem
 * Unternehmen und den persönlichen Social-Profilen.
 *
 * Die sichtbaren Links sind absichtlich nicht nur Icons: Suchmaschinen und
 * Antwortmaschinen bekommen dadurch neben JSON-LD auch normalen Seitentext
 * mit denselben Aussagen und denselben Zieladressen.
 */
export function EntityBridge() {
  return (
    <section
      aria-label="Issa Hareb, Hareb Digital und Social Media"
      className="relative border-t border-white/5 px-6 py-7"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ENTITY_GRAPH) }}
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-[13px] leading-relaxed text-foreground/60 sm:flex-row sm:text-left">
        <p>
          Issa Hareb ist Gründer von{' '}
          <a
            href={HAREB_DIGITAL_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground/80 underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-white/50"
          >
            Hareb Digital
          </a>
          .
        </p>

        <nav
          aria-label="Social Media von Issa Hareb"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="me noreferrer"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-white/50"
          >
            Instagram @issa3701__
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="me noreferrer"
            className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-white/50"
          >
            TikTok @issa3701
          </a>
        </nav>
      </div>
    </section>
  )
}
