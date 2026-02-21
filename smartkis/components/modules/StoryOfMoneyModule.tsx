import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface StoryOfMoneyModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ["מהו סחר חליפין?", "אתגר הברטר", "מבוך הזהב", "ההיסטוריה של הכסף", "בוחן ידע"];

// Step 1: Barter Introduction
const BarterIntroduction: React.FC = () => (
    <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in space-y-6">
        <h3 className="text-4xl font-bold text-brand-teal mb-4 text-center">העולם שלפני הכסף: סחר חליפין</h3>
        <p className="text-2xl text-center text-brand-dark-blue/90">
            פעם, לפני שהיו מטבעות ושטרות, כדי להשיג משהו הייתם צריכים לתת משהו אחר בתמורה. לשיטה הזו קוראים <strong>"ברטר"</strong>.
        </p>
        <div className="flex items-center justify-around gap-4 my-8 p-6 bg-white/50 rounded-2xl shadow-inner w-full max-w-3xl mx-auto">
            <div className="text-center">
                <div className="text-9xl mb-2">👨‍🌾</div>
                <p className="font-bold text-2xl bg-white/70 px-3 py-1 rounded-full">חקלאי עם תפוח</p>
            </div>
            <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-brand-light-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </div>
            <div className="text-center">
                <div className="text-9xl mb-2">🎣</div>
                <p className="font-bold text-2xl bg-white/70 px-3 py-1 rounded-full">דייג עם דג</p>
            </div>
        </div>
        <p className="text-3xl font-bold text-brand-dark-blue/90 text-center bg-white/40 p-4 rounded-xl">
           הבעיה? היה צריך "צירוף מקרים כפול" - למצוא מישהו שגם רוצה את מה שיש לכם וגם יש לו את מה שאתם צריכים.
        </p>
    </div>
);


// Step 2: Barter Game
const BarterGame: React.FC = () => {
    const traders = [
        { name: 'דייג', icon: '🐟', wants: '🔱', gives: '🐟' },
        { name: 'חוטב עצים', icon: '🌳', wants: '🐟', gives: '🌳' },
        { name: 'אופה', icon: '🍞', wants: '🌳', gives: '🍞' },
        { name: 'אורגת', icon: '🧣', wants: '🍞', gives: '🧣' },
        { name: 'חקלאי', icon: '🍎', wants: '🧣', gives: '🍎' },
        { name: 'קדר', icon: '🏺', wants: '🍎', gives: '🏺' }
    ];
    
    const startItem = { name: 'חנית', icon: '🔱' };
    const goalItem = { name: 'כד', icon: '🏺' };

    const [inventory, setInventory] = useState<{name:string, icon:string}[]>([startItem]);
    const [selectedItem, setSelectedItem] = useState<{name:string, icon:string} | null>(null);
    const [message, setMessage] = useState('');
    const hasWon = inventory.some(item => item.icon === goalItem.icon);

    const handleTrade = (trader: typeof traders[0]) => {
        if (!selectedItem) {
            setMessage('בחר פריט מהתיק שלך קודם!');
            return;
        }

        if (selectedItem.icon === trader.wants) {
            const newItem = traders.find(t => t.gives === trader.gives);
            if (newItem) {
                setInventory(prev => [...prev.filter(i => i.name !== selectedItem.name), {name: newItem.name, icon: newItem.gives}]);
                setMessage(`החלפת ${selectedItem.name} ב${newItem.name}!`);
                setSelectedItem(null);
            }
        } else {
            setMessage(`הסוחר הזה לא רוצה ${selectedItem.name}... הוא רוצה ${trader.wants}`);
        }
    };

    return (
        <div className="bg-white/40 p-8 rounded-2xl">
            <h3 className="text-4xl font-bold text-center mb-4">אתגר הברטר</h3>
             <div className="bg-white/50 p-4 rounded-lg text-center mb-6 max-w-3xl mx-auto border-2 border-brand-teal/50">
                <p className="font-bold text-3xl mb-2">📜 המשימה שלכם:</p>
                <p className="text-2xl">התחלתם עם <strong>{startItem.name} {startItem.icon}</strong>. עליכם לבצע סדרת החלפות עם הסוחרים בשוק כדי להשיג <strong>{goalItem.name} {goalItem.icon}</strong>.</p>
                <p className="font-bold text-2xl mt-4">איך משחקים?</p>
                <ol className="list-decimal list-inside text-left mx-auto max-w-md text-xl">
                    <li>לחצו על פריט מהתיק שלכם כדי לבחור בו.</li>
                    <li>לחצו על הסוחר שאיתו תרצו לבצע החלפה.</li>
                    <li>כל סוחר רוצה פריט אחר! בדקו מה כל אחד רוצה.</li>
                </ol>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-bold text-3xl mb-4 text-center">הסוחרים בשוק:</h4>
                    <div className="grid grid-cols-3 gap-6">
                        {traders.map(trader => (
                            <div key={trader.name} onClick={() => handleTrade(trader)} className="text-center p-4 bg-white/70 rounded-2xl cursor-pointer hover:bg-white transform hover:scale-105 transition-transform shadow-lg border border-white/50">
                                <span className="text-8xl">{trader.icon}</span>
                                <p className="font-bold text-2xl mt-2">{trader.name}</p>
                                <p className="font-bold text-xl mt-2 bg-gray-200/70 p-1 rounded-md">רוצה: <span className="text-3xl">{trader.wants}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-3xl mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-800" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2h2a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h2V4zm2 0h6V3a1 1 0 00-1-1H8a1 1 0 00-1 1v1z" />
                        </svg>
                        התיק שלך:
                    </h4>
                     <div className="flex gap-4 p-4 bg-yellow-800/20 border-2 border-yellow-800/50 rounded-2xl min-h-[160px] flex-wrap">
                        {inventory.map(item => (
                            <div key={item.name} onClick={() => setSelectedItem(item)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all ${selectedItem?.name === item.name ? 'bg-brand-light-blue ring-4 ring-brand-teal' : 'bg-white/80'}`}>
                                <span className="text-6xl">{item.icon}</span>
                                <p className="font-bold text-center text-lg">{item.name}</p>
                            </div>
                        ))}
                    </div>
                     {message && <p className="text-center font-bold mt-6 text-2xl p-3 bg-white/50 rounded-lg">{message}</p>}
                    {hasWon && <p className="text-center font-bold mt-4 text-3xl text-green-600 animate-bounce">כל הכבוד! הצלחתם במשימה!</p>}
                </div>
            </div>
           
        </div>
    )
};


// Step 3: Maze Game
const MazeGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [message, setMessage] = useState('השתמשו במקשי החצים כדי לזוז. אספו את כל 8 המטבעות!');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = 30;
        const maze = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 2, 1, 0, 1, 2, 0, 0, 1, 0, 2, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 2, 1, 1, 1, 0, 1, 1, 1],
            [1, 2, 0, 0, 1, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        let player = { x: 1, y: 1 };
        let coins = 8;
        
        canvas.width = maze[0].length * cellSize;
        canvas.height = maze.length * cellSize;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let y = 0; y < maze.length; y++) {
                for (let x = 0; x < maze[y].length; x++) {
                    if (maze[y][x] === 1) { // Wall
                        ctx.fillStyle = '#1b2550';
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (maze[y][x] === 2) { // Coin
                        ctx.fillStyle = 'gold';
                        ctx.beginPath();
                        ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 3, 0, 2 * Math.PI);
                        ctx.fill();
                    } else if (maze[y][x] === 3) { // Exit
                        ctx.fillStyle = '#00b1a6';
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    }
                }
            }
             // Player
            ctx.fillStyle = '#d52963';
            ctx.fillRect(player.x * cellSize + 5, player.y * cellSize + 5, cellSize - 10, cellSize - 10);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            let newX = player.x;
            let newY = player.y;
            if (e.key === 'ArrowUp') newY--;
            if (e.key === 'ArrowDown') newY++;
            if (e.key === 'ArrowLeft') newX--;
            if (e.key === 'ArrowRight') newX++;

            if (maze[newY]?.[newX] !== 1) {
                player = { x: newX, y: newY };
                if (maze[newY][newX] === 2) {
                    maze[newY][newX] = 0;
                    coins--;
                    setMessage(`נשארו ${coins} מטבעות!`);
                }
                if (maze[newY][newX] === 3) {
                    if (coins === 0) {
                        setMessage('כל הכבוד! הגעת ליציאה והוכחת שזהב הוא אמצעי חליפין טוב!');
                        window.removeEventListener('keydown', handleKeyDown);
                    } else {
                        setMessage(`אתה צריך לאסוף עוד ${coins} מטבעות לפני שתוכל לצאת!`);
                    }
                }
                draw();
            }
        };

        draw();
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="bg-white/40 p-8 rounded-2xl text-center">
            <h3 className="text-4xl font-bold mb-4">מבוך הזהב</h3>
            <p className="mb-4 text-xl">כדי לפתור את בעיית הברטר, אנשים התחילו להשתמש במתכות יקרות כמו זהב. זהב הוא נדיר, ניתן לחלוקה, וכולם רוצים אותו! </p>
            <canvas ref={canvasRef} className="bg-white/50 rounded-lg mx-auto border-2 border-brand-dark-blue"></canvas>
            <p className="font-bold text-2xl mt-4">{message}</p>
        </div>
    );
};


// Step 4: Money Evolution
const MoneyEvolution: React.FC = () => {
    const timeline = [
        { year: '9000 לפנה"ס', title: 'סחר חליפין', icon: '🤝', desc: 'החלפת סחורות ושירותים ישירות, ללא שימוש בכסף.' },
        { year: '1200 לפנה"ס', title: 'כסף סחורות', icon: '🐚', desc: 'שימוש בחפצים כמו צדפים, מלח או תבלינים כאמצעי תשלום.' },
        { year: '600 לפנה"ס', title: 'מטבעות ראשונים', icon: '🪙', desc: 'בממלכת לידיה (טורקיה של היום) הוטבעו המטבעות הראשונים מזהב וכסף.' },
        { year: 'המאה ה-7', title: 'שטרות נייר', icon: '📜', desc: 'הסינים המציאו את שטרות הנייר הראשונים, שהיו קלים ונוחים יותר לנשיאה.' },
        { year: '1950', title: 'כרטיסי אשראי', icon: '💳', desc: 'הופעת כרטיסי האשראי הראשונים, ששינו את צורת התשלום בעולם המודרני.' },
        { year: 'היום', title: 'כסף דיגיטלי', icon: '📱', desc: 'תשלומים באפליקציות, מטבעות קריפטוגרפיים - הכסף הופך ליותר ויותר וירטואלי.' },
    ];
    return (
         <div className="bg-white/40 p-8 rounded-2xl">
            <h3 className="text-4xl font-bold text-center mb-8">ציר הזמן של הכסף</h3>
            <div className="relative wrap overflow-hidden p-10 h-full">
                <div className="absolute h-full border-4 border-brand-light-blue/50" style={{left: '50%'}}></div>
                {timeline.map((item, index) => (
                    <div key={index} className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'}`}>
                        <div className="order-1 w-5/12"></div>
                        <div className="z-20 flex items-center order-1 bg-brand-teal shadow-xl w-16 h-16 rounded-full">
                            <h1 className="mx-auto font-semibold text-3xl text-white">{item.icon}</h1>
                        </div>
                        <div className="order-1 bg-gradient-to-br from-white/90 to-gray-100/90 rounded-xl shadow-2xl w-5/12 px-6 py-4 border border-white/50">
                            <p className="font-black text-3xl text-brand-magenta mb-1">{item.year}</p>
                            <h4 className="mb-2 font-bold text-brand-dark-blue text-3xl">{item.title}</h4>
                            <p className="text-xl leading-snug tracking-wide text-brand-dark-blue/80">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// Step 5: Quiz
const Quiz: React.FC<{onComplete: () => void}> = ({onComplete}) => {
    const quizQuestions = [
        { q: 'מה הייתה הבעיה העיקרית בסחר חליפין (ברטר)?', o: ['זה היה איטי מדי', 'הצורך ב"צירוף מקרים כפול"', 'לא היו מספיק סחורות', 'היה צריך לשלם מס'], a: 'הצורך ב"צירוף מקרים כפול"' },
        { q: 'היכן הוטבעו המטבעות הראשונים בעולם?', o: ['מצרים העתיקה', 'יוון העתיקה', 'ממלכת לידיה', 'האימפריה הרומית'], a: 'ממלכת לידיה' },
        { q: 'מי המציא את שטרות הנייר הראשונים?', o: ['האיטלקים', 'היוונים', 'הסינים', 'הבריטים'], a: 'הסינים' },
        { q: 'מהי דוגמה ל"כסף סחורות" שהיה בשימוש בעבר?', o: ['צדפים ומלח', 'זהב', 'דולרים', 'אפליקציות תשלום'], a: 'צדפים ומלח' },
        { q: 'מה הופך את הזהב לאמצעי חליפין טוב, בניגוד לברטר?', o: ['הוא נדיר וכולם רוצים אותו', 'הוא מבריק ויפה', 'אפשר למצוא אותו בכל מקום', 'הוא כבד מאוד'], a: 'הוא נדיר וכולם רוצים אותו' }
    ];

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState('');
    const [answerState, setAnswerState] = useState<'pending' | 'correct' | 'incorrect' | null>(null);
    const [finished, setFinished] = useState(false);
    const prizeLevels = [100, 500, 1000, 5000, 10000].reverse();

    useEffect(() => {
        if (finished) {
            if (score / quizQuestions.length >= 0.8) { 
                onComplete();
            }
        }
    }, [finished, score, onComplete, quizQuestions.length]);

    const handleSelect = (opt: string) => {
        if(selected) return;
        setSelected(opt);
        setAnswerState('pending');

        setTimeout(() => {
             if(opt === quizQuestions[current].a) {
                setScore(s => s + 1);
                setAnswerState('correct');
            } else {
                setAnswerState('incorrect');
            }
        }, 1500);
    };
    
    const handleNext = () => {
        if (current === quizQuestions.length - 1) {
            setFinished(true);
        } else {
            setCurrent(c => c + 1);
            setSelected('');
            setAnswerState(null);
        }
    };
    
    if (finished) {
        return (
            <div className="text-center bg-white/80 p-6 rounded-lg shadow-2xl">
                <TrophyIcon className="w-24 h-24 mx-auto text-yellow-500" />
                <h3 className="text-4xl font-bold mt-4">סיימתם את החידון!</h3>
                <p className="text-2xl my-4">הציון שלכם: <span className="font-bold text-brand-light-blue text-3xl">{score} / {quizQuestions.length}</span></p>
                {(score/quizQuestions.length >= 0.8) ?
                    <p className="text-green-600 font-bold text-xl">כל הכבוד! השלמתם את המודול!</p> :
                    <p className="text-red-600 font-bold text-xl">עבודה טובה! נסו שוב כדי להגיע ל-80% הצלחה.</p>
                }
            </div>
        )
    }

    const q = quizQuestions[current];
    return (
        <div className="bg-brand-dark-blue p-4 sm:p-6 rounded-2xl text-white shadow-2xl">
            <p className="text-center mb-4 text-gray-300 text-xl">ברוכים הבאים לחידון "סיפורו של כסף"! ענו נכון כדי לזכות בפרס הגדול.</p>
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="bg-white/10 p-6 rounded-xl border-2 border-brand-light-blue min-h-[120px] flex items-center justify-center">
                        <p className="font-bold text-3xl text-center">{q.q}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {q.o.map((opt) => {
                             const isSelected = selected === opt;
                             const isCorrect = answerState && q.a === opt;
                             let stateClass = '';
                             if (answerState === 'pending' && isSelected) stateClass = 'bg-yellow-500 animate-pulse';
                             else if (answerState === 'correct' && isCorrect) stateClass = 'bg-green-500';
                             else if (answerState === 'incorrect' && isSelected) stateClass = 'bg-red-500';
                             else if (answerState === 'incorrect' && isCorrect) stateClass = 'bg-green-500/50 border-green-400';

                            return (
                                <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                                    className={`flex items-center p-4 rounded-lg border-2 border-brand-light-blue transition-all duration-300 min-h-[80px] text-xl ${stateClass || 'bg-brand-dark-blue hover:bg-brand-light-blue/20'}`}>
                                    {opt}
                                </button>
                            )
                        })}
                    </div>
                     {answerState && answerState !== 'pending' && (
                        <button onClick={handleNext} className="mt-6 w-full bg-brand-magenta font-bold p-3 rounded-lg text-2xl animate-fade-in">
                            {current === quizQuestions.length - 1 ? 'סיים חידון' : 'לשאלה הבאה'}
                        </button>
                    )}
                </div>
                 <div className="lg:col-span-1 bg-white/10 p-4 rounded-xl flex flex-col-reverse">
                    {prizeLevels.map((level, index) => (
                        <div key={level} className={`p-2 my-1 rounded text-center font-bold text-lg ${
                            score > (prizeLevels.length - 1 - index) ? 'bg-green-500 text-white' : 
                            current === (prizeLevels.length - 1 - index) ? 'bg-yellow-400 text-black' : 
                            'bg-brand-dark-blue'
                        }`}>
                           <span className="text-gray-400 mr-2">{prizeLevels.length - index}</span> {level.toLocaleString()} ₪
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const StoryOfMoneyModule: React.FC<StoryOfMoneyModuleProps> = ({ onBack, title, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <BarterIntroduction />;
            case 1: return <BarterGame />;
            case 2: return <MazeGame />;
            case 3: return <MoneyEvolution />;
            case 4: return <Quiz onComplete={onComplete} />;
            default: return <BarterIntroduction />;
        }
    };

    return (
        <ModuleView title={title} onBack={onBack}>
             <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= index ? 'bg-brand-teal text-white' : 'bg-white/50'}`}>{index + 1}</div>
                                <p className={`mt-2 text-xs text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {renderStepContent()}
            <div className="flex justify-between mt-8">
                <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
                <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length - 1} className="bg-brand-teal text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">הבא</button>
            </div>
        </ModuleView>
    );
};

export default StoryOfMoneyModule;