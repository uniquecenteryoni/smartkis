import React, { useState, useEffect, useRef } from 'react';
import ModuleView from '../ModuleView';

interface ExpensesModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

// New Rich Icons
const RichPiggyBankIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" x1="32" x2="32" y1="18" y2="50" gradientUnits="userSpaceOnUse"><stop stopColor="#fbbf24" offset="0"/><stop stopColor="#f59e0b" offset="1"/></linearGradient></defs><rect width="48" height="32" x="8" y="18" fill="url(#a)" rx="16" ry="16"/><circle cx="48" cy="26" r="5" fill="#fcd34d"/><rect width="4" height="10" x="18" y="46" fill="#d97706" rx="2" ry="2"/><rect width="4" height="10" x="42" y="46" fill="#d97706" rx="2" ry="2"/><path d="M12 28a8 8 0 0 1 8-8" fill="none" stroke="#d97706" strokeWidth="4"/><path fill="#fff" d="M28 22h8v2h-8z"/><path fill="#fff" d="M30 20h4v6h-4z"/></svg>
);
const RichShoppingBagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="b" x1="32" x2="32" y1="16" y2="58" gradientUnits="userSpaceOnUse"><stop stopColor="#67e8f9" offset="0"/><stop stopColor="#01b2cf" offset="1"/></linearGradient></defs><path fill="url(#b)" d="M52 16H12a4 4 0 0 0-4 4v34a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4V20a4 4 0 0 0-4-4z"/><path d="M24 16a8 8 0 0 1 8-8h0a8 8 0 0 1 8 8v8H24z" fill="none" stroke="#0891b2" strokeWidth="6"/><circle cx="20" cy="30" r="5" fill="#f472b6"/><circle cx="32" cy="40" r="7" fill="#a3e635"/><rect width="12" height="12" x="38" y="26" fill="#fbbf24" rx="3" ry="3" transform="rotate(15 44 32)"/></svg>
);
const FoundationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M54 58H10a4 4 0 0 1-4-4V24l24-18 24 18v30a4 4 0 0 1-4 4z" fill="#f472b6"/><path d="M50 54H14a2 2 0 0 1-2-2V26l20-15 20 15v26a2 2 0 0 1-2 2z" fill="#f8fafc"/><path d="M32 23a9 9 0 0 1 9 9c0 4-4 8-9 12-5-4-9-8-9-12a9 9 0 0 1 9-9z" fill="#ef4444"/></svg>
);
const ChecklistIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="52" x="8" y="6" fill="#67e8f9" rx="6"/><rect width="40" height="44" x="12" y="10" fill="#f8fafc" rx="2"/><path d="M22 24h20v4H22zm0 12h20v4H22z" fill="#0e7490"/><path d="M18 22a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-2 5v-2h4v2h-4z" fill="#34d399"/><path d="M18 34a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-2 5v-2h4v2h-4z" fill="#34d399"/></svg>
);
const GiftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="36" x="8" y="22" fill="#34d399" rx="4"/><rect width="12" height="40" x="26" y="18" fill="#a3e635"/><path d="M18 18c0-8 4-8 14-8s14 0 14 8" fill="none" stroke="#a3e635" strokeWidth="8" strokeLinecap="round"/><rect width="52" height="8" x="6" y="28" fill="#a3e635" rx="4"/></svg>
);

// ─── Basketball Arcade Sound Effects ────────────────────────────────────────────────────
function playArcadeSound(type: 'score' | 'miss' | 'start' | 'finish') {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    const gain = ac.createGain();
    gain.connect(ac.destination);
    const osc = ac.createOscillator();
    osc.connect(gain);
    if (type === 'score') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ac.currentTime);
      osc.frequency.setValueAtTime(659, ac.currentTime + 0.08);
      osc.frequency.setValueAtTime(880, ac.currentTime + 0.18);
      gain.gain.setValueAtTime(0.22, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.38);
      osc.start(); osc.stop(ac.currentTime + 0.38);
    } else if (type === 'miss') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.28);
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.32);
      osc.start(); osc.stop(ac.currentTime + 0.32);
    } else if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ac.currentTime);
      osc.frequency.setValueAtTime(660, ac.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.28);
      osc.start(); osc.stop(ac.currentTime + 0.28);
    } else if (type === 'finish') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ac.currentTime);
      osc.frequency.setValueAtTime(784, ac.currentTime + 0.12);
      osc.frequency.setValueAtTime(1047, ac.currentTime + 0.26);
      gain.gain.setValueAtTime(0.22, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5);
      osc.start(); osc.stop(ac.currentTime + 0.5);
    }
    setTimeout(() => { try { ac.close(); } catch {} }, 700);
  } catch {}
}

type Category = 'fixed' | 'variable';
interface ExpenseItem {
  id: number;
  name: string;
  category: Category;
}

interface ArcadeSkipQuestion {
    id: number;
    question: string;
    options: Category[];
    answer: Category;
}

const initialItems: ExpenseItem[] = [
    { id: 1, name: 'מנוי לנטפליקס', category: 'fixed' },
    { id: 2, name: 'יציאה לסרט', category: 'variable' },
    { id: 3, name: 'חשבון סלולר', category: 'fixed' },
    { id: 4, name: 'קניית פיצה', category: 'variable' },
    { id: 5, name: 'שיעור נהיגה', category: 'fixed' },
    { id: 6, name: 'בגדים', category: 'variable' },
    { id: 7, name: 'שכר דירה', category: 'fixed' },
    { id: 8, name: 'מנוי לחדר כושר', category: 'fixed' },
    { id: 9, name: 'מתנות יום הולדת', category: 'variable' },
    { id: 10, name: 'תחבורה ציבורית', category: 'variable' },
    { id: 11, name: 'ארנונה', category: 'fixed' },
    { id: 12, name: 'דלק לרכב', category: 'variable' },
    { id: 13, name: 'ביטוח רכב', category: 'fixed' },
    { id: 14, name: 'קניות בסופר', category: 'variable' },
    { id: 15, name: 'חוג העשרה', category: 'fixed' },
    { id: 16, name: 'תרופות', category: 'variable' },
    { id: 17, name: 'ועד בית', category: 'fixed' },
    { id: 18, name: 'חופשה', category: 'variable' },
    { id: 19, name: 'אינטרנט וטלוויזיה', category: 'fixed' },
    { id: 20, name: 'תיקונים בבית', category: 'variable' },
];

const arcadeSkipQuestions: ArcadeSkipQuestion[] = [
    { id: 1, question: 'שכר דירה הוא בדרך כלל הוצאה…', options: ['fixed', 'variable'], answer: 'fixed' },
    { id: 2, question: 'יציאה לסרט היא בדרך כלל הוצאה…', options: ['fixed', 'variable'], answer: 'variable' },
    { id: 3, question: 'חשבון סלולר חודשי קבוע מסווג בדרך כלל כ…', options: ['fixed', 'variable'], answer: 'fixed' },
    { id: 4, question: 'קניית בגדים היא בדרך כלל הוצאה…', options: ['fixed', 'variable'], answer: 'variable' },
    { id: 5, question: 'ביטוח רכב שנתי/חודשי קבוע מסווג בדרך כלל כ…', options: ['fixed', 'variable'], answer: 'fixed' },
];

type HatzarCategory = 'חייב' | 'צריך' | 'רוצה';
interface HatzarExpenseItem {
  id: number;
  name: string;
  hatzarCategory: HatzarCategory[];
}

const hatzarInitialItems: HatzarExpenseItem[] = [
    { id: 1, name: 'מנוי לנטפליקס', hatzarCategory: ['רוצה'] },
    { id: 2, name: 'יציאה לסרט', hatzarCategory: ['רוצה'] },
    { id: 3, name: 'חשבון סלולר', hatzarCategory: ['חייב'] },
    { id: 4, name: 'קניית פיצה', hatzarCategory: ['רוצה'] },
    { id: 5, name: 'שיעור נהיגה', hatzarCategory: ['צריך'] },
    { id: 6, name: 'בגדים', hatzarCategory: ['חייב', 'צריך', 'רוצה'] },
    { id: 7, name: 'שכר דירה', hatzarCategory: ['חייב'] },
    { id: 8, name: 'מנוי לחדר כושר', hatzarCategory: ['צריך', 'רוצה'] },
    { id: 9, name: 'מתנת יום הולדת', hatzarCategory: ['חייב', 'צריך', 'רוצה'] },
    { id: 10, name: 'תחבורה ציבורית', hatzarCategory: ['חייב', 'צריך'] },
    { id: 11, name: 'ארנונה', hatzarCategory: ['חייב'] },
    { id: 12, name: 'דלק לרכב', hatzarCategory: ['חייב', 'צריך'] },
    { id: 13, name: 'ביטוח רכב', hatzarCategory: ['חייב'] },
    { id: 14, name: 'קניות בסופר', hatzarCategory: ['חייב'] },
    { id: 15, name: 'חוג העשרה', hatzarCategory: ['רוצה'] },
    { id: 16, name: 'תרופות', hatzarCategory: ['חייב'] },
    { id: 17, name: 'ועד בית', hatzarCategory: ['חייב'] },
    { id: 18, name: 'חופשה', hatzarCategory: ['רוצה', 'צריך'] },
    { id: 19, name: 'אינטרנט וטלוויזיה', hatzarCategory: ['חייב', 'צריך'] },
    { id: 20, name: 'תיקונים בבית', hatzarCategory: ['חייב'] },
];

const steps = [
    "סוגי הוצאות",
    "מיון ההוצאות: חלק 1",
  "מודל חצ\"ר",
  "אתגר מיון: חלק 2",
    "אתגר תעדוף והחלטות"
];

interface FinalPracticeQuestion {
    id: number;
    prompt: string;
    options: string[];
    answer: string;
    explanation: string;
}

const finalPracticeQuestions: FinalPracticeQuestion[] = [
    {
        id: 1,
        prompt: 'איזו הוצאה בדרך כלל תסווג כהוצאה קבועה?',
        options: ['מסעדה בסופ\"ש', 'שכר דירה', 'קניית בגדים עונתית', 'בילוי בקולנוע'],
        answer: 'שכר דירה',
        explanation: 'שכר דירה הוא תשלום חוזר וקבוע יחסית בכל חודש.'
    },
    {
        id: 2,
        prompt: 'בתקציב לחוץ, מה סדר התעדוף הנכון לפי מודל חצ\"ר?',
        options: ['רוצה ← צריך ← חייב', 'צריך ← רוצה ← חייב', 'חייב ← צריך ← רוצה', 'אין סדר קבוע'],
        answer: 'חייב ← צריך ← רוצה',
        explanation: 'קודם סוגרים צרכים חיוניים, אחר כך חשובים, ורק לבסוף מותרות.'
    },
    {
        id: 3,
        prompt: 'יש כסף מוגבל: תרופה קבועה או שדרוג טלפון שעובד? מה עדיף קודם?',
        options: ['שדרוג טלפון', 'תרופה קבועה', 'שניהם באותה עדיפות', 'דוחים את שניהם'],
        answer: 'תרופה קבועה',
        explanation: 'תרופה קבועה היא הוצאה מסוג "חייב" ובעלת עדיפות גבוהה.'
    },
    {
        id: 4,
        prompt: 'איזה צעד עוזר ביותר לקבל החלטה תקציבית נכונה לפני קנייה?',
        options: ['לקנות מהר כדי לא לפספס', 'לשאול מה רמת הצורך ומה היכולת לשלם', 'להתייעץ רק עם חברים', 'להסתמך על פרסומת'],
        answer: 'לשאול מה רמת הצורך ומה היכולת לשלם',
        explanation: 'החלטה טובה משלבת גם צורך אמיתי וגם יכולת תקציבית.'
    },
    {
        id: 5,
        prompt: 'חשבון סלולר ללימודים, עבודה ומשפחה יסווג ברוב המקרים כ…',
        options: ['רוצה בלבד', 'חייב', 'רוצה או צריך בלבד', 'לא ניתן לסווג'],
        answer: 'חייב',
        explanation: 'כאשר הסלולר הוא כלי תקשורת בסיסי, זו הוצאה בעלת עדיפות גבוהה.'
    },
    {
        id: 6,
        prompt: 'איזו החלטה מראה תעדוף חכם בתקופה לחוצה?',
        options: ['להמשיך את כל המנויים בלי בדיקה', 'לקצץ קודם בהוצאות "רוצה"', 'לוותר על תרופות כדי לחסוך', 'להתעלם מהתקציב'],
        answer: 'לקצץ קודם בהוצאות "רוצה"',
        explanation: 'כך שומרים על הוצאות חיוניות ומונעים פגיעה בבסיס הכלכלי.'
    },
    {
        id: 7,
        prompt: 'מה נכון לגבי הוצאות משתנות?',
        options: ['הסכום שלהן קבוע תמיד', 'לא ניתן לשלוט בהן', 'הן תלויות בבחירות ולכן אפשר לנהל ולצמצם', 'הן תמיד מסוג "חייב"'],
        answer: 'הן תלויות בבחירות ולכן אפשר לנהל ולצמצם',
        explanation: 'דווקא בהוצאות משתנות אפשר להשפיע משמעותית על החיסכון.'
    },
    {
        id: 8,
        prompt: 'לפני קנייה של מותרות, מה השאלה הכי נכונה?',
        options: ['כמה זה נראה טוב', 'האם נשאר תקציב אחרי חייב וצריך', 'האם כולם קונים את זה', 'האם זה במבצע בלבד'],
        answer: 'האם נשאר תקציב אחרי חייב וצריך',
        explanation: 'מותרות מגיעות אחרי שהצרכים החשובים כבר מכוסים.'
    },
];

const ExpensesModule: React.FC<ExpensesModuleProps> = ({ onBack, title, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // State for game 1 (fixed/variable)
    const [arcadeItems, setArcadeItems] = useState([...initialItems].sort(() => Math.random() - 0.5));
    const [arcadeIndex, setArcadeIndex] = useState(0);
    const [arcadeAnswers, setArcadeAnswers] = useState<{[key: number]: { chosenCategory: Category, isCorrect: boolean }}>({});
    const [shotFeedback, setShotFeedback] = useState<{ isCorrect: boolean; target: Category; madeBasket: boolean } | null>(null);
    const [aimDirection, setAimDirection] = useState<'left' | 'right'>('right');
    const [shotPower, setShotPower] = useState(0);
    const [isCharging, setIsCharging] = useState(false);
    const [isBallFlying, setIsBallFlying] = useState(false);
    const [ballPosition, setBallPosition] = useState<{ x: number; y: number } | null>(null);
    const [arcadeGameStarted, setArcadeGameStarted] = useState(false);
  const [game1Score, setGame1Score] = useState<number | null>(null);
    const [arcadeStartTime, setArcadeStartTime] = useState<number | null>(null);
    const [arcadeElapsedSeconds, setArcadeElapsedSeconds] = useState(0);
    const [arcadeFinalSeconds, setArcadeFinalSeconds] = useState<number | null>(null);
        const [showArcadeSkipQuiz, setShowArcadeSkipQuiz] = useState(false);
        const [arcadeSkipQuizIndex, setArcadeSkipQuizIndex] = useState(0);
        const [arcadeSkipSelected, setArcadeSkipSelected] = useState<Category | null>(null);
        const [arcadeSkipFeedback, setArcadeSkipFeedback] = useState<{ isCorrect: boolean } | null>(null);
        const [arcadeSkipAnswers, setArcadeSkipAnswers] = useState<Record<number, boolean>>({});
        const [arcadeSkipPassed, setArcadeSkipPassed] = useState(false);

    const chargeStartRef = useRef<number | null>(null);
    const chargeRafRef = useRef<number | null>(null);
    const flightRafRef = useRef<number | null>(null);
    const currentPowerRef = useRef(0);
    const aimDirectionRef = useRef<'left' | 'right'>('right');
  
  // State for game 2 (Hatzar)
  const [hatzarItems, setHatzarItems] = useState([...hatzarInitialItems].sort(() => Math.random() - 0.5));
  const [hatzarDroppedItems, setHatzarDroppedItems] = useState<{[key: number]: { category: HatzarCategory, isCorrect: boolean }}>({});
  const [game2Score, setGame2Score] = useState<number | null>(null);

    // State for final chapter (prioritization + decisions + module knowledge)
    const [finalQuizIndex, setFinalQuizIndex] = useState(0);
    const [selectedFinalOption, setSelectedFinalOption] = useState<string | null>(null);
    const [finalAnswerFeedback, setFinalAnswerFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
    const [finalQuizAnswers, setFinalQuizAnswers] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
  
  const game1Completed = game1Score !== null && game1Score >= 16; // 80% of 20
  const game2Completed = game2Score !== null && game2Score >= 16;
    const step1Completed = game1Completed || arcadeSkipPassed;
    const currentArcadeItem = arcadeItems[arcadeIndex];

    const COURT = {
        player: { x: 50, y: 78 },
        leftBasket: { x: 14, y: 34 },
        rightBasket: { x: 86, y: 34 },
    };

    useEffect(() => {
        if (Object.keys(arcadeAnswers).length === initialItems.length) {
                const score = (Object.values(arcadeAnswers) as {isCorrect: boolean}[]).filter(f => f.isCorrect).length;
                setGame1Score(score);
                playArcadeSound('finish');
                if (arcadeStartTime) {
                    const finalSec = Math.max(1, Math.round((Date.now() - arcadeStartTime) / 1000));
                    setArcadeFinalSeconds(finalSec);
                    setArcadeElapsedSeconds(finalSec);
                }
        }
    }, [arcadeAnswers, arcadeStartTime]);

  useEffect(() => {
    if (Object.keys(hatzarDroppedItems).length === hatzarInitialItems.length) {
        const score = (Object.values(hatzarDroppedItems) as {isCorrect: boolean}[]).filter(f => f.isCorrect).length;
        setGame2Score(score);
        if (score >= 16) {
            onComplete();
        }
    }
  }, [hatzarDroppedItems, onComplete]);

    useEffect(() => {
        return () => {
            if (chargeRafRef.current) cancelAnimationFrame(chargeRafRef.current);
            if (flightRafRef.current) cancelAnimationFrame(flightRafRef.current);
        };
    }, []);

    useEffect(() => {
        if (currentStep !== 1 || game1Score !== null || !arcadeGameStarted || arcadeStartTime === null) return;

        const timer = window.setInterval(() => {
            setArcadeElapsedSeconds(Math.max(1, Math.round((Date.now() - arcadeStartTime) / 1000)));
        }, 200);

        return () => window.clearInterval(timer);
    }, [currentStep, game1Score, arcadeStartTime, arcadeGameStarted]);

    useEffect(() => {
        aimDirectionRef.current = aimDirection;
    }, [aimDirection]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ExpenseItem | HatzarExpenseItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

    const startChargingShot = () => {
        if (!arcadeGameStarted || isBallFlying || isCharging || !currentArcadeItem || game1Score !== null) return;
        setIsCharging(true);
        setShotPower(2);
        currentPowerRef.current = 0;
        chargeStartRef.current = performance.now();

        const updatePower = () => {
            if (chargeStartRef.current === null) return;
            const elapsed = performance.now() - chargeStartRef.current;
            const power = Math.min(100, elapsed / 20);
            setShotPower(power);
            currentPowerRef.current = power;
            if (power < 100) {
                chargeRafRef.current = requestAnimationFrame(updatePower);
            }
        };

        chargeRafRef.current = requestAnimationFrame(updatePower);
    };

    const releaseShot = () => {
        if (!isCharging || !currentArcadeItem || isBallFlying) return;

        setIsCharging(false);
        if (chargeRafRef.current) cancelAnimationFrame(chargeRafRef.current);
        chargeStartRef.current = null;

        const throwPower = Math.max(10, currentPowerRef.current);
        setIsBallFlying(true);
        setBallPosition({ ...COURT.player });

        const directionForShot = aimDirectionRef.current;
        const targetBasket = directionForShot === 'left' ? COURT.leftBasket : COURT.rightBasket;
        const aimedCategory: Category = directionForShot === 'left' ? 'variable' : 'fixed';

        const distanceToBasket = Math.hypot(targetBasket.x - COURT.player.x, targetBasket.y - COURT.player.y);
        const idealPower = 62;
        const powerGap = Math.abs(throwPower - idealPower);
        const madeBasket = powerGap <= 24;

        const directionX = (targetBasket.x - COURT.player.x) / distanceToBasket;
        const directionY = (targetBasket.y - COURT.player.y) / distanceToBasket;

        const travelFactor = madeBasket
            ? 1
            : throwPower < idealPower
                ? 0.45 + (throwPower / idealPower) * 0.45
                : 1.12 + ((throwPower - idealPower) / (100 - idealPower)) * 0.4;

        const endX = Math.max(6, Math.min(94, COURT.player.x + directionX * distanceToBasket * travelFactor));
        const endY = Math.max(10, Math.min(88, COURT.player.y + directionY * distanceToBasket * travelFactor));

        const controlPoint = {
            x: (COURT.player.x + endX) / 2,
            y: Math.min(COURT.player.y, endY) - (12 + throwPower * 0.2),
        };

        const duration = 700;
        const startTime = performance.now();

        const animateFlight = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            const x = (1 - t) * (1 - t) * COURT.player.x + 2 * (1 - t) * t * controlPoint.x + t * t * endX;
            const y = (1 - t) * (1 - t) * COURT.player.y + 2 * (1 - t) * t * controlPoint.y + t * t * endY;
            setBallPosition({ x, y });

            if (t < 1) {
                flightRafRef.current = requestAnimationFrame(animateFlight);
                return;
            }

            const chosenCategory = aimedCategory;
            const isCorrect = madeBasket && currentArcadeItem.category === chosenCategory;

            setArcadeAnswers(prev => ({
                ...prev,
                [currentArcadeItem.id]: { chosenCategory, isCorrect }
            }));

            setShotFeedback({ isCorrect, target: chosenCategory, madeBasket });
            if (isCorrect) playArcadeSound('score');
            else playArcadeSound('miss');

            setTimeout(() => {
                setShotFeedback(null);
                setArcadeIndex(prev => prev + 1);
                setIsBallFlying(false);
                setBallPosition(null);
                setShotPower(0);
                currentPowerRef.current = 0;
            }, 700);
        };

        flightRafRef.current = requestAnimationFrame(animateFlight);
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (currentStep !== 1 || game1Score !== null || !currentArcadeItem || !arcadeGameStarted) return;

            if (e.code === 'ArrowLeft') {
                e.preventDefault();
                if (isCharging || isBallFlying) return;
                aimDirectionRef.current = 'right';
                setAimDirection('right');
            }

            if (e.code === 'ArrowRight') {
                e.preventDefault();
                if (isCharging || isBallFlying) return;
                aimDirectionRef.current = 'left';
                setAimDirection('left');
            }

            if (e.code === 'Space') {
                e.preventDefault();
                if (!e.repeat) startChargingShot();
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            if (currentStep !== 1 || game1Score !== null) return;
            if (e.code === 'Space') {
                e.preventDefault();
                releaseShot();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [currentStep, game1Score, currentArcadeItem, isCharging, isBallFlying, arcadeGameStarted]);

    const startArcadeGame = () => {
        if (arcadeGameStarted) return;
        setShowArcadeSkipQuiz(false);
        setArcadeGameStarted(true);
        setArcadeStartTime(Date.now());
        setArcadeElapsedSeconds(0);
        playArcadeSound('start');
    };

    const openArcadeSkipQuiz = () => {
        setShowArcadeSkipQuiz(true);
        setArcadeGameStarted(false);
    };

    const currentArcadeSkipQuestion = arcadeSkipQuestions[arcadeSkipQuizIndex];
    const arcadeSkipQuizFinished = Object.keys(arcadeSkipAnswers).length === arcadeSkipQuestions.length;
    const arcadeSkipScore = Object.values(arcadeSkipAnswers).filter(Boolean).length;

    const handleArcadeSkipOptionSelect = (option: Category) => {
        if (!currentArcadeSkipQuestion || arcadeSkipFeedback) return;
        setArcadeSkipSelected(option);
        const isCorrect = option === currentArcadeSkipQuestion.answer;
        setArcadeSkipAnswers(prev => ({ ...prev, [currentArcadeSkipQuestion.id]: isCorrect }));
        setArcadeSkipFeedback({ isCorrect });
    };

    const nextArcadeSkipQuestion = () => {
        if (arcadeSkipQuizIndex < arcadeSkipQuestions.length - 1) {
            setArcadeSkipQuizIndex(prev => prev + 1);
            setArcadeSkipSelected(null);
            setArcadeSkipFeedback(null);
            return;
        }

        if (arcadeSkipScore === arcadeSkipQuestions.length) {
            setArcadeSkipPassed(true);
        }
    };

    const retryArcadeSkipQuiz = () => {
        setArcadeSkipQuizIndex(0);
        setArcadeSkipSelected(null);
        setArcadeSkipFeedback(null);
        setArcadeSkipAnswers({});
        setArcadeSkipPassed(false);
    };
  
    const handleHatzarDrop = (e: React.DragEvent<HTMLDivElement>, targetCategory: HatzarCategory) => {
    e.preventDefault();
    const item: HatzarExpenseItem = JSON.parse(e.dataTransfer.getData('application/json'));
    if (hatzarDroppedItems[item.id]) return;

        const isCellularBillInMust = item.id === 3 && targetCategory === 'חייב';
        const isCorrect = item.hatzarCategory.includes(targetCategory) || isCellularBillInMust;
    setHatzarDroppedItems(prev => ({...prev, [item.id]: { category: targetCategory, isCorrect }}));
  };
  
  const undropHatzarItem = (itemId: number) => {
    const itemToUnsort = hatzarInitialItems.find(i => i.id === itemId);
    if (!itemToUnsort || hatzarItems.some(i => i.id === itemId)) return;

    setHatzarItems(prev => [...prev, itemToUnsort].sort(() => Math.random() - 0.5));
    setHatzarDroppedItems(prev => {
        const newDropped = { ...prev };
        delete newDropped[itemId];
        return newDropped;
    });
    setGame2Score(null);
  };

    const currentFinalQuestion = finalPracticeQuestions[finalQuizIndex];

    const submitFinalQuestion = () => {
        if (!currentFinalQuestion || !selectedFinalOption || finalAnswerFeedback) return;
        const isCorrect = selectedFinalOption === currentFinalQuestion.answer;
        setFinalQuizAnswers(prev => ({
            ...prev,
            [currentFinalQuestion.id]: { selected: selectedFinalOption, isCorrect }
        }));
        setFinalAnswerFeedback({ isCorrect, explanation: currentFinalQuestion.explanation });
    };

    const handleNextFinalQuestion = () => {
        if (finalQuizIndex < finalPracticeQuestions.length - 1) {
            setFinalQuizIndex(prev => prev + 1);
            setSelectedFinalOption(null);
            setFinalAnswerFeedback(null);
        }
    };

    const finalQuizFinished = Object.keys(finalQuizAnswers).length === finalPracticeQuestions.length;
    const finalQuizScore = Object.values(finalQuizAnswers).filter(answer => answer.isCorrect).length;
    const finalQuizPassed = finalQuizScore >= Math.ceil(finalPracticeQuestions.length * 0.75);
  
  const resetGames = () => {
      setArcadeItems([...initialItems].sort(() => Math.random() - 0.5));
      setArcadeIndex(0);
      setArcadeAnswers({});
      setShotFeedback(null);
    setAimDirection('right');
      aimDirectionRef.current = 'right';
      setShotPower(0);
      setIsCharging(false);
      setIsBallFlying(false);
      setBallPosition(null);
    setArcadeGameStarted(false);
      setGame1Score(null);
            setArcadeStartTime(null);
            setArcadeElapsedSeconds(0);
            setArcadeFinalSeconds(null);
    setShowArcadeSkipQuiz(false);
    setArcadeSkipQuizIndex(0);
    setArcadeSkipSelected(null);
    setArcadeSkipFeedback(null);
    setArcadeSkipAnswers({});
    setArcadeSkipPassed(false);
      setHatzarItems([...hatzarInitialItems].sort(() => Math.random() - 0.5));
      setHatzarDroppedItems({});
      setGame2Score(null);
        setFinalQuizIndex(0);
        setSelectedFinalOption(null);
        setFinalAnswerFeedback(null);
        setFinalQuizAnswers({});
  }
  
  const remainingArcadeItems = Math.max(initialItems.length - Object.keys(arcadeAnswers).length, 0);
  const hatzarItemsToSort = hatzarItems.filter(i => !hatzarDroppedItems[i.id]);
    const cellphoneDrop = (Object.entries(hatzarDroppedItems) as [string, { category: HatzarCategory; isCorrect: boolean }][]).find(([id]) => Number(id) === 3);
  
  const renderStepContent = () => {
    switch(currentStep) {
        case 0: return (
            <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
                <h3 className="text-5xl font-bold text-brand-teal mb-4 text-center">סוגי הוצאות</h3>
                <p className="text-center text-3xl mb-8 text-brand-dark-blue/90 max-w-3xl mx-auto">כדי לנהל את ההוצאות שלנו בצורה חכמה, הצעד הראשון הוא להבין לאן הכסף הולך. דרך מצוינת לעשות זאת היא לחלק את ההוצאות לקטגוריות. שתי הקטגוריות העיקריות והחשובות ביותר הן:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/60 p-6 rounded-xl border-2 border-brand-light-blue text-center">
                        <RichPiggyBankIcon className="w-24 h-24 mx-auto text-brand-light-blue" />
                        <h4 className="text-4xl font-bold text-brand-light-blue mt-3 mb-2">הוצאות קבועות</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">אלו הוצאות שאתם משלמים באופן קבוע (לרוב כל חודש), והסכום שלהן נשאר זהה או כמעט זהה. למשל: שכר דירה, חשבון סלולר, מנוי לנטפליקס.</p>
                    </div>
                    <div className="bg-white/60 p-6 rounded-xl border-2 border-brand-magenta text-center">
                        <RichShoppingBagIcon className="w-24 h-24 mx-auto text-brand-magenta" />
                        <h4 className="text-4xl font-bold text-brand-magenta mt-3 mb-2">הוצאות משתנות</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">אלו הוצאות שהסכום שלהן משתנה, והן תלויות בבחירות שלכם. למשל: בילויים, מסעדות, בגדים, קניות בסופר. כאן נמצא המפתח לחיסכון!</p>
                    </div>
                </div>
            </div>
        );
        case 1: return (
            <div>
                <h3 className="text-5xl font-bold mb-2 text-center text-brand-dark-blue">מיון ההוצאות: חלק 1</h3>
                <p className="text-center text-3xl mb-4 text-brand-dark-blue/80">משחק ארקייד: קלעו את הכדור עם ההוצאה לסל הנכון.</p>
                 <div className="mt-4 mb-4 p-3 bg-yellow-100/60 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg text-2xl">
                    <p className="font-bold">💡 שימו לב:</p>
                    <p>על הדמות לבחור לאיזה סל לקלוע: משמאל הוצאות משתנות, ומימין הוצאות קבועות.</p>
                </div>
                {showArcadeSkipQuiz ? (
                    <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30 max-w-4xl mx-auto">
                        {!arcadeSkipQuizFinished && currentArcadeSkipQuestion && (
                            <>
                                <div className="mb-4 text-center text-2xl font-bold text-brand-dark-blue/80">בוחן דילוג: 5/5 נכונות כדי לעבור לפרק הבא</div>
                                <div className="mb-4 text-center text-xl text-brand-dark-blue/70">שאלה {arcadeSkipQuizIndex + 1} מתוך {arcadeSkipQuestions.length}</div>
                                <div className="bg-white/80 p-5 rounded-2xl border border-white/60 mb-4">
                                    <p className="text-3xl font-bold text-center text-brand-dark-blue">{currentArcadeSkipQuestion.question}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                    {currentArcadeSkipQuestion.options.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => handleArcadeSkipOptionSelect(option)}
                                            disabled={!!arcadeSkipFeedback}
                                            className={`p-3 rounded-xl border-2 font-bold text-2xl ${arcadeSkipSelected === option ? 'bg-brand-light-blue text-white border-brand-light-blue' : 'bg-white hover:bg-gray-50 border-gray-300'} disabled:opacity-75`}
                                        >
                                            {option === 'fixed' ? 'קבועה' : 'משתנה'}
                                        </button>
                                    ))}
                                </div>
                                {arcadeSkipFeedback && (
                                    <div className="mt-4 text-center">
                                        <p className={`text-2xl font-bold ${arcadeSkipFeedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            {arcadeSkipFeedback.isCorrect ? 'נכון! ✅' : 'לא נכון ❌'}
                                        </p>
                                        <button onClick={nextArcadeSkipQuestion} className="mt-3 bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg text-xl">
                                            {arcadeSkipQuizIndex < arcadeSkipQuestions.length - 1 ? 'לשאלה הבאה' : 'סיום הבוחן'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {arcadeSkipQuizFinished && (
                            <div className="text-center">
                                <p className="text-4xl font-bold text-brand-dark-blue mb-3">סיימתם את בוחן הדילוג</p>
                                <p className="text-2xl mb-4">ציון: {arcadeSkipScore} מתוך {arcadeSkipQuestions.length}</p>
                                {arcadeSkipScore === arcadeSkipQuestions.length ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="text-2xl font-bold text-green-700">כל הכבוד! אפשר לעבור לפרק הבא ✅</p>
                                        <button onClick={() => { setShowArcadeSkipQuiz(false); setCurrentStep(2); }} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg text-xl">עבור לפרק הבא</button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold text-red-700 mb-3">כדי לדלג צריך 5 מתוך 5. נסו שוב.</p>
                                        <div className="flex justify-center gap-3">
                                            <button onClick={retryArcadeSkipQuiz} className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg text-xl">נסה שוב</button>
                                            <button onClick={() => setShowArcadeSkipQuiz(false)} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-2 px-6 rounded-lg text-xl">חזרה למשחק</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30">
                    <div className="mb-4 text-center text-2xl font-bold text-brand-dark-blue/80">
                        נותרו למיון: {remainingArcadeItems} | תשובות נכונות: {(Object.values(arcadeAnswers) as {isCorrect: boolean}[]).filter(a => a.isCorrect).length}
                    </div>
                    <div className="mb-4 text-center text-2xl font-bold text-brand-teal">⏱ זמן משחק: {arcadeElapsedSeconds} שניות</div>
                    <div className="relative min-h-[700px] bg-gradient-to-b from-amber-50 to-orange-100 rounded-2xl border-2 border-amber-300 shadow-inner p-4 overflow-hidden">
                        <div className="absolute left-0 right-0 top-[45%] h-[2px] bg-white/90"></div>
                        <div className="absolute left-0 right-0 bottom-20 h-[3px] bg-amber-600/70"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-[29%] w-56 h-56 border-[3px] border-white/80 rounded-full"></div>

                        <div className="absolute left-3 top-[8%] text-center">
                            <div className="w-52 h-4 bg-white/80 border-2 border-gray-300 rounded-sm mx-auto"></div>
                            <div className={`w-52 h-32 rounded-t-3xl border-4 ${shotFeedback?.target === 'variable' && shotFeedback.madeBasket ? 'border-green-500 bg-green-300/70 shadow-[0_0_20px_rgba(34,197,94,0.6)]' : 'border-brand-magenta bg-brand-magenta/20'}`}></div>
                            <div className="text-xl font-bold mt-2 text-brand-magenta drop-shadow">הוצאות משתנות</div>
                            <div className="text-4xl">💸</div>
                        </div>

                        <div className="absolute right-3 top-[8%] text-center">
                            <div className="w-52 h-4 bg-white/80 border-2 border-gray-300 rounded-sm mx-auto"></div>
                            <div className={`w-52 h-32 rounded-t-3xl border-4 ${shotFeedback?.target === 'fixed' && shotFeedback.madeBasket ? 'border-green-500 bg-green-300/70 shadow-[0_0_20px_rgba(34,197,94,0.6)]' : 'border-brand-light-blue bg-brand-light-blue/20'}`}></div>
                            <div className="text-xl font-bold mt-2 text-brand-light-blue drop-shadow">הוצאות קבועות</div>
                            <div className="text-4xl">🏦</div>
                        </div>

                        <div className="flex flex-col items-center justify-end min-h-[600px] pb-10">
                            <div className="mb-2 w-72 h-7 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300 shadow-inner">
                                <div className={`h-full ${shotPower < 35 ? 'bg-gradient-to-r from-green-400 to-green-500' : shotPower < 70 ? 'bg-gradient-to-r from-yellow-400 to-amber-400' : 'bg-gradient-to-r from-red-500 to-rose-500'} ${isCharging ? 'animate-pulse' : ''}`} style={{ width: `${isCharging ? Math.max(shotPower, 2) : shotPower}%`, transition: isCharging ? 'width 80ms linear' : 'width 220ms ease-out' }}></div>
                            </div>
                            <p className="text-lg font-bold text-brand-dark-blue/80 mb-3">עוצמה: {Math.round(shotPower)}%</p>

                            <div className="text-9xl transition-transform duration-100" style={{ transform: aimDirection === 'left' ? 'scaleX(1)' : 'scaleX(-1)' }}>⛹️</div>
                            <p className="text-2xl font-bold mb-2">{aimDirection === 'left' ? '⬅️ משתנות' : '➡️ קבועות'}</p>

                            {currentArcadeItem ? (
                                <>
                                    {!isBallFlying && (
                                        <div className="bg-gradient-to-br from-orange-200 to-orange-300 border-4 border-orange-500 rounded-full w-52 h-52 flex items-center justify-center text-center p-4 shadow-xl -mt-2">
                                            <div className="text-2xl font-bold text-orange-900">🏀<br />{currentArcadeItem.name}</div>
                                        </div>
                                    )}
                                    {isBallFlying && ballPosition && (
                                        <div
                                            className="absolute w-24 h-24 rounded-full border-4 border-orange-500 bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-3xl font-bold text-orange-900 shadow-xl"
                                            style={{ left: `${ballPosition.x}%`, top: `${ballPosition.y}%`, transform: 'translate(-50%, -50%)' }}
                                        >
                                            🏀
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-green-100 border-2 border-green-400 rounded-2xl px-8 py-6 text-center">
                                    <p className="text-4xl font-bold text-green-700">סיימתם את המשחק!</p>
                                </div>
                            )}
                            <p className="mt-4 text-xl text-brand-dark-blue/80 bg-white/60 rounded-xl px-4 py-2 text-center">⬅️➡️ מחליפים צד קליעה | לחיצה ארוכה על רווח טוענת עוצמה | שחרור רווח זורק</p>
                            {shotFeedback && (
                                <p className={`mt-3 text-4xl font-bold drop-shadow-lg ${shotFeedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {shotFeedback.isCorrect ? 'סל! קליעה מדויקת 🎯🏆' : (shotFeedback.madeBasket ? 'הסל לא תאם לסוג ההוצאה ❌' : 'הכדור לא נכנס לסל 🏀')}
                                </p>
                            )}
                        </div>

                        {!arcadeGameStarted && game1Score === null && (
                            <div className="absolute inset-0 z-20 bg-black/45 backdrop-blur-[1px] flex items-center justify-center">
                                <div className="bg-white/90 border border-white rounded-2xl px-8 py-6 text-center max-w-xl mx-4 shadow-xl">
                                    <button
                                        onClick={startArcadeGame}
                                        className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-8 rounded-lg text-2xl"
                                    >
                                        התחל
                                    </button>
                                    <p className="text-xl mt-3 text-brand-dark-blue/80">לחצו על "התחל" כדי להתחיל את המשחק והטיימר.</p>
                                    {!arcadeSkipPassed && (
                                        <button
                                            onClick={openArcadeSkipQuiz}
                                            className="mt-3 bg-white hover:bg-gray-100 text-brand-dark-blue border border-brand-dark-blue/30 font-bold py-1.5 px-4 rounded-lg text-base"
                                        >
                                            דלג לפרק הבא
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {game1Score !== null && 
                        <div className="text-center mt-6">
                            <p className={`text-3xl font-bold ${game1Completed ? 'text-green-600' : 'text-red-600'}`}>
                                {game1Completed ? `כל הכבוד! סיימתם עם ${game1Score} תשובות נכונות. אפשר להמשיך!` : `סיימתם למיין עם ${game1Score} תשובות נכונות. נסו שוב כדי להגיע ל-80% דיוק.`}
                            </p>
                            <p className="text-2xl mt-2 text-brand-dark-blue/90">⏱ זמן סיום: {arcadeFinalSeconds ?? arcadeElapsedSeconds} שניות</p>
                            {!game1Completed && <button onClick={resetGames} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-2xl">שחק שוב</button>}
                        </div>
                    }
               </div>
                )}
            </div>
        );
        case 2: return (
             <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-2xl animate-fade-in">
                <h3 className="text-5xl font-bold text-brand-teal mb-6 text-center">מודל חצ"ר: חייב, צריך, רוצה</h3>
                 <p className="text-center text-2xl mb-8 text-brand-dark-blue/90">זוהי דרך פשוטה לתעדף את ההוצאות שלכם ולהבין איפה אפשר לחסוך.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-pink-50 to-white/60 p-6 rounded-xl border-2 border-brand-magenta text-center shadow-xl transform hover:-translate-y-1.5 transition-transform duration-300">
                        <FoundationIcon className="w-20 h-20 mx-auto" />
                        <h4 className="text-4xl font-bold text-brand-magenta mt-3 mb-2">חייב</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">הוצאות שלא ניתן לוותר עליהן בשום מצב. למשל: שכר דירה, חשבונות בסיסיים, אוכל, תרופות.</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-white/60 p-6 rounded-xl border-2 border-brand-light-blue text-center shadow-xl transform hover:-translate-y-1.5 transition-transform duration-300">
                        <ChecklistIcon className="w-20 h-20 mx-auto" />
                        <h4 className="text-4xl font-bold text-brand-light-blue mt-3 mb-2">צריך</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">הוצאות חשובות שמשפרות את איכות החיים, אבל אפשר להתגמש איתן. למשל: אינטרנט, תחבורה, בגדים.</p>
                    </div>
                     <div className="bg-gradient-to-br from-teal-50 to-white/60 p-6 rounded-xl border-2 border-brand-teal text-center shadow-xl transform hover:-translate-y-1.5 transition-transform duration-300">
                        <GiftIcon className="w-20 h-20 mx-auto" />
                        <h4 className="text-4xl font-bold text-brand-teal mt-3 mb-2">רוצה</h4>
                        <p className="text-brand-dark-blue/90 text-2xl">הוצאות שהן מותרות וכיף, אבל הן לא חיוניות. למשל: בילויים, חופשות, מסעדות. כאן הכי קל לקצץ ולחסוך!</p>
                    </div>
                </div>
            </div>
        );
        case 3: return (
            <div>
                 <h3 className="text-5xl font-bold mb-2 text-center text-brand-dark-blue">אתגר מיון: חלק 2</h3>
                 <p className="text-center text-3xl mb-4 text-brand-dark-blue/80">עכשיו, בואו נמיין את ההוצאות לפי מודל חצ"ר.</p>
                 <div className="mt-4 mb-4 p-3 bg-yellow-100/60 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg text-2xl">
                    <p className="font-bold">💡 חשוב לזכור:</p>
                    <p>המיון כאן הוא המלצה בלבד. מה שנחשב 'צריך' עבור אדם אחד, יכול להיות 'חייב' או 'רוצה' עבור אדם אחר. הכל תלוי בסדר העדיפויות האישי שלכם!</p>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30">
                    <div className="min-h-[100px] bg-white/30 p-4 rounded-2xl mb-6">
                        <h4 className="text-center font-bold text-2xl mb-4">כרטיסיות למיון ({hatzarItemsToSort.length})</h4>
                        <div className="flex flex-wrap justify-center gap-4">
                            {hatzarItemsToSort.map(item => (
                                <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} className="bg-cyan-100/70 shadow-md p-3 rounded-xl cursor-grab hover:bg-cyan-200 transition-colors transform hover:-translate-y-1 text-2xl">
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                         <div onDrop={(e) => handleHatzarDrop(e, 'חייב')} onDragOver={handleDragOver} className="min-h-[200px] p-4 bg-brand-magenta/10 rounded-2xl border-2 border-dashed border-brand-magenta">
                            <div className="flex items-center justify-center gap-2 mb-4">
                               <FoundationIcon className="w-16 h-16" />
                               <h4 className="font-bold text-4xl text-brand-magenta">חייב</h4>
                            </div>
                            <div className="space-y-2 text-2xl">
                              {(Object.entries(hatzarDroppedItems) as [string, { category: HatzarCategory; isCorrect: boolean }][]).filter(([, val]) => val.category === 'חייב').map(([id, val]) => {
                                const item = hatzarInitialItems.find(i => i.id === Number(id));
                                return <div key={id} onClick={() => undropHatzarItem(Number(id))} className={`flex items-center justify-between p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-fade-in cursor-pointer`}><span>{item?.name}</span><span>{val.isCorrect ? '✔️' : '❌'}</span></div>
                              })}
                            </div>
                         </div>
                         <div onDrop={(e) => handleHatzarDrop(e, 'צריך')} onDragOver={handleDragOver} className="min-h-[200px] p-4 bg-brand-light-blue/10 rounded-2xl border-2 border-dashed border-brand-light-blue">
                            <div className="flex items-center justify-center gap-2 mb-4">
                               <ChecklistIcon className="w-16 h-16" />
                               <h4 className="font-bold text-4xl text-brand-light-blue">צריך</h4>
                            </div>
                            <div className="space-y-2 text-2xl">
                              {(Object.entries(hatzarDroppedItems) as [string, { category: HatzarCategory; isCorrect: boolean }][]).filter(([, val]) => val.category === 'צריך').map(([id, val]) => {
                                const item = hatzarInitialItems.find(i => i.id === Number(id));
                                return <div key={id} onClick={() => undropHatzarItem(Number(id))} className={`flex items-center justify-between p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-fade-in cursor-pointer`}><span>{item?.name}</span><span>{val.isCorrect ? '✔️' : '❌'}</span></div>
                              })}
                            </div>
                         </div>
                         <div onDrop={(e) => handleHatzarDrop(e, 'רוצה')} onDragOver={handleDragOver} className="min-h-[200px] p-4 bg-brand-teal/10 rounded-2xl border-2 border-dashed border-brand-teal">
                            <div className="flex items-center justify-center gap-2 mb-4">
                               <GiftIcon className="w-16 h-16" />
                               <h4 className="font-bold text-4xl text-brand-teal">רוצה</h4>
                            </div>
                            <div className="space-y-2 text-2xl">
                              {(Object.entries(hatzarDroppedItems) as [string, { category: HatzarCategory; isCorrect: boolean }][]).filter(([, val]) => val.category === 'רוצה').map(([id, val]) => {
                                const item = hatzarInitialItems.find(i => i.id === Number(id));
                                return <div key={id} onClick={() => undropHatzarItem(Number(id))} className={`flex items-center justify-between p-2 rounded-lg text-white ${val.isCorrect ? 'bg-green-500' : 'bg-red-500'} animate-fade-in cursor-pointer`}><span>{item?.name}</span><span>{val.isCorrect ? '✔️' : '❌'}</span></div>
                              })}
                            </div>
                         </div>
                    </div>
                    {game2Score !== null && 
                        <div className="text-center mt-6">
                            <p className={`text-3xl font-bold ${game2Completed ? 'text-green-600' : 'text-red-600'}`}>
                                {game2Completed ? `כל הכבוד! סיימתם עם ${game2Score} תשובות נכונות והשלמתם את המודול!` : `סיימתם למיין עם ${game2Score} תשובות נכונות. נסו שוב כדי להגיע ל-80% דיוק.`}
                            </p>
                            {cellphoneDrop && (
                                <p className={`text-2xl mt-2 font-bold ${cellphoneDrop[1].category === 'חייב' ? 'text-green-700' : 'text-red-700'}`}>
                                    {cellphoneDrop[1].category === 'חייב' ? 'מעולה! מיינתם את חשבון הסלולר כ"חייב" ✅' : 'שימו לב: במודל הזה חשבון סלולר מסווג כ"חייב".'}
                                </p>
                            )}
                            {!game2Completed && <button onClick={resetGames} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-2xl">שחק שוב</button>}
                        </div>
                    }
                </div>
            </div>
        );
        case 4: return (
             <div>
                <h3 className="text-5xl font-bold mb-4 text-center text-brand-dark-blue">אתגר תעדוף והחלטות</h3>
                <p className="text-center text-3xl mb-4 text-brand-dark-blue/80">פרק מסכם שמתרגל תעדוף הוצאות, קבלת החלטות ובוחן ידע מכל המודול.</p>

                <div className="bg-white/40 backdrop-blur-md border border-white/30 p-8 rounded-3xl max-w-4xl mx-auto">
                    {!finalQuizFinished && currentFinalQuestion && (
                        <>
                            <div className="mb-6">
                                <div className="bg-gray-300 rounded-full h-3 overflow-hidden">
                                    <div className="bg-brand-teal h-3 rounded-full transition-all" style={{ width: `${((finalQuizIndex + 1) / finalPracticeQuestions.length) * 100}%` }}></div>
                                </div>
                                <p className="text-center text-xl mt-2">שאלה {finalQuizIndex + 1} מתוך {finalPracticeQuestions.length}</p>
                            </div>

                            <div className="bg-white/80 p-6 rounded-2xl border border-white/60 text-center mb-6">
                                <p className="text-3xl font-bold text-brand-dark-blue">{currentFinalQuestion.prompt}</p>
                            </div>

                            <div className="bg-white/70 rounded-2xl p-5 border border-white/60 mb-4">
                                <p className="text-2xl font-bold mb-3 text-center">בחרו את התשובה הנכונה:</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {currentFinalQuestion.options.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setSelectedFinalOption(option)}
                                            disabled={!!finalAnswerFeedback}
                                            className={`p-4 rounded-xl border-2 font-bold text-2xl text-right ${selectedFinalOption === option ? 'bg-brand-light-blue text-white border-brand-light-blue' : 'bg-white hover:bg-gray-50 border-gray-300'} disabled:opacity-75`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <button onClick={submitFinalQuestion} disabled={!selectedFinalOption || !!finalAnswerFeedback} className="bg-brand-magenta hover:bg-pink-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg text-2xl">
                                    בדיקת תשובה
                                </button>
                            </div>

                            {finalAnswerFeedback && (
                                <div className="mt-6 bg-brand-light-blue/10 border border-brand-light-blue/30 p-5 rounded-2xl text-center">
                                    <p className={`text-3xl font-bold mb-2 ${finalAnswerFeedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                        {finalAnswerFeedback.isCorrect ? 'נכון מאוד! ✅' : 'כמעט — נסו ללמוד מההסבר 👇'}
                                    </p>
                                    <p className="text-2xl text-brand-dark-blue/90">{finalAnswerFeedback.explanation}</p>
                                    {finalQuizIndex < finalPracticeQuestions.length - 1 && (
                                        <button onClick={handleNextFinalQuestion} className="mt-4 bg-brand-teal hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg text-2xl">לשאלה הבאה</button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {finalQuizFinished && (
                        <div className="text-center">
                            <p className="text-4xl font-bold text-brand-teal mb-3">סיימתם את האתגר המסכם!</p>
                            <div className="bg-white/70 rounded-2xl p-5 border border-white/60 text-right text-2xl space-y-2">
                                <p>ציון סופי: <strong>{finalQuizScore}</strong> מתוך <strong>{finalPracticeQuestions.length}</strong> ({Math.round((finalQuizScore / finalPracticeQuestions.length) * 100)}%).</p>
                                <p><strong>סטטוס:</strong> {finalQuizPassed ? 'מעולה! הפגנתם שליטה טובה בתעדוף וקבלת החלטות.' : 'כדאי לתרגל שוב כדי לחזק את השליטה בקבלת החלטות תקציביות.'}</p>
                                <p><strong>איך מתעדפים נכון?</strong> קודם סוגרים הוצאות חייב, אחר כך צריך, ולבסוף רוצים לפי מה שנשאר בתקציב.</p>
                                <p><strong>כלל אצבע:</strong> כשנכנסים ללחץ תקציבי — מקצצים קודם ב"רוצה", מתייעלים ב"צריך", ונמנעים מפגיעה ב"חייב".</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
        default: return null;
    }
  }

  return (
    <ModuleView title={title} onBack={onBack}>
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-2xl ${currentStep >= index ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white/50 border-gray-300'}`}>
                                {index + 1}
                            </div>
                            <p className={`mt-2 text-lg text-center font-bold ${currentStep >= index ? 'text-brand-teal' : 'text-gray-500'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > index ? 'bg-brand-teal' : 'bg-gray-300'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>

        {renderStepContent()}

        <div className="flex justify-between mt-8 text-2xl">
            <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="bg-gray-300 hover:bg-gray-400 text-brand-dark-blue font-bold py-3 px-8 rounded-lg disabled:opacity-50">הקודם</button>
            <button 
                onClick={() => setCurrentStep(s => s + 1)} 
                     disabled={currentStep === steps.length - 1 || (currentStep === 1 && !step1Completed) || (currentStep === 3 && !game2Completed)}
                className="bg-brand-teal hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {
                         (currentStep === 1 && !step1Completed) ? "השלימו את המשימה" : 
                   (currentStep === 3 && !game2Completed) ? "השלימו את המשימה" : "הבא"
                }
            </button>
        </div>
    </ModuleView>
  );
};

export default ExpensesModule;
