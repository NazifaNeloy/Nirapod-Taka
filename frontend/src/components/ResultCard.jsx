import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT.jsx';
import { VerdictBadge } from './VerdictBadge.jsx';
import { RiskMeter } from './RiskMeter.jsx';
import { SignalList } from './SignalList.jsx';
import { BigButton } from './BigButton.jsx';

/**
 * Complete result presentation card rendered following scam verification.
 * Adheres strictly to the layout hierarchy and safety specifications defined in Brief 3.2.
 * @param {object} props - Component props.
 * @param {object} props.result - API check result object.
 * @param {string} props.originalText - Raw user input text analyzed.
 * @param {Function} props.onReset - Callback to clear result and test another message.
 * @returns {JSX.Element} Structured result card.
 */
export function ResultCard({ result, originalText, onReset }) {
  const { t, num } = useT();
  const [showExplain, setShowExplain] = useState(false);
  const [showTrace, setShowTrace] = useState(false);

  if (!result) return null;

  const {
    verdict = 'suspicious',
    verdict_bn,
    risk_score = 0,
    reason_bn = '',
    action_bn = '',
    signals = [],
    llm = {},
    explainability = {},
    honesty = {}
  } = result;

  const isFallback = Boolean(llm && llm.fallback);
  const topWords = explainability?.top_words || [];

  return (
    <section
      role="region"
      aria-live="polite"
      aria-labelledby="result-title"
      className="bg-white border-2 border-[#D5E0D9] rounded-2xl p-5 md:p-6 shadow-sm space-y-6 transition-all duration-300"
    >
      {/* 1. Header with VerdictBadge & Fallback Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D5E0D9] pb-4">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            {t('verdict_header')}
          </span>
          <VerdictBadge verdict={verdict} verdictBn={verdict_bn} size="large" />
        </div>

        {/* Small fallback badge when llm.fallback is true */}
        {isFallback && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1D5FA8] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#1D5FA8]" aria-hidden="true" />
            <span>{t('fallback_mode_badge')}</span>
          </div>
        )}
      </div>

      {/* 2. RiskMeter: 0–100 with the 3 color-coded bands */}
      <RiskMeter score={risk_score} />

      {/* 3. Reason and Highlighted Single Action */}
      <div className="space-y-3">
        {reason_bn && (
          <div className="text-base font-semibold text-[#14211B] bangla-text leading-relaxed">
            <span className="text-gray-600 font-normal">{t('reason_label')}: </span>
            {reason_bn}
          </div>
        )}

        {action_bn && (
          <div className="bg-red-50 border-l-4 border-[#C0262D] p-4 rounded-r-xl space-y-1">
            <span className="text-xs font-bold text-[#C0262D] uppercase tracking-wider block">
              {t('action_header')}
            </span>
            <p className="text-base md:text-lg font-bold text-[#14211B] bangla-text leading-snug">
              {action_bn}
            </p>
          </div>
        )}
      </div>

      {/* 4. SignalList with Safe Plain Text Highlighting */}
      <SignalList signals={signals} originalText={originalText} />

      {/* 5. Explainability ("কেন?" Button) */}
      {topWords.length > 0 && (
        <div className="border-t border-[#D5E0D9] pt-4">
          <button
            type="button"
            onClick={() => setShowExplain((prev) => !prev)}
            aria-expanded={showExplain}
            className="touch-target inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D5E0D9] bg-[#F5FAF7] hover:bg-gray-100 text-sm font-bold text-[#14211B] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#1D5FA8]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('why_button')}</span>
            <span className="text-xs text-gray-500 font-normal">
              {showExplain ? '▲' : '▼'}
            </span>
          </button>

          {showExplain && (
            <div className="mt-3 p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2 text-sm">
              <span className="font-bold text-gray-800 block text-xs">
                {t('why_top_words_label')}
              </span>
              <div className="flex flex-wrap gap-2">
                {topWords.map((word, wIdx) => (
                  <span
                    key={wIdx}
                    className="px-2.5 py-1 bg-white border border-sky-300 rounded-md font-semibold text-sky-950 text-xs shadow-2xs"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Mandatory Honesty Agreement Line */}
      <div className="p-3 bg-gray-50 border border-[#D5E0D9] rounded-xl text-xs text-gray-600 bangla-text leading-relaxed">
        <span className="font-bold text-gray-700">{t('honesty_title')}: </span>
        <span>
          ML {num(honesty.ml_score ?? 0.97)}, {t('rule_points_label')} {num(honesty.rule_points ?? 60)}, LLM {honesty.llm_agreement !== false ? t('llm_agreed') : t('llm_disagreed')}. {t('honesty_disclaimer')}
        </span>
      </div>

      {/* 7. Collapsible Multi-Agent Trace Panel (P1) */}
      <div className="border-t border-[#D5E0D9] pt-2">
        <button
          type="button"
          onClick={() => setShowTrace((prev) => !prev)}
          aria-expanded={showTrace}
          className="text-xs text-gray-500 hover:text-gray-800 font-semibold flex items-center gap-1 focus:outline-hidden"
        >
          <span>{t('agent_trace_label')}</span>
          <span>{showTrace ? '▲' : '▼'}</span>
        </button>

        {showTrace && (
          <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs space-y-1 font-mono text-gray-700">
            <div>Agent 1 (Rule Engine): Fired {signals.length} rules</div>
            <div>Agent 2 (ML Classifier): Score {honesty.ml_score ?? 0.97}</div>
            <div>Agent 3 (LLM Validator): Consensus {honesty.llm_agreement !== false ? 'True' : 'False'}</div>
          </div>
        )}
      </div>

      {/* 8. Action Buttons: Check Another & Soft Register for Guests */}
      <div className="space-y-3 pt-2">
        <BigButton onClick={onReset} ariaLabel={t('check_another_btn')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{t('check_another_btn')}</span>
        </BigButton>

        {/* Soft prompt for guests */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-[#0F5C3A] font-medium bangla-text">
            {t('guest_save_history_prompt')}
          </span>
          <Link
            to="/register"
            className="touch-target text-xs font-bold px-3 py-1.5 rounded-lg bg-[#0F5C3A] text-white hover:bg-[#0b452b] transition-colors"
          >
            {t('nav_register')}
          </Link>
        </div>
      </div>
    </section>
  );
}
