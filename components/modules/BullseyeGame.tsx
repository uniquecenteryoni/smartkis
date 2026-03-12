import React, { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

// ─── Questions ───────────────────────────────────────────────────────────────
interface SQ { prompt: string; options: string[]; correct: number; }
const QUESTIONS: SQ[] = [
  { prompt: 'מהו שכר מינימום?', options: ['השכר הכי נמוך שמותר לשלם לעובד', 'ממוצע השכר במשק', 'שכר מנהלים', 'תשלום לביטוח לאומי'], correct: 0 },
  { prompt: 'מה זה מינוס בחשבון בנק?', options: ['חוב לבנק – הוצאת יותר ממה שנכנס', 'חיסכון חודשי', 'ריבית חיובית', 'קרן השתלמות'], correct: 0 },
  { prompt: 'מהי ריבית דריבית?', options: ['ריבית שמצטברת גם על הריבית', 'ריבית קבועה בלבד', 'החזר מס', 'דמי ניהול'], correct: 0 },
  { prompt: 'מה כולל שכר ברוטו?', options: ['שכר לפני כל הניכויים', 'שכר אחרי מס', 'רק שכר הבסיס', 'שכר נטו בלבד'], correct: 0 },
  { prompt: 'מהי קרן ההשתלמות?', options: ['חיסכון לטווח בינוני עם הטבת מס', 'ביטוח בריאות', 'תשלום ביטוח לאומי', 'קופת גמל לפנסיה'], correct: 0 },
  { prompt: 'מהו ניכוי חובה בתלוש שכר?', options: ['מס הכנסה, ביטוח לאומי ופנסיה', 'קרן השתלמות בלבד', 'דמי ניהול', 'עמלת בנק'], correct: 0 },
  { prompt: 'מה זה תקציב מאוזן?', options: ['הכנסות שוות הוצאות', 'הוצאות גדולות מהכנסות', 'חיסכון של 50%', 'הכנסות גדולות בלבד'], correct: 0 },
  { prompt: 'מהו יבוא?', options: ['קנייה מחו"ל למדינה', 'מכירה לחו"ל', 'ייצור מקומי', 'ייצוא גדול'], correct: 0 },
  { prompt: 'מהו יצוא?', options: ['מכירה לחו"ל', 'קנייה מחו"ל', 'ייבוא מוצרים', 'ביטוח יצואנים'], correct: 0 },
  { prompt: 'מה זה מונופול?', options: ['ספק בודד שולט בשוק', 'שוק תחרותי', 'חברה ממשלתית', 'שותפות עסקית'], correct: 0 },
  { prompt: 'מה מטרת הבנק המרכזי?', options: ['ניהול מדיניות מוניטרית וייצוב מחירים', 'מתן הלוואות לפרטים', 'ניהול הבורסה', 'גביית מסים'], correct: 0 },
  { prompt: 'מהי אינפלציה?', options: ['עלייה כללית ברמת המחירים', 'ירידה במחירים', 'ריבית קבועה', 'עלייה בשכר בלבד'], correct: 0 },
  { prompt: 'מהו MVP ביזמות?', options: ['גרסה מינימלית לבדיקת רעיון', 'המנהל הטוב ביותר', 'תוכנית שיווק', 'מנהל הפרויקט'], correct: 0 },
  { prompt: 'מהי עלות הזדמנות?', options: ['ערך הדבר שוויתרת עליו כשבחרת', 'עלות ייצור', 'מחיר קנייה', 'הוצאה קבועה'], correct: 0 },
  { prompt: 'מהי פנסיה?', options: ['חיסכון חובה לגיל פרישה', 'ביטוח רכב', 'הלוואה חוץ-בנקאית', 'קרן חירום'], correct: 0 },
  { prompt: 'מה ההבדל בין שכיר לעצמאי?', options: ['שכיר מקבל שכר קבוע, עצמאי מנהל עסק', 'שניהם זהים', 'עצמאי מקבל שכר גבוה יותר תמיד', 'שכיר לא משלם מס'], correct: 0 },
  { prompt: 'מהי דיבידנד?', options: ['חלוקת רווחים לבעלי מניות', 'סוג הלוואה', 'תשלום ריבית על חוב', 'מס רכישה'], correct: 0 },
  { prompt: 'מה משמעות תשואה?', options: ['הרווח ביחס להשקעה', 'הפסד בשוק', 'ריבית על הלוואה', 'ניכוי מס'], correct: 0 },
  { prompt: 'מהי קצבת ילדים?', options: ['תשלום ביטוח לאומי למשפחות', 'מלגת לימודים', 'הלוואה לצעירים', 'הנחה ממס'], correct: 0 },
  { prompt: 'מה זה ניהול סיכונים?', options: ['זיהוי והפחתת אפשרויות הפסד', 'הימור בבורסה', 'ביטוח חיים', 'חיסכון בלבד'], correct: 0 },
  { prompt: 'מהי הטיית עיגון?', options: ['נתפסים למחיר הראשון שמוצג', 'שוכחים לשלם', 'ריבית נסתרת', 'הטיית זמן'], correct: 0 },
  { prompt: 'מה זה תקציב מעטפות?', options: ['חלוקה לקטגוריות עם תקרה לכל אחת', 'מעטפות דואר', 'הלוואה', 'הגרלה'], correct: 0 },
  { prompt: 'מהו אפקט רשת?', options: ['ערך שעולה ככל שיש יותר משתמשים', 'בעיה ברשת האינטרנט', 'שיווק ברשת חברתית', 'תשלום חכם'], correct: 0 },
  { prompt: 'מהי נקודת איזון בעסק?', options: ['כשההכנסות שוות ההוצאות', 'כשיש רווח מקסימלי', 'כשיש הפסד', 'כשאין מס'], correct: 0 },
  { prompt: 'מה זה שעות נוספות 125%?', options: ['תוספת 25% על שכר בשעות נוספות ראשונות', 'תגמול מיוחד', 'פנסיה נוספת', 'ביטוח תאונות'], correct: 0 },
];
const pickQ = (): SQ => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

// ─── Types ────────────────────────────────────────────────────────────────────
type Side = 'top' | 'bottom' | 'left' | 'right';
type Phase = 'lobby' | 'playing' | 'question' | 'gameover';

interface PlayerState {
  id: number; side: Side; color: string; darkColor: string; emoji: string;
  name: string; lives: number; score: number; gkPos: number; active: boolean;
}
interface BallState { x: number; y: number; vx: number; vy: number; }
interface GameState {
  phase: Phase;
  players: PlayerState[];
  ball: BallState;
  questionPlayerId: number | null;
  question: SQ | null;
  questionTimeLeft: number;
  questionAnswered: boolean;
  answerWasCorrect: boolean | null;
  winnerName: string | null;
  lastMsg: string;
}
interface Msg {
  type: 'JOIN' | 'MOVE' | 'ANSWER' | 'STATE';
  playerId?: number; name?: string; delta?: number;
  answerIdx?: number; state?: GameState;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CW = 800, CH = 600;
const BALL_R = 13;
const BALL_SPEED = 9;
const GK_MOVE = 0.022;
const BOUNCE_BOOST = 1.06;  // slight speed bump on GK bounce
const MAX_BALL_SPEED = 30;

// Goal = original 75% × 0.75 = 56.25% of edge (−25%)
const GOAL_H = CW * 0.5625;          // ≈ 450px  (top/bottom)
const GOAL_V = CH * 0.5625;          // ≈ 337.5px (left/right)
const GOAL_H_START = (CW - GOAL_H) / 2;  // ≈ 175px
const GOAL_V_START = (CH - GOAL_V) / 2;  // ≈ 131.25px

// GK radius = 15% of goal × 0.5 (−50%)
const GKR_H = GOAL_H * 0.15 * 0.5;  // ≈ 33.75px
const GKR_V = GOAL_V * 0.15 * 0.5;  // ≈ 25.3px

const PLAYER_DEFS: Pick<PlayerState, 'id' | 'side' | 'color' | 'darkColor' | 'emoji'>[] = [
  { id: 0, side: 'top',    color: '#3b82f6', darkColor: '#1d4ed8', emoji: '🔵' },
  { id: 1, side: 'bottom', color: '#ef4444', darkColor: '#b91c1c', emoji: '🔴' },
  { id: 2, side: 'left',   color: '#f59e0b', darkColor: '#b45309', emoji: '🟡' },
  { id: 3, side: 'right',  color: '#22c55e', darkColor: '#15803d', emoji: '🟢' },
];
const SIDE_LABEL: Record<Side, string> = { top: 'צפון ↑', bottom: 'דרום ↓', left: 'מערב ←', right: 'מזרח →' };

// ─── Geometry helpers ─────────────────────────────────────────────────────────
const gkR = (side: Side) => (side === 'top' || side === 'bottom') ? GKR_H : GKR_V;

const gkCenter = (side: Side, pos: number): { cx: number; cy: number } => {
  if (side === 'top')    return { cx: GOAL_H_START + pos * GOAL_H, cy: 0 };
  if (side === 'bottom') return { cx: GOAL_H_START + pos * GOAL_H, cy: CH };
  if (side === 'left')   return { cx: 0, cy: GOAL_V_START + pos * GOAL_V };
  return { cx: CW, cy: GOAL_V_START + pos * GOAL_V };
};

const gkArcAngles = (side: Side): [number, number] => {
  if (side === 'top')    return [0,           Math.PI];
  if (side === 'bottom') return [Math.PI,     2 * Math.PI];
  if (side === 'left')   return [-Math.PI/2,  Math.PI/2];
  return [Math.PI/2,   3 * Math.PI/2];
};

const freshBall = (): BallState => {
  let a: number;
  do { a = Math.random() * Math.PI * 2; }
  while (Math.abs(Math.cos(a)) > 0.93 || Math.abs(Math.sin(a)) > 0.93);
  return { x: CW/2, y: CH/2, vx: Math.cos(a)*BALL_SPEED, vy: Math.sin(a)*BALL_SPEED };
};

const makeInitialState = (): GameState => ({
  phase: 'lobby',
  players: PLAYER_DEFS.map(p => ({ ...p, name: `שחקן ${p.id+1}`, lives: 3, score: 0, gkPos: 0.5, active: false })),
  ball: freshBall(),
  questionPlayerId: null, question: null, questionTimeLeft: 60,
  questionAnswered: false, answerWasCorrect: null,
  winnerName: null, lastMsg: '',
});

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER VIEW — Phone screen
// ═══════════════════════════════════════════════════════════════════════════════
export const BullseyePlayerView: React.FC = () => {
  const hm = window.location.hash.match(/#bullseye-player-(\d)-(.+)/);
  const playerId   = hm ? parseInt(hm[1]) : 0;
  const hostPeerId = hm ? hm[2] : null;
  const def = PLAYER_DEFS[playerId] ?? PLAYER_DEFS[0];

  const [status, setStatus]         = useState<'connecting'|'ready'|'joined'|'error'>('connecting');
  const [inputName, setInputName]   = useState('');
  const [gs, setGs]                 = useState<GameState|null>(null);
  const [answerSent, setAnswerSent] = useState(false);
  const [errMsg, setErrMsg]         = useState('');

  const connRef     = useRef<DataConnection|null>(null);
  const peerRef     = useRef<Peer|null>(null);
  const moveHoldRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    if (!hostPeerId) { setStatus('error'); setErrMsg('קישור לא תקין – סרקו מחדש'); return; }
    const peer = new Peer(); peerRef.current = peer;
    peer.on('open', () => {
      const conn = peer.connect(hostPeerId, { reliable: true }); connRef.current = conn;
      conn.on('open', () => setStatus('ready'));
      conn.on('data', raw => {
        const msg = raw as Msg;
        if (msg.type === 'STATE' && msg.state) {
          setGs(msg.state);
          if (msg.state.phase === 'playing') setAnswerSent(false);
        }
      });
      conn.on('error', e => { setStatus('error'); setErrMsg(String(e)); });
      conn.on('close', () => { setStatus('error'); setErrMsg('החיבור נסגר'); });
    });
    peer.on('error', e => { setStatus('error'); setErrMsg(String(e)); });
    return () => { peer.destroy(); };
  }, []); // eslint-disable-line

  const send = useCallback((msg: Msg) => { if (connRef.current?.open) connRef.current.send(msg); }, []);

  const join = () => {
    const name = inputName.trim() || `שחקן ${playerId+1}`;
    send({ type: 'JOIN', playerId, name }); setStatus('joined');
  };

  const startMove = (d: number) => {
    send({ type: 'MOVE', playerId, delta: d });
    moveHoldRef.current = setInterval(() => send({ type: 'MOVE', playerId, delta: d }), 80);
  };
  const stopMove = () => { if (moveHoldRef.current) { clearInterval(moveHoldRef.current); moveHoldRef.current = null; } };

  const sendAnswer = (idx: number) => {
    if (answerSent) return;
    send({ type: 'ANSWER', playerId, answerIdx: idx }); setAnswerSent(true);
  };

  const me = gs?.players[playerId];
  const isMyQuestion = gs?.phase === 'question' && gs.questionPlayerId === playerId;

  // ── Connecting screen ──────────────────────────────────────────────────
  if (status === 'connecting') return (
    <div style={{ background:`linear-gradient(135deg,${def.color},${def.darkColor})`, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
      <p style={{ fontSize:64, margin:0 }}>{def.emoji}</p>
      <p style={{ color:'#fff', fontSize:22, fontWeight:900 }}>מתחבר...</p>
      <div style={{ width:48, height:48, border:'5px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (status === 'error') return (
    <div style={{ background:'#0f172a', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:24 }}>
      <p style={{ fontSize:60 }}>❌</p>
      <p style={{ color:'#f87171', fontSize:22, fontWeight:900, textAlign:'center' }}>שגיאת חיבור</p>
      <p style={{ color:'#94a3b8', fontSize:15, textAlign:'center' }}>{errMsg}</p>
      <button onClick={() => window.location.reload()} style={{ background:'#3b82f6', color:'#fff', fontSize:18, fontWeight:900, padding:'14px 32px', borderRadius:16, border:'none', cursor:'pointer' }}>🔄 נסה שוב</button>
    </div>
  );

  if (status === 'ready') return (
    <div style={{ background:`linear-gradient(135deg,${def.color},${def.darkColor})`, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, gap:20 }}>
      <p style={{ fontSize:72, margin:0 }}>{def.emoji}</p>
      <h1 style={{ color:'#fff', fontSize:32, fontWeight:900, textAlign:'center', margin:0 }}>{SIDE_LABEL[def.side]}</h1>
      <input value={inputName} onChange={e => setInputName(e.target.value)} onKeyDown={e => e.key==='Enter'&&join()}
        placeholder="הכנס שמך..." dir="rtl" autoFocus
        style={{ fontSize:22, padding:'14px 20px', borderRadius:16, border:'3px solid rgba(255,255,255,0.5)', background:'rgba(255,255,255,0.15)', color:'#fff', width:'100%', maxWidth:320, textAlign:'center', outline:'none' }} />
      <button onClick={join} style={{ background:'#fff', color:def.color, fontSize:22, fontWeight:900, padding:'16px 48px', borderRadius:20, border:'none', cursor:'pointer' }}>✅ הצטרף</button>
    </div>
  );

  // ── In-game screen ─────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ background:'#0f172a', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', padding:16, gap:12, userSelect:'none' }}>

      {/* Header */}
      <div style={{ width:'100%', maxWidth:420, background:'rgba(255,255,255,0.07)', borderRadius:18, padding:'10px 18px', border:`2px solid ${def.color}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:30 }}>{def.emoji}</span>
          <div style={{ textAlign:'center' }}>
            <p style={{ margin:0, color:'#fff', fontSize:17, fontWeight:900 }}>{me?.name ?? inputName}</p>
            <p style={{ margin:0, color:'#94a3b8', fontSize:12 }}>{SIDE_LABEL[def.side]}</p>
          </div>
          <div style={{ textAlign:'left' }}>
            <p style={{ margin:0, color:'#ffd700', fontSize:18, fontWeight:900 }}>{me?.score ?? 0} ₪</p>
            <div style={{ display:'flex', gap:2, justifyContent:'flex-end' }}>
              {Array.from({ length: Math.max(0, me?.lives ?? 3) }).map((_,i) => <span key={i} style={{ fontSize:14 }}>❤️</span>)}
              {(me?.lives ?? 3) === 0 && <span style={{ fontSize:14 }}>💀</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Lobby waiting */}
      {(!gs || gs.phase === 'lobby') && (
        <p style={{ color:'#fbbf24', fontSize:20, fontWeight:700, textAlign:'center', marginTop:16 }}>
          ✅ הצטרפת!<br/><span style={{ color:'#94a3b8', fontSize:15 }}>ממתין לתחילת המשחק...</span>
        </p>
      )}

      {/* ← → Arrows — shown only during playing (no arrows during question) */}
      {gs?.phase === 'playing' && (
        <div style={{ width:'100%', maxWidth:420 }}>
          <p style={{ color:'#64748b', fontSize:13, margin:'0 0 10px', textAlign:'center' }}>הזזת השוער — לחץ והחזק</p>
          <div style={{ display:'flex', gap:12 }}>
            {(['←', '→'] as const).map((arrow, i) => (
              <button key={i}
                onPointerDown={() => startMove(i === 0 ? -1 : 1)}
                onPointerUp={stopMove} onPointerLeave={stopMove} onPointerCancel={stopMove}
                style={{ flex:1, height:130, background:`linear-gradient(135deg,${def.color},${def.darkColor})`, color:'#fff', fontSize:60, fontWeight:900, borderRadius:24, border:'3px solid rgba(255,255,255,0.3)', cursor:'pointer', touchAction:'none' }}>
                {arrow}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* My question — goal scored against me */}
      {isMyQuestion && gs?.question && (
        <div style={{ width:'100%', maxWidth:420, background:'linear-gradient(145deg,#1e1b4b,#312e81)', borderRadius:20, padding:18, border:`2px solid #ffd700` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <span style={{ color:'#ffd700', fontSize:20, fontWeight:900 }}>⏱ {gs.questionTimeLeft}s</span>
            <span style={{ color:'#f87171', fontSize:14, fontWeight:700 }}>🥅 כדור נכנס לשער שלך!</span>
          </div>
          <p style={{ color:'#fff', fontSize:16, fontWeight:700, textAlign:'center', marginBottom:14, lineHeight:1.5 }}>{gs.question.prompt}</p>
          {!answerSent ? (
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {gs.question.options.map((opt, idx) => (
                <button key={idx} onClick={() => sendAnswer(idx)}
                  style={{ background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:15, fontWeight:700, padding:'13px 14px', borderRadius:12, border:'1px solid rgba(255,215,0,0.35)', cursor:'pointer', textAlign:'right' }}>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'12px 0' }}>
              <p style={{ color: gs.answerWasCorrect ? '#4ade80' : '#ef4444', fontSize:24, fontWeight:900, margin:0 }}>
                {gs.answerWasCorrect ? '✅ נכון! +100 ₪' : '❌ טעות! -לב'}
              </p>
              <p style={{ color:'#64748b', fontSize:13, marginTop:6 }}>ממתין לסיבוב הבא...</p>
            </div>
          )}
        </div>
      )}

      {/* Spectating someone else's question */}
      {gs?.phase === 'question' && !isMyQuestion && gs.question && (() => {
        const qp = gs.players[gs.questionPlayerId ?? 0];
        return (
          <div style={{ width:'100%', maxWidth:420, background:'rgba(255,255,255,0.05)', borderRadius:16, padding:18, textAlign:'center' }}>
            <p style={{ color:'#fbbf24', fontSize:16, fontWeight:700, margin:'0 0 8px' }}>
              🥅 כדור נכנס לשער של {qp?.emoji} {qp?.name}!
            </p>
            <p style={{ color:'#a78bfa', fontSize:15, fontWeight:700, margin:'0 0 6px' }}>{gs.question.prompt}</p>
            <p style={{ color:'#64748b', fontSize:13, margin:0 }}>⏱ {gs.questionTimeLeft}s</p>
          </div>
        );
      })()}

      {/* Gameover */}
      {gs?.phase === 'gameover' && (
        <div style={{ textAlign:'center', marginTop:12 }}>
          <p style={{ fontSize:56 }}>🏆</p>
          <p style={{ color:'#ffd700', fontSize:26, fontWeight:900 }}>המשחק הסתיים!</p>
          <p style={{ color:'#fff', fontSize:18 }}>מנצח: {gs.winnerName}</p>
          <p style={{ color:'#ffd700', fontSize:20, fontWeight:900, marginTop:6 }}>הניקוד שלך: {me?.score ?? 0} ₪</p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOST VIEW — Laptop screen
// ═══════════════════════════════════════════════════════════════════════════════
const BullseyeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef     = useRef<GameState>(makeInitialState());
  const peerRef   = useRef<Peer|null>(null);
  const connsRef  = useRef<Map<number, DataConnection>>(new Map());
  const rafRef    = useRef<number>(0);
  const movesRef  = useRef<{ playerId: number; delta: number }[]>([]);
  const qtRef     = useRef<ReturnType<typeof setInterval>|null>(null);

  const [hostPeerId, setHostPeerId] = useState<string|null>(null);
  const [peerError, setPeerError]   = useState<string|null>(null);
  const [phase, setPhase]           = useState<Phase>('lobby');
  const [displayGs, setDisplayGs]   = useState<GameState>(gsRef.current);

  const broadcast = useCallback(() => {
    const msg: Msg = { type: 'STATE', state: gsRef.current };
    connsRef.current.forEach(c => { if (c.open) c.send(msg); });
  }, []);

  const syncDisplay = useCallback(() => {
    setDisplayGs({ ...gsRef.current, players: gsRef.current.players.map(p => ({ ...p })) });
    setPhase(gsRef.current.phase);
  }, []);

  const applyMoves = useCallback(() => {
    const gs = gsRef.current;
    movesRef.current.splice(0).forEach(({ playerId, delta }) => {
      const p = gs.players[playerId];
      if (!p?.active || p.lives <= 0) return;
      p.gkPos = Math.max(0.02, Math.min(0.98, p.gkPos + delta * GK_MOVE));
    });
  }, []);

  const checkGameOver = useCallback((): boolean => {
    const gs = gsRef.current;
    const alive = gs.players.filter(p => p.active && p.lives > 0);
    if (alive.length <= 1) {
      cancelAnimationFrame(rafRef.current);
      gs.phase = 'gameover';
      gs.winnerName = alive[0]?.name ?? 'אין מנצח';
      broadcast(); syncDisplay(); return true;
    }
    return false;
  }, [broadcast, syncDisplay]);

  // Forward declaration shim — will be assigned below
  const gameLoopRef = useRef<() => void>(() => {});

  const nextRound = useCallback(() => {
    const gs = gsRef.current;
    gs.phase = 'playing';
    gs.question = null; gs.questionPlayerId = null;
    gs.questionAnswered = false; gs.answerWasCorrect = null;
    gs.ball = freshBall();
    broadcast(); syncDisplay();
    rafRef.current = requestAnimationFrame(gameLoopRef.current);
  }, [broadcast, syncDisplay]);

  const triggerGoal = useCallback((scoredAgainstId: number) => {
    cancelAnimationFrame(rafRef.current);
    if (qtRef.current) clearInterval(qtRef.current);
    const gs = gsRef.current;
    const p = gs.players[scoredAgainstId];
    gs.ball = { x: CW/2, y: CH/2, vx: 0, vy: 0 };
    gs.phase = 'question';
    gs.questionPlayerId = scoredAgainstId;
    gs.question = pickQ();
    gs.questionTimeLeft = 60;
    gs.questionAnswered = false;
    gs.answerWasCorrect = null;
    gs.lastMsg = `🥅 גוול! הכדור נכנס לשער ${p.emoji} ${p.name}!`;
    broadcast(); syncDisplay();

    qtRef.current = setInterval(() => {
      const gs2 = gsRef.current;
      if (gs2.phase !== 'question') { clearInterval(qtRef.current!); return; }
      gs2.questionTimeLeft--;
      if (gs2.questionTimeLeft <= 0) {
        clearInterval(qtRef.current!);
        if (!gs2.questionAnswered) {
          gs2.questionAnswered = true;
          gs2.answerWasCorrect = false;
          const pp = gs2.players[scoredAgainstId];
          pp.lives = Math.max(0, pp.lives - 1);
          gs2.lastMsg = pp.lives === 0
            ? `💀 ${pp.emoji} ${pp.name} יצא/ה מהמשחק!`
            : `⏱ זמן אזל! ${pp.emoji} ${pp.name} -לב`;
        }
        broadcast(); syncDisplay();
        setTimeout(() => { if (!checkGameOver()) nextRound(); }, 1500);
      } else {
        broadcast(); syncDisplay();
      }
    }, 1000);
  }, [broadcast, syncDisplay, checkGameOver, nextRound]);

  const handleAnswer = useCallback((playerId: number, answerIdx: number) => {
    const gs = gsRef.current;
    if (gs.phase !== 'question' || gs.questionPlayerId !== playerId || gs.questionAnswered) return;
    gs.questionAnswered = true;
    const p = gs.players[playerId];
    const correct = gs.question?.correct === answerIdx;
    gs.answerWasCorrect = correct;
    if (correct) {
      p.score += 100;
      gs.lastMsg = `✅ ${p.emoji} ${p.name} ענה/תה נכון! +100 ₪`;
    } else {
      p.lives = Math.max(0, p.lives - 1);
      gs.lastMsg = p.lives === 0
        ? `💀 ${p.emoji} ${p.name} יצא/ה מהמשחק!`
        : `❌ ${p.emoji} ${p.name} טעה/תה — -לב`;
    }
    if (qtRef.current) { clearInterval(qtRef.current); qtRef.current = null; }
    broadcast(); syncDisplay();
    setTimeout(() => { if (!checkGameOver()) nextRound(); }, 2500);
  }, [broadcast, syncDisplay, checkGameOver, nextRound]);

  // ── Physics ────────────────────────────────────────────────────────────
  const physicsStep = useCallback(() => {
    const gs = gsRef.current;
    applyMoves();
    let { x, y, vx, vy } = gs.ball;
    x += vx; y += vy;

    // GK semicircle — elastic bounce
    for (const p of gs.players) {
      if (!p.active || p.lives <= 0) continue;
      const { cx, cy } = gkCenter(p.side, p.gkPos);
      const r = gkR(p.side);
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < r + BALL_R && dist > 0.01) {
        const nx = dx / dist, ny = dy / dist;
        const dot = vx*nx + vy*ny;
        vx = (vx - 2*dot*nx) * BOUNCE_BOOST;
        vy = (vy - 2*dot*ny) * BOUNCE_BOOST;
        const spd = Math.sqrt(vx*vx+vy*vy);
        if (spd > MAX_BALL_SPEED) { vx *= MAX_BALL_SPEED/spd; vy *= MAX_BALL_SPEED/spd; }
        x = cx + nx*(r+BALL_R+1);
        y = cy + ny*(r+BALL_R+1);
        break; // one bounce per frame
      }
    }

    // Wall / goal collision
    if (y - BALL_R < 0) {
      if (x >= GOAL_H_START && x <= GOAL_H_START+GOAL_H && gs.players[0].active && gs.players[0].lives>0) {
        gs.ball={x,y,vx,vy}; triggerGoal(0); return;
      }
      y=BALL_R; vy=Math.abs(vy);
    }
    if (y + BALL_R > CH) {
      if (x >= GOAL_H_START && x <= GOAL_H_START+GOAL_H && gs.players[1].active && gs.players[1].lives>0) {
        gs.ball={x,y,vx,vy}; triggerGoal(1); return;
      }
      y=CH-BALL_R; vy=-Math.abs(vy);
    }
    if (x - BALL_R < 0) {
      if (y >= GOAL_V_START && y <= GOAL_V_START+GOAL_V && gs.players[2].active && gs.players[2].lives>0) {
        gs.ball={x,y,vx,vy}; triggerGoal(2); return;
      }
      x=BALL_R; vx=Math.abs(vx);
    }
    if (x + BALL_R > CW) {
      if (y >= GOAL_V_START && y <= GOAL_V_START+GOAL_V && gs.players[3].active && gs.players[3].lives>0) {
        gs.ball={x,y,vx,vy}; triggerGoal(3); return;
      }
      x=CW-BALL_R; vx=-Math.abs(vx);
    }
    gs.ball={x,y,vx,vy};
  }, [applyMoves, triggerGoal]);

  // ── Draw ───────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext('2d'); if(!ctx) return;
    const gs=gsRef.current;
    const scx=canvas.width/CW, scy=canvas.height/CH;
    ctx.save(); ctx.scale(scx,scy);

    // Pitch
    for(let i=0;i<8;i++){ctx.fillStyle=i%2===0?'#166534':'#15803d';ctx.fillRect(i*CW/8,0,CW/8,CH);}
    ctx.strokeStyle='rgba(255,255,255,0.65)'; ctx.lineWidth=2;
    ctx.strokeRect(32,32,CW-64,CH-64);
    ctx.beginPath(); ctx.moveTo(CW/2,32); ctx.lineTo(CW/2,CH-32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(32,CH/2); ctx.lineTo(CW-32,CH/2); ctx.stroke();
    ctx.beginPath(); ctx.arc(CW/2,CH/2,56,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(CW/2,CH/2,4,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();

    // Goal bars
    gs.players.forEach(p=>{
      if(!p.active) return;
      const col=p.lives>0?p.color:'#374151';
      ctx.strokeStyle=col; ctx.lineWidth=8; ctx.lineCap='round';
      if(p.side==='top')    {ctx.beginPath();ctx.moveTo(GOAL_H_START,3);ctx.lineTo(GOAL_H_START+GOAL_H,3);ctx.stroke();}
      if(p.side==='bottom') {ctx.beginPath();ctx.moveTo(GOAL_H_START,CH-3);ctx.lineTo(GOAL_H_START+GOAL_H,CH-3);ctx.stroke();}
      if(p.side==='left')   {ctx.beginPath();ctx.moveTo(3,GOAL_V_START);ctx.lineTo(3,GOAL_V_START+GOAL_V);ctx.stroke();}
      if(p.side==='right')  {ctx.beginPath();ctx.moveTo(CW-3,GOAL_V_START);ctx.lineTo(CW-3,GOAL_V_START+GOAL_V);ctx.stroke();}
      ctx.lineCap='butt';
    });

    // GK domes
    gs.players.forEach(p=>{
      if(!p.active) return;
      const{cx,cy}=gkCenter(p.side,p.gkPos);
      const r=gkR(p.side);
      const[a0,a1]=gkArcAngles(p.side);
      const alive=p.lives>0;
      ctx.beginPath(); ctx.arc(cx,cy,r,a0,a1); ctx.closePath();
      ctx.fillStyle=alive?p.color+'cc':'#37415188';
      ctx.fill();
      ctx.strokeStyle=alive?'rgba(255,255,255,0.9)':'#555'; ctx.lineWidth=3; ctx.stroke();
      // emoji
      let lx=cx,ly=cy;
      const off=r*0.65;
      if(p.side==='top')    ly=off;
      if(p.side==='bottom') ly=CH-off;
      if(p.side==='left')   lx=off;
      if(p.side==='right')  lx=CW-off;
      ctx.font='16px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(alive?p.emoji:'💀',lx,ly);
    });

    // Labels
    ctx.font='bold 11px sans-serif'; ctx.textBaseline='middle';
    gs.players.forEach(p=>{
      if(!p.active) return;
      const hearts='❤️'.repeat(Math.max(0,p.lives));
      const label=`${p.name} · ${p.score}₪ ${hearts}${p.lives===0?'💀':''}`;
      ctx.fillStyle=p.lives>0?p.color:'#6b7280';
      ctx.shadowColor='rgba(0,0,0,0.9)'; ctx.shadowBlur=5;
      if(p.side==='top')    {ctx.textAlign='center';ctx.fillText(label,CW/2,13);}
      if(p.side==='bottom') {ctx.textAlign='center';ctx.fillText(label,CW/2,CH-7);}
      if(p.side==='left')   {ctx.save();ctx.translate(8,CH/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.fillText(label,0,0);ctx.restore();}
      if(p.side==='right')  {ctx.save();ctx.translate(CW-8,CH/2);ctx.rotate(Math.PI/2);ctx.textAlign='center';ctx.fillText(label,0,0);ctx.restore();}
      ctx.shadowBlur=0;
    });

    // Ball
    const{x:bx,y:by,vx:bvx,vy:bvy}=gs.ball;
    // Shadow
    ctx.beginPath(); ctx.ellipse(bx,by+BALL_R*0.45,BALL_R*0.7,BALL_R*0.25,0,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fill();
    // Body
    const gr=ctx.createRadialGradient(bx-BALL_R*0.35,by-BALL_R*0.35,1,bx,by,BALL_R);
    gr.addColorStop(0,'#fff'); gr.addColorStop(1,'#ccc');
    ctx.beginPath(); ctx.arc(bx,by,BALL_R,0,Math.PI*2);
    ctx.fillStyle=gr; ctx.fill();
    ctx.strokeStyle='#444'; ctx.lineWidth=1; ctx.stroke();
    // Seam
    const ba=Math.atan2(bvy,bvx);
    ctx.strokeStyle='#666'; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.arc(bx,by,BALL_R*0.6,ba,ba+Math.PI*0.8); ctx.stroke();

    ctx.restore();
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────
  const gameLoop = useCallback(() => {
    if (gsRef.current.phase !== 'playing') return;
    physicsStep(); draw();
    if (Math.random() < 0.15) broadcast();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [physicsStep, draw, broadcast]);

  // Wire forward-ref
  useEffect(() => { gameLoopRef.current = gameLoop; }, [gameLoop]);

  // ── PeerJS ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const peer = new Peer(); peerRef.current = peer;
    peer.on('open', id => setHostPeerId(id));
    peer.on('connection', conn => {
      conn.on('data', raw => {
        const msg = raw as Msg;
        if (msg.type==='JOIN' && msg.playerId!=null && msg.name) {
          connsRef.current.set(msg.playerId, conn);
          gsRef.current.players[msg.playerId].active=true;
          gsRef.current.players[msg.playerId].name=msg.name;
          broadcast(); syncDisplay();
        }
        if (msg.type==='MOVE' && msg.playerId!=null && msg.delta!=null && gsRef.current.phase==='playing') {
          movesRef.current.push({playerId:msg.playerId, delta:msg.delta});
        }
        if (msg.type==='ANSWER' && msg.playerId!=null && msg.answerIdx!=null) {
          handleAnswer(msg.playerId, msg.answerIdx);
        }
      });
    });
    peer.on('error', e => setPeerError(String(e)));
    return () => { peer.destroy(); cancelAnimationFrame(rafRef.current); if(qtRef.current) clearInterval(qtRef.current); };
  }, []); // eslint-disable-line

  useEffect(() => { draw(); }, [draw]);

  const startGame = useCallback(() => {
    gsRef.current.phase='playing';
    gsRef.current.ball=freshBall();
    gsRef.current.lastMsg='';
    broadcast(); syncDisplay();
    rafRef.current=requestAnimationFrame(gameLoop);
  }, [broadcast, syncDisplay, gameLoop]);

  const resetGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if(qtRef.current) clearInterval(qtRef.current);
    connsRef.current.clear();
    gsRef.current=makeInitialState();
    syncDisplay(); draw();
  }, [syncDisplay, draw]);

  const baseUrl=`${window.location.origin}${window.location.pathname}`;
  const playerUrls=PLAYER_DEFS.map(p=>hostPeerId?`${baseUrl}#bullseye-player-${p.id}-${hostPeerId}`:null);

  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-black text-brand-dark-blue">⚽ בול פגיעה</h2>
          <p className="text-gray-500">משחק כדורגל פיננסי רב-משתתפים</p>
        </div>
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">← חזרה</button>
      </div>

      {peerError && (
        <div className="rounded-2xl p-4 text-center font-bold text-red-300" style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.4)'}}>שגיאת חיבור: {peerError}</div>
      )}

      {/* LOBBY */}
      {phase==='lobby' && (
        <div className="space-y-4">
          {!hostPeerId && !peerError && <div className="rounded-2xl p-4 text-center text-blue-300 font-bold" style={{background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.3)'}}>⏳ יוצר חדר...</div>}
          {hostPeerId && <div className="rounded-2xl p-3 text-center text-green-300 font-bold text-sm" style={{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.3)'}}>✅ חדר מוכן — סרקו ברקוד</div>}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAYER_DEFS.map((p,idx)=>(
              <div key={p.id} className="rounded-2xl p-4 text-center space-y-3 shadow-lg" style={{background:`linear-gradient(135deg,${p.color},${p.darkColor})`}}>
                <p className="text-4xl">{p.emoji}</p>
                <p className="text-white font-black text-lg">{SIDE_LABEL[p.side]}</p>
                {playerUrls[idx]?(
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=ffffff&data=${encodeURIComponent(playerUrls[idx]!)}`} alt={`QR ${p.id+1}`} className="mx-auto rounded-xl" style={{width:140,height:140}}/>
                ):(
                  <div style={{width:140,height:140,background:'rgba(255,255,255,0.15)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}} className="mx-auto"><span style={{fontSize:32}}>⏳</span></div>
                )}
                <div className="rounded-xl py-2 px-3 text-sm font-bold" style={{background:displayGs.players[p.id].active?'rgba(74,222,128,0.9)':'rgba(255,255,255,0.25)',color:'#fff'}}>
                  {displayGs.players[p.id].active?`✅ ${displayGs.players[p.id].name}`:'⏳ ממתין...'}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center space-y-2">
            <button onClick={startGame} disabled={!hostPeerId||!displayGs.players.some(p=>p.active)}
              className="px-10 py-4 rounded-2xl font-black text-xl text-black transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{background:'linear-gradient(135deg,#ffd700,#ff9500)',boxShadow:'0 0 32px rgba(255,215,0,0.5)'}}>
              🚀 התחל משחק!
            </button>
            <p className="text-gray-500 text-sm">{!hostPeerId?'ממתין...':'לפחות שחקן אחד — ואז לחצו התחל'}</p>
          </div>
        </div>
      )}

      {/* IN-GAME */}
      {phase!=='lobby' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {displayGs.players.filter(p=>p.active).map(p=>(
              <div key={p.id} className="rounded-xl p-3 text-center" style={{background:`linear-gradient(135deg,${p.color}22,${p.color}08)`,border:`2px solid ${p.lives>0?p.color:'#374151'}`}}>
                <p className="text-xl">{p.emoji}</p>
                <p className="font-bold text-sm truncate" style={{color:p.lives>0?p.color:'#6b7280'}}>{p.name}</p>
                <p className="text-base font-black text-yellow-400">{p.score}<span className="text-xs font-normal text-gray-400"> ₪</span></p>
                <p className="text-xs">{Array.from({length:Math.max(0,p.lives)}).map((_,i)=><span key={i}>❤️</span>)}{p.lives===0?'💀':''}</p>
              </div>
            ))}
          </div>

          {displayGs.lastMsg && (
            <div className="text-center text-base font-black text-yellow-400 rounded-xl py-2 px-4" style={{background:'rgba(255,215,0,0.08)',border:'1px solid rgba(255,215,0,0.25)'}}>{displayGs.lastMsg}</div>
          )}

          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{background:'#14532d'}}>
            <canvas ref={canvasRef} width={CW} height={CH} style={{width:'100%',maxWidth:CW,display:'block',margin:'0 auto'}}/>

            {/* Question overlay */}
            {phase==='question' && displayGs.question && displayGs.questionPlayerId!=null && (()=>{
              const qp=displayGs.players[displayGs.questionPlayerId];
              return(
                <div className="absolute inset-0 flex items-center justify-center" style={{background:'rgba(0,0,0,0.65)',backdropFilter:'blur(3px)'}}>
                  <div className="rounded-3xl p-7 text-center space-y-4 w-full max-w-md mx-4" style={{background:'linear-gradient(145deg,#1e1b4b,#312e81)',border:`3px solid ${qp.color}`,boxShadow:`0 0 60px ${qp.color}55`}}>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">{qp.emoji}</span>
                      <div>
                        <p className="text-white font-black text-lg">{qp.name}</p>
                        <p className="text-purple-300 text-sm">🥅 כדור נכנס לשערו/ה</p>
                      </div>
                      <span className={`text-2xl font-black ${displayGs.questionTimeLeft<=10?'text-red-400 animate-pulse':'text-yellow-300'}`}>⏱{displayGs.questionTimeLeft}s</span>
                    </div>
                    <div className="rounded-xl p-3" style={{background:'rgba(255,255,255,0.08)'}}>
                      <p className="text-white text-lg font-bold">{displayGs.question.prompt}</p>
                    </div>
                    {!displayGs.questionAnswered?(
                      <div className="grid grid-cols-2 gap-2 text-right">
                        {displayGs.question.options.map((opt,i)=>(
                          <div key={i} className="rounded-xl px-3 py-2 font-semibold text-white text-sm" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,215,0,0.2)'}}>{opt}</div>
                        ))}
                      </div>
                    ):(
                      <div className="rounded-2xl py-4 px-6" style={{background:displayGs.answerWasCorrect?'rgba(74,222,128,0.2)':'rgba(239,68,68,0.2)',border:`2px solid ${displayGs.answerWasCorrect?'#4ade80':'#ef4444'}`}}>
                        <p className="font-black text-xl" style={{color:displayGs.answerWasCorrect?'#4ade80':'#ef4444'}}>
                          {displayGs.answerWasCorrect?'✅ נכון! +100 ₪':'❌ טעות! -לב'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">מכין סיבוב הבא...</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Game over */}
            {phase==='gameover' && (
              <div className="absolute inset-0 flex items-center justify-center" style={{background:'rgba(0,0,0,0.8)',backdropFilter:'blur(6px)'}}>
                <div className="text-center space-y-5 p-8 rounded-3xl mx-4" style={{background:'linear-gradient(145deg,#0f0c29,#302b63)',border:'2px solid rgba(255,215,0,0.5)'}}>
                  <p className="text-6xl animate-bounce">🏆</p>
                  <h3 className="text-3xl font-black text-white">המשחק הסתיים!</h3>
                  <p className="text-xl text-yellow-300 font-bold">מנצח: {displayGs.winnerName}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {displayGs.players.filter(p=>p.active).sort((a,b)=>b.score-a.score).map(p=>(
                      <div key={p.id} className="rounded-xl px-4 py-2 text-center" style={{background:`${p.color}33`,border:`1px solid ${p.color}`}}>
                        <p style={{color:p.color}} className="font-black text-sm">{p.emoji} {p.name}</p>
                        <p className="text-yellow-300 font-black text-lg">{p.score} ₪</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button onClick={resetGame} className="px-6 py-3 rounded-2xl font-black text-black" style={{background:'linear-gradient(135deg,#ffd700,#ff9500)'}}>🔄 משחק חדש</button>
                    <button onClick={onBack} className="px-6 py-3 rounded-2xl font-bold text-white" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)'}}>חזרה</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {phase!=='gameover' && (
            <div className="flex justify-center">
              <button onClick={resetGame} className="px-5 py-2.5 rounded-xl font-bold text-white text-sm" style={{background:'rgba(239,68,68,0.7)',border:'1px solid rgba(239,68,68,0.5)'}}>🔄 אפס</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BullseyeGame;
