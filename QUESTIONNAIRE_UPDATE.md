# Questionnaire Update - Ask Only Once

## What Changed

The interview request questionnaire now only appears **once per student**. After answering the initial questions, students will skip directly to the pricing page on subsequent interview requests.

## How It Works

### First Interview Request
1. Student opens interview request modal
2. Sees questionnaire (Step 1):
   - "How many interviews are you expecting?"
   - "How many experts suit your needs?"
3. Answers are saved to localStorage with key: `nexthesis_questionnaire_${studentEmail}`
4. Proceeds to pricing selection (Step 2)
5. Then to scheduling (Step 3)

### Subsequent Interview Requests
1. Student opens interview request modal
2. Component loads saved answers from localStorage
3. **Questionnaire is automatically skipped**
4. Student goes directly to pricing selection (Step 2)
5. Recommendation is pre-calculated based on saved answers
6. Small "Update preferences" link appears if they want to change answers

## Technical Implementation

### Files Modified
- **[InterviewRequest.js](src/InterviewRequest.js)**

### Key Changes

1. **Load saved answers on mount** (lines 22-62):
```javascript
useEffect(() => {
  const savedAnswers = localStorage.getItem(`nexthesis_questionnaire_${userData.email}`);
  if (savedAnswers) {
    setAnswers(JSON.parse(savedAnswers));
    // Auto-calculate recommendation
    setRecommendedTier(recommendation);
    setStep(2); // Skip to pricing
  }
}, []);
```

2. **Save answers when first submitted** (lines 107-124):
```javascript
const handleContinue = () => {
  if (step === 1 && answers.expectedInterviews && answers.platformExperts) {
    // Save to localStorage
    localStorage.setItem(
      `nexthesis_questionnaire_${userData.email}`,
      JSON.stringify(answers)
    );
    // Continue to pricing
  }
};
```

3. **Added "Update preferences" button** (lines 446-453):
- Appears on pricing page
- Allows students to go back and change their answers
- Updated answers are saved to localStorage

## User Experience

### Benefits
✅ Faster interview requests after the first one
✅ No need to answer same questions repeatedly
✅ Maintains personalized recommendations
✅ Easy to update preferences if research scope changes

### Behavior
- First request: Full questionnaire experience
- Subsequent requests: Direct to pricing (2-3 clicks faster)
- Flexibility: Can update preferences anytime via "Update preferences" link
- Per-student: Each student has their own saved answers

## Testing

To test the feature:

1. **First Request**:
   - Login as a student
   - Browse experts and click "Request Interview"
   - Answer both questionnaire questions
   - Notice answers are being collected

2. **Second Request**:
   - Close the modal or complete the request
   - Click "Request Interview" on another expert (or same expert)
   - **Questionnaire should be skipped**
   - Should land directly on pricing page with recommendation

3. **Update Preferences**:
   - On pricing page, click "Update preferences" link
   - Should return to questionnaire
   - Change answers and continue
   - New answers should be saved

## Data Storage

**Location**: Browser localStorage
**Key Format**: `nexthesis_questionnaire_${studentEmail}`
**Data Structure**:
```json
{
  "expectedInterviews": "3-5",
  "platformExperts": "4"
}
```

**Persistence**:
- Saved per browser/device
- Persists across sessions
- Cleared if browser cache is cleared
- Separate for each student email

## Future Enhancements

Possible improvements:
- Store in Supabase instead of localStorage (sync across devices)
- Add "Clear preferences" option in student settings
- Show summary of saved preferences on student dashboard
- Track when preferences were last updated
