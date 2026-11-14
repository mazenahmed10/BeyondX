import { BufferAttribute, CanvasTexture, Color, PlaneGeometry, RepeatWrapping } from 'three'
import { craters3, fbm3, tileFbm2 } from '../utils/noise'
import type { PlanetId } from '../planets/planetConfig'

export const TERRAIN_SIZE = 200
const SEGMENTS = 280

export type HeightFn = (x: number, z: number) => number

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** Rim hills + a calm centre so the arrival area is readable and ready for landmarks. */
function frame(x: number, z: number, h: number): number {
  const half = TERRAIN_SIZE / 2
  const r = Math.hypot(x, z) / half
  const edge = smoothstep(0.62, 1.0, r) * 20
  const centre = mix(0.4, 1, smoothstep(8, 38, Math.hypot(x, z)))
  return h * centre + edge
}

export function moonHeight(x: number, z: number): number {
  const broad = (fbm3(x * 0.012, 0.5, z * 0.012, 4, 5) - 0.5) * 16
  const rolling = (fbm3(x * 0.06, 1.7, z * 0.06, 4, 9) - 0.5) * 2.4
  const bigCraters = craters3(x, 0.37, z, 0.045, 101, 15)
  const smallCraters = craters3(x, 0.61, z, 0.13, 202, 4.5)
  const tinyCraters = craters3(x, 0.52, z, 0.34, 404, 1.1)
  const fine = (fbm3(x * 0.45, 3.1, z * 0.45, 3, 13) - 0.5) * 0.4
  return frame(x, z, broad + rolling + bigCraters + smallCraters + tinyCraters + fine)
}

function marsRaw(x: number, z: number): number {
  const broad = fbm3(x * 0.01, 0.8, z * 0.01, 5, 7) * 24
  const ridgeN = fbm3(x * 0.022, 2.4, z * 0.022, 4, 31)
  const ridged = Math.pow(1 - Math.abs(2 * ridgeN - 1), 2) * 8
  const h0 = broad + ridged
  // Terraces: stepped strata on mid/high ground, smooth plains below.
  const step = 2.6
  const t = h0 / step
  const fl = Math.floor(t)
  const fr = t - fl
  const stepped = (fl + smoothstep(0.5, 0.92, fr)) * step
  const mask = smoothstep(4, 14, h0) * 0.75
  let h = mix(h0, stepped, mask)
  // Wind-formed ripples on the lowlands.
  const ripple = Math.sin(x * 0.42 + fbm3(x * 0.03, 5.5, z * 0.03, 3, 3) * 9) * 0.28
  h += ripple * (1 - mask)
  h += craters3(x, 0.44, z, 0.06, 303, 7)
  h += (fbm3(x * 0.5, 3.7, z * 0.5, 3, 17) - 0.5) * 0.45
  return h
}

const MARS_ORIGIN = marsRaw(0, 0)

/** Heights are relative to the arrival point, so the start area sits at y ≈ 0. */
export function marsHeight(x: number, z: number): number {
  return frame(x, z, marsRaw(x, z) - MARS_ORIGIN)
}

export interface TerrainBundle {
  geometry: PlaneGeometry
  heightAt: HeightFn
  detailBump: CanvasTexture
}

function createDetailBump(planet: PlanetId): CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(size, size)
  const octaves = planet === 'moon' ? 5 : 4
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v = tileFbm2(x / size, y / size, octaves, planet === 'moon' ? 77 : 99)
      const i = (y * size + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = RepeatWrapping
  tex.repeat.set(36, 36)
  tex.anisotropy = 8
  return tex
}

export function createTerrain(planet: PlanetId): TerrainBundle {
  const heightAt = planet === 'moon' ? moonHeight : marsHeight
  const geometry = new PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, SEGMENTS, SEGMENTS)
  geometry.rotateX(-Math.PI / 2)
  const pos = geometry.attributes.position as BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)))
  }
  geometry.computeVertexNormals()

  // Vertex colours: albedo variation + steeper ground reads rockier/darker.
  const nrm = geometry.attributes.normal as BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const c = new Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const slope = 1 - nrm.getY(i)
    const grain = fbm3(x * 0.18, 9.1, z * 0.18, 3, 55)
    const patch = fbm3(x * 0.03, 4.2, z * 0.03, 3, 66)
    if (planet === 'moon') {
      const l = 0.5 + (grain - 0.5) * 0.22 + (patch - 0.5) * 0.18 - slope * 0.45
      c.setRGB(l * 1.02, l, l * 0.97)
    } else {
      const high = smoothstep(2, 16, y)
      const lowland = new Color(0.66, 0.37, 0.21)
      const upland = new Color(0.43, 0.22, 0.14)
      c.copy(lowland).lerp(upland, clamp01(high * 0.8 + (patch - 0.5) * 0.9))
      const l = 0.92 + (grain - 0.5) * 0.3 - slope * 0.5
      c.multiplyScalar(l)
      c.lerp(new Color(0.78, 0.55, 0.34), clamp01(slope * 1.6) * 0.25)
    }
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  return { geometry, heightAt, detailBump: createDetailBump(planet) }
}
