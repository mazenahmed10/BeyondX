import { useAppStore } from '../../app/store'

/** Black cross-fade layer driven by the camera rig during cinematic cuts. */
export function FadeOverlay() {
  const fade = useAppStore((s) => s.fade)
  return <div className="pointer-events-none absolute inset-0 z-40 bg-black" style={{ opacity: fade }} />
}
