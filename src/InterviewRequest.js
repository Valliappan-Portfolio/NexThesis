import React, { useState } from 'react';
import { ArrowRight, X, CheckCircle, Sparkles } from 'lucide-react';

const InterviewRequest = ({ expert, onClose, onComplete }) => {
  // Guard against missing expert
  if (!expert) {
    return null;
  }

  const [step, setStep] = useState(1); // 1: questions, 2: pricing recommendation, 3: time preferences
  const [answers, setAnswers] = useState({
    expectedInterviews: null,
    platformExperts: null
  });
  const [selectedTier, setSelectedTier] = useState(null);
  const [recommendedTier, setRecommendedTier] = useState(null);
  const [timePreferences, setTimePreferences] = useState({
    dayPreference: null,
    timePreference: null,
    timezone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const interviewOptions = [
    { value: '1-2', label: '1-2 interviews' },
    { value: '3-5', label: '3-5 interviews' },
    { value: '6-10', label: '6-10 interviews' }
  ];

  const platformExpertOptions = [
    { value: '1', label: '1 expert', interviews: 1, emoji: '👤' },
    { value: '2', label: '2 experts', interviews: 2, emoji: '👥' },
    { value: '4', label: '4 experts', interviews: 4, emoji: '👨‍👩‍👧‍👦' },
    { value: '6+', label: 'More than 6 experts', interviews: 6, emoji: '🌐' }
  ];

  const pricingTiers = [
    { id: 'espresso', name: 'Espresso Shot', price: 8, interviews: 1, emoji: '☕' },
    { id: 'starter', name: 'Research Starter', price: 20, interviews: 2, emoji: '📝', popular: true },
    { id: 'deepdive', name: 'Deep Dive', price: 32, interviews: 4, emoji: '🔍' },
    { id: 'complete', name: 'Thesis Complete', price: 60, interviews: 6, emoji: '🎓' }
  ];

  const calculateRecommendation = () => {
    const expectedNum = answers.expectedInterviews === '1-2' ? 2 : 
                       answers.expectedInterviews === '3-5' ? 5 : 10;
    const platformNum = answers.platformExperts === '6+' ? 6 : parseInt(answers.platformExperts);

    // Recommend based on the minimum needed
    const needed = Math.min(expectedNum, platformNum);

    if (needed <= 1) return pricingTiers[0];
    if (needed <= 2) return pricingTiers[1];
    if (needed <= 4) return pricingTiers[2];
    return pricingTiers[3];
  };

  const handleAnswer = (question, value) => {
    setAnswers({ ...answers, [question]: value });
  };

  const handleContinue = () => {
    if (step === 1) {
      if (answers.expectedInterviews && answers.platformExperts) {
        const recommendation = calculateRecommendation();
        setRecommendedTier(recommendation);
        setStep(2);
      }
    }
  };

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setStep(3);
  };

  const handleSubmitRequest = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InterviewRequest.js:72',message:'handleSubmitRequest called',data:{hasDayPref:!!timePreferences.dayPreference,hasTimePref:!!timePreferences.timePreference,hasTimezone:!!timePreferences.timezone,hasSelectedTier:!!selectedTier,hasExpert:!!expert,expertEmail:expert?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    if (!timePreferences.dayPreference || !timePreferences.timePreference || !timePreferences.timezone) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InterviewRequest.js:75',message:'Validation failed - missing preferences',data:{dayPreference:timePreferences.dayPreference,timePreference:timePreferences.timePreference,timezone:timePreferences.timezone},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return;
    }

    if (!selectedTier) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InterviewRequest.js:82',message:'selectedTier is null',data:{selectedTier},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      alert('Please select a pricing tier first.');
      return;
    }

    if (!expert || !expert.email) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InterviewRequest.js:88',message:'expert or expert.email is missing',data:{expert,expertEmail:expert?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      alert('Expert information is missing. Please try again.');
      return;
    }

    setSubmitting(true);
    try {
      const studentData = JSON.parse(localStorage.getItem('nexthesis_user') || '{}');
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InterviewRequest.js:96',message:'Creating requestData',data:{studentEmail:studentData.email,professionalEmail:expert.email,selectedTierId:selectedTier.id,selectedTierName:selectedTier.name,selectedTierPrice:selectedTier.price},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Create interview request in database
      const requestData = {
        student_email: studentData.email,
        professional_email: expert.email,
        pricing_tier: selectedTier.id,
        pricing_tier_name: selectedTier.name,
        price: selectedTier.price,
        student_day_preference: timePreferences.dayPreference,
        student_time_preference: timePreferences.timePreference,
        student_timezone: timePreferences.timezone,
        status: 'pending', // pending -> confirmed -> paid -> scheduled
        created_at: new Date().toISOString()
      };

      // In a real app, this would save to Supabase
      // For now, we'll simulate and show success
      console.log('Request data:', requestData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onComplete({
        expert,
        answers,
        selectedTier,
        timePreferences,
        requestData
      });
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InterviewRequest.js:109',message:'Error in handleSubmitRequest',data:{errorMessage:error.message,errorStack:error.stack,selectedTier,expert:expert?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl max-w-3xl w-full p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Request Interview</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{expert?.first_name || ''} {expert?.last_name || ''}</h2>
              <p className="text-gray-400">{expert?.role || ''} {expert?.company ? `at ${expert.company}` : ''}</p>
            </div>

            <div className="space-y-8">
              {/* Question 1 */}
              <div>
                <h3 className="text-xl font-bold mb-4">
                  How many interviews are you expecting for this thesis?
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {interviewOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer('expectedInterviews', option.value)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        answers.expectedInterviews === option.value
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.value === '1-2' ? '📝' : option.value === '3-5' ? '📚' : '🎓'}</div>
                      <div className="font-semibold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <h3 className="text-xl font-bold mb-4">
                  How many experts in this platform suit your research needs?
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {platformExpertOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer('platformExperts', option.value)}
                      className={`p-6 rounded-xl border-2 transition-all text-center ${
                        answers.platformExperts === option.value
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <div className="font-semibold text-sm">{option.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{option.interviews} interview{option.interviews > 1 ? 's' : ''}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleContinue}
                disabled={!answers.expectedInterviews || !answers.platformExperts}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Schedule Your Interview</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">When works for you?</h2>
              <p className="text-gray-400">
                Select your preferred day and time. We'll match it with {expert.first_name}'s availability.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Day Preference *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Weekday', 'Weekend', 'Both'].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTimePreferences({...timePreferences, dayPreference: option.toLowerCase()})}
                      className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        timePreferences.dayPreference === option.toLowerCase()
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Time Preference *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Morning', 'Afternoon', 'Evening'].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTimePreferences({...timePreferences, timePreference: option.toLowerCase()})}
                      className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        timePreferences.timePreference === option.toLowerCase()
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Your Timezone *</label>
                <select
                  value={timePreferences.timezone}
                  onChange={(e) => setTimePreferences({...timePreferences, timezone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="" className="bg-gray-900">Select timezone</option>
                  <option value="UTC" className="bg-gray-900">UTC</option>
                  <option value="Europe/London" className="bg-gray-900">Europe/London (GMT)</option>
                  <option value="Europe/Paris" className="bg-gray-900">Europe/Paris (CET)</option>
                  <option value="Europe/Madrid" className="bg-gray-900">Europe/Madrid (CET)</option>
                  <option value="America/New_York" className="bg-gray-900">America/New_York (EST)</option>
                  <option value="America/Los_Angeles" className="bg-gray-900">America/Los_Angeles (PST)</option>
                  <option value="Asia/Dubai" className="bg-gray-900">Asia/Dubai (GST)</option>
                  <option value="Asia/Singapore" className="bg-gray-900">Asia/Singapore (SGT)</option>
                  <option value="Asia/Tokyo" className="bg-gray-900">Asia/Tokyo (JST)</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={!timePreferences.dayPreference || !timePreferences.timePreference || !timePreferences.timezone || submitting}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Recommended Plan</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-gray-400">
                Based on your answers, we recommend a plan that fits your research needs.
              </p>
            </div>

            {recommendedTier && (
            <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{recommendedTier.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{recommendedTier.name}</h3>
                    {recommendedTier.popular && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-2">
                    {recommendedTier.interviews} interview{recommendedTier.interviews > 1 ? 's' : ''} for €{recommendedTier.price}
                  </p>
                  <p className="text-sm text-gray-400">
                    Perfect for {answers.expectedInterviews === '1-2' ? '1-2' : answers.expectedInterviews === '3-5' ? '3-5' : '6-10'} interviews with {answers.platformExperts === '6+' ? '6+' : answers.platformExperts} expert{answers.platformExperts !== '1' ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              {pricingTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => handleSelectTier(tier)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    recommendedTier && tier.id === recommendedTier.id
                      ? 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{tier.emoji}</div>
                    {tier.popular && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold mb-1">€{tier.price}</div>
                  <div className="text-sm font-semibold text-gray-300 mb-2">{tier.name}</div>
                  <div className="text-xs text-gray-400">
                    {tier.interviews} interview{tier.interviews > 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-200">
                💡 <strong>Next:</strong> After selecting your plan, you'll choose your preferred time slots. Payment will only be processed after the expert confirms the interview.
              </p>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
              >
                Back
              </button>
              {recommendedTier && (
              <button
                onClick={() => handleSelectTier(recommendedTier)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                Proceed with {recommendedTier.name}
                <ArrowRight className="w-5 h-5" />
              </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRequest;

