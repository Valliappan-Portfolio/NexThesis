import React from 'react';
import { X, Mail, AlertCircle } from 'lucide-react';

/**
 * Verification Gate Modal
 * Shows when unverified users try to access protected features
 * Differentiates between registered (needs verification) and unregistered users
 */
function VerificationGate({ isOpen, onClose, userEmail }) {
  if (!isOpen) return null;

  // Check if user is registered
  const user = JSON.parse(localStorage.getItem('nexthesis_user') || '{}');
  const isRegistered = user && user.email;

  const handleResendVerification = async () => {
    try {
      const { sendVerificationEmail } = await import('../utils/emailVerification');

      await sendVerificationEmail(
        userEmail || user.email,
        user.firstName ? `${user.firstName} ${user.lastName}` : user.name,
        user.type || 'student'
      );

      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification email:', error);
      alert('Failed to send verification email. Please try again.');
    }
  };

  // If user is not registered at all
  if (!isRegistered) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Sign Up Required
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  Please create an account first to request interviews with experts and access all platform features.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="/register/student"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
            >
              Sign Up Now
            </a>

            <button
              onClick={onClose}
              className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Continue Browsing
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            Already have an account? Sign in to verify your email.
          </p>
        </div>
      </div>
    );
  }

  // User is registered but not verified
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Verify Your Email First
        </h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                You need to verify your email address before you can request interviews with experts or purchase credits.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-sm text-center">
            We sent a verification link to <span className="font-semibold text-gray-900">{userEmail}</span>
          </p>

          <button
            onClick={handleResendVerification}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Resend Verification Email
          </button>

          <button
            onClick={onClose}
            className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            I'll do it later
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
}

export default VerificationGate;
