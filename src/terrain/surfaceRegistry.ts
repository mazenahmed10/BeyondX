import type { HeightFn } from './proceduralTerrain'

/** Lets the camera rig keep the camera above the ground without importing scene components. */
export const surfaceRegistry: { heightAt: HeightFn | null } = { heightAt: null }
