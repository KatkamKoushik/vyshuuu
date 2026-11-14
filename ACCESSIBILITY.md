# Accessibility Statement for VYSHUUU

**VYSHUUU** is committed to providing an exceptional digital couture experience that is inclusive, perceivable, operable, and robust for all visitors, including those using assistive technologies.

---

## 1. Conformance Standards

This project targets and rigorously audits against the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AAA** criteria.

### Key Implementations
* **Headless Accessibility Mirror (`.GLA11y`)**: WebGL 3D scenes, waypoints, and interactive spatial chambers are mirrored by an accessible DOM layer (`z-index: -1`) providing landmarks, skip links, and semantic anchors.
* **Kinetic Typography Parity**: All split-word typographic animations (`KineticHeadline`, `XText`) provide clean, un-split accessible text via `.sr-only` elements while masking visual tokens with `aria-hidden="true"`.
* **Reduced Motion Compliance**: The experience strictly honors `prefers-reduced-motion: reduce`. When active:
  * 3D camera spline jumps directly to waypoints without camera travel.
  * Cloth vertex wave calculations and fluid ripples are stabilized into settled draping.
  * Autoplay animations and kinetic word transitions settle instantly.
* **Procedural Audio Autonomy**: Web Audio API soundscapes are muted by default and require explicit user activation via accessible keyboard/switch controls (`SoundWaveToggle.tsx` and the `.GLA11y` toggle button).
* **Keyboard Navigation & Focus Management**:
  * All interactive elements (`TactileGlowButton`, `LivingHeirloomSeal`, `MicroscopicWeaveLoupe`) support `Tab`, `Enter`, and `Space` activation with clear focus indicator rings.
  * Modals (`SareeMonographModal`) implement focus trapping and restore focus upon dismissal.

---

## 2. Reporting Accessibility Barriers

If you encounter any difficulty navigating or accessing content on **VYSHUUU**, please let us know so we can improve:

* **Email**: `koushikkatkam@gmail.com`
* **Subject**: Accessibility Barrier Report — VYSHUUU

Please describe the specific issue, the assistive technology you were using, and the operating environment. We welcome your feedback.
