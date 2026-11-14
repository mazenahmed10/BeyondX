import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { createCeresTextures } from '../../../planets/proceduralTextures'
import { CERES_RADIUS, DAWN_ORBIT, DAWN_POSITION } from '../environments'
import { DeepBackdrop } from '../backdrop/DeepBackdrop'
import { DiscoveryMarker } from '../DiscoveryMarker'
import { OrbitRing } from '../OrbitLine'
import { SpacecraftModel } from '../spacecraft/SpacecraftModel'

/** Ceres (procedural stand-in) with a representative parked Dawn on an illustrative orbit ring. */
export default function DawnCeresScene() {
  const textures = useMemo(() => createCeresTextures(), [])
  const body = useRef<Mesh>(null)
  useEffect(
    () => () => {
      textures.map.dispose()
      textures.bump.dispose()
    },
    [textures],
  )
  useFrame((_, delta) => {
    if (body.current) body.current.rotation.y += delta * 0.03
  })

  return (
    <>
      <DeepBackdrop colorA="#14224f" colorB="#35507a" strength={0.4} />
      <directionalLight position={[-14, 4, 8]} intensity={4.2} color="#fff6ea" />
      <ambientLight intensity={0.05} color="#8fa6d8" />
      <mesh ref={body}>
        <sphereGeometry args={[CERES_RADIUS, 96, 96]} />
        <meshStandardMaterial map={textures.map} bumpMap={textures.bump} bumpScale={2.4} roughness={1} />
      </mesh>
      <OrbitRing radius={DAWN_ORBIT.radius} tilt={DAWN_ORBIT.tilt} />
      <group position={DAWN_POSITION} rotation={[0.2, -0.9, 0.1]} scale={0.8}>
        <SpacecraftModel kind="dawn" />
      </group>
      <DiscoveryMarker missionId="dawn" position={DAWN_POSITION} size={1.3} />
    </>
  )
}
