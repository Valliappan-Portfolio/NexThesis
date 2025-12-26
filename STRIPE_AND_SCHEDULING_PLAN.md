# Stripe Integration + Enhanced Scheduling - Implementation Plan

## Overview

This is a major enhancement that touches multiple parts of the system. I'll implement it in phases to ensure everything works smoothly.

## Phase 1: Database Schema ✅ READY

**File**: [SCHEDULING_MIGRATION.sql](SCHEDULING_MIGRATION.sql)

**Changes**:
- Add `availability_blocks` (JSONB) to professionals table
- Add `availability_timezone` (TEXT) to professionals table
- Add `preferred_datetime` (TIMESTAMPTZ) to interview_requests table
- Add `slot_duration_minutes` (INTEGER) to interview_requests table
- Helper functions for slot validation

**Run this first** in Supabase SQL Editor before proceeding.

---

## Phase 2: Stripe Payment Integration

### 2A: Install Stripe

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2B: Update BuyCredits.js

**Changes**:
1. Replace test payment with real Stripe Checkout
2. Flow:
   - Student selects package
   - Redirects to Stripe hosted checkout
   - After payment → Stripe webhook → Add credits
   - Success → Show confirmation

**New Logic**:
```
Student clicks "Buy"
  → Create Stripe Checkout Session
  → Redirect to Stripe payment page
  → Student enters card details
  → Payment success → Redirect back
  → Add credits to database
  → Send confirmation email
```

### 2C: Create Stripe Utility

**New file**: `src/utils/stripe.js`
- `createCheckoutSession(package)` - Creates Stripe session
- `handlePaymentSuccess(sessionId)` - Processes successful payment
- Uses Stripe publishable key from `.env`

---

## Phase 3: Professional Availability UI

### 3A: Create AvailabilityManager Component

**New file**: `src/components/AvailabilityManager.js`

**UI Design**:
```
┌─────────────────────────────────────────┐
│ 📅 Set Your Availability                │
├─────────────────────────────────────────┤
│ Timezone: [Europe/London ▼]            │
├─────────────────────────────────────────┤
│           Morning  Afternoon  Evening   │
│           9-11am    2-4pm     6-8pm     │
│ Monday     [✓]      [✓]       [ ]       │
│ Tuesday    [✓]      [ ]       [✓]       │
│ Wednesday  [✓]      [✓]       [✓]       │
│ Thursday   [ ]      [✓]       [ ]       │
│ Friday     [✓]      [✓]       [ ]       │
│ Saturday   [ ]      [ ]       [ ]       │
│ Sunday     [ ]      [ ]       [ ]       │
├─────────────────────────────────────────┤
│              [Save Availability]         │
└─────────────────────────────────────────┘
```

**Features**:
- Clean checkbox grid (7 days × 3 time blocks)
- Timezone selector
- Saves to `availability_blocks` in database
- Visual feedback on save

### 3B: Add to ProfessionalWelcome/Dashboard

Add button: "Manage Availability" → Opens AvailabilityManager modal

---

## Phase 4: Student Slot Booking UI

### 4A: Update InterviewRequest Component

**Replace** current time preferences (Morning/Afternoon/Evening) with:

**New UI**:
```
┌─────────────────────────────────────────┐
│ 📅 Select Interview Date & Time         │
├─────────────────────────────────────────┤
│ 1. Choose Date                          │
│ [Calendar Widget]                       │
│ Selected: January 15, 2025             │
├─────────────────────────────────────────┤
│ 2. Available Time Slots                │
│ ○ 9:00 AM - 9:30 AM                    │
│ ○ 9:30 AM - 10:00 AM                   │
│ ● 2:00 PM - 2:30 PM  (Selected)        │
│ ○ 2:30 PM - 3:00 PM                    │
│ ○ 6:00 PM - 6:30 PM                    │
├─────────────────────────────────────────┤
│ Your timezone: Europe/Paris             │
│ Professional's time: 1:00 PM - 1:30 PM  │
├─────────────────────────────────────────┤
│           [Back]  [Submit Request]      │
└─────────────────────────────────────────┘
```

**Flow**:
1. Student selects date from calendar
2. System queries professional's `availability_blocks` for that day
3. Generates 30-min slots within available blocks
4. Student selects one slot
5. Converts to UTC and stores in `preferred_datetime`

### 4B: Add Slot Validation

Before submission:
- Check if selected slot falls within professional's availability
- If NO → Show error "Professional not available"
- If YES → Create request with `status='matched'`

---

## Phase 5: Integration & Testing

### 5A: Update Interview Confirmation Flow

**Current**:
```
Professional confirms → Creates meeting → Sends emails
```

**New**:
```
Professional confirms →
  Check if student has credits →
  Deduct 1 credit →
  Creates meeting for preferred_datetime →
  Sends emails with specific date/time
```

### 5B: Email Templates Update

Update email templates to show:
- Specific date/time (not "To be scheduled")
- Both timezones (student's and professional's)
- Clear calendar invite format

---

## File Structure

```
src/
├── components/
│   └── AvailabilityManager.js     (NEW)
├── utils/
│   ├── stripe.js                  (NEW)
│   ├── scheduling.js              (NEW)
│   ├── creditSystem.js            (UPDATE)
│   ├── dailyco.js                 (existing)
│   └── resend.js                  (UPDATE email templates)
├── BuyCredits.js                  (UPDATE - Stripe integration)
├── InterviewRequest.js            (UPDATE - slot booking)
├── ProfessionalWelcome.js         (UPDATE - add availability button)
└── ProfessionalDashboard.js       (existing)
```

---

## Implementation Order

**I recommend this order**:

1. ✅ **Database Migration** - Run SQL (already created)
2. **Stripe Integration** - Get payments working first
3. **Availability UI** - Let professionals set schedules
4. **Slot Booking UI** - Let students book specific times
5. **Integration** - Connect everything together
6. **Testing** - End-to-end flow

---

## Estimated Changes

- **New files**: 3 (AvailabilityManager, stripe.js, scheduling.js)
- **Updated files**: 4 (BuyCredits, InterviewRequest, resend.js, creditSystem.js)
- **Database**: 1 migration (already created)
- **npm packages**: 2 (@stripe/stripe-js, @stripe/react-stripe-js)

---

## Questions Before I Proceed

1. **Stripe Webhooks**: Do you want to set up webhooks for production, or is client-side payment confirmation OK for now (simpler)?

2. **Availability Granularity**: The plan uses 3 fixed blocks (Morning 9-11, Afternoon 2-4, Evening 6-8). Is this OK, or do you want custom blocks?

3. **Slot Duration**: Fixed at 30 minutes OK? Or should professionals be able to set their interview duration?

4. **Calendar Component**: Should I use a simple date picker or install a full calendar library (react-calendar)?

5. **Implementation Speed**: This is ~500-800 lines of new code. Do you want me to:
   - **Option A**: Implement everything at once (faster, but harder to review)
   - **Option B**: Implement in phases, showing you each piece for approval (slower, but more controlled)

Let me know your preferences and I'll proceed!
