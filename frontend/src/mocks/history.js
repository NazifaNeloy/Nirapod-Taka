// Mock data for /api/history

let mockHistoryItems = [
  {
    id: 'chk_001',
    timestamp: '2026-11-17T14:32:00Z',
    text: 'আপনার অ্যাকাউন্ট বন্ধ হয়ে যাবে। এখনই পিন পাঠান।',
    risk_score: 88,
    verdict: 'scam',
    verdict_bn: 'প্রতারণা'
  },
  {
    id: 'chk_002',
    timestamp: '2026-11-16T10:15:00Z',
    text: 'অভিনন্দন! লটারিতে ২৫ লাখ টাকা জিতেছেন, ফি বাবদ ৫০০ টাকা পাঠান।',
    risk_score: 95,
    verdict: 'scam',
    verdict_bn: 'প্রতারণা'
  },
  {
    id: 'chk_003',
    timestamp: '2026-11-15T08:00:00Z',
    text: 'আপনার ওটিপি ১২৩৪৫৬। কাউকে পিন বা ওটিপি বলবেন না।',
    risk_score: 10,
    verdict: 'safe',
    verdict_bn: 'নিরাপদ'
  }
];

/**
 * Handles mock fetch history request.
 * @returns {object} Array of history items.
 */
export function handleMockGetHistory() {
  return { items: [...mockHistoryItems] };
}

/**
 * Handles mock clear history request.
 * @returns {object} Deletion outcome.
 */
export function handleMockDeleteHistory() {
  const count = mockHistoryItems.length;
  mockHistoryItems = [];
  return { success: true, deleted_count: count };
}
