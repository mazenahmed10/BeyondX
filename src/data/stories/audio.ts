import type { StoryAudio } from './types'

/**
 * Original, team-supplied voice recordings (public/assets/audio). One recording exists per
 * story GROUP and per mode. Recordings were matched by file name and folder only.
 * Nothing here is synthesized at runtime; if a path is null the UI says "Audio recording unavailable".
 */
const base = '/assets/audio'

const pair = (world: string, file: string, sharedNote: string | null = null): StoryAudio => ({
  kids: `${base}/${world}/kids/${file}.mp3`,
  adults: `${base}/${world}/adults/${file}.mp3`,
  sharedNote,
})

export const AUDIO = {
  eagle: pair('moon', 'eagle'),
  lrv: pair('moon', 'lrv', 'This recording tells the story of all three Lunar Roving Vehicles together.'),
  alsep: pair('moon', 'alsep', 'This recording tells the story of the ALSEP stations as a group.'),
  surveyor: pair('moon', 'surveyor', 'This recording tells the story of the Surveyor program as a whole.'),
  sojourner: pair('mars', 'sojourner'),
  spiritOpportunity: pair('mars', 'spirit-opportunity', 'This recording covers Spirit and Opportunity together.'),
  viking: pair('mars', 'viking-1-2', 'This recording covers Viking 1 and Viking 2 together.'),
  phoenix: pair('mars', 'phoenix'),
  insight: pair('mars', 'insight'),
  ingenuity: pair('mars', 'ingenuity'),
  pioneer: pair('deep-space', 'pioneer-10-11', 'This recording covers Pioneer 10 and Pioneer 11 together.'),
  near: pair('deep-space', 'near-shoemaker'),
  dawn: pair('deep-space', 'dawn'),
  kepler: pair('deep-space', 'kepler'),
} satisfies Record<string, StoryAudio>
