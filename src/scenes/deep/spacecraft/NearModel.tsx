import { useMemo } from 'react'
import { dark, dishGeometry, foil, metal, panel, white } from './materials'

/** Simplified NEAR Shoemaker reconstruction: octagonal bus, four fixed panels, dish. */
export function NearModel() {
  const dish = useMemo(() => dishGeometry(0.5, 0.17), [])
  return (
    <group>
      <mesh material={foil} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.8, 8]} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh material={metal} position={[0.55, 0, 0]}>
            <boxGeometry args={[0.12, 0.04, 0.04]} />
          </mesh>
          <mesh material={panel} position={[1.12, 0, 0]} castShadow>
            <boxGeometry args={[1.0, 0.025, 0.62]} />
          </mesh>
        </group>
      ))}
      <mesh geometry={dish} material={white} position={[0, 0.44, 0]} castShadow />
      <mesh material={dark} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
      </mesh>
      <mesh material={dark} position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 0.1, 10]} />
      </mesh>
    </group>
  )
}
