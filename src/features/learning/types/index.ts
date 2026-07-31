export interface AlgorithmMetadata {
  id: string;
  name: string;
  inventor: string;
  year: string;
  category: 'comparison' | 'non-comparison' | 'hybrid';
  isStable: boolean;
  isInPlace: boolean;
  isRecursive: boolean;
  description: string;
  useCases: string[];
  advantages: string[];
  disadvantages: string[];
  pseudoCode: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
}

export type TraceOperationType = 'compare' | 'swap' | 'allocate' | 'state';

export interface TraceOperation {
  type: TraceOperationType;
  /** Primary index involved (e.g. element being compared or swapped) */
  i?: number;
  /** Secondary index involved */
  j?: number;
  /** A snapshot of the array at this point in time (usually after a swap or at key points) */
  state?: number[];
  /** Amount of memory allocated, if type === 'allocate' */
  size?: number;
  /** Human readable description of the step */
  description?: string;
  /** Highlighted line number in the pseudocode */
  lineIndex?: number;
}

export interface VisualizationTrace {
  algorithmId: string;
  initialState: number[];
  operations: TraceOperation[];
}

export interface VisualizationState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speedMs: number; // Delay between steps
  arrayState: number[];
  activeIndices: number[]; // e.g., indices currently being compared/swapped
  swapIndices: number[];
}
