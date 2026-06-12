'use client';

import React from 'react';

export default function WaveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a192f] transition-colors duration-1000">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="15" stdDeviation="25" floodOpacity="0.4" floodColor="#000000" />
          </filter>
          <filter id="drop-shadow-heavy" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="25" stdDeviation="35" floodOpacity="0.6" floodColor="#000000" />
          </filter>
        </defs>

        {/* Background Base */}
        <rect width="1920" height="1080" fill="#002b36" />

        {/* Layer 1 - Deep Teal */}
        <path 
          d="M0,0 L1920,0 L1920,300 C1400,500 1000,100 500,400 C200,550 0,300 0,300 Z" 
          fill="#073642" 
          filter="url(#drop-shadow)" 
        />

        {/* Layer 2 - Dark Blue Wave */}
        <path 
          d="M0,200 C300,500 700,200 1100,500 C1500,800 1920,400 1920,400 L1920,1080 L0,1080 Z" 
          fill="#268bd2" 
          filter="url(#drop-shadow)" 
        />

        {/* Layer 3 - Purple Wave */}
        <path 
          d="M0,450 C400,300 800,800 1300,500 C1600,300 1920,600 1920,600 L1920,1080 L0,1080 Z" 
          fill="#6c71c4" 
          filter="url(#drop-shadow-heavy)" 
        />

        {/* Layer 4 - Pink Wave */}
        <path 
          d="M0,700 C300,900 600,500 1000,700 C1400,900 1700,600 1920,800 L1920,1080 L0,1080 Z" 
          fill="#d33682" 
          filter="url(#drop-shadow-heavy)" 
        />

        {/* Layer 5 - Orange Wave */}
        <path 
          d="M-100,1080 C200,800 600,1100 1000,800 C1400,500 1800,1000 2000,1080 Z" 
          fill="#cb4b16" 
          filter="url(#drop-shadow-heavy)" 
        />

        {/* Layer 6 - Yellow Corner */}
        <path 
          d="M-50,1080 C150,950 400,1000 500,1080 Z" 
          fill="#b58900" 
          filter="url(#drop-shadow)" 
        />
        
        {/* Layer 7 - Right Orange/Yellow Corner */}
        <path 
          d="M1400,1080 C1500,850 1800,800 2000,1080 Z" 
          fill="#ffb000" 
          filter="url(#drop-shadow)" 
        />
      </svg>
      {/* Overlay to darken slightly so cards still pop */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 pointer-events-none transition-colors duration-1000"></div>
    </div>
  );
}
