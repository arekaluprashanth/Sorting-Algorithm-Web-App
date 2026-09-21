import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

import { getAIClient, SYSTEM_INSTRUCTION, formatContextForPrompt } from './shared/aiConfig';


// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Chat endpoint with Server-Sent Events (SSE) streaming
app.post('/api/ai/chat', async (req: Request, res: Response): Promise<void> => {
  const { message, conversationHistory, context } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(503).json({
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in the Settings > Secrets menu.',
    });
    return;
  }

  try {
    const ai = getAIClient();

    const contents: any[] = [];

    // Include recent history (up to last 10 messages)
    if (Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);
      for (const item of recentHistory) {
        if (item && item.content && (item.role === 'user' || item.role === 'model')) {
          contents.push({
            role: item.role,
            parts: [{ text: item.content }],
          });
        }
      }
    }

    // Append current prompt with visualizer context
    const contextBlock = formatContextForPrompt(context);
    const currentPrompt = `${contextBlock}\n\nUser Question:\n${message.trim()}\n\n(Remember: On the very first line of your reply, first rewrite what the user searched for formatted as: **Searched for:** *[Polished, clear reformulation of user query]*, followed by a blank line, and then continue down with your detailed answer like ChatGPT.)`;

    contents.push({
      role: 'user',
      parts: [{ text: currentPrompt }],
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    let isClientDisconnected = false;
    res.on('close', () => {
      if (!res.writableEnded) {
        isClientDisconnected = true;
      }
    });

    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const fallbackModel = 'gemini-3.6-flash';

    let streamResponse;
    try {
      streamResponse = await ai.models.generateContentStream({
        model: primaryModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    } catch (primaryErr: any) {
      console.warn(`Primary model ${primaryModel} failed, trying fallback ${fallbackModel}:`, primaryErr.message);
      streamResponse = await ai.models.generateContentStream({
        model: fallbackModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    }

    for await (const chunk of streamResponse) {
      if (isClientDisconnected) break;
      const chunkText = chunk.text;
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    if (!res.writableEnded) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (error: any) {
    console.error('Gemini API stream error:', error);
    let readableError = 'An error occurred while communicating with the AI assistant.';
    if (error?.message) {
      readableError = error.message;
      try {
        const parsed = JSON.parse(readableError);
        if (parsed.error?.message) {
          readableError = parsed.error.message;
        }
      } catch {
        // use raw message
      }
    }

    if (!res.headersSent) {
      res.status(500).json({ error: readableError });
    } else {
      res.write(`data: ${JSON.stringify({ error: readableError })}\n\n`);
      res.end();
    }
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${isDev ? 'development' : 'production'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
