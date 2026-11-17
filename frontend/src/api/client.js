// Nirapod Taka centralized API client
import { handleMockCheck } from '../mocks/check.js';
import { handleMockLogin, handleMockRegister, handleMockLogout, handleMockMe } from '../mocks/auth.js';
import { handleMockGetHistory, handleMockDeleteHistory } from '../mocks/history.js';
import { handleMockGetBadges } from '../mocks/badges.js';
import { handleMockGetMetrics } from '../mocks/metrics.js';
import { handleMockAsk } from '../mocks/ask.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;
const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const TIMEOUT_MS = 10000;

/**
 * Maps URL and method to matching mock handler when VITE_USE_MOCK is true.
 * @param {string} endpoint - Target relative API path.
 * @param {string} method - HTTP request method.
 * @param {any} body - Request payload.
 * @returns {Promise<any>} Resolves with mock response or rejects with mock error.
 */
async function dispatchMockRequest(endpoint, method, body) {
  // Simulate 120ms realistic mobile delay
  await new Promise((resolve) => setTimeout(resolve, 120));

  const cleanEndpoint = endpoint.replace(/^\/api/, '');

  if (cleanEndpoint === '/check' && method === 'POST') {
    return handleMockCheck(body);
  }
  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    return handleMockLogin(body);
  }
  if (cleanEndpoint === '/auth/register' && method === 'POST') {
    return handleMockRegister(body);
  }
  if (cleanEndpoint === '/auth/logout' && method === 'POST') {
    return handleMockLogout();
  }
  if (cleanEndpoint === '/auth/me' && method === 'GET') {
    return handleMockMe();
  }
  if (cleanEndpoint === '/history' && method === 'GET') {
    return handleMockGetHistory();
  }
  if (cleanEndpoint === '/history' && method === 'DELETE') {
    return handleMockDeleteHistory();
  }
  if (cleanEndpoint === '/badges' && method === 'GET') {
    return handleMockGetBadges();
  }
  if (cleanEndpoint === '/metrics' && method === 'GET') {
    return handleMockGetMetrics();
  }
  if (cleanEndpoint === '/ask' && method === 'POST') {
    return handleMockAsk(body);
  }

  throw {
    code: 'NOT_FOUND',
    message_bn: 'মক সার্ভারে এই ঠিকানাটি পাওয়া যায়নি।'
  };
}

/**
 * Standardizes errors into the contract shape { error: { code, message_bn, retryAfter } }.
 * @param {number} status - HTTP status code.
 * @param {any} rawError - Raw parsed error response or caught exception.
 * @param {Headers} [headers] - Response headers for reading Retry-After.
 * @returns {{ code: string, message_bn: string, retryAfter?: number }} Standardized error object.
 */
function normalizeError(status, rawError, headers) {
  if (rawError && rawError.error && rawError.error.message_bn) {
    return rawError.error;
  }
  if (rawError && rawError.message_bn) {
    return {
      code: rawError.code || `HTTP_${status}`,
      message_bn: rawError.message_bn
    };
  }

  let retryAfter = null;
  if (headers && headers.get('Retry-After')) {
    const parsed = parseInt(headers.get('Retry-After'), 10);
    if (!isNaN(parsed)) retryAfter = parsed;
  }

  switch (status) {
    case 400:
      return { code: 'BAD_REQUEST', message_bn: 'অনুরোধটি সঠিক নয়। দয়া করে তথ্য যাচাই করুন।' };
    case 401:
      return { code: 'UNAUTHORIZED', message_bn: 'আপনার সেশন শেষ হয়ে গেছে। অনুগ্রহ করে লগইন করুন।' };
    case 413:
      return { code: 'PAYLOAD_TOO_LARGE', message_bn: 'ফাইল অনেক বড়। সঠিক আকারের ফাইল দিন।' };
    case 415:
      return { code: 'UNSUPPORTED_MEDIA_TYPE', message_bn: 'শুধু JPEG বা PNG ফরম্যাটের ফাইল দিন।' };
    case 429:
      return {
        code: 'RATE_LIMITED',
        message_bn: 'অতিরিক্ত অনুরোধ করা হয়েছে। কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।',
        retryAfter: retryAfter || 30
      };
    default:
      return { code: 'NETWORK_ERROR', message_bn: 'সার্ভারে সংযোগ করা যাচ্ছে না। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।' };
  }
}

/**
 * Central fetch wrapper enforcing credentials, custom headers, timeout, and mock routing.
 * @param {string} endpoint - API endpoint starting with / or /api.
 * @param {object} [options={}] - Fetch configuration options.
 * @returns {Promise<{ data: any, error: { code: string, message_bn: string, retryAfter?: number } | null }>} Result tuple.
 */
export async function apiClient(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // Handle Mock Mode
  if (USE_MOCK) {
    try {
      const mockResult = await dispatchMockRequest(endpoint, method, options.body ? JSON.parse(options.body) : null);
      return { data: mockResult, error: null };
    } catch (err) {
      return { data: null, error: normalizeError(400, err) };
    }
  }

  // Live Network Mode
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  if (['POST', 'PATCH', 'DELETE'].includes(method)) {
    headers.set('X-Requested-With', 'nirapod');
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers,
      credentials: 'include',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return {
        data: null,
        error: normalizeError(response.status, data, response.headers)
      };
    }

    return { data, error: null };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        data: null,
        error: { code: 'TIMEOUT', message_bn: 'অনুরোধের সময় শেষ হয়ে গেছে (১০ সেকেন্ড)। আবার চেষ্টা করুন।' }
      };
    }
    return {
      data: null,
      error: { code: 'CONNECTION_FAILED', message_bn: 'সার্ভারে সংযোগ বিচ্ছিন্ন। ইন্টারনেট সংযোগ পরীক্ষা করুন।' }
    };
  }
}
