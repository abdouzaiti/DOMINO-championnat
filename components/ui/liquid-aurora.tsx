import React from 'react';

export const LiquidAurora = () => {
  return (
    <div className="hero-section absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
      {/* The background shapes that form the aurora */}
      <div className="liquid-shape shape-1" />
      <div className="liquid-shape shape-2" />
      <div className="liquid-shape shape-3" />

      {/* The content container is now empty */}
      <div className="relative z-10 text-center p-8 max-w-2xl">
      </div>
    </div>
  );
};
