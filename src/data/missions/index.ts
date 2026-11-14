import { validateMission } from './validate'
import type { Mission, World } from './types'

export * from './types'
export { CANONICAL_CHAPTERS } from './chapters'

/**
 * Every JSON file under data/missions/<world>/ is picked up automatically.
 * To add or update a mission: edit/add a JSON file there. No component changes needed.
 */
const modules = import.meta.glob('./**/*.json', { eager: true, import: 'default' }) as Record<string, unknown>

const ORDER = ['dawn', 'near-shoemaker', 'pioneer-10', 'pioneer-11', 'kepler']

const all: Mission[] = Object.entries(modules)
  .map(([file, raw]) => validateMission(raw, file))
  .sort((a, b) => {
    const ia = ORDER.indexOf(a.id)
    const ib = ORDER.indexOf(b.id)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })

export const MISSIONS: readonly Mission[] = all

export function getMission(id: string | null | undefined): Mission | null {
  return id ? (all.find((m) => m.id === id) ?? null) : null
}

export function missionsFor(world: World): Mission[] {
  return all.filter((m) => m.world === world)
}
