import { AffiliatePage } from '@/components/affiliate-page'
import type { Metadata } from 'next'
import { alternatesFor, isLang, langUrl } from '@/lib/i18n'

const COPY = {
  "de": [
    "Affiliate-Partnerprogramm",
    "Mindestens 660,00 € Provision pro erfolgreicher Vermittlung. Je nach Projektart, Umfang und Auftragswert ist eine deutlich höhere Vergütung möglich."
  ],
  "en": [
    "Affiliate partner programme",
    "Refer clients to Hareb Digital and earn at least €660 per successful referral. Learn about the process, benefits and partner programme."
  ],
  "es": [
    "Programa de afiliados",
    "Recomienda clientes a Hareb Digital y gana al menos 660 € por cada recomendación exitosa. Descubre el proceso y las ventajas del programa."
  ]
} as const

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const value = (await params).lang
  const lang = isLang(value) ? value : 'de'
  const [title, description] = COPY[lang]
  return {
    title,
    description,
    alternates: alternatesFor(lang, '/affiliate'),
    openGraph: { title: `${title} | Issa Hareb`, description, url: langUrl(lang, '/affiliate'), type: 'website' },
    twitter: { card: 'summary', title: `${title} | Issa Hareb`, description },
  }
}

export default function AffiliateRoute() {
  return <AffiliatePage />
}
