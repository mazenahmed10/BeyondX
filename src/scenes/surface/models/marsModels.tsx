import { useMemo } from 'react'
import { dishGeometry } from '../../deep/spacecraft/materials'
import { Ball, Box, Cyl, M, Part, Radial, Strut, type V3 } from './primitives'

function Wheel({ p, rad, w }: { p: V3; rad: number; w: number }) {
  return (
    <group position={p}>
      <Cyl rt={rad} h={w} seg={16} r={[Math.PI / 2, 0, 0]} m={M.dark} />
      <Cyl rt={rad * 1.04} h={w * 0.9} seg={12} r={[Math.PI / 2, 0, 0]} m={M.wire} shadow={false} />
    </group>
  )
}

/** Sojourner (enlarged for visibility) beside a simplified Mars Pathfinder lander: it did not land alone. */
export function Sojourner() {
  const xs = [-0.9, 0, 0.9]
  return (
    <group>
      <group position={[2.2, 0, 1.2]} rotation={[0, -0.5, 0]}>
        <Box s={[2.1, 0.32, 1.45]} p={[0, 0.72, 0]} m={M.goldFoil} />
        <Part name="panel">
          <Box s={[2.3, 0.04, 1.6]} p={[0, 0.92, 0]} m={M.solar} />
        </Part>
        <Part name="wheels">
          {xs.flatMap((x) => [0.95, -0.95].map((z) => <Wheel key={`${x}${z}`} p={[x, 0.27, z]} rad={0.27} w={0.3} />))}
          {[0.95, -0.95].map((z) => (
            <group key={z}>
              <Strut a={[-0.9, 0.27, z]} b={[-0.45, 0.62, z * 0.86]} rad={0.03} />
              <Strut a={[0, 0.27, z]} b={[-0.45, 0.62, z * 0.86]} rad={0.03} />
              <Strut a={[-0.45, 0.62, z * 0.86]} b={[0.9, 0.27, z]} rad={0.03} />
            </group>
          ))}
        </Part>
        <Part name="antenna">
          <Strut a={[-0.95, 0.92, -0.6]} b={[-0.95, 2.0, -0.6]} rad={0.015} m={M.silver} />
        </Part>
        <Part name="apxs">
          <Cyl rt={0.11} h={0.4} r={[0, 0, Math.PI / 2]} p={[-1.25, 0.62, 0.3]} m={M.silver} />
          <Cyl rt={0.14} h={0.05} r={[0, 0, Math.PI / 2]} p={[-1.47, 0.62, 0.3]} m={M.alu} shadow={false} />
        </Part>
        <Box s={[0.1, 0.1, 0.5]} p={[1.08, 0.74, 0]} m={M.black} shadow={false} />
      </group>
      <Part name="lander" p={[-3.2, 0, -1.0]}>
        {/* base plate and three opened petals covered in solar cells */}
        <Cyl rt={1.25} h={0.5} seg={3} p={[0, 0.3, 0]} m={M.white} />
        <Radial n={3} offset={Math.PI / 3}>
          <mesh position={[0, 0.1, 1.75]} rotation={[0, Math.PI, 0]} material={M.solar} castShadow>
            <cylinderGeometry args={[1.2, 1.2, 0.05, 3]} />
          </mesh>
          {/* deflated airbags around the petals */}
          <Ball rad={0.7} p={[0.9, 0.12, 2.5]} m={M.tan} scale={[1, 0.22, 0.8]} shadow={false} />
          <Ball rad={0.6} p={[-0.9, 0.1, 2.4]} m={M.tan} scale={[1, 0.2, 0.9]} shadow={false} />
        </Radial>
        {/* camera mast */}
        <Strut a={[0, 0.55, 0]} b={[0, 2.3, 0]} rad={0.04} m={M.silver} shadow />
        <Cyl rt={0.12} h={0.3} p={[0, 2.42, 0]} m={M.goldFoil} />
        {/* exit ramp toward the rover */}
        <Box s={[2.0, 0.03, 0.2]} p={[2.1, 0.22, 0.75]} r={[0, -0.3, -0.16]} m={M.silver} shadow={false} />
        <Box s={[2.0, 0.03, 0.2]} p={[2.25, 0.22, 0.25]} r={[0, -0.3, -0.16]} m={M.silver} shadow={false} />
      </Part>
    </group>
  )
}

/** Mars Exploration Rover (Spirit / Opportunity are twins, so they share this model). */
export function MerRover({ variant }: { variant?: string }) {
  const dish = useMemo(() => dishGeometry(0.32, 0.07), [])
  const stuck = variant === 'spirit' // embedded in soft soil, slightly tilted
  const wx = [-0.95, 0.1, 1.0]
  return (
    <group position={[0, stuck ? -0.2 : 0, 0]} rotation={stuck ? [0.05, 0, -0.09] : [0, 0, 0]}>
      <Box s={[1.35, 0.42, 1.0]} p={[0, 0.95, 0]} m={M.goldFoil} />
      <Part name="panels">
        <Box s={[1.6, 0.04, 1.2]} p={[0, 1.2, 0]} m={M.solar} />
        <Box s={[1.1, 0.04, 0.85]} p={[-0.1, 1.2, 1.0]} r={[0, 0.25, 0]} m={M.solar} />
        <Box s={[1.1, 0.04, 0.85]} p={[-0.1, 1.2, -1.0]} r={[0, -0.25, 0]} m={M.solar} />
        <Box s={[0.75, 0.04, 1.3]} p={[-1.15, 1.2, 0]} m={M.solar} />
      </Part>
      <Part name="mast">
        <Strut a={[0.6, 1.2, 0.3]} b={[0.6, 2.35, 0.3]} rad={0.045} m={M.white} shadow />
        <Box s={[0.16, 0.16, 0.6]} p={[0.62, 2.42, 0.3]} m={M.white} />
        {[0.12, 0.48].map((z) => (
          <Cyl key={z} rt={0.05} h={0.06} r={[0, 0, Math.PI / 2]} p={[0.72, 2.42, z]} m={M.black} shadow={false} />
        ))}
      </Part>
      <Part name="antenna">
        <Strut a={[-0.5, 1.2, -0.3]} b={[-0.5, 1.6, -0.3]} rad={0.025} m={M.silver} />
        <mesh geometry={dish} material={M.white} position={[-0.5, 1.6, -0.3]} rotation={[0.5, 0, 0.3]} castShadow />
        <Strut a={[-0.2, 1.2, 0.35]} b={[-0.2, 1.95, 0.35]} rad={0.018} m={M.silver} />
      </Part>
      <Part name="arm">
        <Strut a={[0.7, 0.85, 0]} b={[1.35, 1.0, 0.1]} rad={0.035} m={M.silver} />
        <Strut a={[1.35, 1.0, 0.1]} b={[1.75, 0.45, 0.15]} rad={0.035} m={M.silver} />
        <Cyl rt={0.11} h={0.12} p={[1.77, 0.38, 0.15]} m={M.alu} />
        <Box s={[0.1, 0.1, 0.34]} p={[1.77, 0.38, 0.15]} m={M.goldFoil} shadow={false} />
      </Part>
      <Part name="wheels">
        {wx.flatMap((x) => [0.82, -0.82].map((z) => <Wheel key={`${x}${z}`} p={[x, 0.26, z]} rad={0.26} w={0.2} />))}
        {[0.82, -0.82].map((z) => (
          <group key={z}>
            <Strut a={[1.0, 0.26, z]} b={[0.25, 0.9, z * 0.75]} rad={0.035} />
            <Strut a={[0.25, 0.9, z * 0.75]} b={[-0.45, 0.6, z]} rad={0.035} />
            <Strut a={[-0.45, 0.6, z]} b={[-0.95, 0.26, z]} rad={0.03} />
            <Strut a={[-0.45, 0.6, z]} b={[0.1, 0.26, z]} rad={0.03} />
          </group>
        ))}
      </Part>
    </group>
  )
}

/** Viking lander (the orbiter stayed in orbit and is not modelled on the surface). */
export function VikingLander({ variant }: { variant?: string }) {
  const dish = useMemo(() => dishGeometry(0.72, 0.2), [])
  const tilted = variant === 'viking-2' // one footpad came down on a rock
  return (
    <group>
      {tilted && <Ball rad={0.45} p={[0, 0.2, 2.2]} m={M.trench} scale={[1.1, 0.7, 0.9]} />}
      <group position={[0, tilted ? 0.16 : 0, 0]} rotation={tilted ? [-0.14, 0, 0] : [0, 0, 0]}>
        <Part name="body">
          <Cyl rt={1.5} h={0.5} seg={6} p={[0, 1.15, 0]} m={M.white} />
          <Ball rad={0.42} p={[1.45, 1.2, 0.85]} m={M.silver} />
          <Ball rad={0.42} p={[-1.45, 1.2, 0.85]} m={M.silver} />
        </Part>
        <Part name="legs">
          <Radial n={3}>
            <Strut a={[0, 1.0, 1.3]} b={[0, 0.14, 2.2]} rad={0.06} shadow />
            <Strut a={[0.6, 1.0, 1.1]} b={[0, 0.3, 2.1]} rad={0.035} />
            <Strut a={[-0.6, 1.0, 1.1]} b={[0, 0.3, 2.1]} rad={0.035} />
            <Cyl rt={0.3} rb={0.2} h={0.14} seg={14} p={[0, 0.08, 2.2]} m={M.silver} />
          </Radial>
        </Part>
        <Part name="rtg">
          <Box s={[0.8, 0.45, 0.5]} p={[0.75, 1.62, -0.85]} r={[0, 0.5, 0]} m={M.tan} />
          <Box s={[0.8, 0.45, 0.5]} p={[-0.75, 1.62, -0.85]} r={[0, -0.5, 0]} m={M.tan} />
        </Part>
        <Part name="cameras">
          {[0.5, -0.5].map((x) => (
            <group key={x}>
              <Cyl rt={0.11} h={0.75} p={[x, 1.78, 0.75]} m={M.white} />
              <Cyl rt={0.125} h={0.14} p={[x, 2.2, 0.75]} m={M.dark} shadow={false} />
            </group>
          ))}
        </Part>
        <Part name="dish">
          <Strut a={[0, 1.4, -0.2]} b={[0, 2.5, -0.2]} rad={0.04} m={M.silver} shadow />
          <mesh geometry={dish} material={M.white} position={[0, 2.5, -0.2]} rotation={[0.45, 0.3, 0]} castShadow />
          <Strut a={[0, 2.5, -0.2]} b={[0.1, 2.85, 0.0]} rad={0.012} m={M.silver} />
        </Part>
        <Part name="weather">
          <Strut a={[-1.3, 1.2, -0.6]} b={[-2.3, 1.9, -1.2]} rad={0.02} m={M.silver} />
          <Box s={[0.14, 0.14, 0.14]} p={[-2.32, 1.95, -1.22]} m={M.white} shadow={false} />
        </Part>
        <Part name="arm">
          <Box s={[0.35, 0.3, 0.35]} p={[0.15, 1.52, 1.2]} m={M.alu} />
          <Strut a={[0.15, 1.5, 1.3]} b={[0.5, 0.25, 3.3]} rad={0.03} m={M.silver} />
          <Box s={[0.16, 0.12, 0.22]} p={[0.52, 0.2, 3.38]} m={M.alu} shadow={false} />
        </Part>
      </group>
      {/* sampler trenches */}
      <Box s={[0.22, 0.02, 0.8]} p={[0.9, 0.02, 3.5]} r={[0, 0.3, 0]} m={M.trench} shadow={false} />
      <Box s={[0.22, 0.02, 0.6]} p={[0.3, 0.02, 3.7]} r={[0, -0.2, 0]} m={M.trench} shadow={false} />
    </group>
  )
}

function LanderDeck({ dusty }: { dusty?: boolean }) {
  return (
    <>
      <Part name="deck">
        <Cyl rt={0.85} h={0.26} seg={10} p={[0, 1.05, 0]} m={M.white} />
        <Box s={[0.42, 0.24, 0.3]} p={[-0.3, 1.3, -0.3]} m={M.goldFoil} shadow={false} />
        <Box s={[0.3, 0.18, 0.3]} p={[0.35, 1.27, -0.35]} m={M.silver} shadow={false} />
      </Part>
      <Radial n={3} offset={Math.PI}>
        <Strut a={[0, 0.95, 0.7]} b={[0, 0.12, 1.25]} rad={0.045} shadow />
        <Strut a={[0.35, 0.95, 0.6]} b={[0, 0.25, 1.2]} rad={0.025} />
        <Strut a={[-0.35, 0.95, 0.6]} b={[0, 0.25, 1.2]} rad={0.025} />
        <Cyl rt={0.2} h={0.08} seg={12} p={[0, 0.05, 1.25]} m={M.silver} shadow={false} />
      </Radial>
      <Part name="panels">
        {[1, -1].map((k) => (
          <group key={k}>
            <Strut a={[k * 0.8, 1.1, 0]} b={[k * 1.25, 1.12, 0]} rad={0.03} />
            <Cyl rt={1.05} h={0.03} seg={10} p={[k * 2.25, 1.13, 0]} m={dusty ? M.solarDusty : M.solar} />
          </group>
        ))}
      </Part>
    </>
  )
}

/** Phoenix: stationary lander with two fan-shaped solar arrays and a 2.35 m digging arm. */
export function PhoenixLander() {
  return (
    <group>
      <LanderDeck />
      <Part name="mast">
        <Strut a={[0.45, 1.18, 0.35]} b={[0.45, 2.3, 0.35]} rad={0.03} m={M.silver} shadow />
        <Box s={[0.22, 0.14, 0.14]} p={[0.45, 2.36, 0.35]} m={M.white} shadow={false} />
        <Strut a={[-0.5, 1.18, 0.2]} b={[-0.5, 2.15, 0.2]} rad={0.015} m={M.silver} />
        <Ball rad={0.04} p={[-0.5, 2.18, 0.2]} m={M.white} shadow={false} />
      </Part>
      <Part name="arm">
        <Strut a={[0, 1.2, 0.7]} b={[0.1, 1.75, 1.7]} rad={0.035} m={M.silver} shadow />
        <Strut a={[0.1, 1.75, 1.7]} b={[0.25, 0.18, 2.75]} rad={0.035} m={M.silver} shadow />
        <Box s={[0.16, 0.14, 0.22]} p={[0.26, 0.12, 2.8]} m={M.alu} shadow={false} />
      </Part>
      <Part name="trench">
        <Box s={[0.5, 0.03, 0.95]} p={[0.35, 0.015, 3.15]} m={M.trench} shadow={false} />
        <Box s={[0.26, 0.035, 0.4]} p={[0.32, 0.02, 3.05]} m={M.ice} shadow={false} />
        <Box s={[0.4, 0.03, 0.7]} p={[-0.45, 0.015, 3.0]} r={[0, 0.3, 0]} m={M.trench} shadow={false} />
      </Part>
    </group>
  )
}

/** InSight: dust-covered arrays, SEIS dome and HP3 "mole" placed on the ground, RISE antennas. */
export function InSightLander() {
  return (
    <group>
      <LanderDeck dusty />
      <Part name="arm">
        <Strut a={[0.2, 1.2, 0.6]} b={[0.45, 2.0, 1.1]} rad={0.035} m={M.silver} shadow />
        <Strut a={[0.45, 2.0, 1.1]} b={[0.5, 1.15, 1.75]} rad={0.035} m={M.silver} shadow />
        <Box s={[0.12, 0.12, 0.12]} p={[0.5, 1.08, 1.78]} m={M.alu} shadow={false} />
      </Part>
      <Part name="seis">
        <mesh position={[-0.35, 0, 2.5]} material={M.white} castShadow>
          <sphereGeometry args={[0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <Cyl rt={0.56} rb={0.6} h={0.06} seg={20} p={[-0.35, 0.03, 2.5]} m={M.silver} shadow={false} />
        <Box s={[0.14, 0.01, 1.7]} p={[-0.25, 0.5, 1.55]} r={[0.6, -0.06, 0]} m={M.goldFoil} shadow={false} />
      </Part>
      <Part name="hp3">
        <Box s={[0.3, 0.2, 0.3]} p={[1.0, 0.25, 2.3]} m={M.goldFoil} />
        <Cyl rt={0.035} h={0.55} p={[1.0, 0.3, 2.3]} r={[0.15, 0, 0.1]} m={M.dark} shadow={false} />
        <Box s={[0.1, 0.01, 1.5]} p={[0.75, 0.5, 1.5]} r={[0.55, 0.25, 0]} m={M.goldFoil} shadow={false} />
      </Part>
      <Part name="rise">
        {[1, -1].map((k) => (
          <Cyl key={k} rt={0.1} rb={0.03} h={0.24} p={[k * 0.62, 1.3, 0.35]} r={[0.5, 0, -k * 0.5]} m={M.silver} shadow={false} />
        ))}
        <Strut a={[0, 1.18, -0.5]} b={[0, 1.9, -0.5]} rad={0.03} m={M.silver} />
      </Part>
    </group>
  )
}

/** Ingenuity (enlarged for visibility): box fuselage, four legs, two rotors, one blade broken. */
export function IngenuityHelicopter() {
  return (
    <group>
      <Part name="body">
        <Box s={[0.5, 0.55, 0.62]} p={[0, 0.8, 0]} m={M.goldFoil} />
        <Cyl rt={0.05} h={0.04} p={[0, 0.51, 0.15]} m={M.black} shadow={false} />
      </Part>
      <Part name="legs">
        <Radial n={4} offset={Math.PI / 4}>
          <Strut a={[0, 1.05, 0.25]} b={[0, 0.04, 1.15]} rad={0.018} m={M.dark} shadow />
          <Ball rad={0.05} p={[0, 0.04, 1.15]} m={M.dark} shadow={false} />
        </Radial>
      </Part>
      <Strut a={[0, 1.05, 0]} b={[0, 1.95, 0]} rad={0.03} m={M.dark} shadow />
      <Part name="rotors">
        {/* lower rotor: intact */}
        <group position={[0, 1.42, 0]} rotation={[0, 0.5, 0]}>
          <Box s={[3.6, 0.02, 0.16]} m={M.black} />
        </group>
        {/* upper rotor: one blade snapped short */}
        <group position={[0, 1.68, 0]} rotation={[0, -0.9, 0]}>
          <Box s={[1.8, 0.02, 0.16]} p={[0.9, 0, 0]} m={M.black} />
          <Box s={[0.75, 0.02, 0.16]} p={[-0.375, 0, 0]} m={M.black} />
          <Box s={[0.14, 0.02, 0.12]} p={[-0.78, -0.02, 0.03]} r={[0, 0.5, 0.4]} m={M.black} shadow={false} />
        </group>
      </Part>
      {/* the snapped blade tip lying on the sand */}
      <Box s={[0.95, 0.02, 0.15]} p={[-2.6, 0.02, 1.4]} r={[0, 0.8, 0]} m={M.black} shadow={false} />
      <Part name="panel">
        <Box s={[0.6, 0.02, 0.3]} p={[0, 1.97, 0]} m={M.solar} />
        <Strut a={[0.2, 1.97, 0]} b={[0.2, 2.25, 0]} rad={0.008} m={M.silver} />
      </Part>
    </group>
  )
}
