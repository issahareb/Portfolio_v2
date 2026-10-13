import { EDITORIAL } from './portfolio-editorial'
import type { Lang } from './i18n'
import type { Dictionary, ProjectCopy } from './translations'

/** CV placeholders are deliberately separate from verified profile facts. */
export const PORTFOLIO_COPY = {
  de: {
    hero: { kickerWords: ['Lebenslauf', 'Portfolio'], headingLine1: 'Issa Hareb.', headingLine2: 'Full-Stack- & KI-Entwickler', headingPlain: 'Issa Hareb. Full-Stack- & KI-Entwickler', lead: 'Autodidaktischer Entwickler aus Essen. Ich verbinde Webentwicklung, Gestaltung und KI in eigenen Produkten und Kundensystemen.', body: 'Meine Arbeiten zeigen, wie ich Ideen in funktionierende Produkte umsetze. Mein Werdegang ergänzt das Bild.', proofLabel: 'Projekte', ctaDraft: 'Portfolio ansehen', ctaPrimary: 'Meine Arbeiten ansehen' },
    profile: { kicker: 'Profil', heading: 'Über mich.', intro: 'Ich bin Issa Hareb, autodidaktischer Full-Stack- und KI-Entwickler aus Essen. Mein Schwerpunkt sind Webanwendungen, Agenten und Automatisierungen.' },
    work: { previewLabel: 'Projektvorschau', archiveTitle: 'Frühere Webseitenvorschauen', archiveBody: 'Diese drei Videos waren Teil eines früheren Hareb-Digital-Auftritts. Sie zeigen Designvorschauen aus dem Archiv.' },
    nav: { about: 'Profil', work: 'Projekte', stack: 'Kenntnisse' },
    projects: { kicker: 'Portfolio', heading: 'Ausgewählte Projekte.', subtitle: 'Was ich gebaut habe, welche Technik dahintersteckt und wo die Projekte heute stehen.' },
    contact: { heading: 'Kontakt aufnehmen.', subtitle: 'Für berufliche Möglichkeiten, fachlichen Austausch und gemeinsame Projekte erreichst du mich direkt.', cta: 'E-Mail schreiben', ctaSubject: 'Kontakt über das Portfolio' },
    footerTagline: 'Full-Stack- & KI-Entwickler',
    resume: {
      kicker: 'Werdegang', heading: 'Beruf & Ausbildung.', intro: 'Berufliche Stationen und Ausbildung ergänzen meine Projektarbeit.', notice: 'Zeiträume und Arbeitgeber werden nachgereicht. Markierte Angaben sind Platzhalter.', placeholder: 'Platzhalter', experience: 'Berufserfahrung', education: 'Ausbildung', development: 'Softwareentwicklung', datePlaceholder: '[MM/JJJJ – MM/JJJJ]', rolePlaceholder: '[Position / Tätigkeit]', employerPlaceholder: '[Arbeitgeber · Ort]', experienceBody: '[Aufgaben, Verantwortungsbereiche und Ergebnisse werden ergänzt.]', educationTitle: 'Fachabitur · Wirtschaft und Verwaltung', schoolPlaceholder: '[Schule · Ort · Abschlussjahr]', educationBody: 'Abschluss vorhanden. Schule und Zeitraum werden mit dem Lebenslauf ergänzt.', developmentTitle: 'Autodidaktische Entwicklung', developmentContext: 'Eigene Produkte & Kundensysteme', developmentDate: 'Fortlaufend', developmentBody: 'Webanwendungen, KI-Agenten und Automatisierungen. Lernen durch Umsetzung, Tests und den Betrieb echter Projekte.', location: 'Standort', learning: 'Hintergrund', learningValue: 'Autodidakt', focus: 'Schwerpunkt', focusValue: 'Webentwicklung & KI', projectRole: 'Mein Beitrag', projectRoleValue: 'Konzeption & Entwicklung', galleryLabel: 'Interaktive Projektgalerie', more: 'Weitere Projekte', github: 'GitHub-Profil',
    },
  },
  en: {
    hero: { kickerWords: ['Resume', 'Portfolio'], headingLine1: 'Issa Hareb.', headingLine2: 'Full-Stack & AI Developer', headingPlain: 'Issa Hareb. Full-Stack & AI Developer', lead: 'Self-taught developer based in Essen, Germany. I combine web development, design and AI in my own products and client systems.', body: 'My work shows how I turn ideas into working products. My background adds context.', proofLabel: 'Projects', ctaDraft: 'View portfolio', ctaPrimary: 'Explore my work' },
    profile: { kicker: 'Profile', heading: 'About me.', intro: 'I am Issa Hareb, a self-taught full-stack and AI developer based in Essen. I focus on web applications, agents and automations.' },
    work: { previewLabel: 'Project preview', archiveTitle: 'Earlier website previews', archiveBody: 'These three videos were part of an earlier Hareb Digital website. They show archived design previews.' },
    nav: { about: 'Profile', work: 'Projects', stack: 'Skills' },
    projects: { kicker: 'Portfolio', heading: 'Selected projects.', subtitle: 'What I built, the technology behind it and the current status of each project.' },
    contact: { heading: 'Get in touch.', subtitle: 'Contact me directly about professional opportunities, technical conversations and projects together.', cta: 'Write an email', ctaSubject: 'Portfolio contact' },
    footerTagline: 'Full-Stack & AI Developer',
    resume: {
      kicker: 'Background', heading: 'Experience & education.', intro: 'Professional experience and education add context to my project work.', notice: 'Dates and employers will be added from my CV. Marked fields are placeholders.', placeholder: 'Placeholder', experience: 'Professional experience', education: 'Education', development: 'Software development', datePlaceholder: '[MM/YYYY – MM/YYYY]', rolePlaceholder: '[Role / position]', employerPlaceholder: '[Employer · location]', experienceBody: '[Responsibilities, tasks and outcomes to be added.]', educationTitle: 'Fachabitur · Business & Administration', schoolPlaceholder: '[School · location · graduation year]', educationBody: 'Qualification completed. School and dates will be added from the CV.', developmentTitle: 'Self-taught development', developmentContext: 'Own products & client systems', developmentDate: 'Ongoing', developmentBody: 'Web applications, AI agents and automations. Learning through implementation, testing and running real projects.', location: 'Location', learning: 'Background', learningValue: 'Self-taught', focus: 'Focus', focusValue: 'Web development & AI', projectRole: 'My contribution', projectRoleValue: 'Concept & development', galleryLabel: 'Interactive project gallery', more: 'Further projects', github: 'GitHub profile',
    },
  },
  es: {
    hero: { kickerWords: ['Currículum', 'Portfolio'], headingLine1: 'Issa Hareb.', headingLine2: 'Desarrollador Full-Stack e IA', headingPlain: 'Issa Hareb. Desarrollador Full-Stack e IA', lead: 'Desarrollador autodidacta de Essen, Alemania. Combino desarrollo web, diseño e IA en productos propios y sistemas para clientes.', body: 'Mis proyectos muestran cómo convierto ideas en productos funcionales. Mi trayectoria aporta contexto.', proofLabel: 'Proyectos', ctaDraft: 'Ver portfolio', ctaPrimary: 'Ver mis proyectos' },
    profile: { kicker: 'Perfil', heading: 'Sobre mí.', intro: 'Soy Issa Hareb, desarrollador autodidacta Full-Stack e IA de Essen. Me centro en aplicaciones web, agentes y automatizaciones.' },
    work: { previewLabel: 'Vista previa del proyecto', archiveTitle: 'Vistas previas de webs anteriores', archiveBody: 'Estos tres vídeos formaban parte de una versión anterior de Hareb Digital. Muestran diseños del archivo.' },
    nav: { about: 'Perfil', work: 'Proyectos', stack: 'Conocimientos' },
    projects: { kicker: 'Portfolio', heading: 'Proyectos seleccionados.', subtitle: 'Qué he desarrollado, qué tecnología utiliza y cuál es su estado actual.' },
    contact: { heading: 'Ponte en contacto.', subtitle: 'Puedes escribirme directamente sobre oportunidades profesionales, intercambio técnico y proyectos conjuntos.', cta: 'Escribir un correo', ctaSubject: 'Contacto desde el portfolio' },
    footerTagline: 'Desarrollador Full-Stack e IA',
    resume: {
      kicker: 'Trayectoria', heading: 'Experiencia y formación.', intro: 'La experiencia profesional y la formación complementan mis proyectos.', notice: 'Las fechas y empresas se añadirán con mi currículum. Los campos marcados son provisionales.', placeholder: 'Provisional', experience: 'Experiencia profesional', education: 'Formación', development: 'Desarrollo de software', datePlaceholder: '[MM/AAAA – MM/AAAA]', rolePlaceholder: '[Puesto / actividad]', employerPlaceholder: '[Empresa · ubicación]', experienceBody: '[Se añadirán tareas, responsabilidades y resultados.]', educationTitle: 'Fachabitur · Economía y Administración', schoolPlaceholder: '[Centro · ubicación · año de titulación]', educationBody: 'Titulación completada. El centro y las fechas se añadirán con el currículum.', developmentTitle: 'Desarrollo autodidacta', developmentContext: 'Productos propios y sistemas para clientes', developmentDate: 'Continuo', developmentBody: 'Aplicaciones web, agentes de IA y automatizaciones. Aprendizaje mediante implementación, pruebas y operación de proyectos reales.', location: 'Ubicación', learning: 'Formación', learningValue: 'Autodidacta', focus: 'Especialidad', focusValue: 'Desarrollo web e IA', projectRole: 'Mi contribución', projectRoleValue: 'Concepto y desarrollo', galleryLabel: 'Galería interactiva de proyectos', more: 'Más proyectos', github: 'Perfil de GitHub',
    },
  },
} satisfies Record<Lang, {
  hero: Partial<Dictionary['hero']>
  profile: Pick<Dictionary['about'], 'kicker' | 'heading' | 'intro'>
  work: { previewLabel: string; archiveTitle: string; archiveBody: string }
  nav: Partial<Dictionary['nav']>
  projects: Partial<Dictionary['projects']>
  contact: Partial<Dictionary['contact']>
  footerTagline: string
  resume: Record<string, string>
}>

/** Project copy is based on the existing Hareb Digital repository and screenshot. */
const PORTFOLIO_PROJECTS = {
  de: {
    'Hareb Digital': {
      category: 'Eigenes Digitalstudio',
      tagline: 'Webdesign, Entwicklung & Automatisierung',
      description: 'Der Webauftritt meines Digitalstudios: Konzeption, Gestaltung und Umsetzung mit Next.js. Drei Sprachfassungen, scrollgesteuerte Kamerafahrt, Leistungsseiten und ein Anfrageformular, das eine E-Mail vorbereitet. Technische SEO und strukturierte Daten gehören zum Aufbau. Die Vorschau stammt aus dem Repository von Hareb Digital.',
      status: 'Eigener Webauftritt',
    },
  },
  en: {
    'Hareb Digital': {
      category: 'Independent digital studio',
      tagline: 'Web design, development & automation',
      description: 'The website of my digital studio: concept, design and implementation with Next.js. Three languages, a scroll-controlled camera flight, service pages and an enquiry form that prepares an email. Technical SEO and structured data are part of the implementation. The preview comes from the Hareb Digital repository.',
      status: 'Own studio website',
    },
  },
  es: {
    'Hareb Digital': {
      category: 'Estudio digital propio',
      tagline: 'Diseño web, desarrollo y automatización',
      description: 'La web de mi estudio digital: concepto, diseño e implementación con Next.js. Tres idiomas, recorrido de cámara controlado por el scroll, páginas de servicios y un formulario que prepara un correo. SEO técnico y datos estructurados forman parte de la implementación. La vista previa procede del repositorio de Hareb Digital.',
      status: 'Web del estudio propio',
    },
  },
} satisfies Record<Lang, Record<string, ProjectCopy>>

export function withPortfolioCopy(base: Dictionary, lang: Lang): Dictionary {
  const copy = PORTFOLIO_COPY[lang]
  const editorial = EDITORIAL[lang]
  return {
    ...base,
    hero: { ...base.hero, ...copy.hero, lead: editorial.heroLead, body: editorial.heroBody },
    nav: { ...base.nav, ...copy.nav },
    about: { ...base.about, ...copy.profile, heading: editorial.aboutTitle, intro: editorial.aboutIntro, pillars: editorial.pillars },
    techStack: { ...base.techStack, heading: editorial.skillsTitle, subtitle: editorial.skillsIntro },
    projects: {
      ...base.projects,
      ...copy.projects,
      heading: editorial.workTitle,
      subtitle: editorial.workIntro,
      projects: {
        ...base.projects.projects,
        ...PORTFOLIO_PROJECTS[lang],
        GuardianGrid: {
          ...base.projects.projects.GuardianGrid,
          description: base.projects.projects.GuardianGrid.description.replace(/:\s*guardiangrid\.io/g, ''),
          status: copy.work.previewLabel,
        },
      },
    },
    contact: { ...base.contact, ...copy.contact, heading: editorial.contactTitle, subtitle: editorial.contactIntro },
    footer: { ...base.footer, tagline: copy.footerTagline },
  }
}
