import React, { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';

// ─── Game Data ─────────────────────────────────────────────────────────────────

interface Monopoly { id: string; name: string; color: string; bg: string; border: string; website: string; logoText: string; }

// Monopolies shown in QR study phase (ordered as requested)
const STUDY_MONOPOLY_IDS = ['osem', 'central', 'tnuva', 'unilever', 'diplomat', 'strauss', 'leiman', 'yafora'];

const MONOPOLIES: Monopoly[] = [
  { id: 'strauss',  name: 'שטראוס-עלית',              color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd', website: 'https://www.strauss-group.com',               logoText: 'STRAUSS'  },
  { id: 'osem',     name: 'אסם-נסטלה',                 color: '#ea580c', bg: '#ffedd5', border: '#fdba74', website: 'https://www.osem.co.il',                      logoText: 'OSEM'     },
  { id: 'tnuva',    name: 'תנובה',                     color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', website: 'https://www.tnuva.co.il',                     logoText: 'TNUVA'    },
  { id: 'unilever', name: 'יוניליוור',                 color: '#1e40af', bg: '#e0e7ff', border: '#a5b4fc', website: 'https://www.unilever.co.il',                  logoText: 'UNILEVER' },
  { id: 'central',  name: 'החברה המרכזית למשקאות',     color: '#b91c1c', bg: '#fecaca', border: '#f87171', website: 'https://www.coca-cola.co.il',                  logoText: 'CENTRAL'  },
  { id: 'diplomat', name: 'דיפלומט',                   color: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd', website: 'https://www.diplomat-il.com',                 logoText: 'DIPLOMAT' },
  { id: 'leiman',   name: 'ליימן שלייסל',              color: '#065f46', bg: '#d1fae5', border: '#6ee7b7', website: 'https://www.leiman.co.il',                    logoText: 'LEIMAN'   },
  { id: 'yafora',   name: 'יפאורה-תבורי',            color: '#c2410c', bg: '#ffedd5', border: '#fb923c', website: 'https://www.yafora-tivall.co.il',             logoText: 'YAFORA'   },
];

interface Product { name: string; monopolyId: string; emoji: string; }

const ALL_PRODUCTS: Product[] = [
  // שטראוס-עלית
  { name: 'מילקי',           monopolyId: 'strauss',  emoji: '🍫' },
  { name: 'קוטג׳ שטראוס',   monopolyId: 'strauss',  emoji: '🧀' },
  { name: 'שוקולד עלית',    monopolyId: 'strauss',  emoji: '🍫' },
  { name: 'קפה עלית',       monopolyId: 'strauss',  emoji: '☕' },
  { name: 'הומוס שטראוס',   monopolyId: 'strauss',  emoji: '🫘' },
  { name: 'יוגורט דנונה',   monopolyId: 'strauss',  emoji: '🥣' },
  // אסם-נסטלה
  { name: 'במבה',            monopolyId: 'osem',     emoji: '🥜' },
  { name: 'ביסלי',           monopolyId: 'osem',     emoji: '🍿' },
  { name: 'שקדי מרק',       monopolyId: 'osem',     emoji: '🥣' },
  { name: 'קצ׳אפ אסם',     monopolyId: 'osem',     emoji: '🍅' },
  { name: 'ספגטי אסם',     monopolyId: 'osem',     emoji: '🍝' },
  { name: 'מרק מצנפת',      monopolyId: 'osem',     emoji: '🍲' },
  // תנובה
  { name: 'חלב תנובה',      monopolyId: 'tnuva',    emoji: '🥛' },
  { name: 'חמאה תנובה',     monopolyId: 'tnuva',    emoji: '🧈' },
  { name: 'לבן תנובה',      monopolyId: 'tnuva',    emoji: '🍶' },
  { name: 'שמנת 38%',      monopolyId: 'tnuva',    emoji: '🍶' },
  { name: 'גבינה לבנה',     monopolyId: 'tnuva',    emoji: '🧀' },
  // יוניליוור
  { name: 'תה ליפטון',      monopolyId: 'unilever', emoji: '🍵' },
  { name: 'מיונז הלמן׳ס',  monopolyId: 'unilever', emoji: '🫙' },
  { name: 'סבון דאב',       monopolyId: 'unilever', emoji: '🧴' },
  { name: 'אקס / AXE',      monopolyId: 'unilever', emoji: '💨' },
  { name: 'שמן זית ברגיליו', monopolyId: 'unilever', emoji: '🫒' },
  // החברה המרכזית למשקאות
  { name: 'קוקה-קולה',     monopolyId: 'central',  emoji: '🥤' },
  { name: 'ספרייט',         monopolyId: 'central',  emoji: '🟢' },
  { name: 'פנטה',            monopolyId: 'central',  emoji: '🍊' },
  { name: 'פאוורייד',       monopolyId: 'central',  emoji: '🏋️' },
  { name: 'שוופס',          monopolyId: 'central',  emoji: '🍾' },
  // דיפלומט (P&G)
  { name: 'פמפרס',           monopolyId: 'diplomat', emoji: '👶' },
  { name: 'גילט',            monopolyId: 'diplomat', emoji: '🪒' },
  { name: 'פנטן',            monopolyId: 'diplomat', emoji: '💆' },
  { name: 'אוראל-בי',        monopolyId: 'diplomat', emoji: '🦷' },
  { name: 'אריאל / Ariel',   monopolyId: 'diplomat', emoji: '🧺' },
  // ליימן שלייסל
  { name: 'קורנפלקס קלוגס',  monopolyId: 'leiman',   emoji: '🌽' },
  { name: 'פרינגלס',         monopolyId: 'leiman',   emoji: '🥔' },
  { name: 'לייס / Lay\'s',   monopolyId: 'leiman',   emoji: '🥓' },
  { name: 'טרופיקנה',        monopolyId: 'leiman',   emoji: '🍊' },
  // יפאורה-תבורי
  { name: 'תפוזינה',         monopolyId: 'yafora',   emoji: '🍊' },
  { name: 'מיצי',            monopolyId: 'yafora',   emoji: '🧃' },
  { name: 'טיבול שניצל',      monopolyId: 'yafora',   emoji: '🥩' },
  { name: 'טיבול קצצייה',      monopolyId: 'yafora',   emoji: '🌶️' },
  { name: 'סלט תירות טבעי',  monopolyId: 'yafora',   emoji: '🥗' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type HostPhase = 'setup' | 'study' | 'waiting' | 'race' | 'done';

// Auto-advance interval in ms after last answer before moving to next product
const AUTO_ADVANCE_MS = 4000;

interface TeamScore { name: string; score: number; }

interface PlayerEntry { connId: string; name: string; team: string; conn: DataConnection; }

interface FloatAnim { id: number; name: string; team: string; correct: boolean; }

type Msg =
  | { type: 'JOIN';    name: string; team: string }
  | { type: 'ANSWER';  name: string; team: string; monopolyId: string }
  | { type: 'TEAMS';   teams: string[] }
  | { type: 'PRODUCTS'; products: Product[] }
  | { type: 'PRODUCT'; productIndex: number; total: number }
  | { type: 'RESULT';  correct: boolean; correctId: string }
  | { type: 'SCORE';   teams: TeamScore[] }
  | { type: 'DONE' };

// ─── Styles ────────────────────────────────────────────────────────────────────

const GAME_CSS = `
  @keyframes floatUp {
    0%   { opacity:1; transform:translateX(-50%) translateY(0) scale(1.1); }
    100% { opacity:0; transform:translateX(-50%) translateY(-70px) scale(0.9); }
  }
  @keyframes cartAdvance {
    0%   { filter: drop-shadow(0 0 0px transparent); }
    40%  { filter: drop-shadow(0 0 12px #fbbf24); }
    100% { filter: drop-shadow(0 0 0px transparent); }
  }
  @keyframes correctPulse {
    0%,100% { box-shadow: none; }
    50%     { box-shadow: 0 0 0 8px rgba(34,197,94,0.4); }
  }
  @keyframes wrongShake {
    0%,100% { transform: translateX(0); }
    25%     { transform: translateX(-8px); }
    75%     { transform: translateX(8px); }
  }
  @keyframes aisleScroll {
    from { background-position-x: 0; }
    to   { background-position-x: 120px; }
  }
  @keyframes spinIn  { from { transform:scale(0) rotate(-20deg); opacity:0; } to { transform:scale(1) rotate(0deg); opacity:1; } }
  @keyframes shimmer { 0%,100% { opacity:.7; } 50% { opacity:1; } }
  .float-name  { position:absolute; left:50%; pointer-events:none; white-space:nowrap; font-weight:700; font-size:14px; color:#fff; background:#334155; border-radius:12px; padding:2px 10px; animation: floatUp 1.3s ease-out forwards; }
  .cart-anim   { animation: cartAdvance 0.5s ease-out; }
  .correct-btn { animation: correctPulse 0.5s ease-out; }
  .wrong-btn   { animation: wrongShake 0.4s ease-out; }
  .spin-in     { animation: spinIn 0.35s cubic-bezier(.34,1.56,.64,1) forwards; }
`;

// ─── Monopoly Logo Component ───────────────────────────────────────────────────

const MonopolyBadge: React.FC<{ m: Monopoly; size?: 'sm' | 'md' | 'lg'; onClick?: () => void; feedback?: 'correct' | 'wrong' | null }> = ({ m, size = 'md', onClick, feedback }) => {
  const cls = size === 'lg' ? 'text-xl font-black py-5 px-4 rounded-2xl' : size === 'sm' ? 'text-xs font-bold py-2 px-3 rounded-xl' : 'text-sm font-bold py-3 px-4 rounded-xl';
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{ background: m.bg, color: m.color, border: `2px solid ${m.border}`, cursor: onClick ? 'pointer' : 'default' }}
      className={`${cls} transition-transform active:scale-95 select-none w-full ${feedback === 'correct' ? 'correct-btn' : feedback === 'wrong' ? 'wrong-btn' : ''}`}
    >
      {m.name}
    </button>
  );
};

// ─── Cart Race Component ───────────────────────────────────────────────────────

const CART_EMOJIS = ['🛒', '🛒', '🛒', '🛒', '🛒', '🛒'];
const TEAM_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];

const CartRace: React.FC<{ teams: TeamScore[]; maxScore: number; floats: FloatAnim[]; }> = ({ teams, maxScore, floats }) => {
  const total = Math.max(maxScore, 1);
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#e2e8f0 100%)', border: '2px solid #cbd5e1', minHeight: 120 + teams.length * 72 }}>
      {/* Aisle background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#94a3b8 0px,#94a3b8 2px,transparent 2px,transparent 60px)', animation: 'aisleScroll 2s linear infinite' }} />
      {/* Finish line */}
      <div className="absolute top-0 bottom-0 right-2 flex flex-col items-center justify-center z-10">
        <div className="w-8 rounded-full text-center" style={{ writingMode: 'vertical-rl', background: 'repeating-linear-gradient(90deg,#000 0px,#000 6px,#fff 6px,#fff 12px)', width: 10, height: '100%', opacity: 0.2 }} />
      </div>
      <div className="absolute left-4 top-2 text-xs text-gray-500 font-bold">🏁 התחלה</div>
      <div className="absolute right-4 top-2 text-xs text-gray-500 font-bold">🛒 קופה</div>

      {/* Tracks */}
      <div className="pt-8 pb-4 px-4 space-y-3">
        {teams.map((team, i) => {
          const pct = Math.min((team.score / total) * 85, 90);
          const colors = TEAM_COLORS[i % TEAM_COLORS.length];
          const teamFloats = floats.filter(f => f.team === team.name);
          return (
            <div key={team.name} className="relative flex items-center gap-2" style={{ height: 56 }}>
              {/* Track */}
              <div className="flex-1 h-10 rounded-full relative" style={{ background: '#e2e8f0', border: `1px solid #cbd5e1` }}>
                {/* Progress fill */}
                <div className="absolute inset-0 rounded-full opacity-30 transition-all duration-700" style={{ width: `${pct}%`, background: colors }} />
                {/* Cart */}
                <div
                  className="absolute top-0 flex flex-col items-center transition-all duration-700"
                  style={{ left: `${pct}%`, transform: 'translateX(-50%)', top: -8 }}
                >
                  <span className="text-2xl select-none" style={{ filter: `drop-shadow(0 2px 4px ${colors})` }}>🛒</span>
                  <span className="text-xs font-bold rounded-full px-2 py-0.5 text-white mt-0.5 truncate max-w-[80px]" style={{ background: colors }}>
                    {team.name}
                  </span>
                  {/* Float animations */}
                  {teamFloats.map(f => (
                    <span key={f.id} className="float-name" style={{ top: -28, background: f.correct ? '#15803d' : '#b91c1c' }}>
                      {f.correct ? '✓' : '✗'} {f.name}
                    </span>
                  ))}
                </div>
              </div>
              {/* Score */}
              <div className="text-lg font-black shrink-0 w-10 text-center" style={{ color: colors }}>{team.score}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Study Phase ───────────────────────────────────────────────────────────────

const StudyPhase: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [secs, setSecs] = useState(600);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const mm = Math.floor(secs / 60).toString().padStart(2, '0');
  const ss = (secs % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-brand-dark-blue">שלב 1: מחקר — 10 דקות</h3>
          <p className="text-brand-dark-blue/70">סרקו את ברקודי האתרים ולמדו אילו מוצרים שייכים לאיזה מונופול</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-5xl font-black font-mono rounded-2xl px-6 py-3" style={{ background: secs < 60 ? '#fee2e2' : '#f0fdf4', color: secs < 60 ? '#dc2626' : '#15803d' }}>
            {mm}:{ss}
          </div>
          <button onClick={onDone} className="px-6 py-3 bg-brand-teal text-white font-bold rounded-full hover:bg-teal-700">
            המשך למשחק ←
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MONOPOLIES.filter(m => STUDY_MONOPOLY_IDS.includes(m.id)).map(m => (
          <div key={m.id} className="rounded-2xl p-4 flex flex-col items-center gap-3 text-center" style={{ background: m.bg, border: `2px solid ${m.border}` }}>
            <div className="font-black text-lg" style={{ color: m.color }}>{m.name}</div>
            <QRCodeSVG value={m.website} size={100} />
            <a href={m.website} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: m.color }}>{m.website.replace('https://www.','')} ↗</a>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <img src={`${import.meta.env.BASE_URL}LOGOSMONOPOLY.SVG.svg`} alt="לוגואי המונופולים" className="w-full rounded-2xl shadow-md border border-gray-200" />
      </div>
    </div>
  );
};

// ─── HOST COMPONENT ────────────────────────────────────────────────────────────

const SupermarketRaceGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [phase, setPhase]               = useState<HostPhase>('setup');
  const [teamInputs, setTeamInputs]     = useState<string[]>(['קבוצה א', 'קבוצה ב']);
  const [gameDuration, setGameDuration] = useState(300); // seconds, configurable in setup
  const [timeLeft, setTimeLeft]         = useState(300);
  const [teams, setTeams]               = useState<TeamScore[]>([]);
  const [players, setPlayers]           = useState<PlayerEntry[]>([]);
  const [peerId, setPeerId]             = useState<string | null>(null);
  const [products, setProducts]         = useState<Product[]>([]);
  const [productIdx, setProductIdx]     = useState(-1);
  const [floats, setFloats]             = useState<FloatAnim[]>([]);
  const [answeredThis, setAnsweredThis]  = useState<Set<string>>(new Set());
  const peerRef        = useRef<InstanceType<typeof Peer> | null>(null);
  const floatIdRef     = useRef(0);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const teamsRef       = useRef<TeamScore[]>([]);
  const autoTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playersRef     = useRef<PlayerEntry[]>([]);
  const productIdxRef  = useRef(-1);
  const productsRef    = useRef<Product[]>([]);
  const answeredRef    = useRef<Set<string>>(new Set());

  // Keep refs in sync
  useEffect(() => { teamsRef.current = teams; }, [teams]);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { productIdxRef.current = productIdx; }, [productIdx]);
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { answeredRef.current = answeredThis; }, [answeredThis]);

  const baseUrl = window.location.href.split('#')[0];

  // Broadcast to all connected players
  const broadcast = useCallback((msg: Msg) => {
    connectionsRef.current.forEach(conn => {
      try { conn.send(msg); } catch {}
    });
  }, []);

  // Init PeerJS
  useEffect(() => {
    if (phase !== 'waiting' && phase !== 'setup') return;
    const peer = new Peer(undefined as any, { debug: 0 });
    peerRef.current = peer;
    peer.on('open', id => setPeerId(id));
    peer.on('connection', (conn: DataConnection) => {
      const connId = conn.peer;
      connectionsRef.current.set(connId, conn);
      // Send teams immediately when connection opens so player can see team list before joining
      conn.on('open', () => {
        try { conn.send({ type: 'TEAMS', teams: teamsRef.current.map(t => t.name) } as Msg); } catch {}
      });
      conn.on('data', (raw: unknown) => {
        const msg = raw as Msg;
        if (msg.type === 'JOIN') {
          const pl: PlayerEntry = { connId, name: msg.name, team: msg.team, conn };
          setPlayers(prev => {
            const filtered = prev.filter(p => p.connId !== connId);
            return [...filtered, pl];
          });
          // Re-send teams to confirm
          try { conn.send({ type: 'TEAMS', teams: teamsRef.current.map(t => t.name) } as Msg); } catch {}
        }
        if (msg.type === 'ANSWER') {
          if (answeredRef.current.has(msg.name)) return;
          const currIdx  = productIdxRef.current;
          const currProds = productsRef.current;
          const correct = currIdx >= 0 && currProds[currIdx]?.monopolyId === msg.monopolyId;
          // Float animation
          const fid = floatIdRef.current++;
          setFloats(prev => [...prev, { id: fid, name: msg.name, team: msg.team, correct }]);
          setTimeout(() => setFloats(prev => prev.filter(f => f.id !== fid)), 1400);
          // Update answered set
          setAnsweredThis(prev => { const n = new Set(prev); n.add(msg.name); return n; });
          answeredRef.current = new Set([...answeredRef.current, msg.name]);
          // Update score
          if (correct) {
            setTeams(prev => {
              const next = prev.map(t => t.name === msg.team ? { ...t, score: t.score + 1 } : t);
              broadcast({ type: 'SCORE', teams: next });
              return next;
            });
          }
          // Send result to that player
          try {
            connectionsRef.current.get(connId)?.send({
              type: 'RESULT',
              correct,
              correctId: currIdx >= 0 ? currProds[currIdx]?.monopolyId : '',
            } as Msg);
          } catch {}
          // Auto-advance: schedule next product if all players answered
          const allAnswered = [...answeredRef.current].length >= playersRef.current.length && playersRef.current.length > 0;
          if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
          autoTimerRef.current = setTimeout(() => {
            advanceProduct();
          }, allAnswered ? 1500 : AUTO_ADVANCE_MS);
        }
      });
      conn.on('close',  () => { connectionsRef.current.delete(connId); setPlayers(prev => prev.filter(p => p.connId !== connId)); });
      conn.on('error',  () => { connectionsRef.current.delete(connId); });
    });
    return () => { peer.destroy(); peerRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === 'waiting' || phase === 'race']);

  // When teams list is ready, send on any new join
  useEffect(() => {
    if (teams.length === 0) return;
    broadcast({ type: 'TEAMS', teams: teams.map(t => t.name) });
  }, [teams, broadcast]);

  // Game countdown timer while in race
  useEffect(() => {
    if (phase !== 'race') return;
    if (timeLeft <= 0) {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      broadcast({ type: 'DONE' });
      setPhase('done');
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, broadcast]);

  const advanceProduct = useCallback(() => {
    setProducts(currProds => {
      setProductIdx(currIdx => {
        const next = currIdx + 1;
        if (next >= currProds.length) {
          // loop products endlessly until timer runs out
          const reshuffled = shuffle(currProds);
          productsRef.current = reshuffled;
          broadcast({ type: 'PRODUCTS', products: reshuffled });
          broadcast({ type: 'PRODUCT', productIndex: 0, total: reshuffled.length });
          setAnsweredThis(new Set()); answeredRef.current = new Set();
          productIdxRef.current = 0;
          return 0;
        }
        broadcast({ type: 'PRODUCT', productIndex: next, total: currProds.length });
        setAnsweredThis(new Set()); answeredRef.current = new Set();
        productIdxRef.current = next;
        return next;
      });
      return currProds;
    });
  }, [broadcast]);

  const startSetup = () => {
    const validTeams = teamInputs.filter(t => t.trim()).map(t => ({ name: t.trim(), score: 0 }));
    if (validTeams.length < 1) return;
    setTeams(validTeams);
    setPhase('study');
  };

  const startWaiting = () => {
    setPhase('waiting');
  };

  const startRace = () => {
    const shuffled = shuffle(ALL_PRODUCTS);
    setProducts(shuffled);
    productsRef.current = shuffled;
    setProductIdx(0);
    productIdxRef.current = 0;
    setTimeLeft(gameDuration);
    setAnsweredThis(new Set()); answeredRef.current = new Set();
    setPhase('race');
    broadcast({ type: 'PRODUCTS', products: shuffled });
    broadcast({ type: 'TEAMS', teams: teams.map(t => t.name) });
    broadcast({ type: 'PRODUCT', productIndex: 0, total: shuffled.length });
    // Schedule first auto-advance
    autoTimerRef.current = setTimeout(() => advanceProduct(), AUTO_ADVANCE_MS);
  };

  const qrUrl = peerId ? `${baseUrl}#supermarket-player-${peerId}` : null;
  const currentProduct = productIdx >= 0 && productIdx < products.length ? products[productIdx] : null;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4" dir="rtl">
      <style>{GAME_CSS}</style>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark-blue">🛒 חכם בסופר</h2>
          <p className="text-brand-dark-blue/60">משחק מונופולים כיתתי — {teams.length > 0 ? `${teams.length} קבוצות` : 'הגדרת קבוצות'}</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300">← חזרה</button>
      </div>

      {/* ── SETUP ─────────────────────────────────────────────────────── */}
      {phase === 'setup' && (
        <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-brand-dark-blue">הגדרת קבוצות ומשחק</h3>

          {/* Duration picker */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-brand-dark-blue">⏱ משך המשחק:</span>
            {[120, 180, 300, 420, 600].map(sec => (
              <button
                key={sec}
                onClick={() => setGameDuration(sec)}
                className={`px-4 py-2 rounded-full font-bold border-2 transition ${gameDuration === sec ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white text-brand-dark-blue border-gray-300 hover:border-brand-teal'}`}
              >
                {sec < 60 ? `${sec}ש׳` : `${sec / 60} דק׳`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {teamInputs.map((name, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg font-bold w-8 text-brand-dark-blue/50">{i + 1}.</span>
                <input
                  value={name}
                  onChange={e => setTeamInputs(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                  className="flex-1 border rounded-xl px-3 py-2 text-lg border-gray-300 focus:outline-none focus:border-brand-teal"
                  placeholder={`שם קבוצה ${i + 1}`}
                />
                {teamInputs.length > 1 && (
                  <button onClick={() => setTeamInputs(prev => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xl font-bold px-2">×</button>
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
            <button onClick={startSetup} className="px-6 py-2 bg-brand-teal text-white font-bold rounded-full hover:bg-teal-700">
              המשך לשלב לימוד ←
            </button>
          </div>
        </div>
      )}

      {/* ── STUDY ─────────────────────────────────────────────────────── */}
      {phase === 'study' && (
        <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6">
          <StudyPhase onDone={startWaiting} />
        </div>
      )}

      {/* ── WAITING ───────────────────────────────────────────────────── */}
      {phase === 'waiting' && (
        <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Panel */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl" style={{ background: '#f8fafc', border: '2px dashed #cbd5e1' }}>
              <p className="text-lg font-bold text-brand-dark-blue">סרקו להצטרף 📱</p>
              {qrUrl
                ? <QRCodeSVG value={qrUrl} size={200} bgColor="#fff" fgColor="#1b2550" />
                : <div className="w-48 h-48 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">טוען...</div>}
              <p className="text-sm text-brand-dark-blue/60 text-center">כל שחקן סורק, מזין שם ובוחר קבוצה</p>
            </div>
            {/* Players list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-brand-dark-blue">{players.length} שחקנים מחוברים</p>
                <button
                  onClick={startRace}
                  disabled={players.length === 0}
                  className="px-5 py-2 bg-brand-teal text-white font-bold rounded-full hover:bg-teal-700 disabled:opacity-40"
                >
                  🚀 התחל משחק
                </button>
              </div>
              {teams.map(t => {
                const tPlayers = players.filter(p => p.team === t.name);
                return (
                  <div key={t.name} className="rounded-xl p-3 border border-gray-200 bg-white">
                    <p className="font-bold text-sm text-brand-dark-blue/70 mb-2">{t.name} ({tPlayers.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {tPlayers.length === 0
                        ? <span className="text-xs text-gray-400">אין שחקנים עדיין</span>
                        : tPlayers.map(p => <span key={p.name} className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded-full">{p.name}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── RACE ──────────────────────────────────────────────────────── */}
      {phase === 'race' && (() => {
        const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const ss = (timeLeft % 60).toString().padStart(2, '0');
        const urgent = timeLeft <= 30;
        return (
          <div className="space-y-4">
            {/* Timer + players bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div
                className="text-4xl font-black font-mono rounded-2xl px-6 py-2"
                style={{ background: urgent ? '#fee2e2' : '#f0fdf4', color: urgent ? '#dc2626' : '#15803d', transition: 'background 0.5s' }}
              >
                {urgent ? '⏰ ' : '⏱ '}{mm}:{ss}
              </div>
              <div className="text-sm text-brand-dark-blue/60 font-bold">
                {players.length} שחקנים מחוברים — ענו: {answeredThis.size}/{players.length}
              </div>
              <button
                onClick={() => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); broadcast({ type: 'DONE' }); setPhase('done'); }}
                className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-full hover:bg-red-200 text-sm"
              >
                סיים עכשיו ⏹
              </button>
            </div>

            {/* Cart race */}
            <CartRace teams={teams} maxScore={Math.max(...teams.map(t => t.score), 1) + 3} floats={floats} />

            {/* Scoreboard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[...teams].sort((a, b) => b.score - a.score).map((t, i) => (
                <div key={t.name} className="rounded-xl p-3 text-center border shadow-sm" style={{ background: i === 0 ? '#fef3c7' : '#f8fafc', borderColor: TEAM_COLORS[teams.indexOf(t) % TEAM_COLORS.length] + '99' }}>
                  <p className="text-xs font-bold text-brand-dark-blue/60 truncate">{['🥇','🥈','🥉'][i] || ''} {t.name}</p>
                  <p className="text-4xl font-black mt-1" style={{ color: TEAM_COLORS[teams.indexOf(t) % TEAM_COLORS.length] }}>{t.score}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── DONE ──────────────────────────────────────────────────────── */}
      {phase === 'done' && (
        <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-8 text-center space-y-6">
          <p className="text-5xl">🏆</p>
          <h3 className="text-3xl font-black text-brand-dark-blue">סיום המשחק!</h3>
          <div className="space-y-3 max-w-xs mx-auto">
            {[...teams].sort((a, b) => b.score - a.score).map((t, i) => (
              <div key={t.name} className="flex items-center gap-3 rounded-2xl p-3 border" style={{ background: i === 0 ? '#fef3c7' : '#f8fafc' }}>
                <span className="text-2xl">{['🥇', '🥈', '🥉'][i] || `${i + 1}.`}</span>
                <span className="flex-1 font-bold text-brand-dark-blue text-right">{t.name}</span>
                <span className="text-2xl font-black text-brand-teal">{t.score}</span>
              </div>
            ))}
          </div>
          <button onClick={() => { setPhase('setup'); setTeams([]); setPlayers([]); setProductIdx(-1); setFloats([]); setTimeLeft(gameDuration); }} className="px-8 py-3 bg-brand-magenta text-white font-bold rounded-full hover:bg-pink-700">
            🔄 משחק חדש
          </button>
        </div>
      )}
    </div>
  );
};

// ─── PLAYER COMPONENT ──────────────────────────────────────────────────────────

export const SupermarketPlayerView: React.FC = () => {
  const hm        = window.location.hash.match(/#supermarket-player-(.+)/);
  const hostId    = hm ? hm[1] : null;
  const connRef   = useRef<DataConnection | null>(null);
  const peerRef2  = useRef<InstanceType<typeof Peer> | null>(null);

  const [status,     setStatus]     = useState<'connecting' | 'join' | 'waiting' | 'game' | 'done' | 'error'>('connecting');
  const [teams,      setTeams]      = useState<string[]>([]);
  const [myName,     setMyName]     = useState('');
  const [myTeam,     setMyTeam]     = useState('');
  const [products,   setProducts]   = useState<Product[]>([]);
  const [productIdx, setProductIdx] = useState(-1);
  const [feedback,   setFeedback]   = useState<{ id: string; correct: boolean } | null>(null);
  const [score,      setScore]      = useState(0);
  const [answered,   setAnswered]   = useState(false);

  const send = useCallback((msg: Msg) => { try { connRef.current?.send(msg); } catch {} }, []);

  useEffect(() => {
    if (!hostId) { setStatus('error'); return; }
    const peer = new Peer(undefined as any, { debug: 0 });
    peerRef2.current = peer;
    peer.on('open', () => {
      const conn = peer.connect(hostId, { reliable: true });
      connRef.current = conn;
      conn.on('open', () => setStatus('join'));
      conn.on('data', (raw: unknown) => {
        const msg = raw as Msg;
        if (msg.type === 'TEAMS')    { setTeams(msg.teams); }
        if (msg.type === 'PRODUCTS') { setProducts(msg.products); }
        if (msg.type === 'PRODUCT')  { setProductIdx(msg.productIndex); setAnswered(false); setFeedback(null); setStatus('game'); }
        if (msg.type === 'RESULT')   {
          setFeedback({ id: msg.correctId, correct: msg.correct });
          if (msg.correct) setScore(s => s + 1);
          setTimeout(() => { setFeedback(null); setAnswered(false); }, 1800);
        }
        if (msg.type === 'DONE')     { setStatus('done'); }
      });
      conn.on('close', () => setStatus('error'));
      conn.on('error', () => setStatus('error'));
    });
    peer.on('error', () => setStatus('error'));
    return () => { peer.destroy(); };
  }, [hostId]);

  const join = () => {
    if (!myName.trim() || !myTeam) return;
    send({ type: 'JOIN', name: myName.trim(), team: myTeam });
    setStatus('waiting');
  };

  const answer = (monopolyId: string) => {
    if (answered) return;
    setAnswered(true);
    send({ type: 'ANSWER', name: myName, team: myTeam, monopolyId });
  };

  const currentProduct = productIdx >= 0 && productIdx < products.length ? products[productIdx] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dbeafe)', fontFamily: 'system-ui,sans-serif' }} dir="rtl">
      <style>{GAME_CSS}</style>

      {/* Connecting */}
      {status === 'connecting' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl pulse-anim">🛒</div>
            <p className="text-xl font-bold text-gray-700">מתחבר...</p>
          </div>
        </div>
      )}

      {/* Join form */}
      {status === 'join' && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xs space-y-4 bg-white rounded-3xl shadow-2xl p-6">
            <p className="text-2xl font-black text-center text-brand-dark-blue">🛒 חכם בסופר</p>
            <input
              value={myName}
              onChange={e => setMyName(e.target.value)}
              placeholder="השם שלך"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl text-center focus:outline-none focus:border-brand-teal"
            />
            <select
              value={myTeam}
              onChange={e => setMyTeam(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl text-center focus:outline-none focus:border-brand-teal"
            >
              <option value="">בחר קבוצה</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button
              onClick={join}
              disabled={!myName.trim() || !myTeam}
              className="w-full py-3 text-xl font-black rounded-full text-white disabled:opacity-40"
              style={{ background: '#0d9488' }}
            >
              הצטרף! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Waiting */}
      {status === 'waiting' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-6xl pulse-anim">⏳</div>
            <p className="text-xl font-bold text-gray-700">ממתין להתחלת המשחק...</p>
            <p className="text-gray-500">{myName} | {myTeam}</p>
          </div>
        </div>
      )}

      {/* Game screen */}
      {status === 'game' && currentProduct && (
        <div className="flex-1 flex flex-col" style={{ minHeight: '100vh' }}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <span className="text-xs font-bold text-brand-dark-blue/60 bg-white/70 rounded-full px-3 py-1">{myName}</span>
            <span className="font-black text-brand-teal text-xl bg-white rounded-full px-4 py-1 shadow">✓ {score}</span>
          </div>

          {/* Product card */}
          <div className="flex justify-center px-4 pb-3">
            <div className="bg-white rounded-3xl shadow-xl px-8 py-4 flex flex-col items-center gap-1 border-4 border-white/80 w-full max-w-xs">
              <span className="text-6xl spin-in">{currentProduct.emoji}</span>
              <p className="text-2xl font-black text-center text-brand-dark-blue">{currentProduct.name}</p>
              {answered && !feedback && <p className="text-xs text-gray-400 mt-1">נשלח ✓</p>}
              {feedback && (
                <p className={`text-sm font-bold mt-1 ${feedback.correct ? 'text-green-600' : 'text-red-500'}`}>
                  {feedback.correct ? '✅ נכון!' : '❌ לא נכון'}
                </p>
              )}
            </div>
          </div>

          {/* Monopoly grid */}
          <div className="flex-1 overflow-y-auto px-3 pb-6">
            <p className="text-center text-xs text-brand-dark-blue/50 font-bold mb-2">של מי המוצר?</p>
            <div className="grid grid-cols-2 gap-2">
              {MONOPOLIES.map(m => {
                const isCorrect = feedback?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => answer(m.id)}
                    disabled={answered}
                    className="rounded-2xl py-3 px-2 font-black text-base transition-transform active:scale-95 disabled:cursor-default"
                    style={{
                      background: isCorrect && feedback ? '#dcfce7' : m.bg,
                      border: `2px solid ${isCorrect && feedback ? '#22c55e' : m.border}`,
                      color: m.color,
                      boxShadow: isCorrect && feedback ? '0 0 0 4px #22c55e44' : undefined,
                      transform: isCorrect && feedback ? 'scale(1.04)' : undefined,
                    }}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Done */}
      {status === 'done' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 p-6">
            <p className="text-6xl">🏆</p>
            <p className="text-2xl font-black text-gray-700">המשחק הסתיים!</p>
            <p className="text-4xl font-black text-brand-teal">{score} נקודות</p>
            <p className="text-gray-500">{myName} | {myTeam}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-4xl">⚠️</p>
            <p className="text-xl font-bold text-gray-700">שגיאת חיבור — סרקו מחדש</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupermarketRaceGame;
