import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../shared/lib/utils';

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen: externalIsOpen,
  onToggle,
  className,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen ?? internalIsOpen;

  const handleToggle = () => {
    setInternalIsOpen(!internalIsOpen);
    onToggle?.();
  };

  return (
    <div className={cn('border border-white/10 rounded-xl glass-panel overflow-hidden', className)}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-4 flex items-center justify-between text-left text-xs font-mono font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer select-none"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('w-4 h-4 text-neutral-400 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 text-xs text-neutral-400 border-t border-white/5 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Accordion = AccordionItem;
