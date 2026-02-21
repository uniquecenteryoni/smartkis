import React, { useState, useEffect } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

interface Item {
    id: number;
    name: string;
    price: number;
    icon: string;
}

const storeItems: Item[] = [
    { id: 1, name: 'חלב', price: 7, icon: '🥛' },
    { id: 6, name: 'שוקולד', price: 6, icon: '🍫' },
    { id: 2, name: 'לחם', price: 8, icon: '🍞' },
    { id: 7, name: 'מיץ', price: 9, icon: '🧃' },
    { id: 3, name: 'ביצים', price: 13, icon: '🥚' },
    { id: 5, name: 'תפוח', price: 2, icon: '🍎' },
    { id: 8, name: 'גלידה', price: 25, icon: '🍦' },
    { id: 4, name: 'גבינה', price: 15, icon: '🧀' },
    { id: 9, name: 'בננה', price: 3, icon: '🍌' },
    { id: 10, name: 'עוגה', price: 20, icon: '🍰' },
    { id: 11, name: 'מים', price: 4, icon: '💧' },
    { id: 12, name: 'יוגורט', price: 5, icon: '🍦' },
];

const shoppingList = ['חלב', 'לחם', 'ביצים', 'גבינה', 'תפוח'];
const INITIAL_BUDGET = 60;

const AnimatedWallet: React.FC<{ budget: number; initialBudget: number }> = ({ budget, initialBudget }) => {
    const fillPercentage = Math.max(0, (budget / initialBudget) * 100);
    // Scale from 0.9 (thin) to 1.0 (full) on the Y axis to simulate thickness
    const thicknessScale = 0.9 + (fillPercentage / 100) * 0.1;

    return (
        <div className="bg-white/60 p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center h-full">
            <h4 className="text-3xl font-bold text-yellow-800">הארנק</h4>
            <div className="relative w-40 h-28 my-4" style={{ perspective: '800px' }}>
                {/* Wallet Body */}
                <div 
                    className="relative w-full h-full bg-amber-800 rounded-lg shadow-inner border-2 border-amber-900 origin-bottom transition-transform duration-500 ease-in-out"
                    style={{ transform: `scaleY(${thicknessScale})` }}
                >
                    {/* Money inside that slides up */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] h-24 transition-transform duration-500 ease-out"
                         style={{ transform: `translateY(${100 - fillPercentage}%)` }}>
                        {/* Coins */}
                        <div className={`absolute bottom-2 left-2 w-8 h-8 rounded-full bg-yellow-500 border-2 border-yellow-700 transition-opacity duration-300 ${fillPercentage < 20 ? 'opacity-0' : 'opacity-100'}`}></div>
                        <div className={`absolute bottom-2 left-8 w-6 h-6 rounded-full bg-gray-400 border-2 border-gray-600 transition-opacity duration-300 ${fillPercentage < 40 ? 'opacity-0' : 'opacity-100'}`}></div>
                        
                        {/* Bills */}
                        <div className={`absolute bottom-0 right-0 w-24 h-20 bg-green-500 rounded-t-md border-2 border-green-700 transition-opacity duration-300 ${fillPercentage < 10 ? 'opacity-0' : 'opacity-100'}`}></div>
                        <div className={`absolute bottom-0 right-2 w-24 h-20 bg-green-600 rounded-t-md border-2 border-green-800 transform -rotate-3 transition-opacity duration-300 ${fillPercentage < 60 ? 'opacity-0' : 'opacity-100'}`}></div>
                        <div className={`absolute bottom-0 right-1 w-24 h-20 bg-green-500 rounded-t-md border-2 border-green-700 transform rotate-2 transition-opacity duration-300 ${fillPercentage < 80 ? 'opacity-0' : 'opacity-100'}`}></div>
                    </div>
                    {/* Wallet opening slit */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-amber-900"></div>
                </div>
            </div>
            <p className="text-5xl font-bold text-green-600 drop-shadow-md">{budget.toFixed(0)} ₪</p>
        </div>
    );
};


const ShoppingCart: React.FC<{ items: Item[] }> = ({ items }) => {
    return (
        <div className="bg-white/60 p-6 rounded-2xl shadow-lg border border-white/50 h-full flex flex-col">
            <h4 className="text-3xl font-bold text-yellow-800 mb-4">העגלה</h4>
            <div className="relative w-full flex-grow">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-500 drop-shadow-lg">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <div className="absolute top-[25%] left-[15%] right-[15%] h-[40%] grid grid-cols-4 gap-1 items-start content-start overflow-hidden">
                    {items.length > 0 ? items.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="relative flex justify-center items-center animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            <span className="text-3xl drop-shadow-md">{item.icon}</span>
                        </div>
                    )) : (
                       <div className="col-span-4 text-center text-gray-500 text-lg pt-4">העגלה ריקה</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MagicStoreModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [cart, setCart] = useState<Item[]>([]);
    const [budget, setBudget] = useState(INITIAL_BUDGET);
    const [message, setMessage] = useState('לחצו על "התחל קניות" והוסיפו את המוצרים מהרשימה!');
    const [isFinished, setIsFinished] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const addToCart = (item: Item) => {
        if (isFinished || !gameStarted || cart.some(cartItem => cartItem.id === item.id)) return;
        
        if (budget - item.price >= 0) {
            setBudget(prev => prev - item.price);
            setCart(prev => [...prev, item]);
            setMessage(`${item.name} בסל!`);
        } else {
            setMessage('אוי! אין מספיק כסף בארנק!');
        }
    };
    
    const finishShopping = () => {
        const hasAllItems = shoppingList.every(itemName => cart.some(cartItem => cartItem.name === itemName));
        if (hasAllItems) {
            setMessage(`כל הכבוד! קניתם הכל ונשאר לכם ${budget.toFixed(2)} שקלים!`);
            onComplete();
        } else {
            const missingItems = shoppingList.filter(itemName => !cart.some(cartItem => cartItem.name === itemName));
            setMessage(`אופס, שכחתם: ${missingItems.join(', ')}. נסו שוב!`);
        }
        setIsFinished(true);
        setGameStarted(false);
    };
    
    const restart = () => {
        setCart([]);
        setBudget(INITIAL_BUDGET);
        setMessage('לחצו על "התחל קניות" והוסיפו את המוצרים מהרשימה!');
        setIsFinished(false);
        setGameStarted(false);
    };

    return (
        <ModuleView title={title} onBack={onBack}>
             <style>{`
                .conveyor-belt.running {
                    position: absolute;
                    animation: conveyor 20s linear infinite;
                }
                @keyframes conveyor {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
            <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                <h3 className="text-4xl font-bold text-brand-teal mb-4">מסוע הקניות!</h3>
                <div className="my-6 bg-white/50 p-6 rounded-2xl max-w-3xl mx-auto shadow-inner border border-white/50">
                     <h4 className="text-3xl font-bold mb-2 text-brand-dark-blue">איך קונים חכם? 🛒</h4>
                     <p className="text-[1.65rem] leading-relaxed">כדי לא לבזבז יותר מדי כסף, חשוב להגיע לחנות עם שני דברים: <strong>תקציב</strong> (כמה כסף מותר לנו להוציא) ו<strong>רשימת קניות</strong>. ככה נקנה רק מה שאנחנו צריכים ולא נתפתה!</p>
                </div>
                <p className="text-2xl text-brand-dark-blue/90 mb-6">
                    תפסו את המוצרים מהרשימה כשהם עוברים על המסוע.
                </p>

                <div className="flex flex-col gap-6">
                    {/* Conveyor */}
                    <div className="bg-white/40 p-6 rounded-2xl shadow-lg border border-white/50">
                         <h4 className="text-3xl font-bold mb-4">המסוע</h4>
                         <div className="relative h-48 bg-gray-700 rounded-lg p-2 flex items-center overflow-hidden border-4 border-gray-800 shadow-inner">
                             <div className="absolute inset-0 bg-repeat-x opacity-20" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/metal-grip.png)'}}></div>
                             <div className={`conveyor-belt flex items-center gap-8 ${gameStarted ? 'running' : ''}`}>
                                {[...storeItems, ...storeItems].map((item, index) => {
                                     const inCart = cart.some(c => c.id === item.id);
                                     return (
                                         <div key={`${item.id}-${index}`} onClick={() => addToCart(item)} 
                                         className={`text-center p-4 rounded-2xl transition-all duration-300 bg-white/90 shadow-lg flex-shrink-0 w-32 h-36 flex flex-col justify-center items-center transform 
                                         ${inCart || !gameStarted ? 'opacity-40' : 'cursor-pointer hover:scale-110 hover:-translate-y-2'}`}>
                                            <span className="text-6xl drop-shadow-md">{item.icon}</span>
                                            <p className="font-bold text-xl">{item.name}</p>
                                            <p className="font-bold text-lg text-brand-teal">{item.price} ₪</p>
                                        </div>
                                     );
                                })}
                             </div>
                         </div>
                    </div>
                    
                    {/* Wallet, Cart & List Section */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                        <div className="bg-white/60 p-6 rounded-2xl shadow-lg border border-white/50">
                            <h4 className="text-3xl font-bold text-yellow-800">הרשימה</h4>
                            <ul className="text-2xl mt-2 space-y-2 text-left">
                                {shoppingList.map(item => (
                                    <li key={item} className={`transition-colors flex items-center gap-3 ${cart.some(c => c.name === item) ? 'line-through text-gray-500' : ''}`}>
                                        <div className="w-7 h-7 border-2 border-gray-400 rounded-md flex items-center justify-center flex-shrink-0">
                                            {cart.some(c => c.name === item) && <span className="text-green-600 font-bold">✔</span>}
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <AnimatedWallet budget={budget} initialBudget={INITIAL_BUDGET} />
                        <ShoppingCart items={cart} />
                    </div>

                    {/* Buttons & Message */}
                     <div className="mt-4">
                        <div className="flex justify-center gap-4">
                            {isFinished ? (
                                <button onClick={restart} className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-2xl text-2xl shadow-lg hover:scale-105 transform transition-transform">קנייה חדשה</button>
                            ) : !gameStarted ? (
                                <button onClick={() => setGameStarted(true)} className="bg-brand-magenta text-white font-bold py-3 px-8 rounded-2xl text-2xl shadow-lg hover:scale-105 transform transition-transform">התחל קניות</button>
                            ) : (
                                <button onClick={finishShopping} className="bg-brand-teal text-white font-bold py-3 px-8 rounded-2xl text-2xl shadow-lg hover:scale-105 transform transition-transform">סיימתי, לקופה!</button>
                            )}
                        </div>
                        {message && <p className="mt-4 text-2xl font-bold text-brand-magenta bg-white/60 p-2 rounded-lg">{message}</p>}
                    </div>
                </div>
            </div>
        </ModuleView>
    );
};

export default MagicStoreModule;