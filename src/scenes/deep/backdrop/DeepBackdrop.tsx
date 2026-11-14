import { CosmicDust } from './CosmicDust'
import { NebulaSphere } from './NebulaSphere'
import { ShootingStars } from './ShootingStars'

interface Props {
  colorA?: string
  colorB?: string
  strength?: number
  dust?: boolean
}

/** Full deep-space backdrop: nebula + dust + meteors (stars come from the shared Starfield). */
export function DeepBackdrop({ colorA, colorB, strength, dust = true }: Props) {
  return (
    <>
      <NebulaSphere colorA={colorA} colorB={colorB} strength={strength} />
      {dust && <CosmicDust />}
      <ShootingStars />
    </>
  )
}
