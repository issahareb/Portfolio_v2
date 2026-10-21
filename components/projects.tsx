'use client'




import { Fragment } from 'react'
import { ArrowUpRight, CodeXml, Plus } from 'lucide-react'
import Image from 'next/image'
import { Reveal } from './anim'
import { useLanguage, useT } from './language-context'
import { EDITORIAL } from '@/lib/portfolio-editorial'
import styles from './portfolio.module.css'
import { WebsitePreviewCarousel } from './website-preview-carousel'
import { PortfolioVideo } from './portfolio-video'
import { CreativeSkills } from './creative-skills'

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
        · {lang === 'de' ? 'Onpage: Stand 14.10.2026. Teilwerte:' : lang === 'es' ? 'On-page: actualizado el 14/10/2026. Otros valores:' : 'On-page: updated 14 October 2026. Other scores:'}{' '}
        <time dateTime={audit.crawledOn}>
          {new Date(audit.crawledOn).toLocaleDateString(lang ?? 'en', {
            timeZone: 'UTC',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </time>
      </p>
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
      onpage: 99,
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
  const editorial = EDITORIAL[lang]
  const summaries: Record<string, string> = editorial.summaries
  const PROJECTS: Project[] = PROJECT_META.map((m) => ({
    ...m,
    ...(t.projects.projects[m.name] ?? {
      category: '',
      tagline: '',
      description: '',
      status: '',
    }),
  }))
  const featured = ['TaxiBB Essen', 'Hareb Digital', 'GuardianGrid'].map(name => PROJECTS.find(p => p.name === name)!)
  const actionCopy = {
    de: { studio: 'Studio besuchen', website: 'Website ansehen', code: 'Code ansehen' },
    en: { studio: 'Visit the studio', website: 'View website', code: 'View code' },
    es: { studio: 'Visitar el estudio', website: 'Ver la web', code: 'Ver código' },
  }[lang]
  const links = (project: Project) => <div className={styles.projectLinks}>
    {project.liveUrl && <a data-track-id="projects-a-1" className={styles.projectAction} href={project.liveUrl} target="_blank" rel="noreferrer"><span>{project.name === 'Hareb Digital' ? actionCopy.studio : actionCopy.website}</span><ArrowUpRight size={20} aria-hidden /></a>}
    {project.githubUrl && <a data-track-id="projects-a-2" className={styles.codeAction} href={project.githubUrl} target="_blank" rel="noreferrer"><CodeXml size={16} aria-hidden />{actionCopy.code}</a>}
  </div>
  return (
    <section data-track-section="projects-section-3" id="work" className={styles.work} aria-labelledby="work-heading">
      <Reveal className={styles.sectionIntro}>
        <p className={styles.eyebrow}>{t.projects.kicker}</p>
        <h2 id="work-heading">{t.projects.heading}</h2><p>{t.projects.subtitle}</p>
      </Reveal>
      <div className={styles.featuredWork}>
        {featured.map(project => <Fragment key={project.name}><Reveal y={24}>
          <article className={styles.projectFeature} data-project={project.name}>
            <div className={styles.projectHeading}>
              <div><p className={styles.projectCategory}>{project.category}</p><h3>{project.name}</h3></div>
              <p className={styles.projectStatus}>{project.status}</p>
            </div>
            <div className={styles.projectPreview}>
              <div className={styles.mediaSurface}>
                {project.video ? <PortfolioVideo src={project.video} poster={project.image} label={`${project.name} — ${project.tagline}`} playbackRate={project.videoPlaybackRate} /> :
                  <Image src={project.image!} alt={`${project.name} — ${project.tagline}`} width={1200} height={800} sizes="(min-width: 1024px) 1100px, 100vw" />}
              </div>
            </div>
            <div className={styles.projectContent}>
              <div><p className={styles.projectSummary}>{summaries[project.name]}</p>{links(project)}</div>
              <details className={styles.projectDetails}>
                <summary>{editorial.details}<Plus size={18} aria-hidden /></summary>
                <ProjectExtras project={project} />
                {project.name === 'Hareb Digital' && <Image src="/projects/hareb-digital.png" alt="Hareb Digital — Desktop" width={1440} height={960} sizes="(min-width: 1024px) 440px, 100vw" className="mt-6 rounded-xl" />}
              </details>
            </div>
          </article>
          </Reveal>
          {project.name === 'Hareb Digital' && <WebsitePreviewCarousel />}
        </Fragment>)}
      </div>
      <CreativeSkills />
    </section>
  )
}
