// Mock data for /api/badges

export const mockBadgesList = [
  {
    id: 'first_check',
    title_bn: 'প্রথম যাচাই সম্পন্ন',
    earned: true,
    earned_at: '2026-11-17'
  },
  {
    id: 'guardian',
    title_bn: 'কমিউনিটি রক্ষক',
    earned: false,
    hint_bn: '৫টি প্রতারণামূলক বার্তা যাচাই করুন'
  },
  {
    id: 'quiz_master',
    title_bn: 'স্ক্যাম কুইজ মাস্টার',
    earned: false,
    hint_bn: 'কুইজে ৪ বা তার বেশি স্কোর পান'
  }
];

/**
 * Handles mock fetch badges request.
 * @returns {object} List of badges.
 */
export function handleMockGetBadges() {
  return { badges: [...mockBadgesList] };
}
