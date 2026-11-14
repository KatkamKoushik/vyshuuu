'use client';

import React, { useState } from 'react';
import { SareeConcept } from '@/lib/collection/collectionData';
import { SpatialCollectionExhibition } from './SpatialCollectionExhibition';
import { SareeMonographModal } from './SareeMonographModal';

export const CollectionWall: React.FC = () => {
  const [activeMonographSaree, setActiveMonographSaree] = useState<SareeConcept | null>(null);

  return (
    <>
      {/* 3D Curved Ribbon Stage / Dimensional Floating Gallery */}
      <SpatialCollectionExhibition
        onExamine={(saree) => setActiveMonographSaree(saree)}
      />

      {/* Saree Monograph Modal Overlay (Microscopic Weave Loupe & Examination Folio) */}
      <SareeMonographModal
        saree={activeMonographSaree}
        onClose={() => setActiveMonographSaree(null)}
      />
    </>
  );
};
