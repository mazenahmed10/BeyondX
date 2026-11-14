import { useMemo, type ReactNode } from 'react'
import { DoubleSide, MeshBasicMaterial, MeshStandardMaterial, Quaternion, Vector3, type Material } from 'three'

export type V3 = [number, number, number]

/** Shared materials for all surface equipment (never mutated; highlights work on clones). */
export const M = {
  goldFoil: new MeshStandardMaterial({ color: '#c8963a', metalness: 0.9, roughness: 0.42 }),
  kapton: new MeshStandardMaterial({ color: '#d9a441', metalness: 0.7, roughness: 0.5 }),
  white: new MeshStandardMaterial({ color: '#e4e2da', metalness: 0.15, roughness: 0.6, side: DoubleSide }),
  silver: new MeshStandardMaterial({ color: '#b9bcc0', metalness: 0.85, roughness: 0.35, side: DoubleSide }),
  alu: new MeshStandardMaterial({ color: '#8d9197', metalness: 0.8, roughness: 0.45 }),
  dark: new MeshStandardMaterial({ color: '#1d1f24', metalness: 0.5, roughness: 0.6 }),
  black: new MeshStandardMaterial({ color: '#0c0d10', metalness: 0.2, roughness: 0.85 }),
  solar: new MeshStandardMaterial({ color: '#172a66', metalness: 0.6, roughness: 0.3, emissive: '#070f2c', emissiveIntensity: 0.5, side: DoubleSide }),
  solarDusty: new MeshStandardMaterial({ color: '#6b4a3a', metalness: 0.25, roughness: 0.8, side: DoubleSide }),
  orange: new MeshStandardMaterial({ color: '#b8662e', metalness: 0.1, roughness: 0.8, side: DoubleSide }),
  tan: new MeshStandardMaterial({ color: '#b9a37c', metalness: 0, roughness: 0.9, side: DoubleSide }),
  paper: new MeshStandardMaterial({ color: '#efe6c8', metalness: 0, roughness: 0.95, side: DoubleSide }),
  tape: new MeshStandardMaterial({ color: '#9a9d9f', metalness: 0.3, roughness: 0.7, side: DoubleSide }),
  ice: new MeshStandardMaterial({ color: '#f4f8ff', metalness: 0, roughness: 0.35, emissive: '#9fb6d8', emissiveIntensity: 0.25 }),
  trench: new MeshStandardMaterial({ color: '#3a2015', metalness: 0, roughness: 1 }),
  scorch: new MeshStandardMaterial({ color: '#2b2a29', metalness: 0, roughness: 1 }),
  wire: new MeshBasicMaterial({ color: '#a9adb3', wireframe: true }),
  goldWire: new MeshBasicMaterial({ color: '#d8b35a', wireframe: true }),
} satisfies Record<string, Material>

interface Common {
  p?: V3
  r?: V3
  m: Material
  name?: string
  /** Small parts skip the shadow pass to keep draw calls down. */
  shadow?: boolean
}

export function Box({ s, p, r, m, name, shadow = true }: Common & { s: V3 }) {
  return (
    <mesh name={name} position={p} rotation={r} material={m} castShadow={shadow}>
      <boxGeometry args={s} />
    </mesh>
  )
}

export function Cyl({ rt, rb, h, seg = 14, p, r, m, name, shadow = true, open = false }: Common & { rt: number; rb?: number; h: number; seg?: number; open?: boolean }) {
  return (
    <mesh name={name} position={p} rotation={r} material={m} castShadow={shadow}>
      <cylinderGeometry args={[rt, rb ?? rt, h, seg, 1, open]} />
    </mesh>
  )
}

export function Ball({ rad, p, m, name, shadow = true, scale }: Common & { rad: number; scale?: V3 }) {
  return (
    <mesh name={name} position={p} material={m} castShadow={shadow} scale={scale}>
      <sphereGeometry args={[rad, 16, 12]} />
    </mesh>
  )
}

const UP = new Vector3(0, 1, 0)

/** A thin tube between two points (legs, booms, struts, cables). */
export function Strut({ a, b, rad = 0.04, m = M.alu, shadow = false, seg = 6 }: { a: V3; b: V3; rad?: number; m?: Material; shadow?: boolean; seg?: number }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new Vector3(...a)
    const vb = new Vector3(...b)
    const dir = vb.clone().sub(va)
    const len = dir.length()
    return { pos: va.add(vb).multiplyScalar(0.5), quat: new Quaternion().setFromUnitVectors(UP, dir.normalize()), len }
  }, [a, b])
  return (
    <mesh position={pos} quaternion={quat} material={m} castShadow={shadow}>
      <cylinderGeometry args={[rad, rad, len, seg]} />
    </mesh>
  )
}

/** Named sub-assembly. The story layer highlights parts by this name. */
export function Part({ name, children, p, r }: { name: string; children: ReactNode; p?: V3; r?: V3 }) {
  return (
    <group name={name} position={p} rotation={r}>
      {children}
    </group>
  )
}

/** n copies of children, rotated evenly around the vertical axis. */
export function Radial({ n, offset = 0, children }: { n: number; offset?: number; children: ReactNode }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <group key={i} rotation={[0, offset + (i / n) * Math.PI * 2, 0]}>
          {children}
        </group>
      ))}
    </>
  )
}

/** Flat cable lying on the ground from the origin to a point. */
export function Cable({ to, from = [0, 0, 0] }: { to: V3; from?: V3 }) {
  return <Strut a={[from[0], 0.03, from[2]]} b={[to[0], 0.03, to[2]]} rad={0.025} m={M.tan} seg={4} />
}
