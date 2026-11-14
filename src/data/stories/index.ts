import { DEEP_SPACE_STORIES } from './deepSpace'
import { MARS_STORIES } from './mars'
import { MOON_STORIES } from './moon'
import type { Story, StoryWorld } from './types'

export * from './types'
export { MARS_TIMELINE } from './mars'
export { DEEP_SPACE_FINAL } from './deepSpace'

export const STORIES: readonly Story[] = [...MOON_STORIES, ...MARS_STORIES, ...DEEP_SPACE_STORIES]

const byId = new Map<string, Story>()
for (const s of STORIES) {
  if (byId.has(s.id)) throw new Error(`[stories] duplicate story id "${s.id}"`)
  byId.set(s.id, s)
}

export function getStory(id: string | null | undefined): Story | null {
  return id ? (byId.get(id) ?? null) : null
}

export function storiesFor(world: StoryWorld): Story[] {
  return STORIES.filter((s) => s.world === world)
}

export function formatCoordinates(c: NonNullable<Story['coordinates']>): string {
  const lat = `${Math.abs(c.lat).toFixed(2)}°${c.lat >= 0 ? 'N' : 'S'}`
  const lon = `${Math.abs(c.lon).toFixed(2)}°${c.lon >= 0 ? 'E' : 'W'}`
  return `${c.precision === 'approximate' ? '≈ ' : ''}${lat}, ${lon}`
}
