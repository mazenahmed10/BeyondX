import { create } from 'zustand'
import { canTransition, type Phase } from './phaseMachine'
import type { PlanetId } from '../planets/planetConfig'

export type LoadingState = 'booting' | 'ready' | 'error'
export type ExplorationState = 'idle' | 'transitioning'
/** Things selectable in the Space Hub. */
export type HubWorld = PlanetId | 'deep'

interface AppState {
  phase: Phase
  selectedPlanet: PlanetId | null
  hoveredPlanet: HubWorld | null
  selectedMission: string | null
  hoveredMission: string | null
  /** Surface/mission discovery currently focused by the camera (mission id for deep space). */
  selectedDiscovery: string | null
  loadingState: LoadingState
  explorationState: ExplorationState
  /** 0..1 black cross-fade used by cinematic transitions. */
  fade: number

  setPhase: (phase: Phase) => boolean
  selectPlanet: (id: PlanetId) => void
  enterExploration: () => void
  returnToPlanet: () => void
  backToHub: () => void

  enterDeepSpace: () => void
  selectMission: (id: string) => void
  backToDeepSpace: () => void
  focusDiscovery: (id: string | null) => void
  /** Moon/Mars: fly to a surface discovery marker and start its story. */
  selectDiscovery: (id: string) => void
  /** Moon/Mars: leave the story and return to free surface exploration. */
  closeDiscovery: () => void
  openStory: () => void
  closeStory: () => void

  setHoveredPlanet: (id: HubWorld | null) => void
  setHoveredMission: (id: string | null) => void
  setLoadingState: (state: LoadingState) => void
  setExplorationState: (state: ExplorationState) => void
  setFade: (value: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  phase: 'HUB',
  selectedPlanet: null,
  hoveredPlanet: null,
  selectedMission: null,
  hoveredMission: null,
  selectedDiscovery: null,
  loadingState: 'booting',
  explorationState: 'idle',
  fade: 0,

  setPhase: (phase) => {
    if (!canTransition(get().phase, phase)) return false
    set({ phase })
    return true
  },

  // Free choice from the hub, and from Planet View / Surface (switch planet).
  selectPlanet: (id) => {
    if (!canTransition(get().phase, 'PLANET_VIEW')) return
    set({ phase: 'PLANET_VIEW', selectedPlanet: id, hoveredPlanet: null, selectedDiscovery: null })
  },

  enterExploration: () => {
    const { phase, selectedPlanet, explorationState } = get()
    if (!selectedPlanet || explorationState === 'transitioning') return
    if (!canTransition(phase, 'DESCENT')) return
    set({ phase: 'DESCENT' })
  },

  returnToPlanet: () => {
    if (!get().selectedPlanet || !canTransition(get().phase, 'PLANET_VIEW')) return
    set({ phase: 'PLANET_VIEW', selectedDiscovery: null })
  },

  backToHub: () => {
    if (!canTransition(get().phase, 'HUB')) return
    set({
      phase: 'HUB',
      selectedPlanet: null,
      hoveredPlanet: null,
      selectedMission: null,
      hoveredMission: null,
      selectedDiscovery: null,
    })
  },

  enterDeepSpace: () => {
    if (!canTransition(get().phase, 'DEEP_SPACE')) return
    set({
      phase: 'DEEP_SPACE',
      selectedPlanet: null,
      hoveredPlanet: null,
      selectedMission: null,
      selectedDiscovery: null,
    })
  },

  selectMission: (id) => {
    if (!canTransition(get().phase, 'MISSION')) return
    set({ phase: 'MISSION', selectedMission: id, hoveredMission: null, selectedDiscovery: null })
  },

  backToDeepSpace: () => {
    if (!canTransition(get().phase, 'DEEP_SPACE')) return
    set({ phase: 'DEEP_SPACE', selectedMission: null, hoveredMission: null, selectedDiscovery: null })
  },

  focusDiscovery: (id) => {
    if (get().phase !== 'MISSION') return
    set({ selectedDiscovery: id })
  },

  selectDiscovery: (id) => {
    const { phase, explorationState } = get()
    if (phase !== 'SURFACE' || explorationState === 'transitioning') return
    if (!canTransition(phase, 'DISCOVERY')) return
    set({ phase: 'DISCOVERY', selectedDiscovery: id })
  },

  closeDiscovery: () => {
    if (get().phase !== 'DISCOVERY' || !canTransition('DISCOVERY', 'SURFACE')) return
    set({ phase: 'SURFACE', selectedDiscovery: null })
  },

  openStory: () => {
    if (!get().selectedMission || !canTransition(get().phase, 'STORY')) return
    set({ phase: 'STORY' })
  },

  closeStory: () => {
    if (!canTransition(get().phase, 'MISSION')) return
    set({ phase: 'MISSION' })
  },

  setHoveredPlanet: (id) => set({ hoveredPlanet: id }),
  setHoveredMission: (id) => set({ hoveredMission: id }),
  setLoadingState: (loadingState) => set({ loadingState }),
  setExplorationState: (explorationState) => set({ explorationState }),
  setFade: (fade) => set({ fade }),
}))
