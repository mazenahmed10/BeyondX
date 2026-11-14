import { useCallback, useEffect, useRef, useState } from 'react'
import { Award, Lock, Rocket, Volume2, VolumeX } from 'lucide-react'
import { useAppStore } from '../app/store'
import { useKidStore } from '../app/kidStore'
import { useStoryStore } from '../app/storyStore'
import { useNarration } from '../audio/narration'
import { sfx } from '../audio/sfx'
import { Astronaut } from './Astronaut'
import { Quiz } from './Quiz'
import { PLACES, type Gear } from './kidContent'

function usePlaceKey(): string {
  const phase = useAppStore((s) => s.phase)
  const planet = useAppStore((s) => s.selectedPlanet)
  const mission = useAppStore((s) => s.selectedMission)
  if (phase === 'HUB') return 'hub'
  if (phase === 'DEEP_SPACE') return 'deep'
  if (phase === 'MISSION' || phase === 'STORY') return mission && PLACES[mission] ? mission : 'deep'
  return planet ?? 'hub'
}

/** Decorative floating shapes, only in kid mode. */
export function KidDecor() {
  const kid = useKidStore((s) => s.kidMode)
  if (!kid) return null
  const items = [
    { c: '#ff7ab8', l: '8%', t: '18%', s: 46, d: 0 }, { c: '#ffd24a', l: '88%', t: '30%', s: 38, d: 1.5 },
    { c: '#7be0ff', l: '78%', t: '72%', s: 54, d: 3 }, { c: '#a58bff', l: '14%', t: '78%', s: 34, d: 2 },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((p, i) => (
        <svg key={i} className="kid-float absolute" style={{ left: p.l, top: p.t, animationDelay: `${p.d}s` }} width={p.s} height={p.s} viewBox="0 0 50 50">
          {i % 2 === 0 ? (
            <><circle cx="25" cy="25" r="17" fill={p.c} /><ellipse cx="25" cy="25" rx="24" ry="6" fill="none" stroke="#fff" strokeWidth="3" opacity=".8" /></>
          ) : (
            <path d="M25 3l6 16h17l-14 10 5 17-14-10-14 10 5-17L2 19h17z" fill={p.c} />
          )}
        </svg>
      ))}
    </div>
  )
}

export function KidUI() {
  const { kidMode, setKidMode, voiceOn, setVoiceOn, quizDone } = useKidStore()
  const key = usePlaceKey()
  const place = PLACES[key] ?? PLACES.hub
  const phase = useAppStore((s) => s.phase)
  const inStory = phase === 'DISCOVERY' || phase === 'STORY'
  const guideLine = useStoryStore((s) => s.guideLine)
  const guideMood = useStoryStore((s) => s.guideMood)
  const narrating = useNarration((s) => s.status === 'playing')
  const [text, setText] = useState(place.intro)
  const [talking, setTalking] = useState(false)
  const [open, setOpen] = useState(true)
  const [quiz, setQuiz] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  // Cosmo "speaks" in text only. No browser text-to-speech: the only voices in the app are the
  // team's original recordings, played from the story panel. The mouth animation is a simple
  // speaking loop, not lip-sync.
  const say = useCallback((msg: string) => {
    setText(msg)
    sfx.tap()
    window.clearTimeout(timer.current)
    setTalking(true)
    timer.current = window.setTimeout(() => setTalking(false), Math.min(7000, 1200 + msg.length * 45))
  }, [])

  // Cosmo introduces each place when it changes.
  useEffect(() => {
    if (kidMode) say(place.intro)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidMode, key])

  // A new reaction during a story makes Cosmo talk for a moment.
  useEffect(() => {
    if (!kidMode || !inStory || !guideLine) return
    window.clearTimeout(timer.current)
    setTalking(true)
    timer.current = window.setTimeout(() => setTalking(false), Math.min(6000, 1200 + guideLine.length * 45))
  }, [kidMode, inStory, guideLine])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // On short screens the open bubble would cover the surface controls: after the intro,
  // Cosmo tucks the bubble away by himself (tap him to bring it back).
  useEffect(() => {
    if (!kidMode || phase !== 'SURFACE' || !window.matchMedia('(max-height: 700px)').matches) return
    const id = window.setTimeout(() => setOpen(false), 6500)
    return () => window.clearTimeout(id)
  }, [kidMode, phase, key])
  useEffect(() => {
    if (phase !== 'SURFACE') setOpen(true)
  }, [phase])

  const shown = inStory ? (guideLine ?? 'Ooh, a mystery! Let us find out together.') : text
  // Cheering / "oops" are brief reactions (they end with the speech timer); listening lasts
  // for as long as Cosmo is waiting for a guess. While a recording plays, Cosmo shows his
  // speaking animation: a simple loop, not lip-sync.
  const reacting = inStory && (guideMood === 'listen' || ((guideMood === 'cheer' || guideMood === 'oops') && talking))
  const mood = reacting ? guideMood : talking || narrating ? 'talk' : 'idle'

  return (
    <>
      <button
        role="switch"
        aria-checked={kidMode}
        onClick={() => setKidMode(!kidMode)}
        className={`kid-toggle fixed right-4 top-4 z-50 flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-widest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-soft ${kidMode ? 'bg-pink-400 text-white' : 'glass text-white/85'}`}
      >
        <Rocket size={14} /> KIDS MODE
        <span className={`relative h-5 w-9 rounded-full ${kidMode ? 'bg-white/40' : 'bg-white/20'}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${kidMode ? 'left-4.5' : 'left-0.5'}`} />
        </span>
      </button>

      {kidMode && (
        <div className={`kid-guide fixed left-3 z-40 flex max-w-[92vw] items-start gap-2 sm:left-5 ${inStory ? 'top-16 md:top-1/3' : 'top-1/3'}`}>
          <button onClick={() => setOpen(!open)} aria-label={open ? 'Hide Cosmo' : 'Show Cosmo'} className="cursor-pointer">
            <Astronaut talking={talking || narrating} mood={mood} size={open ? (inStory ? 92 : 110) : 72} />
          </button>
          {open && (
            <div key={shown} className="kid-bubble w-56 rounded-3xl bg-white p-4 text-slate-800 shadow-xl sm:w-72" aria-live="polite">
              <p className="text-sm font-semibold leading-snug">{shown}</p>
              {!inStory && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {place.gear.map((g: Gear) => (
                    <button key={g.name} onClick={() => say(g.text)} className="cursor-pointer rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-200">
                      {g.icon} {g.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between gap-2">
                {!inStory ? (
                  <button onClick={() => say(place.intro)} className="cursor-pointer text-xs font-bold text-pink-600">🔁 Tell me again</button>
                ) : (
                  <span className="text-[11px] font-bold text-indigo-500">{narrating ? '🎧 Listening to the story…' : 'Cosmo, your space guide'}</span>
                )}
                <button onClick={() => setVoiceOn(!voiceOn)} aria-label={voiceOn ? 'Turn fun sounds off' : 'Turn fun sounds on'} aria-pressed={voiceOn} title="Fun sounds" className="cursor-pointer text-slate-500">
                  {voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                {!inStory && (
                  <button onClick={() => setQuiz(true)} className="flex cursor-pointer items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold text-slate-900 hover:bg-amber-300">
                    {quizDone ? <Award size={13} /> : <Lock size={13} />} {quizDone ? 'Certificate' : 'Quiz'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {kidMode && quiz && <Quiz onClose={() => setQuiz(false)} />}
    </>
  )
}
