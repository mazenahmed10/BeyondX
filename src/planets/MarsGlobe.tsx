import { useMemo } from 'react'
import { Atmosphere } from './Atmosphere'
import { PlanetGlobe } from './PlanetGlobe'
import { PLANETS } from './planetConfig'
import { createMarsTextures } from './proceduralTextures'

export function MarsGlobe() {
  const textures = useMemo(() => createMarsTextures(), [])
  return (
    <PlanetGlobe id="mars" textures={textures} bumpScale={1.6}>
      <Atmosphere radius={PLANETS.mars.radius} color="#e89a62" strength={1.0} power={3.4} />
    </PlanetGlobe>
  )
}
