# Curatorial Taxonomy & Asset Architecture

## 1. The 10 Canonical Saree Archetypes

VYSHUUU catalogs ten distinct digital textile masterworks honoring classical Indian handloom lineages:

| Work # | Code | Textile Title | Lineage & Weave Technique | Chromatic Field | Metallic Vocabulary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `VYSH-ARC-01` | *The Continuum Archetype* | Pure Mulberry Silk (Raw Katan) | Deep Obsidian | Heavy Antique Zari Border & Pallu |
| **02** | `VYSH-KJV-01` | *Obsidian Korvai* | Kanchipuram Interlocked Weft | Pitch Black / Charcoal | 24K Electroplated Gold Selvedge |
| **03** | `VYSH-BNR-01` | *Shikar Gah in Shadow* | Banarasi Kadwa Brocade | Midnight Anthracite | Fine Muted Zari Animalier Motifs |
| **04** | `VYSH-CHD-01` | *Gossamer Kora* | Chanderi Diaphanous Silk-Cotton | Sunlit Luminous Ecru | Spun Silver Tissue Threads |
| **05** | `VYSH-PTH-01` | *Tapestry Dusk* | Paithani Tapestry Weave | Deep Pluvial Indigo | Enamel-Inlaid Asavali Flowers |
| **06** | `VYSH-JMD-01` | *Vapor Inlay* | Jamdani Supplemental Weft | Pale Mist Bone | Floating Transverse Filaments |
| **07** | `VYSH-KTA-01` | *Obsidian Khat Grid* | Kota Doria Square Lattice | Sheer Onyx | Micro Zari Check Borders |
| **08** | `VYSH-TSR-01` | *Raw Honeycomb Slub* | Wild Tussar Organic Filament | Raw Ochre Slub | Unrefined Brass Sheen |
| **09** | `VYSH-CTR-01` | *Liquid Metal Continuum* | Real Tissue Metallic Warp | Molten Bronze | Pure Zari Field & Pallu |
| **10** | `VYSH-KJV-02` | *Madder Petni* | Temple Border Korvai | Sindoor Madder Crimson | Solid Gold Temple Spikes |

---

## 2. Asset Pipeline & Cloudinary CDN Resolution

The project maintains strict separation between source archives and production delivery:

```mermaid
flowchart LR
    SourceVault["VYSHUUU-SOURCE-VAULT/\n(Local Disk, Git-Ignored, 276MB)\nWorking PSDs, RAW TIFFs, 3D OBJs"] --> CloudinaryScript["scripts/upload-production-assets-to-cloudinary.mjs"]
    CloudinaryScript --> CloudinaryCDN["Cloudinary CDN (Remote Storage)\n95 Locked Production Assets"]
    CloudinaryCDN --> Manifest["src/lib/assets/cloudinary-manifest.json"]
    Manifest --> RuntimeResolvers["API Routes (/api/collection/*, /api/textures/*)\n307 Temporary Redirects"]
    RuntimeResolvers --> Browser["Visitor Browser & WebGL Canvas"]
```

### Manifest Asset Counts:
* **WebGL Textures**: 9 locked maps ($1997 \times 787$, 8-bit PNG/JPG).
* **Atelier Plates**: 5 approved chiaroscuro craftsmanship studies.
* **Collection Plates**: 81 multi-angle archival photographs (flat, fold, pleat, macro, border, pallu, editorial).

---

## 3. Environment & D-Drive Credentials Setup

To authenticate with Cloudinary during development and production builds, create `.env.local` based on your credentials:

```env
# Cloudinary CDN Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xjdxk6mg
CLOUDINARY_API_KEY=735665578547377
CLOUDINARY_API_SECRET=U6GpH2yP3qmfaJCK2fmV-qLpBZ0
CLOUDINARY_URL=cloudinary://735665578547377:U6GpH2yP3qmfaJCK2fmV-qLpBZ0@xjdxk6mg
```

### Git Credentials Configuration (D-Drive SSH)
Local development commits are automatically signed with the author's D-drive SSH keys configured in `~/.gitconfig-d`:
* **User**: `KatkamKoushik <koushikkatkam@gmail.com>`
* **Signing Key**: `D:/.ssh/id_ed25519.pub`
* **SSH Config**: `ssh -F D:/.ssh/config`
* **GPG Format**: `ssh`
