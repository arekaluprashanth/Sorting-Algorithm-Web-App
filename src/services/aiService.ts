import { VisualizerAIContext } from '../types';

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamChatOptions {
  message: string;
  history: ChatHistoryItem[];
  context?: VisualizerAIContext;
  onChunk: (chunkText: string) => void;
  signal?: AbortSignal;
}

export async function streamAIChat({
  message,
  history,
  context,
  onChunk,
  signal,
}: StreamChatOptions): Promise<string> {
  let accumulated = '';

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory: history.map((h) => ({
          role: h.role === 'user' ? 'user' : 'model',
          content: h.content,
        })),
        context,
      }),
      signal,
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errJson = await response.json();
        if (errJson.error) {
          errorMessage = errJson.error;
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error('Readable stream not supported by the environment.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') {
          return accumulated;
        }

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            accumulated += parsed.text;
            onChunk(parsed.text);
          }
        } catch (e: any) {
          if (e.message && e.message !== 'Unexpected end of JSON input') {
            throw e;
          }
        }
      }
    }

    return accumulated;
  } catch (error: any) {
    if (signal?.aborted) {
      return accumulated;
    }
    throw error;
  }
}
