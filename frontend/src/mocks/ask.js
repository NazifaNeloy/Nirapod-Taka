// Mock data for /api/ask endpoint

/**
 * Handles mock ask assistant question.
 * @param {object} payload - Question payload.
 * @returns {object} Answer with verified sources.
 */
export function handleMockAsk(payload) {
  const q = (payload && payload.question) || '';

  // Injection test case from guide
  if (q.includes('ignore previous instructions') || q.includes('সিস্টেম প্রম্পট')) {
    return {
      answer_bn: '',
      sources: [],
      blocked: true,
      i_dont_know: false
    };
  }

  if (q.includes('পিন') || q.includes('PIN')) {
    return {
      answer_bn: 'না, আপনার এমএফএস বা ব্যাংক পিন এবং ওটিপি সম্পূর্ণ গোপনীয়। কোনো কর্মকর্তা বা হেল্পলাইন কর্মীও কখনো পিন জানতে চাইবে না। কাউকে কখনোই পিন বলবেন না।',
      sources: [
        {
          publisher: 'বাংলাদেশ ব্যাংক',
          title: 'আর্থিক নিরাপত্তা নির্দেশিকা',
          url: 'https://www.bb.org.bd'
        }
      ],
      blocked: false,
      i_dont_know: false
    };
  }

  return {
    answer_bn: 'সন্দেহজনক যেকোনো লেনদেন বা বার্তার ক্ষেত্রে সংশ্লিষ্ট ব্যাংকের অফিশিয়াল হেল্পলাইনে ১৬২৩৬ কল করে অবিলম্বে রিপোর্ট করুন।',
    sources: [
      {
        publisher: 'জাতীয় ভোক্তা-অধিকার সংরক্ষণ অধিদপ্তর',
        title: 'প্রতারণা প্রতিরোধ হেল্পলাইন',
        url: 'https://dncrp.gov.bd'
      }
    ],
    blocked: false,
    i_dont_know: false
  };
}
