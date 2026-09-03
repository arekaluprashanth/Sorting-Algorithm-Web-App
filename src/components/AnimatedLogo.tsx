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
      <rect x="12" y="34" width="8" height="18" rx="2" fill="#6366f1" />
      <rect x="24" y="25" width="8" height="27" rx="2" fill="#22c55e" />
      <rect x="36" y="16" width="8" height="36" rx="2" fill="#f59e0b" />
      <rect x="48" y="9" width="5" height="43" rx="2" fill="#f43f5e" />
    </g>
    <path className="animated-logo-sweep" d="M10 53h44" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </svg>
);
