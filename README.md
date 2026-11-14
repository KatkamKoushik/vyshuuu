# VYSHUUU // The Unstitched Continuum
### Digital Haute Couture House & Computational Textile Architecture

> *"Where Ancient Geometry Meets Computational Couture."*

The saree is the subject. The browser is the digital loom.

---

## 1. Architectural Vision & Provenance Synthesis

**VYSHUUU** is an avant-garde digital haute couture experience devoted to the Indian handloom saree, unstitched silk topology, and computational textile intelligence. 

Following forensic reverse-engineering of the world's most sophisticated creative web experiences (**Active Theory**, **Organimo**, **Santioni Spirits**, and **Noomo Valentime**), VYSHUUU is constructed not as a standard document website, but as a **Decoupled 3D Scenography** where user navigation directly glides a spatial camera along a continuous mathematical spline across five architectural sanctuaries.

```mermaid
flowchart TD
    subgraph Viewport["Full-Bleed Viewport (100svh)"]
        Canvas["Persistent WebGL Canvas (#Stage)\nThree.js + GLSL Cloth Shader + Gold Particles\npointer-events: none"]
        GLA11y["GLA11y Accessibility Mirror\nz-index: -1 (Screen-Reader Landmarks + Audio Toggle)"]
        
        subgraph DOM_HUD["Tactile DOM HUD & Scenography Layer"]
            Intro["CustomIntroLoader\nPrivate Exhibition Opening"]
            Masthead["Masthead & Magnetic Reticle\nChiaroscuro Cursor Spotlight"]
            Chambers["5 Architectural Sanctuaries:\n1. The Loom & Filament Threshold\n2. The 6-Yard Unfurling Sanctuary\n3. The Spatial Vault (3D Curved Ribbon)\n4. The Light Corridor (Gossamer Gallery)\n5. The Secret Atelier (Weaver Archives)"]
            Monograph["SareeMonographModal\n4x Microscopic Weave Loupe\nSecret Selvedge Spring Gesture"]
            Seal["LivingHeirloomSeal\n3D Tilt & 108Hz Resonance"]
        end
    end

    ScrollBridge["scrollBridge.ts\n(Instantaneous Scroll Velocity & Normalized Progress)"] --> Canvas
    ScrollBridge --> CameraSpline["CameraController.tsx\n(Active Theory Framerate-Normalized Alpha)"]
    CameraSpline --> Canvas
    ScrollBridge --> AudioEngine["webAudioEngine.ts\n(Organimo 4-Layer Web Audio Engine)"]
    AudioEngine --> AudioOutput["Procedural Acoustic Landscape\n(432Hz Drone • Pink Friction • Yaman Chimes • Loom Ticks)"]
```

---

## 2. Core Interactive Systems

```
┌────────────────────────────────────────────────────────────────────────┐
│  ACTIVE THEORY HYDRA SPLINE CAMERA                                    │
│  5-Chamber continuous camera path with framerate-normalized alpha:    │
│  α_norm = 1 - exp(ln(1 - α) * (Δt / 16.666ms))                       │
├────────────────────────────────────────────────────────────────────────┤
│  NOOMO TACTILE BUTTON MECHANICS (TactileGlowButton.tsx)                │
│  • Elastic SVG scaling border envelope (scale(.96, .85) -> 1.0)       │
│  • Real-time pointer tracking injecting --x, --y coordinates          │
│  • Analog woven micro-grain texture burn (mix-blend-mode: overlay)     │
│  • Dual-chromatic amber gold / sindoor crimson ambient gel shadows    │
├────────────────────────────────────────────────────────────────────────┤
│  ORGANIMO 4-LAYER SPATIAL WEB AUDIO (webAudioEngine.ts)                │
│  • Layer 1: Pythagorean 432 Hz Drone + 108 Hz Sub-Bass               │
│  • Layer 2: Pink-noise silk friction whisper modulated by velocity    │
│  • Layer 3: Indian Classical Raga Yaman pentatonic zari chimes        │
│  • Layer 4: Procedural wooden handloom shuttle & reed clicks          │
├────────────────────────────────────────────────────────────────────────┤
│  SANTIONI KINETIC TYPOGRAPHY & ORGANIC SVG BOUNDARIES                 │
│  • Split-word masked headlines (translate3d(0, 105%, 0))              │
│  • Non-scaling stroke organic SVG contour paths                       │
│  • InlineMediaHeadline with synchronized video weave portals          │
├────────────────────────────────────────────────────────────────────────┤
│  ACTIVE THEORY .GLA11y HEADLESS ACCESSIBILITY MIRROR                  │
│  • Headless semantic DOM layer (z-index: -1) mirroring 3D waypoints    │
│  • WCAG 2.1 Level AAA compliant; zero accessibility penalty           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The 5 Architectural Sanctuaries

```mermaid
sequenceDiagram
    autonumber
    actor Visitor as Collector / Connoisseur
    participant Scroll as Scroll & Touch Input (Lenis)
    participant Camera as Waypoint Camera Spline (R3F)
    participant Audio as 4-Layer Web Audio Engine
    participant Shader as Silk Cloth GLSL Simulation
    participant UI as Tactile HUD & Curatorial Monograph

    Visitor->>Scroll: Enters continuum & advances scroll
    Scroll->>Camera: Traverses parameter t (0.00 -> 1.00)
    Camera->>Audio: Modulates chamber depth filter & friction whisper
    Camera->>Shader: Injects touch ripples: sin(ωd - νt) * exp(-αd) * exp(-βt)
    
    rect rgb(20, 18, 15)
        Note over Camera,UI: Waypoint 01: The Loom & Filament Threshold (0.00 - 0.20)
        Note over Camera,UI: Waypoint 02: The 6-Yard Unfurling Sanctuary (0.20 - 0.45)
        Note over Camera,UI: Waypoint 03: The Spatial Vault & 3D Curved Ribbon (0.45 - 0.70)
        Note over Camera,UI: Waypoint 04: The Light Corridor & Gossamer Kora (0.70 - 0.88)
        Note over Camera,UI: Waypoint 05: The Secret Atelier & Living Heirloom Seal (0.88 - 1.00)
    end

    Visitor->>UI: Clicks "EXAMINE SPECIMEN" (.hit target)
    UI->>Camera: Smoothly lerps to macro inspection coordinate
    UI->>Audio: Awakens 108 Hz singing bowl resonance & Yaman zari chimes
    UI->>Visitor: Mounts SareeMonographModal with 4x Microscopic Weave Loupe
```

---

## 4. Specialized Interactive Craft

### A. Infinite 3D Curved Ribbon Stage (`SpatialCollectionExhibition.tsx`)
Ten canonical handloom sarees mounted along a cylindrical 3D orbital ribbon in virtual space.
* **Modular Wrapping**: Positioned along dynamic circular arcs using `((idx % 10) + 10) % 10`.
* **Tactile Momentum Drag**: Velocity physics with spring-back boundaries, wheel delta accumulation, and touch gesture support.
* **Optical Z-Index Sorting**: Cards dynamically compute proximity to the camera plane to ensure proper visual layering without clipping.

### B. Optical Glass Weave Loupe (`MicroscopicWeaveLoupe.tsx`)
A microscopic inspection instrument for examining textile weave architecture at $1.0\times$ to $4.0\times$ zoom:
* **Dual-Channel Chromatic Aberration**: Custom SVG filter `#spectralRedChannel` and `#spectralCyanChannel` simulating true optical glass dispersion.
* **Coordinate-Locked Raking Spotlight**: Simulates grazing studio light revealing 3D thread topography.
* **Audio Focus Telemetry**: Emits high-frequency mechanical lens detent clicks on scale changes and panning.

### C. Audio-Tactile Secret Selvedge Gesture (`SecretSelvedgeGesture.tsx`)
An intimate, discoverable interaction anchored to the gold zari selvedge boundary:
* **Elastic Spring Physics**: A horizontal drag gently separates the selvedge thread from the cloth, building tactile tension with elastic resistance.
* **Spring Snap Rebound**: Upon release, an underdamped harmonic oscillator ($A e^{-\zeta t} \cos(\omega t)$) snaps the thread back with metallic zari acoustic partials.
* **Authenticated Latching**: Drawing the thread past $\ge 80\%$ tension permanently latches the docket, unlocking the master weaver provenance dossier.

### D. Living Heirloom Seal (`LivingHeirloomSeal.tsx`)
The culminating digital fashion house seal:
* **3D Pointer Tilt Physics**: Interactive viscous spring inertia tracking pointer azimuth and elevation.
* **Specular Reflection**: Dynamic raking highlight and anisotropic metallic sheen.
* **108 Hz Acoustic Awakening**: Synthesizes a sacred 108 Hz darkroom singing bowl with rich ethereal overtones.

---

## 5. Technology Stack

* **Framework**: Next.js 15 (App Router, Turbopack, React 19)
* **Language**: TypeScript (Strict Mode)
* **3D & Shaders**: Three.js, React Three Fiber (R3F), GLSL Custom Vertex/Fragment Shaders
* **Styling**: Tailwind CSS, OKLCH Color Space, CSS Custom Properties
* **Animation & Momentum**: GSAP 3, GSAP ScrollTrigger, Lenis Smooth Scroll
* **Audio Engine**: Native Web Audio API (100% procedural, 0 external audio files)
* **Media Delivery**: Cloudinary CDN with automatic WebP/AVIF format and responsive `srcSet` generation

---

## 6. Project Directory Scaffolding

```
/
├── docs/                               # Architectural contracts & design specifications
├── wiki/                               # Comprehensive multi-file architectural documentation
├── public/                             # Public static brand assets & favicons
├── src/
│   ├── app/                            # Next.js App Router (pages, layout, API routes)
│   │   ├── api/                        # Asset redirect resolvers (atelier, collection, textures)
│   │   ├── layout.tsx                  # Root HTML shell & viewport meta
│   │   └── page.tsx                    # Primary scenography controller & .GLA11y mirror
│   ├── components/
│   │   ├── ambient/                    # Magnetic Chiaroscuro Cursor, Material Grain
│   │   ├── audio/                      # SoundWaveToggle component
│   │   ├── brand/                      # Monogram, Wordmark SVG components
│   │   ├── editorial/                  # Ribbon stage, weave loupe, monograph modal, selvedge
│   │   ├── layout/                     # SiteShell, Masthead, SkipLink
│   │   └── ui/                         # TactileGlowButton (Noomo micro-physics)
│   ├── experience/                     # Three.js WebGL rendering pipeline
│   │   ├── controllers/                # CameraController (Active Theory waypoint spline)
│   │   ├── hooks/                      # useLockedTextures (9-map production loader)
│   │   ├── scenes/                     # UnfurlingScene, GoldParticles, LoomScene
│   │   └── shaders/                    # GLSL shaders (catenary drape, pleats, stone floor)
│   ├── hooks/                          # RAF scroll progress, reduced motion, WebGL support
│   ├── lib/
│   │   ├── assets/                     # Cloudinary manifest & responsive image helpers
│   │   ├── atmosphere/                 # Chromatic atmospheres per saree
│   │   ├── audio/                      # webAudioEngine (4-layer procedural audio)
│   │   ├── collection/                 # 10 canonical saree concepts & taxonomy
│   │   ├── lenis.ts                    # Lenis smooth scroll bridge
│   │   └── scrollBridge.ts             # Decoupled scroll-to-uniform bridge
│   ├── stores/                         # Zustand state store (experienceStore.ts)
│   └── styles/                         # Design tokens, typography, OKLCH theme variables
├── .env.example                        # Cloudinary CDN credentials template
└── LICENSE                             # MIT License
```

---

## 7. Environment Configuration

VYSHUUU utilizes Cloudinary for high-performance CDN delivery of 95 locked production assets. Create a `.env.local` file in the root directory:

```env
# Cloudinary CDN Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
```

---

## 8. Local Development & Verification

### Installation
```bash
pnpm install
```

### Start Development Server
```bash
pnpm dev
```
Open `http://localhost:3000` to experience the live continuum.

### Quality & Audit Suite
```bash
# TypeScript strict type checking
pnpm exec tsc --noEmit

# Automated redesign assertions
node scratch/verify_next_level_redesign.mjs

# WCAG 2.1 AAA accessibility & contrast audit
node scratch/audit_accessibility_and_contrast.mjs

# Microscopic Weave Loupe & Monograph E2E test
node scratch/verify_phase2_loupe.mjs

# Production compilation & static optimization
pnpm build
```

---

## 9. Comprehensive Documentation & Wiki

For deep technical dives into individual subsystems, explore the dedicated documentation in the [`wiki/`](./wiki/) directory:

* **[Wiki Home](./wiki/Home.md)**: Architectural Principles & Navigation Index
* **[System Architecture](./wiki/System-Architecture.md)**: Waypoint Splines, Decoupled Stage & Framerate Normalization
* **[WebGL Pipeline & Shaders](./wiki/WebGL-Pipeline-and-Shaders.md)**: GLSL Cloth Simulation, Catenary Pleats & Zari Anisotropy
* **[Audio Scenography Engine](./wiki/Audio-Scenography-Engine.md)**: 4-Layer Web Audio Synthesis, Raga Yaman Tuning & Loom Mechanics
* **[Tactile UI & Interaction](./wiki/Tactile-UI-and-Interaction.md)**: Noomo Button Physics, Spring Tension & Chiaroscuro Reticle
* **[Curatorial Taxonomy & Assets](./wiki/Curatorial-Taxonomy-and-Assets.md)**: 10 Saree Archetypes, Cloudinary Pipeline & D-Drive Setup
* **[Accessibility & Performance](./wiki/Accessibility-and-Performance.md)**: Active Theory `.GLA11y` Mirror & WCAG 2.1 AAA Compliance

---

## 10. Community Standards & Governance

* **[Code of Conduct](./CODE_OF_CONDUCT.md)**: Contributor standards and reporting policy.
* **[Contributing Guidelines](./CONTRIBUTING.md)**: Development setup, shader rules, and PR workflow.
* **[Security Policy](./SECURITY.md)**: Responsible disclosure guidelines.
* **[Accessibility Statement](./ACCESSIBILITY.md)**: Full WCAG 2.1 AAA conformance audit.
* **[License](./LICENSE)**: MIT License.

---

*&copy; 2026 VYSHUUU. All rights reserved. Preserved in digital amber.*
