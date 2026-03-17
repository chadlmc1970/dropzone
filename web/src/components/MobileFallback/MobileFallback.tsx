import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { togglePlayPause } from '../../store/decksSlice';
import { setMasterVolume } from '../../store/mixerSlice';

const MobileFallback: React.FC = () => {
  const dispatch = useDispatch();
  const deckAPlaying = useSelector((state: RootState) => state.decks.deckA.isPlaying);
  const deckBPlaying = useSelector((state: RootState) => state.decks.deckB.isPlaying);
  const masterVolume = useSelector((state: RootState) => state.mixer.masterVolume);

  const handleDeckAToggle = () => {
    dispatch(togglePlayPause('A'));
  };

  const handleDeckBToggle = () => {
    dispatch(togglePlayPause('B'));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMasterVolume(parseFloat(e.target.value)));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">DropZone</h1>
          <p className="text-gray-400 text-sm">DJ Mixing App</p>
        </div>

        {/* Desktop Recommendation Message */}
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎧</span>
            <div>
              <h3 className="text-purple-300 font-bold mb-1">Desktop Browser Recommended</h3>
              <p className="text-gray-300 text-sm">
                For the full DJ controller experience, please open DropZone on a desktop or laptop.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Playback Controls */}
        <div className="space-y-6">
          {/* Deck A Control */}
          <div className="bg-gray-900 rounded-lg p-4 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <h3 className="text-cyan-400 font-bold text-lg">DECK A</h3>
              <button
                onClick={handleDeckAToggle}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  deckAPlaying
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {deckAPlaying ? '⏸ PAUSE' : '▶ PLAY'}
              </button>
            </div>
          </div>

          {/* Deck B Control */}
          <div className="bg-gray-900 rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <h3 className="text-orange-400 font-bold text-lg">DECK B</h3>
              <button
                onClick={handleDeckBToggle}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  deckBPlaying
                    ? 'bg-orange-600 hover:bg-orange-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {deckBPlaying ? '⏸ PAUSE' : '▶ PLAY'}
              </button>
            </div>
          </div>

          {/* Master Volume Control */}
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-purple-400 font-bold text-sm mb-3">MASTER VOLUME</h3>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-purple-400 font-bold text-sm w-12 text-right">
                {(masterVolume * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-xs">
            DropZone - Professional DJ Mixing
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileFallback;
