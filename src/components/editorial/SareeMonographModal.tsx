'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SareeConcept, SareeAssetMeta } from '@/lib/collection/collectionData';
import { EditorialPlate } from './EditorialPlate';
import { MicroscopicWeaveLoupe } from './MicroscopicWeaveLoupe';
import { getAtmosphere } from '@/lib/atmosphere/collectionAtmospheres';
import { getLenis } from '@/lib/lenis';
import { getOptimizedCloudinaryUrl } from '@/lib/assets/cloudinaryAssets';
import { audioEngine } from '@/lib/audio/webAudioEngine';
import { TactileGlowButton } from '@/components/ui/TactileGlowButton';

export interface SareeMonographModalProps {
  saree: SareeConcept | null;
  onClose: () => void;
}

interface SareeTechnicalSpec {
  warpYarn: string;
  weftYarn: string;
  endsPerInch: string;
  picksPerInch: string;
  weaveStructure: string;
  loomMechanism: string;
  selvedgeArchitecture: string;
  tensionRatio: string;
  dyeChromatography: string;
  geographicOrigin: string;
  coordinates: string;
  elevation: string;
  conservationProtocol: string;
}

// Authoritative Handloom Technical Specifications Registry
const TECHNICAL_SPECIFICATIONS: Record<string, SareeTechnicalSpec> = {
  'vysh-arc-01': {
    warpYarn: '20/22 Denier Mulberry Filature Silk · 2-Ply Organzine (Z-Twist 14 TPI)',
    weftYarn: '28/30 Denier Tram Silk + 0.032mm Flattened Pure Silver-Gilt Zari Wire (24kt)',
    endsPerInch: '112 ends / inch (100s Brass Reed)',
    picksPerInch: '136 picks / inch (Dense Interlocked Brocade)',
    weaveStructure: '3/1 Warp-Faced Planar Twill with Auspicious Madder Interstices',
    loomMechanism: 'Traditional Pit Loom with Double Adai Harness & 3-Shuttle Interlock',
    selvedgeArchitecture: '3-Cord Tempered Zari Wire Selvedge (Zero-Fray Tension Border)',
    tensionRatio: '1.18 : 1.00 (Balanced Warp/Weft Elongation Equilibrium)',
    dyeChromatography: 'Rubia cordifolia (Madder Root) & Terminalia chebula (Myrobalan)',
    geographicOrigin: 'Sovereign Loom Sanctuary · Tamil Nadu Handloom Belt',
    coordinates: '12.8342° N, 79.7036° E',
    elevation: '83m above MSL',
    conservationProtocol: 'Acid-Free Unbleached Muslin Casing · 18°C ± 2° · 50% RH · Max 50 Lux',
  },
  'vysh-arc-02': {
    warpYarn: 'Double-Warp 2-Ply Kanchipuram Raw Mulberry Silk · High-Twist 16 TPI',
    weftYarn: '3-Ply Mulberry Silk + Genuine Electroplated Gold-Coated Silver Filament',
    endsPerInch: '120 ends / inch (110s Precision Reed)',
    picksPerInch: '144 picks / inch (Triple-Shuttle Korvai Serrated Joint)',
    weaveStructure: 'Interlocking Korvai Tapestry Ground with Petni Warp Extension',
    loomMechanism: 'Heavy-Frame Pit Loom with Dual Independent Shuttle Boxes',
    selvedgeArchitecture: 'Reinforced 4-Cord Gold Wire Selvedge with Serrated Spire Notches',
    tensionRatio: '1.24 : 1.00 (Heavy Viscous Tension Profile)',
    dyeChromatography: 'Natural Rubia tinctorum & Punica granatum (Pomegranate Rind)',
    geographicOrigin: 'Kanchipuram Silk Weavers Co-operative Sanctuary',
    coordinates: '12.8342° N, 79.7036° E',
    elevation: '83m above MSL',
    conservationProtocol: 'Horizontal Plinth Mount · Flat Storage with Acid-Free Separators',
  },
  'vysh-arc-03': {
    warpYarn: 'Fine Filature Mulberry Silk 18/20D · Untwisted Raw Filament Sheen',
    weftYarn: 'Pure Silver Flattened Muga Core Filament + Genuine 24kt Gold Wire',
    endsPerInch: '104 ends / inch (90s Bamboo Reed)',
    picksPerInch: '160 picks / inch (Oblique-Weft Tapestry Interlock)',
    weaveStructure: 'Asawali Oblique Interlocking Tapestry Weave with Dhoop-Chhaon Effect',
    loomMechanism: 'Traditional Paithani Hand-Tapestry Throw Loom with Interlocking Spools',
    selvedgeArchitecture: 'Solid Zari Ribbon Selvedge (Reversible Face Architecture)',
    tensionRatio: '1.15 : 1.00 (Fluid Pliable Tapestry Hand)',
    dyeChromatography: 'Vegetable Extracts & Pure Silver Tarnish Inhibitor Bath',
    geographicOrigin: 'Godavari Valley Weaving Sanctum · Paithan, Maharashtra',
    coordinates: '19.4795° N, 75.3814° E',
    elevation: '458m above MSL',
    conservationProtocol: 'Micro-Chamber Storage · Anti-Oxidant Silver Scavenger Enclosure',
  },
  'vysh-arc-04': {
    warpYarn: 'Varanasi Organzine Katan Silk 20/22D · Pure Degummed Filaments',
    weftYarn: 'Blackened Oxidized Silver Wire + High-Chroma Alizarin Accent Weft',
    endsPerInch: '116 ends / inch (100s Steel Reed)',
    picksPerInch: '152 picks / inch (Kadwa Floating Weft Needlework)',
    weaveStructure: 'Supplementary Weft Kadwa Brocading (Zero Loose Floats on Reverse)',
    loomMechanism: 'Draw-Loom Derived Varanasi Jacquard Loom with 240-Needle Capacity',
    selvedgeArchitecture: 'Tight Fine-Ground Charcoal Selvedge with Embedded Zari Accent',
    tensionRatio: '1.20 : 1.00 (Architectural Memory Drape)',
    dyeChromatography: 'Madder Root & Acacia catechu with Natural Iron Acetate Ferment',
    geographicOrigin: 'Ganges River Weavers Mohalla · Varanasi, Uttar Pradesh',
    coordinates: '25.3176° N, 82.9739° E',
    elevation: '81m above MSL',
    conservationProtocol: 'Museum Archival Folio · Low Oxygen Inert Nitrogen Vault',
  },
  'vysh-arc-05': {
    warpYarn: '20/22D Degummed Diaphanous Silk (Weightless Translucent Warp)',
    weftYarn: '300s Superfine Handspun Cotton + Microscopic Gold Zari Inlays',
    endsPerInch: '84 ends / inch (Open Breathable Khat Grid)',
    picksPerInch: '88 picks / inch (Air-Permeable Open Mesh)',
    weaveStructure: 'Plain Gossamer Open Weave with Geometric Khat Grid Dividers',
    loomMechanism: 'Chanderi Pit Loom with Lightweight Bamboo Reed & Polished Shuttles',
    selvedgeArchitecture: 'Gossamer Featherlight 2-Thread Self-Bound Margin',
    tensionRatio: '1.05 : 1.00 (Minimal Tension Gravitas / Floating Hand)',
    dyeChromatography: 'Unbleached Kora Natural Silk with Organic Rice Starch Finish',
    geographicOrigin: 'Betwa Basin Handloom Registry · Chanderi, Madhya Pradesh',
    coordinates: '24.7129° N, 78.1065° E',
    elevation: '456m above MSL',
    conservationProtocol: 'Constant Relative Humidity 52% · Zero Folding Crease Pressure',
  },
  'vysh-arc-06': {
    warpYarn: 'Ultra-Fine 100s Filature Silk Warp · High-Cohesion Continuous Ends',
    weftYarn: 'Discontinuous Supplementary Gold Zari Thread (Hand-Inserted Bamboo Spools)',
    endsPerInch: '96 ends / inch (Fine Spaced Density)',
    picksPerInch: '108 picks / inch (Vapor Inlay Tapestry Floating)',
    weaveStructure: 'Figure-Weft Jamdani Inlay into Translucent Diaphanous Ground',
    loomMechanism: 'East Coast Pit Loom with Traditional Non-Mechanical Hand Bamboo Pickers',
    selvedgeArchitecture: 'Delicate Feathered Interlocking Selvedge Edge',
    tensionRatio: '1.10 : 1.00 (Soft Air-Floating Drape)',
    dyeChromatography: 'Botanical Mordant Dyes · Pure Unbleached Ecru Ground',
    geographicOrigin: 'Uppada Coastal Weavers Colony · Andhra Pradesh',
    coordinates: '17.0863° N, 82.3273° E',
    elevation: '5m above MSL',
    conservationProtocol: 'Rolled Archival Core Tube · Acid-Free Buffered Paper Interleaving',
  },
  'vysh-arc-07': {
    warpYarn: 'Lightweight Kora Mulberry Silk 18/20D · Open Metric Spacing',
    weftYarn: 'Fine Gold Zari Wire Ribbon (0.028mm thickness) + Pure Cotton Thread',
    endsPerInch: '90 ends / inch (Orthogonal Grid Geometry)',
    picksPerInch: '94 picks / inch (Balanced Metric Lattice)',
    weaveStructure: 'Geometric Open Zari Grid with Architectural Tension Blocks',
    loomMechanism: 'Traditional Fly-Shuttle Frame Loom with Precision Metric Harness',
    selvedgeArchitecture: 'Precision Linear Zari Selvedge (High Tensile Stability)',
    tensionRatio: '1.12 : 1.00 (Pliant Crisp Hand)',
    dyeChromatography: 'Natural Plant Resins & Unbleached Raw Cocoon Silk',
    geographicOrigin: 'Swarnamukhi River Basin Guild · Venkatagiri, Andhra Pradesh',
    coordinates: '13.9667° N, 79.5833° E',
    elevation: '60m above MSL',
    conservationProtocol: 'Darkroom Environmental Cabinet · Zero Direct Solar Radiation',
  },
  'vysh-arc-08': {
    warpYarn: 'Wild Antheraea mylitta (Tussar) Reeled Silk · Natural Slub Texture',
    weftYarn: 'Heavy Slub Forest Tussar Yarn + Dense Antique Gold Cord Accents',
    endsPerInch: '76 ends / inch (Textured Honeycomb Ridge Reed)',
    picksPerInch: '82 picks / inch (Granular Earth Tactile Ground)',
    weaveStructure: 'Granular Honeycomb Cellular Weave with High Friction Cohesion',
    loomMechanism: 'Village Heavy Timber Throw Loom with Natural Tension Weight Stones',
    selvedgeArchitecture: 'Rustic Braided Wild Silk Tension Selvedge',
    tensionRatio: '1.22 : 1.00 (Heavy Viscous Natural Slub Resistance)',
    dyeChromatography: 'Undyed Natural Golden Tussar Cocoon Tannins (Zero Bleach)',
    geographicOrigin: 'Vidarbha Wild Silk Forest Sanctuaries · Maharashtra',
    coordinates: '21.1458° N, 79.0882° E',
    elevation: '310m above MSL',
    conservationProtocol: 'Breathable Cotton Wrapping · Natural Cedar Repellent Enclosure',
  },
  'vysh-arc-09': {
    warpYarn: 'Single-Ply Pure Mulberry Silk · Deep Madder Root Impregnated Ends',
    weftYarn: 'Heavy Kora Silk + Auspicious Madder Accent + Gold Zari Border Ribbon',
    endsPerInch: '106 ends / inch (Dense Temple Spire Reed)',
    picksPerInch: '128 picks / inch (Petni Interlocked Warp Replacement Joint)',
    weaveStructure: 'Petni Interlocked Warp Technique with Sacred Madder Temple Spires',
    loomMechanism: 'Traditional Petni 3-Weaver Loom with Warp-Splicing Tension Bed',
    selvedgeArchitecture: 'Heavy Red Madder Selvedge with Zari Core Guard Cord',
    tensionRatio: '1.20 : 1.00 (Dense Ground with Substantial Fluid Hand)',
    dyeChromatography: 'Rubia tinctorum (Botanical Madder) & Alum Ferment Baths',
    geographicOrigin: 'Krishna-Godavari Temple Guild Sanctuary · Telangana Belt',
    coordinates: '16.5062° N, 80.6480° E',
    elevation: '42m above MSL',
    conservationProtocol: 'Sealed Archival Plinth Drawer · Temperature Controlled Vault 04',
  },
  'vysh-arc-10': {
    warpYarn: 'Degummed Fine Organzine Silk 20/22D (Lightweight Crisp Warp)',
    weftYarn: 'Fine Mercerized Cotton + Bugdi & Rui Phool Zari Supplementary Weft',
    endsPerInch: '94 ends / inch (Balanced Reversible Density)',
    picksPerInch: '102 picks / inch (Identical Face/Reverse Interlace)',
    weaveStructure: 'Reversible Double-Border Architecture (Wearable on Both Faces)',
    loomMechanism: 'Maheshwar Pit Loom with Reversible Reed Harness & Dobby Lift',
    selvedgeArchitecture: 'True Reversible Double-Edge Zari Ribbon Selvedge',
    tensionRatio: '1.08 : 1.00 (Airy Pliant Summer Hand)',
    dyeChromatography: 'Pomegranate Rind (Punica granatum) & Iron Water Mordant',
    geographicOrigin: 'Narmada Riverfront Fort Looms · Maheshwar, Madhya Pradesh',
    coordinates: '22.1811° N, 75.5838° E',
    elevation: '155m above MSL',
    conservationProtocol: 'Dual-Sided Specimen Mount · Reversible Archival Presentation',
  },
};

export const SareeMonographModal: React.FC<SareeMonographModalProps> = ({ saree, onClose }) => {
  const [activeAssetKey, setActiveAssetKey] = useState<string>('hero');
  const [activeTab, setActiveTab] = useState<'plate' | 'specifications' | 'conservation'>('plate');
  const [isLoupeOpen, setIsLoupeOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const previousActiveElement = useRef<HTMLElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset active movement to hero whenever a new saree is opened
  useEffect(() => {
    if (saree) {
      setActiveAssetKey('hero');
      setActiveTab('plate');
    }
  }, [saree]);

  // Handle ESC key to dismiss (only when child loupe is not open)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLoupeOpen) return;
        onClose();
      }
    },
    [onClose, isLoupeOpen]
  );

  useEffect(() => {
    if (saree) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      const lenis = getLenis();
      if (lenis) {
        lenis.stop();
      }

      // Automatically focus close button or dialog for screen-reader and keyboard context
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      const lenis = getLenis();
      if (lenis) {
        lenis.start();
      }
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [saree, handleKeyDown]);

  const atmosphere = useMemo(() => {
    return saree ? getAtmosphere(saree.id) : null;
  }, [saree]);

  const techSpec = useMemo<SareeTechnicalSpec>(() => {
    if (!saree) return TECHNICAL_SPECIFICATIONS['vysh-arc-01'];
    return TECHNICAL_SPECIFICATIONS[saree.id] || TECHNICAL_SPECIFICATIONS['vysh-arc-01'];
  }, [saree]);

  if (!saree || !isMounted || !atmosphere) return null;

  const assetEntries: [string, SareeAssetMeta][] = Object.entries(saree.assets).filter(
    ([, meta]) => Boolean(meta)
  ) as [string, SareeAssetMeta][];

  const currentAsset: SareeAssetMeta =
    (saree.assets as Record<string, SareeAssetMeta>)[activeAssetKey] || saree.assets.hero;

  const currentIdx = assetEntries.findIndex(([k]) => k === activeAssetKey);

  const switchTab = (tab: 'plate' | 'specifications' | 'conservation') => {
    audioEngine.triggerFocusClick('zoom', 1.15, 0.2);
    setActiveTab(tab);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="monograph-title"
      data-lenis-prevent="true"
      className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden backdrop-blur-2xl p-3 sm:p-6 md:p-8 lg:p-10 transition-colors duration-700"
      style={{
        backgroundColor: `${atmosphere.palette.background}f5`,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Archival Folio Object: Intimate examination chamber sheet surrounded by vast atmospheric negative space */}
      <div
        ref={modalContainerRef}
        data-lenis-prevent="true"
        className="relative w-full max-w-4xl lg:max-w-[66rem] my-auto max-h-[92vh] overflow-y-auto bg-[#faf7f0] text-[#1b1916] border border-[#ded5c6] shadow-[0_35px_100px_-25px_rgba(0,0,0,0.92)] p-5 sm:p-8 md:p-10 [scrollbar-width:thin] [scrollbar-color:#c5a869_#ede7dc] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#ede7dc] [&::-webkit-scrollbar-thumb]:bg-[#c5a869]/70 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#c5a869]"
      >
        {/* ==================================================================
            1. TOP DOSSIER BAR: ACCESSION NUMBER & ARCHIVAL STAMPING
            ================================================================== */}
        <div className="flex items-start justify-between gap-3 border-b border-[#ded5c6]/80 pb-3.5 mb-4.5">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mono-spec text-[8.5px] text-[#8a7f6e] tracking-[0.22em] uppercase">
              <span>TEXTILE ARCHIVAL FOLIO</span>
              <span>&middot;</span>
              <span
                className="font-medium"
                style={{ color: atmosphere.palette.accent }}
              >
                {saree.workNumber || `WORK ${String(saree.number).padStart(2, '0')}`}
              </span>
              <span>&middot;</span>
              <span>{saree.code}</span>
              <span>&middot;</span>
              <span className="text-[#3c362d] font-medium">
                ACCESSION DOCKET #{String(saree.number).padStart(2, '0')}-2026
              </span>
            </div>

            <h2 id="monograph-title" className="display-md text-[#1b1916] font-normal tracking-[0.02em]">
              {saree.name}
            </h2>

            <p className="caption-tracked text-[9.5px] text-[#706657] tracking-[0.16em] line-clamp-1">
              {saree.lineage} &mdash; {saree.tagline} &middot; <span className="italic">{atmosphere.editorial.tagline}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-1">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close Examination Chamber"
              className="mono-spec text-[9.5px] text-[#8a7f6e] hover:text-[#1b1916] tracking-[0.22em] uppercase transition-colors py-2 px-2.5 border border-[#ded5c6] rounded-[1px] hover:border-[#8c7443]/60 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a869]"
            >
              [ CLOSE &times; ]
            </button>
          </div>
        </div>

        {/* ==================================================================
            2. HIGH-DENSITY DOSSIER NAVIGATION: 3 ARCHIVAL MODES
            [ 01 · SPECIMEN PLATE ] [ 02 · WARP/WEFT SPECIFICATION ] [ 03 · CONSERVATION DOSSIER ]
            ================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ded5c6]/60 pb-3 mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => switchTab('plate')}
              className={`mono-spec text-[9px] sm:text-[9.5px] tracking-[0.18em] uppercase px-3 py-1.5 border rounded-[1px] transition-colors cursor-pointer ${
                activeTab === 'plate'
                  ? 'border-[#1b1916] bg-[#1b1916] text-[#faf7f0]'
                  : 'border-[#ded5c6] text-[#8a7f6e] hover:text-[#1b1916] hover:border-[#8c7443]/40'
              }`}
            >
              [ 01 &middot; SPECIMEN PLATE &amp; LOUPE ]
            </button>

            <button
              type="button"
              onClick={() => switchTab('specifications')}
              className={`mono-spec text-[9px] sm:text-[9.5px] tracking-[0.18em] uppercase px-3 py-1.5 border rounded-[1px] transition-colors cursor-pointer ${
                activeTab === 'specifications'
                  ? 'border-[#1b1916] bg-[#1b1916] text-[#faf7f0]'
                  : 'border-[#ded5c6] text-[#8a7f6e] hover:text-[#1b1916] hover:border-[#8c7443]/40'
              }`}
            >
              [ 02 &middot; WARP/WEFT THREAD DOCKET ]
            </button>

            <button
              type="button"
              onClick={() => switchTab('conservation')}
              className={`mono-spec text-[9px] sm:text-[9.5px] tracking-[0.18em] uppercase px-3 py-1.5 border rounded-[1px] transition-colors cursor-pointer ${
                activeTab === 'conservation'
                  ? 'border-[#1b1916] bg-[#1b1916] text-[#faf7f0]'
                  : 'border-[#ded5c6] text-[#8a7f6e] hover:text-[#1b1916] hover:border-[#8c7443]/40'
              }`}
            >
              [ 03 &middot; CONSERVATION &amp; LINEAGE ]
            </button>
          </div>

          {/* Precision Lat/Long Coordinate Crosshair Readout */}
          <div className="hidden md:flex items-center gap-2 mono-spec text-[8px] text-[#8a7f6e] tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: atmosphere.palette.accent }} />
            <span>GEO: {techSpec.coordinates}</span>
          </div>
        </div>

        {/* ==================================================================
            TAB CONTENT 1: SPECIMEN PLATE & INTERACTIVE MOVEMENTS (PRIMARY)
            ================================================================== */}
        {activeTab === 'plate' && (
          <>
            {/* Typographic Movement Index with Active Zari Indicator */}
            <nav
              aria-label="Movement Index"
              className="mb-7 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-[#ded5c6]/60 pb-2.5"
            >
              <div className="flex items-center gap-5 sm:gap-6 min-w-max">
                <span
                  className="mono-spec text-[8.5px] tracking-[0.22em] uppercase mr-1"
                  style={{ color: atmosphere.palette.accent }}
                >
                  MOVEMENTS ({assetEntries.length}):
                </span>

                {assetEntries.map(([key, meta], idx) => {
                  const isActive = key === activeAssetKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        audioEngine.triggerFocusClick('zoom', 1.0, 0.18);
                        setActiveAssetKey(key);
                      }}
                      className={`group relative py-1 text-left cursor-pointer transition-colors ${
                        isActive ? 'text-[#1b1916]' : 'text-[#8a7f6e] hover:text-[#1b1916]'
                      }`}
                    >
                      <span className="mono-spec text-[9px] sm:text-[9.5px] tracking-[0.14em]">
                        <span className="opacity-50">{String(idx + 1).padStart(2, '0')}.</span>{' '}
                        <span className={isActive ? 'font-medium' : 'font-normal'}>{meta.label}</span>
                      </span>

                      {/* Thin Active Metallic Indicator Line */}
                      {isActive && (
                        <span
                          className="absolute -bottom-2.5 inset-x-0 h-[1.5px] transition-all"
                          style={{ backgroundColor: atmosphere.palette.accent }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Central Stage: Specimen Plate with Coordinate Crosshairs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-8">
              
              {/* Main Specimen Plate Frame with Precision Laser Crosshairs */}
              <div className="lg:col-span-7 flex flex-col gap-2.5">
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Enlarge ${saree.name} in Microscopic Weave Loupe`}
                  className="relative group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a869] p-1.5 bg-[#f3efe6] border border-[#ded5c6]"
                  onClick={() => setIsLoupeOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsLoupeOpen(true);
                    }
                  }}
                  title="Click or press Enter to inspect in Microscopic Weave Loupe (1×–4×)"
                >
                  {/* Precision Laser Crosshairs at 4 Corners of Specimen Mount */}
                  <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#8c7443] pointer-events-none" />
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#8c7443] pointer-events-none" />
                  <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#8c7443] pointer-events-none" />
                  <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#8c7443] pointer-events-none" />

                  {/* Top Crosshair Sub-Header */}
                  <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-[#ded5c6] mono-spec text-[7px] text-[#8a7f6e] tracking-widest uppercase">
                    <span>SPECIMEN DATUM A &middot; SCALE 1:1</span>
                    <span>RETICLE: 0.05mm GRID</span>
                  </div>

                  <EditorialPlate
                    src={currentAsset.src}
                    alt={`${saree.name} — ${currentAsset.caption}`}
                    aspectRatio={currentAsset.aspectRatio}
                    variant="light"
                    speed="standard"
                    priority={true}
                    caption={currentAsset.caption}
                    metadata={currentAsset.metadata}
                    className="w-full max-h-[58vh]"
                    imageClassName="max-h-[52vh] object-cover"
                  />

                  {/* Quiet Museum Reticle Hover Cue */}
                  <div className="absolute top-7 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mono-spec text-[8px] tracking-[0.2em] uppercase px-2 py-1 bg-black/90 text-[#faf7f0] rounded-[1px] pointer-events-none shadow-md">
                    [ ⌕ OPTICAL GLASS WEAVE LOUPE ]
                  </div>
                </div>

                {/* Direct Loupe Trigger Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setIsLoupeOpen(true)}
                    className="flex items-center gap-2 mono-spec text-[8.5px] text-[#786c59] hover:text-[#1b1916] tracking-[0.22em] uppercase transition-colors py-2 px-1 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: atmosphere.palette.accent }} />
                    <span>LAUNCH SCIENTIFIC LOUPE [ 1&times;&ndash;4&times; OPTICAL GLASS ] &nearr;</span>
                  </button>

                  <span className="mono-spec text-[8px] text-[#8a7f6e] tracking-widest uppercase hidden sm:inline">
                    APOCHROMAT f/1.4 MgF₂
                  </span>
                </div>
              </div>

              {/* Archival Specimen Docket & Observations */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5 lg:border-l lg:border-[#ded5c6]/70 lg:pl-6 lg:py-1">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span
                      className="mono-spec text-[8.5px] tracking-[0.24em] uppercase block font-medium"
                      style={{ color: atmosphere.palette.accent }}
                    >
                      {currentAsset.movementTag}
                    </span>
                    <h3 className="display-sm text-[#1b1916] font-normal">
                      {currentAsset.label}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#ded5c6]/70 space-y-2.5">
                    <p className="body-editorial text-xs text-[#524a3e] leading-relaxed">
                      {currentAsset.notes}
                    </p>
                  </div>

                  {/* Curatorial Art-Directed Attributes (Museum Nomenclature Registry) */}
                  <div className="pt-3 border-t border-[#ded5c6]/70 space-y-2.5 mono-spec text-[9px] text-[#635a4d]">
                    <div className="flex justify-between items-baseline gap-3">
                      <span className="opacity-60 shrink-0 font-medium">WORK REGISTRY</span>
                      <span className="font-semibold text-[#1b1916] text-right">
                        {saree.workNumber || `WORK ${String(saree.number).padStart(2, '0')}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline gap-3">
                      <span className="opacity-60 shrink-0">FIELD</span>
                      <span className="font-medium text-[#1b1916] text-right">
                        {saree.field || saree.weightHand}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline gap-3">
                      <span className="opacity-60 shrink-0">METALLIC VOCABULARY</span>
                      <span
                        className="font-medium text-right"
                        style={{ color: atmosphere.palette.accent }}
                      >
                        {saree.metallicVocabulary || saree.primaryZari}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline gap-3">
                      <span className="opacity-60 shrink-0">STRUCTURAL LOGIC</span>
                      <span className="font-medium text-[#1b1916] text-right">
                        {saree.structuralLogic || saree.textileFamily}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline gap-3">
                      <span className="opacity-60 shrink-0">SIMULATED BEHAVIOR</span>
                      <span className="font-medium text-[#1b1916] text-right">
                        {saree.simulatedBehavior || saree.weightHand}
                      </span>
                    </div>
                  </div>

                  {/* Noomo-Grade Tactile Specimen Inspection Action */}
                  <div className="pt-2">
                    <TactileGlowButton
                      variant="primary"
                      size="sm"
                      soundTone="yaman"
                      onClick={() => setIsLoupeOpen(true)}
                      className="w-full text-[10px]"
                    >
                      INSPECT VIA 4&times; MICROSCOPIC LOUPE &rarr;
                    </TactileGlowButton>
                  </div>
                </div>

                {/* Quiet Previous / Next Stepper */}
                <div className="pt-4 border-t border-[#ded5c6]/70 flex items-center justify-between mono-spec text-[9.5px] text-[#8a7f6e]">
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.triggerFocusClick('zoom', 0.9, 0.16);
                      const prevIdx = (currentIdx - 1 + assetEntries.length) % assetEntries.length;
                      setActiveAssetKey(assetEntries[prevIdx][0]);
                    }}
                    className="hover:text-[#1b1916] tracking-[0.16em] cursor-pointer transition-colors"
                  >
                    &larr; PREVIOUS
                  </button>

                  <span
                    className="text-[9px] font-medium"
                    style={{ color: atmosphere.palette.accent }}
                  >
                    {currentIdx + 1} / {assetEntries.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.triggerFocusClick('zoom', 1.2, 0.16);
                      const nextIdx = (currentIdx + 1) % assetEntries.length;
                      setActiveAssetKey(assetEntries[nextIdx][0]);
                    }}
                    className="hover:text-[#1b1916] tracking-[0.16em] cursor-pointer transition-colors"
                  >
                    NEXT &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Specimen Strip: Direct Selection Grid */}
            <div className="pt-5 border-t border-[#ded5c6]/70">
              <div className="flex items-center justify-between mb-2.5 text-[8.5px] mono-spec text-[#8a7f6e] tracking-[0.2em] uppercase">
                <span>ARCHIVAL SPECIMEN PLATES ({assetEntries.length})</span>
                <span>DIRECT MOVEMENT SELECTION</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-9 gap-2">
                {assetEntries.map(([key, meta]) => {
                  const isSelected = key === activeAssetKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        audioEngine.triggerFocusClick('zoom', 1.0, 0.16);
                        setActiveAssetKey(key);
                      }}
                      className={`group relative aspect-square overflow-hidden border transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-1'
                          : 'border-[#ded5c6] opacity-70 hover:opacity-100 hover:border-[#8c7443]/60'
                      }`}
                      style={
                        isSelected
                          ? {
                              borderColor: atmosphere.palette.accent,
                              boxShadow: `0 0 0 1px ${atmosphere.palette.accent}`,
                            }
                          : undefined
                      }
                      title={meta.label}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getOptimizedCloudinaryUrl(meta.src, { width: 160 })}
                        alt={meta.caption}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-[#1b1916]/85 text-[#faf7f0] text-[7.5px] mono-spec truncate px-1 py-0.5 text-center">
                        {meta.label.slice(0, 10)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ==================================================================
            TAB CONTENT 2: HIGH-DENSITY WARP/WEFT SPECIFICATION MATRIX
            ================================================================== */}
        {activeTab === 'specifications' && (
          <div className="space-y-6 mb-8 py-2">
            <div className="border border-[#ded5c6] bg-[#f8f5ed] p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#ded5c6] pb-3">
                <div className="space-y-0.5">
                  <span className="mono-spec text-[8px] text-[#c5a869] tracking-[0.25em] uppercase font-semibold">
                    PHYSICAL LOOM HARNESS TELEMETRY
                  </span>
                  <h3 className="display-sm text-base text-[#1b1916]">
                    Warp &amp; Weft Structural Micro-Architecture
                  </h3>
                </div>
                <div className="mono-spec text-[8.5px] text-[#8a7f6e] tracking-widest uppercase text-right">
                  STANDARD: ISO 105-B02
                </div>
              </div>

              {/* Comprehensive Specification Matrix Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mono-spec text-[9px]">
                {/* Column 1: Warp & Loom Architecture */}
                <div className="space-y-3.5">
                  <div className="border-b border-[#ded5c6]/60 pb-2">
                    <span className="text-[#8a7f6e] uppercase tracking-wider block text-[8px]">
                      WARP YARN SPECIFICATION
                    </span>
                    <span className="text-[#1b1916] font-medium leading-relaxed block mt-0.5">
                      {techSpec.warpYarn}
                    </span>
                  </div>

                  <div className="border-b border-[#ded5c6]/60 pb-2">
                    <span className="text-[#8a7f6e] uppercase tracking-wider block text-[8px]">
                      WARP DENSITY (ENDS PER INCH)
                    </span>
                    <span className="text-[#1b1916] font-semibold mt-0.5 block">
                      {techSpec.endsPerInch}
                    </span>
                  </div>

                  <div className="border-b border-[#ded5c6]/60 pb-2">
                    <span className="text-[#8a7f6e] uppercase tracking-wider block text-[8px]">
                      LOOM HARDWARE &amp; SHEDDING MECHANISM
                    </span>
                    <span className="text-[#1b1916] font-medium leading-relaxed block mt-0.5">
                      {techSpec.loomMechanism}
                    </span>
                  </div>

                  <div className="border-b border-[#ded5c6]/60 pb-2">
                    <span className="text-[#8a7f6e] uppercase tracking-wider block text-[8px]">
                      ELASTIC TENSION EQUILIBRIUM
                    </span>
                    <span className="text-[#1b1916] font-semibold mt-0.5 block" style={{ color: atmosphere.palette.accent }}>
                      {techSpec.tensionRatio}
                    </span>
                  </div>
                </div>

                {/* Column 2: Weft & Metallization */}
                <div className="space-y-3.5">
                  <div className="border-b border-[#ded5c6]/60 pb-2">
                    <span className="text-[#8a7f6e] uppercase tracking-wider block text-[8px]">
                      WEFT YARN &amp; METALLIC VOCABULARY
                    </span>
                    <span className="text-[#1b1916] font-medium leading-relaxed block mt-0.5">
                      {techSpec.weftYarn}
                    </span>
                  </div>

                  <div className="border-b border-[#ded5c6]/60 pb-2">
                    <span className="text-[#8a7f6e] uppercase tracking-wider block text-[8px]">
                      WEFT DENSITY (PICKS PER INCH)
                    </span>
                    <span className="text-[#1b1916] font-semibold mt-0.5 block">
                      {techSpec.picksPerInch}
                    </span>
                  </div>

                  <div className="border-b border-[#ded5c6]/60 pb-2">
                    <span className="text-[#8a7f6e] uppercase tracking-wider block text-[8px]">
                      SELVEDGE EDGE ARCHITECTURE
                    </span>
                    <span className="text-[#1b1916] font-medium leading-relaxed block mt-0.5">
                      {techSpec.selvedgeArchitecture}
                    </span>
                  </div>

                  <div className="border-b border-[#ded5c6]/60 pb-2">
                    <span className="text-[#8a7f6e] uppercase tracking-wider block text-[8px]">
                      WEAVE STRUCTURE &amp; BINDING PATTERN
                    </span>
                    <span className="text-[#1b1916] font-semibold mt-0.5 block">
                      {techSpec.weaveStructure}
                    </span>
                  </div>
                </div>
              </div>

              {/* Orthogonal Warp/Weft Crosshair Micro-Lattice Diagram */}
              <div className="pt-4 border-t border-[#ded5c6] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Visual 4x4 weave binding lattice */}
                  <div className="w-16 h-16 grid grid-cols-4 gap-0.5 p-1 bg-[#1b1916] border border-[#ded5c6]">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-full h-full ${
                          (Math.floor(i / 4) + (i % 4)) % 2 === 0
                            ? 'bg-[#c5a869]'
                            : 'bg-[#ded5c6]/40'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="space-y-0.5 mono-spec text-[8px] text-[#635a4d]">
                    <span className="font-semibold text-[#1b1916] block">
                      ORTHOGONAL BINDING NOTATION [ 4&times;4 LATTICE ]
                    </span>
                    <span>Warp Face: 3/1 Balanced Elongation Profile</span>
                    <span className="block text-[#8a7f6e]">Interlock Method: Three-Shuttle Direct Feed</span>
                  </div>
                </div>

                <TactileGlowButton
                  variant="secondary"
                  size="sm"
                  soundTone="yaman"
                  onClick={() => setIsLoupeOpen(true)}
                  className="text-[9px] !bg-[#1b1916] !text-[#faf7f0]"
                >
                  INSPECT VIA 4&times; MICROSCOPIC LOUPE &rarr;
                </TactileGlowButton>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB CONTENT 3: CONSERVATION DOSSIER, PROVENANCE & DYE CHEMISTRY
            ================================================================== */}
        {activeTab === 'conservation' && (
          <div className="space-y-6 mb-8 py-2">
            <div className="border border-[#ded5c6] bg-[#f8f5ed] p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#ded5c6] pb-3">
                <div className="space-y-0.5">
                  <span className="mono-spec text-[8px] text-[#c5a869] tracking-[0.25em] uppercase font-semibold">
                    CURATORIAL PROTOCOL &middot; ARCHIVE VAULT 04
                  </span>
                  <h3 className="display-sm text-base text-[#1b1916]">
                    Conservation Grade &amp; Natural Chromatography
                  </h3>
                </div>
                <div className="mono-spec text-[8.5px] text-[#8a7f6e] tracking-widest uppercase text-right">
                  GRADE: UNWORN ARCHIVE
                </div>
              </div>

              {/* Curatorial Inscription Body */}
              <div className="space-y-3 body-editorial text-xs text-[#484034] leading-relaxed">
                <p className="italic font-serif text-sm text-[#1b1916]">
                  &ldquo;{saree.curatorialStatement}&rdquo;
                </p>
                <p>
                  Cataloged as an unstitched topological continuum. The six yards are preserved without tailoring, cutlines, or structural separation. Tension is sustained through internal yarn friction and gold thread selvedge integrity.
                </p>
              </div>

              {/* Conservation Details Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#ded5c6] mono-spec text-[9px]">
                <div className="space-y-2">
                  <div className="border-b border-[#ded5c6]/60 pb-1.5">
                    <span className="text-[#8a7f6e] text-[8px] block uppercase">GEOGRAPHIC ORIGIN &amp; GUILD</span>
                    <span className="text-[#1b1916] font-medium mt-0.5 block">{techSpec.geographicOrigin}</span>
                  </div>
                  <div className="border-b border-[#ded5c6]/60 pb-1.5">
                    <span className="text-[#8a7f6e] text-[8px] block uppercase">COORDINATE CROSSHAIR</span>
                    <span className="text-[#1b1916] font-medium mt-0.5 block">{techSpec.coordinates} &middot; ELEV {techSpec.elevation}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="border-b border-[#ded5c6]/60 pb-1.5">
                    <span className="text-[#8a7f6e] text-[8px] block uppercase">DYE CHROMATOGRAPHY &amp; MORDANT</span>
                    <span className="text-[#1b1916] font-medium mt-0.5 block">{techSpec.dyeChromatography}</span>
                  </div>
                  <div className="border-b border-[#ded5c6]/60 pb-1.5">
                    <span className="text-[#8a7f6e] text-[8px] block uppercase">CONSERVATION STORAGE STANDARD</span>
                    <span className="text-[#1b1916] font-medium mt-0.5 block">{techSpec.conservationProtocol}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curatorial Inscription Footnote */}
        <div className="mt-8 pt-4 border-t border-[#ded5c6]/60 flex flex-col sm:flex-row justify-between items-baseline gap-2 text-[8.5px] mono-spec text-[#8a7f6e]">
          <span className="italic">
            &ldquo;Six yards of unbroken memory &mdash; where ancient geometry meets computational couture.&rdquo;
          </span>
          <span className="whitespace-nowrap uppercase tracking-[0.18em]">
            VYSHUUU ARCHIVAL PROTOCOL &middot; CONTINUUM STUDY
          </span>
        </div>

      </div>

      {/* Microscopic Weave Loupe Overlay (Pillar 2 / Phase 4) */}
      <MicroscopicWeaveLoupe
        isOpen={isLoupeOpen}
        onClose={() => setIsLoupeOpen(false)}
        src={currentAsset.src}
        alt={`${saree.name} — ${currentAsset.caption}`}
        title={`${saree.name} // ${currentAsset.label}`}
        workNumber={saree.workNumber || `WORK ${String(saree.number).padStart(2, '0')}`}
        structuralLogic={saree.structuralLogic}
        metallicAccent={atmosphere.palette.accent}
        movementTag={currentAsset.movementTag}
        isNested={true}
      />
    </div>,
    document.body
  );
};
