import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { useAppStore } from '../../app/store'
import { missionsFor } from '../../data/missions'
import { VerificationBadge } from './VerificationBadge'

const btn =
  'glass flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 text-xs tracking-[0.25em] text-white/85 transition-colors hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft'

export function DeepSpaceOverlay() {
  const backToHub = useAppStore((s) => s.backToHub)
  const selectMission = useAppStore((s) => s.selectMission)
  const setHovered = useAppStore((s) => s.setHoveredMission)
  const hovered = useAppStore((s) => s.hoveredMission)
  const busy = useAppStore((s) => s.explorationState === 'transitioning')
  const missions = missionsFor('deep-space')

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="pointer-events-auto">
          <button onClick={backToHub} className={btn}>
            <ArrowLeft size={14} /> SPACE HUB
          </button>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-soft/80">DEEP SPACE</p>
          <h2 className="mt-2 text-2xl font-light tracking-[0.3em] text-white sm:text-4xl">CHOOSE A MISSION</h2>
        </div>
      </div>

      <div>
        <p className="mb-3 text-right font-mono text-[10px] tracking-[0.25em] text-white/40">
          VISUALIZATION — NOT TO SCALE · SPACECRAFT ARE SIMPLIFIED VISUAL RECONSTRUCTIONS
        </p>
        <div className="pointer-events-auto -mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
          {missions.map((m) => (
            <article
              key={m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              className={`glass flex w-60 shrink-0 snap-start flex-col rounded-sm p-4 transition-colors duration-300 sm:w-64 ${
                hovered === m.id ? 'border-gold/60!' : ''
              }`}
            >
              <p className="font-mono text-[9px] tracking-[0.3em] text-cyan-soft/80">{m.category.toUpperCase()}</p>
              <h3 className="mt-2 text-lg font-light tracking-[0.22em] text-white">{m.name}</h3>
              <p className="mt-1 text-xs text-white/60">{m.spacecraft}</p>
              <p className="mt-3 text-xs text-white/75">
                <span className="text-white/40">Destination · </span>
                {m.destination}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <VerificationBadge status="visual_reconstruction" />
                <VerificationBadge status={m.dataVerificationStatus} />
              </div>
              <button
                onClick={() => selectMission(m.id)}
                disabled={busy}
                className="mt-4 cursor-pointer rounded-sm border border-gold/60 bg-gold/10 px-3 py-2 text-[11px] tracking-[0.28em] text-gold transition-colors hover:bg-gold/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold disabled:cursor-wait disabled:opacity-50"
              >
                EXPLORE MISSION
              </button>
            </article>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
