import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { PodiumIcon } from '../icons/Icons';

interface PublicSpeakingModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ["למה זה חשוב?", "סודות הנואם", "אתגר הפיץ'", "מחוון ההצלחה", "סיכום"];

const modelItems = [
    { letter: 'נ', name: 'ניסוח', tip: 'בחרו את המילים הנכונות. מסר ברור ופשוט חזק יותר ממילים מסובכות.' },
    { letter: 'ס', name: 'סביבה', tip: 'הכירו את המרחב. התהלכו על הבמה, בדקו את המיקרופון, הרגישו בנוח.' },
    { letter: 'ק', name: 'קול', tip: 'שנו את גובה הקול ואת קצב הדיבור. אל תדברו כמו רובוט! השתמשו בשתיקות קצרות להדגשה.' },
    { letter: 'ת', name: 'תנועה', tip: 'השתמשו בתנועות ידיים טבעיות כדי להדגיש את המסר. תנועה מתונה על הבמה משדרת אנרגיה.' },
    { letter: 'י', name: 'ידיים', tip: 'הימנעו משילוב ידיים או החזקתן בכיסים. תנו להן להיות חלק טבעי מהדיבור שלכם.' },
    { letter: 'מ', name: 'מבט', tip: 'הביטו באנשים שונים בקהל. זה יוצר חיבור אישי וגורם להם להקשיב.' },
    { letter: 'ב', name: 'ביטחון', tip: 'גם אם אתם לחוצים, "זייפו את זה עד שתצליחו". עמדו יציב, חייכו, והאמינו בעצמכם.' },
    { letter: 'ה', name: 'התלהבות', tip: 'אם אתם לא תהיו נלהבים מהנושא, גם הקהל לא יהיה. הראו שזה חשוב לכם!' }
];


// --- Step Components ---

const IntroductionStep: React.FC = () => (
    <div className="bg-white/40 p-8 rounded-2xl text-center animate-fade-in">
        <h3 className="text-3xl font-bold text-brand-teal mb-4">עמידה מול קהל היא כוח על! 🦸</h3>
        <p className="text-xl mb-6">היכולת לדבר מול אנשים, לשכנע ולהעביר מסר היא אחת המיומנויות החשובות ביותר להצלחה. זה לא רק לנאומים גדולים - אנחנו "מוכרים" את הרעיונות שלנו כל הזמן: לחברים, למשפחה, ובעתיד גם לבוסים וללקוחות.</p>
        <div className="flex justify-center items-center gap-4 text-7xl">
            <span>🗣️</span><span className="font-bold text-brand-light-blue text-5xl">&rarr;</span>
            <span>💡</span><span className="font-bold text-brand-light-blue text-5xl">&rarr;</span>
            <span>🤝</span><span className="font-bold text-brand-light-blue text-5xl">&rarr;</span>
            <span>💰</span>
        </div>
        <p className="mt-4 font-semibold text-xl">דיבור &larr; רעיון &larr; שכנוע &larr; הצלחה</p>
    </div>
);

const ModelStep: React.FC = () => {
    const [activeItem, setActiveItem] = useState<number | null>(null);
    return (
        <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-3xl font-bold text-center mb-4">סודות הנואם המצליח: מודל נס קתימב"ה</h3>
            <p className="text-center text-xl mb-6">לחצו על כל אות כדי לגלות את הסוד שמאחוריה.</p>
            <div className="grid grid-cols-4 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {modelItems.map((item, index) => (
                    <div key={index} onClick={() => setActiveItem(index)} className="text-center cursor-pointer">
                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white transition-all ${activeItem === index ? 'bg-brand-magenta scale-110' : 'bg-brand-light-blue'}`}>
                           {item.letter}
                        </div>
                        <p className="font-bold mt-2 text-lg">{item.name}</p>
                    </div>
                ))}
            </div>
            {activeItem !== null && (
                <div className="mt-6 p-4 bg-yellow-100/70 rounded-lg text-center animate-fade-in">
                    <h4 className="font-bold text-3xl text-yellow-800">{modelItems[activeItem].letter} - {modelItems[activeItem].name}</h4>
                    <p className="text-xl">{modelItems[activeItem].tip}</p>
                </div>
            )}
        </div>
    );
};

const PitchChallengeStep: React.FC<{ onStartPitch: () => void }> = ({ onStartPitch }) => (
    <div className="bg-white/40 p-8 rounded-2xl text-center animate-fade-in">
        <h3 className="text-3xl font-bold text-brand-teal mb-4">אתגר הפיץ'! 🎤</h3>
        <p className="text-xl mb-6">"פיץ'" הוא נאום קצר (כדקה) שמטרתו לשכנע. בחרו נושא, הכינו את הטיעונים שלכם, והתאמנו מול המראה או מול חבר. כשתהיו מוכנים, לחצו על הכפתור כדי לעבור להערכה עצמית.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
             <div className="bg-white/60 p-6 rounded-2xl border-2 border-brand-teal/50 shadow-lg">
                <p className="text-6xl mb-4">👨‍👩‍👧‍👦</p>
                <h4 className="font-bold text-2xl mb-2">אפשרות 1:</h4>
                <p className="text-xl">שכנעו את ההורים להעלות לכם את דמי הכיס.</p>
            </div>
             <div className="bg-white/60 p-6 rounded-2xl border-2 border-brand-teal/50 shadow-lg">
                <p className="text-6xl mb-4">🖊️</p>
                <h4 className="font-bold text-2xl mb-2">אפשרות 2:</h4>
                <p className="text-xl">"מכרו" לחבר חפץ פשוט שיש לכם בחדר (כמו עט או ספר).</p>
            </div>
        </div>
        <button onClick={onStartPitch} className="mt-8 bg-brand-magenta text-white font-bold py-3 px-8 rounded-lg text-xl">אני מוכן/ה להציג!</button>
    </div>
);

const RubricStep: React.FC<{ onRubricComplete: () => void }> = ({ onRubricComplete }) => {
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    
    const handleRatingChange = (category: string, value: number) => {
        setRatings(prev => ({ ...prev, [category]: value }));
    };

    const isComplete = Object.keys(ratings).length === modelItems.length;
    const averageScore = isComplete ? ((Object.values(ratings) as number[]).reduce((a, b) => a + b, 0) / modelItems.length) : 0;
    
    return (
        <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-3xl font-bold text-center mb-4">איך הלך? דרגו את עצמכם!</h3>
            <p className="text-center mb-6 text-lg">היו כנים עם עצמכם. דרגו מ-1 (צריך שיפור) עד 5 (מעולה) בכל אחד מסעיפי המודל.</p>
            {!submitted ? (
                <div className="space-y-4">
                    {modelItems.map(item => (
                        <div key={item.name} className="bg-white/60 p-4 rounded-lg">
                            <h4 className="font-bold text-2xl">{item.letter} - {item.name}</h4>
                            <div className="flex justify-center gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map(val => (
                                    <button key={val} onClick={() => handleRatingChange(item.name, val)}
                                        className={`w-10 h-10 rounded-full text-lg font-bold transition-colors ${ratings[item.name] === val ? 'bg-brand-teal text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setSubmitted(true)} disabled={!isComplete} className="mt-6 w-full bg-brand-magenta text-white font-bold py-3 rounded-lg disabled:bg-gray-400 text-lg">הצג תוצאות</button>
                </div>
            ) : (
                <div className="text-center">
                    <h4 className="font-bold text-3xl">סיכום הערכה:</h4>
                    <p className="text-5xl font-bold my-4 text-brand-light-blue">{averageScore.toFixed(1)}</p>
                    <p className="text-xl">כל הכבוד על הביקורת העצמית! זו הדרך הטובה ביותר להשתפר. המשיכו להתאמן על הנקודות שקיבלו ציון נמוך.</p>
                    <button onClick={onRubricComplete} className="mt-6 bg-brand-teal text-white font-bold py-3 px-6 rounded-lg text-lg">לשלב הבא</button>
                </div>
            )}
        </div>
    );
};

const ConclusionStep: React.FC = () => (
    <div className="bg-white/40 p-8 rounded-2xl text-center animate-fade-in">
        <PodiumIcon className="w-24 h-24 mx-auto text-brand-teal" />
        <h3 className="text-3xl font-bold text-brand-teal mt-4 mb-4">כל הכבוד, נואמים אלופים!</h3>
        <p className="text-xl mb-6">
            עברתם את כל השלבים: למדתם את סודות הנואם, התמודדתם עם אתגר הפיץ' ואפילו נתתם לעצמכם משוב.
            <br />
            זכרו, עמידה מול קהל היא מיומנות נרכשת. ככל שתתאמנו יותר, כך תהיו טובים יותר!
        </p>
        <p className="mt-4 text-2xl font-bold">עכשיו יש לכם את הכלים להשמיע את קולכם ולהצליח.</p>
    </div>
);

// --- Main Component ---
const PublicSpeakingModule: React.FC<PublicSpeakingModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Mark module as complete when the final step is reached
        if (currentStep === steps.length - 1) {
            onComplete();
        }
    }, [currentStep, onComplete]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <IntroductionStep />;
            case 1: return <ModelStep />;
            case 2: return <PitchChallengeStep onStartPitch={() => setCurrentStep(3)} />;
            case 3: return <RubricStep onRubricComplete={() => setCurrentStep(4)} />;
            case 4: return <ConclusionStep />;
            default: return <IntroductionStep />;
        }
    };

    return (
        <ModuleView title="הכוח בידיים שלך: עמידה מול קהל" onBack={onBack}>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
                                    {index + 1}
                                </div>
                                <p className={`mt-2 text-xs text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            
            {renderStepContent()}

            <div className="flex justify-between mt-8">
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0 || currentStep === 3} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
                <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep >= steps.length - 1 || currentStep === 2} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">הבא</button>
            </div>
        </ModuleView>
    );
};

export default PublicSpeakingModule;