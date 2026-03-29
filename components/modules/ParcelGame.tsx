import React, { useEffect, useRef, useState } from 'react';

export interface ParcelItem {
  id: string;
  kind: 'question' | 'task';
  title: string;
  prompt: string;
  difficulty: 'קל' | 'בינוני' | 'אתגרי';
  points: number;
}

interface ParcelGameProps {
  items: ParcelItem[];
  moduleTitle: string;
  moduleSubtitle: string;
  musicUrl?: string;
}

const difficultyConfig: Record<ParcelItem['difficulty'], { badge: string; icon: string }> = {
  'קל':     { badge: 'bg-emerald-400 text-white', icon: '⭐' },
  'בינוני': { badge: 'bg-amber-400 text-white',   icon: '⭐⭐' },
  'אתגרי':  { badge: 'bg-rose-500 text-white',    icon: '🔥' },
};

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getRandomDurationMs = () => 6000 + Math.floor(Math.random() * 8001);

const ParcelGame: React.FC<ParcelGameProps> = ({ items, moduleTitle, moduleSubtitle, musicUrl = '' }) => {
  const [order, setOrder] = useState<ParcelItem[]>(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState<ParcelItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [awarded, setAwarded] = useState(false);

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const melodyIntervalRef = useRef<number | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const startSound = () => {
    if (musicUrl) {
      try {
        const audio = new Audio(musicUrl);
        audio.loop = true;
        audio.volume = 0.22;
        audioRef.current = audio;
        audio.play().catch(() => {});
        return;
      } catch (_) {}
    }
    try {
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800;
      const scale = [262, 294, 330, 392, 440, 494];
      osc.type = 'triangle';
      osc.frequency.value = scale[Math.floor(Math.random() * scale.length)];
      gain.gain.value = 0.06;
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      filterRef.current = filter;
      const interval = window.setInterval(() => {
        if (!oscRef.current) return;
        oscRef.current.frequency.setTargetAtTime(
          scale[Math.floor(Math.random() * scale.length)],
          ctx.currentTime, 0.01
        );
      }, 220 + Math.random() * 100);
      melodyIntervalRef.current = interval;
    } catch (_) {}
  };

  const stopSound = () => {
    if (audioRef.current) {
      try { audioRef.current.pause(); audioRef.current.currentTime = 0; } catch (_) {}
      audioRef.current = null;
    }
    if (melodyIntervalRef.current) { window.clearInterval(melodyIntervalRef.current); melodyIntervalRef.current = null; }
    try {
      oscRef.current?.stop(); oscRef.current?.disconnect();
      gainRef.current?.disconnect(); filterRef.current?.disconnect();
      oscRef.current = null; gainRef.current = null; filterRef.current = null;
    } catch (_) {}
  };

  const clearTimers = () => {
    if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const handleStartRound = () => {
    if (isPlaying) return;
    if (index >= order.length) {
      setOrder(shuffle(items));
      setIndex(0);
      setCurrentItem(null);
      setAwarded(false);
      setScore(0);
    }
    setCurrentItem(null);
    setAwarded(false);
    setIsPlaying(true);
    startSound();
    timerRef.current = window.setTimeout(() => {
      stopSound();
      clearTimers();
      setIsPlaying(false);
      setCurrentItem(order[index] ?? null);
      setIndex(prev => prev + 1);
    }, getRandomDurationMs());
  };

  const handleAward = () => {
    if (!currentItem || awarded) return;
    setScore(prev => prev + currentItem.points);
    setAwarded(true);
  };

  const handleAwardAndStart = () => {
    if (!currentItem) return;
    if (!awarded) { setScore(prev => prev + currentItem.points); setAwarded(true); }
    setCurrentItem(null);
    handleStartRound();
  };

  const handleReset = () => {
    clearTimers();
    stopSound();
    setOrder(shuffle(items));
    setIndex(0);
    setCurrentItem(null);
    setIsPlaying(false);
    setScore(0);
    setAwarded(false);
  };

  useEffect(() => () => { clearTimers(); stopSound(); audioCtxRef.current?.close(); }, []);

  const itemsLeft = order.length - index;
  const finished = index >= order.length && !isPlaying && !currentItem;
  const cfg = currentItem ? difficultyConfig[currentItem.difficulty] : null;

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 35%,#4c1d95 65%,#6b21a8 100%)' }}
    >
      {/* Floating blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {['top-6 left-8','top-1/3 right-6','bottom-10 left-1/4','bottom-4 right-12','top-1/2 left-1/2'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} rounded-full opacity-10 animate-ping`}
            style={{
              width: `${60 + i * 30}px`, height: `${60 + i * 30}px`,
              background: ['#f472b6','#fb923c','#facc15','#34d399','#60a5fa'][i],
              animationDuration: `${2 + i * 0.7}s`, animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-5 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-purple-300 text-sm tracking-widest uppercase font-semibold">משחק כיתתי</p>
            <h4 className="text-3xl font-extrabold text-white drop-shadow-lg">🎁 חבילה עוברת</h4>
            <p className="text-purple-200 text-sm mt-0.5">{moduleTitle} · {moduleSubtitle}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col items-center bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-purple-200 text-xs font-semibold">קלפים</span>
              <span className="text-3xl font-black text-amber-300 leading-none">{itemsLeft}</span>
            </div>
            <div className="flex flex-col items-center bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-purple-200 text-xs font-semibold">ש"ח</span>
              <span className="text-3xl font-black text-emerald-300 leading-none">{score}</span>
            </div>
          </div>
        </div>

        {/* Arena */}
        <div
          className={`relative flex flex-col items-center justify-center text-center rounded-3xl p-8 min-h-[340px] transition-all duration-500
            ${isPlaying
              ? 'bg-gradient-to-br from-fuchsia-900/70 to-violet-900/70 border-2 border-fuchsia-400/60 shadow-[0_0_40px_rgba(192,38,211,0.4)]'
              : 'bg-white/5 border border-white/10'}`}
        >
          {/* Gift */}
          <div className="relative">
            {isPlaying && (
              <>
                <div className="absolute inset-0 rounded-full bg-fuchsia-400/30 animate-ping" style={{ animationDuration: '1s' }} />
                <div className="absolute -inset-3 rounded-full border-4 border-fuchsia-300/40 animate-spin" style={{ animationDuration: '2s' }} />
                <div className="absolute -inset-6 rounded-full border-2 border-amber-300/20 animate-spin" style={{ animationDuration: '3.5s', animationDirection: 'reverse' }} />
              </>
            )}
            <div
              className={`relative w-36 h-36 rounded-full flex items-center justify-center text-7xl shadow-2xl select-none
                ${isPlaying ? 'animate-spin' : finished ? '' : 'animate-bounce'}`}
              style={{
                background: 'linear-gradient(135deg,#f472b6,#fb923c,#facc15)',
                boxShadow: isPlaying
                  ? '0 0 0 6px rgba(251,146,60,0.3),0 20px 60px rgba(244,114,182,0.5)'
                  : '0 10px 40px rgba(0,0,0,0.4)',
                animationDuration: isPlaying ? '1.2s' : '2s',
              }}
            >🎁</div>
          </div>

          {isPlaying ? (
            <div className="mt-6 space-y-1">
              <p className="text-2xl font-extrabold text-white animate-pulse">🎵&ensp;המוזיקה מתנגנת...&ensp;🎵</p>
              <p className="text-fuchsia-200 text-base font-medium">העבירו את החבילה לחבר הבא!</p>
            </div>
          ) : finished ? (
            <div className="mt-6 space-y-2">
              <p className="text-4xl font-black text-amber-300">🎉 כל הכבוד!</p>
              <p className="text-white/80 text-lg">כל הקלפים חולקו. לחצו אפס כדי לשחק שוב.</p>
              <p className="text-emerald-300 text-2xl font-bold">סה"כ: {score} ש"ח ✨</p>
            </div>
          ) : !currentItem ? (
            <div className="mt-6 space-y-2">
              <p className="text-2xl font-bold text-white">לחצו הפעילו את החבילה כדי להתחיל!</p>
              <p className="text-purple-200 text-sm">כשהמוזיקה נעצרת — יוצאת שאלה או משימה 🎯</p>
            </div>
          ) : (
            <div
              className="mt-6 w-full max-w-3xl text-right rounded-3xl p-5 shadow-2xl animate-fade-in"
              style={{
                background: 'linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(255,255,255,0.2)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg ${cfg!.badge}`}>
                    {cfg!.icon} {currentItem.difficulty}
                  </span>
                  <span
                    className={`text-sm font-bold px-4 py-1.5 rounded-full text-white
                      ${currentItem.kind === 'question' ? 'bg-sky-500' : 'bg-violet-500'}`}
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                  >
                    {currentItem.kind === 'question' ? '❓ שאלה' : '🛠️ משימה'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-300/40 rounded-full px-3 py-1">
                  <span className="text-amber-300 font-extrabold text-lg">{currentItem.points}</span>
                  <span className="text-amber-200 text-sm">ש"ח</span>
                </div>
              </div>
              <h5 className="text-2xl font-extrabold text-white mb-2 drop-shadow">{currentItem.title}</h5>
              <p className="text-purple-100 text-lg leading-relaxed">{currentItem.prompt}</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={awarded ? handleAwardAndStart : handleAward}
                  className="px-6 py-2.5 rounded-full font-extrabold text-white text-base shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: awarded ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'linear-gradient(135deg,#ec4899,#db2777)',
                    boxShadow: awarded ? '0 4px 20px rgba(99,102,241,0.5)' : '0 4px 20px rgba(236,72,153,0.5)',
                  }}
                >
                  {awarded ? '🚀 הפעילו את החבילה' : `✅ סיימנו! קיבלנו +${currentItem.points}`}
                </button>
                <button
                  onClick={() => setCurrentItem(null)}
                  className="px-5 py-2.5 rounded-full font-bold text-white/70 border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                >דלג ←</button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleStartRound}
            disabled={isPlaying}
            className={`px-8 py-3.5 rounded-full font-extrabold text-white text-lg shadow-xl transition-all duration-200
              ${isPlaying ? 'opacity-60 cursor-not-allowed bg-gray-600' : 'hover:scale-105 active:scale-95'}`}
            style={!isPlaying ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 6px 24px rgba(124,58,237,0.55)' } : {}}
          >
            {isPlaying ? '🎵 המוזיקה פועלת...' : finished ? '🔄 סיבוב חדש' : '▶ הפעילו את החבילה'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3.5 rounded-full font-bold text-white/70 border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95 text-base"
          >♻ אפס</button>
        </div>
      </div>
    </div>
  );
};

export default ParcelGame;

// ─── Item banks per module ─────────────────────────────────────────────────

export const expensesItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'הכנסות מול הוצאות', prompt: 'מהו ההבדל בין הכנסה להוצאה? תנו דוגמה לכל אחת מחיי יומיום.', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'הוצאות קבועות ומשתנות', prompt: 'מהי הוצאה קבועה ומהי משתנה? מדוע חשוב להבחין ביניהן בתכנון תקציב?', difficulty: 'בינוני', points: 20 },
  { id: 'q3', kind: 'question', title: 'כלל 50-30-20', prompt: 'הסבירו את שיטת 50-30-20 לניהול תקציב — מה כל אחוז מייצג?', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'גירעון תקציבי', prompt: 'מה קורה כשההוצאות עולות על ההכנסות? מה ניתן לעשות כדי לאזן?', difficulty: 'קל', points: 15 },
  { id: 'q5', kind: 'question', title: 'הוצאות בלתי צפויות', prompt: 'למה חשוב להכניס בתקציב סעיף "הפתעות"? תנו שתי דוגמאות להוצאות לא צפויות.', difficulty: 'קל', points: 10 },
  { id: 'q6', kind: 'question', title: 'מעקב הוצאות', prompt: 'ציינו שלוש דרכים מעשיות לעקוב אחר ההוצאות החודשיות שלכם.', difficulty: 'בינוני', points: 20 },
  { id: 'q7', kind: 'question', title: 'עדיפויות', prompt: 'כיצד מחליטים מה "חובה" לרכוש לעומת מה שאפשר לדחות? תנו דוגמה.', difficulty: 'בינוני', points: 20 },
  { id: 'q8', kind: 'question', title: 'חיסכון כהוצאה', prompt: 'למה מומלץ לרשום חיסכון כ"הוצאה" ראשונה בתקציב ולא כ"מה שנשאר בסוף"?', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'השוואת מחירים', prompt: 'תנו שלושה טיפים מעשיים לחיסכון בהוצאות השוטפות של משק בית.', difficulty: 'קל', points: 10 },
  { id: 'q10', kind: 'question', title: 'תקציב חודשי', prompt: 'אם הכנסה חודשית היא 5,000 ש"ח ו-60% הולך להוצאות חיוניות — כמה ש"ח נשאר לשאר הצרכים?', difficulty: 'בינוני', points: 25 },
  { id: 't1', kind: 'task', title: 'תקציב אישי', prompt: 'כל תלמיד מדמה הכנסה חודשית של 3,000 ש"ח. חלקו יחד תקציב: כמה לשכר דירה? אוכל? בילויים? חיסכון?', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'ציד הוצאות', prompt: 'כתבו במשך 2 דקות את כל ההוצאות שהייתן לכם השבוע האחרון. מיינו אותן לחיוניות / רצוי / מיותר.', difficulty: 'קל', points: 15 },
  { id: 't3', kind: 'task', title: 'חיתוך הוצאות', prompt: 'בחרו 3 הוצאות שאתם יכולים לצמצם החודש. חשבו כמה כסף תחסכו בחודש ובשנה.', difficulty: 'בינוני', points: 25 },
  { id: 't4', kind: 'task', title: 'תרחיש קיצוני', prompt: 'מה תעשו אם פתאום ההכנסה תרד ב-30%? ציינו 5 הוצאות ראשונות שתקצצו ולמה.', difficulty: 'אתגרי', points: 40 },
  { id: 't5', kind: 'task', title: 'אתגר שבוע', prompt: 'הסכימו על אתגר חיסכון קבוצתי קטן לשבוע: לא קפה מהחוץ, לא אמזון, לא מאכלי נוחות. חשבו כמה תחסכו.', difficulty: 'אתגרי', points: 50 },
];

export const overdraftItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'מהו מינוס?', prompt: 'הסבירו במילים פשוטות מהו "מינוס בבנק" וכיצד הוא נוצר.', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'ריבית על המינוס', prompt: 'מדוע מינוס בבנק יקר? מה המשמעות של ריבית על חוב עובר ושב?', difficulty: 'בינוני', points: 20 },
  { id: 'q3', kind: 'question', title: 'מינוס מורשה מול לא מורשה', prompt: 'מה ההבדל בין "מינוס מורשה" ל"מינוס לא מורשה" ומה ההשלכות של כל אחד?', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'אפקט הסחרחרת', prompt: 'הסבירו מדוע אנשים "נתקעים" במינוס ומתקשים לצאת ממנו — מה מנציח את הבעיה?', difficulty: 'אתגרי', points: 40 },
  { id: 'q5', kind: 'question', title: 'חישוב ריבית', prompt: 'אם ריבית השנתית על מינוס היא 12% ויצאת ב-1,000 ש"ח מינוס לחודש שלם — כמה תשלמי ריבית?', difficulty: 'בינוני', points: 25 },
  { id: 'q6', kind: 'question', title: 'סימנים מקדימים', prompt: 'ציינו שלושה סימנים שמתריעים שאדם עלול ליפול למינוס בקרוב.', difficulty: 'קל', points: 15 },
  { id: 'q7', kind: 'question', title: 'חלופות למינוס', prompt: 'תנו שתי חלופות לקחת מינוס כשזקוקים לכסף דחוף — מה היתרונות של כל אחת?', difficulty: 'בינוני', points: 20 },
  { id: 'q8', kind: 'question', title: 'מינוס וציון אשראי', prompt: 'כיצד מינוס כרוני משפיע על דירוג האשראי וביכולת לקבל הלוואות עתידיות?', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'כרטיס אשראי', prompt: 'מדוע "דחיית תשלום" בכרטיס אשראי עלולה להיות כמו מינוס? באיזה מצב זה טוב ומתי זה מסוכן?', difficulty: 'בינוני', points: 20 },
  { id: 'q10', kind: 'question', title: 'יציאה מהמינוס', prompt: 'ציינו כלל זהב אחד שתמנע ממכם ליפול למינוס, ועוד כלל שיעזור לצאת ממנו.', difficulty: 'קל', points: 10 },
  { id: 't1', kind: 'task', title: 'חישוב עלות מינוס', prompt: 'מינוס של 2,000 ש"ח בריבית שנתית 15% — חשבו כמה תשלמו בחודש, ברבעון ובשנה. האם כדאי?', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'תוכנית יציאה', prompt: 'בניחוח מינוס של 5,000 ש"ח והכנסה חודשית 4,000 ש"ח — כתבו תוכנית 3 חודשים לצאת ממנו.', difficulty: 'אתגרי', points: 50 },
  { id: 't3', kind: 'task', title: 'ניתוח כדאיות', prompt: 'השוו: האם עדיף לקחת הלוואה בריבית 8% לשנה כדי לסגור מינוס בריבית 14%? הסבירו את ההיגיון.', difficulty: 'אתגרי', points: 40 },
  { id: 't4', kind: 'task', title: 'מקרה בסיס', prompt: 'קוראים לו דני, 24, מינוס 8,000 ש"ח, משכורת 6,000 ש"ח. כתבו לו 5 המלצות קונקרטיות.', difficulty: 'בינוני', points: 25 },
  { id: 't5', kind: 'task', title: 'כלל ה-24 שעות', prompt: 'הסכימו על כלל אישי שימנע ממכם קנייה אימפולסיבית שעלולה להכניס למינוס. הציגו אותו לכיתה.', difficulty: 'קל', points: 15 },
];

export const paystubItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'ברוטו מול נטו', prompt: 'מהו ההבדל בין שכר ברוטו לשכר נטו? למה הם תמיד שונים?', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'מס הכנסה', prompt: 'מהי מדרגת מס? מדוע מי שמרוויח יותר משלם אחוז גבוה יותר ממשכורתו?', difficulty: 'בינוני', points: 25 },
  { id: 'q3', kind: 'question', title: 'ביטוח לאומי', prompt: 'מה תפקיד ביטוח לאומי? ציינו שני שירותים שממומנים על ידו.', difficulty: 'קל', points: 15 },
  { id: 'q4', kind: 'question', title: 'נקודות זיכוי', prompt: 'מהי "נקודת זיכוי" ואיך היא מפחיתה את המס שמשלמים?', difficulty: 'בינוני', points: 20 },
  { id: 'q5', kind: 'question', title: 'ניכוי פנסיה', prompt: 'מדוע ניכוי פנסיה מופיע בתלוש כ"הוצאה" אבל בעצם הוא חיסכון לטובתכם?', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'תאריך קבלת שכר', prompt: 'מה החוק אומר על מועד תשלום שכר? מה קורה אם המעסיק מאחר?', difficulty: 'קל', points: 10 },
  { id: 'q7', kind: 'question', title: 'שעות נוספות בתלוש', prompt: 'כיצד שעות נוספות אמורות להיראות בתלוש שכר? מה הפרשי השכר?', difficulty: 'בינוני', points: 25 },
  { id: 'q8', kind: 'question', title: 'ניכויים חובה מול רשות', prompt: 'ציינו שני ניכויים שהמעסיק חייב לנכות ושניים שניכויים רק בהסכמה.', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'שאלת תלוש', prompt: 'אם ברוטו 10,000 ש"ח ו-28% ניכויים — כמה נטו תקבלו? כמה ש"ח הולך לניכויים?', difficulty: 'בינוני', points: 25 },
  { id: 'q10', kind: 'question', title: 'החזר מס', prompt: 'מהו "החזר מס"? מי זכאי לו ואיך מגישים בקשה?', difficulty: 'אתגרי', points: 40 },
  { id: 't1', kind: 'task', title: 'פענוח תלוש', prompt: 'חלקו תלוש שכר לדוגמה. זהו יחד: ברוטו, נטו, כל ניכוי — ומה אחוזו מהשכר.', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'הסבר לחבר', prompt: 'הסבירו לחבר שמקבל משכורת ראשונה: למה הנטו נמוך יותר מהברוטו שסוכם בחוזה?', difficulty: 'קל', points: 15 },
  { id: 't3', kind: 'task', title: 'חישוב נטו', prompt: 'ברוטו 7,500 ש"ח. ניכויים: מס הכנסה 12%, ביטוח לאומי 5.5%, פנסיה 6%. חשבו את הנטו.', difficulty: 'אתגרי', points: 50 },
  { id: 't4', kind: 'task', title: 'שגיאות בתלוש', prompt: 'מצאו 3 דברים שיכולים להיות שגויים בתלוש שכר ואיך בודקים/מתמודדים עם כל אחד.', difficulty: 'בינוני', points: 25 },
  { id: 't5', kind: 'task', title: 'תוכנית פנסיה', prompt: 'אם מתחילים לחסוך לפנסיה ב-25 לעומת ב-35, מה ההפרש הצפוי בגיל 67? הסבירו את ההיגיון.', difficulty: 'אתגרי', points: 40 },
];

export const employmentItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'שכיר מול עצמאי', prompt: 'ציינו שלושה הבדלים עיקריים בין עובד שכיר לעצמאי מבחינת זכויות וחובות.', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'ביטוח לאומי לעצמאי', prompt: 'מדוע עצמאי חייב לשלם ביטוח לאומי באופן עצמאי ומה קורה אם לא משלמים?', difficulty: 'בינוני', points: 20 },
  { id: 'q3', kind: 'question', title: 'מע"מ', prompt: 'מהו מע"מ? מיהו "עוסק מורשה" ומדוע עצמאי חייב לגבות מע"מ?', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'מקדמות מס', prompt: 'מה הן "מקדמות מס" שעצמאי משלם? מדוע הן נחוצות?', difficulty: 'בינוני', points: 20 },
  { id: 'q5', kind: 'question', title: 'חשבונית עסק', prompt: 'מה ההבדל בין קבלה לחשבונית? מתי כל אחת ניתנת ולמה אסור לבלבל ביניהן?', difficulty: 'בינוני', points: 25 },
  { id: 'q6', kind: 'question', title: 'הוצאות מוכרות', prompt: 'מהן "הוצאות מוכרות" לצרכי מס? תנו שתי דוגמאות להוצאה מוכרת לעצמאי.', difficulty: 'קל', points: 15 },
  { id: 'q7', kind: 'question', title: 'פנסיה לעצמאי', prompt: 'מדוע עצמאי צריך להפריש פנסיה באופן עצמאי? מה קורה אם לא עושים זאת?', difficulty: 'אתגרי', points: 40 },
  { id: 'q8', kind: 'question', title: 'קרן השתלמות', prompt: 'מהי קרן השתלמות ומה יתרונותיה המיוחדים לעצמאים?', difficulty: 'בינוני', points: 20 },
  { id: 'q9', kind: 'question', title: 'רווח נקי', prompt: 'עצמאי הרוויח 10,000 ש"ח ברוטו. יש הוצאות עסקיות של 3,000 ש"ח. מה הבסיס למס שלו?', difficulty: 'בינוני', points: 25 },
  { id: 'q10', kind: 'question', title: 'זכויות שכיר', prompt: 'ציינו שני יתרונות שיש לשכיר על פני עצמאי מבחינת ביטחון תעסוקתי.', difficulty: 'קל', points: 10 },
  { id: 't1', kind: 'task', title: 'השוואת מסלולים', prompt: 'מחשב שכיר: נטו 7,000 ש"ח. מחשב עצמאי: ברוטו 10,000 ש"ח, הוצאות 2,000, מס 20%. מי מרוויח יותר?', difficulty: 'אתגרי', points: 50 },
  { id: 't2', kind: 'task', title: 'הקמת עסק', prompt: 'רשמו 5 צעדים ראשונים שחייבים לעשות כשפותחים עסק עצמאי קטן בישראל.', difficulty: 'בינוני', points: 30 },
  { id: 't3', kind: 'task', title: 'ניהול תזרים', prompt: 'עצמאי מרוויח בחודשים לא קבועים. כיצד כדאי לנהל את הכסף כדי לשרוד חודשים "דלים"?', difficulty: 'אתגרי', points: 40 },
  { id: 't4', kind: 'task', title: 'חשבונית לדוגמה', prompt: 'צרו חשבונית מס לדוגמה: שם, מע"מ, שוות כסף, חישוב סופי. הציגו לכיתה.', difficulty: 'בינוני', points: 25 },
  { id: 't5', kind: 'task', title: 'יתרון ספציפי', prompt: 'כל אחד בוחר: שכיר או עצמאי? הסבירו שלוש סיבות לבחירה שלכם בהתאם לאורח חיים רצוי.', difficulty: 'קל', points: 15 },
];

export const savingsInvestItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'ריבית דריבית', prompt: 'הסבירו מהי "ריבית דריבית" ולמה אלברט איינשטיין כינה אותה "פלא השמיני של תבל"?', difficulty: 'בינוני', points: 25 },
  { id: 'q2', kind: 'question', title: 'סיכון ותשואה', prompt: 'מדוע ככל שהשקעה מסוכנת יותר — התשואה הפוטנציאלית גבוהה יותר? תנו דוגמה.', difficulty: 'בינוני', points: 20 },
  { id: 'q3', kind: 'question', title: 'מניות', prompt: 'מה זה "מנייה"? מה מסמלת ומה היא מזכה?', difficulty: 'קל', points: 10 },
  { id: 'q4', kind: 'question', title: 'אגרות חוב', prompt: 'מהי "אגרת חוב"? מי מנפיק אותה ומדוע היא נחשבת בטוחה יותר ממניה?', difficulty: 'בינוני', points: 20 },
  { id: 'q5', kind: 'question', title: 'תיק מגוון', prompt: 'מדוע מומלץ לפזר השקעות בין נכסים שונים? מה הסכנה של "השקעה אחת"?', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'קרן נאמנות', prompt: 'מהי קרן נאמנות? האם היא מתאימה למשקיע מתחיל? הסבירו.', difficulty: 'קל', points: 15 },
  { id: 'q7', kind: 'question', title: 'כוח הזמן', prompt: 'אם חוסכים 500 ש"ח לחודש מגיל 20 בריבית 7%, כמה יהיה בגיל 65? מה "הכוח" שפועל כאן?', difficulty: 'אתגרי', points: 40 },
  { id: 'q8', kind: 'question', title: 'אינפלציה', prompt: 'מהי אינפלציה וכיצד היא "שוחקת" את ערך החיסכון שיושב בעובר ושב?', difficulty: 'בינוני', points: 25 },
  { id: 'q9', kind: 'question', title: 'S&P 500', prompt: 'מהו מדד S&P 500 ומדוע הוא נחשב כלי השקעה פשוט ויעיל לרוב האנשים?', difficulty: 'אתגרי', points: 40 },
  { id: 'q10', kind: 'question', title: 'קרן חירום', prompt: 'מהי "קרן חירום" וכמה חודשי הוצאות מומלץ שתכסה? היכן מומלץ לשמור אותה?', difficulty: 'קל', points: 10 },
  { id: 't1', kind: 'task', title: 'כוח הריבית', prompt: '1,000 ש"ח בריבית 5% לשנה — חשבו כמה יהיה אחרי 10 שנים עם ריבית דריבית. הציגו שלב אחר שלב.', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'תיק השקעות', prompt: 'בנו "תיק השקעות" של 10,000 ש"ח דמיוניים: כמה במניות? אגרות חוב? פיקדון? הצדיקו את הבחירות.', difficulty: 'אתגרי', points: 50 },
  { id: 't3', kind: 'task', title: 'השוואת חיסכון', prompt: 'מה עדיף: חיסכון בבנק בריבית 2% לשנה, פיקדון ב-4%, או השקעה בקרן מניות עם ממוצע 7%? הציגו חישוב ל-20 שנה.', difficulty: 'אתגרי', points: 40 },
  { id: 't4', kind: 'task', title: 'מטרה לחיסכון', prompt: 'בחרו מטרה (טיול, רכב, דירה) וחשבו כמה לחסוך בחודש בריבית 4% כדי להגיע אליה תוך 5 שנים.', difficulty: 'בינוני', points: 25 },
  { id: 't5', kind: 'task', title: 'כלל 72', prompt: 'גלו את "כלל 72": מחלקים 72 בריבית = מספר שנים להכפלת הכסף. חשבו לריביות 4%, 6%, 9%.', difficulty: 'בינוני', points: 25 },
];

// ─── מה בכיס item banks ─────────────────────────────────────────────────────

export const storyItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'ימי הסחר החליפין', prompt: 'מהו "סחר חליפין"? תנו דוגמה ומדוע הוא לא יעיל לחברות גדולות?', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'מה הפך לכסף?', prompt: 'ציינו שלושה דברים שונים ששימשו ככסף בהיסטוריה לפני המטבעות המוכרים.', difficulty: 'קל', points: 15 },
  { id: 'q3', kind: 'question', title: 'תפקידי הכסף', prompt: 'מהם שלושת התפקידים הקלאסיים של כסף: אמצעי חליפין, יחידת חשבון, מאגר ערך — הסבירו כל אחד.', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'תקן הזהב', prompt: 'מהו "תקן הזהב"? מדוע מדינות עברו ממנו לכסף פיאט?', difficulty: 'בינוני', points: 20 },
  { id: 'q5', kind: 'question', title: 'כסף פיאט', prompt: 'מהו כסף פיאט? על מה מבוסס ערכו אם לא על זהב?', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'ההיסטוריה של השקל', prompt: 'מה ידוע לכם על תולדות השקל הישראלי? מתי נוסד השקל החדש ומה קדם לו?', difficulty: 'קל', points: 10 },
  { id: 'q7', kind: 'question', title: 'אינפלציה בהיסטוריה', prompt: 'ציינו דוגמה היסטורית של היפר-אינפלציה — מה גרם לה ומה הייתה ההשפעה?', difficulty: 'בינוני', points: 25 },
  { id: 'q8', kind: 'question', title: 'כסף דיגיטלי', prompt: 'מהו כסף דיגיטלי ומה ההבדל בין כרטיס אשראי לביטקוין?', difficulty: 'אתגרי', points: 35 },
  { id: 'q9', kind: 'question', title: 'הבנק המרכזי', prompt: 'מה תפקיד בנק ישראל (הבנק המרכזי)? כיצד הוא שולט בכמות הכסף במשק?', difficulty: 'אתגרי', points: 40 },
  { id: 'q10', kind: 'question', title: 'כסף ואמון', prompt: 'מדוע אמון הוא הבסיס לכל מערכת מוניטרית? מה יקרה אם האמון יתמוטט?', difficulty: 'בינוני', points: 25 },
  { id: 't1', kind: 'task', title: 'ציר זמן של כסף', prompt: 'כתבו ציר זמן קצר של ההיסטוריה של הכסף: 5 תחנות מרכזיות בסדר כרונולוגי.', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'משחק חליפין', prompt: 'כל תלמיד "מחזיק" משהו (עיפרון, ספר, נייר). ניסו לסחור בלי כסף. מה הבעיה שנתקלתם בה?', difficulty: 'קל', points: 15 },
  { id: 't3', kind: 'task', title: 'כסף עתידי', prompt: 'מתארים ועוד 50 שנה — האם יהיה כסף פיזי? מה נחליף בו? הגנו על עמדתכם.', difficulty: 'אתגרי', points: 45 },
  { id: 't4', kind: 'task', title: 'ערך ופרשנות', prompt: 'שטר כסף הוא פשוט נייר — מה נותן לו ערך? דיון קבוצתי בן 3 דקות.', difficulty: 'בינוני', points: 25 },
  { id: 't5', kind: 'task', title: 'מטבע מקומי', prompt: 'תכננו מטבע דמיוני לכיתה שלכם: איך נקרא? על מה מתבסס ערכו? במה תשתמשו בו?', difficulty: 'אתגרי', points: 50 },
];

export const personalItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'כסף ורגשות', prompt: 'כיצד רגשות כמו פחד, תאווה ובושה משפיעים על ההחלטות הכלכליות שלנו?', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'אמונות מגבילות', prompt: 'מה הן "אמונות מגבילות" בנוגע לכסף? תנו שתי דוגמאות מחיי היומיום.', difficulty: 'בינוני', points: 20 },
  { id: 'q3', kind: 'question', title: 'זהות וכסף', prompt: 'כיצד "צריכה" יכולה לשמש לביטוי זהות אישית? מה הסכנות בכך?', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'קנייה אימפולסיבית', prompt: 'מהי קנייה אימפולסיבית? ציינו שני טריגרים שגורמים לה ושתי דרכים להתמודד.', difficulty: 'קל', points: 15 },
  { id: 'q5', kind: 'question', title: 'כסף ומשפחה', prompt: 'כיצד הרקע המשפחתי והחינוך הכלכלי משפיעים על הגישה שלנו לכסף בבגרות?', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'השוואה חברתית', prompt: 'ה"לעמוד בפני השכנים" — כיצד השוואה חברתית מובילה להוצאה יתר?', difficulty: 'בינוני', points: 20 },
  { id: 'q7', kind: 'question', title: 'ערכים וכסף', prompt: 'מדוע חשוב שהאיך שאנחנו מוציאים כסף יתאים לערכים שלנו? תנו דוגמה.', difficulty: 'אתגרי', points: 35 },
  { id: 'q8', kind: 'question', title: 'מיינדסט של שפע', prompt: 'מה ההבדל בין "מיינדסט שפע" ל"מיינדסט מחסור" בנוגע לכסף? מה ההשלכות?', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'אושר וכסף', prompt: 'מחקרים מראים שמעל רמה מסוימת כסף לא מוסיף אושר — מה הם מציעים במקום?', difficulty: 'בינוני', points: 25 },
  { id: 'q10', kind: 'question', title: 'הכרת התודה', prompt: 'כיצד חשיבת "הכרת התודה" יכולה לשפר את היחסים שלנו עם כסף ועם צריכה?', difficulty: 'קל', points: 10 },
  { id: 't1', kind: 'task', title: 'מפת הכסף האישית', prompt: 'כל אחד כותב: 3 דברים שלמדתי על כסף מהמשפחה — חיובי, שלילי, וניטרלי.', difficulty: 'בינוני', points: 25 },
  { id: 't2', kind: 'task', title: 'אמונות כסף', prompt: 'כתבו 3 אמונות שיש לכם על כסף ("כסף הוא..." / "עשירים הם..."). האם הן מדויקות?', difficulty: 'קל', points: 15 },
  { id: 't3', kind: 'task', title: 'כסף וערכים', prompt: 'אם הייתם מקבלים 10,000 ש"ח מחר — כיצד הייתם מחלקים? מה זה אומר על ערכיכם?', difficulty: 'בינוני', points: 30 },
  { id: 't4', kind: 'task', title: 'קנייה מודעת', prompt: 'חשבו על קנייה אחרונה שהתחרטתם עליה. מה גרם לה? מה הייתם עושים אחרת?', difficulty: 'בינוני', points: 25 },
  { id: 't5', kind: 'task', title: 'הצהרת כסף', prompt: 'כתבו הצהרה אישית: "הגישה שלי לכסף היא..." — ו"הדבר שאני רוצה לשנות הוא..."', difficulty: 'אתגרי', points: 45 },
];

export const costsItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'עלות אמיתית', prompt: 'מהי "עלות אמיתית" של מוצר מעבר למחיר התווית? תנו שתי דוגמאות.', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'עלות הזדמנות', prompt: 'מהי "עלות הזדמנות"? תנו דוגמה מהחיים האמיתיים של בחירה שיש לה עלות הזדמנות.', difficulty: 'בינוני', points: 25 },
  { id: 'q3', kind: 'question', title: 'מחיר ליחידה', prompt: 'כיצד משווים "מחיר ליחידה" בין שתי אריזות שונות? נסחו נוסחה פשוטה.', difficulty: 'קל', points: 15 },
  { id: 'q4', kind: 'question', title: 'עלות חיים דיגיטליים', prompt: 'ציינו 3 מנויים דיגיטליים שרבים "שוכחים" לבטל ומשלמים עליהם מיותר.', difficulty: 'קל', points: 10 },
  { id: 'q5', kind: 'question', title: 'עלות נסיעה', prompt: 'כלי רכב פרטי עולה לא רק דלק — ציינו 4 עלויות נוספות שעולות לבעלי רכב.', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'עלות אוכל', prompt: 'מדוע בישול בבית זול יותר מאכילה בחוץ? חשבו את ההפרש השנתי עבור ארוחת צהריים יומית.', difficulty: 'בינוני', points: 25 },
  { id: 'q7', kind: 'question', title: 'מלכודות "בחינם"', prompt: 'איך הצעות "חינם" כמו ניסיון חינם למשך חודשיים עלולות לעלות לכם כסף?', difficulty: 'בינוני', points: 20 },
  { id: 'q8', kind: 'question', title: 'עלות מסגרת אשראי', prompt: 'מדוע "עכשיו שלם, אחר כך תשלם" (BNPL) עלול לעלות יותר מהמחיר המקורי?', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'מחיר מבצע', prompt: '"מבצע 1+1" על מוצר שאתם לא צריכים — האם זה חוסך? הסבירו.', difficulty: 'קל', points: 10 },
  { id: 'q10', kind: 'question', title: 'השוואת ספקים', prompt: 'ציינו שלושה תחומים שבהם כדאי להשוות מחירים לפחות פעם בשנה כדי לחסוך.', difficulty: 'בינוני', points: 20 },
  { id: 't1', kind: 'task', title: 'ג\'אנק פוד ניתוח עלויות', prompt: '"ארוחת שניים" מרשת מזון מהיר עולה 80 ש"ח. חשבו עלות חודשית ושנתית אם זה פעם בשבוע.', difficulty: 'קל', points: 15 },
  { id: 't2', kind: 'task', title: 'עלות הרכב שלי', prompt: 'רכב שעולה 80,000 ש"ח: ביטוח, רישיון, טסט, דלק, חניה, תחזוקה — חשבו עלות חודשית כוללת.', difficulty: 'אתגרי', points: 45 },
  { id: 't3', kind: 'task', title: 'מנויים חשבון', prompt: 'רשמו את כל המנויים החודשיים שיש לכם (נטפליקס, ספוטיפיי, ענן...). כמה זה בשנה?', difficulty: 'בינוני', points: 25 },
  { id: 't4', kind: 'task', title: 'השוואת קניות', prompt: 'בחרו מוצר יומי (קפה, ארוחה, הסעה). השוו עלות 3 אפשרויות שונות. מה היחס?', difficulty: 'בינוני', points: 30 },
  { id: 't5', kind: 'task', title: 'חוסך חודשי', prompt: 'מצאו 5 שינויים קטנים שיכולים לחסוך ביחד לפחות 300 ש"ח בחודש. הציגו לכיתה.', difficulty: 'אתגרי', points: 50 },
];

export const monopolyItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'מהו מונופול?', prompt: 'הגדירו "מונופול" — מה גורם לו להיווצר ולמה הוא בעייתי?', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'מונופול בישראל', prompt: 'ציינו שני מונופולים ידועים בשוק הישראלי ומה ההשפעה שלהם על הצרכנים.', difficulty: 'קל', points: 15 },
  { id: 'q3', kind: 'question', title: 'אנטי-מונופול', prompt: 'מהו "חוק ההגבלים העסקיים" ומה תפקיד רשות התחרות בישראל?', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'מחיר מונופוליסטי', prompt: 'מדוע חברה מונופוליסטית יכולה לגבות מחירים גבוהים יותר מחברה בשוק תחרותי?', difficulty: 'בינוני', points: 20 },
  { id: 'q5', kind: 'question', title: 'מיזוגים ורכישות', prompt: 'מדוע רשויות ממשלתיות עוצרות לפעמים מיזוגים של חברות גדולות?', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'ריכוזיות מזון', prompt: 'כיצד התרכזות שוק המזון בידי כמה חברות גדולות משפיעה על מחירי הסופרמרקט?', difficulty: 'בינוני', points: 25 },
  { id: 'q7', kind: 'question', title: 'הסדר כובל', prompt: 'מהו "הסדר כובל"? מדוע קנוניה בין חברות מתחרות אסורה?', difficulty: 'אתגרי', points: 35 },
  { id: 'q8', kind: 'question', title: 'מונופול טכנולוגי', prompt: 'האם גוגל, אמזון ומטא הן מונופולים? מה טוען להגנתן ומה נגדן?', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'תחרות ומחיר', prompt: 'כיצד כניסת מתחרה חדש לשוק צפויה להשפיע על המחיר שהצרכן משלם?', difficulty: 'קל', points: 10 },
  { id: 'q10', kind: 'question', title: 'מה כצרכן?', prompt: 'כצרכנים — איזה כוח יש לנו מול מונופולים? ציינו שתי אפשרויות פעולה.', difficulty: 'בינוני', points: 20 },
  { id: 't1', kind: 'task', title: 'מפת ריכוזיות', prompt: 'מפרטים את שוק הסלולר בישראל: כמה חברות? מה נתח השוק? מי נכנס ומה השפיע?', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'גוגל לעומת בינג', prompt: 'האם לגוגל יש מונופול על חיפוש? בדקו נתוני שוק ונסחו עמדה. דיון קבוצתי.', difficulty: 'אתגרי', points: 45 },
  { id: 't3', kind: 'task', title: 'כוח הצרכן', prompt: 'חשבו על חרם צרכנים בישראל שהצליח. מה קרה? מה למדנו?', difficulty: 'בינוני', points: 25 },
  { id: 't4', kind: 'task', title: 'תמחור מונופול', prompt: 'ספקית מים היא מונופול. האם מוצדק שהיא תתומחר? כיצד הממשלה צריכה לפקח?', difficulty: 'אתגרי', points: 50 },
  { id: 't5', kind: 'task', title: 'שוק תחרותי', prompt: 'תנו דוגמה לשוק תחרותי ולשוק מרוכז בישראל. מה ההשפעה על הצרכן בכל אחד?', difficulty: 'קל', points: 15 },
];

export const consumerItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'זכויות הצרכן', prompt: 'ציינו שלוש זכויות בסיסיות של הצרכן בישראל על פי חוק.', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'ביטול עסקה', prompt: 'מה הזכות לביטול עסקה בחוק הגנת הצרכן? תוך כמה ימים ובאיזה תנאים?', difficulty: 'בינוני', points: 25 },
  { id: 'q3', kind: 'question', title: 'תאגיד שיווק', prompt: 'מהי "תאגידי שיווק רב-שלבי" (פירמידה)? מה הסכנות להצטרפות?', difficulty: 'אתגרי', points: 40 },
  { id: 'q4', kind: 'question', title: 'פרסום מטעה', prompt: 'מהו פרסום מטעה? ציינו דוגמה ומה ניתן לעשות במצב כזה.', difficulty: 'בינוני', points: 20 },
  { id: 'q5', kind: 'question', title: 'האותיות הקטנות', prompt: 'מדוע חשוב לקרוא "האותיות הקטנות" בחוזה? מה עלול להסתתר שם?', difficulty: 'קל', points: 15 },
  { id: 'q6', kind: 'question', title: 'ספגטי השוק', prompt: '"סייל" של 50% הנחה — סוף מוצר שמחירו הוכפל שבוע קודם. האם זה חוקי?', difficulty: 'בינוני', points: 20 },
  { id: 'q7', kind: 'question', title: 'מהו הגנת הפרטיות?', prompt: 'כיצד חברות אוספות את המידע שלנו ומשתמשות בו לפרסום ממוקד?', difficulty: 'בינוני', points: 20 },
  { id: 'q8', kind: 'question', title: 'ביקורות ורייטינג', prompt: 'מדוע אסור לסמוך באופן עיוור על ביקורות ברשת? מהן "ביקורות מזויפות"?', difficulty: 'קל', points: 10 },
  { id: 'q9', kind: 'question', title: 'אחריות על מוצר', prompt: 'מה הזכות לאחריות על מוצר? מה אורך האחריות המינימלי לפי חוק?', difficulty: 'בינוני', points: 20 },
  { id: 'q10', kind: 'question', title: 'הגשת תלונה', prompt: 'כיצד מגישים תלונה על עסק לרשות להגנת הצרכן? ציינו שלושה שלבים.', difficulty: 'בינוני', points: 25 },
  { id: 't1', kind: 'task', title: 'ניתוח פרסומת', prompt: 'בחרו פרסומת ידועה. זהו: מה היא מבטיחה? האם ניתן למדוד? מה חסר?', difficulty: 'בינוני', points: 25 },
  { id: 't2', kind: 'task', title: 'מסע קנייה מודע', prompt: 'תכננו קנייה של פריט ביקשת. רשמו 5 שלבים של "קנייה חכמה" לפני שמוציאים כסף.', difficulty: 'קל', points: 15 },
  { id: 't3', kind: 'task', title: 'תלונת צרכן', prompt: 'כתבו מכתב תלונה לחברה על מוצר שלא עמד בהבטחה. כללו: עובדות, דרישה, מועד.', difficulty: 'אתגרי', points: 45 },
  { id: 't4', kind: 'task', title: 'חוזה fine print', prompt: 'קחו חוזה שירות לדוגמה (ספוטיפיי, אפל...). מצאו 3 סעיפים "מפתיעים" שרוב האנשים לא מבחינים בהם.', difficulty: 'אתגרי', points: 50 },
  { id: 't5', kind: 'task', title: 'השוואת מחירים', prompt: 'בחרו מוצר ספציפי. השוו מחיר ב-3 חנויות שונות. מה ההפרש? מה השיקולים נוספים?', difficulty: 'בינוני', points: 30 },
];

export const relationshipsItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'כסף וזוגיות', prompt: 'כיצד הבדלים בגישה לכסף בין בני זוג עלולים להוביל לקונפליקט? תנו דוגמה.', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'שיחות כסף', prompt: 'מדוע קשה לאנשים לדבר על כסף? ציינו שלושה חסמים נפשיים-חברתיים.', difficulty: 'בינוני', points: 20 },
  { id: 'q3', kind: 'question', title: 'חשבון משותף', prompt: 'מה היתרונות והחסרונות של חשבון בנק משותף לבני זוג?', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'הלוואה מחבר', prompt: 'מה הסכנות בהלוואת כסף לחברים? כיצד ניתן להגן על הקשר?', difficulty: 'קל', points: 15 },
  { id: 'q5', kind: 'question', title: 'כוח ושליטה', prompt: 'כיצד יכול כסף לשמש ככלי שליטה ביחסים? מה הסימנים לכך?', difficulty: 'אתגרי', points: 40 },
  { id: 'q6', kind: 'question', title: 'שוויון בתשלומים', prompt: 'כשחוגגים בקבוצה — לפצל שווה, לפי מה שאכל כל אחד, או לפי הכנסה? מה נכון?', difficulty: 'בינוני', points: 20 },
  { id: 'q7', kind: 'question', title: 'גירושין וממון', prompt: 'מה קורה לרכוש המשותף בגירושין? מה חשוב לדעת לפני נישואין?', difficulty: 'אתגרי', points: 35 },
  { id: 'q8', kind: 'question', title: 'הסכם ממון', prompt: 'מהו "הסכם ממון קדם-נישואין"? מדוע הוא נחשב שנוי במחלוקת?', difficulty: 'בינוני', points: 25 },
  { id: 'q9', kind: 'question', title: 'מתנות וציפיות', prompt: 'כיצד מתנות יקרות יכולות ליצור ציפיות ואי-שוויון ביחסים? תנו דוגמה.', difficulty: 'בינוני', points: 20 },
  { id: 'q10', kind: 'question', title: 'שיחה בריאה על כסף', prompt: 'ציינו שלושה עקרונות לשיחה בריאה ופתוחה על כסף עם בן/בת זוג.', difficulty: 'קל', points: 10 },
  { id: 't1', kind: 'task', title: 'אוי מה אנחנו מסכימים?', prompt: 'בצמדים: כל אחד כותב 3 "כללים" שלו לכסף. השוו — היכן הפערים הגדולים?', difficulty: 'בינוני', points: 25 },
  { id: 't2', kind: 'task', title: 'תרחיש ויכוח', prompt: 'אחד מבני הזוג רוצה לחסוך לדירה, השני רוצה לנסוע בתרמיל. מה עושים? פתרו יחד.', difficulty: 'בינוני', points: 30 },
  { id: 't3', kind: 'task', title: 'הלוואה לחבר', prompt: 'חבר טוב מבקש ממכם 1,500 ש"ח "לשבועיים". מה עושים? מנה שיקולים ותגיבו.', difficulty: 'קל', points: 15 },
  { id: 't4', kind: 'task', title: 'תקציב זוגי', prompt: 'שני בני זוג, כל אחד מרוויח שונה. כיצד מחלקים הוצאות המשותפות בצורה שנחשבת הוגנת?', difficulty: 'אתגרי', points: 45 },
  { id: 't5', kind: 'task', title: 'שיח פתוח', prompt: 'כתבו 5 שאלות שכדאי לשאול שותף עתידי לחיים בנוגע לכסף לפני שמתחייבים ברצינות.', difficulty: 'אתגרי', points: 50 },
];

export const earnItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'מקורות הכנסה', prompt: 'ציינו שלושה מקורות הכנסה שונים מלבד משרה שכירה מלאה.', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'פרילנס', prompt: 'מהו פרילנס? מה היתרונות והחסרונות לעומת עבודה שכירה?', difficulty: 'קל', points: 15 },
  { id: 'q3', kind: 'question', title: 'תמחור שירות', prompt: 'כיצד מתמחרים שירות שאתם מציעים? ציינו 3 שיקולים מרכזיים.', difficulty: 'בינוני', points: 20 },
  { id: 'q4', kind: 'question', title: 'לקוח ראשון', prompt: 'מה האתגר בהשגת הלקוח הראשון? ציינו שתי אסטרטגיות להתחיל.', difficulty: 'בינוני', points: 25 },
  { id: 'q5', kind: 'question', title: 'גיג אקונומי', prompt: 'מהי "גיג אקונומי"? תנו שתי דוגמאות ישראליות למשרות גיג.', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'מיומנות שווה כסף', prompt: 'כיצד הופכים תחביב או מיומנות למקור הכנסה? תנו דוגמה מעשית.', difficulty: 'קל', points: 10 },
  { id: 'q7', kind: 'question', title: 'הכנסה פסיבית', prompt: 'מהי "הכנסה פסיבית"? ציינו שתי דרכים ריאליסטיות ליצור הכנסה פסיבית.', difficulty: 'אתגרי', points: 35 },
  { id: 'q8', kind: 'question', title: 'ניהול הכנסה עצמאית', prompt: 'כיצד מנהלים כסף כשההכנסה לא קבועה מחודש לחודש?', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'קורות חיים', prompt: 'מהם שלושת המרכיבים החשובים ביותר בקורות חיים שמקבל עבודה ראשונה?', difficulty: 'בינוני', points: 20 },
  { id: 'q10', kind: 'question', title: 'משא ומתן על שכר', prompt: 'מדוע חשוב לנהל משא ומתן על שכר? מה הסיכון ומה הפוטנציאל?', difficulty: 'בינוני', points: 25 },
  { id: 't1', kind: 'task', title: 'זיהוי מיומנויות', prompt: 'כל אחד רושם 3 מיומנויות שלו שמישהו אחר עשוי לשלם עבורן. כמה תגבו לשעה?', difficulty: 'קל', points: 15 },
  { id: 't2', kind: 'task', title: 'תמחור שירות', prompt: 'בחרו שירות (שיעורים פרטיים, עיצוב, צילום). תמחרו מחיר לשעה ולפרויקט שלם.', difficulty: 'בינוני', points: 25 },
  { id: 't3', kind: 'task', title: 'פרופיל פרילנס', prompt: 'כתבו תיאור קצר של עצמכם כפרילנסרים: מה אתם מציעים, לאיזה לקוח, ואיך ניצור קשר.', difficulty: 'בינוני', points: 30 },
  { id: 't4', kind: 'task', title: 'מציאת לקוח ראשון', prompt: 'רשמו 5 צעדים קונקרטיים שתשקיעו כדי למצוא את הלקוח הראשון לשירות שלכם.', difficulty: 'אתגרי', points: 45 },
  { id: 't5', kind: 'task', title: 'הכנסה פסיבית', prompt: 'תכננו מקור הכנסה פסיבית ריאלי: מה המוצר/נכס? כמה כסף/זמן להשקיע בהתחלה? מה הצפי?', difficulty: 'אתגרי', points: 50 },
];

export const timeItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'זמן=כסף', prompt: 'הסבירו את המשפט "זמן הוא כסף" — מה הוא מסמל מבחינה כלכלית?', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'עלות שעתית', prompt: 'כיצד מחשבים "עלות שעה" של אדם מהשכר שלו? נסחו נוסחה פשוטה.', difficulty: 'בינוני', points: 20 },
  { id: 'q3', kind: 'question', title: 'השקעה בזמן', prompt: 'ציינו שתי דרכים שבהן השקעת זמן היום תניב ערך כלכלי בעתיד.', difficulty: 'בינוני', points: 20 },
  { id: 'q4', kind: 'question', title: 'דחיינות ועלות', prompt: 'מה עלות הדחיינות? תנו דוגמה (כגון: דחיית תשלום, דחיית לימוד) ומה ההשלכה הכלכלית.', difficulty: 'בינוני', points: 25 },
  { id: 'q5', kind: 'question', title: 'עדיפות משימות', prompt: 'מהי מטריצת אייזנהאואר? כיצד היא עוזרת בניהול זמן וקבלת החלטות?', difficulty: 'אתגרי', points: 35 },
  { id: 'q6', kind: 'question', title: 'Outsource', prompt: 'מתי כדאי לשלם למישהו אחר לעשות משהו שאתם יכולים לעשות בעצמכם? תנו דוגמה.', difficulty: 'בינוני', points: 25 },
  { id: 'q7', kind: 'question', title: 'זמן פנוי ופרודוקטיביות', prompt: 'האם יותר זמן עבודה תמיד מביא לתוצאות טובות יותר? מה המחקרים אומרים?', difficulty: 'אתגרי', points: 40 },
  { id: 'q8', kind: 'question', title: 'כלל פארטו', prompt: 'מהו "כלל 80-20" של פארטו? כיצד הוא מיושם בניהול זמן?', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'רוטינה בוקר', prompt: 'כיצד "רוטינת בוקר" חזקה יכולה להגדיל ולשפר את הפרודוקטיביות היומית?', difficulty: 'קל', points: 10 },
  { id: 'q10', kind: 'question', title: 'הסחות דעת', prompt: 'ציינו שלושה גנבי זמן דיגיטליים וציינו בעבור כל אחד דרך מעשית להפחית אותו.', difficulty: 'בינוני', points: 20 },
  { id: 't1', kind: 'task', title: 'מחיר שעתי', prompt: 'אם אתם רוצים להרוויח 15,000 ש"ח לחודש ועובדים 160 שעות — מה עלות שעה שלכם?', difficulty: 'קל', points: 15 },
  { id: 't2', kind: 'task', title: 'מטריצת עדיפויות', prompt: 'רשמו 8 משימות שיש לכם השבוע. מיינו לפי מטריצת אייזנהאואר: דחוף/חשוב.', difficulty: 'בינוני', points: 25 },
  { id: 't3', kind: 'task', title: 'ניתוח שבוע', prompt: 'כמה שעות ביום אתם מבלים בסושיאל מדיה בממוצע? חשבו את הסכום השנתי. מה אפשר לעשות עם הזמן הזה?', difficulty: 'בינוני', points: 30 },
  { id: 't4', kind: 'task', title: 'Outsource', prompt: 'רשמו 3 משימות שאתם דוחים. חשבו: האם כדאי לשלם למישהו לעשות אותן? מה העלות-תועלת?', difficulty: 'אתגרי', points: 45 },
  { id: 't5', kind: 'task', title: 'תכנית שבועית', prompt: 'עצבו לוח זמנים שבועי אידיאלי שמאזן: עבודה/לימוד, מנוחה, חברה, ספורט, פיתוח עצמי.', difficulty: 'אתגרי', points: 50 },
];

export const publicSpeakingItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'פחד מבמה', prompt: 'מדוע פחד מבמה הוא מהפחדים הנפוצים ביותר? מה קורה בגוף כשאנחנו מפחדים?', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'שפת גוף', prompt: 'ציינו שלושה אלמנטים של שפת גוף שמשדרים ביטחון בעמידה מול קהל.', difficulty: 'קל', points: 15 },
  { id: 'q3', kind: 'question', title: 'עיקרון הפיץ\'', prompt: 'מהו "elevator pitch"? כמה זמן הוא אמור להימשך ומה עליו לכלול?', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'מבנה הרצאה', prompt: 'מהו מבנה ה-(פתיחה-גוף-סיכום) ולמה הוא קריטי להצגה מוצלחת?', difficulty: 'בינוני', points: 20 },
  { id: 'q5', kind: 'question', title: 'קשר עם קהל', prompt: 'כיצד ניצור קשר עין עם קהל גדול? ציינו טכניקה מעשית.', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'טיפול בשאלות', prompt: 'מה הדרך הנכונה לטפל בשאלה שאינכם יודעים את התשובה עליה בפני קהל?', difficulty: 'בינוני', points: 25 },
  { id: 'q7', kind: 'question', title: 'סיפור כלי שיווקי', prompt: 'מדוע "סטוריטלינג" אפקטיבי יותר מהצגת נתונים יבשים? מה הוא מפעיל במוח?', difficulty: 'אתגרי', points: 35 },
  { id: 'q8', kind: 'question', title: 'חזרות', prompt: 'כמה פעמים ואיך כדאי להתאמן לפני הצגה חשובה? ציינו שיטה.', difficulty: 'קל', points: 10 },
  { id: 'q9', kind: 'question', title: 'קול וטמפו', prompt: 'מדוע דיבור לאט ושינויי טון חשובים יותר ממה שרוב האנשים חושבים?', difficulty: 'בינוני', points: 20 },
  { id: 'q10', kind: 'question', title: 'פיץ\' מכירות', prompt: 'מה ההבדל בין הצגת מוצר ל"פיץ\' מכירות"? מה ייחודי בפיץ\'?', difficulty: 'אתגרי', points: 40 },
  { id: 't1', kind: 'task', title: 'פיץ\' של 60 שניות', prompt: 'כל אחד מכין ומציג "elevator pitch" של 60 שניות על רעיון עסקי. הכיתה נותנת משוב.', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'שיפור שפת גוף', prompt: 'עמדו מול השותף שלכם ודברו 30 שניות עם ידיים בכיסים ואחר כך 30 שניות עם שפת גוף פתוחה. מה הבדל?', difficulty: 'קל', points: 15 },
  { id: 't3', kind: 'task', title: 'ניהול שאלות', prompt: 'אחד מציג ואחד מקשה שאלות קשות ובלתי צפויות. כיצד מתמודדים? הציגו לכיתה.', difficulty: 'אתגרי', points: 45 },
  { id: 't4', kind: 'task', title: 'סטוריטלינג', prompt: 'ספרו על דמות בדיונית שנתקלה בבעיה כלכלית ופתרה אותה — הפכו את הסיפור לשיעור.', difficulty: 'בינוני', points: 25 },
  { id: 't5', kind: 'task', title: 'הצגת מוצר', prompt: 'בחרו מוצר שמוכר לכם. הכינו הצגת 2 דקות שמשכנעת מישהו לקנות אותו. הציגו לכיתה.', difficulty: 'אתגרי', points: 50 },
];

export const businessItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'רעיון עסקי', prompt: 'מהו "צומת" שבו נמצא העסק הטוב — בין מה שאתם אוהבים, מה שאתם טובים בו, ומה שהשוק צריך?', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'MVP', prompt: 'מהו MVP (מוצר בסיסי ומינימלי)? מדוע הוא אסטרטגיה חכמה להתחלת עסק?', difficulty: 'בינוני', points: 25 },
  { id: 'q3', kind: 'question', title: 'קהל יעד', prompt: 'מדוע חשוב להגדיר קהל יעד ספציפי? מה הסכנה של "מוצר לכולם"?', difficulty: 'בינוני', points: 20 },
  { id: 'q4', kind: 'question', title: 'הצעת ערך', prompt: 'מהי "הצעת ערך ייחודית" (unique value proposition)? בנו אחת לעסק (דמיוני) שלכם.', difficulty: 'בינוני', points: 25 },
  { id: 'q5', kind: 'question', title: 'תזרים מזומנים', prompt: 'מדוע עסק יכול להיות רווחי "על הנייר" ועדיין לפשוט רגל? מה זה תזרים מזומנים?', difficulty: 'אתגרי', points: 40 },
  { id: 'q6', kind: 'question', title: 'שיווק דיגיטלי', prompt: 'ציינו שלוש אסטרטגיות שיווק דיגיטלי שעסק קטן יכול להשתמש בהן בתקציב נמוך.', difficulty: 'בינוני', points: 20 },
  { id: 'q7', kind: 'question', title: 'תמחור', prompt: 'מהן שתי שיטות תמחור עיקריות? מה היתרון של כל אחת?', difficulty: 'בינוני', points: 20 },
  { id: 'q8', kind: 'question', title: 'כשל עסקי', prompt: 'מהן שלוש סיבות נפוצות לכישלון עסקי בשנתיים הראשונות?', difficulty: 'קל', points: 15 },
  { id: 'q9', kind: 'question', title: 'SWOT', prompt: 'הסבירו את ניתוח SWOT: חוזקות, חולשות, הזדמנויות, איומים — ויישמו על עסק שמוכר לכם.', difficulty: 'אתגרי', points: 40 },
  { id: 'q10', kind: 'question', title: 'שותפות עסקית', prompt: 'מה חשוב להסדיר בין שותפים עסקיים לפני פתיחת עסק? ציינו שלושה דברים.', difficulty: 'בינוני', points: 20 },
  { id: 't1', kind: 'task', title: 'העסק שלי', prompt: 'חשבו על רעיון עסקי. הציגו: שם, מוצר/שירות, קהל יעד, מחיר, ואיך מרוויחים. 2 דקות.', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'SWOT', prompt: 'בחרו עסק קיים קטן בסביבתכם. נתחו אותו לפי SWOT — הציגו את הממצאים.', difficulty: 'אתגרי', points: 45 },
  { id: 't3', kind: 'task', title: 'MVP סימולציה', prompt: 'רעיון: שירות "ניקוי אופניים בשכונה". תכננו MVP: מה הכי מינימלי שאפשר לבדוק? כמה עולה?', difficulty: 'בינוני', points: 25 },
  { id: 't4', kind: 'task', title: 'פיץ\' לשקיעה', prompt: 'הציגו את הרעיון העסקי שלכם ב-90 שניות לפני "משקיע". הכיתה מחליטה: להשקיע או לא?', difficulty: 'אתגרי', points: 50 },
  { id: 't5', kind: 'task', title: 'תזרים ראשון', prompt: 'עסק חדש: הכנסות צפויות 10,000 ש"ח לחודש, הוצאות קבועות 6,000 ש"ח. מה נטו? מה קורה בחודש הראשון שאין לקוחות?', difficulty: 'אתגרי', points: 40 },
];

// ─── רב תחומי mixed banks ──────────────────────────────────────────────────

export const mahBakisMixedItems: ParcelItem[] = [
  { id: 'mb_q1', kind: 'question', title: 'סיפורו של כסף', prompt: 'מהם שלושת התפקידים הקלאסיים של כסף: אמצעי חליפין, יחידת חשבון, מאגר ערך — הסבירו כל אחד.', difficulty: 'קל', points: 15 },
  { id: 'mb_q2', kind: 'question', title: 'הכסף ואני', prompt: 'מהו ההבדל בין "צורך" ל"רצון"? תנו דוגמה לכל אחד מחייכם.', difficulty: 'קל', points: 10 },
  { id: 'mb_q3', kind: 'question', title: 'כמה זה עולה לי?', prompt: 'מהי "עלות כוללת" (TCO) של מוצר? מדוע היא גבוהה ממחיר הקנייה?', difficulty: 'בינוני', points: 20 },
  { id: 'mb_q4', kind: 'question', title: 'מונופולים בישראל', prompt: 'מהו מונופול? כיצד הוא משפיע על המחיר ועל הצרכן?', difficulty: 'קל', points: 10 },
  { id: 'mb_q5', kind: 'question', title: 'צרכנות נבונה', prompt: 'ציינו שלושה טיפים לצרכן חכם לפני רכישה גדולה.', difficulty: 'קל', points: 15 },
  { id: 'mb_q6', kind: 'question', title: 'מערכות יחסים וכסף', prompt: 'מהי דרך בריאה לדון על כסף עם בן/בת זוג או חבר קרוב? מה חשוב לסכם מראש?', difficulty: 'בינוני', points: 20 },
  { id: 'mb_q7', kind: 'question', title: 'איך להרוויח כסף?', prompt: 'ציינו שלוש דרכים שנוער יכול להרוויח כסף ראשון בצורה בטוחה וחוקית.', difficulty: 'קל', points: 10 },
  { id: 'mb_q8', kind: 'question', title: 'ניהול זמן (זמן=כסף)', prompt: 'מהו חוק 80/20? כיצד הוא מסייע בניהול זמן ובהגדלת הכנסה?', difficulty: 'בינוני', points: 20 },
  { id: 'mb_q9', kind: 'question', title: 'עמידה מול קהל', prompt: 'מהם שלושת האלמנטים של הצגה מוצלחת — פתיחה, גוף, סגירה? מה תפקיד כל אחד?', difficulty: 'קל', points: 10 },
  { id: 'mb_q10', kind: 'question', title: 'איך בונים עסק?', prompt: 'מהו MVP (מוצר בסיסי ומינימלי) ומדוע הוא חכם לבדיקת רעיון עסקי?', difficulty: 'בינוני', points: 25 },
  { id: 'mb_q11', kind: 'question', title: 'כלכלת מידע', prompt: 'כיצד פרסומות משתמשות ב"מחיר עוגן" כדי לגרום לנו לחשוב שמבצע הוא טוב?', difficulty: 'בינוני', points: 20 },
  { id: 'mb_q12', kind: 'question', title: 'כסף דיגיטלי', prompt: 'מה ההבדל בין כרטיס חיוב מיידי לכרטיס אשראי? מה הסיכון בכל אחד?', difficulty: 'בינוני', points: 20 },
  { id: 'mb_t1', kind: 'task', title: 'ממציאים עסק', prompt: 'תוך 2 דקות: בחרו שירות שנוער יכול לתת, קבעו מחיר, ואמרו לאיזה קהל יעד הוא מיועד.', difficulty: 'בינוני', points: 30 },
  { id: 'mb_t2', kind: 'task', title: 'צורך או רצון?', prompt: 'רשמו 10 רכישות אחרונות שביצעתם. מיינו: כמה היו צרכים? כמה רצונות? מה המסקנה?', difficulty: 'קל', points: 15 },
  { id: 'mb_t3', kind: 'task', title: 'שכנוע הקהל', prompt: 'בחרו מוצר ופרסמו אותו ב-30 שניות. הכיתה מדרגת: האם קניתם? ולמה?', difficulty: 'בינוני', points: 25 },
  { id: 'mb_t4', kind: 'task', title: 'תכנון גיג', prompt: 'תכננו גיג: מה השירות, כמה שעות, כמה לגבות, וכיצד מוצאים לקוח ראשון.', difficulty: 'אתגרי', points: 40 },
  { id: 'mb_t5', kind: 'task', title: 'מונופול בחיים', prompt: 'מצאו דוגמה לחברה ישראלית בעלת כוח שוק גדול. מה ההשפעה שלה על הצרכן ועל המחיר?', difficulty: 'אתגרי', points: 40 },
];

export const salaryDeductionItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'ברוטו מול נטו', prompt: 'מהו ההבדל בין שכר ברוטו לשכר נטו? למה הם תמיד שונים?', difficulty: 'קל', points: 10 },
  { id: 'q2', kind: 'question', title: 'מס הכנסה', prompt: 'מהי מדרגת מס? מדוע מי שמרוויח יותר משלם אחוז גבוה יותר ממשכורתו?', difficulty: 'בינוני', points: 25 },
  { id: 'q3', kind: 'question', title: 'ביטוח לאומי', prompt: 'מה תפקיד ביטוח לאומי? ציינו שני שירותים שממומנים על ידו.', difficulty: 'קל', points: 15 },
  { id: 'q4', kind: 'question', title: 'נקודות זיכוי', prompt: 'מהי "נקודת זיכוי" ואיך היא מפחיתה את המס שמשלמים?', difficulty: 'בינוני', points: 20 },
  { id: 'q5', kind: 'question', title: 'ניכוי פנסיה', prompt: 'מדוע ניכוי פנסיה מופיע בתלוש כ"הוצאה" אבל בעצם הוא חיסכון לטובתכם?', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'תאריך קבלת שכר', prompt: 'מה החוק אומר על מועד תשלום שכר? מה קורה אם המעסיק מאחר?', difficulty: 'קל', points: 10 },
  { id: 'q7', kind: 'question', title: 'שעות נוספות', prompt: 'כיצד שעות נוספות אמורות להיראות בתלוש שכר? מה הפרשי השכר?', difficulty: 'בינוני', points: 25 },
  { id: 'q8', kind: 'question', title: 'ניכויים חובה מול רשות', prompt: 'ציינו שני ניכויים שהמעסיק חייב לנכות ושניים שניכויים רק בהסכמה.', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'תרגיל חישוב נטו', prompt: 'אם ברוטו 10,000 ש"ח ו-28% ניכויים — כמה נטו תקבלו? כמה ש"ח הולך לניכויים?', difficulty: 'בינוני', points: 25 },
  { id: 'q10', kind: 'question', title: 'החזר מס', prompt: 'מהו "החזר מס"? מי זכאי לו ואיך מגישים בקשה?', difficulty: 'אתגרי', points: 40 },
  { id: 't1', kind: 'task', title: 'פענוח תלוש', prompt: 'חלקו תלוש שכר לדוגמה. זהו יחד: ברוטו, נטו, כל ניכוי — ומה אחוזו מהשכר.', difficulty: 'בינוני', points: 30 },
  { id: 't2', kind: 'task', title: 'הסבר לחבר', prompt: 'הסבירו לחבר שמקבל משכורת ראשונה: למה הנטו נמוך יותר מהברוטו שסוכם בחוזה?', difficulty: 'קל', points: 15 },
  { id: 't3', kind: 'task', title: 'חישוב נטו', prompt: 'ברוטו 7,500 ש"ח. ניכויים: מס הכנסה 12%, ביטוח לאומי 5.5%, פנסיה 6%. חשבו את הנטו.', difficulty: 'אתגרי', points: 50 },
  { id: 't4', kind: 'task', title: 'שגיאות בתלוש', prompt: 'מצאו 3 דברים שיכולים להיות שגויים בתלוש שכר ואיך בודקים/מתמודדים עם כל אחד.', difficulty: 'בינוני', points: 25 },
  { id: 't5', kind: 'task', title: 'תוכנית פנסיה', prompt: 'אם מתחילים לחסוך לפנסיה ב-25 לעומת ב-35, מה ההפרש הצפוי בגיל 67? הסבירו את ההיגיון.', difficulty: 'אתגרי', points: 40 },
];

export const chachamBakisMixedItems: ParcelItem[] = [
  { id: 'cb_q1', kind: 'question', title: 'ניהול תקציב', prompt: 'מהו כלל 50-30-20? הסבירו מה כל קטגוריה מכסה ותנו דוגמה מחיי יומיום.', difficulty: 'קל', points: 15 },
  { id: 'cb_q2', kind: 'question', title: 'הוצאות', prompt: 'מהי "עלות הזדמנות"? כיצד כל שקל שמוציאים מוותר על שימוש אחר?', difficulty: 'בינוני', points: 20 },
  { id: 'cb_q3', kind: 'question', title: 'הסכנה שבמינוס', prompt: 'מדוע מינוס בבנק נחשב "אשראי יקר"? מה ריבית דריבית עושה לחוב?', difficulty: 'קל', points: 10 },
  { id: 'cb_q4', kind: 'question', title: 'זכויות עובדים', prompt: 'ציינו שלוש זכויות בסיסיות שכל עובד שכיר זכאי להן בחוק הישראלי.', difficulty: 'קל', points: 15 },
  { id: 'cb_q5', kind: 'question', title: 'תלוש שכר', prompt: 'מהו ההבדל בין ברוטו לנטו? ציינו שני ניכויים שמופיעים בכל תלוש שכר.', difficulty: 'קל', points: 10 },
  { id: 'cb_q6', kind: 'question', title: 'שכירים ועצמאיים', prompt: 'ציינו שלושה הבדלים בין עובד שכיר לעצמאי מבחינת חובות ויתרונות.', difficulty: 'בינוני', points: 20 },
  { id: 'cb_q7', kind: 'question', title: 'חיסכון והשקעות', prompt: 'מהי ריבית דריבית ומדוע כדאי להתחיל לחסוך מוקדם ככל האפשר?', difficulty: 'בינוני', points: 25 },
  { id: 'cb_q8', kind: 'question', title: 'הסכנה שבמינוס', prompt: 'ציינו שתי דרכים מעשיות לצאת ממינוס מבלי לקחת הלוואה חדשה.', difficulty: 'בינוני', points: 20 },
  { id: 'cb_q9', kind: 'question', title: 'זכויות עובדים', prompt: 'מה לעשות אם מעסיק לא שילם שכר בזמן? ציינו שלושה צעדים חוקיים.', difficulty: 'בינוני', points: 25 },
  { id: 'cb_q10', kind: 'question', title: 'חיסכון והשקעות', prompt: 'מהי "קרן חירום"? כמה חודשי הוצאות מומלץ שתכסה ואיפה לשמור אותה?', difficulty: 'קל', points: 10 },
  { id: 'cb_q11', kind: 'question', title: 'פנסיה', prompt: 'מדוע חשוב לבדוק שמעסיק מפריש לפנסיה? מה ההשלכה של אי-הפרשה?', difficulty: 'בינוני', points: 20 },
  { id: 'cb_q12', kind: 'question', title: 'שכירים ועצמאיים', prompt: 'מהן "הוצאות מוכרות לצרכי מס" לעצמאי? תנו שתי דוגמאות.', difficulty: 'בינוני', points: 20 },
  { id: 'cb_t1', kind: 'task', title: 'תקציב אישי', prompt: 'מדמים הכנסה של 4,000 ש"ח: חלקו את הכסף לפי כלל 50-30-20. אילו הוצאות נכנסות לכל קטגוריה?', difficulty: 'בינוני', points: 30 },
  { id: 'cb_t2', kind: 'task', title: 'עלות מינוס', prompt: 'מינוס של 3,000 ש"ח בריבית שנתית 12%. חשבו: כמה ריבית משלמים בחודש? כמה בשנה?', difficulty: 'בינוני', points: 25 },
  { id: 'cb_t3', kind: 'task', title: 'קריאת תלוש', prompt: 'ברוטו 8,000 ש"ח. ניכויים: מס 15%, ביטוח לאומי 5.5%, פנסיה 6%. חשבו נטו שלב אחר שלב.', difficulty: 'אתגרי', points: 45 },
  { id: 'cb_t4', kind: 'task', title: 'שכיר מול עצמאי', prompt: 'הכנסה ברוטו 10,000 ש"ח: מחשבים מה נשאר לשכיר לעומת עצמאי (אחרי מס, ביטוח, הוצאות). מי מרוויח יותר?', difficulty: 'אתגרי', points: 50 },
  { id: 'cb_t5', kind: 'task', title: 'כוח החיסכון', prompt: 'חוסכים 300 ש"ח בחודש בריבית 5% לשנה — כמה יצטבר אחרי 10 שנים? חשבו ובדקו את כוח הריבית דריבית.', difficulty: 'בינוני', points: 30 },
];
