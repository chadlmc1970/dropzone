class AudioEngine {
  private static instance: AudioEngine;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Deck A nodes
  private deckASource: MediaElementAudioSourceNode | null = null;
  private deckAGain: GainNode | null = null;
  private deckAEQ: {
    low: BiquadFilterNode | null;
    mid: BiquadFilterNode | null;
    high: BiquadFilterNode | null;
  } = { low: null, mid: null, high: null };

  // Deck B nodes
  private deckBSource: MediaElementAudioSourceNode | null = null;
  private deckBGain: GainNode | null = null;
  private deckBEQ: {
    low: BiquadFilterNode | null;
    mid: BiquadFilterNode | null;
    high: BiquadFilterNode | null;
  } = { low: null, mid: null, high: null };

  // Effects (reserved for future use)
  // private reverbNode: ConvolverNode | null = null;
  // private delayNode: DelayNode | null = null;

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  initialize(): void {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);

    // Initialize Deck A
    this.deckAGain = this.audioContext.createGain();
    this.deckAGain.gain.value = 0.8;

    // Deck A EQ (3-band)
    this.deckAEQ.low = this.audioContext.createBiquadFilter();
    this.deckAEQ.low.type = 'lowshelf';
    this.deckAEQ.low.frequency.value = 200;

    this.deckAEQ.mid = this.audioContext.createBiquadFilter();
    this.deckAEQ.mid.type = 'peaking';
    this.deckAEQ.mid.frequency.value = 1000;
    this.deckAEQ.mid.Q.value = 1;

    this.deckAEQ.high = this.audioContext.createBiquadFilter();
    this.deckAEQ.high.type = 'highshelf';
    this.deckAEQ.high.frequency.value = 5000;

    // Connect Deck A chain: EQ -> Gain -> Master
    this.deckAEQ.low.connect(this.deckAEQ.mid);
    this.deckAEQ.mid.connect(this.deckAEQ.high);
    this.deckAEQ.high.connect(this.deckAGain);
    this.deckAGain.connect(this.masterGain);

    // Initialize Deck B (same structure)
    this.deckBGain = this.audioContext.createGain();
    this.deckBGain.gain.value = 0.8;

    this.deckBEQ.low = this.audioContext.createBiquadFilter();
    this.deckBEQ.low.type = 'lowshelf';
    this.deckBEQ.low.frequency.value = 200;

    this.deckBEQ.mid = this.audioContext.createBiquadFilter();
    this.deckBEQ.mid.type = 'peaking';
    this.deckBEQ.mid.frequency.value = 1000;
    this.deckBEQ.mid.Q.value = 1;

    this.deckBEQ.high = this.audioContext.createBiquadFilter();
    this.deckBEQ.high.type = 'highshelf';
    this.deckBEQ.high.frequency.value = 5000;

    // Connect Deck B chain
    this.deckBEQ.low.connect(this.deckBEQ.mid);
    this.deckBEQ.mid.connect(this.deckBEQ.high);
    this.deckBEQ.high.connect(this.deckBGain);
    this.deckBGain.connect(this.masterGain);

    console.log('AudioEngine initialized');
  }

  connectDeckA(audioElement: HTMLAudioElement): void {
    if (!this.audioContext || !this.deckAEQ.low) return;

    if (this.deckASource) {
      this.deckASource.disconnect();
    }

    this.deckASource = this.audioContext.createMediaElementSource(audioElement);
    this.deckASource.connect(this.deckAEQ.low);
  }

  connectDeckB(audioElement: HTMLAudioElement): void {
    if (!this.audioContext || !this.deckBEQ.low) return;

    if (this.deckBSource) {
      this.deckBSource.disconnect();
    }

    this.deckBSource = this.audioContext.createMediaElementSource(audioElement);
    this.deckBSource.connect(this.deckBEQ.low);
  }

  setDeckVolume(deck: 'A' | 'B', volume: number): void {
    const gain = deck === 'A' ? this.deckAGain : this.deckBGain;
    if (gain) {
      gain.gain.setValueAtTime(volume, this.audioContext!.currentTime);
    }
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext!.currentTime);
    }
  }

  setEQ(deck: 'A' | 'B', band: 'low' | 'mid' | 'high', dbValue: number): void {
    const eq = deck === 'A' ? this.deckAEQ : this.deckBEQ;
    const filter = eq[band];

    if (filter) {
      filter.gain.setValueAtTime(dbValue, this.audioContext!.currentTime);
    }
  }

  setCrossfader(position: number): void {
    // position: 0 = full Deck A, 0.5 = center, 1 = full Deck B
    if (!this.deckAGain || !this.deckBGain || !this.audioContext) return;

    const now = this.audioContext.currentTime;

    // Smooth power crossfade (equal power law)
    const deckAVolume = Math.cos(position * Math.PI / 2);
    const deckBVolume = Math.sin(position * Math.PI / 2);

    this.deckAGain.gain.setValueAtTime(deckAVolume, now);
    this.deckBGain.gain.setValueAtTime(deckBVolume, now);
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  resume(): void {
    this.audioContext?.resume();
  }
}

export default AudioEngine.getInstance();
