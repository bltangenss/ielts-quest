// ════════════════════════════════════════════════════════════════════
// BIOMES — visual + gameplay theming for the open-world expedition mode.
// Each biome defines: palette, floor/wall painters, decor props, a weather
// particle effect, ambient tint, and which enemy archetypes spawn there.
// All original procedural art (no external assets).
// ════════════════════════════════════════════════════════════════════

const rnd = (a, b) => a + Math.random() * (b - a);

// emoji keys here map to the procedural sprites already in bestiary.js
export const BIOMES = {
  forest: {
    id: 'forest', name: 'Rotwood Forest', emoji: '🌲',
    floorA: '#16241A', floorB: '#11200F', wall: '#0c1a10', wallEdge: '#1e3a24',
    fog: 'rgba(34,80,40,0.10)', accent: '#16A34A', torch: 'rgba(134,239,172,0.4)',
    weather: 'fireflies',
    enemyTypes: { normal: ['🐺', '🐍', '🧚'], elite: ['🦅', '🐍'], boss: ['🌳'] },
    decor: ['tree', 'mushroom', 'bush'],
  },
  caverns: {
    id: 'caverns', name: 'Caverns', emoji: '🪨',
    floorA: '#241f1a', floorB: '#1c1813', wall: '#15110d', wallEdge: '#332a20',
    fog: 'rgba(120,90,60,0.08)', accent: '#9CA3AF', torch: 'rgba(245,158,11,0.4)',
    weather: 'drips',
    enemyTypes: { normal: ['🐺', '🔥', '🌑'], elite: ['🤖', '🌑'], boss: ['⚔️'] },
    decor: ['stalagmite', 'crystal', 'bones'],
  },
  frost: {
    id: 'frost', name: 'Frozen Peaks', emoji: '❄️',
    floorA: '#1a2630', floorB: '#15202a', wall: '#0f1a22', wallEdge: '#27435a',
    fog: 'rgba(120,180,220,0.12)', accent: '#06B6D4', torch: 'rgba(186,230,253,0.5)',
    weather: 'snow',
    enemyTypes: { normal: ['🧚', '🐺', '🌑'], elite: ['🦅', '🤖'], boss: ['👸'] },
    decor: ['ice', 'iccrystal', 'bones'],
  },
  inferno: {
    id: 'inferno', name: 'Lava Halls', emoji: '🔥',
    floorA: '#2a1410', floorB: '#20100c', wall: '#190a08', wallEdge: '#5a2418',
    fog: 'rgba(220,80,40,0.10)', accent: '#F97316', torch: 'rgba(251,146,60,0.55)',
    weather: 'embers',
    enemyTypes: { normal: ['🔥', '🐺', '🌑'], elite: ['🔥', '🤖'], boss: ['🐉'] },
    decor: ['lavarock', 'cinder', 'bones'],
  },
  abyss: {
    id: 'abyss', name: 'The Abyss', emoji: '🌌',
    floorA: '#161022', floorB: '#100a1a', wall: '#0a0613', wallEdge: '#2a1f4a',
    fog: 'rgba(120,80,200,0.12)', accent: '#A78BFA', torch: 'rgba(196,181,253,0.5)',
    weather: 'stars',
    enemyTypes: { normal: ['🌑', '🌒', '👥'], elite: ['🧙‍♀️', '🤖'], boss: ['👑'] },
    decor: ['rift', 'star', 'bones'],
  },
};

// The expedition path of biomes (order). Loops back enriched after abyss.
export const BIOME_ORDER = ['forest', 'caverns', 'frost', 'inferno', 'abyss'];

export function biomeForRoom(roomIndex) {
  // 3 rooms per biome (room 3 of each = mini-boss), then next biome
  const stage = Math.floor(roomIndex / 3);
  return BIOMES[BIOME_ORDER[stage % BIOME_ORDER.length]];
}
export function isMiniBossRoom(roomIndex) { return (roomIndex % 3) === 2; }
export function isCampRoom(roomIndex) { return false; } // camps handled between biomes by page

// ─────────── floor painter ───────────
export function paintFloor(ctx, biome, X, Y, ROOM, WALL, t) {
  for (let yy = WALL; yy < ROOM - WALL; yy += 16) for (let xx = WALL; xx < ROOM - WALL; xx += 16) {
    const px = X(xx), py = Y(yy); if (px < -16 || px > 9999 || py < -16) { /* viewport cull handled by caller bounds */ }
    ctx.fillStyle = (((xx + yy) / 16) % 2 < 1) ? biome.floorA : biome.floorB; ctx.fillRect(px, py, 16, 16);
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(px, py, 16, 1); ctx.fillRect(px, py, 1, 16);
    // biome-specific floor flecks
    if (biome.id === 'inferno' && (xx * 7 + yy * 13) % 96 < 16) { ctx.fillStyle = `rgba(249,115,22,${0.15 + 0.1 * Math.sin(t * 4 + xx)})`; ctx.fillRect(px + 6, py + 6, 4, 4); }
    if (biome.id === 'frost' && (xx + yy) % 48 < 16) { ctx.fillStyle = 'rgba(186,230,253,0.10)'; ctx.fillRect(px + 4, py + 4, 8, 2); }
    if (biome.id === 'abyss' && (xx * 5 + yy * 9) % 112 < 16) { ctx.fillStyle = `rgba(196,181,253,${0.1 + 0.1 * Math.sin(t * 3 + yy)})`; ctx.fillRect(px + 7, py + 7, 2, 2); }
  }
}

// ─────────── decor painter ───────────
export function paintDecor(ctx, biome, prop, px, py, t) {
  const k = prop.k;
  switch (k) {
    case 'tree': {
      ctx.fillStyle = '#3a2a18'; ctx.fillRect(px - 1, py - 2, 3, 8);
      ctx.fillStyle = '#14401f'; ctx.beginPath(); ctx.arc(px, py - 6, 6, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#1c5a2a'; ctx.beginPath(); ctx.arc(px - 2, py - 8, 3, 0, 6.28); ctx.fill();
      break;
    }
    case 'mushroom': { ctx.fillStyle = '#d9cbb0'; ctx.fillRect(px - 1, py, 2, 3); ctx.fillStyle = '#b91c1c'; ctx.beginPath(); ctx.arc(px, py, 3, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#fca5a5'; ctx.fillRect(px - 1, py - 2, 1, 1); break; }
    case 'bush': { ctx.fillStyle = '#15401e'; ctx.beginPath(); ctx.arc(px - 2, py, 3, 0, 6.28); ctx.arc(px + 2, py, 3, 0, 6.28); ctx.arc(px, py - 2, 3, 0, 6.28); ctx.fill(); break; }
    case 'stalagmite': { ctx.fillStyle = '#3a3128'; ctx.beginPath(); ctx.moveTo(px - 3, py + 3); ctx.lineTo(px, py - 7); ctx.lineTo(px + 3, py + 3); ctx.fill(); ctx.fillStyle = '#4a4030'; ctx.fillRect(px - 1, py - 3, 1, 5); break; }
    case 'crystal': { const g = 0.5 + 0.5 * Math.sin(t * 3 + px); ctx.fillStyle = `rgba(156,163,175,${0.6 + g * 0.4})`; ctx.beginPath(); ctx.moveTo(px - 2, py + 2); ctx.lineTo(px, py - 5); ctx.lineTo(px + 2, py + 2); ctx.fill(); break; }
    case 'ice': { ctx.fillStyle = 'rgba(186,230,253,0.5)'; ctx.fillRect(px - 3, py, 6, 2); ctx.fillStyle = 'rgba(224,242,254,0.7)'; ctx.fillRect(px - 1, py - 1, 2, 1); break; }
    case 'icrystal': { const g = 0.5 + 0.5 * Math.sin(t * 4 + px); ctx.fillStyle = `rgba(125,211,252,${0.6 + g * 0.4})`; ctx.beginPath(); ctx.moveTo(px - 2, py + 2); ctx.lineTo(px, py - 6); ctx.lineTo(px + 2, py + 2); ctx.fill(); break; }
    case 'lavarock': { ctx.fillStyle = '#1a0d08'; ctx.beginPath(); ctx.arc(px, py, 4, 0, 6.28); ctx.fill(); ctx.fillStyle = `rgba(249,115,22,${0.5 + 0.5 * Math.sin(t * 5 + px)})`; ctx.fillRect(px - 2, py, 4, 1); break; }
    case 'cinder': { ctx.fillStyle = `rgba(251,146,60,${0.4 + 0.4 * Math.sin(t * 6 + px)})`; ctx.fillRect(px, py, 2, 2); break; }
    case 'rift': { const g = 0.5 + 0.5 * Math.sin(t * 2 + px); ctx.strokeStyle = `rgba(167,139,250,${0.4 + g * 0.5})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py - 5); ctx.lineTo(px + 1, py); ctx.lineTo(px - 1, py + 5); ctx.stroke(); break; }
    case 'star': { ctx.fillStyle = `rgba(196,181,253,${0.4 + 0.5 * Math.sin(t * 3 + py)})`; ctx.fillRect(px, py, 1.5, 1.5); break; }
    case 'bones': default: { ctx.fillStyle = '#c9c2b4'; ctx.fillRect(px - 3, py, 6, 2); ctx.fillRect(px - 1, py - 3, 2, 5); break; }
  }
}

// ─────────── weather particles (ambient overlay) ───────────
// state = persistent array passed in by engine
export function stepWeather(biome, parts, dt, VW, VH, t) {
  const want = 40;
  while (parts.length < want) {
    parts.push({ x: rnd(0, VW), y: rnd(0, VH), s: rnd(0.5, 1.5), vx: rnd(-6, 6), vy: rnd(8, 30), ph: rnd(0, 6.28) });
  }
  for (const p of parts) {
    if (biome.weather === 'snow') { p.x += Math.sin(t * 2 + p.ph) * 8 * dt; p.y += p.vy * 0.6 * dt; }
    else if (biome.weather === 'embers') { p.x += p.vx * dt; p.y -= (p.vy * 0.8) * dt; }
    else if (biome.weather === 'fireflies') { p.x += Math.sin(t * 1.5 + p.ph) * 12 * dt; p.y += Math.cos(t * 1.2 + p.ph) * 10 * dt; }
    else if (biome.weather === 'stars') { /* twinkle in place */ }
    else if (biome.weather === 'drips') { p.y += p.vy * 1.2 * dt; if (p.y > VH) { p.y = -2; p.x = rnd(0, VW); } }
    if (p.y > VH + 4) { p.y = -4; p.x = rnd(0, VW); }
    if (p.x < -4) p.x = VW + 4; if (p.x > VW + 4) p.x = -4;
  }
}
export function paintWeather(ctx, biome, parts, t, VW, VH) {
  for (const p of parts) {
    let col, a = 0.6;
    if (biome.weather === 'snow') { col = '#E0F2FE'; }
    else if (biome.weather === 'embers') { col = Math.sin(t * 6 + p.ph) > 0 ? '#FB923C' : '#F59E0B'; }
    else if (biome.weather === 'fireflies') { a = 0.4 + 0.5 * Math.sin(t * 4 + p.ph); col = '#86EFAC'; }
    else if (biome.weather === 'stars') { a = 0.3 + 0.6 * Math.sin(t * 2.5 + p.ph); col = '#C4B5FD'; }
    else { col = '#7DD3FC'; }
    ctx.globalAlpha = a; ctx.fillStyle = col;
    if (biome.weather === 'drips') ctx.fillRect(p.x, p.y, 1, 3);
    else ctx.fillRect(p.x, p.y, p.s, p.s);
  }
  ctx.globalAlpha = 1;
}

// pick an enemy emoji for a biome+tier from its themed set
export function biomeEnemyEmoji(biome, tier) {
  const set = biome.enemyTypes[tier] || biome.enemyTypes.normal;
  return set[Math.floor(Math.random() * set.length)];
}
