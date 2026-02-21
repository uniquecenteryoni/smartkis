import React, { useState, useEffect } from 'react';
import ModuleView from '../ModuleView';
import { getCostOfLivingInfo } from '../../services/geminiService';

interface ExpensesModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// New Rich Icons
const RichPiggyBankIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" x1="32" x2="32" y1="18" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#fbbf24" offset="0"/><stop stopColor="#f59e0b" offset="1"/></linearGradient></defs><rect width="48" height="32" x="8" y="18" fill="url(#a)" rx="16" ry="16"/><circle cx="48" cy="26" r="5" fill="#fcd34d"/><rect width="4" height="10" x="18" y="46" fill="#d97706" rx="2" ry="2"/><rect width="4" height="10" x="42" y="46" fill="#d97706" rx="2" ry="2"/><path d="M12 28a8 8 0 0 1 8-8" fill="none" stroke="#d97706" strokeWidth="4"/><path fill="#fff" d="M28 22h8v2h-8z"/><path fill="#fff" d="M30 20h4v6h-4z"/></svg>
);
const RichShoppingBagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="b" x1="32" x2="32" y1="16" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="#67e8f9" offset="0"/><stop stopColor="#01b2cf" offset="1"/></linearGradient></defs><path fill="url(#b)" d="M52 16H12a4 4 0 0 0-4 4v34a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V20a4 4 0 0 0-4-4z"/><path d="M24 16a8 8 0 0 1 8-8h0a8 8 0 0 1 8 8v8H24z" fill="none" stroke="#0891b2" strokeWidth="6"/><circle cx="20" cy="30" r="5" fill="#f472b6"/><circle cx="32" cy="40" r="7" fill="#a3e635"/><rect width="12" height="12" x="38" y="26" fill="#fbbf24" rx="3" ry="3" transform="rotate(15 44 32)"/></svg>
);
const FoundationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M54 58H10a4 4 0 0 1-4-4V24l24-18 24 18v30a4 4 0 0 1-4 4z" fill="#f472b6"/><path d="M50 54H14a2 2 0 0 1-2-2V26l20-15 20 15v26a2 2 0 0 1-2 2z" fill="#f8fafc"/><path d="M32 23a9 9 0 0 1 9 9c0 4-4 8-9 12-5-4-9-8-9-12a9 9 0 0 1 9-9z" fill="#ef4444"/></svg>
);
const ChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="52" x="8" y="6" fill="#67e8f9" rx="6"/><rect width="40" height="44" x="12" y="10" fill="#f8fafc" rx="2"/><path d="M22 24h20v4H22zm0 12h20v4H22z" fill="#0e7490"/><path d="M18 22a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-2 5v-2h4v2h-4z" fill="#34d399"/><path d="M18 34a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-2 5v-2h4v2h-4z" fill="#34d399"/></svg>
);
const GiftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="36" x="8" y="22" fill="#34d399" rx="4"/><rect width="12" height="40" x="26" y="18" fill="#a3e635"/><path d="M18 18c0-8 4-8 14-8s14 0 14 8" fill="none" stroke="#a3e635" strokeWidth="8" strokeLinecap="round"/><rect width="52" height="8" x="6" y="28" fill="#a3e635" rx="4"/></svg>
);


type Category = 'fixed' | 'variable';
interface ExpenseItem {
  id: number;
  name: string;
  category: Category;
}

const initialItems: ExpenseItem[] = [
    { id: 1, name: 'מנוי לנטפליקס', category: 'fixed' },
    { id: 2, name: 'יציאה לסרט', category: 'variable' },
    { id: 3, name: 'חשבון סלולר', category: 'fixed' },
    { id: 4, name: 'קניית פיצה', category: 'variable' },
    { id: 5, name: 'שיעור נהיגה', category: 'fixed' },
    { id: 6, name: 'בגדים', category: 'variable' },
    { id: 7, name: 'שכר דירה', category: 'fixed' },
    { id: 8, name: 'מנוי לחדר כושר', category: 'fixed' },
    { id: 9, name: 'מתנות יום הולדת', category: 'variable' },
    { id: 10, name: 'תחבורה ציבורית', category: 'variable' },
    { id: 11, name: 'ארנונה', category: 'fixed' },
    { id: 12, name: 'דלק לרכב', category: 'variable' },
    { id: 13, name: 'ביטוח רכב', category: 'fixed' },
    { id: 14, name: 'קניות בסופר', category: 'variable' },
    { id: 15, name: 'חוג העשרה', category: 'fixed' },
    { id: 16, name: 'תרופות', category: 'variable' },
    { id: 17, name: 'ועד בית', category: 'fixed' },
    { id: 18, name: 'חופשה', category: 'variable' },
    { id: 19, name: 'אינטרנט וטלוויזיה', category: 'fixed' },
    { id: 20, name: 'תיקונים בבית', category: 'variable' },
];

type HatzarCategory = 'חייב' | 'צריך' | 'רוצה';
interface HatzarExpenseItem {
  id: number;
  name: string;
  hatzarCategory: HatzarCategory[];
}

const hatzarInitialItems: HatzarExpenseItem[] = [
    { id: 1, name: 'מנוי לנטפליקס', hatzarCategory: ['רוצה'] },
    { id: 2, name: 'יציאה לסרט', hatzarCategory: ['רוצה'] },
    { id: 3, name: 'חשבון סלולר', hatzarCategory: ['צריך'] },
    { id: 4, name: 'קניית פיצה', hatzarCategory: ['רוצה'] },
    { id: 5, name: 'שיעור נהיגה', hatzarCategory: ['צריך'] },
    { id: 6, name: 'בגדים', hatzarCategory: ['חייב', 'צריך', 'רוצה'] },
    { id: 7, name: 'שכר דירה', hatzarCategory: ['חייב'] },
    { id: 8, name: 'מנוי לחדר כושר', hatzarCategory: ['צריך', 'רוצה'] },
    { id: 9, name: 'מתנת יום הולדת', hatzarCategory: ['חייב', 'צריך', 'רוצה'] },
    { id: 10, name: 'תחבורה ציבורית', hatzarCategory: ['חייב', 'צריך'] },
    { id: 11, name: 'ארנונה', hatzarCategory: ['חייב'] },
    { id: 12, name: 'דלק לרכב', hatzarCategory: ['חייב', 'צריך'] },
    { id: 13, name: 'ביטוח רכב', hatzarCategory: ['חייב'] },
    { id: 14, name: 'קניות בסופר', hatzarCategory: ['חייב'] },
    { id: 15, name: 'חוג העשרה', hatzarCategory: ['רוצה'] },
    { id: 16, name: 'תרופות', hatzarCategory: ['חייב'] },
    { id: 17, name: 'ועד בית', hatzarCategory: ['חייב'] },
    { id: 18, name: 'חופשה', hatzarCategory: ['רוצה', 'צריך'] },
    { id: 19, name: 'אינטרנט וטלוויזיה', hatzarCategory: ['חייב', 'צריך'] },
    { id: 20, name: 'תיקונים בבית', hatzarCategory: ['חייב'] },
];

const steps = [
  "מהן סוגי ההוצאות?",
  "אתגר מיון: חלק 1",
  "מודל חצ\"ר",
  "אתגר מיון: חלק 2",
  "סורק המחירים"
];

const ExpensesModule: React.FC<ExpensesModuleProps> = ({ onBack, title, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // State for game 1 (fixed/variable)
  const [items, setItems] = useState([...initialItems].sort(() => Math.random() - 0.5));
  const [droppedItems, setDroppedItems] = useState<{[key: number]: { category: Category, isCorrect: boolean }}>({});
  const [game1Score, setGame1Score] = useState<number | null>(null);
  
  // State for game 2 (Hatzar)
  const [hatzarItems, setHatzarItems] = useState([...hatzarInitialItems].sort(() => Math.random() - 0.5));
  const [hatzarDroppedItems, setHatzarDroppedItems] = useState<{[key: number]: { category: HatzarCategory, isCorrect: boolean }}>({});
  const [game2Score, setGame2Score] = useState<number | null>(null);

  // State for AI scanner
  const [searchTerm, setSearchTerm] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const game1Completed = game1Score !== null && game1Score >= 16; // 80% of 20
  const game2Completed = game2Score !== null && game2Score >= 16;

  useEffect(() => {
    if (Object.keys(droppedItems).length === initialItems.length) {
        const score = (Object.values(droppedItems) as {isCorrect: boolean}[]).filter(f => f.isCorrect).length;
        setGame1Score(score);
    }
  }, [droppedItems]);

  useEffect(() => {
    if (Object.keys(hatzarDroppedItems).length === hatzarInitialItems.length) {
        const score = (Object.values(hatzarDroppedItems) as {isCorrect: boolean}[]).filter(f => f.isCorrect).length;
        setGame2Score(score);
        if (score >= 16) {
            onComplete();
        }
    }
  }, [hatzarDroppedItems, onComplete]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ExpenseItem | HatzarExpenseItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCategory: Category) => {
    e.preventDefault();
    const item: ExpenseItem = JSON.parse(e.dataTransfer.getData('application/json'));
    if (droppedItems[item.id]) return;

    const isCorrect = item.category === targetCategory;
    setDroppedItems(prev => ({...prev, [item.id]: { category: targetCategory, isCorrect }}));
  };
  
  const handleHatzarDrop = (e: React.DragEvent<HTMLDivElement>, targetCategory: HatzarCategory) => {
    e.preventDefault();
    const item: HatzarExpenseItem = JSON.parse(e.dataTransfer.getData('application/json'));
    if (hatzarDroppedItems[item.id]) return;

    const isCorrect = item.hatzarCategory.includes(targetCategory);
    setHatzarDroppedItems(prev => ({...prev, [item.id]: { category: targetCategory, isCorrect }}));
  };
  
  const undropItem = (itemId: number) => {
    const itemToUnsort = initialItems.find(i => i.id === itemId);
    if (!itemToUnsort || items.some(i => i.id === itemId)) return;

    setItems(prev => [...prev, itemToUnsort].sort(() => Math.random() - 0.5));
    setDroppedItems(prev => {
        const newDropped = { ...prev };
        delete newDropped[itemId];
        return newDropped;
    });
    setGame1Score(null);
  };

  const undropHatzarItem = (itemId: number) => {
    const itemToUnsort = hatzarInitialItems.find(i => i.id === itemId);
    if (!itemToUnsort || hatzarItems.some(i => i.id === itemId)) return;

    setHatzarItems(prev => [...prev, itemToUnsort].sort(() => Math.random() - 0.5));
    setHatzarDroppedItems(prev => {
        const newDropped = { ...prev };
        delete newDropped[itemId];
        return newDropped;
    });
    setGame2Score(null);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setAiAnswer('');
    const answer = await getCostOfLivingInfo(searchTerm);
    setAiAnswer(answer);
    setIsLoading(false);
  };
  
  const resetGames = () => {
      setItems([...initialItems].sort(() => Math.random() - 0.5));
      setDroppedItems({});
      setGame1Score(null);
      setHatzarItems([...hatzarInitialItems].sort(() => Math.random() - 0.5));
      setHatzarDroppedItems({});
      setGame2Score(null);
  }
  
  const itemsToSort1 = items.filter(i => !droppedItems[i.id]);
  const hatzarItemsToSort = hatzarItems.filter(i => !hatzarDroppedItems[i.id]);
  
  const renderStepContent = () => {
    switch(currentStep) {
        case 0: return (
            <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
                <h3 className="text-5xl font-bold text-brand-teal mb-4 text-center">מהן סוגי ההוצאות?</h3>
                <p className="text-center text-3xl mb-8 text-brand-dark-blue/90 max-w-3xl mx-auto">כדי לנהל את ההוצאות שלנו בצורה חכמה, הצעד הראשון הוא להבין לאן הכסף הולך. דרך מצוינת לעשות זאת היא לחלק את ההוצאות לקטגוריות. שתי הקטגוריות העיקריות והחשובות ביותר הן:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/60 p-6 rounded-xl border-2 border-brand-light-blue text-center">
                        <RichPiggyBankIcon className="w-24 h-24 mx-auto text-brand-light-blue" />
                        <h4 className="text-4xl font-bold text-brand-light-blue mt-3 mb-2">הוצאות קבועות</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">אלו הוצאות שאתם משלמים באופן קבוע (לרוב כל חודש), והסכום שלהן נשאר זהה או כמעט זהה. למשל: שכר דירה, חשבון סלולר, מנוי לנטפליקס.</p>
                    </div>
                    <div className="bg-white/60 p-6 rounded-xl border-2 border-brand-magenta text-center">
                        <RichShoppingBagIcon className="w-24 h-24 mx-auto text-brand-magenta" />
                        <h4 className="text-4xl font-bold text-brand-magenta mt-3 mb-2">הוצאות משתנות</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">אלו הוצאות שהסכום שלהן משתנה, והן תלויות בבחירות שלכם. למשל: בילויים, מסעדות, בגדים, קניות בסופר. כאן נמצא המפתח לחיסכון!</p>
                    </div>
                </div>
            </div>
        );
        case 1: return (
            <div>
                <h3 className="text-5xl font-bold mb-2 text-center text-brand-dark-blue">אתגר מיון: חלק 1</h3>
                <p className="text-center text-3xl mb-4 text-brand-dark-blue/80">גררו כל כרטיסייה לסל המתאים.</p>
                 <div className="mt-4 mb-4 p-3 bg-yellow-100/60 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg text-2xl">
                    <p className="font-bold">💡 שימו לב:</p>
                    <p>לעיתים, ההבחנה בין הוצאה קבועה למשתנה היא אישית. לדוגמה, 'קניות בסופר' יכולה להיות קבועה אם מקפידים על תקציב, או משתנה אם קונים לפי החשק.</p>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30">
                   <div className="min-h-[100px] bg-white/30 p-4 rounded-2xl mb-6">
                        <h4 className="text-center font-bold text-2xl mb-4">כרטיסיות למיון ({itemsToSort1.length})</h4>
                        <div className="flex flex-wrap justify-center gap-4">
                            {itemsToSort1.map(item => (
                                <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} className="bg-cyan-100/70 shadow-md p-3 rounded-xl cursor-grab hover:bg-cyan-200 transition-colors transform hover:-translate-y-1 text-2xl">
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div onDrop={(e) => handleDrop(e, 'fixed')} onDragOver={handleDragOver} className="min-h-[200px] p-4 bg-brand-light-blue/10 rounded-2xl border-2 border-dashed border-brand-light-blue">
                           <div className="flex items-center justify-center gap-2 mb-4">
                               <RichPiggyBankIcon className="w-16 h-16 text-brand-light-blue" />
                               <h4 className="font-bold text-4xl text-brand-light-blue">הוצאות קבועות</h4>
                           </div>
                           <div className="space-y-2 text-2xl">
                              {(Object.entries(droppedItems) as [string, { category: Category; isCorrect: boolean }][]).filter(([, val]) => val.category === 'fixed').map(([id, val]) => {
                                const item = initialItems.find(i => i.id === Number(id));
                                return (
                                    <div key={id} onClick={() => undropItem(Number(id))} className={`flex items-center justify-between p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-fade-in cursor-pointer`}>
                                        <span>{item?.name}</span>
                                        <span>{val.isCorrect ? '✔️' : '❌'}</span>
                                    </div>
                                )
                              })}
                            </div>
                        </div>
                        <div onDrop={(e) => handleDrop(e, 'variable')} onDragOver={handleDragOver} className="min-h-[200px] p-4 bg-brand-magenta/10 rounded-2xl border-2 border-dashed border-brand-magenta">
                            <div className="flex items-center justify-center gap-2 mb-4">
                               <RichShoppingBagIcon className="w-16 h-16 text-brand-magenta" />
                               <h4 className="font-bold text-4xl text-brand-magenta">הוצאות משתנות</h4>
                            </div>
                             <div className="space-y-2 text-2xl">
                              {(Object.entries(droppedItems) as [string, { category: Category; isCorrect: boolean }][]).filter(([, val]) => val.category === 'variable').map(([id, val]) => {
                                const item = initialItems.find(i => i.id === Number(id));
                                return (
                                    <div key={id} onClick={() => undropItem(Number(id))} className={`flex items-center justify-between p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-fade-in cursor-pointer`}>
                                        <span>{item?.name}</span>
                                        <span>{val.isCorrect ? '✔️' : '❌'}</span>
                                    </div>
                                )
                              })}
                            </div>
                        </div>
                    </div>
                    {game1Score !== null && 
                        <div className="text-center mt-6">
                            <p className={`text-3xl font-bold ${game1Completed ? 'text-green-600' : 'text-red-600'}`}>
                                {game1Completed ? `כל הכבוד! סיימתם עם ${game1Score} תשובות נכונות. אפשר להמשיך!` : `סיימתם למיין עם ${game1Score} תשובות נכונות. נסו שוב כדי להגיע ל-80% דיוק.`}
                            </p>
                            {!game1Completed && <button onClick={resetGames} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-2xl">שחק שוב</button>}
                        </div>
                    }
               </div>
            </div>
        );
        case 2: return (
             <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
                <h3 className="text-5xl font-bold text-brand-teal mb-6 text-center">מודל חצ"ר: חייב, צריך, רוצה</h3>
                 <p className="text-center text-2xl mb-8 text-brand-dark-blue/90">זוהי דרך פשוטה לתעדף את ההוצאות שלכם ולהבין איפה אפשר לחסוך.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-pink-50 to-white/60 p-6 rounded-xl border-2 border-brand-magenta text-center shadow-xl transform hover:-translate-y-1.5 transition-transform duration-300">
                        <FoundationIcon className="w-20 h-20 mx-auto" />
                        <h4 className="text-4xl font-bold text-brand-magenta mt-3 mb-2">חייב</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">הוצאות שלא ניתן לוותר עליהן בשום מצב. למשל: שכר דירה, חשבונות בסיסיים, אוכל, תרופות.</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-white/60 p-6 rounded-xl border-2 border-brand-light-blue text-center shadow-xl transform hover:-translate-y-1.5 transition-transform duration-300">
                        <ChecklistIcon className="w-20 h-20 mx-auto" />
                        <h4 className="text-4xl font-bold text-brand-light-blue mt-3 mb-2">צריך</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">הוצאות חשובות שמשפרות את איכות החיים, אבל אפשר להתגמש איתן. למשל: אינטרנט, תחבורה, בגדים.</p>
                    </div>
                     <div className="bg-gradient-to-br from-teal-50 to-white/60 p-6 rounded-xl border-2 border-brand-teal text-center shadow-xl transform hover:-translate-y-1.5 transition-transform duration-300">
                        <GiftIcon className="w-20 h-20 mx-auto" />
                        <h4 className="text-4xl font-bold text-brand-teal mt-3 mb-2">רוצה</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">הוצאות שהן מותרות וכיף, אבל הן לא חיוניות. למשל: בילויים, חופשות, מסעדות. כאן הכי קל לקצץ ולחסוך!</p>
                    </div>
                </div>
            </div>
        );
        case 3: return (
            <div>
                 <h3 className="text-5xl font-bold mb-2 text-center text-brand-dark-blue">אתגר מיון: חלק 2</h3>
                 <p className="text-center text-3xl mb-4 text-brand-dark-blue/80">עכשיו, בואו נמיין את ההוצאות לפי מודל חצ"ר.</p>
                 <div className="mt-4 mb-4 p-3 bg-yellow-100/60 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg text-2xl">
                    <p className="font-bold">💡 חשוב לזכור:</p>
                    <p>המיון כאן הוא המלצה בלבד. מה שנחשב 'צריך' עבור אדם אחד, יכול להיות 'חייב' או 'רוצה' עבור אדם אחר. הכל תלוי בסדר העדיפויות האישי שלכם!</p>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30">
                    <div className="min-h-[100px] bg-white/30 p-4 rounded-2xl mb-6">
                        <h4 className="text-center font-bold text-2xl mb-4">כרטיסיות למיון ({hatzarItemsToSort.length})</h4>
                        <div className="flex flex-wrap justify-center gap-4">
                            {hatzarItemsToSort.map(item => (
                                <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} className="bg-cyan-100/70 shadow-md p-3 rounded-xl cursor-grab hover:bg-cyan-200 transition-colors transform hover:-translate-y-1 text-2xl">
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                         <div onDrop={(e) => handleHatzarDrop(e, 'חייב')} onDragOver={handleDragOver} className="min-h-[200px] p-4 bg-brand-magenta/10 rounded-2xl border-2 border-dashed border-brand-magenta">
                            <div className="flex items-center justify-center gap-2 mb-4">
                               <FoundationIcon className="w-16 h-16" />
                               <h4 className="font-bold text-4xl text-brand-magenta">חייב</h4>
                            </div>
                            <div className="space-y-2 text-2xl">
                              {(Object.entries(hatzarDroppedItems) as [string, { category: HatzarCategory; isCorrect: boolean }][]).filter(([, val]) => val.category === 'חייב').map(([id, val]) => {
                                const item = hatzarInitialItems.find(i => i.id === Number(id));
                                return <div key={id} onClick={() => undropHatzarItem(Number(id))} className={`flex items-center justify-between p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-fade-in cursor-pointer`}><span>{item?.name}</span><span>{val.isCorrect ? '✔️' : '❌'}</span></div>
                              })}
                            </div>
                         </div>
                         <div onDrop={(e) => handleHatzarDrop(e, 'צריך')} onDragOver={handleDragOver} className="min-h-[200px] p-4 bg-brand-light-blue/10 rounded-2xl border-2 border-dashed border-brand-light-blue">
                            <div className="flex items-center justify-center gap-2 mb-4">
                               <ChecklistIcon className="w-16 h-16" />
                               <h4 className="font-bold text-4xl text-brand-light-blue">צריך</h4>
                            </div>
                            <div className="space-y-2 text-2xl">
                              {(Object.entries(hatzarDroppedItems) as [string, { category: HatzarCategory; isCorrect: boolean }][]).filter(([, val]) => val.category === 'צריך').map(([id, val]) => {
                                const item = hatzarInitialItems.find(i => i.id === Number(id));
                                return <div key={id} onClick={() => undropHatzarItem(Number(id))} className={`flex items-center justify-between p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-fade-in cursor-pointer`}><span>{item?.name}</span><span>{val.isCorrect ? '✔️' : '❌'}</span></div>
                              })}
                            </div>
                         </div>
                         <div onDrop={(e) => handleHatzarDrop(e, 'רוצה')} onDragOver={handleDragOver} className="min-h-[200px] p-4 bg-brand-teal/10 rounded-2xl border-2 border-dashed border-brand-teal">
                            <div className="flex items-center justify-center gap-2 mb-4">
                               <GiftIcon className="w-16 h-16" />
                               <h4 className="font-bold text-4xl text-brand-teal">רוצה</h4>
                            </div>
                            <div className="space-y-2 text-2xl">
                              {(Object.entries(hatzarDroppedItems) as [string, { category: HatzarCategory; isCorrect: boolean }][]).filter(([, val]) => val.category === 'רוצה').map(([id, val]) => {
                                const item = hatzarInitialItems.find(i => i.id === Number(id));
                                return <div key={id} onClick={() => undropHatzarItem(Number(id))} className={`flex items-center justify-between p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-fade-in cursor-pointer`}><span>{item?.name}</span><span>{val.isCorrect ? '✔️' : '❌'}</span></div>
                              })}
                            </div>
                         </div>
                    </div>
                    {game2Score !== null && 
                        <div className="text-center mt-6">
                            <p className={`text-3xl font-bold ${game2Completed ? 'text-green-600' : 'text-red-600'}`}>
                                {game2Completed ? `כל הכבוד! סיימתם עם ${game2Score} תשובות נכונות והשלמתם את המודול!` : `סיימתם למיין עם ${game2Score} תשובות נכונות. נסו שוב כדי להגיע ל-80% דיוק.`}
                            </p>
                            {!game2Completed && <button onClick={resetGames} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-2xl">שחק שוב</button>}
                        </div>
                    }
                </div>
            </div>
        );
        case 4: return (
             <div>
                <h3 className="text-5xl font-bold mb-4 text-center text-brand-dark-blue">סורק המחירים</h3>
                <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-3xl max-w-2xl mx-auto">
                    <p className="mb-6 text-center text-3xl text-brand-dark-blue/80">רוצים לדעת מה העלות הממוצעת של משהו? הקלידו כאן וה-AI יסרוק את המידע עבורכם.</p>
                    <div className="bg-brand-dark-blue p-6 rounded-2xl shadow-inner">
                        <div className="bg-gray-800 p-4 rounded-lg text-center text-4xl font-mono text-cyan-300 min-h-[60px] flex items-center justify-center mb-4 border-2 border-gray-600">
                            {isLoading ? 'סורק...' : (aiAnswer || '...')}
                        </div>
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="לדוגמה: רישיון נהיגה, מנת פלאפל" 
                                className="w-full bg-gray-700 text-white p-3 rounded-lg border-2 border-gray-600 focus:border-brand-teal focus:ring-0 text-2xl"
                            />
                            <button 
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="bg-brand-magenta hover:bg-pink-700 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 text-2xl"
                            >
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <span>סרוק</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
        default: return null;
    }
  }

  return (
    <ModuleView title={title} onBack={onBack}>
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

        <div className="flex justify-between mt-8 text-2xl">
            <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-8 rounded-lg disabled:opacity-50">הקודם</button>
            <button 
                onClick={() => setCurrentStep(s => s + 1)} 
                disabled={currentStep === steps.length - 1 || (currentStep === 1 && !game1Completed) || (currentStep === 3 && !game2Completed)}
                className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {
                   (currentStep === 1 && !game1Completed) ? "השלימו את המשימה" : 
                   (currentStep === 3 && !game2Completed) ? "השלימו את המשימה" : "הבא"
                }
            </button>
        </div>
    </ModuleView>
  );
};

export default ExpensesModule;
