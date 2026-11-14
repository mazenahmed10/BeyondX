import { AnimatePresence, motion } from 'motion/react'
import { useAppStore } from '../../app/store'

export function LoadingOverlay() {
  const ready = useAppStore((s) => s.loadingState === 'ready')
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="loading"
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-space"
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-xl font-light tracking-[0.4em] text-white/90">BEYOND THE MISSION</p>
          <p className="mt-4 font-mono text-[10px] tracking-[0.4em] text-cyan-soft/70">PREPARING THE SKY…</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
