import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Sparkles, Users, Shield, Star, LogIn } from 'lucide-react';

const LandingPage = () => {
  const [returningUser, setReturningUser] = useState(null);

  useEffect(() => {
    // Check if user is already registered
    const stored = localStorage.getItem('nexthesis_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setReturningUser(userData);
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  const handleReturningUserClick = () => {
    if (returningUser) {
      if (returningUser.type === 'student') {
        window.location.href = '/welcome/student';
      } else if (returningUser.type === 'professional') {
        window.location.href = '/welcome/professional';
      }
    }
  };

  const companies = [
    'Nestlé', 'Visa', 'IBM', 'PwC', 'AWS', 'GEP', 
    'Infosys', 'Deloitte', 'ANZ', 'Accenture', 'McKinsey', 'Bain'
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
  <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
    <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
      <span className="text-xl font-bold">NexThesis</span>
    </a>
    <div className="flex gap-8 items-center mr-8">
      <a href="#why" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
        Why NexThesis
      </a>
      <a href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
        Pricing
      </a>
      {returningUser && (
        <button
          onClick={handleReturningUserClick}
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Welcome Back
        </button>
      )}
      <a href="/browse" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-sm transition-all">
        Browse Experts
      </a>
    </div>
  </div>
</nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8 hover:bg-white/10 transition-all cursor-pointer">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Trusted by MBA students across Europe</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-7xl font-bold mb-6 leading-tight tracking-tight">
            Stop Citing Noise.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Start Citing Experts.
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with verified industry professionals for structured 30-minute thesis interviews. Real expertise, real impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 mb-20">
  <div className="flex gap-4">
    <a href="/register/student" className="group px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-bold text-xl shadow-lg shadow-blue-500/20 flex items-center gap-2">
      I'm a Student
      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
    </a>
    <a href="/register/professional" className="px-10 py-5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all font-bold text-xl shadow-lg shadow-purple-500/20 flex items-center gap-2">
      I'm a Professional
      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
    </a>
  </div>
  <div className="flex flex-col items-center gap-3">
    {returningUser ? (
      <button
        onClick={handleReturningUserClick}
        className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-semibold text-sm flex items-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Already registered? Welcome back, {returningUser.firstName}!
      </button>
    ) : (
      <>
        <a href="/login" className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-medium text-sm flex items-center gap-2 text-gray-300 hover:text-white">
          <LogIn className="w-4 h-4" />
          Registered user already?
        </a>
        <a href="/browse" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
          Or browse experts without signing up →
        </a>
      </>
    )}
  </div>
</div>

          {/* Animated Stats */}
          <div className="flex justify-center gap-12 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Verified Experts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Star className="w-4 h-4 text-blue-400" />
              <span>30-Min Interviews</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span>50+ Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Names Section */}
      <div className="relative py-20 px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Experts from Leading Companies
            </h2>
            <p className="text-gray-400 text-sm">Trusted professionals from top organizations</p>
          </div>

          {/* Animated Company Names Carousel */}
          <div className="relative overflow-hidden py-8">
            <div className="flex animate-scroll gap-20 items-center">
              {[...companies, ...companies].map((company, idx) => (
                <div
                  key={idx}
                  className="text-4xl font-bold text-white/80 hover:text-white transition-all cursor-pointer whitespace-nowrap flex-shrink-0 hover:scale-110 drop-shadow-lg px-4"
                  style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why NexThesis - Problem/Solution Grid */}
      <div id="why" className="relative py-24 px-6">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Research That Actually
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Matters</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Stop wasting time on dead ends. Get real insights from real experts.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {/* Problem Cards */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-400/50 transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-3 text-white">Low Response Rates</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Cold outreach on LinkedIn gets 2-5% response rates. Your thesis deadline doesn't wait.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-purple-400/50 transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-3 text-white">Unverified Sources</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Generic blogs and outdated articles don't cut it. Your research deserves credible insights.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-400/50 transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-3 text-white">Scheduling Friction</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Weeks of email back-and-forth just to find one 30-minute slot. Timezone chaos kills momentum.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-purple-400/50 transition-all cursor-pointer">
              <h3 className="text-2xl font-bold mb-3 text-white">No Accountability</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Professionals agree to help, then disappear. No-shows and vague responses waste time.
              </p>
            </div>
          </div>

          {/* Solution Highlight */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-12">
              <div className="flex items-start gap-8 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-4xl font-bold mb-4">
                    One Platform.
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Complete Solution.</span>
                  </h3>
                  <p className="text-xl text-gray-300 leading-relaxed mb-6">
                    Verified experts from Nestlé, Visa, AWS, and more. Pre-vetted professionals ready to share insights. 
                    Structured 30-minute interviews with guaranteed availability. Payment protection and quality assurance built in.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-blue-400 font-bold text-lg mb-2">Verified Experts</div>
                  <p className="text-gray-400 text-sm">Manually verified professionals from Fortune 500 companies</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-purple-400 font-bold text-lg mb-2">Instant Booking</div>
                  <p className="text-gray-400 text-sm">Direct calendar integration. Book interviews in under 2 minutes</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-pink-400 font-bold text-lg mb-2">Quality Guaranteed</div>
                  <p className="text-gray-400 text-sm">Accept/decline system ensures only committed professionals respond</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-10">
              <a href="/browse" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30">
              Browse Experts Now
              </a>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-lg transition-all backdrop-blur-sm">
                  See How It Works
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works - Simplified */}
      <div id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Simple Process</h2>
            <p className="text-gray-400 text-lg">From browsing to booking in minutes</p>
          </div>


          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Browse & Select', desc: 'Explore verified professionals from top companies' },
              { num: '02', title: 'Send Request', desc: 'Share your thesis topic and why you need their expertise' },
              { num: '03', title: 'Book & Learn', desc: 'Get accepted, schedule 30 minutes, elevate your research' }
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
                  <div className="text-6xl font-bold text-white/10 mb-4 group-hover:text-white/20 transition-colors">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Elevate Your Thesis?</h2>
              <p className="text-blue-100 text-lg mb-8">Join students already citing real industry experts</p>
              <a href="/register/student" className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl">
  Get Started Now
  </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold">NexThesis</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 NexThesis. Connecting students with industry experts.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;