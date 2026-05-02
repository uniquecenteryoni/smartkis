import React, { useEffect, useMemo, useState } from 'react';

interface WhoWantsToBeSmartInThePocketGameProps {
  onBack: () => void;
}

type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  topic: string;
};

const QUESTIONS: QuizQuestion[] = [
  {
    question: 'מהו שימוש נכון בתקציב חודשי?',
    options: ['לעדכן אותו רק כשנגמר כסף', 'לתכנן מראש ולעקוב מול ביצוע בפועל', 'להשתמש בו רק להוצאות קבועות', 'לוותר עליו אם יש הכנסה קבועה'],
    answerIndex: 1,
    topic: 'תקציב',
  },
  {
    question: 'מהו סימן אזהרה לכך שההתנהלות החודשית לא מאוזנת?',
    options: ['נותר עודף קטן בסוף החודש', 'הוצאות משתנות מכסות את רוב התקציב', 'שימוש קבוע במסגרת מינוס לכיסוי הוצאות שוטפות', 'יש מעקב באפליקציה'],
    answerIndex: 2,
    topic: 'כסף וניהול אישי',
  },
  {
    question: 'איזו מטרה הכי מתאימה לקרן חירום?',
    options: ['חופשה שנתית', 'קנייה אימפולסיבית', 'הוצאה לא צפויה כמו תיקון דחוף', 'מתנה לחבר'],
    answerIndex: 2,
    topic: 'חיסכון',
  },
  {
    question: 'אם המחירים עולים וההכנסה נשארת זהה, מה קורה לכוח הקנייה?',
    options: ['עולה', 'לא משתנה', 'יורד', 'מוכפל'],
    answerIndex: 2,
    topic: 'כלכלה',
  },
  {
    question: 'בקנייה גדולה, איזה צעד מצמצם סיכון להוצאה מיותרת?',
    options: ['לקנות מיד כי יש מבצע', 'להתייעץ רק עם חבר', 'להשוות עלות כוללת כולל אחריות ומשלוח', 'לבחור רק לפי מותג'],
    answerIndex: 2,
    topic: 'צרכנות נבונה',
  },
  {
    question: 'מה נכון לגבי מונופול לאורך זמן?',
    options: ['תמיד משפר מחירים לצרכן', 'עלול לצמצם תחרות ולהשפיע על מחירים', 'מחייב איכות גבוהה בחוק', 'לא משפיע על השוק'],
    answerIndex: 1,
    topic: 'מונופולים',
  },
  {
    question: 'במצב של ביקוש גבוה והיצע מוגבל, מה בדרך כלל יקרה למחיר?',
    options: ['ירד', 'יישאר תמיד קבוע', 'יעלה', 'יהפוך לאפס'],
    answerIndex: 2,
    topic: 'היצע וביקוש',
  },
  {
    question: 'מהי ריבית דריבית בחיסכון?',
    options: ['ריבית רק על הקרן הראשונית', 'ריבית על הקרן ועל ריבית שנצברה', 'עמלה חד-פעמית', 'מס על משיכה'],
    answerIndex: 1,
    topic: 'ריבית וחיסכון',
  },
  {
    question: 'איזו פעולה מחזקת תכנון תזרים חודשי?',
    options: ['להתעלם מהוצאות קטנות', 'להוסיף הוצאות רק בסוף חודש', 'לרשום תאריך חיוב לכל הוצאה קבועה', 'לבדוק מצב פעם בחצי שנה'],
    answerIndex: 2,
    topic: 'תקציב',
  },
  {
    question: 'מהו מחיר עלות?',
    options: ['מחיר המכירה לצרכן', 'עלות הייצור לפני רווח', 'מחיר אחרי הנחה', 'המחיר הגבוה בשוק'],
    answerIndex: 1,
    topic: 'עסקים',
  },
  {
    question: 'אם עסק מוכר ב-120 ש"ח ומחיר העלות הוא 90 ש"ח, מה הרווח הגולמי ליחידה?',
    options: ['20 ש"ח', '25 ש"ח', '30 ש"ח', '35 ש"ח'],
    answerIndex: 2,
    topic: 'עסקים',
  },
  {
    question: 'מהי המשמעות של עמלה במכירות?',
    options: ['קנס קבוע', 'תגמול שמשתנה לפי ביצועים', 'החזר מס', 'הוצאה חד-פעמית'],
    answerIndex: 1,
    topic: 'תעסוקה ומכירות',
  },
  {
    question: 'באיזה מצב נכון לדבר על כסף בתוך מערכת יחסים?',
    options: ['רק אחרי משבר', 'כשיש קנייה גדולה בלבד', 'באופן שוטף ושקוף סביב מטרות משותפות', 'עדיף לא לדבר בכלל'],
    answerIndex: 2,
    topic: 'מערכות יחסים וכסף',
  },
  {
    question: 'מהו צעד ראשון חכם ליוזמה עסקית של תלמיד?',
    options: ['להוציא כסף על פרסום מיד', 'לבדוק צורך אמיתי אצל קהל יעד', 'לפתוח חברה בע"מ ביום הראשון', 'לקבוע מחיר בלי בדיקה'],
    answerIndex: 1,
    topic: 'יזמות',
  },
  {
    question: 'איזו דוגמה משקפת ניהול זמן יעיל בלמידה?',
    options: ['לעבור משימה למשימה בלי סדר', 'להתחיל במשימות דחופות וחשובות', 'לדחות עד הלילה', 'לעבוד רק כשיש לחץ'],
    answerIndex: 1,
    topic: 'ניהול זמן',
  },
  {
    question: 'מה משפר אמינות בהצגה מול קהל?',
    options: ['שימוש בסיסמאות בלבד', 'הצגת נתון ודוגמה תומכת', 'דיבור בלי מבנה', 'התעלמות משאלות'],
    answerIndex: 1,
    topic: 'עמידה מול קהל',
  },
  {
    question: 'מה תפקיד המיתוג עבור עסק קטן?',
    options: ['להחליף מוצר טוב', 'ליצור זיהוי ובידול עקבי', 'להקטין עלויות מס', 'להבטיח מכירות מיידיות'],
    answerIndex: 1,
    topic: 'בניית עסק',
  },
  {
    question: 'איזו החלטה צרכנית נחשבת מושכלת יותר?',
    options: ['לקנות מוצר זול בלי לבדוק איכות', 'לבחור לפי המלצת משפיען בלבד', 'להשוות יחס עלות-תועלת ושירות', 'לרכוש מיד לפני בדיקה'],
    answerIndex: 2,
    topic: 'צרכנות נבונה',
  },
  {
    question: 'במונחי השקעה, מה המשמעות של "פיזור"?',
    options: ['להשקיע הכול בנכס אחד', 'לחלק השקעה בין כמה אפיקים', 'להשאיר כסף רק במזומן תמיד', 'להימנע מכל סיכון'],
    answerIndex: 1,
    topic: 'השקעות',
  },
  {
    question: 'מהו סחר חליפין?',
    options: ['קנייה בכרטיס אשראי בלבד', 'החלפת מוצרים/שירותים ללא שימוש בכסף', 'מבצע של מוצר שני חינם', 'מכירה בהקפה'],
    answerIndex: 0,
    topic: 'יסודות כלכלה',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function WhoWantsToBeSmartInThePocketGame({ onBack }: WhoWantsToBeSmartInThePocketGameProps) {
  const [runKey, setRunKey] = useState(0);
  const quiz = useMemo(() => shuffle(QUESTIONS), [runKey]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const rawBasePath = import.meta.env.BASE_URL || '/';
  const basePath = rawBasePath.startsWith('/') ? rawBasePath : `/${rawBasePath}`;
  const basePathWithSlash = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const mobileQuizPath = `${basePathWithSlash}games/who-wants-smartkis-quiz.html`;
  const mobileQuizUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${mobileQuizPath}`
    : mobileQuizPath;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(mobileQuizUrl)}`;

  const current = quiz[index];
  const total = quiz.length;
  const isLast = index === total - 1;

  useEffect(() => {
    if (showResult) return;

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult, runKey]);

  const handleAnswer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === current.answerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (isLast) {
      setShowResult(true);
      return;
    }
    setIndex(prev => prev + 1);
    setSelected(null);
  };

  const restart = () => {
    setRunKey(prev => prev + 1);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setElapsedSeconds(0);
  };

  if (showResult) {
    const grade = Math.round((score / total) * 100);
    return (
      <div className="bg-gradient-to-br from-emerald-100 via-yellow-50 to-cyan-100 rounded-3xl border-2 border-emerald-300 shadow-xl p-5 space-y-5" dir="rtl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-brand-dark-blue/70">פעילות - שיעור סיכום</p>
            <h3 className="text-2xl font-bold text-brand-dark-blue">מי רוצה להיות חכם בכיס</h3>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
          >
            חזרה לחלון המשחקים
          </button>
        </div>

        <div className="rounded-3xl border-2 border-emerald-400 bg-white p-8 text-center space-y-3 shadow-lg">
          <p className="text-5xl">🏆</p>
          <p className="text-3xl font-black text-emerald-800">סיימתם את החידון!</p>
          <p className="text-xl font-bold text-emerald-700">תשובות נכונות: {score} מתוך {total}</p>
          <p className="text-lg text-emerald-700">זמן כולל: {formatTime(elapsedSeconds)}</p>
          <p className="text-lg text-emerald-700">ציון סופי: {grade}</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={restart}
              className="px-5 py-2 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700"
            >
              שחקו שוב
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-full bg-white border border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100"
            >
              חזרה לגריד
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-fuchsia-100 via-amber-50 to-cyan-100 rounded-3xl border-2 border-fuchsia-300 shadow-xl p-5 space-y-5" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">פעילות - שיעור סיכום</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">מי רוצה להיות חכם בכיס</h3>
          <p className="text-brand-dark-blue/60">חידון טריוויה של 20 שאלות אמריקאיות על נושאי התוכנית</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
        >
          חזרה לחלון המשחקים
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-3 flex flex-wrap items-center justify-between bg-white border-2 border-amber-300 rounded-2xl px-4 py-3">
          <p className="font-black text-brand-dark-blue">שאלה {index + 1} מתוך {total}</p>
          <p className="font-black text-brand-dark-blue">ניקוד: {score}</p>
          <p className="font-black text-fuchsia-700">זמן: {formatTime(elapsedSeconds)}</p>
        </div>
        <a
          href={mobileQuizUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border-2 border-cyan-300 rounded-2xl px-3 py-2 text-center hover:shadow-md"
        >
          <p className="text-xs font-bold text-brand-dark-blue/70 mb-1">סרקו לנייד</p>
          <img
            src={qrImageUrl}
            alt="QR לחידון מי רוצה להיות חכם בכיס"
            className="mx-auto w-40 h-40 rounded-lg border border-cyan-200"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </a>
      </div>

      <div className="w-full bg-white/70 rounded-full h-3 overflow-hidden border border-fuchsia-200">
        <div
          className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border-2 border-fuchsia-200 bg-white p-5 shadow-md">
        <p className="text-sm text-fuchsia-700 font-bold mb-2">נושא: {current.topic}</p>
        <h4 className="text-2xl font-black text-brand-dark-blue leading-relaxed">{current.question}</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {current.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const isCorrect = optionIndex === current.answerIndex;

            let className = 'rounded-xl border-2 p-4 text-right font-bold transition '; 
            if (selected === null) {
              className += 'border-slate-200 hover:border-fuchsia-400 bg-white hover:bg-fuchsia-50';
            } else if (isCorrect) {
              className += 'border-emerald-500 bg-emerald-50 text-emerald-900';
            } else if (isSelected) {
              className += 'border-rose-400 bg-rose-50 text-rose-900';
            } else {
              className += 'border-gray-200 bg-white opacity-70';
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(optionIndex)}
                disabled={selected !== null}
                className={className}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
            <p className={`font-bold ${selected === current.answerIndex ? 'text-emerald-700' : 'text-red-700'}`}>
              {selected === current.answerIndex ? 'נכון מאוד!' : `לא נכון. התשובה הנכונה היא: ${current.options[current.answerIndex]}`}
            </p>
            <button
              onClick={nextQuestion}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold hover:opacity-90"
            >
              {isLast ? 'סיום חידון' : 'שאלה הבאה'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
