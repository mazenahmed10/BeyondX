export type Phase =
  | 'HUB'
  | 'PLANET_VIEW'
  | 'DESCENT'
  | 'SURFACE'
  | 'DISCOVERY'
  | 'DEEP_SPACE'
  | 'MISSION'
  | 'STORY'

/**
 * Allowed transitions. The user can always step back, so no phase is a dead end:
 * every phase can reach the Space Hub (directly or through its parent).
 */
const TRANSITIONS: Record<Phase, readonly Phase[]> = {
  HUB: ['PLANET_VIEW', 'DEEP_SPACE'],
  PLANET_VIEW: ['HUB', 'DESCENT', 'PLANET_VIEW'],
  DESCENT: ['SURFACE', 'PLANET_VIEW', 'HUB'],
  SURFACE: ['DISCOVERY', 'PLANET_VIEW', 'HUB'],
  DISCOVERY: ['SURFACE', 'PLANET_VIEW', 'HUB'],
  DEEP_SPACE: ['HUB', 'MISSION'],
  MISSION: ['DEEP_SPACE', 'HUB', 'MISSION', 'STORY'],
  STORY: ['MISSION', 'DEEP_SPACE', 'HUB'],
}

export function canTransition(from: Phase, to: Phase): boolean {
  return TRANSITIONS[from].includes(to)
}

export const isDeepPhase = (p: Phase): boolean => p === 'DEEP_SPACE' || p === 'MISSION' || p === 'STORY'
