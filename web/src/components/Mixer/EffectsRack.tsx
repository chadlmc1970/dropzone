import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setEffect } from '../../store/mixerSlice';

const EffectsRack: React.FC = () => {
  const dispatch = useDispatch();
  const effects = useSelector((state: RootState) => state.mixer.effectsRack);

  const handleEffectChange = (effect: keyof typeof effects, value: number) => {
    dispatch(setEffect({ effect, value }));
  };

  const effectsList: Array<{ key: keyof typeof effects; label: string }> = [
    { key: 'reverb', label: 'REVERB' },
    { key: 'delay', label: 'DELAY' },
    { key: 'filter', label: 'FILTER' },
    { key: 'echo', label: 'ECHO' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-purple-400 text-xs font-bold text-center">EFFECTS</h3>
      <div className="space-y-2">
        {effectsList.map(({ key, label }) => (
          <div key={key} className="text-center">
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={effects[key]}
              onChange={(e) => handleEffectChange(key, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-xs text-purple-400">{(effects[key] * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EffectsRack;
