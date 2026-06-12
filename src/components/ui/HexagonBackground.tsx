'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const DARK_COLORS = [
  'rgba(15, 23, 42, 0.7)',    // slate-900
  'rgba(30, 41, 59, 0.4)',    // slate-800
  'rgba(2, 6, 23, 0.9)',      // slate-950
  'rgba(14, 165, 233, 0.03)', // sky-500 glow
  'rgba(15, 23, 42, 0.5)',    // slate-900
];

const LIGHT_COLORS = [
  'rgba(241, 245, 249, 0.7)', // slate-100
  'rgba(248, 250, 252, 0.9)', // slate-50
  'rgba(226, 232, 240, 0.4)', // slate-200
  'rgba(14, 165, 233, 0.03)', // sky-500 glow
  'rgba(241, 245, 249, 0.5)', // slate-100
];

export default function HexagonBackground() {
  const { resolvedTheme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  const activeColors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const hexSize = 60; // Size of the hexagon (radius to corner)
  const hexW = Math.sqrt(3) * hexSize;
  const hexH = 2 * hexSize;
  
  // Calculate how many columns and rows we need to cover the screen
  const cols = Math.ceil(dimensions.width / hexW) + 2;
  const rows = Math.ceil(dimensions.height / (hexH * 0.75)) + 2;

  const hexagons = [];

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      // For pointy-topped:
      // Every odd row is shifted by half width
      const isOddRow = row % 2 !== 0;
      const x = col * hexW + (isOddRow ? hexW / 2 : 0);
      const y = row * hexH * 0.75;
      
      // Calculate diagonal bands
      const bandIndex = Math.abs(Math.floor(col - row * 0.5));
      const colorIndex = bandIndex % activeColors.length;
      
      hexagons.push({
        key: `${row}-${col}`,
        x,
        y,
        color: activeColors[colorIndex]
      });
    }
  }

  // Points for a pointy-topped hexagon centered at 0,0
  const points = `
    0,${-hexSize} 
    ${hexW/2},${-hexSize/2} 
    ${hexW/2},${hexSize/2} 
    0,${hexSize} 
    ${-hexW/2},${hexSize/2} 
    ${-hexW/2},${-hexSize/2}
  `.trim();

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 dark:bg-[#11141d] transition-colors duration-1000">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {hexagons.map((hex) => (
          <polygon
            key={hex.key}
            points={points}
            transform={`translate(${hex.x}, ${hex.y})`}
            fill={hex.color}
            stroke={isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.2)"}
            strokeWidth="1"
            className="transition-colors duration-1000"
          />
        ))}
      </svg>
      {/* Optional overlay to soften it slightly so cards stand out */}
      <div className="absolute inset-0 bg-transparent dark:bg-black/40 pointer-events-none transition-colors duration-1000"></div>
    </div>
  );
}
