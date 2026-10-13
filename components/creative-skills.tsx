'use client'

import { CodeXml, Layers, Box, WandSparkles } from 'lucide-react'
import { useLanguage } from './language-context'
import { Reveal } from './anim'
import styles from './creative-skills.module.css'

const copy = {
  de: { label: 'Design · Motion · Code', title: 'Kreativ im Kopf. Präzise in der Umsetzung.', intro: 'Ich bin Webdesigner und Entwickler. Ich gestalte den Look, bringe Ideen in Bewegung und programmiere die Anwendung dahinter.', skills: [
    ['Webdesign & UI/UX', 'Von Typografie und Farbwelt bis zur klaren, responsiven Benutzeroberfläche.', 'Layout · Interaktion · Responsive Design'],
    ['Bildgestaltung', 'Bildbearbeitung, Compositing und visuelle Gestaltung mit Adobe Photoshop.', 'Adobe Photoshop'],
    ['Motion Design', 'Animationen und bewegte Grafiken mit Adobe After Effects – vom Übergang bis zur visuellen Geschichte.', 'Adobe After Effects'],
    ['3D & Entwicklung', 'Räumliche Gestaltung mit Blender und interaktive Erlebnisse im Browser mit Three.js, React und Next.js.', 'Blender · Three.js · React / Next.js'],
  ], closing: 'Vom ersten visuellen Konzept bis zur funktionierenden Website.' },
  en: { label: 'Design · Motion · Code', title: 'Creative thinking. Precise execution.', intro: 'I am a web designer and developer. I shape the visual identity, bring ideas into motion and build the application behind it.', skills: [
    ['Web design & UI/UX', 'From typography and colour to clear, responsive interfaces.', 'Layout · Interaction · Responsive design'],
    ['Visual design', 'Image editing, compositing and visual design with Adobe Photoshop.', 'Adobe Photoshop'],
    ['Motion design', 'Animation and moving graphics with Adobe After Effects, from transitions to visual storytelling.', 'Adobe After Effects'],
    ['3D & development', 'Spatial design with Blender and interactive browser experiences with Three.js, React and Next.js.', 'Blender · Three.js · React / Next.js'],
  ], closing: 'From the first visual concept to a working website.' },
  es: { label: 'Diseño · Motion · Código', title: 'Ideas creativas. Ejecución precisa.', intro: 'Soy diseñador y desarrollador web. Doy forma a la identidad visual, animo las ideas y programo la aplicación.', skills: [
    ['Diseño web y UI/UX', 'Desde tipografía y color hasta interfaces claras y adaptables.', 'Layout · Interacción · Diseño responsive'],
    ['Diseño visual', 'Edición de imágenes, composición y diseño visual con Adobe Photoshop.', 'Adobe Photoshop'],
    ['Motion design', 'Animación y gráficos en movimiento con Adobe After Effects, desde transiciones hasta historias visuales.', 'Adobe After Effects'],
    ['3D y desarrollo', 'Diseño espacial con Blender y experiencias interactivas con Three.js, React y Next.js.', 'Blender · Three.js · React / Next.js'],
  ], closing: 'Del primer concepto visual a una web funcional.' },
}
const icons = [CodeXml, Layers, WandSparkles, Box]

export function CreativeSkills() {
  const { lang } = useLanguage()
  const t = copy[lang]
  return <section id="creative-skills" className={styles.section} aria-labelledby="creative-heading">
    <Reveal className={styles.intro}><p className={styles.label}>{t.label}</p><h2 id="creative-heading">{t.title}</h2><p>{t.intro}</p></Reveal>
    <div className={styles.grid}>{t.skills.map(([title, body, tools], i) => {
      const Icon = icons[i]
      return <Reveal key={title} y={18} delay={i * .04}><article className={styles.card}>
        <Icon size={26} strokeWidth={1.4} aria-hidden /><h3>{title}</h3><p>{body}</p><span className={styles.tools}>{tools}</span>
      </article></Reveal>
    })}</div>
    <p className={styles.closing}>{t.closing}</p>
  </section>
}
