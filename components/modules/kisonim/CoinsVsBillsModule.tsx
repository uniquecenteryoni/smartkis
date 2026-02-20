import React, { useState, useEffect } from 'react';
import ModuleView from '../../ModuleView';
import { TrophyIcon } from '../../icons/Icons';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const rounds = [
    { item: { name: 'תפוח', icon: '🍎', price: 3 }, paid: 5 },
    { item: { name: 'ארטיק', icon: '🍭', price: 7 }, paid: 10 },
    { item: { name: 'כדור', icon: '⚽', price: 12 }, paid: 20 },
    { item: { name: 'ספר', icon: '📚', price: 36 }, paid: 50 },
    { item: { name: 'בובה', icon: '🧸', price: 68 }, paid: 100 },
];

const cashDrawerMoney = [
    { value: 1, type: 'coin' },
    { value: 2, type: 'coin' },
    { value: 5, type: 'coin' },
    { value: 10, type: 'coin' },
    { value: 20, type: 'bill' },
    { value: 50, type: 'bill' },
];

const Coin: React.FC<{ value: number; isSelected?: boolean }> = ({ value }) => (
    <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-yellow-800 border-4 border-yellow-700 shadow-lg`}>
        {value}
    </div>
);

const Bill: React.FC<{ value: number; isSelected?: boolean }> = ({ value }) => (
     <div className={`relative w-32 h-16 bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-3xl font-bold text-green-900 border-2 border-green-600 rounded-lg shadow-lg`}>
        {value} ₪
    </div>
);


const CoinsVsBillsModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
    const [currentRound, setCurrentRound] = useState(0);
    const [selectedChangeItems, setSelectedChangeItems] = useState<{value: number, id: number}[]>([]);
    const [message, setMessage] = useState<{text: string, type: 'correct' | 'incorrect' | 'info'} | null>(null);

    const roundData = rounds[currentRound];
    const requiredChange = roundData.paid - roundData.item.price;
    const currentChangeTotal = selectedChangeItems.reduce((sum, item) => sum + item.value, 0);

    const handleMoneyClick = (value: number) => {
        if (gameState !== 'playing' || message) return;
        setSelectedChangeItems(prev => [...prev, {value, id: Date.now() + Math.random()}]);
    };
    
    const handleUndo = () => {
        if (gameState !== 'playing' || message) return;
        setSelectedChangeItems(prev => prev.slice(0, -1));
    };

    const giveChange = () => {
        if (message || gameState !== 'playing') return;
        if (currentChangeTotal === requiredChange) {
            setMessage({text: 'עודף מדויק! כל הכבוד!', type: 'correct'});
            setTimeout(() => {
                if (currentRound < rounds.length - 1) {
                    setCurrentRound(prev => prev + 1);
                    setSelectedChangeItems([]);
                    setMessage(null);
                } else {
                    setGameState('finished');
                    onComplete();
                }
            }, 2000);
        } else {
            setMessage({text: `אופס! העודף לא נכון. נסו שוב.`, type: 'incorrect'});
            setTimeout(() => {
                setSelectedChangeItems([]);
                setMessage(null);
            }, 2000);
        }
    };
    
    const startGame = () => {
        setGameState('playing');
        setCurrentRound(0);
        setSelectedChangeItems([]);
        setMessage(null);
    }
    
    if (gameState === 'intro') {
        return (
             <ModuleView title={title} onBack={onBack}>
                <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                    <h3 className="text-4xl font-bold text-brand-teal mb-4">אתגר הקופאי!</h3>
                    <p className="text-2xl text-brand-dark-blue/90 mb-6">
                       אתם הקופאים בחנות! לקוח קונה מוצר ומשלם במזומן.
                       <br />
                       עליכם להחזיר לו עודף מדויק מהקופה.
                    </p>
                    <button onClick={startGame} className="bg-brand-magenta text-white font-bold py-4 px-10 rounded-2xl text-3xl shadow-lg hover:scale-105 transform transition-transform">
                        💰 פתח את הקופה 💰
                    </button>
                </div>
            </ModuleView>
        );
    }
    
    if (gameState === 'finished') {
        return (
            <ModuleView title={title} onBack={onBack}>
                 <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                    <TrophyIcon className="w-24 h-24 mx-auto text-yellow-500" />
                    <h3 className="text-4xl font-bold text-brand-teal my-4">כל הכבוד! אתם קופאים מעולים!</h3>
                    <p className="text-2xl text-brand-dark-blue/90 mb-8">
                       השלמתם את כל המשימות בהצלחה.
                    </p>
                    <button onClick={startGame} className="bg-brand-teal text-white font-bold py-3 px-8 rounded-2xl text-2xl shadow-lg hover:scale-105 transform transition-transform">
                        שחק שוב
                    </button>
                </div>
            </ModuleView>
        )
    }

    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="bg-white/40 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-xl border border-white/50 space-y-6">
                
                {/* Customer & Item Section */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white/50 p-6 rounded-2xl shadow-inner">
                    <div className="text-8xl">😊</div>
                    <div className="text-center">
                        <p className="text-2xl">הלקוח רוצה לקנות:</p>
                        <div className="bg-white p-4 rounded-xl shadow-lg my-2 inline-block">
                            <div className="text-7xl">{roundData.item.icon}</div>
                            <div className="font-bold text-2xl">{roundData.item.name}</div>
                            <div className="text-xl">{roundData.item.price} ₪</div>
                        </div>
                        <p className="text-2xl">והוא שילם ב:</p>
                        <div className="mt-2 inline-block"><Bill value={roundData.paid}/></div>
                    </div>
                </div>

                {/* Change Calculation Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white/50 p-6 rounded-2xl shadow-inner">
                    <div className="text-center">
                        <h4 className="text-3xl font-bold text-brand-magenta">צריך להחזיר עודף:</h4>
                        <p className="text-7xl font-bold text-brand-magenta drop-shadow-md">{requiredChange} ₪</p>
                    </div>
                    <div className="text-center">
                        <h4 className="text-3xl font-bold text-brand-dark-blue">העודף שבחרת:</h4>
                        <div className={`min-h-[80px] p-2 rounded-lg flex items-center justify-center ${message ? (message.type === 'correct' ? 'bg-green-200' : 'bg-red-200') : 'bg-gray-200'}`}>
                           <p className="text-7xl font-bold text-brand-dark-blue drop-shadow-md">{currentChangeTotal} ₪</p>
                        </div>
                    </div>
                </div>
                
                 {/* Cash Drawer Section */}
                <div className="bg-gray-800 p-6 rounded-3xl shadow-2xl">
                    <h4 className="text-3xl font-bold text-center mb-4 text-white">הקופה שלך</h4>
                    <div className="flex justify-center items-center flex-wrap gap-4 bg-gray-700 p-4 rounded-xl shadow-inner">
                        {cashDrawerMoney.map((item, index) => (
                           <button key={index} onClick={() => handleMoneyClick(item.value)} className="transition-transform duration-200 transform hover:scale-110 active:scale-95 disabled:opacity-50" disabled={!!message}>
                               {item.type === 'coin' ? <Coin value={item.value} /> : <Bill value={item.value} />}
                           </button>
                       ))}
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={giveChange} className="bg-brand-teal text-white font-bold py-4 px-10 rounded-2xl text-2xl shadow-lg hover:scale-105 transform transition-transform disabled:bg-gray-500" disabled={!!message}>
                            החזר עודף
                        </button>
                        <button onClick={handleUndo} className="bg-yellow-500 text-white font-bold py-4 px-6 rounded-2xl text-2xl shadow-lg hover:scale-105 transform transition-transform disabled:bg-gray-500" disabled={selectedChangeItems.length === 0 || !!message}>
                            בטל
                        </button>
                    </div>
                </div>

                {message && <p className={`mt-4 text-center text-3xl font-bold p-3 rounded-xl animate-fade-in ${message.type === 'correct' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{message.text}</p>}

            </div>
        </ModuleView>
    );
};

export default CoinsVsBillsModule;