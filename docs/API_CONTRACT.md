# Nirapod Taka API Contract (v1.0.0 - Frozen)

## General Network Rules
- Base URL: `/api`
- All requests send `credentials: "include"`.
- All state-changing requests (`POST`, `PATCH`, `DELETE`) require header: `X-Requested-With: nirapod`.
- All errors follow the uniform shape:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message_bn": "বাংলা ত্রুটি বার্তা"
  }
}
```

---

## 1. Authentication Endpoints

### POST `/api/auth/register`
**Request:**
```json
{
  "phone": "01700000001",
  "password": "SecretPassword123",
  "name": "রহিম উদ্দিন",
  "district": "Dhaka",
  "language": "bn"
}
```
**Response (201 Created):**
```json
{
  "user": {
    "id": "usr_inv_001",
    "phone": "01700000001",
    "name": "রহিম উদ্দিন",
    "district": "Dhaka",
    "language": "bn"
  }
}
```

### POST `/api/auth/login`
**Request:**
```json
{
  "phone": "01700000001",
  "password": "SecretPassword123"
}
```
**Response (200 OK):**
```json
{
  "user": {
    "id": "usr_inv_001",
    "phone": "01700000001",
    "name": "রহিম উদ্দিন",
    "district": "Dhaka",
    "language": "bn"
  }
}
```
*(Token is set via secure httpOnly cookie)*

### POST `/api/auth/logout`
**Response (200 OK):**
```json
{
  "success": true
}
```

### GET `/api/auth/me`
**Response (200 OK):**
```json
{
  "user": {
    "id": "usr_inv_001",
    "phone": "01700000001",
    "name": "রহিম উদ্দিন",
    "district": "Dhaka",
    "language": "bn"
  }
}
```
*(401 Unauthorized if not logged in)*

---

## 2. Scam Checker Endpoints

### POST `/api/check`
**Request:**
```json
{
  "text": "আপনার অ্যাকাউন্ট বন্ধ হয়ে যাবে। এখনই পিন পাঠান।",
  "sender": "01700000002",
  "client_uuid": "c-uuid-12345"
}
```
**Response (200 OK):**
```json
{
  "id": "chk_001",
  "client_uuid": "c-uuid-12345",
  "risk_score": 88,
  "verdict": "scam",
  "verdict_bn": "প্রতারণা",
  "reason_bn": "অ্যাকাউন্ট বন্ধ করার হুমকি দিয়ে জরুরি পিন চাওয়া হয়েছে।",
  "action_bn": "কাউকে পিন বা ওটিপি দেবেন না। কল বা লিংকে ক্লিক করবেন না।",
  "signals": [
    {
      "label_bn": "জরুরি চাপ সৃষ্টি",
      "points": 35,
      "evidence": "এখনই"
    },
    {
      "label_bn": "পিন বা সংবেদনশীল তথ্য চাওয়া",
      "points": 45,
      "evidence": "পিন পাঠান"
    },
    {
      "label_bn": "অ্যাকাউন্ট বন্ধ করার ভয়",
      "points": 20,
      "evidence": "অ্যাকাউন্ট বন্ধ"
    }
  ],
  "llm": {
    "fallback": false
  },
  "explainability": {
    "top_words": ["পিন", "বন্ধ", "এখনই", "অ্যাকাউন্ট"]
  },
  "honesty": {
    "ml_score": 0.97,
    "rule_points": 60,
    "llm_agreement": true
  },
  "new_badge": null
}
```

---

## 3. History & Badges

### GET `/api/history`
**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "chk_001",
      "timestamp": "2026-11-17T14:32:00Z",
      "text": "আপনার অ্যাকাউন্ট বন্ধ হয়ে যাবে। এখনই পিন পাঠান।",
      "risk_score": 88,
      "verdict": "scam",
      "verdict_bn": "প্রতারণা"
    }
  ]
}
```

### DELETE `/api/history`
**Response (200 OK):**
```json
{
  "success": true,
  "deleted_count": 1
}
```

### GET `/api/badges`
**Response (200 OK):**
```json
{
  "badges": [
    {
      "id": "first_check",
      "title_bn": "প্রথম যাচাই সম্পন্ন",
      "earned": true,
      "earned_at": "2026-11-17"
    },
    {
      "id": "guardian",
      "title_bn": "কমিউনিটি রক্ষক",
      "earned": false,
      "hint_bn": "৫টি প্রতারণামূলক বার্তা যাচাই করুন"
    },
    {
      "id": "quiz_master",
      "title_bn": "স্ক্যাম কুইজ মাস্টার",
      "earned": false,
      "hint_bn": "কুইজে ৪ বা তার বেশি স্কোর পান"
    }
  ]
}
```

---

## 4. Metrics & Ask

### GET `/api/metrics`
**Response (200 OK):**
```json
{
  "requests_total": 1420,
  "latency_median_ms": 38,
  "latency_p95_ms": 112,
  "llm_calls": 980,
  "tokens_in": 128400,
  "tokens_out": 42100,
  "cache_hits": 840,
  "cache_misses": 580,
  "provider_429s": 0,
  "fallbacks": 14,
  "injections_blocked": 6,
  "uploads_rejected": 2,
  "circuit_breaker": "closed",
  "latency_trend": [42, 39, 45, 38, 36, 40, 38],
  "last_updated": "2026-11-18T01:00:00Z"
}
```

### POST `/api/ask`
**Request:**
```json
{
  "question": "পিন কাউকে বলা যাবে?"
}
```
**Response (200 OK):**
```json
{
  "answer_bn": "না, আপনার এমএফএস বা ব্যাংক পিন এবং ওটিপি সম্পূর্ণ গোপনীয়। কোনো কর্মকর্তা বা হেল্পলাইন কর্মীও কখনো পিন জানতে চাইবে না। কাউকে কখনোই পিন বলবেন না।",
  "sources": [
    {
      "publisher": "বাংলাদেশ ব্যাংক",
      "title": "আর্থিক নিরাপত্তা নির্দেশিকা",
      "url": "https://www.bb.org.bd"
    }
  ],
  "blocked": false,
  "i_dont_know": false
}
```
