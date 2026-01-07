import React, { useState, useEffect } from 'react';
import { ArrowRight, User, CheckCircle, Clock, XCircle, LogOut, Coffee, Home, Mail, X, Calendar } from 'lucide-react';
import { isEmailVerified } from './utils/emailVerification';
import { quickConfirm } from './utils/interviewAutomation';
import { sendDeclineEmail } from './utils/resend';

const ProfessionalWelcome = () => {
  const [userData, setUserData] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [professionalMessage, setProfessionalMessage] = useState('');
  const [requests, setRequests] = useState({
    pending: 0,
    approved: 0,
    declined: 0
  });
  const [verificationStatus, setVerificationStatus] = useState({
    emailVerified: false,
    linkedinVerified: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.type === 'professional') {
          setUserData(data);
          loadRequestStatus(data.email);
          checkVerificationStatus(data.email);
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

  const checkVerificationStatus = async (email) => {
    try {
      // Check email verification
      const emailVerified = await isEmailVerified(email, 'professional');

      // Check LinkedIn verification from professionals table
      const response = await fetch(
        `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/professionals?email=eq.${encodeURIComponent(email)}&select=verified`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
          }
        }
      );

      const data = await response.json();
      const linkedinVerified = data[0]?.verified || false;

      setVerificationStatus({
        emailVerified,
        linkedinVerified
      });
    } catch (e) {
      console.error('Error checking verification status:', e);
    }
  };

  const loadRequestStatus = async (email) => {
    try {
      console.log('Loading requests for:', email);

      // Fetch from Supabase - get all request data
      const response = await fetch(
        `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?professional_email=eq.${encodeURIComponent(email)}&order=created_at.desc`,
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
        setAllRequests(data);

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
      setAllRequests([]);
      setRequests({ pending: 0, approved: 0, declined: 0 });
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const request = allRequests.find(r => r.id === requestId);
      if (!request) return;

      if (newStatus === 'confirmed') {
        await quickConfirm(requestId, professionalMessage, userData);
        alert('Request confirmed! Meeting created and emails sent to both parties.');
        setSelectedRequest(null);
        setProfessionalMessage('');
        loadRequestStatus(userData.email);
      } else if (newStatus === 'declined') {
        if (!professionalMessage.trim()) {
          alert('Please provide a message explaining why you\'re declining.');
          return;
        }

        await sendDeclineEmail(request, professionalMessage);

        const response = await fetch(
          `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?id=eq.${requestId}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'declined' })
          }
        );

        if (response.ok) {
          alert('Request declined. Email sent to student.');
          setSelectedRequest(null);
          setProfessionalMessage('');
          loadRequestStatus(userData.email);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Error: ${error.message}`);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between flex-wrap gap-2">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="NexThesis" className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="text-lg sm:text-xl font-bold">NexThesis</span>
          </a>
          <div className="flex gap-2 sm:gap-4 items-center">
            <a href="/" className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center gap-1 sm:gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
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

          {/* Verification Status Banner - Only show if either verification is pending */}
          {(!verificationStatus.emailVerified || !verificationStatus.linkedinVerified) && (
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Profile Verification Status</h3>
                  <div className="space-y-2">
                    {!verificationStatus.emailVerified && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">⏳ <strong>Email Verification:</strong> Please check your inbox and verify your email address</span>
                      </div>
                    )}
                    {verificationStatus.emailVerified && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">✅ <strong>Email Verified:</strong> Your email has been confirmed</span>
                      </div>
                    )}
                    {!verificationStatus.linkedinVerified && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">⏳ <strong>LinkedIn Verification:</strong> Our team is reviewing your LinkedIn profile (usually within 24 hours)</span>
                      </div>
                    )}
                    {verificationStatus.linkedinVerified && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">✅ <strong>LinkedIn Verified:</strong> Your profile has been approved by our team</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-4">
                    <strong>Note:</strong> Your profile will be visible to students once both verifications are complete. You'll receive an email notification when you're approved!
                  </p>
                </div>
              </div>
            </div>
          )}

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

          {/* Pending Interview Requests */}
          {requests.pending > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
              <div className="space-y-4">
                {allRequests.filter(r => r.status === 'pending' || r.status === 'matched').map((request) => (
                  <div
                    key={request.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <h3 className="text-xl font-bold">{request.student_name}</h3>
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-gray-400">University:</span>
                            <span className="text-white">{request.student_university || 'Not specified'}</span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-gray-400">Thesis Topic:</span>
                            <span className="text-white">{request.student_thesis_topic || 'Not specified'}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:gap-4 text-gray-400 text-xs sm:text-sm">
                            <span>Plan: {request.pricing_tier_name} (€{request.price})</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Day: {request.student_day_preference}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Time: {request.student_time_preference}</span>
                          </div>
                        </div>
                      </div>
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show message if no pending requests */}
          {requests.pending === 0 && (
            <div className="mb-8 bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Pending Requests</h3>
              <p className="text-gray-400">Student interview requests will appear here when they send you requests</p>
            </div>
          )}

          {/* Profile Summary */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4">Your Profile</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-400 min-w-[60px]">Name:</span>
                    <span className="text-white font-medium">{userData.firstName} {userData.lastName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 min-w-[60px]">Email:</span>
                    <span className="text-white font-medium">{userData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={() => setSelectedRequest(null)}>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative my-4 sm:my-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-bold mb-6">Interview Request Details</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400">Student Name</label>
                <p className="text-white font-medium">{selectedRequest.student_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Student Email</label>
                <p className="text-white font-medium">{selectedRequest.student_email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">University</label>
                <p className="text-white font-medium">{selectedRequest.student_university || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Thesis Topic</label>
                <p className="text-white font-medium">{selectedRequest.student_thesis_topic || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Pricing Plan</label>
                <p className="text-white font-medium">{selectedRequest.pricing_tier_name} - €{selectedRequest.price}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Preferred Day</label>
                <p className="text-white font-medium capitalize">{selectedRequest.student_day_preference}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Preferred Time</label>
                <p className="text-white font-medium capitalize">{selectedRequest.student_time_preference}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Student Timezone</label>
                <p className="text-white font-medium">{selectedRequest.student_timezone}</p>
              </div>
            </div>

            {(selectedRequest.status === 'pending' || selectedRequest.status === 'matched') && (
              <>
                {/* Message textarea */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message to Student <span className="text-gray-500">(Optional)</span>
                  </label>
                  <textarea
                    value={professionalMessage}
                    onChange={(e) => setProfessionalMessage(e.target.value)}
                    placeholder="Add a personal message (e.g., 'Looking forward to discussing your research on AI ethics!')"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all"
                    rows="4"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This message will be included in the email sent to the student. Your email address will remain private.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-200">
                    💡 <strong>Note:</strong> After confirming, a Jitsi Meet video meeting will be created and both you and the student will receive confirmation emails with the meeting link.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'confirmed')}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirm Request
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'declined')}
                    className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Decline
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalWelcome;

