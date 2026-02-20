import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../../ModuleView';

interface ModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const BOARD_SIZE = 20;
const INITIAL_SPEED = 200;

const tricks = [
    { id: 1, title: 'הצעצוע נראה גדול יותר!', text: 'בפרסומת משתמשים בזוויות צילום מיוחדות כדי שהצעצוע ייראה ענק, אבל במציאות הוא קטן יותר.' },
    { id: 2, title: 'סוללות לא כלולות!', text: 'הצעצוע זז ומאיר בפרסומת, אבל שוכחים להגיד שצריך לקנות לו סוללות בנפרד.' },
    { id: 3, title: 'הילדים תמיד שמחים מדי!', text: 'בפרסומות מראים ילדים שצוחקים וקופצים משמחה, כדי שנחשוב שהצעצוע הזה הוא הדבר הכי כיף בעולם.' },
    { id: 4, title: 'נמכר בנפרד!', text: 'לפעמים בפרסומת מראים הרבה אביזרים ובובות, אבל באריזה מקבלים רק את הבובה הראשית. את השאר צריך לקנות בנפרד.' },
];

const AdSecretsModule: React.FC<ModuleProps> = ({ onBack, title, onComplete }) => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState({ x: 0, y: -1 });
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'paused' | 'gameOver'>('intro');
    const [special, setSpecial] = useState<{ x: number, y: number } | null>(null);
    const [activeModal, setActiveModal] = useState<(typeof tricks[0]) | null>(null);
    const [foundTricks, setFoundTricks] = useState<number[]>([]);

    const directionRef = useRef(direction);
    directionRef.current = direction;

    const generatePosition = (currentSnake: {x:number, y:number}[]) => {
        let newPos;
        do {
            newPos = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };
        } while (currentSnake.some(s => s.x === newPos.x && s.y === newPos.y));
        return newPos;
    };

    useEffect(() => {
        if (gameState !== 'playing') return;

        const move = () => {
            setSnake(prev => {
                const newSnake = [...prev];
                const head = { x: newSnake[0].x + directionRef.current.x, y: newSnake[0].y + directionRef.current.y };

                if (head.x < 0) head.x = BOARD_SIZE - 1;
                if (head.x >= BOARD_SIZE) head.x = 0;
                if (head.y < 0) head.y = BOARD_SIZE - 1;
                if (head.y >= BOARD_SIZE) head.y = 0;
                
                for (let i = 1; i < newSnake.length; i++) {
                    if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
                        setGameState('gameOver');
                        return prev;
                    }
                }

                newSnake.unshift(head);
                let ate = false;

                if (head.x === food.x && head.y === food.y) {
                    ate = true;
                    const newScore = score + 1;
                    setScore(newScore);
                    setFood(generatePosition(newSnake));
                    if (newScore % 5 === 0 && foundTricks.length < tricks.length) {
                        setSpecial(generatePosition(newSnake));
                    }
                }

                if (special && head.x === special.x && head.y === special.y) {
                    ate = true;
                    setSpecial(null);
                    setGameState('paused');
                    const trickToShow = tricks[foundTricks.length];
                    setActiveModal(trickToShow);
                    setFoundTricks(prev => [...prev, trickToShow.id]);
                }

                if (!ate) {
                    newSnake.pop();
                }
                return newSnake;
            });
        };

        const interval = setInterval(move, INITIAL_SPEED);
        return () => clearInterval(interval);
    }, [gameState, food, score, special, foundTricks.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
            const { x: dx, y: dy } = directionRef.current;
            switch (e.key) {
                case 'ArrowUp': if (dy === 0) setDirection({ x: 0, y: -1 }); break;
                case 'ArrowDown': if (dy === 0) setDirection({ x: 0, y: 1 }); break;
                case 'ArrowRight': if (dx === 0) setDirection({ x: -1, y: 0 }); break;
                case 'ArrowLeft': if (dx === 0) setDirection({ x: 1, y: 0 }); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    
     useEffect(() => {
        if (foundTricks.length === tricks.length) {
            onComplete();
        }
    }, [foundTricks, onComplete]);

    const closeModal = () => {
        setActiveModal(null);
        setGameState('playing');
    };

    const restartGame = () => {
        setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }]);
        setFood({ x: 15, y: 15 });
        setDirection({ x: 0, y: -1 });
        setScore(0);
        setGameState('playing');
        setSpecial(null);
        setActiveModal(null);
        setFoundTricks([]);
    };

    return (
        <ModuleView title={title} onBack={onBack}>
            <div className="text-center bg-white/40 backdrop-blur-md p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50">
                 {gameState === 'intro' ? (
                     <div className="p-8">
                        <h3 className="text-4xl font-bold text-brand-teal mb-4">נחש פיננסי: סודות הפרסומות</h3>
                        <p className="text-2xl mb-4 leading-relaxed">
                            פרסומות נמצאות בכל מקום: בטלוויזיה, בטלפון וברחוב.
                            <br/>
                            המטרה שלהן היא לגרום לנו לרצות לקנות דברים, לפעמים גם דברים שאנחנו לא באמת צריכים.
                            <br/>
                            הן משתמשות ב<strong>הרבה טריקים</strong> כדי לשכנע אותנו.
                        </p>
                         <div className="bg-white/50 p-4 rounded-xl shadow-inner my-6 max-w-2xl mx-auto">
                            <h4 className="font-bold text-2xl mb-2">איך משחקים?</h4>
                            <p className="text-2xl leading-relaxed">
                                אספו <strong>5 מטבעות 💰</strong> כדי לחשוף זכוכית מגדלת 🔍.
                                <br />
                                תפסו את <strong>זכוכית המגדלת</strong> כדי לגלות את הסוד!
                            </p>
                        </div>
                        <button onClick={restartGame} className="bg-brand-magenta text-white font-bold py-3 px-8 rounded-2xl text-2xl shadow-lg hover:scale-105 transform transition-transform">
                            התחל משחק
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-around items-center font-bold text-3xl mb-4 bg-white/50 p-4 rounded-xl shadow-inner">
                            <span>ניקוד: {score}</span>
                            <span>סודות שגולו: {foundTricks.length} / {tricks.length}</span>
                        </div>
                        <div className="relative w-full max-w-[500px] h-auto aspect-square bg-brand-dark-blue border-8 border-blue-900 rounded-3xl mx-auto grid shadow-2xl p-4"
                            style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
                            
                             <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>

                            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
                                const x = i % BOARD_SIZE;
                                const y = Math.floor(i / BOARD_SIZE);
                                const isSnake = snake.some(s => s.x === x && s.y === y);
                                const isHead = isSnake && snake[0].x === x && snake[0].y === y;
                                const isFood = food.x === x && food.y === y;
                                const isSpecial = special && special.x === x && special.y === y;
                                return (
                                    <div key={i} className={`w-full h-full flex items-center justify-center`}>
                                        <div className={`w-[90%] h-[90%] rounded-sm transition-colors ${
                                            isHead ? 'bg-brand-teal' : isSnake ? 'bg-brand-light-blue' : 'bg-transparent'
                                        }`}>
                                            {isFood && <span className="text-3xl">💰</span>}
                                            {isSpecial && <span className="text-3xl">🔍</span>}
                                        </div>
                                    </div>
                                );
                            })}
                            {gameState === 'gameOver' && <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-2xl text-white"><p className="text-5xl font-bold">המשחק נגמר!</p><button onClick={restartGame} className="mt-6 bg-brand-teal py-3 px-6 rounded-xl text-xl font-bold">שחק שוב</button></div>}
                        </div>
                        {foundTricks.length === tricks.length && <p className="mt-6 text-3xl font-bold text-green-600 animate-bounce">כל הכבוד! גיליתם את כל הסודות!</p>}
                    </>
                 )}
            </div>
            {activeModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-3xl max-w-md text-center animate-fade-in shadow-2xl border border-white/50">
                        <h4 className="text-4xl font-bold text-brand-teal mb-4">{activeModal.title}</h4>
                        <p className="text-2xl text-brand-dark-blue/90">{activeModal.text}</p>
                        <button onClick={closeModal} className="mt-8 bg-brand-magenta text-white font-bold py-3 px-8 rounded-2xl text-xl shadow-lg hover:scale-105 transform transition-transform">המשך לשחק</button>
                    </div>
                </div>
            )}
        </ModuleView>
    );
};

export default AdSecretsModule;