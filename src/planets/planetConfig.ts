export type PlanetId = 'moon' | 'mars'

export interface PlanetConfig {
  id: PlanetId
  name: string
  label: string
  descriptor: string
  /** Position in the Space Hub scene (scene units, not to scale). */
  position: [number, number, number]
  radius: number
  rotationSpeed: number
  atmosphere: boolean
}

export const PLANETS: Record<PlanetId, PlanetConfig> = {
  moon: {
    id: 'moon',
    name: 'THE MOON',
    label: 'Moon',
    descriptor: "Earth's only natural satellite",
    position: [-3.3, -0.1, 0],
    radius: 1.15,
    rotationSpeed: 0.035,
    atmosphere: false,
  },
  mars: {
    id: 'mars',
    name: 'MARS',
    label: 'Mars',
    descriptor: 'The Red Planet',
    position: [3.3, -0.1, 0],
    radius: 1.45,
    rotationSpeed: 0.05,
    atmosphere: true,
  },
}

export const PLANET_IDS: PlanetId[] = ['moon', 'mars']

export function otherPlanet(id: PlanetId): PlanetId {
  return id === 'moon' ? 'mars' : 'moon'
}
