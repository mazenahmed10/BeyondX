import { getStory, type ModelKind } from '../../data/stories'
import type { PlanetId } from '../../planets/planetConfig'
import { marsHeight, moonHeight, type HeightFn } from '../../terrain/proceduralTerrain'

/**
 * Where each surface story sits in the 3D scene.
 *
 * HONESTY NOTE: the terrain is procedural, not a map. These positions are ILLUSTRATIVE.
 * They are arranged for visibility and reachability only (objects from the same real landing
 * site are kept near each other, e.g. Surveyor 3 beside the Apollo 12 station), and they do not
 * encode real distances or directions. They are never presented to the user as geographic
 * positions; the real coordinates, where known, live in the story data and are shown as text.
 */
export interface SurfaceSite {
  storyId: string
  planet: PlanetId
  x: number
  z: number
  rotY: number
  kind: ModelKind
  variant?: string
  scale: number
  /** Footprint radius in scene units (ground sampling, click target). */
  radius: number
  /** Height of the top of the model above the ground. */
  height: number
  /** Camera distance used when the camera focuses on this object. */
  focus: number
}

const DIMENSIONS: Partial<Record<ModelKind, { scale: number; radius: number; height: number; focus: number }>> = {
  'lm-descent': { scale: 1, radius: 4.6, height: 3.0, focus: 15 },
  lrv: { scale: 1.3, radius: 2.3, height: 3.2, focus: 9.5 },
  alsep: { scale: 1.25, radius: 5.6, height: 3.2, focus: 14 },
  surveyor: { scale: 1.15, radius: 2.7, height: 4.0, focus: 11.5 },
  impact: { scale: 1.2, radius: 4.6, height: 1.0, focus: 12 },
  sojourner: { scale: 1, radius: 5.0, height: 2.6, focus: 13 },
  mer: { scale: 1.35, radius: 2.4, height: 3.4, focus: 9.5 },
  viking: { scale: 1.15, radius: 3.9, height: 3.4, focus: 12 },
  phoenix: { scale: 1.25, radius: 4.2, height: 3.0, focus: 12 },
  insight: { scale: 1.25, radius: 4.2, height: 2.8, focus: 12 },
  ingenuity: { scale: 1.25, radius: 2.4, height: 2.9, focus: 8.5 },
}

/** [x, z, rotation]: illustrative layout, see note above. */
const PLACEMENT: Record<string, [number, number, number]> = {
  // Moon: every site sits on sunlit ground (the low western sun leaves the west of the patch in shadow)
  'moon-surveyor-1': [-13, -8, 0.6],
  'moon-surveyor-2': [-4, -17, 0.2],
  'moon-surveyor-3': [3, 9, -0.4],
  'moon-alsep-apollo-12': [13, 5, 0.3],
  'moon-surveyor-7': [6, 44, 2.4],
  'moon-surveyor-6': [8, -6, 0.9],
  'moon-surveyor-4': [19, -11, -0.3],
  'moon-alsep-apollo-14': [22, 14, -0.6],
  'moon-lrv-apollo-15': [14, -34, 0.5],
  'moon-alsep-apollo-15': [25, -30, -0.2],
  'moon-lrv-apollo-16': [30, 22, -0.9],
  'moon-alsep-apollo-16': [40, 16, 0.5],
  'moon-eagle-descent-stage': [37, -1, -0.5],
  'moon-surveyor-5': [47, -8, 1.1],
  'moon-lrv-apollo-17': [41, -26, 0.3],
  'moon-alsep-apollo-17': [51, -20, -0.7],
  // Mars
  'mars-phoenix': [-36, -40, 0.4],
  'mars-viking-1-lander': [-19, -14, 0.3],
  'mars-sojourner': [-7, -12, -0.2],
  'mars-opportunity': [-2, 4, 0.7],
  'mars-ingenuity': [23, -11, 0.2],
  'mars-viking-2-lander': [40, -30, -0.5],
  'mars-insight': [41, -3, -0.4],
  'mars-spirit': [50, 10, -1.0],
}

/**
 * Nudge a site (by a few units at most) onto the flattest nearby ground, so legs and wheels
 * rest on the surface instead of hanging over a crater rim. Runs once at module load.
 */
function settle(planet: PlanetId, x: number, z: number, radius: number): [number, number] {
  const h = heightFnFor(planet)
  const r = radius * 0.5
  let best: [number, number] = [x, z]
  let bestScore = Infinity
  for (let dx = -5; dx <= 5; dx += 1) {
    for (let dz = -5; dz <= 5; dz += 1) {
      const cx = x + dx
      const cz = z + dz
      const c = h(cx, cz)
      let rough = 0
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2
        rough = Math.max(rough, Math.abs(h(cx + Math.cos(a) * r, cz + Math.sin(a) * r) - c))
      }
      // prefer flat ground, and prefer staying close to the intended spot
      const score = rough + Math.hypot(dx, dz) * 0.03
      if (score < bestScore) {
        bestScore = score
        best = [cx, cz]
      }
    }
  }
  return best
}

export const SURFACE_SITES: SurfaceSite[] = Object.entries(PLACEMENT).map(([storyId, [px, pz, rotY]]) => {
  const story = getStory(storyId)
  if (!story || story.world === 'deep-space') throw new Error(`[sites] no surface story for "${storyId}"`)
  const dim = DIMENSIONS[story.model.kind]
  if (!dim) throw new Error(`[sites] no dimensions for model "${story.model.kind}"`)
  const [x, z] = settle(story.world, px, pz, dim.radius)
  return { storyId, planet: story.world, x, z, rotY, kind: story.model.kind, variant: story.model.variant, ...dim }
})

export const sitesFor = (planet: PlanetId): SurfaceSite[] => SURFACE_SITES.filter((s) => s.planet === planet)
export const getSite = (storyId: string | null): SurfaceSite | null => SURFACE_SITES.find((s) => s.storyId === storyId) ?? null

export function heightFnFor(planet: PlanetId): HeightFn {
  return planet === 'moon' ? moonHeight : marsHeight
}

/** Ground level under a site (sites are pre-settled on flat ground, so the mean is enough). */
export function siteGroundY(site: SurfaceSite): number {
  const h = heightFnFor(site.planet)
  const r = site.radius * 0.45
  const samples = [h(site.x, site.z), h(site.x + r, site.z), h(site.x - r, site.z), h(site.x, site.z + r), h(site.x, site.z - r)]
  return samples.reduce((a, b) => a + b, 0) / samples.length
}

/** Horizontal direction toward the Sun in each surface scene (matches SurfaceEnvironment's light). */
export const SUN_HORIZONTAL: Record<PlanetId, [number, number]> = {
  moon: [-0.854, 0.521],
  mars: [-0.828, 0.561],
}
