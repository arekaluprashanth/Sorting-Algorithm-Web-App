import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { VisualizerAIContext } from '../types';

interface VisualizerContextType {
  visualizerContext: VisualizerAIContext;
  getLatestVisualizerContext: () => VisualizerAIContext;
  updateVisualizerContext: (ctx: Partial<VisualizerAIContext>) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  toggleAssistant: () => void;
  queuedPrompt: string | null;
  setQueuedPrompt: (prompt: string | null) => void;
  askAIWithPrompt: (prompt: string) => void;
}

const VisualizerContext = createContext<VisualizerContextType | undefined>(undefined);

export const VisualizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const visualizerContextRef = useRef<VisualizerAIContext>({});
  const [visualizerContext, setVisualizerContext] = useState<VisualizerAIContext>({});
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [queuedPrompt, setQueuedPrompt] = useState<string | null>(null);
  const isAssistantOpenRef = useRef<boolean>(false);
  isAssistantOpenRef.current = isAssistantOpen;

  const getLatestVisualizerContext = useCallback(() => {
    return visualizerContextRef.current;
  }, []);

  const updateVisualizerContext = useCallback((partial: Partial<VisualizerAIContext>) => {
    visualizerContextRef.current = {
      ...visualizerContextRef.current,
      ...partial,
    };

    // Only trigger React state updates when the assistant is actually open to prevent unnecessary app-wide re-renders
    if (isAssistantOpenRef.current) {
      setVisualizerContext((prev) => ({
        ...prev,
        ...partial,
      }));
    }
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsAssistantOpen((prev) => {
      const next = !prev;
      if (next) {
        // Sync context when opened
        setVisualizerContext(visualizerContextRef.current);
      }
      return next;
    });
  }, []);

  const askAIWithPrompt = useCallback((prompt: string) => {
    setQueuedPrompt(prompt);
    setVisualizerContext(visualizerContextRef.current);
    setIsAssistantOpen(true);
  }, []);

  return (
    <VisualizerContext.Provider
      value={{
        visualizerContext,
        getLatestVisualizerContext,
        updateVisualizerContext,
        isAssistantOpen,
        setIsAssistantOpen,
        toggleAssistant,
        queuedPrompt,
        setQueuedPrompt,
        askAIWithPrompt,
      }}
    >
      {children}
    </VisualizerContext.Provider>
  );
};

export function useVisualizerContext(): VisualizerContextType {
  const context = useContext(VisualizerContext);
  if (!context) {
    throw new Error('useVisualizerContext must be used within a VisualizerProvider');
  }
  return context;
}
