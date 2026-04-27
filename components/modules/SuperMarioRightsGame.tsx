import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Web Audio Sound Effects ─────────────────────────────────────────────────
function playSound(type: 'jump' | 'coin' | 'stomp' | 'die' | 'win') {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ac = new AC();
    const gain = ac.createGain();
    gain.connect(ac.destination);
    const osc = ac.createOscillator();
    osc.connect(gain);
    if (type === 'jump') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(260, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(520, ac.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      osc.start(); osc.stop(ac.currentTime + 0.18);
    } else if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ac.currentTime);
      osc.frequency.setValueAtTime(1320, ac.currentTime + 0.07);
      gain.gain.setValueAtTime(0.2, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.28);
      osc.start(); osc.stop(ac.currentTime + 0.28);
    } else if (type === 'stomp') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.18);
      gain.gain.setValueAtTime(0.22, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22);
      osc.start(); osc.stop(ac.currentTime + 0.22);
    } else if (type === 'die') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ac.currentTime + 0.55);
      gain.gain.setValueAtTime(0.18, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6);
      osc.start(); osc.stop(ac.currentTime + 0.6);
    } else if (type === 'win') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ac.currentTime);
      osc.frequency.setValueAtTime(659, ac.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ac.currentTime + 0.2);
      osc.frequency.setValueAtTime(1047, ac.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.55);
      osc.start(); osc.stop(ac.currentTime + 0.55);
    }
    setTimeout(() => { try { ac.close(); } catch {} }, 800);
  } catch {}
}

// ─── Workers' Rights Facts ────────────────────────────────────────────────────
const RIGHTS_FACTS: { title: string; body: string; color: string }[] = [
  { title: '💰 שכר מינימום לנוער', body: 'שכר מינימום לנוער מתעדכן מעת לעת. חשוב לבדוק בתלוש שהשכר השעתי עומד בדרישות החוק העדכניות.', color: '#10b981' },
  { title: '⏰ מגבלת שעות יומית', body: 'קטין לא יעבוד יותר מ-8 שעות ביום ויותר מ-40 שעות בשבוע. גופך חשוב לא פחות!', color: '#3b82f6' },
  { title: '📚 יום לימודים', body: 'ביום לימודים אסור לעבוד יותר מ-4 שעות. לימודים = עתיד!', color: '#8b5cf6' },
  { title: '☕ הפסקות חובה', body: 'ב-6 שעות עבודה רצופות — מגיעה לך הפסקה של 45 דקות. זכות, לא חסד!', color: '#f59e0b' },
  { title: '🚌 החזר נסיעות', body: 'עובד זכאי להחזר הוצאות נסיעה לעבודה וממנה בהתאם לכללים הקבועים בדין ובצו ההרחבה.', color: '#ef4444' },
  { title: '➕ שעות נוספות', body: 'בתלוש: שעות 9–10 ביום מזכות ב-125%, ושעות 11–12 מזכות ב-150%. חשוב לוודא שזה מופיע נכון.', color: '#06b6d4' },
  { title: '🏥 ימי מחלה', body: 'כל עובד צובר יום וחצי ימי מחלה לכל חודש עבודה. אל תוותר!', color: '#ec4899' },
  { title: '🌴 ימי חופשה', body: 'בשנה הראשונה: 12 ימי עבודה בתשלום. הם שייכים לך — תנצל אותם!', color: '#84cc16' },
  { title: '🛡️ זכות לשימוע', body: 'לפני פיטורים חייבים לזמן אותך לשימוע. לא שמעת עליו? ניתן לערער!', color: '#f97316' },
  { title: '💼 פנסיה מגיל 21', body: 'בדרך כלל, חובת ההפרשה לפנסיה לשכיר מתחילה מגיל 21 (ולשכירה מגיל 20), בהתאם לכללים החלים.', color: '#6366f1' },
];

// ─── Game Constants ───────────────────────────────────────────────────────────
const W = 900;      // canvas width
const H = 450;      // canvas height
const GRAVITY = 0.55;
const JUMP_V = -13;
const SPEED = 4.5;
const WORLD_W = 6000;

// ─── Types ───────────────────────────────────────────────────────────────────
interface Rect { x: number; y: number; w: number; h: number; }
interface Platform extends Rect { color: string; label?: string; }
interface Coin extends Rect { collected: boolean; factIdx: number; bounce: number; }
interface Enemy extends Rect { vx: number; alive: boolean; patrolMin: number; patrolMax: number; }
interface Player extends Rect { vx: number; vy: number; onGround: boolean; lives: number; score: number; facingRight: boolean; frame: number; }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; }
interface Star { x: number; y: number; size: number; twinkle: number; }
interface BirdEvent {
  triggered: boolean;
  active: boolean;
  completed: boolean;
  puzzleShown: boolean;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  landedTicks: number;
}

// ─── Level Builder ────────────────────────────────────────────────────────────
function buildLevel() {
  const platforms: Platform[] = [
    // Ground
    { x: 0,    y: 380, w: 600,  h: 20, color: '#6b7280', label: '' },
    { x: 700,  y: 380, w: 800,  h: 20, color: '#6b7280', label: '' },
    { x: 1600, y: 380, w: 600,  h: 20, color: '#6b7280', label: '' },
    { x: 2300, y: 380, w: 700,  h: 20, color: '#6b7280', label: '' },
    { x: 3100, y: 380, w: 800,  h: 20, color: '#6b7280', label: '' },
    { x: 4000, y: 380, w: 700,  h: 20, color: '#6b7280', label: '' },
    { x: 4800, y: 380, w: 1200, h: 20, color: '#6b7280', label: '' },
    // Platforms with labels
    { x: 120,  y: 290, w: 220, h: 18, color: '#059669', label: '☕ בית קפה' },
    { x: 460,  y: 230, w: 200, h: 18, color: '#7c3aed', label: '🛒 סופרמרקט' },
    { x: 820,  y: 300, w: 180, h: 18, color: '#b45309', label: '👕 חנות בגדים' },
    { x: 1050, y: 240, w: 160, h: 18, color: '#0369a1', label: '🍜 מסעדה' },
    { x: 1250, y: 310, w: 200, h: 18, color: '#be185d', label: '💇 מספרה' },
    { x: 1700, y: 280, w: 180, h: 18, color: '#047857', label: '🌻 גן ילדים' },
    { x: 1950, y: 210, w: 200, h: 18, color: '#7c3aed', label: '📦 מחסן' },
    { x: 2100, y: 300, w: 150, h: 18, color: '#b45309', label: '🚗 מוסך' },
    { x: 2400, y: 260, w: 200, h: 18, color: '#0369a1', label: '📱 חנות טכנו' },
    { x: 2680, y: 200, w: 180, h: 18, color: '#be185d', label: '🎨 גלריה' },
    { x: 2900, y: 310, w: 200, h: 18, color: '#047857', label: '🏋️ חדר כושר' },
    { x: 3200, y: 250, w: 200, h: 18, color: '#0369a1', label: '🏥 מרפאה' },
    { x: 3450, y: 180, w: 200, h: 18, color: '#b45309', label: '🎬 קולנוע' },
    { x: 3700, y: 300, w: 230, h: 18, color: '#7c3aed', label: '🛠️ סדנה' },
    { x: 4050, y: 240, w: 200, h: 18, color: '#047857', label: '🌐 היי-טק' },
    { x: 4300, y: 170, w: 200, h: 18, color: '#be185d', label: '📚 ספרייה' },
    { x: 4600, y: 280, w: 200, h: 18, color: '#b45309', label: '✈️ נמל תעופה' },
    { x: 4900, y: 220, w: 220, h: 18, color: '#0369a1', label: '🏦 בנק' },
    { x: 5200, y: 300, w: 200, h: 18, color: '#7c3aed', label: '🎵 אולפן' },
    { x: 5500, y: 230, w: 280, h: 18, color: '#059669', label: '🏢 משרד' },
  ];

  const coins: Coin[] = [
    // Above each labeled platform (10 coins = 10 facts)
    { x: 170,  y: 240, w: 28, h: 28, collected: false, factIdx: 0, bounce: 0 },
    { x: 510,  y: 180, w: 28, h: 28, collected: false, factIdx: 1, bounce: 0 },
    { x: 870,  y: 250, w: 28, h: 28, collected: false, factIdx: 2, bounce: 0 },
    { x: 1300, y: 260, w: 28, h: 28, collected: false, factIdx: 3, bounce: 0 },
    { x: 1760, y: 230, w: 28, h: 28, collected: false, factIdx: 4, bounce: 0 },
    { x: 2000, y: 160, w: 28, h: 28, collected: false, factIdx: 5, bounce: 0 },
    { x: 2440, y: 210, w: 28, h: 28, collected: false, factIdx: 6, bounce: 0 },
    { x: 3250, y: 200, w: 28, h: 28, collected: false, factIdx: 7, bounce: 0 },
    { x: 4100, y: 190, w: 28, h: 28, collected: false, factIdx: 8, bounce: 0 },
    { x: 5560, y: 180, w: 28, h: 28, collected: false, factIdx: 9, bounce: 0 },
  ];

  const enemies: Enemy[] = [
    { x: 200,  y: 340, w: 36, h: 36, vx: 1.5, alive: true, patrolMin: 120,  patrolMax: 300 },
    { x: 550,  y: 340, w: 36, h: 36, vx: -1.5, alive: true, patrolMin: 450, patrolMax: 690 },
    { x: 870,  y: 262, w: 36, h: 36, vx: 1.8, alive: true, patrolMin: 820,  patrolMax: 960 },
    { x: 1700, y: 340, w: 36, h: 36, vx: 2, alive: true, patrolMin: 1600, patrolMax: 1800 },
    { x: 2000, y: 172, w: 36, h: 36, vx: -1.5, alive: true, patrolMin: 1950, patrolMax: 2110 },
    { x: 2430, y: 242, w: 36, h: 36, vx: 2, alive: true, patrolMin: 2400, patrolMax: 2560 },
    { x: 3200, y: 232, w: 36, h: 36, vx: -2, alive: true, patrolMin: 3200, patrolMax: 3400 },
    { x: 3720, y: 262, w: 36, h: 36, vx: 1.5, alive: true, patrolMin: 3700, patrolMax: 3890 },
    { x: 4360, y: 152, w: 36, h: 36, vx: -2, alive: true, patrolMin: 4300, patrolMax: 4460 },
    { x: 5550, y: 212, w: 36, h: 36, vx: 2, alive: true, patrolMin: 5500, patrolMax: 5750 },
  ];

  return { platforms, coins, enemies };
}

// ─── Drawing Helpers ──────────────────────────────────────────────────────────
function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, camX: number, tick: number) {
  const sx = p.x - camX;
  const sy = p.y;
  ctx.save();
  if (!p.facingRight) { ctx.translate(sx + p.w, 0); ctx.scale(-1, 1); ctx.translate(-sx, 0); }
  // shoes
  ctx.fillStyle = '#1e293b'; ctx.fillRect(sx, sy + p.h - 8, 16, 8);
  ctx.fillRect(sx + p.w - 16, sy + p.h - 8, 16, 8);
  // legs
  ctx.fillStyle = '#2563eb'; ctx.fillRect(sx + 4, sy + p.h - 20, 12, 14);
  ctx.fillRect(sx + p.w - 16, sy + p.h - 20, 12, 14);
  // body
  ctx.fillStyle = '#dc2626'; ctx.fillRect(sx + 2, sy + p.h - 38, p.w - 4, 20);
  // name tag on shirt
  ctx.fillStyle = '#fff'; ctx.fillRect(sx + 6, sy + p.h - 35, 18, 10);
  ctx.fillStyle = '#1e293b'; ctx.font = '6px sans-serif'; ctx.fillText('ניר', sx + 8, sy + p.h - 27);
  // head
  ctx.fillStyle = '#fbbf24'; ctx.fillRect(sx + 4, sy, p.w - 8, p.h - 38 + 2);
  // hair
  ctx.fillStyle = '#78350f'; ctx.fillRect(sx + 4, sy, p.w - 8, 10);
  // eyes
  ctx.fillStyle = '#1e293b'; ctx.fillRect(sx + 10, sy + 13, 6, 6);
  ctx.fillRect(sx + p.w - 18, sy + 13, 6, 6);
  ctx.fillStyle = '#fff'; ctx.fillRect(sx + 12, sy + 14, 2, 2);
  ctx.fillRect(sx + p.w - 16, sy + 14, 2, 2);
  // smile
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(sx + p.w / 2, sy + 26, 6, 0, Math.PI); ctx.stroke();
  // cap
  ctx.fillStyle = '#dc2626'; ctx.fillRect(sx, sy - 6, p.w, 8);
  ctx.fillRect(sx + p.w - 4, sy - 10, 8, 6);
  ctx.restore();
}

function drawCoin(ctx: CanvasRenderingContext2D, c: Coin, camX: number, tick: number) {
  const sx = c.x - camX + c.w / 2;
  const sy = c.y + c.h / 2 + Math.sin(tick * 0.08 + c.factIdx) * 6;
  const r = 17;
  // outer glow burst
  const grd = ctx.createRadialGradient(sx, sy, 2, sx, sy, r + 14);
  grd.addColorStop(0, 'rgba(251,191,36,0.7)');
  grd.addColorStop(0.6, 'rgba(251,191,36,0.2)');
  grd.addColorStop(1, 'rgba(251,191,36,0)');
  ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(sx, sy, r + 14, 0, Math.PI * 2); ctx.fill();
  // pulsing ring
  const pulse = (Math.sin(tick * 0.12 + c.factIdx * 0.8) + 1) / 2;
  ctx.strokeStyle = `rgba(253,224,71,${0.3 + pulse * 0.6})`;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(sx, sy, r + 6 + pulse * 4, 0, Math.PI * 2); ctx.stroke();
  // coin body
  const coinGrd = ctx.createRadialGradient(sx - 4, sy - 4, 2, sx, sy, r);
  coinGrd.addColorStop(0, '#fde68a');
  coinGrd.addColorStop(1, '#d97706');
  ctx.fillStyle = coinGrd;
  ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.stroke();
  // rights symbol
  ctx.fillStyle = '#7c2d12';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('✊', sx, sy);
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, camX: number) {
  const sx = e.x - camX;
  const sy = e.y;
  // suit body
  ctx.fillStyle = '#374151'; ctx.fillRect(sx + 2, sy + 10, e.w - 4, e.h - 14);
  // tie
  ctx.fillStyle = '#dc2626'; ctx.fillRect(sx + e.w / 2 - 3, sy + 12, 6, 18);
  // briefcase
  ctx.fillStyle = '#92400e'; ctx.fillRect(sx + e.w - 10, sy + 22, 12, 10);
  // head
  ctx.fillStyle = '#fcd34d'; ctx.fillRect(sx + 4, sy, e.w - 8, 14);
  // angry eyes
  ctx.fillStyle = '#1e293b'; ctx.fillRect(sx + 7, sy + 4, 5, 5);
  ctx.fillRect(sx + e.w - 13, sy + 4, 5, 5);
  ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(sx + 5, sy + 2); ctx.lineTo(sx + 13, sy + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx + e.w - 5, sy + 2); ctx.lineTo(sx + e.w - 13, sy + 5); ctx.stroke();
  // frown
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(sx + e.w / 2, sy + 14, 4, Math.PI, 0); ctx.stroke();
  // label
  ctx.fillStyle = '#7f1d1d'; ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('מעסיק לא', sx + e.w / 2, sy - 10);
  ctx.fillText('הוגן 😤', sx + e.w / 2, sy - 2);
}

function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, camX: number) {
  const sx = p.x - camX;
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.roundRect(sx + 3, p.y + 4, p.w, p.h, 6);
  ctx.fill();
  // platform body with gradient
  const grad = ctx.createLinearGradient(sx, p.y, sx, p.y + p.h);
  const base = p.color;
  grad.addColorStop(0, base + 'ee');
  grad.addColorStop(1, base + '99');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(sx, p.y, p.w, p.h, 6);
  ctx.fill();
  // highlight stripe
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath(); ctx.roundRect(sx + 4, p.y + 2, p.w - 8, 4, 2); ctx.fill();
  // bottom edge
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(sx + 6, p.y + p.h - 3, p.w - 12, 3);
  if (p.label) {
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 3;
    ctx.fillText(p.label, sx + p.w / 2, p.y + 9);
    ctx.shadowBlur = 0;
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, camX: number, stars: Star[], tick: number) {
  // richer sky gradient — deep night to vibrant blue
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#020617');
  sky.addColorStop(0.35, '#0f172a');
  sky.addColorStop(0.7, '#1e3a5f');
  sky.addColorStop(1, '#1e40af');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  // Moon
  const moonX = 820;
  const moonY = 50;
  const moonGrd = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, 28);
  moonGrd.addColorStop(0, '#fef9c3');
  moonGrd.addColorStop(1, '#fde68a');
  ctx.fillStyle = moonGrd;
  ctx.beginPath(); ctx.arc(moonX, moonY, 28, 0, Math.PI * 2); ctx.fill();

  // parallax city bg — back layer (lighter, farther)
  const offset = camX * 0.1;
  for (let i = 0; i < 24; i++) {
    const bx = ((i * 220 - offset) % (W + 300) + W + 300) % (W + 300) - 60;
    const bw = 50 + (i * 17) % 38;
    const bh = 70 + (i * 37) % 110;
    ctx.fillStyle = 'rgba(15,23,42,0.6)';
    ctx.fillRect(bx, H - bh - 20, bw, bh);
    // windows
    for (let wy = H - bh - 10; wy < H - 30; wy += 16) {
      for (let wx = bx + 6; wx < bx + bw - 6; wx += 12) {
        if (((wx + wy + i * 3) | 0) % 3 !== 0) {
          const bright = Math.sin(tick * 0.04 + wx * 0.1 + wy * 0.07) > 0.6;
          ctx.fillStyle = bright ? 'rgba(253,224,71,0.85)' : 'rgba(147,197,253,0.45)';
          ctx.fillRect(wx, wy, 6, 8);
        }
      }
    }
  }

  // parallax city — mid layer (darker, closer)
  const offset2 = camX * 0.25;
  for (let i = 0; i < 14; i++) {
    const bx = ((i * 320 - offset2) % (W + 400) + W + 400) % (W + 400) - 80;
    const bw = 70 + (i * 23) % 50;
    const bh = 100 + (i * 29) % 80;
    ctx.fillStyle = 'rgba(7,12,28,0.8)';
    ctx.fillRect(bx, H - bh - 20, bw, bh);
    // lit windows
    for (let wy = H - bh - 5; wy < H - 30; wy += 18) {
      for (let wx = bx + 8; wx < bx + bw - 8; wx += 14) {
        if (((wx * 7 + wy * 3 + i * 11) | 0) % 4 !== 0) {
          ctx.fillStyle = 'rgba(253,224,71,0.7)';
          ctx.fillRect(wx, wy, 7, 9);
        }
      }
    }
  }

  // stars
  for (const s of stars) {
    const t = (Math.sin(tick * 0.05 + s.twinkle) + 1) / 2;
    ctx.fillStyle = `rgba(255,255,255,${0.3 + t * 0.7})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size * (0.8 + t * 0.4), 0, Math.PI * 2); ctx.fill();
  }

  // ground line — darker cobblestone
  const gndGrd = ctx.createLinearGradient(0, H - 20, 0, H);
  gndGrd.addColorStop(0, '#334155');
  gndGrd.addColorStop(1, '#1e293b');
  ctx.fillStyle = gndGrd;
  ctx.fillRect(0, H - 20, W, 20);
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = p.life / 30;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHUD(ctx: CanvasRenderingContext2D, player: Player, coinsLeft: number, elapsedSec: number) {
  // HUD bar
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath(); ctx.roundRect(8, 8, 300, 50, 12); ctx.fill();
  // lives
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < player.lives ? '#ef4444' : '#374151';
    ctx.font = '22px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('❤️', 18 + i * 30, 33);
  }
  ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`✊ ${player.score}  |  נותרו: ${coinsLeft}`, 105, 33);

  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const ss = String(elapsedSec % 60).padStart(2, '0');
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath(); ctx.roundRect(318, 8, 140, 50, 12); ctx.fill();
  ctx.fillStyle = '#86efac'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`⏱ ${mm}:${ss}`, 388, 33);

  // goal
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath(); ctx.roundRect(W - 220, 8, 212, 40, 10); ctx.fill();
  ctx.fillStyle = '#a5f3fc'; ctx.font = '12px sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('🏁 הגע לסוף ואסוף את כל הזכויות!', W - 14, 28);
}

function drawFlag(ctx: CanvasRenderingContext2D, camX: number) {
  const fx = 5840 - camX;
  // pole
  ctx.fillStyle = '#6b7280'; ctx.fillRect(fx, H - 300, 8, 280);
  // flag
  ctx.fillStyle = '#16a34a';
  ctx.beginPath(); ctx.moveTo(fx + 8, H - 300); ctx.lineTo(fx + 100, H - 270); ctx.lineTo(fx + 8, H - 240); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('🏁 סיום!', fx + 50, H - 270);
  ctx.fillText('זכויות', fx + 50, H - 258);
  ctx.fillText('עובדים', fx + 50, H - 246);
}

function drawBirdWithPayslip(ctx: CanvasRenderingContext2D, camX: number, tick: number, bird: BirdEvent) {
  if (!bird.active) return;
  const bx = bird.x - camX;
  const by = bird.y + Math.sin(tick * 0.2) * 2;

  // wings
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.ellipse(bx - 8, by + 8, 12, 7, -0.4, 0, Math.PI * 2);
  ctx.ellipse(bx + 10, by + 8, 12, 7, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // body
  ctx.fillStyle = '#374151';
  ctx.beginPath(); ctx.ellipse(bx, by + 10, 12, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.moveTo(bx + 12, by + 9); ctx.lineTo(bx + 18, by + 11); ctx.lineTo(bx + 12, by + 13); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(bx + 4, by + 8, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.beginPath(); ctx.arc(bx + 4, by + 8, 1, 0, Math.PI * 2); ctx.fill();

  // payslip in beak
  ctx.fillStyle = '#f9fafb';
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(bx + 18, by + 6, 16, 12, 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#d1d5db';
  ctx.beginPath(); ctx.moveTo(bx + 20, by + 10); ctx.lineTo(bx + 32, by + 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx + 20, by + 13); ctx.lineTo(bx + 30, by + 13); ctx.stroke();
}

function overlap(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props { onBack: () => void; }

type GameScreen = 'menu' | 'playing' | 'dead' | 'win' | 'fact';

const SuperMarioRightsGame: React.FC<Props> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    player: Player;
    platforms: Platform[];
    coins: Coin[];
    enemies: Enemy[];
    camX: number;
    particles: Particle[];
    stars: Star[];
    keys: Record<string, boolean>;
    tick: number;
    startTimeMs: number;
    elapsedSec: number;
    lastSyncedSecond: number;
    invincible: number;
    bird: BirdEvent;
    screen: GameScreen;
    currentFact: number;
    pendingFact: { fact: typeof RIGHTS_FACTS[0]; resume: () => void } | null;
  } | null>(null);

  const [screen, setScreen] = useState<GameScreen>('menu');
  const [factPopup, setFactPopup] = useState<{ fact: typeof RIGHTS_FACTS[0] } | null>(null);
  const [payslipPuzzleOpen, setPayslipPuzzleOpen] = useState(false);
  const [payslipPuzzleResult, setPayslipPuzzleResult] = useState<'correct' | 'wrong' | null>(null);
  const [elapsedSecUi, setElapsedSecUi] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const rafRef = useRef<number>(0);
  const pausedForFact = useRef(false);

  const initGame = useCallback(() => {
    const { platforms, coins, enemies } = buildLevel();
    const stars: Star[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * (H - 80), size: Math.random() * 1.5 + 0.5, twinkle: Math.random() * Math.PI * 2,
    }));
    stateRef.current = {
      player: { x: 60, y: 300, w: 30, h: 46, vx: 0, vy: 0, onGround: false, lives: 3, score: 0, facingRight: true, frame: 0 },
      platforms, coins, enemies, camX: 0, particles: [], stars,
      keys: {}, tick: 0, startTimeMs: performance.now(), elapsedSec: 0, lastSyncedSecond: -1,
      invincible: 0,
      bird: {
        triggered: false,
        active: false,
        completed: false,
        puzzleShown: false,
        x: 0,
        y: -50,
        targetX: 0,
        targetY: 0,
        landedTicks: 0,
      },
      screen: 'playing',
      currentFact: -1, pendingFact: null,
    };
    setScore(0); setLives(3); setElapsedSecUi(0); setPayslipPuzzleOpen(false); setPayslipPuzzleResult(null);
  }, []);

  const spawnParticles = (x: number, y: number, color: string, count = 12) => {
    if (!stateRef.current) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      stateRef.current.particles.push({
        x, y, vx: Math.cos(angle) * (2 + Math.random() * 3),
        vy: Math.sin(angle) * (2 + Math.random() * 3) - 2,
        life: 25 + Math.random() * 10, color,
        size: 3 + Math.random() * 4,
      });
    }
  };

  const showFact = useCallback((fact: typeof RIGHTS_FACTS[0], onResume: () => void) => {
    pausedForFact.current = true;
    setFactPopup({ fact });
    if (stateRef.current) {
      stateRef.current.pendingFact = { fact, resume: onResume };
    }
  }, []);

  const resumeFromFact = useCallback(() => {
    pausedForFact.current = false;
    setFactPopup(null);
    if (stateRef.current?.pendingFact) {
      stateRef.current.pendingFact.resume();
      stateRef.current.pendingFact = null;
    }
  }, []);

  const answerPayslipPuzzle = useCallback((isCorrect: boolean) => {
    setPayslipPuzzleResult(isCorrect ? 'correct' : 'wrong');
  }, []);

  const continueAfterPayslipPuzzle = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.bird.completed = true;
      stateRef.current.bird.active = false;
    }
    setPayslipPuzzleOpen(false);
    pausedForFact.current = false;
  }, []);

  useEffect(() => {
    if (screen !== 'playing') return;
    initGame();

    const handleKey = (e: KeyboardEvent, down: boolean) => {
      if (!stateRef.current) return;
      stateRef.current.keys[e.code] = down;
      if (down && (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW')) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', e => handleKey(e, true));
    window.addEventListener('keyup', e => handleKey(e, false));

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (pausedForFact.current) return;

      const s = stateRef.current;
      if (!s || s.screen !== 'playing') return;
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      s.tick++;
      s.elapsedSec = Math.floor((performance.now() - s.startTimeMs) / 1000);
      if (s.elapsedSec !== s.lastSyncedSecond) {
        s.lastSyncedSecond = s.elapsedSec;
        setElapsedSecUi(s.elapsedSec);
      }
      const { player: p, platforms, coins, enemies, keys } = s;

      // ── Input ──
      const left = keys['ArrowLeft'] || keys['KeyA'];
      const right = keys['ArrowRight'] || keys['KeyD'];
      const jump = keys['ArrowUp'] || keys['KeyW'] || keys['Space'];

      if (left)  { p.vx = -SPEED; p.facingRight = false; }
      else if (right) { p.vx = SPEED;  p.facingRight = true; }
      else p.vx *= 0.75;

      if (jump && p.onGround) { p.vy = JUMP_V; p.onGround = false; playSound('jump'); }

      // ── Physics ──
      p.vy += GRAVITY;
      if (p.vy > 18) p.vy = 18;
      p.x += p.vx;
      p.y += p.vy;
      p.x = Math.max(0, p.x);

      // ── Platform collisions ──
      p.onGround = false;
      for (const pl of platforms) {
        if (overlap(p, pl)) {
          const overlapX = Math.min(p.x + p.w, pl.x + pl.w) - Math.max(p.x, pl.x);
          const overlapY = Math.min(p.y + p.h, pl.y + pl.h) - Math.max(p.y, pl.y);
          if (overlapY < overlapX) {
            if (p.vy > 0 && p.y + p.h - p.vy <= pl.y + 2) {
              p.y = pl.y - p.h; p.vy = 0; p.onGround = true;
            } else if (p.vy < 0) {
              p.y = pl.y + pl.h; p.vy = 0;
            }
          } else {
            if (p.vx > 0) p.x = pl.x - p.w;
            else p.x = pl.x + pl.w;
            p.vx = 0;
          }
        }
      }
      // Ground
      if (p.y + p.h >= H - 20) { p.y = H - 20 - p.h; p.vy = 0; p.onGround = true; }

      // ── Fall into pit ──
      if (p.y > H + 50) {
        p.lives--;
        playSound('die');
        spawnParticles(p.x - s.camX + p.w / 2, H / 2, '#ef4444', 20);
        if (p.lives <= 0) { s.screen = 'dead'; setScreen('dead'); }
        else { p.x = Math.max(0, s.camX - 80); p.y = 100; p.vy = 0; s.invincible = 120; setLives(p.lives); }
      }

      // ── Camera ──
      const targetCamX = p.x - W * 0.35;
      s.camX += (targetCamX - s.camX) * 0.1;
      s.camX = Math.max(0, Math.min(WORLD_W - W, s.camX));

      // ── Mid-game bird event + payslip puzzle ──
      if (!s.bird.triggered && p.x >= WORLD_W * 0.5) {
        s.bird.triggered = true;
        s.bird.active = true;
        s.bird.x = p.x + 230;
        s.bird.y = -40;
        s.bird.targetX = p.x + 70;
        s.bird.targetY = Math.max(95, p.y - 45);
      }

      if (s.bird.active && !s.bird.completed) {
        s.bird.targetX = p.x + 70;
        s.bird.targetY = Math.max(95, p.y - 45);
        s.bird.x += (s.bird.targetX - s.bird.x) * 0.06;
        s.bird.y += (s.bird.targetY - s.bird.y) * 0.08;

        if (Math.abs(s.bird.x - s.bird.targetX) < 8 && Math.abs(s.bird.y - s.bird.targetY) < 8) {
          s.bird.landedTicks++;
        } else {
          s.bird.landedTicks = 0;
        }

        if (s.bird.landedTicks > 30 && !s.bird.puzzleShown) {
          s.bird.puzzleShown = true;
          pausedForFact.current = true;
          setPayslipPuzzleResult(null);
          setPayslipPuzzleOpen(true);
        }
      }

      // ── Enemies ──
      for (const e of enemies) {
        if (!e.alive) continue;
        e.x += e.vx;
        if (e.x <= e.patrolMin || e.x + e.w >= e.patrolMax) e.vx *= -1;

        if (s.invincible > 0) continue;

        if (overlap(p, e)) {
          // Jump on top? 
          if (p.vy > 0 && p.y + p.h < e.y + e.h * 0.5 + 10) {
            e.alive = false;
            playSound('stomp');
            p.vy = JUMP_V * 0.7;
            p.score++;
            spawnParticles(e.x - s.camX + e.w / 2, e.y, '#fbbf24', 16);
            setScore(p.score);
          } else {
            // Hit by enemy
            p.lives--;
            s.invincible = 120;
            p.vy = JUMP_V;
            spawnParticles(p.x - s.camX + p.w / 2, p.y, '#ef4444', 14);
            if (p.lives <= 0) { s.screen = 'dead'; setScreen('dead'); }
            else setLives(p.lives);
          }
        }
      }

      // ── Coins ──
      for (const c of coins) {
        if (c.collected) continue;
        if (overlap(p, { x: c.x, y: c.y + Math.sin(s.tick * 0.08 + c.factIdx) * 5, w: c.w, h: c.h })) {
          c.collected = true;
          playSound('coin');
          p.score++;
          setScore(p.score);
          spawnParticles(c.x - s.camX + c.w / 2, c.y, '#fbbf24', 14);
          const fact = RIGHTS_FACTS[c.factIdx];
          const { vx, vy, x, y } = p;
          showFact(fact, () => { /* just resume */ });
        }
      }

      // ── Win condition ──
      if (p.x >= 5840) {
        s.screen = 'win';
        setScreen('win');
        playSound('win');
      }

      // ── Particles ──
      s.particles = s.particles.filter(pt => pt.life > 0);
      for (const pt of s.particles) {
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; pt.life--;
      }

      // ── Invincibility ──
      if (s.invincible > 0) s.invincible--;

      // ── Draw ──
      ctx.save();
      ctx.scale(2, 2);
      drawBackground(ctx, s.camX, s.stars, s.tick);
      drawFlag(ctx, s.camX);

      for (const pl of platforms) {
        if (pl.x + pl.w < s.camX - 20 || pl.x > s.camX + W + 20) continue;
        drawPlatform(ctx, pl, s.camX);
      }

      for (const c of coins) {
        if (c.collected) continue;
        if (c.x + c.w < s.camX - 10 || c.x > s.camX + W + 10) continue;
        drawCoin(ctx, c, s.camX, s.tick);
      }

      for (const e of enemies) {
        if (!e.alive) continue;
        if (e.x + e.w < s.camX - 10 || e.x > s.camX + W + 10) continue;
        drawEnemy(ctx, e, s.camX);
      }

      // Invincible flash
      if (s.invincible === 0 || Math.floor(s.tick / 4) % 2 === 0) {
        drawPlayer(ctx, p, s.camX, s.tick);
      }
      drawParticles(ctx, s.particles);
      drawBirdWithPayslip(ctx, s.camX, s.tick, s.bird);
      drawHUD(ctx, p, coins.filter(c => !c.collected).length, s.elapsedSec);
      ctx.restore();
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', e => handleKey(e, true));
      window.removeEventListener('keyup', e => handleKey(e, false));
    };
  }, [screen, initGame, showFact]);

  // ── Touch controls ──
  const setKey = (key: string, val: boolean) => {
    if (stateRef.current) stateRef.current.keys[key] = val;
  };

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      {/* ── MENU ── */}
      {screen === 'menu' && (
        <div className="w-full max-w-2xl bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white flex flex-col items-center gap-6 shadow-2xl border border-blue-500/30">
          <div className="text-center">
            <p className="text-6xl mb-2">🕹️</p>
            <h1 className="text-4xl font-black">סופר ניר: זכויות!</h1>
            <p className="text-blue-200 text-lg mt-2">פלטפורמר ארקייד — נוער בשוק העבודה</p>
          </div>
          <div className="bg-blue-800/50 rounded-2xl p-5 text-center max-w-md space-y-2">
            <p className="text-amber-300 font-bold">📖 הסיפור</p>
            <p className="text-blue-100">ניר, בן 15, קיבל עבודה ראשונה! 🎉<br />
              חלף דרך מקומות העבודה, אסוף את מטבעות הזכויות ✊<br />
              ושמור על עצמך מפני מעסיקים לא הוגנים 😤</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-blue-100 max-w-md w-full">
            <div className="bg-blue-800/40 rounded-xl p-3">⌨️ חצים / WASD להזזה</div>
            <div className="bg-blue-800/40 rounded-xl p-3">🚀 חץ למעלה / Space לקפיצה</div>
            <div className="bg-amber-700/40 rounded-xl p-3">✊ אסוף מטבעות זכויות</div>
            <div className="bg-red-700/40 rounded-xl p-3">😤 דרוך על האויב להכות</div>
            <div className="bg-emerald-700/40 rounded-xl p-3 col-span-2">⏱️ יש טיימר משחק + אירוע ציפור עם חידת תלוש באמצע</div>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => { initGame(); setScreen('playing'); }}
              className="px-10 py-4 bg-green-500 hover:bg-green-400 text-white text-2xl font-black rounded-2xl shadow-lg transition hover:scale-105"
            >🚀 שחק!</button>
            <button onClick={onBack} className="px-6 py-4 bg-gray-600 hover:bg-gray-500 rounded-2xl font-bold text-xl transition">← חזרה</button>
          </div>
        </div>
      )}

      {/* ── PLAYING ── */}
      {screen === 'playing' && (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-900 w-full max-w-[1800px]">
            <canvas ref={canvasRef} width={W * 2} height={H * 2} className="w-full block" style={{ imageRendering: 'pixelated' }} />
          </div>

          {/* Touch controls */}
          <div className="flex justify-between w-full max-w-[1800px] px-2 select-none touch-none">
            <div className="flex gap-2">
              <button
                className="w-16 h-16 bg-blue-800/80 rounded-2xl text-white text-2xl font-black active:bg-blue-600 border-2 border-blue-600"
                onPointerDown={() => setKey('ArrowLeft', true)}
                onPointerUp={() => setKey('ArrowLeft', false)}
                onPointerLeave={() => setKey('ArrowLeft', false)}
              >←</button>
              <button
                className="w-16 h-16 bg-blue-800/80 rounded-2xl text-white text-2xl font-black active:bg-blue-600 border-2 border-blue-600"
                onPointerDown={() => setKey('ArrowRight', true)}
                onPointerUp={() => setKey('ArrowRight', false)}
                onPointerLeave={() => setKey('ArrowRight', false)}
              >→</button>
            </div>
            <button
              className="w-20 h-16 bg-green-700/80 rounded-2xl text-white text-2xl font-black active:bg-green-500 border-2 border-green-500"
              onPointerDown={() => setKey('Space', true)}
              onPointerUp={() => setKey('Space', false)}
              onPointerLeave={() => setKey('Space', false)}
            >🚀</button>
          </div>

          <button onClick={() => { cancelAnimationFrame(rafRef.current); setScreen('menu'); }}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-bold">← תפריט</button>
        </div>
      )}

      {/* ── FACT POPUP ── */}
      {factPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-5 animate-bounce-in" dir="rtl">
            <div className="text-6xl">✊</div>
            <div className="text-center">
              <h3 className="text-2xl font-black mb-2" style={{ color: factPopup.fact.color }}>{factPopup.fact.title}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{factPopup.fact.body}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-amber-700 text-sm font-bold">
              🎉 זכות נוספת נאספה! המשך לאסוף!
            </div>
            <button
              onClick={resumeFromFact}
              className="px-10 py-3 bg-green-500 hover:bg-green-400 text-white text-xl font-black rounded-2xl shadow transition hover:scale-105"
            >▶ המשך!</button>
          </div>
        </div>
      )}

      {/* ── PAYSLIP PUZZLE POPUP ── */}
      {payslipPuzzleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center gap-5" dir="rtl">
            <div className="text-6xl">🐦📄</div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-sky-700">חידת תלוש שכר של ניר</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                הציפור נחתה ליד ניר ומסרה לו תלוש. מה הניסוח הנכון לשעות נוספות בתלוש?
              </p>
            </div>

            <div className="w-full grid gap-2">
              <button
                onClick={() => answerPayslipPuzzle(true)}
                className="w-full text-right px-4 py-3 rounded-xl border border-gray-300 hover:bg-sky-50"
              >שעות 9-10 = 125%, שעות 11-12 = 150%</button>
              <button
                onClick={() => answerPayslipPuzzle(false)}
                className="w-full text-right px-4 py-3 rounded-xl border border-gray-300 hover:bg-sky-50"
              >כל שעה נוספת היא 125%</button>
              <button
                onClick={() => answerPayslipPuzzle(false)}
                className="w-full text-right px-4 py-3 rounded-xl border border-gray-300 hover:bg-sky-50"
              >שעות 9-12 כולן 150%</button>
            </div>

            {payslipPuzzleResult && (
              <div className={`w-full rounded-2xl px-4 py-3 text-center font-bold ${payslipPuzzleResult === 'correct' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                {payslipPuzzleResult === 'correct'
                  ? 'נכון מאוד! כך צריך להופיע בתלוש.'
                  : 'כמעט. התשובה הנכונה: שעות 9-10 = 125%, שעות 11-12 = 150%.'}
              </div>
            )}

            <button
              onClick={continueAfterPayslipPuzzle}
              className="px-10 py-3 bg-green-500 hover:bg-green-400 text-white text-xl font-black rounded-2xl shadow transition hover:scale-105"
            >▶ המשך משחק</button>
          </div>
        </div>
      )}

      {/* ── DEAD ── */}
      {screen === 'dead' && (
        <div className="w-full max-w-lg bg-gradient-to-br from-red-900 to-gray-900 rounded-3xl p-8 text-white flex flex-col items-center gap-6 shadow-2xl">
          <p className="text-6xl">😢</p>
          <h2 className="text-3xl font-black">המעסיקים ניצחו הפעם...</h2>
          <p className="text-red-200 text-center">אבל ניר לא מוותר! כל כישלון הוא הזדמנות ללמוד את הזכויות טוב יותר 💪</p>
          <p className="text-2xl font-black text-amber-300">ניקוד: {score} זכויות</p>
          <p className="text-lg font-bold text-blue-100">⏱ זמן משחק: {String(Math.floor(elapsedSecUi / 60)).padStart(2, '0')}:{String(elapsedSecUi % 60).padStart(2, '0')}</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button onClick={() => { initGame(); setScreen('playing'); }}
              className="px-8 py-3 bg-green-500 hover:bg-green-400 rounded-2xl font-black text-xl transition">🔄 שחק שוב!</button>
            <button onClick={() => setScreen('menu')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-2xl font-bold text-lg transition">← תפריט</button>
          </div>
        </div>
      )}

      {/* ── WIN ── */}
      {screen === 'win' && (
        <div className="w-full max-w-2xl bg-gradient-to-br from-green-800 to-emerald-900 rounded-3xl p-8 text-white flex flex-col items-center gap-6 shadow-2xl border border-green-400/30">
          <p className="text-7xl">🏆</p>
          <h2 className="text-4xl font-black text-amber-300">ניר עשה זאת! 🎉</h2>
          <p className="text-green-100 text-center text-lg">ניר עבר את כל מקומות העבודה, הכיר את זכויותיו ועמד מול מעסיקים לא הוגנים!</p>
          <div className="bg-white/10 rounded-2xl p-6 text-center w-full">
            <p className="text-5xl font-black text-amber-300">{score}</p>
            <p className="text-green-200">מטבעות זכויות נאספו מתוך {RIGHTS_FACTS.length}</p>
            <p className="text-blue-100 mt-2 font-bold">⏱ זמן משחק: {String(Math.floor(elapsedSecUi / 60)).padStart(2, '0')}:{String(elapsedSecUi % 60).padStart(2, '0')}</p>
          </div>
          <div className="w-full space-y-2">
            <p className="text-green-200 font-bold text-center text-sm">🏅 הזכויות שניר למד:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RIGHTS_FACTS.map((f, i) => (
                <div key={i} className="flex gap-2 items-start bg-white/10 rounded-xl p-2">
                  <span className="text-lg shrink-0">✊</span>
                  <p className="text-xs text-green-100">{f.title.replace(/^.+ /, '')}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            <button onClick={() => { initGame(); setScreen('playing'); }}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 rounded-2xl font-black text-xl text-white transition">🔄 שחק שוב!</button>
            <button onClick={() => setScreen('menu')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-2xl font-bold text-lg text-white transition">← תפריט</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperMarioRightsGame;
