import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';

interface ResearchModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// --- Icons ---
const VideoCameraIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const CheckBadgeIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
const MagnifyingGlassIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const TrophyIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" transform="scale(1, -1) translate(0, -24)"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" visibility="hidden"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m-4-5h8M9 21h6" transform="scale(1, -1) translate(0, -24)"/><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v4m6-4v4" /></svg>);

const steps = [
    { title: "איסוף רמזים", icon: VideoCameraIcon },
    { title: "בחינת הידע", icon: CheckBadgeIcon },
    { title: "משימת חקר", icon: MagnifyingGlassIcon },
];

const Quiz: React.FC<{onQuizSuccess: () => void}> = ({onQuizSuccess}) => {
    const questions = [
        {
            question: "מהי ההגדרה הבסיסית של אינפלציה?",
            options: ["התחזקות של השקל", "עלייה כללית ומתמשכת של מחירים", "ירידה במחירי הדיור", "העלאת ריבית על ידי בנק ישראל"],
            answer: "עלייה כללית ומתמשכת של מחירים"
        },
        {
            question: "מהו אחד הכלים המרכזיים של בנק ישראל להילחם באינפלציה?",
            options: ["הדפסת עוד כסף", "הורדת מסים", "העלאת הריבית במשק", "עידוד קניית מוצרים מחו\"ל"],
            answer: "העלאת הריבית במשק"
        },
        {
            question: "אם יש לכם 100 ש\"ח ושיעור האינפלציה השנתי הוא 5%, מה קורה לכוח הקנייה שלכם?",
            options: ["אפשר לקנות דברים בשווי 105 ש\"ח", "אפשר לקנות דברים בשווי 100 ש\"ח בדיוק", "אפשר לקנות דברים בשווי של כ-95 ש\"ח", "הכסף הופך ללא שמיש"],
            answer: "אפשר לקנות דברים בשווי של כ-95 ש\"ח"
        },
        {
            question: "לשם מה משמש 'מדד המחירים לצרכן'?",
            options: ["למדוד את רמת האבטלה", "למדוד את קצב האינפלציה", "לקבוע את שכר המינימום", "למדוד את הצמיחה הכלכלית"],
            answer: "למדוד את קצב האינפלציה"
        },
        {
            question: "מי בדרך כלל מרוויח מאינפלציה גבוהה ובלתי צפויה?",
            options: ["אנשים שחוסכים כסף בבנק", "אנשים שלקחו הלוואות גדולות בריבית קבועה", "פנסיונרים עם קצבה קבועה", "אנשים שמלווים כסף לאחרים"],
            answer: "אנשים שלקחו הלוואות גדולות בריבית קבועה"
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [feedback, setFeedback] = useState('');
    const [quizFinished, setQuizFinished] = useState(false);
    const [score, setScore] = useState(0);

     useEffect(() => {
        if (quizFinished) {
            if (score >= 4) { // 80% of 5 questions
                onQuizSuccess();
            }
        }
    }, [quizFinished, score, onQuizSuccess]);


    const handleSelect = (option: string) => {
        if(selectedOption) return;
        setSelectedOption(option);
        if (option === questions[currentQuestion].answer) {
            setScore(prev => prev + 1);
            setFeedback('נכון מאוד! כל הכבוד!');
        } else {
            setFeedback('תשובה לא נכונה. התשובה הנכונה היא: ' + questions[currentQuestion].answer);
        }
    };
    
    const nextQuestion = () => {
        if(currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption('');
            setFeedback('');
        } else {
            setQuizFinished(true);
        }
    }
    
    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption('');
        setFeedback('');
        setQuizFinished(false);
        setScore(0);
    }

    if(quizFinished) {
        const isCompleted = score >= 4;
        const resultMessage = isCompleted 
            ? "מעולה! עמדתם ביעד של 80% והשלמתם את המודול!"
            : `עבודה טובה! הציון שלכם הוא ${score}/${questions.length}. נסו שוב כדי להשלים את המודול.`;

        return (
            <div className={`text-center p-6 rounded-2xl ${isCompleted ? 'bg-green-100/70 border-green-400' : 'bg-red-100/70 border-red-400'} border-2`}>
                <TrophyIcon className="w-20 h-20 mx-auto text-yellow-500"/>
                <h4 className="font-bold text-4xl mb-2 mt-4">{isCompleted ? '🎉 הצלחתם!' : '🤔 כמעט שם...'}</h4>
                <p className="text-2xl mb-4">{resultMessage}</p>
                {!isCompleted && <button onClick={restartQuiz} className="bg-brand-teal text-white font-bold py-2 px-6 rounded-lg text-lg">שחק שוב</button>}
            </div>
        )
    }

    return (
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-inner border border-white/40">
            <div className="mb-4">
                <p className="text-center font-bold text-xl">{`שאלה ${currentQuestion + 1} מתוך ${questions.length}`}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-brand-teal h-2.5 rounded-full" style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}></div></div>
            </div>
            <h4 className="font-bold text-3xl mb-4 text-center">{questions[currentQuestion].question}</h4>
            <div className="space-y-3">
                {questions[currentQuestion].options.map(opt => (
                     <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selectedOption} className={`block w-full text-right p-4 rounded-lg transition-all duration-300 text-2xl ${selectedOption ? (opt === questions[currentQuestion].answer ? 'bg-green-500 text-white' : (opt === selectedOption ? 'bg-red-500 text-white' : 'bg-white/50 opacity-60')) : 'bg-white/80 hover:bg-white'}`}>
                        {opt}
                    </button>
                ))}
            </div>
            {feedback && <p className="mt-4 font-bold p-3 rounded-lg bg-yellow-100/60 text-yellow-800 text-xl">{feedback}</p>}
            {selectedOption && <button onClick={nextQuestion} className="mt-4 w-full bg-brand-light-blue text-white font-bold py-3 px-4 rounded-lg text-2xl hover:bg-cyan-600 transition-colors">{currentQuestion < questions.length - 1 ? "לשאלה הבאה" : "סיים בוחן"}</button>}
        </div>
    );
};

const Step1: React.FC = () => (
    <div className="bg-white/50 backdrop-blur-md border border-white/30 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 animate-fade-in">
        <div className="flex-shrink-0 bg-brand-light-blue p-5 rounded-full shadow-lg">
            <VideoCameraIcon className="w-24 h-24 text-white"/>
        </div>
        <div className="text-center md:text-right">
            <h3 className="text-5xl font-bold mb-2 text-brand-light-blue">שלב 1: איסוף רמזים</h3>
            <p className="text-2xl mb-4 text-brand-dark-blue/90">כדי להיות בלשים פיננסיים, קודם כל צריך להבין את הזירה. צפו בסרטון הבא כדי ללמוד מהי אינפלציה ואיך היא משפיעה על הכסף של כולנו.</p>
            <a href="https://www.youtube.com/watch?v=y1Fvi6Xu29g" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-transform transform hover:scale-105 shadow-lg">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                <span className="text-2xl">צפייה בסרטון</span>
            </a>
        </div>
    </div>
);

const Step2: React.FC<{onQuizSuccess: () => void}> = ({onQuizSuccess}) => (
    <div className="bg-white/50 backdrop-blur-md border border-white/30 p-8 rounded-3xl shadow-xl animate-fade-in">
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 bg-brand-teal p-5 rounded-full shadow-lg">
                <CheckBadgeIcon className="w-24 h-24 text-white"/>
            </div>
            <div className="text-center md:text-right flex-grow">
                <h3 className="text-5xl font-bold mb-2 text-brand-teal">שלב 2: בחינת הידע</h3>
                <p className="text-2xl mb-4 text-brand-dark-blue/90">ראיתם את הסרטון? יופי! עכשיו בואו נראה מה למדתם. עליכם לענות נכון על 80% מהשאלות כדי להמשיך לשלב הבא.</p>
            </div>
        </div>
        <div className="mt-6">
            <Quiz onQuizSuccess={onQuizSuccess} />
        </div>
    </div>
);

const Step3: React.FC = () => (
     <div className="bg-white/50 backdrop-blur-md border border-white/30 p-8 rounded-3xl shadow-xl animate-fade-in">
         <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 bg-brand-magenta p-5 rounded-full shadow-lg">
                <MagnifyingGlassIcon className="w-24 h-24 text-white"/>
            </div>
            <div className="text-center md:text-right flex-grow">
                <h3 className="text-5xl font-bold mb-2 text-brand-magenta">שלב 3: משימת חקר - צאו לשטח!</h3>
                <p className="text-2xl mb-4 text-brand-dark-blue/90">הגיע הזמן להיות חוקרים פיננסיים! חיפוש מידע אמין ברשת הוא כלי חשוב. משימתכם היא למצוא את מדד המחירים לצרכן האחרון שפורסם בישראל.</p>
            </div>
        </div>
        <div className="mt-6 bg-brand-dark-blue text-white p-6 rounded-2xl shadow-inner">
            <h4 className="font-bold text-3xl mb-4 text-yellow-300">📜 תדריך המשימה:</h4>
            <ol className="list-decimal list-inside space-y-3 text-xl bg-black/20 p-4 rounded-lg">
                <li>פתחו כרטיסייה חדשה בדפדפן וחפשו "<strong>מדד המחירים לצרכן הלמ"ס</strong>" (הלשכה המרכזית לסטטיסטיקה).</li>
                <li>היכנסו לאתר הרשמי של הלמ"ס ומצאו את הנתון העדכני ביותר. הוא בדרך כלל מופיע כאחוז.</li>
                <li>העתיקו את הנתון שמצאתם (לדוגמה: 0.3%) לשדה הראשון למטה.</li>
                <li>העתיקו את הקישור המדויק (URL) מהדפדפן לשדה השני כדי שנוכל לוודא את מקור המידע.</li>
            </ol>
            <div className="mt-6 space-y-4">
                <input type="text" placeholder="הנתון שמצאתם (לדוגמה: 0.3%)" className="w-full bg-white/90 text-brand-dark-blue p-3 rounded-lg border-2 border-gray-300 text-xl"/>
                <input type="text" placeholder="הקישור למקור המידע (URL)" className="w-full bg-white/90 text-brand-dark-blue p-3 rounded-lg border-2 border-gray-300 text-xl"/>
                <button className="w-full bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 rounded-lg text-2xl transition-colors">הגשת ממצאים</button>
            </div>
        </div>
    </div>
);


const ResearchModule: React.FC<ResearchModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    
    const handleQuizSuccess = () => {
        setQuizCompleted(true);
        onComplete();
    };
    
    const renderStepContent = () => {
        switch(currentStep) {
            case 0: return <Step1 />;
            case 1: return <Step2 onQuizSuccess={handleQuizSuccess}/>;
            case 2: return <Step3 />;
            default: return null;
        }
    };
    
    return (
        <ModuleView title="משימת חקר: הבלש הפיננסי" onBack={onBack}>
             <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
                                    <step.icon className="w-8 h-8"/>
                                </div>
                                <p className={`mt-2 text-lg text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step.title}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                {renderStepContent()}
            </div>

            <div className="flex justify-between mt-12">
                <button 
                    onClick={() => setCurrentStep(s => s - 1)} 
                    disabled={currentStep === 0} 
                    className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl"
                >
                    הקודם
                </button>
                <button 
                    onClick={() => setCurrentStep(s => s + 1)} 
                    disabled={currentStep === steps.length - 1 || (currentStep === 1 && !quizCompleted)} 
                    className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-2xl"
                    title={currentStep === 1 && !quizCompleted ? "עליך להשלים את הבוחן כדי להמשיך" : ""}
                >
                    {currentStep === 1 && !quizCompleted ? "השלימו את הבוחן" : "הבא"}
                </button>
            </div>
        </ModuleView>
    );
};

export default ResearchModule;