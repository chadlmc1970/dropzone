import React, { useRef, useState, useEffect } from 'react';

interface JogWheelProps {
  deck: 'A' | 'B';
  isPlaying: boolean;
  onScratch: (delta: number) => void;
}

const JogWheel: React.FC<JogWheelProps> = ({ deck, isPlaying, onScratch }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef<number>(0);
  const animationRef = useRef<number>();

  const color = deck === 'A' ? 'cyan' : 'orange';

  // Auto-rotation when playing
  useEffect(() => {
    if (isPlaying && !isDragging) {
      const animate = () => {
        setRotation((prev) => (prev + 1) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isDragging]);

  const getAngle = (e: MouseEvent | TouchEvent): number => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    return angle;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastAngle.current = getAngle(e.nativeEvent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const currentAngle = getAngle(e);
    let delta = currentAngle - lastAngle.current;

    // Handle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    setRotation((prev) => (prev + delta + 360) % 360);
    onScratch(delta);
    lastAngle.current = currentAngle;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="flex justify-center">
      <div
        ref={wheelRef}
        className={`w-40 h-40 rounded-full bg-gradient-to-b from-gray-800 to-black border-4 border-${color}-500/30 flex items-center justify-center cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        } select-none transition-transform`}
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
      >
        {/* Inner platter */}
        <div className={`w-32 h-32 rounded-full bg-black border-2 border-${color}-500/50 flex items-center justify-center relative`}>
          {/* Rotation indicator line */}
          <div
            className={`absolute top-2 left-1/2 w-1 h-12 bg-${color}-400 rounded-full`}
            style={{ transform: 'translateX(-50%)' }}
          />
          {/* Center label */}
          <span className={`text-${color}-400 text-sm font-bold`}>JOG</span>
        </div>
      </div>
    </div>
  );
};

export default JogWheel;
