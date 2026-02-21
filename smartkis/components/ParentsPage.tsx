import React, { useState } from 'react';
import Header from './Header';
import { ResearchIcon, LinksIcon } from './icons/Icons';
import FinancialParentGuide from './parents/FinancialParentGuide';

interface ParentsPageProps {
  onBack: () => void;
}

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    isComingSoon: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, onClick, isComingSoon }) => {
    const cardClasses = `
        relative text-center bg-white/60 backdrop-blur-lg p-8 rounded-4xl border-2
        transition-all duration-300 flex flex-col items-center justify-center shadow-xl h-full
        ${isComingSoon 
            ? 'border-gray-300' 
            : 'border-brand-teal hover:shadow-brand-teal/20 transform hover:-translate-y-2 cursor-pointer'
        }
    `;

    const iconBgClass = isComingSoon ? 'bg-gray-300' : 'bg-brand-teal shadow-brand-teal/30';
    const titleClass = isComingSoon ? 'text-gray-500' : 'text-brand-dark-blue';
    const descriptionClass = isComingSoon ? 'text-gray-400' : 'text-brand-dark-blue/80';

    return (
        <div onClick={isComingSoon ? undefined : onClick} className={cardClasses}>
            {isComingSoon && <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">בקרוב</div>}
            <div className={`p-4 rounded-full mb-4 shadow-md ${iconBgClass}`}>
                <Icon className="w-12 h-12 text-white" />
            </div>
            <h3 className={`text-4xl sm:text-5xl font-bold font-display ${titleClass}`}>{title}</h3>
            <p className={`text-xl sm:text-2xl mt-2 ${descriptionClass}`}>{description}</p>
        </div>
    );
};

const ParentsPage: React.FC<ParentsPageProps> = ({ onBack }) => {
  const [view, setView] = useState<'main' | 'guide'>('main');

  if (view === 'guide') {
    return <FinancialParentGuide onBack={() => setView('main')} />;
  }

  return (
    <div className="animate-fade-in container mx-auto px-4 py-8">
       <button 
        onClick={onBack}
        className="mb-8 bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-8 text-xl rounded-full flex items-center transition-colors duration-300"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        חזרה לבחירת משתמש
      </button>

      <Header />
      <div className="text-center my-8 max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold font-display text-brand-dark-blue mb-2">מרחב הורים</h2>
        <p className="text-2xl sm:text-3xl text-brand-dark-blue/90">
            כלים ומידע שיעזרו לכם להמשיך את החינוך הפיננסי בבית.
        </p>
      </div>
      <main className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <ActionCard 
            title="תהליך הלמידה של הילד/ה שלי"
            description="מעקב אחר התקדמות הילדים וצפייה בתוצרים"
            icon={ResearchIcon}
            isComingSoon={true}
        />
        <ActionCard 
            title="'הורה פיננסי'"
            description="עזרים, טיפים וקישורים לחינוך פיננסי בבית"
            icon={LinksIcon}
            isComingSoon={false}
            onClick={() => setView('guide')}
        />
      </main>
    </div>
  );
};

export default ParentsPage;