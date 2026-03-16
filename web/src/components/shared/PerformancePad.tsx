import React from 'react';

interface PerformancePadProps {
  label: string | number;
  active: boolean;
  onClick: () => void;
  color: 'cyan' | 'orange';
  index: number;
}

const PerformancePad: React.FC<PerformancePadProps> = ({
  label,
  active,
  onClick,
  color,
}) => {
  // Map color to LED glow shadow
  const getShadowClass = (c: 'cyan' | 'orange'): string => {
    return c === 'cyan'
      ? 'shadow-[0_0_15px_rgba(6,182,212,0.6)]'
      : 'shadow-[0_0_15px_rgba(249,115,22,0.6)]';
  };

  // Map color to background classes
  const getColorClasses = () => {
    switch (color) {
      case 'cyan':
        return {
          bg: 'bg-cyan-600',
          border: 'border-cyan-400',
          hoverBg: 'hover:bg-cyan-500',
          text: 'text-cyan-400',
        };
      case 'orange':
        return {
          bg: 'bg-orange-600',
          border: 'border-orange-400',
          hoverBg: 'hover:bg-orange-500',
          text: 'text-orange-400',
        };
    }
  };

  const colorClasses = getColorClasses();

  if (active) {
    return (
      <button
        onClick={onClick}
        className={`h-12 rounded ${colorClasses.bg} border-2 ${colorClasses.border} ${colorClasses.hoverBg} ${getShadowClass(color)} text-white font-bold transition-all active:scale-95 text-sm`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`h-12 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700 ${colorClasses.text} transition-colors text-xs font-semibold`}
    >
      {label}
    </button>
  );
};

export default PerformancePad;
