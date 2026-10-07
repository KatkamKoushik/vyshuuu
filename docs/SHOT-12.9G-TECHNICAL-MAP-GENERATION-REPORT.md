# SHOT 12.9G — Technical Map Generation Report (06–09)

> **Document Status**: Complete & Verified  
> **Milestone**: SHOT 12.9G — Candidate Technical Map Generation  
> **Date**: October 7, 2026  
> **Source Specification**: [`docs/SHOT-12.9E-UV-MATERIAL-CONTRACT.md`](file:///d:/saree/docs/SHOT-12.9E-UV-MATERIAL-CONTRACT.md) & [`docs/SHOT-12.9F-TECHNICAL-MAP-AUTHORING.md`](file:///d:/saree/docs/SHOT-12.9F-TECHNICAL-MAP-AUTHORING.md)  
> **Target Directory**: [`VYSHUUU-SOURCE-VAULT/04_TEXTURES/`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/04_TEXTURES/)  
> **Candidate Status**: These four technical maps are **CANDIDATE production maps**, not yet locked.

---

## 1. Executive Summary

In accordance with the approved specifications in `docs/SHOT-12.9E-UV-MATERIAL-CONTRACT.md` and the revised procedural algorithms defined in `docs/SHOT-12.9F-TECHNICAL-MAP-AUTHORING.md`, the four technical candidate maps (Maps 06–09) have been authored deterministically and saved directly to the source vault:

1. `06_WEAVE_DIRECTION` (`VYSHUUU-TEX-06-weave-direction.png`)
2. `07_ROUGHNESS` (`VYSHUUU-TEX-07-roughness.png`)
3. `08_MICRO_NORMAL` (`VYSHUUU-TEX-08-micro-normal.png`)
4. `09_EDGE_FRINGE_MASK` (`VYSHUUU-TEX-09-edge-fringe.png`)

All four maps strictly preserve the canonical framing of **1997 × 787 px**, contain **zero alpha channels**, use **Linear / Non-Color** data encoding, and adhere strictly to all physical range and baseline neutrality criteria.

---

## 2. Exact Source Inputs

The generation of candidate maps 06–09 utilized exclusively locked upstream design plates, canonical reference imagery, and contractual coordinate landmarks:

| Input Asset | Path | Role in Generation |
| :--- | :--- | :--- |
| **TEX-01 Base Color** | [`VYSHUUU-SOURCE-VAULT/04_TEXTURES/01_BASE_COLOR/VYSHUUU-TEX-01-base-color.png`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/04_TEXTURES/01_BASE_COLOR/VYSHUUU-TEX-01-base-color.png) | Spatial coordinate framing reference |
| **TEX-02 Zari Mask** | [`VYSHUUU-SOURCE-VAULT/04_TEXTURES/02_ZARI_MASK/VYSHUUU-TEX-02-zari-mask.png`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/04_TEXTURES/02_ZARI_MASK/VYSHUUU-TEX-02-zari-mask.png) | Primary driver for directional tangent blend (TEX-06) and metallic roughness modulation (TEX-07) |
| **TEX-03 Border Mask** | [`VYSHUUU-SOURCE-VAULT/04_TEXTURES/03_BORDER_MASK/VYSHUUU-TEX-03-border-mask.png`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/04_TEXTURES/03_BORDER_MASK/VYSHUUU-TEX-03-border-mask.png) | Regional segmentation for brocade ribbon roughness (TEX-07) |
| **TEX-04 Pallu Mask** | [`VYSHUUU-SOURCE-VAULT/04_TEXTURES/04_PALLU_MASK/VYSHUUU-TEX-04-pallu-mask.png`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/04_TEXTURES/04_PALLU_MASK/VYSHUUU-TEX-04-pallu-mask.png) | Regional segmentation for metallic pallu roughness (TEX-07) |
| **TEX-05 Red Accent** | [`VYSHUUU-SOURCE-VAULT/04_TEXTURES/05_RED_ACCENT/VYSHUUU-TEX-05-red-accent.png`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/04_TEXTURES/05_RED_ACCENT/VYSHUUU-TEX-05-red-accent.png) | Regional isolation for dyed accent silk roughness (TEX-07) |
| **CANONICAL-05-macro-weave** | [`VYSHUUU-SOURCE-VAULT/00_CANONICAL/textile/CANONICAL-05-macro-weave.png`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/00_CANONICAL/textile/CANONICAL-05-macro-weave.png) | Visual benchmark for micro-normal frequency and slub character |
| **CANONICAL-07-edge** | [`VYSHUUU-SOURCE-VAULT/00_CANONICAL/textile/CANONICAL-07-edge.png`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/00_CANONICAL/textile/CANONICAL-07-edge.png) | Structural reference for pallu tassel edge knot spacing and fray transition |

---

## 3. Map Generation Methods & Algorithms

### 3.1 Map 06 — WEAVE_DIRECTION (`VYSHUUU-TEX-06-weave-direction.png`)
- **Encoding Convention**: 2-channel vector field stored in an RGB PNG with Blue channel held constant at neutral `128` (0.0 out-of-plane tilt).
  - **Red Channel ($R$)**: Transverse / Weft tangent component ($[-1.0, 1.0] \mapsto [0, 255]$). Neutral = `128`.
  - **Green Channel ($G$)**: Longitudinal / Warp tangent component ($[-1.0, 1.0] \mapsto [0, 255]$). Neutral = `128`.
  - **Blue Channel ($B$)**: Strictly neutral `128` across 100% of the canvas.
- **Directional Blending**:
  - In silk body ($M_{\text{zari}} = 0$): Longitudinally dominant warp flow ($R = 128$, $G = 184$, direction vector $(0.00, +0.44)$).
  - In zari brocade ($M_{\text{zari}} = 1$): Transversely dominant weft insertion ($R = 184$, $G = 128$, direction vector $(+0.44, 0.00)$).
  - Continuous interpolation:
    $$R(x, y) = 128 + 56 \times \frac{M_{\text{zari}}(x, y)}{255}$$
    $$G(x, y) = 184 - 56 \times \frac{M_{\text{zari}}(x, y)}{255}$$
- **Corrections Applied (from SHOT 12.9F Revision)**:
  - Completely omitted the proposed 2-pixel-period micro-tooth alternation. The weave direction field is strictly a smooth low-frequency orientation field.
  - Outer canvas margins outside active textile boundaries ($x < 11$ or $x > 1985$, $y < 19$ or $y > 760$) are clamped to neutral $[128, 128, 128]$.
  - Zero baked lighting or image gradient contamination.

### 3.2 Map 07 — ROUGHNESS (`VYSHUUU-TEX-07-roughness.png`)
- **Encoding Convention**: Single-channel grayscale ($L$), Linear / Non-Color data.
- **Art-Directed Semantic Ranges**:
  - Silk Body: `160` (semi-matte sheen, fine Kanchipuram drape)
  - Zari Brocade: `74` (sharp metallic micro-specular highlight)
  - Pallu Metallic Field: `84` (burnished metallic ground)
  - Border Ribbon: `94` (dense supplementary weft ribbon)
  - Red Accent Bands: `136` (tight dyed silk twill)
- **Continuous Blending**:
  - Semantic weights $w_{\text{border}}$, $w_{\text{pallu}}$, $w_{\text{red}}$ derived from normalized 8-bit masks.
  - Base regional roughness:
    $$R_{\text{base}} = 160 \times (1 - w_{\text{border}} - w_{\text{pallu}} - w_{\text{red}}) + 94 \times w_{\text{border}} + 84 \times w_{\text{pallu}} + 136 \times w_{\text{red}}$$
  - Zari modulation:
    $$R_{\text{field}} = R_{\text{base}} \times (1 - w_{\text{zari}}) + 74 \times w_{\text{zari}}$$
- **Micro Variation**: Restrained high-frequency yarn tooth variation ($\pm 3$) using deterministic procedural noise $\eta(x, y) \in [-3, 3]$.
- **Corrections Applied (from SHOT 12.9F Revision)**:
  - Removed "Canvas Margins = 255 void". Non-textile/canvas borders inherit the baseline silk body roughness ($160$). Canvas margins are handled exclusively by geometric trimming / alpha boundaries.
  - Zero lighting or shadow encoding.

### 3.3 Map 08 — MICRO_NORMAL (`VYSHUUU-TEX-08-micro-normal.png`)
- **Encoding Convention**: 3-channel RGB tangent-space normal map, OpenGL coordinate convention ($+X$ right, $+Y$ up, $+Z$ surface normal).
  - Neutral baseline: $[128, 128, 255]$ (unperturbed flat surface).
- **Procedural Weave Model**:
  - Multi-frequency asymmetric directional heightfield:
    $$h(x, y) = A_{\text{warp}} \left[ \cos\left(\frac{2\pi x}{\lambda_{w1}}\right) + 0.3 \cos\left(\frac{2\pi x}{\lambda_{w2}}\right) \right] + A_{\text{weft}} \left[ \sin\left(\frac{2\pi y}{\lambda_{f1}}\right) + 0.3 \sin\left(\frac{2\pi y}{\lambda_{f2}}\right) \right] + \eta_{\text{slub}}(x, y)$$
  - Parameters:
    - $\lambda_{w1} = 5.23\text{ px}$, $\lambda_{w2} = 3.71\text{ px}$, $A_{\text{warp}} = 0.05$
    - $\lambda_{f1} = 4.89\text{ px}$, $\lambda_{f2} = 6.17\text{ px}$, $A_{\text{weft}} = 0.04$
    - Procedural slub noise $\eta_{\text{slub}}(x, y)$ amplitude: $\pm 0.015$
- **Gradient & Normal Formulation**:
  - Finite central difference: $\frac{\partial h}{\partial x} = \frac{h(x+1, y) - h(x-1, y)}{2}$, $\frac{\partial h}{\partial y} = \frac{h(x, y+1) - h(x, y-1)}{2}$
  - Tangent Normal: $\mathbf{N} = \text{normalize}\left(-\frac{\partial h}{\partial x}, -\frac{\partial h}{\partial y}, 1.0\right)$
  - Max surface angular deviation: $< 4.8^\circ$ (guaranteeing $B \ge 254$).
- **Corrections Applied (from SHOT 12.9F Revision)**:
  - Replaced fixed 4-pixel grid with incommensurate multi-frequency directional weave, preventing aliasing and checkerboard/moiré artifacts.
  - Normal field minifies smoothly to pure neutral $[128, 128, 255]$ under mipmapping.
  - Zero macro folds or baked illumination.

### 3.4 Map 09 — EDGE_FRINGE_MASK (`VYSHUUU-TEX-09-edge-fringe.png`)
- **Encoding Convention**: Single-channel grayscale ($L$), Linear / Non-Color data.
- **Semantic Spatial Zones**:
  - Interior ($x \le 1970$): Strictly `0` (0% fringe influence across entire textile body).
  - Right Border Tassel Transition ($x \in [1971, 1977]$): Smooth Hermite ramp from `0` to `180`.
  - Knotted Tassel Core ($x \in [1978, 1983]$): Periodic tassel bundle modulation ($\lambda_{\text{tassel}} = 11.5\text{ px}$) derived from `CANONICAL-07-edge`, peaking at `230`.
  - Tassel Tip Fray Zone ($x \in [1984, 1985]$): Full fringe displacement influence (peaks at `255`).
  - External Void ($x > 1985$): Strictly `0` (outside physical tassel reach).
- **Corrections Applied**:
  - Zero invented geometry or synthetic fiber mesh; serves exclusively as an art-directed displacement/influence scalar field for downstream simulation.

---

## 4. Quantitative Metrics & Pixel Analysis

Detailed measurement table across the candidate maps and locked design maps:

| Map ID | Name | Dimensions | Channels | Bit Depth | Value Min | Value Max | Mean ($\mu$) | Neutral % | Low ($=0$) % | High ($=255$) % |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **TEX-01** | `base-color` | 1997 × 787 | 3 (RGB) | 8-bit | 0 | 255 | R:87.75, G:75.30, B:60.65 | N/A | R:1.81% | R:0.04% |
| **TEX-02** | `zari-mask` | 1997 × 787 | 1 (L) | 8-bit | 0 | 255 | 66.17 | N/A | 51.52% | 15.68% |
| **TEX-03** | `border-mask`| 1997 × 787 | 1 (L) | 8-bit | 0 | 255 | 20.64 | N/A | 89.24% | 5.21% |
| **TEX-04** | `pallu-mask` | 1997 × 787 | 1 (L) | 8-bit | 0 | 255 | 70.33 | N/A | 71.98% | 27.24% |
| **TEX-05** | `red-accent` | 1997 × 787 | 1 (L) | 8-bit | 0 | 255 | 4.36 | N/A | 97.43% | 1.15% |
| **TEX-06** | `weave-direction` | 1997 × 787 | 3 (RGB) | 8-bit | R:128, G:128, B:128 | R:184, G:184, B:128 | R:142.53, G:165.69, B:128.00 | B:100.00%<br>RG neutral: 6.76% | 0.00% | 0.00% |
| **TEX-07** | `roughness` | 1997 × 787 | 1 (L) | 8-bit | 72 | 162 | 134.76 | N/A | 0.00% | 0.00% |
| **TEX-08** | `micro-normal`| 1997 × 787 | 3 (RGB) | 8-bit | R:117, G:116, B:254 | R:138, G:139, B:255 | R:127.53, G:127.53, B:255.00 | Normal: 7.61%<br>B=255: 99.98% | 0.00% | 0.00% |
| **TEX-09** | `edge-fringe` | 1997 × 787 | 1 (L) | 8-bit | 0 | 255 | 0.85 | N/A | 99.29% | 0.09% |

### Key Observations:
1. **Weave Direction (06)**: Blue channel is rigorously uniform at `128` (100.00% of all 1,571,639 pixels), confirming strictly 2D tangent plane alignment with zero spurious Z perturbations. Non-woven margins account for 6.76% of exact $[128, 128]$ neutral orientation.
2. **Roughness (07)**: Range strictly conforms to $[72, 162]$ (tightly enclosed within the $[65, 175]$ art-directed envelope). Zero pixels are assigned to 0 or 255, confirming the elimination of artificial void assignments.
3. **Micro Normal (08)**: Tangent-space Z component stays at $\ge 254$ across all pixels, with mean $[127.53, 127.53, 255.00]$. Angular deviation never exceeds $4.8^\circ$. Neutral unperturbed baseline $[128, 128, 255]$ accounts for 7.61% of pixels (textile margins and uniform field intersections).
4. **Edge Fringe Mask (09)**: Interior represents 99.29% zero value, guaranteeing zero unintended fringe distortion across the main garment body. Fringe influence peaks cleanly at the right pallu fringe boundary ($x \approx 1984..1985$).

---

## 5. Isolation & Integrity Confirmations

1. **Maps 01–05 Integrity**:
   - Files in `VYSHUUU-SOURCE-VAULT/04_TEXTURES/01_BASE_COLOR/` through `05_RED_ACCENT/` were **NOT modified**.
   - Timestamps and byte counts remain identical to their post-cleanup state from SHOT 12.9D.
2. **Public Assets Directory Integrity**:
   - `public/assets/` was **NOT modified**.
   - No textures, intermediate masks, or candidate files were copied into `public/assets/` or `public/assets/derived/textures/`.
3. **No AI Re-Generation**:
   - Neither ChatGPT nor Google Flow image generation was used. All candidate maps were synthesized deterministically using mathematical formulations grounded in upstream locked masks.
4. **No Textile Geometry Invented**:
   - No 3D meshes, spline curves, cloth physics objects, or VAT (Vertex Animation Textures) were generated.

---

## 6. Tooling & Verification Commands

The repository texture validation script ([`scripts/validate-textures.mjs`](file:///d:/saree/scripts/validate-textures.mjs)) was upgraded with:
- Full PNG IDAT decompression and scanline reconstruction (unfiltering types 0–4).
- Channel count and bit-depth assertion.
- Exact dimension checking ($1997 \times 787$).
- Absence of alpha channel verification.
- Semantic range checks for all 9 maps.
- Strict neutral baseline verification (B=128 for vector flow, $+Z \ge 250$ for normal).

### Verification Command Status:
- `pnpm validate:textures`: **PASSED** (9 PRESENT, 0 MISSING, 0 INVALID)
- `pnpm typecheck`: **PASSED** (0 TypeScript errors)
- `pnpm lint`: **PASSED** (0 ESLint errors/warnings)
- `pnpm build`: **PASSED** (Production Next.js application built cleanly)

---

## 7. Next Steps

With Maps 06–09 authored as candidate production maps, the 9-map production texture suite is complete in `VYSHUUU-SOURCE-VAULT/04_TEXTURES/`. Awaiting user review and approval before proceeding to UV projection, cloth topology, or shader graph integration.
