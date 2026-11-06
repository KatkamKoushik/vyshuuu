import { create } from 'zustand';

export type SceneId = 'threshold' | 'loom' | 'specimen' | 'unfurling' | 'hero' | 'anthology' | 'salon';
export type QualityTier = 'ULTRA' | 'HIGH' | 'MED' | 'LOW' | 'FALLBACK';

export interface ExperienceState {
  activeScene: SceneId;
  qualityTier: QualityTier;
  isAudioMuted: boolean;
  isReducedMotion: boolean;
  webglSupported: boolean;
  isContextLost: boolean;
  hasTextureError: boolean;
  isAnimationPaused: boolean;
  isIntroSettled: boolean;
  activeAtmosphereId: string;
  selectedAtmosphereId: string | null;

  // Essential resource readiness for Custom Intro Loader
  texturesLoadedCount: number; // 0 to 9
  isTexturesLoaded: boolean;
  hasCompletedIntro: boolean;

  // Actions
  setActiveScene: (scene: SceneId) => void;
  setQualityTier: (tier: QualityTier) => void;
  setAudioMuted: (muted: boolean) => void;
  toggleAudio: () => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebGLSupported: (supported: boolean) => void;
  setContextLost: (lost: boolean) => void;
  setHasTextureError: (hasError: boolean) => void;
  setAnimationPaused: (paused: boolean) => void;
  toggleAnimationPaused: () => void;
  setIntroSettled: (settled: boolean) => void;
  setTexturesLoadedCount: (count: number) => void;
  setTexturesLoaded: (loaded: boolean) => void;
  setCompletedIntro: (completed: boolean) => void;
  setActiveAtmosphereId: (id: string) => void;
  setSelectedAtmosphereId: (id: string | null) => void;
  resetAtmosphere: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeScene: 'threshold',
  qualityTier: 'HIGH',
  isAudioMuted: true,
  isReducedMotion: false,
  webglSupported: true,
  isContextLost: false,
  hasTextureError: false,
  isAnimationPaused: false,
  isIntroSettled: false,
  activeAtmosphereId: 'vysh-arc-01',
  selectedAtmosphereId: null,
  texturesLoadedCount: 0,
  isTexturesLoaded: false,
  hasCompletedIntro: false,

  setActiveScene: (scene) => set({ activeScene: scene }),
  setQualityTier: (tier) => set({ qualityTier: tier }),
  setAudioMuted: (muted) => set({ isAudioMuted: muted }),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
  setWebGLSupported: (supported) => set({ webglSupported: supported }),
  setContextLost: (lost) => set({ isContextLost: lost }),
  setHasTextureError: (hasError) => set({ hasTextureError: hasError }),
  setAnimationPaused: (paused) => set({ isAnimationPaused: paused }),
  toggleAnimationPaused: () => set((state) => ({ isAnimationPaused: !state.isAnimationPaused })),
  setIntroSettled: (settled) => set({ isIntroSettled: settled }),
  setTexturesLoadedCount: (count) => set({ texturesLoadedCount: count }),
  setTexturesLoaded: (loaded) => set({ isTexturesLoaded: loaded }),
  setCompletedIntro: (completed) => set({ hasCompletedIntro: completed }),
  setActiveAtmosphereId: (id) => set({ activeAtmosphereId: id }),
  setSelectedAtmosphereId: (id) =>
    set({
      selectedAtmosphereId: id,
      activeAtmosphereId: id ?? 'vysh-arc-01',
    }),
  resetAtmosphere: () => set({ selectedAtmosphereId: null }),
}));
