/**
 * Unified mission data model shared by Moon, Mars and Deep Space.
 * Anything not yet researched is null / empty and is shown as "awaiting data".
 */
export type World = 'moon' | 'mars' | 'deep-space'

export type VerificationStatus = 'verified' | 'needs_verification' | 'pending_research' | 'visual_reconstruction'

export type EnvironmentId = 'dawn-ceres' | 'near-eros' | 'pioneer-10' | 'pioneer-11' | 'kepler'

export type ChapterId =
  | 'the-birth'
  | 'the-journey'
  | 'the-arrival'
  | 'the-mission'
  | 'the-discoveries'
  | 'the-last-days'
  | 'what-remains'

export interface SourceRef {
  title: string
  url: string
  publisher: string
  accessed: string | null
}

export interface ImageAsset {
  url: string
  caption: string
  sourceUrl: string
  credit: string
  license: string | null
  kind: 'official' | 'reconstruction'
}

export interface VideoAsset {
  url: string
  caption: string
  sourceUrl: string
  credit: string
  license: string | null
}

export interface TimelineEvent {
  date: string | null
  title: string
  description: string | null
  source: SourceRef | null
}

export interface ScientificFact {
  label: string
  value: string
  verification: VerificationStatus
  source: SourceRef | null
}

export interface StoryChapter {
  id: ChapterId
  title: string
  subtitle: string
  /** null = awaiting research data */
  description: string | null
  timeline: TimelineEvent[]
  images: ImageAsset[]
  videos: VideoAsset[]
  facts: ScientificFact[]
  sources: SourceRef[]
}

export interface MissionNote {
  text: string
  verification: VerificationStatus
  origin: string
}

export interface AssetCredit {
  name: string
  creator: string | null
  sourceUrl: string | null
  license: string | null
  kind: 'official' | 'reconstruction'
  attribution: string | null
  modifications: string | null
}

export interface Mission {
  id: string
  world: World
  name: string
  spacecraft: string
  category: string
  destination: string
  missionType: string
  missionStatus: string | null
  statusVerification: VerificationStatus
  launchDate: string | null
  arrivalDate: string | null
  endDate: string | null
  finalLocation: string | null
  coordinates: { latitude: number | null; longitude: number | null; note: string | null } | null
  environmentId: EnvironmentId
  visualAssets: {
    preview: ImageAsset | null
    images: ImageAsset[]
    videos: VideoAsset[]
    model: { type: 'official' | 'reconstruction' | 'placeholder'; url: string | null; credit: string | null; note: string | null }
  }
  briefNotes: MissionNote[]
  chapters: StoryChapter[]
  timeline: TimelineEvent[]
  scientificFacts: ScientificFact[]
  sources: SourceRef[]
  assetCredits: AssetCredit[]
  dataVerificationStatus: VerificationStatus
}
