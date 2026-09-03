import React from 'react';

interface AnimatedLogoProps {
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = '' }) => (
  <svg
    className={`animated-logo ${className}`}
    viewBox="0 0 64 64"
    role="img"
    aria-label="Sorting Algorithm Web App logo"
  >
    <rect width="64" height="64" rx="14" fill="#0f172a" />
    <circle className="animated-logo-orbit" cx="32" cy="32" r="20" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="3 5" />
    <g className="animated-logo-nodes">
      <circle cx="32" cy="12" r="5" fill="#38bdf8" />
      <circle cx="49" cy="42" r="5" fill="#34d399" />
      <circle cx="15" cy="42" r="5" fill="#fbbf24" />
    </g>
    <path className="animated-logo-sweep" d="M32 25v14M25 32h14" fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
