import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface MoneyAndMeModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ["הרגשות שלי", "מציבים מטרה", "איך מרוויחים?", "הסכנה שבמינוס", "בוחן ידע"];

// --- Visual Components for Quiz ---
const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);
const CrossIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// Step 1: Feelings Step
const FeelingsStep: React.FC = () => {
    const feelings = [
        { word: 'שמחה', emoji: '😄' }, { word: 'ביטחון', emoji: '🛡️' }, { word: 'חרדה', emoji: '😟' },
        { word: 'לחץ', emoji: '😥' }, { word: 'חופש', emoji: '🕊️' }, { word: 'בלבול', emoji: '😵' },
        { word: 'אחריות', emoji: '🧑‍⚖️' }, { word: 'סקרנות', emoji: '🤔' }, { word: 'כוח', emoji: '💪' }
    ];
    const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
    const toggleFeeling = (feeling: string) => {
        setSelectedFeelings(prev =>
            prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]
        );
    };

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">איך כסף גורם לכם להרגיש?</h3>
            <p className="text-2xl text-brand-dark-blue/90 mb-8">
                לכסף יש השפעה גדולה על הרגשות שלנו. בחרו את המילים שמתארות הכי טוב את מה שאתם מרגישים כשאתם חושבים על כסף.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                {feelings.map(f => (
                    <button
                        key={f.word}
                        onClick={() => toggleFeeling(f.word)}
                        className={`p-4 rounded-2xl text-3xl font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${selectedFeelings.includes(f.word) ? 'bg-brand-light-blue text-white ring-4 ring-brand-teal' : 'bg-white/80'}`}
                    >
                        <span className="mr-2 text-3xl">{f.emoji}</span> {f.word}
                    </button>
                ))}
            </div>
             {selectedFeelings.length > 0 && (
                <p className="mt-8 p-4 bg-yellow-100/60 rounded-lg text-yellow-800 font-semibold text-xl">
                    זה נורמלי לגמרי להרגיש מגוון של רגשות כלפי כסף. המטרה שלנו היא להרגיש יותר ביטחון ושליטה ופחות לחץ וחרדה.
                </p>
            )}
        </div>
    );
};

// Step 2: Goal Setting Step
const GoalSettingStep: React.FC = () => {
    const [goal, setGoal] = useState<{ name: string; cost: number; savings: number }>({ name: '', cost: 500, savings: 50 });
    const monthsToGoal = goal.savings > 0 ? Math.ceil(goal.cost / goal.savings) : 0;
    const commonGoals = [
        { name: 'טלפון חדש', cost: 3000, icon: '📱' },
        { name: 'משחק וידאו', cost: 250, icon: '🎮' },
        { name: 'טיול לחו"ל', cost: 5000, icon: '✈️' },
        { name: 'נעליים חדשות', cost: 400, icon: '👟' },
    ];
    const handleGoalSelect = (name: string, cost: number) => {
        setGoal(prev => ({ ...prev, name, cost }));
    };

    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">הגדירו מטרה וחסכו עבורה!</h3>
            <p className="text-2xl text-brand-dark-blue/90 mb-8">חיסכון הוא הרבה יותר קל כשיש מטרה ברורה. בואו נתכנן איך להשיג את המטרה שלכם.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-3xl mb-2">1. בחרו מטרה או כתבו אחת משלכם</h4>
                        <div className="flex flex-wrap justify-center gap-2 mb-2">
                             {commonGoals.map(g => (
                                <button key={g.name} onClick={() => handleGoalSelect(g.name, g.cost)} className={`p-2 rounded-lg transition-colors ${goal.name === g.name ? 'bg-brand-light-blue text-white' : 'bg-white/70'}`}>
                                    <span className="text-2xl">{g.icon}</span> {g.name}
                                </button>
                            ))}
                        </div>
                        <input type="text" value={goal.name} onChange={e => setGoal({...goal, name: e.target.value})} placeholder="מטרה אישית" className="w-full bg-white p-2 rounded-lg border-2 border-gray-300 text-lg"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-3xl mb-2">2. כמה זה עולה? (בש"ח)</h4>
                        <input type="number" value={goal.cost} onChange={e => setGoal({...goal, cost: Number(e.target.value)})} className="w-full bg-white p-2 rounded-lg border-2 border-gray-300 text-lg"/>
                    </div>
                     <div>
                        <h4 className="font-bold text-3xl mb-2">3. כמה תחסכו כל חודש? (בש"ח)</h4>
                        <input type="number" value={goal.savings} onChange={e => setGoal({...goal, savings: Number(e.target.value)})} className="w-full bg-white p-2 rounded-lg border-2 border-gray-300 text-lg"/>
                    </div>
                </div>
                <div className="bg-white/50 p-6 rounded-2xl flex flex-col justify-center items-center">
                    {goal.name && goal.savings > 0 ? (
                        <>
                            <p className="text-3xl">כדי להשיג את ה<strong className="text-brand-light-blue">{goal.name}</strong> שלכם,</p>
                            <p className="text-2xl">תצטרכו לחסוך במשך:</p>
                            <p className="text-7xl font-bold text-brand-teal my-4">{monthsToGoal}</p>
                            <p className="text-4xl">חודשים</p>
                        </>
                    ) : (
                         <p className="text-gray-500 text-xl">הזינו את פרטי המטרה כדי לראות את החישוב.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Step 3: Earning Money Step
const EarningMoneyStep: React.FC = () => {
    const waysToEarn = [
        { name: 'עזרה בבית', desc: 'משימות מיוחדות מעבר למטלות הרגילות, כמו ניקיון יסודי של הרכב או סידור המחסן.', icon: '🏠' },
        { name: 'עבודות קטנות לשכנים', desc: 'בייביסיטר, דוגיסיטר, עזרה בקניות, כיסוח דשא.', icon: '🏘️' },
        { name: 'למכור דברים', desc: 'צעצועים ישנים, בגדים שכבר לא בשימוש, או דברים שהכנתם בעצמכם.', icon: '🛍️' },
        { name: 'יזמות קטנה', desc: 'למכור לימונדה, להכין צמידים, להעביר שיעורים פרטיים במשהו שאתם טובים בו.', icon: '💡' },
    ];
    return (
        <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-4xl font-bold text-brand-teal mb-6 text-center">אז... איך מרוויחים כסף?</h3>
            <p className="text-center text-2xl mb-8">חוץ מדמי כיס, יש הרבה דרכים יצירתיות להרוויח כסף. הנה כמה רעיונות:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {waysToEarn.map(way => (
                    <div key={way.name} className="bg-white/60 p-6 rounded-xl border border-white/40 text-center">
                        <span className="text-5xl">{way.icon}</span>
                        <h4 className="text-3xl font-bold text-brand-light-blue mt-3 mb-2">{way.name}</h4>
                        <p className="text-brand-dark-blue/90 text-xl">{way.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Step 4: Overdraft Step (Motorcycle Game)
const GOAL_SCORE = 500;
const MotorcycleGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'crashed' | 'gameOver' | 'win'>('start');
    const [score, setScore] = useState(100);
    const [lives, setLives] = useState(3);
    const [gameOverReason, setGameOverReason] = useState<'fall' | 'score' | null>(null);

    // Game state refs
    const playerRef = useRef({ x: 400, y: 350, vx: 0, vy: 0, onGround: true, direction: 1, canDoubleJump: false });
    const platformsRef = useRef<{ x: number; y: number; width: number }[]>([]);
    const collectiblesRef = useRef<any[]>([]);
    const floatingTextsRef = useRef<any[]>([]);
    const particlesRef = useRef<any[]>([]);
    const cameraYRef = useRef(0);
    const highestPlatformY = useRef(400);
    const cloudsRef = useRef<{x: number, y: number, size: number, speed: number}[]>([]);

    const keysRef = useRef({ left: false, right: false, up: false });

    const startGame = (isFullReset = false) => {
        if (isFullReset) {
            setLives(3);
        }
        playerRef.current = { x: 400, y: 350, vx: 0, vy: 0, onGround: true, direction: 1, canDoubleJump: false };
        keysRef.current = { left: false, right: false, up: false }; // Bug fix
        cameraYRef.current = 0;
        highestPlatformY.current = 380;
        setScore(100);
        setGameOverReason(null);
        floatingTextsRef.current = [];
        particlesRef.current = [];
        collectiblesRef.current = [];
        
        if (isFullReset || cloudsRef.current.length === 0) {
            cloudsRef.current = [];
            for(let i = 0; i < 15; i++) {
                cloudsRef.current.push({
                    x: Math.random() * 800,
                    y: Math.random() * 800 - 400,
                    size: Math.random() * 30 + 20,
                    speed: Math.random() * 0.3 + 0.1
                });
            }
        }

        // Generate initial platforms
        const initialPlatforms: { x: number; y: number; width: number }[] = [{ x: 0, y: 400, width: 800 }];
        for (let i = 1; i < 20; i++) {
            const y = initialPlatforms[i-1].y - (Math.random() * 60 + 60);
            const x = Math.random() * (800 - 100);
            initialPlatforms.push({ x, y, width: Math.random() * 50 + 80 });
            highestPlatformY.current = y;
        }
        platformsRef.current = initialPlatforms;

        setGameState('playing');
    };

    const drawMotorcycle = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.translate(-30, 0); 
    
        // Rider Body
        ctx.fillStyle = '#4a5568';
        ctx.beginPath();
        ctx.moveTo(20, -35);
        ctx.lineTo(35, -35);
        ctx.lineTo(28, -10);
        ctx.lineTo(17, -10);
        ctx.closePath();
        ctx.fill();

        // Rider Head
        ctx.beginPath();
        ctx.arc(22.5, -45, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#f7d3a1'; // Skin tone
        ctx.fill();
        ctx.beginPath();
        ctx.arc(22.5, -45, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#4a5568'; // Helmet
        ctx.fill();

        // Motorcycle Body
        ctx.fillStyle = '#d52963';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(10, -20);
        ctx.lineTo(55, -15);
        ctx.lineTo(60, 0);
        ctx.closePath();
        ctx.fill();

        // Handlebars
        ctx.strokeStyle = '#1b2550';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(50, -17);
        ctx.lineTo(55, -27);
        ctx.stroke();

        // Wheels
        ctx.fillStyle = '#1b2550';
        ctx.beginPath();
        ctx.arc(10, 5, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(55, 5, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.arc(10, 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(55, 5, 4, 0, Math.PI * 2);
        ctx.fill();
    
        ctx.restore();
    };


    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const GRAVITY = 0.45;
        const MOVE_FORCE = 1.2;
        const JUMP_FORCE = -12;
        const DOUBLE_JUMP_FORCE = -10;
        const FRICTION = 0.8;
        const MAX_VX = 7;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft') keysRef.current.left = true;
            if (e.code === 'ArrowRight') keysRef.current.right = true;
            if (e.code === 'Space') {
                if (playerRef.current.onGround) {
                    playerRef.current.vy = JUMP_FORCE;
                    playerRef.current.onGround = false;
                    playerRef.current.canDoubleJump = true;
                } else if (playerRef.current.canDoubleJump) {
                    playerRef.current.vy = DOUBLE_JUMP_FORCE;
                    playerRef.current.canDoubleJump = false;
                }
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'ArrowLeft') keysRef.current.left = false;
            if (e.code === 'ArrowRight') keysRef.current.right = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animationFrameId: number;

        const gameLoop = () => {
            if (!canvasRef.current) return;
            
            // --- Update Physics & Controls ---
            if (keysRef.current.left) {
                playerRef.current.vx -= MOVE_FORCE;
                playerRef.current.direction = 1;
            }
            if (keysRef.current.right) {
                playerRef.current.vx += MOVE_FORCE;
                playerRef.current.direction = -1;
            }

            playerRef.current.vx *= FRICTION;
            if (Math.abs(playerRef.current.vx) > MAX_VX) {
                playerRef.current.vx = Math.sign(playerRef.current.vx) * MAX_VX;
            }

            playerRef.current.x += playerRef.current.vx;
            
            playerRef.current.vy += GRAVITY;
            playerRef.current.y += playerRef.current.vy;

            if (playerRef.current.x > 800) playerRef.current.x = 0;
            if (playerRef.current.x < 0) playerRef.current.x = 800;

            // --- Platform Collisions ---
            playerRef.current.onGround = false;
            if (playerRef.current.vy > 0) {
                 for(const platform of platformsRef.current) {
                    if ( playerRef.current.x > platform.x && playerRef.current.x < platform.x + platform.width && playerRef.current.y + 40 > platform.y && playerRef.current.y + 40 < platform.y + 20) {
                        playerRef.current.vy = 0;
                        playerRef.current.y = platform.y - 40;
                        playerRef.current.onGround = true;
                        playerRef.current.canDoubleJump = false; // Disable double jump on land
                    }
                }
            }

            // --- Camera ---
            if (playerRef.current.y < cameraYRef.current + 150) {
                cameraYRef.current = playerRef.current.y - 150;
            }

            // --- Platform Generation & Cleanup ---
            if (highestPlatformY.current > cameraYRef.current - 100) {
                const newY = highestPlatformY.current - (Math.random() * 50 + 60);
                const newX = Math.random() * (800 - 100);
                platformsRef.current.push({ x: newX, y: newY, width: Math.random() * 50 + 80 });
                highestPlatformY.current = newY;

                 if (Math.random() > 0.4) {
                    const isPositive = Math.random() > 0.3;
                    collectiblesRef.current.push({
                        x: newX + (Math.random() * 40 + 20),
                        y: newY - 30,
                        type: isPositive ? '+' : '-',
                        value: isPositive ? 50 : -25,
                    });
                }
            }
            platformsRef.current = platformsRef.current.filter(p => p.y < cameraYRef.current + 500);
            
            // Collectibles
            collectiblesRef.current = collectiblesRef.current.filter(c => {
                 const distance = Math.sqrt(Math.pow(playerRef.current.x - c.x, 2) + Math.pow(playerRef.current.y - c.y, 2));
                if (distance < 50) {
                    setScore(s => s + c.value);
                    floatingTextsRef.current.push({ id: Date.now(), text: `${c.value > 0 ? '+' : ''}${c.value}`, x: playerRef.current.x, y: playerRef.current.y - 50, opacity: 1 });
                    for (let i = 0; i < 15; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 3 + 1;
                        particlesRef.current.push({ id: Date.now() + i, x: c.x, y: c.y, radius: Math.random() * 3 + 2, opacity: 1, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: c.type === '+' ? 'rgba(74, 222, 128,' : 'rgba(239, 68, 68,' });
                    }
                    return false;
                }
                return c.y < cameraYRef.current + 500;
            });
            
            // --- Game State Checks ---
            if (score >= GOAL_SCORE) {
                setGameState('win');
                onComplete();
            } else if (playerRef.current.y > cameraYRef.current + 400 || score < 0) {
                const reason = playerRef.current.y > cameraYRef.current + 400 ? 'fall' : 'score';
                if (lives > 1) {
                    setLives(l => l - 1);
                    setGameState('crashed');
                    setGameOverReason(reason);
                } else {
                    setGameState('gameOver');
                    setGameOverReason(reason);
                }
            }
            
            // --- Drawing ---
            ctx.clearRect(0, 0, 800, 400);
            const skyGradient = ctx.createLinearGradient(0, 0, 0, 400);
            skyGradient.addColorStop(0, '#87CEEB');
            skyGradient.addColorStop(1, '#E0F6FF');
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, 800, 400);

            // Clouds
            cloudsRef.current.forEach(cloud => {
                const parallaxY = cloud.y - cameraYRef.current * (cloud.speed * 0.5); // Slower vertical scroll
                ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
                ctx.beginPath();
                ctx.arc(cloud.x, parallaxY, cloud.size, 0, Math.PI * 2);
                ctx.arc(cloud.x + cloud.size * 0.8, parallaxY, cloud.size * 0.8, 0, Math.PI * 2);
                ctx.arc(cloud.x - cloud.size * 0.8, parallaxY, cloud.size * 0.7, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            });


            ctx.save();
            ctx.translate(0, -cameraYRef.current);

            // Platforms
            platformsRef.current.forEach(p => {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(p.x, p.y, p.width, 10);
                ctx.fillStyle = '#34D399';
                ctx.fillRect(p.x, p.y, p.width, 4);
            });

            // Collectibles
            collectiblesRef.current.forEach(c => {
                 ctx.beginPath();
                ctx.arc(c.x, c.y, 15, 0, Math.PI * 2);
                ctx.fillStyle = c.type === '+' ? 'gold' : '#A9A9A9';
                ctx.fill();
                ctx.strokeStyle = c.type === '+' ? '#DAA520' : '#808080';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.font = 'bold 20px sans-serif';
                ctx.fillStyle = c.type === '+' ? 'darkgreen' : 'darkred';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(c.type, c.x, c.y);
            });

            ctx.save();
            ctx.translate(playerRef.current.x, playerRef.current.y);
            ctx.scale(playerRef.current.direction, 1);
            drawMotorcycle(ctx);
            ctx.restore();

            floatingTextsRef.current.forEach(ft => {
                ctx.font = 'bold 20px sans-serif';
                ctx.fillStyle = ft.text.startsWith('+') ? `rgba(0, 128, 0, ${ft.opacity})` : `rgba(255, 0, 0, ${ft.opacity})`;
                ctx.fillText(ft.text, ft.x, ft.y);
            });
            floatingTextsRef.current = floatingTextsRef.current.map(ft => ({ ...ft, y: ft.y - 0.5, opacity: ft.opacity - 0.015 })).filter(ft => ft.opacity > 0);

            particlesRef.current.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color + `${p.opacity})`;
                ctx.fill();
            });
            particlesRef.current = particlesRef.current.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, opacity: p.opacity - 0.03 })).filter(p => p.opacity > 0);
            
            ctx.restore();
            
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        gameLoop();
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameState, onComplete, score, lives]);


    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[800px] h-[55vw] min-h-[260px] max-h-[400px] bg-gray-200 rounded-lg overflow-hidden border-4 border-brand-dark-blue">
                <canvas ref={canvasRef} width="800" height="400" className="w-full h-full" />
                {gameState === 'start' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-4">
                        <h4 className="text-5xl font-bold">טפסו לפלוס!</h4>
                        <p className="text-2xl mt-2">השתמשו בחצים ימינה ושמאלה כדי לזוז ובמקש הרווח כדי לקפוץ.</p>
                        <button onClick={() => startGame(true)} className="mt-6 bg-brand-magenta text-white font-bold py-3 px-6 rounded-lg text-xl">התחל משחק</button>
                    </div>
                )}
                 {gameState === 'win' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
                        <h4 className="text-5xl font-bold text-green-400">ניצחת!</h4>
                        <p className="text-2xl mt-2">הגעת ליעד ונשארת בפלוס!</p>
                        <button onClick={() => startGame(true)} className="mt-6 bg-brand-teal text-white font-bold py-3 px-6 rounded-lg text-xl">שחק שוב</button>
                    </div>
                )}
                 {gameState === 'crashed' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-4">
                        <h4 className="text-5xl font-bold text-yellow-400">התרסקת!</h4>
                        <p className="text-2xl mt-2">{gameOverReason === 'fall' ? 'נפלת לתהום...' : 'ירדת למינוס!'}</p>
                        <p className="text-3xl mt-4">נשארו לך <span className="text-yellow-400">{lives}</span> נסיונות</p>
                        <button onClick={() => startGame(false)} className="mt-6 bg-brand-magenta text-white font-bold py-3 px-6 rounded-lg text-xl">נסה שוב</button>
                    </div>
                )}
                {gameState === 'gameOver' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-4">
                        <h4 className="text-5xl font-bold text-red-500">המשחק נגמר!</h4>
                         <p className="text-2xl mt-2">{gameOverReason === 'fall' ? 'נפלת ולא נשארו לך נסיונות.' : 'ירדת למינוס ולא נשארו לך נסיונות.'}</p>
                        <button onClick={() => startGame(true)} className="mt-6 bg-brand-magenta text-white font-bold py-3 px-6 rounded-lg text-xl">התחל מחדש</button>
                    </div>
                )}
                 <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/70 p-2 rounded-lg text-lg sm:text-3xl font-bold">
                    מאזן: <span className={score < 0 ? 'text-red-500' : 'text-green-600'}>{score} / {GOAL_SCORE} ₪</span>
                </div>
                 <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/70 p-2 rounded-lg text-lg sm:text-3xl font-bold flex gap-2">
                   {Array.from({length: lives}).map((_, i) => <span key={i}>❤️</span>)}
                </div>
            </div>
        </div>
    );
};

const OverdraftStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in text-center">
        <h3 className="text-5xl font-bold text-brand-magenta mb-4">משחק: טפסו לפלוס!</h3>
        <div className="bg-white/50 p-4 rounded-lg text-3xl text-brand-dark-blue/90 mb-6 max-w-4xl mx-auto shadow-inner leading-relaxed">
            אתם רוכבי אופנוע אמיצים והמטרה שלכם היא להגיע למאזן של <strong className="text-brand-teal">{GOAL_SCORE} ₪</strong>!
            <br/>
            השתמשו ב<strong>חיצים ימינה ושמאלה</strong> כדי לזוז וב<strong>מקש הרווח</strong> כדי לקפוץ. <strong>לחצו שוב על רווח באוויר כדי לבצע קפיצה כפולה!</strong>
            <br/>
            <strong className="text-yellow-600">💡 טיפ: אפשר לעבור דרך קצוות המסך כדי להופיע בצד השני!</strong>
            <br/>
            טפסו על הפלטפורמות, אספו מטבעות <strong className="text-green-600">ירוקים (+)</strong>, והימנעו ממטבעות <strong className="text-red-600">אדומים (-)</strong>. 
            <br/>
            יש לכם 3 נסיונות לפני שהמשחק מתחיל מחדש!
        </div>
        <MotorcycleGame onComplete={onComplete} />
    </div>
);


// Step 5: Quiz
const QuizStep: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
    const questions = [
        { q: "מהי הדרך הטובה ביותר להתחיל לחסוך כסף?", options: ["לחכות שיהיה לך הרבה כסף", "להציב מטרה ברורה וברת השגה", "לבקש מההורים יותר דמי כיס", "לקנות רק דברים יקרים"], answer: "להציב מטרה ברורה וברת השגה" },
        { q: "מה קורה כשנכנסים ל'מינוס' בבנק?", options: ["הבנק נותן לך כסף במתנה", "החשבון ננעל אוטומטית", "מתחילים לשלם ריבית גבוהה על החוב לבנק", "מקבלים הנחה על הקנייה הבאה"], answer: "מתחילים לשלם ריבית גבוהה על החוב לבנק" },
        { q: "יוסי רוצה לקנות אופניים שעולים 1,200 ₪. הוא חוסך 150 ₪ כל חודש. כמה זמן ייקח לו לחסוך?", options: ["6 חודשים", "8 חודשים", "10 חודשים", "שנה"], answer: "8 חודשים" },
        { q: "איזה מהבאים הוא דוגמה טובה לדרך יזמית להרוויח כסף?", options: ["לבקש העלאה בדמי הכיס", "לעשות בייביסיטר לשכנים", "להכין ולמכור צמידים", "לקבל מתנה ליום הולדת"], answer: "להכין ולמכור צמידים" },
    ];
    
    const [quizState, setQuizState] = useState<'not_started' | 'in_progress' | 'finished'>('not_started');
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState('');

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
            setQuizState('finished');
        }
    };

    const restartQuiz = () => {
        setQuizState('in_progress');
        setCurrent(0);
        setScore(0);
        setSelected('');
    };
    
    useEffect(() => {
        if (quizState === 'finished') {
            if (score / questions.length >= 0.75) { 
              onComplete();
            }
        }
    }, [quizState, score, onComplete, questions.length]);
    
    if (quizState === 'finished') {
        const isCompleted = score >= 3;
        const resultMessage = isCompleted
            ? "כל הכבוד! עמדתם ביעד והשלמתם את המודול!"
            : "עבודה טובה! נסו שוב כדי להגיע ל-80% הצלחה.";
        return (
             <div className="relative text-center p-6 bg-white/80 border-4 border-yellow-400 rounded-lg shadow-2xl">
                <TrophyIcon className="w-20 h-20 mx-auto text-yellow-500" />
                <h3 className="text-4xl font-bold mb-2 mt-4 text-brand-dark-blue">סיימת את הבוחן!</h3>
                <p className="text-2xl mb-4 text-brand-dark-blue/80">{resultMessage}</p>
                <div className="bg-brand-light-blue/20 p-3 rounded-lg my-4">
                    <p className="text-3xl">הציון שלך:</p>
                    <p className="text-5xl font-bold text-brand-light-blue">{score} / {questions.length}</p>
                </div>
                <button onClick={restartQuiz} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg text-xl">שחק/י שוב</button>
            </div>
        );
    }

    if (quizState === 'not_started') {
         return (
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg text-center">
                <h3 className="text-4xl font-bold mb-2">מוכנים? בחנו את עצמכם</h3>
                <p className="mb-6 text-xl">עליכם לענות נכון על 3 מתוך 4 שאלות כדי להשלים את המודול.</p>
                <button onClick={() => setQuizState('in_progress')} className="bg-brand-magenta hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg text-xl">התחל בוחן</button>
            </div>
        );
    }

    const q = questions[current];
    return (
        <div className="bg-white/50 p-6 rounded-lg">
            <div className="mb-4">
                <div className="bg-gray-300 rounded-full h-2.5">
                    <div className="bg-brand-teal h-2.5 rounded-full" style={{ width: `${((current + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">{q.q}</h3>
            <div className="space-y-3">
                {q.options.map(opt => {
                     const isCorrect = opt === q.answer;
                     const isSelected = opt === selected;
                     let buttonClass = 'bg-white/60 hover:bg-white';
                     if(selected) {
                         if(isCorrect) buttonClass = 'bg-green-500 text-white';
                         else if (isSelected) buttonClass = 'bg-red-500 text-white';
                         else buttonClass = 'bg-gray-200/50 opacity-60';
                     }
                    return (
                        <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                            className={`flex justify-between items-center w-full text-right p-3 rounded-lg transition-colors text-xl ${buttonClass}`}>
                            <span>{opt}</span>
                            {selected && isCorrect && <CheckIcon />}
                            {selected && isSelected && !isCorrect && <CrossIcon />}
                        </button>
                    );
                })}
            </div>
            {selected && <button onClick={handleNext} className="mt-6 w-full bg-brand-light-blue text-white font-bold py-3 rounded-lg text-xl">
                {current === questions.length - 1 ? 'סיים בוחן' : 'השאלה הבאה'}
            </button>}
        </div>
    );
};


// Main Module Component
const MoneyAndMeModule: React.FC<MoneyAndMeModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [overdraftGameCompleted, setOverdraftGameCompleted] = useState(false);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <FeelingsStep />;
            case 1: return <GoalSettingStep />;
            case 2: return <EarningMoneyStep />;
            case 3: return <OverdraftStep onComplete={() => setOverdraftGameCompleted(true)} />;
            case 4: return <QuizStep onComplete={onComplete} />;
            default: return <FeelingsStep />;
        }
    };

    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50'}`}>{index + 1}</div>
                                <p className={`mt-2 text-xs text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            
            {renderStepContent()}

            <div className="flex justify-between mt-8">
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
                <button 
                  onClick={() => setCurrentStep(s => s + 1)} 
                  disabled={currentStep === steps.length - 1 || (currentStep === 3 && !overdraftGameCompleted)} 
                  className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title={currentStep === 3 && !overdraftGameCompleted ? 'עליך לנצח במשחק כדי להמשיך' : ''}
                >
                    {currentStep === 3 && !overdraftGameCompleted ? 'השלם את המשחק' : 'הבא'}
                </button>
            </div>
        </ModuleView>
    );
};

export default MoneyAndMeModule;