import React, { useState, useMemo, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrophyIcon } from '../icons/Icons';

// --- PROPS ---
interface OverdraftModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// --- ICONS ---
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const CheckIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const CrossIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;

const steps = [
    { title: "מהו מינוס?", icon: InfoIcon },
    { title: "אתגר הדמות", icon: UserIcon },
    { title: "כמה זה עולה?", icon: CalculatorIcon },
    { title: "בוחן סיום", icon: TrophyIcon },
];

// --- STEP 1: INTRODUCTION ---
const IntroductionStep: React.FC = () => (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
        <h3 className="text-5xl font-bold text-brand-magenta mb-4">מהו מינוס (אוברדראפט)?</h3>
        <p className="text-3xl text-brand-dark-blue/90 mb-6">
            דמיינו שהארנק שלכם הוא קופסה. כשאתם מקבלים כסף, אתם מכניסים אותו לקופסה. כשאתם קונים משהו, אתם מוציאים.
            <br/>
            <strong>מינוס הוא כמו חור בתחתית הקופסה.</strong> אתם יכולים להמשיך להוציא כסף גם כשהקופסה ריקה, אבל אתם בעצם לווים את הכסף מהבנק, והחור רק הולך וגדל...
        </p>
        <div className="flex justify-center items-center text-8xl gap-8 my-8">
            <span className="animate-bounce">💰</span>
            <span>➡️</span>
            <span className="text-red-500">🏦</span>
            <span>➡️</span>
            <span className="animate-pulse">💸</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-2xl">
            <div className="bg-green-100/60 p-4 rounded-xl border-l-4 border-green-500 text-right">
                <h4 className="font-bold text-3xl text-green-800">✅ יתרה חיובית (פלוס)</h4>
                <p>יש לכם כסף בחשבון. זה הכסף שלכם ואתם יכולים להשתמש בו.</p>
            </div>
             <div className="bg-red-100/60 p-4 rounded-xl border-l-4 border-red-500 text-right">
                <h4 className="font-bold text-3xl text-red-800">❌ יתרת חובה (מינוס)</h4>
                <p>אין לכם כסף בחשבון, והבנק "מלווה" לכם כסף. על ההלוואה הזו תשלמו <strong>ריבית גבוהה</strong>.</p>
            </div>
        </div>
    </div>
);

// --- STEP 2: CHARACTER CHALLENGE ---
interface Expense {
    name: string;
    cost: number;
    icon: string;
    category: 'vital' | 'important' | 'luxury';
}

const CharacterChallengeStep: React.FC = () => {
    // FIX: Add missing 'category' property to each expense object
    const initialExpenses: Expense[] = [
        { name: 'שכר דירה', cost: 2500, icon: '🏠', category: 'vital' },
        { name: 'חשבונות', cost: 400, icon: '💡', category: 'vital' },
        // Supermarket items
        { name: 'מוצרי יסוד', cost: 500, icon: '🍞', category: 'vital' },
        { name: 'ירקות ופירות', cost: 250, icon: '🥦', category: 'vital' },
        { name: 'מוצרי ניקיון', cost: 150, icon: '🧹', category: 'important' },
        { name: 'חטיפים ושתיה', cost: 200, icon: '🍫', category: 'luxury' },
        { name: 'מעדנים ופינוקים', cost: 100, icon: '🧀', category: 'luxury' },
        
        { name: 'תחבורה ציבורית', cost: 250, icon: '🚌', category: 'important' },
        { name: 'אינטרנט וסלולר', cost: 150, icon: '📱', category: 'important' },
        { name: 'חדר כושר', cost: 200, icon: '🏋️', category: 'luxury' },
        { name: 'מנויי סטרימינג', cost: 100, icon: '📺', category: 'luxury' },

        // Food delivery items
        { name: 'הזמנת פיצה', cost: 150, icon: '🍕', category: 'luxury' },
        { name: 'וולט לצהריים', cost: 200, icon: '🍜', category: 'luxury' },
        { name: 'סושי בסופ"ש', cost: 100, icon: '🍣', category: 'luxury' },

        { name: 'שופינג אונליין', cost: 350, icon: '🛍️', category: 'luxury' },
        { name: 'קפה ומאפה בחוץ', cost: 180, icon: '☕', category: 'luxury' },
    ];
    
    const INCOME = 5000;
    const totalExpenses = initialExpenses.reduce((sum, e) => sum + e.cost, 0);
    const initialBalance = INCOME - totalExpenses;

    const [removedExpenses, setRemovedExpenses] = useState<Expense[]>([]);
    
    const handleToggleExpense = (expense: Expense) => {
        setRemovedExpenses(prev => 
            prev.some(e => e.name === expense.name)
            ? prev.filter(e => e.name !== expense.name)
            : [...prev, expense]
        );
    };

    const currentExpenses = initialExpenses.filter(e => !removedExpenses.some(re => re.name === e.name));
    const currentTotal = currentExpenses.reduce((sum, e) => sum + e.cost, 0);
    const currentBalance = INCOME - currentTotal;
    
    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
             <h3 className="text-5xl font-bold text-brand-magenta mb-4 text-center">אתגר: להוציא את דני מהמינוס!</h3>
             <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6 bg-white/50 p-6 rounded-2xl shadow-inner">
                <div className="text-center">
                    <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1" alt="דני" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"/>
                    <h4 className="font-bold text-4xl mt-2">דני, בן 24</h4>
                </div>
                <div className="text-3xl">
                     <p className="text-brand-dark-blue/90">דני מרוויח <strong>{INCOME.toLocaleString()} ₪</strong> בחודש, אבל מוציא <strong>{totalExpenses.toLocaleString()} ₪</strong>. הוא במינוס של <strong>{initialBalance.toLocaleString()} ₪</strong> כל חודש!</p>
                     <p className="font-bold mt-2">המשימה שלכם: עזרו לדני להגיע למאזן חיובי על ידי ויתור על הוצאות.</p>
                </div>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-bold text-4xl mb-2 text-center">ההוצאות של דני</h4>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {initialExpenses.map(exp => {
                            const isRemoved = removedExpenses.some(re => re.name === exp.name);
                            return (
                                <button key={exp.name} onClick={() => handleToggleExpense(exp)} 
                                    className={`p-4 rounded-2xl text-center transition-all duration-300 transform shadow-lg relative ${isRemoved ? 'bg-gray-300 opacity-50 scale-95' : 'bg-white/80 hover:scale-105'}`}>
                                    <span className="text-6xl">{exp.icon}</span>
                                    <p className="font-bold text-2xl">{exp.name}</p>
                                    <p className="font-semibold text-xl">{exp.cost.toLocaleString()} ₪</p>
                                    {isRemoved && <div className="absolute inset-0 flex items-center justify-center text-white text-7xl bg-black/50 rounded-2xl"><CrossIcon/></div>}
                                </button>
                            );
                        })}
                     </div>
                 </div>
                 <div className="bg-white/60 p-6 rounded-2xl flex flex-col justify-center items-center shadow-lg">
                    <h4 className="font-bold text-4xl mb-2">התקציב החדש</h4>
                     <div className="space-y-2 text-4xl w-full">
                        <div className="flex justify-between"><span>הכנסה:</span><span className="font-bold text-green-600">{INCOME.toLocaleString()} ₪</span></div>
                        <div className="flex justify-between"><span>הוצאות:</span><span className="font-bold text-red-500">{currentTotal.toLocaleString()} ₪</span></div>
                    </div>
                     <div className={`mt-4 p-4 rounded-2xl w-full text-center ${currentBalance >= 0 ? 'bg-green-200/80' : 'bg-red-200/80'}`}>
                        <p className="font-bold text-4xl">מאזן חודשי:</p>
                        <p className={`text-8xl font-black ${currentBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>{currentBalance.toLocaleString()} ₪</p>
                    </div>
                 </div>
             </div>
        </div>
    );
};


// --- STEP 3: SIMULATOR ---
const OverdraftSimulator: React.FC = () => {
    const [balance, setBalance] = useState(-2000);
    const [interest, setInterest] = useState(12);
    const [months, setMonths] = useState(24);
    const [monthlyChange, setMonthlyChange] = useState(-100); // Monthly deficit

    const { data, totalInterestPaid } = useMemo(() => {
        const results = [];
        let currentBalance = balance;
        let totalInterest = 0;

        for (let i = 0; i <= months; i++) {
            results.push({ 
                month: `חודש ${i}`, 
                'גובה החוב': currentBalance < 0 ? -currentBalance : 0, 
                'יתרה חיובית': currentBalance >= 0 ? currentBalance : 0 
            });
            
            if (currentBalance < 0) {
                const interestForMonth = -currentBalance * (interest / 100) / 12;
                totalInterest += interestForMonth;
                currentBalance -= interestForMonth; // Interest increases the debt (makes balance more negative)
            }
            currentBalance += monthlyChange;
        }
        return { data: results, totalInterestPaid: totalInterest };
    }, [balance, interest, months, monthlyChange]);

    const finalBalance = data[data.length - 1]['יתרה חיובית'] - data[data.length - 1]['גובה החוב'];
    const goalReachedMonth = data.findIndex(d => d['יתרה חיובית'] > 0);
    const years = (months / 12).toFixed(1);

    return (
        <div className="animate-fade-in text-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white/40 p-6 rounded-2xl">
                    <h3 className="text-4xl font-bold mb-4">סימולטור המינוס</h3>
                    <div className="space-y-4">
                        <div>
                            <label>סכום המינוס ההתחלתי (₪)</label>
                            <input type="number" value={balance} onChange={e => setBalance(Math.min(0, Number(e.target.value)))} className="w-full mt-1 p-2 rounded text-3xl" />
                        </div>
                        <div>
                            <label>ריבית שנתית על המינוס (%)</label>
                            <input type="number" value={interest} onChange={e => setInterest(Number(e.target.value))} className="w-full mt-1 p-2 rounded text-3xl" />
                        </div>
                         <div>
                            <label>גירעון/עודף חודשי (₪)</label>
                            <input type="range" min="-500" max="500" value={monthlyChange} onChange={e => setMonthlyChange(Number(e.target.value))} className="w-full mt-1" />
                            <div className={`text-center font-bold text-3xl ${monthlyChange < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                {monthlyChange > 0 ? `+${monthlyChange}` : monthlyChange} ₪
                            </div>
                        </div>
                        <div>
                            <label>מספר חודשים</label>
                            <input type="range" min="1" max="600" value={months} onChange={e => setMonths(Number(e.target.value))} className="w-full mt-1" />
                            <div className="text-center font-bold text-3xl">{months} חודשים</div>
                            <div className="text-center font-semibold text-xl text-gray-600">({years} שנים)</div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white/40 p-6 rounded-2xl">
                    <div className="text-center">
                        <p className="text-3xl">לאחר {months} חודשים, היתרה שלך תהיה:</p>
                        <p className={`text-6xl font-bold my-2 ${finalBalance < 0 ? 'text-brand-magenta' : 'text-green-600'}`}>{finalBalance.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</p>
                        {goalReachedMonth !== -1 && finalBalance > 0 && <p className="text-2xl">הצלחת לצאת מהמינוס בחודש ה-<strong>{goalReachedMonth}</strong>!</p>}
                    </div>
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()} ₪`} />
                                <Legend />
                                <Line type="monotone" dataKey="גובה החוב" stroke="#d52963" strokeWidth={3} />
                                <Line type="monotone" dataKey="יתרה חיובית" stroke="#10b981" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-red-100/70 rounded-lg text-center">
                        <p className="font-bold text-2xl text-red-800">סה"כ ריבית ששולמה לבנק בתקופה זו:</p>
                        <p className="font-bold text-4xl text-red-600">{totalInterestPaid.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</p>
                    </div>
                     <div className="mt-4 p-2 bg-yellow-100/70 rounded-md text-xl text-yellow-800">
                        <strong>איך זה מחושב?</strong> בכל חודש, הריבית מתווספת לחוב הקיים, ולאחר מכן הגירעון/עודף החודשי שלכם מתווסף ליתרה.
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- STEP 4: QUIZ ---
const QuizStep: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
    const questions = [
        { q: "מהי ההגדרה הנכונה ל'מינוס' (אוברדראפט)?", options: ["כסף שהבנק נותן במתנה", "הלוואה מהבנק בריבית גבוהה", "חיסכון עם ריבית טובה", "הפרש בין הכנסות להוצאות"], answer: "הלוואה מהבנק בריבית גבוהה" },
        { q: "מהי הדרך הטובה ביותר להימנע ממינוס?", options: ["לא להשתמש בכרטיס אשראי", "לעקוב אחר ההוצאות ולוודא שהן לא גבוהות מההכנסות", "לבקש העלאה מהבוס", "לקחת הלוואה"], answer: "לעקוב אחר ההוצאות ולוודא שהן לא גבוהות מההכנסות" },
        { q: "מה קורה לחוב במינוס אם לא עושים כלום?", options: ["הוא נמחק אחרי שנה", "הוא גדל בגלל הריבית", "הוא נשאר אותו הדבר", "הבנק מוותר עליו"], answer: "הוא גדל בגלל הריבית" },
        { q: "מה יכולה להיות אחת ההשלכות של הישארות במינוס לאורך זמן?", options: ["הבנק ייתן לך מתנות", "החוב שלך יקטן מעצמו", "הבנק עלול להגביל את מסגרת האשראי שלך", "תקבל ריבית חיובית על החוב"], answer: "הבנק עלול להגביל את מסגרת האשראי שלך" },
        { q: "מהי 'ריבית על המינוס'?", options: ["כסף שהבנק משלם לך", "קנס על הוצאת כסף", "המחיר שנשלם על ההלוואה מהבנק בעקבות גרעון שלילי", "סכום קבוע של 100 שקלים"], answer: "המחיר שנשלם על ההלוואה מהבנק בעקבות גרעון שלילי" },
    ];
    
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState('');
    const [finished, setFinished] = useState(false);

     useEffect(() => {
        if (finished) {
            if (score / questions.length >= 0.8) { 
                onComplete();
            }
        }
    }, [finished, score, onComplete, questions.length]);

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
            setFinished(true);
        }
    };
    
    if (finished) {
        const isCompleted = score >= 4;
        return (
            <div className="text-center bg-white/60 p-6 rounded-lg">
                <TrophyIcon className="w-24 h-24 mx-auto text-yellow-500" />
                <h3 className="text-5xl font-bold mt-2">סיימת את הבוחן!</h3>
                <p className="text-4xl my-2">הציון שלך: <span className="font-bold">{score} / {questions.length}</span></p>
                {isCompleted ? <p className="text-green-600 font-bold text-3xl">מעולה! השלמת את המודול!</p> : <p className="text-red-600 font-bold text-3xl">נסה שוב כדי להגיע ל-80%.</p>}
            </div>
        );
    }

    return (
        <div className="bg-white/50 p-6 rounded-lg">
             <div className="mb-4">
                <div className="bg-gray-300 rounded-full h-2.5">
                    <div className="bg-brand-teal h-2.5 rounded-full" style={{ width: `${((current + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>
            <div className="bg-brand-light-blue/20 p-6 rounded-xl mb-6 shadow-inner">
                <h3 className="font-bold text-4xl text-center text-brand-dark-blue">{questions[current].q}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[current].options.map((opt, index) => {
                     const isCorrect = opt === questions[current].answer;
                     const isSelected = opt === selected;
                     let buttonClass = 'bg-white/80 hover:bg-white';
                     if(selected) {
                         if(isCorrect) buttonClass = 'bg-green-500 text-white';
                         else if (isSelected) buttonClass = 'bg-red-500 text-white';
                         else buttonClass = 'bg-white/40 opacity-60';
                     }
                    return (
                         <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                            className={`flex items-center text-right p-4 rounded-lg transition-colors text-2xl h-full ${buttonClass}`}>
                            <span className="font-bold text-brand-dark-blue/50 ml-3">{index + 1}.</span>
                            <span className="flex-1">{opt}</span>
                            {selected && isCorrect && <CheckIcon />}
                            {selected && isSelected && !isCorrect && <CrossIcon />}
                        </button>
                    );
                })}
            </div>
            {selected && <button onClick={handleNext} className="mt-4 w-full bg-brand-light-blue text-white p-3 rounded-lg text-2xl">הבא</button>}
        </div>
    );
};


// --- MAIN COMPONENT ---
const OverdraftModule: React.FC<OverdraftModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <IntroductionStep />;
            case 1: return <CharacterChallengeStep />;
            case 2: return <OverdraftSimulator />;
            case 3: return <QuizStep onComplete={onComplete} />;
            default: return <IntroductionStep />;
        }
    };

    return (
        <ModuleView title="הסכנה שבמינוס" onBack={onBack}>
            <div className="mb-8">
                <div className="flex justify-between items-start mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                 <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
                                    <step.icon />
                                </div>
                                <p className={`mt-2 text-xl text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step.title}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mt-8 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {renderStepContent()}

            <div className="flex justify-between mt-8 text-2xl">
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-8 rounded-lg disabled:opacity-50">הקודם</button>
                <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length - 1} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50">הבא</button>
            </div>
        </ModuleView>
    );
};

export default OverdraftModule;