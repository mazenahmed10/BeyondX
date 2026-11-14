import { DoubleSide, LatheGeometry, MeshStandardMaterial, Vector2 } from 'three'

/** Shared materials: spacecraft are small and numerous, so we reuse them everywhere. */
export const foil = new MeshStandardMaterial({ color: '#b98a3c', metalness: 0.85, roughness: 0.38 })
export const panel = new MeshStandardMaterial({
  color: '#1c2f66',
  metalness: 0.55,
  roughness: 0.32,
  emissive: '#0a1430',
  emissiveIntensity: 0.6,
  side: DoubleSide,
})
export const white = new MeshStandardMaterial({ color: '#dcdcd6', metalness: 0.25, roughness: 0.5, side: DoubleSide })
export const dark = new MeshStandardMaterial({ color: '#23252a', metalness: 0.6, roughness: 0.5 })
export const metal = new MeshStandardMaterial({ color: '#8a8b8c', metalness: 0.85, roughness: 0.4 })

/** Paraboloid dish; opening faces +Y. */
export function dishGeometry(radius: number, depth: number): LatheGeometry {
  const pts: Vector2[] = []
  const steps = 18
  for (let i = 0; i <= steps; i++) {
    const r = (i / steps) * radius
    pts.push(new Vector2(r, depth * (r / radius) ** 2))
  }
  return new LatheGeometry(pts, 40)
}
