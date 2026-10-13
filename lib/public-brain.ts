export type PublicBrain = {
  version: 1;
  nodes: { id: number; type: string; weight: number }[];
  edges: { source: number; target: number; weight: number }[];
}
const TYPES = new Set(['identitaet', 'gefuehl', 'ziel', 'erinnerung', 'kategorie', 'thema', 'agent', 'subjekt', 'aussage', 'episode', 'episodenart', 'strategie', 'mitarbeiter', 'tagebuch', 'meldung'])
/** Rebuild the response from permitted fields; never forward arbitrary API keys. */
export function parsePublicBrain(value: unknown): PublicBrain {
  const input = value as PublicBrain
  if (input?.version !== 1 || !Array.isArray(input.nodes) || !Array.isArray(input.edges) || input.nodes.length > 15000 || input.edges.length > 100000) throw new Error('Invalid brain topology')
  const ids = new Set<number>()
  const nodes = input.nodes.map(node => {
    if (!Number.isSafeInteger(node.id) || node.id < 0 || ids.has(node.id) || !TYPES.has(node.type) || !Number.isFinite(node.weight) || node.weight < 0 || node.weight > 1) throw new Error('Invalid brain node')
    ids.add(node.id)
    return { id: node.id, type: node.type, weight: node.weight }
  })
  const edges = input.edges.map(edge => {
    if (!ids.has(edge.source) || !ids.has(edge.target) || edge.source === edge.target || !Number.isFinite(edge.weight) || edge.weight < 0 || edge.weight > 1) throw new Error('Invalid brain connection')
    return { source: edge.source, target: edge.target, weight: edge.weight }
  })
  return { version: 1, nodes, edges }
}
