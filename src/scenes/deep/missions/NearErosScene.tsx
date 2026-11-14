import { useEffect, useMemo } from 'react'
import { BufferAttribute, Color, Quaternion, SphereGeometry, Vector3 } from 'three'
import { fbm3 } from '../../../utils/noise'
import { EROS_AXES, NEAR_SITE, erosDisplacement } from '../environments'
import { DeepBackdrop } from '../backdrop/DeepBackdrop'
import { DiscoveryMarker } from '../DiscoveryMarker'
import { SpacecraftModel } from '../spacecraft/SpacecraftModel'

function createErosGeometry(): SphereGeometry {
  const g = new SphereGeometry(1, 220, 110)
  const pos = g.attributes.position as BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const c = new Color()
  for (let i = 0; i < pos.count; i++) {
    const dx = pos.getX(i)
    const dy = pos.getY(i)
    const dz = pos.getZ(i)
    const d = erosDisplacement(dx, dy, dz)
    pos.setXYZ(i, dx * EROS_AXES[0] * d, dy * EROS_AXES[1] * d, dz * EROS_AXES[2] * d)
    const grain = fbm3(dx * 9, dy * 9, dz * 9, 3, 41)
    const patch = fbm3(dx * 2, dy * 2, dz * 2, 3, 43)
    const l = 0.42 + (grain - 0.5) * 0.2 + (patch - 0.5) * 0.14
    c.setRGB(l * 1.04, l * 0.97, l * 0.9)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  g.setAttribute('color', new BufferAttribute(colors, 3))
  g.computeVertexNormals()
  return g
}

const up = new Vector3(0, 1, 0)

/** Elongated, cratered asteroid (procedural, illustrative) with a representative lander placement. */
export default function NearErosScene() {
  const geometry = useMemo(createErosGeometry, [])
  useEffect(() => () => geometry.dispose(), [geometry])

  const landerQuat = useMemo(() => {
    const q = new Quaternion().setFromUnitVectors(up, new Vector3(...NEAR_SITE.normal))
    return q.toArray() as [number, number, number, number]
  }, [])

  return (
    <>
      <DeepBackdrop colorA="#1a1a3a" colorB="#4a3a5a" strength={0.35} />
      <directionalLight
        position={[-12, 6, 7]}
        intensity={4.4}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <ambientLight intensity={0.04} color="#8fa6d8" />
      <group>
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial vertexColors roughness={1} metalness={0} />
        </mesh>
        <group position={NEAR_SITE.position} quaternion={landerQuat} scale={0.3}>
          <group position={[0, 0.4, 0]}>
            <SpacecraftModel kind="near" />
          </group>
        </group>
        <DiscoveryMarker
          missionId="near-shoemaker"
          position={[
            NEAR_SITE.position[0] + NEAR_SITE.normal[0] * 0.6,
            NEAR_SITE.position[1] + NEAR_SITE.normal[1] * 0.6,
            NEAR_SITE.position[2] + NEAR_SITE.normal[2] * 0.6,
          ]}
          size={0.7}
        />
      </group>
    </>
  )
}
