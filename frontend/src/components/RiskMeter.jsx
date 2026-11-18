import React from 'react';
import { useT } from '../i18n/useT.jsx';

/**
 * Visual 0–100 risk score meter clearly segmented into three distinct risk bands:
 * Safe (0–29), Suspicious (30–59), and Scam (60–100).
 * @param {object} props - Component props.
 * @param {number} props.score - Risk score between 0 and 100.
 * @returns {JSX.Element} Color-banded progress meter.
 */
export function RiskMeter({ score = 0 }) {
  const { t, num } = useT();
  const clampedScore = Math.min(100, Math.max(0, Number(score) || 0));

  let bandColor = 'bg-[#1B7F3B]';
  let bandText = t('band_safe');
  let textColor = 'text-[#1B7F3B]';

  if (clampedScore >= 60) {
    bandColor = 'bg-[#C0262D]';
    bandText = t('band_scam');
    textColor = 'text-[#C0262D]';
  } else if (clampedScore >= 30) {
    bandColor = 'bg-[#B7791F]';
    bandText = t('band_suspicious');
    textColor = 'text-[#B7791F]';
  }

  return (
    <div className="space-y-2 bg-[#F5FAF7] p-4 rounded-xl border border-[#D5E0D9]">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-gray-700">
          {t('risk_score_label')}
        </span>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-black ${textColor}`}>
            {num(clampedScore)}
          </span>
          <span className="text-xs text-gray-500 font-semibold">/ {num(100)}</span>
          <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-md text-white ${bandColor}`}>
            {bandText}
          </span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={clampedScore}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${t('risk_score_label')}: ${clampedScore}`}
        className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden p-0.5 flex"
      >
        {/* Dynamic score fill bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ${bandColor}`}
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      {/* Three Band Reference Indicators */}
      <div className="flex justify-between text-[11px] font-semibold text-gray-500 px-0.5 pt-0.5 select-none" aria-hidden="true">
        <span className="text-[#1B7F3B]">{num(0)}–{num(29)}: {t('band_safe')}</span>
        <span className="text-[#B7791F]">{num(30)}–{num(59)}: {t('band_suspicious')}</span>
        <span className="text-[#C0262D]">{num(60)}–{num(100)}: {t('band_scam')}</span>
      </div>
    </div>
  );
}
