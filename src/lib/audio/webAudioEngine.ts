/**
 * VYSHUUU Procedural Web Audio Scenography Engine
 * 
 * 100% Native Web Audio API procedural synthesis (0 external audio files downloaded).
 * Conceived as a sacred darkroom acoustic landscape:
 * 1. Deep Warm Nocturnal Atelier Drone (55Hz / 110Hz detuned harmonic beating)
 * 2. Subtle Silk Friction Whispering (filtered noise dynamically modulated by scroll velocity and touch drag)
 * 3. Delicate Metallic Zari Glint Chimes (high-Q resonant bell partials on raking gold glint)
 * 
 * Adheres to browser autoplay policies: starts muted; requires user interaction to unmute.
 */

class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isMuted = true;

  // Master Gain
  private masterGain: GainNode | null = null;

  // Drone Nodes
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneSubOsc: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private droneLfo: OscillatorNode | null = null;

  // Silk Friction Nodes
  private frictionGain: GainNode | null = null;
  private frictionFilter: BiquadFilterNode | null = null;
  private frictionSource: AudioBufferSourceNode | null = null;
  private lastVelocityModTime = 0;
  private smoothedVelocity = 0;

  // Chime Nodes & Throttling
  private lastChimeTime = 0;
  private lastFocusClickTime = 0;
  private lastTensionSoundTime = 0;
  private lastHeirloomTime = 0;
  private lastShuttleTime = 0;

  // Indian Classical Raga Yaman Scale (Tuned to Sacred 432Hz Sa)
  // Sa (432Hz), Re (486Hz), Ga (540Hz), Tivra Ma (614.4Hz), Pa (648Hz), Dha (729Hz), Ni (810Hz), Sa' (864Hz)
  private readonly yamanFrequencies = [432.0, 486.0, 540.0, 614.4, 648.0, 729.0, 810.0, 864.0];
  private yamanNotePointer = 0;

  public init(): boolean {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => { });
      }
      return true;
    }

    if (typeof window === 'undefined') return false;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return false;

      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupDrone();
      this.setupSilkFriction();

      // Pause audio graph when user leaves tab to conserve battery & CPU
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (!this.ctx || this.isMuted) return;
          if (document.visibilityState === 'hidden') {
            if (this.ctx.state === 'running') {
              this.ctx.suspend().catch(() => { });
            }
          } else if (document.visibilityState === 'visible') {
            if (this.ctx.state === 'suspended') {
              this.ctx.resume().catch(() => { });
            }
          }
        });
      }

      this.isInitialized = true;
      return true;
    } catch (e) {
      console.warn('[VYSHUUU Audio] Web Audio initialization deferred:', e);
      return false;
    }
  }

  private setupDrone(): void {
    if (!this.ctx || !this.masterGain) return;

    // Drone Gain
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.24, this.ctx.currentTime);

    // Resonant Low-Pass Filter (Sacred Loom Sanctuary Ambience)
    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(160, this.ctx.currentTime);
    this.droneFilter.Q.setValueAtTime(2.4, this.ctx.currentTime);

    // LFO modulating the filter frequency slowly (breathing effect)
    this.droneLfo = this.ctx.createOscillator();
    this.droneLfo.type = 'sine';
    this.droneLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(45, this.ctx.currentTime); // swings 115Hz -> 205Hz

    this.droneLfo.connect(lfoGain);
    lfoGain.connect(this.droneFilter.frequency);

    // Oscillator 1: Fundamental Sine at 55Hz (A1)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(55.0, this.ctx.currentTime);

    // Oscillator 2: Triangle at 110.25Hz (A2 with subtle detuning for acoustic warmth)
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(110.25, this.ctx.currentTime);

    // Sub Oscillator: Deep Sub at 27.5Hz (A0)
    this.droneSubOsc = this.ctx.createOscillator();
    this.droneSubOsc.type = 'sine';
    this.droneSubOsc.frequency.setValueAtTime(27.5, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.droneSubOsc.connect(subGain);

    // Interconnect
    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    subGain.connect(this.droneFilter);

    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    // Start oscillators
    const now = this.ctx.currentTime;
    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
    this.droneSubOsc.start(now);
    this.droneLfo.start(now);
  }

  private setupSilkFriction(): void {
    if (!this.ctx || !this.masterGain) return;

    // 3-second procedural pink-filtered noise buffer
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise algorithm (Paul Kellet's filter)
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    this.frictionSource = this.ctx.createBufferSource();
    this.frictionSource.buffer = noiseBuffer;
    this.frictionSource.loop = true;

    // Dual-stage filter: Band-Pass to mimic silk thread friction
    this.frictionFilter = this.ctx.createBiquadFilter();
    this.frictionFilter.type = 'bandpass';
    this.frictionFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    this.frictionFilter.Q.setValueAtTime(2.1, this.ctx.currentTime);

    // Highpass to eliminate low rumble
    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(1200, this.ctx.currentTime);

    this.frictionGain = this.ctx.createGain();
    this.frictionGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    this.frictionSource.connect(this.frictionFilter);
    this.frictionFilter.connect(highpass);
    highpass.connect(this.frictionGain);
    this.frictionGain.connect(this.masterGain);

    this.frictionSource.start(this.ctx.currentTime);
  }

  /**
   * Modulates silk whispering friction in real time based on scroll or gesture velocity.
   */
  public modulateVelocity(velocity: number): void {
    if (!this.ctx || this.isMuted || !this.frictionGain || !this.frictionFilter) return;

    const absVel = Math.min(1.0, Math.abs(velocity));
    const now = this.ctx.currentTime;
    if (now - this.lastVelocityModTime < 0.03) return; // throttle to ~30Hz
    this.lastVelocityModTime = now;

    // Smooth velocity with inertia
    this.smoothedVelocity = this.smoothedVelocity * 0.7 + absVel * 0.3;

    // Scale friction gain: quiet whisper (0.005) up to 0.16 during vigorous scrolling
    const targetGain = 0.005 + this.smoothedVelocity * 0.15;
    this.frictionGain.gain.setTargetAtTime(targetGain, now, 0.06);

    // Modulate filter center frequency: faster scroll yields higher friction pitch (1600Hz -> 3400Hz)
    const targetFreq = 1800 + this.smoothedVelocity * 1600;
    this.frictionFilter.frequency.setTargetAtTime(targetFreq, now, 0.08);
  }

  /**
   * Triggers a momentary tactile silk brushing sweep (e.g. dragging across cloth).
   */
  public triggerTouchFriction(intensity: number = 0.5): void {
    if (!this.ctx || this.isMuted || !this.frictionGain || !this.frictionFilter) return;

    const now = this.ctx.currentTime;
    const clampedIntensity = Math.min(1.0, Math.max(0.1, intensity));
    const targetGain = 0.02 + clampedIntensity * 0.14;

    // Guard against <= 0 starting value for exponential ramp (prevents W3C RangeError)
    const currentVal = Math.max(0.0001, this.frictionGain.gain.value);
    this.frictionGain.gain.cancelScheduledValues(now);
    this.frictionGain.gain.setValueAtTime(currentVal, now);
    this.frictionGain.gain.linearRampToValueAtTime(targetGain, now + 0.04);
    this.frictionGain.gain.exponentialRampToValueAtTime(0.005, now + 0.35);

    this.frictionFilter.frequency.setValueAtTime(2400 + clampedIntensity * 800, now);
  }

  /**
   * Triggers delicate metallic zari glint chimes when raking light catches gold threads.
   */
  public triggerZariChime(pitchMultiplier: number = 1.0, intensity: number = 0.4): void {
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // Strict rate limiter: at most one chime every 110ms to maintain museum-grade refinement
    if (now - this.lastChimeTime < 0.11) return;
    this.lastChimeTime = now;

    try {
      // Bell partials: Non-harmonic metallic partial ratios
      const baseFreq = (1760 + (Math.random() - 0.5) * 80) * pitchMultiplier;
      const partials = [
        { freq: baseFreq, gain: 0.045 },
        { freq: baseFreq * 1.58, gain: 0.035 },
        { freq: baseFreq * 2.14, gain: 0.025 },
        { freq: baseFreq * 3.22, gain: 0.015 },
      ];

      const chimeGain = this.ctx.createGain();
      const clampedIntensity = Math.min(1.0, Math.max(0.1, intensity));
      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.linearRampToValueAtTime(0.18 * clampedIntensity, now + 0.006);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, now);

      const activeNodes: (OscillatorNode | GainNode)[] = [];

      partials.forEach(({ freq, gain }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        pGain.gain.setValueAtTime(gain, now);

        osc.connect(pGain);
        pGain.connect(filter);

        osc.start(now);
        osc.stop(now + 0.7);

        activeNodes.push(osc, pGain);
      });

      filter.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      // Complete cleanup of all transient audio nodes to prevent memory leaks in AudioGraph
      setTimeout(() => {
        try {
          activeNodes.forEach((node) => {
            try { node.disconnect(); } catch { }
          });
          chimeGain.disconnect();
          filter.disconnect();
        } catch { }
      }, 750);
    } catch {
      // Silently catch audio buffer anomalies
    }
  }

  /**
   * Layer 3: Indian Classical Raga Yaman Pentatonic Zari Chime Synthesis.
   * Produces authentic modal bell partials tuned to sacred 432Hz Sa.
   * Triggered when cursor rakes gold threads, hover over cards, or interacting with selvedge.
   */
  public triggerYamanZariChime(noteIndex?: number, intensity: number = 0.45): void {
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    const now = this.ctx.currentTime;
    if (now - this.lastChimeTime < 0.08) return; // rate-limit to ~12Hz
    this.lastChimeTime = now;

    try {
      const idx = typeof noteIndex === 'number'
        ? Math.abs(noteIndex) % this.yamanFrequencies.length
        : this.yamanNotePointer;
      this.yamanNotePointer = (this.yamanNotePointer + 1) % this.yamanFrequencies.length;

      const baseFreq = this.yamanFrequencies[idx] * (1.0 + (Math.random() - 0.5) * 0.02);

      // Metallic partials: Non-harmonic bell ratios
      const partials = [
        { freq: baseFreq, gain: 0.06 },
        { freq: baseFreq * 2.01, gain: 0.035 },
        { freq: baseFreq * 2.76, gain: 0.022 },
        { freq: baseFreq * 4.07, gain: 0.012 },
      ];

      const chimeGain = this.ctx.createGain();
      const clampedIntensity = Math.min(1.0, Math.max(0.1, intensity));
      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.linearRampToValueAtTime(0.22 * clampedIntensity, now + 0.005);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(600, now);

      const activeNodes: (OscillatorNode | GainNode)[] = [];

      partials.forEach(({ freq, gain }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        pGain.gain.setValueAtTime(gain, now);

        osc.connect(pGain);
        pGain.connect(filter);

        osc.start(now);
        osc.stop(now + 0.9);

        activeNodes.push(osc, pGain);
      });

      filter.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      setTimeout(() => {
        try {
          activeNodes.forEach((node) => {
            try { node.disconnect(); } catch { }
          });
          chimeGain.disconnect();
          filter.disconnect();
        } catch { }
      }, 950);
    } catch {
      // Audio buffer safety
    }
  }

  /**
   * Layer 4: Procedural Wooden Handloom Shuttle & Reed Mechanical Ticks.
   * Simulates the organic acoustic click of handloom wooden reeds striking warp threads.
   */
  public triggerHandloomShuttle(type: 'shuttle' | 'reed' = 'reed', intensity: number = 0.3): void {
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    const now = this.ctx.currentTime;
    if (now - this.lastShuttleTime < 0.06) return; // rate-limit
    this.lastShuttleTime = now;

    try {
      const clickGain = this.ctx.createGain();
      const clampedIntensity = Math.min(1.0, Math.max(0.05, intensity));

      const duration = type === 'shuttle' ? 0.025 : 0.04;
      const baseFreq = type === 'shuttle' ? 780 : 340;

      clickGain.gain.setValueAtTime(0.0001, now);
      clickGain.gain.linearRampToValueAtTime(0.14 * clampedIntensity, now + 0.003);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Resonant filter for wooden body acoustic cavity
      const woodFilter = this.ctx.createBiquadFilter();
      woodFilter.type = 'bandpass';
      woodFilter.frequency.setValueAtTime(baseFreq, now);
      woodFilter.Q.setValueAtTime(4.2, now);

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(60, baseFreq * 0.5), now + duration);

      osc.connect(woodFilter);
      woodFilter.connect(clickGain);
      clickGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.01);

      setTimeout(() => {
        try {
          osc.disconnect();
          woodFilter.disconnect();
          clickGain.disconnect();
        } catch { }
      }, 80);
    } catch {
      // Audio graph safety
    }
  }

  /**
   * Modulates spatial drone cutoff and acoustic atmosphere across the 5 chambers (0.0 -> 1.0).
   */
  public modulateChamberDepth(chamberProgress: number): void {
    if (!this.ctx || this.isMuted || !this.droneFilter) return;

    const clamped = Math.max(0, Math.min(1, chamberProgress));
    const now = this.ctx.currentTime;

    // Chamber 1 & 2: Deep Darkroom Obsidian (130Hz - 180Hz)
    // Chamber 3: Spatial Vault (220Hz)
    // Chamber 4: Sunlit Ecru Gossamer Corridor (340Hz - 420Hz open and airy)
    // Chamber 5: Secret Atelier (140Hz intimate chiaroscuro)
    let targetFreq = 160;
    if (clamped < 0.25) {
      targetFreq = 140 + clamped * 160;
    } else if (clamped < 0.65) {
      targetFreq = 180 + (clamped - 0.25) * 150;
    } else if (clamped < 0.88) {
      targetFreq = 260 + (clamped - 0.65) * 550; // Opening into bright diaphanous light
    } else {
      targetFreq = 150; // Descending back into sacred nocturnal silence
    }

    this.droneFilter.frequency.setTargetAtTime(targetFreq, now, 0.15);
  }

  /**
   * Triggers a subtle mechanical optical lens focus detent click.
   * Emitted during zoom scale changes, stepped increments, or microscopic panning.
   */
  public triggerFocusClick(
    type: 'zoom' | 'pan' | 'reset' = 'zoom',
    pitchMultiplier: number = 1.0,
    intensity: number = 0.22
  ): void {
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const throttleInterval = type === 'pan' ? 0.08 : 0.045;
    if (now - this.lastFocusClickTime < throttleInterval) return;
    this.lastFocusClickTime = now;

    try {
      const clickGain = this.ctx.createGain();
      const clampedIntensity = Math.min(1.0, Math.max(0.05, Number.isFinite(intensity) ? intensity : 0.22));
      const safeMultiplier = Math.min(3.0, Math.max(0.2, Number.isFinite(pitchMultiplier) ? pitchMultiplier : 1.0));

      let baseFreq = 2200 * safeMultiplier;
      let duration = 0.022;

      if (type === 'pan') {
        baseFreq = (1100 + (Math.random() - 0.5) * 120) * safeMultiplier;
        duration = 0.018;
      } else if (type === 'reset') {
        baseFreq = 1600 * safeMultiplier;
        duration = 0.035;
      }

      baseFreq = Math.max(100, baseFreq);

      clickGain.gain.setValueAtTime(0.0001, now);
      clickGain.gain.linearRampToValueAtTime(0.12 * clampedIntensity, now + 0.002);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.Q.setValueAtTime(4.5, now);

      const osc = this.ctx.createOscillator();
      osc.type = type === 'pan' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(50, baseFreq * 0.45), now + duration);

      osc.connect(filter);
      filter.connect(clickGain);
      clickGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.01);

      // If reset, schedule a subtle secondary detent click
      if (type === 'reset') {
        const t2 = now + 0.038;
        const osc2 = this.ctx.createOscillator();
        const clickGain2 = this.ctx.createGain();
        clickGain2.gain.setValueAtTime(0.0001, t2);
        clickGain2.gain.linearRampToValueAtTime(0.09 * clampedIntensity, t2 + 0.002);
        clickGain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.025);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(Math.max(100, baseFreq * 1.25), t2);
        osc2.connect(filter);
        osc2.start(t2);
        osc2.stop(t2 + 0.03);

        setTimeout(() => {
          try {
            osc2.disconnect();
            clickGain2.disconnect();
          } catch { }
        }, 120);
      }

      setTimeout(() => {
        try {
          osc.disconnect();
          filter.disconnect();
          clickGain.disconnect();
        } catch { }
      }, 100);
    } catch {
      // Audio graph protection
    }
  }

  /**
   * Triggers an elastic tension pluck as the selvedge thread is drawn away from the cloth.
   */
  public triggerSpringTension(ratio: number): void {
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    const now = this.ctx.currentTime;
    if (now - this.lastTensionSoundTime < 0.075) return;
    this.lastTensionSoundTime = now;

    try {
      const clampedRatio = Math.min(1.0, Math.max(0.05, Number.isFinite(ratio) ? ratio : 0.05));
      const freq = Math.max(100, 800 + clampedRatio * 1600);
      const duration = 0.03 + clampedRatio * 0.02;

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(100, freq * 1.15), now + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.setValueAtTime(6.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.08 * (0.3 + clampedRatio * 0.7), now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.01);

      setTimeout(() => {
        try {
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch { }
      }, 90);
    } catch {
      // Audio graph protection
    }
  }

  /**
   * Triggers a resonant metallic zari chime snap when the selvedge thread is released
   * and springs back into the textile edge.
   */
  public triggerSpringSnap(): void {
    this.triggerZariChime(1.35, 0.55);
  }

  /**
   * Triggers a deep, quiet harmonic resonance when the visitor interacts with or hovers
   * the Living Heirloom Seal. Procedurally synthesizes a warm darkroom singing bowl
   * with sacred 108Hz fundamental and rich ethereal overtones.
   */
  public triggerHeirloomResonance(intensity: number = 0.5): void {
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime;
    if (now - this.lastHeirloomTime < 1.4) return; // rate-limit to maintain sacred stillness
    this.lastHeirloomTime = now;

    try {
      const resonanceGain = this.ctx.createGain();
      const clampedIntensity = Math.min(1.0, Math.max(0.1, intensity));

      // Slow, breathing attack ramping up over 140ms with a lingering 2.8s reverberant decay
      resonanceGain.gain.setValueAtTime(0.0001, now);
      resonanceGain.gain.linearRampToValueAtTime(0.15 * clampedIntensity, now + 0.14);
      resonanceGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      // Low-pass resonant filter with gentle acoustic contouring
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(560, now);
      filter.frequency.exponentialRampToValueAtTime(240, now + 2.6);
      filter.Q.setValueAtTime(3.2, now);

      // Sacred harmonic ratios: 108Hz (fundamental), 216Hz (octave), 324Hz (fifth), 432Hz (double octave), 648Hz (shimmer)
      const partials: { freq: number; type: OscillatorType; gain: number }[] = [
        { freq: 108.0, type: 'sine', gain: 0.085 },
        { freq: 216.0, type: 'sine', gain: 0.045 },
        { freq: 324.0, type: 'triangle', gain: 0.024 },
        { freq: 432.0, type: 'sine', gain: 0.016 },
        { freq: 648.0, type: 'sine', gain: 0.008 },
      ];

      const activeNodes: (OscillatorNode | GainNode)[] = [];

      partials.forEach(({ freq, type, gain }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        pGain.gain.setValueAtTime(gain, now);

        osc.connect(pGain);
        pGain.connect(filter);

        osc.start(now);
        osc.stop(now + 2.9);

        activeNodes.push(osc, pGain);
      });

      filter.connect(resonanceGain);
      resonanceGain.connect(this.masterGain);

      // Rigorous cleanup of transient nodes
      setTimeout(() => {
        try {
          activeNodes.forEach((node) => {
            try { node.disconnect(); } catch { }
          });
          filter.disconnect();
          resonanceGain.disconnect();
        } catch { }
      }, 3100);
    } catch {
      // Audio graph protection
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;

    if (!muted) {
      if (!this.isInitialized) {
        this.init();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          if (!this.isMuted && this.masterGain && this.ctx) {
            const t = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(t);
            this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), t);
            this.masterGain.gain.linearRampToValueAtTime(0.38, t + 0.85);
          }
        }).catch(() => { });
      }
    }

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
      if (muted) {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.45);
      } else {
        this.masterGain.gain.linearRampToValueAtTime(0.38, now + 0.85);
      }
    }
  }

  public toggle(): boolean {
    const next = !this.isMuted;
    this.setMuted(next);
    return next;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const audioEngine = new WebAudioEngine();
