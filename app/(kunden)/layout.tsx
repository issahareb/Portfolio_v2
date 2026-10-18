import type { Metadata, Viewport } from 'next'
import { cookies, headers } from 'next/headers'
import { bodyFace, headingFace, posterFace, labelFace } from '@/lib/site-fonts'
import { HD_HREFLANG, HD_KEKS, hdSprache } from '@/lib/hd-texte'
import '../globals.css'
import '../legacy-landing.css'

/**
 * Die Kundenseite — und ein eigenes Wurzel-Layout, kein geschachteltes.
 *
 * Seit die Sprachen eigene Adressen haben, liegt das bisherige Wurzel-Layout
 * unter `app/[lang]/`. Damit gibt es kein `app/layout.tsx` mehr, das `<html>`
 * und `<body>` für alle Zweige aufspannt, und jeder oberste Zweig muss es
 * selbst tun. Ohne das lieferte /start ein Dokument ohne html- und
 * body-Element aus — gemessen, nicht vermutet.
 *
 * Das ist kein Umweg, sondern der Grund, warum die Trennung überhaupt gewollt
 * ist: Hareb Digital soll nicht den Graphen, die Metadaten und die Sprachlogik
 * des Portfolios erben. Es teilt sich die Schriften und die Farbtoken, sonst
 * nichts.
 *
 * `noindex`, solange die eigene Domain fehlt. Eine Seite, die erst unter
 * issahareb.me Bewertungen sammelt und danach umzieht, träte gegen sich
 * selbst an.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://issahareb.me'),
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  /* Dunkel, seit der Held ein formatfuellender Film ist: ein Schreibtisch auf
     einem Berggipfel im Sonnenaufgang. Die Seite darunter im hellen Papierton
     zu lassen waere kein Wechsel, sondern ein Bruch — man saehe zwei Seiten,
     die zufaellig untereinander stehen.

     Der Wert steuert auch die Farbe der Adressleiste auf dem Telefon und die
     Voreinstellung der Formularfelder. Beides stand vorher auf Hell und waere
     jetzt zweimal falsch. */
  colorScheme: 'dark',
  themeColor: '#0b0a09',
  width: 'device-width',
  initialScale: 1,
}

export default async function KundenLayout({ children }: { children: React.ReactNode }) {
  /* Dieselbe Sprachwahl wie in der Seite darunter, aus demselben Kopf. Sie
     steht hier ein zweites Mal, weil nur das Layout das html-Element schreibt
     und ein falsches lang-Attribut echte Folgen hat: Vorleseprogramme sprechen
     die Seite dann mit deutscher Aussprache englisch vor. */
  const [kopf, keks] = await Promise.all([headers(), cookies()])
  const lang = hdSprache({
    gewaehlt: keks.get(HD_KEKS)?.value,
    akzeptiert: kopf.get('accept-language'),
    land: kopf.get('cf-ipcountry') ?? kopf.get('x-vercel-ip-country'),
  })
  return (
    <html
      lang={HD_HREFLANG[lang]}
      className={`${bodyFace.variable} ${headingFace.variable} ${posterFace.variable} ${labelFace.variable}`}
    >
      <body className="hd antialiased">{children}</body>
    </html>
  )
}
