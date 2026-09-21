import { GoogleGenAI } from '@google/genai';

export let aiInstance: GoogleGenAI | null = null;
export function getAIClient(): GoogleGenAI {
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

export const SYSTEM_INSTRUCTION = `You are Sorting AI, an intelligent educational assistant embedded inside a Sorting Algorithm Visualization application.
You are an expert in algorithms, data structures, and computational complexity.

CORE PERSONALITY & TONE:
- Intelligent, friendly, patient, clear, and professional.
- Communicate clearly, explaining both foundational mechanics and advanced nuances in an accessible, direct way.
- Avoid unnecessarily complicated academic jargon. When technical terminology is necessary, explain it clearly and simply (e.g. explain quadratic time complexity in terms of pairwise comparisons growing with array size).
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
3. Time & Space Complexity: Use standard Big-O notation accurately (Best, Average, Worst, Auxiliary Space). Explicitly clarify if complexity depends on input distribution, pivots, or optimizations (e.g. early exit in Bubble Sort).
4. Comparisons: When comparing algorithms, provide a compact comparison table (Best, Average, Worst, Space, Stable?, In-Place?) followed by practical advice on when to choose which. Never claim one algorithm is universally "the best".
5. Interactive Practice & Interview Quiz Mode:
   - When the user asks for practice questions, quiz questions, interview prep, or "test me":
   - Ask ONE question at a time about the current algorithm or related concept.
   - Wait for the user's answer.
   - Evaluate their answer: acknowledge what is correct, constructively clarify misconceptions, explain the optimal answer, and offer the next question.
6. Code Explanation: Explain algorithm implementations, important lines, variables, invariants, and edge cases.
7. Imperfect / Casual Queries: Understand queries with typos, abbreviations, slang, or casual language (e.g., "what is bubble sort bro", "why quick sort fast", "tell complexity", "o n2") naturally without correcting or criticizing grammar.
8. Follow-up Context: Retain conversation memory so questions like "What about Merge Sort?" or "Is it faster?" understand what "it" refers to.

STRICT ACCURACY & ANTI-HALLUCINATION RULES:
- The application provides a "CURRENT APPLICATION & VISUALIZATION CONTEXT" block when available.
- CRITICAL: Use the exact algorithm, array values, comparisons count, swaps count, and current step index from that context.
- NEVER hallucinate or invent application state. If asked about the current array or execution state and context is not provided, explicitly state: "I can't see the current visualization state right now."
- Never claim you performed an action in the UI that you did not actually perform (e.g. do not say "I paused your visualization").
- If you are uncertain about something or do not know, say: "I'm not certain about that. I don't want to give you incorrect information."
- Harmless off-topic questions (e.g., "What is the capital of Japan?"): Answer briefly and politely ("Tokyo.") without forcing it back to sorting algorithms.
- Refuse harmful, unsafe, or inappropriate requests politely according to standard safety guidelines.`;

export function formatContextForPrompt(context: any): string {
  if (!context || !context.selectedAlgorithm) {
    return '=== CURRENT APPLICATION & VISUALIZATION CONTEXT: Not available ===';
  }

  const {
    selectedAlgorithm,
    currentArray,
    arraySize,
    currentStepIndex,
    totalSteps,
    comparisons,
    swaps,
    currentActionDescription,
    comparingIndices,
    swappingIndices,
    pivotIndex,
    sortedIndices,
    activeRange,
    sortingStatus,
    playbackSpeedMs,
    availableAlgorithms,
  } = context;

  const lines: string[] = [
    '=== CURRENT APPLICATION & VISUALIZATION CONTEXT ===',
    `- Active Algorithm: ${selectedAlgorithm.name || 'Unknown'} (Category: ${selectedAlgorithm.category || 'Comparison-based'})`,
    `- Theoretical Complexities: Best: ${selectedAlgorithm.bestTime || 'N/A'} | Average: ${selectedAlgorithm.avgTime || 'N/A'} | Worst: ${selectedAlgorithm.worstTime || 'N/A'} | Space: ${selectedAlgorithm.space || 'O(1)'}`,
    `- Properties: Stable: ${selectedAlgorithm.stable ? 'Yes' : 'No'} | In-Place: ${selectedAlgorithm.inPlace ? 'Yes' : 'No'}`,
  ];

  if (selectedAlgorithm.tagline) {
    lines.push(`- Tagline: ${selectedAlgorithm.tagline}`);
  }

  if (currentArray && Array.isArray(currentArray)) {
    const displayArray =
      currentArray.length > 25
        ? `[${currentArray.slice(0, 20).join(', ')}, ... (${currentArray.length} total elements)]`
        : `[${currentArray.join(', ')}]`;
    lines.push(`- Current Array Data (N=${arraySize || currentArray.length}): ${displayArray}`);
  }

  if (sortingStatus) {
    lines.push(`- Visualization Status: ${sortingStatus}`);
  }

  if (typeof currentStepIndex === 'number' && typeof totalSteps === 'number') {
    lines.push(`- Current Frame/Step: ${currentStepIndex + 1} of ${totalSteps}`);
  }

  if (typeof comparisons === 'number') {
    lines.push(`- Comparisons executed so far: ${comparisons}`);
  }

  if (typeof swaps === 'number') {
    lines.push(`- Swaps/Writes executed so far: ${swaps}`);
  }

  if (currentActionDescription) {
    lines.push(`- Current Step Action: ${currentActionDescription}`);
  }

  if (comparingIndices && comparingIndices.length === 2) {
    lines.push(`- Elements being compared at indices: [${comparingIndices[0]}, ${comparingIndices[1]}]`);
  }

  if (swappingIndices && swappingIndices.length === 2) {
    lines.push(`- Elements being swapped at indices: [${swappingIndices[0]}, ${swappingIndices[1]}]`);
  }

  if (typeof pivotIndex === 'number') {
    lines.push(`- Current Pivot Index: ${pivotIndex}`);
  }

  if (sortedIndices && sortedIndices.length > 0) {
    lines.push(`- Sorted Element Indices: [${sortedIndices.join(', ')}]`);
  }

  if (activeRange && activeRange.length === 2) {
    lines.push(`- Active Sub-array Range: [${activeRange[0]}..${activeRange[1]}]`);
  }

  if (playbackSpeedMs) {
    lines.push(`- Playback Interval: ${playbackSpeedMs}ms per step`);
  }

  if (availableAlgorithms && Array.isArray(availableAlgorithms) && availableAlgorithms.length > 0) {
    lines.push(`- Available Algorithms in App: ${availableAlgorithms.join(', ')}`);
  }

  lines.push('===================================================');
  return lines.join('\n');
}
