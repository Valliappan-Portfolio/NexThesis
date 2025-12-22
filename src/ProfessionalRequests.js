import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Clock, Calendar, Mail, ArrowRight, Home } from 'lucide-react';

const ProfessionalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.type === 'professional') {
          setUserData(data);
          loadRequests(data.email);
        } else {
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
    // In a real app, fetch from Supabase
    // For now, load from localStorage
    const storedRequests = localStorage.getItem(`interview_requests_${email}`) || '[]';
    setRequests(JSON.parse(storedRequests));
  };

  const handleConfirm = async (request) => {
    // Update request status to confirmed
    const updated = requests.map(r => 
      r.id === request.id ? { ...r, status: 'confirmed' } : r
    );
    setRequests(updated);
    localStorage.setItem(`interview_requests_${userData.email}`, JSON.stringify(updated));
    
    // In a real app, this would trigger payment via Stripe
    // Then send calendar invite and email notifications
    alert('Request confirmed! Payment will be processed and calendar invite sent.');
    setSelectedRequest(null);
  };

  const handleProposeAlternative = (request) => {
    // Simple alternative proposal - in real app would have a form
    const alternative = prompt('Propose alternative time (e.g., "Next Monday, 2 PM"):');
    if (alternative) {
      const updated = requests.map(r => 
        r.id === request.id ? { ...r, status: 'alternative_proposed', alternativeTime: alternative } : r
      );
      setRequests(updated);
      localStorage.setItem(`interview_requests_${userData.email}`, JSON.stringify(updated));
      alert('Alternative time proposed to student.');
      setSelectedRequest(null);
    }
  };

  const handleDecline = (request) => {
    if (confirm('Are you sure you want to decline this request?')) {
      const updated = requests.map(r => 
        r.id === request.id ? { ...r, status: 'declined' } : r
      );
      setRequests(updated);
      localStorage.setItem(`interview_requests_${userData.email}`, JSON.stringify(updated));
      setSelectedRequest(null);
    }
  };

  const matchAvailability = (request, professional) => {
    // Simple matching logic
    const studentDay = request.student_day_preference;
    const studentTime = request.student_time_preference;
    const proDay = professional.day_preference || '';
    const proTime = professional.time_preference || '';

    const dayMatch = proDay === 'both' || proDay === studentDay || studentDay === 'both';
    const timeMatch = proTime.includes(studentTime) || proTime === '';

    return dayMatch && timeMatch;
  };

  if (!userData) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const confirmedRequests = requests.filter(r => r.status === 'confirmed');
  const declinedRequests = requests.filter(r => r.status === 'declined');

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold">NexThesis</span>
          </a>
          <div className="flex gap-4 items-center">
            <a href="/welcome/professional" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all">
              Dashboard
            </a>
            <a href="/" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-24 p-6">
        <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Interview Requests</h1>
          <p className="text-gray-400">Review and respond to student interview requests</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-400" />
              <div className="text-3xl font-bold">{pendingRequests.length}</div>
            </div>
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div className="text-3xl font-bold">{confirmedRequests.length}</div>
            </div>
            <div className="text-gray-400 text-sm">Confirmed</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <X className="w-6 h-6 text-red-400" />
              <div className="text-3xl font-bold">{declinedRequests.length}</div>
            </div>
            <div className="text-gray-400 text-sm">Declined</div>
          </div>
        </div>

        {pendingRequests.length === 0 && requests.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No requests yet</h3>
            <p className="text-gray-400">Student interview requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">Interview Request</h3>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">From: {request.student_email}</p>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Plan: {request.pricing_tier_name} (€{request.price})</span>
                      <span>•</span>
                      <span>Day: {request.student_day_preference}</span>
                      <span>•</span>
                      <span>Time: {request.student_time_preference}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}

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
                  <label className="text-sm text-gray-400">Student Email</label>
                  <p className="text-white font-medium">{selectedRequest.student_email}</p>
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

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-200">
                  💡 <strong>Note:</strong> After confirming, payment will be processed and calendar invites will be sent automatically.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleConfirm(selectedRequest)}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirm
                </button>
                <button
                  onClick={() => handleProposeAlternative(selectedRequest)}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Propose Alternative
                </button>
                <button
                  onClick={() => handleDecline(selectedRequest)}
                  className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-xl font-semibold transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalRequests;

