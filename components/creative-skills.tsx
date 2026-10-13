'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useLanguage } from './language-context'
import { Reveal } from './anim'
import styles from './creative-skills.module.css'

const copy = {
  de: { label: 'Design · Motion · Code', title: 'Kreativ im Kopf. Präzise in der Umsetzung.', intro: 'Ich bin Webdesigner und Entwickler. Ich gestalte den Look, bringe Ideen in Bewegung und programmiere die Anwendung dahinter.', skills: [
    ['Webdesign & UI/UX', 'Websites mit Charakter. Klare Gestaltung, durchdachte Interaktionen und ein Erlebnis, das auf jedem Bildschirm funktioniert.', 'Von der Idee zum Interface'],
    ['Visuelle Gestaltung', 'Aus Bildern, Farben und Typografie entsteht eine eigene visuelle Sprache. Ich gestalte Kompositionen, die Aufmerksamkeit wecken und im Kopf bleiben.', 'Komposition · Bildwelten · Identität'],
    ['Motion Design', 'Ich bringe Gestaltung in Bewegung. Mit Rhythmus, Übergängen und visuellen Geschichten, die eine Idee spürbar machen.', 'Bewegung mit Ausdruck'],
    ['3D & interaktive Erlebnisse', 'Räumliche Welten, lebendige Oberflächen und individuelle Anwendungen. Ich verbinde kreative Gestaltung mit technischer Umsetzung.', 'Tiefe · Interaktion · Entwicklung'],
  ], tools: 'Zu meinen Werkzeugen gehören unter anderem Adobe Photoshop, After Effects und Blender. Welche ich nutze, entscheidet die Idee.', closing: 'Vom ersten visuellen Konzept bis zur funktionierenden Website.' },
  en: { label: 'Design · Motion · Code', title: 'Creative thinking. Precise execution.', intro: 'I am a web designer and developer. I shape the visual identity, bring ideas into motion and build the application behind it.', skills: [
    ['Web design & UI/UX', 'Websites with character. Clear design, thoughtful interactions and an experience that works on every screen.', 'From idea to interface'],
    ['Visual design', 'Images, colour and typography become a distinctive visual language. I create compositions that capture attention and stay in your mind.', 'Composition · Imagery · Identity'],
    ['Motion design', 'I bring design to life through rhythm, transitions and visual stories that make an idea tangible.', 'Movement with expression'],
    ['3D & interactive experiences', 'Spatial worlds, lively interfaces and individual applications. I connect creative design with technical execution.', 'Depth · Interaction · Development'],
  ], tools: 'My tools include Adobe Photoshop, After Effects and Blender. The idea determines which ones I use.', closing: 'From the first visual concept to a working website.' },
  es: { label: 'Diseño · Motion · Código', title: 'Ideas creativas. Ejecución precisa.', intro: 'Soy diseñador y desarrollador web. Doy forma a la identidad visual, animo las ideas y programo la aplicación.', skills: [
    ['Diseño web y UI/UX', 'Webs con carácter. Diseño claro, interacciones cuidadas y una experiencia que funciona en cada pantalla.', 'De la idea a la interfaz'],
    ['Diseño visual', 'Imágenes, colores y tipografía crean un lenguaje visual propio. Diseño composiciones que llaman la atención y dejan huella.', 'Composición · Imágenes · Identidad'],
    ['Motion design', 'Doy movimiento al diseño con ritmo, transiciones e historias visuales que hacen tangible una idea.', 'Movimiento con expresión'],
    ['3D y experiencias interactivas', 'Mundos espaciales, interfaces vivas y aplicaciones a medida. Uno la creatividad con la ejecución técnica.', 'Profundidad · Interacción · Desarrollo'],
  ], tools: 'Trabajo, entre otras herramientas, con Adobe Photoshop, After Effects y Blender. La idea determina cuáles utilizo.', closing: 'Del primer concepto visual a una web funcional.' },
}

function SkillVisual({ index }: { index: number }) {
  return <div className={`${styles.visual} ${styles[`scene${index}`]}`} aria-hidden="true">
    {index === 0 && <div className={styles.browser}><div className={styles.browserBar}><i /><i /><i /></div><div className={styles.layout}><b /><span /><span /><i /></div><div className={styles.cursor} /></div>}
    {index === 1 && <div className={styles.composition}><i /><i /><i /><strong>Aa</strong><span /></div>}
    {index === 2 && <div className={styles.motionTrack}><i /><i /><i /><div className={styles.motionOrb} /><span /></div>}
    {index === 3 && <div className={styles.spatial}><div className={styles.cube}>{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div><span /><span /></div>}
    <span className={styles.number}>0{index + 1}</span>
  </div>
}
function SkillCard({ skill, index }: { skill: string[]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { amount: .22 })
  const reduce = useReducedMotion()
  return <motion.article ref={ref} className={styles.card} data-active={visible} data-reveal
    initial={reduce ? false : { opacity: 0, y: 64, rotateX: 8, scale: .94 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} viewport={{ once: true, amount: .18 }}
    transition={{ duration: .9, ease: [.16, 1, .3, 1] }}>
    <SkillVisual index={index} /><div className={styles.cardCopy}><span className={styles.caption}>{skill[2]}</span><h3>{skill[0]}</h3><p>{skill[1]}</p></div>
  </motion.article>
}
export function CreativeSkills() {
  const { lang } = useLanguage()
  const t = copy[lang]
  return <section id="creative-skills" className={styles.section} aria-labelledby="creative-heading">
    <Reveal className={styles.intro}><p className={styles.label}>{t.label}</p><h2 id="creative-heading">{t.title}</h2><p>{t.intro}</p></Reveal>
    <div className={styles.grid}>{t.skills.map((skill, i) => <SkillCard key={i} skill={skill} index={i} />)}</div>
    <p className={styles.tools}>{t.tools}</p><p className={styles.closing}>{t.closing}</p>
  </section>
}
