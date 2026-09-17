import React from 'react';
import { BRANDING } from '@/constants/theme';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Antigravity Global ErrorBoundary caught:', error, errorInfo);

    // Auto-reload once with cache-buster on dynamic import chunk failures
    const msg = String(error?.message || '');
    const isChunkError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('error loading dynamically imported module') ||
      error?.name === 'ChunkLoadError';

    if (isChunkError) {
      try {
        const reloadKey = 'gt_chunk_reload_' + window.location.pathname;
        const hasRetried = sessionStorage.getItem(reloadKey);
        if (!hasRetried) {
          sessionStorage.setItem(reloadKey, 'true');
          window.location.href =
            window.location.origin + window.location.pathname + '?v=' + Date.now();
        }
      } catch (e) {}
    }
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
      window.location.href =
        window.location.origin + window.location.pathname + '?refresh=' + Date.now();
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F8FC] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="size-20 rounded-2xl bg-white p-3 shadow-xl border border-[#D0DFEF] mb-6 flex items-center justify-center">
            <img
              src={BRANDING.LOGO_PATH}
              alt="Global Trades"
              className="size-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/company-logo.png';
              }}
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#081426] tracking-tight mb-2">
            Global Trades Calicut
          </h2>

          <p className="text-sm sm:text-base font-medium text-[#081426]/75 max-w-md mb-6 leading-relaxed">
            The page encountered an issue loading. Please refresh to continue exploring wholesale food supplies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <button
              onClick={this.handleReload}
              className="rounded-xl bg-[#1A4C98] hover:bg-[#123873] text-white px-6 py-3 text-sm font-black uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Refresh Page
            </button>

            <a
              href="/"
              className="rounded-xl bg-white hover:bg-[#EBF3FC] text-[#1A4C98] border border-[#1A4C98]/30 px-6 py-3 text-sm font-black uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Return Home
            </a>
          </div>

          {this.state.error && (
            <div className="max-w-xl w-full text-left bg-white border border-[#D0DFEF] rounded-2xl p-4 shadow-sm text-xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-red-700">Error Details</span>
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="text-[11px] font-bold text-[#1A4C98] hover:underline cursor-pointer"
                >
                  {this.state.showDetails ? 'Hide Stack' : 'Show Stack'}
                </button>
              </div>
              <p className="font-mono text-red-800 break-words font-semibold">
                {String(this.state.error?.message || this.state.error)}
              </p>
              {this.state.showDetails && this.state.error?.stack && (
                <pre className="font-mono text-[10px] text-[#081426]/70 mt-2 overflow-x-auto whitespace-pre-wrap max-h-48 border-t border-[#F0F5FA] pt-2">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
