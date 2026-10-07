import { create } from 'zustand';

export type SceneId = 'threshold' | 'loom' | 'specimen' | 'unfurling' | 'hero' | 'anthology' | 'salon';
export type QualityTier = 'ULTRA' | 'HIGH' | 'MED' | 'LOW' | 'FALLBACK';

export interface ExperienceState {
  activeScene: SceneId;
  qualityTier: QualityTier;
  isAudioMuted: boolean;
  isReducedMotion: boolean;
  webglSupported: boolean;
  isIntroSettled: boolean;

  // Actions
  setActiveScene: (scene: SceneId) => void;
  setQualityTier: (tier: QualityTier) => void;
  setAudioMuted: (muted: boolean) => void;
  toggleAudio: () => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebGLSupported: (supported: boolean) => void;
  setIntroSettled: (settled: boolean) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeScene: 'threshold',
  qualityTier: 'HIGH',
  isAudioMuted: true,
  isReducedMotion: false,
  webglSupported: true,
  isIntroSettled: false,

  setActiveScene: (scene) => set({ activeScene: scene }),
  setQualityTier: (tier) => set({ qualityTier: tier }),
  setAudioMuted: (muted) => set({ isAudioMuted: muted }),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
  setWebGLSupported: (supported) => set({ webglSupported: supported }),
  setIntroSettled: (settled) => set({ isIntroSettled: settled }),
}));
