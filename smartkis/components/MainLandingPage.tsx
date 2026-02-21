import React from 'react';
import Header from './Header';
import { PodiumIcon, RightsIcon, HeartIcon } from './icons/Icons'; 

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  isComingSoon: boolean;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({ title, description, icon: Icon, onClick, isComingSoon }) => {
    const cardClasses = `
        relative text-center bg-white/60 backdrop-blur-lg p-6 sm:p-8 rounded-4xl border-2
        transition-all duration-300 flex flex-col items-center justify-center shadow-xl
        h-full
        ${isComingSoon 
            ? 'border-gray-300' 
            : 'border-brand-teal hover:shadow-brand-teal/20 transform hover:-translate-y-2 cursor-pointer'
        }
    `;

    return (
        <div onClick={isComingSoon ? undefined : onClick} className={cardClasses}>
            {isComingSoon && <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">בקרוב</div>}
            
            <div className={`p-4 rounded-full mb-4 shadow-md ${isComingSoon ? 'bg-gray-300' : 'bg-brand-teal shadow-brand-teal/30'}`}>
                <Icon className="w-12 h-12 text-white" />
            </div>

            <h3 className={`text-3xl sm:text-5xl font-bold font-display ${isComingSoon ? 'text-gray-500' : 'text-brand-dark-blue'}`}>{title}</h3>
            <p className={`text-lg sm:text-2xl mt-2 ${isComingSoon ? 'text-gray-400' : 'text-brand-dark-blue/80'}`}>{description}</p>
        </div>
    );
};

interface MainLandingPageProps {
  onSelectStudents: () => void;
  onSelectInstructors: () => void;
  onSelectParents: () => void;
}

const MainLandingPage: React.FC<MainLandingPageProps> = ({ onSelectStudents, onSelectInstructors, onSelectParents }) => {
  return (
    <div className="animate-fade-in">
        <Header />
        <main className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch md:min-h-[50vh]">
            <UserTypeCard 
                title="תלמידים"
                description="מרחב למידה חוויתי לתלמידי התוכנית"
                icon={RightsIcon}
                onClick={onSelectStudents}
                isComingSoon={false}
            />
            <UserTypeCard 
                title="מדריכים"
                description="מרחב ניהול הדרכה ומאגר עזרים"
                icon={PodiumIcon}
                onClick={onSelectInstructors}
                isComingSoon={false}
            />
            <UserTypeCard 
                title="הורים"
                description="מרחב למידה ומעקב אחר תהליכי הלמידה"
                icon={HeartIcon}
                onClick={onSelectParents}
                isComingSoon={false}
            />
        </main>
    </div>
  );
};

export default MainLandingPage;