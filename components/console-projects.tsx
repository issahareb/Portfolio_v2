'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage, useT } from './language-context'
import { PortfolioVideo } from './portfolio-video'
import { langPath } from '@/lib/i18n'
import styles from './console-projects.module.css'

type Category = 'all' | 'web' | 'apps' | 'motion' | 'social'
const COPY = {
  de: {
    intro:
      'Websites, eigene Anwendungen, bewegte Bilder und Social Media. Meine Arbeiten an einem Ort.',
    all: 'Alle',
    web: 'Websites',
    apps: 'Apps & KI',
    motion: 'Motion Design',
    social: 'Social Media',
    view: 'Projekt ansehen',
    preview: 'Projektvorschau',
    code: 'Quelltext',
    film: 'Portfolio-Introfilm',
    robot: 'Roboter-Animation',
    archive: 'Webdesign in Bewegung',
    personal: 'Eigene Anwendung',
    socialNote: 'Archivierte Profilaufnahmen meiner Social-Media-Arbeiten.',
    motionNote:
      'Animationen und Filme aus meinem Portfolio und Webdesign-Archiv.',
    github: 'Weitere Arbeiten auf GitHub',
  },
  en: {
    intro:
      'Websites, independent apps, moving images and social media. My work in one place.',
    all: 'All',
    web: 'Websites',
    apps: 'Apps & AI',
    motion: 'Motion design',
    social: 'Social media',
    view: 'View project',
    preview: 'Project preview',
    code: 'Source code',
    film: 'Portfolio intro film',
    robot: 'Robot animation',
    archive: 'Web design in motion',
    personal: 'Independent app',
    socialNote: 'Archived profile captures from my social media work.',
    motionNote:
      'Animations and films from my portfolio and web design archive.',
    github: 'More work on GitHub',
  },
  es: {
    intro:
      'Webs, aplicaciones propias, imágenes en movimiento y redes sociales. Mi trabajo en un solo lugar.',
    all: 'Todos',
    web: 'Webs',
    apps: 'Apps e IA',
    motion: 'Motion design',
    social: 'Redes sociales',
    view: 'Ver proyecto',
    preview: 'Vista del proyecto',
    code: 'Código fuente',
    film: 'Película de presentación',
    robot: 'Animación del robot',
    archive: 'Diseño web en movimiento',
    personal: 'Aplicación propia',
    socialNote: 'Capturas de archivo de mis trabajos en redes sociales.',
    motionNote: 'Animaciones y películas de mi portfolio y archivo web.',
    github: 'Más trabajos en GitHub',
  },
}
// Existing repository media only. Previews remain labelled as previews;
// no unverified launch URLs or customer results are added.
const APPS = [
  {
    name: 'GuardianGrid',
    image: '/projects/guardiangrid-login.jpg',
    video: '/videos/guardiangrid.mp4',
    anchor: '#work',
  },
  {
    name: 'L.U.K.A.S.',
    image: '/videos/lukas-interface.jpg',
    video: '/videos/lukas-interface.mp4',
    anchor: '#lukas',
    code: 'Lukas_autonom',
  },
  { name: 'StudyForge', image: '/projects/studyforge.png', anchor: '#work' },
  {
    name: 'Team Operations Suite',
    image: '/projects/teamops.png',
    anchor: '#work',
  },
  {
    name: 'Automation Systems',
    image: '/projects/automation.png',
    anchor: '#work',
  },
  {
    name: 'Bewerbungsbot',
    image: '/projects/bewerbungsbot.png',
    anchor: '#work',
    code: 'Bewerbungsbot',
  },
]
export function ConsoleProjects() {
  const { lang } = useLanguage()
  const translations = useT()
  const t = COPY[lang]
  const [category, setCategory] = useState<Category>('all')
  const show = (value: Category) => category === 'all' || category === value
  const portfolio = langPath(lang, '/portfolio')
  return (
    <div className={styles.archive}>
      <p className={styles.intro}>{t.intro}</p>
      <div className={styles.filters} role="group" aria-label={t.all}>
        {(['all', 'web', 'apps', 'motion', 'social'] as const).map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {t[value]}
          </button>
        ))}
      </div>
      <div className={styles.grid} aria-live="polite">
        {show('web') &&
          [
            {
              name: 'Hareb Digital',
              image: '/videos/hareb-digital-final.jpg',
              video: '/videos/hareb-digital-final.mp4',
              url: 'https://hareb.digital/',
            },
            {
              name: 'TaxiBB Essen',
              image: '/projects/taxibb.png',
              video: '/videos/taxibb.mp4',
              url: 'https://taxibbessen.de/',
            },
          ].map((project) => (
            <article className={styles.project} key={project.name}>
              <div className={styles.media}>
                <PortfolioVideo
                  src={project.video}
                  poster={project.image}
                  label={project.name}
                />
              </div>
              <div className={styles.caption}>
                <span>{t.web}</span>
                <h3>{project.name}</h3>
                <a href={project.url} target="_blank" rel="noreferrer">
                  {t.view}
                  <ArrowUpRight size={16} aria-hidden />
                </a>
              </div>
            </article>
          ))}
        {show('apps') &&
          APPS.map((project) => (
            <article className={styles.project} key={project.name}>
              <div className={styles.media}>
                {'video' in project && project.video ? (
                  <PortfolioVideo
                    src={project.video}
                    poster={project.image}
                    label={project.name}
                  />
                ) : (
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={960}
                    height={640}
                    sizes="(min-width: 800px) 45vw, 90vw"
                    loading="lazy"
                  />
                )}
              </div>
              <div className={styles.caption}>
                <span>
                  {t.apps} · {t.preview}
                </span>
                <h3>{project.name}</h3>
                {'code' in project && project.code ? (
                  <a
                    href={`https://github.com/issahareb/${project.code}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.code}
                    <ArrowUpRight size={16} aria-hidden />
                  </a>
                ) : project.name === 'GuardianGrid' ? (
                  <Link href={`${portfolio}${project.anchor}`}>
                    {t.view}
                    <ArrowUpRight size={16} aria-hidden />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        {show('motion') &&
          [
            {
              name: t.film,
              image: '/intro/cinematic-poster.jpg',
              video: '/videos/intro-mobile.mp4',
            },
            {
              name: t.robot,
              image: '/intro/hero-robot-poster.jpg',
              video: '/videos/hero-robot-mobile.mp4',
            },
            ...[1, 2, 3].map((i) => ({
              name: `${t.archive} ${i}`,
              image: `/videos/schau-${i}.jpg`,
              video: `/videos/schau-${i}.mp4`,
            })),
          ].map((project) => (
            <article className={styles.project} key={project.video}>
              <div className={styles.media}>
                <PortfolioVideo
                  src={project.video}
                  poster={project.image}
                  label={project.name}
                />
              </div>
              <div className={styles.caption}>
                <span>{t.motion}</span>
                <h3>{project.name}</h3>
                <p>{t.motionNote}</p>
              </div>
            </article>
          ))}
        {show('social') &&
          translations.social.konten.map((account) => (
            <article className={styles.project} key={account.handle}>
              <div className={`${styles.media} ${styles.socialMedia}`}>
                <Image
                  src={`/social/${account.bild}.webp`}
                  alt={account.bildAlt}
                  width={1125}
                  height={689}
                  sizes="(min-width: 800px) 45vw, 90vw"
                  loading="lazy"
                />
              </div>
              <div className={styles.caption}>
                <span>
                  {t.social} · {account.handle}
                </span>
                <h3>{account.name}</h3>
                <p>{t.socialNote}</p>
              </div>
            </article>
          ))}
      </div>
      <a
        className={styles.more}
        href="https://github.com/issahareb"
        target="_blank"
        rel="noreferrer"
      >
        {t.github}
        <ArrowUpRight size={18} aria-hidden />
      </a>
    </div>
  )
}
