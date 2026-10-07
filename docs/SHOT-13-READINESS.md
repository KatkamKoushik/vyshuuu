# SHOT 13 — THE SIX-YARD UNFURLING: READINESS GATE
**Project:** VYSHUUU — The Unstitched Continuum  
**Phase:** Asset Intake & Source-of-Truth Validation  
**Gate Status:** 🔴 **BLOCKED** (Pending Physical Saree Asset Ingest)

---

## 1. Executive Summary

SHOT 13 represents the signature experience of VYSHUUU: **The Six-Yard Unfurling**, wherein the continuous unstitched silk textile drapes and unfurls across spatial dimensions.

In accordance with core project tenets (*"The saree is the subject. Do not let technology invent the subject"*), SHOT 13 **must not** be engineered against speculative or AI-hallucinated cloth references. It requires authentic, optical source material from the physical saree.

Because the repository currently contains **ZERO** authentic photographs or macro scans of the physical saree, **SHOT 13 IS STRICTLY BLOCKED.**

---

## 2. Readiness Checklist

### Required Before Production
- [ ] **canonical saree reference** — `MISSING` (No verified physical subject reference on disk)
- [ ] **full-length saree image** — `MISSING` (Required: `/public/assets/saree/full-length/`)
- [ ] **pallu reference** — `MISSING` (Required: `/public/assets/saree/pallu/`)
- [ ] **border reference** — `MISSING` (Required: `/public/assets/saree/border/`)
- [ ] **textile macro** — `MISSING` (Required: `/public/assets/textile/macro/`)
- [ ] **zari reference** — `MISSING` (Required: `/public/assets/textile/zari/`)
- [x] **confirmed color/material direction** — `COMPLETE` (Locked in `tokens.css` and `loomUniforms.ts`: Charcoal Silk `#161412`, Kora Sheen `#EDE8DC`, Antique Zari `#C5A869`)
- [x] **confirmed VYSHUUU brand treatment** — `COMPLETE` (Wordmark, Monogram, and Canela typography infrastructure locked)
- [x] **mobile reference strategy** — `COMPLETE` (Architected in `ASSET-INTAKE.md` and `qualityTier` dynamic scaling)
- [x] **reduced-motion fallback** — `COMPLETE` (Architected in `usePrefersReducedMotion.ts`, `StaticFallback.tsx`, and static shader poses)

### Optional Assets (Non-Blocking)
- [ ] **atelier imagery** — `MISSING` (Loom and workshop documentation)
- [ ] **campaign photography** — `MISSING` (Editorial fashion silhouette)
- [ ] **portrait** — `MISSING` (Dedicated portrait of Vyshnavi)
- [ ] **archival documents** — `MISSING` (Weaver cluster and certification records)

---

## 3. Explicit Blocking Criteria

SHOT 13 production cannot begin until:
1. The creator supplies real photographic material for the subject saree.
2. Assets are placed in their respective Source Vault folders under `/public/assets/saree/` and `/public/assets/textile/`.
3. Metadata entries in `/src/lib/assets/asset-manifest.ts` are updated from `status: 'MISSING'` to `status: 'REAL'` with verified provenance.
4. Human visual approval of SHOT 12.5A material quietening is formally logged.

---

## 4. Current State Confirmation

**SHOT 13 has NOT been implemented.**
No six-yard geometry, VAT, Vellum simulation, or cloth physics have been added.
The codebase remains in the validated SHOT 12.5A state awaiting real asset intake.
