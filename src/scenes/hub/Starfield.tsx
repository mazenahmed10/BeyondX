import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, ShaderMaterial, type Points } from 'three'

const vertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vTwinkle = 0.72 + 0.28 * sin(uTime * (0.6 + aPhase) + aPhase * 40.0);
    vColor = aColor;
    gl_PointSize = aSize * uPixelRatio * vTwinkle;
    gl_Position = projectionMatrix * mv;
  }
`

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vTwinkle);
  }
`

function rand(seed: number) {
  // mulberry32: deterministic so the sky never changes between loads
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export function Starfield({ count = 3500 }: { count?: number }) {
  const points = useRef<Points>(null)

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const size = new Float32Array(count)
    const phase = new Float32Array(count)
    const col = new Float32Array(count * 3)
    const tints = [new Color('#ffffff'), new Color('#bcd8ff'), new Color('#ffe7c2'), new Color('#9fe3ee')]
    for (let i = 0; i < count; i++) {
      const u = rand(i * 4 + 1) * 2 - 1
      const theta = rand(i * 4 + 2) * Math.PI * 2
      const r = 70 + rand(i * 4 + 3) * 50
      const s = Math.sqrt(1 - u * u)
      pos[i * 3] = r * s * Math.cos(theta)
      pos[i * 3 + 1] = r * u
      pos[i * 3 + 2] = r * s * Math.sin(theta)
      const bright = rand(i * 4 + 4)
      size[i] = 1.2 + Math.pow(bright, 6) * 5
      phase[i] = rand(i * 7 + 9)
      const tint = tints[Math.floor(rand(i * 5 + 3) * tints.length)]
      const dim = 0.45 + bright * 0.55
      col[i * 3] = tint.r * dim
      col[i * 3 + 1] = tint.g * dim
      col[i * 3 + 2] = tint.b * dim
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aSize', new BufferAttribute(size, 1))
    g.setAttribute('aPhase', new BufferAttribute(phase, 1))
    g.setAttribute('aColor', new BufferAttribute(col, 3))
    const m = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    return { geometry: g, material: m }
  }, [count])

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    if (points.current) points.current.rotation.y += delta * 0.004
  })

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}
