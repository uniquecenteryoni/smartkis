import React from 'react';

interface ModuleViewProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const ModuleView: React.FC<ModuleViewProps> = ({ title, onBack, children }) => {
  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-4xl p-4 sm:p-10 animate-fade-in shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-5xl font-bold font-display text-brand-light-blue break-words">{title}</h2>
        <button
          onClick={onBack}
          className="w-full sm:w-auto bg-brand-magenta hover:bg-pink-700 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 text-base sm:text-xl rounded-full flex items-center justify-center transition-colors duration-300"
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