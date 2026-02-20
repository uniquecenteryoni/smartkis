import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const jobs = [
    { id: 'baker', name: 'אופה', icon: '👨‍🍳', tool: 'מאפה', x: 50 },
    { id: 'doctor', name: 'רופאה', icon: '👩‍⚕️', tool: 'סטטוסקופ', x: 130 },
    { id: 'programmer', name: 'מתכנת', icon: '👨‍💻', tool: 'מחשב', x: 210 },
    { id: 'farmer', name: 'חקלאית', icon: '👩‍🌾', tool: 'גזר', x: 290 },
    { id: 'painter', name: 'ציירת', icon: '👩‍🎨', tool: 'מכחול', x: 370 },
    { id: 'builder', name: 'פועל בניין', icon: '👷', tool: 'פטיש', x: 450 },
    { id: 'firefighter', name: 'כבאית', icon: '👩‍🚒', tool: 'מטף', x: 530 },
    { id: 'scientist', name: 'מדען', icon: '👨‍🔬', tool: 'מבחנה', x: 610 },
];

const tools = [
    { name: 'מאפה', icon: '🥐' },
    { name: 'סטטוסקופ', icon: '🩺' },
    { name: 'מחשב', icon: '💻' },
    { name: 'גזר', icon: '🥕' },
    { name: 'מכחול', icon: '🖌️' },
    { name: 'פטיש', icon: '🔨' },
    { name: 'מטף', icon: '🧯' },
    { name: 'מבחנה', icon: '🧪' },
];

const GAME_WIDTH = 700;
const TOOL_WIDTH = 60;

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


const WhereMoneyComesFromModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing'>('intro');
    const [fallingTool, setFallingTool] = useState<{name: string; icon: string; x: number; y: number} | null>(null);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('השתמשו בחיצים כדי להזיז את הכלי ולעזור לבעל המקצוע הנכון!');
    const [gameQueue, setGameQueue] = useState<(typeof jobs)[0][]>([]);
    const animationFrameId = useRef<number>();

    const spawnTool = (queue: (typeof jobs)[0][]) => {
        if (queue.length === 0) return;
        
        const nextJob = queue[0];
        const toolIcon = tools.find(t => t.name === nextJob.tool)?.icon || '';
        setFallingTool({
            name: nextJob.tool,
            icon: toolIcon,
            x: GAME_WIDTH / 2 - TOOL_WIDTH / 2,
            y: -50,
        });
    };
    
    const startGame = () => {
        setScore(0);
        const shuffledJobs = shuffleArray(jobs);
        setGameQueue(shuffledJobs);
        setGameState('playing');
        spawnTool(shuffledJobs);
    }


    useEffect(() => {
        if (gameState !== 'playing') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!fallingTool) return;
            setFallingTool(prev => {
                if (!prev) return null;
                let newX = prev.x;
                if (e.key === 'ArrowLeft') {
                    newX = Math.max(0, prev.x - 20);
                } else if (e.key === 'ArrowRight') {
                    newX = Math.min(GAME_WIDTH - TOOL_WIDTH, prev.x + 20);
                }
                return {...prev, x: newX};
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [fallingTool, gameState]);

    useEffect(() => {
        if (gameState !== 'playing' || gameQueue.length === 0) return;

        const gameLoop = () => {
            if (fallingTool) {
                setFallingTool(prevTool => {
                    if (!prevTool) return null;
                    const newY = prevTool.y + 3;
                    
                    const correctJob = gameQueue[0];
                    if (newY > 400 && newY < 450) {
                        const jobWidth = 80;

                        if (prevTool.x > correctJob.x - jobWidth/2 && prevTool.x < correctJob.x + jobWidth/2) {
                             if (prevTool.name === correctJob.tool) {
                                setMessage('מעולה! התאמה נכונה!');
                                setScore(s => s + 1);
                                const nextQueue = gameQueue.slice(1);
                                setGameQueue(nextQueue);
                                spawnTool(nextQueue);
                                return null;
                             }
                        }
                    }

                    if (newY > 500) {
                        setMessage('אופס! נסו שוב.');
                        spawnTool(gameQueue);
                        return null;
                    }

                    return { ...prevTool, y: newY };
                });
            }
            animationFrameId.current = requestAnimationFrame(gameLoop);
        };
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrameId.current as number);
    }, [fallingTool, score, gameState, gameQueue]);
    
     useEffect(() => {
        if (gameQueue.length === 0 && gameState === 'playing' && jobs.length > 0) {
            setMessage('כל הכבוד! התאמתם את כל הכלים ועזרתם לכולם לעבוד!');
            onComplete();
        }
    }, [gameQueue, gameState, onComplete]);


    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                 <h3 className="text-[2.75rem] font-bold text-brand-teal mb-4">עבודה ומשכורת</h3>
                 <div className="my-6 bg-white/50 p-6 rounded-2xl max-w-3xl mx-auto shadow-inner border border-white/50">
                    <h4 className="text-[2rem] font-bold mb-2 text-brand-dark-blue">איך מרוויחים כסף? 💰</h4>
                    <p className="text-[1.65rem] leading-relaxed">כדי להרוויח כסף, מבוגרים הולכים לעבודה. לכל עבודה יש מקצוע, כמו רופאה או אופה. בסוף כל חודש, הם מקבלים 'משכורת' - כסף עבור העבודה שהם עשו. במשחק הזה, עזרו לכל בעל מקצוע לקבל את כלי העבודה שלו כדי שיוכל לעבוד ולהרוויח משכורת!</p>
                </div>

                {gameState === 'intro' ? (
                     <button onClick={startGame} className="bg-brand-magenta text-white font-bold py-3 px-8 rounded-2xl text-2xl mb-6 shadow-lg hover:scale-105 transform transition-transform">
                        התחל משחק
                    </button>
                ) : (
                    <>
                        <div className="bg-white/50 p-4 rounded-xl shadow-inner mb-6">
                            <p className="text-2xl text-brand-dark-blue/90 mb-2">
                                הזיזו את הכלי הנופל עם החיצים (ימין ושמאל) והפילו אותו על בעל המקצוע הנכון!
                            </p>
                            <p className="text-3xl font-bold">הצלחות: {score}/{jobs.length}</p>
                        </div>

                        <div className={`relative w-full max-w-[${GAME_WIDTH}px] h-[500px] bg-sky-100 mx-auto rounded-3xl border-4 border-brand-light-blue overflow-hidden shadow-2xl`}>
                             <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100"></div>
                             <div className="absolute bottom-0 w-full h-40 bg-green-400"></div>
                             <div className="absolute bottom-32 w-full h-8 bg-green-500 rounded-t-full"></div>
                            
                            {fallingTool && (
                                <div className="absolute text-6xl transform -translate-x-1/2" style={{ left: fallingTool.x + TOOL_WIDTH/2, top: fallingTool.y }}>
                                    {fallingTool.icon}
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 h-40">
                                {jobs.map((job) => (
                                    <div key={job.id} className={`absolute bottom-16 text-center transition-all duration-300`}
                                        style={{ left: `${job.x}px`, transform: 'translateX(-50%)' }}
                                    >
                                        <div className="text-7xl drop-shadow-lg">{job.icon}</div>
                                        <div className="font-bold text-lg bg-white/70 px-2 py-1 rounded-md">{job.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {message && <p className="mt-6 text-3xl font-bold text-brand-magenta">{message}</p>}
                    </>
                )}
            </div>
        </ModuleView>
    );
};

export default WhereMoneyComesFromModule;