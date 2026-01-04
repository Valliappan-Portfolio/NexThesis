import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Expert Request Form Component
 * Allows students to submit custom expert requirements when they can't find the right match
 * Redirects to Google Form for submissions
 */
function ExpertRequestForm() {
  // TODO: Replace this URL with your actual Google Form link
  const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_ID_HERE';

  const handleOpenForm = () => {
    window.open(GOOGLE_FORM_URL, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-2xl p-8">
      <div className="text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold mb-3">Can't Find the Right Expert?</h3>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Tell us what you're looking for and we'll help you find a suitable professional for your thesis research.
        </p>
        <button
          onClick={handleOpenForm}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 inline-flex items-center gap-2"
        >
          Submit Custom Request
          <ExternalLink className="w-4 h-4" />
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Opens in a new tab • Takes less than 2 minutes
        </p>
      </div>
    </div>
  );
}

export default ExpertRequestForm;
