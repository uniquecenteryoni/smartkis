import React from 'react';
import Header from './Header';
import { PodiumIcon, RightsIcon, HeartIcon } from './icons/Icons'; 

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  isComingSoon: boolean;
  accentFrom: string;
  accentTo: string;
  iconBg: string;
  iconShadow: string;
  emoji: string;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({ title, description, icon: Icon, onClick, isComingSoon, accentFrom, accentTo, iconBg, iconShadow, emoji }) => {
    const cardClasses = `
        relative text-center card-surface p-6 sm:p-8 rounded-4xl border-2 glow-ring
        transition-all duration-300 flex flex-col items-center justify-center shadow-xl
        h-full overflow-hidden
        ${isComingSoon
            ? 'border-gray-300 opacity-75'
            : 'border-transparent cursor-pointer hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02]'
        }
    `;

    return (
        <div onClick={isComingSoon ? undefined : onClick} className={cardClasses}>
            {/* Colored top accent bar */}
            {!isComingSoon && (
              <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-4xl bg-gradient-to-r ${accentFrom} ${accentTo}`} />
            )}
            {isComingSoon && <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">בקרוב</div>}

            {/* Icon circle */}
            <div className={`p-5 rounded-2xl mb-5 shadow-lg ${isComingSoon ? 'bg-gray-300' : iconBg} ${isComingSoon ? '' : iconShadow} transition-transform duration-300 group-hover:scale-110 animate-float`}>
                <Icon className="w-14 h-14 text-white" />
            </div>

            <div className="text-3xl mb-1">{emoji}</div>
            <h3 className={`text-3xl sm:text-5xl font-bold font-display mb-2 ${isComingSoon ? 'text-gray-500' : 'text-brand-dark-blue'}`}>{title}</h3>
            <p className={`text-lg sm:text-2xl ${isComingSoon ? 'text-gray-400' : 'text-brand-dark-blue/75'}`}>{description}</p>
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
                accentFrom="from-brand-teal"
                accentTo="to-brand-light-blue"
                iconBg="bg-gradient-to-br from-brand-teal to-brand-light-blue"
                iconShadow="shadow-brand-teal/40"
                emoji="🎓"
            />
            <UserTypeCard
                title="מדריכים"
                description="מרחב ניהול הדרכה ומאגר עזרים"
                icon={PodiumIcon}
                onClick={onSelectInstructors}
                isComingSoon={false}
                accentFrom="from-brand-violet"
                accentTo="to-brand-light-blue"
                iconBg="bg-gradient-to-br from-brand-violet to-blue-500"
                iconShadow="shadow-brand-violet/40"
                emoji="🏆"
            />
            <UserTypeCard
                title="הורים"
                description="מרחב למידה ומעקב אחר תהליכי הלמידה"
                icon={HeartIcon}
                onClick={onSelectParents}
                isComingSoon={false}
                accentFrom="from-brand-magenta"
                accentTo="to-pink-400"
                iconBg="bg-gradient-to-br from-brand-magenta to-pink-400"
                iconShadow="shadow-brand-magenta/40"
                emoji="❤️"
            />
        </main>
    </div>
  );
};

export default MainLandingPage;