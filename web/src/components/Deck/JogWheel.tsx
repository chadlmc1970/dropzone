import React, { useState, useRef, useEffect } from 'react';

interface JogWheelProps {
  deck: 'A' | 'B';
  isPlaying: boolean;
  onScratch: (delta: number) => void;
}

const JogWheel: React.FC<JogWheelProps> = ({ deck, isPlaying, onScratch }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeZone, setActiveZone] = useState<'center' | 'outer' | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const lastAngle = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  const glowColor = deck === 'A' ? 'rgba(6,182,212,0.4)' : 'rgba(249,115,22,0.4)';
  const accentColor = deck === 'A' ? 'rgb(6,182,212)' : 'rgb(249,115,22)';

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

  const getAngle = (e: MouseEvent | React.MouseEvent): number => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = e.clientX;
    const clientY = e.clientY;

    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  // Zone detection and interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceFromCenter = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );

    // Zone detection: 120px radius total, 70px center platter
    const isCenterPlatter = distanceFromCenter <= 70;
    const isOuterRing = distanceFromCenter > 70 && distanceFromCenter <= 120;

    if (isCenterPlatter) {
      setActiveZone('center');
      setIsSpinning(true);
    } else if (isOuterRing) {
      setActiveZone('outer');
    }

    setIsDragging(true);
    lastAngle.current = getAngle(e);
  };

  useEffect(() => {
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
      setIsSpinning(false);
      setActiveZone(null);
    };

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
        className="relative w-60 h-60 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        {/* Outer rim (pitch bend zone) */}
        <div
          className="absolute inset-0 rounded-full border-4 border-gray-600"
          style={{
            background: 'linear-gradient(135deg, #4b5563, #374151, #1f2937)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.7),
              inset 0 2px 4px rgba(255,255,255,0.1),
              inset 0 -2px 4px rgba(0,0,0,0.4)
              ${activeZone === 'outer' ? `, 0 0 20px ${glowColor}` : ''}
            `,
          }}
        >
          {/* Tick marks around the rim */}
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: '2px',
                height: '8px',
                background: i % 6 === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                transformOrigin: '50% 0',
                transform: `translate(-50%, -112px) rotate(${i * 15}deg)`,
              }}
            />
          ))}

          {/* Middle ring */}
          <div
            className="absolute inset-4 rounded-full border-2 border-gray-600"
            style={{
              background: 'linear-gradient(135deg, #1f2937, #111827, #0f172a)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
            }}
          >
            {/* Center platter (scratch zone) */}
            <div
              className="absolute inset-8 rounded-full border-2"
              style={{
                background: 'linear-gradient(135deg, #4b5563, #374151, #1f2937)',
                borderColor: activeZone === 'center' ? accentColor : '#6b7280',
                boxShadow: `
                  inset 0 1px 3px rgba(255,255,255,0.15),
                  inset 0 -1px 3px rgba(0,0,0,0.4)
                  ${activeZone === 'center' ? `, 0 0 15px ${glowColor}` : ''}
                `,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {/* Rotation indicator (white mark at 12 o'clock) */}
              <div
                className="absolute top-2 left-1/2 w-1 h-8 rounded-full"
                style={{
                  transform: 'translateX(-50%)',
                  background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
                }}
              />

              {/* Vinyl groove rings */}
              <div
                className="absolute inset-4 rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              />
              <div
                className="absolute inset-8 rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,0.03)',
                }}
              />

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-3xl font-bold tracking-wider"
                  style={{
                    color: accentColor,
                    transform: `rotate(-${rotation}deg)`,
                    textShadow: `0 0 10px ${glowColor}`,
                  }}
                >
                  {deck}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spinning indicator */}
        {isSpinning && (
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            SCRATCH
          </div>
        )}
      </div>
    </div>
  );
};

export default JogWheel;
