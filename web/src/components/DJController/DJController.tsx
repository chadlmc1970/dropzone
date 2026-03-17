import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import Deck from '../Deck/Deck';
import Mixer from '../Mixer/Mixer';
import MobileFallback from '../MobileFallback/MobileFallback';

const DJController: React.FC = () => {
  const mode = useSelector((state: RootState) => state.ui.mode);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initialize mobile state on mount (client-side only)
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show mobile fallback on small screens
  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg px-6 py-3 border border-cyan-500/30">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider">
              Mode: {mode}
            </span>
          </div>
        </div>

        {/* Main Controller */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deck A */}
            <div>
              <Deck deck="A" />
            </div>

            {/* Mixer */}
            <div>
              <Mixer />
            </div>

            {/* Deck B */}
            <div>
              <Deck deck="B" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>DropZone - Professional DJ Mixing</p>
        </div>
      </div>
    </div>
  );
};

export default DJController;
