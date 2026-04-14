import React from 'react';

export const LiquidAurora = () => {
  return (
    <div className="hero-section fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none z-0">
      {/* Carbon fiber pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-10" />
      
      {/* The background shapes that form the aurora */}
      <div className="liquid-shape shape-1" />
      <div className="liquid-shape shape-2" />
      <div className="liquid-shape shape-3" />
    </div>
  );
};
