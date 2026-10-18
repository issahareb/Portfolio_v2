import type { MetadataRoute } from 'next'
import { DEFAULT_LANG, HREFLANG, LANGS, langUrl } from '@/lib/i18n'

// Include canonical, indexable pages and their real translations only.
// No lastModified value is emitted without a reliable content modification date.
const ROUTES: {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/affiliate', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/impressum', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/datenschutz', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // The enquiry form is currently German-only; do not advertise duplicate translations.
  return [{ url: langUrl(DEFAULT_LANG, '/anfrage'), changeFrequency: 'monthly', priority: 0.9 }, ...ROUTES.flatMap((route) => {
    const languages: Record<string, string> = {}
    for (const l of LANGS) languages[HREFLANG[l]] = langUrl(l, route.path)
    languages['x-default'] = langUrl(DEFAULT_LANG, route.path)

    return LANGS.map((lang) => ({
      url: langUrl(lang, route.path),
      changeFrequency: route.changeFrequency,
      /* Die deutsche Fassung führt. Nicht aus Prinzip, sondern weil sie den
         Markt bedient, in dem gearbeitet wird — und weil x-default auf sie
         zeigt. */
      priority: lang === DEFAULT_LANG ? route.priority : route.priority - 0.1,
      alternates: { languages },
    }))
  })]
}

/* /start fehlt hier mit Absicht: die Kundenseite trägt noindex, solange ihre
   eigene Domain nicht steht. Eine Adresse in der Sitemap, die der Seite selbst
   das Indexieren verbietet, ist ein Widerspruch, den die Search Console
   anschliessend als Fehler meldet. */
