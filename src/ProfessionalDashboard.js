import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Clock, Calendar, User, Home, LogOut, ArrowLeft, Mail } from 'lucide-react';
import { quickConfirm } from './utils/interviewAutomation';
import { sendDeclineEmail } from './utils/resend';

const ProfessionalDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userData, setUserData] = useState(null);
  const [professionalMessage, setProfessionalMessage] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    declined: 0,
    total: 0
  });

  // Verify component is loading
  console.log('ProfessionalDashboard component mounted!');

  useEffect(() => {
    const stored = localStorage.getItem('nexthesis_user');
    console.log('========== DASHBOARD INIT ==========');
    console.log('localStorage data:', stored);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        console.log('Parsed user data:', data);
        console.log('User type:', data.type);
        console.log('User email:', data.email);

        if (data.type === 'professional') {
          setUserData(data);
          loadRequests(data.email);
        } else {
          console.log('Not a professional, redirecting...');
          window.location.href = '/';
        }
      } catch (e) {
        console.error('Error parsing localStorage:', e);
        window.location.href = '/';
      }
    } else {
      console.log('No user data in localStorage, redirecting...');
      window.location.href = '/';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRequests = async (email) => {
    try {
      setLoading(true);
      console.log('========== PROFESSIONAL DASHBOARD DEBUG ==========');
      console.log('Fetching requests for professional email:', email);

      const url = `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?professional_email=eq.${encodeURIComponent(email)}&order=created_at.desc`;
      console.log('Fetch URL:', url);

      const response = await fetch(url, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);
      console.log('Data type:', Array.isArray(data) ? 'Array' : typeof data);
      console.log('Data length:', Array.isArray(data) ? data.length : 'N/A');

      // Check if data is an error object (but not if it has both data and error properties)
      if (!Array.isArray(data) && (data.error || data.message)) {
        console.error('Supabase returned an error:', data);
        throw new Error(data.message || data.error || 'Failed to fetch requests');
      }

      // Ensure data is an array
      const requestsArray = Array.isArray(data) ? data : [];
      console.log('Setting requests array:', requestsArray);
      console.log('Number of requests:', requestsArray.length);

      if (requestsArray.length > 0) {
        console.log('Sample request:', requestsArray[0]);
      }

      setRequests(requestsArray);

      // Calculate stats
      const pending = requestsArray.filter(r => r.status === 'pending' || r.status === 'matched').length;
      const confirmed = requestsArray.filter(r => r.status === 'confirmed' || r.status === 'approved').length;
      const declined = requestsArray.filter(r => r.status === 'declined').length;

      console.log('Stats calculated:', { pending, confirmed, declined, total: requestsArray.length });

      setStats({
        pending,
        confirmed,
        declined,
        total: requestsArray.length
      });

      console.log('========== END DEBUG ==========');
    } catch (error) {
      console.error('Error loading requests:', error);
      alert(`Error loading requests: ${error.message}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      // Validate message for declines
      if (newStatus === 'declined' && !professionalMessage.trim()) {
        alert('Please provide a message explaining why you are declining this request.');
        return;
      }

      if (newStatus === 'confirmed') {
        // First, save the message to database
        if (professionalMessage.trim()) {
          await fetch(
            `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?id=eq.${requestId}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify({ professional_message: professionalMessage.trim() })
            }
          );
        }

        // Trigger full automation: credit deduction, meeting creation, emails
        console.log('Triggering automation for request:', requestId);

        const result = await quickConfirm(requestId);

        if (result.success) {
          alert(`Success! Meeting created and confirmation emails sent.\n\nMeeting link: ${result.meetingLink}`);

          // Reload requests to update the UI
          loadRequests(userData.email);
          setSelectedRequest(null);
          setProfessionalMessage('');
        } else {
          throw new Error(result.error || 'Automation failed');
        }
      } else {
        // For decline or other status changes, update status and message
        const response = await fetch(
          `https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/interview_requests?id=eq.${requestId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              status: newStatus,
              professional_message: professionalMessage.trim()
            })
          }
        );

        if (response.ok) {
          // Send decline email to student if declining
          if (newStatus === 'declined') {
            try {
              await sendDeclineEmail({
                studentEmail: selectedRequest.student_email,
                studentName: selectedRequest.student_name,
                professionalName: userData.firstName + ' ' + userData.lastName,
                professionalCompany: userData.company || 'N/A',
                professionalMessage: professionalMessage.trim(),
                thesisTopic: selectedRequest.student_thesis_topic
              });
              console.log('✅ Decline email sent to student');
            } catch (emailError) {
              console.error('❌ Failed to send decline email:', emailError);
              // Continue even if email fails
            }
          }

          // Reload requests to update the UI
          loadRequests(userData.email);
          setSelectedRequest(null);
          setProfessionalMessage('');
          alert(`Request ${newStatus}!${newStatus === 'declined' ? ' Student has been notified via email.' : ''}`);
        } else {
          throw new Error('Failed to update status');
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Error: ${error.message}. Check console for details.`);
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

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'matched');
  const confirmedRequests = requests.filter(r => r.status === 'confirmed' || r.status === 'approved');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>

      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold">NexThesis</span>
          </a>
          <div className="flex gap-4 items-center">
            <a href="/welcome/professional" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Welcome
            </a>
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Interview Requests Dashboard</h1>
            <p className="text-gray-400">Review and respond to student interview requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                <div className="text-3xl font-bold">{stats.total}</div>
              </div>
              <div className="text-gray-400 text-sm">Total Requests</div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                <div className="text-3xl font-bold">{stats.pending}</div>
              </div>
              <div className="text-gray-400 text-sm">Pending</div>
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
                <X className="w-6 h-6 text-red-400" />
                <div className="text-3xl font-bold">{stats.declined}</div>
              </div>
              <div className="text-gray-400 text-sm">Declined</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-xl text-gray-400">Loading requests...</div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No requests yet</h3>
              <p className="text-gray-400">Student interview requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer mb-4"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <User className="w-5 h-5 text-blue-400" />
                            <h3 className="text-xl font-bold">{request.student_name}</h3>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                              Pending
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                              <span className="text-gray-400">University:</span>
                              <span className="text-white">{request.student_university || 'Not specified'}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-gray-400">Thesis Topic:</span>
                              <span className="text-white">{request.student_thesis_topic || 'Not specified'}</span>
                            </div>
                            <div className="flex gap-4 text-gray-400">
                              <span>Plan: {request.pricing_tier_name} (€{request.price})</span>
                              <span>•</span>
                              <span>Day: {request.student_day_preference}</span>
                              <span>•</span>
                              <span>Time: {request.student_time_preference}</span>
                            </div>
                          </div>
                        </div>
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirmed Requests */}
              {confirmedRequests.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 mt-8">Confirmed Requests</h2>
                  {confirmedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white/5 border border-green-500/30 rounded-xl p-6 mb-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <User className="w-5 h-5 text-green-400" />
                            <h3 className="text-xl font-bold">{request.student_name}</h3>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                              Confirmed
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                              <span className="text-gray-400">Email:</span>
                              <span className="text-white">{request.student_email}</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-gray-400">Thesis Topic:</span>
                              <span className="text-white">{request.student_thesis_topic || 'Not specified'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Request Detail Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedRequest(null)}>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl max-w-2xl w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
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
                        Message to Student {selectedRequest.status === 'declined' ? <span className="text-red-400">*</span> : <span className="text-gray-500">(Optional)</span>}
                      </label>
                      <textarea
                        value={professionalMessage}
                        onChange={(e) => setProfessionalMessage(e.target.value)}
                        placeholder={selectedRequest.status === 'declined'
                          ? "Please explain why you're declining (e.g., 'Not available that week, but happy to meet next Tuesday at 2pm')"
                          : "Add a personal message (e.g., 'Looking forward to discussing your research on AI ethics!')"}
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

                    <div className="flex gap-4">
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
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
