import React, { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

// ─── Word Bank ────────────────────────────────────────────────────────────────
const WORDS: string[] = [
  // כסף וכלים פיננסיים
  'ארנק', 'מטבע', 'שטר', 'כרטיס אשראי', 'כספת', 'בנק', 'כספומט', 'המחאה',
  // רכישה וצריכה
  'קניות', 'חנות', 'קופה', 'תג מחיר', 'מתנה', 'מכירה', 'הנחה',
  // חיסכון והשקעה
  'קופת חיסכון', 'קופת חזיר', 'גרף', 'מניה', 'בורסה', 'זהב', 'יהלום',
  // עבודה ושכר
  'תלוש שכר', 'משרד', 'מחשב', 'שעון', 'מנהל', 'עובד', 'ראיון עבודה',
  // הלוואות וחובות
  'הלוואה', 'חוב', 'כרטיס אדום', 'מינוס',
  // יזמות ועסקים
  'עסק', 'מפעל', 'סמל מסחרי', 'תכנית עסקית', 'שותפות', 'חברה', 'יזם',
  // ביטוח ופנסיה
  'ביטוח', 'מטריה', 'פנסיה', 'חוזה',
  // כלכלה כללית
  'מחיר', 'מס', 'תקציב', 'רווח', 'הפסד', 'ייצוא', 'ייבוא', 'מפה',
  // חיי יום יום
  'דיור', 'שכר דירה', 'חשמל', 'מים', 'מזון', 'תחבורה', 'מכונית', 'אוטובוס', 'רכבת',
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Player {
  connId: string;
  name: string;
  score: number;
}

type GamePhase = 'lobby' | 'drawing' | 'roundEnd' | 'gameOver';

interface StrokePoint { x: number; y: number; }
interface Stroke {
  points: StrokePoint[];
  color: string;
  width: number;
}

interface HostState {
  phase: GamePhase;
  players: { connId: string; name: string; score: number }[];
  drawerConnId: string;
  drawerName: string;
  roundNum: number;
  totalRounds: number;
  timeLeft: number;
  lastEvent: string;
  wordRevealed?: string;
}

type PicassoMsg =
  | { type: 'JOIN'; name: string }
  | { type: 'STATE'; state: HostState }
  | { type: 'YOUR_TURN'; word: string; timeLeft: number }
  | { type: 'STROKE_START'; x: number; y: number; color: string; width: number }
  | { type: 'STROKE_POINT'; x: number; y: number }
  | { type: 'STROKE_END' }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'GUESS'; guess: string }
  | { type: 'CORRECT'; bonus: number }
  | { type: 'WRONG'; attemptsLeft: number }
  | { type: 'ROUND_START' }
  | { type: 'ROUND_END'; word: string }
  | { type: 'PING' }
  | { type: 'PONG' };

const ROUND_SECONDS = 60;
const GUESS_ATTEMPTS = 3;

// ═══════════════════════════════════════════════════════════════════════════════
// PLAYER VIEW — Phone screen
// ═══════════════════════════════════════════════════════════════════════════════
export const PicassoPlayerView: React.FC = () => {
  const hm = window.location.hash.match(/#picasso-player-(.+)/);
  const hostPeerId = hm ? hm[1] : null;

  type PlayerStatus = 'naming' | 'lobby' | 'drawing' | 'guessing' | 'correct' | 'roundEnd' | 'error';
  const [status, setStatus]       = useState<PlayerStatus>('naming');
  const [connReady, setConnReady] = useState(false);   // true when WebRTC data channel is open
  const [inputName, setInputName] = useState('');
  const [inputGuess, setInputGuess] = useState('');
  const [word, setWord]           = useState('');
  const [gs, setGs]               = useState<HostState | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(GUESS_ATTEMPTS);
  const [errMsg, setErrMsg]       = useState('');
  const [lastMsg, setLastMsg]     = useState('');
  const [connStatus, setConnStatus] = useState('מתחבר לשרת...'); // shown while naming

  const connRef        = useRef<DataConnection | null>(null);
  const peerRef        = useRef<Peer | null>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const isDrawingRef   = useRef(false);
  const colorRef       = useRef('#000000');
  const widthRef       = useRef(6);
  const lastSendTimeRef = useRef(0);  // throttle stroke points
  // Name to send once connection opens (if user submitted form before conn was ready)
  const pendingJoinRef = useRef<string | null>(null);
  const savedNameRef   = useRef('');  // for reconnect

  const send = useCallback((msg: PicassoMsg) => {
    if (connRef.current?.open) connRef.current.send(msg);
  }, []);

  // ── Connect to host immediately on mount (background) ──
  useEffect(() => {
    if (!hostPeerId) { setStatus('error'); setErrMsg('קישור לא תקין – סרוק מחדש'); return; }

    const peer = new Peer(); peerRef.current = peer;

    const setupConn = (conn: DataConnection) => {
      connRef.current = conn;

      conn.on('open', () => {
        setConnReady(true);
        setConnStatus('מחובר!');
        // Rejoin automatically with saved name
        const nameToSend = pendingJoinRef.current ?? savedNameRef.current;
        if (nameToSend) {
          conn.send({ type: 'JOIN', name: nameToSend } as PicassoMsg);
          setStatus(prev => prev === 'naming' ? 'lobby' : prev);
        } else if (pendingJoinRef.current !== null) {
          conn.send({ type: 'JOIN', name: pendingJoinRef.current } as PicassoMsg);
          setStatus('lobby');
        }
      });

      conn.on('data', (raw) => {
        const msg = raw as PicassoMsg;
        if (msg.type === 'PING') { try { conn.send({ type: 'PONG' } as PicassoMsg); } catch {} return; }
        if (msg.type === 'STATE') {
          setGs(msg.state);
          if (msg.state.phase === 'gameOver') setStatus('roundEnd');
        } else if (msg.type === 'YOUR_TURN') {
          setWord(msg.word); setAttemptsLeft(GUESS_ATTEMPTS);
          setStatus('drawing');
          setTimeout(() => { const c = canvasRef.current; if (c) { const ctx = c.getContext('2d'); ctx?.clearRect(0,0,c.width,c.height); } }, 50);
        } else if (msg.type === 'ROUND_START') {
          setAttemptsLeft(GUESS_ATTEMPTS); setInputGuess(''); setStatus('guessing');
        } else if (msg.type === 'CORRECT') {
          setLastMsg(`✅ ניחשת נכון! +${msg.bonus} ₪`); setStatus('correct');
        } else if (msg.type === 'WRONG') {
          setAttemptsLeft(msg.attemptsLeft);
          if (msg.attemptsLeft === 0) { setLastMsg('❌ נגמרו הניסיונות!'); setStatus('roundEnd'); }
        } else if (msg.type === 'ROUND_END') {
          setStatus('roundEnd');
        }
      });

      conn.on('error', () => {
        setConnReady(false);
        // Auto-reconnect after 2s
        setTimeout(() => {
          if (peerRef.current && !peerRef.current.destroyed) {
            setConnStatus('מתחבר מחדש...');
            setupConn(peerRef.current.connect(hostPeerId, { reliable: true }));
          }
        }, 2000);
      });

      conn.on('close', () => {
        setConnReady(false);
        setConnStatus('מתחבר מחדש...');
        // Auto-reconnect after 2s
        setTimeout(() => {
          if (peerRef.current && !peerRef.current.destroyed) {
            setupConn(peerRef.current.connect(hostPeerId, { reliable: true }));
          }
        }, 2000);
      });
    };

    // Timeout: if no connection after 25s show error
    const timeout = setTimeout(() => {
      if (!connRef.current?.open) {
        setStatus('error');
        setErrMsg('לא הצלחנו להתחבר — בדקו שמסך המחשב פתוח ונסו שוב');
      }
    }, 25000);

    peer.on('open', () => {
      setConnStatus('מחובר, מצרף...');
      clearTimeout(timeout);
      setupConn(peer.connect(hostPeerId, { reliable: true }));
    });

    peer.on('error', (e) => {
      clearTimeout(timeout);
      setStatus('error');
      setErrMsg(`שגיאת חיבור: ${String(e)}`);
    });

    return () => { clearTimeout(timeout); peerRef.current?.destroy(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Join: called when user submits name form ──
  const join = () => {
    const name = inputName.trim() || 'שחקן';
    savedNameRef.current = name;
    if (connRef.current?.open) {
      connRef.current.send({ type: 'JOIN', name } as PicassoMsg);
      setStatus('lobby');
    } else {
      pendingJoinRef.current = name;
      setStatus('lobby');
    }
  };

  // ── Canvas touch handlers for drawer ──
  const getPos = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
  };

  const onDrawStart = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const { x, y } = getPos(e);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.strokeStyle = colorRef.current; ctx.lineWidth = widthRef.current;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    send({ type: 'STROKE_START', x, y, color: colorRef.current, width: widthRef.current });
  };
  const onDrawMove = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const { x, y } = getPos(e);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.lineTo(x, y); ctx.stroke();
    // Throttle: send at most every 40ms (~25/sec) to avoid flooding the WebRTC buffer
    const now = Date.now();
    if (now - lastSendTimeRef.current >= 40) {
      lastSendTimeRef.current = now;
      send({ type: 'STROKE_POINT', x, y });
    }
  };
  const onDrawEnd = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawingRef.current = false;
    send({ type: 'STROKE_END' });
  };
  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    send({ type: 'CLEAR_CANVAS' });
  };

  const sendGuess = () => {
    const g = inputGuess.trim();
    if (!g) return;
    send({ type: 'GUESS', guess: g });
    setInputGuess('');
  };

  const COLORS = ['#000000','#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899','#ffffff'];

  // ── Screens ──
  if (status === 'naming') return (
    <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
      <p style={{ fontSize:72, margin:0 }}>🎨</p>
      <h1 style={{ color:'#fff', fontSize:28, fontWeight:900, textAlign:'center', margin:0 }}>פיקאסו פיננסי</h1>
      <p style={{ color:'#a5b4fc', fontSize:16, textAlign:'center', marginTop:0 }}>ציירו מושגים פיננסיים — נחשו וצברו נקודות!</p>
      <input value={inputName} onChange={e => setInputName(e.target.value)} onKeyDown={e => e.key==='Enter'&&join()}
        placeholder="הכניסי/ו את שמך..." dir="rtl" autoFocus
        style={{ fontSize:22, padding:'14px 20px', borderRadius:16, border:'3px solid rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.15)', color:'#fff', width:'100%', maxWidth:320, textAlign:'center', outline:'none' }} />
      <button onClick={join} style={{ background:'#a855f7', color:'#fff', fontSize:22, fontWeight:900, padding:'16px 48px', borderRadius:20, border:'none', cursor:'pointer' }}>✅ הצטרף</button>
      {/* Live connection indicator — subtle, bottom of screen */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background: connReady ? '#4ade80' : '#fbbf24', animation: connReady ? 'none' : 'pulse 1.5s infinite' }} />
        <span style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>{connReady ? '🔗 מחובר — אפשר להצטרף' : connStatus}</span>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      </div>
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

  if (status === 'lobby') return (
    <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
      <p style={{ fontSize:64, margin:0 }}>🎨</p>
      <h2 style={{ color:'#fff', fontSize:24, fontWeight:900, textAlign:'center', margin:0 }}>
        {connReady ? 'הצטרפת בהצלחה!' : 'מצרף אותך...'}
      </h2>
      {!connReady && (
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:24, height:24, border:'3px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin3 0.8s linear infinite' }} />
          <span style={{ color:'#a5b4fc', fontSize:15 }}>ממתין לחיבור...</span>
          <style>{`@keyframes spin3{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      <p style={{ color:'#a5b4fc', fontSize:16, textAlign:'center', margin:0 }}>
        ממתין לתחילת המשחק...{gs ? ` (${gs.players.length} שחקנים)` : ''}
      </p>
      {gs && gs.players.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%', maxWidth:300 }}>
          {gs.players.map(p => (
            <div key={p.connId} style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'10px 20px', color:'#fff', fontSize:16, textAlign:'center' }}>{p.name}</div>
          ))}
        </div>
      )}
    </div>
  );

  if (status === 'drawing') return (
    <div style={{ background:'#1e1b4b', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'stretch', padding:0, userSelect:'none', touchAction:'none' }}>
      {/* Header */}
      <div style={{ background:'#312e81', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <p style={{ margin:0, color:'#a5b4fc', fontSize:12 }}>הגיע תורך לצייר!</p>
          <p style={{ margin:0, color:'#ffd700', fontSize:26, fontWeight:900 }}>🎯 {word}</p>
        </div>
        <button onClick={clearCanvas} style={{ background:'#ef4444', color:'#fff', fontSize:13, fontWeight:900, padding:'8px 14px', borderRadius:12, border:'none', cursor:'pointer' }}>🗑 נקה</button>
      </div>
      {/* Canvas */}
      <canvas ref={canvasRef} width={800} height={600}
        style={{ flex:1, width:'100%', height:'auto', background:'#fff', cursor:'crosshair', touchAction:'none' }}
        onMouseDown={onDrawStart} onMouseMove={onDrawMove} onMouseUp={onDrawEnd}
        onTouchStart={onDrawStart} onTouchMove={onDrawMove} onTouchEnd={onDrawEnd} />
      {/* Color palette */}
      <div style={{ background:'#0f172a', padding:'10px 16px', display:'flex', gap:10, justifyContent:'center', alignItems:'center', flexShrink:0, flexWrap:'wrap' }}>
        {COLORS.map(col => (
          <button key={col} onClick={() => { colorRef.current = col; }} style={{ width:36, height:36, borderRadius:'50%', background:col, border: colorRef.current===col ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)', cursor:'pointer', flexShrink:0 }} />
        ))}
        <select defaultValue="8" onChange={e => { widthRef.current = parseInt(e.target.value); }} style={{ padding:'4px 8px', borderRadius:8, background:'#1e293b', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', fontSize:14 }}>
          <option value="4">דק</option>
          <option value="8">בינוני</option>
          <option value="16">עבה</option>
          <option value="28">מאוד עבה</option>
        </select>
      </div>
    </div>
  );

  if (status === 'guessing') return (
    <div style={{ background:'linear-gradient(135deg,#1e1b4b,#0f172a)', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
      <p style={{ fontSize:64, margin:0 }}>🤔</p>
      <h2 style={{ color:'#fff', fontSize:22, fontWeight:900, textAlign:'center', margin:0 }}>
        {gs?.drawerName} מצייר/ת...
      </h2>
      <p style={{ color:'#a5b4fc', fontSize:15, textAlign:'center', marginTop:0 }}>נסה/י לנחש את המושג!</p>
      <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:16, padding:'8px 20px', color:'#ffd700', fontSize:16, fontWeight:700 }}>
        {attemptsLeft} ניסיונות נותרו
      </div>
      <div style={{ width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:12 }}>
        <input value={inputGuess} onChange={e => setInputGuess(e.target.value)} onKeyDown={e => e.key==='Enter'&&sendGuess()}
          placeholder="הקלד/י את התשובה..." dir="rtl"
          style={{ fontSize:20, padding:'14px 16px', borderRadius:14, border:'2px solid rgba(165,180,252,0.5)', background:'rgba(255,255,255,0.1)', color:'#fff', textAlign:'center', outline:'none' }} />
        <button onClick={sendGuess} disabled={!inputGuess.trim()}
          style={{ background:'#a855f7', color:'#fff', fontSize:20, fontWeight:900, padding:'14px', borderRadius:14, border:'none', cursor:'pointer', opacity: inputGuess.trim() ? 1 : 0.5 }}>
          ✅ שלח ניחוש
        </button>
      </div>
    </div>
  );

  if (status === 'correct') return (
    <div style={{ background:'linear-gradient(135deg,#14532d,#166534)', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
      <p style={{ fontSize:80, margin:0 }}>🎉</p>
      <h2 style={{ color:'#fff', fontSize:28, fontWeight:900, textAlign:'center' }}>{lastMsg}</h2>
      <p style={{ color:'#86efac', fontSize:16, textAlign:'center' }}>מעולה! ממתין לסיבוב הבא...</p>
    </div>
  );

  // roundEnd / gameOver
  return (
    <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
      <p style={{ fontSize:64, margin:0 }}>{gs?.phase === 'gameOver' ? '🏆' : '⏱'}</p>
      <h2 style={{ color:'#fff', fontSize:24, fontWeight:900, textAlign:'center' }}>
        {gs?.phase === 'gameOver' ? 'המשחק הסתיים!' : 'הסיבוב נגמר!'}
      </h2>
      {gs?.wordRevealed && (
        <p style={{ color:'#ffd700', fontSize:20, textAlign:'center' }}>המילה הייתה: <strong>{gs.wordRevealed}</strong></p>
      )}
      {gs && (
        <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%', maxWidth:320 }}>
          {[...gs.players].sort((a,b)=>b.score-a.score).map((p,i) => (
            <div key={p.connId} style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ color:'#fff', fontSize:16, fontWeight:700 }}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'▸'} {p.name}</span>
              <span style={{ color:'#ffd700', fontSize:16, fontWeight:900 }}>{p.score} ₪</span>
            </div>
          ))}
        </div>
      )}
      <p style={{ color:'#a5b4fc', fontSize:14, textAlign:'center' }}>ממתין למנחה...</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOST VIEW — Computer/projector screen
// ═══════════════════════════════════════════════════════════════════════════════
const PicassoGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const peerRef      = useRef<Peer | null>(null);
  const connsRef     = useRef<Map<string, DataConnection>>(new Map());
  const playersRef   = useRef<Map<string, Player>>(new Map());
  const strokeRef    = useRef<Stroke | null>(null);
  const strokesRef   = useRef<Stroke[]>([]);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const drawerIdRef  = useRef<string>('');
  const wordRef      = useRef<string>('');
  const phaseRef     = useRef<GamePhase>('lobby');
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef  = useRef<number>(ROUND_SECONDS);
  const roundNumRef  = useRef<number>(0);
  const totalRoundsRef = useRef(0);
  const drawerQueueRef = useRef<string[]>([]);
  const usedWordsRef = useRef<Set<string>>(new Set());
  const guessAttemptsRef = useRef<Map<string, number>>(new Map());

  const [hostPeerId, setHostPeerId] = useState<string | null>(null);
  const [peerErr, setPeerErr]       = useState<string | null>(null);
  const [phase, setPhase]           = useState<GamePhase>('lobby');
  const [players, setPlayers]       = useState<Player[]>([]);
  const [timeLeft, setTimeLeft]     = useState(ROUND_SECONDS);
  const [drawerName, setDrawerName] = useState('');
  const [lastEvent, setLastEvent]   = useState('');
  const [roundNum, setRoundNum]     = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [wordRevealed, setWordRevealed] = useState('');

  const syncPlayers = useCallback(() => {
    setPlayers([...playersRef.current.values()]);
  }, []);

  const broadcast = useCallback((msg: PicassoMsg, excludeId?: string) => {
    connsRef.current.forEach((conn, id) => {
      if (id !== excludeId && conn.open) conn.send(msg);
    });
  }, []);

  const sendTo = useCallback((connId: string, msg: PicassoMsg) => {
    const conn = connsRef.current.get(connId);
    if (conn?.open) conn.send(msg);
  }, []);

  const buildState = useCallback((extra?: Partial<HostState>): HostState => ({
    phase: phaseRef.current,
    players: [...playersRef.current.values()].map(p => ({ connId: p.connId, name: p.name, score: p.score })),
    drawerConnId: drawerIdRef.current,
    drawerName: playersRef.current.get(drawerIdRef.current)?.name ?? '',
    roundNum: roundNumRef.current,
    totalRounds: totalRoundsRef.current,
    timeLeft: timeLeftRef.current,
    lastEvent: '',
    ...extra,
  }), []);

  const broadcastState = useCallback((extra?: Partial<HostState>) => {
    broadcast({ type: 'STATE', state: buildState(extra) });
  }, [broadcast, buildState]);

  // ── Redraw canvas ──────────────────────────────────────────────────────────
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const stroke of strokesRef.current) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width * (canvas.width / 800);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x * canvas.width / 800, stroke.points[0].y * canvas.height / 600);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * canvas.width / 800, stroke.points[i].y * canvas.height / 600);
      }
      ctx.stroke();
    }
    // In-progress stroke
    if (strokeRef.current && strokeRef.current.points.length > 1) {
      const s = strokeRef.current;
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width * (canvas.width / 800);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.moveTo(s.points[0].x * canvas.width / 800, s.points[0].y * canvas.height / 600);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x * canvas.width / 800, s.points[i].y * canvas.height / 600);
      }
      ctx.stroke();
    }
  }, []);

  const clearCanvas = useCallback(() => {
    strokesRef.current = [];
    strokeRef.current = null;
    redrawCanvas();
  }, [redrawCanvas]);

  // ── Round management ───────────────────────────────────────────────────────
  const pickWord = useCallback(() => {
    const available = WORDS.filter(w => !usedWordsRef.current.has(w));
    if (available.length === 0) { usedWordsRef.current.clear(); return WORDS[Math.floor(Math.random() * WORDS.length)]; }
    const w = available[Math.floor(Math.random() * available.length)];
    usedWordsRef.current.add(w);
    return w;
  }, []);

  const endRound = useCallback((evt: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    phaseRef.current = 'roundEnd';
    const wrd = wordRef.current;
    setLastEvent(evt);
    setWordRevealed(wrd);
    setPhase('roundEnd');
    broadcastState({ phase: 'roundEnd', lastEvent: evt, wordRevealed: wrd });
    broadcast({ type: 'ROUND_END', word: wrd });
  }, [broadcast, broadcastState]);

  const startRound = useCallback(() => {
    if (drawerQueueRef.current.length === 0) {
      // Game over
      phaseRef.current = 'gameOver';
      setPhase('gameOver');
      const ps = [...playersRef.current.values()].sort((a,b) => b.score - a.score);
      const evt = `🏆 המשחק הסתיים! מנצח: ${ps[0]?.name ?? '—'} עם ${ps[0]?.score ?? 0} ₪`;
      setLastEvent(evt);
      broadcastState({ phase: 'gameOver', lastEvent: evt });
      return;
    }

    const drawerId = drawerQueueRef.current.shift()!;
    drawerIdRef.current = drawerId;
    const word = pickWord();
    wordRef.current = word;
    const rn = roundNumRef.current + 1;
    roundNumRef.current = rn;
    setRoundNum(rn);

    // Reset guess attempts for all non-drawers
    guessAttemptsRef.current.clear();
    playersRef.current.forEach((_, id) => {
      if (id !== drawerId) guessAttemptsRef.current.set(id, GUESS_ATTEMPTS);
    });

    clearCanvas();
    phaseRef.current = 'drawing';
    setPhase('drawing');
    setDrawerName(playersRef.current.get(drawerId)?.name ?? '');
    setWordRevealed('');
    timeLeftRef.current = ROUND_SECONDS;
    setTimeLeft(ROUND_SECONDS);

    broadcastState({ phase: 'drawing', lastEvent: `🎨 ${playersRef.current.get(drawerId)?.name} מצייר/ת` });
    sendTo(drawerId, { type: 'YOUR_TURN', word, timeLeft: ROUND_SECONDS });
    // Tell everyone else to guess
    connsRef.current.forEach((_, id) => { if (id !== drawerId) sendTo(id, { type: 'ROUND_START' }); });

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      timeLeftRef.current--;
      setTimeLeft(timeLeftRef.current);
      broadcastState();
      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current!);
        endRound(`⏱ הזמן נגמר! המילה הייתה: "${wordRef.current}"`);
      }
    }, 1000);
  }, [clearCanvas, pickWord, broadcastState, sendTo, endRound]);

  const startGame = useCallback(() => {
    const ids = [...playersRef.current.keys()];
    if (ids.length < 2) return;
    // Build drawer queue — each player draws once
    drawerQueueRef.current = [...ids].sort(() => Math.random() - 0.5);
    totalRoundsRef.current = ids.length;
    roundNumRef.current = 0;
    setTotalRounds(ids.length);
    startRound();
  }, [startRound]);

  const nextRound = useCallback(() => {
    startRound();
  }, [startRound]);

  // ── Handle incoming messages from players ──────────────────────────────────
  const handleMsg = useCallback((connId: string, msg: PicassoMsg) => {
    if (msg.type === 'JOIN') {
      playersRef.current.set(connId, { connId, name: msg.name, score: 0 });
      syncPlayers();
      broadcastState();
    } else if (msg.type === 'STROKE_START') {
      strokeRef.current = { points: [{ x: msg.x, y: msg.y }], color: msg.color, width: msg.width };
      redrawCanvas();
    } else if (msg.type === 'STROKE_POINT') {
      if (strokeRef.current) {
        strokeRef.current.points.push({ x: msg.x, y: msg.y });
        redrawCanvas();
      }
    } else if (msg.type === 'STROKE_END') {
      if (strokeRef.current) {
        strokesRef.current.push(strokeRef.current);
        strokeRef.current = null;
      }
    } else if (msg.type === 'CLEAR_CANVAS') {
      clearCanvas();
    } else if (msg.type === 'GUESS') {
      if (phaseRef.current !== 'drawing') return;
      const player = playersRef.current.get(connId);
      if (!player) return;
      const correct = msg.guess.trim().toLowerCase() === wordRef.current.trim().toLowerCase();
      if (correct) {
        const bonus = Math.max(50, timeLeftRef.current * 2);
        player.score += bonus;
        playersRef.current.set(connId, player);
        // Also give drawer partial credit
        const drawer = playersRef.current.get(drawerIdRef.current);
        if (drawer) { drawer.score += 30; playersRef.current.set(drawerIdRef.current, drawer); }
        sendTo(connId, { type: 'CORRECT', bonus });
        syncPlayers();
        const evt = `✅ ${player.name} ניחש/ה נכון! +${bonus} ₪`;
        setLastEvent(evt);
        broadcastState({ lastEvent: evt });
      } else {
        const attempts = (guessAttemptsRef.current.get(connId) ?? GUESS_ATTEMPTS) - 1;
        guessAttemptsRef.current.set(connId, attempts);
        sendTo(connId, { type: 'WRONG', attemptsLeft: attempts });
      }
    }
  }, [syncPlayers, broadcastState, redrawCanvas, clearCanvas, sendTo]);

  // ── PeerJS init ────────────────────────────────────────────────────────────
  useEffect(() => {
    const peer = new Peer(); peerRef.current = peer;
    peer.on('open', id => setHostPeerId(id));
    peer.on('error', e => setPeerErr(String(e)));
    peer.on('connection', (conn: DataConnection) => {
      const connId = conn.peer;
      connsRef.current.set(connId, conn);
      conn.on('open', () => {
        // Send current state to new joiner
        conn.send({ type: 'STATE', state: buildState() });
      });
      conn.on('data', (raw) => {
        const msg = raw as PicassoMsg;
        if (msg.type === 'PONG') return; // heartbeat reply — ignore
        handleMsg(connId, msg);
      });
      conn.on('close', () => {
        connsRef.current.delete(connId);
        // Keep player in list even if disconnected (don't remove mid-game)
        syncPlayers();
      });
    });

    // Heartbeat: ping all connections every 8s to keep WebRTC alive
    const heartbeat = setInterval(() => {
      connsRef.current.forEach(conn => {
        if (conn.open) try { conn.send({ type: 'PING' } as PicassoMsg); } catch {}
      });
    }, 8000);

    return () => {
      clearInterval(heartbeat);
      if (timerRef.current) clearInterval(timerRef.current);
      peerRef.current?.destroy();
    };
  }, [handleMsg, buildState, syncPlayers]);

  // ── Canvas resize observer ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    // Initial draw
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  }, [phase]);

  const playerUrl = hostPeerId ? `${window.location.origin}${window.location.pathname}#picasso-player-${hostPeerId}` : '';
  const qrUrl = playerUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(playerUrl)}` : '';

  // ── Lobby ──────────────────────────────────────────────────────────────────
  if (phase === 'lobby') return (
    <div dir="rtl" style={{ background:'#0f172a', height:'100vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ background:'#1e1b4b', padding:'10px 20px', display:'flex', alignItems:'center', gap:14, flexShrink:0, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onBack} style={{ background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:15, fontWeight:700, padding:'7px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer' }}>← חזרה</button>
        <h1 style={{ color:'#fff', fontSize:24, fontWeight:900, margin:0 }}>🎨 פיקאסו פיננסי</h1>
        <span style={{ color:'#a5b4fc', fontSize:15, marginRight:'auto' }}>ממתין לשחקנים — {players.length} מחוברים</span>
      </div>

      {/* Main: canvas + sidebar */}
      <div style={{ flex:1, display:'flex', flexDirection:'row', minHeight:0 }}>
        {/* Canvas — white, with placeholder text */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:16, gap:8, minWidth:0 }}>
          <div style={{ flex:1, background:'#fff', borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, position:'relative', overflow:'hidden' }}>
            <canvas ref={canvasRef} width={800} height={600} style={{ position:'absolute', inset:0, width:'100%', height:'100%', borderRadius:16 }} />
            <p style={{ color:'#cbd5e1', fontSize:32, fontWeight:900, zIndex:1, pointerEvents:'none' }}>🎨</p>
            <p style={{ color:'#cbd5e1', fontSize:18, fontWeight:700, zIndex:1, pointerEvents:'none' }}>הציור יופיע כאן</p>
          </div>
        </div>

        {/* Sidebar — QR + players + start */}
        <div dir="rtl" style={{ width:280, background:'#1e1b4b', padding:16, display:'flex', flexDirection:'column', gap:14, borderRight:'1px solid rgba(255,255,255,0.1)', overflowY:'auto', flexShrink:0 }}>
          {/* QR */}
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:14, textAlign:'center', border:'1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color:'#a5b4fc', fontSize:13, margin:'0 0 10px', fontWeight:700 }}>📱 סרקו להצטרף</p>
            {peerErr ? (
              <p style={{ color:'#f87171', fontSize:13 }}>שגיאה: {peerErr}</p>
            ) : hostPeerId ? (
              <img src={qrUrl} alt="QR" style={{ borderRadius:10, width:160, height:160 }} />
            ) : (
              <div style={{ width:160, height:160, display:'flex', alignItems:'center', justifyContent:'center', background:'#fff', borderRadius:10, margin:'0 auto' }}>
                <div style={{ width:36, height:36, border:'4px solid #312e81', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}
          </div>

          {/* Players */}
          <div>
            <p style={{ color:'#a5b4fc', fontSize:14, fontWeight:700, margin:'0 0 10px' }}>שחקנים ({players.length})</p>
            {players.length === 0 ? (
              <p style={{ color:'#64748b', fontSize:13, textAlign:'center', padding:'16px 0' }}>ממתין לשחקנים שיסרקו...</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {players.map((p, i) => (
                  <div key={p.connId} style={{ background:'rgba(255,255,255,0.08)', borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:10, animation:'fadeIn 0.3s ease' }}>
                    <span style={{ fontSize:20 }}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'🎨'}</span>
                    <span style={{ color:'#fff', fontSize:15, fontWeight:700 }}>{p.name}</span>
                    <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start button */}
          <button onClick={startGame} disabled={players.length < 2}
            style={{ marginTop:'auto', background: players.length>=2 ? '#a855f7' : '#374151', color:'#fff', fontSize:17, fontWeight:900, padding:'14px 20px', borderRadius:14, border:'none', cursor: players.length>=2 ? 'pointer' : 'default', opacity: players.length>=2 ? 1 : 0.6, transition:'all 0.2s' }}>
            {players.length < 2 ? `ממתין לשחקנים נוספים...` : `▶ התחל משחק (${players.length} שחקנים)`}
          </button>
        </div>
      </div>
    </div>
  );

  // ── Drawing phase ──────────────────────────────────────────────────────────
  if (phase === 'drawing') return (
    <div dir="rtl" style={{ background:'#0f172a', minHeight:'100vh', display:'flex', flexDirection:'row', gap:0, overflow:'hidden', height:'100vh' }}>
      {/* Canvas area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#0f172a', padding:16, gap:12, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button onClick={onBack} style={{ background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:13, fontWeight:700, padding:'6px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer' }}>← חזרה</button>
          <span style={{ color:'#a5b4fc', fontSize:16, fontWeight:700 }}>
            🎨 {drawerName} מצייר/ת — סיבוב {roundNum}/{totalRounds}
          </span>
          <span style={{ marginRight:'auto', background: timeLeft <= 10 ? '#ef4444' : '#312e81', color:'#fff', fontSize:16, fontWeight:900, padding:'4px 14px', borderRadius:10 }}>
            ⏱ {timeLeft}ש׳
          </span>
        </div>
        <canvas ref={canvasRef} width={800} height={600}
          style={{ width:'100%', flex:1, borderRadius:16, objectFit:'contain', background:'#fff' }} />
        {lastEvent && <p style={{ color:'#a5b4fc', fontSize:14, textAlign:'center', margin:0 }}>{lastEvent}</p>}
      </div>

      {/* Sidebar */}
      <div dir="rtl" style={{ width:240, background:'#1e1b4b', padding:16, display:'flex', flexDirection:'column', gap:12, borderRight:'1px solid rgba(255,255,255,0.1)', overflowY:'auto', flexShrink:0 }}>
        <p style={{ color:'#a5b4fc', fontSize:14, fontWeight:700, margin:0 }}>לוח ניקוד</p>
        {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
          <div key={p.connId} style={{ background: p.connId === drawerIdRef.current ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)', borderRadius:12, padding:'10px 12px', border: p.connId === drawerIdRef.current ? '1px solid #a855f7' : '1px solid transparent' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ color:'#fff', fontSize:14, fontWeight:700 }}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'▸'} {p.name}</span>
              <span style={{ color:'#ffd700', fontSize:14, fontWeight:900 }}>{p.score} ₪</span>
            </div>
            {p.connId === drawerIdRef.current && <p style={{ color:'#c4b5fd', fontSize:11, margin:'4px 0 0' }}>✏️ מצייר/ת</p>}
          </div>
        ))}
      </div>
    </div>
  );

  // ── Round End ──────────────────────────────────────────────────────────────
  if (phase === 'roundEnd' || phase === 'gameOver') return (
    <div dir="rtl" style={{ background:'linear-gradient(135deg,#1e1b4b,#0f172a)', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
      <p style={{ fontSize:64, margin:0 }}>{phase === 'gameOver' ? '🏆' : '⏱'}</p>
      <h2 style={{ color:'#fff', fontSize:26, fontWeight:900, textAlign:'center', margin:0 }}>
        {phase === 'gameOver' ? 'המשחק הסתיים!' : 'הסיבוב הסתיים!'}
      </h2>
      {wordRevealed && (
        <div style={{ background:'rgba(255,215,0,0.15)', borderRadius:16, padding:'12px 24px', border:'2px solid #ffd700' }}>
          <p style={{ color:'#ffd700', fontSize:20, margin:0, textAlign:'center' }}>המילה הייתה: <strong>{wordRevealed}</strong></p>
        </div>
      )}
      <p style={{ color:'#a5b4fc', fontSize:15, textAlign:'center', margin:0 }}>{lastEvent}</p>

      {/* Scoreboard */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, width:'100%', maxWidth:400 }}>
        {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
          <div key={p.connId} style={{ background:'rgba(255,255,255,0.08)', borderRadius:14, padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'#fff', fontSize:17, fontWeight:700 }}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':'▸'} {p.name}</span>
            <span style={{ color:'#ffd700', fontSize:18, fontWeight:900 }}>{p.score} ₪</span>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        {phase === 'roundEnd' && drawerQueueRef.current.length > 0 && (
          <button onClick={nextRound} style={{ background:'#a855f7', color:'#fff', fontSize:18, fontWeight:900, padding:'14px 32px', borderRadius:14, border:'none', cursor:'pointer' }}>
            ▶ לסיבוב הבא
          </button>
        )}
        {phase === 'roundEnd' && drawerQueueRef.current.length === 0 && (
          <button onClick={nextRound} style={{ background:'#a855f7', color:'#fff', fontSize:18, fontWeight:900, padding:'14px 32px', borderRadius:14, border:'none', cursor:'pointer' }}>
            ▶ סיים משחק
          </button>
        )}
        <button onClick={onBack} style={{ background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:18, fontWeight:700, padding:'14px 32px', borderRadius:14, border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer' }}>
          ← חזרה
        </button>
      </div>
    </div>
  );

  return null;
};

export default PicassoGame;
