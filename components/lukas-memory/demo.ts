import { normalisiere, type Gehirn } from './modell'
import type { Lang } from '@/lib/i18n'

/** Public illustrative graph. These are sample entries, never a dashboard export. */
const TYPES = ['erinnerung', 'aussage', 'episode', 'ziel', 'agent', 'gefuehl']
const HUB_TYPES = ['thema', 'subjekt', 'episodenart', 'strategie', 'agent', 'gefuehl']
const NAMES = {
  de: ['Erinnerungen', 'Wissen', 'Erlebnisse', 'Ziele', 'Beziehungen', 'Zustände'],
  en: ['Memories', 'Knowledge', 'Experiences', 'Goals', 'Relations', 'States'],
  es: ['Recuerdos', 'Conocimiento', 'Experiencias', 'Objetivos', 'Relaciones', 'Estados'],
} as const
export const REGION_NAMES = NAMES
export function createPublicBrain(lang: Lang): Gehirn {
  const names = NAMES[lang]
  const sample = lang === 'de' ? 'Beispieleintrag' : lang === 'es' ? 'Entrada de ejemplo' : 'Sample entry'
  const knoten: Gehirn['knoten'] = [{ id: 'lukas', art: 'identitaet', titel: 'L.U.K.A.S.', gewicht: 1, text: '', daten: {}, datei: '', ordner: '' }]
  const kanten: Gehirn['kanten'] = []
  names.forEach((name, region) => {
    const hub = `region-${region}`
    knoten.push({ id: hub, art: HUB_TYPES[region], titel: name, gewicht: 0.95, text: '', daten: {}, datei: '', ordner: '' })
    kanten.push({ von: 'lukas', nach: hub, art: 'beispiel', gewicht: 0.7 })
    for (let i = 0; i < 30; i++) {
      const id = `${hub}-${i}`
      knoten.push({ id, art: TYPES[region], titel: `${name} · ${i + 1}`, gewicht: 0.25 + (i % 7) / 10, text: `${sample} · ${name}`, daten: {}, datei: '', ordner: '' })
      kanten.push({ von: hub, nach: id, art: 'beispiel', gewicht: 0.35 + (i % 5) / 10 })
      if (i) kanten.push({ von: `${hub}-${i - 1}`, nach: id, art: 'beispiel', gewicht: 0.4 })
      if (region && i % 6 === 0) kanten.push({ von: `region-${region - 1}-${i}`, nach: id, art: 'beispiel', gewicht: 0.65 })
    }
  })
  return normalisiere({ stand: '', knoten, kanten, zahlen: {} })
}
