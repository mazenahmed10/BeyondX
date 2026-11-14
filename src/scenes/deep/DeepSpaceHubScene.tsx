import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { useAppStore } from '../../app/store'
import { missionsFor, type Mission } from '../../data/missions'
import { DEEP_HUB_SLOTS, SPACECRAFT_FOR_ENV, type SpacecraftKind } from './environments'
import { DeepBackdrop } from './backdrop/DeepBackdrop'
import { SpacecraftModel } from './spacecraft/SpacecraftModel'

const HUB_SCALE: Record<SpacecraftKind, number> = { dawn: 0.8, near: 1.05, pioneer: 0.95, kepler: 0.95 }

function MissionPedestal({ mission, slot }: { mission: Mission; slot: [number, number, number] }) {
  const group = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const scale = useRef(1)
  const kind = SPACECRAFT_FOR_ENV[mission.environmentId]
  const base = HUB_SCALE[kind]

  useFrame((state, delta) => {
    const hovered = useAppStore.getState().hoveredMission === mission.id
    scale.current = MathUtils.damp(scale.current, hovered ? 1.14 : 1, 5, delta)
    if (group.current) {
      group.current.scale.setScalar(base * scale.current)
      group.current.position.y = slot[1] + Math.sin(state.clock.elapsedTime * 0.6 + slot[0]) * 0.12
    }
    if (spin.current) spin.current.rotation.y += delta * (hovered ? 0.55 : 0.18)
  })

  return (
    <group ref={group} position={slot}>
      <group ref={spin} rotation={[0.25, 0.6, 0]}>
        <SpacecraftModel kind={kind} />
      </group>
      {/* generous invisible hit target */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          document.body.style.cursor = ''
          useAppStore.getState().selectMission(mission.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          useAppStore.getState().setHoveredMission(mission.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          if (useAppStore.getState().hoveredMission === mission.id) useAppStore.getState().setHoveredMission(null)
          document.body.style.cursor = ''
        }}
      >
        <sphereGeometry args={[1.9, 16, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

/** Deep Space Hub: every mission's spacecraft stands in a row inside a drifting nebula. */
export default function DeepSpaceHubScene() {
  const missions = missionsFor('deep-space')
  return (
    <>
      <DeepBackdrop />
      <directionalLight position={[-6, 5, 8]} intensity={3.2} color="#fff2e0" />
      <directionalLight position={[8, -2, -4]} intensity={0.5} color="#7fb6ff" />
      <ambientLight intensity={0.25} color="#8fa6d8" />
      {missions.map((m, i) => (
        <MissionPedestal key={m.id} mission={m} slot={DEEP_HUB_SLOTS[i] ?? [0, 0, 0]} />
      ))}
    </>
  )
}
