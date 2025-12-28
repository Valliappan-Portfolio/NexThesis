import React, { useState, useEffect } from 'react';
import { ArrowRight, Coffee, Home } from 'lucide-react';
import { sendProfessionalWelcomeEmail } from './utils/resend';

const ProfessionalRegistration = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    company: '',
    role: '',
    sector: '',
    experience: '',
    bio: '',
    bookingLink: '',
    languages: '',
    availableDays: ['weekend'], // Default: weekend
    availableTimes: ['afternoon'], // Default: afternoon
    timezone: 'IST', // Default: IST
    sessionLength: '30'
  });
  const [errors, setErrors] = useState({});
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    // Check if user is already registered
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        if (userData.type === 'professional') {
          setAlreadyRegistered(true);
        }
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  const sectors = [
    'Select sector',
    'Technology',
    'Consulting',
    'Manufacturing',
    'Finance & Banking',
    'Healthcare & Pharma',
    'Retail & E-commerce',
    'Energy & Sustainability',
    'Real Estate',
    'Legal',
    'Marketing & Advertising',
    'Other'
  ];

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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

    if (!formData.linkedin.trim()) {
      newErrors.linkedin = 'LinkedIn URL is required';
    } else if (!formData.linkedin.includes('linkedin.com')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.role.trim()) newErrors.role = 'Role/Title is required';
    
    if (!formData.sector || formData.sector === 'Select sector') {
      newErrors.sector = 'Please select a sector';
    }

    if (!formData.experience) {
      newErrors.experience = 'Years of experience is required';
    } else {
      const experienceNum = parseInt(formData.experience);
      if (isNaN(experienceNum) || experienceNum < 1 || experienceNum > 50) {
        newErrors.experience = 'Please enter a valid number (1-50)';
      }
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters';
    }

    if (formData.bookingLink.trim() && !validateURL(formData.bookingLink)) {
      newErrors.bookingLink = 'Please enter a valid URL';
    }

    if (!formData.languages.trim()) newErrors.languages = 'At least one language is required';

    if (!formData.availableDays || formData.availableDays.length === 0) newErrors.availableDays = 'At least one day preference is required';
    if (!formData.availableTimes || formData.availableTimes.length === 0) newErrors.availableTimes = 'At least one time preference is required';
    if (!formData.timezone.trim()) newErrors.timezone = 'Timezone is required';
    if (!formData.sessionLength) newErrors.sessionLength = 'Session length is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfessionalRegistration.js:121',message:'handleSubmit called',data:{timePreferenceType:typeof formData.timePreference,timePreferenceIsArray:Array.isArray(formData.timePreference),timePreferenceValue:formData.timePreference},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (validateForm()) {
      try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfessionalRegistration.js:125',message:'Before API call - checking timePreference',data:{timePreference:formData.timePreference,isArray:Array.isArray(formData.timePreference)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
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

        const requestBody = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          linkedin_url: formData.linkedin,
          company: formData.company,
          role: formData.role,
          sector: formData.sector,
          years_experience: parseInt(formData.experience) || 0,
          bio: formData.bio,
          booking_link: formData.bookingLink || null,
          languages: formData.languages,
          availability: {
            days: formData.availableDays,
            times: formData.availableTimes,
            timezone: formData.timezone
          },
          session_length: parseInt(formData.sessionLength) || 30,
          verified: false
        };

        console.log('Sending to Supabase:', requestBody);

        const response = await fetch('https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/professionals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log('Supabase response:', responseData);

        if (!response.ok) {
          console.error('Supabase error:', responseData);
          const errorMessage = responseData.message || responseData.hint || 'Failed to save registration';
          throw new Error(errorMessage);
        }

        // Save professional info to browser
        localStorage.setItem('nexthesis_user', JSON.stringify({
          type: 'professional',
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          role: formData.role,
          sector: formData.sector
        }));

        // Send welcome email
        try {
          await sendProfessionalWelcomeEmail({
            professionalEmail: formData.email,
            professionalName: `${formData.firstName} ${formData.lastName}`,
            company: formData.company
          });
          console.log('✅ Welcome email sent to professional');
        } catch (emailError) {
          console.error('⚠️ Failed to send welcome email:', emailError);
          // Don't block registration if email fails
        }

        setSubmitted(true);
      } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/88699142-527f-44b9-9504-d1b4c088232e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfessionalRegistration.js:catch',message:'Error in handleSubmit',data:{errorMessage:error.message,timePreference:formData.timePreference,isArray:Array.isArray(formData.timePreference)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        console.error('Error:', error);
        const errorMsg = error.message || 'Error saving registration. Please try again.';
        alert(errorMsg);
        // Show the error in the form as well
        setErrors({ general: errorMsg });
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    // Clear availability errors if at least one is selected
    if (field === 'availableTimes' && Array.isArray(value) && value.length > 0 && errors.availableTimes) {
      setErrors({ ...errors, availableTimes: '' });
    }
    if (field === 'availableDays' && Array.isArray(value) && value.length > 0 && errors.availableDays) {
      setErrors({ ...errors, availableDays: '' });
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
              <Coffee className="w-12 h-12 text-blue-400" />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              You're Already Registered! ☕
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              You're already part of NexThesis. Check your dashboard to see your request status.
            </p>

            <div className="flex gap-4 justify-center">
              <a
                href="/welcome/professional"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30"
              >
                Go to My Dashboard
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-lg transition-all"
              >
                Back to Home
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
            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500">
              <Coffee className="w-12 h-12 text-blue-400" />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Welcome Aboard! ☕
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your profile is under review (we check LinkedIn to keep quality high). Once verified, students researching your field will start reaching out. <span className="text-blue-400 font-semibold">Grab a coffee and wait for the magic.</span>
            </p>

            <div className="bg-white/10 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">What Happens Next?</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex gap-3">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>We'll verify your LinkedIn profile (usually within 24 hours)</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>You'll get an email when your profile goes live</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Students will send interview requests via email</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Accept requests that interest you, share your calendar, and help shape future leaders</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-300">
                💡 <strong>Pro tip:</strong> Students love experts who respond quickly. Most book interviews within 48 hours of acceptance.
              </p>
            </div>

            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
            >
              Back to Home
            </a>

            <p className="text-gray-500 text-sm mt-6">
              Questions? Email us at support@nexthesis.com
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
            <a href="/register/student" className="text-gray-400 hover:text-white transition-colors text-sm">
              Register as Student
            </a>
            <a href="/" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
              <Coffee className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Professional Registration</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Share Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Expertise</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Help MBA students with their thesis research. 30 minutes of your time, lasting impact on their career.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.firstName ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                    }`}
                    placeholder="Valliappan"
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.lastName ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                    }`}
                    placeholder="Natarajan"
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.email ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                  placeholder="v.natarajan@company.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                <p className="text-gray-500 text-xs mt-1">Your email won't be visible to students</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">LinkedIn Profile URL *</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.linkedin ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                {errors.linkedin && <p className="text-red-400 text-xs mt-1">{errors.linkedin}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.company ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                    }`}
                    placeholder="e.g., Nestlé"
                  />
                  {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Role/Title *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.role ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                    }`}
                    placeholder="e.g., Operations Specialist"
                  />
                  {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Sector *</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none transition-all ${
                      errors.sector ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                    }`}
                  >
                    {sectors.map(sector => (
                      <option key={sector} value={sector} className="bg-gray-900">
                        {sector}
                      </option>
                    ))}
                  </select>
                  {errors.sector && <p className="text-red-400 text-xs mt-1">{errors.sector}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Years of Experience *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.experience ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                    }`}
                    placeholder="8"
                  />
                  {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">About You *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all resize-none ${
                    errors.bio ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                  placeholder="Share your expertise, what you work on, and why students should interview you..."
                />
                {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
                <p className="text-gray-500 text-xs mt-1">
                  Minimum 50 characters · {formData.bio.length}/50
                </p>
              </div>

              <div>
  <label className="block text-sm font-medium mb-2 text-gray-300">Booking Link (Optional)</label>
  <input
    type="url"
    value={formData.bookingLink}
    onChange={(e) => handleChange('bookingLink', e.target.value)}
    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
      errors.bookingLink ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
    }`}
    placeholder="https://calendar.google.com/..."
  />
  {errors.bookingLink && <p className="text-red-400 text-xs mt-1">{errors.bookingLink}</p>}
  <p className="text-gray-500 text-xs mt-1">
    Optional: Add later via email or share when accepting requests. Google Calendar, Cal.com, or Calendly work great!
  </p>
</div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Languages *</label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => handleChange('languages', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.languages ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                  placeholder="e.g., English, Spanish, French"
                />
                {errors.languages && <p className="text-red-400 text-xs mt-1">{errors.languages}</p>}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mt-6">
                <h3 className="text-lg font-bold mb-4 text-blue-300">📅 Availability Settings *</h3>
                <p className="text-sm text-gray-400 mb-6">Set your general availability preferences</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">When are you available? * (Select all that apply)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'weekday', label: 'Weekdays', desc: 'Mon-Fri' },
                        { value: 'weekend', label: 'Weekends', desc: 'Sat-Sun' }
                      ].map(option => {
                        const isSelected = formData.availableDays.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              const newDays = isSelected
                                ? formData.availableDays.filter(d => d !== option.value)
                                : [...formData.availableDays, option.value];
                              handleChange('availableDays', newDays);
                            }}
                            className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500/20 text-white'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="font-bold">{option.label}</div>
                            <div className="text-xs text-gray-400">{option.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.availableDays && <p className="text-red-400 text-xs mt-1">{errors.availableDays}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Preferred Time Windows * (Select all that apply)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'morning', label: 'Morning', time: '9am-12pm' },
                        { value: 'afternoon', label: 'Afternoon', time: '12pm-5pm' },
                        { value: 'evening', label: 'Evening', time: '5pm-8pm' }
                      ].map(option => {
                        const isSelected = formData.availableTimes.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              const newTimes = isSelected
                                ? formData.availableTimes.filter(t => t !== option.value)
                                : [...formData.availableTimes, option.value];
                              handleChange('availableTimes', newTimes);
                            }}
                            className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                              isSelected
                                ? 'border-purple-500 bg-purple-500/20 text-white'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="font-bold">{option.label}</div>
                            <div className="text-xs text-gray-400">{option.time}</div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.availableTimes && <p className="text-red-400 text-xs mt-1">{errors.availableTimes}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Your Timezone *</label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => handleChange('timezone', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none transition-all ${
                          errors.timezone ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                        }`}
                      >
                        <option value="IST" className="bg-gray-900">IST (India)</option>
                        <option value="CET" className="bg-gray-900">CET (Central Europe)</option>
                        <option value="EST" className="bg-gray-900">EST (US East)</option>
                        <option value="PST" className="bg-gray-900">PST (US West)</option>
                        <option value="GMT" className="bg-gray-900">GMT (UK)</option>
                        <option value="SGT" className="bg-gray-900">SGT (Singapore)</option>
                      </select>
                      {errors.timezone && <p className="text-red-400 text-xs mt-1">{errors.timezone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Session Length *</label>
                      <select
                        value={formData.sessionLength}
                        onChange={(e) => handleChange('sessionLength', e.target.value)}
                        className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white focus:outline-none transition-all ${
                          errors.sessionLength ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                        }`}
                      >
                        <option value="30" className="bg-gray-900">30 minutes</option>
                        <option value="45" className="bg-gray-900">45 minutes</option>
                        <option value="60" className="bg-gray-900">60 minutes</option>
                      </select>
                      {errors.sessionLength && <p className="text-red-400 text-xs mt-1">{errors.sessionLength}</p>}
                    </div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400">
                      💡 Students will see your availability and can request specific times within these windows
                    </p>
                  </div>
                </div>
              </div>

              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Submit for Verification
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalRegistration;