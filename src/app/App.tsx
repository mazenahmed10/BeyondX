import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three'
import { AnimatePresence } from 'motion/react'
import { useAppStore } from './store'
import { SpaceScene } from '../scenes/hub/SpaceScene'
import { HubOverlay } from '../components/ui/HubOverlay'
import { PlanetOverlay } from '../components/ui/PlanetOverlay'
import { SurfaceOverlay } from '../components/ui/SurfaceOverlay'
import { DescentOverlay } from '../components/ui/DescentOverlay'
import { DeepSpaceOverlay } from '../components/ui/DeepSpaceOverlay'
import { MissionOverlay } from '../components/ui/MissionOverlay'
import { StoryExperience } from '../components/ui/StoryExperience'
import { DiscoveryOverlay } from '../components/ui/DiscoveryOverlay'
import { FadeOverlay } from '../components/ui/FadeOverlay'
import { LoadingOverlay } from '../components/ui/LoadingOverlay'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { Fallback } from '../components/layout/Fallback'
import { hasWebGL } from '../utils/webgl'
import { useKidStore } from './kidStore'
import { KidDecor, KidUI } from '../kid/KidLayer'

export function App() {
  const [webgl] = useState(hasWebGL)
  const phase = useAppStore((s) => s.phase)
  const selectedPlanet = useAppStore((s) => s.selectedPlanet)
  const kidMode = useKidStore((s) => s.kidMode)

  if (!webgl) return <Fallback message="WebGL is not available in this browser." />

  return (
    <div className={`relative h-full w-full bg-space ${kidMode ? 'kid' : ''}`}>
      <ErrorBoundary fallback={<Fallback message="The 3D scene could not be started." />}>
        {/* One persistent Canvas for the whole app: scenes swap inside it, never around it. */}
        <Canvas
          shadows={{ type: PCFSoftShadowMap }}
          dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
          camera={{ fov: 38, near: 0.1, far: 400, position: [0, 0.35, 10.5] }}
          gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping }}
          onCreated={() => useAppStore.getState().setLoadingState('ready')}
        >
          <Suspense fallback={null}>
            <SpaceScene />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      <KidDecor />

      <AnimatePresence mode="wait">
        {phase === 'HUB' && <HubOverlay key="hub" />}
        {phase === 'PLANET_VIEW' && selectedPlanet && <PlanetOverlay key={`planet-${selectedPlanet}`} planetId={selectedPlanet} />}
        {phase === 'DESCENT' && selectedPlanet && <DescentOverlay key="descent" planetId={selectedPlanet} />}
        {phase === 'DEEP_SPACE' && <DeepSpaceOverlay key="deep" />}
        {phase === 'MISSION' && <MissionOverlay key="mission" />}
        {phase === 'STORY' && <StoryExperience key="story" />}
        {phase === 'SURFACE' && selectedPlanet && <SurfaceOverlay key={`surface-${selectedPlanet}`} planetId={selectedPlanet} />}
        {phase === 'DISCOVERY' && selectedPlanet && <DiscoveryOverlay key="discovery" />}
      </AnimatePresence>

      <KidUI />
      <FadeOverlay />
      <LoadingOverlay />
    </div>
  )
}
