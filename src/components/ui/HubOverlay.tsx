import { motion } from 'motion/react'
import { useAppStore, type HubWorld } from '../../app/store'
import { PLANETS } from '../../planets/planetConfig'

interface World {
  id: HubWorld
  name: string
  descriptor: string
}

const WORLDS: World[] = [
  { id: 'moon', name: PLANETS.moon.name, descriptor: PLANETS.moon.descriptor },
  { id: 'mars', name: PLANETS.mars.name, descriptor: PLANETS.mars.descriptor },
  { id: 'deep', name: 'DEEP SPACE', descriptor: 'Spacecraft beyond the Moon and Mars' },
]

export function HubOverlay() {
  const selectPlanet = useAppStore((s) => s.selectPlanet)
  const enterDeepSpace = useAppStore((s) => s.enterDeepSpace)
  const setHovered = useAppStore((s) => s.setHoveredPlanet)
  const hovered = useAppStore((s) => s.hoveredPlanet)

  const choose = (id: HubWorld) => (id === 'deep' ? enterDeepSpace() : selectPlanet(id))

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-6 py-8 sm:py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-soft/80 sm:text-xs">
          NASA SPACE APPS CHALLENGE 2026 · ABANDONED BUT NOT FORGOTTEN
        </p>
        <h1 className="mt-5 text-3xl font-light tracking-[0.35em] text-white sm:text-5xl">BEYOND THE MISSION</h1>
        <p className="mt-4 text-sm font-light italic tracking-wide text-gold/90 sm:text-base">
          Some missions end. Their stories remain.
        </p>
      </div>

      <div className="pointer-events-auto flex flex-col items-center gap-5">
        <p className="font-mono text-[10px] tracking-[0.35em] text-white/45">CHOOSE A WORLD</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {WORLDS.map((w) => (
            <button
              key={w.id}
              onClick={() => choose(w.id)}
              onMouseEnter={() => setHovered(w.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(w.id)}
              onBlur={() => setHovered(null)}
              className={`glass min-w-44 cursor-pointer rounded-sm px-5 py-4 text-left transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft sm:min-w-52 sm:px-6 ${
                hovered === w.id ? 'border-gold/60!' : ''
              }`}
            >
              <span className="block text-sm tracking-[0.3em] text-white">{w.name}</span>
              <span className="mt-1 block max-w-48 text-xs font-light text-white/55">{w.descriptor}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
