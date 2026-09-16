import React from 'react';
import { BRANDING } from '@/constants/theme';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Antigravity Global ErrorBoundary caught:', error, errorInfo);

    // Auto-reload once on Vite dynamic import chunk failures (common after new production deployments)
    const isChunkError =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('error loading dynamically imported module');

    if (isChunkError) {
      try {
        const hasRetried = sessionStorage.getItem('gt_chunk_reload');
        if (!hasRetried) {
          sessionStorage.setItem('gt_chunk_reload', 'true');
          window.location.reload();
        }
      } catch (e) {}
    }
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
      window.location.href = window.location.origin + window.location.pathname;
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

          <div className="flex flex-wrap items-center justify-center gap-3">
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
        </div>
      );
    }

    return this.props.children;
  }
}
