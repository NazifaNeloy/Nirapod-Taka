// Mock data for /api/metrics

/**
 * Handles mock system metrics request.
 * @returns {object} Real-time metrics values.
 */
export function handleMockGetMetrics() {
  return {
    requests_total: 1420,
    latency_median_ms: 38,
    latency_p95_ms: 112,
    llm_calls: 980,
    tokens_in: 128400,
    tokens_out: 42100,
    cache_hits: 840,
    cache_misses: 580,
    provider_429s: 0,
    fallbacks: 14,
    injections_blocked: 6,
    uploads_rejected: 2,
    circuit_breaker: 'closed',
    latency_trend: [42, 39, 45, 38, 36, 40, 38],
    last_updated: new Date().toISOString()
  };
}
