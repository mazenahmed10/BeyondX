import { CANONICAL_CHAPTERS } from './chapters'
import type {
  AssetCredit,
  EnvironmentId,
  ImageAsset,
  Mission,
  MissionNote,
  ScientificFact,
  SourceRef,
  StoryChapter,
  TimelineEvent,
  VerificationStatus,
  VideoAsset,
  World,
} from './types'

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v : null)
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)

const VERIFICATION: VerificationStatus[] = ['verified', 'needs_verification', 'pending_research', 'visual_reconstruction']
const ENVIRONMENTS: EnvironmentId[] = ['dawn-ceres', 'near-eros', 'pioneer-10', 'pioneer-11', 'kepler']
const WORLDS: World[] = ['moon', 'mars', 'deep-space']

const verification = (v: unknown, fallback: VerificationStatus = 'pending_research'): VerificationStatus =>
  VERIFICATION.includes(v as VerificationStatus) ? (v as VerificationStatus) : fallback

function source(v: unknown): SourceRef | null {
  if (!isObj(v)) return null
  const url = str(v.url)
  const title = str(v.title)
  if (!url || !title) return null
  return { title, url, publisher: str(v.publisher) ?? 'Unknown publisher', accessed: str(v.accessed) }
}
const sources = (v: unknown): SourceRef[] => arr(v).map(source).filter((s): s is SourceRef => s !== null)

function image(v: unknown): ImageAsset | null {
  if (!isObj(v)) return null
  const url = str(v.url)
  const sourceUrl = str(v.sourceUrl)
  const credit = str(v.credit)
  // Rule: every image must carry a source and a credit, otherwise it is dropped.
  if (!url || !sourceUrl || !credit) return null
  return {
    url,
    sourceUrl,
    credit,
    caption: str(v.caption) ?? '',
    license: str(v.license),
    kind: v.kind === 'official' ? 'official' : 'reconstruction',
  }
}

function video(v: unknown): VideoAsset | null {
  if (!isObj(v)) return null
  const url = str(v.url)
  const sourceUrl = str(v.sourceUrl)
  const credit = str(v.credit)
  if (!url || !sourceUrl || !credit) return null
  return { url, sourceUrl, credit, caption: str(v.caption) ?? '', license: str(v.license) }
}

function timelineEvent(v: unknown): TimelineEvent | null {
  if (!isObj(v)) return null
  const title = str(v.title)
  if (!title) return null
  return { title, date: str(v.date), description: str(v.description), source: source(v.source) }
}

function fact(v: unknown): ScientificFact | null {
  if (!isObj(v)) return null
  const label = str(v.label)
  const value = str(v.value)
  if (!label || !value) return null
  return { label, value, verification: verification(v.verification, 'needs_verification'), source: source(v.source) }
}

function chapters(raw: unknown): StoryChapter[] {
  const byId = new Map<string, Obj>()
  for (const c of arr(raw)) if (isObj(c) && typeof c.id === 'string') byId.set(c.id, c)
  return CANONICAL_CHAPTERS.map((canon) => {
    const c = byId.get(canon.id) ?? {}
    return {
      id: canon.id,
      title: str(c.title) ?? canon.title,
      subtitle: str(c.subtitle) ?? canon.subtitle,
      description: str(c.description),
      timeline: arr(c.timeline).map(timelineEvent).filter((e): e is TimelineEvent => e !== null),
      images: arr(c.images).map(image).filter((i): i is ImageAsset => i !== null),
      videos: arr(c.videos).map(video).filter((i): i is VideoAsset => i !== null),
      facts: arr(c.facts).map(fact).filter((f): f is ScientificFact => f !== null),
      sources: sources(c.sources),
    }
  })
}

function note(v: unknown): MissionNote | null {
  if (!isObj(v)) return null
  const text = str(v.text)
  if (!text) return null
  return { text, verification: verification(v.verification, 'needs_verification'), origin: str(v.origin) ?? 'Unspecified' }
}

function credit(v: unknown): AssetCredit | null {
  if (!isObj(v)) return null
  const name = str(v.name)
  if (!name) return null
  return {
    name,
    creator: str(v.creator),
    sourceUrl: str(v.sourceUrl),
    license: str(v.license),
    kind: v.kind === 'official' ? 'official' : 'reconstruction',
    attribution: str(v.attribution),
    modifications: str(v.modifications),
  }
}

export function validateMission(raw: unknown, file: string): Mission {
  if (!isObj(raw)) throw new Error(`[missions] ${file}: root must be an object`)
  const id = str(raw.id)
  const name = str(raw.name)
  if (!id || !name) throw new Error(`[missions] ${file}: "id" and "name" are required`)
  const env = raw.environmentId as EnvironmentId
  if (!ENVIRONMENTS.includes(env)) throw new Error(`[missions] ${file}: unknown environmentId "${String(raw.environmentId)}"`)
  const world = WORLDS.includes(raw.world as World) ? (raw.world as World) : 'deep-space'

  const va = isObj(raw.visualAssets) ? raw.visualAssets : {}
  const model = isObj(va.model) ? va.model : {}
  const coords = isObj(raw.coordinates) ? raw.coordinates : null

  return {
    id,
    world,
    name,
    spacecraft: str(raw.spacecraft) ?? name,
    category: str(raw.category) ?? 'Mission',
    destination: str(raw.destination) ?? 'Not yet verified',
    missionType: str(raw.missionType) ?? 'Not yet verified',
    missionStatus: str(raw.missionStatus),
    statusVerification: verification(raw.statusVerification),
    launchDate: str(raw.launchDate),
    arrivalDate: str(raw.arrivalDate),
    endDate: str(raw.endDate),
    finalLocation: str(raw.finalLocation),
    coordinates: coords
      ? { latitude: num(coords.latitude), longitude: num(coords.longitude), note: str(coords.note) }
      : null,
    environmentId: env,
    visualAssets: {
      preview: image(va.preview),
      images: arr(va.images).map(image).filter((i): i is ImageAsset => i !== null),
      videos: arr(va.videos).map(video).filter((i): i is VideoAsset => i !== null),
      model: {
        type: model.type === 'official' ? 'official' : model.type === 'placeholder' ? 'placeholder' : 'reconstruction',
        url: str(model.url),
        credit: str(model.credit),
        note: str(model.note),
      },
    },
    briefNotes: arr(raw.briefNotes).map(note).filter((n): n is MissionNote => n !== null),
    chapters: chapters(raw.chapters),
    timeline: arr(raw.timeline).map(timelineEvent).filter((e): e is TimelineEvent => e !== null),
    scientificFacts: arr(raw.scientificFacts).map(fact).filter((f): f is ScientificFact => f !== null),
    sources: sources(raw.sources),
    assetCredits: arr(raw.assetCredits).map(credit).filter((c): c is AssetCredit => c !== null),
    dataVerificationStatus: verification(raw.dataVerificationStatus),
  }
}
