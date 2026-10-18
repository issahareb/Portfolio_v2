import type { Metadata } from 'next'
import { alternatesFor, isLang, langUrl } from '@/lib/i18n'

const COPY = {
  "de": [
    "Impressum",
    "Angaben zu Issa Hareb und Hareb Digital: Anbieter, Kontakt und rechtliche Informationen zum Portfolio."
  ],
  "en": [
    "Legal notice",
    "Provider details for Issa Hareb and Hareb Digital, including contact information and legal notices for this portfolio."
  ],
  "es": [
    "Aviso legal",
    "Datos de Issa Hareb y Hareb Digital, información de contacto y avisos legales de este portfolio."
  ]
} as const

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const value = (await params).lang
  const lang = isLang(value) ? value : 'de'
  const [title, description] = COPY[lang]
  return {
    title,
    description,
    alternates: alternatesFor(lang, '/impressum'),
    openGraph: { title: `${title} | Issa Hareb`, description, url: langUrl(lang, '/impressum'), type: 'website' },
    twitter: { card: 'summary', title: `${title} | Issa Hareb`, description },
  }
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
