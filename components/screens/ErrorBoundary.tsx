import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card } from '../ui';
import { PencilSquareIcon, ArrowPathIcon } from '../icons';

interface Props {
  children: ReactNode;
  onEditFunnel?: () => void;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  // Explicitly declare props and setState to satisfy TypeScript
  public props!: Props;
  public setState!: (state: Partial<State>, callback?: () => void) => void;
  public state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Quiz Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-md mx-auto animate-slide-in text-center">
          <Card className="p-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-4">
                The quiz encountered an error, possibly due to API issues. Don't worry, you can still access the builder!
              </p>
              {this.state.error && (
                <details className="text-left bg-gray-50 p-3 rounded-lg mb-4">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>

            <div className="space-y-3">
              {this.props.onEditFunnel && (
                <Button
                  onClick={this.props.onEditFunnel}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <PencilSquareIcon className="w-5 h-5 mr-2" />
                  Open Funnel Builder
                </Button>
              )}
              
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  if (this.props.onRetry) {
                    this.props.onRetry();
                  }
                }}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Try Again
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If the problem persists, you can always use the builder to create and edit your funnel.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}