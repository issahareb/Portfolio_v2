'use client'




import { Fragment, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { PORTFOLIO_COPY } from '@/lib/portfolio-copy'
import { Reveal } from './anim'
import { useLanguage, useT } from './language-context'
import { useNearViewport } from './use-near-viewport'
import type { GalleryCard } from './stellar-gallery'
import { EDITORIAL } from '@/lib/portfolio-editorial'
import styles from './portfolio.module.css'
import { WebsitePreviewCarousel } from './website-preview-carousel'

const StellarGallery = dynamic(() => import('./stellar-gallery').then(m => m.StellarGallery), { ssr: false })

/** Self-directed design explorations, in the same order as
 *  `t.projects.directions` — the copy that names and describes each one
 *  lives there so it switches with the language. */
const DESIGN_DIRECTIONS = [
  { image: '/design-directions/vantiq.webp' },
  { image: '/design-directions/novasynth.webp' },
  { image: '/design-directions/kelvin-roe.webp' },
  { image: '/design-directions/heliodyne.webp' },
]

const easeOut = [0.22, 1, 0.36, 1] as const

/** Measured third-party audit of a deployed project, rendered as a spec
 *  readout rather than a badge: the numbers are the point, and a badge would
 *  read as a sticker the site awarded itself. The headline score is the one
 *  large figure; the three sub-scores sit under it at label scale. Source and
 *  crawl date are shown, not hidden — an unattributed number is a claim. */
function ProjectAudit({ audit }: { audit: NonNullable<Project['audit']> }) {
  const t = useT()
  const { lang } = useLanguage()
  const subScores = [
    { label: t.projects.auditTech, value: audit.tech },
    { label: t.projects.auditStructure, value: audit.structure },
    { label: t.projects.auditContent, value: audit.content },
  ]
  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-semibold tabular-nums tracking-tight text-blue">
          {audit.onpage}%
        </span>
        <span className="font-label text-[12px] uppercase tracking-[0.18em] text-foreground/72">
          {t.projects.auditOnpage}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-1">
        {subScores.map((s) => (
          <div key={s.label}>
            <dd className="text-lg font-semibold tabular-nums tracking-tight">
              {s.value}%
            </dd>
            <dt className="font-label text-[13px] uppercase tracking-[0.14em] text-foreground/72">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-label text-[12px] uppercase tracking-[0.16em] text-foreground/62">
        {t.projects.auditSource}{' '}
        <a
          href={audit.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-foreground hover:decoration-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          {audit.sourceName}
        </a>{' '}
        ·{' '}
        <time dateTime={audit.crawledOn}>
          {new Date(audit.crawledOn).toLocaleDateString(lang ?? 'en', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </time>
      </p>
    </div>
  )
}

function LoadingFallback() {
  const t = useT()
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className="font-label text-[13px] uppercase tracking-[0.22em] text-foreground/72">
        {t.projects.loadingConstellation}
      </span>
    </div>
  )
}

type Project = {
  name: string
  /** Short 2-3 word category shown on the compact constellation label. */
  category: string
  tagline: string
  description: string
  /** Omitted for hobby projects — no screenshot, just the write-up. */
  image?: string
  /** Generated mockup used ONLY as the orb's fisheye texture — never shown
   *  in the detail panel/modal, since it's a staged illustration rather
   *  than a real screenshot of the actual product. */
  orbImage?: string
  /** Optional looping screen capture shown instead of the still image. */
  video?: string
  /** Playback speed multiplier for `video` — defaults to 1 (normal speed). */
  videoPlaybackRate?: number
  stack: string[]
  status: string
  featured?: boolean
  /** Personal/side projects — rendered without media, with a plain badge. */
  hobby?: boolean
  liveUrl?: string
  githubUrl?: string
  /** Third-party audit of the *deployed* site. Only ever set from a real
   *  report — the point of showing figures at all is that they are measured
   *  rather than claimed (DESIGN.md §1), so the source and crawl date are
   *  part of the data, not decoration. */
  audit?: {
    onpage: number
    tech: number
    structure: number
    content: number
    /** ISO date of the crawl the figures come from. */
    crawledOn: string
    sourceName: string
    sourceUrl: string
  }
}

/** Structural fields only — name, media, stack, links. The translatable
 *  copy (category/tagline/description/status) lives in
 *  `useT().projects.projects`, keyed by `name`, and is merged in at render
 *  time inside `Projects()` so it switches with the active language. */
type ProjectMeta = Pick<
  Project,
  | 'name'
  | 'image'
  | 'orbImage'
  | 'video'
  | 'videoPlaybackRate'
  | 'stack'
  | 'featured'
  | 'hobby'
  | 'liveUrl'
  | 'githubUrl'
  | 'audit'
>

const PROJECT_META: ProjectMeta[] = [
  {
    name: 'GuardianGrid',
    image: '/projects/guardiangrid-login.jpg',
    video: '/videos/guardiangrid.mp4',
    stack: ['React', 'Bungie API', 'OAuth2', 'Node.js', 'Cloudflare'],
    featured: true,
  },
  {
    name: 'Hareb Digital',
    image: '/videos/hareb-digital-final.jpg',
    video: '/videos/hareb-digital-final.mp4',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'SEO / AEO'],
    featured: true,
    liveUrl: 'https://hareb.digital/',
  },
  {
    name: 'TaxiBB Essen',
    image: '/projects/taxibb.png',
    orbImage: '/projects/orb-textures/taxibb.webp',
    video: '/videos/taxibb.mp4',
    videoPlaybackRate: 1.6,
    stack: ['React', 'PostgreSQL', 'Drizzle ORM', 'Resend', 'JSON-LD'],
    liveUrl: 'https://taxibbessen.de',
    githubUrl: 'https://github.com/issahareb/Taxibbessen',
    audit: {
      onpage: 92,
      tech: 99,
      structure: 97,
      content: 80,
      crawledOn: '2026-07-28',
      sourceName: 'seobility.net',
      sourceUrl: 'https://www.seobility.net',
    },
  },
  {
    name: 'StudyForge',
    orbImage: '/projects/orb-textures/studyforge.webp',
    stack: ['React', 'Tailwind CSS', 'TypeScript', 'AI Pipelines'],
    hobby: true,
  },
  {
    name: 'Team Operations Suite',
    orbImage: '/projects/orb-textures/teamops.webp',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Zod'],
    hobby: true,
  },
  {
    name: 'Automation Systems',
    orbImage: '/projects/orb-textures/automation.webp',
    stack: ['Python', 'Node.js', 'Telegram API', 'Webhooks', 'VPS'],
  },
  {
    name: 'Bewerbungsbot',
    orbImage: '/projects/orb-textures/bewerbungsbot.webp',
    stack: ['React', 'Express', 'PostgreSQL', 'Drizzle ORM', 'OpenAI', 'Zod'],
    hobby: true,
    githubUrl: 'https://github.com/issahareb/Bewerbungsbot',
  },
]

/** The written substance of a project — description, stack and status.
 *  Rendered inside the gallery's detail card under the screenshot, so
 *  nothing that the old docked panel carried is lost in the move. */
function ProjectExtras({ project }: { project: Project }) {
  const t = useT()
  return (
    <>
      <p className="mt-3 max-w-[52ch] text-pretty text-[17px] leading-[1.6] text-foreground/80">
        {project.description}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-white/10 px-3 py-1 font-label text-[12px] uppercase tracking-[0.13em] text-foreground/72"
          >
            {tech}
          </li>
        ))}
      </ul>
      <p className="mt-3 font-label text-[12px] uppercase tracking-[0.2em] text-purple/80">
        {project.hobby ? t.projects.hobbyProject : project.status}
      </p>
      {project.audit && <ProjectAudit audit={project.audit} />}
    </>
  )
}

export function Projects() {
  const t = useT()
  const { lang } = useLanguage()
  const copy = PORTFOLIO_COPY[lang].resume
  const editorial = EDITORIAL[lang]
  const summaries: Record<string, string> = editorial.summaries
  const [galleryOpen, setGalleryOpen] = useState(false)
  const PROJECTS: Project[] = PROJECT_META.map((m) => ({
    ...m,
    ...(t.projects.projects[m.name] ?? {
      category: '',
      tagline: '',
      description: '',
      status: '',
    }),
  }))
  // The 3D gallery is the heaviest thing on the page after Lukas — don't
  // create its WebGL context until the section is actually close to
  // scrolling into view, rather than the moment the page hydrates.
  const { ref: galleryRef, near: galleryNear } = useNearViewport<HTMLDivElement>()

  // Built work and design directions share one sphere, but never share an
  // identity: every card carries its own kind label, so a client site and an
  // exploration stay tellable apart inside the gallery itself and not only
  // under the heading above it.
  const cards: GalleryCard[] = [
    ...PROJECTS.map((p) => ({
      id: p.name,
      imageUrl: p.orbImage ?? p.image ?? '/design-directions/vantiq.webp',
      alt: p.name,
      title: p.name,
      kindLabel: p.category || t.projects.kindProject,
      meta: p.tagline,
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      detail: <ProjectExtras project={p} />,
    })),
    ...DESIGN_DIRECTIONS.map((d, i) => ({
      id: d.image,
      imageUrl: d.image,
      alt: t.projects.directions[i]?.title ?? '',
      title: t.projects.directions[i]?.title ?? '',
      kindLabel: t.projects.kindDirection,
      meta: t.projects.directions[i]?.meta,
    })),
  ]

  const featured = ['TaxiBB Essen', 'Hareb Digital', 'GuardianGrid'].map(name => PROJECTS.find(p => p.name === name)!)
  const others = PROJECTS.filter(p => !featured.includes(p))
  const links = (project: Project) => <div className={styles.projectLinks}>
    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{t.projects.liveProject}</a>}
    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">{t.projects.github}</a>}
  </div>
  return (
    <section id="work" className={styles.work} aria-labelledby="work-heading">
      <Reveal className={styles.sectionIntro}>
        <p className={styles.eyebrow}>{t.projects.kicker}</p>
        <h2 id="work-heading">{t.projects.heading}</h2><p>{t.projects.subtitle}</p>
      </Reveal>
      <div className={styles.featuredWork}>
        {featured.map(project => <Fragment key={project.name}><Reveal y={24}>
          <article className={styles.projectFeature}>
            <div className={styles.projectPreview}>
              {project.video ? <video controls playsInline preload="none" poster={project.image} aria-label={`${project.name} — ${project.tagline}`}><source src={project.video} type="video/mp4" /></video> :
                <Image src={project.image!} alt={`${project.name} — ${project.tagline}`} width={1200} height={800} sizes="(min-width: 1024px) 680px, 100vw" />}
            </div>
            <div className={styles.projectContent}>
              <p className={styles.projectCategory}>{project.category}</p>
              <h3>{project.name}</h3>
              <p className={styles.projectSummary}>{summaries[project.name]}</p>
              <p className={styles.projectStatus}>{project.status}</p>
              {links(project)}
              <details className={styles.projectDetails}>
                <summary>{editorial.details}<span aria-hidden>+</span></summary>
                <ProjectExtras project={project} />
                {project.name === 'Hareb Digital' && <Image src="/projects/hareb-digital.png" alt="Hareb Digital — Desktop" width={1440} height={960} sizes="(min-width: 1024px) 440px, 100vw" className="mt-6 rounded-xl" />}
              </details>
            </div>
          </article>
          </Reveal>
          {project.name === 'Hareb Digital' && <WebsitePreviewCarousel />}
        </Fragment>)}
      </div>
      <div className={styles.moreWork}>
        {others.map(project => <Reveal key={project.name} y={18}>
          <article className={styles.projectNote}>
            <p className={styles.projectCategory}>{project.category}</p><h3>{project.name}</h3>
            <p>{summaries[project.name]}</p><span className={styles.projectStatus}>{project.status}</span>
            {links(project)}
            <details className={styles.projectDetails}><summary>{editorial.details}<span aria-hidden>+</span></summary><ProjectExtras project={project} /></details>
          </article>
        </Reveal>)}
      </div>
      <details className={styles.galleryDetails} onToggle={event => setGalleryOpen(event.currentTarget.open)}>
        <summary>{editorial.gallery}<span aria-hidden>↗</span></summary>
        <div ref={galleryRef} className={styles.galleryStage}>
          {galleryOpen && galleryNear ? <StellarGallery cards={cards} /> : <LoadingFallback />}
        </div>
      </details>
      <details className={styles.registerDetails}>
        <summary>{t.projects.registerLabel}<span aria-hidden>+</span></summary>
        <ul>{t.projects.register.map(project => <li key={project.name}><strong>{project.name}</strong><span>{project.category}</span><span>{project.status}</span></li>)}</ul>
      </details>
    </section>
  )
}
