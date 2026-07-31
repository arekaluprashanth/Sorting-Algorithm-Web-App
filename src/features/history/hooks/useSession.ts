/**
 * useSession — load a single session by ID for the detail view.
 */
import { useMemo } from 'react';
import type { HistorySession } from '../types';

export function useSession(sessions: HistorySession[], sessionId: string | null): {
  session: HistorySession | null;
} {
  const session = useMemo(() => {
    if (!sessionId) return null;
    return sessions.find((h) => h.session.id === sessionId) ?? null;
  }, [sessions, sessionId]);

  return { session };
}
