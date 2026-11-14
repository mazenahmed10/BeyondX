import { dark, foil, metal, panel, white } from './materials'

/** Simplified Kepler reconstruction: telescope barrel with sunshade, hex bus, three solar panels. */
export function KeplerModel() {
  return (
    <group>
      <mesh material={foil} position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.6, 6]} />
      </mesh>
      <mesh material={white} position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 24, 1, true]} />
      </mesh>
      <mesh material={white} position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.56, 0.5, 0.5, 24, 1, true]} />
      </mesh>
      <mesh material={dark} position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.46, 24]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, -0.55, 0]} rotation={[0, (i * 2 * Math.PI) / 3 + 0.5, 0]}>
          <mesh material={metal} position={[0.85, 0, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.04]} />
          </mesh>
          <mesh material={panel} position={[1.6, 0, 0]} castShadow>
            <boxGeometry args={[1.35, 0.03, 0.7]} />
          </mesh>
        </group>
      ))}
      <mesh material={white} position={[0.78, -0.35, 0.4]} rotation={[0.3, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 6]} />
      </mesh>
    </group>
  )
}
