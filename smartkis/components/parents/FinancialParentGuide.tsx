import React from 'react';
import { BookOpenIcon } from '../icons/Icons';

interface GuideSectionProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
}

const GuideSection: React.FC<GuideSectionProps> = ({ title, description, icon: Icon }) => (
    <div className="relative text-center bg-white/60 backdrop-blur-lg p-8 rounded-4xl border-2 border-gray-300 flex flex-col items-center justify-center shadow-xl h-full">
        <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">בקרוב</div>
        <div className="p-4 rounded-full mb-4 shadow-md bg-gray-300">
            <Icon className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-4xl sm:text-5xl font-bold font-display text-gray-500">{title}</h3>
        <p className="text-xl sm:text-2xl mt-2 text-gray-400">{description}</p>
    </div>
);

interface FinancialParentGuideProps {
    onBack: () => void;
}

const FinancialParentGuide: React.FC<FinancialParentGuideProps> = ({ onBack }) => {
    return (
        <div className="animate-fade-in">
            <button 
                onClick={onBack}
                className="mb-8 bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-8 text-xl rounded-full flex items-center transition-colors duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                חזרה למרחב הורים
            </button>

            <div className="text-center my-8 max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-bold font-display text-brand-dark-blue mb-2">'הורה פיננסי'</h2>
                <p className="text-2xl sm:text-3xl text-brand-dark-blue/90">
                    עזרים, טיפים וקישורים לחינוך פיננסי בבית.
                </p>
            </div>

            <main className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <GuideSection 
                    title="המדריך לחינוך פיננסי ביתי"
                    description="מאמרים, סרטונים ופעילויות משותפות לביצוע בבית."
                    icon={BookOpenIcon}
                />
            </main>
        </div>
    );
};

export default FinancialParentGuide;