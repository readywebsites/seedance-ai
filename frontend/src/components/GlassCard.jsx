import React, { useRef } from 'react';

export default function GlassCard({ children, className = '', hoverGlow = true, ...props }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!hoverGlow || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glass-panel rounded-2xl p-6 glow-card transition-all duration-300 relative ${
        hoverGlow ? 'hover:border-brand-purple/40 hover:shadow-2xl hover:shadow-brand-purple/10' : ''
      } ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
