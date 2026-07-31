import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isIconOnly?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  isIconOnly = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 border border-blue-500/30',
    secondary:
      'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-white/10 dark:bg-white/10 dark:hover:bg-white/15',
    outline:
      'bg-transparent hover:bg-white/5 text-neutral-300 hover:text-white border border-white/15',
    ghost:
      'bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 border border-rose-500/30',
  };

  const sizes = {
    sm: isIconOnly ? 'p-1.5' : 'text-xs px-3 py-1.5 gap-1.5',
    md: isIconOnly ? 'p-2.5' : 'text-sm px-4 py-2 gap-2',
    lg: isIconOnly ? 'p-3.5' : 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      {!isIconOnly && children && <span>{children}</span>}
      {!isLoading && !isIconOnly && rightIcon}
    </button>
  );
};

export const PrimaryButton: React.FC<ButtonProps> = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton: React.FC<ButtonProps> = (props) => <Button variant="secondary" {...props} />;
export const DangerButton: React.FC<ButtonProps> = (props) => <Button variant="danger" {...props} />;
export const GhostButton: React.FC<ButtonProps> = (props) => <Button variant="ghost" {...props} />;
export const IconButton: React.FC<ButtonProps> = (props) => <Button isIconOnly variant="ghost" {...props} />;
export const LoadingButton: React.FC<ButtonProps> = (props) => <Button isLoading {...props} />;
