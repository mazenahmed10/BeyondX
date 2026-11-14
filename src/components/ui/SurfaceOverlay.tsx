import { useState } from 'react'
import { ArrowLeft, ArrowLeftRight, Clock, Home, Radar, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore } from '../../app/store'
import { useKidStore } from '../../app/kidStore'
import { useStoryStore } from '../../app/storyStore'
import { MARS_TIMELINE, getStory, storiesFor } from '../../data/stories'
import { PLANETS, otherPlanet, type PlanetId } from '../../planets/planetConfig'

const btn =
  'glass flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 text-xs tracking-[0.25em] text-white/85 transition-colors hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft disabled:cursor-wait disabled:opacity-50'

/** 10.9: how each generation of Mars explorers asked a new question. Opens the matching discovery. */
function MarsTimeline({ onClose }: { onClose: () => void }) {
  const selectDiscovery = useAppStore((s) => s.selectDiscovery)
  const discovered = useStoryStore((s) => s.discovered)
  const kid = useKidStore((s) => s.kidMode)
  return (
    <motion.div
      className="mars-timeline glass pointer-events-auto w-full max-w-3xl rounded-sm p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-cyan-soft/80">MARS TIMELINE · 1976 – 2021</p>
          <p className="mt-1 text-xs text-white/60">{kid ? 'Each new robot asked a brand-new question!' : 'Each generation of technology asked a new question, and made the next one possible.'}</p>
        </div>
        <button onClick={onClose} aria-label="Close timeline" className="cursor-pointer text-white/60 hover:text-gold">
          <X size={16} />
        </button>
      </div>
      <ol className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {MARS_TIMELINE.map((era) => (
          <li key={era.year} className="relative w-44 shrink-0 border-t border-gold/40 pt-3">
            <span className="absolute -top-1 left-0 h-2 w-2 rounded-full bg-gold" />
            <p className="font-mono text-sm tracking-[0.15em] text-gold">{era.year}</p>
            <p className="mt-0.5 text-sm text-white">{era.label}</p>
            <p className="mt-1 min-h-12 text-[11px] leading-snug text-white/55">{era.question}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {era.storyIds.map((id) => {
                const story = getStory(id)
                if (!story) return null
                return (
                  <button
                    key={id}
                    onClick={() => selectDiscovery(id)}
                    className="cursor-pointer rounded-sm border border-white/20 px-2 py-1 text-[10px] tracking-[0.12em] text-white/80 transition-colors hover:border-gold hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft"
                  >
                    {discovered.includes(id) ? '✓ ' : ''}
                    {story.equipmentName} →
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>
    </motion.div>
  )
}

export function SurfaceOverlay({ planetId }: { planetId: PlanetId }) {
  const returnToPlanet = useAppStore((s) => s.returnToPlanet)
  const backToHub = useAppStore((s) => s.backToHub)
  const selectPlanet = useAppStore((s) => s.selectPlanet)
  const selectDiscovery = useAppStore((s) => s.selectDiscovery)
  const busy = useAppStore((s) => s.explorationState === 'transitioning')
  const discovered = useStoryStore((s) => s.discovered)
  const kid = useKidStore((s) => s.kidMode)
  const [timeline, setTimeline] = useState(false)
  const planet = PLANETS[planetId]
  const other = PLANETS[otherPlanet(planetId)]
  const stories = storiesFor(planetId)
  const found = stories.filter((s) => discovered.includes(s.id)).length

  // No list of missions: this only points the camera at a signal the user has not opened yet.
  const locate = () => {
    const pool = stories.filter((s) => !discovered.includes(s.id))
    const from = pool.length ? pool : stories
    selectDiscovery(from[Math.floor(Math.random() * from.length)].id)
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="pointer-events-auto flex flex-wrap items-center gap-3 pr-40 sm:pr-44">
        <button onClick={returnToPlanet} disabled={busy} className={btn}>
          <ArrowLeft size={14} /> PLANET VIEW
        </button>
        <button onClick={backToHub} disabled={busy} className={btn}>
          <Home size={14} /> SPACE HUB
        </button>
        <button onClick={() => selectPlanet(otherPlanet(planetId))} disabled={busy} className={btn}>
          <ArrowLeftRight size={14} /> SWITCH TO {other.name}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence>{timeline && planetId === 'mars' && <MarsTimeline key="tl" onClose={() => setTimeline(false)} />}</AnimatePresence>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-soft/80">SURFACE · {planet.name}</p>
            <p className="discovery-count mt-2 text-sm text-white/90">
              {kid ? '⭐ ' : ''}
              <span className="font-mono text-gold">
                {found} / {stories.length}
              </span>{' '}
              {kid ? 'mysteries solved' : 'stories discovered'}
            </p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-white/60">
              {kid ? 'Tap a glowing marker to start an adventure!' : 'Select any glowing marker to fly in and discover its story. There is no set order.'}
            </p>
            <div className="pointer-events-auto mt-3 flex flex-wrap gap-2">
              <button onClick={locate} disabled={busy} className={btn}>
                <Radar size={14} /> {kid ? 'FIND A MYSTERY' : 'LOCATE A SIGNAL'}
              </button>
              {planetId === 'mars' && (
                <button onClick={() => setTimeline((v) => !v)} className={btn} aria-expanded={timeline}>
                  <Clock size={14} /> MARS TIMELINE
                </button>
              )}
            </div>
            <p className="mt-3 hidden font-mono text-[10px] tracking-[0.25em] text-white/45 sm:block">DRAG TO LOOK · SCROLL TO ZOOM · RIGHT-DRAG TO MOVE</p>
          </div>
          <p className="max-w-xs text-right text-[11px] leading-relaxed text-white/45">
            Procedurally generated terrain: an illustrative visual reconstruction, not a map of the real surface. Marker positions are illustrative; real coordinates are given inside each story.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
