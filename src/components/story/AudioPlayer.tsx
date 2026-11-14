import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { narration, useNarration } from '../../audio/narration'

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

interface Props {
  /** Recording for the current story and mode, or null when none was supplied. */
  src: string | null
  kid: boolean
  sharedNote: string | null
}

/**
 * Controls for the single narration channel: play / pause / resume, replay, mute, volume.
 * Never auto-plays. If there is no recording it says so plainly; it never falls back to
 * text-to-speech or to another story's recording.
 */
export function AudioPlayer({ src, kid, sharedNote }: Props) {
  const { status, time, duration, muted, volume } = useNarration()
  const unavailable = !src || status === 'error'
  const playing = status === 'playing' || status === 'loading'

  if (unavailable) {
    return (
      <div className="story-audio rounded-sm border border-dashed border-white/20 px-3 py-2.5 text-xs text-white/55" role="status">
        <span className="font-mono tracking-[0.2em]">AUDIO RECORDING UNAVAILABLE</span>
        <span className="mt-1 block text-[11px] text-white/45">The story continues below as text.</span>
      </div>
    )
  }

  const pct = duration > 0 ? Math.min(100, (time / duration) * 100) : 0
  const iconBtn =
    'story-audio-btn flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft'

  return (
    <div className="story-audio rounded-sm border border-white/12 bg-black/25 px-3 py-2.5">
      <p className="story-kicker font-mono text-[9px] tracking-[0.25em] text-cyan-soft/80">
        {kid ? '🎧 LISTEN TO THE STORY' : 'NARRATION · ORIGINAL TEAM RECORDING'}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => (playing ? narration.pause() : status === 'ended' ? narration.replay() : narration.play())}
          className={`${iconBtn} story-audio-main border-gold/70 text-gold`}
          aria-label={playing ? 'Pause narration' : status === 'paused' ? 'Resume narration' : 'Play narration'}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={() => narration.replay()} className={iconBtn} aria-label="Replay narration from the start">
          <RotateCcw size={14} />
        </button>
        <div className="min-w-0 flex-1">
          <div
            className="story-audio-track h-1.5 cursor-pointer overflow-hidden rounded-full bg-white/15"
            onClick={(e) => {
              if (!duration) return
              const r = e.currentTarget.getBoundingClientRect()
              narration.seek(((e.clientX - r.left) / r.width) * duration)
            }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            aria-label="Narration progress"
          >
            <div className="story-audio-fill h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 font-mono text-[10px] text-white/50">
            {fmt(time)} / {duration ? fmt(duration) : '–:––'}
            {status === 'loading' && ' · loading…'}
            {status === 'paused' && ' · paused'}
          </p>
        </div>
        <button onClick={() => narration.setMuted(!muted)} className={iconBtn} aria-label={muted ? 'Unmute narration' : 'Mute narration'} aria-pressed={muted}>
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(e) => {
            const v = Number(e.target.value)
            narration.setVolume(v)
            if (muted && v > 0) narration.setMuted(false)
          }}
          className="story-audio-volume hidden w-16 sm:block"
          aria-label="Narration volume"
        />
      </div>
      {sharedNote && <p className="mt-2 text-[11px] leading-snug text-white/45">{sharedNote}</p>}
    </div>
  )
}
