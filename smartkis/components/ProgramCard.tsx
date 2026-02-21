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
        bg: 'bg-brand-teal',
        hoverBg: 'hover:bg-teal-500',
        border: 'border-brand-teal',
        shadow: 'hover:shadow-brand-teal/20',
        text: 'text-brand-teal'
    },
    'light-blue': {
        bg: 'bg-brand-light-blue',
        hoverBg: 'hover:bg-cyan-500',
        border: 'border-brand-light-blue',
        shadow: 'hover:shadow-brand-light-blue/20',
        text: 'text-brand-light-blue'
    },
    magenta: {
        bg: 'bg-brand-magenta',
        hoverBg: 'hover:bg-pink-700',
        border: 'border-brand-magenta',
        shadow: 'hover:shadow-brand-magenta/20',
        text: 'text-brand-magenta'
    },
    gray: {
        bg: 'bg-gray-400',
        hoverBg: 'bg-gray-400',
        border: 'border-gray-300',
        shadow: '',
        text: 'text-gray-500'
    }
};

const ProgramCard: React.FC<ProgramCardProps> = ({ title, audience, topics, color, isComingSoon, onClick }) => {
    const scheme = colorSchemes[color] || colorSchemes.gray;
    const cardClasses = `
        bg-white/60 backdrop-blur-lg p-6 rounded-3xl border-2
        transition-all duration-300 flex flex-col items-start shadow-xl
        h-full relative
        ${isComingSoon ? scheme.border : `${scheme.border} ${scheme.shadow} transform hover:-translate-y-1.5 cursor-pointer`}
    `;
    
    return (
        <div onClick={isComingSoon ? undefined : onClick} className={cardClasses}>
            {isComingSoon && <div className="absolute top-4 left-4 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">בקרוב</div>}
            
            <h3 className={`text-3xl md:text-4xl font-bold font-display ${isComingSoon ? 'text-gray-500' : scheme.text}`}>{title}</h3>
            <p className={`font-semibold mb-4 text-lg ${isComingSoon ? 'text-gray-400' : 'text-brand-dark-blue/80'}`}>{audience}</p>
            
            <ul className="list-disc list-inside space-y-1 text-brand-dark-blue/90 flex-grow mb-6 text-lg sm:text-xl">
                {topics.map(topic => <li key={topic}>{topic}</li>)}
            </ul>
            
            <button
                disabled={isComingSoon}
                className={`w-full mt-auto font-bold py-3 px-6 rounded-lg text-xl text-white transition-colors ${
                    isComingSoon 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : `${scheme.bg} ${scheme.hoverBg}`
                }`}
            >
                {isComingSoon ? 'בקרוב...' : 'התחלת למידה'}
            </button>
        </div>
    );
};

export default ProgramCard;