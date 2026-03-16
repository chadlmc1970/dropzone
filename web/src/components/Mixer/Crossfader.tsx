import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setCrossfader } from '../../store/mixerSlice';

const Crossfader: React.FC = () => {
  const dispatch = useDispatch();
  const position = useSelector((state: RootState) => state.mixer.crossfaderPosition);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCrossfader(parseFloat(e.target.value)));
  };

  return (
    <div className="py-4">
      <h3 className="text-purple-400 text-sm font-bold text-center mb-3 uppercase tracking-wider">
        CROSSFADER
      </h3>

      {/* Crossfader track */}
      <div className="flex items-center gap-3 px-4">
        <span className="text-cyan-400 text-xs font-bold">A</span>

        <div className="relative flex-1">
          {/* Track background */}
          <div className="h-4 bg-gradient-to-b from-black to-gray-900 shadow-inner border border-gray-600 rounded-full" />

          {/* HTML range input overlay */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={position}
            onChange={handleChange}
            className="absolute inset-0 w-full h-4 appearance-none bg-transparent cursor-pointer"
            style={{
              WebkitAppearance: 'none',
            }}
          />

          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: linear-gradient(to bottom, rgb(75, 85, 99), rgb(31, 41, 55));
              border: 2px solid rgb(107, 114, 128);
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
              cursor: pointer;
            }

            input[type="range"]::-moz-range-thumb {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: linear-gradient(to bottom, rgb(75, 85, 99), rgb(31, 41, 55));
              border: 2px solid rgb(107, 114, 128);
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
              cursor: pointer;
            }
          `}</style>
        </div>

        <span className="text-orange-400 text-xs font-bold">B</span>
      </div>

      {/* Position indicator */}
      <div className="text-center mt-2">
        <span className="text-xs text-gray-400 font-semibold">
          {(position * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default Crossfader;
