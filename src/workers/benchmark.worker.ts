import type { WorkerRequestMessage, WorkerResponseMessage } from '../features/benchmark/types/worker.types';
import type { BenchmarkResult } from '../features/benchmark/engine/types';
import { getAlgorithm } from '../features/benchmark/engine/algorithms';
import { createMetricsCollector } from '../features/benchmark/engine/metrics-collector';

const BYTES_PER_ELEMENT = 8;
let cancelledJobIds = new Set<string>();

function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i]! < arr[i - 1]!) return false;
  }
  return true;
}

function sendResponse(msg: WorkerResponseMessage) {
  self.postMessage(msg);
}

self.addEventListener('message', (event: MessageEvent<WorkerRequestMessage>) => {
  const message = event.data;
  if (!message || !message.type) return;

  switch (message.type) {
    case 'PING': {
      sendResponse({
        type: 'PONG',
        payload: { timestamp: message.payload?.timestamp || Date.now() },
      });
      break;
    }
    case 'CANCEL': {
      if (message.payload?.jobId) {
        cancelledJobIds.add(message.payload.jobId);
        sendResponse({
          type: 'CANCEL',
          payload: { jobId: message.payload.jobId },
        });
      }
      break;
    }
    case 'RUN': {
      const { jobId, config } = message.payload;
      cancelledJobIds.delete(jobId);

      const totalAlgorithms = config.algorithmIds.length;
      const warmupCount = Math.max(0, config.warmupIterations);
      const totalIterationsPerAlgo = warmupCount + 1; // warmup + 1 actual run
      const totalIterations = totalAlgorithms * totalIterationsPerAlgo;

      const results: BenchmarkResult[] = [];
      const sessionStartTime = performance.now();
      let completedIterations = 0;

      try {
        for (let algoIdx = 0; algoIdx < totalAlgorithms; algoIdx++) {
          const algoId = config.algorithmIds[algoIdx]!;

          if (cancelledJobIds.has(jobId)) {
            sendResponse({ type: 'CANCEL', payload: { jobId } });
            return;
          }

          const algorithm = getAlgorithm(algoId);

          // ── 1. Warm-up Iterations ──────────────────────────────────────────
          for (let w = 0; w < warmupCount; w++) {
            if (cancelledJobIds.has(jobId)) {
              sendResponse({ type: 'CANCEL', payload: { jobId } });
              return;
            }

            const warmupData = [...config.dataset];
            const warmupCollector = createMetricsCollector();
            algorithm.sort(warmupData, warmupCollector);

            completedIterations++;
            const elapsedMs = performance.now() - sessionStartTime;
            const pct = Math.round((completedIterations / totalIterations) * 100);
            const avgTimePerIteration = completedIterations > 0 ? elapsedMs / completedIterations : 0;
            const remainingIterations = totalIterations - completedIterations;
            const estRemainingMs = Math.round(remainingIterations * avgTimePerIteration);

            sendResponse({
              type: 'PROGRESS',
              payload: {
                jobId,
                algorithmId: algoId,
                algorithmName: algorithm.name,
                currentAlgorithmIndex: algoIdx + 1,
                totalAlgorithms,
                currentIteration: completedIterations,
                totalIterations,
                datasetSize: config.dataset.length,
                completedPercentage: pct,
                elapsedTimeMs: Math.round(elapsedMs),
                estimatedTimeRemainingMs: estRemainingMs,
                throughputOpsPerSec: completedIterations > 0 ? Math.round((completedIterations * config.dataset.length) / (elapsedMs / 1000)) : 0,
              },
            });
          }

          // ── 2. Actual Measured Run ─────────────────────────────────────────
          if (cancelledJobIds.has(jobId)) {
            sendResponse({ type: 'CANCEL', payload: { jobId } });
            return;
          }

          const data = [...config.dataset];
          const collector = createMetricsCollector();

          const startTime = performance.now();
          const sorted = algorithm.sort(data, collector);
          const endTime = performance.now();

          const metrics = collector.getMetrics();
          const correct = isSorted(sorted);
          const executionTimeMs = endTime - startTime;

          const result: BenchmarkResult = {
            algorithmId: algorithm.id,
            algorithmName: algorithm.name,
            datasetSize: config.dataset.length,
            datasetType: config.datasetType,
            executionTimeMs,
            comparisons: metrics.comparisons,
            swaps: metrics.swaps,
            memoryEstimateBytes: metrics.peakMemoryElements * BYTES_PER_ELEMENT,
            maxRecursionDepth: metrics.maxRecursionDepth,
            correct,
            timestamp: Date.now(),
          };

          results.push(result);

          sendResponse({
            type: 'RESULT',
            payload: { jobId, algorithmId: algoId, result },
          });

          completedIterations++;
          const elapsedMs = performance.now() - sessionStartTime;
          const pct = Math.round((completedIterations / totalIterations) * 100);
          const avgTimePerIteration = elapsedMs / completedIterations;
          const estRemainingMs = Math.round((totalIterations - completedIterations) * avgTimePerIteration);

          sendResponse({
            type: 'PROGRESS',
            payload: {
              jobId,
              algorithmId: algoId,
              algorithmName: algorithm.name,
              currentAlgorithmIndex: algoIdx + 1,
              totalAlgorithms,
              currentIteration: completedIterations,
              totalIterations,
              datasetSize: config.dataset.length,
              completedPercentage: pct,
              elapsedTimeMs: Math.round(elapsedMs),
              estimatedTimeRemainingMs: estRemainingMs,
              throughputOpsPerSec: Math.round((completedIterations * config.dataset.length) / (elapsedMs / 1000)),
            },
          });
        }

        sendResponse({
          type: 'COMPLETE',
          payload: {
            jobId,
            results,
            totalDurationMs: Math.round(performance.now() - sessionStartTime),
          },
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error ? err.stack : undefined;
        sendResponse({
          type: 'ERROR',
          payload: { jobId, error: errorMsg, stack },
        });
      }
      break;
    }
    default:
      break;
  }
});
