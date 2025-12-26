import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, CheckCircle, Filter, X } from 'lucide-react';
import InterviewRequest from './InterviewRequest';



const BrowseExpertsPage = () => {
  const storedUser = JSON.parse(localStorage.getItem('nexthesis_user') || 'null');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showInterviewRequest, setShowInterviewRequest] = useState(false);
  const [filters, setFilters] = useState({
    sector: 'All',
    company: 'All',
    experience: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await fetch('https://bpupukmduvbzyywbcngj.supabase.co/rest/v1/professionals?verified=eq.true&select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdXB1a21kdXZienl5d2JjbmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5OTUzNjAsImV4cCI6MjA4MTU3MTM2MH0._EwWab7_Se-HaTWWl24J-SUBLVVzDjRIYF7q5ShqUzw'
        }
      });
      const data = await response.json();
      setExperts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching experts:', error);
      setLoading(false);
    }
  };

  const sectors = ['All', ...new Set(experts.map(e => e.sector))];
  const companies = ['All', ...new Set(experts.map(e => e.company))];
  const experienceRanges = ['All', '5-7 years', '8-10 years', '10+ years'];

  const filteredExperts = useMemo(() => {
    let result = [...experts];
    
    if (filters.sector !== 'All') {
      result = result.filter(e => e.sector === filters.sector);
    }
    if (filters.company !== 'All') {
      result = result.filter(e => e.company === filters.company);
    }
    if (filters.experience !== 'All') {
      if (filters.experience === '5-7 years') {
        result = result.filter(e => e.years_experience >= 5 && e.years_experience <= 7);
      } else if (filters.experience === '8-10 years') {
        result = result.filter(e => e.years_experience >= 8 && e.years_experience <= 10);
      } else if (filters.experience === '10+ years') {
        result = result.filter(e => e.years_experience > 10);
      }
    }

    return result.sort(() => Math.random() - 0.5);
  }, [filters, experts]);

  const resetFilters = () => {
    setFilters({ sector: 'All', company: 'All', experience: 'All' });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== 'All').length;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/10 pointer-events-none"></div>
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <nav className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">NexThesis</span>
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Browse Experts</span>
            </div>
          </div>
          {storedUser ? (
  <div className="flex items-center gap-3">
    <span className="text-gray-400 text-sm">
      👋 {storedUser.firstName}
    </span>
    <button 
      onClick={() => {
        localStorage.removeItem('nexthesis_user');
        window.location.reload();
      }}
      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg text-sm transition-all"
    >
      Logout
    </button>
  </div>
) : (
  <a href="/register/student" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-sm transition-all">
    Get Started
  </a>
)}
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Browse <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Experts</span>
            </h1>
            <p className="text-gray-400 text-lg">
              {loading ? 'Loading...' : `${filteredExperts.length} verified professionals ready to help with your thesis`}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-600 text-xs rounded-full">{activeFilterCount}</span>
                )}
              </button>

              {Object.entries(filters).map(([key, value]) => (
                value !== 'All' && (
                  <div key={key} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-sm">
                    <span className="capitalize">{key}: {value}</span>
                    <button
                      onClick={() => setFilters({...filters, [key]: 'All'})}
                      className="hover:bg-white/10 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              ))}

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <button
                    onClick={() => setExpandedFilter(expandedFilter === 'sector' ? null : 'sector')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-left transition-all hover:bg-white/10 flex items-center justify-between"
                  >
                    <span className="font-medium text-white">Sector</span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedFilter === 'sector' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFilter === 'sector' && (
                    <div className="mt-2 space-y-2">
                      {sectors.map(s => (
                        <button
                          key={s}
                          onClick={() => setFilters({...filters, sector: s})}
                          className={`w-full px-4 py-2.5 rounded-lg text-left transition-all flex items-center gap-3 ${
                            filters.sector === s
                              ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            filters.sector === s ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
                          }`}>
                            {filters.sector === s && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span>{s}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setExpandedFilter(expandedFilter === 'company' ? null : 'company')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-left transition-all hover:bg-white/10 flex items-center justify-between"
                  >
                    <span className="font-medium text-white">Company</span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedFilter === 'company' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFilter === 'company' && (
                    <div className="mt-2 space-y-2">
                      {companies.map(c => (
                        <button
                          key={c}
                          onClick={() => setFilters({...filters, company: c})}
                          className={`w-full px-4 py-2.5 rounded-lg text-left transition-all flex items-center gap-3 ${
                            filters.company === c
                              ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            filters.company === c ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
                          }`}>
                            {filters.company === c && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span>{c}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setExpandedFilter(expandedFilter === 'experience' ? null : 'experience')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-left transition-all hover:bg-white/10 flex items-center justify-between"
                  >
                    <span className="font-medium text-white">Experience</span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedFilter === 'experience' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFilter === 'experience' && (
                    <div className="mt-2 space-y-2">
                      {experienceRanges.map(r => (
                        <button
                          key={r}
                          onClick={() => setFilters({...filters, experience: r})}
                          className={`w-full px-4 py-2.5 rounded-lg text-left transition-all flex items-center gap-3 ${
                            filters.experience === r
                              ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            filters.experience === r ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
                          }`}>
                            {filters.experience === r && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span>{r}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-400">Loading experts...</p>
            </div>
          ) : filteredExperts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredExperts.map((expert) => (
                <div
                  key={expert.id}
                  onClick={() => setSelectedExpert(expert)}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-400/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {(expert.first_name?.[0] || '')}{(expert.last_name?.[0] || '')}
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1 border border-green-500/30">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-1">{expert.first_name || ''} {expert.last_name || ''}</h3>
                  <p className="text-gray-400 text-sm mb-1">{expert.role || ''}</p>
                  <p className="text-blue-400 font-semibold text-sm mb-3">{expert.company || ''}</p>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {expert.bio || ''}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-xs font-medium">
                      {expert.years_experience || 0}Y Exp
                    </span>
                    <button className="text-blue-400 font-semibold text-sm group-hover:text-blue-300 transition-colors flex items-center gap-1">
                      View Profile
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-3">Oops! Our experts are playing hide and seek</h3>
              <p className="text-gray-400 mb-6">
                No matches for those filters. Maybe try something less specific?
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all"
              >
                Show Me Everyone
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedExpert && !showFullProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedExpert(null)}>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl max-w-2xl w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedExpert(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl flex-shrink-0">
                {(selectedExpert.first_name?.[0] || '')}{(selectedExpert.last_name?.[0] || '')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{selectedExpert.first_name || ''} {selectedExpert.last_name || ''}</h2>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1 border border-green-500/30">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                </div>
                <p className="text-gray-400 mb-1">{selectedExpert.role || ''}</p>
                <p className="text-blue-400 font-semibold text-lg">{selectedExpert.company || ''}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">About</h3>
                <p className="text-gray-300 leading-relaxed">{selectedExpert.bio || ''}</p>
              </div>

              <div className="flex gap-4 pt-2">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-gray-400 text-xs">Experience</span>
                  <p className="font-bold">{selectedExpert.years_experience || 0} Years</p>
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-gray-400 text-xs">Sector</span>
                  <p className="font-bold">{selectedExpert.sector || ''}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setShowFullProfile(true)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
              >
                View Full Profile
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  setShowFullProfile(true);
                  setTimeout(() => setShowInterviewRequest(true), 100);
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Request Interview
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedExpert && showFullProfile && !showInterviewRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => {
          setShowFullProfile(false);
          setSelectedExpert(null);
        }}>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl max-w-3xl w-full p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setShowFullProfile(false);
                setSelectedExpert(null);
              }}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl flex-shrink-0">
                {(selectedExpert.first_name?.[0] || '')}{(selectedExpert.last_name?.[0] || '')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-bold">{selectedExpert.first_name || ''} {selectedExpert.last_name || ''}</h2>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1 border border-green-500/30">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                </div>
                <p className="text-gray-400 text-lg mb-1">{selectedExpert.role || ''}</p>
                <p className="text-blue-400 font-semibold text-xl">{selectedExpert.company || ''}</p>
              </div>
            </div>

            <div className="space-y-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-3">About</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{selectedExpert.bio || ''}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-gray-400 text-sm block mb-1">Experience</span>
                  <p className="font-bold text-xl">{selectedExpert.years_experience || 0} Years</p>
                </div>
                <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-gray-400 text-sm block mb-1">Sector</span>
                  <p className="font-bold text-xl">{selectedExpert.sector || ''}</p>
                </div>
                <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-gray-400 text-sm block mb-1">Languages</span>
                  <p className="font-bold text-xl">{selectedExpert.languages || 'N/A'}</p>
                </div>
              </div>

              {selectedExpert.availability && (
                <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
                    📅 Availability
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Days</span>
                      <div className="flex flex-wrap gap-2">
                        {(selectedExpert.availability.days || []).map(day => (
                          <span key={day} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium capitalize">
                            {day === 'weekday' ? 'Mon-Fri' : 'Sat-Sun'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Time Windows</span>
                      <div className="flex flex-wrap gap-2">
                        {(selectedExpert.availability.times || []).map(time => (
                          <span key={time} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-medium capitalize">
                            {time === 'morning' ? '9am-12pm' : time === 'afternoon' ? '12pm-5pm' : '5pm-8pm'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">Timezone</span>
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-xs font-medium">
                        {selectedExpert.availability.timezone || 'IST'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedExpert.linkedin_url && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3">LinkedIn</h3>
                  <a 
                    href={selectedExpert.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {selectedExpert.linkedin_url}
                  </a>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowInterviewRequest(true)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              Request Interview
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {selectedExpert && showInterviewRequest && (
        <InterviewRequest
          expert={selectedExpert}
          onClose={() => {
            setShowInterviewRequest(false);
            setShowFullProfile(false);
            setSelectedExpert(null);
          }}
          onComplete={(data) => {
            // Save request to localStorage (in real app, save to Supabase)
            const requestId = `req_${Date.now()}`;
            const request = {
              id: requestId,
              ...data.requestData,
              expert_name: `${data.expert?.first_name || ''} ${data.expert?.last_name || ''}`.trim(),
              expert_email: data.expert?.email || ''
            };
            
            // Save to professional's requests
            const proRequests = JSON.parse(localStorage.getItem(`interview_requests_${data.expert.email}`) || '[]');
            proRequests.push(request);
            localStorage.setItem(`interview_requests_${data.expert.email}`, JSON.stringify(proRequests));
            
            alert(`Interview request submitted! ${data.expert?.first_name || 'The expert'} will review your request and confirm the time slot. Payment will only be processed after confirmation.`);
            setShowInterviewRequest(false);
            setShowFullProfile(false);
            setSelectedExpert(null);
          }}
        />
      )}
    </div>
  );
};

export default BrowseExpertsPage;