import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, ExternalLink, Eye, HelpCircle, RotateCcw, SkipForward, X } from 'lucide-react'
import { useKidStore } from '../../app/kidStore'
import { useStoryStore, type GuideMood, type StoryStage } from '../../app/storyStore'
import { narration } from '../../audio/narration'
import { sfx } from '../../audio/sfx'
import { DEEP_SPACE_FINAL, STORY_STEPS, formatCoordinates, storiesFor, type FateStatus, type Story } from '../../data/stories'
import { COSMO, pickLine } from '../../kid/kidContent'
import { AudioPlayer } from './AudioPlayer'
import { Confetti } from './Confetti'

const FATE_LABEL: Record<FateStatus, string> = {
  'on-surface': 'STILL ON THE SURFACE',
  'impact-remains': 'NEVER SOFT-LANDED · WRECKAGE ONLY',
  'in-orbit': 'STILL IN ORBIT',
  'on-asteroid': 'RESTING ON AN ASTEROID',
  'leaving-solar-system': 'LEAVING THE SOLAR SYSTEM',
  'solar-orbit': 'IN ORBIT AROUND THE SUN',
}

const TOTAL_SEGMENTS = STORY_STEPS.length + 3 // mystery/guess + reveal + six steps + fate

function segmentIndex(stage: StoryStage, step: number): number {
  if (stage === 'mystery' || stage === 'guess') return 0
  if (stage === 'reveal') return 1
  if (stage === 'story') return 2 + step
  return TOTAL_SEGMENTS - 1
}

const primaryBtn =
  'story-btn-primary flex cursor-pointer items-center gap-2 rounded-sm border border-gold/70 bg-gold/10 px-4 py-2.5 text-[11px] tracking-[0.24em] text-gold transition-colors hover:bg-gold/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold'
const ghostBtn =
  'story-btn-ghost flex cursor-pointer items-center gap-2 rounded-sm border border-white/15 px-4 py-2.5 text-[11px] tracking-[0.24em] text-white/75 transition-colors hover:border-white/40 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft disabled:cursor-default disabled:opacity-30'

interface Props {
  story: Story
  onClose: () => void
  /** e.g. "RETURN TO THE SURFACE" */
  closeLabel: string
}

/**
 * Discover a Story: Mystery -> Guess -> Cinematic Reveal -> six progressive steps -> Final Fate.
 * One component for Moon, Mars and Deep Space, and for Kids and Adults: only the data and the
 * presentation change. Facts are identical in both modes; the telling is written separately.
 */
export function StoryFlow({ story, onClose, closeLabel }: Props) {
  const kid = useKidStore((s) => s.kidMode)
  const stage = useStoryStore((s) => s.stage)
  const step = useStoryStore((s) => s.step)
  const guess = useStoryStore((s) => s.guess)
  const active = useStoryStore((s) => s.activeStoryId === story.id)
  const discovered = useStoryStore((s) => s.discovered)
  const [picked, setPicked] = useState<number | null>(null)
  const [burst, setBurst] = useState(0)

  const narrative = kid ? story.kidsStory : story.adultsStory
  const revealed = stage === 'reveal' || stage === 'story' || stage === 'fate'
  const isSurface = story.world !== 'deep-space'
  const worldStories = storiesFor(story.world)
  const foundInWorld = worldStories.filter((s) => discovered.includes(s.id)).length

  const guide = useCallback((lines: string[], mood: GuideMood) => {
    if (useKidStore.getState().kidMode) useStoryStore.getState().setGuide(pickLine(lines), mood)
  }, [])

  // Start / end of a story run. Leaving the story always silences the narration.
  useEffect(() => {
    const store = useStoryStore.getState()
    store.begin(story.id)
    setPicked(null)
    sfx.found()
    if (useStoryStore.getState().stage === 'mystery') guide(COSMO.found, 'talk')
    else guide(COSMO.reveal, 'cheer')
    return () => {
      useStoryStore.getState().end()
      narration.stop()
    }
  }, [story.id, guide])

  // The recording follows the story AND the mode. Switching either one stops playback;
  // a Kids recording is never played in Adults mode or the other way round.
  useEffect(() => {
    narration.select(active && revealed ? (kid ? story.audio.kids : story.audio.adults) : null)
  }, [active, revealed, kid, story.audio.kids, story.audio.adults])

  // Tell the 3D scene which part of the model to highlight.
  useEffect(() => {
    const part = stage === 'story' ? (narrative.steps[STORY_STEPS[step].id].highlight ?? null) : null
    useStoryStore.getState().setHighlight(part)
  }, [stage, step, narrative])

  const doReveal = useCallback(
    (how: 'right' | 'wrong' | 'skipped') => {
      useStoryStore.getState().reveal()
      if (how === 'right') return
      guide(how === 'skipped' ? COSMO.skipped : COSMO.reveal, 'cheer')
    },
    [guide],
  )

  const next = useCallback(() => {
    const s = useStoryStore.getState()
    sfx.tap()
    if (s.stage === 'mystery') {
      s.setStage('guess')
      guide(COSMO.listen, 'listen')
    } else if (s.stage === 'guess') {
      if (s.guess === null) s.setGuess('skipped')
      doReveal(s.guess ?? 'skipped')
    } else if (s.stage === 'reveal') {
      s.setStep(0)
      s.setStage('story')
      guide(COSMO.step, 'talk')
    } else if (s.stage === 'story') {
      if (s.step < STORY_STEPS.length - 1) {
        s.setStep(s.step + 1)
        guide(COSMO.step, 'talk')
      } else {
        s.setStage('fate')
        guide(COSMO.done, 'cheer')
        sfx.done()
        if (useKidStore.getState().kidMode) setBurst((b) => b + 1)
      }
    } else onClose()
  }, [doReveal, guide, onClose])

  const back = useCallback(() => {
    const s = useStoryStore.getState()
    sfx.tap()
    if (s.stage === 'story') {
      if (s.step > 0) s.setStep(s.step - 1)
      else s.setStage('reveal')
    } else if (s.stage === 'fate') {
      s.setStep(STORY_STEPS.length - 1)
      s.setStage('story')
    }
  }, [])

  const choose = (i: number) => {
    if (picked !== null) return
    const right = i === story.guess.answer
    setPicked(i)
    useStoryStore.getState().setGuess(right ? 'right' : 'wrong')
    if (right) {
      sfx.right()
      guide(COSMO.right, 'cheer')
      if (kid) setBurst((b) => b + 1)
    } else {
      sfx.wrong()
      guide(COSMO.wrong, 'oops')
    }
  }

  const skip = () => {
    sfx.tap()
    useStoryStore.getState().setGuess('skipped')
    doReveal('skipped')
  }

  const replay = () => {
    const s = useStoryStore.getState()
    s.setStep(0)
    s.setStage('reveal')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      const s = useStoryStore.getState()
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && s.stage !== 'guess') next()
      else if (e.key === 'ArrowLeft') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, back, onClose])

  const seg = segmentIndex(stage, step)
  const current = STORY_STEPS[step]
  const contentKey = stage === 'story' ? `story-${step}` : stage

  return (
    <motion.aside
      className={`story-panel glass pointer-events-auto absolute inset-x-2 bottom-2 z-30 flex max-h-[60vh] flex-col rounded-sm md:inset-x-auto md:bottom-6 md:right-6 md:top-20 md:max-h-none md:w-[min(30rem,42vw)] ${kid ? 'is-kid' : ''}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      aria-label="Discover a story"
    >
      <Confetti burst={burst} />

      <header className="flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <p className="story-kicker font-mono text-[10px] tracking-[0.35em] text-cyan-soft/80">
            {revealed || !isSurface
              ? `${story.collection.toUpperCase()} · ${story.mission.toUpperCase()}`
              : kid
                ? 'MYSTERY TIME!'
                : 'DISCOVER A STORY · SIGNAL DETECTED'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="story-close flex shrink-0 cursor-pointer items-center gap-1.5 text-[10px] tracking-[0.2em] text-white/60 hover:text-gold focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-soft"
          aria-label={closeLabel}
        >
          <X size={14} /> <span className="hidden sm:inline">{closeLabel}</span>
        </button>
      </header>

      <div
        className="story-progress mt-3 flex items-center gap-1 px-5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_SEGMENTS}
        aria-valuenow={seg + 1}
        aria-label="Story progress"
      >
        {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
          <span key={i} className={`story-progress-seg h-1 flex-1 rounded-full transition-colors ${i < seg ? 'is-done bg-gold/60' : i === seg ? 'is-now bg-gold' : 'bg-white/15'}`}>
            {kid && <i aria-hidden="true">{i === TOTAL_SEGMENTS - 1 ? '🏁' : i <= seg ? '★' : '☆'}</i>}
          </span>
        ))}
      </div>

      {/* One persistent player from the reveal onward, so narration can keep playing across steps. */}
      {revealed && (
        <div className="mt-3 px-5">
          <AudioPlayer src={kid ? story.audio.kids : story.audio.adults} kid={kid} sharedNote={stage === 'reveal' ? story.audio.sharedNote : null} />
        </div>
      )}

      <div className="story-body relative mt-4 min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence mode="wait">
          <motion.div key={contentKey} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {stage === 'mystery' && (
              <>
                <h2 className="story-title text-2xl font-light tracking-[0.18em] text-white sm:text-3xl">{isSurface ? (kid ? 'What is hiding here?' : 'Unidentified object') : kid ? 'Ready for a space story?' : 'Before the story begins'}</h2>
                <p className="story-text mt-4 text-base font-light leading-relaxed text-white/85">{narrative.hook}</p>
                {isSurface && (
                  <p className="mt-4 flex items-center gap-2 text-xs text-white/45">
                    <Eye size={13} /> {kid ? 'It is just a shadow for now. Can you guess what it is?' : 'Shown as a silhouette until you reveal it. Drag to look around it.'}
                  </p>
                )}
              </>
            )}

            {stage === 'guess' && (
              <>
                <h2 className="story-title flex items-center gap-2 text-xl font-light tracking-[0.12em] text-white sm:text-2xl">
                  <HelpCircle size={20} className="shrink-0 text-gold" /> {kid ? story.guess.kidQuestion : story.guess.question}
                </h2>
                <div className="mt-4 grid gap-2">
                  {story.guess.options.map((o, i) => {
                    const isAnswer = i === story.guess.answer
                    const state = picked === null ? '' : isAnswer ? 'is-right' : i === picked ? 'is-wrong' : 'is-dim'
                    return (
                      <button key={o} onClick={() => choose(i)} disabled={picked !== null} className={`story-option ${state}`}>
                        <span className="story-option-letter">{'ABC'[i]}</span>
                        <span className="flex-1">{o}</span>
                        {picked !== null && isAnswer && <Check size={16} />}
                        {picked === i && !isAnswer && <X size={16} />}
                      </button>
                    )
                  })}
                </div>
                {picked !== null && (
                  <p className={`story-feedback mt-4 rounded-sm border px-3 py-2.5 text-sm leading-relaxed ${guess === 'right' ? 'border-emerald-400/40 text-emerald-200' : 'border-gold/40 text-gold'}`} role="status">
                    <strong className="font-semibold">{guess === 'right' ? (kid ? 'Yes! You got it! ' : 'Correct. ') : kid ? 'Good try! ' : 'Not quite. '}</strong>
                    {story.guess.explain}
                  </p>
                )}
              </>
            )}

            {stage === 'reveal' && (
              <>
                <p className="story-kicker font-mono text-[10px] tracking-[0.35em] text-gold/85">{kid ? 'TA-DAAA! IT IS…' : 'IDENTIFIED'}</p>
                <h2 className="story-title mt-2 text-2xl font-light tracking-[0.14em] text-white sm:text-3xl">{story.equipmentName}</h2>
                <p className="mt-2 text-sm italic text-gold/90">{story.title}</p>
                <p className="mt-1 text-xs text-white/55">{story.subtitle}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                  <div>
                    <dt className="font-mono text-[9px] tracking-[0.25em] text-white/40">MISSION</dt>
                    <dd className="text-white/90">{story.mission}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] tracking-[0.25em] text-white/40">{isSurface ? 'REAL LOCATION' : 'WHERE IT IS NOW'}</dt>
                    <dd className="text-white/90">{story.location}</dd>
                  </div>
                </dl>
              </>
            )}

            {stage === 'story' && (
              <>
                <p className="story-kicker font-mono text-[10px] tracking-[0.3em] text-gold/85">
                  {kid ? `PART ${step + 1} OF ${STORY_STEPS.length}` : `${String(step + 1).padStart(2, '0')} / ${String(STORY_STEPS.length).padStart(2, '0')} · ${story.equipmentName.toUpperCase()}`}
                </p>
                <h2 className="story-title mt-2 text-2xl font-light tracking-[0.1em] text-white sm:text-3xl">{kid ? current.kidTitle : current.title}</h2>
                <p className="story-text mt-4 text-base font-light leading-relaxed text-white/88">{narrative.steps[current.id].text}</p>
                {isSurface && narrative.steps[current.id].highlight && (
                  <p className="story-highlight mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-[11px] text-gold">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-gold" /> {kid ? 'Look! That part is glowing on the model.' : 'Highlighted on the model'}
                  </p>
                )}
              </>
            )}

            {stage === 'fate' && <FateView story={story} kid={kid} found={foundInWorld} total={worldStories.length} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="story-footer flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-3">
        {stage === 'mystery' && (
          <>
            <button onClick={skip} className={ghostBtn}>
              <SkipForward size={13} /> {kid ? 'JUST SHOW ME' : 'SKIP · REVEAL'}
            </button>
            <button onClick={next} className={primaryBtn}>
              {kid ? 'LET ME GUESS!' : 'TAKE A GUESS'} <ArrowRight size={14} />
            </button>
          </>
        )}
        {stage === 'guess' &&
          (picked === null ? (
            <button onClick={skip} className={`${ghostBtn} ml-auto`}>
              <SkipForward size={13} /> {kid ? 'SKIP' : 'SKIP · REVEAL'}
            </button>
          ) : (
            <button onClick={next} className={`${primaryBtn} ml-auto`}>
              {kid ? 'SHOW ME!' : 'REVEAL IT'} <ArrowRight size={14} />
            </button>
          ))}
        {stage === 'reveal' && (
          <button onClick={next} className={`${primaryBtn} ml-auto`}>
            {kid ? 'TELL ME THE STORY!' : 'BEGIN THE STORY'} <ArrowRight size={14} />
          </button>
        )}
        {stage === 'story' && (
          <>
            <button onClick={back} className={ghostBtn}>
              <ArrowLeft size={13} /> BACK
            </button>
            <button onClick={next} className={primaryBtn}>
              {step < STORY_STEPS.length - 1 ? (kid ? STORY_STEPS[step + 1].kidTitle : STORY_STEPS[step + 1].title).toUpperCase() : kid ? 'HOW DOES IT END?' : 'ITS FINAL FATE'} <ArrowRight size={14} />
            </button>
          </>
        )}
        {stage === 'fate' && (
          <>
            <button onClick={replay} className={ghostBtn}>
              <RotateCcw size={13} /> {kid ? 'AGAIN!' : 'REPLAY'}
            </button>
            <button onClick={onClose} className={primaryBtn}>
              {kid ? 'FIND ANOTHER ONE!' : closeLabel} <ArrowRight size={14} />
            </button>
          </>
        )}
      </footer>
    </motion.aside>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="story-kicker mb-2 font-mono text-[10px] tracking-[0.3em] text-cyan-soft/80">{title}</h3>
      {children}
    </section>
  )
}

function FateView({ story, kid, found, total }: { story: Story; kid: boolean; found: number; total: number }) {
  const isSurface = story.world !== 'deep-space'
  const allDeepFound = story.world === 'deep-space' && found === total
  return (
    <>
      <p className="story-kicker font-mono text-[10px] tracking-[0.3em] text-gold/85">{kid ? 'THE END OF THE ADVENTURE' : 'FINAL FATE'}</p>
      <span className="story-fate-chip mt-2 inline-block rounded-sm border border-gold/60 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-gold">{FATE_LABEL[story.fate.status]}</span>
      <h2 className="story-title mt-2 text-2xl font-light tracking-[0.08em] text-white">{story.fate.headline}</h2>
      <p className="story-text mt-3 text-sm leading-relaxed text-white/85">{kid ? story.fate.kidSummary : story.fate.summary}</p>

      {kid && (
        <div className="story-badge mt-4 flex items-center gap-3 rounded-2xl px-4 py-3">
          <span className="text-3xl" aria-hidden="true">
            🏅
          </span>
          <p className="text-sm font-bold">
            Discovery star earned! You have found {found} of {total} here.
          </p>
        </div>
      )}

      <Section title={kid ? 'WHAT HAPPENED WHEN' : 'TIMELINE'}>
        <ol className="relative ml-2 space-y-3 border-l border-white/15 pl-5">
          {story.timeline.map((e, i) => (
            <li key={i} className="relative">
              <span className="story-dot absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-gold" />
              <p className="font-mono text-[10px] tracking-[0.15em] text-gold/85">
                {e.date} {!kid && <span className="ml-1 text-white/40">· {e.kind}</span>}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/80">{e.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={kid ? 'COOL FACTS' : 'KEY FACTS'}>
        <dl className="space-y-2 text-xs">
          {(kid ? story.facts.slice(0, 3) : story.facts).map((f) => (
            <div key={f.label} className="story-fact rounded-sm border border-white/10 px-3 py-2">
              <dt className="font-mono text-[9px] tracking-[0.2em] text-white/45">{f.label.toUpperCase()}</dt>
              <dd className="mt-0.5 text-white/88">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title={isSurface ? 'WHERE IT REALLY IS' : 'WHERE IT IS NOW'}>
        <p className="text-xs text-white/85">{story.location}</p>
        {isSurface &&
          (story.coordinates ? (
            <p className="mt-1 font-mono text-xs text-gold/90">{formatCoordinates(story.coordinates)}</p>
          ) : (
            <p className="mt-1 text-xs italic text-white/50">No coordinates shown: the real position is not known.</p>
          ))}
        {!kid && story.coordinates?.note && <p className="mt-1 text-[11px] leading-snug text-white/45">{story.coordinates.note}</p>}
        {isSurface && (
          <p className="mt-2 text-[11px] leading-snug text-white/45">
            <span className="mr-1 rounded-sm border border-cyan-soft/40 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.15em] text-cyan-soft">ILLUSTRATIVE PLACEMENT</span>
            {kid
              ? 'Our 3D ground is a drawing, not a real map. The numbers above are the real spot!'
              : 'The 3D terrain is procedurally generated, so the position of this object in the scene is a visual arrangement, not a geographic one.'}
          </p>
        )}
      </Section>

      {!kid && story.accuracyNotes && story.accuracyNotes.length > 0 && (
        <Section title="ACCURACY NOTES">
          <ul className="space-y-1.5 text-[11px] leading-snug text-white/60">
            {story.accuracyNotes.map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
        </Section>
      )}

      {allDeepFound && (
        <Section title={kid ? 'YOU EXPLORED ALL OF DEEP SPACE!' : 'DEEP SPACE · CLOSING NOTE'}>
          <div className="story-final space-y-2 rounded-sm border border-gold/30 bg-gold/5 px-3 py-3 text-sm leading-relaxed text-white/88">
            {(kid ? DEEP_SPACE_FINAL.kids : DEEP_SPACE_FINAL.adults).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Section>
      )}

      <Section title={kid ? 'FOR GROWN-UPS: SOURCES' : 'SOURCES'}>
        <ul className="space-y-1 text-xs">
          {story.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-white/75 hover:text-cyan-soft">
                {s.title} <span className="text-white/40">· {s.publisher}</span> <ExternalLink size={10} />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] leading-snug text-white/40">{story.model.note}</p>
      </Section>
    </>
  )
}
