import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

interface Story {
    id: number;
    text: string;
    saveChoice: { text: string, consequence: () => void };
    spendChoice: { text: string, consequence: () => void };
}

interface Level {
    level: number;
    rows: number;
    cols: number;
    ballSpeed: number;
}

const levels: Level[] = [
    { level: 1, rows: 4, cols: 8, ballSpeed: 4 },
    { level: 2, rows: 5, cols: 10, ballSpeed: 5 },
    { level: 3, rows: 6, cols: 10, ballSpeed: 6 },
];

const SmallDecisionsModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameState, setGameState] = useState<'intro' | 'level_intro' | 'playing' | 'paused' | 'win' | 'gameOver'>('intro');
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [currentLevel, setCurrentLevel] = useState(0);

    // Game state refs
    const paddleRef = useRef({ x: 350, width: 120 });
    const ballRef = useRef({ x: 400, y: 500, vx: 4, vy: -4, radius: 10, speedMultiplier: 1 });
    const bricksRef = useRef<any[]>([]);
    const powerUpsRef = useRef<any[]>([]);
    const particlesRef = useRef<any[]>([]);
    const livesRef = useRef(3);
    const animationFrameId = useRef<number>();
    const keysRef = useRef({ left: false, right: false });

    const BRICK_WIDTH = 75;
    const BRICK_HEIGHT = 30;

    const stories: Omit<Story, 'id'>[] = [
        {
            text: 'קיבלתם 10 שקלים דמי כיס! מה תעשו?',
            saveChoice: { text: 'להוסיף לחיסכון למשחק', consequence: () => { livesRef.current++; } },
            spendChoice: { text: 'לקנות גלידה עכשיו', consequence: () => { ballRef.current.speedMultiplier = 1.2; } },
        },
        {
            text: 'חבר מציע ללכת לסרט. הכרטיס עולה 40 ש"ח.',
            saveChoice: { text: 'להציע לשחק בפארק בחינם', consequence: () => { livesRef.current++; } },
            spendChoice: { text: 'ללכת לסרט ולבזבז', consequence: () => { paddleRef.current.width = Math.max(50, paddleRef.current.width - 20); } },
        },
        {
            text: 'מצאתם צעצוע מגניב בחנות בהנחה!',
            saveChoice: { text: 'להתאפק ולהישאר עם המטרה', consequence: () => { livesRef.current++; } },
            spendChoice: { text: 'לקנות אותו בדחף!', consequence: () => { ballRef.current.speedMultiplier = 1.3; } },
        },
        {
            text: 'יש לכם זמן פנוי. מה תעדיפו לעשות?',
            saveChoice: { text: 'לעזור במטלות הבית ולהרוויח עוד קצת כסף', consequence: () => { livesRef.current++; } },
            spendChoice: { text: 'לשחק במחשב כל אחר הצהריים', consequence: () => { paddleRef.current.width = Math.max(50, paddleRef.current.width - 20); } },
        },
        {
            text: 'קיבלתם מתנה כספית ליום ההולדת.',
            saveChoice: { text: 'לחסוך את רוב הכסף למטרה גדולה', consequence: () => { livesRef.current++; } },
            spendChoice: { text: 'לבזבז הכל על ממתקים וצעצועים קטנים', consequence: () => { ballRef.current.speedMultiplier = 1.2; } },
        },
    ];

    const createBricks = (level: Level) => {
        const newBricks = [];
        const totalBricks = level.rows * level.cols;
        const numStoryBricks = Math.floor(totalBricks * 0.1);
        
        let storyCounter = 0;

        for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.cols; c++) {
                const isStory = storyCounter < numStoryBricks && Math.random() < 0.2; // Distribute stories somewhat randomly
                const type = isStory ? 'story' : (Math.random() > 0.4 ? 'positive' : 'negative');
                
                if (isStory) storyCounter++;

                newBricks.push({
                    x: c * (BRICK_WIDTH + 5) + (800 - (level.cols * (BRICK_WIDTH + 5) - 5)) / 2,
                    y: r * (BRICK_HEIGHT + 5) + 60,
                    w: BRICK_WIDTH, h: BRICK_HEIGHT,
                    type: type,
                    icon: type === 'story' ? '📖' : (type === 'positive' ? '➕' : '➖'),
                    active: true,
                    storyId: isStory ? (storyCounter % stories.length) + 1 : null
                });
            }
        }
        bricksRef.current = newBricks;
    };
    
    const startLevel = (levelIndex: number) => {
        const level = levels[levelIndex];
        livesRef.current = 3;
        paddleRef.current = { x: 350, width: 120 };
        ballRef.current = { x: 400, y: 500, vx: (Math.random() - 0.5) * 8, vy: -level.ballSpeed, radius: 10, speedMultiplier: 1 };
        powerUpsRef.current = [];
        particlesRef.current = [];
        setActiveStory(null);
        createBricks(level);
        setGameState('playing');
    };

    const pauseAndShowStory = (storyId: number) => {
        setGameState('paused');
        const storyIndex = (storyId - 1) % stories.length; // Cycle through stories
        if (stories[storyIndex]) {
            setActiveStory({ id: storyId, ...stories[storyIndex] });
        }
    };

    const handleStoryChoice = (consequence: () => void) => {
        consequence();
        setActiveStory(null);
        setGameState('playing');
    };

    useEffect(() => {
        if (gameState !== 'playing' && gameState !== 'paused') {
             if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
             return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') keysRef.current.left = true;
            if (e.key === 'ArrowRight') keysRef.current.right = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') keysRef.current.left = false;
            if (e.key === 'ArrowRight') keysRef.current.right = false;
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const gameLoop = () => {
            if(gameState !== 'playing') {
                if(animationFrameId.current) animationFrameId.current = requestAnimationFrame(gameLoop);
                return;
            };

            // Update paddle
            if (keysRef.current.left) paddleRef.current.x = Math.max(0, paddleRef.current.x - 8);
            if (keysRef.current.right) paddleRef.current.x = Math.min(canvas.width - paddleRef.current.width, paddleRef.current.x + 8);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update ball
            const ball = ballRef.current;
            ball.x += ball.vx * ball.speedMultiplier;
            ball.y += ball.vy * ball.speedMultiplier;

            // Ball collisions
            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.vx *= -1;
            if (ball.y - ball.radius < 0) ball.vy *= -1;

            if (ball.y + ball.radius > canvas.height - 20 && ball.x > paddleRef.current.x && ball.x < paddleRef.current.x + paddleRef.current.width) {
                ball.vy *= -1; ball.speedMultiplier = 1;
                const hitPoint = (ball.x - (paddleRef.current.x + paddleRef.current.width / 2)) / (paddleRef.current.width / 2);
                ball.vx = hitPoint * 5;
            }

            if (ball.y + ball.radius > canvas.height) {
                livesRef.current--;
                if (livesRef.current <= 0) { setGameState('gameOver'); } 
                else { ball.x = 400; ball.y = 500; ball.vx = (Math.random() - 0.5) * 8; ball.vy = -levels[currentLevel].ballSpeed; paddleRef.current.width = 120; ball.speedMultiplier = 1;}
            }
            
            ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fillStyle = '#1b2550'; ctx.fill(); ctx.closePath();

            // Bricks
            bricksRef.current.forEach(brick => {
                if (brick.active) {
                    if (ball.x > brick.x && ball.x < brick.x + brick.w && ball.y > brick.y && ball.y < brick.y + brick.h) {
                        brick.active = false; ball.vy *= -1;
                        if (brick.storyId) { pauseAndShowStory(brick.storyId); } 
                        else if (Math.random() < 0.3) { powerUpsRef.current.push({ x: brick.x + brick.w / 2, y: brick.y, type: brick.type, icon: brick.type === 'positive' ? '➕' : '➖' }); }
                        for (let i = 0; i < 15; i++) { particlesRef.current.push({ x: ball.x, y: ball.y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 30, color: brick.icon === '📖' ? 'gold' : (brick.type === 'positive' ? '#00b1a6' : '#d52963') }); }
                    }
                    ctx.fillStyle = brick.icon === '📖' ? 'gold' : (brick.type === 'positive' ? '#00b1a6' : '#d52963');
                    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
                    ctx.font = '20px sans-serif'; ctx.fillStyle = brick.icon === '📖' ? 'black' : 'white';
                    ctx.fillText(brick.icon, brick.x + brick.w/2 - 10, brick.y + 22);
                }
            });

            // Check win condition for level
            const remainingGoalBricks = bricksRef.current.filter(b => (b.type === 'positive' || b.type === 'story') && b.active).length;
            if (remainingGoalBricks === 0) {
                if (currentLevel < levels.length - 1) {
                    setCurrentLevel(c => c + 1);
                    setGameState('level_intro');
                } else {
                    setGameState('win');
                    onComplete();
                }
            }
            
            // Powerups
            powerUpsRef.current.forEach((p, index) => {
                p.y += 2;
                ctx.font = '30px sans-serif'; ctx.fillText(p.icon, p.x, p.y);
                if (p.y > canvas.height - 20 && p.x > paddleRef.current.x && p.x < paddleRef.current.x + paddleRef.current.width) {
                    if (p.type === 'positive') paddleRef.current.width = Math.min(200, paddleRef.current.width + 30);
                    if (p.type === 'negative') paddleRef.current.width = Math.max(50, paddleRef.current.width - 20);
                    powerUpsRef.current.splice(index, 1);
                }
                if (p.y > canvas.height) powerUpsRef.current.splice(index, 1);
            });
            
            // Particles
            particlesRef.current.forEach((p, index) => {
                p.x += p.vx; p.y += p.vy; p.life--;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
                if (p.life <= 0) particlesRef.current.splice(index, 1);
            });
            
            // Paddle & HUD
            ctx.fillStyle = '#1b2550'; ctx.fillRect(paddleRef.current.x, canvas.height - 20, paddleRef.current.width, 10);
            ctx.font = '20px sans-serif'; ctx.fillStyle = '#1b2550';
            ctx.fillText(`חיים: ${'❤️'.repeat(livesRef.current)}`, 10, 30);
            ctx.fillText(`שלב: ${currentLevel + 1}`, canvas.width / 2 - 30, 30);
            ctx.fillText(`מטרות: ${remainingGoalBricks}`, canvas.width - 150, 30);
            
            animationFrameId.current = requestAnimationFrame(gameLoop);
        };
        gameLoop();
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameState, onComplete, currentLevel]);

    const renderOverlay = () => {
        const baseClasses = "absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white p-4 animate-fade-in";
        switch (gameState) {
            case 'intro': return (
                <div className={baseClasses}>
                    <h3 className="text-4xl font-bold">משחק ההחלטות הקטנות</h3>
                    <p className="text-xl mt-4 max-w-2xl text-center">
                        הזיזו את המחבט עם <strong>חיצים ימינה ושמאלה</strong>.
                        <br/>המטרה: שברו את כל לבני הפלוס (➕) והסיפור (📖) כדי לעבור שלב!
                        <br/><br/><strong>לבני סיפור (📖):</strong> פוגעים בהן כדי לקבל החלטה שתשפיע על המשחק.
                        <br/><strong>לבני פלוס (➕):</strong> יכולות לתת לכם בונוסים!
                        <br/><strong>לבני מינוס (➖):</strong> עלולות להקשות עליכם!
                    </p>
                    <button onClick={() => setGameState('level_intro')} className="mt-6 bg-brand-magenta font-bold py-3 px-6 rounded-lg text-xl">התחל משחק</button>
                </div>
            );
             case 'level_intro': return (
                <div className={baseClasses}>
                    <h3 className="text-5xl font-bold">שלב {currentLevel + 1}</h3>
                    <button onClick={() => startLevel(currentLevel)} className="mt-6 bg-brand-teal font-bold py-3 px-6 rounded-lg text-xl">התחל</button>
                </div>
             );
             case 'paused': return (
                activeStory && (
                    <div className={baseClasses}>
                        <div className="bg-white text-brand-dark-blue p-8 rounded-2xl max-w-md text-center">
                            <h4 className="font-bold text-3xl mb-4">{activeStory.text}</h4>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => handleStoryChoice(activeStory.saveChoice.consequence)} className="p-4 bg-brand-teal text-white rounded-lg text-lg">{activeStory.saveChoice.text}</button>
                                <button onClick={() => handleStoryChoice(activeStory.spendChoice.consequence)} className="p-4 bg-brand-magenta text-white rounded-lg text-lg">{activeStory.spendChoice.text}</button>
                            </div>
                        </div>
                    </div>
                )
             );
            case 'win': return (
                <div className={baseClasses}>
                    <h3 className="text-4xl font-bold text-green-400">ניצחת!</h3>
                    <p className="text-xl mt-4 max-w-lg text-center">כל הכבוד! בזכות התמקדות במטרות, השלמתם את כל השלבים!</p>
                    <button onClick={() => { setCurrentLevel(0); setGameState('intro'); }} className="mt-6 bg-brand-teal font-bold py-3 px-6 rounded-lg text-xl">שחק שוב</button>
                </div>
            );
            case 'gameOver': return (
                <div className={baseClasses}>
                    <h3 className="text-4xl font-bold text-red-500">המשחק נגמר</h3>
                    <p className="text-xl mt-4 max-w-lg text-center">לא נורא, נסו שוב! לפעמים צריך כמה נסיונות כדי להצליח.</p>
                    <button onClick={() => startLevel(currentLevel)} className="mt-6 bg-brand-magenta font-bold py-3 px-6 rounded-lg text-xl">נסה שוב (שלב {currentLevel + 1})</button>
                </div>
            );
            default: return null;
        }
    };

    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="bg-white/40 p-2 rounded-2xl">
                <div className="relative w-full aspect-[2/1.5] max-w-[800px] mx-auto">
                    <canvas ref={canvasRef} width="800" height="600" className="w-full h-full bg-blue-100 rounded-lg"></canvas>
                    {renderOverlay()}
                </div>
            </div>
        </ModuleView>
    );
};

export default SmallDecisionsModule;