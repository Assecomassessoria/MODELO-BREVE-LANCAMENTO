import React, { useEffect, useState } from 'react';

interface SpotlightsProps {
  enabled: boolean;
  intensity: number; // 0 to 1
}

export default function Spotlights({ enabled, intensity }: SpotlightsProps) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate offsets (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) return null;

  // Calculate dynamic rotation offsets for the two searchlights based on mouse position
  const leftSway = -5 + mousePos.x * 12;
  const rightSway = 5 + mousePos.x * 15;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Searchlight 1 (Left Side) */}
      <div 
        className="absolute bottom-0 left-[25%] w-[120px] h-[90vh] origin-bottom transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-50%) rotate(${leftSway}deg)`,
          background: `linear-gradient(to top, rgba(59, 130, 246, ${0.15 * intensity}) 0%, rgba(59, 130, 246, ${0.05 * intensity}) 40%, rgba(59, 130, 246, 0) 100%)`,
          clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Searchlight 2 (Right Side) */}
      <div 
        className="absolute bottom-0 right-[25%] w-[140px] h-[95vh] origin-bottom transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(50%) rotate(${rightSway}deg)`,
          background: `linear-gradient(to top, rgba(37, 99, 235, ${0.18 * intensity}) 0%, rgba(37, 99, 235, ${0.06 * intensity}) 50%, rgba(37, 99, 235, 0) 100%)`,
          clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Center ambient glow from the ground */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[150px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom, rgba(37, 99, 235, ${0.15 * intensity}) 0%, rgba(0, 0, 0, 0) 70%)`,
          filter: 'blur(15px)',
        }}
      />
    </div>
  );
}
