import type { ModelKind } from '../../../data/stories'
import { IngenuityHelicopter, InSightLander, MerRover, PhoenixLander, Sojourner, VikingLander } from './marsModels'
import { AlsepStation, ImpactSite, LmDescentStage, LunarRover, SurveyorLander } from './moonModels'

/** Procedural reconstructions. Each is built to be recognisable, not dimensionally exact. */
export function EquipmentModel({ kind, variant }: { kind: ModelKind; variant?: string }) {
  switch (kind) {
    case 'lm-descent':
      return <LmDescentStage />
    case 'lrv':
      return <LunarRover variant={variant} />
    case 'alsep':
      return <AlsepStation variant={variant} />
    case 'surveyor':
      return <SurveyorLander variant={variant} />
    case 'impact':
      return <ImpactSite variant={variant} />
    case 'sojourner':
      return <Sojourner />
    case 'mer':
      return <MerRover variant={variant} />
    case 'viking':
      return <VikingLander variant={variant} />
    case 'phoenix':
      return <PhoenixLander />
    case 'insight':
      return <InSightLander />
    case 'ingenuity':
      return <IngenuityHelicopter />
    case 'deep-existing':
      return null
  }
}
