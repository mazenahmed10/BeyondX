import type { ChapterId } from './types'

/** Canonical 7-chapter structure used by every mission. Content comes from each mission's JSON. */
export const CANONICAL_CHAPTERS: { id: ChapterId; title: string; subtitle: string }[] = [
  { id: 'the-birth', title: 'THE BIRTH', subtitle: 'Why the mission was designed' },
  { id: 'the-journey', title: 'THE JOURNEY', subtitle: 'Launch and the road beyond Earth' },
  { id: 'the-arrival', title: 'THE ARRIVAL', subtitle: 'Reaching the destination' },
  { id: 'the-mission', title: 'THE MISSION', subtitle: 'Instruments, activities and goals' },
  { id: 'the-discoveries', title: 'THE DISCOVERIES', subtitle: 'What it taught humanity' },
  { id: 'the-last-days', title: 'THE LAST DAYS', subtitle: 'How the mission ended' },
  { id: 'what-remains', title: 'WHAT REMAINS', subtitle: 'Where it is now, and its legacy' },
]
