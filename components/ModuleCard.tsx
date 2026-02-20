import React from 'react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  isVisited: boolean;
  completionGoal?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon: Icon, onClick, isVisited, completionGoal }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl border border-white/50 hover:border-brand-light-blue/50 transition-all duration-300 cursor-pointer flex flex-col items-start shadow-lg hover:shadow-xl hover:shadow-brand-light-blue/20 transform hover:-translate-y-1.5"
    >
      <div className="bg-brand-light-blue p-3 rounded-full mb-4 shadow-md shadow-brand-light-blue/30">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-3xl sm:text-4xl font-bold font-display text-brand-dark-blue mb-2">{title}</h3>
        {isVisited && (
            <div className="bg-green-500/80 rounded-full p-1 mb-2 animate-fade-in" title="נצפה">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        )}
      </div>
      <p className="text-xl sm:text-2xl text-brand-dark-blue/90 flex-grow">{description}</p>
      {completionGoal && (
        <div className="mt-4 p-3 bg-brand-teal/10 rounded-lg text-lg sm:text-xl text-brand-teal font-semibold border border-brand-teal/20 w-full">
          <span className="font-bold">🎯 יעד להשלמה:</span> {completionGoal}
        </div>
      )}
      <div className="mt-4 text-xl sm:text-2xl text-brand-teal font-bold flex items-center group">
        <span>התחל ללמוד</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 8.586l2.293-2.293z" clipRule="evenodd" transform="rotate(-90 10 10)" />
        </svg>
      </div>
    </div>
  );
};

export default ModuleCard;