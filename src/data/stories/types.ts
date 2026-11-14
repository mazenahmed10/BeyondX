/**
 * Discover-a-Story data model, shared by Moon, Mars and Deep Space.
 * Story content lives in data files only; the UI (StoryFlow) never hard-codes a mission.
 * To add a story: append an entry to the relevant collection file. No component changes needed.
 */
export type StoryWorld = 'moon' | 'mars' | 'deep-space'

export type EquipmentType =
  | 'lander-stage'
  | 'crewed-rover'
  | 'science-station'
  | 'robotic-lander'
  | 'impact-site'
  | 'rover'
  | 'helicopter'
  | 'flyby-probe'
  | 'asteroid-orbiter'
  | 'orbiter'
  | 'space-telescope'

/** The six progressive storytelling steps, always in this order. */
export type StoryStepId = 'what' | 'why' | 'did' | 'discovered' | 'happened' | 'matters'

export const STORY_STEPS: { id: StoryStepId; title: string; kidTitle: string }[] = [
  { id: 'what', title: 'What was it?', kidTitle: 'What is this thing?' },
  { id: 'why', title: 'Why was it sent?', kidTitle: 'Why did it go?' },
  { id: 'did', title: 'What did it do?', kidTitle: 'What did it do?' },
  { id: 'discovered', title: 'What did it discover?', kidTitle: 'What did it find?' },
  { id: 'happened', title: 'What happened to it?', kidTitle: 'What happened next?' },
  { id: 'matters', title: 'Why does it still matter?', kidTitle: 'Why is it still cool?' },
]

export interface StoryStep {
  text: string
  /** Name of a part of the 3D model to highlight while this step is shown (optional). */
  highlight?: string
}

/** One complete, independently written telling of the story (kids or adults). */
export interface StoryNarrative {
  /** Shown during the Mystery stage, before the equipment is revealed. Must not name it. */
  hook: string
  steps: Record<StoryStepId, StoryStep>
}

export interface StoryGuess {
  question: string
  kidQuestion: string
  options: [string, string, string]
  /** Index of the correct option. */
  answer: 0 | 1 | 2
  /** One-line feedback shown after answering (same facts for both modes). */
  explain: string
}

export interface StoryFact {
  label: string
  value: string
}

/** Event kinds are kept distinct on purpose: they are NOT synonyms. */
export type EventKind =
  | 'LAUNCH'
  | 'ARRIVAL'
  | 'LANDING'
  | 'DEPLOYED'
  | 'MILESTONE'
  | 'LAST CONTACT'
  | 'LAST DATA'
  | 'OPERATIONS END'
  | 'OFFICIAL MISSION END'
  | 'IMPACT'
  | 'DEPARTURE'

export interface StoryTimelineEvent {
  date: string
  kind: EventKind
  text: string
}

export type FateStatus =
  | 'on-surface'
  | 'impact-remains'
  | 'in-orbit'
  | 'on-asteroid'
  | 'leaving-solar-system'
  | 'solar-orbit'

export interface StoryFate {
  status: FateStatus
  headline: string
  summary: string
  kidSummary: string
}

export interface StoryCoordinates {
  /** Degrees, north positive. */
  lat: number
  /** Degrees, east positive (-180..180). */
  lon: number
  precision: 'surveyed' | 'approximate'
  note: string | null
}

/**
 * How the object is placed in the 3D scene.
 * - geographic: placed on a real map/DEM at its true coordinates (not used yet: terrain is procedural)
 * - illustrative: visual placement only; real coordinates, if known, are shown as text
 * - not-applicable: the object is not on a surface (deep space)
 */
export type LocationAccuracy = 'geographic' | 'illustrative' | 'not-applicable'

export type ModelKind =
  | 'lm-descent'
  | 'lrv'
  | 'alsep'
  | 'surveyor'
  | 'impact'
  | 'sojourner'
  | 'mer'
  | 'viking'
  | 'phoenix'
  | 'insight'
  | 'ingenuity'
  | 'deep-existing'

export interface StoryModel {
  kind: ModelKind
  /** Per-mission variation of a shared model (e.g. which instruments an ALSEP had). */
  variant?: string
  /** Honest label: every model in this project is a simplified reconstruction. */
  note: string
}

export interface StoryAudio {
  /** Path under /public, or null when no recording was supplied. */
  kids: string | null
  adults: string | null
  /** Set when the supplied recording covers more than this one story (e.g. "Spirit and Opportunity"). */
  sharedNote: string | null
}

export interface StorySource {
  title: string
  url: string
  publisher: string
}

export interface Story {
  id: string
  world: StoryWorld
  collection: string
  mission: string
  equipmentName: string
  equipmentType: EquipmentType
  title: string
  subtitle: string
  kidsStory: StoryNarrative
  adultsStory: StoryNarrative
  guess: StoryGuess
  facts: StoryFact[]
  timeline: StoryTimelineEvent[]
  fate: StoryFate
  missionStatus: string
  location: string
  coordinates: StoryCoordinates | null
  locationAccuracy: LocationAccuracy
  model: StoryModel
  /** Reference images/videos. Empty until official assets with credits are supplied. */
  assets: { url: string; caption: string; credit: string; sourceUrl: string }[]
  audio: StoryAudio
  sources: StorySource[]
  /** Points that sources disagree on or that still need a human check. Shown in adults mode. */
  accuracyNotes?: string[]
}

export const RECONSTRUCTION_NOTE = 'Simplified procedural 3D reconstruction built in-app. Not an official NASA model, not to scale.'
