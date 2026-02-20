import React from 'react';
import ProgramCard from './ProgramCard';
import Header from './Header';

interface LandingPageProps {
  onSelectProgram: (programId: string) => void;
  onBack: () => void;
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
        title: 'תוכנית "חכם בכיס"',
        audience: 'תוכנית הדגל לכיתות ט\'-י"א',
        color: 'teal',
        topics: [
            'בניית תקציב ("מונופול החיים")',
            'פענוח תלוש שכר וזכויות עובדים',
            'התנהלות כלכלית נכונה (מינוס וחיסכון)',
            'הכרת עולם ההשקעות ושוק ההון',
            'השוואה בין שכירים לעצמאיים',
        ],
        isComingSoon: false
    },
    maBakis: {
        id: 'ma-bakis',
        title: 'תוכנית "מה בכיס"',
        audience: 'תוכנית לכיתות ה\'-ח\'',
        color: 'light-blue',
        topics: [
            'היכרות עם עולם הכסף',
            'צרכנות נבונה וניהול תקציב',
            'חיסכון והצבת מטרות',
            'הכרת מונופולים ומותגים',
            'יזמות וחשיבה עסקית',
        ],
        isComingSoon: false
    },
    kisonim: {
        id: 'kisonim',
        title: 'תוכנית "כיסונים פיננסים"',
        audience: 'תוכנית לכיתות א\'-ד\'',
        color: 'magenta',
        topics: [
            'מהו כסף ואיך משתמשים בו?',
            'הבחנה בין צרכים לרצונות',
            'חשיבות החיסכון ודחיית סיפוקים',
            'קבלת החלטות פיננסיות פשוטות',
            'מושגי יסוד: עבודה, תגמול וערך',
        ],
        isComingSoon: false
    }
};


const LandingPage: React.FC<LandingPageProps> = ({ onSelectProgram, onBack }) => {
  return (
    <div className="animate-fade-in">
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
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-brand-dark-blue mb-2">ברוכים הבאים למרחב הלמידה החוויתי של "חכם בכיס"</h2>
            <p className="text-xl sm:text-2xl text-brand-dark-blue/90">
                ביחרו את התוכנית שלם והתחילו במסע הלמידה
            </p>
        </div>
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
        </main>
    </div>
  );
};

export default LandingPage;