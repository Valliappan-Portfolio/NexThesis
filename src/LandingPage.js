import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Users, Shield, Star, LogIn, FileText, TrendingUp, Award, Zap, CheckCircle } from 'lucide-react';

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
      {/* Animated Background Gradient - Enhanced with warmer tones */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.15),transparent_70%)] pointer-events-none"></div>
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="NexThesis" className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="text-lg sm:text-xl font-bold tracking-wide">NexThesis</span>
          </a>
          <div className="flex gap-2 sm:gap-4 items-center">
            <a href="#why" className="hidden sm:inline text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Why NexThesis
            </a>
            <a href="/pricing" className="hidden sm:inline text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Pricing
            </a>
            {returningUser && (
              <button
                onClick={handleReturningUserClick}
                className="hidden md:flex px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-xs sm:text-sm transition-all items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden lg:inline">Welcome Back</span>
              </button>
            )}
            <a href="/browse" className="px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap">
              Browse Experts
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6 sm:mb-8 hover:bg-white/10 transition-all cursor-pointer">
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm text-gray-300">Trusted by Business Students Across Europe</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2" style={{ letterSpacing: '0.02em' }}>
            Expert Interviews,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Zero Hassle
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-4 max-w-2xl mx-auto leading-relaxed font-medium px-2">
            Book verified professionals in under 5 minutes. Structured 30-minute sessions. Show up, learn, cite with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-12 sm:mb-20">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <a href="/register/student" className="group px-6 sm:px-10 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-bold text-base sm:text-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 pulse-glow" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                I'm a Student
                <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/register/professional" className="px-6 sm:px-10 py-4 sm:py-5 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all font-bold text-base sm:text-xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                I'm a Professional
                <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="text-gray-500 text-xs sm:text-sm text-center px-4">
              No subscription. Pay per interview. Start with one session.
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
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-12 text-xs sm:text-sm px-4">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Verified Experts</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Star className="w-4 h-4 text-blue-400" />
              <span>30-Min Interviews</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Growing Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Logos Carousel - Restored */}
      <div className="relative py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent px-4">
              Our experts have shaped strategy at:
            </h2>
          </div>

          {/* Animated Company Carousel */}
          <div className="relative overflow-hidden py-6 sm:py-8">
            <div className="flex animate-scroll gap-12 sm:gap-20 items-center">
              {[...companies, ...companies].map((company, idx) => (
                <div
                  key={idx}
                  className="text-xl sm:text-3xl font-bold text-white/70 hover:text-white transition-all cursor-pointer whitespace-nowrap flex-shrink-0 hover:scale-110 drop-shadow-lg px-2 sm:px-4"
                  style={{ textShadow: '0 0 20px rgba(79, 70, 229, 0.3)' }}
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm px-4">
            Replace company names with actual logos for production
          </div>
        </div>
      </div>

      {/* LinkedIn Comparison Section */}
      <div id="why" className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">
              Why NexThesis,
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Not LinkedIn?</span>
            </h2>
          </div>

          {/* Comparison Table - Condensed to Top 4 */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* LinkedIn Column */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-red-400/80">LinkedIn Cold Outreach</h3>
                <div className="space-y-3 sm:space-y-5">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-400 text-lg sm:text-xl">❌</span>
                    <span className="text-gray-300 text-sm sm:text-base">5% response rate</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-400 text-lg sm:text-xl">❌</span>
                    <span className="text-gray-300 text-sm sm:text-base">Weeks of back-and-forth</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-400 text-lg sm:text-xl">❌</span>
                    <span className="text-gray-300 text-sm sm:text-base">Frequent no-shows</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-red-400 text-lg sm:text-xl">❌</span>
                    <span className="text-gray-300 text-sm sm:text-base">Free (but costs 40+ hours)</span>
                  </div>
                </div>
              </div>

              {/* NexThesis Column */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-green-400">NexThesis</h3>
                <div className="space-y-3 sm:space-y-5">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-400 text-lg sm:text-xl">✅</span>
                    <span className="text-white font-medium text-sm sm:text-base">Guaranteed responses</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-400 text-lg sm:text-xl">✅</span>
                    <span className="text-white font-medium text-sm sm:text-base">Book in under 5 minutes</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-400 text-lg sm:text-xl">✅</span>
                    <span className="text-white font-medium text-sm sm:text-base">Show-up guaranteed</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-400 text-lg sm:text-xl">✅</span>
                    <span className="text-white font-medium text-sm sm:text-base">Paid (but saves you weeks)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section - Professional Icons */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">
              Research
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Like You Mean It</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
              Stop guessing. Start interviewing. Connect with industry experts who bring real-world insights to your academic work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {/* Benefit Cards - Professional Icons */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-400/50 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">5 Minutes to Scheduled</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Browse. Click. Confirm. Your expert interview is booked—no LinkedIn cold-pitching required.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-purple-400/50 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Fortune 500 Credentials</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Interview VPs, Directors, and Consultants from Nestlé, Visa, McKinsey. Not random LinkedIn connections.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-400/50 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">They Show Up. Guaranteed.</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Prepaid commitment system. No ghosting. No rescheduling chaos. Just reliable expertise.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-purple-400/50 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Research-Ready Sessions</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                30 focused minutes. Recordable. Citable. Designed for academic rigor, not casual chats.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Impact Section */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">
              From Interview to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> A-Grade Citation</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
              Industry insights your professors actually want to see. Strengthen your methodology, elevate your analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Strengthen Your Methodology</h3>
              <p className="text-gray-400 leading-relaxed">
                Real-world data from primary sources. Demonstrates rigorous research approach your supervisor expects.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Unique Insights, Not Generic Theory</h3>
              <p className="text-gray-400 leading-relaxed">
                Go beyond textbook examples. Cite current practices from industry leaders in your field.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-600/10 to-blue-600/10 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-8">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Academic Credibility</h3>
              <p className="text-gray-400 leading-relaxed">
                Verified professional credentials add weight to your citations. Fortune 500 experience speaks volumes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works - Clean Numbers Only */}
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

      {/* Social Proof - Placeholder */}
      <div className="py-20 px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Students Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <p className="text-gray-300 leading-relaxed mb-4 italic">
                "Booked a Nestlé supply chain director in 3 minutes. Best €8 I spent on my thesis."
              </p>
              <p className="text-sm text-gray-500">— MBA Student, Rotterdam</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <p className="text-gray-300 leading-relaxed mb-4 italic">
                "My supervisor was impressed I interviewed real McKinsey consultants. Worth every cent."
              </p>
              <p className="text-sm text-gray-500">— Business Student, Munich</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <p className="text-gray-300 leading-relaxed mb-4 italic">
                "Finally got expert insights without weeks of LinkedIn ghosting. Game changer."
              </p>
              <p className="text-sm text-gray-500">— Master's Student, Paris</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section - Enhanced with Urgency */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Your Thesis Deadline Isn't Moving. Your Research Can.</h2>
              <p className="text-blue-100 text-lg mb-2">Join business students across Europe who've already interviewed 100+ Fortune 500 professionals.</p>
              <p className="text-blue-200 text-sm mb-8">No subscription. Pay per interview. Start with one session.</p>
              <a href="/browse" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl">
                Browse Experts Now
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="NexThesis" className="w-6 h-6" />
            <span className="text-xl font-bold">NexThesis</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 NexThesis. Connecting students with industry experts.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
