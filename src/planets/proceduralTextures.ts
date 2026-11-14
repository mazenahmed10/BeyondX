import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three'
import { craters3, fbm3 } from '../utils/noise'

export interface PlanetTextures {
  map: Texture
  bump: Texture
}

const WIDTH = 1024
const HEIGHT = 512

type Sampler = (x: number, y: number, z: number) => { height: number; r: number; g: number; b: number }

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const mix = (a: number, b: number, t: number) => a + (b - a) * t

export function bake(sample: Sampler): PlanetTextures {
  const colorCanvas = document.createElement('canvas')
  const bumpCanvas = document.createElement('canvas')
  colorCanvas.width = bumpCanvas.width = WIDTH
  colorCanvas.height = bumpCanvas.height = HEIGHT
  const cctx = colorCanvas.getContext('2d')!
  const bctx = bumpCanvas.getContext('2d')!
  const cimg = cctx.createImageData(WIDTH, HEIGHT)
  const bimg = bctx.createImageData(WIDTH, HEIGHT)

  for (let py = 0; py < HEIGHT; py++) {
    const lat = (0.5 - (py + 0.5) / HEIGHT) * Math.PI
    const cl = Math.cos(lat)
    const y = Math.sin(lat)
    for (let px = 0; px < WIDTH; px++) {
      const lon = ((px + 0.5) / WIDTH) * Math.PI * 2
      // Sampling on the unit sphere avoids the seam and pole stretching of 2D noise.
      const s = sample(cl * Math.cos(lon), y, cl * Math.sin(lon))
      const i = (py * WIDTH + px) * 4
      cimg.data[i] = clamp01(s.r) * 255
      cimg.data[i + 1] = clamp01(s.g) * 255
      cimg.data[i + 2] = clamp01(s.b) * 255
      cimg.data[i + 3] = 255
      const hv = clamp01(s.height) * 255
      bimg.data[i] = bimg.data[i + 1] = bimg.data[i + 2] = hv
      bimg.data[i + 3] = 255
    }
  }
  cctx.putImageData(cimg, 0, 0)
  bctx.putImageData(bimg, 0, 0)

  const map = new CanvasTexture(colorCanvas)
  map.colorSpace = SRGBColorSpace
  map.wrapS = RepeatWrapping
  map.anisotropy = 8
  const bump = new CanvasTexture(bumpCanvas)
  bump.wrapS = RepeatWrapping
  return { map, bump }
}

/**
 * Stylised stand-in for a NASA global mosaic: gray regolith, darker low-albedo
 * plains and impact craters. Replace with a real NASA texture in /public/assets/textures.
 */
export function createMoonTextures(): PlanetTextures {
  return bake((x, y, z) => {
    const broad = fbm3(x * 2.2, y * 2.2, z * 2.2, 4, 11)
    const fine = fbm3(x * 14, y * 14, z * 14, 4, 23)
    const cr = craters3(x, y, z, 7, 101, 1) * 0.7 + craters3(x, y, z, 19, 202, 1) * 0.45
    const plains = clamp01((broad - 0.5) * 3.2)
    const height = 0.5 + cr * 0.45 + (fine - 0.5) * 0.18 - plains * 0.05
    const albedo = mix(0.62, 0.3, plains) + (fine - 0.5) * 0.14 + cr * 0.16
    const warm = 0.012
    return { height, r: albedo + warm, g: albedo, b: albedo - warm }
  })
}

/**
 * Stylised stand-in for a Mars global mosaic: butterscotch bright terrain with
 * dark low-albedo regions. Replace with a real NASA texture when available.
 */
export function createMarsTextures(): PlanetTextures {
  return bake((x, y, z) => {
    const broad = fbm3(x * 1.8, y * 1.8, z * 1.8, 5, 7)
    const mid = fbm3(x * 6, y * 6, z * 6, 5, 19)
    const fine = fbm3(x * 22, y * 22, z * 22, 3, 41)
    const cr = craters3(x, y, z, 9, 303, 1) * 0.5
    const dark = clamp01((broad - 0.46) * 3.4)
    const height = 0.5 + (mid - 0.5) * 0.5 + cr * 0.35 + (fine - 0.5) * 0.1
    const lum = 0.9 + (fine - 0.5) * 0.25 + (mid - 0.5) * 0.3 + cr * 0.2
    const r = mix(0.78, 0.36, dark) * lum
    const g = mix(0.45, 0.19, dark) * lum
    const b = mix(0.26, 0.11, dark) * lum
    // polar caps (visual only, not to scale)
    const cap = clamp01((Math.abs(y) - 0.93) * 18)
    return { height, r: mix(r, 0.92, cap), g: mix(g, 0.9, cap), b: mix(b, 0.88, cap) }
  })
}

/** Ceres stand-in: dark, neutral-gray, heavily cratered. Visual placeholder, not a NASA mosaic. */
export function createCeresTextures(): PlanetTextures {
  return bake((x, y, z) => {
    const broad = fbm3(x * 2.4, y * 2.4, z * 2.4, 4, 13)
    const fine = fbm3(x * 16, y * 16, z * 16, 4, 29)
    const cr = craters3(x, y, z, 6, 701, 1) * 0.7 + craters3(x, y, z, 15, 802, 1) * 0.5 + craters3(x, y, z, 32, 903, 1) * 0.3
    const l = 0.3 + (broad - 0.5) * 0.12 + (fine - 0.5) * 0.12 + cr * 0.14
    return { height: 0.5 + cr * 0.5 + (fine - 0.5) * 0.15, r: l * 1.02, g: l, b: l * 0.96 }
  })
}

/** Earth stand-in used only as a visual reference object in the Kepler scene. */
export function createEarthTextures(): PlanetTextures {
  return bake((x, y, z) => {
    const land = fbm3(x * 2.1, y * 2.1, z * 2.1, 5, 3)
    const cloud = fbm3(x * 3.4 + 9, y * 3.4, z * 3.4, 4, 5)
    const isLand = land > 0.54
    let r = isLand ? 0.22 : 0.03
    let g = isLand ? 0.36 : 0.16
    let b = isLand ? 0.18 : 0.42
    const c = clamp01((cloud - 0.5) * 3.2) * 0.85
    r = mix(r, 0.95, c)
    g = mix(g, 0.96, c)
    b = mix(b, 0.98, c)
    return { height: isLand ? 0.6 : 0.4, r, g, b }
  })
}

/** Banded gas-giant stand-in. kind selects the palette. Illustrative only. */
export function createGasGiantTexture(kind: 'jupiter' | 'saturn'): Texture {
  const w = 512
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(w, h)
  for (let py = 0; py < h; py++) {
    const lat = (py / h) * 2 - 1
    const band = fbm3(lat * 9, 0.5, 0.5, 3, kind === 'jupiter' ? 5 : 9)
    for (let px = 0; px < w; px++) {
      const turb = fbm3(px * 0.02, py * 0.06, 2.2, 3, 21) - 0.5
      const t = clamp01(band + turb * 0.35)
      const i = (py * w + px) * 4
      if (kind === 'jupiter') {
        img.data[i] = mix(150, 235, t)
        img.data[i + 1] = mix(100, 205, t)
        img.data[i + 2] = mix(70, 170, t)
      } else {
        img.data[i] = mix(180, 238, t)
        img.data[i + 1] = mix(150, 214, t)
        img.data[i + 2] = mix(100, 160, t)
      }
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return tex
}
