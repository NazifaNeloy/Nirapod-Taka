import React, { Component } from 'react';
import { bn } from '../i18n/bn.js';

/**
 * Top-level React error boundary that intercepts rendering crashes and displays a Bangla recovery screen.
 */
export class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, send to error monitoring; avoid console logs of sensitive data
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-[#F5FAF7] flex items-center justify-center p-4 text-[#14211B]"
        >
          <div className="w-full max-w-md bg-white border border-[#D5E0D9] rounded-2xl p-6 text-center shadow-md space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-[#C0262D]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-[#14211B]">
              {bn.error_boundary_title}
            </h1>

            <p className="text-base text-gray-700 bangla-text">
              {bn.error_boundary_desc}
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="touch-target w-full big-button bg-[#0F5C3A] text-white hover:bg-[#0b452b] active:scale-98 transition-all flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] focus:ring-offset-2 cursor-pointer"
            >
              {bn.error_boundary_reload}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
