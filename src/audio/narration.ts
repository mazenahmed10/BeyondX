import { create } from 'zustand'

/**
 * The single narration channel of the app. There is exactly ONE <audio> element, so two
 * recordings can never play at once. Only original, team-supplied recordings are played:
 * no speech synthesis, no generated audio. Nothing ever starts without a user gesture.
 */
export type NarrationStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'

interface NarrationState {
  src: string | null
  status: NarrationStatus
  time: number
  duration: number
  muted: boolean
  volume: number
}

export const useNarration = create<NarrationState>(() => ({
  src: null,
  status: 'idle',
  time: 0,
  duration: 0,
  muted: false,
  volume: 0.9,
}))

let el: HTMLAudioElement | null = null

function element(): HTMLAudioElement | null {
  if (el || typeof Audio === 'undefined') return el
  el = new Audio()
  el.preload = 'none'
  const set = useNarration.setState
  el.addEventListener('playing', () => set({ status: 'playing' }))
  el.addEventListener('pause', () => {
    if (el && !el.ended && useNarration.getState().status === 'playing') set({ status: 'paused' })
  })
  el.addEventListener('ended', () => set({ status: 'ended' }))
  el.addEventListener('timeupdate', () => el && set({ time: el.currentTime }))
  el.addEventListener('durationchange', () => el && Number.isFinite(el.duration) && set({ duration: el.duration }))
  el.addEventListener('error', () => {
    if (useNarration.getState().src) set({ status: 'error' })
  })
  return el
}

export const narration = {
  /** Select the recording for the current story/mode. Stops whatever was playing. Does not play. */
  select(src: string | null) {
    const a = element()
    if (useNarration.getState().src === src) return
    if (a) {
      a.pause()
      a.removeAttribute('src')
      a.load()
    }
    useNarration.setState({ src, status: 'idle', time: 0, duration: 0 })
  },
  play() {
    const a = element()
    const { src, status, muted, volume } = useNarration.getState()
    if (!a || !src || status === 'error') return
    if (!a.getAttribute('src')) {
      a.src = src
      useNarration.setState({ status: 'loading' })
    }
    a.muted = muted
    a.volume = volume
    a.play().catch(() => useNarration.setState({ status: 'error' }))
  },
  pause() {
    element()?.pause()
  },
  replay() {
    const a = element()
    if (!a || !useNarration.getState().src) return
    if (a.getAttribute('src')) a.currentTime = 0
    narration.play()
  },
  seek(t: number) {
    const a = element()
    if (a && a.getAttribute('src') && Number.isFinite(t)) a.currentTime = t
  },
  setMuted(muted: boolean) {
    const a = element()
    if (a) a.muted = muted
    useNarration.setState({ muted })
  },
  setVolume(volume: number) {
    const v = Math.max(0, Math.min(1, volume))
    const a = element()
    if (a) a.volume = v
    useNarration.setState({ volume: v })
  },
  /** Leaving a story: silence and release the recording. */
  stop() {
    narration.select(null)
  },
}
