# DISCOVER A STORY — Implementation notes

Built on top of the existing BEYOND THE MISSION app. Phase machine, store, single persistent Canvas, `CameraRig`,
cinematic descent, Deep Space scenes and the Kids/Adults switch are all kept; changes are scoped additions.

## 1. Flow

```
SURFACE ──(click a marker / LOCATE A SIGNAL / Mars timeline)──▶ DISCOVERY ──(close / Esc)──▶ SURFACE
MISSION ──(DISCOVER ITS STORY)──▶ STORY ──(close / Esc)──▶ MISSION            (Deep Space, unchanged phases)
```

`DISCOVERY` already existed in `phaseMachine.ts` but was unused; it is now the surface story phase.
Inside a story: `mystery → guess → reveal → story (6 steps) → fate` (`src/app/storyStore.ts`).

| Stage | What happens |
|---|---|
| Mystery | Model is an unlit silhouette; hook text never names the object |
| Guess | "What do you think this is?" 3 options, instant feedback, always skippable |
| Reveal | Real materials restored with a pop + ground ring; name, mission, real location; audio player appears |
| Story | What was it / Why was it sent / What did it do / What did it discover / What happened / Why it matters. A named part of the model glows per step |
| Final Fate | Status chip, summary, timeline with distinct event kinds (LAUNCH, LANDING, LAST CONTACT, OFFICIAL MISSION END, IMPACT…), facts, real coordinates, accuracy notes, sources |

A story that was already discovered reopens at the Reveal. Discoveries persist in `localStorage` (`btm-discoveries`).

## 2. Files

| Area | Files |
|---|---|
| Story data (no UI) | `src/data/stories/{types,audio,moon,mars,deepSpace,index}.ts` |
| Story state | `src/app/storyStore.ts`; `store.ts` (+`selectDiscovery`, `closeDiscovery`) |
| Story UI | `src/components/story/{StoryFlow,AudioPlayer,Confetti}.tsx`, `src/components/ui/DiscoveryOverlay.tsx` |
| Surface scene | `src/scenes/surface/{sites.ts,SurfaceDiscoveries.tsx}`, `src/scenes/surface/models/*` (procedural models) |
| Audio | `src/audio/narration.ts` (single channel), `src/audio/sfx.ts` (kids blips), `public/assets/audio/**` |
| Modified | `App.tsx`, `store.ts`, `kidStore.ts` (comment), `main.tsx` (dev-only test hook), `CameraRig.tsx` (surface fly-in/out), `SpaceScene.tsx` (mount discoveries), `SurfaceEnvironment.tsx` + `rockScatter.ts` (no boulders on equipment), `SurfaceOverlay.tsx`, `StoryExperience.tsx`, `KidLayer.tsx`, `Astronaut.tsx`, `kidContent.ts`, `styles/index.css`, `index.html` (favicon), `data/missions/deep-space/*.json`, `README.md` |

Adding a story: append a `Story` to a collection file, give it a `PLACEMENT` entry in `sites.ts` (surface only) and a
model kind. No change to `StoryFlow`.

## 3. Models (all procedural reconstructions, not to scale)

`lm-descent` (descent stage only: no ascent stage), `lrv` (Apollo 17 variant has the map-and-tape fender), `alsep`
(per-mission instrument sets; Apollo 16 heat-flow cable stops short), `surveyor` (variants: camera / scoop without camera
for Surveyor 3 / alpha box / both), `impact` (Surveyor 2 and 4: crater + wreckage, never an intact lander), `sojourner`
(with the Pathfinder lander it arrived on), `mer` (Spirit sunk and tilted), `viking` (Viking 2 tilted on a rock; no orbiter),
`phoenix` (arm + trench with ice), `insight` (dusty arrays, SEIS dome, HP3), `ingenuity` (one blade broken).
Small objects (Sojourner, Ingenuity) are enlarged so they can be seen.

## 4. Location honesty

The terrain is procedural, so **every surface placement is `locationAccuracy: 'illustrative'`**; the layout only keeps
objects visible, sunlit and apart. Real coordinates are stored per story (`coordinates`, rounded to 0.01°) and shown as text.
Surveyor 4 has `coordinates: null` (NASA lists its impact location as unknown); Surveyor 2 is marked `approximate`.

## 5. Audio map (28 recordings, matched by file name and folder only)

| Story group | Kids | Adults | Used by |
|---|---|---|---|
| Eagle | moon/kids/eagle.mp3 (0:44) | moon/adults/eagle.mp3 (0:50) | Eagle |
| Moon Buggy / LRV | moon/kids/lrv.mp3 (0:45) | moon/adults/lrv.mp3 (1:00) | LRV 15, 16, 17 (shared) |
| ALSEP | moon/kids/alsep.mp3 (0:48) | moon/adults/alsep.mp3 (0:59) | ALSEP 12, 14, 15, 16, 17 (shared) |
| Surveyor | moon/kids/surveyor.mp3 (0:46) | moon/adults/surveyor.mp3 (0:55) | Surveyor 1–7 (shared) |
| Sojourner | mars/kids/sojourner.mp3 (0:43) | mars/adults/sojourner.mp3 (0:47) | Sojourner |
| Spirit & Opportunity | mars/kids/spirit-opportunity.mp3 (0:51) | mars/adults/spirit-opportunity.mp3 (0:55) | Spirit, Opportunity (shared) |
| Viking 1 & 2 | mars/kids/viking-1-2.mp3 (0:45) | mars/adults/viking-1-2.mp3 (0:52) | Viking 1, Viking 2 (shared) |
| Phoenix | mars/kids/phoenix.mp3 (0:54) | mars/adults/phoenix.mp3 (1:20) | Phoenix |
| InSight | mars/kids/insight.mp3 (0:54) | mars/adults/insight.mp3 (0:50) | InSight |
| Ingenuity | mars/kids/ingenuity.mp3 (0:51) | mars/adults/ingenuity.mp3 (0:55) | Ingenuity |
| Pioneer 10 & 11 | deep-space/kids/pioneer-10-11.mp3 (0:51) | deep-space/adults/pioneer-10-11.mp3 (1:09) | Pioneer 10, Pioneer 11 (shared) |
| NEAR Shoemaker | deep-space/kids/near-shoemaker.mp3 (0:52) | deep-space/adults/near-shoemaker.mp3 (1:08) | NEAR |
| Dawn | deep-space/kids/dawn.mp3 (0:50) | deep-space/adults/dawn.mp3 (0:52) | Dawn |
| Kepler | deep-space/kids/kepler.mp3 (0:56) | deep-space/adults/kepler.mp3 (0:47) | Kepler |

The recordings were **not listened to or transcribed** during implementation. Where one recording covers several
stories the player says so. The spoken text will therefore not match the on-screen text word for word.
Rules enforced in `narration.ts`: one `<audio>` element, no autoplay, stop on leaving a story, on changing story and on
switching Kids/Adults. The earlier browser text-to-speech in `KidLayer` was removed.

## 6. Needs a final human check

* Viking 1 lander end date: NASA pages give **Nov 11, 1982** (final transmission) and **Nov 13, 1982** (end of communications). Nov 13 is used; the story shows the discrepancy.
* Surveyor 2 impact: date Sept 22/23, 1966 depending on time zone; coordinates are an estimate.
* All coordinates were entered from NSSDCA/NASA values known to the implementer and rounded; only the Surveyor 2/4 entries and the Viking 1 date were re-checked online during this work.
* Deep Space mission JSON summaries are marked `needs_verification` for the same reason.
* Pioneer 11 launch is given as "April 1973" (April 5 in the US, April 6 UTC).
* No reference images are bundled (`assets: []` everywhere); the gallery from the old Deep Space story overlay was removed with its placeholders.
