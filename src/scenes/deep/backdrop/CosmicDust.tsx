import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial } from 'three'

const vertex = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.07 + aPhase * 12.0) * 0.9;
    p.y += cos(uTime * 0.05 + aPhase * 9.0) * 0.7;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vAlpha = clamp(1.0 - dist / 90.0, 0.0, 1.0) * (0.35 + 0.35 * sin(uTime * 0.4 + aPhase * 30.0));
    gl_PointSize = aSize * uPixelRatio * (24.0 / max(dist, 1.0));
    gl_Position = projectionMatrix * mv;
  }
`
const fragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(0.62, 0.78, 0.95, a);
  }
`

function rand(seed: number) {
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** Sparse drifting particles near the camera path: gives real parallax and depth. */
export function CosmicDust({ count = 700, extent = 50 }: { count?: number; extent?: number }) {
  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const phase = new Float32Array(count)
    const size = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand(i * 5 + 1) * 2 - 1) * extent
      pos[i * 3 + 1] = (rand(i * 5 + 2) * 2 - 1) * extent * 0.6
      pos[i * 3 + 2] = (rand(i * 5 + 3) * 2 - 1) * extent
      phase[i] = rand(i * 5 + 4)
      size[i] = 0.6 + rand(i * 5 + 5) * 1.6
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aPhase', new BufferAttribute(phase, 1))
    g.setAttribute('aSize', new BufferAttribute(size, 1))
    const m = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    return { geometry: g, material: m }
  }, [count, extent])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
