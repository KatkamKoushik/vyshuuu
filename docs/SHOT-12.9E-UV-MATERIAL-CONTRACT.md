# SHOT 12.9E — UV + MATERIAL AUTHORING CONTRACT
**VYSHUUU — The Unstitched Continuum**  
*Document Version: 1.0.0 — Canonical UV Coordinate System & Material Authoring Contract*  
*Milestone: SHOT 12.9E | Status: Authoring Contract Locked*

---

## 1. Locked Production Maps Baseline

The first five production textile maps have been cleansed, normalized, verified, and locked in [`VYSHUUU-SOURCE-VAULT/04_TEXTURES/`](file:///d:/saree/VYSHUUU-SOURCE-VAULT/04_TEXTURES/):

1. **`01_BASE_COLOR`:** `VYSHUUU-TEX-01-base-color.png` (1997×787, 8-bit RGB, sRGB) — **LOCKED**
2. **`02_ZARI_MASK`:** `VYSHUUU-TEX-02-zari-mask.png` (1997×787, 8-bit Grayscale L, Linear) — **LOCKED**
3. **`03_BORDER_MASK`:** `VYSHUUU-TEX-03-border-mask.png` (1997×787, 8-bit Grayscale L, Linear) — **LOCKED**
4. **`04_PALLU_MASK`:** `VYSHUUU-TEX-04-pallu-mask.png` (1997×787, 8-bit Grayscale L, Linear) — **LOCKED**
5. **`05_RED_ACCENT`:** `VYSHUUU-TEX-05-red-accent.png` (1997×787, 8-bit Grayscale L, Linear) — **LOCKED**

These five maps constitute the immutable spatial and chromatic anchor for the remaining material maps (`06_WEAVE_DIRECTION`, `07_ROUGHNESS`, `08_MICRO_NORMAL`, and `09_EDGE_FRINGE`).

---

## 2. Canonical Canvas & UV Coordinate Convention

### A. Canonical Canvas Dimensions
- **Master Authoring Canvas:** **`1997 × 787 pixels`**
- **Aspect Ratio:** $1997 / 787 \approx 2.5375 : 1$ (Panoramic planar unstitched textile layout).

### B. UV Coordinate System
```
(U=0, V=0)                                                             (U=1, V=0)
Top-Left ┌─────────────────────────────────────────────────────────────┐ Top-Right
         │                                                             │
         │                        U → (Horizontal)                     │
         │                        Width = 1997 px                      │
         │                                                             │
         │ V ↓ (Vertical)                                              │
         │ Height = 787 px                                             │
         │                                                             │
Bottom-L └─────────────────────────────────────────────────────────────┘ Bottom-Right
(U=0, V=1)                                                             (U=1, V=1)
```

- **`U` Coordinate (Horizontal):** Normalized range $[0.0, 1.0]$ spanning pixels $x \in [0, 1996]$.
  $$\text{Pixel } x = \text{round}(U \times 1996)$$
  $$U = \frac{x}{1996}$$
- **`V` Coordinate (Vertical):** Normalized range $[0.0, 1.0]$ spanning pixels $y \in [0, 786]$.
  $$\text{Pixel } y = \text{round}(V \times 786)$$
  $$V = \frac{y}{786}$$

### C. Shared UV Framing Confirmation
All five locked maps share **100% identical pixel dimensions and UV canvas framing**:
- No map has been cropped independently.
- Pixel coordinates $(x, y)$ in any map align with identical features across all other maps with zero offset.

---

## 3. Semantic Regions & Design-Space Landmarks

> [!IMPORTANT]
> **Design-Map Coordinates vs. Physical Reality:**  
> The coordinates below represent **2D design-space landmarks within the digital authoring canvas**. They are **NOT** physical tape measurements, loom warp pins, or laboratory textile dimensions.

```
CANONICAL DESIGN-SPACE LANDMARK ZONES (Canvas Width: 1997 px)
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Left Border    Body Field (Charcoal Silk + Gold Grid)       Pallu (Brocade)     Right Border    │
│ x=16..122      x=123..1327                                  x=1328..1906        x=1874..1981    │
├─────────────┬─────────────────────────────────────────────┬───────────────────┬──────────────────┤
│ Red Accent  │                                             │                   │ Red Accent Fringe│
│ x=20..41    │                                             │                   │ x=1955..1977     │
└─────────────┴─────────────────────────────────────────────┴───────────────────┴──────────────────┘
 U=0.00                                                                                      U=1.00
```

### Landmark Coordinate Matrix
| Semantic Region | Pixel X Range ($x$) | Normalized U Range ($U$) | Primary Defining Map | Semantic Role & Shader Response |
| :--- | :---: | :---: | :--- | :--- |
| **Active Textile Bounds** | $11 \dots 1985$ | $0.0055 \dots 0.9945$ | `TEX-01` | Core textile surface area excluding outer canvas margin. |
| **Left Border** | $16 \dots 122$ | $0.0080 \dots 0.0611$ | `TEX-03` | Left selvedge border band with geometric brocade bands. |
| **Textile Body Field** | $123 \dots 1327$ | $0.0616 \dots 0.6648$ | `TEX-01` | Charcoal silk ground with fine gold pinstripe grid. |
| **Pallu (Anchal)** | $1328 \dots 1906$ | $0.6653 \dots 0.9549$ | `TEX-04` | High-density ornamental brocade terminal panel. |
| **Right Border** | $1874 \dots 1981$ | $0.9389 \dots 0.9925$ | `TEX-03` | Right selvedge border overlapping pallu termination. |
| **Left Red Accent** | $20 \dots 41$ | $0.0100 \dots 0.0205$ | `TEX-05` | Dual fine madder red-brown selvedge pinstripes. |
| **Right Red Accent** | $1955 \dots 1977$ | $0.9795 \dots 0.9905$ | `TEX-05` | Terminal madder pinstripes before fringe edge. |
| **Edge / Fringe** | $1978 \dots 1985$ | $0.9910 \dots 0.9945$ | Target `TEX-09` | Raw warp yarn termination and tassel fringe boundary. |

---

## 4. Authoring Contract for Future Maps (06–09)

When authored in subsequent milestones, maps `06` through `09` must strictly adhere to the following procedural and semantic specifications:

### A. `VYSHUUU-TEX-06-weave-direction` (Vector / Flow Map)
- **Authoring Methodology:** **Procedural / Derived Orientation Map**.
- **Source Input:** Derived from plain-weave cross-grain in `CANONICAL-06-macro` aligned to UV grid.
- **Channels:** 2 Channels (RG) or 3 Channels (RGB with $B = 0$).
- **Color Space:** `Linear / Non-Color (Data)`.
- **Channel Semantics:**
  - **Red Channel ($X$):** Weft thread direction component along horizontal axis $U$.
  - **Green Channel ($Y$):** Warp thread direction component along vertical axis $V$.
- **Constraint:** Pure visual orientation vector field. **Do not infer physical thread counts or microscopic yarn deniers.**

### B. `VYSHUUU-TEX-07-roughness` (Specular Roughness Map)
- **Authoring Methodology:** **Art-Directed Material-Response Map**.
- **Source Inputs:** Derived from `TEX-01` (Base Color), `TEX-02` (Zari Mask), `CANONICAL-03` (Fold), and `CANONICAL-06` (Macro).
- **Channels:** 1 Channel (Grayscale / R).
- **Color Space:** `Linear / Non-Color (Data)`.
- **Value Semantics:**
  - **Zari Brocade ($0.22 \dots 0.35$):** Low roughness / sharp specular reflection for metallic gold regions.
  - **Charcoal Silk Body ($0.55 \dots 0.70$):** Moderate diffuse anisotropic scattering for woven silk.
  - **Fold / Seam Creases ($0.75 \dots 0.85$):** Elevated scattering on boundary edges.
- **Constraint:** Art-directed rendering guide. **Not a laboratory profilometer roughness measurement.**

### C. `VYSHUUU-TEX-08-micro-normal` (Tangent Space Normal Map)
- **Authoring Methodology:** **Procedural Weave-Derived Tangent Normal**.
- **Source Input:** Derived from plain-weave yarn crown structure in `CANONICAL-06-macro`.
- **Channels:** 3 Channels (RGB Tangent Space Normal, OpenGL convention: $+Y$ Up).
- **Color Space:** `Linear / Non-Color (Data)`.
- **Channel Semantics:**
  - Neutral flat surface = $[128, 128, 255]$ ($[0.5, 0.5, 1.0]$ normalized).
  - Micro-perturbation represents yarn crowns and organic slub grain.
- **Constraint:** Subtle surface relief only. Must blend smoothly to neutral under mipmap minification to eliminate shimmering raster moiré at medium distance.

### D. `VYSHUUU-TEX-09-edge-fringe` (Alpha Cutout / Silhouette Mask)
- **Authoring Methodology:** **Derived Silhouette / Edge Mask**.
- **Source Input:** Derived from `CANONICAL-07-edge` aligned to the edge landmark ($x \ge 1955$).
- **Channels:** 1 Channel (Grayscale / R) or RGBA cutout.
- **Color Space:** `Linear / Non-Color (Data)`.
- **Value Semantics:**
  - **Solid Textile Body ($x < 1978$):** Value $1.0$ ($255$, opaque).
  - **Fringe Tassels ($x \in [1978, 1985]$):** Clean alpha cutout for loose fringe threads.
  - **Void ($x > 1985$):** Value $0.0$ ($0$, transparent).

---

## 5. Non-Fabrication & Textile Science Disclaimer

> [!CAUTION]
> **Strict Non-Fabrication Guardrail:**  
> In accordance with repository architecture rules, **no physical or scientific claims are made** regarding:
> - **Fiber composition** (e.g. Mulberry silk denier, natural filament purity)
> - **Yarn count** (e.g. EPI, PPI, warp ends, weft picks)
> - **Weave density** (e.g. handloom reed count, jacquard hook capacity)
> - **Physical roughness** (e.g. $R_a$, $R_z$ profilometer metrics)
> - **Real-world textile dimensions** (e.g. certified physical bolt length or weight in grams)
>
> All texture channels, landmark coordinates, and roughness ranges serve strictly as **digital visual authoring targets for computational couture**.

---

## 6. Texture Color Spaces & GPU Pipeline Requirements

| Map Category | Designated Maps | Color Space Declaration | Bit Depth | Linearization Behavior in WebGL |
| :--- | :--- | :--- | :---: | :--- |
| **Color / Albedo** | `01_BASE_COLOR` | **`sRGB`** | 8-bit | Hardware de-gamma on sample (`sRGB -> Linear`) |
| **Metallic / Spatial Masks** | `02_ZARI_MASK`<br>`03_BORDER_MASK`<br>`04_PALLU_MASK`<br>`05_RED_ACCENT`<br>`09_EDGE_FRINGE` | **`Linear / Non-Color`** | 8-bit | Direct raw scalar lookup (`texture2D().r`) |
| **Material Response** | `07_ROUGHNESS` | **`Linear / Non-Color`** | 8-bit | Direct scalar roughness multiplier |
| **Tangent Vectors** | `06_WEAVE_DIRECTION`<br>`08_MICRO_NORMAL` | **`Linear / Non-Color`** | 8-bit / 16-bit | Direct vector unpack (`vec * 2.0 - 1.0`) |

---

## 7. Resolution Strategy: Master Authoring vs. Runtime Derivatives

### A. Master Authoring Canvas (Vault Standard)
- **Authoring Resolution:** **`1997 × 787`** remains the immutable master authoring resolution for all nine source maps in `VYSHUUU-SOURCE-VAULT/04_TEXTURES/`.
- All future authoring, mask derivations, and normal map baking must be executed at this exact resolution to preserve 1:1 pixel alignment across all layers.

### B. Runtime Web Derivatives Strategy (Future Milestone)
- The raw `1997 × 787` PNG master files will **not** be loaded directly into browser runtime bundles.
- During the subsequent web-derivatives stage (pre-SHOT 13), optimized runtime textures will be generated into `public/assets/derived/textures/`:
  - **Desktop Target:** Resampled to GPU-friendly power-of-two dimensions (e.g., `2048 × 1024` or `4096 × 1024` with aspect padding) and compressed to **KTX2 / Basis Universal** with hardware mipmaps.
  - **Mobile Target:** Half-resolution `1024 × 512` KTX2 textures to maintain total VRAM under 10 MB.
- The master authoring maps in `04_TEXTURES/` remain untouched as the immutable source of truth.
