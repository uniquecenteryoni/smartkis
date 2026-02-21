import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../ModuleView';
import { TrophyIcon } from '../icons/Icons';

interface RelationshipsMoneyModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const steps = ["אישיות פיננסית", "דילמות חברתיות", "אומרים את זה נכון"];

// --- Chapter 1: Money Personality Quiz ---
type Superpower = 'Saver' | 'Spender' | 'Giver' | 'Avoider';
const MoneyPersonalityQuiz: React.FC<{ onQuizComplete: (power: Superpower) => void }> = ({ onQuizComplete }) => {
    const questions = [
        { q: 'קיבלת 100₪ במתנה. מה הדבר הראשון שאתה עושה?', options: { Spender: 'חושב מה אפשר לקנות עם זה', Saver: 'מכניס אותו ישר לקופת החיסכון', Giver: 'חושב איך לפנק חבר או בן משפחה', Avoider: 'שם אותו בארנק ושוכח ממנו' } },
        { q: 'חברים מציעים יציאה יקרה. המחשבה הראשונה שלך היא...', options: { Giver: 'ברור, אני אשלם על כולם!', Spender: 'נשמע כיף! יאללה נזרום', Avoider: 'אלך, ואדאג לגבי הכסף אחר כך', Saver: 'אולי נציע משהו זול יותר?' } },
        { q: 'כשאתה חושב על כסף, אתה מרגיש בעיקר...', options: { Saver: 'ביטחון כשיש, לחץ כשאין', Avoider: 'לחץ ובלבול, מעדיף לא לחשוב על זה', Spender: 'שמחה וריגוש מהאפשרויות', Giver: 'שזה כלי לעזור לאחרים' } },
        { q: 'כשאת/ה רואה מבצע בחנות, את/ה...', options: { Spender: 'קונה דברים שלא תכננת רק בגלל ההנחה', Saver: 'בודק/ת אם זה משהו שבאמת היית צריך/ה', Avoider: 'מרגיש/ה מוצף/ת ועוזב/ת את החנות', Giver: 'מיד חושב/ת למי אפשר לקנות את זה כמתנה' } },
        { q: 'חבר מבקש ממך הלוואה קטנה. התגובה הראשונית שלך היא...', options: { Giver: 'לתת לו בשמחה בלי לשאול שאלות', Avoider: 'להסכים, אבל להרגיש מאוד לא בנוח עם זה', Saver: 'לשאול בנימוס מתי יוכל להחזיר', Spender: 'להסכים, ולהציע שתשלם עליו ביציאה הבאה' } },
        { q: 'איך היית מתאר/ת את חשבון הבנק שלך?', options: { Saver: 'אני בודק אותו כל יום', Spender: 'זה כסף שנועד שישתמשו בו!', Giver: 'זה משאב שיכול לעזור לאחרים', Avoider: 'אני משתדל/ת לא להסתכל עליו יותר מדי' } },
    ];
    const [answers, setAnswers] = useState<Record<number, Superpower | null>>({});
    
    const handleAnswer = (qIndex: number, power: Superpower) => {
        setAnswers(prev => ({ ...prev, [qIndex]: power }));
    };

    useEffect(() => {
        if (Object.keys(answers).length === questions.length) {
            const counts: Record<Superpower, number> = { Saver: 0, Spender: 0, Giver: 0, Avoider: 0 };
            Object.values(answers).forEach(power => { if (typeof power === 'string') counts[power as Superpower]++; });
            const dominantPower = (Object.keys(counts) as Superpower[]).reduce((a, b) => (counts[a] > counts[b] ? a : b));
            setTimeout(() => onQuizComplete(dominantPower), 500);
        }
    }, [answers, questions.length, onQuizComplete]);

    return (
        <div className="bg-white/40 p-8 rounded-2xl text-center animate-fade-in">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">פרק 1: מהי אישיות הכסף שלכם?</h3>
            <p className="text-2xl mb-8">ענו על השאלות וגלו איך אתם מתנהלים עם כסף.</p>
            <div className="space-y-8">
                {questions.map((q, i) => (
                    <div key={i}>
                        <h4 className="font-bold text-3xl mb-4">{q.q}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(q.options).map(([power, text]) => (
                                <button key={power} onClick={() => handleAnswer(i, power as Superpower)}
                                    className={`p-4 rounded-lg transition-all text-xl ${answers[i] === power ? 'bg-brand-light-blue text-white ring-4 ring-brand-teal' : 'bg-white/70 hover:bg-white'}`}>
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const QuizResult: React.FC<{ result: Superpower }> = ({ result }) => {
    const resultsInfo: Record<Superpower, { name: string; icon: string; desc: string }> = {
        Saver: { name: 'החסכן', icon: '🐷', desc: 'אתה חושב לטווח ארוך ומעולה בלחסוך למטרות. לפעמים זה יכול למנוע ממך ליהנות מהרגע.' },
        Spender: { name: 'הבזבזן', icon: '🛍️', desc: 'אתה אוהב לחיות את הרגע וליהנות מהכסף שלך! לפעמים, זה עלול להקשות על חיסכון למטרות גדולות.' },
        Giver: { name: 'הנותן', icon: '🎁', desc: 'אתה נדיב ואוהב להשתמש בכסף כדי לשמח אחרים. חשוב לוודא שאתה לא שוכח לדאוג גם לעצמך.' },
        Avoider: { name: 'הנמנע', icon: '🙈', desc: 'אתה מעדיף לא לחשוב על כסף כי זה מלחיץ אותך. התעלמות עלולה לגרום לבעיות בעתיד.' },
    };
    const info = resultsInfo[result];
    return (
         <div className="bg-white/40 p-8 rounded-2xl text-center animate-fade-in">
            <h3 className="text-4xl font-bold text-brand-teal mb-4">אישיות הכסף שלכם היא:</h3>
            <div className="bg-white/60 p-6 rounded-2xl inline-block">
                <p className="text-6xl">{info.icon}</p>
                <h4 className="text-5xl font-bold mt-2">{info.name}</h4>
            </div>
            <p className="text-2xl mt-6 max-w-2xl mx-auto">{info.desc}</p>
            <p className="mt-4 p-3 bg-yellow-100/70 text-yellow-800 rounded-lg text-xl font-semibold">
                <b>הערה:</b> זוהי רק הגדרה כללית ורובנו מורכבים משילוב של כמה אישיויות. המטרה היא להכיר את הנטיות שלנו כדי לקבל החלטות טובות יותר.
            </p>
        </div>
    )
};


// --- Chapter 2: Financial Snake Game ---
const BOARD_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 4;

interface Dilemma {
  id: number;
  question: string;
  options: { text: string; feedback: string }[];
}

const dilemmas: Dilemma[] = [
    { id: 1, question: "חבר שכח את הארנק ומבקש שתשלם עליו כרטיס לסרט (50₪), ומבטיח להחזיר לך. מה תעשה?", options: [{ text: "אשלם בשמחה. חברים עוזרים אחד לשני.", feedback: "נדיב מצידך! רק ודא שאתה יכול להרשות זאת לעצמך ושנעים לך להזכיר לו אם ישכח." }, { text: "אהסס ואומר שאני גם בתקציב דחוק.", feedback: "זה בסדר גמור לתעדף את התקציב שלך. כנות היא דבר חשוב בחברות." }, { text: "אשלם, אבל מיד אשלח לו תזכורת עם פרטי הבנק שלי.", feedback: "זה פרקטי, אבל עלול להרגיש קצת רשמי מדי. תזכורת חברית בעל פה מאוחר יותר יכולה לעבוד טוב יותר." }]},
    { id: 2, question: "החברים רוצים ללכת למסעדה יקרה, אבל אתה מנסה לחסוך כסף. מה תעשה?", options: [{ text: "אלך בכל מקרה ואדאג לגבי הכסף אחר כך.", feedback: "זה עלול להוביל ללחץ וחובות. עדיף להיות כנה לגבי המצב שלך." }, { text: "אציע חלופה זולה יותר, כמו פיצה או פיקניק.", feedback: "רעיון מצוין! זה מראה שאתה רוצה לבלות איתם אבל גם מכבד את התקציב שלך." }, { text: "אגיד שאני לא יכול לבוא בלי להסביר למה.", feedback: "זה עלול לגרום לחברים שלך להרגיש דחויים. להסביר שאתה חוסך כסף זה בדרך כלל מובן." }]},
    { id: 3, question: "יצאתם לארוחה. הזמנת סלט ב-30₪ והחבר הזמין סטייק וקינוח ב-100₪. הוא מציע 'בוא נחלק חצי-חצי'.", options: [{ text: "אסכים לחלק כדי למנוע אי נעימות.", feedback: "זה קורה הרבה, אבל זה לא הוגן כלפיך. זה בסדר לדבר על זה." }, { text: "אומר בנימוס, 'בגלל שיש הפרש גדול, אכפת לך שנשלם כל אחד על מה שהזמין?'", feedback: "מושלם! זו דרך הוגנת ומנומסת להתמודד עם המצב." }, { text: "אחשב בקול רם בדיוק כמה כל אחד חייב.", feedback: "זה קצת תוקפני מדי. גישה עדינה יותר בדרך כלל עדיפה." }]},
    { id: 4, question: "חבר נותן לך מתנת יום הולדת יקרה מאוד. אתה יודע שלא תוכל להרשות לעצמך מתנה דומה עבורו.", options: [{ text: "ארגיש לחוץ ואתחיל לחסוך כדי לקנות לו מתנה יקרה באותה מידה.", feedback: "מתנות הן לא תחרות. חברים אמיתיים מעריכים את המחשבה, לא את המחיר." }, { text: "אודה לו מכל הלב ואקנה לו מתנה אישית וצנועה יותר ליום הולדתו.", feedback: "זו הגישה הטובה ביותר. מתנה אישית ומושקעת משמעותית יותר ממתנה יקרה." }, { text: "אתחמק ממנו לקראת יום הולדתו כדי לא לתת מתנה.", feedback: "זה עלול לפגוע ברגשותיו של החבר שלך ולהרוס את החברות." }]},
];

const FinancialSnakeGame: React.FC<{ onGameComplete: () => void }> = ({ onGameComplete }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'paused' | 'gameOver'>('intro');
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const [moneyCollected, setMoneyCollected] = useState(0);
  const [dilemmasAnswered, setDilemmasAnswered] = useState(0);
  const [specialCollectible, setSpecialCollectible] = useState<{ x: number; y: number } | null>(null);

  const [isDilemmaVisible, setIsDilemmaVisible] = useState(false);
  const [currentDilemma, setCurrentDilemma] = useState<Dilemma | null>(null);
  const [dilemmaFeedback, setDilemmaFeedback] = useState<string | null>(null);
  const [usedDilemmaIds, setUsedDilemmaIds] = useState<number[]>([]);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  useEffect(() => {
    if (gameState !== 'playing') return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += directionRef.current.x;
        head.y += directionRef.current.y;
        if (head.x < 0) head.x = BOARD_SIZE - 1; if (head.x >= BOARD_SIZE) head.x = 0;
        if (head.y < 0) head.y = BOARD_SIZE - 1; if (head.y >= BOARD_SIZE) head.y = 0;
        for (let i = 1; i < newSnake.length; i++) { if (head.x === newSnake[i].x && head.y === newSnake[i].y) { setGameState('gameOver'); return prevSnake; }}
        newSnake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10); setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT)); setMoneyCollected(c => c + 1);
          let newFoodPos; do { newFoodPos = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) }; } while (newSnake.some(s => s.x === newFoodPos.x && s.y === newFoodPos.y));
          setFood(newFoodPos);
        } else if (specialCollectible && head.x === specialCollectible.x && head.y === specialCollectible.y) {
          setSpecialCollectible(null); pauseAndShowDilemma();
        } else { newSnake.pop(); }
        return newSnake;
      });
    };
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [gameState, food, speed, specialCollectible]);

  useEffect(() => {
      if (gameState === 'playing' && moneyCollected >= 3 && !specialCollectible && dilemmasAnswered < 4) {
          setMoneyCollected(0);
          let newSpecialPos; do { newSpecialPos = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) }; } while (snake.some(s => s.x === newSpecialPos.x && s.y === newSpecialPos.y) || (food.x === newSpecialPos.x && food.y === newSpecialPos.y));
          setSpecialCollectible(newSpecialPos);
      }
  }, [moneyCollected, gameState, snake, food, specialCollectible, dilemmasAnswered]);

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

  useEffect(() => { if (dilemmasAnswered >= 4) { onGameComplete(); }}, [dilemmasAnswered, onGameComplete]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]); setFood({ x: 15, y: 15 }); setDirection({ x: 0, y: -1 }); setScore(0); setSpeed(INITIAL_SPEED);
    setMoneyCollected(0); setDilemmasAnswered(0); setSpecialCollectible(null); setIsDilemmaVisible(false); setCurrentDilemma(null);
    setDilemmaFeedback(null); setUsedDilemmaIds([]); setGameState('playing');
  };

  const pauseAndShowDilemma = () => {
      setGameState('paused'); const available = dilemmas.filter(d => !usedDilemmaIds.includes(d.id));
      if (available.length > 0) { const next = available[Math.floor(Math.random() * available.length)]; setCurrentDilemma(next); setUsedDilemmaIds(p => [...p, next.id]); setIsDilemmaVisible(true); } else { setGameState('playing'); }
  };
  
  const handleDilemmaAnswer = (feedback: string) => setDilemmaFeedback(feedback);
  const closeDilemmaAndResume = () => { setIsDilemmaVisible(false); setDilemmaFeedback(null); setCurrentDilemma(null); setDilemmasAnswered(p => p + 1); setGameState('playing'); };

  const renderGameBoard = () => (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4 p-3 bg-white/50 rounded-lg">
          <h4 className="font-bold text-3xl text-brand-teal">פרק 2: התמודדות עם דילמות חברתיות</h4>
          <p className="text-brand-dark-blue/90 text-xl">אספו 3 שקי כסף (💰) כדי לחשוף דילמה (❓). ענו על 4 דילמות כדי להשלים.</p>
      </div>
      <div className="flex justify-between w-full max-w-lg mb-4 text-4xl font-bold"><span>ניקוד: {score}</span><span>דילמות: {dilemmasAnswered} / 4</span></div>
      <div className="grid bg-green-100/50 border-4 border-brand-dark-blue rounded-lg relative" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`, width: '500px', height: '500px' }}>
        {isDilemmaVisible && currentDilemma && ( <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-lg"><div className="bg-white p-6 rounded-xl max-w-md w-full text-brand-dark-blue animate-fade-in"><h4 className="font-bold text-2xl mb-4">{currentDilemma.question}</h4>{!dilemmaFeedback ? (<div className="space-y-2">{currentDilemma.options.map(opt => (<button key={opt.text} onClick={() => handleDilemmaAnswer(opt.feedback)} className="w-full p-2 bg-gray-200 hover:bg-gray-300 rounded text-right text-xl">{opt.text}</button>))}</div>) : (<div><p className="p-3 bg-yellow-100/70 rounded-lg text-xl">{dilemmaFeedback}</p><button onClick={closeDilemmaAndResume} className="mt-4 w-full bg-brand-teal text-white font-bold p-2 rounded-lg text-xl">המשך לשחק</button></div>)}</div></div> )}
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
            const x = i % BOARD_SIZE; const y = Math.floor(i / BOARD_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y); const isHead = isSnake && snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y; const isSpecial = specialCollectible && specialCollectible.x === x && specialCollectible.y === y;
            return ( <div key={i} className={`flex items-center justify-center p-0.5`}><div className={`w-full h-full ${isHead ? 'bg-brand-teal rounded-sm' : isSnake ? 'bg-brand-light-blue rounded-sm' : ''}`}>{isFood && <span className="text-xl animate-pulse">💰</span>}{isSpecial && <span className="text-xl animate-pulse">❓</span>}</div></div> );
        })}
      </div>
    </div>
  );

  if (gameState === 'intro') { return <div className="text-center bg-white/40 p-8 rounded-2xl"><h3 className="text-4xl font-bold mb-4 text-brand-teal">משחק הסנייק הפיננסי</h3><p className="text-3xl mb-6">כסף, כמו מערכות יחסים, דורש ניהול זהיר.<br />הובילו את הסנייק, אספו כסף וענו על דילמות מהחיים!</p><button onClick={resetGame} className="mt-8 bg-brand-magenta text-white font-bold py-3 px-8 rounded-lg text-xl">התחל משחק</button></div>; }
  if (gameState === 'gameOver') { return <div className="text-center bg-white/40 p-8 rounded-2xl"><h3 className="text-5xl font-bold text-brand-magenta mb-4">המשחק נגמר!</h3><p className="text-4xl mb-8">הניקוד הסופי שלך: {score}</p><button onClick={resetGame} className="mt-8 bg-brand-teal text-white font-bold py-3 px-8 rounded-lg text-xl">שחק שוב</button></div>; }
  return renderGameBoard();
};

// --- Chapter 3: Communication Practice ---
const CommunicationPractice: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const scenarios = [
        { id: 1, scenario: "חבר עדיין לא החזיר לך 50 ₪ שהלווית לו. איך תזכיר לו?", options: [{ text: "'היי, מה קורה? רק רציתי להזכיר לגבי ה-50 שקל מהסרט כשיהיה לך נוח.'", feedback: "מעולה! גישה חברית, לא מאשימה וברורה.", isGood: true }, { text: "'איפה הכסף שלי?!'", feedback: "זה עלול להישמע תוקפני ולגרום לחבר שלך להתגונן.", isGood: false }, { text: "*לא אומר כלום ומקווה שהוא יזכור לבד*", feedback: "הימנעות עלולה ליצור תסכול ואי נעימות. עדיף לדבר על זה בפתיחות.", isGood: false }]},
        { id: 2, scenario: "החברים רוצים לקנות מתנה משותפת שעולה יותר ממה שתכננת להוציא. איך תגיב?", options: [{ text: "'אין מצב, זה יקר מדי.'", feedback: "זה קצת ישיר מדי. אפשר לנסח את זה בצורה רכה יותר.", isGood: false }, { text: "'רעיון מעולה! התקציב שלי קצת יותר נמוך, אולי נמצא משהו באזור ה-X שקלים?'", feedback: "דרך מצוינת! אתה מביע הסכמה עם הרעיון הכללי אבל מציב את הגבול שלך.", isGood: true }, { text: "'בסדר, אני בפנים' (ואז נכנס ללחץ מההוצאה).", feedback: "זה עלול להוביל אותך ללחץ כלכלי. חשוב לשמור על התקציב שלך.", isGood: false }]},
    ];
    const [current, setCurrent] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: typeof scenarios[0]['options'][0]) => {
        if (selected) return;
        setSelected(option.text);
        setFeedback(option.feedback);
    };

    const handleNext = () => {
        if (current < scenarios.length - 1) {
            setCurrent(c => c + 1);
            setSelected(null);
            setFeedback(null);
        } else {
            onComplete();
        }
    };
    
    const q = scenarios[current];
    return (
        <div className="bg-white/40 p-8 rounded-2xl animate-fade-in">
            <h3 className="text-4xl font-bold text-center mb-4">פרק 3: אומרים את זה נכון 🗣️</h3>
            <div className="bg-white/60 p-6 rounded-xl text-center">
                <p className="text-3xl font-semibold mb-4">{q.scenario}</p>
                <div className="space-y-3">
                    {q.options.map(opt => (
                        <button key={opt.text} onClick={() => handleSelect(opt)} disabled={!!selected}
                            className={`w-full p-3 rounded-lg text-xl text-right transition-colors ${selected ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}>
                            {opt.text}
                        </button>
                    ))}
                </div>
            </div>
            {feedback && (
                <div className="mt-6 p-4 bg-yellow-100/70 rounded-lg animate-fade-in">
                    <p className="font-bold text-xl">משוב:</p>
                    <p className="text-xl">{feedback}</p>
                    <button onClick={handleNext} className="mt-4 w-full bg-brand-teal text-white font-bold p-2 rounded-lg text-xl">
                        {current < scenarios.length - 1 ? "לתרחיש הבא" : "סיימתי"}
                    </button>
                </div>
            )}
        </div>
    )
};


// --- Main Module Component ---
const RelationshipsMoneyModule: React.FC<RelationshipsMoneyModuleProps> = ({ onBack, title, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizResult, setQuizResult] = useState<Superpower | null>(null);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);

  const handleStepCompletion = (stepIndex: number) => {
      setCompletedSteps(prev => {
          const newCompleted = [...prev];
          newCompleted[stepIndex] = true;
          return newCompleted;
      });
  };
  
  useEffect(() => {
      if(completedSteps.every(Boolean)) {
          onComplete();
      }
  }, [completedSteps, onComplete]);

  const renderContent = () => {
      if (currentStep === 0) {
          return quizResult ? <QuizResult result={quizResult} /> : <MoneyPersonalityQuiz onQuizComplete={(result) => { setQuizResult(result); handleStepCompletion(0); }} />;
      }
      if (currentStep === 1) {
          return <FinancialSnakeGame onGameComplete={() => handleStepCompletion(1)} />;
      }
      if (currentStep === 2) {
          return <CommunicationPractice onComplete={() => handleStepCompletion(2)} />;
      }
      return null;
  };

  return (
    <ModuleView title={title} onBack={onBack}>
         <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
                                {completedSteps[index] ? '✔' : index + 1}
                            </div>
                            <p className={`mt-2 text-xs text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
      {renderContent()}
      <div className="flex justify-between mt-8">
            <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 font-bold py-2 px-6 rounded-lg disabled:opacity-50">הקודם</button>
            <button onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === steps.length - 1 || !completedSteps[currentStep]} className="bg-brand-teal text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">
                {completedSteps[currentStep] ? "הבא" : "השלם את הפרק"}
            </button>
        </div>
    </ModuleView>
  );
};

export default RelationshipsMoneyModule;