import type { Vector3Tuple } from 'three'
import type { EnvironmentId } from '../../data/missions'
import { craters3, fbm3 } from '../../utils/noise'
import type { CameraPose } from '../../camera/poses'

export type SpacecraftKind = 'dawn' | 'near' | 'pioneer' | 'kepler'

export const SPACECRAFT_FOR_ENV: Record<EnvironmentId, SpacecraftKind> = {
  'dawn-ceres': 'dawn',
  'near-eros': 'near',
  'pioneer-10': 'pioneer',
  'pioneer-11': 'pioneer',
  kepler: 'kepler',
}

export interface EnvConfig {
  overview: CameraPose
  focus: CameraPose
  /** Orbit limits (distance from the camera target). */
  minDistance: number
  maxDistance: number
  /** Free-camera playground: target may not leave this sphere. */
  center: Vector3Tuple
  radius: number
  /** Honest-labelling text shown in the mission overlay. */
  notice: string
}

const add = (a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: Vector3Tuple, s: number): Vector3Tuple => [a[0] * s, a[1] * s, a[2] * s]
const unit = (a: Vector3Tuple): Vector3Tuple => {
  const l = Math.hypot(...a) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

// ---------------- Dawn / Ceres ----------------
export const CERES_RADIUS = 3
export const DAWN_ORBIT = { radius: 5.6, tilt: 0.45, angle: 0.75 }

export function orbitPoint(radius: number, tilt: number, angle: number): Vector3Tuple {
  const x = radius * Math.cos(angle)
  const z = radius * Math.sin(angle)
  return [x, -z * Math.sin(tilt), z * Math.cos(tilt)]
}
export const DAWN_POSITION = orbitPoint(DAWN_ORBIT.radius, DAWN_ORBIT.tilt, DAWN_ORBIT.angle)

// ---------------- NEAR / Eros ----------------
export const EROS_AXES: Vector3Tuple = [4.2, 1.7, 1.5]

/** Surface point of the visual Eros model for a direction (shared by the mesh and the lander placement). */
export function erosDisplacement(dx: number, dy: number, dz: number): number {
  return (
    1 +
    (fbm3(dx * 2.2 + 5, dy * 2.2, dz * 2.2, 3, 77) - 0.5) * 0.3 +
    craters3(dx, dy, dz, 3.4, 505, 0.07) +
    craters3(dx, dy, dz, 8.5, 606, 0.03)
  )
}
export function erosSurface(dir: Vector3Tuple): { position: Vector3Tuple; normal: Vector3Tuple } {
  const [dx, dy, dz] = unit(dir)
  const d = erosDisplacement(dx, dy, dz)
  return {
    position: [dx * EROS_AXES[0] * d, dy * EROS_AXES[1] * d, dz * EROS_AXES[2] * d],
    normal: unit([dx / EROS_AXES[0], dy / EROS_AXES[1], dz / EROS_AXES[2]]),
  }
}
export const NEAR_SITE = erosSurface([0.3, 0.92, 0.25])

// ---------------- Kepler ----------------
export const KEPLER_SCENE = { earthRadius: 16, keplerRadius: 17.8, earthAngle: 0.2, keplerAngle: -0.28 }
export function keplerOrbitPoint(radius: number, angle: number): Vector3Tuple {
  return [radius * Math.cos(angle), 0, -radius * Math.sin(angle)]
}
export const EARTH_POSITION = keplerOrbitPoint(KEPLER_SCENE.earthRadius, KEPLER_SCENE.earthAngle)
export const KEPLER_POSITION = keplerOrbitPoint(KEPLER_SCENE.keplerRadius, KEPLER_SCENE.keplerAngle)

// ---------------- Pioneer ----------------
export const PIONEER_POSITION: Vector3Tuple = [0, 0, 0]

const dawnOut = unit(DAWN_POSITION)
const nearOut = NEAR_SITE.normal
const keplerOut = unit(KEPLER_POSITION)

export const ENVIRONMENTS: Record<EnvironmentId, EnvConfig> = {
  'dawn-ceres': {
    overview: { position: [0, 5.5, 17], target: [0, 0, 0] },
    focus: {
      position: add(DAWN_POSITION, add(scale(dawnOut, 3.4), [0, 1.3, 0])),
      target: DAWN_POSITION,
    },
    minDistance: 1.4,
    maxDistance: 34,
    center: [0, 0, 0],
    radius: 9,
    notice: 'REPRESENTATIVE ORBIT AND SCALE — NOT THE REAL ORBITAL PATH',
  },
  'near-eros': {
    overview: { position: [0, 3.6, 13.5], target: [0, 0, 0] },
    focus: {
      position: add(NEAR_SITE.position, add(scale(nearOut, 1.9), [1.1, 0.2, 1.4])),
      target: NEAR_SITE.position,
    },
    minDistance: 0.9,
    maxDistance: 30,
    center: [0, 0, 0],
    radius: 6,
    notice: 'ASTEROID SHAPE AND LANDER PLACEMENT ARE ILLUSTRATIVE — NOT TO SCALE',
  },
  'pioneer-10': {
    overview: { position: [5.2, 2.4, 8], target: [0, 0, 0] },
    focus: { position: [2.6, 1.1, 3.6], target: [0, 0, 0] },
    minDistance: 1.6,
    maxDistance: 70,
    center: [0, 0, 0],
    radius: 30,
    notice: 'VISUALIZATION — NOT TO SCALE. TRAJECTORY IS ILLUSTRATIVE, NOT A MEASURED PATH',
  },
  'pioneer-11': {
    overview: { position: [5.2, 2.4, 8], target: [0, 0, 0] },
    focus: { position: [2.6, 1.1, 3.6], target: [0, 0, 0] },
    minDistance: 1.6,
    maxDistance: 70,
    center: [0, 0, 0],
    radius: 30,
    notice: 'VISUALIZATION — NOT TO SCALE. TRAJECTORY IS ILLUSTRATIVE, NOT A MEASURED PATH',
  },
  kepler: {
    overview: { position: [4, 24, 40], target: [8, 0, -3] },
    focus: {
      position: add(KEPLER_POSITION, add(scale(keplerOut, 3.4), [1.2, 1.8, 1.6])),
      target: KEPLER_POSITION,
    },
    minDistance: 1.4,
    maxDistance: 80,
    center: [8, 0, -3],
    radius: 28,
    notice: 'VISUALIZATION — NOT TO SCALE. ORBIT SIZES AND SPACING ARE ILLUSTRATIVE',
  },
}

/** Deep Space Hub: mission models stand in an arc. Camera distance adapts to the screen aspect. */
export const DEEP_HUB_SLOTS: Vector3Tuple[] = [
  [-9.2, 0, -1.4],
  [-4.6, 0, -0.4],
  [0, 0, 0],
  [4.6, 0, -0.4],
  [9.2, 0, -1.4],
]

export function deepHubPose(aspect: number): CameraPose {
  const z = 19 * Math.max(1, 1.78 / Math.max(aspect, 0.4)) ** 0.9
  return { position: [0, 1.6, Math.min(z, 46)], target: [0, -1.5, 0] }
}
export const DEEP_HUB_LIMITS = { min: 8, max: 52, center: [0, -1.5, 0] as Vector3Tuple, radius: 8 }
