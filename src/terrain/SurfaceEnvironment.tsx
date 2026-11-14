import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { InstancedMesh, type DirectionalLight } from 'three'
import { createTerrain } from './proceduralTerrain'
import { createRockGeometry, scatterRocks } from './rockScatter'
import { surfaceRegistry } from './surfaceRegistry'
import { SkyDome } from './SkyDome'
import type { PlanetId } from '../planets/planetConfig'
import { sitesFor } from '../scenes/surface/sites'

interface Props {
  planet: PlanetId
  visible: boolean
}

const MOON_SUN: [number, number, number] = [-0.82, 0.26, 0.5]
const MARS_SUN: [number, number, number] = [-0.62, 0.52, 0.42]
const norm = (v: [number, number, number]): [number, number, number] => {
  const l = Math.hypot(...v)
  return [v[0] / l, v[1] / l, v[2] / l]
}

/**
 * Procedural surface patch. Generated while the user is in Planet View (hidden),
 * so the cinematic descent never stalls on geometry work.
 */
export function SurfaceEnvironment({ planet, visible }: Props) {
  const terrain = useMemo(() => createTerrain(planet), [planet])
  const rockGeometry = useMemo(() => createRockGeometry(planet), [planet])
  const rocks = useMemo(
    () =>
      scatterRocks(
        planet,
        terrain.heightAt,
        planet === 'moon' ? 900 : 800,
        sitesFor(planet).map((s) => [s.x, s.z, s.radius + 5] as const),
      ),
    [planet, terrain],
  )
  const rockMesh = useRef<InstancedMesh>(null)
  const sun = useRef<DirectionalLight>(null)

  useLayoutEffect(() => {
    const mesh = rockMesh.current
    if (!mesh) return
    rocks.forEach((r, i) => {
      mesh.setMatrixAt(i, r.matrix)
      mesh.setColorAt(i, r.color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [rocks])

  useEffect(() => {
    surfaceRegistry.heightAt = terrain.heightAt
    return () => {
      surfaceRegistry.heightAt = null
      terrain.geometry.dispose()
      terrain.detailBump.dispose()
    }
  }, [terrain])

  useEffect(() => () => rockGeometry.dispose(), [rockGeometry])

  const sunDir = norm(planet === 'moon' ? MOON_SUN : MARS_SUN)
  const sunPos: [number, number, number] = [sunDir[0] * 160, sunDir[1] * 160, sunDir[2] * 160]
  const isMoon = planet === 'moon'

  return (
    <group visible={visible}>
      {visible && (
        <>
          <directionalLight
            ref={sun}
            position={sunPos}
            intensity={isMoon ? 4.6 : 2.7}
            color={isMoon ? '#fffaf2' : '#ffd6a4'}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-108}
            shadow-camera-right={108}
            shadow-camera-top={108}
            shadow-camera-bottom={-108}
            shadow-camera-near={10}
            shadow-camera-far={380}
            shadow-bias={-0.0004}
            shadow-normalBias={0.06}
          />
          {isMoon ? (
            <ambientLight intensity={0.03} color="#9db4ff" />
          ) : (
            <hemisphereLight args={['#e2b085', '#5d3322', 0.55]} />
          )}
          {isMoon ? (
            <color attach="background" args={['#000000']} />
          ) : (
            <>
              <color attach="background" args={['#c99062']} />
              <fog attach="fog" args={['#c99062', 45, 250]} />
            </>
          )}
          {!isMoon && (
            <SkyDome horizon="#d29a68" zenith="#6d5a58" sunDir={sunDir} sunColor="#ffd9a8" />
          )}
        </>
      )}

      <mesh geometry={terrain.geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={1}
          metalness={0}
          bumpMap={terrain.detailBump}
          bumpScale={isMoon ? 3.2 : 2.4}
        />
      </mesh>

      <instancedMesh
        ref={rockMesh}
        args={[rockGeometry, undefined, rocks.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <meshStandardMaterial roughness={1} metalness={0} flatShading />
      </instancedMesh>
    </group>
  )
}
