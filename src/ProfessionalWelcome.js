import React, { useState, useEffect } from 'react';
import { ArrowRight, User, CheckCircle, Clock, XCircle, LogOut, Coffee, Home } from 'lucide-react';

const ProfessionalWelcome = () => {
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState({
    pending: 0,
    approved: 0,
    declined: 0
  });

  useEffect(() => {
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.type === 'professional') {
          setUserData(data);
          loadRequestStatus(data.email);
        } else {
          // Not a professional, redirect to home
          window.location.href = '/';
        }
      } catch (e) {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []);

  const loadRequestStatus = async (email) => {
    try {
      console.log('Loading request stats for:', email);

      // Fetch from Supabase
      const response = await fetch(
        `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?professional_email=eq.${encodeURIComponent(email)}&select=status`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
          }
        }
      );

      const data = await response.json();
      console.log('Fetched request data:', data);

      if (Array.isArray(data)) {
        // Calculate stats from the data
        const pending = data.filter(r => r.status === 'pending' || r.status === 'matched').length;
        const approved = data.filter(r => r.status === 'confirmed' || r.status === 'approved').length;
        const declined = data.filter(r => r.status === 'declined').length;

        console.log('Calculated stats:', { pending, approved, declined });

        setRequests({
          pending,
          approved,
          declined
        });
      }
    } catch (e) {
      console.error('Error loading request status:', e);
      // Keep default 0s on error
      setRequests({ pending: 0, approved: 0, declined: 0 });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexthesis_user');
    window.location.href = '/';
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
            <img src="/logo.png" alt="NexThesis" className="w-8 h-8" />
            <span className="text-xl font-bold">NexThesis</span>
          </a>
          <div className="flex gap-4 items-center">
            <a href="/" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </a>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
              <Coffee className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Professional Dashboard</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {userData.firstName}!
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Here's your request status and what's happening with your profile
            </p>
          </div>

          {/* Request Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{requests.pending}</div>
                  <div className="text-gray-400 text-sm">Pending Requests</div>
                </div>
              </div>
              <p className="text-gray-500 text-xs">
                Students waiting for your response
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{requests.approved}</div>
                  <div className="text-gray-400 text-sm">Approved</div>
                </div>
              </div>
              <p className="text-gray-500 text-xs">
                Interviews you've accepted
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{requests.declined}</div>
                  <div className="text-gray-400 text-sm">Declined</div>
                </div>
              </div>
              <p className="text-gray-500 text-xs">
                Requests you've declined
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <a
              href="/professional/dashboard"
              className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-blue-500/50 rounded-2xl p-8 hover:border-blue-500 transition-all block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Interview Requests Dashboard</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    View and respond to interview requests from students. Confirm, propose alternatives, or decline.
                  </p>
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                    View Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Edit Your Profile</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Update your bio, availability, or booking link to help students connect with you
                  </p>
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                    Coming Soon
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4">Your Profile</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-medium">{userData.firstName} {userData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white font-medium">{userData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold mb-2 text-blue-300">💡 Pro Tip</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Students appreciate quick responses! Most successful interviews happen when professionals respond within 48 hours. 
              If you're available, share your calendar link when accepting requests to make scheduling seamless.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalWelcome;

