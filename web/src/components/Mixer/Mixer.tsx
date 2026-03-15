import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCrossfader, setEQ, setMasterVolume } from '../../store/mixerSlice';

const Mixer: React.FC = () => {
  const dispatch = useDispatch();
  const mixer = useSelector((state: RootState) => state.mixer);

  const handleCrossfaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCrossfader(parseFloat(e.target.value)));
  };

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMasterVolume(parseFloat(e.target.value)));
  };

  const handleEQChange = (deck: 'A' | 'B', band: 'low' | 'mid' | 'high', value: number) => {
    dispatch(setEQ({ deck, band, value }));
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      {/* Mixer Header */}
      <div className="flex items-center justify-center mb-4 pb-3 border-b border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-400">MIXER</h2>
      </div>

      {/* Channel Strips */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Deck A Channel */}
        <div className="space-y-3">
          <h3 className="text-cyan-400 text-sm font-bold text-center">DECK A</h3>

          {/* EQ Knobs */}
          <div className="space-y-2">
            <div className="text-center">
              <label className="text-xs text-gray-500 block mb-1">HIGH</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={mixer.deckAEQ.high}
                onChange={(e) => handleEQChange('A', 'high', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-xs text-cyan-400">{mixer.deckAEQ.high.toFixed(1)} dB</span>
            </div>

            <div className="text-center">
              <label className="text-xs text-gray-500 block mb-1">MID</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={mixer.deckAEQ.mid}
                onChange={(e) => handleEQChange('A', 'mid', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-xs text-cyan-400">{mixer.deckAEQ.mid.toFixed(1)} dB</span>
            </div>

            <div className="text-center">
              <label className="text-xs text-gray-500 block mb-1">LOW</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={mixer.deckAEQ.low}
                onChange={(e) => handleEQChange('A', 'low', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-xs text-cyan-400">{mixer.deckAEQ.low.toFixed(1)} dB</span>
            </div>
          </div>
        </div>

        {/* Deck B Channel */}
        <div className="space-y-3">
          <h3 className="text-orange-400 text-sm font-bold text-center">DECK B</h3>

          {/* EQ Knobs */}
          <div className="space-y-2">
            <div className="text-center">
              <label className="text-xs text-gray-500 block mb-1">HIGH</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={mixer.deckBEQ.high}
                onChange={(e) => handleEQChange('B', 'high', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-xs text-orange-400">{mixer.deckBEQ.high.toFixed(1)} dB</span>
            </div>

            <div className="text-center">
              <label className="text-xs text-gray-500 block mb-1">MID</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={mixer.deckBEQ.mid}
                onChange={(e) => handleEQChange('B', 'mid', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-xs text-orange-400">{mixer.deckBEQ.mid.toFixed(1)} dB</span>
            </div>

            <div className="text-center">
              <label className="text-xs text-gray-500 block mb-1">LOW</label>
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={mixer.deckBEQ.low}
                onChange={(e) => handleEQChange('B', 'low', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-xs text-orange-400">{mixer.deckBEQ.low.toFixed(1)} dB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crossfader */}
      <div className="mb-6">
        <h3 className="text-purple-400 text-sm font-bold text-center mb-2">CROSSFADER</h3>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-xs font-bold">A</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mixer.crossfaderPosition}
            onChange={handleCrossfaderChange}
            className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-orange-400 text-xs font-bold">B</span>
        </div>
        <div className="text-center mt-1">
          <span className="text-xs text-gray-400">
            {(mixer.crossfaderPosition * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Master Volume */}
      <div>
        <h3 className="text-purple-400 text-sm font-bold text-center mb-2">MASTER</h3>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={mixer.masterVolume}
          onChange={handleMasterVolumeChange}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="text-center mt-1">
          <span className="text-purple-400 text-sm font-bold">
            {(mixer.masterVolume * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Effects Rack Placeholder */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-purple-400 text-xs font-bold text-center mb-3">FX</h3>
        <div className="grid grid-cols-2 gap-2">
          {['REVERB', 'DELAY', 'FILTER', 'ECHO'].map((fx) => (
            <button
              key={fx}
              className="py-2 px-3 bg-gray-800 hover:bg-purple-600/30 border border-gray-700 rounded text-xs text-gray-400 transition-colors"
            >
              {fx}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mixer;
