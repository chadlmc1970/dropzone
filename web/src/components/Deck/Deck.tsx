import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { togglePlayPause, toggleHotCue } from '../../store/decksSlice';
import JogWheel from './JogWheel';
import Waveform from './Waveform';
import PerformancePad from '../shared/PerformancePad';

interface DeckProps {
  deck: 'A' | 'B';
}

const Deck: React.FC<DeckProps> = ({ deck }) => {
  const dispatch = useDispatch();
  const deckState = useSelector((state: RootState) =>
    deck === 'A' ? state.decks.deckA : state.decks.deckB
  );

  const handlePlayPause = () => {
    dispatch(togglePlayPause(deck));
  };

  const handlePadClick = (index: number) => {
    dispatch(toggleHotCue({ deck, index }));
  };

  const getDeckColor = () => (deck === 'A' ? 'cyan' : 'orange');
  const color = getDeckColor();

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      {/* Deck Header */}
      <div className={`flex items-center justify-between mb-4 pb-3 border-b border-${color}-500/30`}>
        <h2 className={`text-2xl font-bold text-${color}-400`}>DECK {deck}</h2>
        <div className={`w-3 h-3 rounded-full ${deckState.isPlaying ? `bg-${color}-400 animate-pulse` : 'bg-gray-600'}`} />
      </div>

      {/* Track Info */}
      <div className="mb-6 min-h-[80px]">
        {deckState.track ? (
          <div>
            <h3 className="text-white font-semibold text-lg truncate">{deckState.track.name}</h3>
            <p className="text-gray-200 text-sm truncate">{deckState.track.artist}</p>
            <div className="flex gap-3 mt-2">
              {deckState.track.bpm && (
                <span className={`text-${color}-300 text-xs font-mono font-semibold`}>
                  {deckState.track.bpm} BPM
                </span>
              )}
              {deckState.track.key && (
                <span className={`text-${color}-300 text-xs font-mono font-semibold`}>
                  {deckState.track.key}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm font-semibold">No track loaded</p>
          </div>
        )}
      </div>

      {/* Waveform */}
      <Waveform
        track={deckState.track}
        position={deckState.position}
        duration={deckState.track?.duration_ms ? deckState.track.duration_ms / 1000 : 0}
        deck={deck}
      />

      {/* Jog Wheel */}
      <div className="flex justify-center mb-6">
        <JogWheel
          deck={deck}
          isPlaying={deckState.isPlaying}
          onScratch={(delta) => {
            // Handle scratch - could dispatch a scratch action here
            console.log(`Deck ${deck} scratch:`, delta);
          }}
        />
      </div>

      {/* Transport Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handlePlayPause}
          className={`px-6 py-3 rounded-lg bg-${color}-600 hover:bg-${color}-500 text-white font-semibold transition-colors`}
        >
          {deckState.isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </button>
        <button className="px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
          CUE
        </button>
        <button className="px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
          SYNC
        </button>
      </div>

      {/* Performance Pads - 4×2 Grid (8 pads) */}
      <div className="grid grid-cols-4 gap-2 mt-6">
        {Array.from({ length: 8 }, (_, i) => (
          <PerformancePad
            key={i}
            label={i + 1}
            active={deckState.hotCues[i]}
            onClick={() => handlePadClick(i)}
            color={color}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Deck;
