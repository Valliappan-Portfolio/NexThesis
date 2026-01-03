import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import BrowseExpertsPage from './BrowseExperts';
import StudentRegistration from './StudentRegistration';
import ProfessionalRegistration from './ProfessionalRegistration';
import StudentWelcome from './StudentWelcome';
import ProfessionalWelcome from './ProfessionalWelcome';
import Login from './Login';
import PricingPage from './PricingPage';
import ProfessionalRequests from './ProfessionalRequests';
import ProfessionalDashboard from './ProfessionalDashboard';
import BuyCredits from './BuyCredits';
import PaymentSuccess from './PaymentSuccess';
import EmailVerification from './EmailVerification';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowseExpertsPage />} />
        <Route path="/register/student" element={<StudentRegistration />} />
        <Route path="/register/professional" element={<ProfessionalRegistration />} />
        <Route path="/welcome/student" element={<StudentWelcome />} />
        <Route path="/welcome/professional" element={<ProfessionalWelcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/buy-credits" element={<BuyCredits />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/professional/requests" element={<ProfessionalRequests />} />
        <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;