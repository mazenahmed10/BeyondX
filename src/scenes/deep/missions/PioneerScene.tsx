import { useEffect, useMemo } from 'react'
import { createGasGiantTexture } from '../../../planets/proceduralTextures'
import { Atmosphere } from '../../../planets/Atmosphere'
import { PIONEER_POSITION } from '../environments'
import { DeepBackdrop } from '../backdrop/DeepBackdrop'
import { DiscoveryMarker } from '../DiscoveryMarker'
import { DashedPath } from '../OrbitLine'
import { SpacecraftModel } from '../spacecraft/SpacecraftModel'

type Variant = 'pioneer-10' | 'pioneer-11'

const JUPITER: [number, number, number] = [-44, -3, -62]
const SATURN: [number, number, number] = [58, 5, -78]

/**
 * Separate scenes for Pioneer 10 and 11 (same engine, different content). Bodies are
 * illustrative stand-ins placed for composition only; paths are NOT measured trajectories.
 */
export default function PioneerScene({ variant }: { variant: Variant }) {
  const hasSaturn = variant === 'pioneer-11'
  const jupiterTex = useMemo(() => createGasGiantTexture('jupiter'), [])
  const saturnTex = useMemo(() => (hasSaturn ? createGasGiantTexture('saturn') : null), [hasSaturn])
  useEffect(
    () => () => {
      jupiterTex.dispose()
      saturnTex?.dispose()
    },
    [jupiterTex, saturnTex],
  )

  const path = useMemo<[number, number, number][]>(
    () =>
      hasSaturn
        ? [
            [-95, 6, 28],
            [-64, 1, -30],
            [-52, -1, -52],
            [-12, 5, -64],
            [30, 4, -66],
            [46, 3, -66],
            [30, 1, -26],
            [PIONEER_POSITION[0], 0, 0],
            [-16, -1, 22],
          ]
        : [
            [-95, 6, 28],
            [-64, 1, -30],
            [-52, -1, -52],
            [-24, 1, -26],
            [PIONEER_POSITION[0], 0, 0],
            [18, 1, 20],
            [40, 3, 44],
          ],
    [hasSaturn],
  )

  return (
    <>
      <DeepBackdrop colorA="#10163a" colorB="#2c3f78" strength={0.45} />
      {/* distant Sun as a bright star (illustrative position) */}
      <mesh position={[-120, 8, 30]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial color="#fff1cf" />
      </mesh>
      <Atmosphere radius={2.2} color="#ffd9a0" scale={3.2} strength={0.9} power={2} />
      <directionalLight position={[-120, 8, 30]} intensity={3.0} color="#fff2e0" />
      <ambientLight intensity={0.08} color="#8fa6d8" />

      <mesh position={JUPITER}>
        <sphereGeometry args={[9, 64, 48]} />
        <meshStandardMaterial map={jupiterTex} roughness={1} />
      </mesh>
      {hasSaturn && saturnTex && (
        <group position={SATURN}>
          <mesh>
            <sphereGeometry args={[7.2, 64, 48]} />
            <meshStandardMaterial map={saturnTex} roughness={1} />
          </mesh>
          <mesh rotation={[Math.PI / 2 - 0.4, 0, 0.1]}>
            <ringGeometry args={[9.6, 15.5, 96]} />
            <meshBasicMaterial color="#cdb58a" transparent opacity={0.55} side={2} depthWrite={false} />
          </mesh>
        </group>
      )}

      <DashedPath points={path} />

      <group position={PIONEER_POSITION} rotation={[0.1, -0.6, 0]}>
        <SpacecraftModel kind="pioneer" />
      </group>
      <DiscoveryMarker missionId={variant} position={PIONEER_POSITION} size={1.9} />
    </>
  )
}
