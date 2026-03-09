import React from 'react';

interface ModuleViewProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const ModuleView: React.FC<ModuleViewProps> = ({ title, onBack, children }) => {
  return (
    <div className="bg-white/55 backdrop-blur-2xl border border-white/40 rounded-4xl p-4 sm:p-10 animate-fade-in shadow-2xl shadow-brand-dark-blue/10">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          {/* Accent dot */}
          <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-brand-light-blue to-brand-teal shrink-0 hidden sm:block" />
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-gradient-teal break-words">{title}</h2>
        </div>
        <button
          onClick={onBack}
          className="w-full sm:w-auto bg-gradient-to-r from-brand-magenta to-pink-500 hover:brightness-110 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 text-base sm:text-xl rounded-full flex items-center justify-center transition-all duration-200 shadow-lg shadow-brand-magenta/30 hover:shadow-brand-magenta/50 hover:-translate-y-0.5 transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>חזרה</span>
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ModuleView;