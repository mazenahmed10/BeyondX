import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html } from '@react-three/drei'
import type { Group } from 'three'
import { useAppStore } from '../../app/store'

interface Props {
  missionId: string
  position: [number, number, number]
  /** World-space radius of the ring. */
  size?: number
  label?: string
}

/** Pulsing ring on the spacecraft. Click: camera focuses on it and the discovery card opens. */
export function DiscoveryMarker({ missionId, position, size = 1, label = 'SPACECRAFT' }: Props) {
  const ring = useRef<Group>(null)
  const phase = useAppStore((s) => s.phase)
  const focused = useAppStore((s) => s.selectedDiscovery === missionId)
  const focusDiscovery = useAppStore((s) => s.focusDiscovery)
  const visible = phase === 'MISSION' && !focused

  useFrame((state) => {
    if (!ring.current) return
    const k = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.08
    ring.current.scale.setScalar(k)
  })

  return (
    <group position={position} visible={visible}>
      <Billboard>
        <group ref={ring}>
          <mesh>
            <ringGeometry args={[size * 0.5, size * 0.56, 48]} />
            <meshBasicMaterial color="#e8b45a" transparent opacity={0.9} depthTest={false} />
          </mesh>
          <mesh
            onClick={(e) => {
              e.stopPropagation()
              document.body.style.cursor = ''
              focusDiscovery(missionId)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = ''
            }}
          >
            <circleGeometry args={[size * 0.75, 24]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </Billboard>
      {visible && (
        <Html position={[0, size * 0.85, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-gold">{label}</div>
        </Html>
      )}
    </group>
  )
}
