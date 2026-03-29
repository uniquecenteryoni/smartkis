import React from 'react';
import ProgramCard from './ProgramCard';
import Header from './Header';

interface LandingPageProps {
  onSelectProgram: (programId: string) => void;
  onBack: () => void;
    onOpenQuiz: () => void;
    searchPanel?: React.ReactNode;
}

interface ProgramData {
  id: string;
  title: string;
  audience: string;
  color: 'teal' | 'light-blue' | 'magenta' | 'gray';
  topics: string[];
  isComingSoon: boolean;
}

const programs: { [key: string]: ProgramData } = {
    hachamBakis: {
        id: 'hacham-bakis',
        title: 'חכם בכיס',
        audience: 'תוכנית הדגל לכיתות ט\'-י"א',
        color: 'teal',
        topics: [
            'ניהול התקציב הראשון שלי + מיון הוצאות',
            'מינוס, ריביות וחסכונות והשקעות בסיס',
            'זכויות עובדים ותלוש שכר אינטראקטיבי',
            'שכירים מול עצמאים ומודל SWOT אישי',
            'חיסכון, ריבית דריבית ולמידת חקר כלכלית',
        ],
        isComingSoon: false
    },
    maBakis: {
        id: 'ma-bakis',
        title: 'מה בכיס',
        audience: 'תוכנית לכיתות ה\'-ח\'',
        color: 'light-blue',
        topics: [
            'סיפורו של כסף והמסע מהחליפין לשטרות',
            'הכסף ואני: תקציב אישי, מינוס ודמי כיס',
            'כמה זה עולה לי? צרכנות נבונה ומודל חצ"ר',
            'מונופולים, מותגים ואתגר מנהלי העתיד 5,000',
            'יזמות, איך להרוויח כסף וניהול זמן הוא כסף',
        ],
        isComingSoon: false
    },
    kisonim: {
        id: 'kisonim',
        title: 'כיסונים פיננסים',
        audience: 'תוכנית לכיתות א\'-ד\'',
        color: 'magenta',
        topics: [
            'מאיפה בא הכסף? מקצועות ודמי כיס ראשונים',
            'משחק צרכים ורצונות + בנק הצנצנות',
            'חנות קסומה, שוק צבעוני ומסע מטבעות בעולם',
            'סודות הפרסומות ומשימות להרוויח כסף',
            'סיפורי החלטות וכוחה של נתינה בקהילה',
            'הרפתקת חיסכון עם מטבעות ושטרות צבעוניים',
        ],
        isComingSoon: false
    }
};


const LandingPage: React.FC<LandingPageProps> = ({ onSelectProgram, onBack, onOpenQuiz, searchPanel }) => {
  return (
    <div className="animate-fade-in">
        <button 
            onClick={onBack}
            className="mb-8 w-full sm:w-auto bg-brand-magenta hover:bg-pink-700 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-8 text-base sm:text-xl rounded-full flex items-center justify-center transition-colors duration-300"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            חזרה לבחירת משתמש
        </button>

        <Header />
        <div className="text-center my-8 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-brand-dark-blue mb-2">ברוכים הבאים למרחב הלמידה החוויתי של "חכם בכיס"</h2>
            <p className="text-lg sm:text-2xl text-brand-dark-blue/90">
                ביחרו את התוכנית שלם והתחילו במסע הלמידה
            </p>
        </div>

        {searchPanel}

        <main className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <ProgramCard 
                {...programs.hachamBakis}
                onClick={() => onSelectProgram(programs.hachamBakis.id)}
            />
            <ProgramCard
                {...programs.maBakis}
                onClick={() => onSelectProgram(programs.maBakis.id)}
            />
            <ProgramCard
                {...programs.kisonim}
                onClick={() => onSelectProgram(programs.kisonim.id)}
            />
                        <div className="lg:col-span-3">
                            <button
                                onClick={onOpenQuiz}
                                type="button"
                                className="w-full mt-4 sm:mt-6 p-4 sm:p-5 rounded-3xl font-bold text-lg sm:text-2xl text-white bg-brand-dark-blue hover:bg-brand-teal transition-all duration-300 shadow-lg glow-ring flex items-center justify-center text-center"
                            >
                                לא בטוחים באיזו תוכנית לבחור? בחנו את רמתם!
                            </button>
                        </div>
        </main>
    </div>
  );
};

export default LandingPage;