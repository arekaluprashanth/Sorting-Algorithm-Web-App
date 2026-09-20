import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

const SYSTEM_INSTRUCTION = `You are Sorting AI, an intelligent educational assistant embedded inside a Sorting Algorithm Visualization application.
You are an expert in algorithms, data structures, and computational complexity.

CORE PERSONALITY & TONE:
- Intelligent, friendly, patient, clear, and professional.
- Communicate clearly, explaining both foundational mechanics and advanced nuances in an accessible, direct way.
- Avoid unnecessarily complicated academic jargon. When technical terminology is necessary, explain it clearly and simply.
- Default response length: 2 to 6 short paragraphs or concise bullet points. For simple questions, answer directly in 1 to 3 sentences.
- Use clean Markdown: bold key terms, use bullet points, tables for comparisons, and short code snippets when relevant.
- NEVER sound arrogant, unnecessarily verbose, or repetitive.
- Always answer the user's actual question directly without fluff or preamble.

MANDATORY CHATGPT-STYLE SEARCH REWRITE OPENING:
- At the very beginning of EVERY reply, you MUST first clearly state what the user searched for or asked, rewritten into a polished, grammatically complete query.
- Format the very first line of your response exactly as:
**Searched for:** *[Clear, rewritten formulation of what the user is searching for]*

- Then follow with an empty line and continue down with your clear, structured explanation.

INTENT DETECTION & HANDLING:
1. Sorting Algorithm Questions: Explain the core mechanics, partition/merge/swap logic, loop invariants, and typical use cases.
2. Current Visualization Questions: Explain the current step, why specific elements are being compared or swapped, and what the algorithm is doing at this exact moment based on the supplied context.
3. Time & Space Complexity: Use standard Big-O notation accurately (Best, Average, Worst, Auxiliary Space).
4. Comparisons: When comparing algorithms, provide a compact comparison table followed by practical advice on when to choose which.
5. Interactive Practice & Interview Quiz Mode: Ask ONE question at a time, wait for user's answer, evaluate, and offer next question.
6. Code Explanation: Explain algorithm implementations, important lines, variables, invariants, and edge cases.
7. Imperfect / Casual Queries: Understand queries with typos, abbreviations, slang, or casual language naturally.
8. Follow-up Context: Retain conversation memory so follow-up questions work naturally.

STRICT ACCURACY & ANTI-HALLUCINATION RULES:
- Use the exact algorithm, array values, comparisons count, swaps count, and current step index from context when available.
- NEVER hallucinate or invent application state.
- If uncertain, say: "I'm not certain about that. I don't want to give you incorrect information."`;

function formatContextForPrompt(context: any): string {
  if (!context || !context.selectedAlgorithm) {
    return '=== CURRENT APPLICATION & VISUALIZATION CONTEXT: Not available ===';
  }

  const {
    selectedAlgorithm, currentArray, arraySize, currentStepIndex, totalSteps,
    comparisons, swaps, currentActionDescription, comparingIndices,
    swappingIndices, pivotIndex, sortedIndices, activeRange, sortingStatus,
    playbackSpeedMs, availableAlgorithms,
  } = context;

  const lines: string[] = [
    '=== CURRENT APPLICATION & VISUALIZATION CONTEXT ===',
    `- Active Algorithm: ${selectedAlgorithm.name || 'Unknown'} (Category: ${selectedAlgorithm.category || 'Comparison-based'})`,
    `- Theoretical Complexities: Best: ${selectedAlgorithm.bestTime || 'N/A'} | Average: ${selectedAlgorithm.avgTime || 'N/A'} | Worst: ${selectedAlgorithm.worstTime || 'N/A'} | Space: ${selectedAlgorithm.space || 'O(1)'}`,
    `- Properties: Stable: ${selectedAlgorithm.stable ? 'Yes' : 'No'} | In-Place: ${selectedAlgorithm.inPlace ? 'Yes' : 'No'}`,
  ];

  if (selectedAlgorithm.tagline) lines.push(`- Tagline: ${selectedAlgorithm.tagline}`);
  if (currentArray && Array.isArray(currentArray)) {
    const displayArray = currentArray.length > 25
      ? `[${currentArray.slice(0, 20).join(', ')}, ... (${currentArray.length} total elements)]`
      : `[${currentArray.join(', ')}]`;
    lines.push(`- Current Array Data (N=${arraySize || currentArray.length}): ${displayArray}`);
  }
  if (sortingStatus) lines.push(`- Visualization Status: ${sortingStatus}`);
  if (typeof currentStepIndex === 'number' && typeof totalSteps === 'number') lines.push(`- Current Frame/Step: ${currentStepIndex + 1} of ${totalSteps}`);
  if (typeof comparisons === 'number') lines.push(`- Comparisons executed so far: ${comparisons}`);
  if (typeof swaps === 'number') lines.push(`- Swaps/Writes executed so far: ${swaps}`);
  if (currentActionDescription) lines.push(`- Current Step Action: ${currentActionDescription}`);
  if (comparingIndices && comparingIndices.length === 2) lines.push(`- Elements being compared at indices: [${comparingIndices[0]}, ${comparingIndices[1]}]`);
  if (swappingIndices && swappingIndices.length === 2) lines.push(`- Elements being swapped at indices: [${swappingIndices[0]}, ${swappingIndices[1]}]`);
  if (typeof pivotIndex === 'number') lines.push(`- Current Pivot Index: ${pivotIndex}`);
  if (sortedIndices && sortedIndices.length > 0) lines.push(`- Sorted Element Indices: [${sortedIndices.join(', ')}]`);
  if (activeRange && activeRange.length === 2) lines.push(`- Active Sub-array Range: [${activeRange[0]}..${activeRange[1]}]`);
  if (playbackSpeedMs) lines.push(`- Playback Interval: ${playbackSpeedMs}ms per step`);
  if (availableAlgorithms && Array.isArray(availableAlgorithms) && availableAlgorithms.length > 0) lines.push(`- Available Algorithms in App: ${availableAlgorithms.join(', ')}`);

  lines.push('===================================================');
  return lines.join('\n');
}

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
