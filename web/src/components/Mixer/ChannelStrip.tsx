import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setEQ, setDeckVolume } from '../../store/mixerSlice';
import RotaryKnob from '../shared/RotaryKnob';
import VerticalFader from '../shared/VerticalFader';

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

  const handleEQChange = (band: 'high' | 'mid' | 'low', value: number) => {
    dispatch(setEQ({ deck, band, value }));
  };

  const handleVolumeChange = (value: number) => {
    dispatch(setDeckVolume({ deck, volume: value }));
  };

  return (
    <div className="flex flex-col items-center gap-4 px-2">
      {/* Deck label */}
      <h3 className={`text-${color}-400 text-sm font-bold text-center uppercase tracking-wider`}>
        DECK {deck}
      </h3>

      {/* EQ Knobs */}
      <div className="flex flex-col gap-3">
        <RotaryKnob
          value={eq.high}
          min={-12}
          max={12}
          onChange={(value) => handleEQChange('high', value)}
          label="HIGH"
          color={color}
          unit=" dB"
        />
        <RotaryKnob
          value={eq.mid}
          min={-12}
          max={12}
          onChange={(value) => handleEQChange('mid', value)}
          label="MID"
          color={color}
          unit=" dB"
        />
        <RotaryKnob
          value={eq.low}
          min={-12}
          max={12}
          onChange={(value) => handleEQChange('low', value)}
          label="LOW"
          color={color}
          unit=" dB"
        />
      </div>

      {/* Channel Volume Fader */}
      <VerticalFader
        value={volume}
        onChange={handleVolumeChange}
        label="VOLUME"
        color={color}
        height={120}
      />
    </div>
  );
};

export default ChannelStrip;
