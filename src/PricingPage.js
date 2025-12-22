import React from 'react';
import { ArrowRight, Home } from 'lucide-react';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold">NexThesis</span>
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">Simple Pricing</h1>
            <p className="text-gray-400 text-lg">Pay per interview, or save with bundles</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all hover:shadow-lg hover:scale-105">
              <div className="text-5xl mb-4">☕</div>
              <div className="text-4xl font-bold text-white mb-2">€8</div>
              <div className="text-gray-400 text-sm mb-4 font-medium">Espresso Shot</div>
              <div className="text-gray-500 text-sm leading-relaxed mb-6">Quick insight from one expert</div>
              <a href="/register/student" className="block w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-center transition-all">
                Get Started
              </a>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border-2 border-blue-500 rounded-2xl p-8 relative hover:shadow-xl hover:scale-105 transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                POPULAR
              </div>
              <div className="text-5xl mb-4">📝</div>
              <div className="text-4xl font-bold text-white mb-2">€20</div>
              <div className="text-gray-400 text-sm mb-2 font-medium">Research Starter</div>
              <div className="text-green-400 text-sm font-semibold mb-2">Save 17%</div>
              <div className="text-gray-500 text-sm leading-relaxed mb-6">Build your foundation</div>
              <a href="/register/student" className="block w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-center transition-all">
                Get Started
              </a>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all hover:shadow-lg hover:scale-105">
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-4xl font-bold text-white mb-2">€32</div>
              <div className="text-gray-400 text-sm mb-2 font-medium">Deep Dive</div>
              <div className="text-green-400 text-sm font-semibold mb-2">Save 20%</div>
              <div className="text-gray-500 text-sm leading-relaxed mb-6">Multiple perspectives</div>
              <a href="/register/student" className="block w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-center transition-all">
                Get Started
              </a>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-400/50 transition-all hover:shadow-lg hover:scale-105">
              <div className="text-5xl mb-4">🎓</div>
              <div className="text-4xl font-bold text-white mb-2">€60</div>
              <div className="text-gray-400 text-sm mb-2 font-medium">Thesis Complete</div>
              <div className="text-green-400 text-sm font-semibold mb-2">Save 25%</div>
              <div className="text-gray-500 text-sm leading-relaxed mb-6">Comprehensive support</div>
              <a href="/register/student" className="block w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-center transition-all">
                Get Started
              </a>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <p className="text-gray-300 text-sm leading-relaxed">
              💡 All plans include access to verified experts, structured 30-minute interviews, and quality assurance. 
              Choose the plan that fits your research needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

