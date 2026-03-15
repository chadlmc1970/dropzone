import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeckState, Track } from '../types';

const initialDeckState: DeckState = {
  track: null,
  isPlaying: false,
  position: 0,
  volume: 0.8,
  tempo: 1.0,
  pitch: 0,
  cuePoints: [],
  loopStart: null,
  loopEnd: null,
  loopEnabled: false,
};

interface DecksState {
  deckA: DeckState;
  deckB: DeckState;
}

const initialState: DecksState = {
  deckA: initialDeckState,
  deckB: initialDeckState,
};

const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    loadTrack: (state, action: PayloadAction<{ deck: 'A' | 'B'; track: Track }>) => {
      const deckKey = `deck${action.payload.deck}` as keyof DecksState;
      state[deckKey].track = action.payload.track;
      state[deckKey].position = 0;
    },
    togglePlayPause: (state, action: PayloadAction<'A' | 'B'>) => {
      const deckKey = `deck${action.payload}` as keyof DecksState;
      state[deckKey].isPlaying = !state[deckKey].isPlaying;
    },
    setPosition: (state, action: PayloadAction<{ deck: 'A' | 'B'; position: number }>) => {
      const deckKey = `deck${action.payload.deck}` as keyof DecksState;
      state[deckKey].position = action.payload.position;
    },
    setVolume: (state, action: PayloadAction<{ deck: 'A' | 'B'; volume: number }>) => {
      const deckKey = `deck${action.payload.deck}` as keyof DecksState;
      state[deckKey].volume = action.payload.volume;
    },
    setTempo: (state, action: PayloadAction<{ deck: 'A' | 'B'; tempo: number }>) => {
      const deckKey = `deck${action.payload.deck}` as keyof DecksState;
      state[deckKey].tempo = action.payload.tempo;
    },
    setPitch: (state, action: PayloadAction<{ deck: 'A' | 'B'; pitch: number }>) => {
      const deckKey = `deck${action.payload.deck}` as keyof DecksState;
      state[deckKey].pitch = action.payload.pitch;
    },
    addCuePoint: (state, action: PayloadAction<{ deck: 'A' | 'B'; position: number }>) => {
      const deckKey = `deck${action.payload.deck}` as keyof DecksState;
      state[deckKey].cuePoints.push(action.payload.position);
    },
    setLoop: (state, action: PayloadAction<{ deck: 'A' | 'B'; start: number; end: number }>) => {
      const deckKey = `deck${action.payload.deck}` as keyof DecksState;
      state[deckKey].loopStart = action.payload.start;
      state[deckKey].loopEnd = action.payload.end;
      state[deckKey].loopEnabled = true;
    },
    clearLoop: (state, action: PayloadAction<'A' | 'B'>) => {
      const deckKey = `deck${action.payload}` as keyof DecksState;
      state[deckKey].loopStart = null;
      state[deckKey].loopEnd = null;
      state[deckKey].loopEnabled = false;
    },
  },
});

export const {
  loadTrack,
  togglePlayPause,
  setPosition,
  setVolume,
  setTempo,
  setPitch,
  addCuePoint,
  setLoop,
  clearLoop,
} = decksSlice.actions;

export default decksSlice.reducer;
