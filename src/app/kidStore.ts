import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface KidState {
  kidMode: boolean
  /** Kids Mode interface sounds on/off (short blips only; there is no synthesized speech). */
  voiceOn: boolean
  quizDone: boolean
  stars: number
  name: string
  setKidMode: (v: boolean) => void
  setVoiceOn: (v: boolean) => void
  completeQuiz: (stars: number) => void
  setName: (n: string) => void
}

export const useKidStore = create<KidState>()(
  persist(
    (set) => ({
      kidMode: false,
      voiceOn: true,
      quizDone: false,
      stars: 0,
      name: '',
      setKidMode: (kidMode) => set({ kidMode }),
      setVoiceOn: (voiceOn) => set({ voiceOn }),
      // Only the Quiz component calls this, after the last question is answered correctly.
      completeQuiz: (stars) => set({ quizDone: true, stars }),
      setName: (name) => set({ name }),
    }),
    { name: 'btm-kid-mode' },
  ),
)
