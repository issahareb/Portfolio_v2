'use client'
import { Reveal } from './anim'
import { useT } from './language-context'
import styles from './portfolio.module.css'
export function TechStack() {
  const t = useT()
  return <section data-track-section="tech-stack-section-1" id="stack" className={styles.skills}>
    <Reveal className={styles.sectionIntro}><p className={styles.eyebrow}>{t.techStack.kicker}</p><h2>{t.techStack.heading}</h2><p>{t.techStack.subtitle}</p></Reveal>
    <dl className={styles.skillMatrix}>{t.techStack.matrix.map(item => <Reveal key={item.layer} y={16}><dt>{item.layer}</dt><dd>{item.items}</dd></Reveal>)}</dl>
  </section>
}
