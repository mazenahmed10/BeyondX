import { motion } from 'motion/react'
import { useAppStore } from '../../app/store'
import { getStory } from '../../data/stories'
import { StoryFlow } from '../story/StoryFlow'

/** Moon / Mars: the story panel shown while the camera is focused on a piece of surface equipment. */
export function DiscoveryOverlay() {
  const id = useAppStore((s) => s.selectedDiscovery)
  const closeDiscovery = useAppStore((s) => s.closeDiscovery)
  const story = getStory(id)
  if (!story) return null
  return (
    <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <StoryFlow key={story.id} story={story} onClose={closeDiscovery} closeLabel="RETURN TO THE SURFACE" />
      <p className="pointer-events-none absolute bottom-3 left-4 hidden max-w-xs font-mono text-[10px] tracking-[0.2em] text-white/35 md:block">
        DRAG TO ORBIT THE OBJECT · SCROLL TO ZOOM · ESC TO RETURN
      </p>
    </motion.div>
  )
}
