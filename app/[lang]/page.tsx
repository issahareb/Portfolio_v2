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
      <main id="main-content" tabIndex={-1} className="relative bg-background outline-none">
        <TopScrim />
        <EdgeGlow />
        <IonTrail />
        <Hero />
        <Scene labelKey="about" backdrop="dust">
          <About />
        </Scene>
        <Resume />
        <Scene labelKey="work" backdrop="nodes">
          <Projects />
        </Scene>
        <Scene labelKey="lukas">
          <Lukas />
        </Scene>
        <Scene labelKey="stack">
          <TechStack />
        </Scene>
        <Scene labelKey="contact" backdrop="aurora">
          <Contact />
        </Scene>
        <EntityBridge />
        <SiteFooter portfolio />
      </main>
    </SmoothScroll>
  )
}
