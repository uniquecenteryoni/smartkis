import React, { useState, useCallback, useEffect, useRef } from 'react';

interface WhatDidWeHaveGameProps {
  onBack: () => void;
}

interface CardData {
  id: number;        // 0-49
  pairId: number;    // 0-24
  type: 'term' | 'def';
  text: string;
}

interface Group {
  name: string;
  score: number;
}

const PAIRS: [string, string][] = [
  ['תמחור', 'קביעת מחיר למוצר לפי עלות ורווח'],
  ['סחר חליפין', 'חילופי מוצרים ושירותים ללא כסף'],
  ['מונופול', 'חברה אחת ששולטת בשוק שלם'],
  ['תקציב', 'תכנון הכנסות וההוצאות מראש'],
  ['הכנסה', 'כסף שמגיע אלינו מעבודה או עסק'],
  ['הוצאה', 'כסף שיוצא מאצלנו לצרכים שונים'],
  ['חיסכון', 'כסף שמניחים בצד לעתיד'],
  ['ריבית', 'עלות על השאלת כסף לאורך זמן'],
  ['אינפלציה', 'עלייה כללית במחירים לאורך זמן'],
  ['מיתוג', 'יצירת זהות ייחודית למוצר או עסק'],
  ['יזמות', 'הקמת עסק חדש וניהולו'],
  ['שיכנוע', 'יכולת לגרום לאחר לרצות לקנות'],
  ['שוק', 'מרחב מפגש בין קונים למוכרים'],
  ['היצע', 'כמות המוצרים הזמינים למכירה בשוק'],
  ['ביקוש', 'רצון הצרכנים לרכוש מוצר מסוים'],
  ['חוזה', 'הסכם משפטי מחייב בין שני צדדים'],
  ['עמלה', 'תגמול לפי אחוז מהמכירות'],
  ['השקעה', 'שימוש בכסף כדי לייצר רווח עתידי'],
  ['הפסד', 'מצב שהוצאות עולות על ההכנסות'],
  ['רווח', 'מצב שהכנסות עולות על ההוצאות'],
  ['מחיר עלות', 'כמה הוציא יצרן לייצר את המוצר'],
  ['פרסום', 'הפצת מסר כדי למשוך לקוחות חדשים'],
  ['מתחרה', 'עסק אחר שמציע שירות או מוצר דומה'],
  ['לקוח', 'מי שרוכש מוצר או שירות מעסק'],
  ['יזם', 'אדם שמקים ומנהל עסק חדש בעצמו'],
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): CardData[] {
  const cards: CardData[] = [];
  PAIRS.forEach(([term, def], pairId) => {
    cards.push({ id: -1, pairId, type: 'term', text: term });
    cards.push({ id: -1, pairId, type: 'def', text: def });
  });
  return shuffleArray(cards).map((c, idx) => ({ ...c, id: idx }));
}

const GROUP_COLORS = [
  { bg: '#6366f1', light: '#eef2ff', border: '#a5b4fc' },
  { bg: '#0ea5e9', light: '#e0f7ff', border: '#7dd3fc' },
  { bg: '#22c55e', light: '#dcfce7', border: '#86efac' },
  { bg: '#f97316', light: '#fff7ed', border: '#fdba74' },
  { bg: '#ec4899', light: '#fdf2f8', border: '#f9a8d4' },
  { bg: '#8b5cf6', light: '#f5f3ff', border: '#c4b5fd' },
];

const SetupScreen: React.FC<{ onStart: (groups: string[]) => void }> = ({ onStart }) => {
  const [inputs, setInputs] = useState(['', '', '', '']);

  const setInput = (i: number, v: string) => {
    setInputs(prev => { const n = [...prev]; n[i] = v; return n; });
  };

  const addGroup = () => {
    if (inputs.length < 6) setInputs(prev => [...prev, '']);
  };

  const removeGroup = (i: number) => {
    if (inputs.length > 2) setInputs(prev => prev.filter((_, idx) => idx !== i));
  };

  const validGroups = inputs.map(s => s.trim()).filter(Boolean);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 py-10" dir="rtl">
      <div className="text-center">
        <p className="text-5xl mb-4">🧩</p>
        <h2 className="text-3xl font-black text-brand-dark-blue">מה היה לנו? — הגדרת קבוצות</h2>
        <p className="text-brand-dark-blue/60 mt-2 text-lg">הזינו את שמות הקבוצות המשתתפות ולחצו "התחל משחק"</p>
      </div>
      <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-8 w-full max-w-lg space-y-4">
        {inputs.map((val, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-4 h-10 rounded-full flex-shrink-0"
              style={{ background: GROUP_COLORS[i % GROUP_COLORS.length].bg }}
            />
            <input
              type="text"
              value={val}
              onChange={e => setInput(i, e.target.value)}
              placeholder={`שם קבוצה ${i + 1}`}
              className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2.5 text-lg font-bold text-brand-dark-blue focus:outline-none focus:border-brand-teal"
              maxLength={24}
            />
            {inputs.length > 2 && (
              <button
                onClick={() => removeGroup(i)}
                className="text-gray-400 hover:text-red-500 font-bold text-lg px-2"
                title="הסר קבוצה"
              >✕</button>
            )}
          </div>
        ))}
        {inputs.length < 6 && (
          <button
            onClick={addGroup}
            className="w-full rounded-xl border-2 border-dashed border-gray-300 py-2.5 text-brand-dark-blue/60 font-bold hover:border-brand-teal hover:text-brand-teal transition"
          >
            + הוספת קבוצה
          </button>
        )}
      </div>
      <button
        onClick={() => onStart(validGroups)}
        disabled={validGroups.length < 2}
        className="px-10 py-4 rounded-full bg-sky-600 text-white font-black text-xl shadow-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        התחל משחק 🎮
      </button>
    </div>
  );
};

type GameStatus = 'idle' | 'one-flipped' | 'checking' | 'done';

const GameScreen: React.FC<{ groups: Group[]; onGroupsChange: (g: Group[]) => void; onReset: () => void }> = ({
  groups: initialGroups,
  onGroupsChange,
  onReset,
}) => {
  const [deck] = useState<CardData[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);  // card ids currently face-up (not matched)
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [consecutiveTurns, setConsecutiveTurns] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [flash, setFlash] = useState<{ kind: 'match' | 'miss'; text: string } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentGroup = groups[currentGroupIdx];
  const color = GROUP_COLORS[currentGroupIdx % GROUP_COLORS.length];
  const isGameOver = matched.size === 50;

  // Update parent whenever scores change
  useEffect(() => { onGroupsChange(groups); }, [groups]);

  const clearTimeout_ = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const advanceTurn = useCallback((didMatch: boolean, newConsec: number) => {
    if (didMatch && newConsec < 2) {
      // same group, another turn
      setStatus('idle');
    } else {
      // next group
      setCurrentGroupIdx(prev => (prev + 1) % groups.length);
      setConsecutiveTurns(0);
      setStatus('idle');
    }
  }, [groups.length]);

  const handleCardClick = useCallback((card: CardData) => {
    if (status === 'checking' || matched.has(card.id) || flipped.includes(card.id)) return;

    if (status === 'idle') {
      setFlipped([card.id]);
      setStatus('one-flipped');
      return;
    }

    if (status === 'one-flipped') {
      const firstId = flipped[0];
      const firstCard = deck.find(c => c.id === firstId)!;
      const newFlipped = [firstId, card.id];
      setFlipped(newFlipped);
      setStatus('checking');

      if (firstCard.pairId === card.pairId && firstCard.type !== card.type) {
        // MATCH
        const newConsec = consecutiveTurns + 1;
        setConsecutiveTurns(newConsec);
        setFlash({ kind: 'match', text: `🎉 התאמה! ${currentGroup.name} מקבלת 100 ₪` });

        clearTimeout_();
        timeoutRef.current = setTimeout(() => {
          setMatched(prev => {
            const next = new Set(prev);
            next.add(firstId);
            next.add(card.id);
            return next;
          });
          setFlipped([]);
          setFlash(null);
          setGroups(prev => prev.map((g, i) =>
            i === currentGroupIdx ? { ...g, score: g.score + 100 } : g
          ));
          advanceTurn(true, newConsec);
        }, 1200);
      } else {
        // NO MATCH
        setFlash({ kind: 'miss', text: `❌ לא התאמה — עובר לקבוצה הבאה` });
        clearTimeout_();
        timeoutRef.current = setTimeout(() => {
          setFlipped([]);
          setFlash(null);
          advanceTurn(false, 0);
        }, 1600);
      }
    }
  }, [status, matched, flipped, deck, currentGroupIdx, consecutiveTurns, currentGroup, advanceTurn]);

  return (
    <div dir="rtl" className="flex flex-col gap-4">
      {/* Flash message */}
      {flash && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl font-black text-xl text-white animate-bounce"
          style={{ background: flash.kind === 'match' ? '#22c55e' : '#ef4444' }}
        >
          {flash.text}
        </div>
      )}

      {/* Game over banner */}
      {isGameOver && (
        <div className="bg-yellow-400 border-4 border-yellow-600 rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-yellow-950">🏆 המשחק הסתיים!</p>
          <p className="text-lg font-bold text-yellow-900 mt-1">
            מנצח: {[...groups].sort((a, b) => b.score - a.score)[0].name} עם{' '}
            {[...groups].sort((a, b) => b.score - a.score)[0].score} ₪
          </p>
          <button
            onClick={onReset}
            className="mt-3 px-6 py-2 rounded-full bg-yellow-800 text-white font-bold hover:bg-yellow-900"
          >
            משחק חדש
          </button>
        </div>
      )}

      <div className="flex gap-4 items-start">
        {/* ── CARDS GRID ── */}
        <div className="flex-1 min-w-0">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}
          >
            {deck.map(card => {
              const isFaceUp = flipped.includes(card.id) || matched.has(card.id);
              const isMatchedCard = matched.has(card.id);
              const isPairMatch = flipped.length === 2 &&
                deck.find(c => c.id === flipped[0])?.pairId === card.pairId &&
                deck.find(c => c.id === flipped[1])?.pairId === card.pairId &&
                flipped.includes(card.id);

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={isMatchedCard || status === 'checking' || isFaceUp && !flipped.includes(card.id)}
                  title={isFaceUp ? card.text : `קלף ${card.id + 1}`}
                  style={{
                    aspectRatio: '2/3',
                    borderRadius: 10,
                    border: isMatchedCard
                      ? '2px solid #22c55e'
                      : isFaceUp
                      ? `2px solid ${isPairMatch ? '#22c55e' : color.bg}`
                      : '2px solid #cbd5e1',
                    background: isMatchedCard
                      ? '#dcfce7'
                      : isFaceUp
                      ? '#fff'
                      : '#1e3a5f',
                    color: isMatchedCard ? '#166534' : isFaceUp ? '#0f172a' : '#7dd3fc',
                    fontSize: isFaceUp ? '9px' : '13px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3px',
                    lineHeight: 1.2,
                    textAlign: 'center',
                    cursor: isMatchedCard ? 'default' : 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    boxShadow: isFaceUp && !isMatchedCard ? `0 0 0 2px ${color.bg}55` : undefined,
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                  }}
                >
                  {isFaceUp ? card.text : card.id + 1}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-brand-dark-blue/50 text-center mt-2">
            {matched.size / 2} / 25 זוגות הותאמו
          </p>
        </div>

        {/* ── SCOREBOARD ── */}
        <div className="w-56 flex-shrink-0 flex flex-col gap-3">
          <div
            className="rounded-2xl p-4 text-white text-center shadow-lg"
            style={{ background: color.bg }}
          >
            <p className="text-xs font-bold opacity-75 uppercase tracking-widest">תור</p>
            <p className="text-xl font-black mt-0.5">{currentGroup.name}</p>
            <p className="text-xs opacity-75 mt-1">
              {consecutiveTurns === 0 ? 'תור ראשון' : `תור ${consecutiveTurns + 1} ברצף`}
            </p>
          </div>

          <div className="space-y-2">
            {groups.map((g, i) => {
              const c = GROUP_COLORS[i % GROUP_COLORS.length];
              const isActive = i === currentGroupIdx;
              return (
                <div
                  key={g.name}
                  className="rounded-xl px-4 py-3 flex items-center justify-between gap-2 transition-all"
                  style={{
                    background: isActive ? c.light : '#f8fafc',
                    border: `2px solid ${isActive ? c.border : '#e2e8f0'}`,
                    fontWeight: isActive ? 900 : 600,
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isActive && <span className="text-xs">▶</span>}
                    <span
                      className="text-sm truncate"
                      style={{ color: isActive ? c.bg : '#475569' }}
                    >
                      {g.name}
                    </span>
                  </div>
                  <span
                    className="text-sm font-black flex-shrink-0"
                    style={{ color: c.bg }}
                  >
                    ₪{g.score}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl bg-slate-100 border border-slate-200 p-3 text-xs text-slate-500 leading-relaxed">
            <p className="font-bold text-slate-600 mb-1">חוקי המשחק</p>
            <p>• הקבוצה בוחרת 2 קלפים</p>
            <p>• התאמה = 100 ₪ + תור נוסף</p>
            <p>• מקסימום 2 תורות ברצף</p>
            <p>• אי-התאמה = עובר לקבוצה הבאה</p>
          </div>

          <button
            onClick={onReset}
            className="w-full rounded-xl border-2 border-gray-300 py-2 text-brand-dark-blue/60 font-bold text-sm hover:border-red-400 hover:text-red-500 transition"
          >
            🔄 אפס משחק
          </button>
        </div>
      </div>
    </div>
  );
};

const WhatDidWeHaveGame: React.FC<WhatDidWeHaveGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<'setup' | 'game'>('setup');
  const [groups, setGroups] = useState<Group[]>([]);

  const handleStart = (names: string[]) => {
    setGroups(names.map(name => ({ name, score: 0 })));
    setPhase('game');
  };

  return (
    <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">פעילות — שיעור סיכום</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">🧩 מה היה לנו?</h3>
          <p className="text-brand-dark-blue/60">משחק זיכרון עם 25 מושגים מתוכנית "מה בכיס"</p>
        </div>
        <div className="flex gap-2">
          {phase === 'game' && (
            <button
              onClick={() => setPhase('setup')}
              className="px-4 py-2 rounded-full bg-gray-100 text-brand-dark-blue font-bold hover:bg-gray-200"
            >
              חזרה להגדרות
            </button>
          )}
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300"
          >
            חזרה לחלון המשחקים
          </button>
        </div>
      </div>

      {phase === 'setup' ? (
        <SetupScreen onStart={handleStart} />
      ) : (
        <GameScreen
          groups={groups}
          onGroupsChange={setGroups}
          onReset={() => setPhase('setup')}
        />
      )}
    </div>
  );
};

export default WhatDidWeHaveGame;
