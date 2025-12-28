import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Sparkles, CreditCard } from 'lucide-react';
import { getAvailableCredits } from './utils/creditSystem';

// Pricing tiers defined outside component to avoid re-creation
const pricingTiers = [
  { id: 'espresso', name: 'Espresso Shot', price: 8, interviews: 1, emoji: '☕' },
  { id: 'starter', name: 'Research Starter', price: 20, interviews: 2, emoji: '📝', popular: true },
  { id: 'deepdive', name: 'Deep Dive', price: 32, interviews: 4, emoji: '🔍' },
  { id: 'complete', name: 'Thesis Complete', price: 60, interviews: 6, emoji: '🎓' }
];

const InterviewRequest = ({ expert, onClose, onComplete }) => {
  const [step, setStep] = useState(1); // 1: pricing selection, 2: date/time + context selection
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [dateError, setDateError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [credits, setCredits] = useState(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  // New research context fields
  const [researchQuestion, setResearchQuestion] = useState('');
  const [interviewExpectations, setInterviewExpectations] = useState('');
  const [specificQuestions, setSpecificQuestions] = useState('');

  // Load credits on component mount
  useEffect(() => {
    const loadUserCredits = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('nexthesis_user') || '{}');
        if (userData.email) {
          const availableCredits = await getAvailableCredits(userData.email);
          setCredits(availableCredits);

          // If student has credits, skip pricing and set default tier
          if (availableCredits > 0) {
            setSelectedTier(pricingTiers[1]); // Default to "Research Starter"
            setStep(2); // Go directly to scheduling
          }
        }
      } catch (error) {
        console.error('Error loading credits:', error);
        setCredits(0);
      } finally {
        setLoadingCredits(false);
      }
    };

    loadUserCredits();
  }, []);

  // Generate available time slots when date is selected
  useEffect(() => {
    if (!selectedDate || !expert?.availability) {
      setAvailableSlots([]);
      setDateError('');
      return;
    }

    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isWeekday = !isWeekend;

    const availability = expert.availability;
    const availableDays = availability.days || [];
    const availableTimes = availability.times || [];

    // Check if selected date matches professional's availability
    const dayMatches =
      (isWeekday && availableDays.includes('weekday')) ||
      (isWeekend && availableDays.includes('weekend'));

    if (!dayMatches) {
      setDateError(
        isWeekday
          ? `${expert.first_name} is only available on ${availableDays.includes('weekend') ? 'weekends' : 'weekdays'}`
          : `${expert.first_name} is only available on ${availableDays.includes('weekday') ? 'weekdays' : 'weekends'}`
      );
      setAvailableSlots([]);
      setSelectedTime('');
      return;
    }

    // Generate time slots based on professional's time windows
    const slots = [];
    const timeWindows = {
      morning: { start: 9, end: 12, label: 'Morning' },
      afternoon: { start: 12, end: 17, label: 'Afternoon' },
      evening: { start: 17, end: 20, label: 'Evening' }
    };

    availableTimes.forEach(timeWindow => {
      const window = timeWindows[timeWindow];
      if (window) {
        for (let hour = window.start; hour < window.end; hour++) {
          const time24 = `${hour.toString().padStart(2, '0')}:00`;
          const time12 = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
          slots.push({ value: time24, label: time12, window: window.label });
        }
      }
    });

    setAvailableSlots(slots);
    setDateError('');
    setSelectedTime(''); // Reset time selection when date changes
  }, [selectedDate, expert]);

  // Guard against missing expert - must come AFTER all hooks
  if (!expert) {
    return null;
  }

  const handleSelectTier = (tier) => {
    setSelectedTier(tier);
    setStep(2); // Go to time preferences
  };

  const handleSubmitRequest = async () => {
    // Check if student has available credits
    if (credits === 0) {
      if (window.confirm('You need to purchase interview credits first. Go to Buy Credits page?')) {
        window.location.href = '/buy-credits';
      }
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select both a date and time for the interview.');
      return;
    }

    if (!selectedTier) {
      alert('Please select a pricing tier first.');
      return;
    }

    if (!researchQuestion.trim()) {
      alert('Please provide your research question.');
      return;
    }

    if (!interviewExpectations.trim()) {
      alert('Please describe what you hope to gain from this interview.');
      return;
    }

    if (!expert || !expert.email) {
      alert('Expert information is missing. Please try again.');
      return;
    }

    setSubmitting(true);
    try {
      const studentData = JSON.parse(localStorage.getItem('nexthesis_user') || '{}');

      // Create interview request in database
      const requestData = {
        student_email: studentData.email,
        student_name: `${studentData.firstName} ${studentData.lastName}`,
        student_university: studentData.university || '',
        student_thesis_topic: studentData.thesisTopic || '',
        professional_email: expert.email,
        professional_name: `${expert.first_name} ${expert.last_name}`,
        professional_company: expert.company || '',
        pricing_tier: selectedTier.id,
        pricing_tier_name: selectedTier.name,
        price: selectedTier.price,
        preferred_date: selectedDate,
        preferred_time: selectedTime,
        research_question: researchQuestion,
        interview_expectations: interviewExpectations,
        specific_questions_for_expert: specificQuestions,
        status: 'matched' // Auto-match since time falls in availability window
      };

      console.log('Sending interview request to Supabase:', requestData);

      // Save to Supabase
      const response = await fetch('https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(requestData)
      });

      const responseData = await response.json();
      console.log('Supabase response:', responseData);

      if (!response.ok) {
        console.error('Supabase error:', responseData);
        throw new Error(responseData.message || 'Failed to submit request');
      }

      onComplete({
        expert,
        selectedTier,
        selectedDate,
        selectedTime,
        requestData
      });
    } catch (error) {
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

        {/* Credit Balance Display */}
        {!loadingCredits && (
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
              credits > 0 ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'
            }`}>
              <CreditCard className={`w-4 h-4 ${credits > 0 ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm font-medium ${credits > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {credits > 0 ? `${credits} interview credit${credits !== 1 ? 's' : ''} available` : 'No credits available'}
              </span>
              {credits === 0 && (
                <a href="/buy-credits" className="text-xs underline text-red-200 hover:text-red-100">
                  Buy Credits
                </a>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Choose Your Plan</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{expert?.first_name || ''} {expert?.last_name || ''}</h2>
              <p className="text-gray-400">{expert?.role || ''} {expert?.company ? `at ${expert.company}` : ''}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {pricingTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => handleSelectTier(tier)}
                  className="p-6 rounded-xl border-2 transition-all text-left border-white/10 bg-white/5 hover:border-blue-500 hover:bg-blue-500/10"
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

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-200">
                💡 <strong>Next:</strong> After selecting your plan, choose your preferred time slots. Payment will be processed after the expert confirms.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Schedule Your Interview</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Pick a Date & Time</h2>
              <p className="text-gray-400">
                Select when you'd like to meet with {expert.first_name}. Times shown match their availability in {expert.availability?.timezone || 'their timezone'}.
              </p>
            </div>

            {/* Professional's Availability Info */}
            {expert.availability && (
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="text-sm text-green-300 font-medium mb-2">📅 {expert.first_name}'s Availability:</div>
                <div className="flex flex-wrap gap-2">
                  {expert.availability.days?.map(day => (
                    <span key={day} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium capitalize">
                      {day === 'weekday' ? 'Mon-Fri' : 'Sat-Sun'}
                    </span>
                  ))}
                  {expert.availability.times?.map(time => (
                    <span key={time} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-medium capitalize">
                      {time === 'morning' ? '9am-12pm' : time === 'afternoon' ? '12pm-5pm' : '5pm-8pm'}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-xs font-medium">
                    {expert.availability.timezone || 'IST'}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Interview Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
                  style={{ colorScheme: 'dark' }}
                />
                {dateError && (
                  <p className="text-red-400 text-sm mt-2">⚠️ {dateError}</p>
                )}
              </div>

              {selectedDate && availableSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Available Time Slots *</label>
                  <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setSelectedTime(slot.value)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          selectedTime === slot.value
                            ? 'border-purple-500 bg-purple-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-bold">{slot.label}</div>
                        <div className="text-xs text-gray-500">{slot.window}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && availableSlots.length === 0 && !dateError && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-yellow-300 text-sm">
                    ℹ️ No availability set for this professional yet. They can still manually confirm your request.
                  </p>
                </div>
              )}

              {/* Research Context Fields */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-xl font-bold mb-4 text-white">Help {expert.first_name} Prepare</h3>
                <p className="text-gray-400 text-sm mb-6">The more context you provide, the more valuable your interview will be.</p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Your Research Question *
                      <span className="text-gray-500 font-normal ml-1">(What are you investigating?)</span>
                    </label>
                    <textarea
                      value={researchQuestion}
                      onChange={(e) => setResearchQuestion(e.target.value)}
                      placeholder="e.g., How do multinational corporations adapt their supply chain strategies in emerging markets?"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      What do you hope to gain from this interview? *
                    </label>
                    <textarea
                      value={interviewExpectations}
                      onChange={(e) => setInterviewExpectations(e.target.value)}
                      placeholder="e.g., I want to understand real-world challenges in supply chain management and how they differ from textbook theories..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Specific topics or questions for {expert.first_name}
                      <span className="text-gray-500 font-normal ml-1">(Optional but recommended)</span>
                    </label>
                    <textarea
                      value={specificQuestions}
                      onChange={(e) => setSpecificQuestions(e.target.value)}
                      placeholder="e.g., Given your experience at Nestlé, how did you handle supplier relationships during COVID-19? What frameworks do you use for risk assessment?"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={!selectedDate || !selectedTime || dateError || submitting}
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
      </div>
    </div>
  );
};

export default InterviewRequest;

