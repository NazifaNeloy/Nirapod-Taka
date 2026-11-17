// Mock data for /api/check endpoint

export const mockCheckResponse = {
  id: 'chk_001',
  client_uuid: 'c-uuid-12345',
  risk_score: 88,
  verdict: 'scam',
  verdict_bn: 'প্রতারণা',
  reason_bn: 'অ্যাকাউন্ট বন্ধ করার হুমকি দিয়ে জরুরি পিন চাওয়া হয়েছে।',
  action_bn: 'কাউকে পিন বা ওটিপি দেবেন না। কল বা লিংকে ক্লিক করবেন না।',
  signals: [
    {
      label_bn: 'জরুরি চাপ সৃষ্টি',
      points: 35,
      evidence: 'এখনই'
    },
    {
      label_bn: 'পিন বা সংবেদনশীল তথ্য চাওয়া',
      points: 45,
      evidence: 'পিন পাঠান'
    },
    {
      label_bn: 'অ্যাকাউন্ট বন্ধ করার ভয়',
      points: 20,
      evidence: 'অ্যাকাউন্ট বন্ধ'
    }
  ],
  llm: {
    fallback: false
  },
  explainability: {
    top_words: ['পিন', 'বন্ধ', 'এখনই', 'অ্যাকাউন্ট']
  },
  honesty: {
    ml_score: 0.97,
    rule_points: 60,
    llm_agreement: true
  },
  new_badge: null
};

/**
 * Simulates POST /api/check response with mock data based on input text.
 * @param {object} payload - Request payload containing text and optional sender.
 * @returns {object} Scam check verdict response.
 */
export function handleMockCheck(payload = {}) {
  const text = payload.text || '';
  // Hard negative check from guide: "কাউকে পিন বা ওটিপি বলবেন না।"
  if (text.includes('বলবেন না') || text.includes('শেয়ার করবেন না') || text.includes('do not share')) {
    return {
      id: 'chk_safe_001',
      client_uuid: payload.client_uuid || 'c-uuid-safe',
      risk_score: 10,
      verdict: 'safe',
      verdict_bn: 'নিরাপদ',
      reason_bn: 'সচেতনতামূলক বার্তা বা সতর্কতা নোটিশ।',
      action_bn: 'কোনো পদক্ষেপ নেওয়ার প্রয়োজন নেই। সতর্ক থাকুন।',
      signals: [],
      llm: { fallback: false },
      explainability: { top_words: ['সতর্কতা'] },
      honesty: { ml_score: 0.05, rule_points: 0, llm_agreement: true },
      new_badge: null
    };
  }

  return {
    ...mockCheckResponse,
    client_uuid: payload.client_uuid || mockCheckResponse.client_uuid
  };
}
