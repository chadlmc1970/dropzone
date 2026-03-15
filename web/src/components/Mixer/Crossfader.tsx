import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCrossfader } from '../../store/mixerSlice';

const Crossfader: React.FC = () => {
  const dispatch = useDispatch();
  const position = useSelector((state: RootState) => state.mixer.crossfaderPosition);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCrossfader(parseFloat(e.target.value)));
  };

  return (
    <div className="space-y-2">
      <h3 className="text-purple-400 text-sm font-bold text-center">CROSSFADER</h3>
      <div className="flex items-center gap-2">
        <span className="text-cyan-400 text-xs font-bold">A</span>
        <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={position}
            onChange={handleChange}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            style={{
              background: `linear-gradient(to right,
                #06b6d4 0%,
                #06b6d4 ${position * 50}%,
                #9333ea ${position * 50}%,
                #9333ea ${position * 100}%,
                #f97316 ${position * 100}%,
                #f97316 100%)`,
            }}
          />
        </div>
        <span className="text-orange-400 text-xs font-bold">B</span>
      </div>
      <div className="text-center">
        <span className="text-xs text-gray-400">
          {position === 0 ? 'Full A' : position === 1 ? 'Full B' : `${(position * 100).toFixed(0)}%`}
        </span>
      </div>
    </div>
  );
};

export default Crossfader;
