import React from 'react';
import FromMeToYouCommentGenerator from './FromMeToYouCommentGenerator';

/**
 * דוגמת שילוב מינימלית — העתיקו את הקומפוננטה לפרויקט React שלכם.
 */
const ExampleApp: React.FC = () => {
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-100 p-4 sm:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <FromMeToYouCommentGenerator />
      </div>
    </div>
  );
};

export default ExampleApp;
