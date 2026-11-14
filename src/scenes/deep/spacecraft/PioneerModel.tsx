import { useMemo } from 'react'
import { dark, dishGeometry, foil, metal, white } from './materials'

/**
 * Simplified Pioneer reconstruction (shared by Pioneer 10 and 11): large dish,
 * hexagonal equipment bay, two RTG booms and one long boom. The dish faces +Z.
 */
export function PioneerModel() {
  const dish = useMemo(() => dishGeometry(1.15, 0.38), [])
  const booms = [
    { angle: -0.5, len: 2.2, rtg: true },
    { angle: Math.PI + 0.5, len: 2.2, rtg: true },
    { angle: Math.PI / 2 + 0.2, len: 3.0, rtg: false },
  ]
  return (
    <group>
      <mesh geometry={dish} material={white} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.12]} castShadow />
      <mesh material={foil} position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.34, 6]} />
      </mesh>
      <mesh material={dark} position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
      </mesh>
      {booms.map((b, i) => (
        <group key={i} position={[0, 0, -0.5]} rotation={[0, 0, b.angle]}>
          <mesh material={metal} position={[b.len / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, b.len, 6]} />
          </mesh>
          {b.rtg &&
            [0, 1].map((k) => (
              <mesh key={k} material={dark} position={[b.len - 0.3 - k * 0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.5, 12]} />
              </mesh>
            ))}
        </group>
      ))}
    </group>
  )
}
