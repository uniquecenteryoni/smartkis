import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Audio Engine ──────────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
let bgGainNode: GainNode | null = null;
let bgNodes: OscillatorNode[] = [];

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

// Upbeat winter melody (like parcel game) — two-voice round
const MELODY = [
  523, 587, 659, 698, 784, 698, 659, 587,
  523, 523, 587, 659, 523, 0, 523, 0,
  698, 784, 880, 784, 698, 659, 587, 523,
  587, 659, 698, 587, 523, 0, 523, 0,
];
const NOTE_DUR = 0.18;

function startBgMusic() {
  stopBgMusic();
  const ctx = getAudioCtx();
  bgGainNode = ctx.createGain();
  bgGainNode.gain.setValueAtTime(0.08, ctx.currentTime);
  bgGainNode.connect(ctx.destination);

  bgNodes = [];
  let t = ctx.currentTime;

  const scheduleVoice = (noteList: number[], offset: number, type: OscillatorType, vol: number) => {
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.connect(bgGainNode!);
    const loop = () => {
      noteList.forEach((freq, i) => {
        const start = t + offset + i * NOTE_DUR;
        if (freq === 0) return;
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        osc.connect(gain);
        osc.start(start);
        osc.stop(start + NOTE_DUR * 0.85);
        bgNodes.push(osc);
      });
    };
    // repeat
    const totalDur = noteList.length * NOTE_DUR;
    for (let rep = 0; rep < 30; rep++) {
      const repOffset = rep * totalDur;
      noteList.forEach((freq, i) => {
        const st = t + offset + repOffset + i * NOTE_DUR;
        if (freq === 0) return;
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, st);
        osc.connect(gain);
        osc.start(st);
        osc.stop(st + NOTE_DUR * 0.85);
        bgNodes.push(osc);
      });
    }
  };

  scheduleVoice(MELODY, 0, 'triangle', 0.6);
  scheduleVoice(MELODY.map(f => f ? f * 0.5 : 0), NOTE_DUR * 2, 'sine', 0.3);
}

function stopBgMusic() {
  bgNodes.forEach(n => { try { n.stop(); } catch {} });
  bgNodes = [];
  if (bgGainNode) { bgGainNode.disconnect(); bgGainNode = null; }
}

function playHitSnowman() {
  const ctx = getAudioCtx();
  [180, 140, 110].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
    g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.07);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.18);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.07);
    osc.stop(ctx.currentTime + i * 0.07 + 0.2);
  });
}

function playHitTree() {
  const ctx = getAudioCtx();
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
    g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.15);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.06);
    osc.stop(ctx.currentTime + i * 0.06 + 0.18);
  });
}

function playGameOver() {
  const ctx = getAudioCtx();
  [440, 370, 311, 261].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.22);
    g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.22);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.22 + 0.3);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.22);
    osc.stop(ctx.currentTime + i * 0.22 + 0.35);
  });
}

function playWin() {
  const ctx = getAudioCtx();
  [523, 659, 784, 1047, 784, 1047, 1319].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.13);
    g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.13);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.2);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.13);
    osc.stop(ctx.currentTime + i * 0.13 + 0.25);
  });
}

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Obstacle {
  id: number;
  x: number;
  y: number;       // screen y — starts above 0, moves down toward ball
  type: 'snowman' | 'tree';
  label: string;
  hit: boolean;
}

interface LeaderEntry { name: string; time: number; outcome: 'win' | 'lose'; }

// ─── Constants ─────────────────────────────────────────────────────────────────
const CW = 900;
const CH = 680;
const BALL_START_SIZE = 24;
const BALL_MAX_SIZE = 78;
const BALL_MIN_SIZE = 7;
const BALL_Y = CH * 0.8;      // ball near bottom — rolling DOWN the slope
const MAX_MOVE = CW - 70;
const MIN_MOVE = 70;

// Obstacle labels
const SNOWMAN_LABELS = ['קפה יומי','בילויים','ביגוד','גאדג\'ט','מסעדות','טיולים','קניות','מנויים','הימורים','אוכל בחוץ'];
const TREE_LABELS    = ['חיסכון','תקציב','השקעה','ביטוח','פנסיה','קרן חירום','תכנון','מחיר השוואה','קנייה חכמה','חיסכון חודשי'];

// ─── Drawing helpers ──────────────────────────────────────────────────────────
function drawSnowflake(ctx2d: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) {
  ctx2d.save();
  ctx2d.globalAlpha = alpha;
  ctx2d.strokeStyle = '#ffffff';
  ctx2d.lineWidth = 1;
  ctx2d.translate(x, y);
  for (let a = 0; a < 6; a++) {
    ctx2d.rotate(Math.PI / 3);
    ctx2d.beginPath();
    ctx2d.moveTo(0, 0);
    ctx2d.lineTo(0, size);
    ctx2d.stroke();
  }
  ctx2d.restore();
}

function drawTree(ctx2d: CanvasRenderingContext2D, x: number, y: number, label: string) {
  const sc = 1.0;
  ctx2d.save(); ctx2d.translate(x, y);
  // trunk
  ctx2d.fillStyle = '#7B4F1A'; ctx2d.fillRect(-6*sc, 0, 12*sc, 22*sc);
  // three triangle layers
  [[50,24,-18],[40,22,-36],[28,20,-52]].forEach(([w,h,yOff]) => {
    const yw = yOff * sc;
    ctx2d.fillStyle = '#2D7A3A';
    ctx2d.beginPath(); ctx2d.moveTo(-w/2*sc,yw); ctx2d.lineTo(w/2*sc,yw); ctx2d.lineTo(0,(yOff-h)*sc); ctx2d.closePath(); ctx2d.fill();
    ctx2d.fillStyle = 'rgba(255,255,255,0.65)';
    ctx2d.beginPath(); ctx2d.moveTo(-w/2*sc,yw); ctx2d.lineTo(w/2*sc,yw); ctx2d.lineTo(0,(yOff-h*0.3)*sc); ctx2d.closePath(); ctx2d.fill();
  });
  // label pill above tree
  ctx2d.font = 'bold 16px sans-serif'; ctx2d.textAlign = 'center';
  const lw = ctx2d.measureText(label).width + 14;
  ctx2d.fillStyle = 'rgba(25,130,55,0.93)'; ctx2d.beginPath(); ctx2d.roundRect(-lw/2,-82*sc-18,lw,20,5); ctx2d.fill();
  ctx2d.fillStyle = '#fff'; ctx2d.fillText(label, 0, -82*sc-3);
  // −₪ badge
  ctx2d.fillStyle = 'rgba(50,180,80,0.95)'; ctx2d.font = 'bold 14px sans-serif';
  ctx2d.fillText('−₪', 0, 15*sc);
  ctx2d.restore();
}

function drawSnowman(ctx2d: CanvasRenderingContext2D, x: number, y: number, label: string) {
  const sc = 1.0;
  ctx2d.save(); ctx2d.translate(x, y);
  // bottom
  ctx2d.fillStyle = '#e8f4f8'; ctx2d.beginPath(); ctx2d.arc(0,0,20*sc,0,Math.PI*2); ctx2d.fill();
  ctx2d.strokeStyle='#ccc'; ctx2d.lineWidth=1; ctx2d.stroke();
  // middle
  ctx2d.fillStyle = '#f0f8ff'; ctx2d.beginPath(); ctx2d.arc(0,-30*sc,14*sc,0,Math.PI*2); ctx2d.fill();
  // head
  ctx2d.fillStyle = '#fff'; ctx2d.beginPath(); ctx2d.arc(0,-54*sc,11*sc,0,Math.PI*2); ctx2d.fill();
  // eyes
  ctx2d.fillStyle = '#333';
  ctx2d.beginPath(); ctx2d.arc(-4*sc,-56*sc,1.8*sc,0,Math.PI*2); ctx2d.fill();
  ctx2d.beginPath(); ctx2d.arc(4*sc,-56*sc,1.8*sc,0,Math.PI*2); ctx2d.fill();
  // carrot
  ctx2d.fillStyle='#FF8C00'; ctx2d.beginPath(); ctx2d.moveTo(0,-54*sc); ctx2d.lineTo(9*sc,-53.5*sc); ctx2d.lineTo(0,-53*sc); ctx2d.closePath(); ctx2d.fill();
  // hat
  ctx2d.fillStyle='#1a1a1a'; ctx2d.fillRect(-8*sc,-68*sc,16*sc,5*sc); ctx2d.fillRect(-6*sc,-82*sc,12*sc,16*sc);
  // scarf
  ctx2d.fillStyle='#E53E3E'; ctx2d.fillRect(-14*sc,-42*sc,28*sc,5*sc);
  // label pill
  ctx2d.font = 'bold 16px sans-serif'; ctx2d.textAlign = 'center';
  const lw = ctx2d.measureText(label).width + 14;
  ctx2d.fillStyle = 'rgba(180,25,25,0.92)'; ctx2d.beginPath(); ctx2d.roundRect(-lw/2,-100*sc-18,lw,20,5); ctx2d.fill();
  ctx2d.fillStyle = '#fff'; ctx2d.fillText(label, 0, -100*sc-3);
  // +₪ badge
  ctx2d.fillStyle = 'rgba(210,40,40,0.95)'; ctx2d.font = 'bold 14px sans-serif';
  ctx2d.fillText('+₪', 0, 15*sc);
  ctx2d.restore();
}

function drawBall(ctx2d: CanvasRenderingContext2D, x: number, y: number, r: number, angle: number) {
  ctx2d.save();
  // shadow beneath ball
  ctx2d.fillStyle = 'rgba(0,0,0,0.18)';
  ctx2d.beginPath(); ctx2d.ellipse(x, y+r+5, r*0.88, r*0.24, 0, 0, Math.PI*2); ctx2d.fill();
  // glow ring
  const grd = ctx2d.createRadialGradient(x,y,r*0.2,x,y,r+8);
  grd.addColorStop(0,'rgba(200,240,255,0.18)'); grd.addColorStop(1,'rgba(200,240,255,0)');
  ctx2d.beginPath(); ctx2d.arc(x,y,r+8,0,Math.PI*2); ctx2d.fillStyle=grd; ctx2d.fill();
  // main ball
  const g2 = ctx2d.createRadialGradient(x-r*0.35,y-r*0.35,r*0.08,x,y,r);
  g2.addColorStop(0,'#ffffff'); g2.addColorStop(0.55,'#ceecff'); g2.addColorStop(1,'#8ec8e8');
  ctx2d.beginPath(); ctx2d.arc(x,y,r,0,Math.PI*2);
  ctx2d.fillStyle=g2; ctx2d.fill();
  ctx2d.strokeStyle='rgba(160,210,240,0.6)'; ctx2d.lineWidth=1.5; ctx2d.stroke();
  // rolling stripes inside clipped circle — rotated with angle
  ctx2d.save();
  ctx2d.beginPath(); ctx2d.arc(x,y,r,0,Math.PI*2); ctx2d.clip();
  ctx2d.translate(x,y); ctx2d.rotate(angle);
  ctx2d.strokeStyle='rgba(120,190,225,0.55)'; ctx2d.lineWidth=2;
  for (let s = -r*2; s < r*2; s += r*0.6) {
    ctx2d.beginPath(); ctx2d.moveTo(-r,s); ctx2d.quadraticCurveTo(0, s+r*0.2, r, s); ctx2d.stroke();
  }
  ctx2d.strokeStyle='rgba(120,190,225,0.3)'; ctx2d.lineWidth=1.5;
  ctx2d.beginPath(); ctx2d.moveTo(0,-r); ctx2d.lineTo(0,r); ctx2d.stroke();
  ctx2d.restore();
  // specular highlight
  ctx2d.fillStyle='rgba(255,255,255,0.55)';
  ctx2d.beginPath(); ctx2d.ellipse(x-r*0.3,y-r*0.3,r*0.22,r*0.13,-Math.PI/4,0,Math.PI*2); ctx2d.fill();
  ctx2d.restore();
}

function drawMountainBg(ctx2d: CanvasRenderingContext2D, tick: number) {
  // Sky
  const sky = ctx2d.createLinearGradient(0, 0, 0, CH);
  sky.addColorStop(0, '#7bbdd8'); sky.addColorStop(0.5, '#c5e8f5'); sky.addColorStop(1, '#dff3fb');
  ctx2d.fillStyle = sky; ctx2d.fillRect(0, 0, CW, CH);

  // Distant snowy mountains (static, far away)
  const mBase = CH * 0.42;
  const mtn = (pts: [number,number][], col: string) => {
    ctx2d.fillStyle = col; ctx2d.beginPath();
    ctx2d.moveTo(pts[0][0], pts[0][1]);
    pts.forEach(([x,y]) => ctx2d.lineTo(x,y)); ctx2d.closePath(); ctx2d.fill();
  };
  mtn([[-10,mBase+10],[130,mBase-170],[290,mBase+10]],'rgba(155,195,218,0.55)');
  mtn([[200,mBase+10],[390,mBase-200],[580,mBase+10]],'rgba(148,190,215,0.55)');
  mtn([[460,mBase+10],[660,mBase-175],[870,mBase+10]],'rgba(152,195,220,0.52)');
  mtn([[720,mBase+10],[900,mBase-155],[1020,mBase+10]],'rgba(155,198,222,0.5)');
  // Snow caps
  ctx2d.fillStyle = 'rgba(255,255,255,0.72)';
  [[130,mBase-170,45],[390,mBase-200,52],[660,mBase-175,44],[900,mBase-155,38]].forEach(([px,py,hw]) => {
    ctx2d.beginPath(); ctx2d.moveTo(px-hw,py+35); ctx2d.lineTo(px,py); ctx2d.lineTo(px+hw,py+35); ctx2d.closePath(); ctx2d.fill();
  });

  // === DOWNHILL SLOPE with vanishing-point perspective ===
  // Horizon line is at top-center; slope widens as it comes toward viewer (bottom)
  const vanishX = CW / 2;
  const horizon  = CH * 0.36;
  const leftEdgeBottom  = 55;
  const rightEdgeBottom = CW - 55;

  // Slope fill
  ctx2d.fillStyle = 'rgba(230,245,255,0.28)';
  ctx2d.beginPath();
  ctx2d.moveTo(vanishX - 18, horizon);
  ctx2d.lineTo(leftEdgeBottom, CH);
  ctx2d.lineTo(rightEdgeBottom, CH);
  ctx2d.lineTo(vanishX + 18, horizon);
  ctx2d.closePath(); ctx2d.fill();

  // Slope edges (clearly show the downhill boundaries)
  ctx2d.strokeStyle = 'rgba(160,210,238,0.5)'; ctx2d.lineWidth = 2;
  ctx2d.beginPath(); ctx2d.moveTo(vanishX-18, horizon); ctx2d.lineTo(leftEdgeBottom, CH); ctx2d.stroke();
  ctx2d.beginPath(); ctx2d.moveTo(vanishX+18, horizon); ctx2d.lineTo(rightEdgeBottom, CH); ctx2d.stroke();

  // Depth lines — horizontal dashes that rush toward viewer to show speed
  ctx2d.strokeStyle = 'rgba(150,205,235,0.28)'; ctx2d.lineWidth = 1; ctx2d.setLineDash([14,12]);
  for (let i = 1; i <= 9; i++) {
    const t = ((i/9) + (tick * 0.0022)) % 1;
    const y = horizon + t * (CH - horizon);
    const spread = (y - horizon) / (CH - horizon);
    const lx = vanishX - 18 - spread * (vanishX - 18 - leftEdgeBottom);
    const rx = vanishX + 18 + spread * (rightEdgeBottom - vanishX - 18);
    ctx2d.beginPath(); ctx2d.moveTo(lx, y); ctx2d.lineTo(rx, y); ctx2d.stroke();
  }
  ctx2d.setLineDash([]);

  // Track marks (tire/ski) lines running along center of slope
  ctx2d.strokeStyle = 'rgba(140,200,230,0.35)'; ctx2d.lineWidth = 1.5; ctx2d.setLineDash([10,14]);
  const trackOff = (tick * 1.6) % 24;
  for (let ty = -24; ty < CH; ty += 24) {
    const t = (ty + trackOff) / CH;
    const lx2 = vanishX - 8 - t * (vanishX - 8 - leftEdgeBottom * 0.45);
    const rx2 = vanishX + 8 + t * (rightEdgeBottom * 0.45 - vanishX - 8);
    const y2 = horizon + (ty + trackOff);
    if (y2 < horizon || y2 > CH) continue;
    ctx2d.beginPath(); ctx2d.moveTo(lx2-6, y2); ctx2d.lineTo(lx2, y2+8); ctx2d.stroke();
    ctx2d.beginPath(); ctx2d.moveTo(rx2+6, y2); ctx2d.lineTo(rx2, y2+8); ctx2d.stroke();
  }
  ctx2d.setLineDash([]);

  // Snow ground at very bottom
  ctx2d.fillStyle = '#dff4fd';
  ctx2d.beginPath(); ctx2d.moveTo(0, CH);
  for (let i = 0; i <= 14; i++) {
    const wx = (i/14) * CW;
    const wy = CH - 14 + Math.sin(i*1.3 + tick*0.005)*5;
    ctx2d.lineTo(wx, wy);
  }
  ctx2d.lineTo(CW, CH); ctx2d.closePath(); ctx2d.fill();
  // Side snow mounds
  ctx2d.fillStyle = 'rgba(255,255,255,0.55)';
  ctx2d.beginPath(); ctx2d.ellipse(28, CH-6, 110, 42, 0, 0, Math.PI*2); ctx2d.fill();
  ctx2d.beginPath(); ctx2d.ellipse(CW-28, CH-6, 110, 42, 0, 0, Math.PI*2); ctx2d.fill();
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface Props { onBack: () => void; }

const SnowballGame: React.FC<Props> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    ballX: CW / 2,
    ballSize: BALL_START_SIZE,
    ballAngle: 0,
    speed: 2.4,
    obstacles: [] as Obstacle[],
    frame: 0,
    nextId: 0,
    keys: { left: false, right: false },
    phase: 'idle' as 'idle' | 'running' | 'over' | 'won',
    elapsed: 0,
    lastTime: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    snowflakes: [] as { x: number; y: number; size: number; speed: number; alpha: number }[],
  });
  const rafRef = useRef<number>(0);

  const [phase, setPhase] = useState<'idle' | 'running' | 'over' | 'won'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [ballSize, setBallSize] = useState(BALL_START_SIZE);
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [musicOn, setMusicOn] = useState(true);

  // init snowflakes
  useEffect(() => {
    const s = stateRef.current;
    s.snowflakes = Array.from({ length: 40 }, () => ({
      x: Math.random() * CW,
      y: Math.random() * CH,
      size: 2.5 + Math.random() * 5,
      speed: 0.4 + Math.random() * 1.0,
      alpha: 0.25 + Math.random() * 0.55,
    }));
  }, []);

  const spawnObstacle = () => {
    const s = stateRef.current;
    const type: 'snowman' | 'tree' = Math.random() < 0.55 ? 'snowman' : 'tree';
    const labelArr = type === 'snowman' ? SNOWMAN_LABELS : TREE_LABELS;
    s.obstacles.push({
      id: s.nextId++,
      x: MIN_MOVE + 20 + Math.random() * (CW - (MIN_MOVE + 20) * 2),
      y: -140,   // spawn above screen top — will scroll DOWN toward ball at bottom
      type,
      label: labelArr[Math.floor(Math.random() * labelArr.length)],
      hit: false,
    });
  };

  const addParticles = (x: number, y: number, color: string, count = 10) => {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
      });
    }
  };

  const gameLoop = useCallback((timestamp: number) => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d')!;

    const dt = s.lastTime ? Math.min(timestamp - s.lastTime, 50) : 16;
    s.lastTime = timestamp;

    if (s.phase === 'running') {
      s.elapsed += dt;
      s.frame++;
      s.speed = 2.4 + s.elapsed / 9000;

      // ─ Move ball laterally; track rotation angle
      const mv = 5.2;
      if (s.keys.left)  { s.ballX = Math.max(MIN_MOVE, s.ballX - mv); s.ballAngle -= mv / s.ballSize; }
      if (s.keys.right) { s.ballX = Math.min(MAX_MOVE, s.ballX + mv); s.ballAngle += mv / s.ballSize; }
      // Auto-spin from rolling downhill
      s.ballAngle += s.speed * 0.035;

      // ─ Obstacles scroll DOWN toward the ball (ball is at bottom)
      s.obstacles.forEach(ob => { ob.y += s.speed; });
      // Remove if passed below screen
      s.obstacles = s.obstacles.filter(ob => ob.y < CH + 160 && !ob.hit);

      // ─ Spawn
      const spawnInt = Math.max(26, 72 - Math.floor(s.elapsed / 2800));
      if (s.frame % spawnInt === 0) spawnObstacle();

      // ─ Collision: ball at bottom (BALL_Y), obstacles approaching from top
      const ballScreenY = BALL_Y;
      s.obstacles = s.obstacles.filter(ob => {
        if (ob.y < -160) return true; // not yet on screen
        const collR = ob.type === 'snowman' ? 22 : 24;
        const dx = s.ballX - ob.x;
        const dy = ballScreenY - ob.y;
        if (Math.sqrt(dx*dx + dy*dy) < s.ballSize + collR) {
          ob.hit = true;
          if (ob.type === 'snowman') {
            s.ballSize = Math.min(BALL_MAX_SIZE + 4, s.ballSize + 9);
            addParticles(s.ballX, ballScreenY, '#ff5555', 16);
            playHitSnowman();
          } else {
            s.ballSize = Math.max(0, s.ballSize - 7);
            addParticles(s.ballX, ballScreenY, '#44dd66', 12);
            playHitTree();
          }
          return false;
        }
        return true;
      });

      if (s.ballSize >= BALL_MAX_SIZE) { s.phase='over'; setPhase('over'); stopBgMusic(); playGameOver(); }
      else if (s.ballSize <= BALL_MIN_SIZE) { s.phase='won'; setPhase('won'); stopBgMusic(); playWin(); }

      setElapsed(s.elapsed);
      setBallSize(Math.round(s.ballSize));

      s.particles = s.particles
        .map(p => ({ ...p, x:p.x+p.vx, y:p.y+p.vy, vy:p.vy+0.1, life:p.life-0.035 }))
        .filter(p => p.life > 0);

      s.snowflakes.forEach(sf => {
        sf.y += sf.speed + s.speed * 0.12;
        sf.x += Math.sin(s.frame * 0.022 + sf.size) * 0.4;
        if (sf.y > CH + 10) { sf.y = -10; sf.x = Math.random() * CW; }
      });
    }

    // ─── DRAW ───────────────────────────────────────────────────────
    ctx2d.clearRect(0, 0, CW, CH);
    drawMountainBg(ctx2d, s.frame);

    // snowflakes
    s.snowflakes.forEach(sf => drawSnowflake(ctx2d, sf.x, sf.y, sf.size, sf.alpha));

    // obstacles — with perspective: smaller near horizon (top), normal size near viewer (bottom)
    s.obstacles.forEach(ob => {
      if (ob.y < -160 || ob.y > CH + 100) return;
      // perspective: at y=0 (horizon) scale=0.45; at y=CH scale=1.0
      const persp = 0.45 + 0.55 * Math.max(0, Math.min(1, ob.y / CH));
      ctx2d.save();
      ctx2d.translate(ob.x, ob.y);
      ctx2d.scale(persp, persp);
      if (ob.type === 'snowman') drawSnowman(ctx2d, 0, 0, ob.label);
      else drawTree(ctx2d, 0, 0, ob.label);
      ctx2d.restore();
    });

    // particles
    s.particles.forEach(p => {
      ctx2d.globalAlpha = Math.max(0, p.life);
      ctx2d.fillStyle = p.color;
      ctx2d.beginPath(); ctx2d.arc(p.x, p.y, 5, 0, Math.PI*2); ctx2d.fill();
    });
    ctx2d.globalAlpha = 1;

    // ball — drawn last, on top
    drawBall(ctx2d, s.ballX, BALL_Y, s.ballSize, s.ballAngle);

    // HUD
    if (s.phase === 'running') {
      const bw=200, bh=16, bx=CW/2-bw/2, by=14;
      ctx2d.fillStyle='rgba(255,255,255,0.6)'; ctx2d.beginPath(); ctx2d.roundRect(bx-2,by-2,bw+4,bh+4,7); ctx2d.fill();
      const pct=Math.min(1,s.ballSize/BALL_MAX_SIZE);
      ctx2d.fillStyle=pct>0.7?'#ff3333':pct>0.4?'#ff9900':'#33cc77';
      ctx2d.beginPath(); ctx2d.roundRect(bx,by,bw*pct,bh,4); ctx2d.fill();
      ctx2d.fillStyle='#223355'; ctx2d.font='bold 11px sans-serif'; ctx2d.textAlign='center';
      ctx2d.fillText('גודל כדור השלג', CW/2, by-4);

      const sec=Math.floor(s.elapsed/1000);
      const ts2=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
      ctx2d.fillStyle='rgba(255,255,255,0.88)'; ctx2d.beginPath(); ctx2d.roundRect(CW-102,10,92,32,9); ctx2d.fill();
      ctx2d.fillStyle='#223355'; ctx2d.font='bold 18px monospace'; ctx2d.textAlign='center'; ctx2d.fillText(ts2, CW-56,32);

      ctx2d.fillStyle='rgba(255,255,255,0.88)'; ctx2d.beginPath(); ctx2d.roundRect(10,10,96,32,9); ctx2d.fill();
      ctx2d.fillStyle='#223355'; ctx2d.font='bold 13px sans-serif'; ctx2d.textAlign='center';
      ctx2d.fillText(`${Math.floor(s.elapsed/100)} מ'`, 58, 32);

      // Downhill arrow indicator
      ctx2d.fillStyle='rgba(255,255,255,0.7)'; ctx2d.beginPath(); ctx2d.roundRect(CW/2-65,CH-40,130,28,8); ctx2d.fill();
      ctx2d.fillStyle='#223'; ctx2d.font='bold 16px sans-serif'; ctx2d.textAlign='center';
      ctx2d.fillText('הכדור מתגלגל במורד ההר — התחמקו מהאלמנטים!', CW/2, CH-21);
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const startGame = () => {
    const s = stateRef.current;
    s.ballX = CW / 2;
    s.ballSize = BALL_START_SIZE;
    s.ballAngle = 0;
    s.speed = 2.4;
    s.obstacles = [];
    s.frame = 0;
    s.phase = 'running';
    s.elapsed = 0;
    s.lastTime = 0;
    s.particles = [];
    setPhase('running');
    setElapsed(0);
    setBallSize(BALL_START_SIZE);
    setSaved(false);
    setNameInput('');
    if (musicOn) startBgMusic();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  const saveScore = () => {
    const name = nameInput.trim() || 'שחקן אנונימי';
    const s = stateRef.current;
    const entry: LeaderEntry = {
      name,
      time: s.elapsed,
      outcome: s.phase as 'win' | 'lose',
    };
    setLeaderboard(prev => {
      const next = [...prev, entry].sort((a, b) => {
        // wins first, then by time ascending
        if (a.outcome !== b.outcome) return a.outcome === 'win' ? -1 : 1;
        return a.time - b.time;
      }).slice(0, 10);
      return next;
    });
    setSaved(true);
  };

  // keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { stateRef.current.keys.left = true; e.preventDefault(); }
      if (e.key === 'ArrowRight') { stateRef.current.keys.right = true; e.preventDefault(); }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.keys.left = false;
      if (e.key === 'ArrowRight') stateRef.current.keys.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // touch controls
  const touchLeft = (active: boolean) => { stateRef.current.keys.left = active; };
  const touchRight = (active: boolean) => { stateRef.current.keys.right = active; };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      stopBgMusic();
    };
  }, []);

  // draw idle screen once
  useEffect(() => {
    if (phase === 'idle') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx2d = canvas.getContext('2d')!;
      drawMountainBg(ctx2d, 0);
      stateRef.current.snowflakes.forEach(sf => drawSnowflake(ctx2d, sf.x, sf.y, sf.size, sf.alpha));
      // preview obstacles with perspective
      ctx2d.save(); ctx2d.translate(210, 260); ctx2d.scale(0.6, 0.6); drawSnowman(ctx2d, 0, 0, 'קפה יומי'); ctx2d.restore();
      ctx2d.save(); ctx2d.translate(680, 230); ctx2d.scale(0.55, 0.55); drawTree(ctx2d, 0, 0, 'חיסכון'); ctx2d.restore();
      ctx2d.save(); ctx2d.translate(440, 370); ctx2d.scale(0.8, 0.8); drawSnowman(ctx2d, 0, 0, 'מסעדות'); ctx2d.restore();
      ctx2d.save(); ctx2d.translate(320, 310); ctx2d.scale(0.7, 0.7); drawTree(ctx2d, 0, 0, 'חיסכון חודשי'); ctx2d.restore();
      drawBall(ctx2d, CW / 2, BALL_Y, BALL_START_SIZE, 0);
    }
  }, [phase]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  const sizePercent = Math.round((ballSize / BALL_MAX_SIZE) * 100);

  return (
    <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-5" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">פעילות — הסכנה שבמינוס</p>
          <h3 className="text-2xl font-bold text-brand-dark-blue">⛄ משחק השלג</h3>
          <p className="text-brand-dark-blue/60 text-sm mt-0.5">הימנע מאנשי השלג (הוצאות מיותרות) והתנגש בעצים (החלטות נכונות)!</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => {
              setMusicOn(prev => {
                const next = !prev;
                if (!next) stopBgMusic();
                else if (phase === 'running') startBgMusic();
                return next;
              });
            }}
            className="px-3 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition text-sm"
          >
            {musicOn ? '🔊 מוזיקה' : '🔇 מושתק'}
          </button>
          <button
            onClick={() => { cancelAnimationFrame(rafRef.current); stopBgMusic(); onBack(); }}
            className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300 transition"
          >
            חזרה לחלון המשחקים
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap text-sm justify-center">
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
          <span>⛄</span><span className="text-red-700 font-bold">איש שלג = הוצאה מיותרת → כדור גדל</span>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
          <span>🌲</span><span className="text-green-700 font-bold">עץ = החלטה נכונה → כדור קטן</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            style={{ borderRadius: '1.5rem', border: '2px solid rgba(180,210,240,0.6)', maxWidth: '100%', display: 'block' }}
          />

          {/* Overlays */}
          {phase === 'idle' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '1.5rem', background: 'rgba(10,30,80,0.55)' }}>
              <p style={{ color: '#fff', fontSize: 32, fontWeight: 900, textShadow: '0 2px 8px rgba(0,0,0,0.6)', marginBottom: 8 }}>⛄ משחק השלג</p>
              <p style={{ color: '#c8e6ff', fontSize: 14, marginBottom: 24, textAlign: 'center', padding: '0 20px' }}>השתמשו במקשי חיצים / כפתורים למטה כדי להזיז את כדור השלג</p>
              <button onClick={startGame} style={{ background: 'linear-gradient(135deg,#4facfe,#00f2fe)', color: '#fff', fontWeight: 900, fontSize: 20, padding: '14px 40px', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                🎮 התחל משחק
              </button>
            </div>
          )}

          {(phase === 'over' || phase === 'won') && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '1.5rem', background: phase === 'over' ? 'rgba(80,0,0,0.7)' : 'rgba(0,60,30,0.7)' }}>
              <p style={{ fontSize: 56, marginBottom: 4 }}>{phase === 'won' ? '🏆' : '💀'}</p>
              <p style={{ color: '#fff', fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{phase === 'won' ? 'ניצחת! יצאת מהמינוס!' : 'נפסלת! הכדור התפוצץ!'}</p>
              <p style={{ color: '#eee', fontSize: 15, marginBottom: 20 }}>זמן: {formatTime(elapsed)} | גודל סופי: {ballSize}</p>
              {!saved ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder="שם לטבלת מובילים"
                    style={{ padding: '8px 14px', borderRadius: 999, border: 'none', fontSize: 15, minWidth: 160, textAlign: 'right' }}
                  />
                  <button onClick={saveScore} style={{ background: '#fff', color: '#333', fontWeight: 700, padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer' }}>שמור</button>
                </div>
              ) : (
                <p style={{ color: '#9f9', fontSize: 14, marginBottom: 8 }}>✅ נשמר!</p>
              )}
              <button onClick={startGame} style={{ marginTop: 12, background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 800, fontSize: 16, padding: '10px 28px', borderRadius: 999, border: '2px solid rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                🔄 שחק שוב
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Touch controls */}
      <div className="flex justify-center gap-6">
        <button
          onPointerDown={() => touchLeft(true)}
          onPointerUp={() => touchLeft(false)}
          onPointerLeave={() => touchLeft(false)}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-4xl font-bold shadow-lg active:scale-95 transition select-none"
          style={{ touchAction: 'none' }}
        >←</button>
        <button
          onPointerDown={() => touchRight(true)}
          onPointerUp={() => touchRight(false)}
          onPointerLeave={() => touchRight(false)}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-4xl font-bold shadow-lg active:scale-95 transition select-none"
          style={{ touchAction: 'none' }}
        >→</button>
      </div>

      {/* Live stats bar */}
      {phase === 'running' && (
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-blue-500 font-bold">גודל כדור</p>
            <p className="text-xl font-black text-blue-700">{ballSize} / {BALL_MAX_SIZE}</p>
          </div>
          <div className={`border rounded-2xl px-4 py-2 text-center ${sizePercent > 70 ? 'bg-red-50 border-red-200' : sizePercent > 40 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
            <p className="text-xs font-bold" style={{ color: sizePercent > 70 ? '#cc2222' : sizePercent > 40 ? '#cc7700' : '#227722' }}>סטטוס</p>
            <p className="text-base font-black" style={{ color: sizePercent > 70 ? '#cc2222' : sizePercent > 40 ? '#cc7700' : '#227722' }}>
              {sizePercent > 70 ? '⚠️ סכנה!' : sizePercent > 40 ? '😰 היזהר' : '✅ טוב!'}
            </p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-indigo-500 font-bold">זמן</p>
            <p className="text-xl font-black text-indigo-700 font-mono">{formatTime(elapsed)}</p>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4">
          <h4 className="text-lg font-black text-indigo-800 text-center mb-3">🏅 טבלת מובילים</h4>
          <div className="space-y-2">
            {leaderboard.map((e, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl px-3 py-2 ${i === 0 ? 'bg-yellow-100 border border-yellow-300' : 'bg-white/80 border border-indigo-100'}`}>
                <span className="font-bold text-indigo-700">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {e.name}</span>
                <span className="flex gap-3 text-sm">
                  <span className={`font-bold ${e.outcome === 'win' ? 'text-green-600' : 'text-red-500'}`}>{e.outcome === 'win' ? '🏆 ניצחון' : '💀 הפסד'}</span>
                  <span className="text-gray-500 font-mono">{formatTime(e.time)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnowballGame;
