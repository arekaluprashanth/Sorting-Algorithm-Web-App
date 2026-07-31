import React from 'react';
import { Toaster, toast } from 'sonner';

export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(18, 18, 26, 0.9)',
          color: '#f8fafc',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
          backdropFilter: 'blur(12px)',
          fontFamily: 'sans-serif',
          fontSize: '0.875rem',
        },
      }}
    />
  );
};

export { toast };
