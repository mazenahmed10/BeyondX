import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial, Vector3 } from 'three'

const COUNT = 6
const TRAIL = 20

const vertex = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(0.85, 0.95, 1.0, a);
  }
`

const tmp = new Vector3()

/** Meteors with fading point trails. All buffers are pre-allocated; nothing is created per frame. */
export function ShootingStars() {
  const state = useMemo(() => {
    const positions = new Float32Array(COUNT * TRAIL * 3)
    const alphas = new Float32Array(COUNT * TRAIL)
    const sizes = new Float32Array(COUNT * TRAIL)
    for (let i = 0; i < COUNT; i++) {
      for (let k = 0; k < TRAIL; k++) sizes[i * TRAIL + k] = 6.5 * (1 - k / TRAIL) + 1.2
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('aAlpha', new BufferAttribute(alphas, 1))
    geometry.setAttribute('aSize', new BufferAttribute(sizes, 1))
    const material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: { uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    return {
      geometry,
      material,
      positions,
      alphas,
      head: Array.from({ length: COUNT }, () => new Vector3()),
      dir: Array.from({ length: COUNT }, () => new Vector3()),
      age: new Float32Array(COUNT).map((_, i) => -i * 1.7 - 0.5),
      spawned: new Uint8Array(COUNT),
      duration: new Float32Array(COUNT).fill(1.4),
      speed: new Float32Array(COUNT).fill(70),
    }
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const { positions, alphas, head, dir, age, duration, speed, spawned } = state
    for (let i = 0; i < COUNT; i++) {
      age[i] += dt
      if (age[i] < 0) {
        for (let k = 0; k < TRAIL; k++) alphas[i * TRAIL + k] = 0
        continue
      }
      if (!spawned[i]) {
        // spawn on a far shell with a random tangential direction
        const u = Math.random() * 2 - 1
        const th = Math.random() * Math.PI * 2
        const r = 70 + Math.random() * 40
        const s = Math.sqrt(1 - u * u)
        head[i].set(r * s * Math.cos(th), r * u, r * s * Math.sin(th))
        tmp.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        dir[i].copy(head[i]).normalize().cross(tmp).normalize()
        speed[i] = 55 + Math.random() * 40
        duration[i] = 1 + Math.random() * 0.9
        spawned[i] = 1
        age[i] = 0
      }
      const t = age[i] / duration[i]
      if (t > 1) {
        spawned[i] = 0
        age[i] = -(1.5 + Math.random() * 4)
        for (let k = 0; k < TRAIL; k++) alphas[i * TRAIL + k] = 0
        continue
      }
      const active = t >= 0
      if (active) head[i].addScaledVector(dir[i], speed[i] * dt)
      const fade = active ? Math.sin(Math.PI * t) : 0
      for (let k = 0; k < TRAIL; k++) {
        const idx = i * TRAIL + k
        tmp.copy(head[i]).addScaledVector(dir[i], -k * 0.9)
        positions[idx * 3] = tmp.x
        positions[idx * 3 + 1] = tmp.y
        positions[idx * 3 + 2] = tmp.z
        alphas[idx] = fade * (1 - k / TRAIL)
      }
    }
    state.geometry.attributes.position.needsUpdate = true
    state.geometry.attributes.aAlpha.needsUpdate = true
  })

  return <points geometry={state.geometry} material={state.material} frustumCulled={false} />
}
