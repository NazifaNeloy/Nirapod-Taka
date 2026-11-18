import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT.jsx';
import { apiClient } from '../api/client.js';
import { BigButton } from '../components/BigButton.jsx';
import { ResultCard } from '../components/ResultCard.jsx';
import { Spinner } from '../components/Spinner.jsx';

const MAX_CHARS = 2000;

/**
 * Message Checker Page (Screen A3 + A4) — The core scam detection interface of Nirapod Taka.
 * Analyzes messages in Bangla, Banglish, or English and delivers explainable fraud verdicts.
 * @returns {JSX.Element} Interactive scam checker page.
 */
export default function Check() {
  const { t, num } = useT();

  const [messageText, setMessageText] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [showSender, setShowSender] = useState(false);
  const [isTrimmedWarn, setIsTrimmedWarn] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Request & verdict state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [apiError, setApiError] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const resultRef = useRef(null);
  const textareaRef = useRef(null);

  // Countdown timer for 429 Rate Limit
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-scroll to result card when verification completes
  useEffect(() => {
    if (result && resultRef.current && typeof resultRef.current.scrollIntoView === 'function') {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  /**
   * Enforces 2,000 character limit on pasted and typed content.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - Change event.
   */
  const handleTextChange = (e) => {
    const rawVal = e.target.value;
    setValidationError('');

    if (rawVal.length > MAX_CHARS) {
      setMessageText(rawVal.slice(0, MAX_CHARS));
      setIsTrimmedWarn(true);
    } else {
      setMessageText(rawVal);
      setIsTrimmedWarn(false);
    }
  };

  /**
   * Generates a unique client UUID for deduplication and offline syncing.
   * @returns {string} Client UUID.
   */
  const generateClientUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `c-uuid-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  };

  /**
   * Executes message check request through central api/client.js wrapper.
   */
  const handleCheck = async () => {
    const trimmed = messageText.trim();
    if (!trimmed) {
      setValidationError(t('empty_input_error'));
      if (textareaRef.current) textareaRef.current.focus();
      return;
    }

    if (countdown !== null && countdown > 0) {
      return;
    }

    setLoading(true);
    setApiError(null);
    setResult(null);

    const clientUuid = generateClientUUID();
    const payload = {
      text: trimmed,
      sender: senderInfo.trim() || undefined,
      client_uuid: clientUuid
    };

    const { data, error } = await apiClient('/api/check', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setLoading(false);

    if (error) {
      setApiError(error);
      if (error.code === 'RATE_LIMITED' && error.retryAfter) {
        setCountdown(error.retryAfter);
      }
      return;
    }

    setResult(data);
    setLastAnalyzedText(trimmed);
  };

  /**
   * Clears active verification result and resets focus to the message textarea.
   */
  const handleReset = () => {
    setResult(null);
    setMessageText('');
    setSenderInfo('');
    setValidationError('');
    setApiError(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Header & Instructions */}
      <section aria-labelledby="check-heading" className="space-y-1">
        <h1 id="check-heading" className="text-2xl md:text-3xl font-extrabold text-[#14211B] leading-tight">
          {t('checker_heading')}
        </h1>
        <p className="text-sm md:text-base text-gray-600 bangla-text">
          {t('checker_hint')}
        </p>
      </section>

      {/* 2. Form Input Section */}
      <div className="bg-white border border-[#D5E0D9] rounded-2xl p-5 shadow-xs space-y-4">
        {/* Text Area */}
        <div className="space-y-1.5">
          <label htmlFor="message-input" className="block text-sm font-bold text-[#14211B]">
            {t('analyzed_text_label')} <span className="text-[#C0262D]">*</span>
          </label>

          <textarea
            id="message-input"
            ref={textareaRef}
            rows={5}
            value={messageText}
            onChange={handleTextChange}
            placeholder={t('textarea_placeholder')}
            disabled={loading}
            aria-describedby="char-count validation-msg"
            className="w-full p-3.5 text-base text-[#14211B] bangla-text rounded-xl border border-[#D5E0D9] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] focus:border-transparent transition-colors resize-y min-h-[140px] disabled:bg-gray-100"
          />

          {/* Character Counter & Truncate Notification */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-0.5">
            <span id="char-count">
              {t('char_count_label')}: {num(messageText.length)} / {num(MAX_CHARS)}
            </span>
            {isTrimmedWarn && (
              <span className="text-[#B7791F] font-bold text-xs" role="alert">
                {t('char_limit_exceeded_warn')}
              </span>
            )}
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div id="validation-msg" role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#C0262D] font-bold flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* 3. Collapsible Sender Input */}
        <div className="border-t border-[#D5E0D9] pt-3">
          <button
            type="button"
            onClick={() => setShowSender((prev) => !prev)}
            aria-expanded={showSender}
            className="text-sm font-semibold text-[#0F5C3A] hover:underline flex items-center gap-1.5 focus:outline-hidden"
          >
            <span className="text-xs">{showSender ? '▲' : '▼'}</span>
            <span>{t('sender_toggle_label')}</span>
          </button>

          {showSender && (
            <div className="mt-2.5">
              <label htmlFor="sender-input" className="sr-only">
                {t('sender_toggle_label')}
              </label>
              <input
                id="sender-input"
                type="text"
                value={senderInfo}
                onChange={(e) => setSenderInfo(e.target.value)}
                placeholder={t('sender_input_placeholder')}
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D5E0D9] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] disabled:bg-gray-100"
              />
            </div>
          )}
        </div>

        {/* 4. Submission Button */}
        <div className="pt-2">
          <BigButton
            onClick={handleCheck}
            disabled={loading || (countdown !== null && countdown > 0)}
            ariaLabel={t('check_btn')}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span>{t('checking_btn')}</span>
              </span>
            ) : countdown !== null && countdown > 0 ? (
              <span>
                {t('rate_limit_wait')} {num(countdown)} {t('seconds_unit')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>{t('check_btn')}</span>
              </span>
            )}
          </BigButton>
        </div>

        {/* Shortcut to screenshot scan */}
        <div className="text-center pt-1">
          <Link
            to="/scan"
            className="touch-target inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F5C3A] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] rounded-md px-2 py-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{t('scan_shortcut_link')}</span>
          </Link>
        </div>
      </div>

      {/* Loading State Spinner */}
      {loading && (
        <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6">
          <Spinner text={t('checking_btn')} />
        </div>
      )}

      {/* Error with Retry */}
      {apiError && !loading && (
        <div role="alert" className="p-4 bg-red-50 border border-red-300 rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[#C0262D] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-bold text-[#C0262D]">
                {apiError.message_bn || t('error_boundary_title')}
              </h3>
              <p className="text-xs text-gray-600">
                {t('retry')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheck}
            className="touch-target px-4 py-2 bg-[#C0262D] text-white text-sm font-bold rounded-lg hover:bg-red-800 focus:outline-hidden focus:ring-2 focus:ring-[#C0262D]"
          >
            {t('retry')}
          </button>
        </div>
      )}

      {/* 5. Result Card */}
      {result && !loading && (
        <div ref={resultRef}>
          <ResultCard
            result={result}
            originalText={lastAnalyzedText}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
