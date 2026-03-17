import React, { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';

// ─── Game Data ─────────────────────────────────────────────────────────────────

interface Monopoly { id: string; name: string; color: string; bg: string; border: string; website: string; logoText: string; }

// Monopolies shown in QR study phase (ordered as requested)
const STUDY_MONOPOLY_IDS = ['osem', 'central', 'tnuva', 'unilever', 'diplomat', 'strauss', 'leiman', 'shestovich'];

const MONOPOLIES: Monopoly[] = [
  { id: 'strauss',  name: 'שטראוס',                    color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd', website: 'https://www.strauss-group.co.il/brand/',                                                logoText: 'STRAUSS'  },
  { id: 'osem',     name: 'אסם',                       color: '#ea580c', bg: '#ffedd5', border: '#fdba74', website: 'https://www.osem-nestle.co.il/brands',                                                  logoText: 'OSEM'     },
  { id: 'tnuva',    name: 'תנובה',                     color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', website: 'https://www.tnuva.co.il/products/',                                                     logoText: 'TNUVA'    },
  { id: 'unilever', name: 'יוניליוור',                 color: '#1e40af', bg: '#e0e7ff', border: '#a5b4fc', website: 'https://docs.google.com/document/d/1pkR8V29Zg70TTsZ-EN13fMz9aZDteh-2GfIuaRcrqBM/edit?usp=sharing', logoText: 'UNILEVER' },
  { id: 'central',  name: 'החברה המרכזית למשקאות',     color: '#b91c1c', bg: '#fecaca', border: '#f87171', website: 'https://cbcsales.co.il/',                                                               logoText: 'CENTRAL'  },
  { id: 'diplomat', name: 'דיפלומט',                   color: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd', website: 'https://www.diplomat.co.il/he/the-brands/',                                             logoText: 'DIPLOMAT' },
  { id: 'leiman',   name: 'ליימן שלייסל',              color: '#065f46', bg: '#d1fae5', border: '#6ee7b7', website: 'https://www.l-s.co.il/brands/',                                                         logoText: 'LEIMAN'   },
  { id: 'shestovich', name: 'שסטוביץ׳',                color: '#0f766e', bg: '#ccfbf1', border: '#5eead4', website: 'https://www.sch.co.il/%D7%9E%D7%95%D7%AA%D7%92%D7%99%D7%9D/',                           logoText: 'SHESTOVICH' },
];

type MonopolyAnswerId = Monopoly['id'] | 'other';

interface Product {
  name: string;
  monopolyId: MonopolyAnswerId;
  imageFile: string; // lives in /public
}

const PRODUCT_IMAGE_FILES: string[] = [
  'bazooka(shtraus).jpg.svg',
  'deodorant(diplomat).jpg.svg',
  'doritos(shtraus).jpg.svg',
  'dove(diplomat).jpg.svg',
  'energi(shtraus).jpg.svg',
  'go(tnuva).jpg.svg',
  'hainz(diplomat).jpg.svg',
  'jacobs(diplomat).jpg.svg',
  'kifli(uniliver).jpg.svg',
  'klik(uniliver).jpg.svg',
  'kornflex(uniliver).jpg.svg',
  'loaker(leiman).jpg.svg',
  'mamaof(tnuva).jpg.svg',
  'mastershef(shestovich).jpg.svg',
  'meieden(yfora).jpg.svg',
  'mentos(leiman).jpg.svg',
  'meridol(shestovich).jpg.svg',
  'milka(diplomat).jpg.svg',
  'milki(shtraus).jpg.svg',
  'muller(cocacola).jpg.svg',
  'neviot(cocacola).jpg.svg',
  'oralb(diplomat).jpg.svg',
  'oreo(diplomat).jpg.svg',
  'palmoliv(shestovich).jpg.svg',
  'pinuk(uniliver).jpg.svg',
  'pinukit(shtraus).jpg.svg',
  'prigat(cocacola).jpg.svg',
  'pringles(diplomat).jpg.svg',
  'pro(shtraus).jpg.svg',
  'proud(diplomat).jpg.svg',
  'purina(osem).jpg.svg',
  'quaker(shtraus).jpg.svg',
  'rccoke(yfora).jpg.svg',
  'sanfrost(tnuva).jpg.svg',
  'shemen(shtraus).jpg.svg',
  'shweps(yfora).jpg.svg',
  'smartis(osem).jpg.svg',
  'snyder(leiman).jpg.svg',
  'speedstik(uniliver).jpg.svg',
  'splendid(shtraus).jpg.svg',
  'tapochips (shtraus).jpg.svg',
  'tapozina(yfora).jpg.svg',
  'testers(osem).jpg.svg',
  'whitecheese(tnuva).jpg.svg',
  'yolo(tnuva).jpg.svg',
];

const KNOWN_MONOPOLY_IDS = new Set<string>(MONOPOLIES.map(m => m.id));

function normalizeMonopolyTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/["'`]/g, '');
}

function tagToMonopolyId(tag: string): MonopolyAnswerId {
  const t = normalizeMonopolyTag(tag);
  const mapped: Record<string, MonopolyAnswerId> = {
    strauss: 'strauss',
    shtraus: 'strauss',
    osem: 'osem',
    tnuva: 'tnuva',
    unilever: 'unilever',
    uniliver: 'unilever',
    diplomat: 'diplomat',
    leiman: 'leiman',
    shestovich: 'shestovich',
    // yafora/yfora products should be answered as "other"
    yafora: 'other',
    yfora: 'other',
    central: 'central',
    cocacola: 'central',
  };
  const id = mapped[t] ?? (KNOWN_MONOPOLY_IDS.has(t) ? (t as Monopoly['id']) : 'other');
  return KNOWN_MONOPOLY_IDS.has(id) ? id : 'other';
}

function makeProductFromFilename(imageFile: string): Product {
  const withoutExt = imageFile.replace(/(\.[^.]+)+$/g, '').trim();
  const m = withoutExt.match(/^(.*)\(([^)]+)\)$/);
  const rawName = (m ? m[1] : withoutExt).trim();
  const rawTag = (m ? m[2] : '').trim();
  const name = rawName
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const monopolyId = rawTag ? tagToMonopolyId(rawTag) : 'other';
  return { name: name || 'מוצר', monopolyId, imageFile };
}

const ALL_PRODUCTS: Product[] = PRODUCT_IMAGE_FILES.map(makeProductFromFilename);

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

interface TeamScore { name: string; score: number; }

interface PlayerEntry { connId: string; name: string; team: string; conn: DataConnection; }

interface FloatAnim { id: number; name: string; team: string; correct: boolean; }

type Msg =
  | { type: 'JOIN';    name: string; team: string }
  | { type: 'ANSWER';  name: string; team: string; monopolyId: string; productIndex: number; cycle: number }
  | { type: 'TEAMS';   teams: string[] }
  | { type: 'PRODUCTS'; products: Product[] }
  | { type: 'PRODUCT'; productIndex: number; total: number }
  | { type: 'RESULT';  correct: boolean; correctId: string }
  | { type: 'SCORE';   teams: TeamScore[] }
  | { type: 'DONE' };

function playTapSfx() {
  try {
    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 660;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
    osc.onended = () => { try { ctx.close(); } catch {} };
  } catch {}
}

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
    <div className="relative w-full rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#e2e8f0 100%)', border: '2px solid #cbd5e1', minHeight: 160 + teams.length * 92 }}>
      {/* Aisle background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#94a3b8 0px,#94a3b8 2px,transparent 2px,transparent 60px)', animation: 'aisleScroll 2s linear infinite' }} />
      {/* Finish line */}
      <div className="absolute top-0 bottom-0 right-2 flex flex-col items-center justify-center z-10">
        <div className="w-8 rounded-full text-center" style={{ writingMode: 'vertical-rl', background: 'repeating-linear-gradient(90deg,#000 0px,#000 6px,#fff 6px,#fff 12px)', width: 10, height: '100%', opacity: 0.2 }} />
      </div>
      <div className="absolute left-4 top-2 text-xs text-gray-500 font-bold">🏁 התחלה</div>
      <div className="absolute right-4 top-2 text-xs text-gray-500 font-bold">🛒 קופה</div>

      {/* Tracks */}
      <div className="pt-10 pb-6 px-6 space-y-4">
        {teams.map((team, i) => {
          const pct = Math.min((team.score / total) * 85, 90);
          const colors = TEAM_COLORS[i % TEAM_COLORS.length];
          const teamFloats = floats.filter(f => f.team === team.name);
          return (
            <div key={team.name} className="relative flex items-center gap-3" style={{ height: 76 }}>
              {/* Track */}
              <div className="flex-1 h-12 rounded-full relative" style={{ background: '#e2e8f0', border: `1px solid #cbd5e1` }}>
                {/* Progress fill */}
                <div className="absolute inset-0 rounded-full opacity-30 transition-all duration-700" style={{ width: `${pct}%`, background: colors }} />
                {/* Cart */}
                <div
                  className="absolute top-0 flex flex-col items-center transition-all duration-700"
                  style={{ left: `${pct}%`, transform: 'translateX(-50%)', top: -14 }}
                >
                  <span className="text-3xl select-none" style={{ filter: `drop-shadow(0 4px 8px ${colors})` }}>🛒</span>
                  <span className="text-sm font-black rounded-full px-3 py-1 text-white mt-1 truncate max-w-[140px]" style={{ background: colors }}>
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
              <div className="text-2xl font-black shrink-0 w-14 text-center" style={{ color: colors }}>{team.score}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Study Phase ───────────────────────────────────────────────────────────────

function copyLinksToClipboard() {
  const text = MONOPOLIES.map(m => `${m.name}: ${m.website}`).join('\n');
  navigator.clipboard.writeText(text).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

function downloadLinksPDF() {
  const rows = MONOPOLIES.map(m => `
    <tr>
      <td style="padding:10px 16px;font-weight:bold;font-size:15px;color:${m.color};background:${m.bg};border:1px solid ${m.border};direction:rtl">${m.name}</td>
      <td style="padding:10px 16px;font-size:13px;color:#1e3a5f;border:1px solid #e5e7eb;word-break:break-all">${m.website}</td>
    </tr>`).join('');
  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8"/>
  <title>קישורי המונופולים — חכם בסופר</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; direction: rtl; }
    h1   { font-size: 22px; color: #1b2550; margin-bottom: 4px; }
    p    { color: #64748b; margin-bottom: 20px; font-size: 13px; }
    table { border-collapse: collapse; width: 100%; }
    th   { background: #1b2550; color: #fff; padding: 10px 16px; text-align: right; font-size: 14px; }
    tr:hover td { background: #f8fafc; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>🛒 חכם בסופר — קישורי המונופולים</h1>
  <p>סרקו את הברקוד או היכנסו לקישור כדי לגלות אילו מוצרים שייכים לאיזו חברה</p>
  <table>
    <thead><tr><th>חברה</th><th style="text-align:left">קישור</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

const StudyPhase: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [totalSecs, setTotalSecs] = useState(600);
  const [secs,      setSecs]      = useState<number | null>(null); // null = not started
  const [copied,    setCopied]    = useState(false);

  useEffect(() => {
    if (secs === null || secs <= 0) return;
    const t = setTimeout(() => setSecs(s => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const running = secs !== null;
  const display = secs ?? totalSecs;
  const mm = Math.floor(display / 60).toString().padStart(2, '0');
  const ss = (display % 60).toString().padStart(2, '0');

  const handleCopy = () => {
    copyLinksToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-bold text-brand-dark-blue">שלב 1: מחקר</h3>
          <p className="text-brand-dark-blue/70">סרקו את ברקודי האתרים ולמדו אילו מוצרים שייכים לאיזה מונופול</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {/* Timer display */}
          <div className="flex items-center gap-2">
            {!running && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-dark-blue/70">זמן:</span>
                {[3, 5, 7, 10, 15].map(min => (
                  <button key={min} onClick={() => { setTotalSecs(min * 60); setSecs(null); }}
                    className={`px-3 py-1 rounded-full text-sm font-bold border-2 transition ${
                      totalSecs === min * 60 ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white border-gray-300 hover:border-brand-teal text-brand-dark-blue'
                    }`}>
                    {min}′
                  </button>
                ))}
              </div>
            )}
            <div className="text-4xl font-black font-mono rounded-2xl px-5 py-2" style={{ background: secs !== null && secs < 60 ? '#fee2e2' : '#f0fdf4', color: secs !== null && secs < 60 ? '#dc2626' : '#15803d' }}>
              {mm}:{ss}
            </div>
            {!running
              ? <button onClick={() => setSecs(totalSecs)} className="px-5 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 text-sm">▶ הפעל</button>
              : <button onClick={() => setSecs(null)} className="px-5 py-2 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 text-sm">⏸ עצור</button>
            }
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="px-4 py-2 bg-white border-2 border-gray-300 text-brand-dark-blue font-bold rounded-full hover:border-brand-teal hover:text-brand-teal text-sm flex items-center gap-1 transition">
              {copied ? '✅ הועתק!' : '📋 העתק קישורים'}
            </button>
            <button onClick={downloadLinksPDF}
              className="px-4 py-2 bg-white border-2 border-gray-300 text-brand-dark-blue font-bold rounded-full hover:border-brand-teal hover:text-brand-teal text-sm flex items-center gap-1">
              📄 הדפס קישורים
            </button>
            <button onClick={onDone} className="px-6 py-2 bg-brand-teal text-white font-bold rounded-full hover:bg-teal-700">
              המשך למשחק ←
            </button>
          </div>
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
  const [floats, setFloats]             = useState<FloatAnim[]>([]);
  const peerRef        = useRef<InstanceType<typeof Peer> | null>(null);
  const floatIdRef     = useRef(0);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const teamsRef       = useRef<TeamScore[]>([]);
  const playersRef     = useRef<PlayerEntry[]>([]);
  const productsRef    = useRef<Product[]>([]);
  const answeredKeyRef = useRef<Set<string>>(new Set());
  const bgMusicRef     = useRef<HTMLAudioElement | null>(null);

  // Keep refs in sync
  useEffect(() => { teamsRef.current = teams; }, [teams]);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { productsRef.current = products; }, [products]);

  const baseUrl = window.location.href.split('#')[0];

  // Broadcast to all connected players
  const broadcast = useCallback((msg: Msg) => {
    connectionsRef.current.forEach(conn => {
      try { conn.send(msg); } catch {}
    });
  }, []);

  const startBgMusic = useCallback(() => {
    try {
      if (!bgMusicRef.current) {
        const a = new Audio(`${import.meta.env.BASE_URL}havila.mp3`);
        a.loop = true;
        a.volume = 0.22;
        bgMusicRef.current = a;
      }
      void bgMusicRef.current.play();
    } catch {}
  }, []);

  const stopBgMusic = useCallback(() => {
    try {
      bgMusicRef.current?.pause();
      if (bgMusicRef.current) bgMusicRef.current.currentTime = 0;
    } catch {}
  }, []);

  // Ensure music stops when leaving race / unmounting
  useEffect(() => {
    if (phase !== 'race') stopBgMusic();
  }, [phase, stopBgMusic]);

  useEffect(() => {
    return () => stopBgMusic();
  }, [stopBgMusic]);

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
          const key = `${connId}:${msg.cycle}:${msg.productIndex}`;
          if (answeredKeyRef.current.has(key)) return;
          answeredKeyRef.current.add(key);

          const currProds = productsRef.current;
          const prod = currProds[msg.productIndex];
          const correctId = prod?.monopolyId ?? '';
          const correct = !!prod && correctId === msg.monopolyId;
          // Float animation
          const fid = floatIdRef.current++;
          setFloats(prev => [...prev, { id: fid, name: msg.name, team: msg.team, correct }]);
          setTimeout(() => setFloats(prev => prev.filter(f => f.id !== fid)), 1400);
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
              correctId,
            } as Msg);
          } catch {}
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
      broadcast({ type: 'DONE' });
      setPhase('done');
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, broadcast]);

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
    // Start background music from a user gesture (button click) so mobile/desktop browsers allow playback.
    startBgMusic();
    const shuffled = shuffle(ALL_PRODUCTS);
    setProducts(shuffled);
    productsRef.current = shuffled;
    setTimeLeft(gameDuration);
    answeredKeyRef.current = new Set();
    setPhase('race');
    broadcast({ type: 'PRODUCTS', products: shuffled });
    broadcast({ type: 'TEAMS', teams: teams.map(t => t.name) });
  };

  const qrUrl = peerId ? `${baseUrl}#supermarket-player-${peerId}` : null;

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
          <div className="space-y-6">
            {/* Timer + players bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div
                className="text-6xl font-black font-mono rounded-3xl px-8 py-3"
                style={{ background: urgent ? '#fee2e2' : '#f0fdf4', color: urgent ? '#dc2626' : '#15803d', transition: 'background 0.5s' }}
              >
                {urgent ? '⏰ ' : '⏱ '}{mm}:{ss}
              </div>
              <div className="text-lg text-brand-dark-blue/60 font-bold">
                {players.length} שחקנים מחוברים
              </div>
              <button
                onClick={() => { stopBgMusic(); broadcast({ type: 'DONE' }); setPhase('done'); }}
                className="px-6 py-3 bg-red-100 text-red-600 font-bold rounded-full hover:bg-red-200 text-base"
              >
                סיים עכשיו ⏹
              </button>
            </div>

            {/* Cart race */}
            <CartRace teams={teams} maxScore={Math.max(...teams.map(t => t.score), 1) + 3} floats={floats} />

            {/* Scoreboard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...teams].sort((a, b) => b.score - a.score).map((t, i) => (
                <div key={t.name} className="rounded-2xl p-4 text-center border shadow-md" style={{ background: i === 0 ? '#fef3c7' : '#f8fafc', borderColor: TEAM_COLORS[teams.indexOf(t) % TEAM_COLORS.length] + '99' }}>
                  <p className="text-sm font-black text-brand-dark-blue/70 truncate">{['🥇','🥈','🥉'][i] || ''} {t.name}</p>
                  <p className="text-6xl font-black mt-2" style={{ color: TEAM_COLORS[teams.indexOf(t) % TEAM_COLORS.length] }}>{t.score}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── DONE ──────────────────────────────────────────────────────── */}
      {phase === 'done' && (() => {
        const sorted = [...teams].sort((a, b) => b.score - a.score);
        // podium order: 2nd | 1st | 3rd
        const podiumOrder   = sorted.length >= 3 ? [sorted[1], sorted[0], sorted[2]] : sorted;
        const podiumHeights = ['h-28', 'h-40', 'h-20'];
        const podiumColors  = ['#9ca3af', '#fbbf24', '#cd7c2c'];
        const podiumLabels  = ['🥈', '🥇', '🥉'];
        return (
          <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-8 text-center space-y-8">
            <div>
              <p className="text-5xl mb-1">🏆</p>
              <h3 className="text-4xl font-black text-brand-dark-blue">סיום המשחק!</h3>
            </div>

            {/* Podium */}
            {sorted.length >= 2 && (
              <div className="flex items-end justify-center gap-4">
                {podiumOrder.map((t, pi) => {
                  const col = TEAM_COLORS[teams.indexOf(t) % TEAM_COLORS.length];
                  return (
                    <div key={t.name} className="flex flex-col items-center gap-2" style={{ minWidth: 100 }}>
                      <span className="text-4xl">{podiumLabels[pi]}</span>
                      <span className="font-black text-sm text-brand-dark-blue text-center leading-tight max-w-[96px]">{t.name}</span>
                      <span className="text-3xl font-black" style={{ color: col }}>{t.score}</span>
                      <div
                        className={`w-24 ${podiumHeights[pi]} rounded-t-2xl flex items-start justify-center pt-2 font-black text-white text-2xl`}
                        style={{ background: podiumColors[pi] }}
                      >
                        {[2, 1, 3][pi]}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4th place and beyond */}
            {sorted.length === 1 && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl">🥇</span>
                <span className="text-2xl font-black text-brand-dark-blue">{sorted[0].name}</span>
                <span className="text-4xl font-black text-brand-teal">{sorted[0].score}</span>
              </div>
            )}
            {sorted.length > 3 && (
              <div className="space-y-2 max-w-xs mx-auto">
                {sorted.slice(3).map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3 rounded-xl p-2 border bg-gray-50">
                    <span className="text-sm font-bold text-gray-500 w-6">{i + 4}.</span>
                    <span className="flex-1 font-bold text-brand-dark-blue text-right">{t.name}</span>
                    <span className="text-xl font-black text-brand-teal">{t.score}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => { setPhase('setup'); setTeams([]); setPlayers([]); setFloats([]); setTimeLeft(gameDuration); }} className="px-8 py-3 bg-brand-magenta text-white font-bold rounded-full hover:bg-pink-700">
              🔄 משחק חדש
            </button>
          </div>
        );
      })()}
    </div>
  );
};

// ─── PLAYER COMPONENT ──────────────────────────────────────────────────────────

export const SupermarketPlayerView: React.FC = () => {
  const hm        = window.location.hash.match(/#supermarket-player-(.+)/);
  const hostId    = hm ? hm[1] : null;
  const connRef   = useRef<DataConnection | null>(null);
  const peerRef2  = useRef<InstanceType<typeof Peer> | null>(null);
  const productsRef = useRef<Product[]>([]);

  const [status,     setStatus]     = useState<'connecting' | 'join' | 'waiting' | 'game' | 'done' | 'error' | 'perfect'>('connecting');
  const [teams,      setTeams]      = useState<string[]>([]);
  const [myName,     setMyName]     = useState('');
  const [myTeam,     setMyTeam]     = useState('');
  const [products,   setProducts]   = useState<Product[]>([]);
  const [productIdx, setProductIdx] = useState(-1);
  const [cycle,      setCycle]      = useState(0);
  const [feedback,   setFeedback]   = useState<{ id: string; correct: boolean } | null>(null);
  const [score,      setScore]      = useState(0);
  const [answered,   setAnswered]   = useState(false);

  const wrongIdxsRef  = useRef<Set<number>>(new Set());
  const productIdxRef = useRef(-1);

  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { productIdxRef.current = productIdx; }, [productIdx]);

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
        if (msg.type === 'PRODUCTS') {
          wrongIdxsRef.current = new Set();
          setProducts(msg.products);
          productsRef.current = msg.products;
          setProductIdx(0);
          setCycle(0);
          setAnswered(false);
          setFeedback(null);
          setStatus('game');
        }
        // Backward compatibility (older host)
        if (msg.type === 'PRODUCT')  { setProductIdx(msg.productIndex); setAnswered(false); setFeedback(null); setStatus('game'); }
        if (msg.type === 'RESULT')   {
          const wasCorrect = msg.correct;
          const curIdx = productIdxRef.current;
          if (!wasCorrect) wrongIdxsRef.current.add(curIdx);
          setFeedback({ id: msg.correctId, correct: wasCorrect });
          if (wasCorrect) setScore(s => s + 1);
          setTimeout(() => {
            setFeedback(null);
            setAnswered(false);
            const prods = productsRef.current;
            if (prods.length <= 0) return;
            const next = productIdxRef.current + 1;
            if (next >= prods.length) {
              // End of round
              const wrongs = wrongIdxsRef.current;
              if (wrongs.size === 0) {
                // All correct!
                setStatus('perfect');
              } else {
                // Restart with only wrong products
                const wrongProds = prods.filter((_, i) => wrongs.has(i));
                wrongIdxsRef.current = new Set();
                productsRef.current = wrongProds;
                setProducts(wrongProds);
                setCycle(c => c + 1);
                setProductIdx(0);
              }
            } else {
              setProductIdx(next);
            }
          }, 400);
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

  const handleLocalResult = useCallback((monopolyId: string, product: Product) => {
    const correct = product.monopolyId === monopolyId;
    const correctId = product.monopolyId;
    if (!correct) wrongIdxsRef.current.add(productIdxRef.current);
    setFeedback({ id: correctId, correct });
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);
      const prods = productsRef.current;
      if (prods.length <= 0) return;
      const next = productIdxRef.current + 1;
      if (next >= prods.length) {
        const wrongs = wrongIdxsRef.current;
        if (wrongs.size === 0) {
          setStatus('perfect');
        } else {
          const wrongProds = prods.filter((_, i) => wrongs.has(i));
          wrongIdxsRef.current = new Set();
          productsRef.current = wrongProds;
          setProducts(wrongProds);
          setCycle(c => c + 1);
          setProductIdx(0);
        }
      } else {
        setProductIdx(next);
      }
    }, 400);
  }, []);

  const answer = (monopolyId: string) => {
    if (answered) return;
    setAnswered(true);
    playTapSfx();
    if (cycle > 0) {
      // Retry rounds: validate locally — host's index mapping is no longer valid
      const prod = productsRef.current[productIdxRef.current];
      if (prod) handleLocalResult(monopolyId, prod);
    } else {
      send({ type: 'ANSWER', name: myName, team: myTeam, monopolyId, productIndex: productIdx, cycle });
    }
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
              <img
                className="spin-in"
                src={`${import.meta.env.BASE_URL}${encodeURI(currentProduct.imageFile)}`}
                alt={currentProduct.name}
                style={{ width: '100%', height: 170, objectFit: 'contain' }}
              />
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
            <div className="grid grid-cols-2 gap-2.5">
              {[...MONOPOLIES.map(m => ({ id: m.id as MonopolyAnswerId, name: m.name, bg: m.bg, border: m.border, color: m.color })),
                { id: 'other' as const, name: 'אחר', bg: '#f1f5f9', border: '#cbd5e1', color: '#334155' },
              ].map(opt => {
                const isCorrect = feedback?.id === opt.id;
                const isWrong   = feedback && !feedback.correct && answered && opt.id === feedback.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => answer(opt.id)}
                    disabled={answered}
                    className="rounded-2xl font-black transition-transform active:scale-95 disabled:cursor-default select-none"
                    style={{
                      background: isCorrect && feedback ? '#dcfce7' : opt.bg,
                      border: `2.5px solid ${isCorrect && feedback ? '#22c55e' : isWrong ? '#ef4444' : opt.border}`,
                      color: opt.color,
                      boxShadow: isCorrect && feedback ? '0 0 0 4px #22c55e44' : undefined,
                      transform: isCorrect && feedback ? 'scale(1.05)' : undefined,
                      fontSize: 15,
                      padding: '14px 8px',
                      lineHeight: 1.25,
                      minHeight: 60,
                    }}
                  >
                    {opt.name}
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

      {/* Perfect - all products answered correctly */}
      {status === 'perfect' && (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-5 bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-300">
            <p className="text-7xl">⭐</p>
            <p className="text-2xl font-black text-brand-dark-blue">כל הכבוד!</p>
            <p className="text-base font-bold text-green-700 leading-relaxed">שייכתם את כל המוצרים נכון<br/>אין ספק שאתם חכמים בסופר!</p>
            <p className="text-3xl font-black text-brand-teal">{score} נקודות 🚀</p>
            <p className="text-gray-400 text-sm">{myName} | {myTeam}</p>
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
