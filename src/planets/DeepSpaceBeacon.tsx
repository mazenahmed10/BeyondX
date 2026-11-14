import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { AdditiveBlending, Color, MathUtils, ShaderMaterial, type Group } from 'three'
import { useAppStore } from '../app/store'
import { NOISE_GLSL } from '../scenes/deep/glsl'

const vertex = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying vec3 vObj;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    vObj = position;
    gl_Position = projectionMatrix * mv;
  }
`
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying vec3 vObj;
  ${NOISE_GLSL}
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vNormalV), normalize(vViewDir))), 1.8);
    float n = fbm(vObj * 2.2 + vec3(uTime * 0.12, uTime * 0.07, 0.0));
    vec3 col = mix(uColorA, uColorB, n) * (0.35 + 1.25 * f) * (0.9 + uHover * 0.6);
    gl_FragColor = vec4(col, (0.25 + f * 0.85) * (0.8 + uHover * 0.2));
  }
`

const POSITION: [number, number, number] = [0, 0.1, -7.5]
const RADIUS = 1.15

/** Hub object for the Deep Space world: a swirling nebula orb with small probes in orbit (not to scale). */
export function DeepSpaceBeacon() {
  const group = useRef<Group>(null)
  const probes = useRef<Group>(null)
  const scale = useRef(1)
  const hover = useRef(0)
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uColorA: { value: new Color('#2a56c8') },
          uColorB: { value: new Color('#c65a9a') },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  )

  useFrame((state, delta) => {
    const { phase, hoveredPlanet } = useAppStore.getState()
    const visible = phase === 'HUB'
    const hovered = visible && hoveredPlanet === 'deep'
    scale.current = MathUtils.damp(scale.current, !visible ? 0.001 : hovered ? 1.1 : 1, 4, delta)
    hover.current = MathUtils.damp(hover.current, hovered ? 1 : 0, 5, delta)
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uHover.value = hover.current
    if (group.current) {
      group.current.scale.setScalar(scale.current)
      group.current.visible = scale.current > 0.01
    }
    if (probes.current) probes.current.rotation.y += delta * 0.35
  })

  const interactive = () => useAppStore.getState().phase === 'HUB'
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive()) return
    e.stopPropagation()
    useAppStore.getState().setHoveredPlanet('deep')
    document.body.style.cursor = 'pointer'
  }
  const onOut = () => {
    if (useAppStore.getState().hoveredPlanet === 'deep') useAppStore.getState().setHoveredPlanet(null)
    document.body.style.cursor = ''
  }
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive()) return
    e.stopPropagation()
    document.body.style.cursor = ''
    useAppStore.getState().enterDeepSpace()
  }

  return (
    <group ref={group} position={POSITION}>
      <mesh material={material} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
      </mesh>
      <group ref={probes} rotation={[0.5, 0, 0.35]}>
        {[0, 2.1, 4.2].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 1.9, 0, Math.sin(a) * 1.9]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color="#cfe9ff" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
