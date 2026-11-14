import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Stages of one Discover-a-Story run. 'story' covers the six progressive steps. */
export type StoryStage = 'mystery' | 'guess' | 'reveal' | 'story' | 'fate'
export type GuessResult = 'right' | 'wrong' | 'skipped' | null
export type GuideMood = 'idle' | 'talk' | 'listen' | 'cheer' | 'oops'

interface StoryState {
  /** Ids of every story the user has revealed (persisted). Undiscovered equipment stays a silhouette. */
  discovered: string[]
  activeStoryId: string | null
  stage: StoryStage
  step: number
  guess: GuessResult
  /** Model part currently highlighted in the 3D scene (read by the scene, written by the story UI). */
  highlight: string | null
  /** Bumped at each reveal so the scene can play its reveal animation. */
  revealTick: number
  /** Kids-mode guide reaction for the current moment. */
  guideLine: string | null
  guideMood: GuideMood

  begin: (id: string) => void
  end: () => void
  setStage: (stage: StoryStage) => void
  setStep: (step: number) => void
  setGuess: (g: GuessResult) => void
  reveal: () => void
  setHighlight: (h: string | null) => void
  setGuide: (line: string | null, mood?: GuideMood) => void
  resetProgress: () => void
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      discovered: [],
      activeStoryId: null,
      stage: 'mystery',
      step: 0,
      guess: null,
      highlight: null,
      revealTick: 0,
      guideLine: null,
      guideMood: 'idle',

      // A story that was already discovered opens at the reveal: the mystery is only a mystery once.
      begin: (id) =>
        set({
          activeStoryId: id,
          stage: get().discovered.includes(id) ? 'reveal' : 'mystery',
          step: 0,
          guess: null,
          highlight: null,
          guideLine: null,
          guideMood: 'idle',
        }),
      end: () => set({ activeStoryId: null, highlight: null, guideLine: null, guideMood: 'idle' }),
      setStage: (stage) => set({ stage }),
      setStep: (step) => set({ step }),
      setGuess: (guess) => set({ guess }),
      reveal: () => {
        const { activeStoryId, discovered, revealTick } = get()
        if (!activeStoryId) return
        set({
          stage: 'reveal',
          revealTick: revealTick + 1,
          discovered: discovered.includes(activeStoryId) ? discovered : [...discovered, activeStoryId],
        })
      },
      setHighlight: (highlight) => set({ highlight }),
      setGuide: (guideLine, guideMood = 'talk') => set({ guideLine, guideMood }),
      resetProgress: () => set({ discovered: [] }),
    }),
    { name: 'btm-discoveries', partialize: (s) => ({ discovered: s.discovered }) },
  ),
)
