import { lazy, Suspense } from 'react'
import { CameraRig } from '../../camera/CameraRig'
import { MarsGlobe } from '../../planets/MarsGlobe'
import { MoonGlobe } from '../../planets/MoonGlobe'
import { SurfaceEnvironment } from '../../terrain/SurfaceEnvironment'
import { useAppStore } from '../../app/store'
import { isDeepPhase } from '../../app/phaseMachine'
import { DeepSpaceBeacon } from '../../planets/DeepSpaceBeacon'
import { DeepSpaceScene } from '../deep/DeepSpaceScene'
import { Starfield } from './Starfield'

// Equipment models + discovery markers: their own chunk, loaded with the surface.
const SurfaceDiscoveries = lazy(() => import('../surface/SurfaceDiscoveries'))

/**
 * Content of the single persistent canvas. Hub/orbit objects and the surface
 * environment swap by phase inside the same Canvas (no second WebGL context).
 */
export function SpaceScene() {
  const phase = useAppStore((s) => s.phase)
  const planet = useAppStore((s) => s.selectedPlanet)
  const onSurface = phase === 'SURFACE' || phase === 'DISCOVERY'
  const deep = isDeepPhase(phase)
  const hideStars = onSurface && planet === 'mars'

  return (
    <>
      {!onSurface && <color attach="background" args={['#01030a']} />}
      <CameraRig />
      {!hideStars && <Starfield />}

      {!onSurface && !deep && (
        <>
          {/* Sun: one hard directional light, very low fill so night sides stay dark */}
          <directionalLight position={[-7, 3.5, 6]} intensity={3.4} color="#fff4e6" />
          <ambientLight intensity={0.035} color="#8fb4ff" />
        </>
      )}

      <MoonGlobe />
      <MarsGlobe />
      <DeepSpaceBeacon />
      {deep && <DeepSpaceScene />}

      {/* Mounted (hidden) from Planet View on, so terrain is ready before the descent. */}
      {planet && phase !== 'HUB' && <SurfaceEnvironment key={planet} planet={planet} visible={onSurface} />}
      {planet && onSurface && (
        <Suspense fallback={null}>
          <SurfaceDiscoveries key={`discoveries-${planet}`} planet={planet} />
        </Suspense>
      )}
    </>
  )
}
