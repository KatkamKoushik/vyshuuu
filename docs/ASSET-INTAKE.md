# VYSHUUU — ASSET INTAKE & SOURCE-OF-TRUTH PROTOCOL
**The Unstitched Continuum**  
*Document Version: 1.0.0 — Pre-SHOT 13 Canonical Baseline*

---

## 1. What VYSHUUU Considers a Canonical Asset

At VYSHUUU, the saree is the subject and the browser is the digital loom. Technology exists solely to honor, sculpt, and articulate physical textile intelligence. 

A **Canonical Asset** is an authoritative, verified digital artifact that represents the real-world physical subject or brand identity with uncompromised fidelity. A canonical asset is:
- **Grounded in Physical Reality:** Originating from an actual photograph, optical macro scan, or master vector file of the real saree, artisan process, or brand mark.
- **Authoritatively Verified:** Confirmed by the creator/curator with confirmed provenance, fiber composition, and visual accuracy.
- **Immutable in Integrity:** Serving as the definitive reference from which all optimized web derivatives, shaders, and UI treatments are drawn.

Generative AI imagery, speculative 3D cloth models, or algorithmic hallucinations are **never** canonical assets.

---

## 2. Asset Classification Taxonomy

Every asset within the VYSHUUU repository is categorized under one of six strict classifications:

| Classification | Definition | Examples | Authority |
| :--- | :--- | :--- | :--- |
| **REAL** | Authentic photographic, optical, or vector material captured from the real subject or supplied by the creator. | Photography of the actual saree, artisan pit-loom photos, client-supplied vector logotype. | **Highest (Canonical)** |
| **GENERATED** | Synthetic visual material produced via generative tools (AI/diffusion/concept models). | Conceptual moodboards, exploratory atmospheric backdrops. | **Non-canonical; exploratory only** |
| **PROCEDURAL** | Mathematically computed in real-time via GLSL shaders, Three.js geometries, or CSS algorithms. | Plain weave fragment shader, silk anisotropic sheen lobe, Catmull-Rom golden filament curve. | **Authoritative for dynamic interaction** |
| **DERIVED** | Optimized, compressed, cropped, or mip-mapped representations generated directly from a REAL canonical source. | WebP/AVIF web resolutions, mobile textures, roughness maps, normal maps extracted from macro scans. | **Derived from Canonical** |
| **PLACEHOLDER** | Temporary stand-in files used strictly to maintain layout or pipeline scaffolding during engineering. | Starter SVG icons (`next.svg`, `file.svg`), generic grey-box planes. | **Temporary; must be replaced** |
| **LEGACY** | Files belonging to older conceptual prototypes (e.g., earlier personal friendship experiments) preserved for reference but excluded from the final haute couture brand system. | Historical 300-frame video sequences, draft personal-memory sections, uncurated raw assets. | **Non-canonical; quarantined** |
| **MISSING** | A required canonical asset that has not yet been supplied or ingested into the Source Vault. | Canonical hero saree photograph, pallu macro, verified provenance certificate. | **Pipeline Blocker for SHOT 13** |

---

## 3. Source-of-Truth Rules

1. **The Real Textile Governs the Shader:** Shaders and procedural systems must never dictate what the saree looks like. The real saree photograph dictates how shader uniforms (`uWarpStrength`, `uWeftStrength`, `uBaseColor`, `uZariColor`) are calibrated.
2. **Never Fabricate Provenance:** If a detail (such as handloom hours, fiber ply, or weaving cluster) is not historically verified, it must remain omitted. Speculative statistics are strictly forbidden.
3. **No Phantom Assets in Code:** Manifest references must resolve to physical files on disk or explicit `status: 'MISSING'` entries. Ghost paths that 404 at runtime are forbidden.
4. **Separation of Brand vs. Dedication:**
   - **VYSHUUU** is the fashion house, brand world, and interactive experience.
   - **Vyshnavi** is the person being honored in the dedicated salon / archival footnote.
   - These identities must never be merged, confused, or used interchangeably.

---

## 4. Naming Conventions

All incoming assets must follow a strict lowercase kebab-case naming standard that identifies category, subject, detail, and resolution tier:

```
[category]-[subject]-[detail]-[variant].[ext]
```

### Examples:
- `saree-hero-full-length-raw.jpg` (Master ingest)
- `saree-hero-full-length-web.webp` (Web derivative: 2560px wide, q=88)
- `saree-hero-full-length-mobile.webp` (Mobile derivative: 1080px wide, q=82)
- `saree-detail-pallu-macro-raw.png` (Optical macro scan)
- `textile-zari-macro-normal.webp` (Derived normal map)
- `brand-wordmark-master.svg` (Official vector logotype)
- `brand-monogram-master.svg` (Official vector monogram)

---

## 5. Assets Required for SHOT 13 (The Six-Yard Unfurling)

SHOT 13 cannot proceed until the following canonical assets are delivered and placed in the Source Vault:

| Asset ID | Required Ingest Path | Description | Blocking Status |
| :--- | :--- | :--- | :--- |
| `saree-canonical-hero-reference` | `/public/assets/saree/hero/saree-hero-full-length.jpg` | Full unstitched saree reference photograph (raw capture) | **BLOCKING** |
| `saree-canonical-pallu-detail` | `/public/assets/saree/pallu/saree-pallu-detail.jpg` | High-res pallu end-piece showing zari motif architecture | **BLOCKING** |
| `saree-canonical-border-detail` | `/public/assets/saree/border/saree-border-detail.jpg` | High-res selvedge border showing interlock & selvedge edge | **BLOCKING** |
| `saree-canonical-pleats-drape` | `/public/assets/saree/pleats/saree-pleats-reference.jpg` | Draped pleat behavior showing gravity response and drape memory | **BLOCKING** |
| `textile-canonical-macro-silk` | `/public/assets/textile/macro/textile-silk-macro.jpg` | Extreme close-up of warp/weft silk yarn crowns under raking light | **BLOCKING** |
| `textile-canonical-zari-macro` | `/public/assets/textile/zari/textile-zari-macro.jpg` | Extreme close-up of antique zari thread structure & metal luster | **BLOCKING** |
| `brand-canonical-vector-wordmark` | `/public/assets/brand/wordmark/vyshuuu-wordmark.svg` | Master vector wordmark asset | **BLOCKING** |
| `brand-canonical-vector-monogram` | `/public/assets/brand/monogram/vyshuuu-monogram.svg` | Master vector monogram asset | **BLOCKING** |
| `archive-canonical-provenance` | `/public/assets/archive/provenance/provenance-record.json` | Real provenance metadata (dimensions, weave origin, silk type) | **BLOCKING** |

---

## 6. Optional Assets (Non-Blocking)

The following assets enhance depth and atmospheric storytelling but are not prerequisite blockers for SHOT 13:
- `/public/assets/atelier/loom/` — Documentary photographs of the actual handloom mechanism.
- `/public/assets/atelier/hands/` — Documentary photographs of artisan hands working the shuttle.
- `/public/assets/editorial/campaign/` — Editorial styling and silhouette photography.
- `/public/assets/editorial/portrait/` — Curated portraiture of Vyshnavi wearing the saree.
- `/public/assets/archive/labels/` — Physical woven atelier labels and serial stamps.

---

## 7. Assets That Must Never Be Fabricated

To preserve the intellectual integrity and luxury standing of VYSHUUU, the following materials must **never** be generated using AI:
1. **The Saree Body & Motifs:** The physical saree has a distinct weaving heritage and real existence. Generating a fictional AI saree invalidates the core thesis: *"The saree is the subject."*
2. **Artisan Portraits & Identities:** Real weavers and handloom artisans must never be replaced with AI-generated human faces.
3. **Textile Provenance & Craft Statistics:** Do not invent metrics such as `"184 handloom hours"` or `"98.5% pure silver zari"` unless documented by certified provenance.
4. **Historical & Geographic Provenance:** Never invent weaving clusters (e.g. claiming a saree is from Kanchipuram, Chanderi, or Banaras unless historically verified).

---

## 8. Mobile Derivative Architecture

All mobile derivatives are strictly **DERIVED** from canonical REAL masters and stored under:
```
/public/assets/derived/mobile/
```

### Mobile Optimization Rules:
- **Max Dimension:** 1440px on longest edge.
- **Format:** Modern AVIF or WebP with 82% quality compression.
- **Color Profile:** sRGB standard IEC61966-2.1.
- **Aspect Ratio:** Preserved exactly from master without artificial cropping.

---

## 9. Reduced-Motion Strategy

Users with `prefers-reduced-motion: reduce` receive static, high-craft editorial compositions without continuous GPU animation:
- **Static Resting Hero:** `/public/assets/derived/web/saree-hero-composed-static.webp`
- **Fallback Scene:** High-resolution still captures of the unstitched continuum resting at golden ratio coordinates.
- **Zero Idle Oscillation:** Continuous camera sway, pointer light tracking, and fold ripple animations are deactivated.

---

## 10. How Provenance is Recorded

When an authentic asset is ingested into the Source Vault, a companion metadata entry must be recorded in `/src/lib/assets/asset-manifest.ts` and in `/public/assets/archive/provenance/provenance-record.json` detailing:

```json
{
  "assetId": "saree-canonical-hero-reference",
  "provenance": {
    "acquisitionDate": "YYYY-MM-DD",
    "capturedBy": "Photographer or Creator Name",
    "captureEquipment": "Camera, Lens, Lighting setup",
    "colorCalibration": "Verified against physical textile under 3200K / 5000K light",
    "subjectAttribution": {
      "textileType": "Indian Handloom Saree",
      "fiberComposition": "Pure Silk with Zari brocade",
      "physicalDimensionsMeters": { "length": 5.5, "width": 1.15 },
      "curator": "VYSHUUU Atelier"
    }
  }
}
```

Until these fields are populated from genuine source documents, the asset status remains `MISSING` and `provenanceVerified: false`.
