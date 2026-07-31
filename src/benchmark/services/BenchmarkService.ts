import { BenchmarkEngine } from '../core/engine';
import type {
  BenchmarkConfiguration,
  BenchmarkProgress,
  BenchmarkResult,
  BenchmarkSession,
  ExecutionStatus
} from '../types';
import { DEFAULT_BENCHMARK_CONFIG } from '../constants';

type Subscriber<T> = (data: T) => void;

class BenchmarkServiceFacade {
  private engine: BenchmarkEngine;
  
  // State
  private session: BenchmarkSession | null = null;
  private configuration: BenchmarkConfiguration = {
    algorithms: [],
    dataset: [],
    warmUpRuns: DEFAULT_BENCHMARK_CONFIG.warmUpRuns!,
    measuredRuns: DEFAULT_BENCHMARK_CONFIG.measuredRuns!,
    delayBetweenRunsMs: DEFAULT_BENCHMARK_CONFIG.delayBetweenRunsMs!,
    timeoutMs: DEFAULT_BENCHMARK_CONFIG.timeoutMs!,
    maxExecutionTimeMs: DEFAULT_BENCHMARK_CONFIG.maxExecutionTimeMs!,
    useWebWorker: DEFAULT_BENCHMARK_CONFIG.useWebWorker!
  };
  private progress: BenchmarkProgress = {
    status: 'IDLE',
    currentIteration: 0,
    totalIterations: 0,
    completedAlgorithms: 0,
    totalAlgorithms: 0,
    percentageComplete: 0
  };
  
  // Subscribers
  private sessionSubscribers: Set<Subscriber<BenchmarkSession | null>> = new Set();
  private progressSubscribers: Set<Subscriber<BenchmarkProgress>> = new Set();
  private configSubscribers: Set<Subscriber<BenchmarkConfiguration>> = new Set();

  constructor() {
    this.engine = new BenchmarkEngine({
      onProgress: (p) => {
        this.progress = p;
        this.notifyProgress();
      },
      onComplete: (s) => {
        this.session = s;
        this.progress.status = s.status;
        this.notifySession();
        this.notifyProgress();
      }
    });
  }

  // --- API Methods ---

  public async runBenchmark(config: Partial<BenchmarkConfiguration>): Promise<BenchmarkSession> {
    this.updateConfiguration(config);
    const fullConfig = this.getConfiguration();
    
    // reset state
    this.session = null;
    this.notifySession();
    
    return this.engine.run(fullConfig);
  }

  public cancelBenchmark(): void {
    this.engine.abort();
  }

  public resetBenchmark(): void {
    this.cancelBenchmark();
    this.session = null;
    this.progress = {
      status: 'IDLE',
      currentIteration: 0,
      totalIterations: 0,
      completedAlgorithms: 0,
      totalAlgorithms: 0,
      percentageComplete: 0
    };
    this.notifySession();
    this.notifyProgress();
  }

  public updateConfiguration(config: Partial<BenchmarkConfiguration>): void {
    this.configuration = { ...this.configuration, ...config };
    this.notifyConfig();
  }

  // --- Getters ---

  public getSession(): BenchmarkSession | null {
    return this.session;
  }

  public getProgress(): BenchmarkProgress {
    return this.progress;
  }

  public getConfiguration(): BenchmarkConfiguration {
    return this.configuration;
  }
  
  public getResults(): BenchmarkResult[] {
    return this.session?.results ?? [];
  }
  
  public getStatus(): ExecutionStatus {
    return this.progress.status;
  }

  // --- Subscriptions ---

  public subscribeSession(callback: Subscriber<BenchmarkSession | null>): () => void {
    this.sessionSubscribers.add(callback);
    return () => this.sessionSubscribers.delete(callback);
  }

  public subscribeProgress(callback: Subscriber<BenchmarkProgress>): () => void {
    this.progressSubscribers.add(callback);
    return () => this.progressSubscribers.delete(callback);
  }

  public subscribeConfig(callback: Subscriber<BenchmarkConfiguration>): () => void {
    this.configSubscribers.add(callback);
    return () => this.configSubscribers.delete(callback);
  }

  private notifySession(): void {
    for (const sub of this.sessionSubscribers) sub(this.session);
  }

  private notifyProgress(): void {
    for (const sub of this.progressSubscribers) sub(this.progress);
  }

  private notifyConfig(): void {
    for (const sub of this.configSubscribers) sub(this.configuration);
  }
}

export const BenchmarkService = new BenchmarkServiceFacade();
