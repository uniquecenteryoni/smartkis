import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

type Category = 'צורך' | 'רצון';
interface Item {
  id: number;
  name: string;
  icon: string;
  category: Category;
}

const initialItems: Item[] = [
    { id: 1, name: 'בית', icon: '🏠', category: 'צורך' },
    { id: 2, name: 'מים', icon: '💧', category: 'צורך' },
    { id: 3, name: 'אוכל', icon: '🍎', category: 'צורך' },
    { id: 4, name: 'משחק וידאו', icon: '🎮', category: 'רצון' },
    { id: 5, name: 'ממתקים', icon: '🍭', category: 'רצון' },
    { id: 6, name: 'בגדים', icon: '👕', category: 'צורך' },
    { id: 7, name: 'צעצוע', icon: '🧸', category: 'רצון' },
    { id: 8, name: 'אופניים', icon: '🚲', category: 'רצון' },
    { id: 9, name: 'מיטה', icon: '🛏️', category: 'צורך' },
    { id: 10, name: 'גלידה', icon: '🍦', category: 'רצון' },
    { id: 11, name: 'תרופה', icon: '💊', category: 'צורך' },
    { id: 12, name: 'ספר לימוד', icon: '📚', category: 'צורך' },
    { id: 13, name: 'נעליים', icon: '👟', category: 'צורך' },
    { id: 14, name: 'סרט בקולנוע', icon: '🎬', category: 'רצון' },
    { id: 15, name: 'חופשה', icon: '✈️', category: 'רצון' },
    { id: 16, name: 'טלפון נייד', icon: '📱', category: 'רצון' },
    { id: 17, name: 'מקלחת', icon: '🚿', category: 'צורך' },
    { id: 18, name: 'חימום בחורף', icon: '🔥', category: 'צורך' },
    { id: 19, name: 'מכונית צעצוע', icon: '🚗', category: 'רצון' },
    { id: 20, name: 'כדור', icon: '⚽', category: 'רצון' },
    { id: 21, name: 'חיבוק', icon: '🤗', category: 'צורך' },
    { id: 22, name: 'חשמל', icon: '💡', category: 'צורך' },
    { id: 23, name: 'ברד', icon: '🍧', category: 'רצון' },
    { id: 24, name: 'לימודים', icon: '🏫', category: 'צורך' },
    { id: 25, name: 'טלוויזיה', icon: '📺', category: 'רצון' },
    { id: 26, name: 'סבון', icon: '🧼', category: 'צורך' },
    { id: 27, name: 'עוגה', icon: '🎂', category: 'רצון' },
    { id: 28, name: 'רופא', icon: '👨‍⚕️', category: 'צורך' },
    { id: 29, name: 'בובה', icon: '🎎', category: 'רצון' },
    { id: 30, name: 'בגד חם', icon: '🧥', category: 'צורך' },
    { id: 31, name: 'מחשב', icon: '💻', category: 'רצון' },
    { id: 32, name: 'ירקות', icon: '🥦', category: 'צורך' },
    { id: 33, name: 'רובוט', icon: '🤖', category: 'רצון' },
    { id: 34, name: 'משפחה', icon: '👨‍👩‍👧‍👦', category: 'צורך' },
    { id: 35, name: 'מכונית מרוץ', icon: '🏎️', category: 'רצון' },
];

const GOAL = 20;

const BasketballHoop: React.FC<{ color: 'light-blue' | 'magenta' }> = ({ color }) => {
    const colors = {
        'light-blue': { border: 'border-cyan-500', shadow: 'shadow-cyan-500/50' },
        'magenta': { border: 'border-pink-500', shadow: 'shadow-pink-500/50' }
    };
    return (
        <div className="relative w-48 h-32 flex flex-col items-center drop-shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
            {/* Backboard */}
            <div className={`w-full h-24 bg-gradient-to-br from-white/80 via-gray-100/70 to-white/80 backdrop-blur-sm rounded-lg border-4 shadow-xl ${colors[color].border} ${colors[color].shadow}`}>
                <div className={`w-12 h-12 border-2 ${colors[color].border} absolute top-8 left-1/2 -translate-x-1/2 rounded-sm opacity-60`}></div>
            </div>
            {/* Rim */}
            <div className="absolute top-16 w-24 h-8 border-[10px] border-orange-500 rounded-full [transform:rotateX(60deg)] shadow-inner"></div>
            {/* Net */}
            <div className="absolute top-20 w-16 h-12 border-l-2 border-r-2 border-b-2 border-gray-400/80"
                 style={{clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'}}>
            </div>
        </div>
    );
};


const NeedsVsWantsModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [items, setItems] = useState(() => {
        // Create a longer, shuffled list for continuous play
        const extended = [];
        for (let i = 0; i < 3; i++) {
            extended.push(...initialItems);
        }
        return extended.sort(() => Math.random() - 0.5);
    });
    
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ icon: string; position: {x: number, y: number} } | null>(null);
    const [animation, setAnimation] = useState<{ active: boolean; targetX: number; targetY: number; rotation: number } | null>(null);
    const [hoopPositions, setHoopPositions] = useState({
        needs: { x: 50, dir: 1, speed: 3.5 },
        wants: { x: 450, dir: -1, speed: 3.8 }
    });
    const [gameWon, setGameWon] = useState(false);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const needsHoopRef = useRef<HTMLDivElement>(null);
    const wantsHoopRef = useRef<HTMLDivElement>(null);
    const itemContainerRef = useRef<HTMLDivElement>(null);
    
    const currentItem = items[currentItemIndex];

    useEffect(() => {
        let animationFrameId: number;
        const moveHoops = () => {
            if (gameAreaRef.current && !gameWon) {
                const gameWidth = gameAreaRef.current.offsetWidth;
                const hoopWidth = 192; // w-48

                setHoopPositions(prev => {
                    let newNeedsX = prev.needs.x + prev.needs.dir * prev.needs.speed;
                    let newNeedsDir = prev.needs.dir;
                    if (newNeedsX <= 0 || newNeedsX >= gameWidth - hoopWidth) {
                        newNeedsDir *= -1;
                        newNeedsX = prev.needs.x + newNeedsDir * prev.needs.speed;
                    }

                    let newWantsX = prev.wants.x + prev.wants.dir * prev.wants.speed;
                    let newWantsDir = prev.wants.dir;
                    if (newWantsX <= 0 || newWantsX >= gameWidth - hoopWidth) {
                        newWantsDir *= -1;
                        newWantsX = prev.wants.x + newWantsDir * prev.wants.speed;
                    }

                    return {
                        needs: { ...prev.needs, x: newNeedsX, dir: newNeedsDir },
                        wants: { ...prev.wants, x: newWantsX, dir: newWantsDir }
                    };
                });
            }
            animationFrameId = requestAnimationFrame(moveHoops);
        };
        animationFrameId = requestAnimationFrame(moveHoops);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameWon]);

    const handleHoopClick = (targetCategory: Category, hoopRef: React.RefObject<HTMLDivElement>) => {
        if (animation || !currentItem || gameWon || !hoopRef.current || !gameAreaRef.current || !itemContainerRef.current) return;

        const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
        const hoopRect = hoopRef.current.getBoundingClientRect();
        const itemRect = itemContainerRef.current.getBoundingClientRect();

        const itemInitialX = itemRect.left - gameAreaRect.left + itemRect.width / 2;
        const itemInitialY = itemRect.top - gameAreaRect.top + itemRect.height / 2;

        const targetX = (hoopRect.left - gameAreaRect.left) + hoopRect.width / 2;
        const targetY = (hoopRect.top - gameAreaRect.top) + 70;

        setAnimation({ 
            active: true, 
            targetX: targetX - itemInitialX, 
            targetY: targetY - itemInitialY,
            rotation: Math.random() > 0.5 ? 360 : -360
        });

        const isCorrect = currentItem.category === targetCategory;
        const newScore = isCorrect ? score + 1 : Math.max(0, score - 1);
        setScore(newScore);
        
        setFeedback({ icon: isCorrect ? '✅' : '❌', position: { x: targetX, y: targetY - 50 } });

        setTimeout(() => {
            if (newScore >= GOAL) {
                setGameWon(true);
                onComplete();
            } else {
                const newIndex = currentItemIndex + 1;
                // If we reach the end of the list, reshuffle and start from the beginning
                if (newIndex >= items.length) {
                    setItems(prevItems => [...prevItems].sort(() => Math.random() - 0.5));
                    setCurrentItemIndex(0);
                } else {
                    setCurrentItemIndex(newIndex);
                }
            }
            setFeedback(null);
            setAnimation(null);
        }, 800);
    };
    
    const itemStyle: React.CSSProperties = animation ? {
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.6, 1)',
        transform: `translate(${animation.targetX}px, ${animation.targetY}px) scale(0.2) rotate(${animation.rotation}deg)`,
        opacity: 0,
    } : {
        transition: 'opacity 0.3s',
        transform: 'translate(0,0) scale(1) rotate(0deg)',
        opacity: 1,
    };

    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                <h3 className="text-[2.75rem] font-bold text-brand-teal mb-4">קליעה למטרה: צורך או רצון?</h3>
                
                <div className="my-6 bg-white/50 p-6 rounded-2xl max-w-4xl mx-auto shadow-inner border border-white/50">
                    <h4 className="text-[2rem] font-bold mb-4 text-brand-dark-blue">מה ההבדל?</h4>
                    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 text-[1.65rem]">
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-b-8 border-gray-200/50 transform transition-transform hover:scale-105 hover:-rotate-1 flex-1">
                            <span className="text-7xl">🏠</span>
                            <p className="font-bold text-brand-light-blue text-[2rem]">צורך</p>
                            <p>משהו שאנחנו חייבים כדי לחיות, כמו אוכל, מים ובית.</p>
                        </div>
                        <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-b-8 border-gray-200/50 transform transition-transform hover:scale-105 hover:rotate-1 flex-1">
                            <span className="text-7xl">🎁</span>
                            <p className="font-bold text-brand-magenta text-[2rem]">רצון</p>
                            <p>משהו שכיף לנו שיש, אבל אנחנו יכולים להסתדר גם בלעדיו, כמו צעצוע או ממתק.</p>
                        </div>
                    </div>
                     <div className="mt-6 bg-yellow-100/70 p-4 rounded-2xl border-2 border-yellow-300">
                        <p className="text-yellow-900 font-bold text-2xl">💡 חשוב לזכור: קודם כל דואגים למה שצריכים. את מה שרוצים קונים רק אם נשאר מספיק כסף!</p>
                    </div>
                </div>

                <div className="bg-white/50 p-4 rounded-xl shadow-inner mb-6">
                    <div className="flex justify-between items-center mb-2 text-3xl font-bold">
                        <p>התקדמות ליעד</p>
                        <p>{score} / {GOAL}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 border-2 border-white/50 shadow-inner">
                        <div 
                            className="bg-gradient-to-r from-brand-teal to-brand-light-blue h-full rounded-full transition-all duration-500 text-white flex items-center justify-end pr-2 font-bold"
                            style={{ width: `${Math.min(100, (score / GOAL) * 100)}%` }}
                        >
                            {score > 0 && `${Math.round((score / GOAL) * 100)}%`}
                        </div>
                    </div>
                </div>

                <div ref={gameAreaRef} className="relative p-4 bg-blue-100/30 rounded-2xl h-[650px] overflow-hidden shadow-inner">
                    {/* Item to Shoot */}
                    <div ref={itemContainerRef} className="absolute w-full flex justify-center pointer-events-none" style={{ top: '15%' }}>
                         {currentItem && !gameWon && (
                            <div style={itemStyle} className={`text-center p-4 bg-white/90 rounded-2xl shadow-2xl border-4 border-white`}>
                                <span className="text-8xl drop-shadow-lg">{currentItem.icon}</span>
                                <p className="font-bold text-3xl">{currentItem.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Needs Target */}
                    <div
                        ref={needsHoopRef}
                        onClick={() => handleHoopClick('צורך', needsHoopRef)}
                        className="absolute bottom-4 cursor-pointer group"
                        style={{ left: `${hoopPositions.needs.x}px` }}
                    >
                        <BasketballHoop color="light-blue" />
                        <h4 className="text-5xl font-bold text-brand-light-blue mt-2 text-center">צורך</h4>
                    </div>

                    {/* Wants Target */}
                    <div
                        ref={wantsHoopRef}
                        onClick={() => handleHoopClick('רצון', wantsHoopRef)}
                        className="absolute bottom-4 cursor-pointer group"
                        style={{ left: `${hoopPositions.wants.x}px` }}
                    >
                        <BasketballHoop color="magenta" />
                        <h4 className="text-5xl font-bold text-brand-magenta mt-2 text-center">רצון</h4>
                    </div>

                    {feedback && (
                        <div className="absolute text-8xl animate-ping pointer-events-none" style={{ left: feedback.position.x, top: feedback.position.y }}>
                            {feedback.icon}
                        </div>
                    )}
                </div>
                {gameWon && (
                    <p className="mt-8 text-4xl font-bold text-green-600 animate-bounce">כל הכבוד! השגתם את היעד!</p>
                )}
                <div className="mt-8 bg-purple-100/70 p-4 rounded-2xl border-2 border-purple-300 max-w-4xl mx-auto">
                    <p className="text-purple-900 font-semibold text-2xl">
                       <span className="font-bold">🧐 למחשבה:</span> ההבדל בין 'צורך' ל'רצון' הוא לא תמיד חד משמעי. לפעמים, מה ש'רצון' עבור אדם אחד הוא 'צורך' עבור אחר (למשל, מחשב לעבודה). המטרה היא ללמוד לחשוב על ההבדל לפני כל קנייה.
                    </p>
                </div>
            </div>
        </ModuleView>
    );
};

export default NeedsVsWantsModule;