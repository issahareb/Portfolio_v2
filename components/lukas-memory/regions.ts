import { bereich, normalisiere, type Gehirn } from './modell'
import type { Lang } from '@/lib/i18n'
import type { PublicBrain } from '@/lib/public-brain'
export const REGION_NAMES = {
  de: ['Erinnerungen', 'Wissen', 'Erlebnisse', 'Ziele', 'Beziehungen', 'Zustände'],
  en: ['Memories', 'Knowledge', 'Experiences', 'Goals', 'Relations', 'States'],
  es: ['Recuerdos', 'Conocimiento', 'Experiencias', 'Objetivos', 'Relaciones', 'Estados'],
} as const
export function brainGraph(data: PublicBrain, lang: Lang): Gehirn {
  return normalisiere({ stand: '', zahlen: {},
    knoten: data.nodes.map(node => ({ id: `node-${node.id}`, art: node.type, gewicht: node.weight, titel: node.type === 'identitaet' ? 'L.U.K.A.S.' : REGION_NAMES[lang][bereich(node.type)], text: '', daten: {}, datei: '', ordner: '' })),
    kanten: data.edges.map(edge => ({ von: `node-${edge.source}`, nach: `node-${edge.target}`, art: 'connection', gewicht: edge.weight })),
  })
}
/** Choose real region representatives, without adding invented hub nodes or edges. */
export function regionIds(graph: Gehirn): (string | null)[] {
  const degree = new Map<string, number>()
  for (const edge of graph.kanten) for (const id of [edge.von, edge.nach]) degree.set(id, (degree.get(id) ?? 0) + 1)
  return REGION_NAMES.de.map((_, region) => graph.knoten.filter(node => node.art !== 'identitaet' && bereich(node.art) === region).sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0))[0]?.id ?? null)
}
