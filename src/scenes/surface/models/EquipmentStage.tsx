import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, MeshBasicMaterial, MeshStandardMaterial, type Group, type Material, type Mesh, type Object3D } from 'three'
import type { ModelKind } from '../../../data/stories'
import { EquipmentModel } from './EquipmentModel'

const SILHOUETTE = new MeshBasicMaterial({ color: '#06080d' })
const isMesh = (o: Object3D): o is Mesh => (o as Mesh).isMesh === true

interface Props {
  kind: ModelKind
  variant?: string
  scale: number
  /** Mystery state: the model is shown as a dark, unlit shape. */
  silhouette: boolean
  /** Name of the part to make glow, or null. */
  highlight: string | null
  highlightColor: string
  /** Changes when this object has just been revealed: plays the reveal pop + ring. */
  revealTick: number
}

/**
 * Wraps a model with the three story looks: silhouette (mystery), normal, and part highlight.
 * Shared materials are never mutated: silhouette swaps in one shared unlit material, highlight
 * works on per-mesh clones that are disposed when the highlight ends.
 */
export function EquipmentStage({ kind, variant, scale, silhouette, highlight, highlightColor, revealTick }: Props) {
  const root = useRef<Group>(null)
  const ring = useRef<Mesh>(null)
  const glowing = useRef<MeshStandardMaterial[]>([])
  const revealAt = useRef<number | null>(null)
  const firstTick = useRef(revealTick)

  useLayoutEffect(() => {
    const group = root.current
    if (!group) return
    const original = new Map<Mesh, Material | Material[]>()
    const clones: MeshStandardMaterial[] = []

    if (silhouette) {
      group.traverse((o) => {
        if (!isMesh(o)) return
        original.set(o, o.material)
        o.material = SILHOUETTE
      })
    } else if (highlight) {
      const parts: Object3D[] = []
      group.traverse((o) => {
        if (o.name === highlight) parts.push(o)
      })
      for (const part of parts) {
        part.traverse((o) => {
          if (!isMesh(o) || Array.isArray(o.material)) return
          const base = o.material
          if (!(base instanceof MeshStandardMaterial)) return
          const clone = base.clone()
          clone.emissive = new Color(highlightColor)
          clone.emissiveIntensity = 0.6
          original.set(o, base)
          o.material = clone
          clones.push(clone)
        })
      }
    }
    glowing.current = clones
    return () => {
      original.forEach((mat, mesh) => {
        mesh.material = mat
      })
      clones.forEach((c) => c.dispose())
      glowing.current = []
    }
  }, [silhouette, highlight, highlightColor, kind, variant])

  useLayoutEffect(() => {
    if (revealTick !== firstTick.current) revealAt.current = -1 // start on next frame
  }, [revealTick])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (glowing.current.length) {
      const k = 0.45 + (Math.sin(t * 4) * 0.5 + 0.5) * 0.75
      for (const m of glowing.current) m.emissiveIntensity = k
    }
    if (revealAt.current !== null) {
      if (revealAt.current < 0) revealAt.current = t
      const p = Math.min(1, (t - revealAt.current) / 1.4)
      // overshoot pop
      const pop = 1 + Math.sin(Math.min(1, p * 1.6) * Math.PI) * 0.09
      root.current?.scale.setScalar(scale * pop)
      if (ring.current) {
        ring.current.visible = p < 1
        ring.current.scale.setScalar(1 + p * 9)
        ;(ring.current.material as MeshBasicMaterial).opacity = (1 - p) * 0.8
      }
      if (p >= 1) {
        revealAt.current = null
        root.current?.scale.setScalar(scale)
      }
    }
  })

  return (
    <>
      <group ref={root} scale={scale}>
        <EquipmentModel kind={kind} variant={variant} />
      </group>
      <mesh ref={ring} visible={false} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
        <ringGeometry args={[0.9, 1.0, 48]} />
        <meshBasicMaterial color={highlightColor} transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  )
}
