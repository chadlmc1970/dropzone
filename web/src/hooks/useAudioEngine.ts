import { useEffect, useRef } from 'react';
import audioEngine from '../services/audioEngine';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useAudioEngine = () => {
  const isInitialized = useRef(false);
  const mixerState = useSelector((state: RootState) => state.mixer);

  useEffect(() => {
    if (!isInitialized.current) {
      audioEngine.initialize();
      isInitialized.current = true;
    }
  }, []);

  // Update audio engine when mixer state changes
  useEffect(() => {
    audioEngine.setMasterVolume(mixerState.masterVolume);
  }, [mixerState.masterVolume]);

  useEffect(() => {
    audioEngine.setCrossfader(mixerState.crossfaderPosition);
  }, [mixerState.crossfaderPosition]);

  useEffect(() => {
    audioEngine.setDeckVolume('A', mixerState.deckAVolume);
  }, [mixerState.deckAVolume]);

  useEffect(() => {
    audioEngine.setDeckVolume('B', mixerState.deckBVolume);
  }, [mixerState.deckBVolume]);

  // Update EQ
  useEffect(() => {
    audioEngine.setEQ('A', 'low', mixerState.deckAEQ.low);
    audioEngine.setEQ('A', 'mid', mixerState.deckAEQ.mid);
    audioEngine.setEQ('A', 'high', mixerState.deckAEQ.high);
  }, [mixerState.deckAEQ]);

  useEffect(() => {
    audioEngine.setEQ('B', 'low', mixerState.deckBEQ.low);
    audioEngine.setEQ('B', 'mid', mixerState.deckBEQ.mid);
    audioEngine.setEQ('B', 'high', mixerState.deckBEQ.high);
  }, [mixerState.deckBEQ]);

  const connectDeck = (deck: 'A' | 'B', audioElement: HTMLAudioElement) => {
    if (deck === 'A') {
      audioEngine.connectDeckA(audioElement);
    } else {
      audioEngine.connectDeckB(audioElement);
    }
  };

  return {
    connectDeck,
    audioContext: audioEngine.getAudioContext(),
  };
};
