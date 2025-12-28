import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Sparkles, Home } from 'lucide-react';

const StudentRegistration = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    thesisTopic: ''
  });
  const [errors, setErrors] = useState({});
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    // Check if user is already registered
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        if (userData.type === 'student') {
          setAlreadyRegistered(true);
        }
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.university.trim()) newErrors.university = 'University is required';
    if (!formData.thesisTopic.trim()) newErrors.thesisTopic = 'Thesis topic is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Check if email already exists
        const checkStudentResponse = await fetch(
          `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/students?email=eq.${encodeURIComponent(formData.email)}&select=email`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
            }
          }
        );
        const existingStudent = await checkStudentResponse.json();

        const checkProfessionalResponse = await fetch(
          `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/professionals?email=eq.${encodeURIComponent(formData.email)}&select=email`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
            }
          }
        );
        const existingProfessional = await checkProfessionalResponse.json();

        if (existingStudent.length > 0 || existingProfessional.length > 0) {
          setErrors({ email: 'This email is already registered. Please use the login page instead.' });
          return;
        }

        const response = await fetch('https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            university: formData.university,
            thesis_topic: formData.thesisTopic
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save');
        }

        // Save student info to browser
        localStorage.setItem('nexthesis_user', JSON.stringify({
          type: 'student',
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          university: formData.university,
          thesisTopic: formData.thesisTopic
        }));
setSubmitted(true);
      } catch (error) {
        alert('Error saving registration. Please try again.');
        console.error('Error:', error);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>
        <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl w-full relative z-10">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-blue-500/50 rounded-3xl p-12 text-center">
            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500">
              <CheckCircle className="w-12 h-12 text-blue-400" />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              You're Already Registered! 🎉
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              You're already part of NexThesis. Ready to continue your research journey?
            </p>

            <div className="flex gap-4 justify-center">
              <a
                href="/welcome/student"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30"
              >
                Go to My Dashboard
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/browse"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-lg transition-all"
              >
                Browse Experts
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>
        <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl w-full relative z-10">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-blue-500/50 rounded-3xl p-12 text-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              You're All Set! 🎉
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your profile is live! Get ready to find the perfect expert who'll make your thesis supervisor say <span className="text-blue-400 font-semibold">"Now that's proper research!"</span>
            </p>

            <div className="bg-white/10 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">What's Next?</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Browse verified experts from top companies. Find someone who actually does what you're researching (not just writes about it). Send requests. Book interviews. Cite real expertise.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/browse"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30"
            >
              Start Hunting for Experts
              <ArrowRight className="w-5 h-5" />
            </a>

            <p className="text-gray-500 text-sm mt-6">
              Psst... The good ones get booked fast 👀
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold">NexThesis</span>
          </a>
          <div className="flex gap-4 items-center">
            <a href="/register/professional" className="text-gray-400 hover:text-white transition-colors text-sm">
              Register as Professional
            </a>
            <a href="/" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Student Registration</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Join <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">NexThesis</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Get access to verified industry experts for your thesis research
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.firstName ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.lastName ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.email ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                  placeholder="john.doe@university.edu"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  University *
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => handleChange('university', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.university ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                  placeholder="e.g., IE Business School, ESADE, IESE"
                />
                {errors.university && <p className="text-red-400 text-xs mt-1">{errors.university}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Thesis Topic *
                </label>
                <textarea
                  value={formData.thesisTopic}
                  onChange={(e) => handleChange('thesisTopic', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all resize-none ${
                    errors.thesisTopic ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                  placeholder="e.g., Digital Transformation in European Manufacturing"
                />
                {errors.thesisTopic && <p className="text-red-400 text-xs mt-1">{errors.thesisTopic}</p>}
                <p className="text-gray-500 text-xs mt-2">
                  This helps experts understand if they can help with your research
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-sm text-gray-300 leading-relaxed">
                  By registering, you agree to our terms of service and privacy policy. Your information will only be shared with experts you request interviews from.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Create My Account
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
  Already registered? Just head to{' '}
  <a href="/browse" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
    Browse Experts
  </a>
  {' '}and start requesting interviews!
</p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;