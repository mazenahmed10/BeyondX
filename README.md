# BEYOND THE MISSION
NASA Space Apps Challenge 2026 — "Abandoned but not Forgotten"

    npm install
    npm run dev      # http://localhost:5173
    npm run build

Worlds: THE MOON, MARS, DEEP SPACE (Dawn, NEAR Shoemaker, Pioneer 10, Pioneer 11, Kepler).

Flow: Space Hub -> Planet View (orbit/zoom/pan) -> ENTER EXPLORATION -> cinematic descent -> procedural surface (orbit/zoom/pan).
Navigation back: Planet View / Space Hub / Switch planet, available from the surface.

Status: planet globes use procedural stand-in textures; terrain is procedural (illustrative, not a real DEM).

## Discover a Story (Moon, Mars, Deep Space)

Surface: glowing discovery markers -> cinematic camera fly-in -> Mystery (silhouette) -> Guess (3 options, skippable)
-> Reveal -> six story steps (parts of the 3D model are highlighted) -> Final Fate (timeline, facts, real coordinates, sources).
Deep Space: the existing flow is unchanged (Hub -> Deep Space Hub -> Mission -> Discovery -> **DISCOVER ITS STORY**); the story
panel now runs the same Discover-a-Story flow beside the spacecraft.

* 29 independent stories: Moon 16 (Eagle descent stage, 3 LRVs, 5 ALSEP stations, 7 Surveyors incl. two impact sites),
  Mars 8 (Viking 1, Viking 2, Sojourner, Spirit, Opportunity, Phoenix, InSight, Ingenuity), Deep Space 5.
* Every story has a separately written Kids and Adults telling of the same facts. Content lives in `src/data/stories/`.
* Kids Mode: playful panel, Cosmo the guide (idle / speaking / listening / cheering), confetti, star progress, soft blips.
* Narration: original team recordings in `public/assets/audio/<world>/<kids|adults>/`. One audio channel, no autoplay,
  no text-to-speech. Missing recording -> "Audio recording unavailable".
* Marker positions on the procedural terrain are ILLUSTRATIVE. Real coordinates (where known) are shown as text in each story.

See `DISCOVER_A_STORY_IMPLEMENTATION.md` for architecture, the audio map, and the list of facts that still need a final check.
Deep Space scene details: `DEEP_SPACE_IMPLEMENTATION.md`.
