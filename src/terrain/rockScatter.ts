import { DodecahedronGeometry, IcosahedronGeometry, Matrix4, Quaternion, Vector3, Euler, Color, type BufferGeometry } from 'three'
import { fbm3, valueNoise3 } from '../utils/noise'
import type { PlanetId } from '../planets/planetConfig'
import { TERRAIN_SIZE, type HeightFn } from './proceduralTerrain'

function rng(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Irregular rock geometry. Jitter is a function of position so shared vertices stay joined. */
export function createRockGeometry(planet: PlanetId): BufferGeometry {
  const g = planet === 'moon' ? new IcosahedronGeometry(1, 2) : new DodecahedronGeometry(1, 1)
  const pos = g.attributes.position
  const freq = planet === 'moon' ? 1.7 : 1.3
  const gain = planet === 'moon' ? 0.38 : 0.55
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const k = 1 + (valueNoise3(x * freq + 3.1, y * freq + 1.7, z * freq + 5.3, 7) - 0.5) * 2 * gain
    pos.setXYZ(i, x * k, y * k * 0.72, z * k)
  }
  g.computeVertexNormals()
  return g
}

export interface RockInstance {
  matrix: Matrix4
  color: Color
}

/** Circles (x, z, radius) that must stay free of boulders, e.g. around surface equipment. */
export type KeepOut = readonly (readonly [number, number, number])[]

export function scatterRocks(planet: PlanetId, heightAt: HeightFn, count: number, keepOut: KeepOut = []): RockInstance[] {
  const rand = rng(planet === 'moon' ? 1969 : 1976)
  const half = TERRAIN_SIZE / 2 - 6
  const out: RockInstance[] = []
  const q = new Quaternion()
  const e = new Euler()
  const p = new Vector3()
  const s = new Vector3()
  let guard = 0
  while (out.length < count && guard++ < count * 6) {
    const x = (rand() * 2 - 1) * half
    const z = (rand() * 2 - 1) * half
    const dist = Math.hypot(x, z)
    if (dist < 7) continue // keep the arrival area open
    if (keepOut.some(([kx, kz, kr]) => Math.hypot(x - kx, z - kz) < kr)) continue // keep equipment sites clear
    // clustered: boulders prefer patches where a low-frequency field is high
    const cluster = fbm3(x * 0.05, 7.7, z * 0.05, 3, 91)
    if (rand() > 0.25 + cluster * 1.1) continue
    const size = 0.14 + Math.pow(rand(), 3.2) * (planet === 'moon' ? 1.7 : 2.1)
    const y = heightAt(x, z) + size * 0.18
    e.set(rand() * 0.6, rand() * Math.PI * 2, rand() * 0.6)
    q.setFromEuler(e)
    p.set(x, y, z)
    s.set(size * (0.8 + rand() * 0.6), size * (0.7 + rand() * 0.5), size * (0.8 + rand() * 0.6))
    const m = new Matrix4().compose(p, q, s)
    const tone = 0.7 + rand() * 0.5
    const color = planet === 'moon' ? new Color(0.5 * tone, 0.5 * tone, 0.49 * tone) : new Color(0.42 * tone, 0.2 * tone, 0.12 * tone)
    out.push({ matrix: m, color })
  }
  return out
}
