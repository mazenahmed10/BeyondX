import { useMemo } from 'react'
import { dishGeometry } from '../../deep/spacecraft/materials'
import { Ball, Box, Cable, Cyl, M, Part, Radial, Strut, type V3 } from './primitives'

/**
 * Apollo Lunar Module DESCENT STAGE only: octagonal foil-wrapped body, four legs with footpads,
 * descent engine bell, ladder and plaque. The ascent stage is deliberately absent (it left the Moon).
 */
export function LmDescentStage() {
  return (
    <group>
      <Part name="body">
        <Cyl rt={2.15} h={1.6} seg={8} p={[0, 2.0, 0]} r={[0, Math.PI / 8, 0]} m={M.goldFoil} />
        {/* dark thermal panels on four faces */}
        <Radial n={4} offset={Math.PI / 4}>
          <Box s={[1.5, 1.3, 0.04]} p={[0, 2.0, 2.0]} m={M.black} shadow={false} />
        </Radial>
        {/* empty upper deck where the ascent stage once sat, scorched by its engine */}
        <Cyl rt={2.0} h={0.08} seg={8} p={[0, 2.84, 0]} r={[0, Math.PI / 8, 0]} m={M.alu} shadow={false} />
        <Cyl rt={1.0} h={0.03} seg={20} p={[0, 2.9, 0]} m={M.scorch} shadow={false} />
      </Part>
      <Part name="engine">
        <Cyl rt={0.3} rb={0.78} h={0.95} seg={20} p={[0, 0.78, 0]} m={M.dark} open />
      </Part>
      <Part name="legs">
        <Radial n={4}>
          <Strut a={[0, 2.5, 2.1]} b={[0, 0.2, 4.3]} rad={0.09} m={M.goldFoil} shadow />
          <Strut a={[0.75, 1.35, 2.0]} b={[0, 0.55, 3.95]} rad={0.05} m={M.alu} />
          <Strut a={[-0.75, 1.35, 2.0]} b={[0, 0.55, 3.95]} rad={0.05} m={M.alu} />
          <Cyl rt={0.48} rb={0.42} h={0.14} seg={18} p={[0, 0.09, 4.3]} m={M.goldFoil} />
        </Radial>
      </Part>
      {/* ladder runs down the front (+Z) leg */}
      <Part name="ladder">
        <Strut a={[0.22, 2.55, 2.2]} b={[0.22, 0.75, 3.92]} rad={0.03} m={M.silver} />
        <Strut a={[-0.22, 2.55, 2.2]} b={[-0.22, 0.75, 3.92]} rad={0.03} m={M.silver} />
        {Array.from({ length: 8 }, (_, i) => {
          const t = i / 7
          return <Box key={i} s={[0.46, 0.035, 0.05]} p={[0, 2.5 - t * 1.7, 2.25 + t * 1.62]} m={M.silver} shadow={false} />
        })}
        {/* small "porch" platform at the top of the ladder */}
        <Box s={[0.8, 0.05, 0.6]} p={[0, 2.62, 2.25]} m={M.alu} shadow={false} />
      </Part>
      <Part name="plaque">
        <Box s={[0.36, 0.26, 0.03]} p={[0, 1.78, 2.98]} r={[-0.76, 0, 0]} m={M.silver} shadow={false} />
      </Part>
    </group>
  )
}

/** Lunar Roving Vehicle. variant "apollo-17" shows the improvised map-and-tape rear fender. */
export function LunarRover({ variant }: { variant?: string }) {
  const dish = useMemo(() => dishGeometry(0.5, 0.16), [])
  const repaired = variant === 'apollo-17'
  const wheels: V3[] = [
    [1.15, 0.41, 0.92],
    [1.15, 0.41, -0.92],
    [-1.15, 0.41, 0.92],
    [-1.15, 0.41, -0.92],
  ]
  return (
    <group>
      <Box s={[3.0, 0.1, 1.25]} p={[0, 0.62, 0]} m={M.alu} />
      <Part name="wheels">
        {wheels.map((w, i) => (
          <group key={i} position={w}>
            <Cyl rt={0.41} h={0.24} seg={20} r={[Math.PI / 2, 0, 0]} m={M.wire} shadow={false} />
            <Cyl rt={0.36} h={0.2} seg={14} r={[Math.PI / 2, 0, 0]} m={M.dark} />
            <Cyl rt={0.12} h={0.3} seg={10} r={[Math.PI / 2, 0, 0]} m={M.silver} shadow={false} />
          </group>
        ))}
      </Part>
      <Part name="fender">
        {wheels.map((w, i) => {
          const isRepaired = repaired && i === 3 // right rear
          if (isRepaired) return null
          return <Box key={i} s={[0.95, 0.03, 0.3]} p={[w[0], 0.9, w[2]]} m={M.orange} shadow={false} />
        })}
        {repaired && (
          <group position={[-1.3, 0.93, -0.92]} rotation={[0, 0, 0.22]}>
            {/* four laminated maps taped together, clamped in place */}
            <Box s={[0.95, 0.015, 0.42]} m={M.paper} shadow={false} />
            <Box s={[0.06, 0.02, 0.44]} p={[-0.2, 0.005, 0]} m={M.tape} shadow={false} />
            <Box s={[0.06, 0.02, 0.44]} p={[0.2, 0.005, 0]} m={M.tape} shadow={false} />
            <Box s={[0.08, 0.06, 0.08]} p={[0.42, 0.02, 0.15]} m={M.alu} shadow={false} />
            <Box s={[0.08, 0.06, 0.08]} p={[0.42, 0.02, -0.15]} m={M.alu} shadow={false} />
          </group>
        )}
      </Part>
      <Part name="seats">
        {[0.34, -0.34].map((z) => (
          <group key={z} position={[-0.15, 0, z]}>
            <Box s={[0.5, 0.05, 0.5]} p={[0, 0.95, 0]} m={M.tan} />
            <Box s={[0.05, 0.6, 0.5]} p={[-0.27, 1.25, 0]} r={[0, 0, 0.18]} m={M.tan} />
            <Strut a={[0.2, 0.67, 0.2]} b={[0.2, 0.93, 0.2]} rad={0.02} />
            <Strut a={[-0.2, 0.67, -0.2]} b={[-0.2, 0.93, -0.2]} rad={0.02} />
          </group>
        ))}
      </Part>
      <Part name="console">
        <Box s={[0.25, 0.3, 0.4]} p={[0.55, 1.05, 0]} r={[0, 0, -0.35]} m={M.dark} />
        <Strut a={[0.2, 0.67, 0]} b={[0.2, 1.05, 0]} rad={0.025} />
        <Box s={[0.05, 0.05, 0.16]} p={[0.2, 1.07, 0]} m={M.white} shadow={false} />
      </Part>
      <Part name="antenna">
        <Strut a={[1.25, 0.67, 0]} b={[1.25, 2.1, 0]} rad={0.025} m={M.silver} />
        <mesh geometry={dish} material={M.goldWire} position={[1.25, 2.1, 0]} rotation={[0.25, 0, -0.3]} />
        <Strut a={[1.25, 2.1, 0]} b={[1.15, 2.38, 0.07]} rad={0.012} m={M.silver} />
        {/* low-gain antenna */}
        <Strut a={[0.75, 0.67, 0.5]} b={[0.75, 1.75, 0.5]} rad={0.015} m={M.silver} />
        <Cyl rt={0.05} h={0.22} p={[0.75, 1.82, 0.5]} m={M.white} shadow={false} />
      </Part>
      <Part name="camera">
        <Strut a={[1.3, 0.67, -0.5]} b={[1.3, 1.5, -0.5]} rad={0.025} m={M.silver} />
        <Box s={[0.34, 0.16, 0.14]} p={[1.33, 1.58, -0.5]} m={M.goldFoil} />
        <Cyl rt={0.05} h={0.1} r={[0, 0, Math.PI / 2]} p={[1.54, 1.58, -0.5]} m={M.black} shadow={false} />
      </Part>
      {/* rear tool pallet */}
      <Box s={[0.5, 0.5, 1.0]} p={[-1.2, 0.95, 0]} m={M.white} />
      <Strut a={[-1.2, 1.2, 0.3]} b={[-1.2, 1.75, 0.3]} rad={0.02} />
    </group>
  )
}

type InstrumentId = 'pse' | 'lsm' | 'sws' | 'side' | 'cplee' | 'ase' | 'hfe' | 'hfe-broken' | 'lsg' | 'lace' | 'leam' | 'lspe'

/** Which experiments each station really carried (they were not identical). */
const ALSEP_SETS: Record<string, InstrumentId[]> = {
  'apollo-12': ['pse', 'lsm', 'sws', 'side'],
  'apollo-14': ['pse', 'ase', 'side', 'cplee'],
  'apollo-15': ['pse', 'lsm', 'sws', 'side', 'hfe'],
  'apollo-16': ['pse', 'ase', 'lsm', 'hfe-broken'],
  'apollo-17': ['hfe', 'lsg', 'lace', 'leam', 'lspe'],
}

function Instrument({ id }: { id: InstrumentId }) {
  switch (id) {
    case 'pse': // passive seismometer under a wide thermal skirt
      return (
        <>
          <Cyl rt={0.85} h={0.02} seg={24} p={[0, 0.03, 0]} m={M.silver} shadow={false} />
          <Cyl rt={0.2} h={0.42} p={[0, 0.24, 0]} m={M.silver} />
          <Cyl rt={0.03} h={0.3} p={[0, 0.6, 0]} m={M.alu} shadow={false} />
        </>
      )
    case 'lsm': // magnetometer: three sensor arms
      return (
        <>
          <Box s={[0.35, 0.3, 0.35]} p={[0, 0.5, 0]} m={M.white} />
          <Radial n={3}>
            <Strut a={[0, 0.02, 0.5]} b={[0, 0.4, 0.1]} rad={0.02} />
            <Strut a={[0, 0.6, 0.1]} b={[0, 1.15, 0.75]} rad={0.02} m={M.silver} />
            <Box s={[0.12, 0.12, 0.12]} p={[0, 1.18, 0.78]} m={M.goldFoil} shadow={false} />
          </Radial>
        </>
      )
    case 'sws':
      return (
        <>
          <Box s={[0.4, 0.35, 0.4]} p={[0, 0.5, 0]} m={M.goldFoil} />
          <Radial n={4} offset={Math.PI / 4}>
            <Strut a={[0, 0.02, 0.4]} b={[0, 0.35, 0.22]} rad={0.018} />
          </Radial>
        </>
      )
    case 'side': // ion detector with its small gauge alongside
      return (
        <>
          <Box s={[0.4, 0.5, 0.3]} p={[0, 0.3, 0]} m={M.white} />
          <Box s={[0.5, 0.02, 0.4]} p={[0, 0.02, 0]} m={M.silver} shadow={false} />
          <Box s={[0.16, 0.2, 0.16]} p={[0.6, 0.12, 0.2]} m={M.goldFoil} shadow={false} />
        </>
      )
    case 'cplee':
      return <Box s={[0.5, 0.16, 0.35]} p={[0, 0.1, 0]} m={M.goldFoil} />
    case 'ase': // geophone line plus mortar box
      return (
        <>
          <Box s={[0.4, 0.3, 0.3]} p={[0, 0.17, 0]} m={M.white} />
          <Cable to={[0, 0, 4.5]} />
          {[1.5, 3, 4.5].map((z) => (
            <Cyl key={z} rt={0.06} h={0.18} p={[0, 0.09, z]} m={M.dark} shadow={false} />
          ))}
        </>
      )
    case 'hfe':
    case 'hfe-broken':
      return (
        <>
          <Box s={[0.35, 0.22, 0.3]} p={[0, 0.13, 0]} m={M.white} />
          {[-1, 1].map((k) => (
            <group key={k}>
              <Cable to={[k * 1.4, 0, 0.9]} />
              <Cyl rt={0.03} h={0.5} p={[k * 1.4, 0.25, 0.9]} m={M.alu} shadow={false} />
            </group>
          ))}
        </>
      )
    case 'lsg': // gravimeter under a tilted sunshade
      return (
        <>
          <Box s={[0.4, 0.45, 0.4]} p={[0, 0.25, 0]} m={M.white} />
          <Box s={[0.7, 0.02, 0.6]} p={[0, 0.62, 0]} r={[0.35, 0, 0]} m={M.silver} shadow={false} />
        </>
      )
    case 'lace':
      return (
        <>
          <Box s={[0.35, 0.3, 0.3]} p={[0, 0.17, 0]} m={M.white} />
          <Cyl rt={0.14} rb={0.05} h={0.18} p={[0, 0.42, 0]} m={M.silver} shadow={false} open />
        </>
      )
    case 'leam':
      return (
        <>
          <Box s={[0.35, 0.3, 0.35]} p={[0, 0.3, 0]} m={M.goldFoil} />
          <Radial n={4} offset={Math.PI / 4}>
            <Strut a={[0, 0.02, 0.38]} b={[0, 0.18, 0.2]} rad={0.015} />
          </Radial>
        </>
      )
    case 'lspe':
      return (
        <>
          <Strut a={[0, 0, 0]} b={[0, 1.3, 0]} rad={0.015} m={M.silver} />
          {[0.9, -0.9].map((x) => (
            <Cyl key={x} rt={0.06} h={0.16} p={[x, 0.08, 0.5]} m={M.dark} shadow={false} />
          ))}
          <Cable to={[0.9, 0, 0.5]} />
          <Cable to={[-0.9, 0, 0.5]} />
        </>
      )
  }
}

/** ALSEP: Central Station + RTG + the experiments that mission actually deployed. */
export function AlsepStation({ variant = 'apollo-12' }: { variant?: string }) {
  const set = ALSEP_SETS[variant] ?? ALSEP_SETS['apollo-12']
  const spots = set.map((id, i) => {
    const a = -0.9 + (i / Math.max(1, set.length - 1)) * 3.4
    const d = 3.4 + (i % 2) * 1.0
    return { id, pos: [Math.sin(a) * d, 0, Math.cos(a) * d] as V3, rot: a }
  })
  return (
    <group>
      <Part name="central">
        <Box s={[0.95, 0.62, 0.8]} p={[0, 0.62, 0]} m={M.white} />
        <Box s={[1.2, 0.03, 1.05]} p={[0, 1.02, 0]} m={M.silver} shadow={false} />
        <Radial n={4} offset={Math.PI / 4}>
          <Strut a={[0, 0, 0.6]} b={[0, 0.32, 0.5]} rad={0.02} />
        </Radial>
      </Part>
      <Part name="antenna">
        <Strut a={[0, 1.02, 0]} b={[0.25, 2.0, 0.3]} rad={0.03} m={M.silver} />
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0.25 + i * 0.045, 2.0 + i * 0.16, 0.3 + i * 0.05]} rotation={[Math.PI / 2 - 0.3, 0, 0.25]} material={M.goldFoil}>
            <torusGeometry args={[0.11, 0.012, 6, 16]} />
          </mesh>
        ))}
      </Part>
      <Part name="rtg" p={[-2.6, 0, -1.2]}>
        <Box s={[0.7, 0.05, 0.7]} p={[0, 0.06, 0]} m={M.alu} shadow={false} />
        <Cyl rt={0.2} h={0.55} p={[0, 0.38, 0]} m={M.dark} />
        <Radial n={8}>
          <Box s={[0.02, 0.5, 0.2]} p={[0, 0.38, 0.28]} m={M.dark} shadow={false} />
        </Radial>
      </Part>
      <Cable to={[-2.6, 0, -1.2]} />
      <Part name="instruments">
        {spots.map((s) => (
          <group key={s.id}>
            {/* the Apollo 16 heat-flow cable was torn from the Central Station: it stops short */}
            <Cable to={s.pos} from={s.id === 'hfe-broken' ? [s.pos[0] * 0.45, 0, s.pos[2] * 0.45] : [0, 0, 0]} />
            <group position={s.pos} rotation={[0, s.rot, 0]}>
              <Instrument id={s.id} />
            </group>
          </group>
        ))}
      </Part>
    </group>
  )
}

/**
 * Surveyor lander: triangular frame on three legs, mast with solar panel and planar antenna,
 * TV camera, vernier engines. Variants: "camera" | "scoop-nocam" | "alpha" | "scoop-alpha".
 */
export function SurveyorLander({ variant = 'camera' }: { variant?: string }) {
  const hasScoop = variant.includes('scoop')
  const hasAlpha = variant.includes('alpha')
  const cameraRemoved = variant.includes('nocam') // Surveyor 3: taken back to Earth by Apollo 12
  const corner = (i: number): V3 => {
    const a = (i / 3) * Math.PI * 2
    return [Math.sin(a) * 1.05, 1.0, Math.cos(a) * 1.05]
  }
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <Strut key={i} a={corner(i)} b={corner((i + 1) % 3)} rad={0.045} shadow />
      ))}
      {[0, 1, 2].map((i) => (
        <Strut key={`u${i}`} a={corner(i)} b={[0, 1.7, 0]} rad={0.035} />
      ))}
      <Part name="legs">
        <Radial n={3}>
          <Strut a={[0, 1.0, 1.05]} b={[0, 0.16, 2.15]} rad={0.05} shadow />
          <Strut a={[0, 1.55, 0.5]} b={[0, 0.3, 2.05]} rad={0.03} />
          <Cyl rt={0.3} rb={0.24} h={0.16} seg={16} p={[0, 0.1, 2.15]} m={M.silver} />
        </Radial>
      </Part>
      <Part name="engine">
        <Radial n={3} offset={Math.PI / 3}>
          <Cyl rt={0.07} rb={0.14} h={0.25} p={[0, 0.72, 0.8]} m={M.dark} shadow={false} open />
        </Radial>
      </Part>
      {/* thermal compartments */}
      <Box s={[0.55, 0.55, 0.4]} p={[0.55, 1.3, -0.35]} m={M.white} />
      <Box s={[0.45, 0.45, 0.35]} p={[-0.6, 1.25, -0.25]} m={M.white} />
      <Part name="panel">
        <Strut a={[0, 1.7, 0]} b={[0, 3.1, 0]} rad={0.045} m={M.silver} shadow />
        <Box s={[1.15, 0.03, 0.95]} p={[0.62, 3.2, 0]} r={[0, 0, 0.35]} m={M.solar} />
        <Box s={[1.0, 0.03, 0.95]} p={[-0.6, 3.15, 0]} r={[0, 0, -0.5]} m={M.goldFoil} />
        <Strut a={[-0.9, 1.2, 0.6]} b={[-1.9, 1.6, 1.2]} rad={0.015} m={M.silver} />
        <Strut a={[0.9, 1.2, -0.6]} b={[1.7, 1.9, -1.3]} rad={0.015} m={M.silver} />
      </Part>
      <Part name="camera">
        {cameraRemoved ? (
          <Cyl rt={0.06} h={0.12} p={[0.2, 1.42, 0.85]} m={M.alu} shadow={false} />
        ) : (
          <>
            <Cyl rt={0.11} h={0.75} p={[0.2, 1.72, 0.85]} r={[0.28, 0, 0]} m={M.white} />
            <Box s={[0.26, 0.2, 0.22]} p={[0.2, 2.12, 0.97]} r={[0.28, 0, 0]} m={M.silver} shadow={false} />
          </>
        )}
      </Part>
      {hasScoop && (
        <Part name="scoop">
          <Strut a={[-0.5, 1.15, 0.6]} b={[-0.9, 0.85, 1.6]} rad={0.03} m={M.silver} />
          <Strut a={[-0.9, 0.85, 1.6]} b={[-1.25, 0.12, 2.5]} rad={0.03} m={M.silver} />
          <Box s={[0.14, 0.12, 0.2]} p={[-1.27, 0.08, 2.55]} m={M.alu} shadow={false} />
          {/* a short trench it dug */}
          <Box s={[0.2, 0.02, 0.7]} p={[-1.6, 0.02, 2.75]} r={[0, 0.5, 0]} m={M.black} shadow={false} />
        </Part>
      )}
      {hasAlpha && (
        <Part name="alpha">
          <Box s={[0.22, 0.16, 0.22]} p={[0.85, 0.1, 1.05]} m={M.goldFoil} shadow={false} />
          <Cyl rt={0.2} h={0.015} seg={18} p={[0.85, 0.02, 1.05]} m={M.silver} shadow={false} />
          <Strut a={[0.85, 0.18, 1.05]} b={[0.6, 1.05, 0.6]} rad={0.008} m={M.white} />
        </Part>
      )}
    </group>
  )
}

function rng(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Historical impact marker (Surveyor 2 / 4): a small crater and scattered wreckage. Never an intact lander. */
export function ImpactSite({ variant }: { variant?: string }) {
  const bits = useMemo(() => {
    const rand = rng(variant === 'surveyor-4' ? 1967 : 1966)
    return Array.from({ length: 16 }, () => {
      const a = rand() * Math.PI * 2
      const d = 1.2 + rand() * 3.2
      return {
        p: [Math.cos(a) * d, 0.05 + rand() * 0.1, Math.sin(a) * d] as V3,
        r: [rand() * 3, rand() * 3, rand() * 3] as V3,
        s: [0.15 + rand() * 0.5, 0.03 + rand() * 0.08, 0.1 + rand() * 0.35] as V3,
        m: rand() > 0.6 ? M.goldFoil : rand() > 0.4 ? M.silver : M.alu,
      }
    })
  }, [variant])
  return (
    <group>
      <Part name="crater">
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={M.scorch}>
          <circleGeometry args={[1.5, 28]} />
        </mesh>
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.45]} material={M.tape} castShadow>
          <torusGeometry args={[1.6, 0.3, 8, 28]} />
        </mesh>
      </Part>
      <Part name="debris">
        {bits.map((b, i) => (
          <Box key={i} s={b.s} p={b.p} r={b.r} m={b.m} />
        ))}
        {/* a bent strut and a crushed footpad: recognisably wreckage, not a standing spacecraft */}
        <Strut a={[0.4, 0.05, 0.3]} b={[1.5, 0.55, 0.9]} rad={0.045} shadow />
        <Cyl rt={0.28} h={0.06} seg={12} p={[-0.9, 0.08, 0.7]} r={[0.5, 0, 0.3]} m={M.silver} />
        <Ball rad={0.22} p={[0.2, 0.12, -0.8]} m={M.dark} scale={[1, 0.5, 0.8]} />
      </Part>
    </group>
  )
}
