import React, { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { formatErrorMessage, getErrorAction } from '../utils/errorHandling';

/**
 * Error Boundary component to catch and display errors in the UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const errorAction = getErrorAction(this.state.error);
      const errorMessage = formatErrorMessage(this.state.error);

      return (
        <div className="p-6 bg-surface rounded-lg border border-red-500/30 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-red-500/20 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary">Something went wrong</h3>
            <p className="text-text-secondary max-w-md mx-auto">
              {errorMessage}
            </p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={this.handleReset}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => {
                  errorAction.action();
                  this.handleReset();
                }}
                className="btn-primary"
              >
                {errorAction.actionText}
              </button>
            </div>
            {this.props.showDetails && this.state.errorInfo && (
              <details className="mt-4 text-left w-full">
                <summary className="text-text-secondary cursor-pointer">Error Details</summary>
                <pre className="mt-2 p-4 bg-gray-800 rounded-md overflow-auto text-xs text-text-secondary">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

