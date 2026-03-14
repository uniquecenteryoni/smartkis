import React from 'react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji?: string;
  onClick: () => void;
  isVisited: boolean;
  completionGoal?: string;
  isLocked?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon: Icon, emoji, onClick, isVisited, completionGoal, isLocked = false }) => {
  return (
    <div
      onClick={isLocked ? undefined : onClick}
      title={isLocked ? 'הפרק ייפתח לאחר השלמת הפרק הקודם' : undefined}
      className={`
        card-surface rounded-3xl border transition-all duration-300 flex flex-col items-start shadow-lg glow-ring overflow-hidden
        ${isLocked
          ? 'opacity-75 cursor-not-allowed border-gray-200/60'
          : 'cursor-pointer border-white/60 hover:border-brand-light-blue/50 hover:shadow-2xl hover:shadow-brand-light-blue/20 transform hover:-translate-y-2 hover:scale-[1.01]'}
      `}
    >
      {/* Colored top accent bar */}
      <div className={`h-1.5 w-full rounded-t-3xl ${isVisited ? 'bg-gradient-to-r from-green-400 to-emerald-500' : isLocked ? 'bg-gray-300' : 'bg-gradient-to-r from-brand-light-blue to-brand-teal'}`} />

      <div className="p-5 sm:p-6 flex flex-col items-start flex-grow w-full">
        {/* Icon */}
        {emoji ? (
          <div className="text-5xl mb-4 leading-none">{emoji}</div>
        ) : (
          <div className="relative rounded-2xl p-3.5 mb-4 shadow-lg border border-white/60 overflow-hidden">
            <div className={`absolute inset-0 ${isLocked ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 'bg-gradient-to-br from-brand-cyan via-brand-teal to-brand-light-blue'}`} />
            <span className="absolute text-white/35 text-xs font-black -left-0.5 -top-0.5 pointer-events-none">✦</span>
            <span className="absolute text-white/25 text-xs font-black right-0.5 bottom-0.5 pointer-events-none">₪</span>
            <Icon className="w-8 h-8 text-white relative z-10" />
          </div>
        )}

        {/* Title row */}
        <div className="flex items-start gap-2 w-full mb-1">
          <h3 className="text-2xl sm:text-4xl font-bold font-display text-brand-dark-blue break-words flex-grow">{title}</h3>
          {isLocked && (
            <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-full p-1.5 shrink-0 shadow-md" title="נעול">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c-1.657 0-3 1.343-3 3v2a3 3 0 006 0v-2c0-1.657-1.343-3-3-3zm6 0V9a6 6 0 10-12 0v2" />
              </svg>
            </div>
          )}
          {isVisited && !isLocked && (
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-1.5 shrink-0 shadow-md shadow-green-400/40 animate-bounce-in" title="הושלם">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-lg sm:text-2xl text-brand-dark-blue/80 flex-grow leading-relaxed">{description}</p>

        {/* Completion goal */}
        {completionGoal && (
          <div className="mt-4 p-3 bg-gradient-to-r from-brand-teal/12 to-brand-light-blue/10 rounded-xl text-base sm:text-xl text-brand-teal font-semibold border border-brand-teal/25 w-full">
            <span className="font-bold">🎯 יעד:</span> {completionGoal}
          </div>
        )}

        {/* CTA */}
        <div className={`mt-5 text-lg sm:text-xl font-bold flex items-center gap-1.5 ${isLocked ? 'text-gray-400' : 'text-brand-teal'}`}>
          {isLocked ? (
            <span>הפרק ייפתח לאחר השלמת הקודם</span>
          ) : (
            <>
              <span className="group-hover:underline">{isVisited ? 'לחזור לפרק' : 'התחל ללמוד'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;