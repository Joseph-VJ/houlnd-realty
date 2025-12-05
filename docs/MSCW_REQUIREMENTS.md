# Houlnd Realty - MSCW Requirements Specification

> **Moscow Prioritization Framework for Feature Development**

---

## ✅ Must Have (Critical for MVP Launch)

These features are essential for the platform to function and must be included in the initial release.

### 1. Core Portals & Access

| Requirement | Description | Priority |
|-------------|-------------|----------|
| **Customer Portal** | Portal for viewing real estate listings (buyers) | Critical |
| **Promoter Portal** | Portal for posting properties with full details (sellers) | Critical |
| **User Registration & Login** | Email/Phone/OTP verification for both buyers and promoters | Critical |

### 2. Discovery & Filtering

| Requirement | Description | Priority |
|-------------|-------------|----------|
| **Sq.ft Price Point Filter** | Real estate filters focused on Sq.ft and Price Point (e.g., ₹999 to ₹19,999 per sq.ft) | **CRITICAL - Main Feature** |
| **Property Type Filter** | Filter for plots, apartments, villas, commercial properties | Critical |
| **Location Filter** | Area, city, and neighborhood-based search | Critical |
| **Budget Filter** | Overall price range filtering | Critical |

### 3. Seller Portal Features

| Requirement | Description | Priority |
|-------------|-------------|----------|
| **Property Details Form** | Budget, preference, amenities, and corresponding prices | Critical |
| **Pricing Status** | Option to mark as negotiable or fixed price | Critical |
| **Visit Scheduling** | Time slots for property visits | Critical |
| **Free Posting with Commission Agreement** | Free listing with agreement to pay commission on successful sale | Critical |
| **Contact Number Protection** | Seller phone number NOT disclosed until customer pays to shortlist/open property | Critical |

### 4. Buyer Portal Features

| Requirement | Description | Priority |
|-------------|-------------|----------|
| **Property Browsing** | View listings with details, images, and pricing | Critical |
| **Shortlist/Save Options** | Save properties for later review | Critical |
| **Appointment Scheduling** | Schedule property visits directly with promoters | Critical |
| **Payment Gateway** | Pay to unlock seller contact information | Critical |

### 5. Trust & Verification

| Requirement | Description | Priority |
|-------------|-------------|----------|
| **Verified Property System** | Mandatory verification (ID/documents/location) | Critical |
| **No Fake Listings Policy** | Strict screening to prevent fraudulent listings | Critical |

---

## 📋 Should Have (High Priority - Phase 2)

These features are important for user engagement and operational efficiency. Target: ~15% of initial development effort.

| Requirement | Description | Rationale |
|-------------|-------------|-----------|
| **Buyer Cart/Wishlist** | Collect multiple interested properties | Supports complex decision-making |
| **Enhanced Schedule Options** | Advanced appointment management | Reduces friction in buyer-seller interaction |
| **Show Interest Button** | Quick signal of intent to promoter | Low-friction engagement |
| **Video Tour of Properties** | View seller-uploaded property walkthrough videos | 3x higher interest compared to photos alone |
| **Promoter Analytics Dashboard** | Insights into listing performance (views, interests) | Helps promoters manage listings effectively |
| **Activity Notifications** | Automated SMS/Email/Push notifications | Improves follow-up consistency |

---

## 💡 Could Have (Future Enhancement - Phase 3)

These features provide advanced differentiation and leverage emerging PropTech trends.

| Requirement | Description | PropTech Trend Alignment |
|-------------|-------------|--------------------------|
| **AI Chat Bots** | 24/7 user guidance and support | Reduces repetitive inquiries |
| **AI Property Matching** | ML-based personalized property recommendations | AI-driven searches reduce search times by 40% |
| **Housing Loan Eligibility Tracker** | EMI calculator and pre-qualification tool | Generates qualified leads |
| **Legal Opinion Tools** | Automated title clearance and legal standing checks | Enhances buyer confidence |
| **Technical Opinion Tools** | Structural valuation reports | Professional property assessment |
| **Virtual 360° Walkthroughs** | VR/AR integration for immersive tours | Reduces need for physical showings |
| **Promoter CRM Integration** | Lead scoring, status tracking, automated follow-ups | Boosts conversion rates |

---

## 🚫 Won't Have (Scope Exclusions)

These features are intentionally excluded to maintain focus, platform integrity, and core vision.

| Exclusion | Rationale |
|-----------|-----------|
| **No Broker/Agent Postings** | Maintains zero-brokerage model and platform trust |
| **No Fake or Litigated Property Listings** | Ensures compliance and platform integrity |
| **No Direct Property Sales Handling** | Avoids complex regulatory burdens; focus on lead generation |

---

## Priority Matrix

```
                    HIGH IMPACT
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │   SHOULD HAVE     │    MUST HAVE      │
    │   (Phase 2)       │    (MVP)          │
    │                   │                   │
LOW ├───────────────────┼───────────────────┤ HIGH
EFFORT│                 │                   │ EFFORT
    │                   │                   │
    │   WON'T HAVE      │    COULD HAVE     │
    │   (Excluded)      │    (Phase 3)      │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW IMPACT
```

---

## Success Metrics

| Metric | Target | Phase |
|--------|--------|-------|
| User Registration Rate | 10,000+ users in 3 months | MVP |
| Property Listings | 5,000+ verified listings | MVP |
| Contact Unlock Rate | 5% of active users | MVP |
| Video Tour Engagement | 50% higher time on page | Phase 2 |
| AI Matching Accuracy | 80%+ relevance score | Phase 3 |

---

*Document Version: 1.0 | Last Updated: December 2025*
