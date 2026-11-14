import { useMemo } from 'react'
import { dark, dishGeometry, foil, metal, panel, white } from './materials'

/** Simplified Dawn reconstruction: box bus, two large solar arrays, dish, ion thrusters. */
export function DawnModel() {
  const dish = useMemo(() => dishGeometry(0.42, 0.14), [])
  return (
    <group>
      <mesh material={foil} castShadow>
        <boxGeometry args={[0.7, 0.7, 1.0]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.38, 0, 0]}>
          <mesh material={metal} position={[s * 0.1, 0, 0]}>
            <boxGeometry args={[0.2, 0.05, 0.05]} />
          </mesh>
          {[0, 1].map((i) => (
            <mesh key={i} material={panel} position={[s * (0.5 + i * 1.28), 0, 0]} castShadow>
              <boxGeometry args={[1.2, 0.03, 0.85]} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh geometry={dish} material={white} position={[0, 0.36, 0.1]} rotation={[0.35, 0, 0]} castShadow />
      <mesh material={dark} position={[0, 0.32, 0.12]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
      </mesh>
      {[-0.18, 0, 0.18].map((x) => (
        <mesh key={x} material={metal} position={[x, 0, -0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.07, 0.16, 12]} />
        </mesh>
      ))}
    </group>
  )
}
