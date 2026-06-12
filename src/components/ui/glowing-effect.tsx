'use client';

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface GlowingEffectProps {
  blur?: number;
  borderWidth?: number;
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
}

export const GlowingEffect = ({
  blur = 0,
  borderWidth = 3,
  spread = 80,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
}: GlowingEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (disabled || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      mouseX.set(x);
      mouseY.set(y);
      
      // Calculate proximity (opacity fades in when mouse is near)
      const distance = Math.sqrt(
        Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
      );
      
      // Simple proximity check for the glow
      if (
        x > -proximity &&
        x < width + proximity &&
        y > -proximity &&
        y < height + proximity
      ) {
        opacity.set(1);
      } else {
        opacity.set(0);
      }
    };

    const handleMouseLeave = () => {
      opacity.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled, glow, proximity, opacity, mouseX, mouseY]);

  if (disabled || !glow) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit] pointer-events-none"
      style={{
        padding: borderWidth,
        margin: -borderWidth,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: useMotionTemplate`
            radial-gradient(
              ${spread}px circle at ${mouseX}px ${mouseY}px,
              var(--glow-color, rgba(14, 165, 233, 0.4)),
              transparent 100%
            )
          `,
          filter: blur > 0 ? `blur(${blur}px)` : "none",
        }}
      />
      {/* Inner mask to cut out the center, leaving only the border */}
      <div className="absolute inset-[var(--border-width)] rounded-[inherit] bg-white dark:bg-[#111] z-0" 
           style={{ '--border-width': `${borderWidth}px` } as any} 
      />
    </div>
  );
};
