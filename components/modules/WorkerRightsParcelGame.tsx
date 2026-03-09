import React, { useEffect, useRef, useState } from 'react';

interface ParcelItem {
  id: string;
  kind: 'question' | 'task';
  title: string;
  prompt: string;
  difficulty: 'קל' | 'בינוני' | 'אתגרי';
  points: number;
}

const difficultyConfig: Record<ParcelItem['difficulty'], { badge: string; icon: string; bar: string }> = {
  'קל':     { badge: 'bg-emerald-400 text-white shadow-emerald-200',   icon: '⭐',   bar: 'bg-emerald-400' },
  'בינוני': { badge: 'bg-amber-400 text-white shadow-amber-200',       icon: '⭐⭐', bar: 'bg-amber-400' },
  'אתגרי':  { badge: 'bg-rose-500 text-white shadow-rose-200',         icon: '🔥',   bar: 'bg-rose-500' },
};

const workerRightsItems: ParcelItem[] = [
  { id: 'q1', kind: 'question', title: 'שכר מינימום', prompt: 'מהו שכר המינימום לנוער/בוגרים כיום ומה קורה אם השכר בתלוש נמוך ממנו?', difficulty: 'בינוני', points: 20 },
  { id: 'q2', kind: 'question', title: 'הודעה מוקדמת', prompt: 'כמה זמן הודעה מוקדמת חייב עובד לקבל לאחר שנת עבודה אחת לפני סיום העסקה?', difficulty: 'בינוני', points: 25 },
  { id: 'q3', kind: 'question', title: 'שעות נוספות', prompt: 'מה שיעור התשלום לשעתיים ראשונות נוספות ומה החל מהשעה השלישית?', difficulty: 'בינוני', points: 25 },
  { id: 'q4', kind: 'question', title: 'הפסקות', prompt: 'ביום עבודה של 9 שעות: כמה זמן הפסקה חובה וכמה ממנה חייב להיות רצוף?', difficulty: 'קל', points: 10 },
  { id: 'q5', kind: 'question', title: 'ימי מחלה', prompt: 'איך מחושב תשלום עבור ימי מחלה ראשון, שני-שלישי ומהיום הרביעי?', difficulty: 'בינוני', points: 20 },
  { id: 'q6', kind: 'question', title: 'החזר נסיעות', prompt: 'האם המעסיק חייב להשתתף בנסיעות וכיצד מחשבים זאת?', difficulty: 'קל', points: 10 },
  { id: 'q7', kind: 'question', title: 'תלוש שכר', prompt: 'ציינו שלושה פרטים שחייבים להופיע בכל תלוש שכר.', difficulty: 'קל', points: 15 },
  { id: 'q8', kind: 'question', title: 'שימוע', prompt: 'אילו זכויות יש לעובד לפני/במהלך שימוע?', difficulty: 'אתגרי', points: 40 },
  { id: 'q9', kind: 'question', title: 'דמי חופשה והבראה', prompt: 'כמה ימי חופשה מינימום בשנה הראשונה וכיצד מחשבים דמי הבראה?', difficulty: 'בינוני', points: 20 },
  { id: 'q10', kind: 'question', title: 'ניכויים אסורים', prompt: 'האם מותר למעסיק לנכות קנסות או ציוד ללא הסכמה בכתב?', difficulty: 'קל', points: 10 },
  { id: 't1', kind: 'task', title: 'משימת שימוע', prompt: 'בצעו משחק תפקידים: מעסיק + עובד בשימוע קצר. עלו שתי טענות של העובד ושתי תגובות של המעסיק.', difficulty: 'אתגרי', points: 50 },
  { id: 't2', kind: 'task', title: 'בדיקת תלוש', prompt: 'חלקו תלוש לדוגמה ובדקו יחד האם כל הסעיפים חובה נמצאים ומה חסר.', difficulty: 'בינוני', points: 30 },
  { id: 't3', kind: 'task', title: 'חישוב נסיעות', prompt: 'בחרו מסלול יומי לבית הספר/עבודה וחישבו כמה החזר נסיעות אמור להופיע בתלוש.', difficulty: 'בינוני', points: 25 },
  { id: 't4', kind: 'task', title: 'דוח שעות', prompt: 'צרו רישום שעות של שבוע עבודה (כולל הפסקות) ובדקו כמה שעות נוספות יש לשלם.', difficulty: 'אתגרי', points: 40 },
  { id: 't5', kind: 'task', title: 'חוזה הוגן', prompt: 'כתבו 5 סעיפים שחייבים להופיע בחוזה העסקה לנוער/צעירים כדי להגן עליהם.', difficulty: 'בינוני', points: 30 },
];

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getRandomDurationMs = () => 6000 + Math.floor(Math.random() * 8001);

// Leave empty to use procedural chiptune loop below.
const MUSIC_URL = '/havila.mp3';

const WorkerRightsParcelGame: React.FC = () => {
  const [order, setOrder] = useState<ParcelItem[]>(() => shuffle(workerRightsItems));
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
    // Option 1: external URL if provided.
    if (MUSIC_URL) {
      try {
        const audio = new Audio(MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.22;
        audioRef.current = audio;
        audio.play().catch(() => {
          // ignore autoplay errors
        });
        return;
      } catch (err) {
        // fallback to procedural loop
      }
    }

    // Option 2: simple procedural chiptune loop (random arpeggio on a bright pentatonic scale).
    try {
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800; // soften highs for less metallic feel
      const scale = [262, 294, 330, 392, 440, 494]; // C major pentatonic-ish
      osc.type = 'triangle';
      osc.frequency.value = scale[Math.floor(Math.random() * scale.length)];
      gain.gain.value = 0.06;
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      filterRef.current = filter;

      // Change pitch every ~220-320ms for a brisk, upbeat loop.
      const interval = window.setInterval(() => {
        if (!oscRef.current) return;
        const note = scale[Math.floor(Math.random() * scale.length)];
        oscRef.current.frequency.setTargetAtTime(note, ctx.currentTime, 0.01);
      }, 220 + Math.random() * 100);
      melodyIntervalRef.current = interval;
    } catch (err) {
      // If audio fails (permissions), continue without sound.
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (err) {
        // ignore
      }
      audioRef.current = null;
    }
    if (melodyIntervalRef.current) {
      window.clearInterval(melodyIntervalRef.current);
      melodyIntervalRef.current = null;
    }
    try {
      oscRef.current?.stop();
      oscRef.current?.disconnect();
      gainRef.current?.disconnect();
      filterRef.current?.disconnect();
      oscRef.current = null;
      gainRef.current = null;
      filterRef.current = null;
    } catch (err) {
      // ignore
    }
  };

  const clearTimers = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartRound = () => {
    if (isPlaying) return;
    if (index >= order.length) {
      setOrder(shuffle(workerRightsItems));
      setIndex(0);
      setCurrentItem(null);
      setAwarded(false);
      setScore(0);
    }
    setCurrentItem(null);
    setAwarded(false);
    setIsPlaying(true);
    const duration = getRandomDurationMs();
    startSound();

    timerRef.current = window.setTimeout(() => {
      stopSound();
      clearTimers();
      setIsPlaying(false);
      const nextItem = order[index];
      setCurrentItem(nextItem || null);
      setIndex(prev => prev + 1);
    }, duration);
  };

  const handleAward = () => {
    if (!currentItem || awarded) return;
    setScore(prev => prev + currentItem.points);
    setAwarded(true);
  };

  const handleAwardAndStart = () => {
    if (!currentItem) return;
    if (!awarded) {
      setScore(prev => prev + currentItem.points);
      setAwarded(true);
    }
    setCurrentItem(null);
    handleStartRound();
  };

  const handleReset = () => {
    clearTimers();
    stopSound();
    setOrder(shuffle(workerRightsItems));
    setIndex(0);
    setCurrentItem(null);
    setIsPlaying(false);
    setScore(0);
    setAwarded(false);
  };

  useEffect(() => () => {
    clearTimers();
    stopSound();
    audioCtxRef.current?.close();
  }, []);

  const itemsLeft = order.length - index;
  const finished = index >= order.length && !isPlaying && !currentItem;
  const cfg = currentItem ? difficultyConfig[currentItem.difficulty] : null;

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 35%,#4c1d95 65%,#6b21a8 100%)' }}
    >
      {/* Decorative floating circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {['top-6 left-8','top-1/3 right-6','bottom-10 left-1/4','bottom-4 right-12','top-1/2 left-1/2'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} rounded-full opacity-10 animate-ping`}
            style={{
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              background: ['#f472b6','#fb923c','#facc15','#34d399','#60a5fa'][i],
              animationDuration: `${2 + i * 0.7}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-5 space-y-5">
        {/* ─── Header bar ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-purple-300 text-sm tracking-widest uppercase font-semibold">משחק כיתתי</p>
            <h4 className="text-3xl font-extrabold text-white drop-shadow-lg">🎁 חבילה עוברת</h4>
            <p className="text-purple-200 text-sm mt-0.5">זכויות עובדים · כל סיבוב נעצר בזמן אקראי</p>
          </div>
          <div className="flex gap-3">
            {/* Cards counter */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-purple-200 text-xs font-semibold">קלפים</span>
              <span className="text-3xl font-black text-amber-300 leading-none">{itemsLeft}</span>
            </div>
            {/* Score counter */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-purple-200 text-xs font-semibold">ש"ח</span>
              <span className="text-3xl font-black text-emerald-300 leading-none">{score}</span>
            </div>
          </div>
        </div>

        {/* ─── Main arena ─── */}
        <div
          className={`relative flex flex-col items-center justify-center text-center rounded-3xl p-8 min-h-[340px] transition-all duration-500
            ${isPlaying
              ? 'bg-gradient-to-br from-fuchsia-900/70 to-violet-900/70 border-2 border-fuchsia-400/60 shadow-[0_0_40px_rgba(192,38,211,0.4)]'
              : 'bg-white/5 border border-white/10'
            }`}
        >
          {/* Spinning gift */}
          <div className="relative">
            {/* glow ring while playing */}
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
                  ? '0 0 0 6px rgba(251,146,60,0.3), 0 20px 60px rgba(244,114,182,0.5)'
                  : '0 10px 40px rgba(0,0,0,0.4)',
                animationDuration: isPlaying ? '1.2s' : '2s',
              }}
            >
              🎁
            </div>
          </div>

          {/* State messages */}
          {isPlaying ? (
            <div className="mt-6 space-y-1">
              <p className="text-2xl font-extrabold text-white tracking-wide animate-pulse">
                🎵&ensp;המוזיקה מתנגנת...&ensp;🎵
              </p>
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
            /* ─── Card reveal ─── */
            <div
              className="mt-6 w-full max-w-3xl text-right rounded-3xl p-5 shadow-2xl animate-fade-in"
              style={{
                background: 'linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(255,255,255,0.2)',
              }}
            >
              {/* Top row: badges + points */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg ${cfg!.badge}`}
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                  >
                    {cfg!.icon} {currentItem.difficulty}
                  </span>
                  <span
                    className={`text-sm font-bold px-4 py-1.5 rounded-full text-white
                      ${currentItem.kind === 'question'
                        ? 'bg-sky-500 shadow-sky-300/40'
                        : 'bg-violet-500 shadow-violet-300/40'}`}
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

              {/* Title */}
              <h5 className="text-2xl font-extrabold text-white mb-2 drop-shadow">{currentItem.title}</h5>

              {/* Prompt */}
              <p className="text-purple-100 text-lg leading-relaxed">{currentItem.prompt}</p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={awarded ? handleAwardAndStart : handleAward}
                  className="relative px-6 py-2.5 rounded-full font-extrabold text-white text-base shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: awarded
                      ? 'linear-gradient(135deg,#6366f1,#4f46e5)'
                      : 'linear-gradient(135deg,#ec4899,#db2777)',
                    boxShadow: awarded
                      ? '0 4px 20px rgba(99,102,241,0.5)'
                      : '0 4px 20px rgba(236,72,153,0.5)',
                  }}
                >
                  {awarded ? '🚀 הפעילו את החבילה' : `✅ סיימנו! קיבלנו +${currentItem.points}`}
                </button>
                <button
                  onClick={() => setCurrentItem(null)}
                  className="px-5 py-2.5 rounded-full font-bold text-white/70 border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  דלג ←
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Bottom controls ─── */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleStartRound}
            disabled={isPlaying}
            className={`relative px-8 py-3.5 rounded-full font-extrabold text-white text-lg shadow-xl transition-all duration-200
              ${isPlaying
                ? 'opacity-60 cursor-not-allowed bg-gray-600'
                : 'hover:scale-105 active:scale-95'}`}
            style={!isPlaying ? {
              background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
              boxShadow: '0 6px 24px rgba(124,58,237,0.55)',
            } : {}}
          >
            {isPlaying ? '🎵 המוזיקה פועלת...' : finished ? '🔄 סיבוב חדש' : '▶ הפעילו את החבילה'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3.5 rounded-full font-bold text-white/70 border border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95 text-base"
          >
            ♻ אפס
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerRightsParcelGame;
