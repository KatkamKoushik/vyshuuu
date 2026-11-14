# Contributing to VYSHUUU

Thank you for your interest in contributing to **VYSHUUU // The Unstitched Continuum**, an avant-garde digital haute couture and computational textile archive.

---

## 1. Development Setup

### Prerequisites
* **Node.js**: v20 or higher (v24 recommended)
* **Package Manager**: `pnpm` (v9+)

### Installation
```bash
git clone https://github.com/KatkamKoushik/vyshuuu.git
cd vyshuuu
pnpm install
```

### Running Locally
```bash
pnpm dev
```
Navigate to `http://localhost:3000` to view the continuous 3D textile continuum.

---

## 2. Engineering Standards

* **Creative WebGL Architecture**: The site uses a decoupled full-screen Three.js canvas (`GlobalCanvas.tsx`) synchronized with the DOM via `scrollBridge.ts` and `experienceStore.ts`.
* **Zero Reflows**: All interactive cursors, raking specular highlights, and touch impulses must use CSS custom properties or direct DOM/GLSL uniforms without forcing React re-renders.
* **Audio Synthesis**: Sound design relies exclusively on procedural Web Audio API synthesis (`webAudioEngine.ts`). Do not import external audio files.
* **Accessibility Parity**: Visual WebGL and 3D kinetic typography must have headless DOM mirrors (`.GLA11y`, `sr-only`) compliant with WCAG 2.1 AAA.

---

## 3. Pull Request Guidelines

1. **Branching**: Create feature branches from `main` using descriptive names:
   * `feat/your-feature-name`
   * `fix/issue-description`
2. **Quality Checks**: Before submitting, verify:
   ```bash
   pnpm exec tsc --noEmit
   pnpm build
   ```
3. **Commit Messages**: Follow conventional commits (`feat: ...`, `fix: ...`, `refactor: ...`).
4. **Draft PRs**: Open a draft PR if your work is in progress and you would like architectural feedback.

Thank you for preserving handloom artistry through computational craft.
