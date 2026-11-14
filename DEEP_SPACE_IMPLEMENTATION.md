# DEEP SPACE & OTHER MISSIONS — Implementation (Phase 3)

Deep Space is a third, independent world next to THE MOON and MARS. It plugs into the existing
phase machine, store, single persistent Canvas and `CameraRig`; Moon/Mars code paths are unchanged.

## 1. Architecture

```
HUB ──(choose DEEP SPACE)──▶ DEEP_SPACE ──(Explore Mission)──▶ MISSION ──(Discover its story)──▶ STORY
 ▲                               ▲  ▲                              │  ▲                              │
 └───────────── Space Hub ───────┘  └──── Deep Space Hub ──────────┘  └──── Return to exploration ───┘
```

* **Phase machine** (`src/app/phaseMachine.ts`): added `DEEP_SPACE`, `MISSION`, `STORY`.
  `HUB → DEEP_SPACE` is the only entry; there is no path between Deep Space and Moon/Mars except via the Space Hub.
* **Store** (`src/app/store.ts`): `selectedMission`, `hoveredMission`, actions `enterDeepSpace`, `selectMission`,
  `backToDeepSpace`, `focusDiscovery`, `openStory`, `closeStory`. `selectedDiscovery` doubles as "camera is focused on the
  spacecraft" (for deep space it holds the mission id).
* **Camera** (`src/camera/CameraRig.tsx`): still the only owner of the camera. A new `isDeepPhase` branch flies GSAP
  moves (OrbitControls disabled), then hands control back with per-view limits. While the STORY overlay is open the
  camera is frozen and returns exactly where it was.
* **One Canvas**: `SpaceScene` mounts `DeepSpaceScene` only in deep phases. Each mission environment is a separate lazy
  chunk (`React.lazy`), loaded when the user opens it.

## 2. What was added

| Area | Files |
|---|---|
| Data layer | `src/data/missions/{types,chapters,validate,index}.ts`, `src/data/missions/deep-space/*.json` |
| Scene config | `src/scenes/deep/environments.ts` (camera poses, limits, honest-labelling notices), `glsl.ts` |
| Backdrop | `src/scenes/deep/backdrop/{NebulaSphere,CosmicDust,ShootingStars,DeepBackdrop}.tsx` |
| Spacecraft (reconstructions) | `src/scenes/deep/spacecraft/*` (Dawn, NEAR, Pioneer, Kepler) |
| Scenes | `DeepSpaceHubScene`, `DeepSpaceScene` (router), `missions/{DawnCeres,NearEros,Pioneer10,Pioneer11,Kepler}Scene`, `PioneerScene`, `DiscoveryMarker`, `OrbitLine` |
| Hub object | `src/planets/DeepSpaceBeacon.tsx` |
| UI | `HubOverlay` (3 worlds), `DeepSpaceOverlay` (mission cards), `MissionOverlay`, `StoryExperience`, `VerificationBadge`, `Placeholder` |
| Modified | `phaseMachine.ts`, `store.ts`, `CameraRig.tsx`, `SpaceScene.tsx`, `App.tsx`, `Atmosphere.tsx` (+`scale` prop), `proceduralTextures.ts` (+Ceres/Earth/gas-giant stand-ins; `bake` exported) |

## 3. Navigation

* Space Hub: THE MOON / MARS / DEEP SPACE (3D beacon or button) — free choice, no forced order.
* Deep Space Hub: five spacecraft in a nebula + mission cards. Click a spacecraft or **EXPLORE MISSION**.
* Mission: marker on the spacecraft (or **LOCATE SPACECRAFT**) → camera focus + discovery card → **DISCOVER ITS STORY**.
* Always available: mission pills (switch mission), **DEEP SPACE** (hub), **SPACE HUB**. In the story: Esc / **RETURN TO EXPLORATION**, ←/→ chapters.
* Moon/Mars are reached only through the Space Hub.

## 4. Missions

| id | Environment | Scene content (all visual stand-ins) |
|---|---|---|
| `dawn` | `dawn-ceres` | Ceres (procedural), Dawn parked on a representative tilted orbit ring |
| `near-shoemaker` | `near-eros` | Elongated cratered asteroid, NEAR model placed on its surface |
| `pioneer-10` | `pioneer-10` | Pioneer model, illustrative dashed path, Jupiter stand-in |
| `pioneer-11` | `pioneer-11` | Separate scene: Pioneer model, illustrative path, Jupiter and Saturn stand-ins |
| `kepler` | `kepler` | Sun, Earth (reference), Kepler on a larger, trailing heliocentric orbit ring |

## 5. Data structure

Defined in `src/data/missions/types.ts` (`Mission`, `StoryChapter`, `TimelineEvent`, `ScientificFact`, `SourceRef`,
`ImageAsset`, `VideoAsset`, `AssetCredit`). The same model is meant for Moon and Mars discovery later (`world`).

* Unknown values are `null` / `[]`; nothing is invented. `VerificationStatus`:
  `verified | needs_verification | pending_research | visual_reconstruction`.
* Every mission always has the 7 canonical chapters (`chapters.ts`); a JSON only supplies what it has.
* `validate.ts` drops any image/video without `url`, `sourceUrl` **and** `credit` (rule: every asset needs a source/credit),
  drops malformed entries, and rejects unknown `environmentId`.
* `briefNotes` hold the few statements taken from the project brief; they are shown with **NEEDS VERIFICATION**.
  Replace them with sourced facts once researched.

## 6. Adding the real data (no component changes)

1. Open `src/data/missions/deep-space/<id>.json`.
2. Fill `launchDate`, `arrivalDate`, `endDate`, `finalLocation`, `missionStatus` (+ `statusVerification: "verified"`).
3. In `chapters`, add objects by `id` (`the-birth` … `what-remains`) with `description`, `timeline`, `facts`, `images`,
   `videos`, `sources`. Every image needs `url`, `sourceUrl`, `credit` (and `license` if known).
4. Add `sources`, `assetCredits`, set `dataVerificationStatus`. Update `DEEP_SPACE_ASSET_CREDITS.md`.
5. Put local images under `public/assets/images/deep-space/<id>/` and reference them as `/assets/images/...`.
6. New mission: add a JSON file + an environment (see `environments.ts`, `DeepSpaceScene.tsx`); the hub and cards pick it up.

Placeholders: in development they are loud (dashed gold box + file path); in production they render as a quiet
"awaiting verified research data" line, never as facts.

## 7. Replacing placeholder 3D/texture assets

* Spacecraft: replace the component in `spacecraft/` (or load a glTF with drei `useGLTF`) and set
  `visualAssets.model.type` to `official` with `credit` in the JSON. Keep the "visual reconstruction" note otherwise.
* Ceres/Eros/Earth/Jupiter/Saturn: textures come from `proceduralTextures.ts` / `NearErosScene.tsx`; swap in NASA textures
  (license-checked) and credit them.

## 8. Tested (this environment, no GPU/browser)

* `tsc -b` type check and `vite build` pass; each mission scene is its own chunk.
* Navigation/state: 25+ transitions incl. illegal jumps, Moon/Mars regression (descend, surface, switch planet, back).
* Data: 5 missions load, 7 chapters each, no invented values, validator rules.
* UI in jsdom with real clicks: 5 cards → 5 missions, overlay focus/story flow, mission switching, Space Hub/Deep Space
  buttons, all 7 chapters reachable, return to exploration.
* Geometry maths: Eros mesh finite, lander on surface; camera poses outside bodies; meteor respawn logic.

## 9. Not tested / still to do

* **No WebGL rendering was run**: visuals, shader output (nebula/beacon), shadows, camera feel and frame rate are unverified.
* Mobile/tablet layout reviewed in code only (scrollable card row, adaptive hub camera distance, chapter rail becomes a
  horizontal strip); not checked on devices. Touch orbit/zoom comes from OrbitControls defaults.
* All story content, dates, status, images, official models and licences are pending research.
* Pioneer 10/11 background bodies and paths are compositional only; confirm what to show against sources.
* Spacecraft models are simplified from general knowledge of the designs; compare against official references.
