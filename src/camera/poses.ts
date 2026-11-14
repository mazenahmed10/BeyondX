import type { Vector3Tuple } from 'three'
import { PLANETS, type PlanetId } from '../planets/planetConfig'

export interface CameraPose {
  position: Vector3Tuple
  target: Vector3Tuple
}

export const HUB_POSE: CameraPose = {
  position: [0, 0.35, 10.5],
  target: [0, -0.1, 0],
}

/** Camera framing for the chosen planet (Planet View entry pose). */
export function planetViewPose(id: PlanetId): CameraPose {
  const p = PLANETS[id]
  return {
    position: [p.position[0] * 0.55, p.position[1] + 0.35, p.position[2] + p.radius * 4.1],
    target: [p.position[0], p.position[1], p.position[2]],
  }
}

/** High arrival pose just after the cross-fade: the camera then glides down to ground level. */
export const SURFACE_HIGH_POSE: Record<PlanetId, CameraPose> = {
  moon: { position: [6, 46, 70], target: [0, 0, 0] },
  mars: { position: [6, 46, 70], target: [0, 0, 0] },
}

/** Ground-level exploration start (x/z only are authoritative; y is resolved against the terrain). */
export const SURFACE_GROUND_POSE: Record<PlanetId, CameraPose> = {
  moon: { position: [4, 3.2, 26], target: [0, 1.6, 0] },
  mars: { position: [4, 3.4, 26], target: [0, 2.2, 0] },
}
