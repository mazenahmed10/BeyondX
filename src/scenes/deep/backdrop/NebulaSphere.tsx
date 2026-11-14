import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BackSide, Color, ShaderMaterial } from 'three'
import { NOISE_GLSL } from '../glsl'

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uStrength;
  varying vec3 vDir;
  ${NOISE_GLSL}
  void main() {
    vec3 d = normalize(vDir);
    vec3 p = d * 2.1 + vec3(0.0, uTime * 0.004, uTime * 0.007);
    float n = fbm(p * 1.25);
    float m = fbm(p * 2.9 + 7.0);
    float cloud = smoothstep(0.44, 0.86, n);
    vec3 col = mix(uColorA, uColorB, m) * cloud;
    col += uColorB * pow(smoothstep(0.62, 1.0, m), 3.0) * 0.18 * cloud;
    gl_FragColor = vec4(col * uStrength, 1.0);
  }
`

interface Props {
  colorA?: string
  colorB?: string
  strength?: number
}

/** Slowly drifting shader nebula on a large inverted sphere (single draw call). */
export function NebulaSphere({ colorA = '#1b2b6b', colorB = '#7a2f5c', strength = 0.55 }: Props) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new Color(colorA) },
          uColorB: { value: new Color(colorB) },
          uStrength: { value: strength },
        },
        side: BackSide,
        depthWrite: false,
        fog: false,
      }),
    [colorA, colorB, strength],
  )
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })
  return (
    <mesh material={material} renderOrder={-20} frustumCulled={false}>
      <sphereGeometry args={[250, 32, 20]} />
    </mesh>
  )
}
