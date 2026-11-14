import gsap from 'gsap'
import { PerspectiveCamera, Vector3 } from 'three'
import type { CameraPose } from './poses'

export interface FlyOptions {
  duration?: number
  ease?: string
  onComplete?: () => void
}

/**
 * Single owner of the camera. Nothing else may write camera.position / lookAt.
 * GSAP animates two proxy vectors (base position + look target); update() applies
 * them every frame together with a very small idle drift and pointer parallax.
 * Later phases add OrbitControls sync through `isAnimating` + `snapshot()`.
 */
export class CameraDirector {
  readonly camera: PerspectiveCamera
  readonly base = new Vector3()
  readonly lookTarget = new Vector3()

  driftAmount = 0.12
  parallaxAmount = 0.35
  /** When true, OrbitControls owns the camera and update() leaves it alone. */
  manual = false

  private timeline: gsap.core.Timeline | null = null
  private animating = false
  private onAnimatingChange?: (animating: boolean) => void

  constructor(camera: PerspectiveCamera, initial: CameraPose, onAnimatingChange?: (a: boolean) => void) {
    this.camera = camera
    this.onAnimatingChange = onAnimatingChange
    this.base.set(...initial.position)
    this.lookTarget.set(...initial.target)
    this.apply(0, 0, 0)
  }

  get isAnimating(): boolean {
    return this.animating
  }

  private setAnimating(value: boolean) {
    if (this.animating === value) return
    this.animating = value
    this.onAnimatingChange?.(value)
  }

  /** Start the next flight from where the camera actually is (after manual orbiting). */
  captureCurrent(target: Vector3) {
    this.base.copy(this.camera.position)
    this.lookTarget.copy(target)
  }

  flyTo(pose: CameraPose, { duration = 2.6, ease = 'power3.inOut', onComplete }: FlyOptions = {}) {
    this.timeline?.kill()
    this.manual = false
    this.setAnimating(true)
    const tl = gsap.timeline({
      onComplete: () => {
        this.setAnimating(false)
        onComplete?.()
      },
    })
    tl.to(this.base, { x: pose.position[0], y: pose.position[1], z: pose.position[2], duration, ease }, 0)
    tl.to(this.lookTarget, { x: pose.target[0], y: pose.target[1], z: pose.target[2], duration, ease }, 0)
    this.timeline = tl
  }

  /** Jump without animation (first mount, resets). */
  snapTo(pose: CameraPose) {
    this.timeline?.kill()
    this.manual = false
    this.setAnimating(false)
    this.base.set(...pose.position)
    this.lookTarget.set(...pose.target)
  }

  update(time: number, pointerX: number, pointerY: number) {
    this.apply(time, pointerX, pointerY)
  }

  private apply(time: number, px: number, py: number) {
    if (this.manual) return
    const d = this.driftAmount
    this.camera.position.set(
      this.base.x + Math.sin(time * 0.17) * d + px * this.parallaxAmount,
      this.base.y + Math.cos(time * 0.13) * d * 0.6 + py * this.parallaxAmount * 0.6,
      this.base.z,
    )
    this.camera.lookAt(this.lookTarget)
  }

  dispose() {
    this.timeline?.kill()
    this.timeline = null
  }
}
