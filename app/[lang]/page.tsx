import { SiteNav } from '@/components/site-nav'
import { SkipLink } from '@/components/skip-link'
import { TopScrim } from '@/components/top-scrim'
import { LukasVoiceWidget } from '@/components/lukas-voice-widget'
import { ConsentBanner } from '@/components/consent-banner'
import { Analytics } from '@/components/analytics'
import { PerfProbe } from '@/components/perf-probe'
import { AmbientBackground } from '@/components/ambient-background'
import { AboutIntro } from '@/components/about-intro'
import { LukasOverview } from '@/components/lukas-overview'
import { BrainDataProvider } from '@/components/lukas-memory/provider'
import styles from '@/components/portfolio.module.css'
import { Lukas } from '@/components/lukas'
import { Projects } from '@/components/projects'
import { About } from '@/components/about'
import { Resume } from '@/components/resume'
import { TechStack } from '@/components/tech-stack'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'
import { EntityBridge } from '@/components/entity-bridge'

export default function Page() {
  return (
    <>
      <AmbientBackground />
      <SkipLink />
      {/* Measures what this device can actually paint and, if it cannot keep
          up, takes the expensive layers off (lib/perf-tier.ts). */}
      <PerfProbe />
      <SiteNav />
      <LukasVoiceWidget />
      <ConsentBanner />
      <Analytics />
      <main id="main-content" tabIndex={-1} className={`${styles.site} relative outline-none`}>
        <noscript><style>{`
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
        `}</style></noscript>
        <TopScrim />
        <AboutIntro hero />
        <Projects />
        <BrainDataProvider><LukasOverview /><Lukas /></BrainDataProvider>
        <About />
        <TechStack />
        <Resume />
        <Contact />
        <EntityBridge />
        <SiteFooter portfolio />
      </main>
    </>
  )
}
