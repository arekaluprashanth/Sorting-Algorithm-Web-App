import { useState, useEffect, useCallback, useRef } from 'react';
import type { VisualizationTrace, VisualizationState } from '../types';

export function useVisualization(trace: VisualizationTrace | null) {
  const [state, setState] = useState<VisualizationState>({
    isPlaying: false,
    currentStep: 0,
    totalSteps: trace ? trace.operations.length : 0,
    speedMs: 200,
    arrayState: trace ? [...trace.initialState] : [],
    activeIndices: [],
    swapIndices: [],
  });

  const timerRef = useRef<number | null>(null);

  // Initialize or reset when trace changes
  useEffect(() => {
    if (trace) {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentStep: 0,
        totalSteps: trace.operations.length,
        arrayState: [...trace.initialState],
        activeIndices: [],
        swapIndices: [],
      }));
    } else {
      setState(prev => ({ ...prev, isPlaying: false, totalSteps: 0, arrayState: [] }));
    }
  }, [trace]);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setState(s => ({ ...s, isPlaying: false }));
    stopTimer();
  }, [stopTimer]);

  const applyStep = useCallback((stepIndex: number) => {
    if (!trace) return;
    if (stepIndex < 0 || stepIndex > trace.operations.length) return;

    // To accurately reflect state at step N, we must playback from start to N
    // since some operations (swaps) mutate the state.
    let currentState = [...trace.initialState];
    let active: number[] = [];
    let swapped: number[] = [];

    for (let i = 0; i < stepIndex; i++) {
      const op = trace.operations[i]!;
      if (op.type === 'swap' && op.state) {
        currentState = [...op.state];
      }
      
      // If this is the *last* step we are applying, capture its highlights
      if (i === stepIndex - 1) {
        if (op.type === 'compare') {
          if (op.i !== undefined) active.push(op.i);
          if (op.j !== undefined) active.push(op.j);
        } else if (op.type === 'swap') {
          if (op.i !== undefined) swapped.push(op.i);
          if (op.j !== undefined) swapped.push(op.j);
        }
      }
    }

    setState(s => ({
      ...s,
      currentStep: stepIndex,
      arrayState: currentState,
      activeIndices: active,
      swapIndices: swapped,
    }));
  }, [trace]);

  const stepForward = useCallback(() => {
    if (!trace) return;
    setState(s => {
      const nextStep = Math.min(s.currentStep + 1, trace.operations.length);
      setTimeout(() => applyStep(nextStep), 0);
      return s;
    });
  }, [trace, applyStep]);

  const stepBackward = useCallback(() => {
    if (!trace) return;
    setState(s => {
      const prevStep = Math.max(s.currentStep - 1, 0);
      setTimeout(() => applyStep(prevStep), 0);
      return s;
    });
  }, [trace, applyStep]);

  const reset = useCallback(() => {
    pause();
    applyStep(0);
  }, [pause, applyStep]);

  const play = useCallback(() => {
    if (!trace || state.currentStep >= trace.operations.length) {
      // Auto-restart if at end
      if (state.currentStep >= (trace?.operations.length || 0)) {
        applyStep(0);
      }
    }
    setState(s => ({ ...s, isPlaying: true }));
  }, [trace, state.currentStep, applyStep]);

  // Handle Playback Loop
  useEffect(() => {
    if (state.isPlaying) {
      timerRef.current = window.setInterval(() => {
        setState(s => {
          if (s.currentStep >= s.totalSteps) {
            stopTimer();
            return { ...s, isPlaying: false, activeIndices: [], swapIndices: [] };
          }
          setTimeout(() => applyStep(s.currentStep + 1), 0);
          return s;
        });
      }, state.speedMs);
    } else {
      stopTimer();
    }

    return stopTimer;
  }, [state.isPlaying, state.speedMs, state.totalSteps, applyStep, stopTimer]);

  const setSpeed = useCallback((speedMs: number) => {
    setState(s => ({ ...s, speedMs }));
  }, []);

  return {
    state,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
  };
}
