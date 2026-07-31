import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import type { VisualizationState } from '../types';

interface VisualizerProps {
  state: VisualizationState;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  state,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange
}) => {
  const { arrayState, activeIndices, swapIndices, isPlaying, currentStep, totalSteps, speedMs } = state;

  const maxVal = useMemo(() => Math.max(...arrayState, 1), [arrayState]);

  return (
    <div className="flex flex-col h-full">
      {/* Array Visualization Area */}
      <div className="flex-1 min-h-[300px] flex items-end justify-center gap-1 p-4 bg-black/20 rounded-xl border border-white/5 mb-4 overflow-hidden relative">
        <AnimatePresence>
          {arrayState.map((val, idx) => {
            const height = (val / maxVal) * 100;
            const isComparing = activeIndices.includes(idx);
            const isSwapping = swapIndices.includes(idx);
            
            let bgColor = 'bg-blue-500';
            if (isSwapping) bgColor = 'bg-rose-500';
            else if (isComparing) bgColor = 'bg-amber-400';
            
            return (
              <motion.div
                key={val} // Important for layout animations when values swap places
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 25,
                  mass: 0.5
                }}
                className={`w-full max-w-[40px] min-w-[8px] rounded-t-sm ${bgColor} relative group`}
                style={{ height: `${height}%` }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  {val}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {arrayState.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
            Generate a dataset to start visualization
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onReset}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onStepBackward}
            disabled={currentStep === 0}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Step Backward"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button 
            onClick={isPlaying ? onPause : onPlay}
            disabled={totalSteps === 0}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>

          <button 
            onClick={onStepForward}
            disabled={currentStep >= totalSteps}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Step Forward"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Speed */}
        <div className="flex-1 flex items-center gap-6 w-full sm:w-auto">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>Progress</span>
              <span>{currentStep} / {totalSteps} steps</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-200" 
                style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="w-32">
            <label className="block text-xs text-neutral-400 mb-1">Speed</label>
            <select 
              value={speedMs} 
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value={1000}>0.5x (Slow)</option>
              <option value={400}>1x (Normal)</option>
              <option value={150}>2x (Fast)</option>
              <option value={50}>4x (Very Fast)</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
};
