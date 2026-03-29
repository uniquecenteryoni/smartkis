import React, { useCallback, useEffect, useRef, useState } from 'react';

// ─── Word Bank (pantomime-friendly financial terms) ───────────────────────────
const PANTOMIME_WORDS: string[] = [
  // פעולות פיננסיות ברורות לפנטומימה
  'לשלם', 'לקנות', 'למכור', 'לחסוך', 'להלוות', 'לגנוב', 'לספור כסף',
  'להחזיר כסף', 'לחתום על חוזה', 'לקחת הלוואה', 'לשבור קופת חיסכון',
  'למשוך כסף מכספומט', 'לעשות קניות', 'לקשר נעליים ביקר', 'לחפש מחיר',
  // עצמים ומקומות
  'ארנק', 'כסף מזומן', 'כרטיס אשראי', 'כספומט', 'קופה רושמת', 'חנות',
  'בנק', 'שוק', 'קניון', 'מכונית', 'דירה', 'תיק', 'מפתחות',
  // מצבים
  'עשיר', 'עני', 'חוב גדול', 'תור לקופה', 'מבצע', 'הנחה', 'תשלומים',
  'שכר גבוה', 'שכר נמוך', 'בונוס', 'קנס', 'פנסיה', 'ביטוח',
  // פעולות יום-יום
  'לאכול במסעדה', 'לנסוע באוטובוס', 'לשלם שכר דירה', 'לעבוד',
  'לקבל משכורת', 'לשלם חשבון', 'לחסוך בצד', 'לעשות השוואת מחירים',
  'להחזיר מוצר', 'לבדוק מחיר', 'לקחת מוצר ולשים בחזרה', 'לבחור בין שניים',
  // מצבי מצוקה/שפע
  'להיות בחובות', 'לחגוג הצלחה כלכלית', 'לפתוח חשבון בנק', 'לירכוש מכונית',
  'לחתום על חוזה שכירות', 'לקנות מתנה', 'לקנות אוכל לשבוע',
];

type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

const SHUFFLED_SOURCE = shuffle(PANTOMIME_WORDS);
const EASY_WORDS_COUNT = Math.ceil(SHUFFLED_SOURCE.length * 0.55);
const MEDIUM_WORDS_COUNT = Math.ceil(SHUFFLED_SOURCE.length * 0.30);

const WORD_BANK: Record<Exclude<Difficulty, 'mixed'>, string[]> = {
  easy: SHUFFLED_SOURCE.slice(0, EASY_WORDS_COUNT),
  medium: SHUFFLED_SOURCE.slice(EASY_WORDS_COUNT, EASY_WORDS_COUNT + MEDIUM_WORDS_COUNT),
  hard: SHUFFLED_SOURCE.slice(EASY_WORDS_COUNT + MEDIUM_WORDS_COUNT),
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDeckForDifficulty(difficulty: Difficulty): string[] {
  if (difficulty === 'mixed') {
    return shuffle([...WORD_BANK.easy, ...WORD_BANK.medium, ...WORD_BANK.hard]);
  }
  return shuffle(WORD_BANK[difficulty]);
}

// ─── Player Standalone View ───────────────────────────────────────────────────
export const AliasPlayerView: React.FC = () => {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [roundSeconds, setRoundSeconds] = useState(60);
  const [deck, setDeck] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = () => {
    const d = getDeckForDifficulty(difficulty);
    setDeck(d);
    setIdx(0);
    setCorrect(0);
    setSkipped(0);
    setTimeLeft(roundSeconds);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const handleCorrect = () => {
    setCorrect(c => c + 1);
    setIdx(i => Math.min(i + 1, deck.length - 1));
  };

  const handleSkip = () => {
    setSkipped(s => s + 1);
    setIdx(i => Math.min(i + 1, deck.length - 1));
  };

  const pct = Math.round((timeLeft / roundSeconds) * 100);
  const timerColor = timeLeft > 20 ? 'bg-green-500' : timeLeft > 10 ? 'bg-yellow-400' : 'bg-red-500';
  const word = deck[idx] ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark-blue to-brand-teal flex flex-col items-center justify-center p-4" dir="rtl">
      {phase === 'idle' && (
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <div className="text-6xl mb-2">🃏</div>
          <h1 className="text-3xl font-black text-brand-dark-blue">אליאס פיננסי</h1>
          <p className="text-lg text-gray-600">גרסת שחקן — המסביר מסתכל בטלפון, הקבוצה מנחשת!</p>

          <div className="space-y-3 text-right">
            <label className="block font-bold text-gray-700">רמת קושי</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as typeof difficulty)}
              className="w-full border-2 border-gray-300 rounded-xl p-3 text-lg font-bold"
            >
              <option value="mixed">מעורב (מומלץ) 🎲</option>
              <option value="easy">בסיסי ⭐</option>
              <option value="medium">בינוני ⭐⭐</option>
              <option value="hard">מאתגר ⭐⭐⭐</option>
            </select>

            <label className="block font-bold text-gray-700 mt-4">זמן לסיבוב (שניות)</label>
            <div className="flex gap-2">
              {[30, 45, 60, 90].map(s => (
                <button
                  key={s}
                  onClick={() => setRoundSeconds(s)}
                  className={`flex-1 py-2 rounded-xl font-bold text-lg border-2 transition
                    ${roundSeconds === s ? 'bg-brand-teal text-white border-brand-teal' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-brand-magenta text-white font-black text-2xl rounded-2xl shadow-lg active:scale-95 transition"
          >
            התחל סיבוב! 🚀
          </button>

          <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-800 text-right space-y-1">
            <p className="font-bold text-base">📋 כללי המשחק:</p>
            <p>• תאר את המילה בלי לאמר אותה</p>
            <p>• אסור לתרגם, לאיית או לרמוז על מספר הברות</p>
            <p>• לחץ ✅ כשהקבוצה ניחשה, ⏭ לדילוג</p>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full max-w-sm space-y-4">
          {/* Timer bar */}
          <div className="bg-white/20 rounded-full h-4 overflow-hidden">
            <div className={`h-4 rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="text-center text-white font-black text-4xl">{timeLeft} שניות</div>

          {/* Word card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <p className="text-5xl font-black text-brand-dark-blue leading-tight">{word}</p>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-white text-lg font-bold px-2">
            <span>✅ {correct} הצלחות</span>
            <span>⏭ {skipped} דילוגים</span>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleSkip}
              className="py-6 bg-yellow-400 text-brand-dark-blue font-black text-2xl rounded-2xl shadow-lg active:scale-95 transition"
            >
              ⏭ דלג
            </button>
            <button
              onClick={handleCorrect}
              className="py-6 bg-green-500 text-white font-black text-2xl rounded-2xl shadow-lg active:scale-95 transition"
            >
              ✅ הצלחנו!
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center space-y-5">
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-black text-brand-dark-blue">הסיבוב הסתיים!</h2>
          <div className="bg-green-50 rounded-2xl p-6 space-y-2 text-right">
            <p className="text-2xl font-bold text-green-700">✅ הצלחות: <span className="text-4xl">{correct}</span></p>
            <p className="text-xl text-yellow-700">⏭ דילוגים: {skipped}</p>
          </div>
          <p className="text-lg text-gray-600">ספרו למדריך כמה הצלחות עשיתם!</p>
          <button
            onClick={() => setPhase('idle')}
            className="w-full py-4 bg-brand-teal text-white font-black text-2xl rounded-2xl shadow-lg active:scale-95 transition"
          >
            🔄 סיבוב חדש
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Instructor (Host) View ───────────────────────────────────────────────────
interface Team {
  name: string;
  score: number;
  color: string;
}

interface AliasGameProps {
  onBack: () => void;
}

const TEAM_COLORS = [
  { bg: 'bg-blue-500',   text: 'text-blue-700',   border: 'border-blue-400',   light: 'bg-blue-50'   },
  { bg: 'bg-rose-500',   text: 'text-rose-700',   border: 'border-rose-400',   light: 'bg-rose-50'   },
  { bg: 'bg-emerald-500',text: 'text-emerald-700',border: 'border-emerald-400',light: 'bg-emerald-50'},
  { bg: 'bg-amber-500',  text: 'text-amber-700',  border: 'border-amber-400',  light: 'bg-amber-50'  },
  { bg: 'bg-violet-500', text: 'text-violet-700', border: 'border-violet-400', light: 'bg-violet-50' },
  { bg: 'bg-pink-500',   text: 'text-pink-700',   border: 'border-pink-400',   light: 'bg-pink-50'   },
];

const AliasGame: React.FC<AliasGameProps> = ({ onBack }) => {
  // ── Setup state ──
  const [phase, setPhase] = useState<'setup' | 'game' | 'results'>('setup');
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState(['קבוצה כחולה', 'קבוצה אדומה', 'קבוצה ירוקה', 'קבוצה צהובה', 'קבוצה סגולה', 'קבוצה ורודה']);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [roundSeconds, setRoundSeconds] = useState(60);
  const [winScore, setWinScore] = useState(10);

  // ── Game state ──
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [showQr, setShowQr] = useState(false);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [pendingPoints, setPendingPoints] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [deck, setDeck] = useState<string[]>([]);
  const [deckIdx, setDeckIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── QR URL ──
  const playerUrl = `${window.location.origin}${window.location.pathname}#alias-player`;

  const startGame = () => {
    const t: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      name: teamNames[i] || `קבוצה ${i + 1}`,
      score: 0,
      color: TEAM_COLORS[i].bg,
    }));
    setTeams(t);
    setCurrentTeamIdx(0);
    setRound(1);
    setTimeLeft(roundSeconds);
    setRoundCorrect(0);
    setShowRoundResult(false);
    setIsTimerRunning(false);
    setDeck(getDeckForDifficulty(difficulty));
    setDeckIdx(0);
    setShowWord(false);
    setPhase('game');
  };

  // ── Timer logic ──
  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
    setShowWord(true);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(false);
  }, []);

  useEffect(() => {
    if (!isTimerRunning) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setIsTimerRunning(false);
          setShowWord(false);
          setShowRoundResult(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning]);

  const confirmRound = (pts: number) => {
    const updated = teams.map((t, i) =>
      i === currentTeamIdx ? { ...t, score: t.score + pts } : t
    );
    setTeams(updated);
    // Check win condition
    if (updated[currentTeamIdx].score >= winScore) {
      setPhase('results');
      return;
    }
    setCurrentTeamIdx(i => (i + 1) % teams.length);
    setRound(r => r + 1);
    setTimeLeft(roundSeconds);
    setRoundCorrect(0);
    setDeckIdx(i => (i + 1) % deck.length);
    setShowRoundResult(false);
    setShowWord(false);
  };

  const currentTeam = teams[currentTeamIdx];
  const colorSet = TEAM_COLORS[currentTeamIdx] ?? TEAM_COLORS[0];
  const pct = Math.round((timeLeft / roundSeconds) * 100);
  const timerColor = timeLeft > 20 ? 'bg-green-500' : timeLeft > 10 ? 'bg-yellow-400' : 'bg-red-500';
  const winner = [...(teams)].sort((a, b) => b.score - a.score)[0];

  // ── Setup Phase ──────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="space-y-6 animate-fade-in" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button onClick={onBack} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-brand-dark-blue">
            ← חזרה
          </button>
          <div>
            <h2 className="text-3xl font-black text-brand-dark-blue">🃏 אליאס פיננסי</h2>
            <p className="text-gray-500 text-lg">הגדרת המשחק — מדריך</p>
          </div>
          <button
            onClick={() => setShowQr(v => !v)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-teal text-white font-bold hover:bg-teal-600 transition"
          >
            📱 QR לשחקנים
          </button>
        </div>

        {/* QR panel */}
        {showQr && (
          <div className="bg-white border-2 border-brand-teal rounded-3xl p-6 flex flex-col items-center gap-4 shadow-lg">
            <p className="text-xl font-bold text-brand-dark-blue">שחקנים יסרקו את הברקוד הזה בטלפון</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(playerUrl)}&bgcolor=ffffff&color=1b2550&qzone=2`}
              alt="QR Code"
              className="rounded-2xl border border-gray-200 shadow"
              width={220}
              height={220}
            />
            <div className="bg-gray-50 rounded-xl p-3 text-center max-w-xs">
              <p className="text-sm text-gray-500 font-mono break-all">{playerUrl}</p>
            </div>
            <p className="text-gray-500 text-base text-center max-w-sm">
              כל שחקן מסרק עם הטלפון שלו. המסביר מחזיק את הטלפון ורואה את המילים —
              הקבוצה מנסה לנחש בלי לראות את המסך.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team setup */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow space-y-4">
            <h3 className="text-2xl font-black text-brand-dark-blue">👥 קבוצות</h3>
            <div className="flex gap-2 items-center">
              <span className="font-bold text-gray-700">מספר קבוצות:</span>
              {[2, 3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  onClick={() => setTeamCount(n)}
                  className={`w-10 h-10 rounded-full font-black text-lg border-2 transition
                    ${teamCount === n ? 'bg-brand-dark-blue text-white border-brand-dark-blue' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {Array.from({ length: teamCount }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${TEAM_COLORS[i].bg} shrink-0`} />
                  <input
                    type="text"
                    value={teamNames[i]}
                    onChange={e => {
                      const n = [...teamNames];
                      n[i] = e.target.value;
                      setTeamNames(n);
                    }}
                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-lg font-bold focus:border-brand-teal outline-none"
                    placeholder={`קבוצה ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Game settings */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow space-y-5">
            <h3 className="text-2xl font-black text-brand-dark-blue">⚙️ הגדרות משחק</h3>

            <div>
              <label className="block font-bold text-gray-700 mb-2">רמת קושי</label>
              <div className="grid grid-cols-2 gap-2">
                {([['mixed', 'מעורב 🎲'], ['easy', 'בסיסי ⭐'], ['medium', 'בינוני ⭐⭐'], ['hard', 'מאתגר ⭐⭐⭐']] as const).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setDifficulty(v)}
                    className={`py-2 px-3 rounded-xl font-bold border-2 text-sm transition
                      ${difficulty === v ? 'bg-brand-teal text-white border-brand-teal' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">זמן לסיבוב</label>
              <div className="flex gap-2">
                {[30, 45, 60, 90].map(s => (
                  <button
                    key={s}
                    onClick={() => setRoundSeconds(s)}
                    className={`flex-1 py-2 rounded-xl font-black text-lg border-2 transition
                      ${roundSeconds === s ? 'bg-brand-dark-blue text-white border-brand-dark-blue' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                  >
                    {s}″
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">ניקוד לניצחון: <span className="text-brand-magenta">{winScore}</span></label>
              <input
                type="range"
                min={5}
                max={30}
                step={5}
                value={winScore}
                onChange={e => setWinScore(+e.target.value)}
                className="w-full accent-brand-magenta"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>5 (קצר)</span><span>15</span><span>30 (ארוך)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Word preview */}
        <div className="bg-brand-dark-blue/5 border border-brand-dark-blue/20 rounded-3xl p-5">
          <h3 className="text-xl font-black text-brand-dark-blue mb-3">📝 דוגמאות מילים — {difficulty === 'mixed' ? 'מעורב' : difficulty === 'easy' ? 'בסיסי' : difficulty === 'medium' ? 'בינוני' : 'מאתגר'}</h3>
          <div className="flex flex-wrap gap-2">
            {shuffle(WORD_BANK[difficulty === 'mixed' ? 'easy' : difficulty]).slice(0, 8).concat(
              difficulty === 'mixed' ? shuffle(WORD_BANK.medium).slice(0, 5) : []
            ).concat(
              difficulty === 'mixed' ? shuffle(WORD_BANK.hard).slice(0, 3) : []
            ).map((w, i) => (
              <span key={i} className="bg-white border border-gray-300 rounded-full px-4 py-1.5 text-base font-bold text-gray-700 shadow-sm">{w}</span>
            ))}
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full py-5 bg-brand-magenta hover:bg-pink-700 text-white font-black text-3xl rounded-3xl shadow-2xl transition hover:-translate-y-0.5"
        >
          🚀 התחל את המשחק!
        </button>
      </div>
    );
  }

  // ── Game Phase ───────────────────────────────────────────────────────────────
  if (phase === 'game') {
    return (
      <div className="space-y-5 animate-fade-in" dir="rtl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => { stopTimer(); setPhase('setup'); }}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-brand-dark-blue text-sm"
          >
            ← הגדרות
          </button>
          <span className="font-bold text-gray-600">סיבוב {round} | ניקוד ניצחון: {winScore}</span>
          <button
            onClick={() => setShowQr(v => !v)}
            className="px-4 py-2 rounded-full bg-brand-teal text-white font-bold text-sm hover:bg-teal-600 transition"
          >
            📱 QR
          </button>
        </div>

        {/* QR mini panel */}
        {showQr && (
          <div className="bg-white rounded-2xl border border-brand-teal p-4 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(playerUrl)}&bgcolor=ffffff&color=1b2550&qzone=1`}
              alt="QR"
              className="rounded-xl"
              width={140}
              height={140}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-brand-dark-blue text-lg">שחקנים — סרקו עם הטלפון!</p>
              <p className="text-gray-500 text-sm font-mono break-all mt-1">{playerUrl}</p>
              <p className="text-gray-600 text-sm mt-2">המסביר מחזיק את הטלפון (רואה את המילה), הקבוצה מנחשת בלי לראות.</p>
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {teams.map((team, i) => {
            const cs = TEAM_COLORS[i] ?? TEAM_COLORS[0];
            return (
              <div
                key={i}
                className={`rounded-2xl p-3 text-center border-2 transition
                  ${i === currentTeamIdx ? `${cs.light} ${cs.border} shadow-lg scale-105` : 'bg-white border-gray-200'}`}
              >
                <div className={`w-4 h-4 rounded-full ${cs.bg} mx-auto mb-1`} />
                <p className={`font-black text-lg truncate ${i === currentTeamIdx ? cs.text : 'text-gray-600'}`}>{team.name}</p>
                <p className={`text-3xl font-black ${i === currentTeamIdx ? cs.text : 'text-gray-800'}`}>{team.score}</p>
                {i === currentTeamIdx && <p className="text-xs font-bold mt-1 text-green-600">↑ תורם!</p>}
              </div>
            );
          })}
        </div>

        {/* Current team turn */}
        <div className={`${colorSet.light} border-2 ${colorSet.border} rounded-3xl p-6 space-y-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-500 font-bold">תורה של:</p>
              <h3 className={`text-3xl font-black ${colorSet.text}`}>{currentTeam?.name}</h3>
            </div>
            {isTimerRunning && (
              <div className={`text-5xl font-black ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : colorSet.text}`}>
                {timeLeft}″
              </div>
            )}
          </div>

          {/* Timer bar */}
          {isTimerRunning && (
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className={`h-3 rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${pct}%` }} />
            </div>
          )}

          {/* Round result (after timer ends) */}
          {showRoundResult && (
            <div className="bg-white rounded-2xl p-5 text-center space-y-4 border border-gray-200">
              <p className="text-2xl font-black text-brand-dark-blue">⏱ הזמן הסתיים!</p>
              <p className="text-lg text-gray-600">כמה מילים ניחשה הקבוצה נכון?</p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setPendingPoints(p => Math.max(0, p - 1))} className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 font-black text-2xl">−</button>
                <span className="text-5xl font-black text-brand-magenta w-16 text-center">{pendingPoints}</span>
                <button onClick={() => setPendingPoints(p => p + 1)} className="w-12 h-12 rounded-full bg-brand-teal text-white hover:bg-teal-600 font-black text-2xl">+</button>
              </div>
              <button
                onClick={() => { confirmRound(pendingPoints); setPendingPoints(0); }}
                className="w-full py-3 bg-brand-magenta hover:bg-pink-700 text-white font-black text-xl rounded-2xl transition"
              >
                אשר ועבור לקבוצה הבאה →
              </button>
            </div>
          )}

          {/* Controls (before / during timer) */}
          {!showRoundResult && (
            <div className="space-y-3">
              {!isTimerRunning ? (
                <div className="space-y-3">
                  <div className="bg-white/80 rounded-2xl p-4 border border-gray-200 text-center">
                    <p className="text-gray-500 text-base">הכינו את הקבוצה — המסביר קח את הטלפון!</p>
                    <p className="text-gray-400 text-sm mt-1">לחצו "התחל סיבוב" כשהקבוצה מוכנה</p>
                  </div>
                  <button
                    onClick={startTimer}
                    className={`w-full py-5 ${colorSet.bg} text-white font-black text-2xl rounded-2xl shadow-lg hover:opacity-90 transition`}
                  >
                    ▶ התחל סיבוב ({roundSeconds}″)
                  </button>
                  {/* Manual word reveal for instructor verification */}
                  {showWord && deck[deckIdx] && (
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center">
                      <p className="text-gray-400 text-sm font-bold mb-1">מילה נוכחית (לבדיקת מדריך)</p>
                      <p className="text-3xl font-black text-brand-dark-blue">{deck[deckIdx]}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-gray-300 text-center">
                    <p className="text-gray-400 text-sm font-bold mb-1">מילה נוכחית (מדריך בלבד)</p>
                    <p className="text-4xl font-black text-brand-dark-blue">{deck[deckIdx]}</p>
                  </div>
                  <button
                    onClick={stopTimer}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black text-xl rounded-2xl transition"
                  >
                    ⏹ עצור ורשום ניקוד
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800 space-y-1" dir="rtl">
          <p className="font-bold text-base">📋 הוראות למדריך:</p>
          <p>1. לחצו <strong>▶ התחל סיבוב</strong> — הטיימר מתחיל</p>
          <p>2. המסביר (עם הטלפון) מנסה להעביר כמה מילים שיכולים — תשתמשו בדף הסרוק לטלפון!</p>
          <p>3. כשהזמן נגמר — שאלו כמה מילים הקבוצה ניחשה ורשמו</p>
          <p>4. הקבוצה הראשונה שמגיעה ל-<strong>{winScore} נקודות</strong> מנצחת!</p>
        </div>
      </div>
    );
  }

  // ── Results Phase ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in text-center" dir="rtl">
      <div className="text-7xl">🏆</div>
      <h2 className="text-4xl font-black text-brand-dark-blue">המשחק הסתיים!</h2>
      {winner && (
        <div className="bg-gradient-to-l from-amber-400 to-yellow-300 rounded-3xl p-8 inline-block shadow-2xl">
          <p className="text-2xl font-bold text-amber-900">הניצחון שייך ל…</p>
          <p className="text-5xl font-black text-brand-dark-blue mt-2">{winner.name}</p>
          <p className="text-3xl font-black text-amber-800 mt-1">{winner.score} נקודות 🎉</p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow p-6 text-right max-w-md mx-auto">
        <p className="font-black text-brand-dark-blue text-xl mb-4">טבלת תוצאות סופית:</p>
        <div className="space-y-2">
          {[...teams].sort((a, b) => b.score - a.score).map((t, i) => {
            const ci = teams.indexOf(t);
            const cs = TEAM_COLORS[ci] ?? TEAM_COLORS[0];
            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? cs.light : 'bg-gray-50'}`}>
                <span className="text-2xl font-black text-gray-400 w-6">{i + 1}</span>
                <div className={`w-4 h-4 rounded-full ${cs.bg} shrink-0`} />
                <span className="flex-1 font-bold text-gray-800">{t.name}</span>
                <span className={`font-black text-2xl ${i === 0 ? cs.text : 'text-gray-600'}`}>{t.score}</span>
                {i === 0 && <span>👑</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={() => { setPhase('setup'); setTeams([]); }}
          className="py-3 px-8 bg-brand-magenta hover:bg-pink-700 text-white font-black text-xl rounded-2xl shadow transition"
        >
          🔄 משחק חדש
        </button>
        <button
          onClick={onBack}
          className="py-3 px-8 bg-gray-200 hover:bg-gray-300 text-brand-dark-blue font-black text-xl rounded-2xl transition"
        >
          חזרה
        </button>
      </div>
    </div>
  );
};

export default AliasGame;
