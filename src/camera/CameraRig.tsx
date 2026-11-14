import { useEffect, useRef, type ElementRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import { Vector3, type PerspectiveCamera, type Vector3Tuple } from 'three'
import { CameraDirector } from './CameraDirector'
import { HUB_POSE, SURFACE_GROUND_POSE, SURFACE_HIGH_POSE, planetViewPose, type CameraPose } from './poses'
import { useAppStore } from '../app/store'
import { PLANETS, type PlanetId } from '../planets/planetConfig'
import { surfaceRegistry } from '../terrain/surfaceRegistry'
import { isDeepPhase } from '../app/phaseMachine'
import { getMission } from '../data/missions'
import { DEEP_HUB_LIMITS, ENVIRONMENTS, deepHubPose } from '../scenes/deep/environments'
import { SUN_HORIZONTAL, getSite, siteGroundY } from '../scenes/surface/sites'

type Controls = ElementRef<typeof OrbitControls>
type Mode = 'hub' | 'planet' | 'surface' | 'deep'

interface DeepLimits {
  min: number
  max: number
  center: Vector3Tuple
  radius: number
}

/** Ground pose with y taken from the actual terrain, so the camera never starts underground. */
function groundPose(planet: PlanetId): CameraPose {
  const base = SURFACE_GROUND_POSE[planet]
  const h = surfaceRegistry.heightAt
  if (!h) return base
  return {
    position: [base.position[0], h(base.position[0], base.position[2]) + 3.3, base.position[2]],
    target: [base.target[0], h(base.target[0], base.target[2]) + 1.8, base.target[2]],
  }
}

const ORBIT_FOV = 38
const SURFACE_FOV = 50

/**
 * The only component allowed to move the camera. Cinematic moves are GSAP-driven
 * through CameraDirector while OrbitControls is disabled; when a move ends the
 * controls are re-targeted, re-limited and re-enabled (hand-off).
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const controlsRef = useRef<Controls>(null)
  const directorRef = useRef<CameraDirector | null>(null)
  const firstRun = useRef(true)
  const prevPhase = useRef<string>('HUB')
  const surfaceEntered = useRef(false)
  const bounds = useRef({ center: new Vector3(), radius: 1e9 })
  const mode = useRef<Mode>('hub')
  const tweens = useRef<gsap.core.Tween[]>([])

  const phase = useAppStore((s) => s.phase)
  const selectedPlanet = useAppStore((s) => s.selectedPlanet)
  const selectedMission = useAppStore((s) => s.selectedMission)
  const selectedDiscovery = useAppStore((s) => s.selectedDiscovery)

  useEffect(() => {
    const director = new CameraDirector(camera, HUB_POSE, (animating) =>
      useAppStore.getState().setExplorationState(animating ? 'transitioning' : 'idle'),
    )
    directorRef.current = director
    firstRun.current = true
    return () => {
      director.dispose()
      directorRef.current = null
      tweens.current.forEach((t) => t.kill())
    }
  }, [camera])

  useEffect(() => {
    const director = directorRef.current
    const controls = controlsRef.current
    if (!director || !controls) return
    const store = useAppStore.getState()
    const prev = prevPhase.current
    prevPhase.current = phase

    const setFov = (fov: number) => {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    const tween = (vars: gsap.TweenVars, target: object) => {
      const t = gsap.to(target, vars)
      tweens.current.push(t)
      return t
    }
    const fadeTo = (value: number, duration: number, delay = 0, onComplete?: () => void) => {
      const proxy = { v: store.fade }
      return tween(
        {
          v: value,
          duration,
          delay,
          ease: 'power1.inOut',
          onUpdate: () => useAppStore.getState().setFade(proxy.v),
          onComplete,
        },
        proxy,
      )
    }

    const handoff = (pose: CameraPose, m: Mode, planet: PlanetId | null, limits?: DeepLimits, closeUp?: { min: number; max: number }) => {
      const c = controlsRef.current
      if (!c) return
      mode.current = m
      c.target.set(...pose.target)
      if (m === 'hub') {
        c.enableRotate = false
        c.enablePan = false
        c.minDistance = 6
        c.maxDistance = 16
        c.minPolarAngle = 0
        c.maxPolarAngle = Math.PI
        bounds.current = { center: new Vector3(...pose.target), radius: 1e9 }
      } else if (m === 'deep' && limits) {
        c.enableRotate = true
        c.enablePan = true
        c.screenSpacePanning = true
        c.minDistance = limits.min
        c.maxDistance = limits.max
        c.minPolarAngle = 0
        c.maxPolarAngle = Math.PI
        bounds.current = { center: new Vector3(...limits.center), radius: limits.radius }
      } else if (m === 'planet' && planet) {
        const cfg = PLANETS[planet]
        c.enableRotate = true
        c.enablePan = true
        c.screenSpacePanning = true
        c.minDistance = cfg.radius * 1.7
        c.maxDistance = cfg.radius * 9
        c.minPolarAngle = 0
        c.maxPolarAngle = Math.PI
        bounds.current = { center: new Vector3(...cfg.position), radius: cfg.radius * 1.1 }
      } else {
        c.enableRotate = true
        c.enablePan = true
        c.screenSpacePanning = false
        c.minDistance = closeUp?.min ?? 4
        c.maxDistance = closeUp?.max ?? 85
        c.minPolarAngle = 0.15
        c.maxPolarAngle = 1.48
        bounds.current = { center: new Vector3(0, pose.target[1], 0), radius: 75 }
      }
      c.update()
      director.manual = true
      c.enabled = true
    }

    const poseFor = (planet: PlanetId | null, hub: boolean): CameraPose =>
      hub || !planet ? HUB_POSE : planetViewPose(planet)

    // ---- DEEP SPACE: hub -> mission selection -> mission environment (-> story overlay) ----
    if (isDeepPhase(phase)) {
      if (phase === 'STORY') {
        controls.enabled = false // story overlay owns the screen; camera stays where it is
        return
      }
      if (phase === 'MISSION' && prev === 'STORY') {
        controls.enabled = true // coming back from the story: same spot, same focus
        return
      }
      let pose: CameraPose
      let limits: DeepLimits
      if (phase === 'DEEP_SPACE') {
        pose = deepHubPose(camera.aspect)
        limits = DEEP_HUB_LIMITS
      } else {
        const mission = getMission(selectedMission)
        if (!mission) return
        const env = ENVIRONMENTS[mission.environmentId]
        const focused = selectedDiscovery === mission.id
        pose = focused ? env.focus : env.overview
        limits = {
          min: focused ? Math.max(1, env.minDistance) : env.minDistance,
          max: focused ? Math.min(env.maxDistance, 14) : env.maxDistance,
          center: env.center,
          radius: env.radius + (focused ? 6 : 0),
        }
      }
      controls.enabled = false
      if (camera.fov !== ORBIT_FOV) setFov(ORBIT_FOV)
      director.captureCurrent(controls.target.clone() as Vector3)
      director.flyTo(pose, {
        duration: phase === 'MISSION' && prev === 'MISSION' ? 1.8 : 2.8,
        onComplete: () => handoff(pose, 'deep', null, limits),
      })
      return
    }

    // ---- DESCENT: orbit -> atmosphere/ground (cross-fade) -> terrain reveal ----
    if (phase === 'DESCENT' && selectedPlanet) {
      const cfg = PLANETS[selectedPlanet]
      const center = new Vector3(...cfg.position)
      const dir = camera.position.clone().sub(center).normalize()
      const approach: CameraPose = {
        position: center.clone().addScaledVector(dir, cfg.radius * 1.2).toArray(),
        target: cfg.position,
      }
      controls.enabled = false
      director.captureCurrent(controls.target.clone())
      const fov = { v: camera.fov }
      tween({ v: 64, duration: 3.6, ease: 'power2.in', onUpdate: () => setFov(fov.v) }, fov)
      fadeTo(1, 0.9, 2.8)
      director.flyTo(approach, {
        duration: 3.6,
        ease: 'power2.in',
        onComplete: () => {
          surfaceEntered.current = true
          useAppStore.getState().setPhase('SURFACE')
          setFov(SURFACE_FOV)
          director.snapTo(SURFACE_HIGH_POSE[selectedPlanet])
          director.update(0, 0, 0)
          fadeTo(0, 1.6, 0.15)
          const ground = groundPose(selectedPlanet)
          director.flyTo(ground, {
            duration: 5,
            ease: 'power3.out',
            onComplete: () => handoff(ground, 'surface', selectedPlanet),
          })
        },
      })
      return
    }

    // ---- SURFACE / DISCOVERY ----
    if (phase === 'SURFACE' || phase === 'DISCOVERY') {
      // Discovery: cinematic fly-in that frames the selected equipment beside the story panel.
      const site = phase === 'DISCOVERY' ? getSite(selectedDiscovery) : null
      if (site && selectedPlanet && surfaceEntered.current) {
        const groundY = siteGroundY(site)
        const centre = new Vector3(site.x, groundY + site.height * 0.42, site.z)
        const current = camera.position.clone().sub(centre)
        current.y = 0
        if (current.lengthSq() < 0.01) current.set(0, 0, 1)
        current.normalize()
        // Arrive on the sunlit side (three-quarter light), from whichever flank is closer to
        // where the camera already is, so the reveal is never a view of the shadowed face.
        const [sx, sz] = SUN_HORIZONTAL[selectedPlanet]
        const flank = (angle: number) => new Vector3(sx * Math.cos(angle) - sz * Math.sin(angle), 0, sx * Math.sin(angle) + sz * Math.cos(angle))
        const a = flank(0.65)
        const b = flank(-0.65)
        const from = a.dot(current) >= b.dot(current) ? a : b
        const wide = window.innerWidth >= 768
        // Portrait screens see less to the sides and lose the lower part to the story sheet: stand further back.
        const distance = wide ? site.focus : site.focus * 1.55
        const position = centre.clone().addScaledVector(from, distance)
        position.y = centre.y + distance * 0.26 + 0.8
        const terrain = surfaceRegistry.heightAt
        if (terrain) position.y = Math.max(position.y, terrain(position.x, position.z) + 1.6)
        // Look slightly past the object so it sits clear of the story panel
        // (panel is on the right on wide screens, at the bottom on phones).
        const right = new Vector3(-from.z, 0, from.x)
        const target = centre.clone()
        if (wide) target.addScaledVector(right, -distance * 0.2)
        else {
          // aim at the ground in front of the object, so the object sits in the upper part of the screen
          target.addScaledVector(from, distance * 0.5)
          target.y = groundY + 0.7
        }
        const pose: CameraPose = { position: position.toArray(), target: target.toArray() }
        controls.enabled = false
        director.captureCurrent(controls.target.clone() as Vector3)
        director.flyTo(pose, {
          duration: 3.2,
          ease: 'power2.inOut',
          onComplete: () => handoff(pose, 'surface', selectedPlanet, undefined, { min: Math.max(3, site.radius * 0.9), max: site.focus * 2.6 }),
        })
        return
      }
      if (phase === 'SURFACE' && prev === 'DISCOVERY' && selectedPlanet && surfaceEntered.current) {
        // Story closed: pull back and up, then give the free camera back.
        const target = controls.target.clone() as Vector3
        const back = camera.position.clone().sub(target)
        back.y = 0
        if (back.lengthSq() < 0.01) back.set(0, 0, 1)
        back.normalize()
        const position = camera.position.clone().addScaledVector(back, 12)
        position.y += 4.5
        const pose: CameraPose = { position: position.toArray(), target: target.toArray() }
        controls.enabled = false
        director.captureCurrent(target)
        director.flyTo(pose, { duration: 1.8, ease: 'power2.inOut', onComplete: () => handoff(pose, 'surface', selectedPlanet) })
        return
      }
      if (surfaceEntered.current) return
      // Fallback (not reached through normal flow): place the camera on the ground.
      if (selectedPlanet) {
        setFov(SURFACE_FOV)
        const ground = groundPose(selectedPlanet)
        director.snapTo(ground)
        director.update(0, 0, 0)
        surfaceEntered.current = true
        handoff(ground, 'surface', selectedPlanet)
      }
      return
    }

    // ---- HUB / PLANET_VIEW ----
    const inHub = phase === 'HUB' || !selectedPlanet
    const pose = poseFor(selectedPlanet, inHub)
    const m: Mode = inHub ? 'hub' : 'planet'

    controls.enabled = false

    if (firstRun.current) {
      firstRun.current = false
      director.snapTo(pose)
      director.update(0, 0, 0)
      handoff(pose, m, selectedPlanet)
      return
    }

    if (prev === 'SURFACE' || prev === 'DISCOVERY') {
      // Leaving the surface: dip to black, reset to orbit, fade back in.
      surfaceEntered.current = false
      fadeTo(1, 0.7, 0, () => {
        setFov(ORBIT_FOV)
        director.snapTo(pose)
        director.update(0, 0, 0)
        handoff(pose, m, selectedPlanet)
        fadeTo(0, 1.1)
      })
      return
    }

    if (camera.fov !== ORBIT_FOV) setFov(ORBIT_FOV)
    director.captureCurrent(controls.target.clone() as Vector3)
    director.flyTo(pose, {
      duration: inHub ? 2.2 : 2.8,
      onComplete: () => handoff(pose, m, selectedPlanet),
    })
  }, [phase, selectedPlanet, selectedMission, selectedDiscovery, camera])

  useFrame((state) => {
    const director = directorRef.current
    const controls = controlsRef.current
    director?.update(state.clock.elapsedTime, state.pointer.x, state.pointer.y)
    if (!director?.manual || !controls) return

    // Keep the free camera inside its playground.
    const { center, radius } = bounds.current
    const offset = controls.target.clone().sub(center)
    if (offset.length() > radius) {
      offset.setLength(radius)
      controls.target.copy(center).add(offset)
    }
    if (mode.current === 'surface' && surfaceRegistry.heightAt) {
      const floor = surfaceRegistry.heightAt(camera.position.x, camera.position.z) + 1.0
      if (camera.position.y < floor) camera.position.y = floor
      const tFloor = surfaceRegistry.heightAt(controls.target.x, controls.target.z) + 0.6
      if (controls.target.y < tFloor) controls.target.y = tFloor
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
      panSpeed={0.8}
    />
  )
}
