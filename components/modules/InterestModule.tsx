import React, { useState, useMemo, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { stockData, StockData } from './investmentData';
import { TrophyIcon, BookOpenIcon } from '../icons/Icons';


interface InterestModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = [
  "מהי השקעה?",
  "סוגי השקעות",
  "כוחה של ריבית דריבית",
  "נסו בעצמכם!",
  "בוחן ידע"
];

// Custom Icons
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);


// --- Step 1: What is an Investment? ---
const WhatIsInvestment: React.FC = () => {
    const initialItems = useMemo(() => [
        { name: 'קניית מניית אפל', category: 'השקעה' },
        { name: 'ארוחה במסעדה יקרה', category: 'בזבוז' },
        { name: 'רכישת דירה להשכרה', category: 'השקעה' },
        { name: 'כרטיס לקולנוע', category: 'בזבוז' },
        { name: 'הפקדה לקרן פנסיה', category: 'השקעה' },
        { name: 'קניית בגד מותג חדש', category: 'בזבוז' },
    ].sort(() => Math.random() - 0.5), []);

    const [itemsToSort, setItemsToSort] = useState(initialItems.map(i => i.name));
    const [assignments, setAssignments] = useState<Record<string, { category: string; isCorrect: boolean }>>({});
    const [feedback, setFeedback] = useState('');

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemName: string) => {
        e.dataTransfer.setData('itemName', itemName);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCategory: string) => {
        e.preventDefault();
        const itemName = e.dataTransfer.getData('itemName');
        const item = initialItems.find(i => i.name === itemName);

        if (item && !assignments[item.name]) {
            const isCorrect = item.category === targetCategory;
            setAssignments(prev => ({ ...prev, [item.name]: { category: targetCategory, isCorrect } }));
            setItemsToSort(prev => prev.filter(i => i !== itemName));
            setFeedback(isCorrect ? 'נכון!' : 'לא בדיוק...');
            setTimeout(() => setFeedback(''), 1500);
        }
    };
    
    const investmentItems = (Object.entries(assignments) as [string, { category: string; isCorrect: boolean }][]).filter(([, val]) => val.category === 'השקעה');
    const spendingItems = (Object.entries(assignments) as [string, { category: string; isCorrect: boolean }][]).filter(([, val]) => val.category === 'בזבוז');
    
    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-5xl font-bold text-brand-teal mb-4 text-center">מהי השקעה ומהו בזבוז?</h3>
            <p className="text-3xl text-center text-brand-dark-blue/90 mb-6">
                <strong>השקעה</strong> היא שימוש בכסף כדי לקנות נכס שצפוי להגדיל את ערכו או לייצר הכנסה בעתיד (כמו מניה או דירה).
                <br />
                <strong>בזבוז</strong> הוא הוצאת כסף על מוצר או שירות שמספק הנאה רגעית אך לא מייצר ערך עתידי.
            </p>
            <div className="mt-4 mb-8 p-4 bg-yellow-100/60 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg text-2xl">
                <p className="font-bold">💡 הערה חשובה:</p>
                <p>לפעמים ההבחנה היא סובייקטיבית ("בעיני המתבונן"). למשל, קורס מקצועי יכול להיראות כהוצאה, אך אם הוא מוביל לעבודה טובה יותר - זוהי <strong>השקעה בעצמכם!</strong></p>
            </div>
            <p className="text-3xl font-bold text-center mb-8">גררו כל פריט לקטגוריה הנכונה:</p>
            
            <div className="min-h-[80px] bg-white/30 p-4 rounded-2xl mb-6 flex flex-wrap justify-center gap-4 text-2xl">
                {itemsToSort.map(name => (
                    <div key={name} draggable onDragStart={(e) => handleDragStart(e, name)} className="bg-brand-light-blue/20 shadow-md p-3 rounded-xl cursor-grab hover:bg-brand-light-blue/30 transition-colors">
                        {name}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onDrop={(e) => handleDrop(e, 'השקעה')} onDragOver={(e) => e.preventDefault()} className="min-h-[200px] p-4 bg-green-100/50 rounded-2xl border-2 border-dashed border-green-500">
                    <h4 className="font-bold text-4xl text-green-700 text-center">📈 השקעה</h4>
                    <div className="space-y-2 mt-4 text-2xl">
                        {investmentItems.map(([name, val]) => (
                            <div key={name} className={`p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>{name}</div>
                        ))}
                    </div>
                </div>
                <div onDrop={(e) => handleDrop(e, 'בזבוז')} onDragOver={(e) => e.preventDefault()} className="min-h-[200px] p-4 bg-red-100/50 rounded-2xl border-2 border-dashed border-red-500">
                    <h4 className="font-bold text-4xl text-red-700 text-center">💸 בזבוז</h4>
                    <div className="space-y-2 mt-4 text-2xl">
                        {spendingItems.map(([name, val]) => (
                            <div key={name} className={`p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>{name}</div>
                        ))}
                    </div>
                </div>
            </div>
            {feedback && <p className="text-center font-bold text-3xl mt-4">{feedback}</p>}
        </div>
    );
};


// --- Step 2: Types of Investments ---
const InvestmentTypes: React.FC = () => {
    const types = [
        { name: "מניות", risk: "גבוה", icon: "📈", desc: "אתם קונים חלק קטן מבעלות בחברה. אם החברה מצליחה, ערך המניה עולה. אם היא נכשלת, אתם עלולים להפסיד את כספכם." },
        { name: "אג\"ח (אגרות חוב)", risk: "נמוך", icon: "📜", desc: "אתם מלווים כסף לממשלה או לחברה, והם מבטיחים להחזיר לכם אותו עם ריבית קבועה. נחשב בטוח יחסית." },
        { name: "נדל\"ן", risk: "בינוני", icon: "🏢", desc: "קניית נכס כמו דירה או משרד, במטרה להשכיר אותו ולקבל הכנסה חודשית, או למכור אותו ברווח בעתיד." },
        { name: "קרנות סל/נאמנות", risk: "בינוני", icon: "🧺", desc: "במקום לקנות מניה אחת, אתם קונים 'סל' שמכיל מניות רבות ושונות. זה מפזר את הסיכון ומתאים למתחילים." },
        { name: "השקעה בעצמך (לימודים)", risk: "נמוך-בינוני", icon: "🎓", desc: "רכישת ידע או מיומנות חדשה (כמו קורס או תואר) שיכולה להגדיל את פוטנציאל ההשתכרות שלכם בעתיד. זו אחת ההשקעות הבטוחות והמשתלמות ביותר!" },
        { name: "פריטי אספנות וסחורות", risk: "גבוה", icon: "💎", desc: "קניית פריטים נדירים (כמו אומנות, שעונים, קלפים) או סחורות (כמו זהב) מתוך ציפייה שערכם יעלה. דורש ידע רב והסיכון גבוה." }
    ];
    
    const getRiskStyles = (risk: string) => {
        if (risk === "גבוה") return 'bg-red-200 text-red-800';
        if (risk === "בינוני") return 'bg-yellow-200 text-yellow-800';
        if (risk === "נמוך-בינוני") return 'bg-blue-200 text-blue-800';
        return 'bg-green-200 text-green-800'; // נמוך
    };

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
             <p className="text-center text-3xl mb-8">ישנן דרכים רבות להשקיע. הנה כמה מהנפוצות ביותר. רמת הסיכון משפיעה על פוטנציאל הרווח (וההפסד).</p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {types.map(type => (
                    <div key={type.name} className="bg-white/60 p-6 rounded-2xl border border-white/40 shadow-lg flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-left">
                                <p className="text-7xl">{type.icon}</p>
                                <h4 className="text-4xl font-bold text-brand-light-blue mt-2">{type.name}</h4>
                            </div>
                            <div className={`px-3 py-1 rounded-full font-bold text-xl ${getRiskStyles(type.risk)}`}>
                                סיכון {type.risk}
                            </div>
                        </div>
                        <p className="text-brand-dark-blue/90 flex-grow text-2xl">{type.desc}</p>
                    </div>
                ))}
             </div>
        </div>
    );
};

// --- Step 3: Compound Interest Calculator ---
const CompoundInterestCalculator: React.FC = () => {
    const [principal, setPrincipal] = useState(1000);
    const [rate, setRate] = useState(5);
    const [years, setYears] = useState(10);
    const [monthlyContribution, setMonthlyContribution] = useState(100);

    const calculationResults = useMemo(() => {
        const chartData = [];
        let compoundInterestTotal = principal;
        for (let i = 0; i <= years; i++) {
            if (i > 0) {
                compoundInterestTotal = (compoundInterestTotal + monthlyContribution * 12) * (1 + rate / 100);
            }
            chartData.push({ year: `שנה ${i}`, 'שווי החיסכון': parseFloat(compoundInterestTotal.toFixed(2)) });
        }
        const finalValue = compoundInterestTotal;
        return { chartData, finalValue };
    }, [principal, rate, years, monthlyContribution]);

    const { chartData, finalValue } = calculationResults;

    const totalInvested = principal + (monthlyContribution * years * 12);
    const totalGains = finalValue - totalInvested;
    const investedPercentage = totalInvested > 0 ? (totalInvested / finalValue) * 100 : 0;
    const gainsPercentage = totalGains > 0 ? (totalGains / finalValue) * 100 : 0;


    return (
        <div className="animate-fade-in">
             <div className="bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl mb-8">
                <h3 className="text-4xl font-bold text-brand-teal text-center mb-3">ריבית דריבית: מנוע הצמיחה של ההשקעות</h3>
                <div className="text-3xl text-center space-y-2">
                    <p>כשאתם משקיעים, הכסף שלכם מרוויח תשואה (רווח).</p>
                    <p>ריבית דריבית היא "הקסם" שבו גם <strong>התשואה שהרווחתם מתחילה להרוויח תשואה בעצמה</strong>.</p>
                    <p>זהו אפקט כדור שלג: ככל שהזמן עובר, הצמיחה הופכת מהירה יותר ויותר.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl">
                    <h3 className="text-4xl font-bold mb-6 text-brand-light-blue">מחשבון חיסכון</h3>
                    <div className="space-y-4 text-2xl">
                        <div><label>סכום התחלתי (ש"ח)</label><input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full mt-1 bg-white p-2 rounded-lg border border-gray-300 text-3xl" /></div>
                        <div><label>הפקדה חודשית (ש"ח)</label><input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} className="w-full mt-1 bg-white p-2 rounded-lg border border-gray-300 text-3xl" /></div>
                        <div><label>תשואה שנתית ממוצעת (%)</label><input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full mt-1 bg-white p-2 rounded-lg border border-gray-300 text-3xl" /></div>
                        <div><label>מספר שנים</label><input type="range" min="1" max="40" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full mt-1" /><div className="text-center font-bold text-brand-light-blue text-3xl">{years} שנים</div></div>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl flex flex-col justify-center">
                    <div className="text-center mb-4"><p className="text-3xl text-brand-dark-blue/90">לאחר {years} שנים, ההשקעה שלך תגיע ל-</p><p className="text-6xl font-bold text-brand-light-blue my-2">{finalValue.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</p></div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="year" stroke="#4a5568" /><YAxis stroke="#4a5568" tickFormatter={(value) => `₪${value}`} /><Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #e2e8f0' }} /><Legend /><Line type="monotone" dataKey="שווי החיסכון" stroke="#00b1a6" strokeWidth={3} /></LineChart></ResponsiveContainer>
                    </div>
                     <div className="mt-6">
                        <h4 className="font-bold text-2xl text-center mb-2">פירוט הסכום הסופי:</h4>
                        <div className="w-full bg-gray-200 rounded-full h-8 flex overflow-hidden border-2 border-gray-300">
                            <div style={{ width: `${investedPercentage}%` }} className="bg-blue-400 transition-all duration-500"></div>
                            <div style={{ width: `${gainsPercentage}%` }} className="bg-green-400 transition-all duration-500"></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xl px-1">
                            <div className="text-center">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded-full"></div><span>סך הפקדות</span></div>
                                <p className="font-bold">{totalInvested.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-400 rounded-full"></div><span>סך רווחים (ריבית)</span></div>
                                <p className="font-bold">{totalGains.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Step 4: Investment Simulator ---
const InvestmentSimulator: React.FC = () => {
    const VIRTUAL_MONEY = 10000;
    const [investmentAmount, setInvestmentAmount] = useState(5000);
    const [selectedStock, setSelectedStock] = useState<keyof StockData>('AAPL');
    const [startDate, setStartDate] = useState('2022-01-03');
    const [endDate, setEndDate] = useState('2023-12-29');
    const [results, setResults] = useState<{ invested: number, finalValue: number, profit: number, profitPercentage: number, chartData: any[] } | null>(null);

    const stockHebrewNames: Record<keyof StockData, string> = {
        AAPL: 'אפל', GOOGL: 'גוגל', MSFT: 'מייקרוסופט', AMZN: 'אמזון',
        NFLX: 'נטפליקס', TSLA: 'טסלה', NKE: 'נייקי', SBUX: 'סטארבקס',
        DIS: 'דיסני', MCD: "מקדונלד'ס",
    };

    const availableStocks = Object.keys(stockData);
    const minDate = '2022-01-03';
    const maxDate = '2024-06-28';

    const handleSimulation = () => {
        const stockHistory = stockData[selectedStock];
        const startEntry = stockHistory.find(d => d.date >= startDate);
        const endEntry = stockHistory.slice().reverse().find(d => d.date <= endDate);

        if (!startEntry || !endEntry) {
            alert("נתונים לא זמינים עבור התאריכים שנבחרו. אנא בחרו תאריכים אחרים.");
            return;
        }

        const sharesBought = investmentAmount / startEntry.price;
        const finalValue = sharesBought * endEntry.price;
        const profit = finalValue - investmentAmount;
        const profitPercentage = (profit / investmentAmount) * 100;
        const chartData = stockHistory.filter(d => d.date >= startDate && d.date <= endDate).map(d => ({ date: d.date, [selectedStock]: d.price }));
        setResults({ invested: investmentAmount, finalValue, profit, profitPercentage, chartData });
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in text-2xl">
            <div className="lg:col-span-2 bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl">
                <h3 className="text-4xl font-bold mb-4 text-brand-light-blue">בנו את ההשקעה שלכם</h3>
                <p className="mb-4 text-3xl">עומדים לרשותכם <strong>{VIRTUAL_MONEY.toLocaleString()} ₪</strong> וירטואליים.</p>
                <div className="space-y-4">
                    <div><label className="font-bold">1. בחרו חברה:</label><select value={selectedStock} onChange={e => setSelectedStock(e.target.value as keyof StockData)} className="w-full mt-1 bg-white p-2 rounded-lg border border-gray-300 text-3xl">{availableStocks.map(s => <option key={s} value={s}>{`${s} - ${stockHebrewNames[s as keyof StockData]}`}</option>)}</select></div>
                    <div><label className="font-bold">2. כמה כסף להשקיע? ({investmentAmount.toLocaleString()} ₪)</label><input type="range" min="100" max={VIRTUAL_MONEY} step="100" value={investmentAmount} onChange={e => setInvestmentAmount(Number(e.target.value))} className="w-full mt-1" /></div>
                    <div><label className="font-bold">3. בחרו תקופה:</label>
                        <div className="flex gap-2 mt-1">
                          <input type="date" value={startDate} min={minDate} max={endDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white p-2 rounded-lg border border-gray-300 text-2xl" title="תאריך התחלה"/>
                          <input type="date" value={endDate} min={startDate} max={maxDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white p-2 rounded-lg border border-gray-300 text-2xl" title="תאריך סיום"/>
                        </div>
                    </div>
                </div>
                <button onClick={handleSimulation} className="w-full mt-6 bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-3xl">בדוק תוצאות!</button>
                 <div className="mt-4 p-3 bg-red-100/70 border-2 border-red-400 rounded-lg text-red-800 text-xl text-center">
                    <strong className="text-2xl">⚠️לתשומת ליבך:</strong><br/>
                    הנתונים בסימולטור זה הם <strong>הדגמה בלבד</strong> ואינם משקפים נתוני שוק אמיתיים. אין לראות בתוצאות אלו המלצה להשקעה.
                </div>
            </div>
            <div className="lg:col-span-3 bg-white/40 backdrop-blur-md border border-white/30 p-6 rounded-2xl">
                {results ? (
                    <div className="animate-fade-in">
                        <div className="text-center mb-4">
                            <h3 className="text-4xl font-bold text-brand-teal">תוצאות עבור {stockHebrewNames[selectedStock]} ({selectedStock})</h3>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mb-4 text-3xl">
                            <div className="bg-white/50 p-4 rounded-lg">
                                <p>השקעתם</p>
                                <p className="font-bold text-4xl">{results.invested.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</p>
                            </div>
                             <div className="bg-white/50 p-4 rounded-lg">
                                <p>שווי נוכחי</p>
                                <p className="font-bold text-4xl">{results.finalValue.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}</p>
                            </div>
                            <div className={`md:col-span-2 p-4 rounded-lg ${results.profit >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                                <p>רווח/הפסד</p>
                                <p className={`font-bold text-5xl ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {results.profit.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })}
                                    <span className="text-3xl ml-2">({results.profitPercentage.toFixed(2)}%)</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer><LineChart data={results.chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={['dataMin', 'dataMax']} tickFormatter={(value) => `$${value.toFixed(0)}`} /><Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} /><Legend /><Line type="monotone" dataKey={selectedStock} stroke="#d52963" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500 text-3xl"><p>הגדירו את ההשקעה שלכם ולחצו "בדוק תוצאות" כדי לראות את הגרף.</p></div>
                )}
            </div>
        </div>
    );
};


// --- Step 5: Knowledge Quiz ---
const KnowledgeQuiz: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
    const questions = useMemo(() => [
        { q: "מהו המרכיב החשוב ביותר בצמיחת חיסכון באמצעות ריבית דריבית לאורך זמן?", options: ["הסכום ההתחלתי", "זמן (מספר השנים)", "גובה הריבית"], answer: "זמן (מספר השנים)", explanation: "זמן הוא הגורם המשפיע ביותר כי הוא מאפשר לרווחים לצבור רווחים נוספים לאורך שנים רבות (אפקט כדור שלג)." },
        { q: "איזה סוג השקעה נחשב בדרך כלל לבעל הסיכון הנמוך ביותר?", options: ["מניות", "נדל\"ן", "אגרות חוב ממשלתיות"], answer: "אגרות חוב ממשלתיות", explanation: "אגרות חוב ממשלתיות נחשבות בטוחות כי הן מגובות על ידי המדינה, והסיכוי שהיא לא תחזיר את חובה נמוך מאוד." },
        { q: "מה היתרון המרכזי של השקעה בקרן סל על פני קניית מניה בודדת?", options: ["רווחים גבוהים יותר", "פיזור סיכונים", "אין עמלות"], answer: "פיזור סיכונים", explanation: "קרן סל מחזיקה מניות רבות, כך שאם מניה אחת יורדת, אחרות יכולות לעלות ולאזן את ההפסד. זה מפחית את הסיכון." },
        { q: "מהי המטרה העיקרית של השקעה?", options: ["לשמור על הכסף בטוח", "להשתמש בכסף כדי לייצר עוד כסף", "לבזבז את הכסף מהר"], answer: "להשתמש בכסף כדי לייצר עוד כסף", explanation: "המטרה היא לא רק לשמור על הכסף, אלא לגרום לו לצמוח וליצור ערך נוסף לאורך זמן." },
        { q: "כאשר אומרים ש'השקעה היא נזילה', למה מתכוונים?", options: ["שאפשר להפוך אותה למזומן בקלות ובמהירות", "שהיא קשורה למים", "שהשווי שלה משתנה כל הזמן"], answer: "שאפשר להפוך אותה למזומן בקלות ובמהירות", explanation: "נזילות היא מדד לקלות שבה ניתן להמיר נכס למזומן בלי לאבד משמעותית מערכו." },
        { q: "מה קורה לכסף שיושב בחיסכון בבנק כאשר יש אינפלציה גבוהה?", options: ["הערך שלו עולה", "הוא מאבד מכוח הקנייה שלו", "הוא מוגן מפני אינפלציה", "הוא מוכפל"], answer: "הוא מאבד מכוח הקנייה שלו", explanation: "אינפלציה גורמת למחירים לעלות, ולכן כל שקל שבידכם יכול לקנות פחות ממה שיכל לקנות בעבר." },
        { q: "האמרה 'לא לשים את כל הביצים בסל אחד' מתייחסת לעיקרון של...", options: ["חיסכון אגרסיבי", "מינוף", "פיזור השקעות (דיברסיפיקציה)", "השקעה בנדל\"ן"], answer: "פיזור השקעות (דיברסיפיקציה)", explanation: "פיזור השקעות (דיברסיפיקציה) הוא עיקרון בסיסי להפחתת סיכון, על ידי השקעה בנכסים שונים ומגוונים." },
        { q: "מהו הסיכון העיקרי בהשקעה במניה של חברה בודדת?", options: ["החברה עלולה לפשוט רגל וערך המניה יצנח לאפס", "הריבית עלולה לעלות", "קשה למכור את המניה", "הממשלה עלולה להלאים את החברה"], answer: "החברה עלולה לפשוט רגל וערך המניה יצנח לאפס", explanation: "בניגוד לקרן סל, אם החברה הבודדת נכשלת, כל ההשקעה שלך במניה זו עלולה להימחק." },
        { q: "איזה מהבאים אינו נחשב בדרך כלל להשקעה פיננסית?", options: ["קניית דירה להשכרה", "קניית קרן סל", "קניית רכב חדש לשימוש אישי", "קניית אג\"ח ממשלתי"], answer: "קניית רכב חדש לשימוש אישי", explanation: "רכב לשימוש אישי הוא התחייבות שערכה יורד במהירות (פחת), ולא נכס שמייצר הכנסה או צומח בערכו." },
        { q: "מה בדרך כלל הקשר בין סיכון לתשואה (רווח פוטנציאלי) בהשקעות?", options: ["ככל שהסיכון גבוה יותר, התשואה הפוטנציאלית נמוכה יותר", "אין קשר בין סיכון לתשואה", "ככל שהסיכון גבוה יותר, התשואה הפוטנציאלית גבוהה יותר", "ככל שהסיכון נמוך יותר, התשואה הפוטנציאלית גבוהה יותר"], answer: "ככל שהסיכון גבוה יותר, התשואה הפוטנציאלית גבוהה יותר", explanation: "באופן כללי, כדי להשיג פוטנציאל רווח גבוה יותר, יש לקחת על עצמך רמת סיכון גבוהה יותר." },
    ].sort(() => Math.random() - 0.5), []);
    
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState('');
    const [answerState, setAnswerState] = useState<'pending' | 'correct' | 'incorrect' | null>(null);
    const [finished, setFinished] = useState(false);
    const prizeLevels = [100, 200, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000].reverse();


    useEffect(() => {
        if (finished && (score / questions.length) >= 0.8) {
            onComplete();
        }
    }, [finished, score, onComplete, questions.length]);

    const handleSelect = (opt: string) => {
        if(selected) return;
        setSelected(opt);
        setAnswerState('pending');

        setTimeout(() => {
             if(opt === questions[current].answer) {
                setScore(s => s + 1);
                setAnswerState('correct');
            } else {
                setAnswerState('incorrect');
            }
        }, 1500);
    };
    
    const handleNext = () => {
        if (current === questions.length - 1) {
            setFinished(true);
        } else {
            setCurrent(c => c + 1);
            setSelected('');
            setAnswerState(null);
        }
    };
    
    if (finished) {
        return (
            <div className="text-center bg-white/80 p-6 rounded-lg shadow-2xl">
                <TrophyIcon className="w-24 h-24 mx-auto text-yellow-500" />
                <h3 className="text-5xl font-bold mt-4">סיימתם את הבוחן!</h3>
                <p className="text-3xl my-4">הציון שלכם: <span className="font-bold text-brand-light-blue text-4xl">{score} / {questions.length}</span></p>
                {(score/questions.length >= 0.8) ?
                    <p className="text-green-600 font-bold text-2xl">כל הכבוד! השלמתם את המודול!</p> :
                    <p className="text-red-600 font-bold text-2xl">עבודה טובה! נסו שוב כדי להגיע ל-80% הצלחה.</p>
                }
            </div>
        )
    }

    const q = questions[current];
    return (
        <div className="bg-brand-dark-blue p-4 sm:p-6 rounded-2xl text-white shadow-2xl">
            <p className="text-center mb-4 text-gray-300 text-2xl">ברוכים הבאים לשעשועון "ההרפתקה אל העושר"! ענו נכון על השאלות כדי להתקדם בסולם הפרסים. בהצלחה!</p>
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="bg-white/10 p-6 rounded-xl border-2 border-brand-light-blue min-h-[120px] flex items-center justify-center">
                        <p className="font-bold text-4xl text-center">{q.q}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {q.options.map((opt, i) => {
                             const isSelected = selected === opt;
                             const isCorrect = answerState && q.answer === opt;
                             let stateClass = '';
                             if (answerState === 'pending' && isSelected) stateClass = 'bg-yellow-500 animate-pulse';
                             else if (answerState === 'correct' && isCorrect) stateClass = 'bg-green-500';
                             else if (answerState === 'incorrect' && isSelected) stateClass = 'bg-red-500';
                             else if (answerState === 'incorrect' && isCorrect) stateClass = 'bg-green-500/50 border-green-400';

                            return (
                                <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                                    className={`flex items-center p-4 rounded-lg border-2 border-brand-light-blue transition-all duration-300 min-h-[80px] text-2xl ${stateClass || 'bg-brand-dark-blue hover:bg-brand-light-blue/20'}`}>
                                    <span className="font-bold text-yellow-400 ml-3">{String.fromCharCode(65 + i)}:</span> {opt}
                                </button>
                            )
                        })}
                    </div>
                     {answerState && answerState !== 'pending' && (
                        <div className="mt-4 animate-fade-in">
                            <div className={`p-3 rounded-lg mb-4 text-2xl ${answerState === 'correct' ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                                <p className="font-bold">{answerState === 'correct' ? 'נכון מאוד!' : 'הסבר:'}</p>
                                <p>{q.explanation}</p>
                            </div>
                            <button onClick={handleNext} className="w-full bg-brand-magenta font-bold p-3 rounded-lg text-2xl">
                                {current === questions.length - 1 ? 'סיים בוחן' : 'לשאלה הבאה'}
                            </button>
                        </div>
                    )}
                </div>
                 <div className="lg:col-span-1 bg-white/10 p-4 rounded-xl flex flex-col-reverse">
                    {prizeLevels.map((level, index) => (
                        <div key={level} className={`p-2 my-1 rounded text-center font-bold text-xl sm:text-2xl ${
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


// --- Main Module Component ---
const InterestModule: React.FC<InterestModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <WhatIsInvestment />;
            case 1: return <InvestmentTypes />;
            case 2: return <CompoundInterestCalculator />;
            case 3: return <InvestmentSimulator />;
            case 4: return <KnowledgeQuiz onComplete={onComplete} />;
            default: return <WhatIsInvestment />;
        }
    };

    return (
        <ModuleView title="ההרפתקה אל העושר" onBack={onBack}>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-2xl ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
                                    {index + 1}
                                </div>
                                <p className={`mt-2 text-lg text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {renderStepContent()}

            <div className="flex justify-between mt-8">
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl">הקודם</button>
                <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length - 1} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl">הבא</button>
            </div>
        </ModuleView>
    );
};

export default InterestModule;