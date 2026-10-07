# SHOT 12.9C — PRODUCTION MAP CONTRACT & SPECIFICATION
**VYSHUUU — The Unstitched Continuum**  
*Document Version: 1.0.0 — Production Texture Authoring Contract*  
*Milestone: SHOT 12.9C | Status: Contract Locked (Workspace Initialized)*

---

## 1. Core Principle & Architectural Guardrails

> [!IMPORTANT]
> **ALL MATERIAL VALUES ARE VISUAL AUTHORING TARGETS.**  
> They are **NOT** laboratory measurements, spectrometer readings, profilometer scans, or physical assays of a physical textile.
>
> All texture channels, masks, roughness values, and normal vectors defined in this contract represent **authoring guidance for digital haute couture**. No physical assertions are made regarding fiber denier, thread counts (EPI/PPI), authentic zari purity, artisan identity, handloom cluster, or historical origin.

---

## 2. Master Map Contract Roster

The nine target textile maps are assigned clean, canonical identifiers within their designated subdirectories inside `VYSHUUU-SOURCE-VAULT/04_TEXTURES/`.

```
VYSHUUU-SOURCE-VAULT/04_TEXTURES/
├── 01_BASE_COLOR/       → VYSHUUU-TEX-01-base-color.*
├── 02_ZARI_MASK/        → VYSHUUU-TEX-02-zari-mask.*
├── 03_BORDER_MASK/      → VYSHUUU-TEX-03-border-mask.*
├── 04_PALLU_MASK/       → VYSHUUU-TEX-04-pallu-mask.*
├── 05_RED_ACCENT/       → VYSHUUU-TEX-05-red-accent.*
├── 06_WEAVE_DIRECTION/  → VYSHUUU-TEX-06-weave-direction.*
├── 07_ROUGHNESS/        → VYSHUUU-TEX-07-roughness.*
├── 08_MICRO_NORMAL/     → VYSHUUU-TEX-08-micro-normal.*
└── 09_EDGE_FRINGE/      → VYSHUUU-TEX-09-edge-fringe.*
```

> [!NOTE]
> In accordance with the non-fabrication rule, **zero synthetic or mock image files have been placed in these folders**. Each directory contains only a `.gitkeep` file pending actual master map authoring.

---

## 3. Individual Map Technical Contracts

### 01. `VYSHUUU-TEX-01-base-color`
- **Map Category:** Color Map (Diffuse / Albedo)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/01_BASE_COLOR/`
- **Primary Source References:** 
  - `VYSHUUU-CANONICAL-02-flat-reference.jpg` (Planar design & layout)
  - `VYSHUUU-CANONICAL-01-full-length.jpg` (Continuum flow & chiaroscuro balance)
- **Target Channels:** RGB (3 channels)
- **Target Bit Depth:** 8-bit (Production) / 16-bit (Master source)
- **Target Color Space:** `sRGB`
- **Expected Delivery Format:** Lossless PNG (Master authoring) / KTX2 Basis Universal (Web delivery)
- **Intended Channel Meaning:**
  - **R, G, B:** Diffuse reflectance color under completely flat, shadow-free illumination.
  - **Body Ground:** Charcoal Silk (`#161412` to `#1A1816`) with subtle pinstripe check (`#221F1C`).
  - **Zari Brocade:** Antique Gold albedo (`#C9A96E` to `#D4AF37`).
  - **Selvedge Accent:** Restrained Madder Red-Brown (`#541818` to `#4A1A1A`).
- **Nature of Data:** Visual authoring guidance. **Strictly pure albedo.** Must contain zero baked lighting, zero ambient occlusion, and zero cast directional shadows.

---

### 02. `VYSHUUU-TEX-02-zari-mask`
- **Map Category:** Grayscale Mask (Metallic Specular Modulator)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/02_ZARI_MASK/`
- **Primary Source References:**
  - `VYSHUUU-CANONICAL-05-border.jpg` (Selvedge chevron brocade)
  - `VYSHUUU-CANONICAL-08-pallu.jpg` (Pallu diamond lattice)
  - `VYSHUUU-CANONICAL-09-gold-thread-macro.jpg` (Filament reflectance)
- **Target Channels:** Single Channel (Grayscale / R)
- **Target Bit Depth:** 8-bit
- **Target Color Space:** `Linear / Non-Color`
- **Expected Delivery Format:** Lossless PNG
- **Intended Channel Meaning:**
  - **Value 1.0 (White, 255):** Solid metallic zari regions (dense chevron bands, pallu brocade diamonds).
  - **Value 0.0 (Black, 0):** Pure non-metallic silk textile body.
  - **Values 0.15 → 0.70 (Grayscale):** Transition interlacing, pinstripe half-tones, and weft crossings where metallic thread crosses dark warp.
- **Nature of Data:** Visual authoring guidance. Drives the anisotropic gold specular lobe and metallicity switch in the WebGL shader.

---

### 03. `VYSHUUU-TEX-03-border-mask`
- **Map Category:** Grayscale Mask (Spatial Segmentation)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/03_BORDER_MASK/`
- **Primary Source References:**
  - `VYSHUUU-CANONICAL-05-border.jpg` (Chevron border macro)
  - `VYSHUUU-CANONICAL-02-flat-reference.jpg` (Full planar layout)
- **Target Channels:** Single Channel (Grayscale / R)
- **Target Bit Depth:** 8-bit
- **Target Color Space:** `Linear / Non-Color`
- **Expected Delivery Format:** Lossless PNG
- **Intended Channel Meaning:**
  - **Value 1.0 (White, 255):** Longitudinal border ribbon along upper ($U \in [0.94, 1.00]$) and lower ($U \in [0.00, 0.12]$) selvedges.
  - **Value 0.0 (Black, 0):** Central body field.
- **Nature of Data:** Visual authoring guidance. Enables independent shader control over border stiffness, rim Fresnel enhancement, and selvedge cord micro-displacement.

---

### 04. `VYSHUUU-TEX-04-pallu-mask`
- **Map Category:** Grayscale Mask (Spatial Segmentation)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/04_PALLU_MASK/`
- **Primary Source References:**
  - `VYSHUUU-CANONICAL-08-pallu.jpg` (Dense brocade end-piece)
  - `VYSHUUU-CANONICAL-02-flat-reference.jpg` (Planar continuum position)
- **Target Channels:** Single Channel (Grayscale / R)
- **Target Bit Depth:** 8-bit
- **Target Color Space:** `Linear / Non-Color`
- **Expected Delivery Format:** Lossless PNG
- **Intended Channel Meaning:**
  - **Value 1.0 (White, 255):** High-density ornamental terminal pallu field ($V \in [0.82, 0.98]$).
  - **Value 0.0 (Black, 0):** Central and pleated saree body.
  - **Smooth Ramp (0.0 → 1.0):** Longitudinal transition band where body field meets the anchor brocade.
- **Nature of Data:** Visual authoring guidance. Informs vertex shader gravity weighting (heavier drape behavior) and micro-specular density.

---

### 05. `VYSHUUU-TEX-05-red-accent`
- **Map Category:** Grayscale Mask (Chromatic Isolation)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/05_RED_ACCENT/`
- **Primary Source References:**
  - `VYSHUUU-CANONICAL-07-edge.jpg` (Selvedge hem binding)
  - `VYSHUUU-CANONICAL-05-border.jpg` (Selvedge madder stripe)
- **Target Channels:** Single Channel (Grayscale / R)
- **Target Bit Depth:** 8-bit
- **Target Color Space:** `Linear / Non-Color`
- **Expected Delivery Format:** Lossless PNG
- **Intended Channel Meaning:**
  - **Value 1.0 (White, 255):** Restrained 2mm–4mm madder/kumkum selvedge boundary line and decorative pallu divider threads.
  - **Value 0.0 (Black, 0):** Non-red textile surfaces.
- **Nature of Data:** Visual authoring guidance. Isolates the red-brown accent to guarantee zero chromatic fringing or accidental bleeding into charcoal silk.

---

### 06. `VYSHUUU-TEX-06-weave-direction`
- **Map Category:** Vector / Flow Map (Anisotropic Orientation)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/06_WEAVE_DIRECTION/`
- **Primary Source References:**
  - `VYSHUUU-CANONICAL-06-macro.jpg` (Plain-weave warp/weft cross-grain)
- **Target Channels:** 2 Channels (RG) or 3 Channels (RGB with Blue = 0)
- **Target Bit Depth:** 8-bit (Normalized vector) / 16-bit
- **Target Color Space:** `Linear / Non-Color`
- **Expected Delivery Format:** Lossless PNG
- **Intended Channel Meaning:**
  - **Red Channel:** Tangent direction vector component along $U$ (weft alignment).
  - **Green Channel:** Tangent direction vector component along $V$ (warp alignment).
  - **Blue Channel:** Neutral / Unused ($0.0$ or $1.0$).
- **Nature of Data:** Visual authoring guidance. Dictates the primary anisotropic highlight orientation for directional silk sheen. **Does not represent real yarn denier or physical thread counts.**

---

### 07. `VYSHUUU-TEX-07-roughness`
- **Map Category:** Grayscale Variation Map (Specular Roughness)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/07_ROUGHNESS/`
- **Primary Source References:**
  - `VYSHUUU-CANONICAL-06-macro.jpg` (Silk surface microscopic tooth)
  - `VYSHUUU-CANONICAL-03-fold.jpg` (Sheen roll-off on curved folds)
- **Target Channels:** Single Channel (Grayscale / R)
- **Target Bit Depth:** 8-bit
- **Target Color Space:** `Linear / Non-Color`
- **Expected Delivery Format:** Lossless PNG
- **Intended Channel Meaning:**
  - **Values 0.22 → 0.35 (Dark Gray):** Smooth metallic zari brocade (sharp specular reflection).
  - **Values 0.55 → 0.70 (Mid-Light Gray):** Matte woven silk ground (broad diffuse scattering).
  - **Values 0.75 → 0.90 (Light Gray):** Fold ridges and micro-creases (elevated scattering).
- **Nature of Data:** Visual authoring guidance. Art-directed perceptual roughness values; **not a profilometer-measured physical roughness parameter**.

---

### 08. `VYSHUUU-TEX-08-micro-normal`
- **Map Category:** Normal Map (Tangent Space Surface Perturbation)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/08_MICRO_NORMAL/`
- **Primary Source References:**
  - `VYSHUUU-CANONICAL-06-macro.jpg` (Micro-slub yarn crowns)
- **Target Channels:** RGB (3 channels, Tangent Space Normal)
- **Target Bit Depth:** 8-bit / 16-bit
- **Target Color Space:** `Linear / Non-Color`
- **Expected Delivery Format:** Lossless PNG (OpenGL normal convention: $+Y$ Up)
- **Intended Channel Meaning:**
  - **R Channel ($X$):** Surface tilt across transverse weft.
  - **G Channel ($Y$):** Surface tilt along longitudinal warp ($+Y$ orientation).
  - **B Channel ($Z$):** Surface normal protrusion ($Z \approx 1.0$ pointing outward).
- **Nature of Data:** Visual authoring guidance. Subtle surface structure only. Must include smooth mipmap attenuation to prevent shimmering moiré at medium-to-far viewing distances.

---

### 09. `VYSHUUU-TEX-09-edge-fringe`
- **Map Category:** Grayscale Alpha Mask & Cutout (Hem Termination)
- **Designated Directory:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/09_EDGE_FRINGE/`
- **Primary Source References:**
  - `VYSHUUU-CANONICAL-07-edge.jpg` (Tassel knotting & fringe ends)
- **Target Channels:** Single Channel (Grayscale / R) or RGBA (Cutout with Alpha)
- **Target Bit Depth:** 8-bit
- **Target Color Space:** `Linear / Non-Color`
- **Expected Delivery Format:** Lossless PNG
- **Intended Channel Meaning:**
  - **Value 1.0 (White, 255):** Opaque woven cloth and dense tassel knots.
  - **Value 0.0 (Black, 0):** Void between loose warp fringes and edge cutouts.
  - **Values 0.1 → 0.8 (Grayscale):** Semi-transparent yarn wisps and micro-fraying.
- **Nature of Data:** Visual authoring guidance. Authoritative boundary guide for alpha clipping and edge vertex displacement.

---

## 4. Summary Table of Contracts

| Map ID | Base Name | Map Type | Target Format | Color Space | Channels | Authoring Basis |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `TEX-01` | `VYSHUUU-TEX-01-base-color` | Albedo Color | PNG / WebP | `sRGB` | 3 (RGB) | Visual Art Target |
| `TEX-02` | `VYSHUUU-TEX-02-zari-mask` | Metallic Mask | PNG | `Linear` | 1 (R) | Visual Art Target |
| `TEX-03` | `VYSHUUU-TEX-03-border-mask` | Spatial Mask | PNG | `Linear` | 1 (R) | Visual Art Target |
| `TEX-04` | `VYSHUUU-TEX-04-pallu-mask` | Spatial Mask | PNG | `Linear` | 1 (R) | Visual Art Target |
| `TEX-05` | `VYSHUUU-TEX-05-red-accent` | Isolation Mask| PNG | `Linear` | 1 (R) | Visual Art Target |
| `TEX-06` | `VYSHUUU-TEX-06-weave-direction`| Flow Vector | PNG | `Linear` | 2 (RG) | Visual Art Target |
| `TEX-07` | `VYSHUUU-TEX-07-roughness` | Roughness | PNG | `Linear` | 1 (R) | Visual Art Target |
| `TEX-08` | `VYSHUUU-TEX-08-micro-normal` | Normal Map | PNG | `Linear` | 3 (RGB) | Visual Art Target |
| `TEX-09` | `VYSHUUU-TEX-09-edge-fringe` | Alpha Mask | PNG | `Linear` | 1 (R) | Visual Art Target |
