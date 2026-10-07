/**
 * Centralized mutable scroll state bridge.
 * Decouples GSAP ScrollTrigger events from React state.
 * Allows Three.js render loops (useFrame) to poll normalized progress
 * and instantaneous scroll velocity with zero component re-renders.
 */

export interface ScrollBridgeState {
  globalProgress: number;
  loomProgress: number;
  thresholdProgress: number;
  specimenProgress: number;
  unfurlingProgress: number;
  scrollVelocity: number;
}

export const scrollBridge: ScrollBridgeState = {
  globalProgress: 0,
  loomProgress: 0,
  thresholdProgress: 0,
  specimenProgress: 0,
  unfurlingProgress: 0,
  scrollVelocity: 0,
};

export function setLoomProgress(progress: number): void {
  scrollBridge.loomProgress = Math.max(0, Math.min(1, progress));
  scrollBridge.unfurlingProgress = scrollBridge.loomProgress;
}

export function setUnfurlingProgress(progress: number, velocity: number = 0): void {
  scrollBridge.unfurlingProgress = Math.max(0, Math.min(1, progress));
  scrollBridge.loomProgress = scrollBridge.unfurlingProgress;
  scrollBridge.scrollVelocity = velocity;
}

export function setSpecimenProgress(progress: number): void {
  scrollBridge.specimenProgress = Math.max(0, Math.min(1, progress));
}

export function setGlobalProgress(progress: number): void {
  scrollBridge.globalProgress = Math.max(0, Math.min(1, progress));
}

export function setThresholdProgress(progress: number): void {
  scrollBridge.thresholdProgress = Math.max(0, Math.min(1, progress));
}
