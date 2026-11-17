import { describe, it, expect } from 'vitest';
import { apiClient } from '../api/client.js';

describe('apiClient with mock dispatch', () => {
  it('successfully returns mock check response', async () => {
    const { data, error } = await apiClient('/api/check', {
      method: 'POST',
      body: JSON.stringify({ text: 'আপনার অ্যাকাউন্ট বন্ধ হয়ে যাবে। এখনই পিন পাঠান।' })
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.verdict).toBe('scam');
    expect(data.verdict_bn).toBe('প্রতারণা');
    expect(data.risk_score).toBe(88);
  });

  it('correctly returns safe verdict for safe awareness messages', async () => {
    const { data, error } = await apiClient('/api/check', {
      method: 'POST',
      body: JSON.stringify({ text: 'কাউকে পিন বা ওটিপি বলবেন না।' })
    });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.verdict).toBe('safe');
    expect(data.verdict_bn).toBe('নিরাপদ');
  });

  it('returns mock metrics data', async () => {
    const { data, error } = await apiClient('/api/metrics', { method: 'GET' });

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.requests_total).toBeGreaterThan(0);
    expect(data.latency_median_ms).toBeDefined();
  });
});
