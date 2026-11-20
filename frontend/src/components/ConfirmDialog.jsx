import React, { useEffect } from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Accessible confirmation modal dialog with focus trap and escape key listener,
 * specifically used to guard irreversible actions such as permanent history deletion.
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Whether dialog is currently visible.
 * @param {string} props.title - Modal title.
 * @param {string} props.message - Descriptive warning message.
 * @param {string} [props.confirmText] - Label for affirmative action button.
 * @param {string} [props.cancelText] - Label for cancel button.
 * @param {Function} props.onConfirm - Callback triggered when user confirms.
 * @param {Function} props.onCancel - Callback triggered when dialog is cancelled.
 * @returns {JSX.Element|null} Rendered dialog portal or null if closed.
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}) {
  const { t } = useT();

  // Handle ESC key to dismiss dialog
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-[#D5E0D9] rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#C0262D] shrink-0" aria-hidden="true">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="flex-1 space-y-1">
            <h2 id="confirm-dialog-title" className="text-lg font-bold text-[#14211B] leading-snug">
              {title}
            </h2>
            <p id="confirm-dialog-desc" className="text-sm text-gray-600 bangla-text leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="touch-target px-4 py-2.5 rounded-xl border border-[#D5E0D9] bg-white text-gray-700 font-semibold hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-gray-400 cursor-pointer text-sm"
          >
            {cancelText || t('close')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="touch-target px-4 py-2.5 rounded-xl bg-[#C0262D] text-white font-bold hover:bg-red-800 focus:outline-hidden focus:ring-2 focus:ring-[#C0262D] cursor-pointer text-sm shadow-xs"
          >
            {confirmText || t('retry')}
          </button>
        </div>
      </div>
    </div>
  );
}
