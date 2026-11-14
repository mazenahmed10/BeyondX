import { useEffect, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group, type Mesh } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '../app/store'
import { PLANETS, type PlanetId } from './planetConfig'
import type { PlanetTextures } from './proceduralTextures'

interface PlanetGlobeProps {
  id: PlanetId
  textures: PlanetTextures
  bumpScale: number
  /** Overall material tint multiplier (kept subtle). */
  children?: ReactNode
}

/** Shared behaviour: rotation, hover response, free selection, visibility by phase. */
export function PlanetGlobe({ id, textures, bumpScale, children }: PlanetGlobeProps) {
  const cfg = PLANETS[id]
  const group = useRef<Group>(null)
  const body = useRef<Mesh>(null)
  const scale = useRef(1)

  useEffect(() => {
    return () => {
      textures.map.dispose()
      textures.bump.dispose()
      document.body.style.cursor = ''
    }
  }, [textures])

  useFrame((_, delta) => {
    const g = group.current
    const b = body.current
    if (!g || !b) return
    const { phase, selectedPlanet, hoveredPlanet } = useAppStore.getState()
    b.rotation.y += cfg.rotationSpeed * delta

    // In Planet View the other planet recedes; in the hub both are present.
    const visible = phase === 'HUB' || (selectedPlanet === id && (phase === 'PLANET_VIEW' || phase === 'DESCENT'))
    const hovered = phase === 'HUB' && hoveredPlanet === id
    const target = !visible ? 0.001 : hovered ? 1.06 : 1
    scale.current = MathUtils.damp(scale.current, target, 4, delta)
    g.scale.setScalar(scale.current)
    g.visible = scale.current > 0.01
  })

  const interactive = () => useAppStore.getState().phase === 'HUB'

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive()) return
    e.stopPropagation()
    useAppStore.getState().setHoveredPlanet(id)
    document.body.style.cursor = 'pointer'
  }
  const onOut = () => {
    if (useAppStore.getState().hoveredPlanet === id) useAppStore.getState().setHoveredPlanet(null)
    document.body.style.cursor = ''
  }
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive()) return
    e.stopPropagation()
    document.body.style.cursor = ''
    useAppStore.getState().selectPlanet(id)
  }

  return (
    <group ref={group} position={cfg.position}>
      <mesh ref={body} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <sphereGeometry args={[cfg.radius, 96, 96]} />
        <meshStandardMaterial
          map={textures.map}
          bumpMap={textures.bump}
          bumpScale={bumpScale}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {children}
    </group>
  )
}
