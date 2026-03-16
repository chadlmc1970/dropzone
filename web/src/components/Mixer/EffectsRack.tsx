import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setEffect } from '../../store/mixerSlice';
import RotaryKnob from '../shared/RotaryKnob';

const EffectsRack: React.FC = () => {
  const dispatch = useDispatch();
  const effects = useSelector((state: RootState) => state.mixer.effectsRack);

  const handleEffectChange = (
    effect: 'reverb' | 'delay' | 'filter' | 'echo',
    value: number
  ) => {
    dispatch(setEffect({ effect, value }));
  };

  return (
    <div className="pt-6 border-t border-gray-700">
      <h3 className="text-purple-400 text-xs font-bold text-center mb-4 uppercase tracking-wider">
        FX
      </h3>

      <div className="grid grid-cols-2 gap-4 px-2">
        <RotaryKnob
          value={effects.reverb}
          min={0}
          max={1}
          onChange={(value) => handleEffectChange('reverb', value)}
          label="REVERB"
          color="purple"
        />
        <RotaryKnob
          value={effects.delay}
          min={0}
          max={1}
          onChange={(value) => handleEffectChange('delay', value)}
          label="DELAY"
          color="purple"
        />
        <RotaryKnob
          value={effects.filter}
          min={0}
          max={1}
          onChange={(value) => handleEffectChange('filter', value)}
          label="FILTER"
          color="purple"
        />
        <RotaryKnob
          value={effects.echo}
          min={0}
          max={1}
          onChange={(value) => handleEffectChange('echo', value)}
          label="ECHO"
          color="purple"
        />
      </div>
    </div>
  );
};

export default EffectsRack;
