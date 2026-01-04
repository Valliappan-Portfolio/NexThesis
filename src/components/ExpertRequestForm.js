import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

/**
 * Expert Request Form Component
 * Allows students to submit custom expert requirements when they can't find the right match
 * Uses mailto: to send request directly to support@nexthesis.com
 */
function ExpertRequestForm() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({
    thesisTopic: '',
    helpNeeded: '',
    expectedOutcome: '',
    expertise: '',
    additionalNotes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get user data from localStorage if logged in
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserData({
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || '',
          email: user.email || ''
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.thesisTopic.trim()) newErrors.thesisTopic = 'Thesis topic is required';
    if (!formData.helpNeeded.trim()) newErrors.helpNeeded = 'Please describe what help you need';
    if (!formData.expectedOutcome.trim()) newErrors.expectedOutcome = 'Expected outcome is required';
    if (!formData.expertise.trim()) newErrors.expertise = 'Required expertise is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Create email content
    const subject = `Custom Expert Request - ${formData.thesisTopic}`;
    const body = `
Hello NexThesis Team,

I'm looking for an expert that matches the following requirements:

Student Name: ${userData.name || 'Not provided'}
Student Email: ${userData.email || 'Not provided'}

THESIS TOPIC:
${formData.thesisTopic}

HELP NEEDED:
${formData.helpNeeded}

EXPECTED OUTCOME:
${formData.expectedOutcome}

REQUIRED EXPERTISE:
${formData.expertise}

${formData.additionalNotes ? `ADDITIONAL NOTES:\n${formData.additionalNotes}` : ''}

Please let me know when you find a suitable expert.

Thank you!
    `.trim();

    // Open mailto link
    const mailtoLink = `mailto:vspvalliappan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    // Show success message
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setFormData({
        thesisTopic: '',
        helpNeeded: '',
        expectedOutcome: '',
        expertise: '',
        additionalNotes: ''
      });
    }, 3000);
  };

  if (!showForm) {
    return (
      <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-2xl p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-3">Can't Find the Right Expert?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            No worries! Tell us what you're looking for and we'll help you find the perfect professional for your thesis research.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30"
          >
            Submit Custom Request
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-2xl p-12">
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-green-400">Email Client Opened!</h3>
          <p className="text-gray-300 text-lg mb-2">
            Your email client should have opened with a pre-filled message. Please send it to complete your request.
          </p>
          <p className="text-gray-400 text-sm">
            We'll get back to you within one week with suitable expert recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Custom Expert Request</h3>
          <p className="text-gray-400">Tell us exactly what you need and we'll find the right match</p>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {userData.name && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-300">
            <strong>Submitting as:</strong> {userData.name} ({userData.email})
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Thesis Topic *</label>
          <input
            type="text"
            value={formData.thesisTopic}
            onChange={(e) => handleChange('thesisTopic', e.target.value)}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
              errors.thesisTopic ? 'border-red-500' : 'border-white/20 focus:border-purple-500'
            }`}
            placeholder="e.g., Impact of AI on Healthcare Diagnostics"
          />
          {errors.thesisTopic && <p className="text-red-400 text-sm mt-1">{errors.thesisTopic}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">What Help Do You Need? *</label>
          <textarea
            value={formData.helpNeeded}
            onChange={(e) => handleChange('helpNeeded', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
              errors.helpNeeded ? 'border-red-500' : 'border-white/20 focus:border-purple-500'
            }`}
            placeholder="Describe what specific help you're looking for from an expert..."
          />
          {errors.helpNeeded && <p className="text-red-400 text-sm mt-1">{errors.helpNeeded}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Expected Outcome *</label>
          <textarea
            value={formData.expectedOutcome}
            onChange={(e) => handleChange('expectedOutcome', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
              errors.expectedOutcome ? 'border-red-500' : 'border-white/20 focus:border-purple-500'
            }`}
            placeholder="What do you hope to achieve from the interview?"
          />
          {errors.expectedOutcome && <p className="text-red-400 text-sm mt-1">{errors.expectedOutcome}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Required Expertise *</label>
          <input
            type="text"
            value={formData.expertise}
            onChange={(e) => handleChange('expertise', e.target.value)}
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
              errors.expertise ? 'border-red-500' : 'border-white/20 focus:border-purple-500'
            }`}
            placeholder="e.g., Machine Learning Engineer, Healthcare Policy Expert"
          />
          {errors.expertise && <p className="text-red-400 text-sm mt-1">{errors.expertise}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
            placeholder="Any other details that might help us find the perfect expert..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
          >
            Send Request via Email
            <Send className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          This will open your email client with a pre-filled message to our team
        </p>
      </form>
    </div>
  );
}

export default ExpertRequestForm;
