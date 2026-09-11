import React from 'react';
import { BotMessageSquare } from 'lucide-react';

interface AIAssistantLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Standardized AI Assistant Logo used consistently across the entire application
 */
export const AIAssistantLogo: React.FC<AIAssistantLogoProps> = ({
  className = 'w-4 h-4',
  size,
}) => {
  const sizeClass = size === 'xs' 
    ? 'w-3 h-3' 
    : size === 'sm' 
    ? 'w-3.5 h-3.5' 
    : size === 'lg' 
    ? 'w-5 h-5' 
    : size === 'md' 
    ? 'w-4 h-4' 
    : className;

  return (
    <BotMessageSquare 
      className={`shrink-0 ${sizeClass}`} 
      aria-hidden="true" 
    />
  );
};
