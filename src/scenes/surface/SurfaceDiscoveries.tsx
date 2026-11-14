import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Billboard, Html } from '@react-three/drei'
import { AdditiveBlending, Vector3, type Group, type Mesh, type MeshBasicMaterial } from 'three'
import { useAppStore } from '../../app/store'
import { useKidStore } from '../../app/kidStore'
import { useStoryStore } from '../../app/storyStore'
import { getStory } from '../../data/stories'
import type { PlanetId } from '../../planets/planetConfig'
import { EquipmentStage } from './models/EquipmentStage'
import { siteGroundY, sitesFor, type SurfaceSite } from './sites'

const ADULT = { beam: '#e8b45a', done: '#7fd8e6', glow: '#e8b45a' }
const KID = { beam: '#ff7ab8', done: '#ffd24a', glow: '#ffd24a' }

interface MarkerProps {
  site: SurfaceSite
  discovered: boolean
  kid: boolean
  index: number
}

/** Glowing beacon over a piece of equipment. Click: the camera flies in and the story begins. */
function SurfaceMarker({ site, discovered, kid, index }: MarkerProps) {
  const pulse = useRef<Group>(null)
  const beam = useRef<Mesh>(null)
  const anchor = useRef<Group>(null)
  const labelEl = useRef<HTMLDivElement>(null)
  const world = useMemo(() => new Vector3(), [])
  const palette = kid ? KID : ADULT
  const color = discovered ? palette.done : palette.beam
  const story = getStory(site.storyId)
  const top = site.height + 1.6

  useFrame((state) => {
    const t = state.clock.elapsedTime + index * 0.7
    if (pulse.current) {
      pulse.current.scale.setScalar(1 + Math.sin(t * 2.4) * (kid ? 0.16 : 0.08))
      pulse.current.position.y = top + (kid ? Math.abs(Math.sin(t * 2)) * 0.7 : Math.sin(t * 1.2) * 0.15)
      if (kid) pulse.current.rotation.z = Math.sin(t * 1.5) * 0.25
    }
    if (beam.current) (beam.current.material as MeshBasicMaterial).opacity = (discovered ? 0.1 : 0.2) + Math.sin(t * 1.8) * 0.06
    // Labels shrink with distance but stay within a readable range (never tiny, never huge up close).
    if (anchor.current && labelEl.current) {
      const d = state.camera.position.distanceTo(anchor.current.getWorldPosition(world))
      const k = Math.max(0.6, Math.min(1.25, 34 / d))
      labelEl.current.style.transform = `scale(${k.toFixed(2)})`
      labelEl.current.style.opacity = d > 95 ? '0.55' : '1'
    }
  })

  const select = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return // it was a camera drag, not a click
    e.stopPropagation()
    document.body.style.cursor = ''
    useAppStore.getState().selectDiscovery(site.storyId)
  }
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    document.body.style.cursor = ''
  }

  const label = discovered ? (story?.equipmentName ?? 'Discovered') : kid ? 'Mystery signal!' : 'UNIDENTIFIED SIGNAL'

  return (
    <group>
      {/* light beam: visible from across the site */}
      <mesh ref={beam} position={[0, 11, 0]}>
        <cylinderGeometry args={[0.1, 0.4, 22, 10, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} blending={AdditiveBlending} depthWrite={false} side={2} />
      </mesh>
      <group ref={pulse} position={[0, top, 0]}>
        <Billboard>
          <mesh>
            <ringGeometry args={[0.72, 0.84, kid ? 5 : 48]} />
            <meshBasicMaterial color={color} transparent opacity={0.95} depthTest={false} />
          </mesh>
          <mesh>
            <circleGeometry args={[kid ? 0.36 : 0.2, kid ? 5 : 24]} />
            <meshBasicMaterial color={color} transparent opacity={0.95} depthTest={false} />
          </mesh>
        </Billboard>
      </group>
      {/* generous invisible click target around the object and its beacon */}
      <mesh position={[0, top * 0.5, 0]} onClick={select} onPointerOver={over} onPointerOut={out}>
        <cylinderGeometry args={[Math.max(2.4, site.radius * 0.8), Math.max(2.4, site.radius * 0.8), top + 2, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={anchor} position={[0, top + 1.6, 0]} />
      <Html position={[0, top + 1.6, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[5, 0]}>
        <div ref={labelEl} className={`surface-marker-label ${discovered ? 'is-done' : ''}`}>
          {kid ? (discovered ? '⭐ ' : '❓ ') : ''}
          {label}
        </div>
      </Html>
    </group>
  )
}

function SiteObject({ site, index }: { site: SurfaceSite; index: number }) {
  const y = useMemo(() => siteGroundY(site), [site])
  const kid = useKidStore((s) => s.kidMode)
  const inDiscovery = useAppStore((s) => s.phase === 'DISCOVERY')
  const selected = useAppStore((s) => s.phase === 'DISCOVERY' && s.selectedDiscovery === site.storyId)
  const discovered = useStoryStore((s) => s.discovered.includes(site.storyId))
  const highlight = useStoryStore((s) => (selected ? s.highlight : null))
  const revealTick = useStoryStore((s) => (selected ? s.revealTick : 0))

  return (
    <group position={[site.x, y, site.z]} rotation={[0, site.rotY, 0]}>
      <EquipmentStage
        kind={site.kind}
        variant={site.variant}
        scale={site.scale}
        silhouette={!discovered}
        highlight={highlight}
        highlightColor={kid ? KID.glow : ADULT.glow}
        revealTick={revealTick}
      />
      {/* a soft fill so the revealed object reads clearly even on its shadowed side */}
      {selected && <pointLight position={[0, site.height + 3, site.radius]} intensity={site.planet === 'moon' ? 90 : 30} distance={34} color="#fff3e0" />}
      {!inDiscovery && <SurfaceMarker site={site} discovered={discovered} kid={kid} index={index} />}
    </group>
  )
}

/** All equipment and discovery markers of one world. Lazy-loaded with the surface. */
export default function SurfaceDiscoveries({ planet }: { planet: PlanetId }) {
  const sites = useMemo(() => sitesFor(planet), [planet])
  return (
    <>
      {sites.map((site, i) => (
        <SiteObject key={site.storyId} site={site} index={i} />
      ))}
    </>
  )
}
