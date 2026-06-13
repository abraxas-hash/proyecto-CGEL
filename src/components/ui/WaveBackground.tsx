'use client';

import React from 'react';

export default function WaveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 dark:bg-[#0a192f] transition-colors duration-1000">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="15" stdDeviation="25" floodOpacity="0.15" floodColor="#000000" className="dark:flood-opacity-[0.4]" />
          </filter>
          <filter id="drop-shadow-heavy" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="25" stdDeviation="35" floodOpacity="0.2" floodColor="#000000" className="dark:flood-opacity-[0.6]" />
          </filter>
        </defs>

        {/* Background Base */}
        <rect width="1920" height="1080" className="fill-[#e6e9ef] dark:fill-[#002b36] transition-colors duration-1000" />

        {/* Layer 1 - Deep Teal (Dark) / Soft Silver (Light) */}
        <path 
          d="M0,0 L1920,0 L1920,300 C1400,500 1000,100 500,400 C200,550 0,300 0,300 Z" 
          className="fill-[#e0e5ec] dark:fill-[#073642] transition-colors duration-1000"
          filter="url(#drop-shadow)" 
        />

        {/* Layer 2 - Dark Blue Wave (Dark) / Light Silver (Light) */}
        <path 
          d="M0,200 C300,500 700,200 1100,500 C1500,800 1920,400 1920,400 L1920,1080 L0,1080 Z" 
          className="fill-[#d8e0e8] dark:fill-[#268bd2] transition-colors duration-1000"
          filter="url(#drop-shadow)" 
        />

        {/* Layer 3 - Purple Wave (Dark) / Neutral Silver (Light) */}
        <path 
          d="M0,450 C400,300 800,800 1300,500 C1600,300 1920,600 1920,600 L1920,1080 L0,1080 Z" 
          className="fill-[#d1dbe4] dark:fill-[#6c71c4] transition-colors duration-1000"
          filter="url(#drop-shadow-heavy)" 
        />

        {/* Layer 4 - Pink Wave (Dark) / Ice Silver (Light) */}
        <path 
          d="M0,700 C300,900 600,500 1000,700 C1400,900 1700,600 1920,800 L1920,1080 L0,1080 Z" 
          className="fill-[#c9d4de] dark:fill-[#d33682] transition-colors duration-1000"
          filter="url(#drop-shadow-heavy)" 
        />

        {/* Layer 5 - Orange Wave (Dark) / Steel Silver (Light) */}
        <path 
          d="M-100,1080 C200,800 600,1100 1000,800 C1400,500 1800,1000 2000,1080 Z" 
          className="fill-[#c2cdd7] dark:fill-[#cb4b16] transition-colors duration-1000"
          filter="url(#drop-shadow-heavy)" 
        />

        {/* Layer 6 - Yellow Corner (Dark) / Deeper Silver (Light) */}
        <path 
          d="M-50,1080 C150,950 400,1000 500,1080 Z" 
          className="fill-[#bbc6d0] dark:fill-[#b58900] transition-colors duration-1000"
          filter="url(#drop-shadow)" 
        />
        
        {/* Layer 7 - Right Orange/Yellow Corner (Dark) / Accent Silver (Light) */}
        <path 
          d="M1400,1080 C1500,850 1800,800 2000,1080 Z" 
          className="fill-[#b4bfca] dark:fill-[#ffb000] transition-colors duration-1000"
          filter="url(#drop-shadow)" 
        />
      </svg>
      {/* Overlay to darken slightly so cards still pop */}
      <div className="absolute inset-0 bg-transparent dark:bg-black/40 pointer-events-none transition-colors duration-1000"></div>
    </div>
  );
}
