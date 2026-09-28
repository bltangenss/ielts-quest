import { useRef, useEffect, useState, useCallback } from 'react';
import { TYPE_COLORS } from '../../data/arenaAbilities';
import { getCardArt } from '../../data/cardArt';
import { drawDetailedHeroModel } from './heroModel';
import { Icon } from '../Icon';

// ════════════════════════════════════════════════════════════════════
// Top-down dungeon shooter (Soul-Knight / Archero genre, ORIGINAL art).
// You control a hero (one of your cards). Move with WASD / on-screen
// stick, auto-fire at the nearest enemy, dash to dodge. Clear the room.
// When your hero falls, the next card in your squad takes over (lives).
// Rendered on a low-res canvas scaled up → crisp pixel-art look.
// ════════════════════════════════════════════════════════════════════

const RW = 320, RH = 200;           // low-res room (pixels)
const WALL = 14;                    // wall thickness
const PAD = WALL + 6;
const RANGED = new Set(['Arcane', 'Wind', 'Void']);

const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = clamp(Math.round(r + (f < 0 ? r : 255 - r) * f), 0, 255);
  g = clamp(Math.round(g + (f < 0 ? g : 255 - g) * f), 0, 255);
  b = clamp(Math.round(b + (f < 0 ? b : 255 - b) * f), 0, 255);
  return `rgb(${r},${g},${b})`;
}

function spawnCountFor(tier) { return tier === 'boss' ? 1 : tier === 'elite' ? 2 : 4; }

export function TopDownArena({ playerTeam, enemyCreatures, tier = 'normal', floor = 1, onVictory, onDefeat }) {
  const canvasRef = useRef(null);
  const S = useRef(null);
  const raf = useRef(0);
  const keys = useRef({});
  const stick = useRef({ active: false, dx: 0, dy: 0, id: null, ox: 0, oy: 0 });
  const dashReq = useRef(false);
  const ended = useRef(false);
  const stats = useRef({ damageDealt: 0, enemiesDefeated: 0, abilitiesUsed: 0, damageTaken: 0 });
  const [hud, setHud] = useState({ hp: 1, maxHp: 1, lives: 0, enemies: 0, heroEmoji: '🃏', dashCd: 0 });

  // ── build entities ──
  useEffect(() => {
    const heroes = playerTeam.map((c) => {
      const cardArt = getCardArt(c.id);
      const cardImage = cardArt ? new Image() : null;
      if (cardImage) cardImage.src = cardArt.atlas;
      return {
        id: c.id, name: c.name, emoji: c.emoji, type: c.type, rarity: c.rarity, cardArt, cardImage,
        maxHP: c.maxHP, hp: c.maxHP, attack: c.attack, defense: c.defense, speed: c.speed || 50,
      };
    });

    const enemies = [];
    enemyCreatures.forEach((c, ci) => {
      const count = spawnCountFor(tier);
      const big = tier === 'boss';
      for (let k = 0; k < count; k++) {
        enemies.push({
          id: `e${ci}_${k}`, name: c.name, emoji: c.emoji, type: c.type,
          maxHP: Math.round(c.hp * (big ? 1 : tier === 'elite' ? 0.8 : 0.45)),
          hp: 0, attack: c.attack * (big ? 1 : 0.6), defense: c.defense, speed: c.speed || 50,
          x: rnd(PAD + 30, RW - PAD - 10), y: rnd(PAD, RH * 0.6),
          vx: 0, vy: 0, r: big ? 13 : tier === 'elite' ? 10 : 8,
          ranged: RANGED.has(c.type), fireCd: rnd(0.6, 1.6), flash: 0, hurtT: 0,
          state: 'alive', deadT: 0, bob: rnd(0, 6.28), big,
          touchCd: 0, wob: 0,
        });
      }
    });
    enemies.forEach(e => { e.hp = e.maxHP; });

    const hero0 = heroes[0];
    S.current = {
      heroes, heroIdx: 0,
      player: {
        ...hero0, x: RW / 2, y: RH - PAD - 10, vx: 0, vy: 0, r: 9,
        aimX: 0, aimY: -1, fireCd: 0, dashCd: 0, dashT: 0, invuln: 1, flash: 0,
        face: 1, walkT: 0, recoil: 0, muzzle: 0, trail: [],
      },
      enemies, bullets: [], parts: [], floaters: [],
      torches: [{ x: PAD + 4, y: PAD + 4 }, { x: RW - PAD - 4, y: PAD + 4 }, { x: PAD + 4, y: RH - PAD - 4 }, { x: RW - PAD - 4, y: RH - PAD - 4 }],
      props: Array.from({ length: 5 }, () => ({ x: rnd(PAD + 14, RW - PAD - 14), y: rnd(PAD + 14, RH - PAD - 14), k: Math.random() < 0.5 ? 'barrel' : 'bones' })),
      shake: 0, t: 0, banner: tier === 'boss' ? `FLOOR ${floor}: BOSS` : tier === 'elite' ? `FLOOR ${floor}: ELITE` : `FLOOR ${floor}`, bannerT: 2.2,
    };
    ended.current = false;
    stats.current = { damageDealt: 0, enemiesDefeated: 0, abilitiesUsed: 0, damageTaken: 0 };
    // eslint-disable-next-line
  }, []);

  // ── input ──
  useEffect(() => {
    // Map by physical key code so WASD works on any keyboard layout (e.g. Cyrillic).
    const codeKey = e => ({ KeyW: 'w', KeyA: 'a', KeyS: 's', KeyD: 'd', ArrowUp: 'arrowup', ArrowDown: 'arrowdown', ArrowLeft: 'arrowleft', ArrowRight: 'arrowright' }[e.code]) || e.key.toLowerCase();
    const dn = e => {
      keys.current[codeKey(e)] = true;
      if (e.key === ' ' || e.code === 'Space') { dashReq.current = true; e.preventDefault(); }
    };
    const up = e => { keys.current[codeKey(e)] = false; };
    window.addEventListener('keydown', dn); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);

  const burst = useCallback((x, y, color, n, pw) => {
    const st = S.current; if (!st) return;
    for (let i = 0; i < n; i++) { const a = rnd(0, 6.28), s = rnd(.2, 1) * pw; st.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(.25, .6), max: .6, color, sz: rnd(1, 2.4) }); }
  }, []);
  const floatTxt = useCallback((x, y, t, c, big) => {
    const st = S.current; if (!st) return;
    st.floaters.push({ x, y, t, c, life: 1, vy: -22, sz: big ? 9 : 6 });
  }, []);

  // ── loop ──
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    cv.width = RW; cv.height = RH;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let last = performance.now();

    const hurtPlayer = (dmg) => {
      const st = S.current, p = st.player;
      if (p.invuln > 0 || p.dashT > 0) return;
      const d = Math.max(1, Math.round(dmg - p.defense * 0.1));
      p.hp -= d; p.flash = .25; p.invuln = .6; st.shake = Math.min(7, st.shake + 4);
      stats.current.damageTaken += d;
      floatTxt(p.x, p.y - p.r - 4, `${d}`, '#F87171');
      burst(p.x, p.y, '#DC2626', 8, 70);
      if (p.hp <= 0) {
        // hero falls → next squad member
        burst(p.x, p.y, TYPE_COLORS[p.type] || '#fff', 26, 130);
        st.shake = 8;
        st.heroIdx++;
        if (st.heroIdx >= st.heroes.length) {
          if (!ended.current) { ended.current = true; setTimeout(() => onDefeat?.(stats.current), 700); }
        } else {
          const h = st.heroes[st.heroIdx];
          Object.assign(p, h, { x: RW / 2, y: RH - PAD - 10, vx: 0, vy: 0, r: 9, fireCd: 0, dashCd: 0, dashT: 0, invuln: 1.4, flash: 0, aimX: 0, aimY: -1, face: 1, walkT: 0, recoil: 0, muzzle: 0, trail: [] });
          floatTxt(p.x, p.y - 16, 'GO!', '#F59E0B', true);
        }
      }
    };

    const hitEnemy = (e, dmg, color) => {
      const st = S.current; if (e.state !== 'alive') return;
      const crit = Math.random() < 0.15;
      const d = Math.max(1, Math.round((crit ? dmg * 1.6 : dmg) - e.defense * 0.1));
      e.hp -= d; e.flash = .2; e.hurtT = .15; st.shake = Math.min(6, st.shake + (crit ? 4 : 2));
      stats.current.damageDealt += d;
      floatTxt(e.x, e.y - e.r - 3, `${crit ? '✦' : ''}${d}`, crit ? '#FB923C' : '#FFF', crit);
      burst(e.x, e.y, color, crit ? 12 : 6, crit ? 120 : 80);
      if (e.hp <= 0) { e.state = 'dead'; e.deadT = 0; burst(e.x, e.y, color, 22, 150); st.shake = Math.min(8, st.shake + 5); stats.current.enemiesDefeated++; }
    };

    const step = now => {
      const st = S.current; if (!st) { raf.current = requestAnimationFrame(step); return; }
      let dt = Math.min(.045, (now - last) / 1000); last = now; st.t += dt;
      if (st.bannerT > 0) st.bannerT -= dt;
      const p = st.player;

      // ─ input vector ─
      let ix = 0, iy = 0;
      if (keys.current['w'] || keys.current['arrowup']) iy -= 1;
      if (keys.current['s'] || keys.current['arrowdown']) iy += 1;
      if (keys.current['a'] || keys.current['arrowleft']) ix -= 1;
      if (keys.current['d'] || keys.current['arrowright']) ix += 1;
      if (stick.current.active) { ix += stick.current.dx; iy += stick.current.dy; }
      const il = Math.hypot(ix, iy) || 1; ix /= il > 1 ? il : 1; iy /= il > 1 ? il : 1;

      // ─ player move ─
      const live = st.enemies.filter(e => e.state === 'alive');
      if (p.invuln > 0) p.invuln -= dt;
      if (p.flash > 0) p.flash -= dt;
      if (p.dashCd > 0) p.dashCd -= dt;
      if (p.dashT > 0) p.dashT -= dt;
      if (p.recoil > 0) p.recoil -= dt;
      if (p.muzzle > 0) p.muzzle -= dt;
      if (ix || iy) {
        p.walkT += dt * (p.dashT > 0 ? 18 : 10) * Math.min(1, Math.hypot(ix, iy));
        if (Math.abs(ix) > 0.05) p.face = ix > 0 ? 1 : -1;
      }
      if (dashReq.current && p.dashCd <= 0 && (ix || iy)) {
        p.dashT = .16; p.dashCd = 1.1; p.invuln = Math.max(p.invuln, .22);
        burst(p.x, p.y, '#fff', 10, 90);
      }
      dashReq.current = false;
      const spd = (52 + p.speed * 0.5) * (p.dashT > 0 ? 4.2 : 1);
      p.x = clamp(p.x + ix * spd * dt, PAD + p.r, RW - PAD - p.r);
      p.y = clamp(p.y + iy * spd * dt, PAD + p.r, RH - PAD - p.r);
      if (p.dashT > 0) p.trail.push({ x: p.x, y: p.y, life: 0.5 });
      for (const tr of p.trail) tr.life -= dt * 1.9;
      p.trail = p.trail.filter(tr => tr.life > 0);

      // ─ auto-aim + fire ─
      if (live.length) {
        let tg = live[0], bd = Infinity;
        for (const e of live) { const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2; if (d < bd) { bd = d; tg = e; } }
        const ang = Math.atan2(tg.y - p.y, tg.x - p.x);
        p.aimX = Math.cos(ang); p.aimY = Math.sin(ang);
        p.face = p.aimX >= 0 ? 1 : -1;
        p.fireCd -= dt;
        if (p.fireCd <= 0 && p.dashT <= 0) {
          p.fireCd = clamp(0.42 - p.speed / 400, 0.18, 0.5);
          p.recoil = 0.1; p.muzzle = 0.08;
          const col = TYPE_COLORS[p.type] || '#F59E0B';
          st.bullets.push({ owner: 'p', x: p.x + p.aimX * p.r, y: p.y + p.aimY * p.r, vx: p.aimX * 190, vy: p.aimY * 190, r: 2.6, dmg: p.attack, color: col, life: 1.6 });
          burst(p.x + p.aimX * p.r, p.y + p.aimY * p.r, col, 3, 40);
        }
      }

      // ─ enemies ─
      for (const e of st.enemies) {
        if (e.state === 'dead') { e.deadT += dt; continue; }
        e.bob += dt * 6; if (e.flash > 0) e.flash -= dt; if (e.hurtT > 0) e.hurtT -= dt; if (e.touchCd > 0) e.touchCd -= dt;
        const dx = p.x - e.x, dy = p.y - e.y, dd = Math.hypot(dx, dy) || 1;
        if (e.ranged) {
          // keep distance + shoot
          const want = e.big ? 70 : 60;
          const mv = dd > want + 14 ? 1 : dd < want - 14 ? -0.7 : 0;
          e.x = clamp(e.x + (dx / dd) * (18 + e.speed * 0.25) * mv * dt, PAD + e.r, RW - PAD - e.r);
          e.y = clamp(e.y + (dy / dd) * (18 + e.speed * 0.25) * mv * dt, PAD + e.r, RH - PAD - e.r);
          e.fireCd -= dt;
          if (e.fireCd <= 0) {
            e.fireCd = e.big ? rnd(1.1, 1.6) : rnd(1.4, 2.4);
            const col = TYPE_COLORS[e.type] || '#DC2626';
            const shots = e.big ? 3 : 1, spread = 0.32;
            for (let s = 0; s < shots; s++) {
              const a = Math.atan2(dy, dx) + (s - (shots - 1) / 2) * spread;
              st.bullets.push({ owner: 'e', x: e.x, y: e.y, vx: Math.cos(a) * 95, vy: Math.sin(a) * 95, r: 2.8, dmg: e.attack, color: col, life: 2.4 });
            }
          }
        } else {
          // chase + contact
          e.x = clamp(e.x + (dx / dd) * (20 + e.speed * 0.4) * dt, PAD + e.r, RW - PAD - e.r);
          e.y = clamp(e.y + (dy / dd) * (20 + e.speed * 0.4) * dt, PAD + e.r, RH - PAD - e.r);
          if (dd < e.r + p.r + 1 && e.touchCd <= 0) { e.touchCd = .7; hurtPlayer(e.attack * 0.8); }
        }
      }

      // ─ bullets ─
      for (const b of st.bullets) {
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        if (b.x < PAD || b.x > RW - PAD || b.y < PAD || b.y > RH - PAD) { b.life = 0; burst(b.x, b.y, b.color, 4, 50); continue; }
        if (b.owner === 'p') {
          for (const e of st.enemies) { if (e.state === 'alive' && Math.hypot(e.x - b.x, e.y - b.y) < e.r + b.r) { hitEnemy(e, b.dmg, b.color); b.life = 0; break; } }
        } else {
          if (Math.hypot(p.x - b.x, p.y - b.y) < p.r + b.r) { hurtPlayer(b.dmg); b.life = 0; }
        }
      }
      st.bullets = st.bullets.filter(b => b.life > 0);

      // ─ particles / floaters ─
      for (const q of st.parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= .9; q.vy *= .9; q.life -= dt; }
      st.parts = st.parts.filter(q => q.life > 0);
      for (const f of st.floaters) { f.y += f.vy * dt; f.vy *= .92; f.life -= dt * 1.2; }
      st.floaters = st.floaters.filter(f => f.life > 0);
      if (st.shake > 0) st.shake = Math.max(0, st.shake - dt * 26);

      // ─ win ─
      if (!ended.current && live.length === 0 && st.enemies.length) {
        ended.current = true; setTimeout(() => onVictory?.(stats.current), 700);
      }

      // eslint-disable-next-line react-hooks/immutability
      render(ctx, st);

      // HUD (throttled)
      if (Math.random() < 0.25) setHud({ hp: p.hp, maxHp: p.maxHP, lives: st.heroes.length - st.heroIdx - 1, enemies: live.length, heroEmoji: p.emoji, dashCd: p.dashCd });

      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line
  }, []);

  // ── render ──
  function render(ctx, st) {
    const sx = st.shake ? rnd(-st.shake, st.shake) * .5 : 0;
    const sy = st.shake ? rnd(-st.shake, st.shake) * .5 : 0;
    ctx.save(); ctx.translate(sx, sy);

    // floor tiles
    ctx.fillStyle = '#0b0708'; ctx.fillRect(-4, -4, RW + 8, RH + 8);
    for (let y = PAD; y < RH - PAD; y += 16) {
      for (let x = PAD; x < RW - PAD; x += 16) {
        const odd = ((x + y) / 16) % 2 < 1;
        ctx.fillStyle = odd ? '#241316' : '#1d1013';
        ctx.fillRect(x, y, 16, 16);
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x, y, 16, 1); ctx.fillRect(x, y, 1, 16);
      }
    }
    // props
    for (const pr of st.props) {
      if (pr.k === 'barrel') { ctx.fillStyle = '#5b3a1e'; ctx.fillRect(pr.x - 4, pr.y - 5, 8, 10); ctx.fillStyle = '#3a2412'; ctx.fillRect(pr.x - 4, pr.y - 1, 8, 2); }
      else { ctx.fillStyle = '#c9c2b4'; ctx.fillRect(pr.x - 3, pr.y, 6, 2); ctx.fillRect(pr.x - 1, pr.y - 3, 2, 5); }
    }

    // walls
    ctx.fillStyle = '#160b0d';
    ctx.fillRect(0, 0, RW, WALL); ctx.fillRect(0, RH - WALL, RW, WALL);
    ctx.fillRect(0, 0, WALL, RH); ctx.fillRect(RW - WALL, 0, WALL, RH);
    ctx.fillStyle = '#2a1418';
    for (let x = 0; x < RW; x += 16) { ctx.fillRect(x, WALL - 3, 15, 3); ctx.fillRect(x, RH - WALL, 15, 3); }
    ctx.strokeStyle = '#3a1c20'; ctx.lineWidth = 1; ctx.strokeRect(WALL - .5, WALL - .5, RW - WALL * 2 + 1, RH - WALL * 2 + 1);

    // torches (flicker glow)
    for (const tc of st.torches) {
      const fl = 8 + Math.sin(st.t * 12 + tc.x) * 2;
      const g = ctx.createRadialGradient(tc.x, tc.y, 0, tc.x, tc.y, fl + 12);
      g.addColorStop(0, 'rgba(245,158,11,0.45)'); g.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tc.x, tc.y, fl + 12, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(tc.x - 1, tc.y - 2, 2, 3);
      ctx.fillStyle = '#FCD34D'; ctx.fillRect(tc.x - .5, tc.y - 3, 1, 1);
    }

    // entities sorted by y
    const ents = [];
    for (const e of st.enemies) if (!(e.state === 'dead' && e.deadT > .4)) ents.push(e);
    ents.push(st.player);
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) drawChibi(ctx, e, e === st.player, st);

    // bullets
    for (const b of st.bullets) {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r + 2);
      g.addColorStop(0, '#fff'); g.addColorStop(.5, b.color); g.addColorStop(1, b.color + '00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r + 2, 0, 6.28); ctx.fill();
    }
    // particles
    for (const q of st.parts) { ctx.globalAlpha = Math.max(0, q.life / q.max); ctx.fillStyle = q.color; ctx.fillRect(q.x - q.sz / 2, q.y - q.sz / 2, q.sz, q.sz); }
    ctx.globalAlpha = 1;
    // floaters
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const f of st.floaters) {
      ctx.globalAlpha = Math.min(1, f.life); ctx.font = `${f.sz}px monospace`;
      ctx.fillStyle = '#000'; ctx.fillText(f.t, f.x + .6, f.y + .6);
      ctx.fillStyle = f.c; ctx.fillText(f.t, f.x, f.y);
    }
    ctx.globalAlpha = 1;

    // vignette
    const vg = ctx.createRadialGradient(RW / 2, RH / 2, RH * .35, RW / 2, RH / 2, RH * .8);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, RW, RH);

    // banner
    if (st.bannerT > 0 && st.banner) {
      ctx.globalAlpha = Math.min(1, st.bannerT);
      ctx.font = '16px "Cinzel", serif'; ctx.textAlign = 'center';
      ctx.fillStyle = st.banner === 'BOSS' ? '#F59E0B' : '#F87171';
      ctx.fillText(st.banner, RW / 2, RH / 2 - 24);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawChibi(ctx, e, isPlayer, st) {
    const dead = e.state === 'dead';
    const a = dead ? Math.max(0, 1 - e.deadT * 2.5) : 1;
    if (a <= 0) return;
    const color = TYPE_COLORS[e.type] || (isPlayer ? '#F59E0B' : '#DC2626');
    const bob = Math.sin((e.bob || st.t * 6)) * 1.2;
    const x = Math.round(e.x), y = Math.round(e.y + (dead ? e.deadT * 8 : 0));
    const r = e.r;
    ctx.globalAlpha = a;

    // shadow
    ctx.globalAlpha = a * .35; ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(x, y + r * .7, r * .9, r * .4, 0, 0, 6.28); ctx.fill();
    ctx.globalAlpha = a;

    const flash = e.flash > 0;
    if (isPlayer && !dead) {
      drawDetailedHeroModel(ctx, {
        p: e,
        heroId: e.id,
        heroName: e.name,
        heroRarity: e.rarity,
        heroColor: color,
        isNinja: e.id === 'kage_severed' || e.id === 'raiden_ronin',
        cardArt: e.cardArt,
        cardImage: e.cardImage,
        t: st.t,
      }, x, y, r, a, bob, flash);
      ctx.strokeStyle = e.invuln > 0 && Math.floor(st.t * 12) % 2 ? '#fff' : '#F59E0B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y + bob, r + 2, 0, 6.28);
      ctx.stroke();
      ctx.globalAlpha = 1;
      return;
    }
    // body
    ctx.fillStyle = flash ? '#fff' : shade(color, -.15);
    ctx.fillRect(x - r + 1, y - 2 + bob, (r - 1) * 2, r + 2);
    ctx.fillStyle = flash ? '#fff' : color;
    ctx.fillRect(x - r + 2, y - 3 + bob, (r - 2) * 2, r);
    // outline feet
    ctx.fillStyle = shade(color, -.4);
    ctx.fillRect(x - r + 2, y + r - 4 + bob, 3, 3); ctx.fillRect(x + r - 5, y + r - 4 + bob, 3, 3);

    // head = emoji (gives each card identity)
    ctx.font = `${Math.round(r * 1.5)}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (flash) ctx.globalAlpha = a * .5;
    ctx.fillText(e.emoji, x, y - r + bob);
    ctx.globalAlpha = a;

    // hero aim weapon
    if (isPlayer && !dead) {
      const ax = e.aimX, ay = e.aimY;
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(Math.round(x + ax * (r + 1)) - 1, Math.round(y + ay * (r + 1)) - 1 + bob, 3, 3);
      // gold ring marks the player
      ctx.strokeStyle = e.invuln > 0 && Math.floor(st.t * 12) % 2 ? '#fff' : '#F59E0B';
      ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y + bob, r + 2, 0, 6.28); ctx.stroke();
    }

    // enemy hp pip bar
    if (!isPlayer && !dead) {
      const bw = r * 2, bx = x - r, by = y - r * 1.9 + bob;
      ctx.fillStyle = '#000'; ctx.fillRect(bx - 1, by - 1, bw + 2, 3);
      ctx.fillStyle = '#3a1416'; ctx.fillRect(bx, by, bw, 1);
      ctx.fillStyle = e.big ? '#F59E0B' : '#EF4444'; ctx.fillRect(bx, by, bw * clamp(e.hp / e.maxHP, 0, 1), 1);
    }
    ctx.globalAlpha = 1;
  }

  // ── on-screen stick (touch + mouse) ──
  const baseRef = useRef(null);
  const startStick = (cx, cy, id) => {
    const b = baseRef.current.getBoundingClientRect();
    stick.current = { active: true, dx: 0, dy: 0, id, ox: b.left + b.width / 2, oy: b.top + b.height / 2 };
  };
  const moveStick = (cx, cy) => {
    if (!stick.current.active) return;
    let dx = cx - stick.current.ox, dy = cy - stick.current.oy;
    const m = Math.hypot(dx, dy) || 1, max = 34;
    const k = Math.min(1, m / max);
    stick.current.dx = (dx / m) * k; stick.current.dy = (dy / m) * k;
    setThumb({ x: (dx / m) * Math.min(m, max), y: (dy / m) * Math.min(m, max) });
  };
  const endStick = () => { stick.current = { active: false, dx: 0, dy: 0, id: null, ox: 0, oy: 0 }; setThumb({ x: 0, y: 0 }); };
  const [thumb, setThumb] = useState({ x: 0, y: 0 });

  const hpPct = clamp(hud.hp / hud.maxHp, 0, 1);

  return (
    <div style={{ width: '100%', maxWidth: 640, margin: '0 auto', userSelect: 'none' }}>
      {/* HUD */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ color: '#F5F0F0', display: 'grid', placeItems: 'center' }}><Icon glyph={hud.heroEmoji} size={18} /></span>
        <div style={{ flex: 1, minWidth: 120, background: '#1C0A0A', borderRadius: 6, height: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: `${hpPct * 100}%`, height: '100%', background: hpPct > .3 ? 'linear-gradient(90deg,#16A34A,#22C55E)' : '#DC2626', transition: 'width .15s' }} />
        </div>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.7rem', color: '#F5F0F0' }}>{Math.max(0, Math.round(hud.hp))}/{hud.maxHp}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '.75rem', color: '#9CA3AF' }}><Icon name="hp" size={13} />×{hud.lives}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.75rem', color: '#F87171', marginLeft: 'auto' }}><Icon name="monster" size={13} /> {hud.enemies}</span>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12, imageRendering: 'pixelated', border: '2px solid rgba(220,38,38,0.3)', boxShadow: '0 0 40px rgba(220,38,38,0.18)', background: '#0b0708', touchAction: 'none' }} />

        {/* Mobile joystick */}
        <div
          ref={baseRef}
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); startStick(e.clientX, e.clientY, e.pointerId); }}
          onPointerMove={e => moveStick(e.clientX, e.clientY)}
          onPointerUp={endStick} onPointerCancel={endStick}
          style={{ position: 'absolute', left: 12, bottom: 12, width: 84, height: 84, borderRadius: '50%', background: 'rgba(13,6,8,0.5)', border: '2px solid rgba(255,255,255,0.18)', touchAction: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 38, height: 38, marginLeft: -19, marginTop: -19, borderRadius: '50%', background: 'rgba(220,38,38,0.6)', border: '2px solid rgba(255,255,255,0.3)', transform: `translate(${thumb.x}px,${thumb.y}px)` }} />
        </div>

        {/* Dash button */}
        <button onPointerDown={() => { dashReq.current = true; }}
          style={{ position: 'absolute', right: 14, bottom: 16, width: 64, height: 64, borderRadius: '50%', background: hud.dashCd > 0 ? 'rgba(28,10,10,0.7)' : 'linear-gradient(160deg,#1C0A0A,#0D0608)', border: `2px solid ${hud.dashCd > 0 ? '#3A1515' : '#DC2626'}`, color: '#F5F0F0', display: 'grid', placeItems: 'center', cursor: 'pointer', boxShadow: hud.dashCd > 0 ? 'none' : '0 0 16px rgba(220,38,38,0.4)' }}>
          <Icon name="speed" size={26} />
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 10, color: '#6B7280', fontSize: '.72rem' }}>
        Move: <b>WASD / arrows</b> or the left stick · Dash: <b>Space</b> · <b>Auto</b>-fire at the nearest. Clear the room!
      </div>
    </div>
  );
}
