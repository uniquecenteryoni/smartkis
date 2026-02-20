import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';

interface SelfEmployedModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ["ההבדלים העיקריים", "משחק מיון", "סוגי עצמאיים", "החשבון, בבקשה!", "ניתוח SWOT"];

// --- Step 1: Differences Introduction (New) ---
const DifferencesStep: React.FC = () => {
    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-5xl font-bold text-brand-teal mb-2 text-center">שכיר או עצמאי: מה ההבדל?</h3>
            <p className="text-center text-3xl mb-8 text-brand-dark-blue/90">לפני שנצלול פנימה, בואו נבין את ההבדלים המרכזיים בין שתי דרכי התעסוקה.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/60 p-6 rounded-xl border-2 border-brand-light-blue shadow-xl transform hover:-translate-y-1.5 transition-all">
                    <h4 className="text-5xl font-bold text-brand-light-blue mb-4 text-center">👨‍💼 שכיר</h4>
                    <ul className="list-disc list-inside space-y-3 text-2xl">
                        <li>מקבל משכורת קבועה וידועה מראש מהמעסיק.</li>
                        <li>זכאי לזכויות סוציאליות כמו ימי חופשה, ימי מחלה והפרשות לפנסיה.</li>
                        <li>עובד בשעות מוגדרות וכפוף למנהל.</li>
                        <li>המעסיק אחראי על תשלום המיסים והביטוח הלאומי.</li>
                    </ul>
                </div>
                <div className="bg-white/60 p-6 rounded-xl border-2 border-brand-magenta shadow-xl transform hover:-translate-y-1.5 transition-all">
                    <h4 className="text-5xl font-bold text-brand-magenta mb-4 text-center">👩‍💻 עצמאי</h4>
                    <ul className="list-disc list-inside space-y-3 text-2xl">
                        <li>ההכנסה אינה קבועה ותלויה בהצלחת העסק.</li>
                        <li>אחראי בעצמו על הפרשות לפנסיה ואין לו ימי חופשה בתשלום.</li>
                        <li>קובע לעצמו את שעות העבודה והוא הבוס של עצמו.</li>
                        <li>אחראי באופן אישי על דיווח ותשלום המיסים לרשויות.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};


// --- Step 2: Sorting Game (Restyled) ---
const SortingGameStep: React.FC<{ onGameComplete: () => void }> = ({ onGameComplete }) => {
    const initialItems = [
        { name: 'משכורת קבועה', category: 'שכיר' },
        { name: 'גמישות בשעות העבודה', category: 'עצמאי' },
        { name: 'זכויות סוציאליות (פנסיה, חופשה)', category: 'שכיר' },
        { name: 'אחריות מלאה על ההצלחה', category: 'עצמאי' },
        { name: 'עבודה לפי הנחיות מנהל', category: 'שכיר' },
        { name: 'פוטנציאל רווח בלתי מוגבל', category: 'עצמאי' },
    ];
    const [unassignedItems, setUnassignedItems] = useState(initialItems.map(i => i.name));
    const [assignments, setAssignments] = useState<Record<string, { category: string, isCorrect: boolean }>>({});
    const gameFinished = unassignedItems.length === 0;
    const score = (Object.values(assignments) as { isCorrect: boolean }[]).filter(a => a.isCorrect).length;

    useEffect(() => {
        if (gameFinished) {
            onGameComplete();
        }
    }, [gameFinished, onGameComplete]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemName: string) => {
        e.dataTransfer.setData('text', itemName);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, category: 'שכיר' | 'עצמאי') => {
        e.preventDefault();
        const itemName = e.dataTransfer.getData('text');
        const item = initialItems.find(i => i.name === itemName);
        if (item && !assignments[itemName]) {
            setUnassignedItems(prev => prev.filter(i => i !== itemName));
            setAssignments(prev => ({ ...prev, [itemName]: { category, isCorrect: item.category === category } }));
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-5xl font-bold text-brand-dark-blue mb-2 text-center">משחק מיון: שכיר או עצמאי?</h3>
            <p className="text-center text-3xl mb-6 text-brand-dark-blue/90">גררו כל מאפיין לעמודה הנכונה כדי ללמוד על ההבדלים המרכזיים.</p>
            <div className="bg-brand-dark-blue p-4 rounded-xl mb-4 text-white">
                <h4 className="text-3xl font-bold text-center mb-2 text-yellow-300">מאפיינים למיון:</h4>
                <div className="flex flex-wrap justify-center gap-3 min-h-[50px]">
                    {unassignedItems.map(item => <div key={item} draggable onDragStart={e => handleDragStart(e, item)} className="p-3 rounded bg-yellow-200 text-black shadow-md cursor-grab text-2xl">{item}</div>)}
                    {gameFinished && <p className="text-3xl font-bold text-green-300">כל הכבוד! סיימתם למיין.</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div onDrop={(e) => handleDrop(e, 'שכיר')} onDragOver={(e) => e.preventDefault()} className="bg-brand-light-blue/10 p-4 rounded-xl border-2 border-dashed border-brand-light-blue min-h-[250px]">
                    <h4 className="text-4xl font-bold text-brand-light-blue mb-4 text-center">👨‍💼 שכיר</h4>
                    <div className="space-y-2">
                        {(Object.entries(assignments) as [string, { category: string; isCorrect: boolean }][]).filter(([, val]) => val.category === 'שכיר').map(([name, { isCorrect }]) => <div key={name} className={`p-2 rounded text-white font-semibold text-2xl ${isCorrect ? 'bg-brand-teal' : 'bg-brand-magenta'}`}>{name}</div>)}
                    </div>
                </div>
                <div onDrop={(e) => handleDrop(e, 'עצמאי')} onDragOver={(e) => e.preventDefault()} className="bg-brand-magenta/10 p-4 rounded-xl border-2 border-dashed border-brand-magenta min-h-[250px]">
                    <h4 className="text-4xl font-bold text-brand-magenta mb-4 text-center">👩‍💻 עצמאי</h4>
                    <div className="space-y-2">
                        {(Object.entries(assignments) as [string, { category: string; isCorrect: boolean }][]).filter(([, val]) => val.category === 'עצמאי').map(([name, { isCorrect }]) => <div key={name} className={`p-2 rounded text-white font-semibold text-2xl ${isCorrect ? 'bg-brand-teal' : 'bg-brand-magenta'}`}>{name}</div>)}
                    </div>
                </div>
            </div>
            {gameFinished && <p className="mt-6 p-3 bg-white/40 rounded-lg font-bold text-center text-2xl">סיימתם את המיון עם {score} הצלחות מתוך {initialItems.length}!</p>}
        </div>
    );
};

// --- Step 3: Types of Self-Employed (Improved Quiz) ---
const SelfEmployedTypes: React.FC<{ onQuizComplete: () => void }> = ({ onQuizComplete }) => {
    const scenarios = [
        { id: 1, icon: '🎨', case: 'מעצבת גרפית שצופה להכניס כ-80,000 ₪ בשנה.', answer: 'עוסק פטור', explanation: 'נכון! מכיוון שההכנסה השנתית הצפויה נמוכה מתקרת העוסק הפטור, זו האפשרות הפשוטה והמתאימה ביותר.' },
        { id: 2, icon: '💻', case: 'מתכנת שבונה אתרים וההכנסה הצפויה שלו היא כ-150,000 ₪ בשנה.', answer: 'עוסק מורשה', explanation: 'נכון! ההכנסה הצפויה גבוהה מהתקרה, ולכן הוא חייב להירשם כעוסק מורשה.' },
    ];
    const [answers, setAnswers] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
    
    useEffect(() => {
        if (Object.keys(answers).length === scenarios.length) {
            onQuizComplete();
        }
    }, [answers, onQuizComplete, scenarios.length]);

    const handleAnswer = (scenarioId: number, selected: string) => {
        if (answers[scenarioId]) return;
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;
        const isCorrect = selected === scenario.answer;
        setAnswers(prev => ({ ...prev, [scenarioId]: { selected, isCorrect } }));
    };

    return (
        <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-5xl font-bold text-brand-teal mb-6 text-center">סוגי עצמאיים נפוצים</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/50 p-6 rounded-xl border-2 border-brand-light-blue flex flex-col shadow-xl transform hover:-translate-y-1.5 transition-all">
                    <h4 className="text-4xl font-bold text-brand-light-blue mb-3">עוסק פטור</h4>
                    <ul className="list-disc list-inside space-y-2 text-2xl flex-grow">
                        <li><strong>למי זה מתאים?</strong> לעסקים קטנים בתחילת הדרך, עם מחזור הכנסות שנתי נמוך (עד כ-120,000 ₪, נכון ל-2024).</li>
                        <li><strong>מע"מ:</strong> <strong>פטור</strong> מגביית מע"מ מלקוחות. זה הופך את המחיר שלכם לאטרקטיבי יותר עבור לקוחות פרטיים.</li>
                        <li><strong>חסרון:</strong> לא ניתן לקזז (לקבל החזר) על המע"מ ששילמתם על הוצאות העסק (כמו קניית ציוד).</li>
                        <li><strong>דיווחים:</strong> התנהלות פשוטה יותר מול רשויות המס - בדרך כלל דיווח שנתי אחד בלבד.</li>
                         <li><strong>הגבלות:</strong> מקצועות מסוימים (כמו רופאים, עורכי דין) חייבים להירשם כ"עוסק מורשה" ללא קשר לגובה ההכנסה.</li>
                    </ul>
                </div>
                <div className="bg-white/50 p-6 rounded-xl border-2 border-brand-magenta flex flex-col shadow-xl transform hover:-translate-y-1.5 transition-all">
                    <h4 className="text-4xl font-bold text-brand-magenta mb-3">עוסק מורשה</h4>
                     <ul className="list-disc list-inside space-y-2 text-2xl flex-grow">
                        <li><strong>למי זה מתאים?</strong> לעסקים שהכנסתם השנתית צפויה לעבור את תקרת העוסק הפטור, או למקצועות חופשיים מסוימים.</li>
                        <li><strong>מע"מ:</strong> <strong>חייב</strong> להוסיף מע"מ (18%) לכל עסקה ולהעביר אותו למדינה.</li>
                        <li><strong>יתרון:</strong> ניתן לקזז את המע"מ ששולם על הוצאות העסק (למשל, קניית מחשב או תשלום על פרסום).</li>
                        <li><strong>דיווחים:</strong> התנהלות מורכבת יותר, הדורשת דיווחים חודשיים או דו-חודשיים למע"מ.</li>
                         <li><strong>תדמית:</strong> לעיתים נתפס כעסק "גדול" ורציני יותר, במיוחד בעבודה מול חברות אחרות.</li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t-2 border-brand-teal/30">
                <h3 className="text-4xl font-bold text-brand-dark-blue mb-4 text-center">מיני-בוחן: איזה עוסק אני?</h3>
                <div className="space-y-6">
                    {scenarios.map((scenario, index) => {
                        const answer = answers[scenario.id];
                        const bgColor = index === 0 ? 'bg-cyan-100/70' : 'bg-pink-100/70';
                        return (
                            <div key={scenario.id} className={`${bgColor} p-6 rounded-2xl shadow-lg`}>
                                <p className="font-semibold text-3xl mb-4 text-center"><span className="text-5xl">{scenario.icon}</span> תיק לקוח: {scenario.case}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => handleAnswer(scenario.id, 'עוסק פטור')} disabled={!!answer} className={`p-3 rounded-lg font-bold transition-colors text-2xl ${!answer ? 'bg-gray-200 hover:bg-gray-300' : (scenario.answer === 'עוסק פטור' ? 'bg-brand-teal text-white' : (answer.selected === 'עוסק פטור' ? 'bg-brand-magenta text-white' : 'bg-gray-200 opacity-60'))}`}>עוסק פטור</button>
                                    <button onClick={() => handleAnswer(scenario.id, 'עוסק מורשה')} disabled={!!answer} className={`p-3 rounded-lg font-bold transition-colors text-2xl ${!answer ? 'bg-gray-200 hover:bg-gray-300' : (scenario.answer === 'עוסק מורשה' ? 'bg-brand-teal text-white' : (answer.selected === 'עוסק מורשה' ? 'bg-brand-magenta text-white' : 'bg-gray-200 opacity-60'))}`}>עוסק מורשה</button>
                                </div>
                                {answer && <p className="mt-3 text-xl text-center p-2 bg-yellow-100/70 rounded-md">{scenario.explanation}</p>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};


// --- Step 4: Business Expenses (Invoice Version) ---
const RestaurantExercise: React.FC = () => {
    const menu = {
        'המבורגר': { price: 75, costs: { 'חומרי גלם': 20, 'שכירות וחשבונות': 15, 'משכורות': 18, 'שיווק': 5, 'מיסים וביטוחים': 5, 'פחת ציוד': 3 }, icon: '🍔' },
        'פיצה': { price: 80, costs: { 'חומרי גלם': 18, 'שכירות וחשבונות': 15, 'משכורות': 20, 'שיווק': 6, 'מיסים וביטוחים': 7, 'פחת ציוד': 4 }, icon: '🍕' },
        'סלט': { price: 60, costs: { 'חומרי גלם': 15, 'שכירות וחשבונות': 12, 'משכורות': 15, 'שיווק': 4, 'מיסים וביטוחים': 4, 'פחת ציוד': 2 }, icon: '🥗' }
    };
    const [selectedDish, setSelectedDish] = useState<keyof typeof menu>('המבורגר');
    const dishData = menu[selectedDish];
    const totalCosts = (Object.values(dishData.costs) as number[]).reduce((sum, cost) => sum + cost, 0);
    const netProfit = dishData.price - totalCosts;

    return (
        <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-5xl font-bold text-brand-teal mb-2 text-center">החשבון, בבקשה!</h3>
            <p className="text-center text-3xl mb-6 text-brand-dark-blue/90">בעל עסק לא "לוקח הביתה" את כל הכסף שהוא מקבל. בחרו מנה כדי לראות את פירוט החשבונית.</p>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 bg-white/50 p-4 rounded-xl border border-white/40">
                    <h4 className="text-4xl font-bold text-brand-dark-blue mb-4 text-center">תפריט</h4>
                    {Object.entries(menu).map(([name, data]) => (
                        <button key={name} onClick={() => setSelectedDish(name as keyof typeof menu)}
                            className={`w-full text-right p-3 my-2 rounded-lg transition-colors ${selectedDish === name ? 'bg-brand-light-blue text-white shadow-lg' : 'bg-white/70 hover:bg-white'}`}>
                            <span className="font-bold text-3xl">{data.icon} {name}</span> - <span className="text-2xl">{data.price} ₪</span>
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-3 bg-white/80 p-6 rounded-2xl shadow-lg font-mono">
                    <h4 className="font-sans font-bold text-4xl text-center border-b-2 border-dashed border-gray-400 pb-2 mb-4">חשבונית עבור: {selectedDish}</h4>
                    <div className="space-y-2 text-3xl">
                        <div className="flex justify-between font-bold text-4xl mb-4">
                            <span>מחיר ללקוח:</span>
                            <span>{dishData.price.toFixed(2)} ₪</span>
                        </div>
                        <p className="font-sans font-bold text-2xl text-gray-600">פירוט עלויות:</p>
                        {(Object.entries(dishData.costs) as [string, number][]).map(([name, value]) => (
                            <div key={name} className="flex justify-between text-2xl text-red-600"><span>- {name}</span><span>({value.toFixed(2)} ₪)</span></div>
                        ))}
                        <div className="flex justify-between font-bold border-t pt-2 mt-2 text-red-700"><span>סה"כ עלויות</span><span>({totalCosts.toFixed(2)} ₪)</span></div>

                        <div className="flex justify-between font-bold text-4xl border-t-4 border-brand-dark-blue pt-4 mt-4 text-green-600">
                            <span>רווח נקי לבעל העסק:</span>
                            <span>{netProfit.toFixed(2)} ₪</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Step 5: SWOT Analysis (Restyled) ---
const SwotPractice: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const categories: Record<string, { icon: string, style: string }> = {
        'חוזקות': { icon: '👍', style: 'teal' },
        'חולשות': { icon: '👎', style: 'magenta' },
        'הזדמנויות': { icon: '💡', style: 'light-blue' },
        'איומים': { icon: '⚠️', style: 'yellow' }
    };
    const initialItems = [
        { name: 'מתכון מיץ סודי ומנצח', category: 'חוזקות' }, { name: 'תחרות מדוכני גלידה סמוכים', category: 'איומים' },
        { name: 'יום גשום שיבריח לקוחות', category: 'איומים' }, { name: 'אין לי ניסיון קודם במכירות', category: 'חולשות' },
        { name: 'החברים שלי יכולים לעזור', category: 'חוזקות' }, { name: 'טרנד של אוכל בריא', category: 'הזדמנויות' },
        { name: 'תקציב התחלתי נמוך', category: 'חולשות' }, { name: 'החופש הגדול מביא הרבה תיירים', category: 'הזדמנויות' },
    ];
    const [unassigned, setUnassigned] = useState(initialItems.map(i => i.name));
    const [assignments, setAssignments] = useState<Record<string, { name: string, isCorrect: boolean }[]>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemName: string) => e.dataTransfer.setData('text', itemName);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, category: string) => {
        e.preventDefault();
        const itemName = e.dataTransfer.getData('text');
        const item = initialItems.find(i => i.name === itemName);
        if (item && unassigned.includes(itemName)) {
            setUnassigned(prev => prev.filter(i => i !== itemName));
            setAssignments(prev => ({ ...prev, [category]: [...(prev[category] || []), { name: itemName, isCorrect: item.category === category }] }));
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const correctCount = (Object.values(assignments).flat() as { name: string, isCorrect: boolean }[]).filter(item => item.isCorrect).length;
        if (correctCount / initialItems.length >= 0.8) { onComplete(); }
    };
    
    const correctCount = (Object.values(assignments).flat() as { name: string, isCorrect: boolean }[]).filter(item => item.isCorrect).length;
    const resultMessage = correctCount / initialItems.length >= 0.8 ? `כל הכבוד! ${correctCount}/${initialItems.length} תשובות נכונות. השלמתם!` : `עבודה טובה, אבל לא מספיק. ${correctCount}/${initialItems.length} תשובות נכונות. נסו שוב!`;

    return (
        <div className="bg-white/40 p-6 rounded-2xl">
            <h3 className="text-4xl font-bold text-center mb-2">מודל SWOT: איך מנתחים רעיון עסקי?</h3>
            <div className="text-right text-[1.65rem] mb-6 text-brand-dark-blue/90 leading-relaxed max-w-4xl mx-auto bg-white/50 p-6 rounded-xl">
                <p>מודל SWOT הוא כלי ניתוח אסטרטגי חיוני, המשמש עסקים ויזמים להערכת מצבם ולקבלת החלטות מושכלות. הניתוח מתבסס על ארבעה רכיבים מרכזיים, המתחלקים לגורמים פנימיים (שבשליטת העסק) וגורמים חיצוניים (השפעות הסביבה):</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4">
                    <div>
                        <h5 className="font-bold text-brand-light-blue">גורמים פנימיים:</h5>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong className="font-semibold">חוזקות (Strengths):</strong> היתרונות הפנימיים של העסק. מה מייחד אתכם? במה אתם טובים יותר מהמתחרים? (למשל: מוצר ייחודי, צוות מיומן).</li>
                            <li><strong className="font-semibold">חולשות (Weaknesses):</strong> החסרונות הפנימיים של העסק. מהן המגבלות שלכם? איפה אתם צריכים להשתפר? (למשל: חוסר בתקציב, ניסיון מועט).</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-brand-magenta">גורמים חיצוניים:</h5>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong className="font-semibold">הזדמנויות (Opportunities):</strong> גורמים חיצוניים חיוביים שהעסק יכול לנצל. אילו טרנדים או שינויים בשוק יכולים לעזור לכם? (למשל: טכנולוגיה חדשה, צורך חדש בקרב לקוחות).</li>
                            <li><strong className="font-semibold">איומים (Threats):</strong> גורמים חיצוניים שליליים שעלולים לפגוע בעסק. מהם המכשולים והסיכונים בסביבה? (למשל: כניסת מתחרים חדשים, משבר כלכלי).</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center mb-4">
                 <a href="https://www.youtube.com/watch?v=gmm_g2i51oE" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-magenta text-white font-bold py-2 px-4 rounded-lg text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    מה זה מודל SWOT? (סרטון הסבר)
                </a>
            </div>
            <p className="text-center text-[1.725rem] mb-2 font-bold">הרעיון: <strong>פתיחת דוכן מיצים טבעיים בחוף הים.</strong></p>
            <p className="text-center text-2xl mb-4">גררו כל פתק לקטגוריה הנכונה.</p>
            <div className="bg-brand-dark-blue p-4 rounded-xl mb-4 text-white">
                <h4 className="text-2xl font-bold text-center mb-2 text-yellow-300">פתקים למיון:</h4>
                <div className="flex flex-wrap justify-center gap-3 min-h-[50px]">
                    {unassigned.map(item => <div key={item} draggable onDragStart={e => handleDragStart(e, item)} className="p-3 rounded-xl bg-yellow-200 text-black shadow-md cursor-grab text-2xl">{item}</div>)}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(categories).map(([cat, { icon, style }]) => {
                    const colors = {
                        'teal': { bg: 'bg-brand-teal/10', border: 'border-brand-teal', text: 'text-brand-teal' },
                        'magenta': { bg: 'bg-brand-magenta/10', border: 'border-brand-magenta', text: 'text-brand-magenta' },
                        'light-blue': { bg: 'bg-brand-light-blue/10', border: 'border-brand-light-blue', text: 'text-brand-light-blue' },
                        'yellow': { bg: 'bg-yellow-400/10', border: 'border-yellow-500', text: 'text-yellow-600' },
                    }[style] || { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700' };

                    return (
                        <div key={cat} onDrop={e => handleDrop(e, cat)} onDragOver={handleDragOver} className={`p-4 rounded-lg min-h-[200px] border-2 border-dashed shadow-lg ${colors.bg} ${colors.border}`}>
                            <h4 className={`text-center font-bold text-3xl ${colors.text} pb-2 mb-2`}>{icon} {cat}</h4>
                            <div className="space-y-2">
                                {(assignments[cat] || []).map(item => <div key={item.name} className={`p-2 rounded-lg text-center text-white font-semibold shadow-sm text-2xl ${submitted ? (item.isCorrect ? 'bg-brand-teal' : 'bg-brand-magenta') : 'bg-white text-brand-dark-blue'}`}>{item.name}</div>)}
                            </div>
                        </div>
                    );
                })}
            </div>
            {unassigned.length === 0 && !submitted && <button onClick={handleSubmit} className="mt-6 w-full bg-brand-magenta text-white font-bold p-3 rounded-lg text-2xl">בדיקת תשובות</button>}
            {submitted && <p className="mt-6 p-3 bg-white/40 rounded-lg font-bold text-center text-2xl">{resultMessage}</p>}
        </div>
    );
};

const SelfEmployedModule: React.FC<SelfEmployedModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false]);

    const handleStepCompletion = (stepIndex: number) => {
        setCompletedSteps(prev => {
            const newCompleted = [...prev];
            newCompleted[stepIndex] = true;
            return newCompleted;
        });
    };

    return (
        <ModuleView title="המסלול לקריירה: שכיר או עצמאי?" onBack={onBack}>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 text-2xl ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
                                    {index + 1}
                                </div>
                                <p className={`mt-2 text-lg text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {currentStep === 0 && <DifferencesStep />}
            {currentStep === 1 && <SortingGameStep onGameComplete={() => handleStepCompletion(1)} />}
            {currentStep === 2 && <SelfEmployedTypes onQuizComplete={() => handleStepCompletion(2)} />}
            {currentStep === 3 && <RestaurantExercise />}
            {currentStep === 4 && <SwotPractice onComplete={onComplete} />}
            <div className="flex justify-between mt-8">
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl">הקודם</button>
                <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length - 1} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 text-2xl">הבא</button>
            </div>
        </ModuleView>
    );
};

export default SelfEmployedModule;