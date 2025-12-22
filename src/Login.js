import React, { useState } from 'react';
import { ArrowRight, Mail, LogIn, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // First, check if user is a student
      const studentResponse = await fetch(
        `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/students?email=eq.${encodeURIComponent(email)}&select=*`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
          }
        }
      );

      const studentData = await studentResponse.json();

      if (studentData && studentData.length > 0) {
        const student = studentData[0];
        // Save to localStorage
        localStorage.setItem('nexthesis_user', JSON.stringify({
          type: 'student',
          email: student.email,
          firstName: student.first_name,
          lastName: student.last_name,
          university: student.university,
          thesisTopic: student.thesis_topic
        }));
        setSuccess(true);
        // Redirect to student welcome page
        setTimeout(() => {
          window.location.href = '/welcome/student';
        }, 1000);
        return;
      }

      // If not a student, check if user is a professional
      const professionalResponse = await fetch(
        `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/professionals?email=eq.${encodeURIComponent(email)}&select=*`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
          }
        }
      );

      const professionalData = await professionalResponse.json();

      if (professionalData && professionalData.length > 0) {
        const professional = professionalData[0];
        // Save to localStorage
        localStorage.setItem('nexthesis_user', JSON.stringify({
          type: 'professional',
          email: professional.email,
          firstName: professional.first_name,
          lastName: professional.last_name,
          company: professional.company,
          role: professional.role,
          sector: professional.sector
        }));
        setSuccess(true);
        // Redirect to professional welcome page
        setTimeout(() => {
          window.location.href = '/welcome/professional';
        }, 1000);
        return;
      }

      // If not found in either table
      setError('No account found with this email. Please register first.');
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <a href="/" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all">
              Home
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
              <LogIn className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Welcome Back</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Welcome back
            </h1>
            <p className="text-gray-400 text-lg">
              Enter your email to access your dashboard
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                  <Sparkles className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Success!</h3>
                <p className="text-gray-400">Redirecting you to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                        error ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                      }`}
                      placeholder="your.email@example.com"
                      disabled={loading}
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-center text-gray-500 text-sm">
                Don't have an account?{' '}
                <a href="/register/student" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                  Register as Student
                </a>
                {' '}or{' '}
                <a href="/register/professional" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                  Register as Professional
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

