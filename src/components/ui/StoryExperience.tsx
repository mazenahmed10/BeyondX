import { motion } from 'motion/react'
import { useAppStore } from '../../app/store'
import { getStory } from '../../data/stories'
import { StoryFlow } from '../story/StoryFlow'

/**
 * Deep Space story. The existing mission scene, camera focus and navigation are untouched:
 * this overlay only plugs the shared Discover-a-Story flow in beside the spacecraft.
 * Story ids are the Deep Space mission ids, so each of the five missions has its own story.
 */
export function StoryExperience() {
  const missionId = useAppStore((s) => s.selectedMission)
  const closeStory = useAppStore((s) => s.closeStory)
  const story = getStory(missionId)
  if (!story) return null
  return (
    <motion.div className="pointer-events-none absolute inset-0 z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      {/* soft vignette on the panel side so text stays readable over the nebula */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-l from-[rgba(2,4,10,0.7)] to-transparent md:block" />
      <StoryFlow key={story.id} story={story} onClose={closeStory} closeLabel="RETURN TO EXPLORATION" />
    </motion.div>
  )
}
