import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setMasterVolume } from '../../store/mixerSlice';
import ChannelStrip from './ChannelStrip';
import Crossfader from './Crossfader';
import EffectsRack from './EffectsRack';
import VerticalFader from '../shared/VerticalFader';

const Mixer: React.FC = () => {
  const dispatch = useDispatch();
  const masterVolume = useSelector((state: RootState) => state.mixer.masterVolume);

  const handleMasterVolumeChange = (value: number) => {
    dispatch(setMasterVolume(value));
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      {/* Mixer Header */}
      <div className="flex items-center justify-center mb-4 pb-3 border-b border-purple-500/30">
        <h2 className="text-2xl font-bold text-purple-400">MIXER</h2>
      </div>

      {/* Channel Strips - Deck A and Deck B */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChannelStrip deck="A" />
        <ChannelStrip deck="B" />
      </div>

      {/* Crossfader */}
      <Crossfader />

      {/* Master Volume */}
      <div className="flex justify-center py-4">
        <VerticalFader
          value={masterVolume}
          onChange={handleMasterVolumeChange}
          label="MASTER"
          color="purple"
          height={120}
        />
      </div>

      {/* Effects Rack */}
      <EffectsRack />
    </div>
  );
};

export default Mixer;
