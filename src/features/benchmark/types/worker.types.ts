import type { BenchmarkResult, BenchmarkConfig } from '../engine/types';

/** Worker Message Action Types */
export type WorkerMessageType =
  | 'INITIALIZE'
  | 'RUN'
  | 'PROGRESS'
  | 'RESULT'
  | 'ERROR'
  | 'CANCEL'
  | 'COMPLETE'
  | 'PING'
  | 'PONG';

/** Worker State Enum */
export type WorkerState =
  | 'IDLE'
  | 'INITIALIZING'
  | 'RUNNING'
  | 'PAUSED'
  | 'ERROR'
  | 'TERMINATED';

/** Incoming messages sent from UI Thread -> Web Worker */
export type WorkerRequestMessage =
  | { type: 'INITIALIZE'; payload?: Record<string, unknown> }
  | { type: 'RUN'; payload: { jobId: string; config: BenchmarkConfig } }
  | { type: 'CANCEL'; payload: { jobId: string } }
  | { type: 'PING'; payload?: { timestamp: number } };

/** Progress update payload during benchmark execution */
export interface WorkerProgressPayload {
  jobId: string;
  algorithmId: string;
  algorithmName: string;
  currentAlgorithmIndex: number;
  totalAlgorithms: number;
  currentIteration: number;
  totalIterations: number;
  datasetSize: number;
  completedPercentage: number;
  estimatedTimeRemainingMs: number;
  elapsedTimeMs: number;
  throughputOpsPerSec: number;
}

/** Outgoing messages sent from Web Worker -> UI Thread */
export type WorkerResponseMessage =
  | { type: 'PONG'; payload: { timestamp: number } }
  | { type: 'PROGRESS'; payload: WorkerProgressPayload }
  | { type: 'RESULT'; payload: { jobId: string; algorithmId: string; result: BenchmarkResult } }
  | { type: 'COMPLETE'; payload: { jobId: string; results: BenchmarkResult[]; totalDurationMs: number } }
  | { type: 'ERROR'; payload: { jobId: string; error: string; stack?: string } }
  | { type: 'CANCEL'; payload: { jobId: string } };

/** Worker Health & Operational Metadata */
export interface WorkerStatus {
  id: string;
  state: WorkerState;
  activeJobId: string | null;
  tasksCompleted: number;
  lastPingTimestamp: number;
  latencyMs: number;
}
