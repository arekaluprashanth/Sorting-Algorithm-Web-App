import type {
  BenchmarkConfiguration,
  BenchmarkSession,
  BenchmarkEngineEvents,
} from '../types';
import { BenchmarkQueue } from '../scheduler/queue';
import { SequentialExecutor } from '../executors/sequential.executor';
import { ExecutionContext } from '../engine/execution-context';
import { validateBenchmarkConfiguration } from '../validators/benchmark.validator';
import { logger } from './logger';
import { AlgorithmRegistry } from '../../features/algorithms/core/AlgorithmRegistry';

export class BenchmarkEngine {
  private queue: BenchmarkQueue;
  private executor: SequentialExecutor;
  private currentContext?: ExecutionContext;
  private session?: BenchmarkSession;
  private events: BenchmarkEngineEvents;

  constructor(events: BenchmarkEngineEvents = {}) {
    this.queue = new BenchmarkQueue();
    this.executor = new SequentialExecutor();
    this.events = events;
  }

  /**
   * Starts a benchmark session with the given configuration.
   */
  public async run(config: BenchmarkConfiguration): Promise<BenchmarkSession> {
    logger.info('Initializing benchmark session...');
    
    if (this.currentContext && this.currentContext.currentStatus === 'RUNNING') {
      logger.warn('Attempted to start a benchmark while one is already running.');
      throw new Error('A benchmark is already running.');
    }

    try {
      validateBenchmarkConfiguration(config);
    } catch (err) {
      logger.error('Invalid benchmark configuration', err);
      throw err;
    }

    this.currentContext = new ExecutionContext(config.abortSignal);
    this.currentContext.setStatus('RUNNING');

    this.session = {
      sessionId: Math.random().toString(36).slice(2, 9), // Fallback generic ID generator
      status: 'RUNNING',
      configuration: config,
      results: [],
      progress: {
        status: 'RUNNING',
        currentIteration: 0,
        totalIterations: config.measuredRuns,
        completedAlgorithms: 0,
        totalAlgorithms: config.algorithms.length,
        percentageComplete: 0,
      },
      startTime: Date.now(),
    };

    // Queue all jobs
    this.queue.clear();
    for (const algorithmId of config.algorithms) {
      this.queue.enqueue({
        algorithmId,
        dataset: config.dataset,
        configuration: config,
      });
    }

    logger.info(`Queued ${this.queue.size} algorithms for benchmarking.`);

    try {
      await this.processQueue();
      
      if (this.currentContext.isAborted) {
        this.session.status = 'ABORTED';
        this.session.progress.status = 'ABORTED';
      } else {
        this.session.status = 'COMPLETED';
        this.session.progress.status = 'COMPLETED';
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'Aborted') {
        this.session.status = 'ABORTED';
        this.session.progress.status = 'ABORTED';
        logger.info('Benchmark session aborted.');
      } else {
        this.session.status = 'ERROR';
        this.session.progress.status = 'ERROR';
        this.session.error = msg;
        logger.error('Benchmark session failed entirely.', err);
      }
    } finally {
      this.session.endTime = Date.now();
      if (this.currentContext.currentStatus !== 'ABORTED') {
        this.currentContext.setStatus(this.session.status);
      }
      this.emitComplete();
    }

    return this.session;
  }

  /**
   * Internal loop to process the queue sequentially
   */
  private async processQueue(): Promise<void> {
    if (!this.session || !this.currentContext) return;

    while (!this.queue.isEmpty()) {
      if (this.currentContext.isAborted) {
        break;
      }

      const job = this.queue.dequeue();
      if (!job) continue;

      this.session.progress.currentAlgorithmId = job.algorithmId;
      this.session.progress.currentIteration = 0;
      this.updateProgress();

      logger.info(`Starting benchmark for algorithm: ${job.algorithmId}`);

      try {
        const result = await this.executor.execute(job, this.currentContext, (iteration) => {
          if (this.session) {
            this.session.progress.currentIteration = iteration;
            this.updateProgress();
          }
        });

        this.session.results.push(result);
        
        if (this.events.onAlgorithmComplete) {
          this.events.onAlgorithmComplete(result);
        }

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg === 'Aborted') {
          throw err; // Bubble up abort
        }
        
        logger.error(`Error during execution of ${job.algorithmId}`, err);
        // We push a failed result
        const algorithmInfo = AlgorithmRegistry.getAllMetadata().find((m) => m.id === job.algorithmId);
        this.session.results.push({
          algorithmId: job.algorithmId,
          algorithmInfo: algorithmInfo as any, 
          success: false,
          runMetrics: [],
          error: msg,
          totalElapsedMs: 0
        });
      }

      this.session.progress.completedAlgorithms++;
      this.updateProgress();
    }
  }

  private updateProgress(): void {
    if (!this.session) return;
    
    const p = this.session.progress;
    // Simple percentage calculation based on completed algorithms and current iteration
    const totalRunsRequired = p.totalAlgorithms * p.totalIterations;
    const completedRuns = (p.completedAlgorithms * p.totalIterations) + p.currentIteration;
    
    p.percentageComplete = totalRunsRequired > 0 ? (completedRuns / totalRunsRequired) * 100 : 0;
    
    if (this.events.onProgress) {
      this.events.onProgress({ ...p });
    }
  }

  private emitComplete(): void {
    if (this.events.onComplete && this.session) {
      this.events.onComplete({ ...this.session });
    }
  }

  /**
   * Aborts the running benchmark gracefully
   */
  public abort(): void {
    if (this.currentContext && !this.currentContext.isAborted) {
      logger.info('Sending abort signal to execution context...');
      this.currentContext.abort();
    }
  }
}
