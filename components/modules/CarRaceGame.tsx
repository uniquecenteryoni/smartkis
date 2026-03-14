import React, { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

// ─── Pools (identical to BudgetArcadeGame) ────────────────────────────────────

const FIXED_POOL = [
  { icon: '🏠', label: 'שכ"ד',    shape: 'hex'      },
  { icon: '🏙️', label: 'ארנונה',  shape: 'shield'   },
  { icon: '📡', label: 'סלולר',   shape: 'pentagon' },
  { icon: '🛡️', label: 'ביטוח',   shape: 'shield'   },
  { icon: '🐷', label: 'חיסכון',  shape: 'star'     },
];
const VAR_POOL = [
  { icon: '☕',  label: 'קפה',      shape: 'circle'   },
  { icon: '👕',  label: 'בגד',      shape: 'diamond'  },
  { icon: '🎮',  label: 'גאדג׳ט',  shape: 'octagon'  },
  { icon: '🛵',  label: 'משלוח',   shape: 'triangle' },
  { icon: '🎭',  label: 'בילוי',   shape: 'circle'   },
];
const CAR_POOL = [
  { icon: '🚗', glow: '#ef4444' },
  { icon: '🏎️', glow: '#f97316' },
  { icon: '🚙', glow: '#3b82f6' },
  { icon: '🚕', glow: '#eab308' },
  { icon: '🚓', glow: '#8b5cf6' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemKind = 'fixed' | 'variable' | 'car';
interface GameItem { id: number; x: number; y: number; speed: number; kind: ItemKind; icon: string; label: string; shape: string; glow: string; }
interface Boom { id: number; x: number; y: number; born: number; }

type Msg =
  | { type: 'JOIN'; name: string }
  | { type: 'SCORE'; name: string; score: number; lives: number };

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number | null;
  lives: number | null;
  done: boolean;
  connectedAt: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ARENA_H    = 460;
const PLAYER_W   = 52;
const PLAYER_H   = 82;
const ITEM_W     = 58;
const ITEM_H     = 58;
const PLAYER_BOT = 18;
const PLAYER_Y_TOP = ARENA_H - PLAYER_H - PLAYER_BOT;
const MOVE_SPD   = 310;
const MAX_LIVES  = 3;
const GAME_DUR   = 60;
const BOOM_MS    = 700;

const CLIPS: Record<string, string> = {
  circle:   'circle(50% at 50% 50%)',
  diamond:  'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
  hex:      'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)',
  shield:   'polygon(50% 0%,100% 18%,100% 62%,50% 100%,0% 62%,0% 18%)',
  pentagon: 'polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%)',
  star:     'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
  triangle: 'polygon(50% 4%,96% 96%,4% 96%)',
  octagon:  'polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)',
};

// ─── Shared game CSS ──────────────────────────────────────────────────────────

const GAME_CSS = `
  @keyframes roadScroll { from { background-position-y: 0px; } to { background-position-y: 80px; } }
  @keyframes boomAnim { 0% { transform: scale(0.2); opacity: 1; } 55% { transform: scale(1.9); opacity: 0.85; } 100% { transform: scale(2.8); opacity: 0; } }
  @keyframes floatUp  { 0% { opacity: 1; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(-52px); } }
  @keyframes carBump  { 0%,100% { transform: translateX(-50%) rotate(0deg); } 20% { transform: translateX(calc(-50% - 13px)) rotate(-7deg); } 50% { transform: translateX(calc(-50% + 13px)) rotate(7deg); } 80% { transform: translateX(calc(-50% - 5px)) rotate(-3deg); } }
  @keyframes coinBob  { 0%,100% { transform: translateX(-50%) translateY(0px) scale(1); } 50% { transform: translateX(-50%) translateY(-6px) scale(1.09); } }
  @keyframes flashAnim { 0% { opacity: 0.5; } 100% { opacity: 0; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse2 { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
`;

// ─── Player Car SVG (shared) ──────────────────────────────────────────────────

const PlayerCarSvg: React.FC<{ bump: boolean }> = ({ bump }) => (
  <div style={{
    position: 'absolute',
    bottom: PLAYER_BOT,
    width: PLAYER_W,
    height: PLAYER_H,
    transform: bump ? undefined : 'translateX(-50%)',
    animation: bump ? 'carBump 0.42s ease-out' : undefined,
    zIndex: 20,
    pointerEvents: 'none',
  }}>
    <svg viewBox="0 0 52 82" width={PLAYER_W} height={PLAYER_H}>
      <defs>
        <linearGradient id="pbody2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f59e0b" />
          <stop offset="50%"  stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="pgloss2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.38)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="pglow2" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx="26" cy="79" rx="16" ry="3.5" fill="rgba(0,0,0,0.45)" />
      <rect x="8" y="8" width="36" height="64" rx="11" fill="url(#pbody2)" filter="url(#pglow2)" />
      <rect x="12" y="8" width="20" height="34" rx="7" fill="url(#pgloss2)" />
      <rect x="11" y="12" width="30" height="16" rx="5" fill="rgba(190,230,255,0.88)" />
      <rect x="13" y="56" width="26" height="11" rx="4" fill="rgba(180,220,255,0.75)" />
      <rect x="1"  y="11" width="10" height="17" rx="4" fill="#111" /><rect x="3"  y="13" width="6" height="13" rx="2.5" fill="#374151" />
      <rect x="41" y="11" width="10" height="17" rx="4" fill="#111" /><rect x="43" y="13" width="6" height="13" rx="2.5" fill="#374151" />
      <rect x="1"  y="54" width="10" height="17" rx="4" fill="#111" /><rect x="3"  y="56" width="6" height="13" rx="2.5" fill="#374151" />
      <rect x="41" y="54" width="10" height="17" rx="4" fill="#111" /><rect x="43" y="56" width="6" height="13" rx="2.5" fill="#374151" />
      <rect x="23" y="12" width="6" height="58" rx="3" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="16" cy="10" rx="4.5" ry="2.5" fill="#fde68a" opacity="0.95" />
      <ellipse cx="36" cy="10" rx="4.5" ry="2.5" fill="#fde68a" opacity="0.95" />
      <ellipse cx="15" cy="72" rx="4.5" ry="2.5" fill="#ef4444" opacity="0.95" />
      <ellipse cx="37" cy="72" rx="4.5" ry="2.5" fill="#ef4444" opacity="0.95" />
    </svg>
  </div>
);

// ─── Arena (shared game renderer) ─────────────────────────────────────────────

interface ArenaProps {
  playerX: number;           // 0..1 fraction
  items: GameItem[];
  booms: Boom[];
  collected: { id: number; x: number; y: number; txt: string; col: string }[];
  flash: boolean;
  bump: boolean;
  arenaRef: React.RefObject<HTMLDivElement | null>;
}
const Arena: React.FC<ArenaProps> = ({ playerX, items, booms, collected, flash, bump, arenaRef }) => (
  <div ref={arenaRef} style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, width: '100%', height: ARENA_H, userSelect: 'none', background: '#1c1c1c' }}>
    {/* Road */}
    <div style={{ position: 'absolute', inset: '0 24px' , background: '#2a2a2a' }} />
    <div style={{ position: 'absolute', inset: '0', left: 0, right: 'auto', width: 24, background: 'linear-gradient(to right,#0e0e0e,#1c1c1c)' }} />
    <div style={{ position: 'absolute', inset: '0', right: 0, left: 'auto', width: 24, background: 'linear-gradient(to left,#0e0e0e,#1c1c1c)' }} />
    {/* Dashes */}
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 20, width: 4, background: 'repeating-linear-gradient(to bottom,#facc15 0,#facc15 30px,transparent 30px,transparent 50px)', animation: 'roadScroll 0.45s linear infinite' }} />
    <div style={{ position: 'absolute', top: 0, bottom: 0, right: 20, width: 4, background: 'repeating-linear-gradient(to bottom,#facc15 0,#facc15 30px,transparent 30px,transparent 50px)', animation: 'roadScroll 0.45s linear infinite' }} />
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', marginLeft: -2, width: 4, background: 'repeating-linear-gradient(to bottom,rgba(255,255,255,0.55) 0,rgba(255,255,255,0.55) 34px,transparent 34px,transparent 58px)', animation: 'roadScroll 0.45s linear infinite' }} />
    {/* Flash */}
    {flash && <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none', borderRadius: 16, background: 'rgba(255,30,30,0.45)', animation: 'flashAnim 0.4s ease-out forwards' }} />}
    {/* Items */}
    {items.map(item => {
      if (item.kind === 'car') return (
        <div key={item.id} style={{ position: 'absolute', left: `${item.x * 100}%`, top: item.y, width: ITEM_W, height: ITEM_H, transform: 'translateX(-50%)', fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: `drop-shadow(0 0 9px ${item.glow})`, pointerEvents: 'none' }}>{item.icon}</div>
      );
      const isFixed = item.kind === 'fixed';
      return (
        <div key={item.id} style={{ position: 'absolute', left: `${item.x * 100}%`, top: item.y, width: ITEM_W, height: ITEM_H, background: isFixed ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#b91c1c)', clipPath: CLIPS[item.shape] ?? CLIPS.circle, boxShadow: `0 0 18px ${isFixed ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)'}`, animation: isFixed ? 'coinBob 1s ease-in-out infinite' : undefined, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
          {item.label && <span style={{ fontSize: 8, fontWeight: 900, color: 'white', lineHeight: 1.1, textAlign: 'center' }}>{item.label}</span>}
        </div>
      );
    })}
    {/* Booms */}
    {booms.map(bm => <div key={bm.id} style={{ position: 'absolute', left: bm.x - 32, top: bm.y - 32, width: 64, height: 64, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: `boomAnim ${BOOM_MS}ms ease-out forwards`, transformOrigin: 'center', zIndex: 40, pointerEvents: 'none' }}>💥</div>)}
    {/* Float labels */}
    {collected.map(e => <div key={e.id} style={{ position: 'absolute', left: e.x, top: e.y, color: e.col, textShadow: `0 0 8px ${e.col}`, animation: 'floatUp 0.9s ease-out forwards', zIndex: 35, fontWeight: 900, fontSize: 14, pointerEvents: 'none' }}>{e.txt}</div>)}
    {/* Player */}
    <div style={{ position: 'absolute', left: `${playerX * 100}%`, bottom: 0, top: 0, pointerEvents: 'none' }}>
      <PlayerCarSvg bump={bump} />
    </div>
  </div>
);

// ─── Game hook (shared logic) ─────────────────────────────────────────────────

function useGameEngine(onGameOver: (score: number, lives: number) => void) {
  const [playerX, setPlayerX]     = useState(0.5);
  const [items, setItems]         = useState<GameItem[]>([]);
  const [score, setScore]         = useState(0);
  const [lives, setLives]         = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft]   = useState(GAME_DUR);
  const [status, setStatus]       = useState<'idle' | 'playing' | 'over'>('idle');
  const [arenaW, setArenaW]       = useState(360);
  const [booms, setBooms]         = useState<Boom[]>([]);
  const [flash, setFlash]         = useState(false);
  const [bump, setBump]           = useState(false);
  const [collected, setCollected] = useState<{ id: number; x: number; y: number; txt: string; col: string }[]>([]);

  const pressedRef  = useRef({ left: false, right: false });
  const lastTsRef   = useRef<number | null>(null);
  const playerXRef  = useRef(0.5);
  const arenaRef    = useRef<HTMLDivElement | null>(null);
  const livesRef    = useRef(MAX_LIVES);
  const statusRef   = useRef<'idle' | 'playing' | 'over'>('idle');
  const arenaWRef   = useRef(360);
  const scoreRef    = useRef(0);
  const onOverRef   = useRef(onGameOver);
  onOverRef.current = onGameOver;

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  const startGame = () => {
    setItems([]); setScore(0); setLives(MAX_LIVES);
    livesRef.current = MAX_LIVES; scoreRef.current = 0;
    setTimeLeft(GAME_DUR);
    setStatus('playing'); statusRef.current = 'playing';
    setPlayerX(0.5); playerXRef.current = 0.5;
    lastTsRef.current = null;
    setBooms([]); setFlash(false); setBump(false); setCollected([]);
  };

  // Arena size
  useEffect(() => {
    const upd = () => { const w = arenaRef.current?.clientWidth ?? 360; setArenaW(w); arenaWRef.current = w; };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  // Touch move control
  const moveLeft  = useCallback((on: boolean) => { pressedRef.current.left  = on; }, []);
  const moveRight = useCallback((on: boolean) => { pressedRef.current.right = on; }, []);

  // Keyboard (desktop host)
  useEffect(() => {
    const d = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft'  || e.code === 'KeyA') pressedRef.current.left  = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') pressedRef.current.right = true;
    };
    const u = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft'  || e.code === 'KeyA') pressedRef.current.left  = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') pressedRef.current.right = false;
    };
    window.addEventListener('keydown', d);
    window.addEventListener('keyup', u);
    return () => { window.removeEventListener('keydown', d); window.removeEventListener('keyup', u); };
  }, []);

  // Timer
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        const n = Math.max(0, t - 1);
        if (n === 0) { setStatus('over'); statusRef.current = 'over'; onOverRef.current(scoreRef.current, livesRef.current); }
        return n;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  // Spawn
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      setItems(prev => {
        const roll = Math.random();
        const kind: ItemKind = roll < 0.52 ? 'fixed' : roll < 0.78 ? 'variable' : 'car';
        let icon = '', label = '', shape = 'circle', glow = '';
        if (kind === 'fixed') { const p = FIXED_POOL[Math.floor(Math.random()*FIXED_POOL.length)]; icon=p.icon; label=p.label; shape=p.shape; glow='#22c55e'; }
        else if (kind === 'variable') { const p = VAR_POOL[Math.floor(Math.random()*VAR_POOL.length)]; icon=p.icon; label=p.label; shape=p.shape; glow='#ef4444'; }
        else { const p = CAR_POOL[Math.floor(Math.random()*CAR_POOL.length)]; icon=p.icon; glow=p.glow; }
        return [...prev, { id: Date.now()+Math.random(), x: 0.06+Math.random()*0.88, y: -ITEM_H, speed: kind==='car'?170+Math.random()*100:115+Math.random()*85, kind, icon, label, shape, glow }];
      });
    }, 820);
    return () => clearInterval(id);
  }, [status]);

  // Game loop
  useEffect(() => {
    if (status !== 'playing') return;
    let raf: number;
    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const aw  = arenaWRef.current;
      const dir = (pressedRef.current.right ? 1 : 0) - (pressedRef.current.left ? 1 : 0);
      if (dir !== 0) {
        setPlayerX(prev => {
          const px = clamp(prev * aw + dir * MOVE_SPD * dt, 0, aw - PLAYER_W);
          playerXRef.current = px / aw;
          return px / aw;
        });
      }
      setItems(prev => {
        const next: GameItem[] = [];
        const pLeft = playerXRef.current * aw;
        for (const item of prev) {
          const ny  = item.y + item.speed * dt;
          const icx = item.x * aw;
          const xHit = icx+ITEM_W/2 > pLeft && icx-ITEM_W/2 < pLeft+PLAYER_W;
          const yHit = ny+ITEM_H > PLAYER_Y_TOP && PLAYER_Y_TOP+PLAYER_H > ny;
          if (xHit && yHit) {
            if (item.kind === 'fixed') {
              setScore(s => { const n=s+10; scoreRef.current=n; return n; });
              setCollected(c => [...c, { id: Date.now()+Math.random(), x: icx, y: ny, txt: '+10 ₪', col: '#4ade80' }]);
            }
            if (item.kind === 'variable') {
              setScore(s => { const n=Math.max(0,s-5); scoreRef.current=n; return n; });
              setCollected(c => [...c, { id: Date.now()+Math.random(), x: icx, y: ny, txt: '-5 ₪', col: '#f87171' }]);
              setFlash(true); setTimeout(() => setFlash(false), 250);
            }
            if (item.kind === 'car') {
              setScore(s => { const n=Math.max(0,s-8); scoreRef.current=n; return n; });
              setBooms(b => [...b, { id: Date.now()+Math.random(), x: icx, y: ny+ITEM_H/2, born: Date.now() }]);
              setFlash(true); setTimeout(() => setFlash(false), 400);
              setBump(true);  setTimeout(() => setBump(false), 420);
              setLives(lv => {
                const nxt = Math.max(0, lv-1);
                livesRef.current = nxt;
                if (nxt === 0) { setStatus('over'); statusRef.current='over'; onOverRef.current(scoreRef.current, livesRef.current); }
                return nxt;
              });
            }
            continue;
          }
          if (ny <= ARENA_H) next.push({ ...item, y: ny });
        }
        return next;
      });
      const now = Date.now();
      setBooms(b => b.filter(bm => now-bm.born < BOOM_MS));
      setCollected(c => c.filter(e => now-(e.id%1e9) < 900));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status]); // eslint-disable-line

  return { playerX, items, score, lives, timeLeft, status, arenaW, booms, flash, bump, collected, arenaRef, startGame, moveLeft, moveRight };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── HOST SCREEN ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

interface CarRaceGameProps { onBack: () => void; }

const CarRaceGame: React.FC<CarRaceGameProps> = ({ onBack }) => {
  const [peerId, setPeerId]       = useState<string | null>(null);
  const [peerError, setPeerError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer(); peerRef.current = peer;
    peer.on('open', id => setPeerId(id));
    peer.on('error', e => setPeerError(String(e)));

    peer.on('connection', (conn: DataConnection) => {
      const playerId = conn.peer;
      conn.on('open', () => {
        setLeaderboard(lb => {
          if (lb.find(e => e.id === playerId)) return lb;
          return [...lb, { id: playerId, name: '...', score: null, lives: null, done: false, connectedAt: Date.now() }];
        });
      });
      conn.on('data', raw => {
        const msg = raw as Msg;
        if (msg.type === 'JOIN') {
          setLeaderboard(lb => lb.map(e => e.id === playerId ? { ...e, name: msg.name } : e));
        }
        if (msg.type === 'SCORE') {
          setLeaderboard(lb => lb.map(e => e.id === playerId ? { ...e, name: msg.name, score: msg.score, lives: msg.lives, done: true } : e));
        }
      });
      conn.on('close', () => {
        setLeaderboard(lb => lb.map(e => e.id === playerId ? { ...e, done: true } : e));
      });
    });

    return () => { peer.destroy(); };
  }, []);

  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const qrUrl   = peerId ? `${baseUrl}#carrace-player-${peerId}` : null;
  const qrImg   = qrUrl  ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrUrl)}` : null;

  const sorted = [...leaderboard].sort((a, b) => {
    if (a.done && !b.done) return -1;
    if (!a.done && b.done) return 1;
    return (b.score ?? -1) - (a.score ?? -1);
  });

  return (
    <div style={{ minHeight: '80vh', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      <style>{GAME_CSS}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius: 20, padding: '16px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>פעילויות ומשחקים — ניהול התקציב הראשון שלי</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: 26, fontWeight: 900 }}>🏎️ מירוץ מכוניות — מולטיפלייר</h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>תלמידים סורקים את הברקוד עם הטלפון ומשחקים. התוצאות מופיעות כאן בזמן אמת.</p>
        </div>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 15, fontWeight: 700, padding: '10px 22px', borderRadius: 50, cursor: 'pointer' }}>
          ← חזרה
        </button>
      </div>

      {/* Main layout: QR | Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── QR Panel ── */}
        <div style={{ background: 'linear-gradient(160deg,#0f0f1e,#1a1a30)', borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ margin: 0, color: '#fbbf24', fontWeight: 900, fontSize: 18 }}>📱 סרקו לשחק</p>

          {peerError ? (
            <div style={{ color: '#f87171', textAlign: 'center', fontSize: 14 }}>
              <p style={{ margin: 0 }}>❌ שגיאת חיבור</p>
              <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 13 }}>{peerError}</p>
              <button onClick={() => window.location.reload()} style={{ marginTop: 12, background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>🔄 רענן</button>
            </div>
          ) : !qrImg ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#fbbf24', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>מחבר...</p>
            </div>
          ) : (
            <>
              <div style={{ background: '#fff', borderRadius: 16, padding: 10, boxShadow: '0 0 32px rgba(251,191,36,0.4)' }}>
                <img src={qrImg} alt="QR" width={220} height={220} style={{ display: 'block', borderRadius: 8 }} />
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: 11, textAlign: 'center', wordBreak: 'break-all', maxWidth: 240 }}>
                {qrUrl}
              </p>
            </>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, width: '100%', textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: 13 }}>שחקנים מחוברים</p>
            <p style={{ margin: 0, color: '#fbbf24', fontSize: 36, fontWeight: 900 }}>{leaderboard.length}</p>
          </div>

          {/* Legend */}
          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { col: '#22c55e', txt: '✅ קבועות +10 ₪' },
              { col: '#ef4444', txt: '🚫 משתנות -5 ₪' },
              { col: '#fb923c', txt: '💥 רכבים -8 ₪ ❤️' },
            ].map(({ col, txt }) => (
              <span key={txt} style={{ color: col, background: `${col}1a`, border: `1px solid ${col}40`, borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>{txt}</span>
            ))}
          </div>
        </div>

        {/* ── Leaderboard ── */}
        <div style={{ background: 'linear-gradient(160deg,#0f0f1e,#1a1a30)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)', minHeight: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 900 }}>🏆 לוח תוצאות</h3>
            {leaderboard.length > 0 && (
              <span style={{ color: '#94a3b8', fontSize: 13 }}>{leaderboard.filter(e => e.done).length}/{leaderboard.length} סיימו</span>
            )}
          </div>

          {sorted.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 60 }}>
              <p style={{ fontSize: 52, margin: '0 0 12px' }}>🏎️</p>
              <p style={{ color: '#64748b', fontSize: 16, fontWeight: 700 }}>ממתין לשחקנים...</p>
              <p style={{ color: '#475569', fontSize: 13 }}>כשתלמיד יסרוק את הברקוד ויתחיל לשחק, השם שלו יופיע כאן.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.map((entry, idx) => {
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                const rankColor = idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#64748b';
                return (
                  <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 18px', border: idx === 0 && entry.done ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ minWidth: 40, textAlign: 'center', fontSize: idx < 3 ? 26 : 16, fontWeight: 900, color: rankColor }}>{medal}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: 17 }}>{entry.name}</p>
                      {!entry.done && entry.score === null && (
                        <p style={{ margin: '2px 0 0', color: '#fbbf24', fontSize: 12, fontWeight: 600, animation: 'pulse2 1.4s ease-in-out infinite' }}>🎮 משחק עכשיו...</p>
                      )}
                      {!entry.done && entry.score !== null && (
                        <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: 12 }}>⏳ ממתין לסיום...</p>
                      )}
                      {entry.done && (
                        <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
                          <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700 }}>💰 {entry.score ?? 0} ₪</span>
                          <span style={{ color: '#f87171', fontSize: 13 }}>{'❤️'.repeat(Math.max(0, entry.lives ?? 0))}{entry.lives === 0 ? '💀' : ''}</span>
                        </div>
                      )}
                    </div>
                    {entry.done && (
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, color: '#fbbf24', fontSize: 24, fontWeight: 900 }}>{entry.score ?? 0}</p>
                        <p style={{ margin: 0, color: '#64748b', fontSize: 11 }}>נקודות</p>
                      </div>
                    )}
                    {!entry.done && (
                      <div style={{ width: 18, height: 18, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: '#fbbf24', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarRaceGame;

// ═══════════════════════════════════════════════════════════════════════════════
// ─── PLAYER VIEW (Phone) ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export const CarRacePlayerView: React.FC = () => {
  const hm = window.location.hash.match(/#carrace-player-(.+)/);
  const hostPeerId = hm ? hm[1] : null;

  const [playerStatus, setPlayerStatus] = useState<'naming' | 'playing' | 'done' | 'error'>('naming');
  const [connReady, setConnReady]        = useState(false);
  const [inputName, setInputName]        = useState('');
  const [finalScore, setFinalScore]      = useState(0);
  const [finalLives, setFinalLives]      = useState(0);
  const [errMsg, setErrMsg]              = useState('');

  const connRef        = useRef<DataConnection | null>(null);
  const peerRef        = useRef<Peer | null>(null);
  const pendingJoinRef = useRef<string | null>(null);
  const playerNameRef  = useRef('');

  // Connect to host immediately
  useEffect(() => {
    if (!hostPeerId) { setPlayerStatus('error'); setErrMsg('קישור לא תקין — סרקו מחדש'); return; }
    const peer = new Peer(); peerRef.current = peer;
    const timeout = setTimeout(() => { setErrMsg('לא ניתן להתחבר לפעילות. בדקו שהמסך הראשי פתוח ונסו שוב.'); }, 20000);
    peer.on('open', () => {
      const conn = peer.connect(hostPeerId, { reliable: true }); connRef.current = conn;
      conn.on('open', () => {
        clearTimeout(timeout);
        setConnReady(true);
        if (pendingJoinRef.current !== null) {
          conn.send({ type: 'JOIN', name: pendingJoinRef.current });
        }
      });
      conn.on('error', e => { setPlayerStatus('error'); setErrMsg(String(e)); });
      conn.on('close', () => { /* game already over usually */ });
    });
    peer.on('error', e => { setPlayerStatus('error'); setErrMsg(String(e)); });
    return () => { clearTimeout(timeout); peer.destroy(); };
  }, []); // eslint-disable-line

  const handleGameOver = useCallback((score: number, lives: number) => {
    setFinalScore(score);
    setFinalLives(lives);
    setPlayerStatus('done');
    const msg: Msg = { type: 'SCORE', name: playerNameRef.current, score, lives };
    if (connRef.current?.open) connRef.current.send(msg);
  }, []);

  const { playerX, items, score, lives, timeLeft, status: gameStatus, booms, flash, bump, collected, arenaRef, startGame, moveLeft, moveRight } = useGameEngine(handleGameOver);

  const join = () => {
    const name = inputName.trim() || 'שחקן';
    playerNameRef.current = name;
    if (connRef.current?.open) {
      connRef.current.send({ type: 'JOIN', name });
    } else {
      pendingJoinRef.current = name;
    }
    setPlayerStatus('playing');
    setTimeout(() => startGame(), 100);
  };

  // ── Error ──
  if (playerStatus === 'error' || (errMsg && !connReady && playerStatus === 'naming')) {
    if (errMsg) return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <p style={{ fontSize: 52 }}>❌</p>
        <p style={{ color: '#f87171', fontSize: 22, fontWeight: 900, textAlign: 'center' }}>שגיאת חיבור</p>
        <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center' }}>{errMsg}</p>
        <button onClick={() => window.location.reload()} style={{ background: '#3b82f6', color: '#fff', fontSize: 17, fontWeight: 900, padding: '14px 32px', borderRadius: 16, border: 'none', cursor: 'pointer' }}>🔄 נסה שוב</button>
      </div>
    );
  }

  // ── Name form ──
  if (playerStatus === 'naming') return (
    <div style={{ background: 'linear-gradient(160deg,#0f0f1e,#1a1a30)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 28, direction: 'rtl' }}>
      <style>{GAME_CSS}</style>
      <p style={{ fontSize: 72, margin: 0, animation: 'coinBob 1.4s ease-in-out infinite', display: 'inline-block' }}>🏎️</p>
      <h1 style={{ margin: 0, color: '#fff', fontSize: 30, fontWeight: 900, textAlign: 'center' }}>מירוץ התקציב</h1>
      <p style={{ margin: 0, color: '#94a3b8', fontSize: 14, textAlign: 'center' }}>אסוף הוצאות קבועות, הימנע ממשתנות ורכבים!</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: -12 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: connReady ? '#4ade80' : '#fbbf24', boxShadow: connReady ? '0 0 8px #4ade80' : '0 0 8px #fbbf24', animation: connReady ? undefined : 'pulse2 1s ease-in-out infinite' }} />
        <span style={{ color: connReady ? '#4ade80' : '#fbbf24', fontSize: 13, fontWeight: 700 }}>{connReady ? 'מחובר למסך' : 'מתחבר...'}</span>
      </div>
      <input
        value={inputName}
        onChange={e => setInputName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && join()}
        placeholder="מה השם שלך?"
        dir="rtl"
        autoFocus
        style={{ width: '100%', maxWidth: 320, fontSize: 22, padding: '14px 20px', borderRadius: 16, border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', textAlign: 'center', outline: 'none' }}
      />
      <button onClick={join} style={{ background: 'linear-gradient(135deg,#f59e0b,#ec4899,#8b5cf6)', color: '#fff', fontSize: 22, fontWeight: 900, padding: '16px 52px', borderRadius: 24, border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(236,72,153,0.45)' }}>
        🚦 התחל לרוץ!
      </button>
    </div>
  );

  // ── Done screen ──
  if (playerStatus === 'done') return (
    <div style={{ background: 'linear-gradient(160deg,#0f0f1e,#1a1a30)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 28, direction: 'rtl' }}>
      <style>{GAME_CSS}</style>
      <p style={{ fontSize: 60, margin: 0 }}>🏁</p>
      <h2 style={{ margin: 0, color: '#fff', fontSize: 28, fontWeight: 900 }}>סיום המירוץ!</h2>
      <div style={{ display: 'flex', gap: 24, fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
        <span>💰 {finalScore} ₪</span>
        <span>{'❤️'.repeat(Math.max(0, finalLives))}{finalLives === 0 ? '💀' : ''}</span>
      </div>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: finalScore >= 80 ? '#4ade80' : finalScore >= 40 ? '#fbbf24' : '#f87171', textShadow: '0 0 12px currentColor', textAlign: 'center' }}>
        {finalScore >= 80 ? '🏆 ניהול תקציב מושלם!' : finalScore >= 40 ? '👍 לא רע! תנסו שוב' : '💸 תנהלו טוב יותר את התקציב'}
      </p>
      <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 16, padding: '14px 24px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#4ade80', fontWeight: 700, fontSize: 16 }}>✅ התוצאה שלך נשלחה למסך!</p>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 13 }}>ראו את לוח התוצאות על המסך</p>
      </div>
    </div>
  );

  // ── Playing ──
  const timerPct = (timeLeft / GAME_DUR) * 100;
  return (
    <div style={{ background: 'linear-gradient(160deg,#0f0f1e,#1a1a30)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '10px 8px 8px', gap: 8, userSelect: 'none', direction: 'ltr' }}>
      <style>{GAME_CSS}</style>

      {/* HUD */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '0 4px' }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} style={{ fontSize: 20, opacity: i < lives ? 1 : 0.18 }}>❤️</span>
          ))}
        </div>
        <div style={{ fontWeight: 900, fontSize: 22, color: '#fbbf24', textShadow: '0 0 16px rgba(251,191,36,0.7)' }}>💰 {score}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52 }}>
          <span style={{ fontWeight: 900, fontSize: 18, color: timeLeft <= 10 ? '#f87171' : '#fff', animation: timeLeft <= 10 ? 'pulse2 0.7s ease-in-out infinite' : undefined }}>⏱ {timeLeft}</span>
          <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, width: `${timerPct}%`, background: timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444', transition: 'width 1s linear' }} />
          </div>
        </div>
      </div>

      {/* Arena */}
      <div style={{ flex: 1 }}>
        <Arena playerX={playerX} items={items} booms={booms} collected={collected} flash={flash} bump={bump} arenaRef={arenaRef} />
      </div>

      {/* Left / Right big touch buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {(['◀', '▶'] as const).map((arrow, i) => (
          <button
            key={i}
            onPointerDown={() => i === 0 ? moveLeft(true) : moveRight(true)}
            onPointerUp={() => i === 0 ? moveLeft(false) : moveRight(false)}
            onPointerLeave={() => i === 0 ? moveLeft(false) : moveRight(false)}
            onPointerCancel={() => i === 0 ? moveLeft(false) : moveRight(false)}
            style={{ height: 90, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 44, borderRadius: 20, cursor: 'pointer', touchAction: 'none', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {arrow}
          </button>
        ))}
      </div>

      {/* Idle / Game over overlay */}
      {(gameStatus === 'idle' || gameStatus === 'over') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, zIndex: 50, padding: 28, direction: 'rtl' }}>
          {gameStatus === 'over' ? (
            <>
              <p style={{ fontSize: 52, margin: 0 }}>🏁</p>
              <p style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: 0 }}>סיום המירוץ!</p>
              <div style={{ display: 'flex', gap: 20, fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>
                <span>💰 {score} ₪</span>
                <span>❤️ {lives}/{MAX_LIVES}</span>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 60, margin: 0, animation: 'coinBob 1.4s ease-in-out infinite', display: 'inline-block' }}>🏎️</p>
              <p style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: 0, textAlign: 'center' }}>מירוץ התקציב</p>
              <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'center' }}>
                <p style={{ color: '#4ade80', margin: 0 }}>✅ אסוף הוצאות קבועות — +10</p>
                <p style={{ color: '#f87171', margin: 0 }}>🚫 הימנע ממשתנות — -5</p>
                <p style={{ color: '#fb923c', margin: 0 }}>💥 הימנע מרכבים — לב -8</p>
              </div>
            </>
          )}
          <button onClick={startGame} style={{ background: 'linear-gradient(135deg,#f59e0b,#ec4899,#8b5cf6)', color: '#fff', fontSize: 20, fontWeight: 900, padding: '14px 40px', borderRadius: 22, border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(236,72,153,0.5)' }}>
            {gameStatus === 'over' ? '🔄 שחקו שוב' : '🚦 התחילו לרוץ!'}
          </button>
        </div>
      )}
    </div>
  );
};
