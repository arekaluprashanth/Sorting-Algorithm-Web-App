import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Logger } from '../../features/monitoring/logger';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Logger.error('Unhandled React component exception trapped by ErrorBoundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-2xl border border-rose-500/20 bg-rose-950/10 max-w-md w-full text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="text-sm text-neutral-400">
                An unexpected application error occurred. The details have been safely captured.
              </p>
              {this.state.error && (
                <div className="p-3 bg-black/40 rounded-lg text-left overflow-x-auto text-xs font-mono text-rose-300 border border-rose-500/10">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
            >
              <RefreshCw className="w-4 h-4" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
