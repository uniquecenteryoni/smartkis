import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface SmartConsumerismModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ["עולם הצרכנות", "זהו את הטריק!", "אתגר השוואת המחירים", "דעו את זכויותיכם", "משחק זיכרון"];

// --- Helper Icons ---
const CheckIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>);
const CrossIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);


// --- Step 1: Introduction ---
const IntroductionStep: React.FC = () => (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
        <h3 className="text-4xl font-bold text-brand-teal mb-4">ברוכים הבאים לעולם הצרכנות!</h3>
        <p className="text-2xl text-brand-dark-blue/90 mb-6">
            כולנו צרכנים - אנחנו קונים אוכל, בגדים, משחקים ועוד. אבל האם ידעתם שחנויות ופרסומות משתמשות בטריקים פסיכולוגיים כדי לגרום לנו לקנות יותר ממה שתכננו?
        </p>
        <div className="flex justify-center items-center gap-4 text-6xl">
            <span>🛒</span>
            <span className="text-4xl text-brand-magenta font-bold animate-pulse">→</span>
            <span>💰</span>
            <span className="text-4xl text-brand-magenta font-bold animate-pulse">→</span>
            <span>😄</span>
        </div>
        <p className="mt-6 text-2xl font-semibold">במודול הזה נלמד להיות צרכנים חכמים, לזהות את הטריקים, ולקנות רק את מה שאנחנו באמת צריכים ורוצים!</p>
    </div>
);


// --- Step 2: Spot the Trick Game (New Version) ---
const SpotTheTrickGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const tricksQuiz = [
        {
            icon: '🛒',
            question: 'למה עגלות הקניות בסופר כל כך גדולות?',
            options: [
                'כדי שיהיה מקום לילדים לשבת.',
                'כדי לגרום לנו להרגיש שלא קנינו הרבה, ולמלא אותן יותר.',
                'כי זה הגודל הסטנדרטי בכל העולם.',
            ],
            answer: 'כדי לגרום לנו להרגיש שלא קנינו הרבה, ולמלא אותן יותר.',
        },
        {
            icon: '👀',
            question: 'למה המוצרים היקרים והמותגים המוכרים נמצאים בגובה העיניים?',
            options: [
                'כי הם המוצרים הכי פופולריים.',
                'כדי שיהיה לנו קל לראות ולקחת אותם בלי להתאמץ.',
                'כי המוצרים הזולים כבדים יותר ושמים אותם למטה.',
            ],
            answer: 'כדי שיהיה לנו קל לראות ולקחת אותם בלי להתאמץ.',
        },
        {
            icon: '💸',
            question: 'למה מחירים רבים מסתיימים ב-99 אגורות (למשל, 9.99 ₪)?',
            options: [
                'כי זה מספר שמביא מזל.',
                'כדי לחסוך בעודף.',
                'כדי שהמחיר ייראה נמוך משמעותית מהמספר העגול הבא (10 ₪).',
            ],
            answer: 'כדי שהמחיר ייראה נמוך משמעותית מהמספר העגול הבא (10 ₪).',
        },
        {
            icon: '🍬',
            question: 'למה יש כל כך הרבה ממתקים וחטיפים ליד הקופות?',
            options: [
                'כי זה המקום האחרון שנשאר פנוי בסופר.',
                'כדי לפתות אותנו לקנות אותם באופן אימפולסיבי בזמן שאנחנו מחכים בתור.',
                'כדי שלקופאי/ת יהיה משהו לנשנש.',
            ],
            answer: 'כדי לפתות אותנו לקנות אותם באופן אימפולסיבי בזמן שאנחנו מחכים בתור.',
        },
        {
            icon: '💰',
            question: 'למה מוצרי יסוד כמו חלב וביצים נמצאים בדרך כלל בסוף הסופר?',
            options: [
                'כי שם המקררים הכי חזקים.',
                'כדי לחסוך מקום בקדמת החנות.',
                'כדי לגרום לנו לעבור דרך כל החנות, ולקנות עוד דברים בדרך.',
            ],
            answer: 'כדי לגרום לנו לעבור דרך כל החנות, ולקנות עוד דברים בדרך.',
        },
    ];

    const [gameState, setGameState] = useState<'intro' | 'quiz' | 'finished'>('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);
        if (answer === tricksQuiz[currentQuestion].answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < tricksQuiz.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setGameState('finished');
            onComplete(); // Mark step as complete
        }
    };
    
    const restartQuiz = () => {
        setGameState('quiz');
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
    }

    if (gameState === 'intro') {
        return (
            <div className="bg-white/40 p-8 rounded-2xl text-center">
                <h3 className="text-4xl font-bold text-brand-teal mb-4">שלב 2: זהו את הטריק!</h3>
                <p className="text-2xl mb-6">הסופרמרקט מלא בטריקים שנועדו לגרום לנו לבזבז יותר. צפו בסרטון של "כאן" כדי ללמוד לזהות אותם, ואז בחנו את עצמכם!</p>
                <a href="https://youtu.be/X285zJJjRyc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors mb-6">
                    <svg className="w-6 h-6 ml-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                    <span>צפייה בסרטון</span>
                </a>
                <button onClick={() => setGameState('quiz')} className="block mx-auto bg-brand-magenta text-white font-bold py-3 px-8 rounded-lg text-xl">אני מוכן/ה לחידון!</button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="text-center bg-white/60 p-8 rounded-2xl">
                <TrophyIcon className="w-20 h-20 mx-auto text-yellow-500" />
                <h3 className="text-4xl font-bold mt-4">סיימתם את החידון!</h3>
                <p className="text-3xl my-4">הציון שלכם: <span className="font-bold text-brand-light-blue">{score} / {tricksQuiz.length}</span></p>
                <p className="text-2xl">עכשיו אתם יודעים לזהות את הטריקים בסופר!</p>
                <button onClick={restartQuiz} className="mt-6 bg-brand-teal text-white font-bold py-2 px-6 rounded-lg text-xl">שחק שוב</button>
            </div>
        );
    }

    const q = tricksQuiz[currentQuestion];
    return (
        <div className="bg-white/50 p-6 rounded-2xl">
            <div className="text-center mb-6">
                <p className="text-6xl">{q.icon}</p>
                <h4 className="font-bold text-3xl mt-2">{q.question}</h4>
            </div>
            <div className="space-y-3">
                {q.options.map(opt => {
                    const isCorrect = opt === q.answer;
                    const isSelected = opt === selectedAnswer;
                    let buttonClass = 'bg-white/80 hover:bg-white';
                    if (selectedAnswer) {
                        if (isCorrect) buttonClass = 'bg-green-500 text-white';
                        else if (isSelected) buttonClass = 'bg-red-500 text-white';
                        else buttonClass = 'bg-white/50 opacity-60';
                    }
                    return (
                        <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selectedAnswer}
                            className={`flex justify-between items-center w-full text-right p-4 rounded-lg transition-all duration-300 text-xl ${buttonClass}`}>
                            <span>{opt}</span>
                            {selectedAnswer && isCorrect && <CheckIcon className="w-6 h-6 text-white"/>}
                            {selectedAnswer && isSelected && !isCorrect && <CrossIcon className="w-6 h-6 text-white"/>}
                        </button>
                    );
                })}
            </div>
            {selectedAnswer && (
                <button onClick={handleNext} className="mt-6 w-full bg-brand-light-blue text-white font-bold py-3 rounded-lg text-xl animate-pulse hover:animate-none">
                    {currentQuestion < tricksQuiz.length - 1 ? 'הטריק הבא' : 'סיים חידון'}
                </button>
            )}
        </div>
    );
};


// --- Step 3: Price Comparison Challenge ---
const PriceComparisonChallenge: React.FC = () => {
    const products = [
        { name: 'בקבוק קטן', size: 500, price: 8, icon: '🧃' },
        { name: 'בקבוק בינוני', size: 1000, price: 12, icon: '🥤' },
        { name: 'בקבוק גדול', size: 1500, price: 15, icon: '🍾' },
    ];
    const [guesses, setGuesses] = useState<{[key:string]: string}>({});
    const [submitted, setSubmitted] = useState(false);
    
    const correctAnswers = products.map(p => ({...p, per100ml: (p.price / (p.size / 100))}));
    const bestValue = correctAnswers.sort((a,b) => a.per100ml - b.per100ml)[0];

    const handleGuess = (name: string, value: string) => {
        setGuesses(prev => ({...prev, [name]: value}));
    }

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
            <h3 className="text-4xl font-bold text-brand-teal mb-2">אתגר השוואת המחירים</h3>
            <p className="text-2xl mb-6">אתם רוצים לקנות מיץ תפוזים. איזה בקבוק הכי משתלם? חשבו את המחיר ל-100 מ"ל עבור כל בקבוק.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(p => {
                    const isCorrect = submitted && parseFloat(guesses[p.name]) === parseFloat((p.price / (p.size / 100)).toFixed(2));
                    return (
                        <div key={p.name} className={`p-6 rounded-2xl border-2 ${submitted ? (isCorrect ? 'border-green-400 bg-green-100/50' : 'border-red-400 bg-red-100/50') : 'border-brand-light-blue bg-white/50'}`}>
                            <span className="text-6xl">{p.icon}</span>
                            <h4 className="font-bold text-3xl mt-2">{p.name}</h4>
                            <p className="text-xl">{p.size} מ"ל | {p.price} ₪</p>
                            <div className="mt-4">
                                <label className="font-semibold text-xl">מחיר ל-100 מ"ל:</label>
                                <div className="flex items-center justify-center gap-2">
                                    <input type="number" step="0.01" value={guesses[p.name] || ''} onChange={e => handleGuess(p.name, e.target.value)} disabled={submitted}
                                           className="w-24 p-2 rounded-lg border-2 border-gray-300 text-center text-lg" /> 
                                    <span>₪</span>
                                </div>
                                {submitted && <p className={`font-bold mt-1 text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>התשובה הנכונה: {(p.price / (p.size / 100)).toFixed(2)} ₪</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {!submitted ? (
                <button onClick={() => setSubmitted(true)} className="mt-8 bg-brand-magenta text-white font-bold py-3 px-8 rounded-lg text-xl">בדיקה</button>
            ) : (
                <div className="mt-8 p-4 bg-yellow-100/70 rounded-lg animate-fade-in">
                    <h4 className="font-bold text-2xl text-yellow-800">המסקנה:</h4>
                    <p className="text-2xl">הבקבוק ה<strong>{bestValue.name}</strong> הוא המשתלם ביותר! לא תמיד האריזה הגדולה ביותר היא הכי זולה. תמיד כדאי לבדוק את המחיר ליחידת מידה.</p>
                </div>
            )}
        </div>
    );
};


// --- Step 4: Know Your Rights ---
const KnowYourRightsStep: React.FC = () => {
    const rights = [
        { title: 'הצגת מחיר', text: 'החוק מחייב להציג מחיר על כל מוצר. אם המחיר בקופה שונה, אתם זכאים לשלם את המחיר הנמוך מביניהם.', icon: '🏷️' },
        { title: 'ביטול עסקה', text: 'קניתם משהו והתחרטתם? לרוב ניתן לבטל עסקה ולקבל החזר כספי תוך 14 יום, בתנאים מסוימים.', icon: '🔄' },
        { title: 'מוצר פגום', text: 'קניתם מוצר שהתקלקל או היה פגום? אתם זכאים לתיקון, החלפה או החזר כספי מהחנות.', icon: '🔧' },
    ];
    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-4xl font-bold text-brand-teal mb-6 text-center">צרכנים חכמים מכירים את הזכויות שלהם!</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rights.map(r => (
                    <div key={r.title} className="bg-white/60 p-6 rounded-xl border border-white/40 text-center">
                        <span className="text-5xl">{r.icon}</span>
                        <h4 className="text-3xl font-bold text-brand-light-blue mt-3 mb-2">{r.title}</h4>
                        <p className="text-brand-dark-blue/90 text-xl">{r.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Step 5: Memory Game ---
const MemoryGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const cardItems = [
        { name: 'חלב', icon: '🥛' }, { name: 'לחם', icon: '🍞' }, { name: 'ביצים', icon: '🥚' },
        { name: 'גבינה', icon: '🧀' }, { name: 'עגבניות', icon: '🍅' }, { name: 'שוקולד', icon: '🍫' },
        { name: 'שתיה', icon: '🥤' }, { name: 'עוגיות', icon: '🍪' },
    ];

    const generateShuffledCards = () => {
        return [...cardItems, ...cardItems]
            .map((item, index) => ({ ...item, id: index }))
            .sort(() => Math.random() - 0.5);
    };

    const [cards, setCards] = useState(generateShuffledCards);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedNames, setMatchedNames] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            setIsChecking(true);
            const [firstIndex, secondIndex] = flippedIndices;
            if (cards[firstIndex].name === cards[secondIndex].name) {
                setMatchedNames(prev => [...prev, cards[firstIndex].name]);
                setFlippedIndices([]);
                setIsChecking(false);
            } else {
                setTimeout(() => {
                    setFlippedIndices([]);
                    setIsChecking(false);
                }, 1200);
            }
        }
    }, [flippedIndices, cards]);
    
    useEffect(() => {
        if (matchedNames.length === cardItems.length) {
            onComplete();
        }
    }, [matchedNames, cardItems.length, onComplete]);

    const handleCardClick = (index: number) => {
        if (isChecking || flippedIndices.includes(index) || matchedNames.includes(cards[index].name)) {
            return;
        }
        setFlippedIndices(prev => [...prev, index]);
    };

    const handleRestart = () => {
        setCards(generateShuffledCards());
        setFlippedIndices([]);
        setMatchedNames([]);
        setIsChecking(false);
    }
    
    const isGameFinished = matchedNames.length === cardItems.length;

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
            <h3 className="text-4xl font-bold text-brand-teal mb-2">משחק זיכרון: מצאו את הזוגות!</h3>
            <p className="text-2xl mb-6">מצאו את כל זוגות המוצרים כדי להשלים את המודול.</p>

            {isGameFinished ? (
                 <div className="text-center p-6 bg-white/80 rounded-lg">
                    <TrophyIcon className="w-16 h-16 mx-auto text-yellow-500" />
                    <h3 className="text-4xl font-bold mt-2">כל הכבוד! מצאתם את כל הזוגות!</h3>
                    <p className="text-xl">השלמתם את המודול בהצלחה.</p>
                    <button onClick={handleRestart} className="mt-4 bg-brand-teal text-white font-bold py-2 px-4 rounded-lg text-lg">שחק שוב</button>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto" style={{ perspective: '1000px' }}>
                    {cards.map((card, index) => {
                        const isFlipped = flippedIndices.includes(index) || matchedNames.includes(card.name);
                        return (
                            <div key={card.id} onClick={() => handleCardClick(index)} 
                                className={`relative w-full aspect-square cursor-pointer transition-transform duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                                style={{ transformStyle: 'preserve-3d' }}>
                                {/* Card Front (Facedown) */}
                                <div className="absolute w-full h-full bg-brand-teal rounded-lg flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                                    <span className="text-white text-5xl font-bold">?</span>
                                </div>
                                {/* Card Back (Faceup) */}
                                <div className="absolute w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-2 border-2 border-brand-teal" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                                    <span className="text-4xl">{card.icon}</span>
                                    <span className="text-xs font-bold">{card.name}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const SmartConsumerismModule: React.FC<SmartConsumerismModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [trickGameCompleted, setTrickGameCompleted] = useState(false);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <IntroductionStep />;
            case 1: return <SpotTheTrickGame onComplete={() => setTrickGameCompleted(true)} />;
            case 2: return <PriceComparisonChallenge />;
            case 3: return <KnowYourRightsStep />;
            case 4: return <MemoryGame onComplete={onComplete} />;
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
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
                <button 
                    onClick={() => setCurrentStep(s => s + 1)} 
                    disabled={currentStep === steps.length - 1 || (currentStep === 1 && !trickGameCompleted)} 
                    className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title={currentStep === 1 && !trickGameCompleted ? 'עליך לסיים את החידון כדי להמשיך' : ''}
                >
                    {currentStep === 1 && !trickGameCompleted ? 'השלם את החידון' : 'הבא'}
                </button>
            </div>
        </ModuleView>
    );
};

export default SmartConsumerismModule;