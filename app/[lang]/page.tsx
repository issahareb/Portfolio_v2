import { SmoothScroll } from '@/components/smooth-scroll'
import { ClickSpark } from '@/components/click-spark'
import { IonTrail } from '@/components/ion-trail'
import { MouseGlow } from '@/components/mouse-glow'
import { EdgeGlow } from '@/components/edge-glow'
import { SiteNav } from '@/components/site-nav'
import { SkipLink } from '@/components/skip-link'
import { TopScrim } from '@/components/top-scrim'
import { LukasVoiceWidget } from '@/components/lukas-voice-widget'
import { ConsentBanner } from '@/components/consent-banner'
import { Analytics } from '@/components/analytics'
import { PerfProbe } from '@/components/perf-probe'
import { Hero } from '@/components/hero'
import { LukasOverview } from '@/components/lukas-overview'
import styles from '@/components/portfolio.module.css'
import { Lukas } from '@/components/lukas'
import { Projects } from '@/components/projects'
import { About } from '@/components/about'
import { Resume } from '@/components/resume'
import { TechStack } from '@/components/tech-stack'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'
import { EntityBridge } from '@/components/entity-bridge'
import { Scene, FilmGrain } from '@/components/scene'

export default function Page() {
  return (
    <SmoothScroll>
      {/* Funken am Zeiger, bei jedem Klick. Die Leinwand ist fest am
          Bildschirm und genau fenstergross: die Vorlage spannt sie ueber ihre
          Kinder, und das waere hier eine Leinwand von rund 27.000 Pixeln
          Hoehe, ueber jedem Browserdeckel. */}
      <ClickSpark sparkColor="#b6c8ff" sparkSize={11} sparkRadius={17} sparkCount={8} duration={430} />
      <SkipLink />
      {/* Measures what this device can actually paint and, if it cannot keep
          up, takes the expensive layers off (lib/perf-tier.ts). */}
      <PerfProbe />
      <MouseGlow />
      <FilmGrain />
      <SiteNav />
      <LukasVoiceWidget />
      <ConsentBanner />
      <Analytics />
      <main id="main-content" tabIndex={-1} className={`${styles.site} relative bg-background outline-none`}>
        <noscript><style>{`
          [data-reveal],[data-wortmaske] > * { opacity:1!important;transform:none!important;filter:none!important; }
          #top { height:auto!important; } [data-hero="stage"] { position:relative!important; }
          #top * { opacity:1!important; }
          .${styles.story} { height:auto!important; }
          .${styles.storyStage} { position:relative!important;height:auto!important;padding:64px 24px; }
          .${styles.storyBrain} { position:relative!important;height:340px; }
          .${styles.storyLabel} { position:relative!important;top:auto!important;left:auto!important;margin:24px 0; }
          .${styles.storyCopy} { position:relative!important;padding:0!important; }
          .${styles.storyScrim},.${styles.storyProgress},.${styles.exploreButton} { display:none!important; }
          [data-story-title],[data-story-beat],[data-story-closing] { position:relative!important;left:auto!important;top:auto!important;bottom:auto!important;opacity:1!important;visibility:visible!important;transform:none!important;width:auto!important;margin:0 0 40px!important; }
        `}</style></noscript>
        <TopScrim />
        <EdgeGlow />
        <IonTrail />
        <Hero />
        <Scene labelKey="work" >
          <Projects />
        </Scene>
        <LukasOverview />
        <Lukas />
        <Scene labelKey="about" >
          <About />
        </Scene>
        <Scene labelKey="stack">
          <TechStack />
        </Scene>
        <Resume />
        <Scene labelKey="contact" backdrop="aurora">
          <Contact />
        </Scene>
        <EntityBridge />
        <SiteFooter portfolio />
      </main>
    </SmoothScroll>
  )
}
