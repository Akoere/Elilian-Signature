import React from 'react';
import { Button } from './Button';

export class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("UI Execution Error Caught by Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] px-4 text-center">
          <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-4">
            Oops!
          </h1>
          <p className="text-gray-500 max-w-md mb-8">
            Something went wrong while displaying this page. We've logged the issue.
          </p>
          <Button 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
