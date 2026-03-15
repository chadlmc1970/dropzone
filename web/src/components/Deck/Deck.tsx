import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { togglePlayPause } from '../../store/decksSlice';

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
            <p className="text-gray-400 text-sm truncate">{deckState.track.artist}</p>
            <div className="flex gap-3 mt-2">
              {deckState.track.bpm && (
                <span className={`text-${color}-400 text-xs font-mono`}>
                  {deckState.track.bpm} BPM
                </span>
              )}
              {deckState.track.key && (
                <span className={`text-${color}-400 text-xs font-mono`}>
                  {deckState.track.key}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 text-sm">No track loaded</p>
          </div>
        )}
      </div>

      {/* Waveform Placeholder */}
      <div className="bg-black rounded-lg h-24 mb-4 flex items-center justify-center">
        <span className="text-gray-700 text-xs">WAVEFORM</span>
      </div>

      {/* Jog Wheel Placeholder */}
      <div className="flex justify-center mb-6">
        <div className={`w-40 h-40 rounded-full bg-gradient-to-b from-gray-800 to-black border-4 border-${color}-500/30 flex items-center justify-center`}>
          <div className={`w-32 h-32 rounded-full bg-black border-2 border-${color}-500/50 flex items-center justify-center`}>
            <span className={`text-${color}-400 text-sm font-bold`}>JOG</span>
          </div>
        </div>
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

      {/* Performance Pads */}
      <div className="grid grid-cols-4 gap-2 mt-6">
        {[1, 2, 3, 4].map((pad) => (
          <button
            key={pad}
            className={`h-12 rounded bg-gray-800 hover:bg-${color}-600 border border-gray-700 transition-colors text-${color}-400 text-xs font-bold`}
          >
            {pad}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Deck;
