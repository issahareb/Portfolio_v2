import { ConsentBanner } from '@/components/consent-banner'
import { Analytics } from '@/components/analytics'
import type { Metadata, Viewport } from 'next'
import { bodyFace, headingFace, posterFace, labelFace } from '@/lib/site-fonts'
import { LanguageProvider } from '@/components/language-context'
import {
  alternatesFor,
  DEFAULT_LANG,
  HREFLANG,
  isLang,
  LANGS,
  langUrl,
  OG_LOCALE,
  type Lang,
} from '@/lib/i18n'

/** Die Route liefert einen beliebigen String; hier wird daraus eine der drei
 *  Sprachen oder Deutsch. */
const toLang = (value: string): Lang => (isLang(value) ? value : DEFAULT_LANG)
import '../globals.css'
import '../elegant-headings.css'

// One shared font configuration prevents conflicting @font-face rules from
// the other root layout. The four existing typographic roles are unchanged.

const SITE_URL = 'https://issahareb.me'
// Personal portfolio metadata; local commercial landing pages live at hareb.digital.
const SITE_TITLE = 'Issa Hareb | Portfolio: Webdesign & Entwicklung aus Essen'
/* 156 characters. It was 206, which Bing's own URL inspection flags and
   which both engines cut off around 160 anyway — the tail was being
   written for nobody. The name leads, because that is the query this page
   is trying to answer. */
const SITE_DESCRIPTION =
  'Issa Hareb, Webdesigner und Entwickler aus Essen: persönliche Projekte, Webdesign, Motion Design und eigene Anwendungen. Gründer von Hareb Digital.'
const SITE_DESCRIPTION_EN =
  'Issa Hareb’s personal portfolio: web design, visual design, motion, 3D and independent applications. Founder of Hareb Digital.'
const SITE_DESCRIPTION_ES =
  'Portfolio personal de Issa Hareb: diseño web, diseño visual, motion, 3D y aplicaciones propias. Fundador de Hareb Digital.'

/* Ein Satz pro Sprache, nicht eine Übersetzung des deutschen.
   Der Name steht in allen dreien vorn, weil das die Suchanfrage ist, die
   diese Seite beantworten soll — der Rest darf sich lesen, als wäre er in
   der jeweiligen Sprache geschrieben worden. */
const TITLES: Record<Lang, string> = {
  de: SITE_TITLE,
  en: 'Issa Hareb | Portfolio · Design, Motion & Development',
  es: 'Issa Hareb | Portfolio · Diseño, Motion y Desarrollo',
}

const DESCRIPTIONS: Record<Lang, string> = {
  de: SITE_DESCRIPTION,
  en: SITE_DESCRIPTION_EN,
  es: SITE_DESCRIPTION_ES,
}


/**
 * Titel, Beschreibung und vor allem die Sprachverweise.
 *
 * Bis hierher stand in `alternates.languages` dreimal derselbe Pfad, mit dem
 * ehrlichen Kommentar: eine URL bedient beide Sprachen, der Wechsel passiert
 * im Browser. Das war korrekt beschrieben und trotzdem wertlos — hreflang
 * ohne unterschiedliche Adressen sagt einem Crawler nichts.
 *
 * Jetzt hat jede Sprache ihre eigene Adresse, und jede Seite nennt alle drei
 * plus x-default. Damit weiss eine Suchmaschine, dass es dieselbe Seite in
 * drei Fassungen ist, statt drei Seiten mit verdaechtig aehnlichem Inhalt.
 */
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }))
}

/* Alles ausserhalb der drei bekannten Sprachen ist keine Seite. Ohne diese
   Zeile wuerde `[lang]` jeden beliebigen ersten Pfadteil annehmen und eine
   deutsche Seite unter einer erfundenen Adresse ausliefern. */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  /* Next typisiert den Parameter als string, nicht als Vereinigung der drei
     Sprachen — die Route weiss nicht, was generateStaticParams zurueckgibt.
     Also hier einengen statt die Signatur zu erzwingen: `dynamicParams =
     false` sorgt dafuer, dass nie etwas anderes ankommt, und der Rueckfall
     auf Deutsch macht daraus trotzdem keinen Absturz. */
  const lang = toLang((await params).lang)
  return {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLES[lang],
    template: '%s | Issa Hareb',
  },
  description: DESCRIPTIONS[lang],
  applicationName: 'Issa Hareb',
  authors: [{ name: 'Issa Hareb', url: SITE_URL }],
  creator: 'Issa Hareb',
  publisher: 'Issa Hareb',
  category: 'technology',
  /* Liefert "https://issahareb.me" ohne Schrägstrich am Ende: Next
     normalisiert absolute Metadaten-URLs und streift ihn ab. Harmlos — ein
     leerer Pfad ist dieselbe URL wie "/" nach RFC 3986 —, aber die Sitemap
     muss dieselbe Schreibweise verwenden, sonst reden beide über
     verschiedene Adressen. */
  alternates: alternatesFor(lang),
  // Explicit rather than inherited: the defaults cap snippet length and
  // image previews, which is the opposite of what a site written to be
  // quoted by answer engines wants.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: TITLES[lang],
    description: DESCRIPTIONS[lang],
    url: langUrl(lang),
    siteName: 'Issa Hareb',
    type: 'profile',
    locale: OG_LOCALE[lang],
    alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLES[lang],
    description: DESCRIPTIONS[lang],
  },
  /* The icon files were in /public and served fine, but nothing in the
     document pointed at them. With no declaration a browser falls back to
     requesting /favicon.ico, which this site does not have, so every visit
     spent a request on a 404 and every tab showed a blank page icon. */
  /* Ownership proofs for the webmaster tools.
     Bing accepts either the meta tag or /BingSiteAuth.xml; both are in
     place, because a verification that drops out silently is the kind of
     thing nobody notices until an index goes stale. Bing's own note is
     explicit that the tag has to stay after verification succeeds.
     Google's token goes in beside it as `google:` once the Search Console
     property is created. */
  verification: {
    other: {
      'msvalidate.01': '9BFD7C2DBC8998DFAC0198132F9FB5B9',
    },
  },
  /* Das Zeichen von Hareb Digital. Hier stand bis zuletzt das v0-Logo aus
     dem Projekt-Gerüst — sichtbar auf jedem Browser-Tab und, wie die
     Namenssuche zeigte, auch neben dem Suchergebnis.

     /favicon.ico ist trotz dieser Liste unverzichtbar: Googles
     Favicon-Crawler fragt genau diesen Pfad ab und liest die Deklarationen
     hier gar nicht erst. Die Datei ist eine echte Multi-Size-ICO von 16 bis
     256, damit jede Oberfläche die Größe bekommt, die sie braucht, statt
     eine einzige herunterzurechnen.

     Hell und dunkel zeigen dasselbe Bild: die Marke bringt ihren eigenen
     dunklen Grund mit, sie braucht also keine zweite Fassung.

     Kein icon.svg mehr. Dort lag ein Nachbau der Marke, solange die
     Originaldatei fehlte; jetzt liegt sie vor. Beides nebeneinander haette
     bedeutet, dass ein Browser mit SVG-Unterstuetzung ein anderes Zeichen
     zeigt als einer ohne — zwei Marken fuer dieselbe Firma, je nach
     Browser. Ein Zeichen, in mehreren Groessen.

     Das -v2 im Dateinamen ist kein Schmuck. Diese Pfade tragen ein Jahr
     `immutable`, und die Begruendung dafuer lautet ausdruecklich: eine neue
     Fassung ist eine neue Datei. Beim ersten Austausch wurde genau dagegen
     verstossen — ueberschrieben statt umbenannt —, und Cloudflare lieferte
     danach tagelang weiter das alte Zeichen aus, gemessen mit
     cf-cache-status HIT und einem Alter von 30 Stunden. Wer diese Bilder
     wieder aendert, aendert den Namen mit. */
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon-32-v2.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-512-v2.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon-v2.png', sizes: '180x180', type: 'image/png' }],
  },
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const lang = toLang((await params).lang)
  return (
    <html
      /* Stand fest auf "de", auch wenn der Besucher auf Englisch umgestellt
         hatte. Ein falsches lang-Attribut betrifft nicht nur Suchmaschinen:
         ein Screenreader spricht den Text dann mit deutscher Aussprache
         vor. Jetzt kommt es aus der Adresse und ist im ersten ausgelieferten
         HTML schon richtig. */
      lang={HREFLANG[lang]}
      className={`${bodyFace.variable} ${headingFace.variable} ${posterFace.variable} ${labelFace.variable} bg-background`}
    >
      <body className="antialiased">
        {/* Keep the public contact links intact at Cloudflare's edge. Its
            email obfuscation rewrites mailto links to /cdn-cgi/l/email-protection,
            which returns 404 to crawlers. These documented HTML comments
            exempt this portfolio's public contact markup without changing
            DNS, caching or the site's appearance. Hidden spans let React
            emit real HTML comments on both sides of the server-rendered tree.
            https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/ */}
        <span hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: '<!--email_off-->' }} />
        <LanguageProvider lang={lang}>
          {children}
          <ConsentBanner />
          <Analytics />
        </LanguageProvider>
        <span hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: '<!--/email_off-->' }} />
        {/* @vercel/analytics is deliberately not mounted. This site is
            deployed on Railway, not Vercel, so the script it injects —
            /_vercel/insights/script.js — is served by nothing: verified 404
            on the live domain, i.e. a failed request on every single visit
            that collected no data in return. The dependency stays in
            package.json so this is one line to restore if the site ever
            moves to Vercel. */}
      </body>
    </html>
  )
}
