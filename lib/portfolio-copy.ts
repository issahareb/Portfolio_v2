import type { Lang } from './i18n'
import type { Dictionary } from './translations'

/** CV placeholders are deliberately separate from verified profile facts. */
export const PORTFOLIO_COPY = {
  de: {
    hero: { kickerWords: ['Lebenslauf', 'Portfolio'], headingLine1: 'Issa Hareb.', headingLine2: 'Full-Stack- & KI-Entwickler', headingPlain: 'Issa Hareb. Full-Stack- & KI-Entwickler', lead: 'Autodidaktischer Entwickler aus Essen. Ich verbinde Webentwicklung, Gestaltung und KI in eigenen Produkten und Kundensystemen.', body: 'Hier findest du meinen Hintergrund, ausgewählte Arbeiten und die Technologien, mit denen ich arbeite.', proofLabel: 'Projekte', ctaDraft: 'Portfolio ansehen', ctaPrimary: 'Zum Lebenslauf' },
    profile: { kicker: 'Profil', heading: 'Über mich.', intro: 'Ich bin Issa Hareb, autodidaktischer Full-Stack- und KI-Entwickler aus Essen. Mein Schwerpunkt sind Webanwendungen, Agenten und Automatisierungen.' },
    nav: { about: 'Profil', work: 'Projekte', stack: 'Kenntnisse' },
    projects: { kicker: 'Portfolio', heading: 'Ausgewählte Projekte.', subtitle: 'Was ich gebaut habe, welche Technik dahintersteckt und wo die Projekte heute stehen.' },
    contact: { heading: 'Kontakt aufnehmen.', subtitle: 'Für berufliche Möglichkeiten, fachlichen Austausch und gemeinsame Projekte erreichst du mich direkt.', cta: 'E-Mail schreiben', ctaSubject: 'Kontakt über das Portfolio' },
    footerTagline: 'Full-Stack- & KI-Entwickler',
    resume: {
      kicker: 'Lebenslauf', heading: 'Mein Werdegang.', intro: 'Praktische Erfahrung, Ausbildung und mein Weg in die Softwareentwicklung.', notice: 'Die vollständigen Stationen folgen mit meinem Lebenslauf. Die markierten Angaben sind Platzhalter.', placeholder: 'Platzhalter', experience: 'Berufserfahrung', education: 'Ausbildung', development: 'Softwareentwicklung', datePlaceholder: '[MM/JJJJ – MM/JJJJ]', rolePlaceholder: '[Position / Tätigkeit]', employerPlaceholder: '[Arbeitgeber · Ort]', experienceBody: '[Aufgaben, Verantwortungsbereiche und Ergebnisse werden ergänzt.]', educationTitle: 'Fachabitur · Wirtschaft und Verwaltung', schoolPlaceholder: '[Schule · Ort · Abschlussjahr]', educationBody: 'Abschluss vorhanden. Schule und Zeitraum werden mit dem Lebenslauf ergänzt.', developmentTitle: 'Autodidaktische Entwicklung', developmentContext: 'Eigene Produkte & Kundensysteme', developmentDate: 'Fortlaufend', developmentBody: 'Webanwendungen, KI-Agenten und Automatisierungen. Lernen durch Umsetzung, Tests und den Betrieb echter Projekte.', location: 'Standort', learning: 'Hintergrund', learningValue: 'Autodidakt', focus: 'Schwerpunkt', focusValue: 'Webentwicklung & KI', projectRole: 'Mein Beitrag', projectRoleValue: 'Konzeption & Entwicklung', galleryLabel: 'Interaktive Projektgalerie', more: 'Weitere Projekte', github: 'GitHub-Profil',
    },
  },
  en: {
    hero: { kickerWords: ['Resume', 'Portfolio'], headingLine1: 'Issa Hareb.', headingLine2: 'Full-Stack & AI Developer', headingPlain: 'Issa Hareb. Full-Stack & AI Developer', lead: 'Self-taught developer based in Essen, Germany. I combine web development, design and AI in my own products and client systems.', body: 'Explore my background, selected work and the technologies I use.', proofLabel: 'Projects', ctaDraft: 'View portfolio', ctaPrimary: 'View resume' },
    profile: { kicker: 'Profile', heading: 'About me.', intro: 'I am Issa Hareb, a self-taught full-stack and AI developer based in Essen. I focus on web applications, agents and automations.' },
    nav: { about: 'Profile', work: 'Projects', stack: 'Skills' },
    projects: { kicker: 'Portfolio', heading: 'Selected projects.', subtitle: 'What I built, the technology behind it and the current status of each project.' },
    contact: { heading: 'Get in touch.', subtitle: 'Contact me directly about professional opportunities, technical conversations and projects together.', cta: 'Write an email', ctaSubject: 'Portfolio contact' },
    footerTagline: 'Full-Stack & AI Developer',
    resume: {
      kicker: 'Resume', heading: 'My background.', intro: 'Practical experience, education and my path into software development.', notice: 'The full history will be added from my CV. Marked fields are placeholders.', placeholder: 'Placeholder', experience: 'Professional experience', education: 'Education', development: 'Software development', datePlaceholder: '[MM/YYYY – MM/YYYY]', rolePlaceholder: '[Role / position]', employerPlaceholder: '[Employer · location]', experienceBody: '[Responsibilities, tasks and outcomes to be added.]', educationTitle: 'Fachabitur · Business & Administration', schoolPlaceholder: '[School · location · graduation year]', educationBody: 'Qualification completed. School and dates will be added from the CV.', developmentTitle: 'Self-taught development', developmentContext: 'Own products & client systems', developmentDate: 'Ongoing', developmentBody: 'Web applications, AI agents and automations. Learning through implementation, testing and running real projects.', location: 'Location', learning: 'Background', learningValue: 'Self-taught', focus: 'Focus', focusValue: 'Web development & AI', projectRole: 'My contribution', projectRoleValue: 'Concept & development', galleryLabel: 'Interactive project gallery', more: 'Further projects', github: 'GitHub profile',
    },
  },
  es: {
    hero: { kickerWords: ['Currículum', 'Portfolio'], headingLine1: 'Issa Hareb.', headingLine2: 'Desarrollador Full-Stack e IA', headingPlain: 'Issa Hareb. Desarrollador Full-Stack e IA', lead: 'Desarrollador autodidacta de Essen, Alemania. Combino desarrollo web, diseño e IA en productos propios y sistemas para clientes.', body: 'Conoce mi trayectoria, proyectos seleccionados y las tecnologías con las que trabajo.', proofLabel: 'Proyectos', ctaDraft: 'Ver portfolio', ctaPrimary: 'Ver currículum' },
    profile: { kicker: 'Perfil', heading: 'Sobre mí.', intro: 'Soy Issa Hareb, desarrollador autodidacta Full-Stack e IA de Essen. Me centro en aplicaciones web, agentes y automatizaciones.' },
    nav: { about: 'Perfil', work: 'Proyectos', stack: 'Conocimientos' },
    projects: { kicker: 'Portfolio', heading: 'Proyectos seleccionados.', subtitle: 'Qué he desarrollado, qué tecnología utiliza y cuál es su estado actual.' },
    contact: { heading: 'Ponte en contacto.', subtitle: 'Puedes escribirme directamente sobre oportunidades profesionales, intercambio técnico y proyectos conjuntos.', cta: 'Escribir un correo', ctaSubject: 'Contacto desde el portfolio' },
    footerTagline: 'Desarrollador Full-Stack e IA',
    resume: {
      kicker: 'Currículum', heading: 'Mi trayectoria.', intro: 'Experiencia práctica, formación y mi camino hacia el desarrollo de software.', notice: 'La trayectoria completa se añadirá con mi currículum. Los campos marcados son provisionales.', placeholder: 'Provisional', experience: 'Experiencia profesional', education: 'Formación', development: 'Desarrollo de software', datePlaceholder: '[MM/AAAA – MM/AAAA]', rolePlaceholder: '[Puesto / actividad]', employerPlaceholder: '[Empresa · ubicación]', experienceBody: '[Se añadirán tareas, responsabilidades y resultados.]', educationTitle: 'Fachabitur · Economía y Administración', schoolPlaceholder: '[Centro · ubicación · año de titulación]', educationBody: 'Titulación completada. El centro y las fechas se añadirán con el currículum.', developmentTitle: 'Desarrollo autodidacta', developmentContext: 'Productos propios y sistemas para clientes', developmentDate: 'Continuo', developmentBody: 'Aplicaciones web, agentes de IA y automatizaciones. Aprendizaje mediante implementación, pruebas y operación de proyectos reales.', location: 'Ubicación', learning: 'Formación', learningValue: 'Autodidacta', focus: 'Especialidad', focusValue: 'Desarrollo web e IA', projectRole: 'Mi contribución', projectRoleValue: 'Concepto y desarrollo', galleryLabel: 'Galería interactiva de proyectos', more: 'Más proyectos', github: 'Perfil de GitHub',
    },
  },
} satisfies Record<Lang, {
  hero: Partial<Dictionary['hero']>
  profile: Pick<Dictionary['about'], 'kicker' | 'heading' | 'intro'>
  nav: Partial<Dictionary['nav']>
  projects: Partial<Dictionary['projects']>
  contact: Partial<Dictionary['contact']>
  footerTagline: string
  resume: Record<string, string>
}>

export function withPortfolioCopy(base: Dictionary, lang: Lang): Dictionary {
  const copy = PORTFOLIO_COPY[lang]
  return {
    ...base,
    hero: { ...base.hero, ...copy.hero },
    nav: { ...base.nav, ...copy.nav },
    about: { ...base.about, ...copy.profile },
    projects: { ...base.projects, ...copy.projects },
    contact: { ...base.contact, ...copy.contact },
    footer: { ...base.footer, tagline: copy.footerTagline },
  }
}
