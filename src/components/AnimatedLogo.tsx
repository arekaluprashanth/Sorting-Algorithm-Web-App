import React from 'react';
import logoUrl from '../../assets/sorting-algorithm-logo.svg';

interface AnimatedLogoProps {
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = '' }) => (
  <img
    src={logoUrl}
    className={`animated-logo gpu-accelerated ${className}`} 
    alt="Sorting Algoritm Web App logo"
    style={{ imageRendering: 'crisp-edges', backfaceVisibility: 'hidden' }}
  />
);
