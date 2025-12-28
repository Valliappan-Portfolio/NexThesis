import React, { useState, useEffect } from 'react';
import { CheckCircle, CreditCard, Home, LogOut, Sparkles } from 'lucide-react';
import { getCreditSummary, addCredits } from './utils/creditSystem';
import { sendPaymentConfirmationEmail } from './utils/resend';
import { simulateTestPayment } from './utils/stripe';

const BuyCredits = () => {
  const [userData, setUserData] = useState(null);
  const [creditSummary, setCreditSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const packages = [
    {
      id: 'starter',
      name: 'Starter',
      interviews: 1,
      price: 29,
      pricePerInterview: 29,
      emoji: '👤',
      description: 'Testing platform • Adding one expert source'
    },
    {
      id: 'research_pack',
      name: 'Research Pack',
      interviews: 3,
      price: 79,
      pricePerInterview: 26.33,
      emoji: '👥',
      popular: true,
      savings: 8,
      badge: 'Most Popular',
      description: 'Meeting thesis requirements (3-5 sources)'
    },
    {
      id: 'thesis_bundle',
      name: 'Thesis Bundle',
      interviews: 5,
      price: 129,
      pricePerInterview: 25.80,
      emoji: '👥👥',
      savings: 16,
      badge: 'Best Value',
      description: 'MBA/Master\'s thesis • Multi-sector analysis'
    }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.type === 'student') {
          setUserData(data);
          loadCredits(data.email);
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

  const loadCredits = async (email) => {
    try {
      setLoading(true);
      const summary = await getCreditSummary(email);
      setCreditSummary(summary);
    } catch (error) {
      console.error('Error loading credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg) => {
    if (!userData || purchasing) return;

    try {
      setPurchasing(true);

      console.log('========== STARTING PURCHASE ==========');
      console.log('Package:', pkg);
      console.log('Student:', userData.email);

      // Package details for Stripe
      const packageDetails = {
        name: pkg.name,
        price: pkg.price,
        interviews: pkg.interviews,
        studentEmail: userData.email,
        studentName: `${userData.firstName} ${userData.lastName}`
      };

      // Process payment via Stripe (test mode)
      const paymentResult = await simulateTestPayment(packageDetails, async (email, name, bundle, price, interviews) => {
        await addCredits(email, name, bundle, price, interviews);
      });

      // Handle payment result
      if (paymentResult.cancelled) {
        console.log('Payment cancelled by user');
        return;
      }

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      console.log('✅ Payment successful! Credits added.');

      // Send confirmation email
      try {
        await sendPaymentConfirmationEmail({
          studentEmail: userData.email,
          studentName: `${userData.firstName} ${userData.lastName}`,
          bundleName: pkg.name,
          amount: pkg.price,
          interviewsPurchased: pkg.interviews,
          creditsAvailable: creditSummary.creditsAvailable + pkg.interviews
        });
        console.log('✅ Confirmation email sent!');
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError);
        // Don't block the purchase if email fails
      }

      // Reload credits
      await loadCredits(userData.email);

      alert(`Success! ${pkg.interviews} interview credits added to your account. Redirecting to Browse Experts...`);

      console.log('========== PURCHASE COMPLETE ==========');

      // Redirect to Browse Experts page
      setTimeout(() => {
        window.location.href = '/browse';
      }, 1500);
    } catch (error) {
      console.error('❌ Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexthesis_user');
    window.location.href = '/';
  };

  if (!userData || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

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
            <a href="/welcome/student" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dashboard
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
              <CreditCard className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">Purchase Interview Credits</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Buy Interview <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Credits</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Choose a package that fits your research needs
            </p>
          </div>

          {/* Current Credit Balance */}
          {creditSummary && (
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-2 border-blue-500/50 rounded-2xl p-8 mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold">Current Balance</h3>
              </div>
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {creditSummary.creditsAvailable}
              </div>
              <div className="text-gray-400">interview{creditSummary.creditsAvailable !== 1 ? 's' : ''} available</div>
              {creditSummary.totalPurchased > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                  Total purchased: {creditSummary.totalPurchased} | Used: {creditSummary.totalUsed} | Spent: €{creditSummary.totalSpent}
                </div>
              )}
            </div>
          )}

          {/* Packages */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-6 transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-2 border-blue-500 scale-105'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-xs font-bold">
                    {pkg.badge}
                  </div>
                )}
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{pkg.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-gray-400 text-sm mb-4">{pkg.description}</div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-1">€{pkg.price}</div>
                  <div className="text-sm text-gray-400">
                    {pkg.interviews} interview{pkg.interviews > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    €{pkg.pricePerInterview}/interview
                  </div>
                  {pkg.savings && (
                    <div className="mt-2 text-sm text-green-400 font-semibold">
                      Save {pkg.savings}%
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={purchasing}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-blue-600 hover:bg-blue-500'
                      : 'bg-white/10 hover:bg-white/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <CreditCard className="w-5 h-5" />
                  {purchasing ? 'Processing...' : 'Purchase'}
                </button>
              </div>
            ))}
          </div>

          {/* Info Boxes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="font-bold mb-3 text-blue-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                How It Works
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>1. Purchase interview credits</li>
                <li>2. Browse and select experts</li>
                <li>3. Request interviews (uses 1 credit)</li>
                <li>4. Credits never expire</li>
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="font-bold mb-3 text-purple-300">💡 Note</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                This is TEST MODE. No actual payment is processed. Click "Purchase" to simulate adding credits to your account.
                Real Stripe integration coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCredits;
