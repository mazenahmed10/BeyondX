# DEEP SPACE — Asset Credits

Status: **no external image, video, texture or 3D model is used in Phase 3.** Everything on screen is generated in code.

| Asset | Source | Original URL | Licence / terms | Official or reconstruction | Attribution required | Notes |
|---|---|---|---|---|---|---|
| Dawn spacecraft model | Built in-app (`spacecraft/DawnModel.tsx`) | — | Project code | Visual reconstruction (simplified) | None | Not an official NASA model |
| NEAR Shoemaker model | Built in-app (`NearModel.tsx`) | — | Project code | Visual reconstruction (simplified) | None | Not an official NASA model |
| Pioneer 10 / 11 model | Built in-app (`PioneerModel.tsx`) | — | Project code | Visual reconstruction (simplified) | None | Same model for both; not official |
| Kepler model | Built in-app (`KeplerModel.tsx`) | — | Project code | Visual reconstruction (simplified) | None | Not an official NASA model |
| Ceres surface | Procedural (`createCeresTextures`) | — | Project code | Visual stand-in | None | Not a NASA mosaic |
| Eros shape/surface | Procedural (`NearErosScene.tsx`) | — | Project code | Visual stand-in | None | Not the real shape model |
| Earth, Jupiter, Saturn, Sun | Procedural | — | Project code | Visual stand-ins | None | Compositional only |
| Nebula, dust, meteors, stars | GLSL / procedural | — | Project code | Artistic | None | |

## Candidate official sources to evaluate (NOT yet used, licences NOT yet checked)

Taken from the project brief. Check each asset's own usage terms before embedding it.

* NASA 3D Resources — https://science.nasa.gov/3d-resources/ and https://nasa3d.arc.nasa.gov/
* NASA Image and Video Library — https://images.nasa.gov/
* NASA Photojournal — https://photojournal.jpl.nasa.gov/
* NASA NSSDCA — https://nssdc.gsfc.nasa.gov/
* Mission pages: https://science.nasa.gov/mission/dawn/ , /near-shoemaker/ , /pioneer-10/ , /kepler/

When an asset is added: fill `assetCredits` in the mission JSON and add a row here (name, creator, original URL, licence,
official/reconstruction, attribution text, modifications).
