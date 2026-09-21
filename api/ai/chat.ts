import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIClient, SYSTEM_INSTRUCTION, formatContextForPrompt } from '../../shared/aiConfig';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory, context } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in Vercel Environment Variables.',
    });
  }

  try {
    const ai = getAIClient();

    const contents: any[] = [];

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

    const contextBlock = formatContextForPrompt(context);
    const currentPrompt = `${contextBlock}\n\nUser Question:\n${message.trim()}\n\n(Remember: On the very first line of your reply, first rewrite what the user searched for formatted as: **Searched for:** *[Polished, clear reformulation of user query]*, followed by a blank line, and then continue down with your detailed answer like ChatGPT.)`;

    contents.push({
      role: 'user',
      parts: [{ text: currentPrompt }],
    });

    // SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const fallbackModel = 'gemini-3.8-flash';

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
      const chunkText = chunk.text;
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Gemini API stream error:', error);
    let readableError = 'An error occurred while communicating with the AI assistant.';
    if (error?.message) {
      readableError = error.message;
      try {
        const parsed = JSON.parse(readableError);
        if (parsed.error?.message) readableError = parsed.error.message;
      } catch { /* use raw message */ }
    }

    if (!res.headersSent) {
      res.status(500).json({ error: readableError });
    } else {
      res.write(`data: ${JSON.stringify({ error: readableError })}\n\n`);
      res.end();
    }
  }
}
