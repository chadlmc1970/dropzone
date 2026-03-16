import React, { useState, useEffect, useRef } from 'react';

interface RotaryKnobProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  color?: 'cyan' | 'orange' | 'purple';
  unit?: string;
  defaultValue?: number;
}

const RotaryKnob: React.FC<RotaryKnobProps> = ({
  value,
  min,
  max,
  onChange,
  label,
  color = 'purple',
  unit = ''
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Convert value to angle (0° at top = min, 270° at 9 o'clock = max)
  const valueToAngle = (val: number): number => {
    const normalized = (val - min) / (max - min);
    return normalized * 270 - 135; // -135° to 135° (0° at top)
  };

  // Convert angle to value
  const angleToValue = (angle: number): number => {
    // Normalize angle to 0-270 range
    let normalized = (angle + 135) % 360;
    if (normalized < 0) normalized += 360;

    // Clamp to usable range (0-270)
    if (normalized > 270) {
      // In dead zone (270-360), snap to nearest edge
      normalized = normalized > 315 ? 0 : 270;
    }

    // Map to value range
    const valueRange = max - min;
    const calculatedValue = min + (normalized / 270) * valueRange;

    return Math.max(min, Math.min(max, calculatedValue));
  };

  // Get color class for value display
  const getColorClass = (): string => {
    switch (color) {
      case 'cyan':
        return 'text-cyan-400';
      case 'orange':
        return 'text-orange-400';
      case 'purple':
      default:
        return 'text-purple-400';
    }
  };

  // Get color for knob indicator
  const getIndicatorColor = (): string => {
    switch (color) {
      case 'cyan':
        return 'bg-cyan-400';
      case 'orange':
        return 'bg-orange-400';
      case 'purple':
      default:
        return 'bg-purple-400';
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate angle from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Math.atan2 returns angle in radians, convert to degrees
      // Offset by 90° so 0° is at top
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

      // Normalize to 0-360
      if (angle < 0) angle += 360;

      const newValue = angleToValue(angle);
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, onChange]);

  const currentAngle = valueToAngle(value);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label */}
      <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
        {label}
      </div>

      {/* Knob Container */}
      <div className="relative">
        {/* Base Circle - 3D hardware styling */}
        <div
          ref={knobRef}
          onMouseDown={handleMouseDown}
          className="w-16 h-16 rounded-full cursor-pointer select-none relative
                     bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900
                     border-2 border-gray-600
                     shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_4px_8px_rgba(0,0,0,0.4)]"
          style={{
            transform: 'perspective(100px) rotateX(5deg)'
          }}
        >
          {/* Indicator Line */}
          <div
            className="absolute inset-0 flex items-start justify-center"
            style={{
              transform: `rotate(${currentAngle}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <div
              className={`w-1 h-6 rounded-full ${getIndicatorColor()}
                         shadow-lg mt-2`}
            />
          </div>

          {/* Center Cap */}
          <div
            className="absolute inset-0 m-auto w-8 h-8 rounded-full
                       bg-gradient-to-br from-gray-600 to-gray-800
                       border border-gray-500
                       shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"
          />
        </div>
      </div>

      {/* Value Display */}
      <div className={`text-sm font-mono font-bold ${getColorClass()}`}>
        {value.toFixed(0)}{unit}
      </div>
    </div>
  );
};

export default RotaryKnob;
