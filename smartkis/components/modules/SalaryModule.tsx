import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface SalaryModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// --- Data Structures ---

const paySlipData = {
    details: {
        companyName: 'חברת הצלחה בע"מ',
        employeeName: 'ישראל ישראלי',
        employeeId: '123456789',
        payPeriod: 'אפריל 2024',
        startDate: '01/10/2022',
        bank: '12 (הפועלים)',
        branch: '612',
        account: '123456',
    },
    payments: {
        title: 'תשלומים (ברוטו)',
        items: [
            { name: 'שכר יסוד', quantity: 186.00, rate: 31.61, value: 5880.06 },
            { name: 'שעות נוספות 125%', quantity: 4.00, rate: 39.51, value: 158.04 },
            { name: 'שעות נוספות 150%', quantity: 3.00, rate: 47.42, value: 142.26 },
            { name: 'נסיעות', quantity: 1.00, rate: 400.00, value: 400.00 },
            { name: 'תמורת חופשה', quantity: 0.83, rate: 252.88, value: 209.89 },
            { name: 'הבראה חודשי', quantity: 1.00, rate: 174.17, value: 174.17 },
            { name: 'תמורה עבור ימי חג', quantity: 1.00, rate: 252.88, value: 252.88 },
            { name: 'מחלה', quantity: 1.00, rate: 252.88, value: 252.88 },
        ],
        total: 7470.18
    },
    deductions: {
        mandatory: {
            title: 'ניכויי חובה',
            items: [
                { name: 'מס הכנסה', value: 142.42 },
                { name: 'ביטוח לאומי', value: 29.88 },
                { name: 'דמי בריאות', value: 231.58 },
                { name: 'פנסיה', value: 424.21 },
            ],
            total: 828.09
        },
        voluntary: {
            title: 'ניכויי רשות',
            items: [
                 { name: 'קרן השתלמות', value: 176.75 },
            ],
            total: 176.75
        },
        total: 1004.84
    },
    summary: {
        netSalary: 6465.34,
    },
    informative: {
        marginalTax: 10.00,
        creditPoints: 2.25,
        employerPension: 459.56,
        employerStudyFund: 530.26,
    }
};

const termExplanations: Record<string, string> = {
    'שכר יסוד': 'השכר הבסיסי שלך לפני כל התוספות והניכויים, מחושב לפי שכר המינימום העדכני.',
    'שעות נוספות 125%': 'תשלום עבור שעות עבודה מעבר למשרה מלאה. על השעתיים הראשונות מקבלים תוספת של 25%.',
    'שעות נוספות 150%': 'תשלום עבור שעות עבודה נוספות מעבר לשעתיים הראשונות, עליהן מקבלים תוספת של 50%.',
    'נסיעות': 'החזר הוצאות נסיעה מהבית לעבודה ובחזרה, לפי תעריף הקבוע בחוק.',
    'תמורת חופשה': 'תשלום עבור ימי חופשה שניצלת.',
    'הבראה חודשי': 'תשלום שנתי שמטרתו לסייע לעובד לצאת לחופשה להתרעננות. לעיתים הוא מחולק לתשלומים חודשיים.',
    'תמורה עבור ימי חג': 'תשלום עבור ימי חג רשמיים שבהם לא עבדת.',
    'מחלה': 'תשלום עבור ימי מחלה שניצלת, בהתאם לאישור רפואי.',
    'סה"כ תשלומים (ברוטו)': 'סך כל התשלומים שמגיעים לך מהמעסיק לפני הורדת ניכויים כלשהם.',
    'מס הכנסה': 'מס המוטל על הכנסתך. מחושב לפי מדרגות מס ומופחת על ידי נקודות זיכוי אישיות.',
    'ביטוח לאומי': 'תשלום חובה למוסד לביטוח לאומי, המבטח אותך במקרים של אבטלה, פגיעה בעבודה, נכות, ומממן קצבאות.',
    'דמי בריאות': 'תשלום חובה המממן את מערכת הבריאות הציבורית ומאפשר לך לקבל שירותים רפואיים מקופת החולים.',
    'פנסיה': 'חיסכון חובה לגיל פרישה. חלק מהסכום מופרש על ידך וחלק על ידי המעסיק.',
    'קרן השתלמות': 'תוכנית חיסכון לטווח בינוני, בדרך כלל ל-6 שנים. זהו ניכוי רשות (לא חובה) והטבה נפוצה.',
    'סה"כ ניכויים': 'סך כל הסכומים שמנוכים משכר הברוטו שלך.',
    'נטו לתשלום': 'הסכום הסופי שייכנס לחשבון הבנק שלך, אחרי שכל הניכויים ירדו משכר הברוטו.',
    'מס שולי': 'אחוז המס הגבוה ביותר שאתה משלם. הוא חל רק על החלק העליון של השכר שלך, שנכנס למדרגת המס הגבוהה ביותר שלך.',
    'נקודות זיכוי': 'הטבה המפחיתה את סכום מס ההכנסה שעליך לשלם. כל תושב זכאי למספר נקודות בסיסי, וישנן נקודות נוספות למצבים שונים.',
    'קופ"ג מעביד': 'הסכום שהמעסיק שלך מפריש עבורך לקופת הגמל או לקרן הפנסיה, בנוסף לחלק שאתה מפריש בעצמך.',
    'קה"ל מעביד': 'הסכום שהמעסיק שלך מפריש עבורך לקרן ההשתלמות, בנוסף לחלק שלך.'
};

const quizQuestions = [
    { question: "מהו סכום ה'נטו לתשלום' המעודכן?", options: ["7,470.18 ₪", "6,465.34 ₪", "1,004.84 ₪", "5,880.06 ₪"], answer: "6,465.34 ₪" },
    { question: "מהו סך התשלומים ברוטו המעודכן?", options: ["6,465.34 ₪", "1,004.84 ₪", "7,470.18 ₪", "8,000.00 ₪"], answer: "7,470.18 ₪" },
    { question: "כמה כסף נוכה עבור 'ביטוח לאומי'?", options: ["231.58 ₪", "424.21 ₪", "29.88 ₪", "142.42 ₪"], answer: "29.88 ₪" },
    { question: "מהו 'שכר היסוד' של העובד, המבוסס על שכר מינימום?", options: ["7,470.18 ₪", "6,465.34 ₪", "5,880.06 ₪", "4,650.00 ₪"], answer: "5,880.06 ₪" },
    { question: "מהו 'המס השולי' של העובד באחוזים?", options: ["2.25%", "14%", "10%", "20%"], answer: "10%" },
    { question: "כמה 'נקודות זיכוי' יש לעובד?", options: ["10", "2.25", "1", "אין מידע"], answer: "2.25" },
    { question: "איזה מהבאים הוא 'ניכוי רשות' ולא חובה?", options: ["מס הכנסה", "דמי בריאות", "קרן השתלמות", "פנסיה"], answer: "קרן השתלמות" },
    { question: "מהו הסכום הכולל של 'ניכויי החובה' (כולל מס הכנסה)?", options: ["176.75 ₪", "1,004.84 ₪", "828.09 ₪", "685.67 ₪"], answer: "828.09 ₪" },
    { question: "מהו הסכום הכולל שהמעסיק הפריש עבור העובד לפנסיה ולקרן השתלמות?", options: ["530.26 ₪", "459.56 ₪", "989.82 ₪", "1,004.84 ₪"], answer: "989.82 ₪" },
    { question: "אם העובד היה מוותר על 'קרן השתלמות', בכמה בערך היה גדל הנטו שלו (בהתעלם מהשפעת המס)?", options: ["ב-176.75 ₪", "ב-530.26 ₪", "ב-707.01 ₪", "הנטו לא היה משתנה"], answer: "ב-176.75 ₪" },
];

// --- Sub-components ---

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 group-hover:text-brand-light-blue transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const Tooltip: React.FC<{ text: string; explanation: string; children: React.ReactNode; className?: string }> = ({ text, explanation, children, className }) => (
    <div className={`relative group ${className || ''}`}>
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-96 bg-brand-dark-blue text-white text-xl rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg text-right">
        <p className="font-bold text-2xl">{text}</p>
        <p>{explanation}</p>
        <div className="absolute top-full left-1/2 -ml-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-brand-dark-blue"></div>
      </div>
    </div>
);

const PaymentsTable: React.FC<{
    title: string;
    items: { name: string; quantity?: number | string; rate?: number | string; value: number }[];
    total?: { name: string; value: number };
}> = ({ title, items, total }) => {
    return (
        <div className="border border-gray-300 rounded-lg p-2 text-2xl">
            <div className="font-bold text-3xl text-center bg-gray-200 rounded-t-md p-2">{title}</div>
            <div className="grid grid-cols-10 gap-2 p-1 font-bold border-b border-gray-300 text-xl">
                <span className="text-right col-span-4">תאור</span>
                <span className="text-center col-span-2">כמות</span>
                <span className="text-center col-span-2">תעריף</span>
                <span className="text-left col-span-2">סה"כ</span>
            </div>
            {items.map(item => (
                 <div key={item.name} className="grid grid-cols-10 gap-2 p-1 hover:bg-gray-100 rounded items-center">
                    <Tooltip className="col-span-4" text={item.name} explanation={termExplanations[item.name] || ''}>
                      <span className="flex items-center gap-1.5 text-right cursor-pointer">{item.name} <InfoIcon /></span>
                    </Tooltip>
                    <span className="text-center font-mono col-span-2">{item.quantity ? (typeof item.quantity === 'number' ? item.quantity.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.quantity) : ''}</span>
                    <span className="text-center font-mono col-span-2">{item.rate ? (typeof item.rate === 'number' ? item.rate.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.rate) : ''}</span>
                    <span className="text-left font-mono col-span-2">{item.value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            ))}
            {total && (
                <Tooltip text={total.name} explanation={termExplanations[total.name] || ''}>
                    <div className="grid grid-cols-10 gap-2 p-1 font-bold border-t border-gray-400 mt-1 pt-1 text-3xl">
                        <span className="flex items-center gap-1.5 text-right col-span-8 cursor-pointer">{total.name} <InfoIcon /></span>
                        <span className="text-left font-mono col-span-2">{total.value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </Tooltip>
            )}
        </div>
    );
};

const DeductionsTable: React.FC<{
    title: string;
    items: { name: string; value: number }[];
}> = ({ title, items }) => (
    <div className="border border-gray-300 rounded-lg p-2 h-full flex flex-col text-2xl">
        <div className="font-bold text-3xl text-center bg-gray-200 rounded-t-md p-2">{title}</div>
        <div className="grid grid-cols-2 gap-2 p-1 font-bold border-b border-gray-300 text-xl">
            <span className="text-right">תאור</span>
            <span className="text-left">סה"כ</span>
        </div>
        <div className="flex-grow">
            {items.map(item => (
                <div key={item.name} className="grid grid-cols-2 gap-2 p-1 hover:bg-gray-100 rounded items-center">
                    <Tooltip text={item.name} explanation={termExplanations[item.name] || ''}>
                        <span className="flex items-center gap-1.5 text-right cursor-pointer">{item.name} <InfoIcon /></span>
                    </Tooltip>
                    <span className="text-left font-mono">{item.value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            ))}
        </div>
    </div>
);

const InfoRow: React.FC<{ term: string, value: string | number }> = ({ term, value }) => (
    <Tooltip text={term} explanation={termExplanations[term] || ''}>
        <div className="flex justify-between items-center cursor-pointer">
            <span className="flex items-center gap-1.5">{term} <InfoIcon /></span>
            <span className="font-mono text-left">{typeof value === 'number' ? value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}</span>
        </div>
    </Tooltip>
);

// --- Main Component ---

const SalaryModule: React.FC<SalaryModuleProps> = ({ onBack, title, onComplete }) => {
    const [quizState, setQuizState] = useState<'not_started' | 'in_progress' | 'finished'>('not_started');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (quizState === 'finished') {
            const percentage = (score / quizQuestions.length) * 100;
            const isCompleted = percentage >= 80;
            if(isCompleted) {
                onComplete();
            }
        }
     }, [quizState, score, onComplete, quizQuestions.length]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;
        
        setSelectedAnswer(answer);
        const correctAnswer = quizQuestions[currentQuestionIndex].answer;
        if (answer === correctAnswer) {
            setScore(prev => prev + 1);
            setFeedback('נכון מאוד!');
        } else {
            setFeedback(`טעות. התשובה הנכונה היא: ${correctAnswer}`);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setFeedback('');
        } else {
            setQuizState('finished');
        }
    };

    const restartQuiz = () => {
        setQuizState('in_progress');
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setFeedback('');
    };

    const renderQuiz = () => {
        if (quizState === 'finished') {
             const percentage = (score / quizQuestions.length) * 100;
             const isCompleted = percentage >= 80;

             const resultMessage = isCompleted
                ? "מעולה! עמדתם ביעד והשלמתם את המודול!"
                : "עבודה טובה! יש לכם ידע טוב, אבל צריך להגיע ל-80% כדי להשלים את המודול.";

            return (
                <div className="relative text-center p-6 bg-white/80 border-4 border-yellow-400 rounded-lg shadow-2xl">
                    <TrophyIcon className="w-24 h-24 mx-auto text-yellow-500" />
                    <h3 className="text-4xl font-bold mb-2 mt-4 text-brand-dark-blue">סיימת את הבוחן!</h3>
                    <p className="text-3xl mb-4 text-brand-dark-blue/80">{resultMessage}</p>
                    <div className="bg-brand-light-blue/20 p-3 rounded-lg my-4">
                        <p className="text-3xl">הציון שלך:</p>
                        <p className="text-6xl font-bold text-brand-light-blue">{score} / {quizQuestions.length}</p>
                    </div>
                     {!isCompleted && <p className="text-2xl text-red-500 mb-4">נסו שוב כדי לפתוח את המבחן המסכם!</p>}
                    <button onClick={restartQuiz} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 text-3xl">שחקו שוב</button>
                </div>
            );
        }

        if (quizState === 'not_started') {
            return (
                <div className="text-center">
                    <h3 className="text-4xl font-bold mb-2">מוכנים? בחנו את עצמכם</h3>
                    <p className="text-3xl mb-8">עליכם לענות נכון על 80% מהשאלות ({quizQuestions.length * 0.8} מתוך {quizQuestions.length}) כדי להשלים את המודול.</p>
                    <button onClick={() => setQuizState('in_progress')} className="bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg text-3xl transition-transform transform hover:scale-105">התחל בוחן</button>
                </div>
            )
        }
        
        const q = quizQuestions[currentQuestionIndex];
        return (
            <div>
                 <div className="mb-4">
                    <div className="bg-gray-300 rounded-full h-2.5">
                        <div className="bg-brand-teal h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                    </div>
                    <p className="text-center text-xl mt-1 text-brand-dark-blue/80">{`שאלה ${currentQuestionIndex + 1} מתוך ${quizQuestions.length}`}</p>
                </div>
                <h4 className="font-bold text-4xl mb-4">{q.question}</h4>
                <div className="space-y-3">
                    {q.options.map(opt => {
                        const isCorrect = opt === q.answer;
                        const isSelected = opt === selectedAnswer;
                        let buttonClass = 'bg-white/60 backdrop-blur-sm border border-brand-light-blue/30 text-brand-dark-blue hover:bg-brand-light-blue/20';
                        if(selectedAnswer) {
                            if(isCorrect) buttonClass = 'bg-green-500 text-white border-green-600';
                            else if (isSelected) buttonClass = 'bg-red-500 text-white border-red-600';
                            else buttonClass = 'bg-gray-200/50 text-gray-500 border-gray-300 opacity-60';
                        }
                        return (
                            <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selectedAnswer} 
                                className={`flex justify-between items-center w-full text-right p-4 rounded-lg transition-all duration-300 transform hover:scale-102 text-3xl ${buttonClass}`}>
                                <span>{opt}</span>
                                {selectedAnswer && isCorrect && <CheckIcon />}
                                {selectedAnswer && isSelected && !isCorrect && <CrossIcon />}
                            </button>
                        );
                    })}
                </div>
                {feedback && <p className={`mt-4 font-bold p-3 rounded-md text-center text-2xl ${feedback === 'נכון מאוד!' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{feedback}</p>}
                {selectedAnswer && (
                    <button onClick={handleNextQuestion} className="w-full mt-4 bg-brand-light-blue text-white font-bold py-3 px-4 rounded-lg animate-pulse hover:animate-none text-2xl">
                        {currentQuestionIndex < quizQuestions.length - 1 ? 'לשאלה הבאה' : 'סיים בוחן'}
                    </button>
                )}
            </div>
        );
    };

    return (
        <ModuleView title={title} onBack={onBack}>
             <div className="text-center">
                <p className="mb-4 text-3xl text-center text-brand-dark-blue/90">
                    ברוכים הבאים למעבדת השכר! לפניכם תלוש שכר אינטראקטיבי. עברו עם העכבר או לחצו על כל רכיב המסומן באייקון ⓘ כדי לקבל הסבר מפורט. לאחר שתבינו את כל המרכיבים, בחנו את הידע שלכם בבוחן שבצד. בהצלחה!
                </p>
                <a 
                    href="https://drive.google.com/file/d/1CSZIJ6X52bBW2WZGrigtpWusrBCYh4uu/view?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block mt-2 mb-6 bg-white/70 backdrop-blur-sm border-2 border-brand-teal text-brand-teal font-bold py-2 px-4 rounded-lg hover:bg-brand-teal/20 transition-colors text-2xl"
                >
                    רוצים לראות איך נראה תלוש אמיתי?
                </a>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Pay Slip */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border-2 border-gray-300 font-sans text-xl">
                    <div className="text-center p-2 border-b-2 border-black">
                        <h3 className="text-4xl font-bold">תלוש משכורת לחודש {paySlipData.details.payPeriod}</h3>
                        <p className="text-2xl">{paySlipData.details.companyName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 p-2 border-b border-gray-300 text-2xl">
                        <div>
                            <p><strong>שם עובד:</strong> {paySlipData.details.employeeName}</p>
                            <p><strong>ת.ז:</strong> {paySlipData.details.employeeId}</p>
                            <p><strong>ת. עבודה:</strong> {paySlipData.details.startDate}</p>
                        </div>
                         <div>
                            <p><strong>בנק:</strong> {paySlipData.details.bank}</p>
                            <p><strong>סניף:</strong> {paySlipData.details.branch}</p>
                            <p><strong>חשבון:</strong> {paySlipData.details.account}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 mt-2">
                        <PaymentsTable 
                            title={paySlipData.payments.title}
                            items={paySlipData.payments.items}
                            total={{ name: 'סה"כ תשלומים (ברוטו)', value: paySlipData.payments.total }}
                        />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DeductionsTable 
                                title={paySlipData.deductions.mandatory.title}
                                items={paySlipData.deductions.mandatory.items}
                            />
                            <DeductionsTable 
                                title={paySlipData.deductions.voluntary.title}
                                items={paySlipData.deductions.voluntary.items}
                            />
                        </div>

                         <Tooltip text={'סה"כ ניכויים'} explanation={termExplanations['סה"כ ניכויים'] || ''}>
                             <div className="grid grid-cols-10 gap-2 p-1 font-bold border-t-2 border-b-2 border-gray-400 mt-1 py-2 text-3xl cursor-pointer">
                                <span className="flex items-center gap-1.5 text-right col-span-8">{'סה"כ ניכויים'} <InfoIcon /></span>
                                <span className="text-left font-mono col-span-2">{paySlipData.deductions.total.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </Tooltip>
                    </div>
                    
                    <Tooltip text={'נטו לתשלום'} explanation={termExplanations['נטו לתשלום'] || ''}>
                        <div className="bg-blue-100 p-3 rounded-lg mt-4 text-center cursor-pointer">
                            <div className="flex justify-between font-bold text-4xl">
                                <span className="flex items-center gap-1.5">נטו לתשלום <InfoIcon /></span>
                                <span className="font-mono">{paySlipData.summary.netSalary.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </Tooltip>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2 p-2 border-t border-gray-300 text-2xl">
                        <div>
                            <p className="font-bold underline">נתונים נוספים:</p>
                            <InfoRow term={'מס שולי'} value={`${paySlipData.informative.marginalTax.toFixed(2)}%`}/>
                            <InfoRow term={'נקודות זיכוי'} value={paySlipData.informative.creditPoints}/>
                        </div>
                        <div>
                            <p className="font-bold underline">הפרשות מעביד:</p>
                            <InfoRow term={'קופ"ג מעביד'} value={paySlipData.informative.employerPension}/>
                            <InfoRow term={'קה"ל מעביד'} value={paySlipData.informative.employerStudyFund}/>
                        </div>
                    </div>
                </div>

                {/* Quiz */}
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl flex flex-col justify-center">
                    {renderQuiz()}
                </div>
            </div>
        </ModuleView>
    );
};

export default SalaryModule;