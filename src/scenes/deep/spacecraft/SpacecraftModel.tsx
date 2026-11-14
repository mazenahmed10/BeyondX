import type { SpacecraftKind } from '../environments'
import { DawnModel } from './DawnModel'
import { KeplerModel } from './KeplerModel'
import { NearModel } from './NearModel'
import { PioneerModel } from './PioneerModel'

export function SpacecraftModel({ kind }: { kind: SpacecraftKind }) {
  switch (kind) {
    case 'dawn':
      return <DawnModel />
    case 'near':
      return <NearModel />
    case 'pioneer':
      return <PioneerModel />
    case 'kepler':
      return <KeplerModel />
  }
}
