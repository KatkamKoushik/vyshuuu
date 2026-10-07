# SHOT 12.9B — CANONICAL TEXTILE PROMOTION + DESIGN-MAP SPECIFICATION
**VYSHUUU — The Unstitched Continuum**  
*Document Version: 1.0.0 — Specification for Target Production Maps*  
*Milestone: SHOT 12.9B | Gate Status: SHOT 13 Gated (Not Authorized)*

---

## 1. Executive Summary & Promotion Audit

Following the source vault audit in SHOT 12.9A, the approved canonical visual references have been promoted into the authoritative canonical vault directory without modifying or displacing any original files:

- **Canonical Promotion Directory:** `VYSHUUU-SOURCE-VAULT/00_CANONICAL/`
  - `textile/` (8 canonical references: `VYSHUUU-CANONICAL-01` through `08`)
  - `filament/` (2 canonical references: `VYSHUUU-CANONICAL-09` and `10`)
- **Original Vault Directories Preserved Untouched:**
  - `VYSHUUU-SOURCE-VAULT/01_FLOW_ORIGINALS/batch-01/` (16 source images intact)
  - `VYSHUUU-SOURCE-VAULT/02_CHATGPT_GENERATIONS/textile-v1/` (9 source images intact)
- **Production Asset Directory (`public/assets/`):** **0 runtime assets placed.** (All assets remain in the source vault; production assets will only be placed once derived, optimized, and explicitly authorized).

> [!IMPORTANT]
> **Art-Direction Disclaimer:**  
> The canonical references promoted here are **art-direction references for a fictional haute couture digital textile**. They are **NOT** physical textile measurements, laboratory scans, or verified textile science. No physical claims regarding fiber denier, thread counts (EPI/PPI), authentic zari purity, artisan identity, handloom cluster, or historical provenance are made.

---

## 2. Canonical Promotion Roster

| Normalized Canonical Filename | Source Original File | Dimensions | Aspect | Role Category |
| :--- | :--- | :---: | :---: | :--- |
| `00_CANONICAL/textile/VYSHUUU-CANONICAL-01-full-length.jpg` | `Saree_unfurling_in_dark_space_20261007174526.jpg` | 1376×768 | 1.79:1 | Full-length continuum ribbon |
| `00_CANONICAL/textile/VYSHUUU-CANONICAL-02-flat-reference.jpg` | `Saree_flat_lay_technical_photograph_20261007174425.jpg` | 1376×768 | 1.79:1 | Flat planar design & UV layout |
| `00_CANONICAL/textile/VYSHUUU-CANONICAL-03-fold.jpg` | `Suspended_black_silk_saree_fold_20261007174506.jpg` | 1376×768 | 1.79:1 | Suspended S-curve fold memory |
| `00_CANONICAL/textile/VYSHUUU-CANONICAL-04-pleat.jpg` | `Studying_pleats_on_black_saree_20261007174438.jpg` | 1376×768 | 1.79:1 | Knife-pleat compression & stacking |
| `00_CANONICAL/textile/VYSHUUU-CANONICAL-05-border.jpg` | `Close-up_of_saree_gold_border_20261007174539.jpg` | 1376×768 | 1.79:1 | Selvedge chevron zari border |
| `00_CANONICAL/textile/VYSHUUU-CANONICAL-06-macro.jpg` | `Black_silk_surface_material_study_20261007174536.jpg` | 1376×768 | 1.79:1 | Plain-weave silk surface structure |
| `00_CANONICAL/textile/VYSHUUU-CANONICAL-07-edge.jpg` | `Textile_edge_close-up_study_20261007174547.jpg` | 1376×768 | 1.79:1 | Tassel fringe & selvedge hem finish |
| `00_CANONICAL/textile/VYSHUUU-CANONICAL-08-pallu.jpg` | `Museum_textile_archive_documenta…_20261007174432.jpg` | 1376×768 | 1.79:1 | Diamond-lattice pallu brocade |
| `00_CANONICAL/filament/VYSHUUU-CANONICAL-09-gold-thread-macro.jpg` | `Macro_photography_of_zari_threads_20261007174542.jpg` | 1203×768 | 1.57:1 | Wound metallic zari filament macro |
| `00_CANONICAL/filament/VYSHUUU-CANONICAL-10-golden-filament.png` | `Golden S-Curve Metallic Thread.png` | 1672×941 | 1.78:1 | Spline continuum trajectory & glow |

---

## 3. Coordinate Language & UV Architecture

To ensure strict engineering precision without asserting unverified physical dimensions, all future 2D texture maps, mesh UV layouts, and procedural shaders must adhere to the following coordinate language:

```
                      ←── U: TEXTILE WIDTH (WEFT DIRECTION) ──→
                   U = 0.0                                    U = 1.0
             ┌────────────────────────────────────────────────────────┐ ▲
             │   UPPER SELVEDGE BORDER (Zari + Madder Accent)         │ │
             ├────────────────────────────────────────────────────────┤ │
             │                                                        │ │
             │                                                        │ │
             │                   BODY FIELD                           │ │
             │        (Charcoal Silk + Micro Zari Pinstripe)          │ │
             │                                                        │ │ V: TEXTILE LENGTH
             │                                                        │ │    (WARP DIRECTION)
             ├────────────────────────────────────────────────────────┤ │
             │   LOWER SELVEDGE BORDER (Heavy Chevron Zari Brocade)   │ │
             ├────────────────────────────────────────────────────────┤ │
             │   PALLU / ANCHAL (Dense Diamond Brocade)               │ │
             ├────────────────────────────────────────────────────────┤ │
             │   FRINGE / TASSEL TERMINATION                          │ │
             └────────────────────────────────────────────────────────┘ ▼
             V = 0.0 (Starting Hem / Pleats)            V = 1.0 (Pallu Terminal)
```

### Coordinate Axes
- **`U` (Normalized 0.0 → 1.0):** **Textile Width Direction** (transverse / weft alignment across the saree breadth).
- **`V` (Normalized 0.0 → 1.0):** **Textile Length Direction** (longitudinal / warp alignment from starting inner pleat wrap to terminal pallu fringe).

### Provisional Production Dimensions
> [!CAUTION]
> **Do NOT state an absolute physical length or width as verified fact.**  
> For 3D mesh generation, UV unwrapping, and simulation setup, all physical dimensions are strictly:
> **`PROVISIONAL PRODUCTION DIMENSIONS`** (subject to calibration).
>
> - **Provisional Aspect Ratio:** **1.0 : 4.8 to 1.0 : 5.5** (Standard visual proportion for a 6-yard saree continuum).
> - **Provisional Width ($W_{prov}$):** `1.15m` (Parametric normalization unit = 1.0).
> - **Provisional Length ($L_{prov}$):** `5.50m` (Parametric normalization unit = 4.78).
> - **Provisional Pallu Extent ($V_{pallu}$):** $V \in [0.82, 0.98]$ (~16% of total longitudinal length).
> - **Provisional Lower Border Extent ($U_{border\_lower}$):** $U \in [0.00, 0.12]$ (~12% of textile width).
> - **Provisional Upper Border Extent ($U_{border\_upper}$):** $U \in [0.94, 1.00]$ (~6% of textile width).

---

## 4. Target Production Maps Specification

The promoted canonical photographs do not directly yield physically measured PBR channels. Instead, they serve as the **authoritative aesthetic source** from which **9 Target Production Maps** will be authored.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ TARGET PRODUCTION MAPS HIERARCHY                                                        │
├────┬─────────────────────────────┬───────────┬───────────────┬──────────────────────────┤
│ #  │ Target Production Map       │ Bit-Depth │ Color Space   │ Canonical Source Input   │
├────┼─────────────────────────────┼───────────┼───────────────┼──────────────────────────┤
│ 1  │ BASE COLOR / DESIGN MAP     │ 8-bit RGB │ sRGB          │ CANONICAL-02, 05, 08     │
│ 2  │ ZARI / GOLD MASK            │ 8-bit R   │ Linear (Gray) │ CANONICAL-05, 08, 09     │
│ 3  │ BORDER MASK                 │ 8-bit R   │ Linear (Gray) │ CANONICAL-02, 05         │
│ 4  │ PALLU MASK                  │ 8-bit R   │ Linear (Gray) │ CANONICAL-02, 08         │
│ 5  │ RED-ACCENT MASK             │ 8-bit R   │ Linear (Gray) │ CANONICAL-05, 07         │
│ 6  │ WEAVE-DIRECTION MAP         │ 8-bit RG  │ Linear (Norm) │ CANONICAL-06             │
│ 7  │ ROUGHNESS VARIATION MAP     │ 8-bit R   │ Linear (Gray) │ CANONICAL-03, 05, 06     │
│ 8  │ MICRO-NORMAL REFERENCE      │ 8-bit RGB │ Linear (Norm) │ CANONICAL-06             │
│ 9  │ EDGE / FRINGE MASK          │ 8-bit R   │ Linear (Gray) │ CANONICAL-07             │
└────┴─────────────────────────────┴───────────┴───────────────┴──────────────────────────┘
```

---

## 5. Map Authoring Rules & Acceptance Criteria

### 1. Base Color / Design Map (`vyshuuu_textile_basecolor`)
- **Intent:** Author the global albedo pattern across the entire continuum.
- **Palette Targets:**
  - **Body Ground:** Charcoal Silk (`#161412` to `#1A1816`) with fine pinstripe grid (`#221F1C`).
  - **Woven Zari Regions:** Antique Gold (`#C9A96E` to `#D4AF37`) under neutral diffuse lighting.
  - **Accent Selvedge:** Restrained Red-Brown / Madder (`#541818` to `#4A1A1A`) along borders and pallu transition stripes.
- **Authoring Rule:** Clean diffuse color only. **No baked lighting, no ambient occlusion, and no directional shadows.** All lighting must remain runtime-dynamic.

### 2. Zari / Gold Mask (`vyshuuu_textile_zari_mask`)
- **Intent:** Author the metallic specular response channel to drive anisotropic gold lobe calculation in the shader.
- **Values:**
  - **`White (1.0)`:** Visually intended solid metallic zari regions (chevron borders, pallu brocade diamonds).
  - **`Black (0.0)`:** Pure non-metallic silk textile body.
  - **`Gray (0.15 → 0.70)`:** Transition zones, pinstripe half-tones, and weft crossings where metallic filament interlaces with black silk warp.
- **Authoring Rule:** Must align 1:1 pixel-for-pixel with the Base Color design geometry.

### 3. Border Mask (`vyshuuu_textile_border_mask`)
- **Intent:** Spatial segmentation map identifying continuous border regions along the longitudinal edges ($U$).
- **Values:**
  - **`White (1.0)`:** Active border envelope (lower main border and upper accent border).
  - **`Black (0.0)`:** Central body field and open spaces.
- **Authoring Rule:** Provides procedural shaders the ability to modulate cloth stiffness, selvedge thickness, and rim light responsiveness specifically on edge ribbons.

### 4. Pallu Mask (`vyshuuu_textile_pallu_mask`)
- **Intent:** Spatial segmentation identifying the visually distinct, high-density terminal pallu region along length ($V$).
- **Values:**
  - **`White (1.0)`:** Terminal pallu brocade field ($V \in [0.82, 0.98]$).
  - **`Black (0.0)`:** Body field.
  - **`Gradient (0.0 → 1.0)`:** Longitudinal transition stripe where body pinstripes terminate and dense zari begins.
- **Authoring Rule:** Used by simulation and vertex shaders to represent increased cloth mass and structural rigidity of the metallic end-piece.

### 5. Red-Accent Mask (`vyshuuu_textile_red_accent_mask`)
- **Intent:** Isolate the subtle, restrained red-brown edge accent (madder / kumkum selvedge line) visible in `CANONICAL-05` and `CANONICAL-07`.
- **Values:**
  - **`White (1.0)`:** Ultra-fine 2mm–4mm selvedge pinstripe and decorative pallu dividing lines.
  - **`Black (0.0)`:** Everywhere else.
- **Authoring Rule:** Must prevent color bleeding into the antique gold or charcoal body.

### 6. Weave-Direction Map (`vyshuuu_textile_weave_dir`)
- **Intent:** Encode visual warp and weft orientation to drive anisotropic specular tangent vectors.
- **Values:**
  - **`Red Channel:`** Tangent vector component along $U$ (weft).
  - **`Green Channel:`** Tangent vector component along $V$ (warp).
- **Authoring Rule:** **Visual orientation only.** Do not infer actual microscopic yarn counts. Plain weave alternates orthogonal vectors at tile boundary.

### 7. Roughness Variation Map (`vyshuuu_textile_roughness`)
- **Intent:** Visual authoring map dictating specular blur and microsurface sheen variation.
- **Values:**
  - **Silk Body:** Roughness $\approx 0.55 - 0.70$ (soft diffuse anisotropic scattering).
  - **Zari Brocade:** Roughness $\approx 0.25 - 0.38$ (burnished metallic highlight, sharp sheen).
  - **Transition Creases:** Roughness micro-boost to prevent unrealistically glassy edges.
- **Authoring Rule:** Author as a perceptual rendering guide, **not a scientifically measured textile roughness value**.

### 8. Micro-Normal Reference (`vyshuuu_textile_micro_normal`)
- **Intent:** Tileable tangent-space normal map representing subtle yarn crowns and slub irregularities derived from `CANONICAL-06`.
- **Values:** Standard tangent space normal ($[128, 128, 255]$ neutral).
- **Authoring Rule:** **Subtle surface structure only.** Must fade cleanly under mipmapping at medium-to-far camera distances to eliminate moiré and buzzing raster artifacts.

### 9. Edge / Fringe Mask (`vyshuuu_textile_edge_fringe_mask`)
- **Intent:** Drive alpha cutout and displacement for hand-knotted pallu tassels and raw selvedge hem.
- **Values:**
  - **`White (1.0)`:** Solid cloth hem.
  - **`Black (0.0)`:** Transparent voids between knotted tassels.
  - **`Gray (0.2 → 0.8)`:** Semi-transparent thread fraying and filament wisps.
- **Authoring Rule:** Derived directly from `CANONICAL-07` macro edge study.

---

## 6. Desktop vs. Mobile Rendering Strategy

| Parameter | Desktop Strategy | Mobile Strategy |
| :--- | :--- | :--- |
| **Max Texture Resolution** | 4096×1024 (Planar continuum) / 1024×1024 (Tileable) | 2048×512 (Compressed) / 512×512 (Tileable) |
| **Format & Compression** | KTX2 / Basis Universal / WebP (Fallbacks) | KTX2 / Basis Universal (ASTC/ETC2 compressed) |
| **Normal Map Sampling** | Full tangent-space micro-normal perturbation | Mip-clamped or procedural derivate normal |
| **Filament Path Asset** | Landscape `CANONICAL-10` spline curve trajectory | Portrait mobile spline variant |
| **Memory Budget** | < 28 MB VRAM for textile textures | < 10 MB VRAM for textile textures |

---

## 7. SHOT 13 Gate Checklist

> [!WARNING]
> **SHOT 13 (The Six-Yard Unfurling) IS NOT YET AUTHORIZED.**  
> Neither 3D cloth simulation, Blender/Houdini meshes, Vertex Animation Textures (VAT), nor runtime shader integration may begin until all gating criteria below are satisfied.

```
┌────────────────────────────────────────────────────────────────────────┐
│ SHOT 13 PRE-REQUISITE GATE CHECKLIST                                   │
├──────────────────────────────────────────────────────────────┬─────────┤
│ Requirement                                                  │ Status  │
├──────────────────────────────────────────────────────────────┼─────────┤
│ 1. Canonical references promoted to 00_CANONICAL/            │ DONE    │
│ 2. Design-map specification authored & approved              │ DONE    │
│ 3. Target production maps authored and placed in 04_TEXTURES │ PENDING │
│ 4. 3D cloth topology & quad-mesh plan defined                │ PENDING │
│ 5. Physical dimensions explicitly marked provisional         │ DONE    │
│ 6. Desktop / mobile VRAM & texture strategy approved         │ DONE    │
│ 7. No unauthorized assets placed in public/assets            │ PASS    │
└──────────────────────────────────────────────────────────────┴─────────┘
```

**Next Authorized Phase:** Authoring the target production texture maps into `VYSHUUU-SOURCE-VAULT/04_TEXTURES/` according to this specification. Houdini / VAT cloth simulation remains gated until map authoring and mesh topology specifications are locked.
