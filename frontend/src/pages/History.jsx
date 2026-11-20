import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/useT.jsx';
import { apiClient } from '../api/client.js';
import { VerdictBadge } from '../components/VerdictBadge.jsx';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { Toast } from '../components/Toast.jsx';
import { Spinner } from '../components/Spinner.jsx';

/**
 * Verification History Page (Screen History / Brief 3.5) featuring:
 * - Newest-first list with expandable text snippets.
 * - Categorical filtering (All, Safe, Suspicious, Scam).
 * - UTF-8 BOM CSV and JSON data export.
 * - Irreversible permanent history deletion protected by ConfirmDialog.
 * @returns {JSX.Element} Verification history view.
 */
export default function History() {
  const { t, num } = useT();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch history on load
  useEffect(() => {
    let isMounted = true;
    async function fetchHistory() {
      setLoading(true);
      const { data, error } = await apiClient('/api/history', { method: 'GET' });
      if (isMounted) {
        if (!error && data && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
        setLoading(false);
      }
    }
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Toggles expansion of shortened message cards.
   * @param {string} id - History record identifier.
   */
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  /**
   * Exports history records as a UTF-8 BOM encoded CSV file compatible with Excel/Google Sheets.
   */
  const handleDownloadCSV = () => {
    if (items.length === 0) return;

    const headers = ['ID', 'Timestamp', 'Verdict', 'Risk Score', 'Message Text'];
    const rows = items.map((item) => [
      `"${item.id}"`,
      `"${item.timestamp || ''}"`,
      `"${item.verdict_bn || item.verdict || ''}"`,
      `"${item.risk_score ?? ''}"`,
      `"${(item.text || '').replace(/"/g, '""')}"`
    ]);

    // Prepend UTF-8 Byte Order Mark (\uFEFF) to guarantee correct Bangla rendering in spreadsheet tools
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nirapod_taka_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);

    setToastMessage(t('csv_downloaded_toast'));
  };

  /**
   * Exports history records as a formatted JSON document.
   */
  const handleDownloadJSON = () => {
    if (items.length === 0) return;

    const jsonStr = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nirapod_taka_history_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);

    setToastMessage(t('json_downloaded_toast'));
  };

  /**
   * Permanently clears all verification history records via DELETE /api/history.
   */
  const handleConfirmClear = async () => {
    setIsConfirmOpen(false);
    const { error } = await apiClient('/api/history', { method: 'DELETE' });

    if (!error) {
      setItems([]);
      setToastMessage(t('history_cleared_toast'));
    }
  };

  // Filter items based on active verdict category
  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.verdict === filter;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Toast Alert */}
      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage('')}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={t('confirm_delete_title')}
        message={t('confirm_delete_desc')}
        confirmText={t('confirm_delete_action')}
        cancelText={t('cancel')}
        onConfirm={handleConfirmClear}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* Header and Summary */}
      <section aria-labelledby="history-heading" className="space-y-1">
        <h1 id="history-heading" className="text-2xl md:text-3xl font-extrabold text-[#14211B] leading-tight">
          {t('history_title')}
        </h1>
        <p className="text-sm md:text-base text-gray-600 bangla-text">
          {t('history_subtitle')}
        </p>
      </section>

      {/* Action Controls: Export & Delete */}
      {items.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="touch-target inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D5E0D9] bg-white text-xs md:text-sm font-bold text-[#0F5C3A] hover:bg-[#F5FAF7] focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('download_csv_btn')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="touch-target inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#D5E0D9] bg-white text-xs md:text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{t('download_json_btn')}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="touch-target inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-xs md:text-sm font-bold text-[#C0262D] hover:bg-red-100 focus:outline-hidden focus:ring-2 focus:ring-[#C0262D] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>{t('clear_history_btn')}</span>
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      {items.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="History Filters">
          {[
            { id: 'all', label: t('filter_all') },
            { id: 'safe', label: t('filter_safe') },
            { id: 'suspicious', label: t('filter_suspicious') },
            { id: 'scam', label: t('filter_scam') }
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap focus:outline-hidden focus:ring-2 focus:ring-[#0F5C3A] ${
                filter === tab.id
                  ? 'bg-[#0F5C3A] text-white shadow-xs'
                  : 'bg-white border border-[#D5E0D9] text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6">
          <Spinner text={t('loading')} />
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="bg-white border border-[#D5E0D9] rounded-2xl p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F5C3A]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#14211B]">
              {t('history_empty_state')}
            </h2>
            <p className="text-sm text-gray-600 bangla-text">
              সন্দেহজনক যেকোনো বার্তা যাচাই করে এখানে আপনার সুরক্ষার ইতিহাস তৈরি করুন।
            </p>
          </div>
          <div className="pt-2 max-w-xs mx-auto">
            <Link
              to="/check"
              className="touch-target w-full big-button min-h-[56px] rounded-2xl bg-[#0F5C3A] text-white font-semibold flex items-center justify-center hover:bg-[#0b452b] transition-colors shadow-xs"
            >
              {t('history_empty_btn')}
            </Link>
          </div>
        </div>
      )}

      {/* Filtered Empty Message */}
      {!loading && items.length > 0 && filteredItems.length === 0 && (
        <div className="bg-white border border-[#D5E0D9] rounded-2xl p-6 text-center text-sm text-gray-600">
          এই ক্যাটাগরিতে কোনো সংরক্ষিত মেসেজ পাওয়া যায়নি।
        </div>
      )}

      {/* History Items List */}
      {!loading && filteredItems.length > 0 && (
        <div className="space-y-3" role="feed" aria-label="History list">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const text = item.text || '';
            const preview = text.length > 70 ? text.slice(0, 70) + '…' : text;

            return (
              <article
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className="bg-white border border-[#D5E0D9] rounded-xl p-4 shadow-xs space-y-3 cursor-pointer hover:border-gray-400 transition-colors"
              >
                {/* Top Row: VerdictBadge, Score, Date */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <VerdictBadge
                      verdict={item.verdict}
                      verdictBn={item.verdict_bn}
                      size="compact"
                    />
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                      {num(item.risk_score ?? 0)} / {num(100)}
                    </span>
                  </div>

                  <time className="text-xs text-gray-500 font-medium">
                    {item.timestamp ? num(item.timestamp.replace('T', ' ').slice(0, 16)) : ''}
                  </time>
                </div>

                {/* Message Body (shortened with full on tap) */}
                <div className="text-sm text-[#14211B] bangla-text leading-relaxed">
                  {isExpanded ? text : preview}
                </div>

                {text.length > 70 && (
                  <div className="text-xs font-bold text-[#0F5C3A] flex items-center gap-1 select-none">
                    <span>{isExpanded ? t('view_less_message') : t('view_full_message')}</span>
                    <span>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
