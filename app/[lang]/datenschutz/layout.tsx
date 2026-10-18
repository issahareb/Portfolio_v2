import type { Metadata } from 'next'
import { alternatesFor, isLang, langUrl } from '@/lib/i18n'

const COPY = {
  "de": [
    "Datenschutz",
    "Datenschutzhinweise zum Portfolio von Issa Hareb: Informationen zur Verarbeitung personenbezogener Daten, Cookies und Ihren Rechten."
  ],
  "en": [
    "Privacy policy",
    "Privacy information for the portfolio of Issa Hareb: personal data processing, cookies and your rights."
  ],
  "es": [
    "Política de privacidad",
    "Información sobre privacidad en el portfolio de Issa Hareb: tratamiento de datos personales, cookies y sus derechos."
  ]
} as const

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const value = (await params).lang
  const lang = isLang(value) ? value : 'de'
  const [title, description] = COPY[lang]
  return {
    title,
    description,
    alternates: alternatesFor(lang, '/datenschutz'),
    openGraph: { title: `${title} | Issa Hareb`, description, url: langUrl(lang, '/datenschutz'), type: 'website' },
    twitter: { card: 'summary', title: `${title} | Issa Hareb`, description },
  }
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
