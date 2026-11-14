import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { createEarthTextures } from '../../../planets/proceduralTextures'
import { Atmosphere } from '../../../planets/Atmosphere'
import { EARTH_POSITION, KEPLER_POSITION, KEPLER_SCENE } from '../environments'
import { DeepBackdrop } from '../backdrop/DeepBackdrop'
import { DiscoveryMarker } from '../DiscoveryMarker'
import { OrbitRing } from '../OrbitLine'
import { SpacecraftModel } from '../spacecraft/SpacecraftModel'

/** Sun at the centre, Earth as a visual reference, Kepler on a larger, trailing heliocentric orbit. */
export default function KeplerScene() {
  const earthTex = useMemo(() => createEarthTextures(), [])
  const earth = useRef<Mesh>(null)
  useEffect(
    () => () => {
      earthTex.map.dispose()
      earthTex.bump.dispose()
    },
    [earthTex],
  )
  useFrame((_, delta) => {
    if (earth.current) earth.current.rotation.y += delta * 0.25
  })

  return (
    <>
      <DeepBackdrop colorA="#12214f" colorB="#5a2f6a" strength={0.5} />
      <mesh>
        <sphereGeometry args={[4, 48, 48]} />
        <meshBasicMaterial color="#ffcf8a" />
      </mesh>
      <Atmosphere radius={4} color="#ffb457" scale={1.5} strength={1.2} power={2.2} />
      <pointLight position={[0, 0, 0]} intensity={900} distance={0} decay={1.4} color="#fff0d6" />
      <ambientLight intensity={0.06} color="#8fa6d8" />

      <OrbitRing radius={KEPLER_SCENE.earthRadius} color="#7fd8e6" opacity={0.3} />
      <OrbitRing radius={KEPLER_SCENE.keplerRadius} color="#e8b45a" opacity={0.45} />

      <mesh ref={earth} position={EARTH_POSITION}>
        <sphereGeometry args={[1.1, 48, 48]} />
        <meshStandardMaterial map={earthTex.map} roughness={0.9} />
      </mesh>

      <group position={KEPLER_POSITION} rotation={[0.3, 0.4, 0.2]} scale={0.38}>
        <SpacecraftModel kind="kepler" />
      </group>
      <DiscoveryMarker missionId="kepler" position={KEPLER_POSITION} size={1.4} />
    </>
  )
}
