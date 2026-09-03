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
    <g className="animated-logo-bars">
      <rect x="12" y="40" width="10" height="12" rx="3" fill="#38bdf8" />
      <rect x="27" y="31" width="10" height="21" rx="3" fill="#34d399" />
      <rect x="42" y="20" width="10" height="32" rx="3" fill="#fbbf24" />
    </g>
    <path className="animated-logo-sweep" d="M12 53h40M43 13l9 0-4 4" fill="none" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
