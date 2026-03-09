import React from 'react';

interface ProgramCardProps {
  title: string;
  audience: string;
  topics: string[];
  color: 'teal' | 'light-blue' | 'magenta' | 'gray';
  isComingSoon: boolean;
  onClick: () => void;
}

const colorSchemes = {
    teal: {
        gradient: 'from-brand-teal to-brand-light-blue',
        border: 'border-brand-teal/40',
        shadow: 'shadow-brand-teal/25',
        text: 'text-brand-teal',
        bg: 'bg-brand-teal',
        audienceBg: 'bg-brand-teal/15 text-brand-teal border border-brand-teal/30',
        bullet: 'text-brand-teal',
        btnGradient: 'from-brand-teal to-brand-light-blue',
        btnShadow: 'shadow-brand-teal/40',
        accentDot: 'bg-brand-teal',
    },
    'light-blue': {
        gradient: 'from-brand-light-blue to-cyan-400',
        border: 'border-brand-light-blue/40',
        shadow: 'shadow-brand-light-blue/25',
        text: 'text-brand-light-blue',
        bg: 'bg-brand-light-blue',
        audienceBg: 'bg-brand-light-blue/15 text-brand-light-blue border border-brand-light-blue/30',
        bullet: 'text-brand-light-blue',
        btnGradient: 'from-brand-light-blue to-cyan-400',
        btnShadow: 'shadow-brand-light-blue/40',
        accentDot: 'bg-brand-light-blue',
    },
    magenta: {
        gradient: 'from-brand-magenta to-pink-400',
        border: 'border-brand-magenta/40',
        shadow: 'shadow-brand-magenta/25',
        text: 'text-brand-magenta',
        bg: 'bg-brand-magenta',
        audienceBg: 'bg-brand-magenta/15 text-brand-magenta border border-brand-magenta/30',
        bullet: 'text-brand-magenta',
        btnGradient: 'from-brand-magenta to-pink-400',
        btnShadow: 'shadow-brand-magenta/40',
        accentDot: 'bg-brand-magenta',
    },
    gray: {
        gradient: 'from-gray-400 to-gray-500',
        border: 'border-gray-300',
        shadow: '',
        text: 'text-gray-500',
        bg: 'bg-gray-400',
        audienceBg: 'bg-gray-200 text-gray-600 border border-gray-300',
        bullet: 'text-gray-400',
        btnGradient: 'from-gray-400 to-gray-500',
        btnShadow: '',
        accentDot: 'bg-gray-400',
    }
};

const ProgramCard: React.FC<ProgramCardProps> = ({ title, audience, topics, color, isComingSoon, onClick }) => {
    const scheme = colorSchemes[color] || colorSchemes.gray;

    return (
        <div
            onClick={isComingSoon ? undefined : onClick}
            className={`
                card-surface rounded-3xl border-2 glow-ring overflow-hidden
                transition-all duration-300 flex flex-col shadow-xl h-full relative
                ${isComingSoon
                    ? `${scheme.border} opacity-70`
                    : `${scheme.border} ${scheme.shadow} hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.01] cursor-pointer`}
            `}
        >
            {/* Colored gradient header band */}
            <div className={`bg-gradient-to-r ${scheme.gradient} px-6 pt-6 pb-5`}>
                {isComingSoon && (
                    <div className="absolute top-4 left-4 bg-white/90 text-gray-600 text-xs font-bold px-3 py-1 rounded-full z-10 shadow">בקרוב</div>
                )}
                <h3 className="text-4xl md:text-5xl font-bold font-display text-center w-full text-white drop-shadow-lg">{title}</h3>
                <p className={`text-sm sm:text-base font-semibold text-center mt-2 inline-block w-full rounded-full px-3 py-1 bg-white/20 text-white/90`}>{audience}</p>
            </div>

            {/* Topics list */}
            <ul className="flex-grow px-6 pt-5 pb-4 space-y-2">
                {topics.map(topic => (
                    <li key={topic} className="flex items-start gap-2.5 text-lg sm:text-xl text-brand-dark-blue/85">
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${scheme.accentDot}`} />
                        <span>{topic}</span>
                    </li>
                ))}
            </ul>

            {/* CTA button */}
            <div className="px-6 pb-6">
                <button
                    disabled={isComingSoon}
                    className={`
                        w-full font-bold py-3.5 px-6 rounded-xl text-xl transition-all duration-200
                        ${isComingSoon
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : `bg-gradient-to-r ${scheme.btnGradient} text-white shadow-lg ${scheme.btnShadow} hover:shadow-xl hover:brightness-105 hover:-translate-y-0.5 transform`}
                    `}
                >
                    {isComingSoon ? 'בקרוב...' : '🚀 התחלת למידה'}
                </button>
            </div>
        </div>
    );
};

export default ProgramCard;