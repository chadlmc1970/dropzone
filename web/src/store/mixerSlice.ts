import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MixerState } from '../types';

const initialState: MixerState = {
  crossfaderPosition: 0.5,
  deckAEQ: {
    low: 0,
    mid: 0,
    high: 0,
  },
  deckBEQ: {
    low: 0,
    mid: 0,
    high: 0,
  },
  deckAVolume: 0.8,
  deckBVolume: 0.8,
  masterVolume: 0.8,
  headphoneVolume: 0.7,
  headphoneCue: 'master',
  effectsRack: {
    reverb: 0,
    delay: 0,
    filter: 0,
    echo: 0,
  },
};

const mixerSlice = createSlice({
  name: 'mixer',
  initialState,
  reducers: {
    setCrossfader: (state, action: PayloadAction<number>) => {
      state.crossfaderPosition = Math.max(0, Math.min(1, action.payload));
    },
    setEQ: (state, action: PayloadAction<{ deck: 'A' | 'B'; band: 'low' | 'mid' | 'high'; value: number }>) => {
      const eqKey = `deck${action.payload.deck}EQ` as keyof Pick<MixerState, 'deckAEQ' | 'deckBEQ'>;
      state[eqKey][action.payload.band] = Math.max(-12, Math.min(12, action.payload.value));
    },
    setDeckVolume: (state, action: PayloadAction<{ deck: 'A' | 'B'; volume: number }>) => {
      const volumeKey = `deck${action.payload.deck}Volume` as keyof Pick<MixerState, 'deckAVolume' | 'deckBVolume'>;
      state[volumeKey] = Math.max(0, Math.min(1, action.payload.volume));
    },
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.masterVolume = Math.max(0, Math.min(1, action.payload));
    },
    setHeadphoneVolume: (state, action: PayloadAction<number>) => {
      state.headphoneVolume = Math.max(0, Math.min(1, action.payload));
    },
    setHeadphoneCue: (state, action: PayloadAction<'A' | 'B' | 'master'>) => {
      state.headphoneCue = action.payload;
    },
    setEffect: (state, action: PayloadAction<{ effect: keyof MixerState['effectsRack']; value: number }>) => {
      state.effectsRack[action.payload.effect] = Math.max(0, Math.min(1, action.payload.value));
    },
  },
});

export const {
  setCrossfader,
  setEQ,
  setDeckVolume,
  setMasterVolume,
  setHeadphoneVolume,
  setHeadphoneCue,
  setEffect,
} = mixerSlice.actions;

export default mixerSlice.reducer;
