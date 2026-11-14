import { useMemo } from 'react'
import { AdditiveBlending, Color, FrontSide, ShaderMaterial } from 'three'

const vertex = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormalV), normalize(vViewDir))), uPower);
    gl_FragColor = vec4(uColor, 1.0) * fres * uStrength;
  }
`

interface AtmosphereProps {
  radius: number
  color: string
  strength?: number
  power?: number
  scale?: number
}

/** Fresnel rim glow rendered on a slightly larger sphere. */
export function Atmosphere({ radius, color, strength = 1.1, power = 3.2, scale = 1.07 }: AtmosphereProps) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uPower: { value: power },
          uStrength: { value: strength },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: FrontSide,
      }),
    [color, power, strength],
  )
  return (
    <mesh scale={scale} material={material} raycast={() => null}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  )
}
