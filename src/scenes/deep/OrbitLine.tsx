import { useEffect, useMemo } from 'react'
import { BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, LineDashedMaterial, Vector3 } from 'three'

interface RingProps {
  radius: number
  tilt?: number
  color?: string
  opacity?: number
  center?: [number, number, number]
}

/** Closed circle in the XZ plane, optionally tilted about X (matches orbitPoint()). */
export function OrbitRing({ radius, tilt = 0, color = '#7fd8e6', opacity = 0.35, center = [0, 0, 0] }: RingProps) {
  const line = useMemo(() => {
    const pts: Vector3[] = []
    const n = 160
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2
      const x = radius * Math.cos(a)
      const z = radius * Math.sin(a)
      pts.push(new Vector3(x, -z * Math.sin(tilt), z * Math.cos(tilt)))
    }
    const g = new BufferGeometry().setFromPoints(pts)
    return new Line(g, new LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }))
  }, [radius, tilt, color, opacity])

  useEffect(
    () => () => {
      line.geometry.dispose()
      ;(line.material as LineBasicMaterial).dispose()
    },
    [line],
  )
  return <primitive object={line} position={center} />
}

interface PathProps {
  points: [number, number, number][]
  color?: string
  opacity?: number
}

/** Dashed smooth curve for illustrative trajectories (always labelled as such in the UI). */
export function DashedPath({ points, color = '#e8b45a', opacity = 0.75 }: PathProps) {
  const line = useMemo(() => {
    const curve = new CatmullRomCurve3(points.map((p) => new Vector3(...p)))
    const g = new BufferGeometry().setFromPoints(curve.getPoints(260))
    const l = new Line(g, new LineDashedMaterial({ color, dashSize: 1.1, gapSize: 0.8, transparent: true, opacity, depthWrite: false }))
    l.computeLineDistances()
    return l
  }, [points, color, opacity])
  useEffect(
    () => () => {
      line.geometry.dispose()
      ;(line.material as LineDashedMaterial).dispose()
    },
    [line],
  )
  return <primitive object={line} />
}
