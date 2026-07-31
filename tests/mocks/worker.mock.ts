import { vi } from 'vitest';

export class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;

  postMessage = vi.fn((data: any) => {
    if (data.type === 'PING') {
      setTimeout(() => {
        this.onmessage?.({
          data: { type: 'PONG', payload: { timestamp: data.payload?.timestamp || Date.now() } },
        } as MessageEvent);
      }, 0);
    }
  });

  terminate = vi.fn();
}
