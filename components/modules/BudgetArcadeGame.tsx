import React, { useEffect, useRef, useState } from 'react';

// ─── Pools ───────────────────────────────────────────────────────────────────

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

// ─── Types ───────────────────────────────────────────────────────────────────

type ItemKind = 'fixed' | 'variable' | 'car';

interface GameItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  kind: ItemKind;
  icon: string;
  label: string;
  shape: string;
  glow: string;
}

interface Boom { id: number; x: number; y: number; born: number; }

// ─── Constants ───────────────────────────────────────────────────────────────

const ARENA_H      = 500;
const PLAYER_W     = 52;
const PLAYER_H     = 82;
const ITEM_W       = 58;
const ITEM_H       = 58;
const PLAYER_BOT   = 18;
const PLAYER_Y_TOP = ARENA_H - PLAYER_H - PLAYER_BOT;
const MOVE_SPD     = 310;
const MAX_LIVES    = 3;
const GAME_DUR     = 60;
const BOOM_MS      = 700;

// ─── Clip paths ──────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

const BudgetArcadeGame: React.FC = () => {
  const [playerX, setPlayerX]     = useState(0.5);
  const [items, setItems]         = useState<GameItem[]>([]);
  const [score, setScore]         = useState(0);
  const [lives, setLives]         = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft]   = useState(GAME_DUR);
  const [status, setStatus]       = useState<'idle' | 'playing' | 'over'>('idle');
  const [arenaW, setArenaW]       = useState(520);
  const [booms, setBooms]         = useState<Boom[]>([]);
  const [flash, setFlash]         = useState(false);
  const [bump, setBump]           = useState(false);
  const [collected, setCollected] = useState<{ id: number; x: number; y: number; txt: string; col: string }[]>([]);

  const pressedRef = useRef({ left: false, right: false });
  const lastTsRef  = useRef<number | null>(null);
  const playerXRef = useRef(0.5);
  const arenaRef   = useRef<HTMLDivElement | null>(null);
  const livesRef   = useRef(MAX_LIVES);
  const statusRef  = useRef<'idle' | 'playing' | 'over'>('idle');
  const arenaWRef  = useRef(520);

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  const startGame = () => {
    setItems([]); setScore(0); setLives(MAX_LIVES);
    livesRef.current = MAX_LIVES;
    setTimeLeft(GAME_DUR);
    setStatus('playing'); statusRef.current = 'playing';
    setPlayerX(0.5); playerXRef.current = 0.5;
    lastTsRef.current = null;
    setBooms([]); setFlash(false); setBump(false); setCollected([]);
  };

  // Arena size
  useEffect(() => {
    const upd = () => {
      const w = arenaRef.current?.clientWidth ?? 520;
      setArenaW(w); arenaWRef.current = w;
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  // Keys
  const handleKey = (code: string, dn: boolean) => {
    if (code === 'ArrowLeft'  || code === 'KeyA') pressedRef.current.left  = dn;
    if (code === 'ArrowRight' || code === 'KeyD') pressedRef.current.right = dn;
  };
  useEffect(() => {
    const d = (e: KeyboardEvent) => handleKey(e.code, true);
    const u = (e: KeyboardEvent) => handleKey(e.code, false);
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
        if (n === 0) { setStatus('over'); statusRef.current = 'over'; }
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
        if (kind === 'fixed') {
          const p = FIXED_POOL[Math.floor(Math.random() * FIXED_POOL.length)];
          icon = p.icon; label = p.label; shape = p.shape; glow = '#22c55e';
        } else if (kind === 'variable') {
          const p = VAR_POOL[Math.floor(Math.random() * VAR_POOL.length)];
          icon = p.icon; label = p.label; shape = p.shape; glow = '#ef4444';
        } else {
          const p = CAR_POOL[Math.floor(Math.random() * CAR_POOL.length)];
          icon = p.icon; glow = p.glow;
        }
        return [...prev, {
          id: Date.now() + Math.random(),
          x: 0.06 + Math.random() * 0.88,
          y: -ITEM_H,
          speed: kind === 'car' ? 170 + Math.random() * 100 : 115 + Math.random() * 85,
          kind, icon, label, shape, glow,
        }];
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
          const xHit = icx + ITEM_W / 2 > pLeft && icx - ITEM_W / 2 < pLeft + PLAYER_W;
          const yHit = ny + ITEM_H > PLAYER_Y_TOP && PLAYER_Y_TOP + PLAYER_H > ny;

          if (xHit && yHit) {
            if (item.kind === 'fixed') {
              setScore(s => s + 10);
              setCollected(c => [...c, { id: Date.now() + Math.random(), x: icx, y: ny, txt: '+10 ₪', col: '#4ade80' }]);
            }
            if (item.kind === 'variable') {
              setScore(s => Math.max(0, s - 5));
              setCollected(c => [...c, { id: Date.now() + Math.random(), x: icx, y: ny, txt: '-5 ₪', col: '#f87171' }]);
              setFlash(true); setTimeout(() => setFlash(false), 250);
            }
            if (item.kind === 'car') {
              setScore(s => Math.max(0, s - 8));
              setBooms(b => [...b, { id: Date.now() + Math.random(), x: icx, y: ny + ITEM_H / 2, born: Date.now() }]);
              setFlash(true);  setTimeout(() => setFlash(false), 400);
              setBump(true);   setTimeout(() => setBump(false), 420);
              setLives(lv => {
                const nxt = Math.max(0, lv - 1);
                livesRef.current = nxt;
                if (nxt === 0) { setStatus('over'); statusRef.current = 'over'; }
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
      setBooms(b => b.filter(bm => now - bm.born < BOOM_MS));
      setCollected(c => c.filter(e => now - (e.id % 1e9) < 900));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  const timerPct = (timeLeft / GAME_DUR) * 100;

  return (
    <div className="rounded-3xl border border-white/10 p-4 space-y-3 shadow-2xl"
      style={{ background: 'linear-gradient(160deg,#0f0f1e 0%,#1a1a30 100%)', direction: 'ltr' }}>

      <style>{`
        @keyframes roadScroll {
          from { background-position-y: 0px; }
          to   { background-position-y: 80px; }
        }
        @keyframes boomAnim {
          0%   { transform: scale(0.2); opacity: 1; }
          55%  { transform: scale(1.9); opacity: 0.85; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-52px); }
        }
        @keyframes carBump {
          0%,100% { transform: translateX(-50%) rotate(0deg); }
          20%     { transform: translateX(calc(-50% - 13px)) rotate(-7deg); }
          50%     { transform: translateX(calc(-50% + 13px)) rotate(7deg); }
          80%     { transform: translateX(calc(-50% - 5px)) rotate(-3deg); }
        }
        @keyframes coinBob {
          0%,100% { transform: translateX(-50%) translateY(0px)  scale(1); }
          50%     { transform: translateX(-50%) translateY(-6px) scale(1.09); }
        }
        @keyframes flashAnim {
          0%   { opacity: 0.5; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* ── HUD ── */}
      <div className="flex items-center justify-between gap-2 px-1">
        {/* Lives */}
        <div className="flex gap-0.5">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} style={{
              fontSize: 22,
              opacity: i < lives ? 1 : 0.18,
              filter: i < lives ? 'drop-shadow(0 0 6px #ef4444)' : 'none',
            }}>❤️</span>
          ))}
        </div>
        {/* Score */}
        <div className="font-black text-2xl" style={{ color: '#fbbf24', textShadow: '0 0 16px rgba(251,191,36,0.7)' }}>
          💰 {score}
        </div>
        {/* Timer */}
        <div className="flex flex-col items-center gap-0.5 min-w-[56px]">
          <span className={`font-black text-lg ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            ⏱ {timeLeft}
          </span>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timerPct}%`, background: timerPct > 50 ? '#22c55e' : timerPct > 25 ? '#f59e0b' : '#ef4444' }} />
          </div>
        </div>
        {/* Buttons */}
        <div className="flex gap-1.5">
          {(['ArrowLeft', 'ArrowRight'] as const).map((code, idx) => (
            <button key={code}
              onPointerDown={() => handleKey(code, true)}
              onPointerUp={() => handleKey(code, false)}
              onPointerLeave={() => handleKey(code, false)}
              className="w-11 h-11 rounded-xl font-black text-lg select-none"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', color: 'white' }}>
              {idx === 0 ? '◀' : '▶'}
            </button>
          ))}
          {status !== 'idle' && (
            <button onClick={startGame}
              className="px-3 h-11 rounded-xl font-black text-sm select-none"
              style={{ background: 'rgba(251,191,36,0.2)', border: '1.5px solid rgba(251,191,36,0.4)', color: '#fbbf24' }}>
              ↺
            </button>
          )}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex gap-2 flex-wrap justify-center" style={{ direction: 'rtl' }}>
        {[
          { col: '#22c55e', txt: '✅ קבועות +10' },
          { col: '#ef4444', txt: '🚫 משתנות -5' },
          { col: '#fb923c', txt: '💥 רכבים ❤️ -8' },
        ].map(({ col, txt }) => (
          <span key={txt} className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ color: col, background: `${col}1a`, border: `1px solid ${col}50` }}>
            {txt}
          </span>
        ))}
      </div>

      {/* ── Arena ── */}
      <div ref={arenaRef}
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{ width: '100%', maxWidth: 520, height: ARENA_H, margin: '0 auto', userSelect: 'none' }}>

        {/* Asphalt */}
        <div className="absolute inset-0" style={{ background: '#1c1c1c' }} />
        <div className="absolute inset-y-0" style={{ left: 24, right: 24, background: '#2a2a2a' }} />

        {/* Shoulders */}
        <div className="absolute inset-y-0 left-0"  style={{ width: 24, background: 'linear-gradient(to right,#0e0e0e,#1c1c1c)' }} />
        <div className="absolute inset-y-0 right-0" style={{ width: 24, background: 'linear-gradient(to left,#0e0e0e,#1c1c1c)' }} />

        {/* Yellow edge lines */}
        <div className="absolute inset-y-0" style={{ left: 20, width: 4, background: 'repeating-linear-gradient(to bottom,#facc15 0,#facc15 30px,transparent 30px,transparent 50px)', animation: 'roadScroll 0.45s linear infinite' }} />
        <div className="absolute inset-y-0" style={{ right: 20, width: 4, background: 'repeating-linear-gradient(to bottom,#facc15 0,#facc15 30px,transparent 30px,transparent 50px)', animation: 'roadScroll 0.45s linear infinite' }} />

        {/* Center dashes */}
        <div className="absolute inset-y-0" style={{ left: '50%', marginLeft: -2, width: 4, background: 'repeating-linear-gradient(to bottom,rgba(255,255,255,0.55) 0,rgba(255,255,255,0.55) 34px,transparent 34px,transparent 58px)', animation: 'roadScroll 0.45s linear infinite' }} />

        {/* Quarter dashes */}
        {['25%', '75%'].map(l => (
          <div key={l} className="absolute inset-y-0" style={{ left: l, marginLeft: -1, width: 2, background: 'repeating-linear-gradient(to bottom,rgba(255,255,255,0.2) 0,rgba(255,255,255,0.2) 22px,transparent 22px,transparent 50px)', animation: 'roadScroll 0.45s linear infinite' }} />
        ))}

        {/* Speed streaks */}
        {[8, 26, 44, 62, 80].map((t, i) => (
          <React.Fragment key={t}>
            <div className="absolute w-0.5 h-12 rounded-full" style={{ left: 10, top: `${t}%`, background: 'linear-gradient(to bottom,transparent,rgba(255,255,255,0.28),transparent)', animation: `roadScroll ${0.28 + i * 0.05}s linear infinite` }} />
            <div className="absolute w-0.5 h-12 rounded-full" style={{ right: 10, top: `${t}%`, background: 'linear-gradient(to bottom,transparent,rgba(255,255,255,0.28),transparent)', animation: `roadScroll ${0.33 + i * 0.05}s linear infinite` }} />
          </React.Fragment>
        ))}

        {/* Flash overlay */}
        {flash && (
          <div className="absolute inset-0 z-30 pointer-events-none rounded-2xl"
            style={{ background: 'rgba(255,30,30,0.45)', animation: 'flashAnim 0.4s ease-out forwards' }} />
        )}

        {/* ── Game items ── */}
        {items.map(item => {
          if (item.kind === 'car') {
            return (
              <div key={item.id} className="absolute flex items-center justify-center pointer-events-none"
                style={{ left: `${item.x * 100}%`, top: item.y, width: ITEM_W, height: ITEM_H, transform: 'translateX(-50%)', fontSize: 38, filter: `drop-shadow(0 0 9px ${item.glow})` }}>
                {item.icon}
              </div>
            );
          }

          const isFixed = item.kind === 'fixed';
          const bg   = isFixed ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#b91c1c)';
          const glow = `0 0 18px ${isFixed ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)'}`;
          const clip = CLIPS[item.shape] ?? CLIPS.circle;

          return (
            <div key={item.id} className="absolute flex flex-col items-center justify-center pointer-events-none"
              style={{
                left: `${item.x * 100}%`, top: item.y,
                width: ITEM_W, height: ITEM_H,
                background: bg, clipPath: clip, boxShadow: glow,
                animation: isFixed ? 'coinBob 1s ease-in-out infinite' : undefined,
                transform: 'translateX(-50%)',
              }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
              {item.label && (
                <span style={{ fontSize: 8, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 1, textAlign: 'center' }}>{item.label}</span>
              )}
            </div>
          );
        })}

        {/* ── Explosions ── */}
        {booms.map(bm => (
          <div key={bm.id} className="absolute pointer-events-none"
            style={{
              left: bm.x - 32, top: bm.y - 32, width: 64, height: 64,
              fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: `boomAnim ${BOOM_MS}ms ease-out forwards`,
              transformOrigin: 'center center', zIndex: 40,
            }}>
            💥
          </div>
        ))}

        {/* ── Floating score labels ── */}
        {collected.map(e => (
          <div key={e.id} className="absolute pointer-events-none font-black text-base"
            style={{ left: e.x, top: e.y, color: e.col, textShadow: `0 0 8px ${e.col}`, animation: 'floatUp 0.9s ease-out forwards', zIndex: 35 }}>
            {e.txt}
          </div>
        ))}

        {/* ── Player car (top-down SVG) ── */}
        <div className="absolute pointer-events-none"
          style={{
            left: `${playerX * 100}%`,
            bottom: PLAYER_BOT,
            width: PLAYER_W,
            height: PLAYER_H,
            transform: bump ? undefined : 'translateX(-50%)',
            animation: bump ? 'carBump 0.42s ease-out' : undefined,
            zIndex: 20,
          }}>
          <svg viewBox="0 0 52 82" width={PLAYER_W} height={PLAYER_H}>
            <defs>
              <linearGradient id="pbody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#f59e0b" />
                <stop offset="50%"  stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="pgloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.38)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <filter id="pglow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Ground shadow */}
            <ellipse cx="26" cy="79" rx="16" ry="3.5" fill="rgba(0,0,0,0.45)" />
            {/* Body */}
            <rect x="8" y="8" width="36" height="64" rx="11" fill="url(#pbody)" filter="url(#pglow)" />
            {/* Gloss */}
            <rect x="12" y="8" width="20" height="34" rx="7" fill="url(#pgloss)" />
            {/* Windshield */}
            <rect x="11" y="12" width="30" height="16" rx="5" fill="rgba(190,230,255,0.88)" />
            <rect x="14" y="13" width="24" height="7" rx="3" fill="rgba(110,180,255,0.4)" />
            {/* Rear window */}
            <rect x="13" y="56" width="26" height="11" rx="4" fill="rgba(180,220,255,0.75)" />
            {/* Wheels */}
            <rect x="1"  y="11" width="10" height="17" rx="4" fill="#111" /><rect x="3"  y="13" width="6" height="13" rx="2.5" fill="#374151" />
            <rect x="41" y="11" width="10" height="17" rx="4" fill="#111" /><rect x="43" y="13" width="6" height="13" rx="2.5" fill="#374151" />
            <rect x="1"  y="54" width="10" height="17" rx="4" fill="#111" /><rect x="3"  y="56" width="6" height="13" rx="2.5" fill="#374151" />
            <rect x="41" y="54" width="10" height="17" rx="4" fill="#111" /><rect x="43" y="56" width="6" height="13" rx="2.5" fill="#374151" />
            {/* Center stripe */}
            <rect x="23" y="12" width="6" height="58" rx="3" fill="rgba(255,255,255,0.18)" />
            {/* Headlights */}
            <ellipse cx="16" cy="10" rx="4.5" ry="2.5" fill="#fde68a" opacity="0.95" />
            <ellipse cx="36" cy="10" rx="4.5" ry="2.5" fill="#fde68a" opacity="0.95" />
            <ellipse cx="16" cy="10" rx="6"   ry="3.5" fill="#fef9c3" opacity="0.25" />
            <ellipse cx="36" cy="10" rx="6"   ry="3.5" fill="#fef9c3" opacity="0.25" />
            {/* Tail lights */}
            <ellipse cx="15" cy="72" rx="4.5" ry="2.5" fill="#ef4444" opacity="0.95" />
            <ellipse cx="37" cy="72" rx="4.5" ry="2.5" fill="#ef4444" opacity="0.95" />
            <ellipse cx="15" cy="72" rx="6"   ry="3.5" fill="#ef4444" opacity="0.25" />
            <ellipse cx="37" cy="72" rx="6"   ry="3.5" fill="#ef4444" opacity="0.25" />
          </svg>
        </div>

        {/* ── Idle / Game Over overlay ── */}
        {(status === 'idle' || status === 'over') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-50"
            style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}>

            {status === 'over' ? (
              <>
                <div style={{ fontSize: 56 }}>🏁</div>
                <p className="text-3xl font-black text-white">סיום המירוץ!</p>
                <div className="flex gap-6 text-lg font-bold text-white/80" style={{ direction: 'rtl' }}>
                  <span>💰 {score} נקודות</span>
                  <span>❤️ {lives}/{MAX_LIVES} חיים</span>
                </div>
                <p className="font-bold text-lg" style={{ color: score >= 80 ? '#4ade80' : score >= 40 ? '#fbbf24' : '#f87171', textShadow: '0 0 12px currentColor' }}>
                  {score >= 80 ? '🏆 ניהול תקציב מושלם!' : score >= 40 ? '👍 לא רע! תנסו שוב' : '💸 תנהלו טוב יותר את התקציב'}
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 60, animation: 'coinBob 1.4s ease-in-out infinite', display: 'inline-block' }}>🏎️</div>
                <p className="text-2xl font-black text-white">מירוץ התקציב</p>
                <div className="space-y-1.5 text-center text-sm font-semibold" style={{ direction: 'rtl' }}>
                  <p style={{ color: '#4ade80' }}>✅ אסוף הוצאות קבועות (ירוק/צורות שונות) — +10</p>
                  <p style={{ color: '#f87171' }}>🚫 הימנע מהוצאות משתנות (אדום) — -5</p>
                  <p style={{ color: '#fb923c' }}>💥 הימנע מרכבים — מאבד לב ו-8 נקודות</p>
                </div>
                <p className="text-xs text-white/40" style={{ direction: 'rtl' }}>חיצי מקלדת / A+D לנהיגה • כפתורים למובייל</p>
              </>
            )}

            <button onClick={startGame}
              className="px-10 py-3.5 rounded-full font-black text-lg text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#ec4899,#8b5cf6)', boxShadow: '0 8px 28px rgba(236,72,153,0.55)' }}>
              {status === 'over' ? '🔄 שחקו שוב' : '🚦 התחילו לרוץ!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetArcadeGame;
