// Mock data for authentication endpoints

let mockCurrentUser = null;

/**
 * Handles mock login request.
 * @param {object} payload - Login credentials.
 * @returns {object} Authenticated user response.
 */
export function handleMockLogin(payload) {
  if (!payload || !payload.phone || !payload.password) {
    throw {
      code: 'AUTH_FAILED',
      message_bn: 'ফোন নম্বর বা পাসওয়ার্ড ভুল হয়েছে।'
    };
  }
  mockCurrentUser = {
    id: 'usr_inv_001',
    phone: payload.phone,
    name: 'রহিম উদ্দিন',
    district: 'Dhaka',
    language: 'bn'
  };
  return { user: mockCurrentUser };
}

/**
 * Handles mock register request.
 * @param {object} payload - User registration details.
 * @returns {object} Created user response.
 */
export function handleMockRegister(payload) {
  mockCurrentUser = {
    id: 'usr_inv_' + Math.floor(Math.random() * 1000),
    phone: payload.phone,
    name: payload.name,
    district: payload.district,
    language: payload.language || 'bn'
  };
  return { user: mockCurrentUser };
}

/**
 * Handles mock logout request.
 * @returns {object} Success confirmation.
 */
export function handleMockLogout() {
  mockCurrentUser = null;
  return { success: true };
}

/**
 * Handles mock me request.
 * @returns {object} Current user object or throws 401 if unauthenticated.
 */
export function handleMockMe() {
  if (!mockCurrentUser) {
    throw {
      code: 'UNAUTHORIZED',
      message_bn: 'আপনার সেশন নেই।'
    };
  }
  return { user: mockCurrentUser };
}
