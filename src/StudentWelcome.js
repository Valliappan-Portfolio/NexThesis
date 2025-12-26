import React, { useState, useEffect } from 'react';
import { ArrowRight, User, BookOpen, LogOut, Sparkles, Home, Search, Clock, CheckCircle, XCircle } from 'lucide-react';

const StudentWelcome = () => {
  const [userData, setUserData] = useState(null);
  const [, setRequests] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    declined: 0,
    total: 0
  });

  useEffect(() => {
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.type === 'student') {
          setUserData(data);
          loadRequests(data.email);
        } else {
          // Not a student, redirect to home
          window.location.href = '/';
        }
      } catch (e) {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []);

  const loadRequests = async (email) => {
    try {
      const response = await fetch(
        `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?student_email=eq.${encodeURIComponent(email)}&order=created_at.desc`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
          }
        }
      );

      const data = await response.json();
      console.log('Loaded student requests:', data);
      setRequests(data);

      // Calculate stats
      const pending = data.filter(r => r.status === 'pending').length;
      const confirmed = data.filter(r => r.status === 'confirmed' || r.status === 'approved').length;
      const declined = data.filter(r => r.status === 'declined').length;

      setStats({
        pending,
        confirmed,
        declined,
        total: data.length
      });
    } catch (error) {
      console.error('Error loading requests:', error);
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
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Student Dashboard</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Welcome, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {userData.firstName}!
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Ready to connect with industry experts for your thesis research
            </p>
          </div>

          {/* Request Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <div className="text-3xl font-bold">{stats.total}</div>
              </div>
              <div className="text-gray-400 text-sm">Total Requests Sent</div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                <div className="text-3xl font-bold">{stats.pending}</div>
              </div>
              <div className="text-gray-400 text-sm">Awaiting Response</div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div className="text-3xl font-bold">{stats.confirmed}</div>
              </div>
              <div className="text-gray-400 text-sm">Confirmed</div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-red-400" />
                <div className="text-3xl font-bold">{stats.declined}</div>
              </div>
              <div className="text-gray-400 text-sm">Declined</div>
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
                  {userData.university && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">University:</span>
                      <span className="text-white font-medium">{userData.university}</span>
                    </div>
                  )}
                  {userData.thesisTopic && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Thesis Topic:</span>
                      <span className="text-white font-medium">{userData.thesisTopic}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <a
              href="/browse"
              className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-blue-500/50 rounded-2xl p-8 hover:border-blue-500 transition-all block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Browse Experts</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Find industry professionals in your field and request interviews for your thesis research
                  </p>
                  <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                    Start Browsing
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>

            <a
              href="/pricing"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">View Pricing Plans</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Explore affordable interview packages designed for students and thesis researchers
                  </p>
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                    View Plans
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Helpful Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h4 className="font-semibold mb-2 text-blue-300">💡 Getting Started</h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              Here's how to get the most out of NexThesis:
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-400">1.</span>
                <span>Browse experts by sector and find professionals who match your research needs</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">2.</span>
                <span>Choose a pricing plan based on how many interviews you need</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">3.</span>
                <span>Send interview requests with your availability preferences</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">4.</span>
                <span>Once confirmed, you'll receive payment details and calendar invites</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentWelcome;
