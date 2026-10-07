# SHOT 13A — 6-Yard Unfurling Visual Refinement

> **Document Status**: Complete & Verified  
> **Milestone**: SHOT 13A — Presentation & Visual Refinement  
> **Date**: October 7, 2026  
> **Target Scope**: Shader Tuning, Physical Unfurling Manifold, Spatial Lighting, Camera Staging  
> **Locked Assets**: Maps 01–09 remain 100% UNTOUCHED and LOCKED  

---

## 1. Executive Summary

SHOT 13A refines the presentation and visual perception of **THE 6-YARD UNFURLING** hero experience based on visual audit feedback.

The objective was to eliminate any procedural/grid appearance, dial back excessive gold luminance, provide visceral 3D fabric depth with non-uniform pleat compression, and ensure the experience feels like an authentic six-yard handloom silk saree unrolling and settling with physical mass and inertia.

All nine production texture maps (`01_BASE_COLOR` through `09_EDGE_FRINGE_MASK`) were **strictly preserved without modification or regeneration**. All refinements were achieved purely through shader material response, non-linear geometric deformation, directional chiaroscuro lighting, and camera observation staging.

---

## 2. Refinements Implemented

### 2.1 Material & Gold / Zari Response ([`unfurlingFragment.ts`](file:///d:/saree/src/experience/shaders/unfurling/unfurlingFragment.ts))
- **Dark at Rest**: In metallic brocade regions ($M_{\text{zari}} > 0$), diffuse albedo is modulated so that zari absorbs non-specular light, appearing as deep antique bronze and warm charcoal (`#2a241c` to `#54462e`) embedded in the dark silk.
- **Selective Raking Ignition**: Zari now ignites **only** when grazed by lateral light at acute incident angles ($\text{gate} = (\mathbf{N} \cdot \mathbf{L})^{2.4}$). Away from the grazing beam, gold motifs remain quiet and mysterious.
- **Narrow, Elegant Highlights**: Anisotropic exponent was raised ($32.0 \to 128.0$), tightening the specular highlight into razor-sharp flashes along individual thread crowns rather than broad glowing yellow bands.
- **Restrained Texture Scale**: The micro-normal contribution at direct facing angles was reduced from $0.40$ down to $0.06$, scaling up to $0.28$ only at grazing view angles. The silk body now reads primarily as liquid-smooth, deep charcoal luxury fabric, with micro-weave texture becoming visible only secondarily under raking inspection.

### 2.2 Fabric Form & 3D Depth ([`unfurlingVertex.ts`](file:///d:/saree/src/experience/shaders/unfurling/unfurlingVertex.ts))
- **Physical Unrolling Trailing Roll**: Implemented a physical unrolling front ($\text{unfurlFront} = \text{smoothstep}(0.06, 0.96, p \times 1.08)$). Unrevealed fabric beyond the leading edge is tightly gathered and curved in deep negative $Z$ space in shadow ($Z < -0.9\text{m}$), unrolling progressively forward as the user scrolls.
- **Substantial 3D Curvature**: Increased the $Z$-depth of the cloth manifold from a shallow $\pm 0.4\text{m}$ to a sculptural range spanning $Z \in [-1.1\text{m}, +0.65\text{m}]$, establishing physical mass and heavy catenary sag.
- **Irregular Pleats with Compression & Mass**:
  - Replaced uniform periodic sine waves with asymmetrical, non-uniform accordion folds concentrated in the central pleat zone ($U \in [0.24, 0.65]$).
  - Pleat formulation combines multiple incommensurate harmonics ($\lambda_1 = 16.5, \lambda_2 = 8.25, \lambda_3 = 3.14$) with gravitational compression toward the lower hem ($V = 0$).
  - Scroll velocity dynamically boosts fold amplitude by up to $+40\%$ during active scrubbing, settling into viscous memory when paused.
- **The Pallu Reveal ($U \in [0.66, 0.98]$)**:
  - The pallu is held back in shadow until $p \ge 0.62$.
  - Between $62\%$ and $88\%$, the pallu executes a dramatic diagonal sweep forward from $-0.85\text{m}$ to $+0.45\text{m}$, draping over the shoulder crest into the lateral raking beam.

### 2.3 Lighting Calibration ([`ExperienceRoot.tsx`](file:///d:/saree/src/experience/ExperienceRoot.tsx) & [`UnfurlingScene.tsx`](file:///d:/saree/src/experience/scenes/UnfurlingScene.tsx))
- **Eliminated Flood Illumination**:
  - Key light intensity reduced from $3.2$ to $1.7$ at an acute grazing angle ($[-4.2, 2.5, 2.2]$).
  - Ambient shadow floor lowered from $0.45$ to $0.18$ (`#0F0E10`), restoring high-contrast chiaroscuro.
  - Rim graze tuned to restrained antique bronze (`#8B7443`, intensity $0.65$).
- **Lateral Raking Sweep**:
  - Key light position moves dynamically from left to right as $p$ advances ($-3.8 \to -1.4$), sweeping illumination across newly unfurled cloth sections, igniting pleat crests and culminating on the pallu.

### 2.4 Camera Staging ([`GlobalCanvas.tsx`](file:///d:/saree/src/experience/GlobalCanvas.tsx) & [`UnfurlingScene.tsx`](file:///d:/saree/src/experience/scenes/UnfurlingScene.tsx))
- **Spatial Pullback**:
  - Camera position moved back from $[0, 0, 5]$ to $[0, 0, 5.8]$ with refined photographic field of view ($38^\circ$ vs $42^\circ$).
  - Cloth mesh anchored slightly back ($Z = -0.32\text{m}$), providing generous architectural margins so the audience perceives the immense scale of the six yards.
- **Observant Camera**:
  - Camera remains steady and observing; motion is driven by the physical unfolding and drape of the textile.

### 2.5 Narrative Timing & End State ([`page.tsx`](file:///d:/saree/src/app/page.tsx))
- Narrative percentages strictly maintained:
  - `0% – 15%`: Filament resolving into digital loom warp.
  - `15% – 30%`: Obsidian textile surface emergence.
  - `30% – 45%`: Continuous S-curve unfurling with catenary sag.
  - `45% – 60%`: Traveling irregular pleats with velocity ripple.
  - `60% – 75%`: Pallu forward sweep and raking zari glint.
  - `75% – 90%`: Full 6-yard architectural continuum.
  - `90% – 100%`: Settled breathing equilibrium ($0.75\text{ Hz}$, $< 0.003\text{m}$) and quiet, expensive VYSHUUU identity reveal.

---

## 3. Verification Suite Results

```bash
> pnpm validate:textures
Summary: 9 PRESENT, 0 MISSING, 0 INVALID
Contract Status: ALL 9 PRODUCTION MAPS RIGOROUSLY VALIDATED

> pnpm typecheck
$ tsc --noEmit (Exit Code: 0, 0 errors)

> pnpm lint
$ eslint (Exit Code: 0, 0 warnings/errors)

> pnpm build
✓ Compiled successfully in Turbopack
Route (app)                         Size  First Load JS
┌ ○ /                            3.55 kB         422 kB
├ ○ /_not-found                      0 B         418 kB
└ ƒ /api/textures/[...path]          0 B            0 B
+ First Load JS shared by all     425 kB
○ (Static) prerendered as static content
ƒ (Dynamic) server-rendered on demand (Exit Code: 0)
```

---

## 4. Conclusion

The refined 6-Yard Unfurling hero experience delivers:
- Deep, physical handloom silk weight with authentic catenary drape and irregular pleats.
- Restrained antique zari that rests dark and ignites selectively under lateral raking grazing light.
- A steady, observant photographic perspective highlighting the monumental scale of the continuous garment.
- Zero procedural grid artifacts or artificial glowing bands.
