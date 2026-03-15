import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setEQ, setDeckVolume } from '../../store/mixerSlice';

interface ChannelStripProps {
  deck: 'A' | 'B';
}

const ChannelStrip: React.FC<ChannelStripProps> = ({ deck }) => {
  const dispatch = useDispatch();
  const eq = useSelector((state: RootState) =>
    deck === 'A' ? state.mixer.deckAEQ : state.mixer.deckBEQ
  );
  const volume = useSelector((state: RootState) =>
    deck === 'A' ? state.mixer.deckAVolume : state.mixer.deckBVolume
  );

  const color = deck === 'A' ? 'cyan' : 'orange';

  const handleEQChange = (band: 'low' | 'mid' | 'high', value: number) => {
    dispatch(setEQ({ deck, band, value }));
  };

  const handleVolumeChange = (value: number) => {
    dispatch(setDeckVolume({ deck, volume: value }));
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-${color}-400 text-sm font-bold text-center`}>DECK {deck}</h3>

      {/* Volume Fader */}
      <div className="text-center">
        <label className="text-xs text-gray-500 block mb-1">VOLUME</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${color}-500`}
        />
        <span className={`text-xs text-${color}-400`}>{(volume * 100).toFixed(0)}%</span>
      </div>

      {/* High EQ */}
      <div className="text-center">
        <label className="text-xs text-gray-500 block mb-1">HIGH</label>
        <input
          type="range"
          min="-12"
          max="12"
          step="0.5"
          value={eq.high}
          onChange={(e) => handleEQChange('high', parseFloat(e.target.value))}
          className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${color}-500`}
        />
        <span className={`text-xs text-${color}-400`}>{eq.high.toFixed(1)} dB</span>
      </div>

      {/* Mid EQ */}
      <div className="text-center">
        <label className="text-xs text-gray-500 block mb-1">MID</label>
        <input
          type="range"
          min="-12"
          max="12"
          step="0.5"
          value={eq.mid}
          onChange={(e) => handleEQChange('mid', parseFloat(e.target.value))}
          className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${color}-500`}
        />
        <span className={`text-xs text-${color}-400`}>{eq.mid.toFixed(1)} dB</span>
      </div>

      {/* Low EQ */}
      <div className="text-center">
        <label className="text-xs text-gray-500 block mb-1">LOW</label>
        <input
          type="range"
          min="-12"
          max="12"
          step="0.5"
          value={eq.low}
          onChange={(e) => handleEQChange('low', parseFloat(e.target.value))}
          className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${color}-500`}
        />
        <span className={`text-xs text-${color}-400`}>{eq.low.toFixed(1)} dB</span>
      </div>
    </div>
  );
};

export default ChannelStrip;
