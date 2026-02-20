import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';

interface BuildBusinessModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ["השראה", "זיהוי בעיה", "הרעיון והתוכנית", "סיכום"];

// Step 1: Inspiration
const InspirationStep = () => (
    <div className="bg-white/40 p-8 rounded-2xl text-center animate-fade-in">
        <h3 className="text-3xl font-bold text-brand-teal mb-4">כל עסק גדול מתחיל ברעיון קטן</h3>
        <p className="text-xl mb-8">יזם הוא אדם שמזהה בעיה או צורך, ויוצר פתרון חדש. בואו נראה כמה דוגמאות:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 p-6 rounded-xl">
                <p className="text-8xl mb-3">🗺️</p>
                <h4 className="font-bold text-2xl">Waze</h4>
                <p className="font-semibold text-brand-light-blue text-lg">הבעיה: פקקים מעצבנים בדרך לעבודה.</p>
                <p className="text-lg">הפתרון: אפליקציה שמשתמשת במידע מכל הנהגים כדי למצוא את הדרך המהירה ביותר בזמן אמת.</p>
            </div>
            <div className="bg-white/60 p-6 rounded-xl">
                <p className="text-8xl mb-3">🍔</p>
                <h4 className="font-bold text-2xl">Wolt</h4>
                <p className="font-semibold text-brand-light-blue text-lg">הבעיה: רוצים אוכל ממסעדה, אבל אין כוח לצאת מהבית.</p>
                <p className="text-lg">הפתרון: אפליקציה שמחברת בין לקוחות, מסעדות ושליחים, ומביאה את האוכל עד הדלת.</p>
            </div>
        </div>
    </div>
);

// Step 2: Problem Identifier
const ProblemSolverStep = () => {
    const problems = [
        { problem: 'משעמם לי אחרי בית ספר', solution: 'חוג יצירה או ספורט' },
        { problem: 'הכלב צריך לצאת אבל יורד גשם', solution: 'שירות "דוגיסיטר" שמגיע עד הבית' },
        { problem: 'קשה למצוא מתנה מקורית לחבר', solution: 'חנות און-ליין למתנות מותאמות אישית' },
        { problem: 'הצמחים בחדר תמיד מתים', solution: 'ערכה להשקיה אוטומטית' },
    ];
    const [flipped, setFlipped] = useState<number | null>(null);

    return (
        <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-3xl font-bold text-center mb-4">כל עסק פותר בעיה</h3>
            <p className="text-xl text-center mb-6">לחצו על פתק כדי להפוך אותו ולראות דוגמה לפתרון עסקי.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {problems.map((p, index) => (
                    <div key={index} onClick={() => setFlipped(flipped === index ? null : index)} className="h-48 cursor-pointer group" style={{ perspective: '1000px' }}>
                        <div className={`relative w-full h-full transition-transform duration-700 ${flipped === index ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
                            <div className="absolute w-full h-full bg-yellow-200 p-4 rounded-lg flex items-center justify-center text-center font-bold text-2xl" style={{ backfaceVisibility: 'hidden' }}>{p.problem}</div>
                            <div className="absolute w-full h-full bg-green-200 p-4 rounded-lg flex items-center justify-center text-center font-bold text-green-800 text-2xl" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>💡 {p.solution}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Step 3: Idea Generator and Business Plan
const IdeaGeneratorStep = ({ onPlanComplete }: { onPlanComplete: () => void }) => {
    const audiences = ['בני נוער', 'בעלי כלבים', 'גיימרים', 'הורים לילדים קטנים', 'מבוגרים'];
    const topics = ['אופנה', 'אוכל בריא', 'טכנולוגיה', 'ספורט', 'מחזור'];
    const [generatedAudience, setGeneratedAudience] = useState('');
    const [generatedTopic, setGeneratedTopic] = useState('');
    const [plan, setPlan] = useState({ name: '', problem: '', solution: '', audience: '', revenue: '' });
    const [isGenerated, setIsGenerated] = useState(false);

    const generateIdea = () => {
        setGeneratedAudience(audiences[Math.floor(Math.random() * audiences.length)]);
        setGeneratedTopic(topics[Math.floor(Math.random() * topics.length)]);
        setIsGenerated(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPlan({ ...plan, [e.target.name]: e.target.value });
    };

    // FIX: Add a type check to ensure 'field' is a string before calling .trim()
    const isPlanComplete = Object.values(plan).every(field => typeof field === 'string' && field.trim() !== '');
    
    useEffect(() => {
        if(isPlanComplete) {
            onPlanComplete();
        }
    }, [isPlanComplete, onPlanComplete]);

    return (
        <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-3xl font-bold text-center mb-4">מכונת הרעיונות!</h3>
            <p className="text-center mb-6 text-lg">לחצו על הכפתור כדי לקבל השראה לרעיון עסקי, ואז מלאו תוכנית עסקית פשוטה.</p>
            <div className="text-center mb-8">
                <button onClick={generateIdea} className="p-4 bg-brand-magenta text-white font-bold rounded-lg text-xl">הפעל את המכונה!</button>
                {isGenerated && <p className="mt-4 text-3xl font-bold animate-fade-in">הרעיון שלך: עסק עבור <span className="text-brand-light-blue">{generatedAudience}</span> שקשור ל<span className="text-brand-light-blue">{generatedTopic}</span></p>}
            </div>

            <h3 className="text-3xl font-bold text-center mb-4 pt-6 border-t-2 border-brand-teal/30">התוכנית העסקית שלי</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <input name="name" value={plan.name} onChange={handleInputChange} placeholder="שם העסק" className="w-full p-3 rounded-lg"/>
                <input name="audience" value={plan.audience} onChange={handleInputChange} placeholder="קהל היעד" className="w-full p-3 rounded-lg"/>
                <textarea name="problem" value={plan.problem} onChange={handleInputChange} placeholder="מה הבעיה שהעסק פותר?" className="w-full p-3 rounded-lg md:col-span-2" rows={2}></textarea>
                <textarea name="solution" value={plan.solution} onChange={handleInputChange} placeholder="מה הפתרון (המוצר/השירות)?" className="w-full p-3 rounded-lg md:col-span-2" rows={2}></textarea>
                <textarea name="revenue" value={plan.revenue} onChange={handleInputChange} placeholder="איך העסק ירוויח כסף?" className="w-full p-3 rounded-lg md:col-span-2" rows={2}></textarea>
            </div>
            {isPlanComplete && <p className="mt-4 text-center font-bold text-green-600 text-lg">כל הכבוד! השלמתם את התוכנית.</p>}
        </div>
    );
};

// Step 4: Summary
const SummaryStep: React.FC = () => (
    <div className="bg-white/40 p-8 rounded-2xl text-center animate-fade-in">
        <h3 className="text-3xl font-bold text-brand-teal mb-4">עבודה מעולה, יזמים צעירים!</h3>
        <p className="text-xl mb-6">עברתם את כל הדרך: זיהיתם בעיה, חשבתם על פתרון, ואפילו כתבתם תוכנית עסקית ראשונה. זכרו, כל מסע גדול מתחיל בצעד אחד קטן.</p>
        <p className="text-6xl">🚀</p>
        <p className="mt-4 text-2xl font-bold">הרעיון הבא שישנה את העולם יכול להיות שלכם!</p>
    </div>
);


const BuildBusinessModule: React.FC<BuildBusinessModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [planCompleted, setPlanCompleted] = useState(false);

    useEffect(() => {
        if (currentStep === steps.length - 1) {
            onComplete();
        }
    }, [currentStep, onComplete]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <InspirationStep />;
            case 1: return <ProblemSolverStep />;
            case 2: return <IdeaGeneratorStep onPlanComplete={() => setPlanCompleted(true)} />;
            case 3: return <SummaryStep />;
            default: return <InspirationStep />;
        }
    };

    return (
        <ModuleView title={title} onBack={onBack}>
             <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
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
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
                <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length - 1 || (currentStep === 2 && !planCompleted)} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">
                    { (currentStep === 2 && !planCompleted) ? 'השלימו את התוכנית' : 'הבא' }
                </button>
            </div>
        </ModuleView>
    );
};

export default BuildBusinessModule;