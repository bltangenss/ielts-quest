import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { TYPE_COLORS } from '../../data/arenaAbilities';
import { getCardArt } from '../../data/cardArt';
import { drawCreature } from './bestiary';
import { biomeForRoom, isMiniBossRoom, biomeEnemyEmoji, paintDecor, stepWeather, paintWeather } from './biomes';
import { rollWeaponDrop, starterWeaponFor } from './arenaWeapons';
import { Icon } from '../Icon';

// ════════════════════════════════════════════════════════════════════
// DUNGEON WORLD — open, multi-room dungeon you walk through (not one box).
// Rooms are connected by doors/corridors. Camera follows the hero.
// A room's doors stay sealed until its enemies are cleared, then open;
// walk through a door → next room loads. Boss room every 5th room.
// World coords are large; the canvas is a viewport that scrolls.
// ════════════════════════════════════════════════════════════════════

const VW = 560, VH = 340;          // viewport (low-res, pixelated)
const ROOM = 640;                  // room interior square
const WALL = 16;                   // wall thickness
const DOOR = 46;                   // door opening width
const RANGED = new Set(['Arcane', 'Wind', 'Void']);
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function shade(hex, f) {
  if (hex[0] !== '#') return hex;
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = clamp(Math.round(r + (f < 0 ? r : 255 - r) * f), 0, 255);
  g = clamp(Math.round(g + (f < 0 ? g : 255 - g) * f), 0, 255);
  b = clamp(Math.round(b + (f < 0 ? b : 255 - b) * f), 0, 255);
  return `rgb(${r},${g},${b})`;
}

// A room is a square. It can have doors on N/E/S/W leading to the next room.
// We lay rooms out along a meandering path; each room has an entry door (where
// you came in) and one exit door (to the next room). Cleared rooms open both.
const DIRS = { N: { x: 0, y: -1 }, S: { x: 0, y: 1 }, E: { x: 1, y: 0 }, W: { x: -1, y: 0 } };
const OPP = { N: 'S', S: 'N', E: 'W', W: 'E' };

export const BiomeWorld = forwardRef(function BiomeWorld(
  { hero, enemyPool, onRoomClear, onRunEnd }, ref
) {
  const canvasRef = useRef(null);
  const G = useRef(null);
  const raf = useRef(0);
  const keys = useRef({});
  const stick = useRef({ active: false, dx: 0, dy: 0 });
  const dashReq = useRef(false);
  const [thumb, setThumb] = useState({ x: 0, y: 0 });
  const [hud, setHud] = useState({ hp: 1, maxHp: 1, room: 1, enemies: 0, dashReady: true, dmg: 0, gold: 0, boss: false, cleared: false, weaponName: 'Bare Hands', weaponColor: '#A78BFA' });

  const NINJA_IDS = ['kage_severed', 'raiden_ronin'];
  const ninjaStyle = hero?.id === 'kage_severed' ? 'shadow' : hero?.id === 'raiden_ronin' ? 'storm' : null;
  const isNinja = NINJA_IDS.includes(hero?.id);

  // ── init ──
  useEffect(() => {
    const heroColor = ninjaStyle === 'shadow' ? '#DC2626' : ninjaStyle === 'storm' ? '#A78BFA' : (TYPE_COLORS[hero.type] || '#DC2626');
    const cardArt = getCardArt(hero.id);
    const cardImage = cardArt ? new Image() : null;
    if (cardImage) cardImage.src = cardArt.atlas;
    const starterWeapon = starterWeaponFor(hero.id);
    G.current = {
      heroColor, isNinja, ninjaStyle, cardArt, cardImage, weapon: starterWeapon, weaponToast: 2.2,
      stats: {
        maxHP: hero.maxHP, hp: hero.maxHP, baseDmg: hero.attack, dmgMult: 1, fireBase: 0.5, fireMult: 1,
        shots: 1, spread: 0.18, pierce: isNinja ? 1 : 0, crit: isNinja ? 0.2 : 0.1, lifesteal: 0,
        moveMult: 1, dashCdMult: isNinja ? 0.65 : 1, bulletSize: 1, bounce: false, regen: 0,
        chain: isNinja ? 1 : 0, speed: hero.speed || 55, defense: hero.defense || 8,
      },
      p: { x: 0, y: 0, r: 11, aimX: 0, aimY: -1, fireCd: 0, dashCd: 0, dashT: 0, invuln: 1.2, flash: 0, face: 1, trail: [], walkT: 0, recoil: 0, muzzle: 0 },
      clones: [],
      cam: { x: 0, y: 0 },
      roomIndex: 0, room: null, enemies: [], bullets: [], parts: [], floaters: [], coins: [], bolts: [], weaponDrops: [],
      cleared: false, paused: false, ended: false, freeze: 0, shake: 0, t: 0,
      banner: '', bannerT: 0, transition: 0, transitionDir: null, portalBurst: 0,
      gold: 0, stat: { dmgDealt: 0, kills: 0, roomsCleared: 0, gold: 0, upg: 0 },
    };
    loadRoom(0, 'S'); // first room, hero enters from the south side
    // eslint-disable-next-line
  }, []);

  // Build a room at a given index. enterFrom = which wall the hero comes in by.
  function loadRoom(index, enterFrom) {
    const g = G.current; if (!g) return;
    const biome = biomeForRoom(index);
    const isBoss = isMiniBossRoom(index);   // every 3rd room = biome mini-boss
    g.biome = biome;
    if (!g.weather) g.weather = [];

    // Boss rooms still lead onward; the run ends only when the hero dies.
    const choices = ['N', 'E', 'W', 'S'].filter(d => d !== enterFrom);
    const exitDir = choices[Math.floor(rnd(0, choices.length - 0.001))];

    const room = {
      index, isBoss,
      x: 0, y: 0, w: ROOM, h: ROOM,        // interior local coords 0..ROOM
      enterFrom, exitDir,
      doors: { N: false, E: false, S: false, W: false },
      cleared: false,
    };
    // entry door exists (came from there); exit door opens after the room is clear
    room.doors[enterFrom] = 'entry';
    if (exitDir) room.doors[exitDir] = 'exit';

    g.room = room;
    g.roomIndex = index;
    g.cleared = false;
    g.portalBurst = 0;
    g.weaponDrops = [];

    // place hero just inside the entry door
    const m = WALL + 14;
    const ip = doorCenter(room, enterFrom);
    g.p.x = clamp(ip.x - DIRS[enterFrom].x * m, WALL + 10, ROOM - WALL - 10);
    g.p.y = clamp(ip.y - DIRS[enterFrom].y * m, WALL + 10, ROOM - WALL - 10);
    g.cam.x = g.p.x - VW / 2; g.cam.y = g.p.y - VH / 2;

    // spawn enemies (hardcore scaling by room index)
    spawnEnemies(index, isBoss);

    g.banner = isBoss ? `${biome.name}: WARDEN` : `${biome.name}: ROOM ${index + 1}`;
    g.bannerT = 1.8; g.warnT = 1.0;
    const decor = biome.decor || ['bones'];
    g.props = Array.from({ length: 7 }, () => ({ x: rnd(WALL + 20, ROOM - WALL - 20), y: rnd(WALL + 20, ROOM - WALL - 20), k: decor[Math.floor(Math.random() * decor.length)] }));
    g.torches = [{ x: WALL + 6, y: WALL + 6 }, { x: ROOM - WALL - 6, y: WALL + 6 }, { x: WALL + 6, y: ROOM - WALL - 6 }, { x: ROOM - WALL - 6, y: ROOM - WALL - 6 }];
    if (index === 0) spawnWeaponDrop(g.p.x + 58, g.p.y - 32, true);
  }

  function doorCenter(room, dir) {
    const c = ROOM / 2;
    if (dir === 'N') return { x: c, y: WALL / 2 };
    if (dir === 'S') return { x: c, y: ROOM - WALL / 2 };
    if (dir === 'W') return { x: WALL / 2, y: c };
    return { x: ROOM - WALL / 2, y: c }; // E
  }

  function spawnEnemies(index, isBoss) {
    const g = G.current;
    const biome = g.biome;
    const n = index + 1;
    const hpScale = 1.0 + n * 0.2, dmgScale = 0.9 + n * 0.1;
    const N = enemyPool.filter(e => e.tier === 'normal'), E = enemyPool.filter(e => e.tier === 'elite'), B = enemyPool.filter(e => e.tier === 'boss');
    const rp = a => a[Math.floor(Math.random() * a.length)];
    // find a base stat block whose creature matches an emoji, else any of tier
    const baseFor = (tier, emoji) => {
      const pool = tier === 'boss' ? B : tier === 'elite' ? E : N;
      const match = pool.find(d => (d.creatures ? d.creatures[0].emoji : d.emoji) === emoji);
      return match || rp(pool.length ? pool : N);
    };
    g.enemies = [];
    const add = (tier, big, m = 1, delay = 0) => {
      const emoji = biomeEnemyEmoji(biome, tier);
      const def = baseFor(tier, emoji);
      const c = def.creatures ? def.creatures[0] : def;
      const px = rnd(WALL + 24, ROOM - WALL - 24), py = rnd(WALL + 20, ROOM * 0.55);
      g.enemies.push({
        id: `e${index}_${g.enemies.length}`, emoji, type: c.type,
        maxHP: Math.max(30, Math.round(c.hp * hpScale * m)), hp: 0,
        attack: Math.max(6, Math.round(c.attack * dmgScale)), defense: c.defense, speed: c.speed,
        x: px, y: py, r: big ? 15 : 8, ranged: RANGED.has(c.type), fireCd: rnd(0.8, 1.8), windup: 0,
        flash: 0, hurtT: 0, state: 'alive', deadT: 0, bob: rnd(0, 6.28), touchCd: 0, big,
        gold: big ? Math.round(rnd(30, 55)) : Math.round(rnd(3, 8)), spawnT: delay,
      });
    };
    if (isBoss) {
      add('boss', true, 1.5 + n * 0.09);
      const escorts = Math.min(6, 2 + Math.floor(n / 5));
      for (let i = 0; i < escorts; i++) add('elite', false, 1.2, rnd(0.3, 2));
    } else {
      const count = Math.min(16, 4 + Math.floor(n * 1.0));
      const ec = n >= 2 ? Math.min(5, Math.floor(n / 2)) : 0;
      for (let i = 0; i < ec; i++) add('elite', false, 1.35, rnd(0, 2));
      for (let i = 0; i < count - ec; i++) add('normal', false, 1, rnd(0, 3));
    }
    g.enemies.forEach(e => { e.hp = e.maxHP; });
  }

  useImperativeHandle(ref, () => ({
    applyUpgrade(u) { const g = G.current; if (g && u?.apply) { u.apply(g.stats); g.stat.upg++; } },
    getStats() { return G.current?.stat; },
  }));

  // ── input ──
  useEffect(() => {
    // Map by physical key code so WASD works on any keyboard layout (e.g. Cyrillic).
    const codeKey = e => ({ KeyW: 'w', KeyA: 'a', KeyS: 's', KeyD: 'd', ArrowUp: 'arrowup', ArrowDown: 'arrowdown', ArrowLeft: 'arrowleft', ArrowRight: 'arrowright' }[e.code]) || e.key.toLowerCase();
    const dn = e => { keys.current[codeKey(e)] = true; if (e.key === ' ' || e.code === 'Space') { dashReq.current = true; e.preventDefault(); } };
    const up = e => { keys.current[codeKey(e)] = false; };
    window.addEventListener('keydown', dn); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);

  function burst(x, y, c, n, pw) { const g = G.current; for (let i = 0; i < n; i++) { const a = rnd(0, 6.28), s = rnd(.2, 1) * pw; g.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(.25, .55), max: .55, color: c, sz: rnd(1, 2.6) }); } }
  function ftext(x, y, t, c, big) { G.current.floaters.push({ x, y, t, c, life: 1, vy: -20, sz: big ? 11 : 7 }); }
  function bolt(x1, y1, x2, y2, color) { G.current.bolts.push({ x1, y1, x2, y2, color, life: .14, max: .14 }); }
  function spawnWeaponDrop(x, y, guaranteed = false) {
    const g = G.current; if (!g) return;
    const weapon = rollWeaponDrop(g.roomIndex, guaranteed);
    g.weaponDrops.push({ ...weapon, dropId: `${weapon.id}_${g.roomIndex}_${g.weaponDrops.length}_${Date.now()}`, x, y, bob: rnd(0, 6.28), life: 24, picked: false });
  }
  function equipWeapon(drop) {
    const g = G.current; if (!g) return;
    g.weapon = { ...drop };
    g.weaponToast = 2.8;
    burst(drop.x, drop.y, drop.color, 24, 140);
    ftext(drop.x, drop.y - 16, drop.name, drop.color, true);
  }

  // ── loop ──
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    cv.width = VW; cv.height = VH;
    const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    let last = performance.now();

    const hurtHero = (dmg) => {
      const g = G.current, p = g.p, s = g.stats;
      if (p.invuln > 0 || p.dashT > 0 || g.ended) return;
      const d = Math.max(1, Math.round(dmg - s.defense * 0.1));
      s.hp -= d; p.flash = .25; p.invuln = .7; g.shake = Math.min(9, g.shake + 5); g.freeze = .05;
      ftext(p.x, p.y - p.r - 5, `${d}`, '#F87171'); burst(p.x, p.y, '#DC2626', 9, 80);
      if (s.hp <= 0) { s.hp = 0; g.ended = true; burst(p.x, p.y, g.heroColor, 32, 160); setTimeout(() => onRunEnd?.({ ...g.stat, room: g.roomIndex + 1 }), 700); }
    };
    const hitEnemy = (e, dmg, color, fromChain) => {
      const g = G.current, s = g.stats; if (e.state !== 'alive') return;
      const crit = Math.random() < s.crit;
      const d = Math.max(1, Math.round((crit ? dmg * 1.7 : dmg) - e.defense * 0.1));
      e.hp -= d; e.flash = .2; e.hurtT = .12; g.shake = Math.min(7, g.shake + (crit ? 4 : 2)); g.freeze = crit ? .045 : .02;
      g.stat.dmgDealt += d;
      ftext(e.x, e.y - e.r - 4, `${crit ? '✦' : ''}${d}`, crit ? '#FB923C' : '#FFF', crit);
      burst(e.x, e.y, color, crit ? 12 : 6, crit ? 120 : 80);
      if (s.lifesteal > 0) s.hp = Math.min(s.maxHP, s.hp + Math.max(1, Math.round(d * s.lifesteal)));
      if (s.chain > 0 && !fromChain) {
        let near = null, nd = 46;
        for (const o of g.enemies) if (o.state === 'alive' && o !== e) { const dd = Math.hypot(o.x - e.x, o.y - e.y); if (dd < nd) { nd = dd; near = o; } }
        if (near) { bolt(e.x, e.y, near.x, near.y, '#C4B5FD'); hitEnemy(near, dmg * 0.6, '#C4B5FD', true); }
      }
      if (e.hp <= 0) { e.state = 'dead'; e.deadT = 0; burst(e.x, e.y, color, 22, 150); g.shake = Math.min(9, g.shake + 5); g.freeze = .06; g.stat.kills++; if (e.big || Math.random() < 0.22) spawnWeaponDrop(e.x, e.y, e.big); for (let i = 0; i < (e.big ? 6 : 2); i++) g.coins.push({ x: e.x, y: e.y, vx: rnd(-40, 40), vy: rnd(-60, -20), life: 8, val: Math.max(1, Math.round(e.gold / (e.big ? 6 : 2))) }); }
    };

    const inWall = (x, y, room, r) => {
      // returns true if point is inside wall (collision). Doors are gaps.
      const lo = WALL, hi = ROOM - WALL, c = ROOM / 2, hd = DOOR / 2;
      // open door gap check
      const open = (dir) => room.doors[dir] === 'exit' && room.cleared;
      if (y < lo + r) { if (!(open('N') && Math.abs(x - c) < hd)) return true; }
      if (y > hi - r) { if (!(open('S') && Math.abs(x - c) < hd)) return true; }
      if (x < lo + r) { if (!(open('W') && Math.abs(y - c) < hd)) return true; }
      if (x > hi - r) { if (!(open('E') && Math.abs(y - c) < hd)) return true; }
      return false;
    };

    // keep an entity strictly inside the room; only let it cross a wall band
    // when it is aligned with an OPEN door gap (so it can walk through doorways)
    const hardClamp = (o, room) => {
      const lo = WALL, hi = ROOM - WALL, c = ROOM / 2, hd = DOOR / 2, r = o.r;
      const open = (dir) => room.doors[dir] === 'exit' && room.cleared;
      const inGapNS = Math.abs(o.x - c) < hd - 2;
      const inGapEW = Math.abs(o.y - c) < hd - 2;
      // top
      if (o.y < lo + r && !(open('N') && inGapNS)) o.y = lo + r;
      if (o.y > hi - r && !(open('S') && inGapNS)) o.y = hi - r;
      if (o.x < lo + r && !(open('W') && inGapEW)) o.x = lo + r;
      if (o.x > hi - r && !(open('E') && inGapEW)) o.x = hi - r;
      // don't let them wander out of the doorway sideways while in the wall band
      if (o.y < lo + r && open('N') && inGapNS) o.x = clamp(o.x, c - hd + r, c + hd - r);
      if (o.y > hi - r && open('S') && inGapNS) o.x = clamp(o.x, c - hd + r, c + hd - r);
      if (o.x < lo + r && open('W') && inGapEW) o.y = clamp(o.y, c - hd + r, c + hd - r);
      if (o.x > hi - r && open('E') && inGapEW) o.y = clamp(o.y, c - hd + r, c + hd - r);
      // absolute outer bound (never escape the room footprint)
      o.x = clamp(o.x, 2, ROOM - 2); o.y = clamp(o.y, 2, ROOM - 2);
    };

    const step = now => {
      const g = G.current; if (!g) { raf.current = requestAnimationFrame(step); return; }
      let dt = Math.min(.045, (now - last) / 1000); last = now;
      if (g.freeze > 0) { g.freeze -= dt; render(ctx, g); raf.current = requestAnimationFrame(step); return; }
      if (g.ended) { render(ctx, g); raf.current = requestAnimationFrame(step); return; }
      g.t += dt; if (g.bannerT > 0) g.bannerT -= dt; if (g.warnT > 0) g.warnT -= dt; if (g.portalBurst > 0) g.portalBurst = Math.max(0, g.portalBurst - dt); if (g.weaponToast > 0) g.weaponToast = Math.max(0, g.weaponToast - dt);
      const p = g.p, s = g.stats, room = g.room;

      // input
      let ix = 0, iy = 0;
      if (keys.current['w'] || keys.current['arrowup']) iy -= 1;
      if (keys.current['s'] || keys.current['arrowdown']) iy += 1;
      if (keys.current['a'] || keys.current['arrowleft']) ix -= 1;
      if (keys.current['d'] || keys.current['arrowright']) ix += 1;
      if (stick.current.active) { ix += stick.current.dx; iy += stick.current.dy; }
      const il = Math.hypot(ix, iy); if (il > 1) { ix /= il; iy /= il; }
      if (ix) p.face = ix < 0 ? -1 : 1;
      p.walkT += (il ? dt * 9 : 0);

      if (p.invuln > 0) p.invuln -= dt;
      if (p.flash > 0) p.flash -= dt;
      if (p.dashCd > 0) p.dashCd -= dt;
      if (p.dashT > 0) p.dashT -= dt;
      if (p.recoil > 0) p.recoil -= dt;
      if (p.muzzle > 0) p.muzzle -= dt;
      if (s.regen > 0) s.hp = Math.min(s.maxHP, s.hp + s.regen * dt);

      if (dashReq.current && p.dashCd <= 0 && (ix || iy)) {
        p.dashT = .18; p.dashCd = 1.0 * s.dashCdMult; p.invuln = Math.max(p.invuln, .28); p.dashDirX = ix; p.dashDirY = iy;
        if (g.ninjaStyle === 'storm') { burst(p.x, p.y, '#A78BFA', 14, 110); bolt(p.x, p.y, p.x + ix * 60, p.y + iy * 60, '#C4B5FD'); }
        else if (g.ninjaStyle === 'shadow') { burst(p.x, p.y, '#DC2626', 12, 100); g.clones.push({ x: p.x, y: p.y, face: p.face, life: .55, max: .55, struck: false }); }
        else burst(p.x, p.y, '#fff', 10, 80);
      }
      dashReq.current = false;

      const moveSpd = (50 + s.speed * 0.5) * s.moveMult * (p.dashT > 0 ? (g.isNinja ? 6 : 4.5) : 1);
      const mdx = p.dashT > 0 ? p.dashDirX : ix, mdy = p.dashT > 0 ? p.dashDirY : iy;
      // move with wall collision (axis-separated)
      let nx = p.x + mdx * moveSpd * dt, ny = p.y + mdy * moveSpd * dt;
      if (!inWall(nx, p.y, room, p.r)) p.x = nx;
      if (!inWall(p.x, ny, room, p.r)) p.y = ny;
      // hard clamp: never sit inside a wall unless aligned with an OPEN door gap
      hardClamp(p, room);

      // door transition: if cleared and hero steps into the exit door gap, go next room
      if (g.cleared && room.exitDir && !g.transition) {
        const c = ROOM / 2, hd = DOOR / 2; const d = room.exitDir;
        const atDoor =
          (d === 'N' && p.y < WALL + 4 && Math.abs(p.x - c) < hd) ||
          (d === 'S' && p.y > ROOM - WALL - 4 && Math.abs(p.x - c) < hd) ||
          (d === 'W' && p.x < WALL + 4 && Math.abs(p.y - c) < hd) ||
          (d === 'E' && p.x > ROOM - WALL - 4 && Math.abs(p.y - c) < hd);
        if (atDoor) {
          g.transition = 0.5; g.transitionDir = d;
          setTimeout(() => { if (G.current && !G.current.ended) loadRoom(G.current.roomIndex + 1, OPP[d]); G.current.transition = 0; }, 260);
        }
      }
      if (g.transition > 0) g.transition -= dt;

      // trail / clones
      if (p.dashT > 0) { p.trail.push({ x: p.x, y: p.y, life: .3 }); if (g.isNinja) { const col = g.ninjaStyle === 'shadow' ? '#F87171' : '#C4B5FD'; for (const e of g.enemies) if (e.state === 'alive' && Math.hypot(e.x - p.x, e.y - p.y) < e.r + p.r + 2) hitEnemy(e, s.baseDmg * s.dmgMult * 0.8, col); } }
      for (const tr of p.trail) tr.life -= dt; p.trail = p.trail.filter(t => t.life > 0);
      for (const cl of g.clones) { cl.life -= dt; if (!cl.struck && cl.life < cl.max - .12) { cl.struck = true; for (const e of g.enemies) if (e.state === 'alive' && Math.hypot(e.x - cl.x, e.y - cl.y) < 30) { hitEnemy(e, s.baseDmg * s.dmgMult * 0.7, '#F87171'); bolt(cl.x, cl.y, e.x, e.y, '#7F1D1D'); } } }
      g.clones = g.clones.filter(c => c.life > 0);

      const live = g.enemies.filter(e => e.state === 'alive');

      // auto-fire
      if (live.length) {
        let tg = live[0], bd = Infinity; for (const e of live) { const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2; if (d < bd) { bd = d; tg = e; } }
        const ang = Math.atan2(tg.y - p.y, tg.x - p.x); p.aimX = Math.cos(ang); p.aimY = Math.sin(ang);
        p.fireCd -= dt;
        if (p.fireCd <= 0 && p.dashT <= 0) {
          const weapon = g.weapon || {};
          const n = Math.min(8, s.shots + Math.max(0, (weapon.shots || 1) - 1));
          const spread = n > 1 ? Math.max(s.spread, weapon.spread || 0.18) : 0;
          const speed = weapon.speed || 175;
          const color = weapon.color || g.heroColor;
          p.fireCd = clamp((weapon.fireBase || s.fireBase) / s.fireMult, 0.12, 0.85);
          for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2) * spread; const a = ang + off; g.bullets.push({ owner: 'p', x: p.x + Math.cos(a) * (p.r + 2), y: p.y + Math.sin(a) * (p.r + 2), vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r: (weapon.size || 2.6) * s.bulletSize, dmg: s.baseDmg * s.dmgMult * (weapon.damage || 1), color, life: weapon.life || 1.7, pierce: s.pierce + (weapon.pierce || 0), bounced: 0, hitIds: [], weaponId: weapon.id }); }
          p.recoil = .12; p.muzzle = .08;
        }
      }

      // enemies
      for (const e of g.enemies) {
        if (e.state === 'dead') { e.deadT += dt; continue; }
        e.bob += dt * 6; if (e.flash > 0) e.flash -= dt; if (e.hurtT > 0) e.hurtT -= dt; if (e.touchCd > 0) e.touchCd -= dt; if (e.windup > 0) e.windup -= dt;
        if (e.spawnT > 0) { e.spawnT -= dt; continue; }
        if (g.warnT > 0) continue;
        const dx = p.x - e.x, dy = p.y - e.y, dd = Math.hypot(dx, dy) || 1;
        if (e.ranged) {
          const want = e.big ? 90 : 70, mv = dd > want + 12 ? 1 : dd < want - 12 ? -.7 : 0;
          let ex = e.x + (dx / dd) * (16 + e.speed * 0.2) * mv * dt, ey = e.y + (dy / dd) * (16 + e.speed * 0.2) * mv * dt;
          if (!inWall(ex, e.y, room, e.r)) e.x = ex; if (!inWall(e.x, ey, room, e.r)) e.y = ey;
          e.fireCd -= dt;
          if (e.fireCd <= 0.32 && e.windup <= 0 && e.fireCd > 0) e.windup = e.fireCd;
          if (e.fireCd <= 0) { e.fireCd = e.big ? rnd(1.2, 1.7) : rnd(1.6, 2.5); const col = TYPE_COLORS[e.type] || '#DC2626', sh = e.big ? 5 : 1; for (let i = 0; i < sh; i++) { const a = Math.atan2(dy, dx) + (i - (sh - 1) / 2) * 0.26; g.bullets.push({ owner: 'e', x: e.x, y: e.y, vx: Math.cos(a) * 90, vy: Math.sin(a) * 90, r: 3, dmg: e.attack, color: col, life: 3.0 }); } }
        } else {
          let ex = e.x + (dx / dd) * (18 + e.speed * 0.4) * dt, ey = e.y + (dy / dd) * (18 + e.speed * 0.4) * dt;
          if (!inWall(ex, e.y, room, e.r)) e.x = ex; if (!inWall(e.x, ey, room, e.r)) e.y = ey;
          if (dd < e.r + p.r + 1 && e.touchCd <= 0) { e.touchCd = .7; hurtHero(e.attack * 0.95); }
        }
      }

      // bullets (bounded by room walls; player bullets blocked by walls except doors)
      for (const b of g.bullets) {
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        if (inWall(b.x, b.y, room, b.r)) {
          if (b.owner === 'p' && s.bounce && b.bounced < 2) { b.vx *= -1; b.vy *= -1; b.bounced++; b.x += b.vx * dt; b.y += b.vy * dt; }
          else { b.life = 0; burst(b.x, b.y, b.color, 3, 40); continue; }
        }
        if (b.owner === 'p') { for (const e of live) { if (e.state === 'alive' && !b.hitIds.includes(e.id) && Math.hypot(e.x - b.x, e.y - b.y) < e.r + b.r) { hitEnemy(e, b.dmg, b.color); b.hitIds.push(e.id); if (b.pierce > 0) b.pierce--; else { b.life = 0; break; } } } }
        else { if (Math.hypot(p.x - b.x, p.y - b.y) < p.r + b.r) { hurtHero(b.dmg); b.life = 0; } }
      }
      g.bullets = g.bullets.filter(b => b.life > 0);

      // coins
      for (const c of g.coins) { c.vy += 120 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.life -= dt; const dd = Math.hypot(p.x - c.x, p.y - c.y); if (dd < 34) { c.x += (p.x - c.x) * 0.25; c.y += (p.y - c.y) * 0.25; } if (dd < p.r + 4) { c.collected = true; g.gold += c.val; g.stat.gold += c.val; } }
      g.coins = g.coins.filter(c => c.life > 0 && !c.collected);
      for (const w of g.weaponDrops) {
        w.life -= dt;
        w.bob += dt * 5;
        const dd = Math.hypot(p.x - w.x, p.y - w.y);
        if (dd < 78) { w.x += (p.x - w.x) * 0.16; w.y += (p.y - w.y) * 0.16; }
        if (dd < p.r + 14) { w.picked = true; equipWeapon(w); }
      }
      g.weaponDrops = g.weaponDrops.filter(w => w.life > 0 && !w.picked);
      for (const q of g.parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= .9; q.vy *= .9; q.life -= dt; } g.parts = g.parts.filter(q => q.life > 0);
      for (const f of g.floaters) { f.y += f.vy * dt; f.vy *= .92; f.life -= dt * 1.1; } g.floaters = g.floaters.filter(f => f.life > 0);
      for (const bl of g.bolts) bl.life -= dt; g.bolts = g.bolts.filter(b => b.life > 0);
      if (g.shake > 0) g.shake = Math.max(0, g.shake - dt * 26);
      if (!g.weather) g.weather = [];
      stepWeather(g.biome, g.weather, dt, VW, VH, g.t);

      // room cleared → open doors, offer upgrade (every 5th = boss room)
      if (!g.cleared && live.length === 0 && g.enemies.length) {
        g.cleared = true; g.room.cleared = true; g.stat.roomsCleared++;
        g.portalBurst = 1.2;
        burst(ROOM / 2, ROOM / 2, '#F59E0B', 18, 120);
        g.banner = g.room.isBoss ? 'WARDEN DOWN, PORTAL OPEN' : 'CLEARED, DOOR OPEN'; g.bannerT = 2.2;
        const offerUpgrade = g.room.isBoss;
        setTimeout(() => onRoomClear?.(g.roomIndex + 1, g.room.isBoss, offerUpgrade, !room.exitDir), 250);
      }

      // camera follows hero (smooth), clamped a bit beyond room so walls show
      g.cam.x += ((p.x - VW / 2) - g.cam.x) * Math.min(1, dt * 6);
      g.cam.y += ((p.y - VH / 2) - g.cam.y) * Math.min(1, dt * 6);
      g.cam.x = clamp(g.cam.x, -WALL - 8, ROOM - VW + WALL + 8);
      g.cam.y = clamp(g.cam.y, -WALL - 8, ROOM - VH + WALL + 8);

      render(ctx, g);
      if (Math.random() < 0.3) setHud({ hp: s.hp, maxHp: s.maxHP, room: g.roomIndex + 1, enemies: live.length, dashReady: p.dashCd <= 0, dmg: Math.round(s.baseDmg * s.dmgMult * (g.weapon?.damage || 1)), gold: g.gold, boss: g.room.isBoss, cleared: g.cleared, weaponName: g.weapon?.name || 'Bare Hands', weaponColor: g.weapon?.color || g.heroColor });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line
  }, []);

  // ── render (world → viewport via camera) ──
  function render(ctx, g) {
    const room = g.room; if (!room) return;
    const sx = g.shake ? rnd(-g.shake, g.shake) * .5 : 0, sy = g.shake ? rnd(-g.shake, g.shake) * .5 : 0;
    const camx = g.cam.x - sx, camy = g.cam.y - sy;
    const X = wx => Math.round(wx - camx), Y = wy => Math.round(wy - camy);

    const biome = g.biome;
    // void background (biome-tinted)
    ctx.fillStyle = '#050304'; ctx.fillRect(0, 0, VW, VH);

    // floor tiles (biome painter)
    paintFloorClipped(ctx, biome, X, Y, g.t);
    // props (biome decor)
    for (const pr of g.props) { const px = X(pr.x), py = Y(pr.y); if (px < -12 || px > VW + 12 || py < -12 || py > VH + 12) continue; paintDecor(ctx, biome, pr, px, py, g.t); }

    // walls with door gaps
    drawWalls(ctx, g, X, Y);

    // torches (biome glow color)
    for (const tc of g.torches) { const px = X(tc.x), py = Y(tc.y); const fl = 8 + Math.sin(g.t * 12 + tc.x) * 2; const gr = ctx.createRadialGradient(px, py, 0, px, py, fl + 12); gr.addColorStop(0, biome.torch); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, fl + 12, 0, 6.28); ctx.fill(); ctx.fillStyle = biome.accent; ctx.fillRect(px - 1, py - 2, 2, 3); }

    // coins
    for (const c of g.coins) { const px = X(c.x), py = Y(c.y); const bobc = Math.sin(g.t * 10 + c.x) * .5; ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.arc(px, py + bobc, 2.4, 0, 6.28); ctx.fill(); ctx.fillStyle = '#FCD34D'; ctx.fillRect(px - .6, py - 1 + bobc, 1.2, 2); }

    // weapon drops
    for (const w of g.weaponDrops) drawWeaponDrop(ctx, w, X, Y, g);

    // entities sorted by y
    const ents = [];
    for (const e of g.enemies) if (!(e.state === 'dead' && e.deadT > .4)) ents.push(e);
    ents.sort((a, b) => a.y - b.y);
    for (const e of ents) if (e.y < g.p.y) drawEnemy(ctx, e, X, Y, g);
    drawHero(ctx, g, X, Y);
    for (const e of ents) if (e.y >= g.p.y) drawEnemy(ctx, e, X, Y, g);

    // bolts
    for (const bl of g.bolts) { ctx.globalAlpha = bl.life / bl.max; ctx.strokeStyle = bl.color; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(X(bl.x1), Y(bl.y1)); const segs = 4; for (let i = 1; i <= segs; i++) { const tt = i / segs; ctx.lineTo(X(bl.x1 + (bl.x2 - bl.x1) * tt) + (i < segs ? rnd(-3, 3) : 0), Y(bl.y1 + (bl.y2 - bl.y1) * tt) + (i < segs ? rnd(-3, 3) : 0)); } ctx.stroke(); ctx.globalAlpha = 1; }
    // bullets
    for (const b of g.bullets) { const px = X(b.x), py = Y(b.y); const gr = ctx.createRadialGradient(px, py, 0, px, py, b.r + 2); gr.addColorStop(0, '#fff'); gr.addColorStop(.5, b.color); gr.addColorStop(1, b.color + '00'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, b.r + 2, 0, 6.28); ctx.fill(); }
    // particles
    for (const q of g.parts) { ctx.globalAlpha = Math.max(0, q.life / q.max); ctx.fillStyle = q.color; ctx.fillRect(X(q.x) - q.sz / 2, Y(q.y) - q.sz / 2, q.sz, q.sz); } ctx.globalAlpha = 1;
    // floaters
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const f of g.floaters) { const px = X(f.x), py = Y(f.y); ctx.globalAlpha = Math.min(1, f.life); ctx.font = `${f.sz}px monospace`; ctx.fillStyle = '#000'; ctx.fillText(f.t, px + .6, py + .6); ctx.fillStyle = f.c; ctx.fillText(f.t, px, py); } ctx.globalAlpha = 1;

    // vignette
    const vg = ctx.createRadialGradient(VW / 2, VH / 2, VH * .35, VW / 2, VH / 2, VH * .85);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);

    // biome ambient fog tint
    ctx.fillStyle = g.biome.fog; ctx.fillRect(0, 0, VW, VH);
    // weather particles
    paintWeather(ctx, g.biome, g.weather || [], g.t, VW, VH);

    // door / portal hint when cleared
    if (g.cleared && room.exitDir) {
      const dc = doorCenter(room, room.exitDir); const px = X(dc.x), py = Y(dc.y);
      const portalPulse = 0.65 + 0.35 * Math.sin(g.t * 6);
      const portalSize = 18 + portalPulse * 6 + g.portalBurst * 10;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, portalSize);
      glow.addColorStop(0, g.room.isBoss ? 'rgba(167,139,250,0.72)' : 'rgba(245,158,11,0.62)');
      glow.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(px, py, portalSize, 0, 6.28); ctx.fill();
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(g.t * 6); ctx.fillStyle = g.room.isBoss ? '#C4B5FD' : '#F59E0B'; ctx.font = '12px serif'; ctx.textAlign = 'center';
      const arrow = room.exitDir === 'N' ? '▲' : room.exitDir === 'S' ? '▼' : room.exitDir === 'W' ? '◀' : '▶';
      ctx.fillText(arrow, clamp(px, 12, VW - 12), clamp(py, 14, VH - 10)); ctx.globalAlpha = 1;
    }
    // transition fade
    if (g.transition > 0) { ctx.globalAlpha = Math.min(1, g.transition * 2.2); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VW, VH); ctx.globalAlpha = 1; }
    // banners
    if (g.bannerT > 0 && g.banner) { ctx.globalAlpha = Math.min(1, g.bannerT); ctx.font = '13px "Cinzel",serif'; ctx.textAlign = 'center'; ctx.fillStyle = g.room.isBoss ? '#F59E0B' : '#A78BFA'; ctx.fillText(g.banner, VW / 2, 26); ctx.globalAlpha = 1; }
    if (g.warnT > 0) { const pulse = (Math.sin(g.t * 14) + 1) / 2; ctx.globalAlpha = 0.5 + pulse * 0.5; ctx.font = '8px "Cinzel",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#F87171'; ctx.fillText('ENEMIES IN ROOM', VW / 2, 40); ctx.globalAlpha = 1; }
    if (g.weaponToast > 0 && g.weapon) {
      ctx.globalAlpha = Math.min(1, g.weaponToast);
      ctx.fillStyle = 'rgba(5,4,10,0.72)'; ctx.fillRect(VW / 2 - 70, VH - 36, 140, 20);
      ctx.strokeStyle = g.weapon.color; ctx.strokeRect(VW / 2 - 70.5, VH - 36.5, 141, 21);
      ctx.font = '9px "Cinzel",serif'; ctx.textAlign = 'center'; ctx.fillStyle = g.weapon.color;
      ctx.fillText(g.weapon.name.toUpperCase(), VW / 2, VH - 22);
      ctx.globalAlpha = 1;
    }
  }

  function drawWeaponDrop(ctx, w, X, Y, g) {
    const px = X(w.x), py = Y(w.y + Math.sin(w.bob) * 2);
    const pulse = 0.55 + 0.45 * Math.sin(g.t * 6 + w.bob);
    const glow = ctx.createRadialGradient(px, py, 0, px, py, 18 + pulse * 6);
    glow.addColorStop(0, `${w.color}AA`);
    glow.addColorStop(1, `${w.color}00`);
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(px, py, 22, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#09080F'; ctx.strokeStyle = w.color; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(px, py - 10); ctx.lineTo(px + 12, py); ctx.lineTo(px, py + 10); ctx.lineTo(px - 12, py); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = w.color; ctx.font = 'bold 8px "JetBrains Mono",monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(w.glyph, px, py + 0.5);
  }

  function paintFloorClipped(ctx, biome, X, Y, t) {
    for (let yy = WALL; yy < ROOM - WALL; yy += 16) for (let xx = WALL; xx < ROOM - WALL; xx += 16) {
      const px = X(xx), py = Y(yy); if (px < -16 || px > VW || py < -16 || py > VH) continue;
      ctx.fillStyle = (((xx + yy) / 16) % 2 < 1) ? biome.floorA : biome.floorB; ctx.fillRect(px, py, 16, 16);
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(px, py, 16, 1); ctx.fillRect(px, py, 1, 16);
      if (biome.id === 'inferno' && (xx * 7 + yy * 13) % 96 < 16) { ctx.fillStyle = `rgba(249,115,22,${0.15 + 0.1 * Math.sin(t * 4 + xx)})`; ctx.fillRect(px + 6, py + 6, 4, 4); }
      if (biome.id === 'frost' && (xx + yy) % 48 < 16) { ctx.fillStyle = 'rgba(186,230,253,0.10)'; ctx.fillRect(px + 4, py + 4, 8, 2); }
      if (biome.id === 'abyss' && (xx * 5 + yy * 9) % 112 < 16) { ctx.fillStyle = `rgba(196,181,253,${0.1 + 0.1 * Math.sin(t * 3 + yy)})`; ctx.fillRect(px + 7, py + 7, 2, 2); }
      if (biome.id === 'forest' && (xx * 3 + yy * 7) % 80 < 16) { ctx.fillStyle = 'rgba(34,197,94,0.08)'; ctx.fillRect(px + 5, py + 9, 5, 2); }
    }
  }

  function drawWalls(ctx, g, X, Y) {
    const room = g.room, c = ROOM / 2, hd = DOOR / 2;
    const open = dir => room.doors[dir] === 'exit' && room.cleared;
    ctx.fillStyle = g.biome.wall;
    // top / bottom
    for (const [yy, dir] of [[0, 'N'], [ROOM - WALL, 'S']]) {
      for (let xx = 0; xx < ROOM; xx += 4) {
        if (open(dir) && Math.abs(xx + 2 - c) < hd) continue;
        ctx.fillRect(X(xx), Y(yy), 5, WALL);
      }
    }
    for (const [xx, dir] of [[0, 'W'], [ROOM - WALL, 'E']]) {
      for (let yy = 0; yy < ROOM; yy += 4) {
        if (open(dir) && Math.abs(yy + 2 - c) < hd) continue;
        ctx.fillRect(X(xx), Y(yy), WALL, 5);
      }
    }
    // brick highlight
    ctx.fillStyle = g.biome.wallEdge;
    for (let xx = 0; xx < ROOM; xx += 16) { if (!(open('N') && Math.abs(xx - c) < hd)) ctx.fillRect(X(xx), Y(WALL - 3), 15, 3); if (!(open('S') && Math.abs(xx - c) < hd)) ctx.fillRect(X(xx), Y(ROOM - WALL), 15, 3); }
    // door frames (glow when open)
    for (const dir of ['N', 'S', 'E', 'W']) {
      if (!room.doors[dir]) continue;
      const dc = doorCenter(room, dir); const px = X(dc.x), py = Y(dc.y);
      const isOpen = open(dir);
      ctx.fillStyle = isOpen ? (room.doors[dir] === 'exit' ? '#F59E0B' : '#4B5563') : '#3A1C20';
      if (dir === 'N' || dir === 'S') ctx.fillRect(px - hd, py - 1, DOOR, 2); else ctx.fillRect(px - 1, py - hd, 2, DOOR);
      if (!isOpen) { ctx.fillStyle = '#7F1D1D'; if (dir === 'N' || dir === 'S') ctx.fillRect(px - hd, py - WALL / 2, DOOR, WALL); else ctx.fillRect(px - WALL / 2, py - hd, WALL, DOOR); }
    }
  }

  function drawEnemy(ctx, e, X, Y, g) {
    const dead = e.state === 'dead'; const a = dead ? Math.max(0, 1 - e.deadT * 2.5) : 1; if (a <= 0) return;
    const color = TYPE_COLORS[e.type] || '#DC2626'; const bob = Math.sin(e.bob) * 1.2;
    const x = X(e.x), y = Y(e.y + (dead ? e.deadT * 8 : 0)), r = e.r; ctx.globalAlpha = a;
    const fl = e.flash > 0, face = g.p.x < e.x ? -1 : 1;
    if (e.windup > 0) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y + bob, r + 4 + Math.sin(e.windup * 30), 0, 6.28); ctx.stroke(); }
    if (e.big) { const gg = ctx.createRadialGradient(x, y + bob, 0, x, y + bob, r * 2.1); gg.addColorStop(0, color + '4D'); gg.addColorStop(1, color + '00'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y + bob, r * 2.1, 0, 6.28); ctx.fill(); }
    drawCreature(ctx, e.emoji, x, y, r, color, g.t, fl, e.hurtT > 0, face);
    if (!dead) { const bw = r * 2, bx = x - r, by = y - r * 2.0 + bob; ctx.fillStyle = '#000'; ctx.fillRect(bx - 1, by - 1, bw + 2, 3); ctx.fillStyle = '#3a1416'; ctx.fillRect(bx, by, bw, 1); ctx.fillStyle = e.big ? '#F59E0B' : '#EF4444'; ctx.fillRect(bx, by, bw * clamp(e.hp / e.maxHP, 0, 1), 1); }
    ctx.globalAlpha = 1;
  }

  // ninja palette + body reused (compact)
  function ninjaPalette(style) {
    if (style === 'shadow') return { cloth: '#15151F', cloth2: '#26222E', trim: '#DC2626', glow: '#F87171', scarf: '#B91C1C', aura: 'rgba(220,38,38,0.30)', blade: '#FCA5A5', rim: '#DC2626', eye: '#FCA5A5', trail: '#7F1D1D' };
    if (style === 'storm') return { cloth: '#1E1B4B', cloth2: '#312E81', trim: '#A78BFA', glow: '#C4B5FD', scarf: '#6D28D9', aura: 'rgba(167,139,250,0.30)', blade: '#C4B5FD', rim: '#A78BFA', eye: '#E0E7FF', trail: '#C4B5FD' };
    return null;
  }
  function drawHero(ctx, g, X, Y) {
    const p = g.p, style = g.ninjaStyle, ninja = g.isNinja, col = g.heroColor, pal = ninjaPalette(style);
    for (const cl of g.clones) drawNinjaBody(ctx, X(cl.x), Y(cl.y), p.r, cl.face, p, g, pal || ninjaPalette('shadow'), (cl.life / cl.max) * .55, true, 0);
    for (const tr of p.trail) { ctx.globalAlpha = tr.life * .5; ctx.fillStyle = pal ? pal.trail : col; ctx.beginPath(); ctx.arc(X(tr.x), Y(tr.y), p.r, 0, 6.28); ctx.fill(); } ctx.globalAlpha = 1;
    const x = X(p.x), y = Y(p.y), r = p.r, bob = Math.sin(p.walkT) * 1.4, fl = p.flash > 0, blink = p.invuln > 0 && Math.floor(g.t * 14) % 2, alpha = blink ? .5 : 1;
    if (drawCardHero(ctx, g, x, y, r, alpha, bob, fl)) return;
    if (ninja) { const gg = ctx.createRadialGradient(x, y + bob, 0, x, y + bob, r * 2.2); gg.addColorStop(0, pal.aura); gg.addColorStop(1, pal.aura.replace(/[\d.]+\)$/, '0)')); ctx.globalAlpha = alpha; ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y + bob, r * 2.2, 0, 6.28); ctx.fill(); drawNinjaBody(ctx, x, y, r, p.face, p, g, pal, alpha, false, bob, fl); }
    else { ctx.globalAlpha = alpha * .4; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(x, y + r * .8, r, r * .4, 0, 0, 6.28); ctx.fill(); ctx.globalAlpha = alpha; ctx.fillStyle = fl ? '#fff' : col; ctx.fillRect(x - r + 2, y - 1 + bob, (r - 2) * 2, r + 1); ctx.fillStyle = fl ? '#fff' : '#F1C27D'; ctx.beginPath(); ctx.arc(x, y - r + bob, r - 2, 0, 6.28); ctx.fill(); const reach = r + 8 - (p.recoil > 0 ? 3 : 0); ctx.strokeStyle = shade(col, .4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + p.aimX * (r + 1), y + p.aimY * (r + 1) + bob); ctx.lineTo(x + p.aimX * reach, y + p.aimY * reach + bob); ctx.stroke(); ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y + bob, r + 2, 0, 6.28); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  function drawCardHero(ctx, g, x, y, r, alpha, bob, fl) {
    const img = g.cardImage, art = g.cardArt, p = g.p;
    if (!img || !art || !img.complete || !img.naturalWidth) return false;
    const cellW = img.naturalWidth / art.columns;
    const cellH = img.naturalHeight / art.rows;
    const sx = art.column * cellW;
    const sy = art.row * cellH;
    const col = g.weapon?.color || g.heroColor;
    const cy = y - r * 0.45 + bob;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(x, y + r * .9, r * 1.45, r * .52, 0, 0, 6.28); ctx.fill();
    const aura = ctx.createRadialGradient(x, cy, 0, x, cy, r * 3.1);
    aura.addColorStop(0, `${col}55`);
    aura.addColorStop(1, `${col}00`);
    ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(x, cy, r * 3.1, 0, 6.28); ctx.fill();

    ctx.beginPath(); ctx.ellipse(x, cy, r * 1.55, r * 1.95, 0, 0, 6.28); ctx.clip();
    ctx.drawImage(img, sx, sy, cellW, cellH, x - r * 2.05, cy - r * 2.45, r * 4.1, r * 4.1);
    if (fl) { ctx.globalAlpha = alpha * 0.55; ctx.fillStyle = '#fff'; ctx.fillRect(x - r * 2.1, cy - r * 2.1, r * 4.2, r * 4.2); ctx.globalAlpha = alpha; }
    ctx.restore();

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = col; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(x, cy, r * 1.6, r * 2.0, 0, 0, 6.28); ctx.stroke();
    const wx = x + p.aimX * (r * 0.9), wy = y + p.aimY * (r * 0.9) + bob;
    const tipx = x + p.aimX * (r * 2.25 + (p.recoil > 0 ? -3 : 0));
    const tipy = y + p.aimY * (r * 2.25 + (p.recoil > 0 ? -3 : 0)) + bob;
    ctx.strokeStyle = '#08070D'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(tipx, tipy); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(tipx, tipy); ctx.stroke();
    if (p.muzzle > 0) { ctx.globalAlpha = alpha * (p.muzzle / .08); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(tipx, tipy, 4, 0, 6.28); ctx.fill(); }
    ctx.globalAlpha = 1;
    return true;
  }
  function drawNinjaBody(ctx, x, y, r, face, p, g, pal, alpha, isClone, bob, fl) {
    const t = g.t; ctx.globalAlpha = alpha;
    if (!isClone) { ctx.globalAlpha = alpha * .4; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(x, y + r * .85, r * 1.05, r * .42, 0, 0, 6.28); ctx.fill(); ctx.globalAlpha = alpha; }
    const sway = Math.sin(t * 6) * 2;
    ctx.fillStyle = pal.scarf; ctx.beginPath(); ctx.moveTo(x - face * 2, y - r + 2 + bob); ctx.quadraticCurveTo(x - face * (r + 5), y - 1 + bob + sway, x - face * (r + 7), y + r - 1 + bob + sway * 1.4); ctx.quadraticCurveTo(x - face * (r + 2), y + r + bob, x - face * 1, y + 2 + bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = pal.cloth; ctx.beginPath(); ctx.moveTo(x - r + 1, y - r + 3 + bob); ctx.lineTo(x - r - 1, y + r + 1 + bob); ctx.lineTo(x + r + 1, y + r + 1 + bob); ctx.lineTo(x + r - 1, y - r + 3 + bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = fl ? '#fff' : pal.cloth2; ctx.fillRect(x - r + 2, y - 2 + bob, (r - 2) * 2, r + 2); ctx.fillStyle = fl ? '#fff' : pal.cloth; ctx.fillRect(x - r + 2, y - 2 + bob, r - 1, r + 2);
    ctx.strokeStyle = pal.trim; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - r + 3, y - 1 + bob); ctx.lineTo(x + r - 3, y + r - 2 + bob); ctx.stroke();
    ctx.fillStyle = pal.trim; ctx.fillRect(x - r + 3, y + r - 3 + bob, (r - 3) * 2, 1.5);
    const stride = Math.sin(p.walkT) * 1.5; ctx.fillStyle = shade(pal.cloth, -.3); ctx.fillRect(x - 3, y + r - 2 + bob, 2, 3 + stride); ctx.fillRect(x + 1, y + r - 2 + bob, 2, 3 - stride);
    ctx.fillStyle = fl ? '#fff' : '#0C0C12'; ctx.beginPath(); ctx.arc(x, y - r + bob, r - 1.5, 0, 6.28); ctx.fill();
    ctx.fillStyle = pal.cloth; ctx.beginPath(); ctx.moveTo(x - (r - 1), y - r + bob); ctx.lineTo(x, y - r - r * .8 + bob); ctx.lineTo(x + (r - 1), y - r + bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = pal.trim; ctx.fillRect(x - (r - 2), y - r - 1.5 + bob, (r - 2) * 2, 2); ctx.fillStyle = shade(pal.trim, .3); ctx.fillRect(x - 1, y - r - 1.5 + bob, 2, 2);
    ctx.fillStyle = '#000'; ctx.fillRect(x - (r - 2.5), y - r + 1 + bob, (r - 2.5) * 2, 2.5);
    if (!fl) { const ex = clamp(p.aimX, -.6, .6) * 1.5; ctx.fillStyle = pal.eye; ctx.fillRect(x - 2.4 + ex, y - r - .2 + bob, 1.6, 1.5); ctx.fillRect(x + .9 + ex, y - r - .2 + bob, 1.6, 1.5); ctx.globalAlpha = alpha * .5; ctx.fillStyle = pal.glow; ctx.fillRect(x - 2.8 + ex, y - r - .6 + bob, 2.4, 2.3); ctx.fillRect(x + .5 + ex, y - r - .6 + bob, 2.4, 2.3); ctx.globalAlpha = alpha; }
    const wx = x + p.aimX * (r - 1), wy = y + 1 + p.aimY * (r - 1) + bob, reach = r + 9 - (p.recoil > 0 ? 3 : 0), tipx = x + p.aimX * reach, tipy = y + 1 + p.aimY * reach + bob;
    ctx.strokeStyle = pal.cloth2; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x, y + 1 + bob); ctx.lineTo(wx, wy); ctx.stroke();
    ctx.strokeStyle = '#0A0A0F'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(tipx, tipy); ctx.stroke();
    ctx.strokeStyle = pal.blade; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(tipx, tipy); ctx.stroke();
    const gl = (Math.sin(t * 9) + 1) / 2; ctx.globalAlpha = alpha * (.4 + gl * .6); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(tipx, tipy, 1.8, 0, 6.28); ctx.fill(); ctx.globalAlpha = alpha;
    if (!isClone && p.muzzle > 0) { ctx.globalAlpha = alpha * (p.muzzle / .08); ctx.fillStyle = pal.eye; ctx.beginPath(); ctx.arc(tipx, tipy, 3.2, 0, 6.28); ctx.fill(); ctx.globalAlpha = alpha; }
    if (!isClone) { ctx.strokeStyle = pal.rim; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y + bob, r + 2, 0, 6.28); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  // ── on-screen stick ──
  const baseRef = useRef(null);
  const startStick = () => { const b = baseRef.current.getBoundingClientRect(); stick.current = { active: true, dx: 0, dy: 0, ox: b.left + b.width / 2, oy: b.top + b.height / 2 }; };
  const moveStick = (cx, cy) => { if (!stick.current.active) return; let dx = cx - stick.current.ox, dy = cy - stick.current.oy; const m = Math.hypot(dx, dy) || 1, max = 34, k = Math.min(1, m / max); stick.current.dx = (dx / m) * k; stick.current.dy = (dy / m) * k; setThumb({ x: (dx / m) * Math.min(m, max), y: (dy / m) * Math.min(m, max) }); };
  const endStick = () => { stick.current = { active: false, dx: 0, dy: 0 }; setThumb({ x: 0, y: 0 }); };

  const hpPct = clamp(hud.hp / hud.maxHp, 0, 1);
  return (
    <div style={{ width: '100%', maxWidth: `min(1180px, calc((100vh - 120px) * ${VW / VH}))`, margin: '0 auto', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap', padding: '0.65rem 0.75rem', background: 'linear-gradient(180deg,rgba(18,12,28,0.92),rgba(7,4,10,0.82))', border: '1px solid rgba(196,181,253,0.22)', borderRadius: 8, boxShadow: '0 14px 34px rgba(0,0,0,0.28)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Cinzel', fontWeight: 800, color: hud.boss ? '#F59E0B' : '#C4B5FD', fontSize: '.82rem', minWidth: 92 }}>{hud.boss ? <><Icon name="skull" size={14} /> Warden</> : `Room ${hud.room}`}</span>
        <div style={{ flex: 1, minWidth: 130, background: '#12080B', borderRadius: 999, height: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.65)' }}><div style={{ width: `${hpPct * 100}%`, height: '100%', background: hpPct > .3 ? 'linear-gradient(90deg,#16A34A,#86EFAC)' : 'linear-gradient(90deg,#991B1B,#EF4444)', transition: 'width .12s', boxShadow: '0 0 14px rgba(34,197,94,0.35)' }} /></div>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '.72rem', color: '#F5F0F0', minWidth: 64, textAlign: 'right' }}>{Math.max(0, Math.round(hud.hp))}/{hud.maxHp}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '.72rem', color: hud.weaponColor, background: `${hud.weaponColor}18`, border: `1px solid ${hud.weaponColor}44`, borderRadius: 999, padding: '0.18rem 0.55rem', maxWidth: 170, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}><Icon name="attack" size={12} />{hud.weaponName}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '.72rem', color: '#F59E0B', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.24)', borderRadius: 999, padding: '0.18rem 0.45rem' }}><Icon name="gold" size={12} />{hud.gold}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.72rem', color: hud.cleared ? '#4ADE80' : '#F87171', marginLeft: 'auto', background: hud.cleared ? 'rgba(34,197,94,0.10)' : 'rgba(248,113,113,0.10)', border: `1px solid ${hud.cleared ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.22)'}`, borderRadius: 999, padding: '0.18rem 0.5rem' }}>{hud.cleared ? <><Icon name="check" size={13} /> portal open</> : <><Icon name="monster" size={13} /> {hud.enemies}</>}</span>
      </div>
      <div style={{ position: 'relative', padding: 8, borderRadius: 8, background: 'linear-gradient(135deg,rgba(167,139,250,0.36),rgba(245,158,11,0.16),rgba(220,38,38,0.28))', boxShadow: '0 28px 70px rgba(0,0,0,0.38)' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 6, imageRendering: 'pixelated', border: '1px solid rgba(255,255,255,0.15)', boxShadow: 'inset 0 0 34px rgba(0,0,0,0.45), 0 0 44px rgba(167,139,250,0.20)', background: '#070405', touchAction: 'none', aspectRatio: `${VW}/${VH}` }} />
        <div ref={baseRef} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); startStick(e.clientX, e.clientY); }} onPointerMove={e => moveStick(e.clientX, e.clientY)} onPointerUp={endStick} onPointerCancel={endStick}
          style={{ position: 'absolute', left: 12, bottom: 12, width: 84, height: 84, borderRadius: '50%', background: 'rgba(13,6,8,0.45)', border: '2px solid rgba(255,255,255,0.18)', touchAction: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 38, height: 38, marginLeft: -19, marginTop: -19, borderRadius: '50%', background: 'rgba(167,139,250,0.6)', border: '2px solid rgba(255,255,255,0.3)', transform: `translate(${thumb.x}px,${thumb.y}px)` }} />
        </div>
        <button onPointerDown={() => { dashReq.current = true; }} style={{ position: 'absolute', right: 14, bottom: 16, width: 64, height: 64, borderRadius: '50%', background: hud.dashReady ? 'linear-gradient(160deg,#312E81,#1E1B4B)' : 'rgba(28,20,50,0.7)', border: `2px solid ${hud.dashReady ? '#A78BFA' : '#3A2F60'}`, color: '#F5F0F0', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name="speed" size={26} /></button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 10, color: '#6B7280', fontSize: '.72rem' }}>
        <b>WASD / stick</b> — move · <b>Space</b> — dash · weapons auto-pickup · clear the room and enter the <span style={{ color: '#F59E0B' }}>portal</span>.
      </div>
    </div>
  );
});
