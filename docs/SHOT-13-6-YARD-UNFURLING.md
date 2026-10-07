# SHOT 13 — THE 6-YARD UNFURLING

> **Document Status**: Complete & Verified  
> **Milestone**: SHOT 13 — The Signature 6-Yard Unfurling  
> **Date**: October 7, 2026  
> **Source Documents**: [`docs/SHOT-12.9E-UV-MATERIAL-CONTRACT.md`](file:///d:/saree/docs/SHOT-12.9E-UV-MATERIAL-CONTRACT.md), [`docs/SHOT-12.9F-TECHNICAL-MAP-AUTHORING.md`](file:///d:/saree/docs/SHOT-12.9F-TECHNICAL-MAP-AUTHORING.md), [`docs/SHOT-12.9H-TECHNICAL-MAP-VISUAL-QA.md`](file:///d:/saree/docs/SHOT-12.9H-TECHNICAL-MAP-VISUAL-QA.md)  
> **Locked Assets**: All 9 Production Maps (TEX-01 through TEX-09) **LOCKED**

---

## 1. Executive Summary

SHOT 13 establishes the central signature hero experience of VYSHUUU: **THE 6-YARD UNFURLING**.

Conceived under the core aesthetic maxim *"The browser is the digital loom; the saree is the subject,"* the experience treats the 6-yard saree not as a generic 3D cloth flag or simulated polygonal mesh, but as one continuous, unbroken piece of premium woven handloom silk emerging from deep obsidian darkness and revealing its monumental architectural drape across time and space.

The sequence directly integrates all **nine locked production texture maps** (`01_BASE_COLOR` through `09_EDGE_FRINGE_MASK`) authored and verified during SHOT 12.9D–H, feeding them into a high-performance GLSL PBR + Anisotropic material system rendered in Three.js and React Three Fiber.

---

## 2. Core Narrative Sequence (0% → 100%)

The unfurling sequence is driven smoothly and reversibly by scroll progress ($p \in [0.00, 1.00]$):

```
0%   Near-black / single golden filament descending in obsidian space
15%  Filament resolves into digital loom warp; woven structure emerges
30%  Obsidian silk surface materializes; catenary sag establishes mass
45%  Continuous fabric begins unfurling across an S-curve spatial arc
60%  Traveling pleats develop and cascade through the cloth with kinetic inertia
75%  Pallu enters view; antique zari threads catch lateral raking chiaroscuro light
90%  Full 6-yard textile composition becomes legible across all semantic zones
100% Fabric settles into serene breathing equilibrium; VYSHUUU identity emerges
```

### Phase Details:

1. **0% – 15% (Threshold to Woven Structure)**:
   - Opens in near-black darkness with the single golden Zari filament descending vertically through `<ThresholdScene />`.
   - As scroll begins, the filament undergoes micro-vibrations, expanding into vertical warp tension lines that dissolve seamlessly into the digital loom textile manifold.
2. **15% – 30% (Surface Emergence & Catenary Sag)**:
   - The unstitched charcoal silk surface materializes with viscous physical mass.
   - Initial catenary drape sags softly under gravity, establishing physical weight ($Z \sim -\sin(\pi U) \cdot \sin(\pi V)$).
3. **30% – 45% (Continuous S-Curve Unfurling)**:
   - The fabric begins its sweeping continuous unfurling arc across the 3D viewport.
   - The trailing edge recedes into atmospheric depth while the leading edge arcs gracefully toward the viewer.
4. **45% – 60% (Traveling Pleats & Velocity Ripple)**:
   - Deep, asymmetrical, cascading pleats (*patli*) ripple rhythmically along the length of the saree ($U$ coordinate).
   - Instantaneous scroll velocity directly pumps kinetic energy into pleat amplitude: rapid scrolling billows the fold crests, while slow scrolling preserves disciplined, heavy silk drape.
5. **60% – 75% (Pallu Entrance & Raking Zari Glint)**:
   - The ornate **Pallu** ($U \in [0.66, 0.98]$) sweeps forward into the camera's raking light cone.
   - Driven by `06_WEAVE_DIRECTION` and `08_MICRO_NORMAL`, the transverse weft gold threads burst into golden luster, catching anisotropic specular glints under the acute grazing illumination.
6. **75% – 90% (The 6-Yard Composition)**:
   - All semantic design zones become legible simultaneously: left border ribbon, charcoal body silk, red accent stripes, and the monumental pallu with fringe tassel edging (`09_EDGE_FRINGE_MASK`).
7. **90% – 100% (Settled Equilibrium & VYSHUUU Reveal)**:
   - Fabric decelerates into its resting architectural pose with subtle harmonic micro-breathing ($< 0.005$ amplitude).
   - The monumental wordmark **VYSHUUU** and subtitle **"THE UNSTITCHED CONTINUUM"** emerge with editorial dignity.

---

## 3. Technical Architecture & Shader System

### 3.1 Scene Architecture
- **Host Component**: [`src/experience/scenes/UnfurlingScene.tsx`](file:///d:/saree/src/experience/scenes/UnfurlingScene.tsx)
- **Geometry**: `THREE.PlaneGeometry(7.2, 2.84, segX, segY)` matching the canonical aspect ratio $1997 \times 787 \approx 2.538:1$.
  - Tier `ULTRA` / `HIGH`: $160 \times 80$ vertices (13,041 vertices, highly optimized GPU load).
  - Tier `MED`: $100 \times 50$ vertices.
  - Tier `LOW` / `FALLBACK`: $64 \times 32$ vertices.
- **Rendering**: Integrated into the global fixed canvas via `<ExperienceRoot />`, with alpha transparency and zero canvas recreation across route navigation.

### 3.2 Locked Texture Pipeline (Source Vault Stream)
To uphold the zero-asset-duplication rule in `public/assets/`, textures are streamed securely from [`VYSHUUU-SOURCE-VAULT/04_TEXTURES/`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/04_TEXTURES/) via an immutable App Router API endpoint:
[`src/app/api/textures/[...path]/route.ts`](file:///d:/saree/src/app/api/textures/%5B...path%5D/route.ts)

All nine locked maps are bound to dedicated texture sampler uniforms:

| Shader Uniform | Map ID | Production Map Name | Encoding Mode | Role in Shader |
| :--- | :--- | :--- | :---: | :--- |
| `tBaseColor` | TEX-01 | `VYSHUUU-TEX-01-base-color.png` | sRGB | Charcoal silk body, gold brocade, and red accent base albedo |
| `tZariMask` | TEX-02 | `VYSHUUU-TEX-02-zari-mask.png` | Linear | Metallic brocade mask; elevates metalness to 0.90 and sharpens specular glint |
| `tBorderMask` | TEX-03 | `VYSHUUU-TEX-03-border-mask.png` | Linear | Border ribbon spatial isolation and edge sheen enhancement |
| `tPalluMask` | TEX-04 | `VYSHUUU-TEX-04-pallu-mask.png` | Linear | Pallu field presence; triggers raking luminescence during Phase 5 |
| `tRedAccent` | TEX-05 | `VYSHUUU-TEX-05-red-accent.png` | Linear | Auspicious madder red accent stripe coloration and dyed silk sheen |
| `tWeaveDirection` | TEX-06 | `VYSHUUU-TEX-06-weave-direction.png` | Linear | 2-channel tangent flow ($R=$ weft, $G=$ warp) driving anisotropic Ward specular highlights |
| `tRoughness` | TEX-07 | `VYSHUUU-TEX-07-roughness.png` | Linear | Art-directed microfacet roughness ($72$ zari to $162$ silk body) |
| `tMicroNormal` | TEX-08 | `VYSHUUU-TEX-08-micro-normal.png` | Linear | Tangent-space normal perturbation; threads catch grazing light |
| `tEdgeFringe` | TEX-09 | `VYSHUUU-TEX-09-edge-fringe.png` | Linear | Tassel knot displacement and selvedge edge alpha taper |

### 3.3 Shader Implementation
- **Vertex Shader** ([`src/experience/shaders/unfurling/unfurlingVertex.ts`](file:///d:/saree/src/experience/shaders/unfurling/unfurlingVertex.ts)):
  - Evaluates continuous cloth positions via analytical catenary and traveling pleat formulations.
  - Derives geometric tangents, bitangents, and normals on the deformed manifold via central finite differences.
  - Smoothly incorporates velocity-induced fold amplitude and pointer disturbance.
- **Fragment Shader** ([`src/experience/shaders/unfurling/unfurlingFragment.ts`](file:///d:/saree/src/experience/shaders/unfurling/unfurlingFragment.ts)):
  - Synthesizes PBR diffuse wrap, Blinn-Phong specular, and Ward-style anisotropic highlights oriented by `tWeaveDirection`.
  - Recreates true handloom chiaroscuro under broad lateral grazing illumination ($[-3.5, 4.5, 3.8]$).
  - Tapers edge fringe alphas and applies subtle selvedge vignettes.

---

## 4. Scroll & Interaction Architecture

### 4.1 Scroll Bridge & Velocity Coupling
- Centralized in [`src/lib/scrollBridge.ts`](file:///d:/saree/src/lib/scrollBridge.ts):
  - Decouples React state from the 60 FPS Three.js render loop.
  - Receives normalized progress $p \in [0, 1]$ and instantaneous scroll velocity $\frac{dp}{dt}$ from Lenis / GSAP `ScrollTrigger`.
  - Three.js polls `scrollBridge.unfurlingProgress` inside `useFrame` with viscous exponential smoothing (`lerp(..., delta * 3.2)`), imparting physical inertia.

### 4.2 Interactive Raking Light
- Cursor/touch coordinates are tracked and damped in normalized viewport space ($[-1, 1]$).
- Moves the lateral grazing key light smoothly across the textile plane.
- Allows the user to inspect gold zari motifs, thread crowns, and pleat ridges as an interactive digital loupe.

### 4.3 Settling Dynamics & Reversibility
- When scrolling stops, fold kinetic energy decays exponentially into a gentle microscopic breathing cycle ($0.75\text{ Hz}$, $< 0.005$ displacement).
- Fully reversible: scrolling upward smoothly rolls back the pleats, withdraws the pallu, and returns to the single golden filament at the threshold.

---

## 5. Mobile & Accessibility Fallback Strategy

- **Mobile WebGL Performance**:
  - Automatically reduces geometry grid to $100 \times 50$ (Tier MED) or $64 \times 32$ (Tier LOW).
  - Touch input coordinates smoothly steer the raking light without interfering with native touch scrolling.
- **Reduced Motion (`isReducedMotion: true`)**:
  - Eliminates dynamic velocity ripple, pleat oscillation, and camera tilts.
  - Presents a serene, statically draped 6-yard saree with smooth opacity transitions.
- **Semantic DOM Preservation**:
  - All essential editorial copy, chapter headings, and brand manifestos exist in clean semantic HTML with accessible ARIA labeling.

---

## 6. Verification Suite Status

```bash
> pnpm validate:textures
Summary: 9 PRESENT, 0 MISSING, 0 INVALID
Contract Status: ALL 9 PRODUCTION MAPS RIGOROUSLY VALIDATED

> pnpm typecheck
$ tsc --noEmit (Exit Code: 0, 0 errors)

> pnpm lint
$ eslint (Exit Code: 0, 0 warnings/errors)

> pnpm build
✓ Compiled successfully in Turbopack (Exit Code: 0)
```
