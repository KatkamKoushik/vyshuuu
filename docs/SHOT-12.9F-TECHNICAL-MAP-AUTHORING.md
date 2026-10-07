# SHOT 12.9F (REVISED) — TECHNICAL MAP AUTHORING ALGORITHMS
**VYSHUUU — The Unstitched Continuum**  
*Document Version: 1.1.0 — Revised Algorithmic Specification for Production Material Maps (06–09)*  
*Milestone: SHOT 12.9F Revision | Status: Algorithm Specification Locked (Implementation Gated)*

---

## 1. Locked Production Baseline & Scope Boundary

In accordance with [docs/SHOT-12.9E-UV-MATERIAL-CONTRACT.md](file:///d:/saree/docs/SHOT-12.9E-UV-MATERIAL-CONTRACT.md), the first five production textile maps remain **immutable and locked**:
- `01_BASE_COLOR` (`VYSHUUU-TEX-01-base-color.png`, 1997×787, 8-bit RGB, sRGB) — **LOCKED**
- `02_ZARI_MASK` (`VYSHUUU-TEX-02-zari-mask.png`, 1997×787, 8-bit Grayscale L, Linear) — **LOCKED**
- `03_BORDER_MASK` (`VYSHUUU-TEX-03-border-mask.png`, 1997×787, 8-bit Grayscale L, Linear) — **LOCKED**
- `04_PALLU_MASK` (`VYSHUUU-TEX-04-pallu-mask.png`, 1997×787, 8-bit Grayscale L, Linear) — **LOCKED**
- `05_RED_ACCENT` (`VYSHUUU-TEX-05-red-accent.png`, 1997×787, 8-bit Grayscale L, Linear) — **LOCKED**

> [!IMPORTANT]
> **Implementation Gating Directive:**  
> **Maps 06–09 MUST NOT be generated in this milestone.** This revised document codifies the exact procedural algorithms, mathematical formulations, and corrected semantic contracts prior to authoring. No generative AI (ChatGPT or Google Flow) will be used for these maps.

---

## 2. Common Canvas & Data Requirements

All four target maps (`TEX-06` through `TEX-09`) must strictly obey the unified authoring contract:
- **Canonical Canvas:** **`1997 × 787 pixels`**
- **UV Mapping Alignment:** Horizontal $U \in [0.0, 1.0]$ ($x = 0 \dots 1996$), Vertical $V \in [0.0, 1.0]$ ($y = 0 \dots 786$).
- **Color Space:** **`Linear / Data`** across all four maps.
- **Bit Depth:** **8-bit** unsigned integer per channel (master standard).
- **Alpha:** **Strictly Opaque (Zero accidental alpha)**.
- **Vault Location:** `VYSHUUU-SOURCE-VAULT/04_TEXTURES/`. **No files copied to `public/assets/`**.

---

## 3. Revised Algorithm: `06_WEAVE_DIRECTION`

### A. Purpose & Shader Role
Encodes the primary visual tangent direction of the woven textile to drive anisotropic specular highlight elongation in the WebGL shader. Woven silk displays distinct directional sheen depending on whether light reflects off longitudinal warp or transverse weft yarns.

### B. Encoding Convention
A two-channel $RG$ vector field (stored in an 8-bit RGB PNG with Blue fixed at neutral $128$):
- **Red Channel ($R$):** Tangent vector component along the horizontal $U$ axis (transverse weft direction).
- **Green Channel ($G$):** Tangent vector component along the vertical $V$ axis (longitudinal warp direction).
- **Neutral Surface Baseline:** $R = 128, G = 128$ (corresponds to zero directional bias / isotropic reflection).

In the WebGL shader, the direction vector is unpacked as:
$$\vec{T}_{\text{weave}} = \text{normalize}\left(\frac{\text{texture2D}(u\text{WeaveDir}, \text{uv}).rg - 0.5}{0.5}\right)$$

### C. Procedural Formulation (Smooth Low-Frequency Orientation Field)
> [!NOTE]
> **Correction Applied:** High-frequency pixel-scale micro-tooth alternation has been **removed entirely**. `06_WEAVE_DIRECTION` serves strictly as a smooth, low-frequency orientation field. Microscopic thread relief belongs exclusively to `08_MICRO_NORMAL`.

1. **Warp-Dominant Ground (Charcoal Silk Body):**
   Longitudinal silk warp yarns dominate the body field. Anisotropic highlight elongates across the vertical warp:
   $$\vec{T}_{\text{body}} = (R = 128, G = 184) \implies \text{Longitudinal Bias } (+Y)$$
2. **Weft-Dominant Ground (Zari Brocade Bands & Pallu):**
   Supplementary metallic zari picks run horizontally across the textile width, dominating specular reflection:
   $$\vec{T}_{\text{zari}} = (R = 184, G = 128) \implies \text{Transverse Bias } (+X)$$
3. **Continuous Zari-Driven Zone Interpolation:**
   Let $M_{\text{zari}}(u, v) \in [0.0, 1.0]$ be the normalized float value sampled from locked `TEX-02`:
   $$R(u, v) = \text{round}\left(128 + 56 \times M_{\text{zari}}(u, v)\right)$$
   $$G(u, v) = \text{round}\left(184 - 56 \times M_{\text{zari}}(u, v)\right)$$
   $$B(u, v) = 128$$

The resulting vector field is smooth, macro-scale, and free of high-frequency noise or arbitrary image gradients.

---

## 4. Revised Algorithm: `07_ROUGHNESS`

### A. Purpose & Shader Role
Provides the perceptual microsurface roughness parameter for PBR specular lobes (GGX / Beckmann), dictating the sharpness and blur of specular reflections off metallic zari vs. woven silk.

### B. Format & Color Space
- Single-channel grayscale image (`mode: 'L'`).
- `Linear / Data` color space.

### C. Material Zone Roughness Targets
All values are **art-directed visual authoring targets**, not physical profilometer measurements:

| Semantic Zone | Active Masks | Target Roughness ($\alpha$) | 8-Bit Pixel Value ($0 \dots 255$) | Visual Response Rationale |
| :--- | :--- | :---: | :---: | :--- |
| **Metallic Zari Brocade** | `TEX-02` (High) | **$0.26 \dots 0.32$** | **$66 \dots 82$** | Sharp, burnished metallic reflection with tight specular highlight. |
| **Selvedge Border Ribbon**| `TEX-03` (High) | **$0.34 \dots 0.40$** | **$87 \dots 102$** | Ribbon selvedge cord; semi-gloss specular response. |
| **Pallu Jacquard Field** | `TEX-04` & `TEX-02` | **$0.30 \dots 0.36$** | **$77 \dots 92$** | Dense diamond metallic lattice with slight micro-relief tooth. |
| **Madder Red Accent** | `TEX-05` (High) | **$0.50 \dots 0.56$** | **$128 \dots 143$** | Dyed selvedge cord; satin reflection between silk and border. |
| **Charcoal Silk Ground** | Body Field (No masks) | **$0.60 \dots 0.66$** | **$153 \dots 168$** | Soft, deep anisotropic diffusion; prevents shiny plastic appearance. |

> [!NOTE]
> **Correction Applied:** Arbitrary "Canvas Margins = 255" has been **removed from the material definition**. Non-textile canvas space is handled strictly by 3D mesh geometry and edge alpha clipping, not assigned an artificial physical material roughness. For uniform texture continuity, outer margin pixels inherit the ambient silk ground baseline ($160$).

### D. Blending & Transition Mathematics
Roughness is synthesized via continuous Hermite interpolation across locked semantic masks without hard rectangular step jumps:

$$R_{\text{base}}(u, v) = 160 \quad (\text{Charcoal Silk baseline})$$
$$\text{factor}_{\text{zari}} = \frac{\text{TEX-02}(u, v)}{255.0}$$
$$\text{factor}_{\text{border}} = \frac{\text{TEX-03}(u, v)}{255.0}$$
$$\text{factor}_{\text{red}} = \frac{\text{TEX-05}(u, v)}{255.0}$$

$$R_{\text{composite}}(u, v) = R_{\text{base}} \cdot (1 - \text{factor}_{\text{zari}}) + 74 \cdot \text{factor}_{\text{zari}}$$
$$R_{\text{composite}} = \text{lerp}(R_{\text{composite}}, 94, \text{factor}_{\text{border}} \cdot (1 - \text{factor}_{\text{zari}}))$$
$$R_{\text{composite}} = \text{lerp}(R_{\text{composite}}, 136, \text{factor}_{\text{red}})$$

A subtle organic slub tooth modulation ($\pm 3$ levels) prevents completely flat synthetic gradients.

---

## 5. Revised Algorithm: `08_MICRO_NORMAL`

### A. Purpose & Shader Role
Provides subtle surface normal perturbation describing plain-weave warp and weft thread crowns and natural handloom slub irregularities.

### B. Format & Color Space
- 3-channel RGB image.
- OpenGL tangent space convention: $+X$ Right, $+Y$ Up, $+Z$ Outward.
- `Linear / Data` color space.
- Neutral flat surface = $[128, 128, 255]$ ($\vec{N} = [0, 0, 1]$).

### C. Multi-Frequency Procedural Directional Weave Model
> [!NOTE]
> **Correction Applied:** Fixed 4-pixel isotropic square grids have been **completely replaced** with an asymmetric, multi-frequency directional weave model:
> - Low-amplitude warp component running longitudinally
> - Low-amplitude weft component running transversely
> - Distinct, non-commensurate spatial frequencies ($\lambda_{\text{warp}} \ne \lambda_{\text{weft}}$)
> - Zero checkerboard pattern or hard repeating square grid
> - Zero baked lighting or macro folds
> - Subtle amplitude at close range that naturally fades to neutral under mipmap minification

1. **Continuous Surface Elevation Formulation:**
   $$h(x, y) = A_{\text{warp}} \cos\left(\frac{2\pi x}{\lambda_u}\right) \cdot \sin\left(\frac{2\pi y}{\lambda_{v1}}\right) + A_{\text{weft}} \sin\left(\frac{2\pi y}{\lambda_{v2}}\right) \cdot \cos\left(\frac{2\pi x}{\lambda_{u2}}\right) + S(x, y)$$
   Where:
   - **Warp Wavelengths:** $\lambda_u = 5.23\text{ px}$, $\lambda_{v1} = 3.71\text{ px}$ (Irrational pitch ratio preventing square checkerboarding).
   - **Weft Wavelengths:** $\lambda_{v2} = 4.89\text{ px}$, $\lambda_{u2} = 6.17\text{ px}$.
   - **Amplitudes:** $A_{\text{warp}} = 0.05$, $A_{\text{weft}} = 0.04$ (Subtle micro-relief; max angular deflection $< 5^\circ$).
   - **Organic Slub Component:** $S(x, y) \in [-0.015, 0.015]$ continuous band-limited value noise simulating slight yarn thickness variations.
2. **Analytical Gradient & Normal Vector Calculation:**
   $$\frac{\partial h}{\partial x} \approx \frac{h(x+1, y) - h(x-1, y)}{2}$$
   $$\frac{\partial h}{\partial y} \approx \frac{h(x, y+1) - h(x, y-1)}{2}$$
   $$\vec{N} = \text{normalize}\left(-\frac{\partial h}{\partial x}, +\frac{\partial h}{\partial y}, 1.0\right) \quad (+Y \text{ OpenGL convention})$$
3. **8-Bit Encoding:**
   $$R = \text{round}\left((N_x \times 0.5 + 0.5) \times 255\right)$$
   $$G = \text{round}\left((N_y \times 0.5 + 0.5) \times 255\right)$$
   $$B = \text{round}\left((N_z \times 0.5 + 0.5) \times 255\right)$$
4. **Minification & Mipmap Behavior:**
   Because the amplitudes are strictly restrained ($A \le 0.05$), standard trilinear GPU texture filtering causes the micro-normal perturbations to average out cleanly to $[128, 128, 255]$ at distances beyond 2 meters, completely eliminating moiré.

---

## 6. Revised Semantic Contract: `09_EDGE_FRINGE_MASK`

### A. Semantic Definition (Edge Influence Mask)
> [!NOTE]
> **Correction Applied:** Contract renamed to **`09_EDGE_FRINGE_MASK`**. This map is an **EDGE INFLUENCE MASK**, not a direct alpha cutout. The external void is **NOT** defined as 255.
> - **`0`:** Zero edge/fringe influence (interior textile).
> - **`255`:** Maximum edge/fringe influence (peak fringe knotting and terminal selvedge fringe tips).

### B. Format & Color Space
- Single-channel grayscale image (`mode: 'L'`).
- `Linear / Data` color space.

### C. Geometric Landmark & Structural Derivation
Derived directly from `CANONICAL-07-edge` and design-space landmarks ($x \ge 1970$):
- **Interior Textile Body ($x \le 1970$):** Value is strictly **`0` (Black)** (Zero edge influence).
- **Fringe Base Onset ($x \in [1971, 1977]$):** Influence rises smoothly from $0$ to $80$ as fabric approaches the terminal selvedge seam.
- **Knotted Tassel Core ($x \in [1978, 1983]$):** Periodic tassel knot modulation derived from `CANONICAL-07-edge`:
  $$I_{\text{fringe}}(x, y) = 140 + 90 \times \left|\cos\left(\frac{2\pi y}{11.5}\right)\right| \cdot \left(\frac{x - 1970}{13.0}\right)$$
- **Fringe Tips / Terminal Selvedge Boundary ($x \in [1984, 1985]$):** Reaches peak fringe influence **`255`**.
- **External Void ($x > 1985$):** Non-textile canvas space; clamped to **`0`** (since edge influence exists solely on the textile structure, with void occlusion governed by mesh geometry).

---

## 7. Non-Fabrication Policy Declaration

> [!CAUTION]
> **Strict Non-Fabrication Guardrail:**  
> These technical maps are generated purely from mathematical formulations, procedural harmonics, and locked design-space masks.
> 
> Under no circumstances should these maps be described as:
> - Measured textile weave densities
> - Actual handloom thread counts (EPI / PPI)
> - Real yarn denier or twist angles
> - Laboratory spectrometer or profilometer data
> - Historical or artisanal provenance facts

---

## 8. Validation Suite Status

The enhanced validation utility ([scripts/validate-textures.mjs](file:///d:/saree/scripts/validate-textures.mjs)) verifies:
1. Exact canvas dimensions: `1997 × 787`.
2. Exact channel counts: `TEX-06` (2 or 3 ch), `TEX-07` (1 ch), `TEX-08` (3 ch), `TEX-09` (1 ch).
3. Zero accidental alpha channels across all maps.
4. Correct declared color space (`Linear / Data`).
5. 8-bit unsigned integer bit depth.
