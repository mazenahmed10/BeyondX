import { ArrowLeft, Home, Crosshair, BookOpen } from 'lucide-react'
import { motion } from 'motion/react'
import { useAppStore } from '../../app/store'
import { getMission, missionsFor } from '../../data/missions'
import { ENVIRONMENTS } from '../../scenes/deep/environments'
import { VerificationBadge } from './VerificationBadge'
import { Placeholder } from './Placeholder'

const btn =
  'glass flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 text-xs tracking-[0.25em] text-white/85 transition-colors hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft disabled:cursor-wait disabled:opacity-50'

const orAwaiting = (v: string | null) => v ?? 'Not yet verified'

export function MissionOverlay() {
  const missionId = useAppStore((s) => s.selectedMission)
  const focused = useAppStore((s) => s.selectedDiscovery === s.selectedMission && s.selectedMission !== null)
  const backToDeepSpace = useAppStore((s) => s.backToDeepSpace)
  const backToHub = useAppStore((s) => s.backToHub)
  const selectMission = useAppStore((s) => s.selectMission)
  const focusDiscovery = useAppStore((s) => s.focusDiscovery)
  const openStory = useAppStore((s) => s.openStory)
  const busy = useAppStore((s) => s.explorationState === 'transitioning')
  const mission = getMission(missionId)
  if (!mission) return null
  const env = ENVIRONMENTS[mission.environmentId]
  const others = missionsFor('deep-space')

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
    >
      <div className="flex flex-col gap-3">
        <div className="pointer-events-auto flex flex-wrap items-center gap-3">
          <button onClick={backToDeepSpace} className={btn}>
            <ArrowLeft size={14} /> DEEP SPACE
          </button>
          <button onClick={backToHub} className={btn}>
            <Home size={14} /> SPACE HUB
          </button>
        </div>
        <div className="pointer-events-auto -mx-1 flex max-w-full gap-2 overflow-x-auto px-1 pb-1">
          {others.map((m) => (
            <button
              key={m.id}
              onClick={() => selectMission(m.id)}
              disabled={busy || m.id === mission.id}
              className={`shrink-0 cursor-pointer rounded-sm border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft ${
                m.id === mission.id
                  ? 'border-gold/70 bg-gold/10 text-gold'
                  : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-5">
        <motion.div
          key={focused ? 'focused' : 'overview'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass pointer-events-auto w-full max-w-md rounded-sm p-5"
        >
          <p className="font-mono text-[10px] tracking-[0.35em] text-cyan-soft/80">{mission.category.toUpperCase()}</p>
          <h2 className="mt-2 text-2xl font-light tracking-[0.25em] text-white sm:text-3xl">{mission.name}</h2>
          <p className="mt-1 text-sm text-white/65">
            {mission.spacecraft} · {mission.destination}
          </p>

          {focused ? (
            <>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                {[
                  ['Launch', mission.launchDate],
                  ['Arrival', mission.arrivalDate],
                  ['Mission end', mission.endDate],
                  ['Final location', mission.finalLocation],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="font-mono text-[9px] tracking-[0.25em] text-white/40">{(k as string).toUpperCase()}</dt>
                    <dd className={v ? 'text-white/90' : 'text-white/40'}>{orAwaiting(v as string | null)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <VerificationBadge status={mission.statusVerification} />
                <span className="text-xs text-white/70">{mission.missionStatus ?? 'Mission status awaiting verification'}</span>
              </div>
            </>
          ) : (
            <p className="mt-4 text-xs leading-relaxed text-white/50">
              Select the glowing marker on the spacecraft, or use the button, to look closer.
            </p>
          )}

          {mission.briefNotes.map((n, i) => (
            <div key={i} className="mt-4 border-t border-white/10 pt-3">
              <VerificationBadge status={n.verification} />
              <p className="mt-2 text-xs leading-relaxed text-white/70">{n.text}</p>
            </div>
          ))}
          {mission.briefNotes.length === 0 && (
            <div className="mt-4">
              <Placeholder what="Mission summary" file={`src/data/missions/deep-space/${mission.id}.json`} />
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {focused ? (
              <>
                <button
                  onClick={openStory}
                  disabled={busy}
                  className="flex cursor-pointer items-center gap-2 rounded-sm border border-gold/70 bg-gold/10 px-4 py-2.5 text-[11px] tracking-[0.28em] text-gold transition-colors hover:bg-gold/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold disabled:opacity-50"
                >
                  <BookOpen size={14} /> DISCOVER ITS STORY
                </button>
                <button onClick={() => focusDiscovery(null)} disabled={busy} className={btn}>
                  BACK TO OVERVIEW
                </button>
              </>
            ) : (
              <button onClick={() => focusDiscovery(mission.id)} disabled={busy} className={btn}>
                <Crosshair size={14} /> LOCATE SPACECRAFT
              </button>
            )}
          </div>
        </motion.div>

        <div className="max-w-xs space-y-1 text-right">
          <p className="font-mono text-[10px] leading-relaxed tracking-[0.2em] text-white/45">{env.notice}</p>
          <p className="text-[11px] leading-relaxed text-white/40">
            {mission.visualAssets.model.note ?? 'Spacecraft shown is a visual reconstruction.'}
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/30">DRAG · SCROLL · RIGHT-DRAG</p>
        </div>
      </div>
    </motion.div>
  )
}
