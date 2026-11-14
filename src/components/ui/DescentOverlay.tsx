import { motion } from 'motion/react'
import { PLANETS, type PlanetId } from '../../planets/planetConfig'

export function DescentOverlay({ planetId }: { planetId: PlanetId }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-16 flex flex-col items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <p className="font-mono text-[10px] tracking-[0.5em] text-cyan-soft/80">DESCENDING</p>
      <p className="mt-2 text-lg font-light tracking-[0.4em] text-white/90">{PLANETS[planetId].name}</p>
    </motion.div>
  )
}
