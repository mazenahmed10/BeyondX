import { useKidStore } from '../app/kidStore'

/**
 * Tiny interface sounds for Kids Mode only (short sine "blips", no samples, no voices).
 * Quiet by design, and silent when the kid sound toggle is off.
 */
let ctx: AudioContext | null = null

function tone(freq: number, dur = 0.14, vol = 0.045, delay = 0, type: OscillatorType = 'sine') {
  const { kidMode, voiceOn } = useKidStore.getState()
  if (!kidMode || !voiceOn) return
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = ctx ?? new AC()
    const t = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + dur + 0.02)
  } catch {
    /* audio is optional */
  }
}

export const sfx = {
  tap: () => tone(520, 0.07, 0.03),
  found: () => {
    tone(330, 0.3)
    tone(495, 0.35, 0.035, 0.12)
  },
  right: () => {
    tone(523, 0.13)
    tone(659, 0.13, 0.045, 0.11)
    tone(784, 0.25, 0.045, 0.22)
  },
  wrong: () => tone(190, 0.22, 0.04, 0, 'triangle'),
  done: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, 0.04, i * 0.1))
  },
}
