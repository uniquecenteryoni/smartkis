import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface MonopoliesModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ["מהו מונופול?", "אתגר השוקו", "דוגמאות מהשוק", "מי השופט?", "חידון המונופולים"];

// --- Step 1: Introduction ---
const IntroductionStep: React.FC = () => (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
        <h3 className="text-4xl font-bold text-brand-teal mb-4">מהו מונופול?</h3>
        <p className="text-2xl text-brand-dark-blue/90 mb-8">
            דמיינו שוק. בשוק תחרותי יש הרבה מוכרים, והם מתחרים ביניהם על המחיר והאיכות כדי שתקנו מהם. אבל מה קורה כשיש רק מוכר אחד?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-100/60 p-6 rounded-xl border-2 border-green-300">
                <h4 className="font-bold text-3xl text-green-700 mb-3">✅ שוק תחרותי</h4>
                <div className="flex justify-around items-end text-5xl mb-3"><span>🏪</span><span>🏪</span><span>🏪</span></div>
                <p className="text-xl">הרבה מוכרים, מחירים נמוכים, איכות גבוהה, ומבחר גדול.</p>
            </div>
            <div className="bg-red-100/60 p-6 rounded-xl border-2 border-red-300">
                <h4 className="font-bold text-3xl text-red-700 mb-3">❌ שוק מונופוליסטי</h4>
                <div className="flex justify-around items-end text-7xl mb-3"><span>🏢</span></div>
                <p className="text-xl">מוכר אחד שולט, מחירים גבוהים, איכות נמוכה, ואין לכם ברירה אחרת.</p>
            </div>
        </div>
    </div>
);

// Step 2: Monopoly Game
const MonopolyGame: React.FC = () => {
    const [round, setRound] = useState(1);
    const [boughtItem, setBoughtItem] = useState<string | null>(null);
    const [takeover, setTakeover] = useState(false);

    const competitiveStores = [
        { name: 'שוקו-כיף', price: 6, logo: '🥛', quality: 'טעם מעולה!', color: 'bg-blue-400' },
        { name: 'שוקו-לנד', price: 5, logo: '🧃', quality: 'הכי זול!', color: 'bg-green-400' },
        { name: 'שוקו-פרימיום', price: 8, logo: '✨', quality: 'הכי איכותי!', color: 'bg-yellow-400' },
    ];
    const monopolyStore = { name: 'תאגיד השוקו הגדול', price: 10, logo: '👑', quality: 'טעם חדש (פחות שוקולד)', color: 'bg-red-500' };

    const handleBuy = (name: string) => {
        if (boughtItem) return;
        setBoughtItem(name);
    };

    const handleNextRound = () => {
        setTakeover(true);
        setTimeout(() => {
            setRound(2);
            setBoughtItem(null);
        }, 1500);
    };
    
    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">אתגר השוקו!</h3>
            {round === 1 && (
                 <>
                    <p className="text-2xl mb-6">סיבוב 1: שוק תחרותי. אתם רוצים לקנות שוקו. בחרו את האפשרות המועדפת עליכם.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {competitiveStores.map((store, i) => (
                            <div 
                                key={store.name} 
                                onClick={() => handleBuy(store.name)}
                                className={`p-6 rounded-2xl border-4 transition-all duration-300 transform ${boughtItem ? (boughtItem === store.name ? 'scale-110 shadow-2xl' : 'opacity-50 scale-90') : 'hover:scale-105 cursor-pointer'} ${store.color}`}
                                style={{transitionDelay: `${i * 100}ms`}}
                            >
                                <p className="text-6xl mb-2">{store.logo}</p>
                                <h4 className="font-bold text-3xl text-white">{store.name}</h4>
                                <p className="text-white font-semibold text-xl">{store.quality}</p>
                                <p className="text-5xl font-bold text-white mt-2">{store.price} ₪</p>
                            </div>
                        ))}
                    </div>
                    {boughtItem && <button onClick={handleNextRound} className="mt-8 bg-brand-magenta text-white font-bold p-3 rounded-lg animate-pulse">לסיבוב הבא</button>}
                </>
            )}
            {round === 2 && (
                <div className="relative">
                    <p className="text-2xl mb-6">סיבוב 2: השתלטות מונופוליסטית! "תאגיד השוקו הגדול" קנה את כל המתחרים.</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative h-64">
                        {competitiveStores.map((store, i) => (
                             <div key={store.name} className={`p-6 rounded-2xl border-4 ${store.color} absolute top-0 w-1/3 transition-all duration-1000 ${takeover ? 'left-1/3 top-1/2 opacity-0' : 'left-[calc(33.33%*'+i+')]'}`}>
                                <p className="text-6xl">{store.logo}</p>
                            </div>
                        ))}
                    </div>
                    <div className={`p-6 rounded-2xl border-4 ${monopolyStore.color} max-w-sm mx-auto ${takeover ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '1s'}}>
                        <p className="text-6xl mb-2">{monopolyStore.logo}</p>
                        <h4 className="font-bold text-3xl text-white">{monopolyStore.name}</h4>
                        <p className="text-white font-semibold text-xl">{monopolyStore.quality}</p>
                        <p className="text-5xl font-bold text-white mt-2">{monopolyStore.price} ₪</p>
                    </div>
                    <p className="text-3xl font-bold mt-6">עכשיו יש רק אפשרות אחת. המחיר עלה והאיכות ירדה. זוהי המשמעות של מונופול!</p>
                </div>
            )}
        </div>
    );
};

// Step 3: Real World Examples
const ExamplesStep: React.FC = () => {
     const examples = [
        { name: 'חברת החשמל', logo: '⚡', desc: 'החברה היחידה שמספקת חשמל לרוב הבתים בישראל.' },
        { name: 'אסם', logo: '🥨', desc: 'שולטת בחלק גדול מאוד משוק החטיפים (למשל, במבה) והפסטה.' },
        { name: 'תנובה', logo: '🐄', desc: 'בעלת נתח שוק עצום במוצרי חלב רבים, כמו גבינה קוטג\'.' },
    ];
    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-4xl font-bold text-brand-teal mb-6 text-center">מונופולים וריכוזיות בשוק הישראלי</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {examples.map(ex => (
                    <div key={ex.name} className="bg-white/50 p-6 rounded-xl border text-center">
                        <p className="text-6xl mb-3">{ex.logo}</p>
                        <h4 className="text-3xl font-bold text-brand-light-blue">{ex.name}</h4>
                        <p className="mt-2 text-brand-dark-blue/90 text-xl">{ex.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Step 4: Competition Authority
const AuthorityStep: React.FC = () => (
     <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
        <h3 className="text-4xl font-bold text-brand-teal mb-4">אז מי שומר עלינו?</h3>
         <p className="text-6xl mb-4">👮‍♀️</p>
        <h4 className="text-3xl font-bold text-brand-light-blue mb-3">רשות התחרות</h4>
        <p className="text-2xl max-w-2xl mx-auto text-brand-dark-blue/90">
           בישראל קיים גוף ממשלתי שנקרא "רשות התחרות". תפקידה הוא להיות ה"שופט" של השוק. היא מפקחת על חברות גדולות, מונעת מהן להפוך למונופולים שפוגעים בצרכנים, ובודקת שחברות לא מתאמות מחירים ביניהן. המטרה שלה היא לשמור על תחרות הוגנת לטובת כולנו.
        </p>
    </div>
);

// Step 5: "Millionaire" Quiz Game
const MillionaireQuiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const questions = [
        { product: 'במבה', productImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Bamba-2020-new.jpg/440px-Bamba-2020-new.jpg', options: ['אסם', 'תנובה', 'שטראוס', 'החברה המרכזית למשקאות'], correctAnswer: 'אסם' },
        { product: 'קוטג\'', productImage: 'https://upload.wikimedia.org/wikipedia/he/thumb/e/e6/Tnuva_Cottage_2020.jpg/500px-Tnuva_Cottage_2020.jpg', options: ['טרה', 'שטראוס', 'תנובה', 'גד'], correctAnswer: 'תנובה' },
        { product: 'קטשופ', productImage: 'https://www.osem.co.il/tm-content/uploads/2021/11/7290000053912.jpg', options: ['היינץ', 'אסם', 'ויליפוד', 'יכין'], correctAnswer: 'אסם' },
        { product: 'שוקולד פרה', productImage: 'https://upload.wikimedia.org/wikipedia/he/b/bd/Elite_Cow_Chocolate.jpg', options: ['שטראוס', 'כרמית', 'אסם', 'תנובה'], correctAnswer: 'שטראוס' },
        { product: 'קוקה קולה', productImage: 'https://m.pricez.co.il/ProductPictures/7290000189035.jpg', options: ['טמפו', 'יפאורה', 'החברה המרכזית למשקאות', 'אסם'], correctAnswer: 'החברה המרכזית למשקאות' },
        { product: 'פסטה פרפקטו', productImage: 'https://www.osem.co.il/tm-content/uploads/2021/11/7290000062754.jpg', options: ['ברילה', 'אסם', 'שופרסל', 'ויליפוד'], correctAnswer: 'אסם' },
        { product: 'מילקי', productImage: 'https://res.cloudinary.com/shufersal/image/upload/f_auto,q_auto/v1551801217/prod/product_images/products_zoom/YAK44_Z_P_7296007000105_1.png', options: ['תנובה', 'טרה', 'שטראוס', 'יופלה'], correctAnswer: 'שטראוס' },
        { product: 'מי עדן', productImage: 'https://res.cloudinary.com/shufersal/image/upload/f_auto,q_auto/v1551801217/prod/product_images/products_zoom/UQL20_Z_P_7290000114037_1.png', options: ['נביעות', 'החברה המרכזית למשקאות', 'טמפו', 'יפאורה'], correctAnswer: 'החברה המרכזית למשקאות' },
        { product: 'שמן זית יד מרדכי', productImage: 'https://res.cloudinary.com/shufersal/image/upload/f_auto,q_auto/v1551801217/prod/product_images/products_zoom/VEG54_Z_P_7290000130839_1.png', options: ['זיתא', 'עץ הזית', 'שטראוס', 'תנובה'], correctAnswer: 'שטראוס' },
        { product: 'גבינה לבנה', productImage: 'https://res.cloudinary.com/shufersal/image/upload/f_auto,q_auto/v1551801217/prod/product_images/products_zoom/AUK40_Z_P_7290000042022_1.png', options: ['שטראוס', 'גד', 'טרה', 'תנובה'], correctAnswer: 'תנובה' },
    ];
    const companyLogos: Record<string, string> = {
        'אסם': 'https://upload.wikimedia.org/wikipedia/he/thumb/1/13/Osem_Logo.svg/440px-Osem_Logo.svg.png',
        'תנובה': 'https://upload.wikimedia.org/wikipedia/he/thumb/9/91/Tnuva_logo_2017.svg/440px-Tnuva_logo_2017.svg.png',
        'שטראוס': 'https://upload.wikimedia.org/wikipedia/he/thumb/e/e2/Strauss_Group_logo.svg/440px-Strauss_Group_logo.svg.png',
        'החברה המרכזית למשקאות': 'https://upload.wikimedia.org/wikipedia/he/thumb/c/c3/Central_Bottling_Company_logo.svg/600px-Central_Bottling_Company_logo.svg.png',
        'טרה': 'https://upload.wikimedia.org/wikipedia/he/thumb/8/8c/Tara_logo.svg/440px-Tara_logo.svg.png',
        'גד': 'https://www.gad-dairy.co.il/wp-content/uploads/2021/08/logo.svg',
        'יפאורה': 'https://upload.wikimedia.org/wikipedia/he/thumb/e/e9/Yafura_tavori_logo.svg/440px-Yafura_tavori_logo.svg.png',
        'טמפו': 'https://upload.wikimedia.org/wikipedia/he/thumb/a/a2/Tempo_Beer_Industries_logo.svg/440px-Tempo_Beer_Industries_logo.svg.png',
        'היינץ': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Heinz_logo.svg/440px-Heinz_logo.svg.png',
        'ויליפוד': 'https://www.globes.co.il/news/article.aspx?did=1001323381#:~:text=images/NewGlobeLogo.png',
        'יכין': 'https://www.yachin.co.il/wp-content/themes/yachin/images/logo.png',
        'כרמית': 'https://www.carmit.co.il/wp-content/uploads/2020/09/logo.png',
        'ברילה': 'https://www.barilla.com/-/media/images/se/logo/barilla-logo.png',
        'שופרסל': 'https://upload.wikimedia.org/wikipedia/he/thumb/9/95/Shufersal_logo_2017.svg/440px-Shufersal_logo_2017.svg.png',
        'יופלה': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Yoplait_logo.svg/440px-Yoplait_logo.svg.png',
        'נביעות': 'https://upload.wikimedia.org/wikipedia/he/a/ab/Neviot_Logo_2021.svg',
        'זיתא': 'https://www.zeta.co.il/wp-content/uploads/2020/07/logo.png',
        'עץ הזית': 'https://www.etz-hayit.co.il/wp-content/themes/etz-hayit/img/logo.png'

    };

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [answerState, setAnswerState] = useState<'pending' | 'correct' | 'incorrect' | null>(null);
    const [finished, setFinished] = useState(false);
    
    useEffect(() => {
        if (finished && (score / questions.length) >= 0.8) {
            onComplete();
        }
    }, [finished, score, onComplete, questions.length]);

    const handleSelect = (option: string) => {
        if (selected) return;
        setSelected(option);
        setAnswerState('pending');

        setTimeout(() => {
            if (option === questions[current].correctAnswer) {
                setScore(s => s + 1);
                setAnswerState('correct');
            } else {
                setAnswerState('incorrect');
            }
        }, 2000);
    };

    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
            setSelected(null);
            setAnswerState(null);
        } else {
            setFinished(true);
        }
    };

    if (finished) {
        return (
            <div className="text-center p-6 bg-white/80 rounded-lg">
                <TrophyIcon className="w-16 h-16 mx-auto text-yellow-500" />
                <h3 className="text-4xl font-bold mt-2">סיימתם את החידון!</h3>
                <p className="text-3xl my-2">הציון שלך: <span className="font-bold">{score} / {questions.length}</span></p>
                {(score / questions.length) >= 0.8 ?
                    <p className="text-green-600 font-bold text-2xl">כל הכבוד! זיהיתם את המונופולים והשלמתם את המודול.</p> :
                    <p className="text-red-600 font-bold text-2xl">עבודה טובה! נסו שוב כדי להגיע ל-80% הצלחה.</p>
                }
            </div>
        )
    }
    
    const q = questions[current];
    const prizeLevels = [1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000].reverse();

    return (
        <div className="bg-brand-dark-blue p-4 sm:p-6 rounded-2xl animate-fade-in text-white shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="bg-white/10 p-6 rounded-xl border-2 border-brand-light-blue text-center">
                        <p className="font-bold text-4xl mb-4">מי שולט במוצר: {q.product}?</p>
                        <img src={q.productImage} alt={q.product} className="h-48 mx-auto object-contain rounded-lg"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {q.options.map((opt) => {
                            const isSelected = selected === opt;
                            const isCorrect = answerState && q.correctAnswer === opt;
                            let stateClass = '';
                            if (answerState === 'pending' && isSelected) stateClass = 'bg-yellow-500 animate-pulse';
                            else if (answerState === 'correct' && isCorrect) stateClass = 'bg-green-500';
                            else if (answerState === 'incorrect' && isSelected) stateClass = 'bg-red-500';
                            else if (answerState === 'incorrect' && isCorrect) stateClass = 'bg-green-500';

                            return (
                                <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                                    className={`flex items-center justify-center p-3 rounded-lg border-2 border-brand-light-blue transition-all duration-300 min-h-[80px]
                                    ${stateClass || 'bg-brand-dark-blue hover:bg-brand-light-blue/20'}`}
                                >
                                    <img src={companyLogos[opt] || 'https://via.placeholder.com/100x40?text='+opt} alt={opt} className="h-10 object-contain"/>
                                </button>
                            )
                        })}
                    </div>
                    {answerState && answerState !== 'pending' && (
                        <button onClick={handleNext} className="mt-6 w-full bg-brand-magenta font-bold p-3 rounded-lg text-xl">
                            {current === questions.length - 1 ? 'סיים משחק' : 'לשאלה הבאה'}
                        </button>
                    )}
                </div>
                <div className="lg:col-span-1 bg-white/10 p-4 rounded-xl flex flex-col-reverse">
                    {prizeLevels.map((level, index) => (
                        <div key={level} className={`p-2 my-1 rounded text-center font-bold text-lg sm:text-xl ${
                            score > (prizeLevels.length - 1 - index) ? 'bg-green-500 text-white' : 
                            current === (prizeLevels.length - 1 - index) ? 'bg-yellow-400 text-black' : 
                            'bg-brand-dark-blue'
                        }`}>
                           <span className="text-gray-400 mr-2">{prizeLevels.length - index}</span> {level.toLocaleString()} ₪
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main Component
const MonopoliesModule: React.FC<MonopoliesModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <IntroductionStep />;
            case 1: return <MonopolyGame />;
            case 2: return <ExamplesStep />;
            case 3: return <AuthorityStep />;
            case 4: return <MillionaireQuiz onComplete={onComplete} />;
            default: return <IntroductionStep />;
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
                <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length - 1} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">הבא</button>
            </div>
        </ModuleView>
    );
};

export default MonopoliesModule;