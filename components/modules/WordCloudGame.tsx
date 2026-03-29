import React, { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';

type Msg =
  | { type: 'WORDS'; words: string[] }
  | { type: 'PROS_TEAMS'; teams: string[] }
  | { type: 'PROS_JOIN'; name: string; team: string }
  | { type: 'PROS_START'; target: number }
  | { type: 'PROS_TAP' }
  | { type: 'PROS_ANSWER'; questionId: string; answerIndex: number }
  | { type: 'PROS_QUESTION'; question: ProsQuestion | null; result?: 'correct' | 'wrong' | null }
  | { type: 'PROS_STATE'; teams: ProsTeamState[]; target: number; phase: ProsPhase };

type SummaryChapter = 'reflection' | 'professionals' | 'coming-soon';
type ProsPhase = 'setup' | 'waiting' | 'race' | 'done';

interface ProsTeamState {
  name: string;
  progress: number;
  finishedRank: number | null;
  reward: number;
}

interface ProsPlayerEntry {
  connId: string;
  name: string;
  team: string;
  conn: DataConnection;
}

interface ProsQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  module: string;
}

const CLOUD_COLORS = ['#0d9488', '#1b2550', '#d52963', '#f59e0b', '#8b5cf6', '#22c55e', '#ef4444', '#3b82f6', '#fb923c', '#06b6d4', '#84cc16', '#a855f7'];
const CUP_COLORS = ['#0d9488', '#2563eb', '#d946ef', '#f97316', '#22c55e', '#ef4444'];
const RANK_REWARDS = [1000, 800, 600, 400];
const DEFAULT_TARGET = 160;
const TAP_PROGRESS = 0.45;
const QUESTION_BONUS = 1.4;
const QUESTION_PENALTY = 0.8;
const TAPS_PER_QUESTION = 12;

const PROFESSIONALS_QUESTIONS: ProsQuestion[] = [
  {
    id: 'budget-1',
    module: 'ניהול תקציב',
    prompt: 'מהו הכלל הבסיסי בתקציב מאוזן?',
    options: ['שההוצאות יהיו גבוהות מההכנסות', 'שההכנסות יכסו את ההוצאות', 'שלא צריך לעקוב אחרי הוצאות'],
    correctIndex: 1,
  },
  {
    id: 'expenses-1',
    module: 'ניהול הוצאות',
    prompt: 'במודל חצ"ר, מה צריך להופיע לפני "רוצה"?',
    options: ['חייב וצריך', 'רק חיסכון', 'רק בילויים'],
    correctIndex: 0,
  },
  {
    id: 'overdraft-1',
    module: 'מינוס',
    prompt: 'למה מינוס לאורך זמן מסוכן?',
    options: ['כי הוא גורר ריבית ועלויות', 'כי הוא מגדיל משכורת', 'כי הוא מבטל הוצאות קבועות'],
    correctIndex: 0,
  },
  {
    id: 'rights-1',
    module: 'זכויות עובדים',
    prompt: 'מה נכון לגבי זכויות בעבודה?',
    options: ['הן לא תלויות בגיל', 'אין זכויות לנוער עובד', 'תלוש שכר הוא לא חובה'],
    correctIndex: 0,
  },
  {
    id: 'salary-1',
    module: 'תלוש שכר',
    prompt: 'למה חשוב לבדוק תלוש שכר?',
    options: ['כדי לוודא שכל הרכיבים והניכויים תקינים', 'רק כדי לראות את הלוגו', 'אין סיבה מיוחדת'],
    correctIndex: 0,
  },
  {
    id: 'employment-1',
    module: 'שכירים ועצמאיים',
    prompt: 'מה מאפיין עצמאי לעומת שכיר?',
    options: ['הוא אחראי יותר להתנהלות הכספית והדיווח', 'אין לו הוצאות עסקיות', 'הוא לא צריך לתמחר שירותים'],
    correctIndex: 0,
  },
  {
    id: 'saving-1',
    module: 'חיסכון והשקעות',
    prompt: 'מה עושה ריבית דריבית?',
    options: ['מקטינה תמיד את הכסף', 'מייצרת תשואה גם על הרווחים שנצברו', 'מוחקת חיסכון'],
    correctIndex: 1,
  },
  {
    id: 'research-1',
    module: 'למידת חקר',
    prompt: 'אינפלציה פירושה בדרך כלל ש...',
    options: ['רמת המחירים במשק עולה', 'כל המוצרים זולים יותר', 'אין שינוי בכוח הקנייה'],
    correctIndex: 0,
  },
];

function roundProgress(value: number) {
  return Math.max(0, Number(value.toFixed(2)));
}

function getNormalizedDelta(base: number, teamSize: number) {
  return roundProgress(base / Math.max(teamSize, 1));
}

function getRandomQuestion(excludeId?: string | null) {
  const pool = PROFESSIONALS_QUESTIONS.filter(question => question.id !== excludeId);
  const source = pool.length > 0 ? pool : PROFESSIONALS_QUESTIONS;
  return source[Math.floor(Math.random() * source.length)];
}

function buildCloud(allWords: string[]): { word: string; count: number; size: number; color: string }[] {
  const freq: Record<string, number> = {};
  for (const word of allWords) {
    const normalized = word.trim();
    if (normalized) freq[normalized] = (freq[normalized] || 0) + 1;
  }
  const max = Math.max(...Object.values(freq), 1);
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count], index) => ({
      word,
      count,
      size: Math.round(18 + (count / max) * 60),
      color: CLOUD_COLORS[index % CLOUD_COLORS.length],
    }));
}

function getBaseUrl() {
  const normalizedBase = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return `${window.location.origin}${normalizedBase}`;
}

function getCupColor(index: number) {
  return CUP_COLORS[index % CUP_COLORS.length];
}

const WORD_CSS = `
  @keyframes wordPop {
    0%   { transform: scale(0.4); opacity: 0; }
    70%  { transform: scale(1.12); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes cloudPulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes cupBubble {
    0% { transform: translateY(12px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .word-pop { animation: wordPop 0.45s cubic-bezier(.34,1.56,.64,1) forwards; }
  .cloud-wait { animation: cloudPulse 1.8s ease-in-out infinite; }
  .cup-bubble { animation: cupBubble 0.35s ease-out forwards; }
`;

const ChapterChip: React.FC<{
  title: string;
  subtitle: string;
  emoji: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ title, subtitle, emoji, active, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded-3xl border-2 p-5 text-right transition shadow-sm ${active ? 'border-brand-teal bg-teal-50' : 'border-gray-200 bg-white'} ${disabled ? 'opacity-60 cursor-default' : 'hover:-translate-y-1 hover:shadow-md'}`}
  >
    <div className="flex items-start gap-4">
      <div className="text-4xl shrink-0">{emoji}</div>
      <div>
        <p className="text-xl font-black text-brand-dark-blue">{title}</p>
        <p className="text-sm text-brand-dark-blue/60 mt-1 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  </button>
);

const SummaryHeader: React.FC<{ activeChapter: SummaryChapter; onBack: () => void; onSelect: (chapter: SummaryChapter) => void; }> = ({ activeChapter, onBack, onSelect }) => (
  <div className="space-y-5">
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <p className="text-brand-dark-blue/60 text-sm font-bold tracking-wide uppercase">פעילות סיכום — חכם בכיס</p>
        <h2 className="text-4xl font-black text-brand-dark-blue">סוגרים את התוכנית כמו מקצוענים</h2>
      </div>
      <button onClick={onBack} className="px-4 py-2 rounded-full bg-brand-magenta text-white font-bold hover:bg-pink-700 text-sm">
        ← חזרה
      </button>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <ChapterChip
        title="פרק 1 · איך היה לי"
        subtitle="ענן מילים חי שבו המילים החוזרות גדלות בזמן אמת"
        emoji="☁️"
        active={activeChapter === 'reflection'}
        onClick={() => onSelect('reflection')}
      />
      <ChapterChip
        title="פרק 2 · המקצוענים!"
        subtitle="מירוץ קבוצתי למילוי כוסות דרך טלפונים ו-QR"
        emoji="🏆"
        active={activeChapter === 'professionals'}
        onClick={() => onSelect('professionals')}
      />
      <ChapterChip
        title="פרק 3 · בקרוב"
        subtitle="הפרק הבא ייכנס בהמשך לאותו מודול סיכום"
        emoji="✨"
        active={activeChapter === 'coming-soon'}
        onClick={() => onSelect('coming-soon')}
      />
    </div>
  </div>
);

const ReflectionChapter: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState(0);
  const [peerError, setPeerError] = useState<string | null>(null);
  const peerRef = useRef<Peer | null>(null);

  const qrUrl = peerId ? `${getBaseUrl()}#wordcloud-player-${peerId}` : null;

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;
    peer.on('open', id => setPeerId(id));
    peer.on('error', error => setPeerError(String(error)));
    peer.on('connection', conn => {
      conn.on('data', raw => {
        const msg = raw as Msg;
        if (msg.type !== 'WORDS') return;
        const valid = msg.words.map(word => word.trim()).filter(Boolean);
        if (valid.length > 0) {
          setAllWords(prev => [...prev, ...valid]);
          setSubmissions(prev => prev + 1);
        }
      });
    });
    return () => {
      peer.destroy();
      peerRef.current = null;
    };
  }, []);

  const cloud = buildCloud(allWords);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-brand-dark-blue/60 text-sm font-bold tracking-wide uppercase">פרק 1 מתוך 3</p>
          <h3 className="text-3xl font-black text-brand-dark-blue">☁️ איך היה לי?</h3>
        </div>
        {allWords.length > 0 && (
          <button
            onClick={() => { setAllWords([]); setSubmissions(0); }}
            className="px-4 py-2 rounded-full bg-gray-100 text-brand-dark-blue font-bold hover:bg-gray-200 text-sm border border-gray-300"
          >
            🔄 נקה ענן
          </button>
        )}
      </div>

      {peerError && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-bold">
          שגיאת חיבור: {peerError}
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-6 items-start">
        <div className="md:col-span-2 rounded-3xl border-2 border-dashed border-gray-200 bg-white p-6 flex flex-col items-center gap-4 shadow-sm">
          <p className="text-xl font-bold text-brand-dark-blue">סרקו להזין מילים 📱</p>
          {qrUrl
            ? <QRCodeSVG value={qrUrl} size={200} bgColor="#fff" fgColor="#1b2550" level="M" />
            : <div className="w-48 h-48 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 cloud-wait text-4xl">☁️</div>}
          <p className="text-sm text-gray-500 text-center">כל משתתף מזין עד 3 מילים שמתארות את החוויה שלו</p>
          <div className="flex gap-4 text-center mt-1">
            <div className="bg-teal-50 rounded-2xl px-5 py-2">
              <p className="text-2xl font-black text-teal-700">{submissions}</p>
              <p className="text-xs text-teal-600 font-bold">הגשות</p>
            </div>
            <div className="bg-blue-50 rounded-2xl px-5 py-2">
              <p className="text-2xl font-black text-blue-700">{allWords.length}</p>
              <p className="text-xs text-blue-600 font-bold">מילים</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 rounded-3xl border-2 border-dashed border-gray-200 bg-white shadow-sm flex items-center justify-center" style={{ minHeight: 320, padding: '32px 24px' }}>
          {cloud.length === 0 ? (
            <p className="text-gray-300 text-2xl font-bold cloud-wait">ממתין למילים...</p>
          ) : (
            <div className="flex flex-wrap gap-x-5 gap-y-3 items-center justify-center">
              {cloud.map(({ word, size, color, count }) => (
                <span
                  key={word}
                  className="word-pop"
                  title={`הופיע ${count} ${count === 1 ? 'פעם' : 'פעמים'}`}
                  style={{
                    fontSize: size,
                    color,
                    fontWeight: size >= 42 ? 900 : size >= 28 ? 700 : 600,
                    lineHeight: 1.2,
                    cursor: 'default',
                    userSelect: 'none',
                    transition: 'font-size 0.4s ease',
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-brand-dark-blue/50">
        המילים מתעדכנות בזמן אמת · גודל המילה משקף כמה משתתפים כתבו אותה
      </div>
    </div>
  );
};

const CupTeamCard: React.FC<{ team: ProsTeamState; index: number; target: number; }> = ({ team, index, target }) => {
  const percent = Math.min((team.progress / Math.max(target, 1)) * 100, 100);
  const color = getCupColor(index);
  const rewardText = team.finishedRank ? `${team.reward.toLocaleString()} ₪` : 'במרוץ';

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xl font-black text-brand-dark-blue">{team.name}</p>
          <p className="text-sm text-brand-dark-blue/60">{team.progress.toFixed(1)} נק' מילוי מתוך {target}</p>
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-brand-dark-blue/50">מיקום</p>
          <p className="text-lg font-black" style={{ color }}>{team.finishedRank ? `#${team.finishedRank}` : '—'}</p>
        </div>
      </div>

      <div className="relative mx-auto" style={{ width: 120, height: 170 }}>
        <div className="absolute inset-x-0 bottom-0 rounded-b-[34px] border-[6px] border-t-[10px] border-gray-300 bg-slate-50 overflow-hidden" style={{ height: 152, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
          <div
            className="absolute inset-x-0 bottom-0 transition-all duration-300 cup-bubble"
            style={{
              height: `${percent}%`,
              background: `linear-gradient(180deg, ${color}88 0%, ${color} 100%)`,
            }}
          />
        </div>
        <div className="absolute inset-x-3 top-0 h-5 rounded-full border-4 border-gray-300 bg-white" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl px-3 py-2" style={{ background: `${color}18` }}>
          <p className="text-xs font-bold text-brand-dark-blue/60">מילוי</p>
          <p className="text-xl font-black" style={{ color }}>{Math.round(percent)}%</p>
        </div>
        <div className="rounded-2xl px-3 py-2 bg-amber-50">
          <p className="text-xs font-bold text-brand-dark-blue/60">פרס</p>
          <p className="text-xl font-black text-amber-700">{rewardText}</p>
        </div>
      </div>
    </div>
  );
};

const ProfessionalsChapter: React.FC = () => {
  const [phase, setPhase] = useState<ProsPhase>('setup');
  const [teamInputs, setTeamInputs] = useState(['קבוצה א', 'קבוצה ב']);
  const [teams, setTeams] = useState<ProsTeamState[]>([]);
  const [players, setPlayers] = useState<ProsPlayerEntry[]>([]);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [peerError, setPeerError] = useState<string | null>(null);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const playersRef = useRef<ProsPlayerEntry[]>([]);
  const teamsRef = useRef<ProsTeamState[]>([]);
  const phaseRef = useRef<ProsPhase>('setup');
  const targetRef = useRef(DEFAULT_TARGET);
  const tapCounterRef = useRef<Map<string, number>>(new Map());
  const activeQuestionRef = useRef<Map<string, ProsQuestion>>(new Map());

  const qrUrl = peerId ? `${getBaseUrl()}#pros-player-${peerId}` : null;

  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { teamsRef.current = teams; }, [teams]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { targetRef.current = target; }, [target]);

  const broadcast = useCallback((msg: Msg) => {
    connectionsRef.current.forEach(conn => {
      try { conn.send(msg); } catch {}
    });
  }, []);

  const broadcastState = useCallback((nextTeams: ProsTeamState[], nextPhase: ProsPhase) => {
    broadcast({ type: 'PROS_STATE', teams: nextTeams, target: targetRef.current, phase: nextPhase });
  }, [broadcast]);

  const getTeamSize = useCallback((teamName: string) => {
    return Math.max(playersRef.current.filter(player => player.team === teamName).length, 1);
  }, []);

  const updateTeamProgress = useCallback((teamName: string, delta: number) => {
    setTeams(prev => {
      let nextRank = prev.filter(team => team.finishedRank !== null).length;
      const next = prev.map(team => {
        if (team.name !== teamName) return team;
        if (team.finishedRank !== null && delta >= 0) return team;

        const nextProgress = roundProgress(Math.min(Math.max(team.progress + delta, 0), targetRef.current));
        if (nextProgress < targetRef.current || team.finishedRank !== null) {
          return { ...team, progress: nextProgress };
        }

        nextRank += 1;
        return {
          ...team,
          progress: targetRef.current,
          finishedRank: nextRank,
          reward: RANK_REWARDS[nextRank - 1] ?? 0,
        };
      });

      const done = next.every(team => team.finishedRank !== null || team.progress >= targetRef.current);
      const nextPhase = done ? 'done' : 'race';
      if (done) setPhase('done');
      broadcastState(next, nextPhase);
      return next;
    });
  }, [broadcastState]);

  const sendQuestionToPlayer = useCallback((connId: string) => {
    const conn = connectionsRef.current.get(connId);
    if (!conn) return;
    const previous = activeQuestionRef.current.get(connId);
    const question = getRandomQuestion(previous?.id ?? null);
    activeQuestionRef.current.set(connId, question);
    try { conn.send({ type: 'PROS_QUESTION', question, result: null } as Msg); } catch {}
  }, []);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;
    peer.on('open', id => setPeerId(id));
    peer.on('error', error => setPeerError(String(error)));
    peer.on('connection', conn => {
      const connId = conn.peer;
      connectionsRef.current.set(connId, conn);

      conn.on('open', () => {
        try { conn.send({ type: 'PROS_TEAMS', teams: teamsRef.current.map(team => team.name) } as Msg); } catch {}
        try { conn.send({ type: 'PROS_STATE', teams: teamsRef.current, target: targetRef.current, phase: phaseRef.current } as Msg); } catch {}
        if (phaseRef.current === 'race' || phaseRef.current === 'done') {
          try { conn.send({ type: 'PROS_START', target: targetRef.current } as Msg); } catch {}
        }
      });

      conn.on('data', raw => {
        const msg = raw as Msg;

        if (msg.type === 'PROS_JOIN') {
          const player: ProsPlayerEntry = { connId, name: msg.name, team: msg.team, conn };
          setPlayers(prev => {
            const next = [...prev.filter(entry => entry.connId !== connId), player];
            return next;
          });
          tapCounterRef.current.set(connId, 0);
          try { conn.send({ type: 'PROS_STATE', teams: teamsRef.current, target: targetRef.current, phase: phaseRef.current } as Msg); } catch {}
          return;
        }

        if (msg.type === 'PROS_TAP') {
          if (phaseRef.current !== 'race') return;
          if (activeQuestionRef.current.has(connId)) return;
          const player = playersRef.current.find(entry => entry.connId === connId);
          if (!player) return;

          const teamSize = getTeamSize(player.team);
          updateTeamProgress(player.team, getNormalizedDelta(TAP_PROGRESS, teamSize));

          const currentTaps = (tapCounterRef.current.get(connId) ?? 0) + 1;
          tapCounterRef.current.set(connId, currentTaps);
          if (currentTaps >= TAPS_PER_QUESTION) {
            tapCounterRef.current.set(connId, 0);
            sendQuestionToPlayer(connId);
          }
          return;
        }

        if (msg.type === 'PROS_ANSWER') {
          if (phaseRef.current !== 'race') return;
          const player = playersRef.current.find(entry => entry.connId === connId);
          const question = activeQuestionRef.current.get(connId);
          if (!player || !question || question.id !== msg.questionId) return;

          const correct = msg.answerIndex === question.correctIndex;
          activeQuestionRef.current.delete(connId);
          const teamSize = getTeamSize(player.team);
          const delta = correct ? getNormalizedDelta(QUESTION_BONUS, teamSize) : -getNormalizedDelta(QUESTION_PENALTY, teamSize);
          updateTeamProgress(player.team, delta);
          try { conn.send({ type: 'PROS_QUESTION', question: null, result: correct ? 'correct' : 'wrong' } as Msg); } catch {}
        }
      });

      conn.on('close', () => {
        connectionsRef.current.delete(connId);
        tapCounterRef.current.delete(connId);
        activeQuestionRef.current.delete(connId);
        setPlayers(prev => prev.filter(entry => entry.connId !== connId));
      });
      conn.on('error', () => {
        connectionsRef.current.delete(connId);
        tapCounterRef.current.delete(connId);
        activeQuestionRef.current.delete(connId);
        setPlayers(prev => prev.filter(entry => entry.connId !== connId));
      });
    });

    return () => {
      peer.destroy();
      peerRef.current = null;
    };
  }, [broadcastState]);

  const openLobby = () => {
    const validTeams = teamInputs.map(team => team.trim()).filter(Boolean).slice(0, 6);
    if (validTeams.length < 2) return;
    const nextTeams = validTeams.map(name => ({ name, progress: 0, finishedRank: null, reward: 0 }));
    setTeams(nextTeams);
    setPlayers([]);
    setPhase('waiting');
    tapCounterRef.current = new Map();
    activeQuestionRef.current = new Map();
    broadcast({ type: 'PROS_TEAMS', teams: validTeams });
    broadcast({ type: 'PROS_QUESTION', question: null, result: null });
    broadcastState(nextTeams, 'waiting');
  };

  const startGame = () => {
    const resetTeams = teams.map(team => ({ ...team, progress: 0, finishedRank: null, reward: 0 }));
    setTeams(resetTeams);
    setPhase('race');
    tapCounterRef.current = new Map();
    activeQuestionRef.current = new Map();
    broadcast({ type: 'PROS_QUESTION', question: null, result: null });
    broadcast({ type: 'PROS_START', target });
    broadcastState(resetTeams, 'race');
  };

  const resetRace = () => {
    const resetTeams = teams.map(team => ({ ...team, progress: 0, finishedRank: null, reward: 0 }));
    setTeams(resetTeams);
    setPhase('waiting');
    tapCounterRef.current = new Map();
    activeQuestionRef.current = new Map();
    broadcast({ type: 'PROS_QUESTION', question: null, result: null });
    broadcastState(resetTeams, 'waiting');
  };

  const sortedResults = [...teams]
    .filter(team => team.finishedRank !== null)
    .sort((a, b) => (a.finishedRank ?? 99) - (b.finishedRank ?? 99));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-brand-dark-blue/60 text-sm font-bold tracking-wide uppercase">פרק 2 מתוך 3</p>
          <h3 className="text-3xl font-black text-brand-dark-blue">🏆 המקצוענים!</h3>
          <p className="text-brand-dark-blue/60 mt-1">מחלקים משתתפים לקבוצות, סורקים QR, ולוחצים בטלפון כדי למלא את הכוס ראשונים.</p>
          <p className="text-brand-dark-blue/50 mt-1 text-sm">כל לחיצה מנורמלת לפי גודל הקבוצה, ובמהלך המשחק מופיעות שאלות שמוסיפות או מורידות מילוי.</p>
        </div>
        {phase !== 'setup' && (
          <button onClick={resetRace} className="px-4 py-2 rounded-full bg-gray-100 text-brand-dark-blue font-bold hover:bg-gray-200 text-sm border border-gray-300">
            🔄 איפוס סבב
          </button>
        )}
      </div>

      {peerError && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-bold">
          שגיאת חיבור: {peerError}
        </div>
      )}

      {phase === 'setup' && (
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h4 className="text-2xl font-black text-brand-dark-blue">הגדרת קבוצות</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {[120, 180, 240].map(value => (
                <button
                  key={value}
                  onClick={() => setTarget(value)}
                  className={`px-4 py-2 rounded-full font-bold border-2 ${target === value ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white text-brand-dark-blue border-gray-300 hover:border-brand-teal'}`}
                >
                  יעד {value}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {teamInputs.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-lg font-bold w-8 text-brand-dark-blue/50">{index + 1}.</span>
                <input
                  value={name}
                  onChange={event => setTeamInputs(prev => prev.map((entry, idx) => idx === index ? event.target.value : entry))}
                  className="flex-1 border rounded-xl px-3 py-2 text-lg border-gray-300 focus:outline-none focus:border-brand-teal"
                  placeholder={`שם קבוצה ${index + 1}`}
                />
                {teamInputs.length > 2 && (
                  <button onClick={() => setTeamInputs(prev => prev.filter((_, idx) => idx !== index))} className="text-red-400 hover:text-red-600 text-xl font-bold px-2">×</button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            {teamInputs.length < 6 && (
              <button onClick={() => setTeamInputs(prev => [...prev, `קבוצה ${prev.length + 1}`])} className="px-5 py-2 border-2 border-dashed border-gray-300 rounded-full text-brand-dark-blue/60 hover:border-brand-teal hover:text-brand-teal">
                + הוסף קבוצה
              </button>
            )}
            <button onClick={openLobby} className="px-6 py-2 bg-brand-teal text-white font-bold rounded-full hover:bg-teal-700">
              פתח התחברות לקבוצות ←
            </button>
          </div>
        </div>
      )}

      {phase !== 'setup' && (
        <div className="grid xl:grid-cols-3 gap-6 items-start">
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-6 shadow-sm space-y-4 xl:sticky xl:top-4">
            <div className="text-center">
              <p className="text-xl font-bold text-brand-dark-blue">סרקו והצטרפו לקבוצה 📱</p>
              {qrUrl
                ? <div className="mt-4 flex justify-center"><QRCodeSVG value={qrUrl} size={200} bgColor="#fff" fgColor="#1b2550" level="M" /></div>
                : <div className="mt-4 w-48 h-48 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 cloud-wait text-4xl mx-auto">🏆</div>}
              <p className="text-sm text-gray-500 mt-3">כל משתתף בוחר שם וקבוצה. במשחק עצמו לוחצים מהר, אבל מדי פעם צריך גם לענות על שאלת ידע.</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <p className="font-bold text-brand-dark-blue">סטטוס</p>
              <p className="text-sm text-brand-dark-blue/70 mt-1">
                {phase === 'waiting' && 'ממתינים להצטרפות וללחיצה על התחל משחק'}
                {phase === 'race' && 'המשחק פעיל — לחיצות ושאלות מזיזות את המילוי של הקבוצה'}
                {phase === 'done' && 'המשחק הסתיים — הדירוג והכסף חושבו'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-brand-dark-blue">{players.length} משתתפים מחוברים</p>
                {phase === 'waiting' && (
                  <button onClick={startGame} disabled={players.length === 0} className="px-5 py-2 bg-brand-teal text-white font-bold rounded-full hover:bg-teal-700 disabled:opacity-40">
                    התחל משחק 🚀
                  </button>
                )}
              </div>
              {teams.map(team => {
                const teamPlayers = players.filter(player => player.team === team.name);
                return (
                  <div key={team.name} className="rounded-xl p-3 border border-gray-200 bg-white">
                    <p className="font-bold text-sm text-brand-dark-blue/70 mb-2">{team.name} ({teamPlayers.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {teamPlayers.length === 0
                        ? <span className="text-xs text-gray-400">אין שחקנים עדיין</span>
                        : teamPlayers.map(player => <span key={`${team.name}-${player.connId}`} className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded-full">{player.name}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team, index) => (
                <CupTeamCard key={team.name} team={team} index={index} target={target} />
              ))}
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <p className="text-brand-dark-blue/60 text-sm font-bold">תוצאות כספיות</p>
                  <h4 className="text-2xl font-black text-brand-dark-blue">מי הכי מקצוענים?</h4>
                </div>
                <div className="text-sm text-brand-dark-blue/60">דירוג אוטומטי לפי סדר השלמת הכוס</div>
              </div>

              {sortedResults.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-brand-dark-blue/50 font-bold">
                  הדירוג יופיע כאן ברגע שקבוצה תשלים את הכוס
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedResults.map(team => (
                    <div key={team.name} className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <div>
                        <p className="text-lg font-black text-brand-dark-blue">#{team.finishedRank} · {team.name}</p>
                        <p className="text-sm text-brand-dark-blue/60">{team.progress.toFixed(1)} נקודות מילוי</p>
                      </div>
                      <div className="text-2xl font-black text-amber-700">{team.reward.toLocaleString()} ₪</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ComingSoonChapter: React.FC = () => (
  <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-10 text-center text-brand-dark-blue/60 shadow-sm">
    <p className="text-5xl mb-3">✨</p>
    <h3 className="text-3xl font-black text-brand-dark-blue">פרק 3 בדרך</h3>
    <p className="text-lg mt-3">כשתרצה, נמשיך לבנות את הפרק השלישי בתוך אותו מודול סיכום.</p>
  </div>
);

export const WordCloudHost: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeChapter, setActiveChapter] = useState<SummaryChapter>('reflection');

  return (
    <div className="space-y-6" dir="rtl">
      <style>{WORD_CSS}</style>
      <SummaryHeader activeChapter={activeChapter} onBack={onBack} onSelect={setActiveChapter} />
      {activeChapter === 'reflection' && <ReflectionChapter />}
      {activeChapter === 'professionals' && <ProfessionalsChapter />}
      {activeChapter === 'coming-soon' && <ComingSoonChapter />}
    </div>
  );
};

const ReflectionPlayerView: React.FC = () => {
  const match = window.location.hash.match(/#wordcloud-player-(.+)/);
  const hostId = match ? match[1] : null;
  const [words, setWords] = useState(['', '', '']);
  const [status, setStatus] = useState<'connecting' | 'ready' | 'sent' | 'error'>('connecting');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const peerRef = useRef<Peer | null>(null);

  const send = useCallback((msg: Msg) => { try { connRef.current?.send(msg); } catch {} }, []);

  useEffect(() => {
    if (!hostId) { setStatus('error'); return; }
    const peer = new Peer();
    peerRef.current = peer;
    peer.on('open', () => {
      const conn = peer.connect(hostId);
      connRef.current = conn;
      conn.on('open', () => setStatus('ready'));
      conn.on('close', () => setStatus('error'));
      conn.on('error', error => { setErrorDetail(String(error)); setStatus('error'); });
    });
    peer.on('error', error => { setErrorDetail(String(error)); setStatus('error'); });
    return () => { peer.destroy(); peerRef.current = null; };
  }, [hostId]);

  const submit = () => {
    const valid = words.map(word => word.trim()).filter(Boolean);
    if (valid.length === 0) return;
    send({ type: 'WORDS', words: valid });
    setStatus('sent');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dbeafe)', fontFamily: 'system-ui, sans-serif' }} dir="rtl">
      <style>{WORD_CSS}</style>
      {status === 'connecting' && (
        <div className="text-center space-y-4">
          <div className="text-6xl cloud-wait">☁️</div>
          <p className="text-xl font-bold text-gray-700">מתחבר...</p>
        </div>
      )}
      {status === 'ready' && (
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <p className="text-5xl mb-2">☁️</p>
            <h2 className="text-2xl font-black text-brand-dark-blue">איך היה לי?</h2>
            <p className="text-gray-500 mt-1 text-sm leading-relaxed">כתבו עד 3 מילים שמתארות את החוויה, הרגש או מה שהכי זכור לכם</p>
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map(index => (
              <input
                key={index}
                value={words[index]}
                onChange={event => setWords(prev => prev.map((word, idx) => idx === index ? event.target.value : word))}
                placeholder={`מילה ${index + 1}${index === 0 ? ' *' : ' (אופציונלי)'}`}
                maxLength={24}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl text-center focus:outline-none focus:border-teal-500 transition"
              />
            ))}
          </div>
          <button onClick={submit} disabled={words.every(word => !word.trim())} className="w-full py-3 text-xl font-black rounded-full text-white transition disabled:opacity-40" style={{ background: '#0d9488' }}>
            שלח ✉️
          </button>
        </div>
      )}
      {status === 'sent' && (
        <div className="text-center space-y-5 bg-white rounded-3xl p-10 shadow-2xl border-4 border-teal-200">
          <p className="text-7xl">✅</p>
          <p className="text-2xl font-black text-gray-700">תודה!</p>
          <p className="text-gray-500 text-sm">המילים שלך מופיעות עכשיו בענן המשותף</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {words.filter(word => word.trim()).map(word => (
              <span key={word} className="bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full text-sm">{word.trim()}</span>
            ))}
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center space-y-3">
          <p className="text-4xl">⚠️</p>
          <p className="text-xl font-bold text-gray-700">שגיאת חיבור — סרקו מחדש</p>
          {errorDetail && <p className="text-xs text-gray-500 max-w-xs break-words">{errorDetail}</p>}
        </div>
      )}
    </div>
  );
};

const ProfessionalsPlayerView: React.FC = () => {
  const match = window.location.hash.match(/#pros-player-(.+)/);
  const hostId = match ? match[1] : null;
  const [status, setStatus] = useState<'connecting' | 'join' | 'waiting' | 'game' | 'done' | 'error'>('connecting');
  const [teams, setTeams] = useState<string[]>([]);
  const [myName, setMyName] = useState('');
  const [myTeam, setMyTeam] = useState('');
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [phase, setPhase] = useState<ProsPhase>('waiting');
  const [teamStates, setTeamStates] = useState<ProsTeamState[]>([]);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ProsQuestion | null>(null);
  const [questionResult, setQuestionResult] = useState<'correct' | 'wrong' | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const peerRef = useRef<Peer | null>(null);

  const send = useCallback((msg: Msg) => { try { connRef.current?.send(msg); } catch {} }, []);

  useEffect(() => {
    if (!hostId) { setStatus('error'); return; }
    const peer = new Peer();
    peerRef.current = peer;
    peer.on('open', () => {
      const conn = peer.connect(hostId);
      connRef.current = conn;
      conn.on('open', () => setStatus('join'));
      conn.on('data', raw => {
        const msg = raw as Msg;
        if (msg.type === 'PROS_TEAMS') {
          setTeams(msg.teams);
        }
        if (msg.type === 'PROS_STATE') {
          setTeamStates(msg.teams);
          setTarget(msg.target);
          setPhase(msg.phase);
          if (msg.phase === 'race' && myTeam) setStatus('game');
          if (msg.phase === 'done' && myTeam) setStatus('done');
        }
        if (msg.type === 'PROS_QUESTION') {
          setCurrentQuestion(msg.question);
          if (msg.result) {
            setQuestionResult(msg.result);
            setTimeout(() => setQuestionResult(null), 900);
          }
        }
        if (msg.type === 'PROS_START') {
          setTarget(msg.target);
          setStatus('game');
        }
      });
      conn.on('close', () => setStatus('error'));
      conn.on('error', error => { setErrorDetail(String(error)); setStatus('error'); });
    });
    peer.on('error', error => { setErrorDetail(String(error)); setStatus('error'); });
    return () => { peer.destroy(); peerRef.current = null; };
  }, [hostId, myTeam]);

  const join = () => {
    if (!myName.trim() || !myTeam) return;
    send({ type: 'PROS_JOIN', name: myName.trim(), team: myTeam });
    setStatus(phase === 'race' ? 'game' : 'waiting');
  };

  const tap = () => send({ type: 'PROS_TAP' });
  const answerQuestion = (answerIndex: number) => {
    if (!currentQuestion) return;
    send({ type: 'PROS_ANSWER', questionId: currentQuestion.id, answerIndex });
  };
  const myState = teamStates.find(team => team.name === myTeam) ?? null;
  const fill = myState ? Math.min((myState.progress / Math.max(target, 1)) * 100, 100) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #eff6ff, #ecfccb)', fontFamily: 'system-ui, sans-serif' }} dir="rtl">
      <style>{WORD_CSS}</style>
      {status === 'connecting' && (
        <div className="text-center space-y-4">
          <div className="text-6xl cloud-wait">🏆</div>
          <p className="text-xl font-bold text-gray-700">מתחבר...</p>
        </div>
      )}

      {status === 'join' && (
        <div className="w-full max-w-sm space-y-4 bg-white rounded-3xl shadow-2xl p-6">
          <div className="text-center">
            <p className="text-5xl mb-2">🏆</p>
            <h2 className="text-2xl font-black text-brand-dark-blue">המקצוענים!</h2>
            <p className="text-gray-500 mt-1 text-sm">בחרו שם והשתייכו לקבוצה שלכם</p>
          </div>
          <input
            value={myName}
            onChange={event => setMyName(event.target.value)}
            placeholder="השם שלך"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl text-center focus:outline-none focus:border-brand-teal"
          />
          <select
            value={myTeam}
            onChange={event => setMyTeam(event.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl text-center focus:outline-none focus:border-brand-teal"
          >
            <option value="">בחר קבוצה</option>
            {teams.map(team => <option key={team} value={team}>{team}</option>)}
          </select>
          <button onClick={join} disabled={!myName.trim() || !myTeam} className="w-full py-3 text-xl font-black rounded-full text-white disabled:opacity-40" style={{ background: '#0d9488' }}>
            הצטרף 🚀
          </button>
        </div>
      )}

      {status === 'waiting' && (
        <div className="text-center space-y-4 bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full">
          <p className="text-6xl">⏳</p>
          <p className="text-2xl font-black text-gray-700">ממתין להתחלה...</p>
          <p className="text-gray-500">{myName} · {myTeam}</p>
          {myState && <p className="text-brand-dark-blue/60 text-sm">יעד הקבוצה: {target} נקודות מילוי</p>}
        </div>
      )}

      {status === 'game' && (
        <div className="w-full max-w-md space-y-5">
          {currentQuestion ? (
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-5 border-2 border-amber-200">
              <div className="text-center">
                <p className="text-sm font-bold text-brand-dark-blue/60">{myTeam}</p>
                <p className="text-xs font-bold text-brand-dark-blue/50 mt-1">שאלת ידע · {currentQuestion.module}</p>
                <p className="text-2xl font-black text-brand-dark-blue mt-2">{currentQuestion.prompt}</p>
                <p className="text-sm text-brand-dark-blue/60 mt-2">בחרו תשובה כדי לחזור למשחק</p>
              </div>
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={`${currentQuestion.id}-${index}`}
                    onClick={() => answerQuestion(index)}
                    className="rounded-2xl border-2 border-gray-200 bg-slate-50 text-brand-dark-blue font-bold text-lg py-4 px-4 hover:border-brand-teal hover:bg-teal-50 transition"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow-xl p-5 text-center">
                <p className="text-sm text-brand-dark-blue/60">{myTeam}</p>
                <p className="text-3xl font-black text-brand-dark-blue">מלאו את הכוס!</p>
                <p className="text-sm text-brand-dark-blue/60 mt-1">כל לחיצה מוסיפה מעט נפח. השאלות שבדרך יכולות להעלות או להוריד צבירה.</p>
                <div className="mt-4 mx-auto relative" style={{ width: 130, height: 180 }}>
                  <div className="absolute inset-x-0 bottom-0 rounded-b-[34px] border-[6px] border-t-[10px] border-gray-300 bg-slate-50 overflow-hidden" style={{ height: 160, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                    <div className="absolute inset-x-0 bottom-0 transition-all duration-200" style={{ height: `${fill}%`, background: 'linear-gradient(180deg,#14b8a6 0%,#0d9488 100%)' }} />
                  </div>
                  <div className="absolute inset-x-3 top-0 h-5 rounded-full border-4 border-gray-300 bg-white" />
                </div>
                <p className="mt-3 text-xl font-black text-teal-700">{Math.round(fill)}%</p>
                {myState && <p className="text-sm text-brand-dark-blue/60">{myState.progress.toFixed(1)} מתוך {target} נקודות מילוי</p>}
                {questionResult && (
                  <p className={`mt-2 text-lg font-black ${questionResult === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
                    {questionResult === 'correct' ? '✅ נכון! הוספתם מילוי' : '❌ לא נכון, קצת מילוי ירד'}
                  </p>
                )}
              </div>

            <div className="grid grid-cols-2 gap-4">
              <button onPointerDown={tap} onClick={tap} className="rounded-3xl bg-brand-teal text-white font-black text-2xl py-10 shadow-xl active:scale-95 transition">
                ⚡ דחיפה
              </button>
              <button onPointerDown={tap} onClick={tap} className="rounded-3xl bg-brand-magenta text-white font-black text-2xl py-10 shadow-xl active:scale-95 transition">
                🚀 עוד!
              </button>
            </div>
            </>
          )}
        </div>
      )}

      {status === 'done' && (
        <div className="text-center space-y-5 bg-white rounded-3xl p-10 shadow-2xl border-4 border-amber-200 max-w-sm w-full">
          <p className="text-7xl">🏁</p>
          <p className="text-2xl font-black text-gray-700">הסבב הסתיים!</p>
          {myState?.finishedRank ? (
            <>
              <p className="text-xl font-bold text-brand-dark-blue">הקבוצה שלכם סיימה במקום #{myState.finishedRank}</p>
              <p className="text-4xl font-black text-amber-700">{myState.reward.toLocaleString()} ₪</p>
            </>
          ) : (
            <p className="text-lg text-brand-dark-blue/70">הקבוצה שלכם לא נכנסה לדירוג הכספי בסבב הזה</p>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="text-center space-y-3">
          <p className="text-4xl">⚠️</p>
          <p className="text-xl font-bold text-gray-700">שגיאת חיבור — סרקו מחדש</p>
          {errorDetail && <p className="text-xs text-gray-500 max-w-xs break-words">{errorDetail}</p>}
        </div>
      )}
    </div>
  );
};

export const WordCloudPlayerView: React.FC = () => {
  if (window.location.hash.startsWith('#pros-player-')) {
    return <ProfessionalsPlayerView />;
  }
  return <ReflectionPlayerView />;
};
