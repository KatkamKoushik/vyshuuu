# VYSHUUU — The Unstitched Continuum
## Digital Haute Couture House & Saree Experience

> *"Where Ancient Geometry Meets Computational Couture."*

The saree is the subject.  
The browser is the digital loom.

---

## 1. Architectural Philosophy

VYSHUUU is an immersive digital haute couture experience devoted to the Indian handloom saree, unstitched silk architecture, and computational textile intelligence.

- **Atelier Brand:** **VYSHUUU**
- **Core Maxim:** The browser as a digital loom; the saree as an unstitched continuum
- **Rendering Spine:** Three.js + React Three Fiber on a single persistent canvas mounted behind semantic DOM layers
- **Motion & Scroll Architecture:** Lenis smooth scrolling integrated with GSAP ScrollTrigger, configured with disabled lag smoothing (`lagSmoothing(0)`) to avoid artificial tick jumps, and `requestAnimationFrame`-coalesced callbacks to reduce main-thread DOM reflows during scroll

---

## 2. Implemented Experience Architecture

The experience consists of an editorial narrative progressing through 11 interconnected sections:

1. **Brand Intro Loader (`VyshuuuLoader`)**: A non-blocking opening featuring transparent Cormorant Garamond typography and an animated SVG antique-gold zari filament.
2. **The Threshold (`ThresholdScene`)**: A single golden filament descending into obsidian silence, introducing the unstitched continuum.
3. **The 6-Yard Unfurling (`UnfurlingScene`)**: The signature WebGL cloth experience driven across 360vh. Powered by 9 locked production texture maps, GLSL shaders (catenary drape, dynamic traveling pleat kinematics, anisotropic zari specular glints, stone floor, and gallery backdrop), and interactive chiaroscuro raking light.
4. **Collection Introduction (`CollectionIntro`)**: Entrance into the curated digital textile collection.
5. **The Continuum Archetype (`ContinuumHero` / `VYSH-ARC-01`)**: Monumental architectural black and gold silk drapery.
6. **Continuum Editorial Sequence (`ContinuumSequence`)**: Seven-plate narrative sequence spanning flat layout, viscous folds, pleat rhythm, weave macro, border, pallu, and campaign.
7. **Color & Material Transition (`MaterialTransition`)**: Shift from deep obsidian darkness into luminous ecru silk.
8. **Gossamer Kora Light Corridor (`GossamerHero` & `GossamerSequence` / `VYSH-CHD-01`)**: Diaphanous sheer silk-cotton presented in sunlit gallery lighting.
9. **The Collection Wall (`CollectionWall`)**: Full 10-saree curatorial exhibition filterable across 4 thematic chapters (*Obsidian Foundation*, *Shadows of Varanasi & Paithan*, *Diaphanous Weaves*, *Earth & Temple Sanctum*).
10. **The Atelier Chamber (`AtelierChamber`)**: Five editorial photographic plates portraying anonymous craftsmanship studies (*Warp Tension*, *Weft Cadence*, *Structural Interlock*, *Tactile Weight*, *Living Heirloom*).
11. **Atelier Closing (`AtelierClosing`)**: Monolithic seal returning the viewer to obsidian silence.

### Specialized Interactive Systems
- **Saree Monograph Modal (`SareeMonographModal`)**: In-depth modal with curatorial essays, technical specifications, color palettes, weave structure, and high-resolution plate viewing.
- **Microscopic Weave Loupe (`MicroscopicWeaveLoupe`)**: Interactive optical magnification loupe for inspecting micro-weave structure.
- **Secret Selvedge Gesture (`SecretSelvedgeGesture`)**: Hidden textile interaction revealing selvedge craftsmanship.
- **Dynamic Lighting (`ChiaroscuroCursorLight`)**: Cursor-following lateral light beam simulating studio raking illumination across fabric folds.

---

## 3. Asset & Provenance Architecture

VYSHUUU enforces a clear separation between source archives, delivery assets, and digital textile artwork:

| Tier | Location | Scope & Governance |
| :--- | :--- | :--- |
| **Master Source Vault** | `VYSHUUU-SOURCE-VAULT/` (Local disk, git-ignored) | Master working directory containing working archives, generative iterations, 3D assets, textures, collection plates, and atelier editorial photography (measured at 276.44 MB on local disk). Kept off Git and out of deployment archives. |
| **Production Delivery** | Cloudinary CDN via `src/lib/assets/cloudinary-manifest.json` | 95 locked, optimized production assets (9 WebGL texture maps, 5 atelier editorial plates, 81 collection plates). Statically resolved from Cloudinary CDN to keep deployment archives free of heavy media files. |
| **Digital Textile Concepts** | `src/lib/collection/collectionData.ts` | 10 curated saree concepts honoring classical Indian textile lineages (Mulberry silk, Banarasi brocade, Chanderi kora, Paithani, Jamdani, Kota Doria). |

### Provenance & Governance Notice
- **Saree Collection**: All sarees presented in the collection are **art-directed digital textile interpretations** created for the digital atelier. They honor historical handloom traditions through computational geometry and shaders without asserting physical laboratory, museum, or artisan provenance.
- **Atelier Chamber**: Imagery represents **editorial imagery and anonymous craftsmanship studies** exploring loom tension, weft shuttles, and weave joinery. They do not assert verified documentary provenance, named historical artisans, or certified cooperative lineages.
- **CDN Asset Audit Note**: During repository audits, all 95 manifest URLs returned HTTP 200 and expected MIME types (`image/png` or `image/jpeg`) via automated HTTP HEAD verification against Cloudinary. Note that network HEAD checks confirm remote asset availability and header metadata; they do not by themselves constitute proof of client-side image decoding, GPU memory residency, or shader sampling compatibility across all devices.

---

## 4. Asset Delivery & Runtime Resolution

The application uses an asset delivery model implemented in `src/lib/assets/cloudinaryAssets.ts` and Next.js API routes:

- **CDN Resolution (Production & Default Dev)**:
  - Asset lookups resolve to Cloudinary CDN secure URLs defined in `src/lib/assets/cloudinary-manifest.json`.
  - Next.js API endpoints (`/api/textures/*`, `/api/atelier/*`, `/api/collection/*`) issue `307 Temporary Redirect` responses directly to Cloudinary.
  - Zero binary media files need to be committed to Git or packaged into the serverless deployment bundle.
- **Local Vault Fallback**:
  - If an asset entry is omitted or non-remote in `cloudinary-manifest.json`, the API routes fall back to reading files from `VYSHUUU-SOURCE-VAULT/` on the local filesystem.
  - *Note*: When `cloudinary-manifest.json` is populated with HTTPS URLs, API routes issue 307 redirects to those URLs; the local filesystem fallback does not dynamically intercept network disconnects.

---

## 5. Project Directory Structure

```
/
├── docs/                               # Architecture contracts & curatorial specifications
│   ├── SHOT-13-6-YARD-UNFURLING.md     # 6-Yard Unfurling technical specification
│   ├── SHOT-13A-VISUAL-REFINEMENT.md   # Visual refinement & camera tuning
│   ├── SHOT-14A-SAREE-COLLECTION-BIBLE.md # 10-Saree collection registry & taxonomy
│   ├── SHOT-12.9E-UV-MATERIAL-CONTRACT.md # UV mapping & shader contracts
│   └── ASSET-INTAKE.md                 # Asset governance & source vault rules
├── public/
│   ├── brand/                          # High-resolution transparent wordmark & SVG assets
│   └── assets/                         # Baseline folder scaffolding (git-ignored derivatives)
├── scripts/
│   ├── validate-textures.mjs           # Texture contract & bit-depth verification
│   └── upload-production-assets-to-cloudinary.mjs # Cloudinary synchronization utility
├── src/
│   ├── app/                            # Next.js App Router (layout, page, API routes)
│   │   └── api/                        # Asset resolvers (textures, atelier, collection)
│   ├── components/
│   │   ├── ambient/                    # Chiaroscuro light, material grain
│   │   ├── brand/                      # Monogram, Wordmark components
│   │   ├── editorial/                  # Editorial plates, loupe, modal, loader, chapters
│   │   └── layout/                     # SiteShell, Masthead, SkipLink
│   ├── experience/                     # Three.js / R3F scenes, shaders, and GlobalCanvas
│   │   ├── hooks/                      # useLockedTextures (9-map loader)
│   │   ├── scenes/                     # Threshold, Loom, Specimen, UnfurlingScene
│   │   └── shaders/                    # GLSL shaders (unfurling, backdrop, floor, loom)
│   ├── hooks/                          # RAF scroll progress, reduced motion
│   ├── lib/
│   │   ├── assets/                     # Cloudinary resolver & manifest
│   │   ├── collection/                 # Saree collection registry (10 concepts)
│   │   ├── lenis.ts                    # Lenis smooth scroll engine
│   │   └── scrollBridge.ts             # Direct scroll-to-uniform bridge
│   ├── stores/                         # Zustand state (experienceStore)
│   └── styles/                         # Design tokens, typography, CSS resets
└── VYSHUUU-SOURCE-VAULT/               # Local master asset vault (git-ignored, 276.44 MB)
```

---

## 6. Local Development & Verification

### Prerequisites
- Node.js >= 20.9.0
- pnpm >= 9.0.0

### Commands

```bash
# Install dependencies
pnpm install

# Start local development server with Turbopack (http://localhost:3000)
pnpm dev

# Run TypeScript typecheck
pnpm typecheck

# Run ESLint validation
pnpm lint

# Validate the 9 production texture maps (dimensions 1997x787, bit depth, channel counts)
pnpm validate:textures

# Run production build (validates static generation & bundle compilation)
pnpm build
```

---

## 7. Verification & Deployment Status

### Local Checks (Passed)
- **TypeScript Typecheck (`pnpm typecheck`)**: Passed with 0 errors (`tsc --noEmit`).
- **ESLint Validation (`pnpm lint`)**: Passed with 0 errors and 0 warnings (`eslint`).
- **Texture Contract Audit (`pnpm validate:textures`)**: All 9 production texture maps verified for 1997×787 dimensions, channel counts, and bit depths against contract.
- **Production Build (`pnpm build`)**: Compiled successfully (5/5 static and dynamic routes generated).
- **Headless Edge CDP Testing**: Verified loader animation stages (400ms entrance, 1100ms filament wave, 1600ms highlight shimmer, 2700ms site reveal) and local scroll responsiveness on localhost.
- **Asset Availability**: All 95 remote production assets verified via HTTP HEAD returning 200 OK and expected MIME types.

### Vercel Production Deployment (Pending)
- The application has passed all local development and build verification steps.
- Remote Git commit, push to GitHub, and live deployment to Vercel production remain pending. Live multi-region CDN edge latency and production device testing have not yet been evaluated on a deployed URL.

### Deployment Requirements
1. **Repository Cleanliness**: Ensure `VYSHUUU-SOURCE-VAULT/`, `scratch/`, and `qa-inspections/` remain excluded via `.gitignore`.
2. **Asset Manifest**: Ensure `src/lib/assets/cloudinary-manifest.json` is committed to Git so production environments resolve all 95 assets via Cloudinary CDN.
3. **Environment Variables**: Zero environment variables or API secrets are required for runtime production serving on Vercel, as all public asset URLs are statically resolved from the manifest. `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are needed only if running the optional asset upload script (`scripts/upload-production-assets-to-cloudinary.mjs`).
