import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────
interface AsteroidDef { text: string; category: 'שכיר' | 'עצמאי'; difficulty: 1 | 2 | 3; }

const ASTEROID_DEFS: AsteroidDef[] = [
  // שכיר
  { text: 'מקבל תלוש שכר', category: 'שכיר', difficulty: 1 },
  { text: 'שעות עבודה קבועות', category: 'שכיר', difficulty: 1 },
  { text: 'ימי חופשה בתשלום', category: 'שכיר', difficulty: 1 },
  { text: 'ימי מחלה בתשלום', category: 'שכיר', difficulty: 1 },
  { text: 'שכר מינימום מובטח', category: 'שכיר', difficulty: 2 },
  { text: 'המעסיק מפריש פנסיה', category: 'שכיר', difficulty: 2 },
  { text: 'דמי פיטורים', category: 'שכיר', difficulty: 2 },
  { text: 'כפוף למנהל ישיר', category: 'שכיר', difficulty: 2 },
  { text: 'החזר נסיעות', category: 'שכיר', difficulty: 2 },
  { text: 'טופס 101 בכניסה', category: 'שכיר', difficulty: 3 },
  { text: 'דמי אבטלה בפיטורים', category: 'שכיר', difficulty: 3 },
  { text: 'חוזה העסקה עם מעסיק', category: 'שכיר', difficulty: 3 },
  // עצמאי
  { text: 'מוציא חשבונית מס', category: 'עצמאי', difficulty: 1 },
  { text: 'בוס של עצמו', category: 'עצמאי', difficulty: 1 },
  { text: 'הכנסה לא קבועה', category: 'עצמאי', difficulty: 1 },
  { text: 'גמישות בשעות', category: 'עצמאי', difficulty: 1 },
  { text: 'מדווח למע"מ בעצמו', category: 'עצמאי', difficulty: 2 },
  { text: 'ניהול ספרי חשבונות', category: 'עצמאי', difficulty: 2 },
  { text: 'אחראי על הביטוח הלאומי', category: 'עצמאי', difficulty: 2 },
  { text: 'דיווח מס הכנסה שנתי', category: 'עצמאי', difficulty: 2 },
  { text: 'הסכמי שירות עם לקוחות', category: 'עצמאי', difficulty: 2 },
  { text: 'אין דמי אבטלה', category: 'עצמאי', difficulty: 3 },
  { text: 'אין פיצויי פיטורים', category: 'עצמאי', difficulty: 3 },
  { text: 'עוסק מורשה / פטור', category: 'עצמאי', difficulty: 3 },
];

const BONUS_TABLE: Record<1|2|3, number[]> = {
  1: [10, 15, 20],
  2: [25, 30, 35],
  3: [40, 45, 50],
};

function bonusForDef(def: AsteroidDef, speed: number): number {
  const arr = BONUS_TABLE[def.difficulty];
  const idx = speed < 1.2 ? 0 : speed < 1.8 ? 1 : 2;
  return arr[idx];
}

// ─── Types ───────────────────────────────────────────────────────────────────
const W = 880, H = 520;
const CANNON_Y = H - 48;
const CANNON_L = 'שכיר';
const CANNON_R = 'עצמאי';

interface Cannon {
  x: number;
  angle: number; // radians, 0 = straight up
  label: string;
  color: string;
  score: number;
  teamName: string;
  flash: number; // >0: hit flash frames remaining
  missFlash: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  owner: 'שכיר' | 'עצמאי';
}

interface Asteroid {
  id: number;
  x: number;
  y: number;
  vy: number;
  r: number;
  rot: number;
  rotV: number;
  def: AsteroidDef;
  hit: boolean;
  hitFrames: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; size: number;
}

interface FloatText {
  x: number; y: number;
  text: string;
  life: number;
  color: string;
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────
function drawStars(ctx: CanvasRenderingContext2D, stars: {x:number;y:number;r:number;t:number}[], tick: number) {
  for (const s of stars) {
    const a = 0.4 + 0.6 * Math.abs(Math.sin(tick * 0.03 + s.t));
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }
}

function drawEarth(ctx: CanvasRenderingContext2D) {
  // ground strip
  const grad = ctx.createLinearGradient(0, H - 28, 0, H);
  grad.addColorStop(0, '#166534');
  grad.addColorStop(1, '#14532d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - 28, W, 28);
  // subtle city silhouette
  ctx.fillStyle = '#15803d';
  const buildings = [
    [60,14],[120,20],[200,12],[280,18],[370,22],[440,16],[530,20],[610,14],[700,18],[780,22],[840,12],
  ];
  for (const [bx, bh] of buildings) {
    ctx.fillRect(bx - 10, H - 28 - bh, 18, bh);
  }
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌍 כדור הארץ — הגנו עליו!', W / 2, H - 10);
}

function drawCannon(ctx: CanvasRenderingContext2D, c: Cannon, tick: number) {
  const r = c.color;
  ctx.save();
  ctx.translate(c.x, CANNON_Y);

  // Base platform
  const baseGrad = ctx.createLinearGradient(-36, -12, 36, 0);
  baseGrad.addColorStop(0, c.flash > 0 ? '#bbf7d0' : c.missFlash > 0 ? '#fecaca' : '#1e293b');
  baseGrad.addColorStop(1, c.flash > 0 ? '#4ade80' : c.missFlash > 0 ? '#f87171' : '#374151');
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.roundRect(-36, -16, 72, 28, 8);
  ctx.fill();
  ctx.strokeStyle = c.flash > 0 ? '#16a34a' : c.missFlash > 0 ? '#dc2626' : '#6b7280';
  ctx.lineWidth = 2; ctx.stroke();

  // Label
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(c.label, 0, 5);

  // Barrel
  ctx.save();
  ctx.rotate(c.angle);
  const barrelGrad = ctx.createLinearGradient(-6, -40, 6, 0);
  barrelGrad.addColorStop(0, '#94a3b8');
  barrelGrad.addColorStop(1, '#475569');
  ctx.fillStyle = barrelGrad;
  ctx.beginPath();
  ctx.roundRect(-6, -42, 12, 42, 3);
  ctx.fill();
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawAsteroid(ctx: CanvasRenderingContext2D, a: Asteroid) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(a.rot);

  // Color by category
  const isEmployee = a.def.category === 'שכיר';
  const baseColor = isEmployee ? '#60a5fa' : '#f472b6';
  const darkColor = isEmployee ? '#1d4ed8' : '#9d174d';
  const diff = a.def.difficulty;

  // Glow
  if (!a.hit) {
    const grd = ctx.createRadialGradient(0, 0, a.r * 0.3, 0, 0, a.r + 6);
    grd.addColorStop(0, `${baseColor}50`);
    grd.addColorStop(1, `${baseColor}00`);
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(0, 0, a.r + 6, 0, Math.PI * 2); ctx.fill();
  }

  // Jagged asteroid body
  ctx.beginPath();
  const pts = 9 + diff;
  for (let i = 0; i < pts; i++) {
    const angle = (Math.PI * 2 * i) / pts;
    const jitter = a.r * (0.75 + 0.25 * Math.sin(i * 3.7 + a.def.difficulty));
    const px = Math.cos(angle) * jitter;
    const py = Math.sin(angle) * jitter;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  const grad = ctx.createRadialGradient(-a.r * 0.3, -a.r * 0.3, 0, 0, 0, a.r);
  grad.addColorStop(0, a.hit ? '#fef08a' : baseColor);
  grad.addColorStop(1, a.hit ? '#eab308' : darkColor);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = a.hit ? '#fbbf24' : '#1e293b';
  ctx.lineWidth = 2; ctx.stroke();

  // Difficulty dots
  ctx.restore();
  ctx.save();
  ctx.translate(a.x, a.y);
  for (let i = 0; i < diff; i++) {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-a.r + 8 + i * 10, -a.r + 5, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Text (not rotated)
  const maxW = a.r * 1.6;
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${a.r > 45 ? 18 : 15}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Word wrap (simple)
  const words = a.def.text.split(' ');
  let lines: string[] = [];
  let current = '';
  for (const w of words) {
    const test = current ? current + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && current) {
      lines.push(current); current = w;
    } else current = test;
  }
  lines.push(current);
  const lineH = 15;
  const startY = -(lines.length - 1) * lineH / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 0, startY + i * lineH);
  }

  ctx.restore();
}

function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
  const color = b.owner === 'שכיר' ? '#3b82f6' : '#ec4899';
  const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 8);
  grd.addColorStop(0, '#fff');
  grd.addColorStop(0.3, color);
  grd.addColorStop(1, `${color}00`);
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.arc(b.x, b.y, 8, 0, Math.PI * 2); ctx.fill();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFloatTexts(ctx: CanvasRenderingContext2D, floats: FloatText[]) {
  for (const f of floats) {
    const alpha = Math.min(1, f.life / 20);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = f.color;
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.globalAlpha = 1;
}

function drawHUD(ctx: CanvasRenderingContext2D, left: Cannon, right: Cannon) {
  // Left team
  ctx.fillStyle = 'rgba(30,41,59,0.75)';
  ctx.beginPath(); ctx.roundRect(8, 8, 200, 52, 10); ctx.fill();
  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(`👨‍💼 ${left.teamName || 'שכיר'}`, 16, 14);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`₪ ${left.score}`, 16, 30);

  // Right team
  ctx.fillStyle = 'rgba(30,41,59,0.75)';
  ctx.beginPath(); ctx.roundRect(W - 208, 8, 200, 52, 10); ctx.fill();
  ctx.fillStyle = '#f9a8d4';
  ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText(`${right.teamName || 'עצמאי'} 👩‍💻`, W - 16, 14);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`₪ ${right.score}`, W - 16, 30);
}

function drawControls(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(15,23,42,0.6)';
  ctx.beginPath(); ctx.roundRect(W / 2 - 160, H - 72, 320, 50, 10); ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('👨‍💼שכיר: ←→ כיוון  |  Enter ירייה', W / 2 - 80, H - 52);
  ctx.fillText('👩‍💻עצמאי: A/D כיוון  |  Space ירייה', W / 2 + 80, H - 52);
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props { onGameComplete?: () => void; }

type Screen = 'setup' | 'playing' | 'gameover';

const AsteroidsGame: React.FC<Props> = ({ onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<Screen>('setup');
  const [teamL, setTeamL] = useState('');
  const [teamR, setTeamR] = useState('');
  const [scoreL, setScoreL] = useState(0);
  const [scoreR, setScoreR] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const rafRef = useRef<number>(0);

  const stateRef = useRef<{
    cannons: [Cannon, Cannon];
    bullets: Bullet[];
    asteroids: Asteroid[];
    particles: Particle[];
    floats: FloatText[];
    stars: {x:number;y:number;r:number;t:number}[];
    keys: Record<string, boolean>;
    tick: number;
    nextAsteroidIn: number;
    bulletId: number;
    asteroidId: number;
    timeLeft: number;
    running: boolean;
  } | null>(null);

  // Angle clamping: -90° to +90° from vertical (full 180° arc)
  const MAX_ANGLE = Math.PI / 2;

  const spawnParticles = (x: number, y: number, color: string, count = 14) => {
    if (!stateRef.current) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      stateRef.current.particles.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 30 + Math.random() * 20, maxLife: 50,
        color, size: 3 + Math.random() * 5,
      });
    }
  };

  const spawnAsteroid = () => {
    if (!stateRef.current) return;
    const def = ASTEROID_DEFS[Math.floor(Math.random() * ASTEROID_DEFS.length)];
    const r = 38 + def.difficulty * 8;
    const speed = 0.6 + Math.random() * 1.4 + (def.difficulty - 1) * 0.3;
    stateRef.current.asteroids.push({
      id: stateRef.current.asteroidId++,
      x: r + Math.random() * (W - r * 2),
      y: -r,
      vy: speed,
      r,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.03,
      def,
      hit: false,
      hitFrames: 0,
    });
  };

  const startGame = useCallback((nameL: string, nameR: string) => {
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * (H - 60),
      r: Math.random() * 1.5 + 0.3, t: Math.random() * Math.PI * 2,
    }));
    stateRef.current = {
      cannons: [
        { x: W * 0.75, angle: 0, label: CANNON_L, color: '#3b82f6', score: 0, teamName: nameL || 'שכיר', flash: 0, missFlash: 0 },
        { x: W * 0.25, angle: 0, label: CANNON_R, color: '#ec4899', score: 0, teamName: nameR || 'עצמאי', flash: 0, missFlash: 0 },
      ],
      bullets: [], asteroids: [], particles: [], floats: [],
      stars, keys: {}, tick: 0,
      nextAsteroidIn: 90, bulletId: 0, asteroidId: 0,
      timeLeft: 120, running: true,
    };
    setScoreL(0); setScoreR(0); setTimeLeft(120);
    setScreen('playing');
  }, []);

  useEffect(() => {
    if (screen !== 'playing') return;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (!stateRef.current) return;
      stateRef.current.keys[e.code] = down;
      // Prevent page scroll
      if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
      }

      // Fire bullets on keydown only
      if (!down) return;
      const s = stateRef.current;
      const BULLET_SPEED = 11;

      if (e.code === 'Enter') {
        // Left cannon (שכיר) shoots
        const c = s.cannons[0];
        const bvx = Math.sin(c.angle) * BULLET_SPEED;
        const bvy = -Math.cos(c.angle) * BULLET_SPEED;
        s.bullets.push({ id: s.bulletId++, x: c.x + Math.sin(c.angle) * 44, y: CANNON_Y - 44 + Math.cos(c.angle) * 44 - 44, vx: bvx, vy: bvy, owner: 'שכיר' });
      }
      if (e.code === 'Space') {
        // Right cannon (עצמאי) shoots
        const c = s.cannons[1];
        const bvx = Math.sin(c.angle) * BULLET_SPEED;
        const bvy = -Math.cos(c.angle) * BULLET_SPEED;
        s.bullets.push({ id: s.bulletId++, x: c.x + Math.sin(c.angle) * 44, y: CANNON_Y - 44, vx: bvx, vy: bvy, owner: 'עצמאי' });
      }
    };

    window.addEventListener('keydown', e => onKey(e, true));
    window.addEventListener('keyup', e => onKey(e, false));

    let lastTime = performance.now();
    let secondAccum = 0;

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      const s = stateRef.current;
      if (!s || !s.running) return;
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      s.tick++;

      // ── Input → cannon rotation ──
      const ANGLE_SPEED = 0.055;
      if (s.keys['ArrowLeft'])  s.cannons[0].angle = Math.max(-MAX_ANGLE, s.cannons[0].angle - ANGLE_SPEED);
      if (s.keys['ArrowRight']) s.cannons[0].angle = Math.min(MAX_ANGLE,  s.cannons[0].angle + ANGLE_SPEED);
      if (s.keys['KeyA'])       s.cannons[1].angle = Math.max(-MAX_ANGLE, s.cannons[1].angle - ANGLE_SPEED);
      if (s.keys['KeyD'])       s.cannons[1].angle = Math.min(MAX_ANGLE,  s.cannons[1].angle + ANGLE_SPEED);

      // ── Timer ──
      secondAccum += dt;
      if (secondAccum >= 1000) {
        secondAccum -= 1000;
        s.timeLeft--;
        setTimeLeft(s.timeLeft);
        if (s.timeLeft <= 0) {
          s.running = false;
          setScoreL(s.cannons[0].score);
          setScoreR(s.cannons[1].score);
          setScreen('gameover');
          return;
        }
      }

      // ── Spawn asteroids ──
      s.nextAsteroidIn--;
      if (s.nextAsteroidIn <= 0) {
        spawnAsteroid();
        const progress = 1 - s.timeLeft / 120;
        s.nextAsteroidIn = Math.max(40, 100 - progress * 50) + Math.random() * 20;
      }

      // ── Move bullets ──
      s.bullets = s.bullets.filter(b => b.y > -20 && b.x > -20 && b.x < W + 20);
      for (const b of s.bullets) { b.x += b.vx; b.y += b.vy; }

      // ── Bullet × Asteroid collision ──
      for (const b of s.bullets) {
        for (const a of s.asteroids) {
          if (a.hit) continue;
          const dx = b.x - a.x, dy = b.y - a.y;
          if (dx * dx + dy * dy < (a.r + 8) * (a.r + 8)) {
            a.hit = true;
            a.hitFrames = 20;
            // Remove bullet
            (b as any)._dead = true;
            const correct = b.owner === a.def.category;
            const cannonIdx = b.owner === 'שכיר' ? 0 : 1;
            if (correct) {
              const bonus = bonusForDef(a.def, a.vy);
              s.cannons[cannonIdx].score += bonus;
              s.cannons[cannonIdx].flash = 20;
              spawnParticles(a.x, a.y, b.owner === 'שכיר' ? '#60a5fa' : '#f472b6', 18);
              s.floats.push({ x: a.x, y: a.y - 20, text: `+₪${bonus}`, life: 50, color: '#4ade80' });
            } else {
              // Wrong cannon
              const wrongIdx = cannonIdx;
              s.cannons[wrongIdx].score -= 10;
              s.cannons[wrongIdx].missFlash = 20;
              spawnParticles(a.x, a.y, '#ef4444', 10);
              s.floats.push({ x: a.x, y: a.y - 20, text: '-₪10', life: 50, color: '#f87171' });
            }
            setScoreL(s.cannons[0].score);
            setScoreR(s.cannons[1].score);
            break;
          }
        }
      }
      s.bullets = s.bullets.filter(b => !(b as any)._dead);

      // ── Move / expire asteroids ──
      for (const a of s.asteroids) {
        if (!a.hit) { a.y += a.vy; a.rot += a.rotV; }
        else { a.hitFrames--; }
      }

      // Asteroids that hit the earth
      for (const a of s.asteroids) {
        if (!a.hit && a.y - a.r > H - 28) {
          a.hit = true; a.hitFrames = 0;
          // Both cannons lose — penalty on whichever category they were
          const penaltyIdx = a.def.category === 'שכיר' ? 0 : 1;
          s.cannons[penaltyIdx].score -= 10;
          s.cannons[penaltyIdx].missFlash = 25;
          spawnParticles(a.x, H - 28, '#ef4444', 20);
          s.floats.push({ x: a.x, y: H - 50, text: '💥 -₪10', life: 50, color: '#fbbf24' });
          setScoreL(s.cannons[0].score);
          setScoreR(s.cannons[1].score);
        }
      }
      s.asteroids = s.asteroids.filter(a => !a.hit || a.hitFrames > 0);

      // ── Particles & floats ──
      for (const p of s.particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life--; }
      s.particles = s.particles.filter(p => p.life > 0);
      for (const f of s.floats) { f.y -= 0.8; f.life--; }
      s.floats = s.floats.filter(f => f.life > 0);

      // Flash decay
      for (const c of s.cannons) {
        if (c.flash > 0) c.flash--;
        if (c.missFlash > 0) c.missFlash--;
      }

      // ── DRAW ──
      ctx.save();
      ctx.scale(2, 2);
      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#020617');
      bg.addColorStop(0.7, '#0f172a');
      bg.addColorStop(1, '#1e3a5f');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      drawStars(ctx, s.stars, s.tick);
      drawEarth(ctx);

      for (const a of s.asteroids) drawAsteroid(ctx, a);
      for (const b of s.bullets) drawBullet(ctx, b);
      for (const c of s.cannons) drawCannon(ctx, c, s.tick);
      drawParticles(ctx, s.particles);
      drawFloatTexts(ctx, s.floats);
      drawHUD(ctx, s.cannons[0], s.cannons[1]);
      ctx.restore();

      // Timer
      ctx.save();
      ctx.scale(2, 2);
      const timerColor = s.timeLeft > 30 ? '#a5f3fc' : s.timeLeft > 10 ? '#fbbf24' : '#f87171';
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.roundRect(W / 2 - 44, 10, 88, 48, 10); ctx.fill();
      ctx.fillStyle = timerColor;
      ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`⏱ ${s.timeLeft}`, W / 2, 16);

      drawControls(ctx);
      ctx.restore();
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', e => onKey(e, true));
      window.removeEventListener('keyup', e => onKey(e, false));
    };
  }, [screen]);

  // ── Screens ──────────────────────────────────────────────────────────────────
  if (screen === 'setup') {
    return (
      <div className="flex flex-col items-center gap-6 py-6" dir="rtl">
        <div className="text-center">
          <p className="text-5xl mb-2">🚀</p>
          <h2 className="text-3xl font-black text-brand-dark-blue">אסטרואידים: שכיר VS עצמאי</h2>
          <p className="text-gray-500 text-lg mt-1">שני צוותים מגינים על כדור הארץ — כל אחד מפיל אסטרואידים בקטגוריה שלו!</p>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 flex flex-col gap-3">
            <div className="text-center">
              <p className="text-3xl">👨‍💼</p>
              <p className="font-black text-blue-700 text-xl">משגר השכיר</p>
              <p className="text-blue-500 text-sm">← → כיוון | Enter ירייה</p>
            </div>
            <input
              type="text"
              value={teamL}
              onChange={e => setTeamL(e.target.value)}
              placeholder="שם הקבוצה..."
              className="border-2 border-blue-300 rounded-xl px-3 py-2 text-center font-bold focus:outline-none focus:border-blue-500"
              maxLength={14}
            />
          </div>

          <div className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-5 flex flex-col gap-3">
            <div className="text-center">
              <p className="text-3xl">👩‍💻</p>
              <p className="font-black text-pink-700 text-xl">משגר העצמאי</p>
              <p className="text-pink-500 text-sm">A / D כיוון | Space ירייה</p>
            </div>
            <input
              type="text"
              value={teamR}
              onChange={e => setTeamR(e.target.value)}
              placeholder="שם הקבוצה..."
              className="border-2 border-pink-300 rounded-xl px-3 py-2 text-center font-bold focus:outline-none focus:border-pink-500"
              maxLength={14}
            />
          </div>
        </div>

        {/* Rules */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 max-w-xl w-full text-sm text-gray-600 space-y-1">
          <p className="font-bold text-gray-800 mb-2">📋 חוקי המשחק:</p>
          <p>🔵 אסטרואיד <strong>כחול</strong> = מאפיין שכיר → משגר השכיר (Enter)</p>
          <p>🩷 אסטרואיד <strong>ורוד</strong> = מאפיין עצמאי → משגר העצמאי (Space)</p>
          <p>⭐ כוכבים = קושי — ככל שיש יותר כוכבים הבונוס גבוה יותר (₪10–₪50)</p>
          <p>💥 פגיעה שגויה או אסטרואיד שנוחת = <strong>-₪10</strong></p>
          <p>⏱ משחק נמשך 120 שניות</p>
        </div>

        <button
          onClick={() => startGame(teamL, teamR)}
          className="px-12 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white text-2xl font-black rounded-2xl shadow-lg hover:scale-105 transition"
        >
          🚀 צאו לחלל!
        </button>
      </div>
    );
  }

  if (screen === 'gameover') {
    const winner = scoreL > scoreR ? (teamL || 'שכיר') : scoreR > scoreL ? (teamR || 'עצמאי') : null;
    return (
      <div className="flex flex-col items-center gap-6 py-8" dir="rtl">
        <p className="text-6xl">🏆</p>
        <h2 className="text-4xl font-black text-brand-dark-blue">סיום המשחק!</h2>

        <div className="grid grid-cols-2 gap-6 w-full max-w-md">
          <div className={`rounded-2xl p-6 text-center border-4 ${scoreL >= scoreR ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}>
            <p className="text-3xl">👨‍💼</p>
            <p className="font-black text-blue-700 text-lg">{teamL || 'שכיר'}</p>
            <p className="text-4xl font-black text-blue-600">₪{scoreL}</p>
          </div>
          <div className={`rounded-2xl p-6 text-center border-4 ${scoreR >= scoreL ? 'border-pink-400 bg-pink-50' : 'border-gray-200 bg-white'}`}>
            <p className="text-3xl">👩‍💻</p>
            <p className="font-black text-pink-700 text-lg">{teamR || 'עצמאי'}</p>
            <p className="text-4xl font-black text-pink-600">₪{scoreR}</p>
          </div>
        </div>

        {winner
          ? <p className="text-2xl font-black text-amber-600">🎉 {winner} ניצחו!</p>
          : <p className="text-2xl font-black text-gray-600">🤝 תיקו!</p>
        }

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => startGame(teamL, teamR)}
            className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white text-xl font-black rounded-2xl transition"
          >🔄 שחק שוב</button>
          <button
            onClick={() => setScreen('setup')}
            className="px-8 py-3 bg-gray-500 hover:bg-gray-400 text-white text-xl font-black rounded-2xl transition"
          >← הגדרות</button>
          {onGameComplete && (
            <button
              onClick={onGameComplete}
              className="px-8 py-3 bg-brand-teal hover:bg-teal-500 text-white text-xl font-black rounded-2xl transition"
            >✅ המשך למודול</button>
          )}
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div className="flex flex-col items-center gap-2" dir="rtl">
      {/* Score bar above canvas */}
      <div className="flex items-center justify-between w-full max-w-[1760px] px-2">
        <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-300 rounded-xl px-4 py-2">
          <span className="text-xl">👨‍💼</span>
          <span className="font-black text-blue-700">{teamL || 'שכיר'}</span>
          <span className="text-2xl font-black text-amber-600 mr-2">₪{scoreL}</span>
        </div>
        <div className="text-center">
          <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : timeLeft <= 30 ? 'text-amber-500' : 'text-gray-700'}`}>
            ⏱ {timeLeft}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-pink-50 border-2 border-pink-300 rounded-xl px-4 py-2">
          <span className="text-2xl font-black text-amber-600 ml-2">₪{scoreR}</span>
          <span className="font-black text-pink-700">{teamR || 'עצמאי'}</span>
          <span className="text-xl">👩‍💻</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700">
        <canvas ref={canvasRef} width={W * 2} height={H * 2} className="block" style={{ maxWidth: '100%' }} />
      </div>

      <div className="flex gap-3 text-sm text-gray-500 flex-wrap justify-center">
        <span>🔵 אסטרואיד כחול = שכיר (Enter)</span>
        <span>🩷 אסטרואיד ורוד = עצמאי (Space)</span>
        <span>⭐ = קושי ובונוס</span>
      </div>
    </div>
  );
};

export default AsteroidsGame;
