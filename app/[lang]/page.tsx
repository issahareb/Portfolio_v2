import { RetroConsole } from '@/components/retro-console'
import { SITE_URL } from '@/lib/i18n'
import { SkipLink } from '@/components/skip-link'

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Issa Hareb',
        inLanguage: ['de', 'en', 'es'],
        publisher: { '@type': 'Person', '@id': `${SITE_URL}/#issa-hareb`, name: 'Issa Hareb', url: SITE_URL },
      }) }} />
      <SkipLink />
      <RetroConsole />
    </>
  )
}
