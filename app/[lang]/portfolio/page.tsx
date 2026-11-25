import type { Metadata, ResolvingMetadata } from 'next'
import { alternatesFor, isLang, DEFAULT_LANG } from '@/lib/i18n'
import { profileGraph } from '@/lib/profile-graph'
import { SiteNav } from '@/components/site-nav'
import { SkipLink } from '@/components/skip-link'
import { TopScrim } from '@/components/top-scrim'
import { LukasVoiceWidget } from '@/components/lukas-voice-widget'
import { PerfProbe } from '@/components/perf-probe'
import { AmbientBackground } from '@/components/ambient-background'
import { AboutIntro } from '@/components/about-intro'
import { LukasOverview } from '@/components/lukas-overview'
import { BrainDataProvider } from '@/components/lukas-memory/provider'
import styles from '@/components/portfolio.module.css'
import { Lukas } from '@/components/lukas'
import { Projects } from '@/components/projects'
import { About } from '@/components/about'
import { TechStack } from '@/components/tech-stack'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'
import { EntityBridge } from '@/components/entity-bridge'

const copy = {
  de: { title: 'Entwicklerportfolio: Taxi B&B, Hareb Digital und L.U.K.A.S.', description: 'Issa Hareb aus Essen zeigt seine Arbeit an der Taxi-Buchung für Taxi B&B, am Webauftritt von Hareb Digital und am KI-Assistenten L.U.K.A.S.' },
  en: { title: 'Developer portfolio: Taxi B&B, Hareb Digital and L.U.K.A.S.', description: 'Explore how Issa Hareb built the Taxi B&B booking website, the Hareb Digital studio site and L.U.K.A.S., an AI assistant with a knowledge graph.' },
  es: { title: 'Proyectos de desarrollo: Taxi B&B, Hareb Digital y L.U.K.A.S.', description: 'Descubre cómo Issa Hareb desarrolló la web de reservas de Taxi B&B, el sitio de Hareb Digital y L.U.K.A.S., su asistente de IA con un grafo de conocimiento.' },
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const value = (await params).lang
  const lang = isLang(value) ? value : DEFAULT_LANG
  const { title, description } = copy[lang]
  const inherited = await parent
  return {
    title, description,
    twitter: { ...inherited.twitter, card: 'summary_large_image', title, description },
    alternates: alternatesFor(lang, '/portfolio'),
    openGraph: { ...inherited.openGraph, title, description, url: alternatesFor(lang, '/portfolio').canonical },
  }
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const value = (await params).lang
  const lang = isLang(value) ? value : DEFAULT_LANG
  const { title, description } = copy[lang]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileGraph(lang, title, description)).replace(/</g, '\\u003c') }} />
      <AmbientBackground />
      <SkipLink />
      {/* Measures what this device can actually paint and, if it cannot keep
          up, takes the expensive layers off (lib/perf-tier.ts). */}
      <PerfProbe />
      <SiteNav />
      <LukasVoiceWidget />
      <main
        id="main-content"
        tabIndex={-1}
        className={`${styles.site} relative outline-none`}
      >
        <noscript>
          <style>{`
          [data-reveal],[data-wortmaske] > * { opacity:1!important;transform:none!important;filter:none!important; }
          #top { height:auto!important; } [data-hero="stage"] { position:relative!important; }
          #top * { opacity:1!important; } [data-name-word],[data-name-letter] { transform:none!important;filter:none!important; }
          .${styles.personalName} > p { grid-area:auto!important; } .${styles.personalName} > h1 { grid-area:auto!important; }
          .${styles.story} { height:auto!important; }
          .${styles.storyStage} { position:relative!important;height:auto!important;padding:64px 24px; }
          .${styles.storyBrain} { position:relative!important;height:340px; }
          .${styles.storyLabel} { position:relative!important;top:auto!important;left:auto!important;margin:24px 0; }
          .${styles.storyCopy} { position:relative!important;padding:0!important; }
          .${styles.storyScrim},.${styles.storyProgress},.${styles.exploreButton} { display:none!important; }
          [data-story-title],[data-story-beat],[data-story-closing] { position:relative!important;left:auto!important;top:auto!important;bottom:auto!important;opacity:1!important;visibility:visible!important;transform:none!important;width:auto!important;margin:0 0 40px!important; }
        `}</style>
        </noscript>
        <TopScrim />
        <AboutIntro hero />
        <Projects />
        <BrainDataProvider>
          <LukasOverview />
          <Lukas />
        </BrainDataProvider>
        <About />
        <TechStack />
        <Contact />
        <EntityBridge />
        <SiteFooter portfolio />
      </main>
    </>
  )
}
