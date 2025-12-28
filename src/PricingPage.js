import React from 'react';
import { Home, Check, Star } from 'lucide-react';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Background Gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.15),transparent_70%)] pointer-events-none"></div>
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="NexThesis" className="w-8 h-8" />
            <span className="text-xl font-bold tracking-wide">NexThesis</span>
          </a>
          <div className="flex gap-4 items-center">
            <a href="/" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-4" style={{ letterSpacing: '0.02em' }}>
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Research Package
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              All packages include verified professionals, recorded sessions, and guaranteed commitment
            </p>
          </div>

          {/* Risk-Free Guarantee Box */}
          <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-2 border-green-500/30 rounded-2xl p-8 mb-12">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full mb-4">
                <span className="text-2xl">💰</span>
                <span className="text-xl font-bold text-green-400">Risk-Free Guarantee</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <span className="text-white font-semibold">Professional doesn't show?</span>
                  <span className="text-gray-300"> Instant refund + free rebooking</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <span className="text-white font-semibold">Not satisfied?</span>
                  <span className="text-gray-300"> Full credit refund within 48 hours</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <span className="text-white font-semibold">Unused credits?</span>
                  <span className="text-gray-300"> 100% money back within 6 months</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <span className="text-white font-semibold">Payments secured by Stripe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards - 3 Column Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 items-center">
            {/* CARD 1 - STARTER */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all hover:scale-105">
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Starter</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <div className="text-5xl font-bold text-white">€29</div>
                </div>
                <div className="text-gray-500 text-sm">per interview</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 mb-6">
                <div className="text-xs text-blue-300 font-semibold mb-1">👤 BEST FOR:</div>
                <div className="text-xs text-gray-300 leading-relaxed">Testing platform • Adding one expert source • Supplementing research</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Single 30-minute session</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Verified professional</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Recorded & transcribed</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Guaranteed commitment</span>
                </li>
              </ul>
              <a href="/register/student" className="block w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-center transition-all">
                Select
              </a>
            </div>

            {/* CARD 2 - RESEARCH PACK (MOST POPULAR) */}
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border-2 border-blue-500 rounded-2xl p-8 relative transform md:scale-110 hover:scale-115 transition-all shadow-xl shadow-blue-500/20">
              <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Most Popular
              </div>
              <div className="mb-6">
                <div className="text-sm font-bold text-blue-300 mb-2 uppercase tracking-wider">Research Pack</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <div className="text-5xl font-bold text-white">€79</div>
                </div>
                <div className="text-gray-400 text-sm mb-2">for 3 interviews</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <span className="text-green-400 text-xs font-bold">Save €8</span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-400 text-xs">€26.33 each</span>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 mb-6">
                <div className="text-xs text-blue-300 font-semibold mb-1">👥 BEST FOR:</div>
                <div className="text-xs text-gray-200 leading-relaxed">Meeting thesis requirements (3-5 sources) • Comparing perspectives • Qualitative research</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-200">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Everything in Starter</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-200">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>3 different experts</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-200">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Valid for 3 months</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-200">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Priority booking</span>
                </li>
              </ul>
              <a href="/register/student" className="block w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-center transition-all shadow-lg text-lg">
                Get Started
              </a>
            </div>

            {/* CARD 3 - THESIS BUNDLE */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-400/50 transition-all hover:scale-105">
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Thesis Bundle</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <div className="text-5xl font-bold text-white">€129</div>
                </div>
                <div className="text-gray-500 text-sm mb-2">for 5 interviews</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-green-400 text-xs font-semibold">Save €16</span>
                  <span className="text-gray-500 text-xs">•</span>
                  <span className="text-gray-500 text-xs">€25.80 each</span>
                </div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 mb-6">
                <div className="text-xs text-purple-300 font-semibold mb-1">👥👥 BEST FOR:</div>
                <div className="text-xs text-gray-300 leading-relaxed">MBA/Master's thesis • Multi-sector analysis • In-depth studies</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Everything included</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>5 verified experts</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Priority booking</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Valid for 6 months</span>
                </li>
              </ul>
              <a href="/register/student" className="block w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-center transition-all">
                Select
              </a>
            </div>
          </div>

          {/* Advisory Note */}
          <div className="text-center mb-16 px-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-xl">💡</span>
              <span className="text-sm text-gray-300">
                <strong className="text-white">Not sure how many?</strong> Most thesis committees expect 3-5 primary sources. Check with your supervisor.
              </span>
            </div>
          </div>

          {/* All Packages Include Section */}
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-2xl p-8 mb-12">
            <h3 className="text-xl font-bold mb-6 text-center">All packages include:</h3>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-sm text-gray-300">Verified Fortune 500 professionals</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-sm text-gray-300">30-minute structured sessions</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-sm text-gray-300">Recorded & transcribed</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-sm text-gray-300">Guaranteed commitment</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-sm text-gray-300">Full refund on unused credits</div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold mb-6 text-center">Common Questions</h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <div className="font-semibold text-white mb-2">Can I buy more interviews later?</div>
                <div className="text-sm text-gray-400">Yes! Credits never expire. Start with one package and add more anytime.</div>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">How do I use my interview credits?</div>
                <div className="text-sm text-gray-400">Browse experts, send a request with your thesis topic, and once accepted, schedule your 30-minute session.</div>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">What if the expert doesn't show up?</div>
                <div className="text-sm text-gray-400">Credits are only deducted when the interview is confirmed and completed. If an expert cancels, your credit is refunded immediately.</div>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">Can I record the interviews?</div>
                <div className="text-sm text-gray-400">Yes, all interviews are recordable and transcribed. Perfect for thesis methodology and analysis.</div>
              </div>
              <div>
                <div className="font-semibold text-white mb-2">How long are my credits valid?</div>
                <div className="text-sm text-gray-400">Starter: immediate use. Research Pack: 3 months. Thesis Bundle: 6 months. Use them at your own pace.</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start?</h3>
            <p className="text-gray-400 text-lg mb-8">Choose your package above and browse verified experts now</p>
            <a href="/browse" className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30">
              Browse Experts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
