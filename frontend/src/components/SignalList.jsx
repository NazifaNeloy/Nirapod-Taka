import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Escapes regex special characters to prevent ReDoS or invalid regex syntax.
 * @param {string} str - Raw input string.
 * @returns {string} Sanitized string safe for RegExp creation.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Renders fired scam signals with point values and displays the original message
 * with matched evidence words highlighted as pure React text elements (never dangerouslySetInnerHTML).
 * @param {object} props - Component props.
 * @param {Array<{label_bn: string, points: number, evidence: string}>} props.signals - Fired detection signals.
 * @param {string} props.originalText - Raw scam text analyzed.
 * @returns {JSX.Element} Signal list and highlighted evidence card.
 */
export function SignalList({ signals = [], originalText = '' }) {
  const { t, num } = useT();

  // Extract all valid evidence phrases for safe React text highlighting
  const evidencePhrases = signals
    .map((s) => s.evidence)
    .filter((e) => typeof e === 'string' && e.trim().length > 0);

  /**
   * Safely highlights matching words in text without any HTML string injection.
   * @param {string} text - Message text.
   * @returns {React.ReactNode[]} Array of plain text nodes and marked spans.
   */
  const renderHighlightedText = (text) => {
    if (!text) return null;
    if (evidencePhrases.length === 0) {
      return <span>{text}</span>;
    }

    const regexPattern = `(${evidencePhrases.map(escapeRegex).join('|')})`;
    const parts = text.split(new RegExp(regexPattern, 'gi'));

    return parts.map((part, index) => {
      const isMatch = evidencePhrases.some(
        (ev) => ev.toLowerCase() === part.toLowerCase()
      );
      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-amber-200 text-[#14211B] font-bold px-1 py-0.5 rounded-sm mx-0.5 inline-block"
          >
            {part}
          </mark>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Original Message with Safe Evidence Highlight */}
      <div className="bg-white border border-[#D5E0D9] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-gray-600">
          <span>{t('analyzed_text_label')}</span>
          <span className="text-[11px] text-gray-500">{t('highlight_hint')}</span>
        </div>
        <div className="text-base text-[#14211B] bangla-text leading-relaxed bg-[#F5FAF7] p-3 rounded-lg border border-[#D5E0D9] break-words">
          {renderHighlightedText(originalText)}
        </div>
      </div>

      {/* 2. Detected Threat Signals Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-700 flex items-center justify-between">
          <span>{t('signals_heading')}</span>
          <span className="text-xs text-gray-500 font-medium">
            {signals.length > 0 ? `${num(signals.length)} ${t('signals_count_unit')}` : t('no_signals')}
          </span>
        </h4>

        {signals.length === 0 ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-[#1B7F3B] font-medium">
            {t('no_signals_detected')}
          </div>
        ) : (
          <ul className="space-y-2 list-none p-0 m-0" aria-label={t('signals_heading')}>
            {signals.map((signal, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#D5E0D9] shadow-2xs gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#C0262D] mt-2 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-sm font-bold text-[#14211B] block">
                      {signal.label_bn}
                    </span>
                    {signal.evidence && (
                      <span className="text-xs text-gray-500 mt-0.5 block">
                        {t('matched_keyword')}: <span className="font-semibold text-gray-700">“{signal.evidence}”</span>
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-sm font-extrabold px-2.5 py-1 rounded-lg bg-red-100 text-[#C0262D] whitespace-nowrap">
                  +{num(signal.points)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
