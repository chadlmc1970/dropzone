import React, { useState, useEffect, useRef } from 'react';

interface VerticalFaderProps {
  value: number; // 0-1 range
  onChange: (value: number) => void;
  label: string;
  color?: 'cyan' | 'orange' | 'purple';
  height?: number; // Pixel height
}

const VerticalFader: React.FC<VerticalFaderProps> = ({
  value,
  onChange,
  label,
  color = 'purple',
  height = 120,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Map color to Tailwind classes
  const getColorClasses = () => {
    switch (color) {
      case 'cyan':
        return {
          fill: 'from-cyan-500 to-cyan-300',
          text: 'text-cyan-400',
        };
      case 'orange':
        return {
          fill: 'from-orange-500 to-orange-300',
          text: 'text-orange-400',
        };
      case 'purple':
      default:
        return {
          fill: 'from-purple-500 to-purple-300',
          text: 'text-purple-400',
        };
    }
  };

  const colorClasses = getColorClasses();
  const fillHeight = value * 100; // Convert 0-1 to percentage
  const handlePosition = (1 - value) * (height - 24); // 24px handle height

  // Y-axis mouse tracking
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const relativeY = Math.max(0, Math.min(height, y));
      const newValue = 1 - relativeY / height; // Invert (top = 1, bottom = 0)
      onChange(Math.max(0, Math.min(1, newValue)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, height, onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    // Immediate jump to clicked position
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const relativeY = Math.max(0, Math.min(height, y));
      const newValue = 1 - relativeY / height;
      onChange(Math.max(0, Math.min(1, newValue)));
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      <span className="text-xs text-gray-300 font-semibold tracking-wide">
        {label}
      </span>

      {/* Track container */}
      <div className="relative" style={{ height: `${height}px`, width: '32px' }}>
        {/* Track background */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          className="absolute left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-b from-black to-gray-900 shadow-inner border border-gray-600 rounded-full cursor-pointer"
        />

        {/* Fill gradient (from bottom) */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-2 bottom-0 bg-gradient-to-t ${colorClasses.fill} rounded-full pointer-events-none`}
          style={{ height: `${fillHeight}%` }}
        />

        {/* Handle cap */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 shadow-lg shadow-black/50 pointer-events-none"
          style={{ top: `${handlePosition}px` }}
        />
      </div>

      {/* Value display */}
      <span className={`text-xs ${colorClasses.text} font-semibold`}>
        {Math.round(value * 100)}%
      </span>
    </div>
  );
};

export default VerticalFader;
