import React, { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

// ─── Question Bank ─────────────────────────────────────────────────────────
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

const pickQuestion = (): SQ => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

// ─── Types ─────────────────────────────────────────────────────────────────
type Side = 'top' | 'bottom' | 'left' | 'right';
type Phase = 'lobby' | 'playing' | 'question' | 'gameover';

interface PlayerState {
  id: number; side: Side; color: string; darkColor: string; emoji: string;
  name: string; lives: number; score: number; gkPos: number; active: boolean;
}
interface BallState { x: number; y: number; vx: number; vy: number; }
interface GameState {
  phase: Phase; players: PlayerState[]; ball: BallState;
  questionPlayerId: number | null; question: SQ | null; questionTimeLeft: number;
  winnerName: string | null; lastGoalMsg: string;
}
interface Msg {
  type: 'JOIN' | 'MOVE' | 'ANSWER' | 'STATE';
  playerId?: number; name?: string; delta?: number; answerIdx?: number; state?: GameState;
}

// ─── Constants ─────────────────────────────────────────────────────────────
const CW = 800, CH = 600;
const BALL_R = 13, GK_SPAN = 88, GK_THICK = 12, GOAL_SPAN = 130, GOAL_THICK = 18;
const BALL_SPEED = 5, GK_MOVE = 0.013;

const PLAYER_DEFS: Pick<PlayerState, 'id' | 'side' | 'color' | 'darkColor' | 'emoji'>[] = [
  { id: 0, side: 'top',    color: '#3b82f6', darkColor: '#1d4ed8', emoji: '🔵' },
  { id: 1, side: 'bottom', color: '#ef4444', darkColor: '#b91c1c', emoji: '🔴' },
  { id: 2, side: 'left',   color: '#f59e0b', darkColor: '#b45309', emoji: '🟡' },
  { id: 3, side: 'right',  color: '#22c55e', darkColor: '#15803d', emoji: '🟢' },
];
const SIDE_LABEL: Record<Side, string> = { top: 'צפון ↑', bottom: 'דרום ↓', left: 'מערב ←', right: 'מזרח →' };

// ─── Geometry helpers ───────────────────────────────────────────────────────
const gkRect = (side: Side, pos: number): [number, number, number, number] => {
  const half = GK_SPAN / 2, cx = pos * CW, cy = pos * CH;
  if (side === 'top')    return [Math.max(0, Math.min(CW - GK_SPAN, cx - half)), 0, GK_SPAN, GK_THICK];
  if (side === 'bottom') return [Math.max(0, Math.min(CW - GK_SPAN, cx - half)), CH - GK_THICK, GK_SPAN, GK_THICK];
  if (side === 'left')   return [0, Math.max(0, Math.min(CH - GK_SPAN, cy - half)), GK_THICK, GK_SPAN];
  return [CW - GK_THICK, Math.max(0, Math.min(CH - GK_SPAN, cy - half)), GK_THICK, GK_SPAN];
};
const circleRect = (bx: number, by: number, br: number, rx: number, ry: number, rw: number, rh: number) => {
  const nx = Math.max(rx, Math.min(bx, rx + rw)), ny = Math.max(ry, Math.min(by, ry + rh));
  return (bx - nx) ** 2 + (by - ny) ** 2 < br * br;
};
const ballInGoal = (bx: number, by: number, side: Side) => {
  const gs2 = GOAL_SPAN / 2, hw = CW / 2, hh = CH / 2;
  if (side === 'top')    return by - BALL_R <= 0  && bx >= hw - gs2 && bx <= hw + gs2;
  if (side === 'bottom') return by + BALL_R >= CH  && bx >= hw - gs2 && bx <= hw + gs2;
  if (side === 'left')   return bx - BALL_R <= 0  && by >= hh - gs2 && by <= hh + gs2;
  return bx + BALL_R >= CW && by >= hh - gs2 && by <= hh + gs2;
};
const newBall = (): BallState => {
  const a = Math.random() * Math.PI * 2;
  return { x: CW / 2, y: CH / 2, vx: Math.cos(a) * BALL_SPEED, vy: Math.sin(a) * BALL_SPEED };
};
const makeInitialState = (): GameState => ({
  phase: 'lobby',
  players: PLAYER_DEFS.map(p => ({ ...p, name: `שחקן ${p.id + 1}`, lives: 3, score: 0, gkPos: 0.5, active: false })),
  ball: newBall(), questionPlayerId: null, question: null, questionTimeLeft: 60,
  winnerName: null, lastGoalMsg: '',
});

// ─── BullseyePlayerView — mobile player screen ─────────────────────────────
// Hash format: #bullseye-player-{playerId}-{hostPeerId}
export const BullseyePlayerView: React.FC = () => {
  const hashMatch  = window.location.hash.match(/#bullseye-player-(\d)-(.+)/);
  const playerId   = hashMatch ? parseInt(hashMatch[1]) : 0;
  const hostPeerId = hashMatch ? hashMatch[2] : null;
  const def = PLAYER_DEFS[playerId] ?? PLAYER_DEFS[0];

  const [status, setStatus]       = useState<'connecting' | 'ready' | 'joined' | 'error'>('connecting');
  const [inputName, setInputName] = useState('');
  const [gs, setGs]               = useState<GameState | null>(null);
  const [answerSent, setAnswerSent] = useState(false);
  const [errMsg, setErrMsg]       = useState('');
  const connRef  = useRef<DataConnection | null>(null);
  const peerRef  = useRef<Peer | null>(null);
  const holdRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!hostPeerId) {
      setStatus('error');
      setErrMsg('קישור לא תקין – סרקו מחדש את הברקוד');
      return;
    }
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', () => {
      const conn = peer.connect(hostPeerId, { reliable: true });
      connRef.current = conn;
      conn.on('open', () => setStatus('ready'));
      conn.on('data', (raw) => {
        const msg = raw as Msg;
        if (msg.type === 'STATE' && msg.state) {
          setGs(msg.state);
          if (msg.state.phase === 'playing') setAnswerSent(false);
        }
      });
      conn.on('error', (e) => { setStatus('error'); setErrMsg(String(e)); });
      conn.on('close', () => { setStatus('error'); setErrMsg('החיבור נסגר'); });
    });

    peer.on('error', (e) => { setStatus('error'); setErrMsg(String(e)); });

    return () => { peer.destroy(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const send = useCallback((msg: Msg) => {
    if (connRef.current?.open) connRef.current.send(msg);
  }, []);

  const join = () => {
    const name = inputName.trim() || `שחקן ${playerId + 1}`;
    send({ type: 'JOIN', playerId, name });
    setStatus('joined');
  };

  const startMove = (delta: number) => {
    send({ type: 'MOVE', playerId, delta });
    holdRef.current = setInterval(() => send({ type: 'MOVE', playerId, delta }), 80);
  };
  const stopMove = () => { if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null; } };

  const sendAnswer = (idx: number) => {
    if (answerSent) return;
    send({ type: 'ANSWER', playerId, answerIdx: idx });
    setAnswerSent(true);
  };

  const me = gs?.players[playerId];
  const isMyQuestion = gs?.phase === 'question' && gs.questionPlayerId === playerId;

  // ── Connecting screen ──────────────────────────────────────────────────
  if (status === 'connecting') {
    return (
      <div style={{ background: `linear-gradient(135deg,${def.color},${def.darkColor})`, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24 }}>
        <p style={{ fontSize: 64, margin: 0 }}>{def.emoji}</p>
        <p style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>מתחבר למשחק...</p>
        <div style={{ width: 48, height: 48, border: '5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error screen ────────────────────────────────────────────────────── 
  if (status === 'error') {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <p style={{ fontSize: 60 }}>❌</p>
        <p style={{ color: '#f87171', fontSize: 22, fontWeight: 900, textAlign: 'center' }}>שגיאת חיבור</p>
        <p style={{ color: '#94a3b8', fontSize: 15, textAlign: 'center' }}>{errMsg || 'בדקו שהמחשב המארח פתוח ונסו לסרוק מחדש'}</p>
        <button onClick={() => window.location.reload()}
          style={{ background: '#3b82f6', color: '#fff', fontSize: 18, fontWeight: 900, padding: '14px 32px', borderRadius: 16, border: 'none', cursor: 'pointer' }}>
          🔄 נסה שוב
        </button>
      </div>
    );
  }

  // ── Name entry screen ──────────────────────────────────────────────────
  if (status === 'ready') {
    return (
      <div style={{ background: `linear-gradient(135deg,${def.color},${def.darkColor})`, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}>
        <p style={{ fontSize: 72, margin: 0 }}>{def.emoji}</p>
        <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, textAlign: 'center', margin: 0 }}>{SIDE_LABEL[def.side]}</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: 0 }}>✅ מחובר למשחק</p>
        <input
          value={inputName}
          onChange={e => setInputName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && join()}
          placeholder="הכנס שמך..."
          dir="rtl"
          autoFocus
          style={{ fontSize: 22, padding: '14px 20px', borderRadius: 16, border: '3px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.15)', color: '#fff', width: '100%', maxWidth: 320, textAlign: 'center', outline: 'none' }}
        />
        <button onClick={join}
          style={{ background: '#fff', color: def.color, fontSize: 22, fontWeight: 900, padding: '16px 48px', borderRadius: 20, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ✅ הצטרף למשחק
        </button>
      </div>
    );
  }

  // ── In-game screen ─────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16, gap: 16, userSelect: 'none' }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: 400, background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '14px 20px', textAlign: 'center', border: `2px solid ${def.color}` }}>
        <p style={{ margin: 0, fontSize: 36 }}>{def.emoji}</p>
        <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 20, fontWeight: 900 }}>{me?.name ?? inputName}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 6 }}>
          {Array.from({ length: Math.max(0, me?.lives ?? 3) }).map((_, i) => <span key={i} style={{ fontSize: 24 }}>❤️</span>)}
        </div>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 15 }}>שער: {SIDE_LABEL[def.side]}</p>
      </div>

      {/* Lobby waiting */}
      {(!gs || gs.phase === 'lobby') && (
        <div style={{ textAlign: 'center', color: '#fbbf24', fontSize: 20, fontWeight: 700, marginTop: 20 }}>
          ✅ הצטרפת!<br /><span style={{ color: '#94a3b8', fontSize: 16 }}>ממתין לתחילת המשחק...</span>
        </div>
      )}

      {/* Playing controls */}
      {gs?.phase === 'playing' && (
        <>
          <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>הזיזו את השוער — לחצו והחזיקו</p>
          <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 400 }}>
            <button
              onPointerDown={() => startMove(-1)} onPointerUp={stopMove} onPointerLeave={stopMove} onPointerCancel={stopMove}
              style={{ flex: 1, height: 160, background: `linear-gradient(135deg,${def.color},${def.darkColor})`, color: '#fff', fontSize: 72, fontWeight: 900, borderRadius: 28, border: '3px solid rgba(255,255,255,0.3)', cursor: 'pointer', touchAction: 'none' }}>←</button>
            <button
              onPointerDown={() => startMove(1)} onPointerUp={stopMove} onPointerLeave={stopMove} onPointerCancel={stopMove}
              style={{ flex: 1, height: 160, background: `linear-gradient(135deg,${def.color},${def.darkColor})`, color: '#fff', fontSize: 72, fontWeight: 900, borderRadius: 28, border: '3px solid rgba(255,255,255,0.3)', cursor: 'pointer', touchAction: 'none' }}>→</button>
          </div>
          <p style={{ color: '#475569', fontSize: 13, textAlign: 'center' }}>
            {def.side === 'top' || def.side === 'bottom' ? '← = שמאל  |  → = ימין' : '← = מעלה  |  → = מטה'}
          </p>
        </>
      )}

      {/* My question */}
      {isMyQuestion && gs?.question && (
        <div style={{ width: '100%', maxWidth: 420, background: 'linear-gradient(145deg,#1e1b4b,#312e81)', borderRadius: 24, padding: 24, border: '2px solid #ffd700', boxShadow: '0 0 40px rgba(255,215,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: gs.questionTimeLeft <= 10 ? '#ef4444' : '#ffd700' }}>⏱ {gs.questionTimeLeft}s</span>
          </div>
          <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, textAlign: 'center', marginBottom: 16, lineHeight: 1.5 }}>{gs.question.prompt}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {gs.question.options.map((opt, idx) => (
              <button key={idx} onClick={() => sendAnswer(idx)} disabled={answerSent}
                style={{ background: answerSent ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 17, fontWeight: 700, padding: '14px 16px', borderRadius: 14, border: '1px solid rgba(255,215,0,0.3)', cursor: answerSent ? 'not-allowed' : 'pointer', textAlign: 'right', opacity: answerSent ? 0.6 : 1 }}>
                {opt}
              </button>
            ))}
          </div>
          {answerSent && <p style={{ color: '#4ade80', textAlign: 'center', fontWeight: 700, marginTop: 12 }}>התשובה נשלחה ✅</p>}
        </div>
      )}

      {/* Spectating a question */}
      {gs?.phase === 'question' && !isMyQuestion && gs.question && (
        <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 20, textAlign: 'center' }}>
          <p style={{ color: '#fbbf24', fontSize: 18, fontWeight: 700 }}>שאלה לשחקן אחר</p>
          <p style={{ color: '#e2e8f0', fontSize: 16 }}>{gs.question.prompt}</p>
        </div>
      )}

      {/* Game over */}
      {gs?.phase === 'gameover' && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 60 }}>🏆</p>
          <p style={{ color: '#ffd700', fontSize: 28, fontWeight: 900 }}>המשחק הסתיים!</p>
          <p style={{ color: '#fff', fontSize: 20 }}>מנצח: {gs.winnerName}</p>
        </div>
      )}
    </div>
  );
};

// ─── BullseyeGame — Host screen ────────────────────────────────────────────
const BullseyeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const gsRef        = useRef<GameState>(makeInitialState());
  const peerRef      = useRef<Peer | null>(null);
  const connsRef     = useRef<Map<number, DataConnection>>(new Map());
  const rafRef       = useRef<number>(0);
  const movesRef     = useRef<{ playerId: number; delta: number }[]>([]);
  const qtRef        = useRef<ReturnType<typeof setInterval> | null>(null);

  const [hostPeerId, setHostPeerId] = useState<string | null>(null);
  const [peerError, setPeerError]   = useState<string | null>(null);
  const [phase, setPhase]           = useState<Phase>('lobby');
  const [displayGs, setDisplayGs]   = useState<GameState>(gsRef.current);

  // ── Broadcast state to all player connections ────────────────────────── 
  const broadcast = useCallback(() => {
    const msg: Msg = { type: 'STATE', state: gsRef.current };
    connsRef.current.forEach(conn => { if (conn.open) conn.send(msg); });
  }, []);

  const syncDisplay = useCallback(() => {
    setDisplayGs({ ...gsRef.current, players: gsRef.current.players.map(p => ({ ...p })) });
    setPhase(gsRef.current.phase);
  }, []);

  // ── PeerJS Host Setup ─────────────────────────────────────────────────
  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (id) => setHostPeerId(id));

    peer.on('connection', (conn) => {
      conn.on('data', (raw) => {
        const msg = raw as Msg;

        if (msg.type === 'JOIN' && msg.playerId != null && msg.name) {
          connsRef.current.set(msg.playerId, conn);
          gsRef.current.players[msg.playerId].active = true;
          gsRef.current.players[msg.playerId].name = msg.name;
          broadcast();
          syncDisplay();
        }

        if (msg.type === 'MOVE' && msg.playerId != null && msg.delta != null) {
          movesRef.current.push({ playerId: msg.playerId, delta: msg.delta });
        }

        if (msg.type === 'ANSWER' && msg.playerId != null && msg.answerIdx != null) {
          handleAnswer(msg.playerId, msg.answerIdx);
        }
      });
      conn.on('error', (e) => console.error('conn error', e));
    });

    peer.on('error', (e) => setPeerError(String(e)));

    return () => {
      peer.destroy();
      cancelAnimationFrame(rafRef.current);
      if (qtRef.current) clearInterval(qtRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Physics ───────────────────────────────────────────────────────────
  const physicsStep = useCallback(() => {
    const gs = gsRef.current;
    const moves = movesRef.current.splice(0);
    moves.forEach(({ playerId, delta }) => {
      const p = gs.players[playerId];
      if (!p?.active || p.lives <= 0) return;
      p.gkPos = Math.max(0.05, Math.min(0.95, p.gkPos + delta * GK_MOVE));
    });

    let { x, y, vx, vy } = gs.ball;
    x += vx; y += vy;

    for (const p of gs.players) {
      if (!p.active || p.lives <= 0) continue;
      if (ballInGoal(x, y, p.side)) {
        const [rx, ry, rw, rh] = gkRect(p.side, p.gkPos);
        if (!circleRect(x, y, BALL_R, rx, ry, rw, rh)) {
          // Scored! Player who conceded gets a question
          p.score++;
          gs.ball = { x: CW / 2, y: CH / 2, vx: 0, vy: 0 };
          gs.phase = 'question';
          gs.questionPlayerId = p.id;
          gs.question = pickQuestion();
          gs.questionTimeLeft = 60;
          gs.lastGoalMsg = `⚽ גול! ${p.emoji} ${p.name} ספג/ה גול`;
          broadcast(); syncDisplay(); startQuestionTimer();
          return;
        }
        // Goalkeeper save — bounce off
        if (p.side === 'top')    { y = GK_THICK + BALL_R; vy = Math.abs(vy); }
        if (p.side === 'bottom') { y = CH - GK_THICK - BALL_R; vy = -Math.abs(vy); }
        if (p.side === 'left')   { x = GK_THICK + BALL_R; vx = Math.abs(vx); }
        if (p.side === 'right')  { x = CW - GK_THICK - BALL_R; vx = -Math.abs(vx); }
      }
    }

    // Wall bouncing (avoid goals)
    const gs2 = GOAL_SPAN / 2, hw = CW / 2, hh = CH / 2;
    if (x - BALL_R <= 0 && !(y >= hh - gs2 && y <= hh + gs2)) { x = BALL_R; vx = Math.abs(vx); }
    if (x + BALL_R >= CW && !(y >= hh - gs2 && y <= hh + gs2)) { x = CW - BALL_R; vx = -Math.abs(vx); }
    if (y - BALL_R <= 0 && !(x >= hw - gs2 && x <= hw + gs2)) { y = BALL_R; vy = Math.abs(vy); }
    if (y + BALL_R >= CH && !(x >= hw - gs2 && x <= hw + gs2)) { y = CH - BALL_R; vy = -Math.abs(vy); }
    x = Math.max(BALL_R, Math.min(CW - BALL_R, x));
    y = Math.max(BALL_R, Math.min(CH - BALL_R, y));
    gs.ball = { x, y, vx, vy };
  }, [broadcast, syncDisplay]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Draw ──────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const gs = gsRef.current;
    const sx = canvas.width / CW, sy = canvas.height / CH;
    ctx.save(); ctx.scale(sx, sy);

    // Pitch stripes
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#166534' : '#15803d';
      ctx.fillRect(i * CW / 8, 0, CW / 8, CH);
    }
    // Field lines
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, CW - 60, CH - 60);
    ctx.beginPath(); ctx.moveTo(CW / 2, 30); ctx.lineTo(CW / 2, CH - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, CH / 2); ctx.lineTo(CW - 30, CH / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(CW / 2, CH / 2, 65, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(CW / 2, CH / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = '#fff';
    [[CW / 2, 80], [CW / 2, CH - 80], [80, CH / 2], [CW - 80, CH / 2]].forEach(([px, py]) => {
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
    });

    // Goals
    const hw = CW / 2, hh = CH / 2, gs2 = GOAL_SPAN / 2;
    const goalDefs: [Side, number, number, number, number][] = [
      ['top',    hw - gs2, 0,               GOAL_SPAN, GOAL_THICK],
      ['bottom', hw - gs2, CH - GOAL_THICK, GOAL_SPAN, GOAL_THICK],
      ['left',   0,               hh - gs2, GOAL_THICK, GOAL_SPAN],
      ['right',  CW - GOAL_THICK, hh - gs2, GOAL_THICK, GOAL_SPAN],
    ];
    goalDefs.forEach(([side, gx, gy, gw, gh]) => {
      const p = gs.players.find(pl => pl.side === side);
      const col = p?.color ?? '#fff';
      ctx.fillStyle = col + '55'; ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = col; ctx.lineWidth = 4;
      if (side === 'top' || side === 'bottom') {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, GOAL_THICK + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx + gw, 0); ctx.lineTo(gx + gw, GOAL_THICK + 10); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(GOAL_THICK + 10, gy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, gy + gh); ctx.lineTo(GOAL_THICK + 10, gy + gh); ctx.stroke();
      }
      ctx.strokeStyle = col + '30'; ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        if (side === 'top' || side === 'bottom') {
          ctx.beginPath(); ctx.moveTo(gx + i * GOAL_SPAN / 5, gy); ctx.lineTo(gx + i * GOAL_SPAN / 5, gy + gh); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(gx, gy + i * GOAL_SPAN / 5); ctx.lineTo(gx + gw, gy + i * GOAL_SPAN / 5); ctx.stroke();
        }
      }
    });

    // Goalkeepers
    gs.players.forEach(p => {
      if (!p.active) return;
      const [rx, ry, rw, rh] = gkRect(p.side, p.gkPos);
      ctx.fillStyle = p.lives > 0 ? p.color : '#374151';
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(p.id + 1), rx + rw / 2, ry + rh / 2);
    });

    // Ball shadow
    const { x: bx, y: by, vx: bvx, vy: bvy } = gs.ball;
    ctx.beginPath(); ctx.ellipse(bx, by + BALL_R * 0.5, BALL_R * 0.75, BALL_R * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
    // Ball
    ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI * 2);
    const gr = ctx.createRadialGradient(bx - BALL_R * 0.35, by - BALL_R * 0.35, 1, bx, by, BALL_R);
    gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#ccc');
    ctx.fillStyle = gr; ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.stroke();
    const ba = Math.atan2(bvy, bvx);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(bx, by, BALL_R * 0.65, ba, ba + Math.PI * 0.8); ctx.stroke();

    // Player name labels
    ctx.font = 'bold 13px sans-serif'; ctx.textBaseline = 'middle';
    gs.players.forEach(p => {
      if (!p.active) return;
      const hearts = '❤️'.repeat(Math.max(0, p.lives));
      const label = `${p.emoji} ${p.name} ${hearts}`;
      ctx.fillStyle = p.lives > 0 ? p.color : '#6b7280';
      ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
      if (p.side === 'top')    { ctx.textAlign = 'center'; ctx.fillText(label, CW / 2, 16); }
      if (p.side === 'bottom') { ctx.textAlign = 'center'; ctx.fillText(label, CW / 2, CH - 8); }
      if (p.side === 'left')   { ctx.save(); ctx.translate(10, CH / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText(label, 0, 0); ctx.restore(); }
      if (p.side === 'right')  { ctx.save(); ctx.translate(CW - 10, CH / 2); ctx.rotate(Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText(label, 0, 0); ctx.restore(); }
      ctx.shadowBlur = 0;
    });
    ctx.restore();
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────
  const gameLoop = useCallback(() => {
    if (gsRef.current.phase !== 'playing') return;
    physicsStep(); draw();
    if (Math.random() < 0.17) broadcast();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [physicsStep, draw, broadcast]);

  const startGame = useCallback(() => {
    gsRef.current.phase = 'playing';
    gsRef.current.ball = newBall();
    gsRef.current.lastGoalMsg = '';
    broadcast(); syncDisplay();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [broadcast, syncDisplay, gameLoop]);

  // ── Question timer ────────────────────────────────────────────────────
  const resolveQuestion = useCallback((playerId: number, correct: boolean) => {
    const gs = gsRef.current;
    const p = gs.players[playerId];
    if (!correct) p.lives = Math.max(0, p.lives - 1);
    gs.question = null; gs.questionPlayerId = null;
    const alive = gs.players.filter(pl => pl.active && pl.lives > 0);
    if (alive.length <= 1) {
      gs.phase = 'gameover'; gs.winnerName = alive[0]?.name ?? '???';
      broadcast(); syncDisplay(); return;
    }
    gs.phase = 'playing'; gs.ball = newBall();
    broadcast(); syncDisplay();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [broadcast, syncDisplay, gameLoop]);

  const handleAnswer = useCallback((playerId: number, answerIdx: number) => {
    const gs = gsRef.current;
    if (gs.phase !== 'question' || gs.questionPlayerId !== playerId) return;
    if (qtRef.current) clearInterval(qtRef.current);
    resolveQuestion(playerId, gs.question?.correct === answerIdx);
  }, [resolveQuestion]);

  const startQuestionTimer = useCallback(() => {
    if (qtRef.current) clearInterval(qtRef.current);
    qtRef.current = setInterval(() => {
      const gs = gsRef.current;
      if (gs.phase !== 'question') { clearInterval(qtRef.current!); return; }
      gs.questionTimeLeft--;
      if (gs.questionTimeLeft <= 0) {
        clearInterval(qtRef.current!);
        resolveQuestion(gs.questionPlayerId!, false);
      } else {
        broadcast(); syncDisplay();
      }
    }, 1000);
  }, [broadcast, syncDisplay, resolveQuestion]);

  useEffect(() => { draw(); }, [draw]);

  // ── QR URLs — embed hostPeerId so phones know who to connect to ───────
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const playerUrls = PLAYER_DEFS.map(p =>
    hostPeerId ? `${baseUrl}#bullseye-player-${p.id}-${hostPeerId}` : null
  );

  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-black text-brand-dark-blue">⚽ בול פגיעה</h2>
          <p className="text-gray-500">משחק כדורגל פיננסי רב-משתתפים</p>
        </div>
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">← חזרה</button>
      </div>

      {/* Peer error */}
      {peerError && (
        <div className="rounded-2xl p-4 text-center font-bold text-red-300" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
          שגיאת חיבור: {peerError}<br />
          <span style={{ fontSize: 13, fontWeight: 400, color: '#94a3b8' }}>בדקו חיבור לאינטרנט ורעננו את הדף</span>
        </div>
      )}

      {/* LOBBY */}
      {phase === 'lobby' && (
        <div className="space-y-4">
          {/* Peer connecting indicator */}
          {!hostPeerId && !peerError && (
            <div className="rounded-2xl p-4 text-center text-blue-300 font-bold" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
              ⏳ יוצר חדר רב-משתתפים, רגע...
            </div>
          )}
          {hostPeerId && (
            <div className="rounded-2xl p-3 text-center text-green-300 font-bold text-sm" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
              ✅ חדר מוכן! סרקו את הברקוד מהטלפון
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAYER_DEFS.map((p, idx) => (
              <div key={p.id} className="rounded-2xl p-4 text-center space-y-3 shadow-lg" style={{ background: `linear-gradient(135deg,${p.color},${p.darkColor})` }}>
                <p className="text-4xl">{p.emoji}</p>
                <p className="text-white font-black text-lg">{SIDE_LABEL[p.side]}</p>
                {playerUrls[idx] ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=ffffff&data=${encodeURIComponent(playerUrls[idx]!)}`}
                    alt={`QR שחקן ${p.id + 1}`}
                    className="mx-auto rounded-xl"
                    style={{ width: 140, height: 140 }}
                  />
                ) : (
                  <div style={{ width: 140, height: 140, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="mx-auto">
                    <span style={{ fontSize: 32 }}>⏳</span>
                  </div>
                )}
                <div className="rounded-xl py-2 px-3 text-sm font-bold" style={{ background: displayGs.players[p.id].active ? 'rgba(74,222,128,0.9)' : 'rgba(255,255,255,0.25)', color: '#fff' }}>
                  {displayGs.players[p.id].active ? `✅ ${displayGs.players[p.id].name}` : '⏳ ממתין...'}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-2">
            <button
              onClick={startGame}
              disabled={!hostPeerId || !displayGs.players.some(p => p.active)}
              className="px-10 py-4 rounded-2xl font-black text-xl text-black transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)', boxShadow: '0 0 32px rgba(255,215,0,0.5)' }}
            >
              🚀 התחל משחק!
            </button>
            <p className="text-gray-500 text-sm">
              {!hostPeerId ? 'ממתין לחדר...' : 'לפחות שחקן אחד חייב להתחבר לפני שמתחילים'}
            </p>
          </div>
        </div>
      )}

      {/* PLAYING / QUESTION / GAMEOVER */}
      {phase !== 'lobby' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {displayGs.players.filter(p => p.active).map(p => (
              <div key={p.id} className="rounded-xl p-3 text-center" style={{ background: `linear-gradient(135deg,${p.color}33,${p.color}11)`, border: `2px solid ${p.color}` }}>
                <p className="text-xl">{p.emoji}</p>
                <p className="font-bold text-sm" style={{ color: p.color }}>{p.name}</p>
                <p className="text-xs">{Array.from({ length: Math.max(0, p.lives) }).map((_, i) => <span key={i}>❤️</span>)}{p.lives === 0 ? '💀' : ''}</p>
                <p className="text-xs text-gray-500">גולים: {p.score}</p>
              </div>
            ))}
          </div>

          {displayGs.lastGoalMsg && phase === 'question' && (
            <div className="text-center text-2xl font-black text-yellow-500 animate-bounce">{displayGs.lastGoalMsg}</div>
          )}

          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#14532d' }}>
            <canvas
              ref={canvasRef} width={CW} height={CH}
              style={{ width: '100%', maxWidth: CW, display: 'block', margin: '0 auto' }}
            />

            {/* Question overlay */}
            {phase === 'question' && displayGs.question && displayGs.questionPlayerId != null && (() => {
              const qp = displayGs.players[displayGs.questionPlayerId];
              return (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
                  <div className="rounded-3xl p-8 text-center space-y-5 w-full max-w-lg mx-4" style={{ background: 'linear-gradient(145deg,#1e1b4b,#312e81)', border: `3px solid ${qp.color}`, boxShadow: `0 0 60px ${qp.color}55` }}>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <span className="text-4xl">{qp.emoji}</span>
                      <div>
                        <p className="text-white font-black text-xl">{qp.name}</p>
                        <p className="text-purple-300 text-sm">עונה מהטלפון</p>
                      </div>
                      <span className={`text-3xl font-black ${displayGs.questionTimeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>⏱{displayGs.questionTimeLeft}s</span>
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <p className="text-white text-xl font-bold">{displayGs.question.prompt}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-right">
                      {displayGs.question.options.map((opt, idx) => (
                        <div key={idx} className="rounded-xl px-4 py-3 font-semibold text-white text-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,215,0,0.25)' }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Game over overlay */}
            {phase === 'gameover' && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
                <div className="text-center space-y-6 p-8 rounded-3xl mx-4" style={{ background: 'linear-gradient(145deg,#0f0c29,#302b63)', border: '2px solid rgba(255,215,0,0.5)' }}>
                  <p className="text-7xl animate-bounce">🏆</p>
                  <h3 className="text-4xl font-black text-white">המשחק הסתיים!</h3>
                  <p className="text-2xl text-yellow-300 font-bold">מנצח: {displayGs.winnerName}</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button
                      onClick={() => {
                        cancelAnimationFrame(rafRef.current);
                        if (qtRef.current) clearInterval(qtRef.current);
                        connsRef.current.clear();
                        gsRef.current = makeInitialState();
                        syncDisplay(); draw();
                      }}
                      className="px-6 py-3 rounded-2xl font-black text-black"
                      style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)' }}>
                      🔄 משחק חדש
                    </button>
                    <button onClick={onBack} className="px-6 py-3 rounded-2xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>חזרה</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {phase !== 'gameover' && (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  cancelAnimationFrame(rafRef.current);
                  if (qtRef.current) clearInterval(qtRef.current);
                  connsRef.current.clear();
                  gsRef.current = makeInitialState();
                  syncDisplay(); draw();
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-white text-sm"
                style={{ background: 'rgba(239,68,68,0.7)', border: '1px solid rgba(239,68,68,0.5)' }}>
                🔄 אפס משחק
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BullseyeGame;
