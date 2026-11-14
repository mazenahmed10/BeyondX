import { useMemo } from 'react'
import { BackSide, Color, ShaderMaterial } from 'three'

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragment = /* glsl */ `
  uniform vec3 uHorizon;
  uniform vec3 uZenith;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y, 0.0, 1.0);
    vec3 col = mix(uHorizon, uZenith, pow(h, 0.55));
    float sun = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);
    col += uSunColor * (pow(sun, 6.0) * 0.35 + pow(sun, 220.0) * 1.1);
    float below = smoothstep(0.0, -0.12, vDir.y);
    col = mix(col, uHorizon * 0.8, below);
    gl_FragColor = vec4(col, 1.0);
  }
`

interface Props {
  horizon: string
  zenith: string
  sunDir: [number, number, number]
  sunColor: string
}

/** Dusty Martian sky: butterscotch horizon fading to a dim, desaturated zenith. */
export function SkyDome({ horizon, zenith, sunDir, sunColor }: Props) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uHorizon: { value: new Color(horizon) },
          uZenith: { value: new Color(zenith) },
          uSunDir: { value: sunDir },
          uSunColor: { value: new Color(sunColor) },
        },
        side: BackSide,
        depthWrite: false,
        fog: false,
      }),
    [horizon, zenith, sunDir, sunColor],
  )
  return (
    <mesh material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[320, 32, 16]} />
    </mesh>
  )
}
