import { useMemo } from 'react'
import { PlanetGlobe } from './PlanetGlobe'
import { createMoonTextures } from './proceduralTextures'

export function MoonGlobe() {
  const textures = useMemo(() => createMoonTextures(), [])
  return <PlanetGlobe id="moon" textures={textures} bumpScale={2.2} />
}
