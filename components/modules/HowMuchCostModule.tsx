import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface HowMuchCostModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

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

const steps = ["יוצאים לקניות!", "האתגר בסופרמרקט", "הגיע הזמן לשלם", "מה למדנו?", 'מודל החצ"ר', "בוחן ידע"];

type ItemType = 'צריך' | 'רוצה';
interface Item {
    id: number;
    name: string;
    price: number;
    icon: string;
    type: ItemType;
}

const allItems: Item[] = [
    { id: 1, name: 'חלב', price: 7, icon: '🥛', type: 'צריך' },
    { id: 2, name: 'לחם', price: 8, icon: '🍞', type: 'צריך' },
    { id: 3, name: 'ביצים', price: 13, icon: '🥚', type: 'צריך' },
    { id: 4, name: 'גבינה', price: 15, icon: '🧀', type: 'צריך' },
    { id: 5, name: 'תפוח', price: 2, icon: '🍎', type: 'צריך' },
    { id: 6, name: 'חטיף שוקולד', price: 6, icon: '🍫', type: 'רוצה' },
    { id: 7, name: 'שתיה מוגזת', price: 7, icon: '🥤', type: 'רוצה' },
    { id: 8, name: 'מסטיקים', price: 4, icon: '🍬', type: 'רוצה' },
    { id: 9, name: 'עוגיות', price: 12, icon: '🍪', type: 'רוצה' },
    { id: 10, name: 'גלידה', price: 25, icon: '🍦', type: 'רוצה' },
    { id: 11, name: 'מלפפונים', price: 4, icon: '🥒', type: 'צריך' },
    { id: 12, name: 'עוף', price: 35, icon: '🍗', type: 'צריך' },
];

const shoppingList = ['חלב', 'לחם', 'ביצים', 'גבינה', 'תפוח'];
const BUDGET = 50;


// Step 1: Introduction
const IntroductionStep: React.FC = () => {
    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">יוצאים למשימת קניות!</h3>
            <p className="text-2xl text-brand-dark-blue/90 mb-6">
                קיבלתם תקציב מוגבל ורשימת קניות. המטרה שלכם היא לקנות את כל מה שברשימה מבלי לחרוג מהתקציב. היזהרו מפיתויים בדרך!
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="bg-green-100/70 p-6 rounded-2xl border-2 border-green-300">
                    <h4 className="text-3xl font-bold text-green-700">התקציב שלכם</h4>
                    <p className="text-7xl font-bold text-green-600 my-2">{BUDGET} ₪</p>
                </div>
                <div className="bg-yellow-100/70 p-6 rounded-2xl border-2 border-yellow-300">
                    <h4 className="text-3xl font-bold text-yellow-800">רשימת הקניות</h4>
                    <ul className="text-2xl mt-2 space-y-1">
                        {shoppingList.map(item => <li key={item} className="text-2xl">- {item}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Step 2: Shopping Game
const ShoppingChallenge: React.FC<{
    cart: Item[];
    setCart: React.Dispatch<React.SetStateAction<Item[]>>;
    budget: number;
    setBudget: React.Dispatch<React.SetStateAction<number>>;
}> = ({ cart, setCart, budget, setBudget }) => {
    const [specialOffer, setSpecialOffer] = useState<Item | null>(null);
    const [offerCountdown, setOfferCountdown] = useState(0);

    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

    useEffect(() => {
        const offerTimer = setInterval(() => {
            if (specialOffer) return;
            const wantItems = allItems.filter(i => i.type === 'רוצה' && !cart.some(c => c.id === i.id));
            if (wantItems.length > 0) {
                const randomOffer = wantItems[Math.floor(Math.random() * wantItems.length)];
                setSpecialOffer(randomOffer);
                setOfferCountdown(5);
            }
        }, 8000 + Math.random() * 4000); // Between 8-12 seconds
        return () => clearInterval(offerTimer);
    }, [cart, specialOffer]);

    useEffect(() => {
        if (offerCountdown > 0) {
            const countdownTimer = setTimeout(() => setOfferCountdown(c => c - 1), 1000);
            return () => clearTimeout(countdownTimer);
        } else if (specialOffer) {
            setSpecialOffer(null);
        }
    }, [offerCountdown, specialOffer]);

    const addToCart = (item: Item) => {
        if (budget - item.price >= 0) {
            setCart(prev => [...prev, item]);
            setBudget(prev => prev - item.price);
            if (specialOffer && specialOffer.id === item.id) {
                setSpecialOffer(null);
            }
        } else {
            alert("אין מספיק כסף בתקציב!");
        }
    };

    const removeFromCart = (itemToRemove: Item) => {
        setCart(prev => prev.filter(item => item.id !== itemToRemove.id));
        setBudget(prev => prev + itemToRemove.price);
    };

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-4 rounded-2xl animate-fade-in relative">
            <h3 className="text-4xl font-bold text-brand-teal mb-4 text-center">האתגר בסופרמרקט</h3>
            
            {specialOffer && (
                <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-20 rounded-2xl animate-fade-in">
                    <div className="bg-yellow-300 p-8 rounded-3xl text-center border-4 border-dashed border-red-500 shadow-2xl">
                        <h4 className="text-5xl font-bold text-red-600 animate-pulse">מבצע בזק!</h4>
                        <div className="my-4">
                            <span className="text-8xl">{specialOffer.icon}</span>
                            <p className="font-bold text-4xl">{specialOffer.name}</p>
                            <p className="text-3xl">{specialOffer.price} ₪</p>
                        </div>
                        <button onClick={() => addToCart(specialOffer)} className="bg-brand-magenta text-white font-bold p-3 rounded-lg text-xl">הוסף לעגלה!</button>
                        <p className="mt-4 text-2xl">ההצעה מסתיימת בעוד: <span className="font-bold text-3xl">{offerCountdown}</span></p>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column: List & Budget */}
                <div className="lg:col-span-1 bg-white/50 p-4 rounded-2xl space-y-4">
                    <div>
                        <h4 className="font-bold text-2xl">💰 התקציב שלך:</h4>
                        <p className={`font-bold text-5xl ${budget < 10 ? 'text-red-500' : 'text-green-600'}`}>{budget.toFixed(2)} ₪</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-2xl">📝 רשימת קניות:</h4>
                        <ul className="space-y-1 mt-2 text-xl">
                            {shoppingList.map(name => {
                                const inCart = cart.some(c => c.name === name);
                                return (
                                    <li key={name} className={`flex items-center gap-2 transition-colors ${inCart ? 'text-gray-400 line-through' : ''}`}>
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${inCart ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {inCart && <CheckIcon className="w-4 h-4 text-white"/>}
                                        </div>
                                        <span>{name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Center Column: Shelves */}
                <div className="lg:col-span-2 bg-blue-100/30 p-4 rounded-2xl">
                    <h4 className="font-bold text-2xl text-center mb-2">מדפי הסופר</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {allItems.filter(item => !cart.some(c => c.id === item.id)).map(item => (
                            <button key={item.id} onClick={() => addToCart(item)} className="text-center bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                                <span className="text-4xl">{item.icon}</span>
                                <p className="font-bold">{item.name}</p>
                                <p className="text-sm">{item.price} ₪</p>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Right Column: Cart */}
                <div className="lg:col-span-1 bg-white/50 p-4 rounded-2xl flex flex-col">
                    <h4 className="font-bold text-2xl mb-2">🛒 עגלת הקניות:</h4>
                    <div className="flex-grow space-y-2 overflow-y-auto">
                        {cart.length === 0 ? <p className="text-gray-500 text-lg">העגלה ריקה</p> :
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-white/70 p-2 rounded-md">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-lg">{item.name}</span>
                                </div>
                                <button onClick={() => removeFromCart(item)} className="text-red-500">✖</button>
                            </div>
                        ))}
                    </div>
                    <div className="border-t-2 pt-2 mt-2">
                        <p className="font-bold text-2xl">סה"כ: {cartTotal.toFixed(2)} ₪</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Step 3: Checkout
const CheckoutStep: React.FC<{ cart: Item[], budget: number }> = ({ cart, budget }) => {
    const listItemsInCart = cart.filter(item => shoppingList.includes(item.name));
    const allListItemsBought = shoppingList.every(itemName => cart.some(cartItem => cartItem.name === itemName));
    const needs = cart.filter(i => i.type === 'צריך');
    const wants = cart.filter(i => i.type === 'רוצה');
    const totalCost = cart.reduce((sum, i) => sum + i.price, 0);

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in flex justify-center">
            <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-lg font-mono text-xl" style={{border: '1px solid #ccc'}}>
                <h3 className="text-center font-sans font-bold text-4xl mb-4 border-b-2 border-dashed border-gray-400 pb-2">חשבונית</h3>
                <div className="space-y-1">
                    {needs.length > 0 && <p className="font-bold">--- צרכים ---</p>}
                    {needs.map(item => (
                         <div key={item.id} className="flex justify-between"><span>{item.name}</span><span>{item.price.toFixed(2)}</span></div>
                    ))}
                    {wants.length > 0 && <p className="font-bold mt-2">--- רצונות ---</p>}
                    {wants.map(item => (
                         <div key={item.id} className="flex justify-between"><span>{item.name}</span><span>{item.price.toFixed(2)}</span></div>
                    ))}
                </div>
                 <div className="border-t-2 border-dashed border-gray-400 mt-4 pt-2 space-y-2">
                    <div className="flex justify-between font-bold text-2xl"><span>סה"כ:</span><span>{totalCost.toFixed(2)} ₪</span></div>
                    <div className="flex justify-between text-2xl"><span>תקציב:</span><span>{BUDGET.toFixed(2)} ₪</span></div>
                    <div className="flex justify-between font-bold text-2xl"><span>עודף:</span><span>{budget.toFixed(2)} ₪</span></div>
                </div>
                 <div className="mt-6 font-sans text-center">
                    {allListItemsBought ? (
                        <div className="p-2 bg-green-200 text-green-800 rounded">
                            <h4 className="font-bold text-2xl">כל הכבוד! קניתם הכל מהרשימה!</h4>
                        </div>
                    ) : (
                        <div className="p-2 bg-yellow-200 text-yellow-800 rounded">
                            <h4 className="font-bold text-2xl">שימו לב!</h4>
                            <p className="text-xl">לא קניתם את כל הפריטים מהרשימה.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Step 4: Summary
const SummaryStep: React.FC = () => {
     const tips = [
        { title: 'הכינו רשימה', text: 'תכנון מראש עוזר לכם להישאר ממוקדים ולהימנע מקניות מיותרות.', icon: '📝' },
        { title: 'הבדילו בין צורך לרצון', text: 'שאלו את עצמכם "האם אני באמת צריך את זה?" לפני שאתם מכניסים משהו לעגלה.', icon: '🤔' },
        { title: 'היזהרו ממבצעים', text: 'מבצעים נראים מפתים, אבל הם נועדו לגרום לכם לקנות דברים שלא תכננתם.', icon: '💸' },
        { title: 'עקבו אחר התקציב', text: 'דעו תמיד כמה כסף נשאר לכם כדי לא להיכנס להוצאות בלתי צפויות.', icon: '📊' }
    ];

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-5xl font-bold text-brand-teal mb-6 text-center">מה למדנו על צרכנות נבונה?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tips.map(tip => (
                    <div key={tip.title} className="bg-white/60 p-6 rounded-xl border border-white/40 text-center">
                        <span className="text-5xl">{tip.icon}</span>
                        <h4 className="text-4xl font-bold text-brand-light-blue mt-3 mb-2">{tip.title}</h4>
                        <p className="text-brand-dark-blue/90 text-xl">{tip.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Step 5: Quiz
const QuizStep: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
    const questions = [
        { q: "מהי הדרך הטובה ביותר להימנע מקניות לא מתוכננות בסופר?", options: ["ללכת לקניות כשאתם רעבים", "להכין רשימת קניות מראש ולהיצמד אליה", "לקנות כל מה שנראה טעים", "להסתובב בכל המעברים"], answer: "להכין רשימת קניות מראש ולהיצמד אליה" },
        { q: "מהי המטרה העיקרית של 'מוצרי קופה' קטנים וזולים?", options: ["לעזור לכם לחסוך כסף", "לגרום לכם לקנות בדחף משהו שלא תכננתם", "לבדוק אם אתם ערניים", "אלה מתנות מהחנות"], answer: "לגרום לכם לקנות בדחף משהו שלא תכננתם" },
        { q: "מה ההבדל בין 'צורך' ל'רצון'?", options: ["אין הבדל, זה אותו דבר", "צורך הוא משהו חיוני (כמו לחם), רצון הוא מותרות (כמו גלידה)", "רצון הוא משהו זול, צורך הוא משהו יקר", "צרכים קונים במכולת, רצונות קונים בקניון"], answer: "צורך הוא משהו חיוני (כמו לחם), רצון הוא מותרות (כמו גלידה)" },
        { q: "אם מוצר עולה 10 ש\"ח, ויש עליו מבצע '2+1 מתנה', כמה עולה כל יחידה אם קונים את המבצע?", options: ["10 ש\"ח", "5 ש\"ח", "כ-6.67 ש\"ח", "3.33 ש\"ח"], answer: "כ-6.67 ש\"ח" },
    ];
    
    const [quizState, setQuizState] = useState<'not_started' | 'in_progress' | 'finished'>('not_started');
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState('');

    const handleSelect = (opt: string) => {
        if(selected) return;
        setSelected(opt);
        if(opt === questions[current].answer) {
            setScore(s => s + 1);
        }
    };
    
    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
            setSelected('');
        } else {
            setQuizState('finished');
        }
    };

    const restartQuiz = () => {
        setQuizState('in_progress');
        setCurrent(0);
        setScore(0);
        setSelected('');
    };
    
    useEffect(() => {
        if (quizState === 'finished') {
            if (score / questions.length >= 0.75) { // 80% is 3 out of 4
              onComplete();
            }
        }
    }, [quizState, score, onComplete, questions.length]);
    
    if (quizState === 'finished') {
        const isCompleted = score >= 3;
        const resultMessage = isCompleted
            ? "כל הכבוד! עמדתם ביעד והשלמתם את המודול!"
            : "עבודה טובה! נסו שוב כדי להגיע ל-80% הצלחה.";
        return (
             <div className="relative text-center p-6 bg-white/80 border-4 border-yellow-400 rounded-lg shadow-2xl">
                <TrophyIcon className="w-20 h-20 mx-auto text-yellow-500" />
                <h3 className="text-4xl font-bold mb-2 mt-4 text-brand-dark-blue">סיימת את הבוחן!</h3>
                <p className="text-2xl mb-4 text-brand-dark-blue/80">{resultMessage}</p>
                <div className="bg-brand-light-blue/20 p-3 rounded-lg my-4">
                    <p className="text-3xl">הציון שלך:</p>
                    <p className="text-5xl font-bold text-brand-light-blue">{score} / {questions.length}</p>
                </div>
                <button onClick={restartQuiz} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg text-xl">שחק/י שוב</button>
            </div>
        );
    }

    if (quizState === 'not_started') {
         return (
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg text-center">
                <h3 className="text-4xl font-bold mb-2">מוכנים? בחנו את עצמכם</h3>
                <p className="mb-6 text-xl">עליכם לענות נכון על 3 מתוך 4 שאלות כדי להשלים את המודול.</p>
                <button onClick={() => setQuizState('in_progress')} className="bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg text-xl">התחל בוחן</button>
            </div>
        );
    }

    const q = questions[current];
    return (
        <div className="bg-white/50 p-6 rounded-lg">
            <div className="mb-4">
                <div className="bg-gray-300 rounded-full h-2.5">
                    <div className="bg-brand-teal h-2.5 rounded-full" style={{ width: `${((current + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">{q.q}</h3>
            <div className="space-y-3">
                {q.options.map(opt => {
                     const isCorrect = opt === q.answer;
                     const isSelected = opt === selected;
                     let buttonClass = 'bg-white/60 hover:bg-white';
                     if(selected) {
                         if(isCorrect) buttonClass = 'bg-green-500 text-white';
                         else if (isSelected) buttonClass = 'bg-red-500 text-white';
                         else buttonClass = 'bg-gray-200/50 opacity-60';
                     }
                    return (
                        <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                            className={`flex justify-between items-center w-full text-right p-3 rounded-lg transition-colors text-xl ${buttonClass}`}>
                            <span>{opt}</span>
                            {selected && isCorrect && <CheckIcon />}
                            {selected && isSelected && !isCorrect && <CrossIcon />}
                        </button>
                    );
                })}
            </div>
            {selected && <button onClick={handleNext} className="mt-6 w-full bg-brand-light-blue text-white font-bold py-3 rounded-lg text-xl">
                {current === questions.length - 1 ? 'סיים בוחן' : 'השאלה הבאה'}
            </button>}
        </div>
    );
};


// ─── Step 5: Hatsar Model ────────────────────────────────────────────────────
type HatsarType = 'חייב' | 'צריך' | 'רוצה';
type HatsarAnswer = 'כן' | 'לא';
type HatsarStatus = 'buy' | 'wait';
interface HatsarState { type: HatsarType | ''; q1: HatsarAnswer | null; q2: HatsarAnswer | null; }
interface HatsarResult { status: HatsarStatus; priority: string; text: string; }

const getHatsarResult = (data: HatsarState): HatsarResult | null => {
  const { type, q1, q2 } = data;
  if (!type || !q1 || !q2) return null;
  if (type === 'חייב') {
    const priority = 'עדיפות 1: הכרח';
    if (q1 === 'כן' && q2 === 'לא') return { status: 'buy', priority, text: 'אתה חייב את זה עכשיו ואין מחיר טוב יותר כרגע — זו קנייה נבונה.' };
    if (q1 === 'כן' && q2 === 'כן') return { status: 'wait', priority, text: 'אתה חייב את זה, אך המחיר גבוה. חפש מקום זול יותר לפני הרכישה.' };
    if (q1 === 'לא' && q2 === 'כן') return { status: 'wait', priority, text: 'לא חייב עכשיו וגם המחיר גבוה — כדאי להמתין.' };
    return { status: 'wait', priority, text: 'המחיר טוב, אך אינך חייב את זה כרגע — עדיף לחסוך למה שאתה חייב קודם.' };
  }
  if (type === 'צריך') {
    const priority = 'עדיפות 2: צורך';
    if (q1 === 'כן' && q2 === 'כן') return { status: 'buy', priority, text: 'אתה צריך ויכול להרשות לעצמך. שים לב: אם יש "חייב" שטרם קנית — הוא קודם.' };
    if (q1 === 'כן' && q2 === 'לא') return { status: 'wait', priority, text: 'אתה צריך, אך התקציב לא מאפשר זאת בצורה בטוחה כרגע.' };
    if (q1 === 'לא' && q2 === 'כן') return { status: 'wait', priority, text: 'אתה יכול להרשות לעצמך אך לא באמת צריך כרגע — עלול לפגוע בעתיד.' };
    return { status: 'wait', priority, text: 'לא צריך ולא יכול להרשות לעצמך — אין סיבה כלכלית לבצע את הרכישה.' };
  }
  const priority = 'עדיפות 3: רצון';
  if (q1 === 'כן' && q2 === 'כן') return { status: 'buy', priority, text: 'אתה רוצה ויכול להרשות לעצמך. מותר להתפנק — רק ודא שאין "חייב" או "צריך" לפניך.' };
  if (q1 === 'כן' && q2 === 'לא') return { status: 'wait', priority, text: 'רצון שאינו תואם את היכולת הכלכלית כרגע — כדאי לחסוך עבורו בנפרד.' };
  if (q1 === 'לא' && q2 === 'כן') return { status: 'wait', priority, text: 'יכול להרשות לעצמך, אך לא באמת רוצה מספיק — חבל לבזבז כסף על רגש חולף.' };
  return { status: 'wait', priority, text: 'לא רוצה ולא יכול להרשות לעצמך — זהו בזבוז מוחלט.' };
};

export const HatsarStep: React.FC = () => {
  const [phase, setPhase] = React.useState<0 | 2 | 3 | 4>(0);
  const [data, setData] = React.useState<HatsarState>({ type: '', q1: null, q2: null });

  const restart = () => { setData({ type: '', q1: null, q2: null }); setPhase(0); };

  const q1Text = data.type === 'חייב' ? 'האם אתה חייב את זה עכשיו?' : data.type === 'צריך' ? 'האם אתה באמת צריך את זה?' : 'האם אתה באמת רוצה את זה?';
  const q2Text = data.type === 'חייב' ? 'האם ניתן להשיג במחיר טוב יותר?' : 'האם אתה יכול להרשות לעצמך כרגע?';
  const result = getHatsarResult(data);

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in" dir="rtl">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🧠💸</div>
        <h3 className="text-3xl font-bold text-brand-dark-blue mb-2">מחשבון מודל החצ״ר</h3>
        <p className="text-lg text-brand-dark-blue/75">
          לפני כל קנייה — עוצרים ושואלים: האם זה <strong>חייב</strong>, <strong>צריך</strong> או <strong>רוצה</strong>?
        </p>
      </div>

      {phase === 0 && (
        <div className="text-center">
          <p className="text-xl font-semibold text-brand-dark-blue/80 mb-6">בחרו את הקטגוריה שמתאימה לפריט שאתם שוקלים לקנות:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            {(['חייב', 'צריך', 'רוצה'] as HatsarType[]).map((t, i) => {
              const colors = [
                'bg-brand-magenta hover:bg-pink-700',
                'bg-brand-teal hover:bg-teal-600',
                'bg-brand-light-blue hover:bg-cyan-600',
              ];
              return (
                <button key={t} onClick={() => { setData({ type: t, q1: null, q2: null }); setPhase(2); }}
                  className={`${colors[i]} text-white rounded-2xl py-5 text-2xl font-black transition-colors shadow-lg`}>
                  {t}
                </button>
              );
            })}
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-brand-dark-blue/70 max-w-xl mx-auto">
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="font-bold text-brand-magenta text-base mb-1">🔴 חייב — עדיפות 1</p>
              <p>הכרחי לקיום: שכר דירה, מזון, תרופות, חשמל.</p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <p className="font-bold text-brand-teal text-base mb-1">🟡 צריך — עדיפות 2</p>
              <p>חשוב אך לא דחוף: בגדים, כלי עבודה, שיפורים.</p>
            </div>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <p className="font-bold text-brand-light-blue text-base mb-1">🟢 רוצה — עדיפות 3</p>
              <p>גחמות ופינוקים: גאדג'טים, בילויים, מותרות.</p>
            </div>
          </div>
        </div>
      )}

      {(phase === 2 || phase === 3) && data.type && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setPhase(phase === 2 ? 0 : 2)}
              className="bg-brand-magenta/10 hover:bg-brand-magenta/20 text-brand-magenta font-bold px-4 py-2 rounded-xl transition-colors">
              ← חזרה
            </button>
            <span className="bg-brand-dark-blue text-white px-4 py-2 rounded-full font-bold">{data.type}</span>
          </div>
          <h4 className="text-2xl font-bold text-brand-dark-blue mb-8 text-center">
            {phase === 2 ? q1Text : q2Text}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (phase === 2) { setData(d => ({ ...d, q1: 'כן' })); setPhase(3); }
                else { setData(d => ({ ...d, q2: 'כן' })); setPhase(4); }
              }}
              className="bg-brand-dark-blue hover:opacity-90 text-white rounded-2xl py-5 text-2xl font-black transition-opacity">
              כן
            </button>
            <button
              onClick={() => {
                if (phase === 2) { setData(d => ({ ...d, q1: 'לא' })); setPhase(3); }
                else { setData(d => ({ ...d, q2: 'לא' })); setPhase(4); }
              }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl py-5 text-2xl font-black transition-colors">
              לא
            </button>
          </div>
        </div>
      )}

      {phase === 4 && result && (
        <div className="max-w-md mx-auto text-center">
          <div className="mb-3 inline-block px-4 py-1 rounded-full bg-brand-dark-blue/10 text-brand-dark-blue text-sm font-bold">{result.priority}</div>
          <div className={`mx-auto mb-5 w-24 h-24 rounded-3xl flex items-center justify-center text-5xl ${
            result.status === 'buy' ? 'bg-brand-teal/20 border-2 border-brand-teal' : 'bg-brand-magenta/20 border-2 border-brand-magenta'
          }`}>
            {result.status === 'buy' ? '✅' : '🛑'}
          </div>
          <h4 className="text-3xl font-black mb-4 text-brand-dark-blue">
            {result.status === 'buy' ? 'קונים! ✓' : 'לא קונים!'}
          </h4>
          <p className="bg-white/80 border border-slate-100 p-5 rounded-2xl text-lg text-brand-dark-blue/90 font-semibold leading-relaxed mb-8">
            {result.text}
          </p>
          <button onClick={restart}
            className="bg-brand-dark-blue hover:opacity-90 text-white font-black text-lg px-8 py-3 rounded-full transition-opacity">
            🔄 בדיקה נוספת
          </button>
        </div>
      )}
    </div>
  );
};

// Main Module Component
const HowMuchCostModule: React.FC<HowMuchCostModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [cart, setCart] = useState<Item[]>([]);
    const [budget, setBudget] = useState(BUDGET);
    
    const restartModule = () => {
        setCurrentStep(0);
        setCart([]);
        setBudget(BUDGET);
    }
    
    const handleSetStep = (step: number) => {
         if (step < 2 && currentStep >= 2) {
             // If going back to the game or intro, reset the game state
             setCart([]);
             setBudget(BUDGET);
         }
        setCurrentStep(step);
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <IntroductionStep />;
            case 1: return <ShoppingChallenge cart={cart} setCart={setCart} budget={budget} setBudget={setBudget} />;
            case 2: return <CheckoutStep cart={cart} budget={budget} />;
            case 3: return <SummaryStep />;
            case 4: return <HatsarStep />;
            case 5: return <QuizStep onComplete={onComplete} />;
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

            <div className="flex justify-between items-center mt-8">
                <button onClick={() => handleSetStep(currentStep - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
                {currentStep === 2 && <button onClick={restartModule} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg">התחל מחדש</button>}
                <button onClick={() => handleSetStep(currentStep + 1)} disabled={currentStep === steps.length - 1} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">הבא</button>
            </div>
        </ModuleView>
    );
};

export default HowMuchCostModule;