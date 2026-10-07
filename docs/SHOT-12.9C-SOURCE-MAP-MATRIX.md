# SHOT 12.9C — CANONICAL SOURCE-TO-MAP TRACEABILITY MATRIX
**VYSHUUU — The Unstitched Continuum**  
*Document Version: 1.0.0 — Authoring Traceability Matrix*  
*Milestone: SHOT 12.9C | Status: Approved Architecture*

---

## 1. Executive Summary

This matrix establishes the definitive, one-to-one and one-to-many traceability between the promoted **Canonical References** in `VYSHUUU-SOURCE-VAULT/00_CANONICAL/` and the **Nine Target Production Maps** specified for the digital haute couture textile pipeline.

> [!IMPORTANT]
> **Art-Direction Guidance Only:**  
> The canonical source images provide visual, aesthetic, and structural references. They do **NOT** supply laboratory assays or physical measurements. Each map is authored through digital design interpretation rather than automated physical extraction.

---

## 2. Canonical Source-to-Map Matrix

| Target Production Map ID | Target Map Name | Primary Canonical Source References | Supporting Canonical Source References | Extracted Design Data / Visual Cues |
| :--- | :--- | :--- | :--- | :--- |
| **`TEX-01`** | `VYSHUUU-TEX-01-base-color` | • `VYSHUUU-CANONICAL-02-flat-reference.jpg`<br>• `VYSHUUU-CANONICAL-01-full-length.jpg` | • `VYSHUUU-CANONICAL-05-border.jpg`<br>• `VYSHUUU-CANONICAL-08-pallu.jpg` | Full planar 5.5m continuum proportion, charcoal ground albedo, pinstripe grid frequency, border contrast. |
| **`TEX-02`** | `VYSHUUU-TEX-02-zari-mask` | • `VYSHUUU-CANONICAL-05-border.jpg`<br>• `VYSHUUU-CANONICAL-06-macro.jpg`<br>• `VYSHUUU-CANONICAL-08-pallu.jpg` | • `VYSHUUU-CANONICAL-09-gold-thread-macro.jpg` | Exact binary/grayscale segmentation of metallic gold brocade areas vs. non-metallic matte charcoal silk ground. |
| **`TEX-03`** | `VYSHUUU-TEX-03-border-mask` | • `VYSHUUU-CANONICAL-05-border.jpg`<br>• `VYSHUUU-CANONICAL-02-flat-reference.jpg` | • `VYSHUUU-CANONICAL-07-edge.jpg` | Transverse selvedge boundary dimensions along $U$, chevron band width, selvedge cord isolation. |
| **`TEX-04`** | `VYSHUUU-TEX-04-pallu-mask` | • `VYSHUUU-CANONICAL-08-pallu.jpg`<br>• `VYSHUUU-CANONICAL-02-flat-reference.jpg` | • `VYSHUUU-CANONICAL-01-full-length.jpg` | Longitudinal terminal zone along $V \in [0.82, 0.98]$, brocade end-piece geometry, density gradient ramp. |
| **`TEX-05`** | `VYSHUUU-TEX-05-red-accent` | • `VYSHUUU-CANONICAL-07-edge.jpg`<br>• `VYSHUUU-CANONICAL-05-border.jpg` | • `VYSHUUU-CANONICAL-08-pallu.jpg` | Restrained madder/kumkum selvedge pinstripe and decorative divider lines; chromatic isolation mask. |
| **`TEX-06`** | `VYSHUUU-TEX-06-weave-direction`| • `VYSHUUU-CANONICAL-06-macro.jpg` | • `VYSHUUU-CANONICAL-03-fold.jpg` | Visual orientation of warp and weft crossings for anisotropic tangent/bitangent direction computation. |
| **`TEX-07`** | `VYSHUUU-TEX-07-roughness` | • `VYSHUUU-CANONICAL-06-macro.jpg`<br>• `VYSHUUU-CANONICAL-03-fold.jpg` | • `VYSHUUU-CANONICAL-05-border.jpg` | Differential specular roughness between glossy metallic zari ($0.25 - 0.38$) and matte woven silk ($0.55 - 0.70$). |
| **`TEX-08`** | `VYSHUUU-TEX-08-micro-normal` | • `VYSHUUU-CANONICAL-06-macro.jpg` | • `VYSHUUU-CANONICAL-09-gold-thread-macro.jpg` | High-frequency plain-weave surface displacement, yarn crowns, natural slub variation, tangent-space vectors. |
| **`TEX-09`** | `VYSHUUU-TEX-09-edge-fringe` | • `VYSHUUU-CANONICAL-07-edge.jpg` | • `VYSHUUU-CANONICAL-08-pallu.jpg` | Alpha cutout and fringe silhouette of hand-knotted pallu tassels, loose warp ends, and raw selvedge hem. |

---

## 3. Detailed Canonical Reference Utilization Roster

```
CANONICAL REFERENCE USAGE NETWORK
─────────────────────────────────────────────────────────────────────────────
VYSHUUU-CANONICAL-01-full-length.jpg
  └── Informs: TEX-01 (Base Color Continuum Balance)
  └── Informs: TEX-04 (Pallu Global Scale)

VYSHUUU-CANONICAL-02-flat-reference.jpg
  └── Informs: TEX-01 (Base Color Planar Layout)
  └── Informs: TEX-03 (Border Longitudinal Boundaries)
  └── Informs: TEX-04 (Pallu Longitudinal Zone)

VYSHUUU-CANONICAL-03-fold.jpg
  └── Informs: TEX-06 (Weave Flow along Curved Geometry)
  └── Informs: TEX-07 (Roughness Roll-off along Folds)

VYSHUUU-CANONICAL-05-border.jpg
  └── Informs: TEX-01 (Border Chevron Albedo)
  └── Informs: TEX-02 (Border Zari Metallic Mask)
  └── Informs: TEX-03 (Border Envelope Dimensions)
  └── Informs: TEX-05 (Red Selvedge Accent Stripe)
  └── Informs: TEX-07 (Border Specular Transition)

VYSHUUU-CANONICAL-06-macro.jpg
  └── Informs: TEX-02 (Weave Interlace Metallic Transition)
  └── Informs: TEX-06 (Warp/Weft Orthogonal Flow Vectors)
  └── Informs: TEX-07 (Silk Surface Roughness Baseline)
  └── Informs: TEX-08 (Micro-Normal Tangent Perturbation)

VYSHUUU-CANONICAL-07-edge.jpg
  └── Informs: TEX-05 (Edge Red-Brown Accent Tone)
  └── Informs: TEX-09 (Tassel Alpha Cutout & Fraying Silhouette)

VYSHUUU-CANONICAL-08-pallu.jpg
  └── Informs: TEX-01 (Pallu Diamond Brocade Albedo)
  └── Informs: TEX-02 (Pallu Dense Zari Mask)
  └── Informs: TEX-04 (Pallu Spatial Mask & Transition)

VYSHUUU-CANONICAL-09-gold-thread-macro.jpg
  └── Informs: TEX-02 (Filament Specular Purity)
  └── Informs: TEX-08 (Metallic Thread Micro-Texture)

VYSHUUU-CANONICAL-10-golden-filament.png
  └── Informs: WebGL Spline Curve Pathing & Bloom Profile (Companion Geometry)
─────────────────────────────────────────────────────────────────────────────
```

---

## 4. Authoring Verification Checklist

During production map authoring, each map must be cross-checked against its declared sources:

1. **Alignment Verification:** Does `TEX-02` (Zari Mask), `TEX-03` (Border Mask), and `TEX-05` (Red Accent) align with sub-pixel precision to `TEX-01` (Base Color)?
2. **Frequency Verification:** Does `TEX-08` (Micro-Normal) replicate the yarn slub frequency observed in `CANONICAL-06` without visible tiling seams?
3. **Contrast Verification:** Does `TEX-07` (Roughness) preserve the matte chiaroscuro atmosphere documented in `CANONICAL-03` without creating overly shiny plastic reflections?
4. **Boundary Verification:** Does `TEX-09` (Edge Fringe) provide a clean alpha mask matching the knotting structure in `CANONICAL-07`?
