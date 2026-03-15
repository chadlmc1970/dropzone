export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration_ms: number;
  uri: string;
  preview_url?: string;
  bpm?: number;
  key?: string;
}

export interface DeckState {
  track: Track | null;
  isPlaying: boolean;
  position: number; // seconds
  volume: number; // 0-1
  tempo: number; // 0.5 - 2.0
  pitch: number; // -12 to +12 semitones
  cuePoints: number[]; // array of positions in seconds
  loopStart: number | null;
  loopEnd: number | null;
  loopEnabled: boolean;
}

export interface MixerState {
  crossfaderPosition: number; // 0 (deck A) to 1 (deck B)
  deckAEQ: {
    low: number; // -12 to +12 dB
    mid: number;
    high: number;
  };
  deckBEQ: {
    low: number;
    mid: number;
    high: number;
  };
  deckAVolume: number; // 0-1
  deckBVolume: number; // 0-1
  masterVolume: number; // 0-1
  headphoneVolume: number; // 0-1
  headphoneCue: 'A' | 'B' | 'master';
  effectsRack: {
    reverb: number; // 0-1
    delay: number;
    filter: number;
    echo: number;
  };
}

export type MixingMode = 'manual' | 'auto' | 'guided' | 'autopilot';

export interface UIState {
  mode: MixingMode;
  activeDeck: 'A' | 'B';
  showTrackSearch: boolean;
  searchTarget: 'A' | 'B' | null;
}
