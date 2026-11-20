import React, { useEffect } from 'react';

/**
 * Accessible toast notification banner with aria-live polite announcements.
 * @param {object} props - Component props.
 * @param {string} props.message - Toast message.
 * @param {'success'|'info'|'warning'|'error'} [props.type='success'] - Visual message category.
 * @param {Function} props.onClose - Dismiss callback.
 * @param {number} [props.duration=4000] - Duration in milliseconds before automatic dismissal.
 * @returns {JSX.Element|null} Toast element.
 */
export function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-[#0F5C3A] text-white border-emerald-600',
    info: 'bg-[#1D5FA8] text-white border-sky-600',
    warning: 'bg-[#B7791F] text-white border-amber-600',
    error: 'bg-[#C0262D] text-white border-red-700'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 flex items-center justify-between p-4 rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 duration-200"
      style={{ backgroundColor: type === 'success' ? '#0F5C3A' : type === 'info' ? '#1D5FA8' : '#C0262D', color: '#FFFFFF' }}
    >
      <div className="flex items-center gap-2.5 text-sm font-semibold bangla-text">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="p-1 rounded-md hover:bg-white/20 focus:outline-hidden focus:ring-2 focus:ring-white cursor-pointer ml-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
