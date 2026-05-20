import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-rose-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center animate-fadeInUp">
            {/* Icon */}
            <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertTriangle className="w-10 h-10 text-rose-600" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-black text-gray-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
              An unexpected error occurred. Our team has been notified. 
              Please try refreshing the page or returning to the home page.
            </p>

            {/* Error detail (dev mode) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-gray-900 text-left rounded-2xl p-4 mb-8 overflow-auto max-h-48 text-xs font-mono text-rose-300 shadow-inner">
                <p className="font-bold text-rose-400 mb-1">{this.state.error.message}</p>
                <p className="text-gray-500 leading-relaxed">
                  {this.state.errorInfo?.componentStack?.slice(0, 500)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="btn-primary"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-secondary"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
