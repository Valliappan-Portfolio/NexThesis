import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (!token || !type) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail(token, type);
  }, [searchParams]);

  const verifyEmail = async (token, type) => {
    try {
      console.log('Verifying email...');

      const response = await fetch(`/api/verify-email?token=${encodeURIComponent(token)}&type=${type}`);
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.alreadyVerified ? 'Your email was already verified!' : 'Email verified successfully!');
        setUserInfo({ email: data.email, name: data.name, type: data.type });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {message}
            </h1>
            {userInfo && (
              <p className="text-gray-600 mb-4">
                Welcome, {userInfo.name}! Your account is now active.
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Redirecting you to login...
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/register/student')}
                className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Register Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailVerification;
