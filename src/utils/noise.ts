/** Small deterministic 3D value-noise toolkit used by the procedural textures. */

function hash3(x: number, y: number, z: number, seed: number): number {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647) ^ Math.imul(seed, 1274126177)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967295
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function valueNoise3(x: number, y: number, z: number, seed = 0): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = smooth(x - ix)
  const fy = smooth(y - iy)
  const fz = smooth(z - iz)
  const c000 = hash3(ix, iy, iz, seed)
  const c100 = hash3(ix + 1, iy, iz, seed)
  const c010 = hash3(ix, iy + 1, iz, seed)
  const c110 = hash3(ix + 1, iy + 1, iz, seed)
  const c001 = hash3(ix, iy, iz + 1, seed)
  const c101 = hash3(ix + 1, iy, iz + 1, seed)
  const c011 = hash3(ix, iy + 1, iz + 1, seed)
  const c111 = hash3(ix + 1, iy + 1, iz + 1, seed)
  return lerp(
    lerp(lerp(c000, c100, fx), lerp(c010, c110, fx), fy),
    lerp(lerp(c001, c101, fx), lerp(c011, c111, fx), fy),
    fz,
  )
}

/** Fractional Brownian motion, output roughly in [0, 1]. */
export function fbm3(x: number, y: number, z: number, octaves = 5, seed = 0): number {
  let amp = 0.5
  let freq = 1
  let sum = 0
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise3(x * freq, y * freq, z * freq, seed + i * 31)
    norm += amp
    amp *= 0.5
    freq *= 2.03
  }
  return sum / norm
}

/**
 * Cell-based craters with a smooth bowl + raised rim profile.
 * Returns a signed height contribution (negative inside bowls).
 */
export function craters3(x: number, y: number, z: number, scale: number, seed: number, depth = 1): number {
  const sx = x * scale
  const sy = y * scale
  const sz = z * scale
  const ix = Math.floor(sx)
  const iy = Math.floor(sy)
  const iz = Math.floor(sz)
  let h = 0
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        const cx = ix + dx
        const cy = iy + dy
        const cz = iz + dz
        if (hash3(cx, cy, cz, seed) > 0.5) continue
        const px = cx + 0.2 + 0.6 * hash3(cx, cy, cz, seed + 1)
        const py = cy + 0.2 + 0.6 * hash3(cx, cy, cz, seed + 2)
        const pz = cz + 0.2 + 0.6 * hash3(cx, cy, cz, seed + 3)
        const radius = 0.16 + 0.26 * hash3(cx, cy, cz, seed + 4)
        const d = Math.hypot(sx - px, sy - py, sz - pz)
        const t = d / radius
        if (t > 2) continue
        const bowl = t < 1 ? (t * t - 1) * 0.5 : 0
        const rim = 0.22 * Math.exp(-(((t - 1) / 0.22) ** 2))
        h += (bowl + rim) * depth
      }
    }
  }
  return h
}

function tileHash(ix: number, iy: number, period: number, seed: number): number {
  const x = ((ix % period) + period) % period
  const y = ((iy % period) + period) % period
  return hash3(x, y, 0, seed)
}

/** Seamlessly tileable 2D fbm over u,v in [0,1). Base period 8, doubling per octave. */
export function tileFbm2(u: number, v: number, octaves = 4, seed = 0): number {
  let amp = 0.5
  let period = 8
  let sum = 0
  let norm = 0
  for (let o = 0; o < octaves; o++) {
    const x = u * period
    const y = v * period
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const fx = smooth(x - ix)
    const fy = smooth(y - iy)
    const s = seed + o * 17
    const a = lerp(tileHash(ix, iy, period, s), tileHash(ix + 1, iy, period, s), fx)
    const b = lerp(tileHash(ix, iy + 1, period, s), tileHash(ix + 1, iy + 1, period, s), fx)
    sum += amp * lerp(a, b, fy)
    norm += amp
    amp *= 0.5
    period *= 2
  }
  return sum / norm
}
