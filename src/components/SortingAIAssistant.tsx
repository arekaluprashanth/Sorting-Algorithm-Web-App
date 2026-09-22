import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  X,
  Send,
  Trash2,
  Square,
  User,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  AlertCircle,
  Plus,
  Search,
  Clock,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  RotateCcw,
  Pencil,
  Mic,
  Minus,
} from 'lucide-react';
import { useVisualizerContext } from '../context/VisualizerContext';
import { streamAIChat, ChatHistoryItem } from '../services/aiService';
import { ChatMessage, ChatSession } from '../types';
import { AIAssistantLogo } from './AIAssistantLogo';

const SESSIONS_STORAGE_KEY = 'sorting_ai_sessions_v3';
const ACTIVE_SESSION_STORAGE_KEY = 'sorting_ai_active_session_id_v3';
// Used to detect a first-time (new) user so their chat history starts fresh
const VISITED_STORAGE_KEY = 'sorting_ai_visited_v1';

const createFreshSession = (): ChatSession => ({
  id: `session-${Date.now()}`,
  title: 'New Conversation',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  messages: [createDefaultWelcomeMessage()],
});

/**
 * Actively guesses what query or question the user is trying to search for
 * as they type into the AI assistant input box.
 */
export const guessSearchQuery = (rawInput: string, algoName: string): string | null => {
  const text = rawInput.trim();
  if (text.length < 2) return null;
  const lower = text.toLowerCase();

  // Why questions
  if (lower.startsWith('why is') || lower.startsWith('why does') || lower.startsWith('why are')) {
    if (lower.includes('fast') || lower.includes('slow')) {
      return `Why is ${algoName} ${lower.includes('fast') ? 'faster' : 'slower'} in practical benchmarks?`;
    }
    if (lower.includes('swap') || lower.includes('compare')) {
      return `Why does ${algoName} compare or swap these specific indices?`;
    }
    if (lower.includes('o(') || lower.includes('n2') || lower.includes('n log') || lower.includes('n^2')) {
      return `Why does ${algoName} have this specific time complexity?`;
    }
    return `Why does ${algoName} behave this way during this execution step?`;
  }
  if (lower === 'why' || lower === 'why?') {
    return `Why does ${algoName} perform this comparison or swap right now?`;
  }

  // How questions
  if (
    lower.startsWith('how does') ||
    lower.startsWith('how do') ||
    lower.startsWith('how to') ||
    lower.startsWith('how is')
  ) {
    if (lower.includes('work')) return `How does ${algoName} sort the array step by step?`;
    if (lower.includes('partition') || lower.includes('pivot'))
      return `How does partitioning and pivot selection work in ${algoName}?`;
    if (lower.includes('merge') || lower.includes('split'))
      return `How does dividing and merging work in ${algoName}?`;
    if (lower.includes('heap')) return `How is the binary heap maintained during sorting?`;
    return `How does ${algoName} sort the array step by step?`;
  }
  if (lower === 'how') {
    return `How does ${algoName} work from start to finish?`;
  }

  // Time & Space complexity queries
  if (
    lower.includes('time') ||
    lower.includes('space') ||
    lower.includes('complexity') ||
    lower.includes('big o') ||
    lower.startsWith('o(') ||
    lower === 'big' ||
    lower === 'theta' ||
    lower === 'omega'
  ) {
    if (lower.includes('space') || lower.includes('memory') || lower.includes('aux')) {
      return `What is the auxiliary space complexity of ${algoName}?`;
    }
    if (lower.includes('worst')) {
      return `What is the worst-case time complexity of ${algoName} and what input triggers it?`;
    }
    if (lower.includes('best')) {
      return `What is the best-case time complexity of ${algoName}?`;
    }
    return `What are the time and space complexities (Big-O) of ${algoName}?`;
  }

  // Best / Worst / Average
  if (lower.startsWith('best') || lower === 'best case') {
    return `What is the best-case time complexity and scenario for ${algoName}?`;
  }
  if (lower.startsWith('worst') || lower === 'worst case') {
    return `What is the worst-case time complexity and scenario for ${algoName}?`;
  }
  if (lower.startsWith('avg') || lower.startsWith('average')) {
    return `What is the average-case runtime complexity for ${algoName}?`;
  }

  // Comparison queries
  if (
    lower.includes('vs') ||
    lower.includes('compare') ||
    lower.includes('better') ||
    lower.includes('diff')
  ) {
    if (lower.includes('merge')) {
      return `${algoName} vs Merge Sort: Time, memory overhead, and stability comparison`;
    }
    if (lower.includes('quick')) {
      return `${algoName} vs Quick Sort: Cache locality and worst-case comparison`;
    }
    if (lower.includes('bubble')) {
      return `${algoName} vs Bubble Sort: Efficiency and swap count comparison`;
    }
    if (lower.includes('heap')) {
      return `${algoName} vs Heap Sort: In-place performance comparison`;
    }
    if (lower.includes('insertion')) {
      return `${algoName} vs Insertion Sort: Comparison on small/nearly-sorted arrays`;
    }
    return `${algoName} vs other sorting algorithms: When should you choose which?`;
  }

  // Stability & In-place
  if (lower.includes('stable') || lower.includes('stability')) {
    return `Is ${algoName} a stable sorting algorithm and why does stability matter?`;
  }
  if (lower.includes('in place') || lower.includes('inplace') || lower.includes('in-place')) {
    return `Is ${algoName} an in-place sorting algorithm?`;
  }

  // Implementation / Code
  if (
    lower.includes('code') ||
    lower.includes('python') ||
    lower.includes('java') ||
    lower.includes('cpp') ||
    lower.includes('c++') ||
    lower.includes('javascript') ||
    lower.includes('implement') ||
    lower.includes('syntax')
  ) {
    const lang = lower.includes('python')
      ? 'Python'
      : lower.includes('java') && !lower.includes('javascript')
      ? 'Java'
      : lower.includes('cpp') || lower.includes('c++')
      ? 'C++'
      : lower.includes('javascript') || lower.includes('js')
      ? 'JavaScript'
      : 'standard';
    return `Can you provide a clean ${lang} implementation of ${algoName} with line-by-line comments?`;
  }

  // Interview & Quiz questions
  if (
    lower.includes('interview') ||
    lower.includes('question') ||
    lower.includes('quiz') ||
    lower.includes('test') ||
    lower.includes('leetcode') ||
    lower.includes('prep')
  ) {
    return `What are the most common coding interview questions and trade-offs for ${algoName}?`;
  }

  // Steps / visualizer trace
  if (
    lower.includes('step') ||
    lower.includes('trace') ||
    lower.includes('current') ||
    lower.includes('state')
  ) {
    return `Can you explain the current visualizer step and array state for ${algoName}?`;
  }

  // Swap / Comparison
  if (lower.includes('swap')) {
    return `When and under what condition are elements swapped in ${algoName}?`;
  }
  if (lower.includes('compare')) {
    return `How many total comparisons does ${algoName} make on average?`;
  }

  // Algorithm specific keywords
  if (lower.includes('quick')) {
    return `How does Quick Sort pivot partitioning work compared to ${algoName}?`;
  }
  if (lower.includes('merge')) {
    return `How does Merge Sort divide-and-conquer work compared to ${algoName}?`;
  }
  if (lower.includes('heap')) {
    return `How does Heap Sort build a heap and maintain the heap property?`;
  }
  if (lower.includes('bubble')) {
    return `How does Bubble Sort bubble larger elements to the end of the array?`;
  }

  // Recursion / stack
  if (lower.includes('recur') || lower.includes('stack') || lower.includes('tree')) {
    return `How does recursion depth and stack space behave in ${algoName}?`;
  }

  // If user typed a query of at least 3 chars without final punctuation
  if (!text.endsWith('?') && !text.endsWith('.')) {
    const formatted = text.charAt(0).toUpperCase() + text.slice(1);
    return `${algoName}: ${formatted} explanation and analysis`;
  }

  return null;
};

/**
 * Rewrites the user query into a clean, complete search title for ChatGPT-style responses.
 */
export const rewriteUserSearchQuery = (rawQuery: string, algoName: string): string => {
  const trimmed = rawQuery.trim();
  if (!trimmed) return `Understanding ${algoName}`;

  if (trimmed.length > 25 && trimmed.endsWith('?')) {
    return trimmed;
  }

  const guess = guessSearchQuery(trimmed, algoName);
  if (guess) {
    return guess;
  }

  const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (formatted.endsWith('?') || formatted.endsWith('.')) {
    return formatted;
  }
  return `${formatted} in ${algoName}`;
};

const createDefaultWelcomeMessage = (): ChatMessage => ({
  id: `welcome-${Date.now()}`,
  role: 'assistant',
  content: `Hello! I'm **Sorting AI**, your visualizer and algorithm analysis assistant.

I can help you:
- **Analyze algorithm steps** and execution flow in real time
- **Derive time and space complexity** with proofs and recurrence relations
- **Compare algorithms** (e.g., *Merge Sort vs Quick Sort*)
- **Explore interview patterns** and edge-case behaviors

Ask any question to get started!`,
  timestamp: Date.now(),
});

const loadInitialSessions = (): ChatSession[] => {
  // First-time visitor: clear any previously saved chats so the user
  // starts with a fresh, clean conversation on their very first open.
  let isFirstVisit = false;
  try {
    isFirstVisit = !localStorage.getItem(VISITED_STORAGE_KEY);
  } catch {
    isFirstVisit = false;
  }

  if (isFirstVisit) {
    try {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing first-visit chats', e);
    }
    return [createFreshSession()];
  }

  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading chat sessions from localStorage', e);
  }
  return [createFreshSession()];
};

const loadInitialActiveId = (sessions: ChatSession[]): string => {
  try {
    const saved = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (saved && sessions.some((s) => s.id === saved)) {
      return saved;
    }
  } catch {}
  return sessions[0]?.id || `session-${Date.now()}`;
};

// Renders a fenced code block with its own copy button (Light neumorphic style)
const CodeBlockRenderer: React.FC<{ code: string }> = ({ code }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="neu-code relative my-3 overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2 text-[11px] font-mono text-[#687080]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c9d2de]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#d8c9a8]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#b3cdb3]" />
          <span className="ml-1 text-[10px] text-[#687080] uppercase tracking-wider font-semibold">Algorithm Code</span>
        </div>
        <button
          type="button"
          onClick={handleCopyCode}
          title="Copy code"
          aria-label="Copy code"
          className="neu-control inline-flex items-center justify-center w-7 h-7 rounded-lg text-[#687080] hover:text-indigo-700 cursor-pointer"
        >
          {copiedCode ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto font-mono text-[11px] sm:text-xs leading-relaxed text-[#333b4a]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Memoized individual message item with editing and replying loading animation
const MemoizedChatMessageItem = memo(
  ({
    msg,
    copied,
    onCopy,
    onEditAndSubmit,
  }: {
    msg: ChatMessage;
    copied: boolean;
    onCopy: (text: string, id: string) => void;
    onEditAndSubmit: (id: string, newContent: string) => void;
  }) => {
    const isUser = msg.role === 'user';
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(msg.content);

    const handleStartEdit = () => {
      setEditText(msg.content);
      setIsEditing(true);
    };

    const handleCancelEdit = () => {
      setEditText(msg.content);
      setIsEditing(false);
    };

    const handleSubmitEdit = () => {
      const trimmed = editText.trim();
      if (!trimmed) return;
      setIsEditing(false);
      onEditAndSubmit(msg.id, trimmed);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmitEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelEdit();
      }
    };

    return (
      <div
        className={`flex items-start gap-2.5 sm:gap-3 neu-message-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {isUser ? (
          <div className="neu-avatar-sm w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
          </div>
        ) : (
          <div className="relative group/avatar shrink-0 mt-0.5">
            <div className={`neu-avatar-sm w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 flex items-center justify-center ${msg.isStreaming ? 'neu-thinking-avatar' : ''}`}>
              <AIAssistantLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
            </div>
          </div>
        )}

        <div className={`max-w-[88%] sm:max-w-[82%] group relative ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-3.5 sm:px-4 py-2.5 sm:py-3 leading-relaxed transition-all ${
              isUser
                ? 'neu-bubble-user text-[#202532] rounded-tr-sm'
                : 'neu-bubble text-[#333b4a] rounded-tl-sm'
            }`}
          >
            {isUser ? (
              isEditing ? (
                <div className="space-y-2 min-w-[240px] sm:min-w-[320px]">
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="neu-input w-full resize-none rounded-xl px-3 py-2 text-xs sm:text-sm text-[#202532] focus:outline-none"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-indigo-700 font-medium">
                      Press Enter to reply
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="neu-control px-2 py-1 rounded-lg text-[#687080] hover:text-slate-800 text-[11px] font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitEdit}
                        disabled={!editText.trim()}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Save &amp; Reply
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-xs sm:text-sm text-[#202532] font-medium">{msg.content}</p>
              )
            ) : (
              <div className="prose prose-slate prose-xs sm:prose-sm max-w-none text-[#333b4a] leading-normal">
                {/* Thinking loading animation when streaming and awaiting first chunk */}
                {msg.isStreaming && !msg.content ? (
                  <div className="neu-thinking flex items-center gap-2.5 py-2 px-3.5 text-xs text-indigo-700 w-fit">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                    </span>
                  </div>
                ) : (
                  <>
                    <Markdown
                      components={{
                        table: ({ children }) => (
                          <div className="neu-table overflow-x-auto my-3 p-1">
                            <table className="min-w-full divide-y divide-[#d7dcea] text-[11px] sm:text-xs font-mono">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="px-3 py-2 bg-[#e6eaf2] text-left text-indigo-900 tracking-wider text-[10px] uppercase font-bold">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-3 py-2 border-t border-[#d7dcea] bg-transparent text-[#4a5468] font-medium">
                            {children}
                          </td>
                        ),
                        code: ({ className, children, ...props }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code
                              className="bg-[#e6eaf2] text-indigo-900 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-medium"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <CodeBlockRenderer code={String(children)} />
                          );
                        },
                        p: ({ children }) => {
                          const rawText = React.Children.toArray(children)
                            .map((c) => {
                              if (typeof c === 'string') return c;
                              if (typeof c === 'object' && c && 'props' in c && (c as any).props?.children) {
                                const sub = (c as any).props.children;
                                return typeof sub === 'string' ? sub : '';
                              }
                              return '';
                            })
                            .join('');

                          if (rawText.toLowerCase().includes('searched for:')) {
                            return (
                              <div className="neu-inset my-2.5 px-3 py-2 rounded-xl flex items-center gap-2 text-xs text-indigo-900 not-prose">
                                <Search className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <div className="leading-snug text-[#333b4a] font-medium">{children}</div>
                              </div>
                            );
                          }
                          return <p className="mb-2 last:mb-0 text-[#333b4a]">{children}</p>;
                        },
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1 text-[#4a5468]">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1 text-[#4a5468]">{children}</ol>,
                        li: ({ children }) => <li className="text-[#4a5468]">{children}</li>,
                        h3: ({ children }) => <h3 className="font-bold text-sm text-[#202532] mt-3 mb-1 tracking-tight">{children}</h3>,
                        h4: ({ children }) => <h4 className="font-semibold text-xs text-indigo-900 mt-2 mb-1">{children}</h4>,
                        strong: ({ children }) => <strong className="font-semibold text-[#202532]">{children}</strong>,
                      }}
                    >
                      {msg.content}
                    </Markdown>

                    {/* Active streaming wave animation */}
                    {msg.isStreaming && (
                      <div className="mt-2.5 pt-2 border-t border-[#d7dcea]/70 flex items-center gap-2 text-[11px] text-indigo-600 font-mono">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600" />
                        </span>
                        <span className="text-[#687080]">Generating response</span>
                        <span className="flex items-center gap-1 ml-0.5">
                          <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce" />
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Row: Copy & Edit buttons */}
          <div className="mt-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Edit User Message Button */}
            {isUser && !isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-[10px] text-[#687080] hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
                title="Edit this message and get a new reply"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}

            {/* Copy Button */}
            {!isUser && msg.content && (
              <button
                type="button"
                onClick={() => onCopy(msg.content, msg.id)}
                className="text-[10px] text-[#687080] hover:text-[#202532] px-1.5 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.msg.id === next.msg.id &&
    prev.msg.content === next.msg.content &&
    prev.msg.isStreaming === next.msg.isStreaming &&
    prev.copied === next.copied
);

const getInitialBounds = () => {
  if (typeof window === 'undefined') return { x: 50, y: 70, width: 620, height: 700 };
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 640) {
    const width = Math.max(300, w - 20);
    const height = Math.max(420, h - 80);
    return {
      x: Math.max(10, Math.round((w - width) / 2)),
      y: Math.max(50, Math.round((h - height) / 2)),
      width,
      height,
    };
  } else if (w < 1024) {
    const width = Math.min(580, w - 30);
    const height = Math.min(680, h - 80);
    return {
      x: Math.max(15, Math.round((w - width) / 2)),
      y: Math.max(60, Math.round((h - height) / 2)),
      width,
      height,
    };
  } else {
    const width = 640;
    const height = Math.min(720, h - 90);
    return {
      x: Math.max(20, Math.round((w - width) / 2)),
      y: Math.max(60, Math.round((h - height) / 2)),
      width,
      height,
    };
  }
};

export const SortingAIAssistant: React.FC = () => {
  const {
    visualizerContext,
    getLatestVisualizerContext,
    isAssistantOpen,
    setIsAssistantOpen,
    queuedPrompt,
    setQueuedPrompt,
  } = useVisualizerContext();

  const [sessions, setSessions] = useState<ChatSession[]>(loadInitialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => loadInitialActiveId(sessions));
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Floating Window Pos, Size & Minimization (Centered on Open)
  const [windowPos, setWindowPos] = useState<{ x: number; y: number }>(() => getInitialBounds());
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => ({
    width: getInitialBounds().width,
    height: getInitialBounds().height,
  }));
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // When assistant opens, always position it in the center first
  const prevIsOpenRef = useRef(isAssistantOpen);
  useEffect(() => {
    if (!prevIsOpenRef.current && isAssistantOpen) {
      const bounds = getInitialBounds();
      setWindowPos({ x: bounds.x, y: bounds.y });
      setWindowSize({ width: bounds.width, height: bounds.height });
      setIsMinimized(false);
      setIsExpanded(false);
    }
    prevIsOpenRef.current = isAssistantOpen;
  }, [isAssistantOpen]);

  // Keep window in bounds on window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowPos((prev) => {
        const currentW = isMinimized ? 220 : windowSize.width;
        const currentH = isMinimized ? 48 : windowSize.height;
        const maxX = Math.max(10, window.innerWidth - currentW - 10);
        const maxY = Math.max(10, window.innerHeight - currentH - 10);
        return {
          x: Math.min(maxX, Math.max(10, prev.x)),
          y: Math.min(maxY, Math.max(10, prev.y)),
        };
      });
      setWindowSize((prev) => ({
        width: Math.min(window.innerWidth - 20, Math.max(320, prev.width)),
        height: Math.min(window.innerHeight - 20, Math.max(340, prev.height)),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized, windowSize]);

  // Pointer-based Window Dragging
  const handleDragStart = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('a') ||
      target.closest('[data-no-drag="true"]')
    ) {
      return;
    }

    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = windowPos.x;
    const initialY = windowPos.y;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const currentW = isMinimized ? 220 : isExpanded ? window.innerWidth - 20 : windowSize.width;
      const currentH = isMinimized ? 48 : isExpanded ? window.innerHeight - 20 : windowSize.height;

      const maxX = Math.max(10, window.innerWidth - currentW - 10);
      const maxY = Math.max(10, window.innerHeight - currentH - 10);

      const newX = Math.min(maxX, Math.max(10, initialX + deltaX));
      const newY = Math.min(maxY, Math.max(10, initialY + deltaY));

      setWindowPos({ x: newX, y: newY });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Pointer-based Window Resizing
  const handleResizeStart = (direction: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPos = { ...windowPos };
    const initialSize = { ...windowSize };

    const minW = Math.min(320, window.innerWidth - 20);
    const minH = 340;
    const maxW = window.innerWidth - 20;
    const maxH = window.innerHeight - 20;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newW = initialSize.width;
      let newH = initialSize.height;
      let newX = initialPos.x;
      let newY = initialPos.y;

      if (direction.includes('e')) {
        newW = Math.min(maxW, Math.max(minW, initialSize.width + deltaX));
      }
      if (direction.includes('s')) {
        newH = Math.min(maxH, Math.max(minH, initialSize.height + deltaY));
      }
      if (direction.includes('w')) {
        const candidateW = initialSize.width - deltaX;
        if (candidateW >= minW && candidateW <= maxW) {
          newW = candidateW;
          newX = initialPos.x + deltaX;
        }
      }
      if (direction.includes('n')) {
        const candidateH = initialSize.height - deltaY;
        if (candidateH >= minH && candidateH <= maxH) {
          newH = candidateH;
          newY = initialPos.y + deltaY;
        }
      }

      setWindowSize({ width: newW, height: newH });
      setWindowPos({ x: newX, y: newY });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Mark this user as visited so old chats are only cleared on their first ever open
  useEffect(() => {
    try {
      localStorage.setItem(VISITED_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(false);

  // Detect Web Speech API support once on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(Boolean(SpeechRecognition));
  }, []);

  // Toggle voice dictation (ChatGPT-style voice input)
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // Single focused utterance: captures just the one voice speaking now
      recognition.continuous = false;
      // Only commit finalized results to avoid garbled/interim retyping
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        // Ignore "no-speech"/"aborted" — just silently reset the mic state
        if (event?.error && event.error !== 'aborted' && event.error !== 'no-speech') {
          setIsListening(false);
        } else {
          setIsListening(false);
        }
      };
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            transcript += result[0].transcript;
          }
        }
        const finalText = transcript.trim();
        if (!finalText) return;
        // Replace the current input instead of appending duplicates,
        // so the typed text is exactly what was spoken
        setInputPrompt((prev) => {
          const base = prev.trim();
          // If the user already typed something, combine; otherwise replace
          return base ? `${base} ${finalText}` : finalText;
        });
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Stop microphone when assistant closes
  useEffect(() => {
    if (!isAssistantOpen && isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }, [isAssistantOpen, isListening]);

  // Active session and messages
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  const algoName = visualizerContext.selectedAlgorithm?.name || 'this algorithm';

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save chat sessions', e);
    }
  }, [sessions]);

  // Persist active session ID
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, activeSessionId);
    } catch (e) {
      console.error('Failed to save active session ID', e);
    }
  }, [activeSessionId]);

  // Prevent background page from scrolling when assistant is open
  useEffect(() => {
    if (isAssistantOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isAssistantOpen]);

  // Auto-scroll on new messages or streaming chunks
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom(false);
    }
  }, [messages.length, isGenerating, isAssistantOpen]);

  // Handle queued prompts triggered from other components
  useEffect(() => {
    if (queuedPrompt && !isGenerating) {
      const prompt = queuedPrompt;
      setQueuedPrompt(null);
      handleSendMessage(prompt);
    }
  }, [queuedPrompt, isGenerating]);

  // Handle auto-resizing of textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // Start a new chat session (ChatGPT style)
  const handleNewChat = () => {
    if (isGenerating) handleStopGeneration();

    if (
      activeSession &&
      activeSession.messages.length <= 1 &&
      !activeSession.messages.some((m) => m.role === 'user')
    ) {
      setErrorMessage(null);
      setTimeout(() => textareaRef.current?.focus(), 80);
      return;
    }

    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [createDefaultWelcomeMessage()],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setErrorMessage(null);
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
    setTimeout(() => textareaRef.current?.focus(), 80);
  };

  // Select an existing conversation from the vertical list
  const handleSelectSession = (sessionId: string) => {
    if (isGenerating) handleStopGeneration();
    setActiveSessionId(sessionId);
    setErrorMessage(null);
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsSidebarOpen(false);
    }
    setTimeout(() => {
      scrollToBottom(false);
      textareaRef.current?.focus();
    }, 60);
  };

  // Delete a specific conversation
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGenerating && activeSessionId === sessionId) {
      handleStopGeneration();
    }

    const remaining = sessions.filter((s) => s.id !== sessionId);
    if (remaining.length === 0) {
      const freshSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: 'New Conversation',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [createDefaultWelcomeMessage()],
      };
      setSessions([freshSession]);
      setActiveSessionId(freshSession.id);
    } else {
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  // Clear all previous conversations
  const handleClearAllHistory = () => {
    if (isGenerating) handleStopGeneration();
    const freshSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [createDefaultWelcomeMessage()],
    };
    setSessions([freshSession]);
    setActiveSessionId(freshSession.id);
    setSearchQuery('');
  };

  // Clear current active conversation
  const handleClearCurrentChat = () => {
    if (isGenerating) handleStopGeneration();
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: 'New Conversation',
              updatedAt: Date.now(),
              messages: [createDefaultWelcomeMessage()],
            }
          : s
      )
    );
    setErrorMessage(null);
  };

  // Core stream AI reply generator
  const triggerStreamGeneration = async (
    targetSessionId: string,
    messageText: string,
    assistantMessageId: string,
    customHistory?: ChatHistoryItem[]
  ) => {
    setIsGenerating(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const currentSession = sessions.find((s) => s.id === targetSessionId);
    const sessionMessages = currentSession?.messages || [];

    const history: ChatHistoryItem[] =
      customHistory ||
      sessionMessages
        .filter((m) => !m.id.startsWith('welcome-') && !m.isError && m.id !== assistantMessageId)
        .slice(-8)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

    try {
      const activeContext = getLatestVisualizerContext();
      let streamBuffer = '';
      let rafId: number | null = null;

      await streamAIChat({
        message: messageText,
        history,
        context: activeContext,
        signal: abortController.signal,
        onChunk: (chunkText) => {
          streamBuffer += chunkText;
          if (!rafId) {
            rafId = requestAnimationFrame(() => {
              const flushed = streamBuffer;
              streamBuffer = '';
              rafId = null;
              setSessions((prev) =>
                prev.map((s) => {
                  if (s.id !== targetSessionId) return s;
                  return {
                    ...s,
                    updatedAt: Date.now(),
                    messages: s.messages.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + flushed }
                        : msg
                    ),
                  };
                })
              );
              scrollToBottom(false);
            });
          }
        },
      });

      if (streamBuffer.length > 0) {
        const flushed = streamBuffer;
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== targetSessionId) return s;
            return {
              ...s,
              updatedAt: Date.now(),
              messages: s.messages.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + flushed }
                  : msg
              ),
            };
          })
        );
      }

      const rewrittenQuery = rewriteUserSearchQuery(messageText, algoName);

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== targetSessionId) return s;
          return {
            ...s,
            updatedAt: Date.now(),
            messages: s.messages.map((msg) => {
              if (msg.id !== assistantMessageId) return msg;
              let finalContent = (msg.content || '').trim();
              if (
                finalContent &&
                !finalContent.toLowerCase().startsWith('**searched for:') &&
                !finalContent.toLowerCase().startsWith('searched for:')
              ) {
                finalContent = `**Searched for:** *${rewrittenQuery}*\n\n${finalContent}`;
              }
              return {
                ...msg,
                content: finalContent,
                isStreaming: false,
              };
            }),
          };
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== targetSessionId) return s;
            return {
              ...s,
              messages: s.messages.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, isStreaming: false }
                  : msg
              ),
            };
          })
        );
      } else {
        const rewrittenQuery = rewriteUserSearchQuery(messageText, algoName);
        const errorText =
          err.message || 'Unable to communicate with the AI assistant. Please check your connection or API key.';
        setErrorMessage(errorText);
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== targetSessionId) return s;
            return {
              ...s,
              messages: s.messages.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      isStreaming: false,
                      isError: true,
                      content: `**Searched for:** *${rewrittenQuery}*\n\n⚠️ **Error**: ${errorText}`,
                    }
                  : msg
              ),
            };
          })
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Edit user message and re-submit to get a fresh AI reply
  const handleEditAndResubmit = (messageId: string, newContent: string) => {
    if (isGenerating) handleStopGeneration();

    const targetSessionId = activeSessionId;
    const currentSession = sessions.find((s) => s.id === targetSessionId);
    if (!currentSession) return;

    const messageIndex = currentSession.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const newAssistantId = `assistant-${Date.now()}`;
    const updatedUserMsg: ChatMessage = {
      ...currentSession.messages[messageIndex],
      content: newContent,
      timestamp: Date.now(),
    };

    const newAssistantPlaceholder: ChatMessage = {
      id: newAssistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    // Keep prior messages up to this index, replace user message, and append assistant reply placeholder
    const truncatedMessages = [
      ...currentSession.messages.slice(0, messageIndex),
      updatedUserMsg,
      newAssistantPlaceholder,
    ];

    const priorHistory: ChatHistoryItem[] = currentSession.messages
      .slice(0, messageIndex)
      .filter((m) => !m.id.startsWith('welcome-') && !m.isError)
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== targetSessionId) return s;
        return {
          ...s,
          updatedAt: Date.now(),
          messages: truncatedMessages,
        };
      })
    );

    triggerStreamGeneration(targetSessionId, newContent, newAssistantId, priorHistory);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputPrompt).trim();
    if (!messageText || isGenerating) return;

    setInputPrompt('');
    setErrorMessage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const targetSessionId = activeSessionId;
    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== targetSessionId) return s;
        const isDefaultTitle = s.title === 'New Conversation';
        const newTitle = isDefaultTitle
          ? messageText.length > 36
            ? messageText.slice(0, 36) + '...'
            : messageText
          : s.title;
        return {
          ...s,
          title: newTitle,
          updatedAt: Date.now(),
          messages: [...s.messages, userMsg, assistantPlaceholder],
        };
      })
    );

    triggerStreamGeneration(targetSessionId, messageText, assistantMessageId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (s.title.toLowerCase().includes(q)) return true;
    return s.messages.some((m) => m.content.toLowerCase().includes(q));
  });

  return (
    <>
      {/* Floating, Movable, Resizable AI Assistant Window without blocking backdrop */}
      <AnimatePresence>
        {isAssistantOpen && (
          <div
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
            aria-modal="false"
          >
            {isMinimized ? (
              /* Minimized Floating Pill Widget */
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  left: `${windowPos.x}px`,
                  top: `${windowPos.y}px`,
                }}
                onPointerDown={handleDragStart}
                className="pointer-events-auto absolute p-2 px-3.5 rounded-2xl bg-indigo-600/95 text-white font-bold text-xs shadow-2xl border border-indigo-400/50 flex items-center gap-2.5 cursor-grab active:cursor-grabbing backdrop-blur-md ring-2 ring-indigo-300/50 hover:bg-indigo-700 transition-colors"
                title="Click & Drag to reposition / Click to expand Sorting AI"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <AIAssistantLogo className="w-3.5 h-3.5 text-white" />
                </div>
                <div
                  onClick={() => setIsMinimized(false)}
                  className="flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <span>Sorting AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 border-l border-white/25 pl-1.5 ml-0.5">
                  <button
                    type="button"
                    onClick={() => setIsMinimized(false)}
                    title="Expand Sorting AI window"
                    className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAssistantOpen(false)}
                    title="Close Assistant"
                    className="p-1 rounded-lg hover:bg-rose-500/80 text-white cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Full Floating, Movable, Resizable Window */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={
                  isExpanded
                    ? {
                        left: '10px',
                        top: '10px',
                        width: 'calc(100vw - 20px)',
                        height: 'calc(100vh - 20px)',
                      }
                    : {
                        left: `${windowPos.x}px`,
                        top: `${windowPos.y}px`,
                        width: `${windowSize.width}px`,
                        height: `${windowSize.height}px`,
                      }
                }
                className="pointer-events-auto absolute flex flex-row overflow-hidden select-text neu-panel"
              >
            {/* 1. LEFT VERTICAL SIDEBAR */}
            <div
              className={`${
                isSidebarOpen ? 'flex' : 'hidden'
              } w-full sm:w-72 absolute inset-0 z-30 sm:relative sm:inset-auto shrink-0 neu-surface flex-col h-full`}
            >
              {/* Sidebar Header */}
              <div className="p-3 neu-surface flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="neu-avatar-sm w-8 h-8 flex items-center justify-center text-indigo-600 shrink-0">
                    <AIAssistantLogo className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[#202532] tracking-tight truncate">
                    Sorting AI
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  title="Collapse sidebar"
                  className="neu-control p-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* "+ New chat" Button */}
              <div className="p-3 pb-2">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="neu-chip w-full flex items-center justify-between px-3.5 py-2.5 text-[#202532] hover:text-indigo-900 text-xs font-semibold cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-indigo-600 group-hover:rotate-90 transition-transform duration-200" />
                    <span>New chat</span>
                  </div>
                  <span className="text-[10px] text-[#687080] font-mono font-normal">⌘N</span>
                </button>
              </div>

              {/* Search Past Conversations */}
              <div className="px-3 py-1.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#687080] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="neu-input w-full pl-8 pr-7 py-2 rounded-xl text-xs text-[#202532] placeholder:text-[#aab1c0] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-[#687080] hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Vertical Conversations List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 overscroll-contain">
                <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#687080]">
                  <span>Conversations</span>
                  <span>{sessions.length}</span>
                </div>

                {filteredSessions.length === 0 ? (
                  <div className="py-8 px-3 text-center text-[#687080] text-xs">
                    <MessageSquare className="w-6 h-6 mx-auto mb-1.5 text-[#aab1c0]" />
                    <p>{searchQuery ? 'No matching chats' : 'No saved conversations'}</p>
                  </div>
                ) : (
                  filteredSessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    return (
                      <div
                        key={session.id}
                        onClick={() => handleSelectSession(session.id)}
                        className={`group relative flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isActive
                            ? 'neu-inset text-indigo-950 font-semibold'
                            : 'text-[#687080] hover:text-[#202532]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <MessageSquare
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActive ? 'text-indigo-600' : 'text-[#aab1c0]'
                            }`}
                          />
                          <span className="truncate">{session.title}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          title="Delete chat"
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#687080] hover:text-rose-600 hover:bg-rose-50/60 transition-all cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-3 neu-surface flex items-center justify-between text-[11px] text-[#687080]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#687080]" />
                  <span>Saved locally</span>
                </span>
                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="text-[#687080] hover:text-rose-600 hover:underline transition-colors cursor-pointer"
                  >
                    Clear history
                  </button>
                )}
              </div>
            </div>

            {/* 2. RIGHT CHAT WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0 neu-surface h-full relative">
              {/* Chat Top Header - Movable by drag */}
              <div
                onPointerDown={handleDragStart}
                className="px-4 py-3 neu-surface flex items-center justify-between gap-3 shrink-0 cursor-grab active:cursor-grabbing border-b border-slate-200/40 select-none"
                title="Drag header to move Sorting AI anywhere"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {!isSidebarOpen && (
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(true)}
                      title="Open sidebar"
                      className="neu-control p-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      <PanelLeft className="w-4 h-4" />
                    </button>
                  )}

                  {/* AI Assistant Avatar */}
                  <div className="neu-avatar-sm w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-indigo-600 shrink-0">
                    <AIAssistantLogo className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-600" />
                  </div>

                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs sm:text-sm text-[#202532] tracking-tight truncate">
                        Sorting AI
                      </h3>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#687080] truncate max-w-[150px] sm:max-w-[220px]">
                      {activeSession.title !== 'New Conversation' ? activeSession.title : 'AI sorting assistant'}
                    </p>
                  </div>
                </div>

                {/* Header Window Actions: Clear chat, Minimize, Maximize/Restore, Close */}
                <div className="flex items-center gap-1 sm:gap-1.5 text-slate-500">
                  {/* Clear conversation */}
                  <button
                    type="button"
                    onClick={handleClearCurrentChat}
                    title="Clear current conversation"
                    aria-label="Clear current conversation"
                    className="neu-control p-1.5 text-[#687080] hover:text-slate-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Minimize to Floating Dock Pill */}
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    title="Minimize to floating widget"
                    aria-label="Minimize"
                    className="neu-control p-1.5 text-[#687080] hover:text-slate-800 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Maximize / Restore */}
                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    title={isExpanded ? 'Restore window size' : 'Maximize panel'}
                    aria-label={isExpanded ? 'Restore size' : 'Maximize panel'}
                    className="neu-control p-1.5 text-[#687080] hover:text-slate-800 hidden sm:inline-flex cursor-pointer"
                  >
                    {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsAssistantOpen(false)}
                    title="Close Assistant"
                    aria-label="Close Assistant"
                    className="neu-control p-1.5 text-[#687080] hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-4 text-xs sm:text-sm">
                {messages.map((msg) => (
                  <MemoizedChatMessageItem
                    key={msg.id}
                    msg={msg}
                    copied={copiedMessageId === msg.id}
                    onCopy={handleCopyText}
                    onEditAndSubmit={handleEditAndResubmit}
                  />
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-rose-600 hover:text-rose-900 text-xs font-bold cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 sm:p-4 neu-surface border-t border-slate-200/40 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2"
                >
                  <div className="relative flex-1">
                    <textarea
                      ref={textareaRef}
                      value={inputPrompt}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything..."
                      rows={1}
                      className="neu-input w-full resize-none rounded-2xl px-4 py-3 pr-10 text-xs sm:text-sm text-[#202532] placeholder:text-[#aab1c0] focus:outline-none max-h-32 leading-relaxed"
                    />

                    {voiceSupported && (
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        title={isListening ? 'Stop recording voice' : 'Dictate with voice'}
                        className={`absolute right-2.5 bottom-2.5 p-1 rounded-xl transition-colors cursor-pointer ${
                          isListening
                            ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                            : 'text-[#687080] hover:text-indigo-600'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      title="Stop generation"
                      aria-label="Stop generation"
                      className="neu-control inline-flex h-11 w-11 items-center justify-center rounded-2xl text-[#687080] hover:text-slate-800 shrink-0 cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-[#687080]" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputPrompt.trim()}
                      aria-label="Send message"
                      className="neu-control inline-flex h-11 w-11 items-center justify-center rounded-2xl text-indigo-600 transition-all disabled:opacity-35 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Corner & Edge Resize Handles for Manual Crop / Ratio Adjustment */}
            {!isExpanded && (
              <>
                {/* Bottom-Right Corner Resize Grip Handle */}
                <div
                  onPointerDown={(e) => handleResizeStart('se', e)}
                  title="Drag to resize / adjust crop ratio"
                  className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end p-1 z-40 group"
                >
                  <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-slate-400 group-hover:border-indigo-600 transition-colors" />
                </div>

                {/* Bottom Edge Resize Handle */}
                <div
                  onPointerDown={(e) => handleResizeStart('s', e)}
                  className="absolute bottom-0 left-4 right-4 h-1.5 cursor-s-resize z-40 hover:bg-indigo-400/20 transition-colors"
                />

                {/* Right Edge Resize Handle */}
                <div
                  onPointerDown={(e) => handleResizeStart('e', e)}
                  className="absolute top-4 bottom-4 right-0 w-1.5 cursor-e-resize z-40 hover:bg-indigo-400/20 transition-colors"
                />

                {/* Left Edge Resize Handle */}
                <div
                  onPointerDown={(e) => handleResizeStart('w', e)}
                  className="absolute top-4 bottom-4 left-0 w-1.5 cursor-w-resize z-40 hover:bg-indigo-400/20 transition-colors"
                />

                {/* Bottom-Left Corner Resize Handle */}
                <div
                  onPointerDown={(e) => handleResizeStart('sw', e)}
                  className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-40"
                />
              </>
            )}
          </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
    </>
  );
};
