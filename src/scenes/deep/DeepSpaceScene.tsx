import { lazy, Suspense } from 'react'
import { useAppStore } from '../../app/store'
import { getMission, type EnvironmentId } from '../../data/missions'

// Each mission environment is its own chunk: loaded only when the user opens it.
const DeepSpaceHubScene = lazy(() => import('./DeepSpaceHubScene'))
const DawnCeresScene = lazy(() => import('./missions/DawnCeresScene'))
const NearErosScene = lazy(() => import('./missions/NearErosScene'))
const Pioneer10Scene = lazy(() => import('./missions/Pioneer10Scene'))
const Pioneer11Scene = lazy(() => import('./missions/Pioneer11Scene'))
const KeplerScene = lazy(() => import('./missions/KeplerScene'))

const ENV_SCENES: Record<EnvironmentId, React.LazyExoticComponent<() => React.JSX.Element>> = {
  'dawn-ceres': DawnCeresScene,
  'near-eros': NearErosScene,
  'pioneer-10': Pioneer10Scene,
  'pioneer-11': Pioneer11Scene,
  kepler: KeplerScene,
}

/** Router for Deep Space content inside the persistent canvas. */
export function DeepSpaceScene() {
  const phase = useAppStore((s) => s.phase)
  const missionId = useAppStore((s) => s.selectedMission)
  const mission = getMission(missionId)

  if (phase === 'DEEP_SPACE') {
    return (
      <Suspense fallback={null}>
        <DeepSpaceHubScene />
      </Suspense>
    )
  }
  if ((phase === 'MISSION' || phase === 'STORY') && mission) {
    const Env = ENV_SCENES[mission.environmentId]
    return (
      <Suspense fallback={null}>
        <Env key={mission.id} />
      </Suspense>
    )
  }
  return null
}
