import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const GOAL_AMOUNT = 20;
const GAME_WIDTH = 700;
const SQUIRREL_WIDTH = 80;

const Squirrel: React.FC = () => (
    <div className="relative w-20 h-20">
        {/* Tail */}
        <div className="absolute bottom-8 right-0 w-12 h-16 bg-gradient-to-br from-[#a16207] to-[#854d0e] rounded-t-full rounded-br-full rounded-bl-sm transform -rotate-45 origin-bottom-right shadow-inner"></div>
        {/* Body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-14 bg-gradient-to-b from-[#ca8a04] to-[#a16207] rounded-t-full rounded-b-lg">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#fef3c7] rounded-t-full"></div>
        </div>
        {/* Head */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#ca8a04] rounded-full"></div>
        {/* Ears */}
        <div className="absolute bottom-[80px] left-[18px] w-4 h-5 bg-[#854d0e] rounded-t-full transform -rotate-12">
             <div className="w-2 h-3 bg-[#fef3c7]/50 rounded-t-full absolute top-1 left-1"></div>
        </div>
        <div className="absolute bottom-[80px] right-[18px] w-4 h-5 bg-[#854d0e] rounded-t-full transform rotate-12">
             <div className="w-2 h-3 bg-[#fef3c7]/50 rounded-t-full absolute top-1 left-1"></div>
        </div>
        {/* Eyes & Nose */}
        <div className="absolute top-[-2px] left-1 w-3 h-3 bg-white rounded-full border border-black/50"><div className="w-1 h-1 bg-black rounded-full absolute top-1 left-1"></div></div>
        <div className="absolute top-[-2px] right-1 w-3 h-3 bg-white rounded-full border border-black/50"><div className="w-1 h-1 bg-black rounded-full absolute top-1 right-1"></div></div>
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-2 h-1 bg-black rounded-full"></div>
    </div>
);

const Acorn: React.FC = () => (
    <div className="relative w-8 h-10">
      <div className="w-full h-3/4 bg-yellow-600 rounded-b-full"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-4 bg-yellow-800 rounded-t-md"></div>
      <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-1 h-2 bg-yellow-900"></div>
    </div>
);

const Stone: React.FC = () => (
    <div className="text-4xl">🪨</div>
);

const AcornSack: React.FC<{ count: number; goal: number }> = ({ count, goal }) => {
  const fillPercentage = Math.min(count, goal) / goal;

  return (
    <div className="flex flex-col items-center gap-4 mt-8 md:mt-0">
      <div className="relative w-48 h-56 bg-amber-800 rounded-b-full rounded-t-xl shadow-lg border-4 border-amber-900">
        {/* Rope tie */}
        <div className="absolute top-8 left-0 right-0 h-4 bg-amber-900"></div>
        
        {/* Acorns fill */}
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-600 rounded-b-full transition-all duration-300 ease-out" style={{ height: `${fillPercentage * 100}%` }}></div>
        
        {/* Acorn Icon on top */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
            <Acorn />
        </div>

        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
            {count}
        </p>
      </div>
      <p className="text-3xl font-bold mt-2 text-yellow-800">החיסכון</p>
    </div>
  );
};


const SavingsAdventureModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameOver'>('intro');
    const [savedCoins, setSavedCoins] = useState(0);
    const [message, setMessage] = useState('');
    
    const [fallingObject, setFallingObject] = useState<{ x: number, y: number, type: 'acorn' | 'stone' } | null>(null);
    const [squirrelX, setSquirrelX] = useState(GAME_WIDTH / 2 - SQUIRREL_WIDTH / 2);
    const [highScore, setHighScore] = useState(0);
    const [goalMessageShown, setGoalMessageShown] = useState(false);
    const [animations, setAnimations] = useState<{id: number, x: number, y: number}[]>([]);
    
    const animationFrameId = useRef<number>();

    useEffect(() => {
        const storedHighScore = localStorage.getItem('savingsAdventureHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const spawnObject = () => {
        const type = Math.random() < 0.2 ? 'stone' : 'acorn'; // 20% chance for a stone
        setFallingObject({ 
            x: Math.random() * (GAME_WIDTH - 40), 
            y: -40,
            type 
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(gameState !== 'playing') return;
            setSquirrelX(prevX => {
                if (e.key === 'ArrowLeft') return Math.max(0, prevX - 25);
                if (e.key === 'ArrowRight') return Math.min(GAME_WIDTH - SQUIRREL_WIDTH, prevX + 25);
                return prevX;
            });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const gameLoop = () => {
            if (fallingObject) {
                 setFallingObject(prevObject => {
                    if (!prevObject) return null;
                    const newY = prevObject.y + 4;

                    // Collision detection
                    if (newY > 380 && newY < 420 && prevObject.x > squirrelX - 20 && prevObject.x < squirrelX + SQUIRREL_WIDTH - 20) {
                        if (prevObject.type === 'acorn') {
                            setSavedCoins(s => s + 1);
                            const newId = Date.now();
                            setAnimations(prev => [...prev, {id: newId, x: squirrelX, y: 380}]);
                            setTimeout(() => setAnimations(prev => prev.filter(a => a.id !== newId)), 1000);
                        } else { // It's a stone
                            if (savedCoins === 0) {
                                setGameState('gameOver');
                                return null;
                            }
                            setSavedCoins(s => Math.max(0, s - 1));
                            setMessage('אבן! היזהרו!');
                        }
                        spawnObject();
                        return null; // Remove the object
                    }

                    if (newY > 450) { // Missed
                        if (prevObject.type === 'acorn') {
                           setMessage('אופס, פספוס! נסו שוב.');
                        }
                        spawnObject();
                        return null;
                    }
                    
                    return { ...prevObject, y: newY };
                });
            }
            animationFrameId.current = requestAnimationFrame(gameLoop);
        };

        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId.current as number);
    }, [gameState, squirrelX, fallingObject, savedCoins]);
    
    useEffect(() => {
        if(savedCoins === GOAL_AMOUNT && !goalMessageShown) {
            setMessage('כל הכבוד, הגעת ליעד, מוזמן להמשיך לשבור את השיא האישי');
            onComplete();
            setGoalMessageShown(true);
        }
    }, [savedCoins, onComplete, goalMessageShown]);

    useEffect(() => {
        if (gameState === 'gameOver') {
            if (savedCoins > highScore) {
                setHighScore(savedCoins);
                localStorage.setItem('savingsAdventureHighScore', savedCoins.toString());
            }
        }
    }, [gameState, savedCoins, highScore]);


    const startGame = () => {
        setSavedCoins(0);
        setMessage('');
        setGameState('playing');
        setGoalMessageShown(false);
        spawnObject();
    }

    return (
        <ModuleView title={title} onBack={onBack}>
             <style>{`
                @keyframes float-up {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-50px); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 1s ease-out forwards;
                }
            `}</style>
            <div className="bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                <div className="text-center">
                    <h3 className="text-[2.75rem] font-bold text-brand-teal mb-4">הרפתקת החיסכון של סנפירי!</h3>
                    <div className="my-6 bg-white/50 p-6 rounded-2xl max-w-2xl mx-auto shadow-inner border border-white/50">
                        <h4 className="text-[2rem] font-bold mb-2 text-brand-dark-blue">מהו חיסכון? 🤔</h4>
                        <p className="text-[1.65rem] leading-relaxed">חיסכון זה כמו לשמור חתיכת עוגה טעימה לאחרי ארוחת הערב. במקום לבזבז את כל הכסף שלנו מיד, אנחנו שמים קצת בצד כדי שנוכל לקנות משהו גדול וכיפי בעתיד! במשחק הזה, סנפירי הסנאי חוסך בלוטים לחורף. עזרו לו לאסוף כמה שיותר בלוטים!</p>
                    </div>

                    {gameState === 'intro' && (
                         <button onClick={startGame} className="bg-brand-magenta text-white font-bold py-3 px-8 rounded-2xl text-2xl mb-6 shadow-lg hover:scale-105 transform transition-transform">
                            התחל משחק
                        </button>
                    )}
                </div>
                
                {gameState !== 'intro' && (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-6">
                        <div className="w-full md:w-auto">
                            <AcornSack count={savedCoins} goal={GOAL_AMOUNT} />
                        </div>
                        <div className="flex-grow flex flex-col items-center">
                             <div className="bg-white/50 p-4 rounded-xl shadow-inner mb-6 w-full max-w-[${GAME_WIDTH}px]">
                                <p className="text-2xl text-brand-dark-blue/90 mb-2">
                                    הזיזו את סנפירי עם החצים, תפסו בלוטים והיזהרו מהאבנים!
                                </p>
                                <div className="w-full max-w-sm mx-auto bg-yellow-800/20 p-2 rounded-full flex items-center gap-2">
                                    <div className="text-2xl">🌳</div>
                                    <div className="w-full bg-gray-200 rounded-full h-6">
                                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 h-6 rounded-full transition-all duration-500" style={{width: `${Math.min(100, (savedCoins/GOAL_AMOUNT)*100)}%`}}></div>
                                    </div>
                                    <div className="text-2xl">🏠</div>
                                </div>
                                <p className="text-3xl font-bold mt-2">בלוטים בסל: {savedCoins}</p>
                            </div>

                            <div className="relative w-full max-w-[700px] h-[450px] bg-sky-300 mx-auto rounded-3xl border-4 border-brand-dark-blue overflow-hidden cursor-pointer shadow-2xl">
                                 <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-green-300"></div>
                                
                                {/* Falling Object */}
                                {gameState === 'playing' && fallingObject && (
                                    <div className="absolute" style={{ left: fallingObject.x, top: fallingObject.y }}>
                                        {fallingObject.type === 'acorn' ? <Acorn /> : <Stone />}
                                    </div>
                                )}
                                
                                {/* Squirrel */}
                                <div className="absolute bottom-6 transition-transform duration-100" style={{ left: squirrelX, width: `${SQUIRREL_WIDTH}px` }}>
                                   <Squirrel />
                                </div>

                                {/* Animations */}
                                {animations.map(anim => (
                                    <div key={anim.id} className="absolute text-3xl font-bold text-yellow-500 animate-float-up" style={{left: anim.x + 20, top: anim.y, textShadow: '1px 1px 2px black'}}>
                                        +1
                                    </div>
                                ))}

                                {/* Ground */}
                                <div className="absolute bottom-0 w-full h-10 bg-green-600 border-t-4 border-green-700"></div>
                                
                                {gameState === 'gameOver' && (
                                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4 animate-fade-in">
                                        <span className="text-8xl">☠️</span>
                                        <p className="text-5xl font-bold">המשחק נגמר!</p>
                                        <p className="text-3xl mt-4">הניקוד שלך: {savedCoins}</p>
                                        <p className="text-2xl mt-2">השיא שלך: {highScore}</p>
                                        <p className="text-lg mt-4 bg-yellow-500/30 p-2 rounded-md">נסו לשבור את השיא ושתפו עם חברים!</p>
                                        <button onClick={startGame} className="mt-6 bg-brand-teal py-3 px-6 rounded-xl text-xl font-bold">שחק שוב</button>
                                    </div>
                                )}
                            </div>
                            {gameState === 'playing' && <p className="mt-6 text-2xl font-bold text-brand-magenta h-8">{message}</p>}
                        </div>
                    </div>
                )}
            </div>
        </ModuleView>
    );
};

export default SavingsAdventureModule;