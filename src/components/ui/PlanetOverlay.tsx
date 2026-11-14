import { ArrowLeft, ArrowLeftRight, ChevronsDown } from 'lucide-react'
import { motion } from 'motion/react'
import { useAppStore } from '../../app/store'
import { PLANETS, otherPlanet, type PlanetId } from '../../planets/planetConfig'

const btn =
  'glass flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 text-xs tracking-[0.25em] text-white/85 transition-colors hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft disabled:cursor-wait disabled:opacity-50'

export function PlanetOverlay({ planetId }: { planetId: PlanetId }) {
  const backToHub = useAppStore((s) => s.backToHub)
  const selectPlanet = useAppStore((s) => s.selectPlanet)
  const enterExploration = useAppStore((s) => s.enterExploration)
  const busy = useAppStore((s) => s.explorationState === 'transitioning')
  const planet = PLANETS[planetId]
  const other = PLANETS[otherPlanet(planetId)]

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
    >
      <div className="pointer-events-auto flex flex-wrap items-center gap-3">
        <button onClick={backToHub} className={btn}>
          <ArrowLeft size={14} /> BACK TO HUB
        </button>
        <button onClick={() => selectPlanet(otherPlanet(planetId))} disabled={busy} className={btn}>
          <ArrowLeftRight size={14} /> SWITCH TO {other.name}
        </button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-md">
          <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-soft/80">PLANET VIEW</p>
          <h2 className="mt-3 text-4xl font-light tracking-[0.3em] text-white sm:text-5xl">{planet.name}</h2>
          <p className="mt-3 text-sm font-light text-white/70">{planet.descriptor}</p>
          <p className="mt-5 font-mono text-[10px] tracking-[0.25em] text-white/40">
            DRAG TO ROTATE · SCROLL TO ZOOM · RIGHT-DRAG TO PAN
          </p>
        </div>
        <button
          onClick={enterExploration}
          disabled={busy}
          className="pointer-events-auto flex cursor-pointer items-center gap-3 rounded-sm border border-gold/70 bg-gold/10 px-7 py-4 text-sm tracking-[0.35em] text-gold transition-colors hover:bg-gold/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold disabled:cursor-wait disabled:opacity-50"
        >
          ENTER EXPLORATION <ChevronsDown size={16} />
        </button>
      </div>
    </motion.div>
  )
}
