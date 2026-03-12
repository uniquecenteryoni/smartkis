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
interface BallState {
  x: number; y: number; vx: number; vy: number;
  stuck: boolean; stuckPlayerId: number | null; stuckAngle: number;
}
interface GameState {
  phase: Phase; players: PlayerState[]; ball: BallState;
  questionPlayerId: number | null; question: SQ | null; questionTimeLeft: number;
  questionAnswered: boolean;
  winnerName: string | null; lastMsg: string;
}
interface Msg {
  type: 'JOIN' | 'MOVE' | 'ANSWER' | 'KICK' | 'STATE';
  playerId?: number; name?: string; delta?: number; answerIdx?: number;
  holdMs?: number; state?: GameState;
}

// ─── Constants ─────────────────────────────────────────────────────────────
const CW = 800, CH = 600;
const BALL_R = 13;
const GK_RADIUS = 130;    // semicircle radius (2× original goal span of 130)
const BALL_SPEED = 9;
const GK_MOVE = 0.028;
const MAX_KICK_SPEED = 22;
const MIN_KICK_SPEED = 5;
const MAX_HOLD_MS = 2000;

const PLAYER_DEFS: Pick<PlayerState, 'id' | 'side' | 'color' | 'darkColor' | 'emoji'>[] = [
  { id: 0, side: 'top',    color: '#3b82f6', darkColor: '#1d4ed8', emoji: '🔵' },
  { id: 1, side: 'bottom', color: '#ef4444', darkColor: '#b91c1c', emoji: '🔴' },
  { id: 2, side: 'left',   color: '#f59e0b', darkColor: '#b45309', emoji: '🟡' },
  { id: 3, side: 'right',  color: '#22c55e', darkColor: '#15803d', emoji: '🟢' },
];
const SIDE_LABEL: Record<Side, string> = { top: 'צפון ↑', bottom: 'דרום ↓', left: 'מערב ←', right: 'מזרח →' };

// ─── Helpers ────────────────────────────────────────────────────────────────
// Center of the semicircle goalkeeper on the field edge
const gkCenter = (side: Side, pos: number): { cx: number; cy: number } => {
  if (side === 'top')    return { cx: pos * CW, cy: 0 };
  if (side === 'bottom') return { cx: pos * CW, cy: CH };
  if (side === 'left')   return { cx: 0, cy: pos * CH };
  return { cx: CW, cy: pos * CH };
};

const freshBall = (): BallState => {
  const a = Math.random() * Math.PI * 2;
  return { x: CW / 2, y: CH / 2, vx: Math.cos(a) * BALL_SPEED, vy: Math.sin(a) * BALL_SPEED, stuck: false, stuckPlayerId: null, stuckAngle: 0 };
};

const makeInitialState = (): GameState => ({
  phase: 'lobby',
  players: PLAYER_DEFS.map(p => ({ ...p, name: `שחקן ${p.id + 1}`, lives: 3, score: 0, gkPos: 0.5, active: false })),
  ball: freshBall(),
  questionPlayerId: null, question: null, questionTimeLeft: 60, questionAnswered: false,
  winnerName: null, lastMsg: '',
});

// ─── BullseyePlayerView — mobile screen ────────────────────────────────────
// Hash: #bullseye-player-{playerId}-{hostPeerId}
export const BullseyePlayerView: React.FC = () => {
  const hashMatch  = window.location.hash.match(/#bullseye-player-(\d)-(.+)/);
  const playerId   = hashMatch ? parseInt(hashMatch[1]) : 0;
  const hostPeerId = hashMatch ? hashMatch[2] : null;
  const def = PLAYER_DEFS[playerId] ?? PLAYER_DEFS[0];

  const [status, setStatus]         = useState<'connecting' | 'ready' | 'joined' | 'error'>('connecting');
  const [inputName, setInputName]   = useState('');
  const [gs, setGs]                 = useState<GameState | null>(null);
  const [answerSent, setAnswerSent] = useState(false);
  const [kickPower, setKickPower]   = useState(0);   // 0..1
  const [errMsg, setErrMsg]         = useState('');

  const connRef         = useRef<DataConnection | null>(null);
  const peerRef         = useRef<Peer | null>(null);
  const moveHoldRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const kickStartRef    = useRef<number | null>(null);
  const kickPowerTimer  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!hostPeerId) { setStatus('error'); setErrMsg('קישור לא תקין – סרקו מחדש'); return; }
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
    moveHoldRef.current = setInterval(() => send({ type: 'MOVE', playerId, delta }), 80);
  };
  const stopMove = () => { if (moveHoldRef.current) { clearInterval(moveHoldRef.current); moveHoldRef.current = null; } };

  const onKickDown = () => {
    kickStartRef.current = Date.now();
    kickPowerTimer.current = setInterval(() => {
      if (kickStartRef.current != null) {
        setKickPower(Math.min(1, (Date.now() - kickStartRef.current) / MAX_HOLD_MS));
      }
    }, 40);
  };
  const onKickUp = () => {
    if (kickPowerTimer.current) { clearInterval(kickPowerTimer.current); kickPowerTimer.current = null; }
    if (kickStartRef.current != null) {
      const holdMs = Date.now() - kickStartRef.current;
      send({ type: 'KICK', playerId, holdMs });
      kickStartRef.current = null;
      setKickPower(0);
    }
  };

  const sendAnswer = (idx: number) => {
    if (answerSent) return;
    send({ type: 'ANSWER', playerId, answerIdx: idx });
    setAnswerSent(true);
  };

  const me = gs?.players[playerId];
  const isMyBall = gs?.phase === 'question' && gs.ball.stuckPlayerId === playerId;

  // ── Connecting ──────────────────────────────────────────────────────────
  if (status === 'connecting') {
    return (
      <div style={{ background: `linear-gradient(135deg,${def.color},${def.darkColor})`, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 24 }}>
        <p style={{ fontSize: 64, margin: 0 }}>{def.emoji}</p>
        <p style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>מתחבר...</p>
        <div style={{ width: 48, height: 48, border: '5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <p style={{ fontSize: 60 }}>❌</p>
        <p style={{ color: '#f87171', fontSize: 22, fontWeight: 900, textAlign: 'center' }}>שגיאת חיבור</p>
        <p style={{ color: '#94a3b8', fontSize: 15, textAlign: 'center' }}>{errMsg}</p>
        <button onClick={() => window.location.reload()} style={{ background: '#3b82f6', color: '#fff', fontSize: 18, fontWeight: 900, padding: '14px 32px', borderRadius: 16, border: 'none', cursor: 'pointer' }}>🔄 נסה שוב</button>
      </div>
    );
  }

  // ── Name entry ──────────────────────────────────────────────────────────
  if (status === 'ready') {
    return (
      <div style={{ background: `linear-gradient(135deg,${def.color},${def.darkColor})`, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}>
        <p style={{ fontSize: 72, margin: 0 }}>{def.emoji}</p>
        <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, textAlign: 'center', margin: 0 }}>{SIDE_LABEL[def.side]}</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: 0 }}>✅ מחובר</p>
        <input value={inputName} onChange={e => setInputName(e.target.value)} onKeyDown={e => e.key === 'Enter' && join()}
          placeholder="הכנס שמך..." dir="rtl" autoFocus
          style={{ fontSize: 22, padding: '14px 20px', borderRadius: 16, border: '3px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.15)', color: '#fff', width: '100%', maxWidth: 320, textAlign: 'center', outline: 'none' }} />
        <button onClick={join} style={{ background: '#fff', color: def.color, fontSize: 22, fontWeight: 900, padding: '16px 48px', borderRadius: 20, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ✅ הצטרף
        </button>
      </div>
    );
  }

  // ── In-game ─────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16, gap: 14, userSelect: 'none' }}>
      {/* Header card */}
      <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '12px 20px', textAlign: 'center', border: `2px solid ${def.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 32 }}>{def.emoji}</span>
          <div>
            <p style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 900 }}>{me?.name ?? inputName}</p>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>{SIDE_LABEL[def.side]}</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, color: '#ffd700', fontSize: 20, fontWeight: 900 }}>{me?.score ?? 0} pts</p>
            <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {Array.from({ length: Math.max(0, me?.lives ?? 3) }).map((_, i) => <span key={i} style={{ fontSize: 16 }}>❤️</span>)}
              {(me?.lives ?? 3) === 0 && <span style={{ fontSize: 16 }}>💀</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Lobby */}
      {(!gs || gs.phase === 'lobby') && (
        <p style={{ color: '#fbbf24', fontSize: 20, fontWeight: 700, textAlign: 'center', marginTop: 20 }}>
          ✅ הצטרפת!<br /><span style={{ color: '#94a3b8', fontSize: 16 }}>ממתין לתחילת המשחק...</span>
        </p>
      )}

      {/* Playing — GK movement controls */}
      {gs?.phase === 'playing' && (
        <>
          <p style={{ color: '#94a3b8', fontSize: 15, margin: 0 }}>הזזת שוער — לחץ והחזק</p>
          <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 420 }}>
            {(['←', '→'] as const).map((arrow, i) => (
              <button key={i}
                onPointerDown={() => startMove(i === 0 ? -1 : 1)} onPointerUp={stopMove} onPointerLeave={stopMove} onPointerCancel={stopMove}
                style={{ flex: 1, height: 150, background: `linear-gradient(135deg,${def.color},${def.darkColor})`, color: '#fff', fontSize: 68, fontWeight: 900, borderRadius: 28, border: '3px solid rgba(255,255,255,0.3)', cursor: 'pointer', touchAction: 'none' }}>
                {arrow}
              </button>
            ))}
          </div>
          <p style={{ color: '#475569', fontSize: 13, textAlign: 'center' }}>
            {def.side === 'top' || def.side === 'bottom' ? '← = שמאל  |  → = ימין' : '← = מעלה  |  → = מטה'}
          </p>
        </>
      )}

      {/* My ball — question + kick */}
      {isMyBall && gs?.question && (
        <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Timer */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: gs.questionTimeLeft <= 10 ? '#ef4444' : '#ffd700' }}>⏱ {gs.questionTimeLeft}s</span>
          </div>

          {/* Question */}
          <div style={{ background: 'linear-gradient(145deg,#1e1b4b,#312e81)', borderRadius: 20, padding: 20, border: '2px solid #ffd700', boxShadow: '0 0 30px rgba(255,215,0,0.25)' }}>
            <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, textAlign: 'center', marginBottom: 14, lineHeight: 1.5 }}>{gs.question.prompt}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {gs.question.options.map((opt, idx) => (
                <button key={idx} onClick={() => sendAnswer(idx)} disabled={answerSent}
                  style={{ background: answerSent ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 16, fontWeight: 700, padding: '13px 14px', borderRadius: 12, border: '1px solid rgba(255,215,0,0.3)', cursor: answerSent ? 'not-allowed' : 'pointer', textAlign: 'right', opacity: answerSent ? 0.55 : 1 }}>
                  {opt}
                </button>
              ))}
            </div>
            {answerSent && <p style={{ color: '#4ade80', textAlign: 'center', fontWeight: 700, marginTop: 10 }}>✅ נשלחה</p>}
          </div>

          {/* Kick button */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 16, border: '1px solid rgba(255,255,255,0.15)' }}>
            <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', margin: '0 0 10px' }}>לחץ והחזק לטעינת עוצמת הבעיטה — שחרר לבעוט!</p>
            {/* Power bar */}
            <div style={{ height: 10, borderRadius: 8, background: 'rgba(255,255,255,0.15)', marginBottom: 12, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 8, width: `${kickPower * 100}%`, background: kickPower > 0.7 ? '#ef4444' : kickPower > 0.4 ? '#f59e0b' : '#22c55e', transition: 'background 0.2s' }} />
            </div>
            <button
              onPointerDown={onKickDown} onPointerUp={onKickUp} onPointerLeave={onKickUp} onPointerCancel={onKickUp}
              style={{ width: '100%', height: 80, background: kickPower > 0 ? `linear-gradient(135deg,${def.color},${def.darkColor})` : 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 30, fontWeight: 900, borderRadius: 20, border: `3px solid ${kickPower > 0 ? '#fff' : 'rgba(255,255,255,0.2)'}`, cursor: 'pointer', touchAction: 'none', letterSpacing: 2 }}>
              🦵 בעיטה
            </button>
          </div>
        </div>
      )}

      {/* Someone else's ball */}
      {gs?.phase === 'question' && !isMyBall && gs.question && (
        <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 20, textAlign: 'center' }}>
          {(() => { const qp = gs.players[gs.questionPlayerId ?? 0]; return (
            <><p style={{ color: '#fbbf24', fontSize: 17, fontWeight: 700 }}>{qp?.emoji} {qp?.name} עונה ובועט...</p>
            <p style={{ color: '#94a3b8', fontSize: 15 }}>{gs.question.prompt}</p></>
          ); })()}
        </div>
      )}

      {/* Game over */}
      {gs?.phase === 'gameover' && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: 60 }}>🏆</p>
          <p style={{ color: '#ffd700', fontSize: 28, fontWeight: 900 }}>המשחק הסתיים!</p>
          <p style={{ color: '#fff', fontSize: 20 }}>מנצח: {gs.winnerName}</p>
          <p style={{ color: '#ffd700', fontSize: 22, fontWeight: 900, marginTop: 8 }}>הניקוד שלך: {me?.score ?? 0} pts</p>
        </div>
      )}
    </div>
  );
};

// ─── BullseyeGame — Host ────────────────────────────────────────────────────
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

  // ── Helpers ───────────────────────────────────────────────────────────
  const broadcast = useCallback(() => {
    const msg: Msg = { type: 'STATE', state: gsRef.current };
    connsRef.current.forEach(conn => { if (conn.open) conn.send(msg); });
  }, []);

  const syncDisplay = useCallback(() => {
    setDisplayGs({ ...gsRef.current, players: gsRef.current.players.map(p => ({ ...p })) });
    setPhase(gsRef.current.phase);
  }, []);

  // Apply answer result immediately when ANSWER is received
  const applyAnswerResult = useCallback((playerId: number, correct: boolean) => {
    const gs = gsRef.current;
    const p = gs.players[playerId];
    if (correct) {
      p.score += 100;
      gs.lastMsg = `✅ ${p.emoji} ${p.name} ענה/תה נכון! +100 נקודות! 🎉`;
    } else {
      p.lives = Math.max(0, p.lives - 1);
      gs.lastMsg = p.lives === 0
        ? `💀 ${p.emoji} ${p.name} יצא/ה מהמשחק!`
        : `❌ ${p.emoji} ${p.name} ענה/תה לא נכון! -לב`;
    }
  }, []);

  // Check if game should end after an answer / kick
  const checkGameOver = useCallback((): boolean => {
    const gs = gsRef.current;
    const alive = gs.players.filter(p => p.active && p.lives > 0);
    if (alive.length <= 1) {
      gs.phase = 'gameover';
      gs.winnerName = alive[0]?.name ?? 'אין מנצח';
      gs.ball = { ...gs.ball, stuck: false, stuckPlayerId: null, vx: 0, vy: 0 };
      broadcast(); syncDisplay();
      return true;
    }
    return false;
  }, [broadcast, syncDisplay]);

  // ── PeerJS Setup ──────────────────────────────────────────────────────
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
          broadcast(); syncDisplay();
        }
        // Accept MOVE during 'playing' AND 'question' (so player can aim the kick)
        if (msg.type === 'MOVE' && msg.playerId != null && msg.delta != null &&
            (gsRef.current.phase === 'playing' || gsRef.current.phase === 'question')) {
          movesRef.current.push({ playerId: msg.playerId, delta: msg.delta });
        }
        if (msg.type === 'ANSWER' && msg.playerId != null && msg.answerIdx != null) {
          handleAnswer(msg.playerId, msg.answerIdx);
        }
        if (msg.type === 'KICK' && msg.playerId != null && msg.holdMs != null) {
          handleKick(msg.playerId, msg.holdMs);
        }
      });
    });
    peer.on('error', (e) => setPeerError(String(e)));
    return () => { peer.destroy(); cancelAnimationFrame(rafRef.current); if (qtRef.current) clearInterval(qtRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Apply GK movement and update stuck ball position ────────────────
  const applyMoves = useCallback(() => {
    const gs = gsRef.current;
    const moves = movesRef.current.splice(0);
    moves.forEach(({ playerId, delta }) => {
      const p = gs.players[playerId];
      if (!p?.active || p.lives <= 0) return;
      p.gkPos = Math.max(0.05, Math.min(0.95, p.gkPos + delta * GK_MOVE));
      // If ball is stuck to this player, update ball position to follow GK
      if (gs.ball.stuck && gs.ball.stuckPlayerId === playerId) {
        const { cx, cy } = gkCenter(p.side, p.gkPos);
        const angle = gs.ball.stuckAngle;
        gs.ball = { ...gs.ball, x: cx + Math.cos(angle) * (GK_RADIUS + BALL_R), y: cy + Math.sin(angle) * (GK_RADIUS + BALL_R) };
      }
    });
  }, []);

  // ── Physics ───────────────────────────────────────────────────────────
  const physicsStep = useCallback(() => {
    const gs = gsRef.current;

    // GK movement + stuck-ball update
    applyMoves();

    const { x: bsx, y: bsy, vx: bsvx, vy: bsvy } = gs.ball;
    let x = bsx, y = bsy, vx = bsvx, vy = bsvy;
    x += vx; y += vy;

    // Semicircle collision detection for each alive player
    for (const p of gs.players) {
      if (!p.active || p.lives <= 0) continue;
      const { cx, cy } = gkCenter(p.side, p.gkPos);
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= GK_RADIUS + BALL_R) {
        // Ball sticks to this player's semicircle
        const angle = dist > 0 ? Math.atan2(dy, dx) : Math.PI / 4;
        const sx = cx + Math.cos(angle) * (GK_RADIUS + BALL_R);
        const sy = cy + Math.sin(angle) * (GK_RADIUS + BALL_R);
        gs.ball = { x: sx, y: sy, vx: 0, vy: 0, stuck: true, stuckPlayerId: p.id, stuckAngle: angle };
        gs.phase = 'question';
        gs.questionPlayerId = p.id;
        gs.question = pickQuestion();
        gs.questionTimeLeft = 60;
        gs.questionAnswered = false;
        gs.lastMsg = `⚽ ${p.emoji} ${p.name} — ענה ובעט!`;
        broadcast(); syncDisplay(); startQuestionTimer();
        return;
      }
    }

    // Wall bounce — all 4 walls
    if (x - BALL_R <= 0)  { x = BALL_R;      vx = Math.abs(vx); }
    if (x + BALL_R >= CW) { x = CW - BALL_R; vx = -Math.abs(vx); }
    if (y - BALL_R <= 0)  { y = BALL_R;      vy = Math.abs(vy); }
    if (y + BALL_R >= CH) { y = CH - BALL_R; vy = -Math.abs(vy); }

    gs.ball = { ...gs.ball, x, y, vx, vy };
  }, [broadcast, syncDisplay, applyMoves]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Draw ──────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const gs = gsRef.current;
    const sx = canvas.width / CW, sy = canvas.height / CH;
    ctx.save(); ctx.scale(sx, sy);

    // Pitch stripes
    for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 === 0 ? '#166534' : '#15803d'; ctx.fillRect(i * CW / 8, 0, CW / 8, CH); }

    // Field markings
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, CW - 60, CH - 60);
    ctx.beginPath(); ctx.moveTo(CW / 2, 30); ctx.lineTo(CW / 2, CH - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, CH / 2); ctx.lineTo(CW - 30, CH / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(CW / 2, CH / 2, 65, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(CW / 2, CH / 2, 4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();

    // Semicircle goalkeepers
    gs.players.forEach(p => {
      if (!p.active) return;
      const { cx, cy } = gkCenter(p.side, p.gkPos);
      const alive = p.lives > 0;

      // Glow when ball is stuck to this player
      if (gs.ball.stuck && gs.ball.stuckPlayerId === p.id) {
        ctx.save();
        ctx.shadowColor = p.color; ctx.shadowBlur = 30;
        ctx.beginPath();
        if (p.side === 'top')    ctx.arc(cx, cy, GK_RADIUS, 0, Math.PI, false);
        if (p.side === 'bottom') ctx.arc(cx, cy, GK_RADIUS, -Math.PI, 0, false);
        if (p.side === 'left')   ctx.arc(cx, cy, GK_RADIUS, -Math.PI / 2, Math.PI / 2, false);
        if (p.side === 'right')  ctx.arc(cx, cy, GK_RADIUS, Math.PI / 2, 3 * Math.PI / 2, false);
        ctx.closePath(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
        ctx.restore();
      }

      // Draw semicircle
      ctx.beginPath();
      if (p.side === 'top')    ctx.arc(cx, cy, GK_RADIUS, 0, Math.PI, false);
      if (p.side === 'bottom') ctx.arc(cx, cy, GK_RADIUS, -Math.PI, 0, false);
      if (p.side === 'left')   ctx.arc(cx, cy, GK_RADIUS, -Math.PI / 2, Math.PI / 2, false);
      if (p.side === 'right')  ctx.arc(cx, cy, GK_RADIUS, Math.PI / 2, 3 * Math.PI / 2, false);
      ctx.closePath();
      ctx.fillStyle = alive ? p.color + 'bb' : '#374151aa';
      ctx.fill();
      ctx.strokeStyle = alive ? '#fff' : '#555'; ctx.lineWidth = 3; ctx.stroke();

      // Emoji label inside dome
      const offset = GK_RADIUS * 0.5;
      let lx = cx, ly = cy;
      if (p.side === 'top')    ly = offset;
      if (p.side === 'bottom') ly = CH - offset;
      if (p.side === 'left')   lx = offset;
      if (p.side === 'right')  lx = CW - offset;
      ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p.lives > 0 ? p.emoji : '💀', lx, ly);
    });

    // Player name labels at edges
    ctx.font = 'bold 12px sans-serif'; ctx.textBaseline = 'middle';
    gs.players.forEach(p => {
      if (!p.active) return;
      const hearts = '❤️'.repeat(Math.max(0, p.lives));
      const label = `${p.name} ${p.score}pts ${hearts}${p.lives === 0 ? '💀' : ''}`;
      ctx.fillStyle = p.lives > 0 ? p.color : '#6b7280';
      ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 5;
      if (p.side === 'top')    { ctx.textAlign = 'center'; ctx.fillText(label, CW / 2, 14); }
      if (p.side === 'bottom') { ctx.textAlign = 'center'; ctx.fillText(label, CW / 2, CH - 6); }
      if (p.side === 'left')   { ctx.save(); ctx.translate(9, CH / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText(label, 0, 0); ctx.restore(); }
      if (p.side === 'right')  { ctx.save(); ctx.translate(CW - 9, CH / 2); ctx.rotate(Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText(label, 0, 0); ctx.restore(); }
      ctx.shadowBlur = 0;
    });

    // Ball shadow
    const { x: bx, y: by, vx: bvx, vy: bvy } = gs.ball;
    if (!gs.ball.stuck) {
      ctx.beginPath(); ctx.ellipse(bx, by + BALL_R * 0.5, BALL_R * 0.75, BALL_R * 0.28, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
    }

    // Ball
    ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI * 2);
    if (gs.ball.stuck) {
      // Pulsing glow when stuck
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 20;
      ctx.fill(); ctx.shadowBlur = 0;
    } else {
      const gr = ctx.createRadialGradient(bx - BALL_R * 0.35, by - BALL_R * 0.35, 1, bx, by, BALL_R);
      gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#ccc');
      ctx.fillStyle = gr; ctx.fill();
      ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.stroke();
      const ba = Math.atan2(bvy, bvx);
      ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(bx, by, BALL_R * 0.65, ba, ba + Math.PI * 0.8); ctx.stroke();
    }

    ctx.restore();
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────
  const gameLoop = useCallback(() => {
    const phase = gsRef.current.phase;
    if (phase === 'playing') {
      physicsStep(); draw();
      if (Math.random() < 0.17) broadcast();
    } else if (phase === 'question') {
      // Still process GK moves + redraw so player can aim the stuck ball
      applyMoves(); draw();
      if (Math.random() < 0.17) broadcast();
    } else {
      return; // lobby / gameover: stop loop
    }
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [physicsStep, draw, broadcast, applyMoves]);

  const startGame = useCallback(() => {
    gsRef.current.phase = 'playing';
    gsRef.current.ball = freshBall();
    gsRef.current.lastMsg = '';
    broadcast(); syncDisplay();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [broadcast, syncDisplay, gameLoop]);

  // ── Answer handler ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((playerId: number, answerIdx: number) => {
    const gs = gsRef.current;
    if (gs.phase !== 'question' || gs.questionPlayerId !== playerId) return;
    if (gs.questionAnswered) return; // already answered
    gs.questionAnswered = true;
    const correct = gs.question?.correct === answerIdx;
    applyAnswerResult(playerId, correct);
    broadcast(); syncDisplay();
  }, [applyAnswerResult, broadcast, syncDisplay]);

  // ── Kick handler ──────────────────────────────────────────────────────
  const handleKick = useCallback((playerId: number, holdMs: number) => {
    const gs = gsRef.current;
    if (gs.phase !== 'question' || gs.ball.stuckPlayerId !== playerId) return;

    // If no answer given yet, count as wrong
    if (!gs.questionAnswered) {
      gs.questionAnswered = true;
      applyAnswerResult(playerId, false);
    }

    if (qtRef.current) clearInterval(qtRef.current);

    // Check game over first
    if (checkGameOver()) return;

    // Compute kick: direction = away from gkCenter (stuckAngle points from center to ball)
    const speed = MIN_KICK_SPEED + (Math.min(holdMs, MAX_HOLD_MS) / MAX_HOLD_MS) * (MAX_KICK_SPEED - MIN_KICK_SPEED);
    const kickAngle = gs.ball.stuckAngle; // direction: from gkCenter outward into field

    gs.ball = {
      ...gs.ball,
      vx: Math.cos(kickAngle) * speed,
      vy: Math.sin(kickAngle) * speed,
      stuck: false,
      stuckPlayerId: null,
    };
    gs.phase = 'playing';
    gs.question = null;
    gs.questionPlayerId = null;

    broadcast(); syncDisplay();
    // gameLoop is already running (it continues during question phase)
  }, [applyAnswerResult, checkGameOver, broadcast, syncDisplay]);

  // ── Question timer ─────────────────────────────────────────────────────
  const startQuestionTimer = useCallback(() => {
    if (qtRef.current) clearInterval(qtRef.current);
    qtRef.current = setInterval(() => {
      const gs = gsRef.current;
      if (gs.phase !== 'question') { clearInterval(qtRef.current!); return; }
      gs.questionTimeLeft--;
      if (gs.questionTimeLeft <= 0) {
        clearInterval(qtRef.current!);
        // Time out: if not answered → wrong
        if (!gs.questionAnswered && gs.questionPlayerId != null) {
          gs.questionAnswered = true;
          applyAnswerResult(gs.questionPlayerId, false);
        }
        if (!checkGameOver()) {
          // Auto-kick at minimum power
          gs.ball = {
            ...gs.ball,
            vx: Math.cos(gs.ball.stuckAngle) * MIN_KICK_SPEED,
            vy: Math.sin(gs.ball.stuckAngle) * MIN_KICK_SPEED,
            stuck: false, stuckPlayerId: null,
          };
          gs.phase = 'playing';
          gs.question = null;
          gs.questionPlayerId = null;
          broadcast(); syncDisplay();
          // gameLoop is already running
        }
      } else {
        broadcast(); syncDisplay();
      }
    }, 1000);
  }, [applyAnswerResult, checkGameOver, broadcast, syncDisplay]);

  useEffect(() => { draw(); }, [draw]);

  // ── QR URLs ───────────────────────────────────────────────────────────
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const playerUrls = PLAYER_DEFS.map(p => hostPeerId ? `${baseUrl}#bullseye-player-${p.id}-${hostPeerId}` : null);

  const resetGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (qtRef.current) clearInterval(qtRef.current);
    connsRef.current.clear();
    gsRef.current = makeInitialState();
    syncDisplay(); draw();
  }, [syncDisplay, draw]);

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
        <div className="rounded-2xl p-4 text-center font-bold text-red-300" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
          שגיאת חיבור: {peerError}
        </div>
      )}

      {/* LOBBY */}
      {phase === 'lobby' && (
        <div className="space-y-4">
          {!hostPeerId && !peerError && (
            <div className="rounded-2xl p-4 text-center text-blue-300 font-bold" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>⏳ יוצר חדר...</div>
          )}
          {hostPeerId && (
            <div className="rounded-2xl p-3 text-center text-green-300 font-bold text-sm" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>✅ חדר מוכן — סרקו ברקוד מהטלפון</div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAYER_DEFS.map((p, idx) => (
              <div key={p.id} className="rounded-2xl p-4 text-center space-y-3 shadow-lg" style={{ background: `linear-gradient(135deg,${p.color},${p.darkColor})` }}>
                <p className="text-4xl">{p.emoji}</p>
                <p className="text-white font-black text-lg">{SIDE_LABEL[p.side]}</p>
                {playerUrls[idx] ? (
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=ffffff&data=${encodeURIComponent(playerUrls[idx]!)}`}
                    alt={`QR ${p.id + 1}`} className="mx-auto rounded-xl" style={{ width: 140, height: 140 }} />
                ) : (
                  <div style={{ width: 140, height: 140, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="mx-auto"><span style={{ fontSize: 32 }}>⏳</span></div>
                )}
                <div className="rounded-xl py-2 px-3 text-sm font-bold" style={{ background: displayGs.players[p.id].active ? 'rgba(74,222,128,0.9)' : 'rgba(255,255,255,0.25)', color: '#fff' }}>
                  {displayGs.players[p.id].active ? `✅ ${displayGs.players[p.id].name}` : '⏳ ממתין...'}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center space-y-2">
            <button onClick={startGame} disabled={!hostPeerId || !displayGs.players.some(p => p.active)}
              className="px-10 py-4 rounded-2xl font-black text-xl text-black transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)', boxShadow: '0 0 32px rgba(255,215,0,0.5)' }}>
              🚀 התחל משחק!
            </button>
            <p className="text-gray-500 text-sm">{!hostPeerId ? 'ממתין...' : 'לפחות שחקן אחד — ואז לחצו התחל'}</p>
          </div>
        </div>
      )}

      {/* IN-GAME */}
      {phase !== 'lobby' && (
        <div className="space-y-3">

          {/* ── Score board ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {displayGs.players.filter(p => p.active).map(p => (
              <div key={p.id} className="rounded-xl p-3 text-center" style={{ background: `linear-gradient(135deg,${p.color}22,${p.color}08)`, border: `2px solid ${p.lives > 0 ? p.color : '#374151'}` }}>
                <p className="text-xl">{p.emoji}</p>
                <p className="font-bold text-sm truncate" style={{ color: p.lives > 0 ? p.color : '#6b7280' }}>{p.name}</p>
                <p className="text-base font-black text-yellow-400">{p.score} <span className="text-xs font-normal text-gray-400">pts</span></p>
                <p className="text-xs mt-0.5">{Array.from({ length: Math.max(0, p.lives) }).map((_, i) => <span key={i}>❤️</span>)}{p.lives === 0 ? '💀' : ''}</p>
              </div>
            ))}
          </div>

          {/* Last message */}
          {displayGs.lastMsg && (
            <div className="text-center text-lg font-black text-yellow-400 rounded-xl py-2 px-4" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)' }}>
              {displayGs.lastMsg}
            </div>
          )}

          {/* Canvas */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#14532d' }}>
            <canvas ref={canvasRef} width={CW} height={CH} style={{ width: '100%', maxWidth: CW, display: 'block', margin: '0 auto' }} />

            {/* Question overlay */}
            {phase === 'question' && displayGs.question && displayGs.questionPlayerId != null && (() => {
              const qp = displayGs.players[displayGs.questionPlayerId];
              return (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }}>
                  <div className="rounded-3xl p-7 text-center space-y-4 w-full max-w-md mx-4" style={{ background: 'linear-gradient(145deg,#1e1b4b,#312e81)', border: `3px solid ${qp.color}`, boxShadow: `0 0 60px ${qp.color}55` }}>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl">{qp.emoji}</span>
                      <div>
                        <p className="text-white font-black text-lg">{qp.name}</p>
                        <p className="text-purple-300 text-sm">עונה ובועט מהטלפון</p>
                      </div>
                      <span className={`text-2xl font-black ${displayGs.questionTimeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>⏱{displayGs.questionTimeLeft}s</span>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-white text-lg font-bold">{displayGs.question.prompt}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-right">
                      {displayGs.question.options.map((opt, idx) => (
                        <div key={idx} className="rounded-xl px-3 py-2 font-semibold text-white text-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>{opt}</div>
                      ))}
                    </div>
                    {displayGs.questionAnswered && <p className="text-green-400 font-bold text-sm">✅ תשובה נשלחה — ממתין לבעיטה...</p>}
                  </div>
                </div>
              );
            })()}

            {/* Game over overlay */}
            {phase === 'gameover' && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
                <div className="text-center space-y-5 p-8 rounded-3xl mx-4" style={{ background: 'linear-gradient(145deg,#0f0c29,#302b63)', border: '2px solid rgba(255,215,0,0.5)' }}>
                  <p className="text-6xl animate-bounce">🏆</p>
                  <h3 className="text-3xl font-black text-white">המשחק הסתיים!</h3>
                  <p className="text-xl text-yellow-300 font-bold">מנצח: {displayGs.winnerName}</p>
                  {/* Final scores */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {displayGs.players.filter(p => p.active).sort((a, b) => b.score - a.score).map(p => (
                      <div key={p.id} className="rounded-xl px-4 py-2 text-center" style={{ background: `${p.color}33`, border: `1px solid ${p.color}` }}>
                        <p style={{ color: p.color }} className="font-black text-sm">{p.emoji} {p.name}</p>
                        <p className="text-yellow-300 font-black text-lg">{p.score} pts</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button onClick={resetGame} className="px-6 py-3 rounded-2xl font-black text-black" style={{ background: 'linear-gradient(135deg,#ffd700,#ff9500)' }}>🔄 משחק חדש</button>
                    <button onClick={onBack} className="px-6 py-3 rounded-2xl font-bold text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>חזרה</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {phase !== 'gameover' && (
            <div className="flex justify-center">
              <button onClick={resetGame} className="px-5 py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: 'rgba(239,68,68,0.7)', border: '1px solid rgba(239,68,68,0.5)' }}>🔄 אפס</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BullseyeGame;
