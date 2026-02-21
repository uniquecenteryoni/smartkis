import React, { useState, useEffect } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

type GameState = 'intro' | 'day1_setup' | 'day1_results' | 'day2_setup' | 'day2_results' | 'day3_setup' | 'day3_results' | 'final';

interface DayResult {
    day: number;
    customers: number;
    earnings: number;
    profit: number;
    message: string;
    settings: {
        price: number;
        quality: number;
        supply?: number;
        advertising?: boolean;
    }
}

// --- Visual Components ---

const LemonadeStand: React.FC<{ day: number; advertising?: boolean }> = ({ day, advertising }) => {
    return (
        <div className="relative w-64 h-80 mx-auto">
            {/* Stand Base */}
            <div className="absolute bottom-10 w-full h-40 bg-yellow-300 border-4 border-yellow-500 rounded-lg shadow-lg">
                <div className="w-full h-8 bg-yellow-400 border-b-4 border-yellow-500 rounded-t-md"></div>
                <div className="absolute top-10 left-4 right-4 h-20 bg-yellow-200 border-2 border-yellow-400 rounded-md p-2">
                    <p className={`font-bold text-3xl text-yellow-800 transition-opacity duration-500 ${day > 0 ? 'opacity-100' : 'opacity-0'}`}>
                        {day < 3 || !advertising ? 'לימונדה' : 'SUPER לימונדה!'}
                    </p>
                </div>
            </div>
             {/* Pitcher */}
            <div className="absolute bottom-52 left-1/2 -translate-x-12 w-20 h-24">
                <div className="w-full h-full bg-cyan-200/70 rounded-b-2xl rounded-tl-2xl border-4 border-cyan-400"></div>
                <div className="absolute -right-4 top-4 w-6 h-12 border-4 border-cyan-400 rounded-full"></div>
                <div className="absolute bottom-0 w-full h-3/4 bg-yellow-400/80 rounded-b-xl"></div>
            </div>
            {/* Day 2+ Umbrella */}
            {day > 1 && (
                 <div className="absolute bottom-48 left-1/2 w-4 h-48 bg-gray-400 transition-all duration-500">
                    <div className="absolute top-0 -left-20 w-44 h-12 bg-red-500 rounded-t-full border-4 border-white"></div>
                    <div className="absolute top-0 -left-20 w-44 h-12 bg-white rounded-t-full border-4 border-white [clip-path:polygon(50%_0,100%_0,100%_100%,50%_100%)]"></div>
                </div>
            )}
             {/* Day 3 Advertising Sign */}
            {day === 3 && advertising && (
                <div className="absolute bottom-52 right-0 w-24 h-12 bg-pink-500 text-white font-bold text-lg rounded-lg transform -rotate-12 flex items-center justify-center animate-bounce border-4 border-white shadow-lg">
                    מבצע!
                </div>
            )}
        </div>
    );
};

const CustomSlider: React.FC<{label: string, value: number, min: number, max: number, onChange: (val: number) => void, labels: string[]}> = ({label, value, min, max, onChange, labels}) => (
    <div className="bg-white/70 p-4 rounded-xl shadow-inner border border-white/50">
        <label className="text-xl font-bold mb-2 block">{label}</label>
        <input 
            type="range" 
            min={min} 
            max={max} 
            value={value} 
            onChange={e => onChange(parseInt(e.target.value))} 
            className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-1 text-sm font-semibold">
            {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
    </div>
);

// --- Screen Components ---
const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="animate-fade-in text-center p-8">
        <h3 className="text-4xl font-bold text-brand-teal mb-4">אתגר דוכן הלימונדה!</h3>
        <p className="text-2xl text-brand-dark-blue/90 mb-8">
            אתם עומדים לנהל דוכן לימונדה במשך 3 ימים. בכל יום תלמדו משהו חדש על עסקים!
            <br/>
            המטרה: להרוויח כמה שיותר כסף. בהצלחה!
        </p>
        <button onClick={onStart} className="bg-brand-magenta text-white font-bold py-4 px-10 rounded-2xl text-3xl shadow-lg hover:scale-105 transform transition-transform">
            🍹 בואו נתחיל! 🍹
        </button>
    </div>
);

const SetupScreen: React.FC<{ 
    day: number;
    settings: any;
    setters: any;
    onStartDay: () => void;
    weather?: 'sunny' | 'cloudy';
}> = ({ day, settings, setters, onStartDay, weather }) => {
    const dayInfo: Record<number, {title: string, desc: string}> = {
        1: { title: "הגדרות ליום הראשון", desc: "התחלה טובה תלויה באיזון הנכון בין איכות המוצר למחיר שלו. מה תבחרו?" },
        2: { title: "הגדרות ליום השני", desc: "היום נלמד על היצע וביקוש! מזג האוויר משפיע על כמות הלקוחות. כמה כוסות כדאי להכין מראש?"},
        3: { title: "הגדרות ליום השלישי", desc: "היום נלמד על פרסום! האם שלט קטן יעזור לכם למכור יותר?"}
    };
    
    return (
        <div className="animate-fade-in">
             <div className="text-center mb-8">
                <h4 className="text-3xl font-bold mb-2 text-yellow-800">{dayInfo[day].title}</h4>
                <p className="text-xl">{dayInfo[day].desc}</p>
                 {weather && (
                    <p className="mt-2 text-2xl font-bold bg-white/60 p-2 rounded-xl shadow-inner inline-block">
                        תחזית להיום: {weather === 'sunny' ? 'יום שמשי ☀️ (ביקוש גבוה!)' : 'יום מעונן ☁️ (ביקוש נמוך!)'}
                    </p>
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-6">
                    <CustomSlider 
                        label="🍋 איכות הלימונדה (משפיע על עלות)"
                        value={settings.quality}
                        onChange={setters.setQuality}
                        min={1} max={3}
                        labels={['רגילה (1₪)', 'טובה (2₪)', 'פרימיום (3₪)']}
                    />
                    <CustomSlider 
                        label="💰 מחיר לכוס (משפיע על כמות הלקוחות)"
                        value={settings.price}
                        onChange={setters.setPrice}
                        min={1} max={3}
                        labels={['זול (3₪)', 'הוגן (4₪)', 'יקר (5₪)']}
                    />
                    {day > 1 && (
                         <CustomSlider 
                            label="📦 היצע (כמה כוסות להכין מראש?)"
                            value={settings.supply}
                            onChange={setters.setSupply}
                            min={5} max={40}
                            labels={['5', '40']}
                        />
                    )}
                     {day === 3 && (
                        <div className="bg-white/70 p-4 rounded-xl shadow-inner border border-white/50">
                            <label className="text-xl font-bold mb-2 block">📣 פרסום (הכנת שלט בעלות 5₪)</label>
                             <div className="flex justify-center items-center gap-4">
                                <button onClick={() => setters.setAdvertising(false)} className={`py-2 px-6 rounded-lg font-bold text-lg ${!settings.advertising ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>לא</button>
                                <button onClick={() => setters.setAdvertising(true)} className={`py-2 px-6 rounded-lg font-bold text-lg ${settings.advertising ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>כן</button>
                            </div>
                        </div>
                    )}
                </div>
                 <div className="flex justify-center items-center">
                    <LemonadeStand day={day} advertising={day === 3 && settings.advertising} />
                </div>
            </div>
            <button onClick={onStartDay} className="mt-8 bg-brand-teal text-white font-bold py-4 px-8 rounded-2xl text-2xl shadow-lg hover:scale-105 transform transition-transform">
                פתח את הדוכן!
            </button>
        </div>
    );
};

const ResultsScreen: React.FC<{ result: DayResult, onNext: () => void }> = ({ result, onNext }) => {
    const [animatedCustomers, setAnimatedCustomers] = useState(0);

    useEffect(() => {
        if (result.customers > 0) {
            const interval = setInterval(() => {
                setAnimatedCustomers(c => {
                    if (c < result.customers) return c + 1;
                    clearInterval(interval);
                    return c;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [result.customers]);
    
    return (
        <div className="bg-blue-100 p-6 rounded-2xl flex flex-col justify-center items-center shadow-lg border-4 border-white animate-fade-in text-center">
            <h4 className="text-3xl font-bold mb-4">תוצאות יום {result.day}</h4>
            <div className="flex items-center justify-center gap-1 text-5xl mb-4 h-16 flex-wrap">
                {Array.from({ length: animatedCustomers }).map((_, i) => (
                    <span key={i} className="animate-fade-in" style={{animationDelay: `${i*50}ms`}}>😊</span>
                ))}
            </div>
            <p className="text-2xl mb-4">מכרתם ל-<strong>{result.customers}</strong> לקוחות</p>
            <div className="bg-white/70 p-4 rounded-xl shadow-inner">
                <p className="text-2xl">רווח נקי להיום</p>
                <p className={`text-5xl font-bold ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{result.profit} ₪</p>
            </div>
            <p className="mt-4 p-2 bg-yellow-100/70 text-yellow-800 rounded-lg font-semibold">{result.message}</p>
            <button onClick={onNext} className="mt-6 bg-brand-magenta text-white font-bold py-3 px-6 rounded-lg text-lg">
               {result.day === 3 ? 'הצג סיכום' : 'עבור ליום הבא'}
            </button>
        </div>
    );
};

const FinalScreen: React.FC<{ results: DayResult[], totalProfit: number, onRestart: () => void }> = ({ results, totalProfit, onRestart }) => (
    <div className="animate-fade-in text-center">
        <h3 className="text-4xl font-bold text-brand-teal mb-4">סיכום האתגר!</h3>
        <div className="grid grid-cols-3 gap-4 my-6">
            {results.map(r => (
                <div key={r.day} className="bg-white/70 p-4 rounded-xl shadow-md">
                    <p className="font-bold text-xl">יום {r.day}</p>
                    <p className={`text-3xl font-bold ${r.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{r.profit} ₪</p>
                </div>
            ))}
        </div>
        <div className="bg-yellow-100/80 p-6 rounded-2xl shadow-lg border-2 border-white">
             <p className="text-3xl font-bold">רווח כולל:</p>
             <p className={`text-6xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{totalProfit} ₪</p>
        </div>
        <p className="text-xl mt-4">{totalProfit > 20 ? "כל הכבוד, אתם יזמים מצוינים!" : "לא נורא, כל יזם לומד מטעויות. נסו שוב!"}</p>
        <button onClick={onRestart} className="mt-6 bg-brand-teal text-white font-bold py-3 px-6 rounded-lg text-lg">שחק שוב</button>
    </div>
);


const ColorfulMarketModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [gameState, setGameState] = useState<GameState>('intro');
    const [totalProfit, setTotalProfit] = useState(0);
    const [dayResults, setDayResults] = useState<DayResult[]>([]);
    
    // Settings
    const [price, setPrice] = useState(2);
    const [quality, setQuality] = useState(2);
    const [supply, setSupply] = useState(15);
    const [advertising, setAdvertising] = useState(false);
    
    const [weather, setWeather] = useState<'sunny' | 'cloudy' | null>(null);

     useEffect(() => {
        if (gameState === 'day2_setup' && !weather) {
            setWeather(Math.random() > 0.5 ? 'sunny' : 'cloudy');
        }
        if (gameState === 'day3_setup' && (weather === null || dayResults.length < 2)) {
             setWeather(Math.random() > 0.6 ? 'sunny' : 'cloudy');
        }
        if (gameState === 'final') {
            onComplete();
        }
    }, [gameState, weather, onComplete, dayResults]);

    const calculateDayResult = () => {
        const currentDay = dayResults.length + 1;
        const actualPrice = price + 2;
        const costPerCup = quality;

        let potentialCustomers = 10 - (price - quality) * 3;
        
        if (currentDay > 1 && weather) {
            potentialCustomers *= (weather === 'sunny' ? 1.5 : 0.7);
        }

        if (currentDay === 3 && advertising) {
            potentialCustomers *= 1.4;
        }

        potentialCustomers = Math.round(Math.max(3, potentialCustomers));
        
        let actualCustomers = potentialCustomers;
        let costs = 0;
        
        if (currentDay > 1) {
            actualCustomers = Math.min(potentialCustomers, supply);
            costs = supply * costPerCup;
        } else {
            costs = actualCustomers * costPerCup;
        }
        
        if(currentDay === 3 && advertising) costs += 5;

        const earnings = actualCustomers * actualPrice;
        const profit = earnings - costs;

        let message = '';
        if (profit > 20) message = "רווח מדהים! מצאתם שילוב מושלם!";
        else if (profit > 0) message = "עבודה טובה! הצלחתם להרוויח.";
        else message = "אוי, הפסדתם כסף. נסו שילוב אחר ביום הבא.";
        
        if(currentDay > 1 && supply < potentialCustomers) message += ` נגמרה לכם הלימונדה מוקדם!`;
        else if (currentDay > 1 && supply > actualCustomers) message += ` נשארה לכם לימונדה מיותרת.`
        
        const result: DayResult = { day: currentDay, customers: actualCustomers, earnings, profit, message, settings: { price, quality, supply, advertising } };
        setDayResults(prev => [...prev, result]);
        setTotalProfit(prev => prev + profit);
        
        if (currentDay === 1) setGameState('day1_results');
        if (currentDay === 2) setGameState('day2_results');
        if (currentDay === 3) setGameState('day3_results');
    };

    const handleNextDay = () => {
        if (gameState === 'day1_results') setGameState('day2_setup');
        if (gameState === 'day2_results') setGameState('day3_setup');
        if (gameState === 'day3_results') setGameState('final');
    };
    
    const restartGame = () => {
        setGameState('day1_setup');
        setTotalProfit(0); setDayResults([]); setPrice(2); setQuality(2);
        setSupply(15); setAdvertising(false); setWeather(null);
    };

    const renderContent = () => {
        switch (gameState) {
            case 'intro': return <IntroScreen onStart={() => setGameState('day1_setup')} />;
            case 'day1_setup':
            case 'day2_setup':
            case 'day3_setup':
                const day = dayResults.length + 1;
                return <SetupScreen 
                    day={day} 
                    settings={{ price, quality, supply, advertising }}
                    setters={{ setPrice, setQuality, setSupply, setAdvertising }}
                    onStartDay={calculateDayResult}
                    weather={day > 1 ? weather! : undefined}
                />;
            case 'day1_results':
            case 'day2_results':
            case 'day3_results':
                const lastResult = dayResults[dayResults.length - 1];
                return <ResultsScreen result={lastResult} onNext={handleNextDay} />;
            case 'final':
                return <FinalScreen results={dayResults} totalProfit={totalProfit} onRestart={restartGame} />;
            default: return null;
        }
    }

    return (
        <ModuleView title={title} onBack={onBack}>
             <div className="bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                <div className="bg-white/50 p-8 rounded-3xl shadow-inner border border-white/50">
                    {renderContent()}
                </div>
            </div>
        </ModuleView>
    );
};

export default ColorfulMarketModule;