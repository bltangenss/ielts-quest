// ════════════════════════════════════════════════════════════════════
// BESTIARY — procedural horror-fantasy pixel sprites drawn on <canvas>.
// Each archetype is an original creature design (no emoji, no external art).
// Keyed by the emoji used in card/enemy data → maps to a draw function.
// Every draw fn signature: (ctx, x, y, r, color, t, flash, hurt, facing)
//   x,y   = center;  r = body radius;  color = type tint;  t = time (s)
//   flash = white hit flash;  hurt = small recoil;  facing = -1 | 1
// Style: dark, sinister, glowing eyes, jagged silhouettes, dripping/oozing.
// ════════════════════════════════════════════════════════════════════

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function shade(hex, f) {
  if (hex[0] !== '#') return hex;
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = clamp(Math.round(r + (f < 0 ? r : 255 - r) * f), 0, 255);
  g = clamp(Math.round(g + (f < 0 ? g : 255 - g) * f), 0, 255);
  b = clamp(Math.round(b + (f < 0 ? b : 255 - b) * f), 0, 255);
  return `rgb(${r},${g},${b})`;
}
// glowing eye helper
function eyes(ctx, x, y, gap, sz, color, t) {
  const fl = 0.6 + 0.4 * Math.sin(t * 7);
  ctx.fillStyle = color; ctx.globalAlpha *= 1;
  ctx.fillRect(x - gap - sz / 2, y, sz, sz); ctx.fillRect(x + gap - sz / 2, y, sz, sz);
  ctx.save(); ctx.globalAlpha = fl * 0.6; ctx.fillStyle = '#fff';
  ctx.fillRect(x - gap - sz / 2, y, sz, sz / 2); ctx.fillRect(x + gap - sz / 2, y, sz, sz / 2);
  ctx.restore();
}
function shadow(ctx, x, y, r, a) { ctx.save(); ctx.globalAlpha = a * 0.4; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(x, y + r * 0.85, r * 0.95, r * 0.4, 0, 0, 6.28); ctx.fill(); ctx.restore(); }

// ───────────────────────────── SPRITES ─────────────────────────────

// 🐺 dire wolf — hunched, fanged maw, hackles
function drawWolf(ctx, x, y, r, color, t, flash, hurt, face) {
  const bob = Math.sin(t * 7) * 1.2, step = Math.sin(t * 10) * 1.5;
  shadow(ctx, x, y, r, ctx.globalAlpha);
  const body = flash ? '#fff' : shade(color, -0.25), fur = flash ? '#fff' : shade(color, -0.05);
  // legs
  ctx.fillStyle = shade(body, -0.3); ctx.fillRect(x - r + 1, y + r - 3, 2, 4 + step); ctx.fillRect(x + r - 3, y + r - 3, 2, 4 - step);
  // body (lean, lowered)
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(x, y + bob, r, r * 0.7, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = fur; ctx.beginPath(); ctx.ellipse(x - face * 1, y - 1 + bob, r * 0.8, r * 0.5, 0, 0, 6.28); ctx.fill();
  // hackles (jagged spine)
  ctx.fillStyle = shade(body, -0.4);
  for (let i = -2; i <= 2; i++) ctx.fillRect(x + i * 2, y - r * 0.7 + bob - Math.abs(i), 1, 3);
  // head forward
  const hx = x + face * (r * 0.7), hy = y - r * 0.2 + bob;
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.55, r * 0.45, 0, 0, 6.28); ctx.fill();
  // snout + fangs
  ctx.fillStyle = shade(body, -0.2); ctx.fillRect(hx + face * 2, hy, face * r * 0.6, 3);
  ctx.fillStyle = '#fff'; ctx.fillRect(hx + face * (r * 0.5), hy + 2, 1, 2); ctx.fillRect(hx + face * (r * 0.35), hy + 2, 1, 2);
  // ears
  ctx.fillStyle = shade(body, -0.3); ctx.beginPath(); ctx.moveTo(hx - 2, hy - r * 0.4); ctx.lineTo(hx, hy - r * 0.7); ctx.lineTo(hx + 1, hy - r * 0.35); ctx.fill();
  // eye
  eyes(ctx, hx + face * 1, hy - 1, 0, 2, '#FCA5A5', t);
}

// 🐍 serpent — coiled body, hood, dripping fangs
function drawSerpent(ctx, x, y, r, color, t, flash, hurt, face) {
  const wob = Math.sin(t * 4);
  shadow(ctx, x, y, r, ctx.globalAlpha);
  const body = flash ? '#fff' : color;
  // coiled tail rings
  ctx.fillStyle = shade(body, -0.25);
  for (let i = 0; i < 3; i++) { const rr = r - i * 2; ctx.beginPath(); ctx.ellipse(x + Math.sin(t * 3 + i) * 2, y + r * 0.4 - i * 1.5, rr, rr * 0.45, 0, 0, 6.28); ctx.fill(); }
  // raised neck (S-curve)
  ctx.strokeStyle = body; ctx.lineWidth = r * 0.55; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y + r * 0.3); ctx.quadraticCurveTo(x + wob * 4, y - r * 0.2, x + face * 2, y - r); ctx.stroke();
  // hood
  const hx = x + face * 2, hy = y - r;
  ctx.fillStyle = shade(body, 0.1); ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.6, r * 0.5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = shade(body, -0.3); ctx.fillRect(hx - r * 0.6, hy, r * 1.2, 1);
  // fangs + venom drip
  ctx.fillStyle = '#fff'; ctx.fillRect(hx + face * 2, hy + 2, 1, 2);
  ctx.fillStyle = '#86EFAC'; ctx.globalAlpha *= 0.8; ctx.fillRect(hx + face * 2, hy + 4 + (Math.sin(t * 5) > 0 ? 1 : 0), 1, 1); ctx.globalAlpha /= 0.8;
  eyes(ctx, hx, hy - 1, 2, 1.6, '#BBF7D0', t);
}

// 🧚 wraith-fairy — torn wings, gaunt, cold glow
function drawFairy(ctx, x, y, r, color, t, flash, hurt, face) {
  const fly = Math.sin(t * 5) * 2;
  shadow(ctx, x, y + 2, r * 0.8, ctx.globalAlpha * 0.6);
  const body = flash ? '#fff' : color;
  // tattered wings
  ctx.save(); ctx.globalAlpha *= 0.55; ctx.fillStyle = shade(body, 0.3);
  const wf = Math.sin(t * 16) * 2;
  ctx.beginPath(); ctx.moveTo(x, y - 2 + fly); ctx.lineTo(x - r - 2, y - r + wf + fly); ctx.lineTo(x - r + 1, y + 1 + fly); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x, y - 2 + fly); ctx.lineTo(x + r + 2, y - r - wf + fly); ctx.lineTo(x + r - 1, y + 1 + fly); ctx.fill();
  ctx.restore();
  // thin body
  ctx.fillStyle = body; ctx.fillRect(x - 2, y - r * 0.3 + fly, 4, r);
  // head
  ctx.fillStyle = shade(body, 0.15); ctx.beginPath(); ctx.arc(x, y - r * 0.5 + fly, r * 0.42, 0, 6.28); ctx.fill();
  // frost crown shards
  ctx.fillStyle = '#E0F2FE'; for (let i = -1; i <= 1; i++) ctx.fillRect(x + i * 2, y - r * 0.9 + fly - Math.abs(i), 1, 3);
  eyes(ctx, x, y - r * 0.55 + fly, 1.4, 1.4, '#7DD3FC', t);
}

// 🔥 magma golem — cracked rock, glowing seams
function drawGolem(ctx, x, y, r, color, t, flash, hurt, face) {
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  shadow(ctx, x, y, r * 1.1, ctx.globalAlpha);
  const rock = flash ? '#fff' : '#2B1410';
  // bulky torso
  ctx.fillStyle = rock; ctx.fillRect(x - r, y - r * 0.6, r * 2, r * 1.5);
  ctx.fillStyle = shade(rock, 0.2); ctx.fillRect(x - r, y - r * 0.6, r * 2, 2);
  // arms (boulders)
  ctx.fillStyle = rock; ctx.fillRect(x - r - 3, y - r * 0.3, 4, r); ctx.fillRect(x + r - 1, y - r * 0.3, 4, r);
  // lava seams
  ctx.save(); ctx.globalAlpha *= (0.6 + pulse * 0.4); ctx.strokeStyle = '#F97316'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - r * 0.5, y - r * 0.4); ctx.lineTo(x - r * 0.2, y + r * 0.2); ctx.lineTo(x - r * 0.5, y + r * 0.7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + r * 0.5, y - r * 0.5); ctx.lineTo(x + r * 0.2, y + r * 0.3); ctx.stroke();
  ctx.restore();
  // molten core
  ctx.fillStyle = '#FB923C'; ctx.globalAlpha *= (0.7 + pulse * 0.3); ctx.fillRect(x - 2, y, 4, 4); ctx.globalAlpha /= (0.7 + pulse * 0.3);
  eyes(ctx, x, y - r * 0.3, 2, 2, '#FDBA74', t);
}

// 🌑🌒 shadow fiend — smoky wisp, clawed
function drawShadow(ctx, x, y, r, color, t, flash, hurt, face) {
  const sway = Math.sin(t * 6) * 2;
  ctx.save(); ctx.globalAlpha *= 0.9;
  const body = flash ? '#fff' : '#14121C';
  // smoky aura
  ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = shade(color, -0.2); ctx.beginPath(); ctx.arc(x, y, r * 1.3, 0, 6.28); ctx.fill(); ctx.restore();
  // wispy body
  ctx.fillStyle = body; ctx.beginPath();
  ctx.moveTo(x - r * 0.6, y - r); ctx.quadraticCurveTo(x - r + sway, y + r, x - r * 0.3, y + r);
  ctx.lineTo(x + r * 0.3, y + r); ctx.quadraticCurveTo(x + r - sway, y + r, x + r * 0.6, y - r);
  ctx.quadraticCurveTo(x, y - r * 1.4, x - r * 0.6, y - r); ctx.fill();
  // claws
  ctx.strokeStyle = shade(color, 0.3); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - r * 0.8, y); ctx.lineTo(x - r * 1.1, y + 3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + r * 0.8, y); ctx.lineTo(x + r * 1.1, y + 3); ctx.stroke();
  ctx.restore();
  eyes(ctx, x, y - r * 0.4, 1.6, 1.8, color === '#F59E0B' ? '#FCD34D' : '#C4B5FD', t);
}

// 🤖 iron revenant — hulking armor, single optic
function drawTitan(ctx, x, y, r, color, t, flash, hurt, face) {
  const hum = Math.sin(t * 3);
  shadow(ctx, x, y, r * 1.2, ctx.globalAlpha);
  const metal = flash ? '#fff' : shade(color, -0.1), dark = shade(color, -0.4);
  // legs
  ctx.fillStyle = dark; ctx.fillRect(x - r * 0.6, y + r * 0.6, r * 0.5, r * 0.6); ctx.fillRect(x + r * 0.1, y + r * 0.6, r * 0.5, r * 0.6);
  // torso
  ctx.fillStyle = metal; ctx.fillRect(x - r, y - r * 0.8, r * 2, r * 1.5);
  ctx.fillStyle = shade(metal, 0.2); ctx.fillRect(x - r, y - r * 0.8, r * 2, 2);
  ctx.fillStyle = dark; ctx.fillRect(x - r, y - r * 0.1, r * 2, 1);
  // shoulder spikes
  ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(x - r, y - r * 0.8); ctx.lineTo(x - r - 3, y - r * 1.2); ctx.lineTo(x - r * 0.6, y - r * 0.6); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + r, y - r * 0.8); ctx.lineTo(x + r + 3, y - r * 1.2); ctx.lineTo(x + r * 0.6, y - r * 0.6); ctx.fill();
  // head
  ctx.fillStyle = shade(metal, -0.15); ctx.fillRect(x - r * 0.4, y - r * 1.3 + hum, r * 0.8, r * 0.6);
  // optic
  ctx.fillStyle = '#F87171'; ctx.globalAlpha *= (0.6 + 0.4 * Math.sin(t * 8)); ctx.fillRect(x - r * 0.3, y - r * 1.1 + hum, r * 0.6, 2); ctx.globalAlpha = ctx.globalAlpha;
}

// 🧙‍♀️ hexcrone — robe, pointed hat, orb
function drawWitch(ctx, x, y, r, color, t, flash, hurt, face) {
  const float = Math.sin(t * 4) * 1.5;
  shadow(ctx, x, y + 1, r, ctx.globalAlpha);
  const robe = flash ? '#fff' : shade(color, -0.2);
  // robe (triangle)
  ctx.fillStyle = robe; ctx.beginPath(); ctx.moveTo(x, y - r * 0.4 + float); ctx.lineTo(x - r, y + r + float); ctx.lineTo(x + r, y + r + float); ctx.fill();
  ctx.fillStyle = shade(robe, 0.15); ctx.fillRect(x - 1, y - r * 0.4 + float, 2, r * 1.3);
  // head
  ctx.fillStyle = '#C9B896'; ctx.beginPath(); ctx.arc(x, y - r * 0.6 + float, r * 0.4, 0, 6.28); ctx.fill();
  // hat
  ctx.fillStyle = shade(robe, -0.2); ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r * 0.8 + float); ctx.lineTo(x + face * 2, y - r * 1.8 + float); ctx.lineTo(x + r * 0.6, y - r * 0.8 + float); ctx.fill();
  ctx.fillRect(x - r * 0.7, y - r * 0.8 + float, r * 1.4, 1.5);
  // orb in hand
  const ox = x + face * (r + 1), oy = y + float;
  ctx.fillStyle = color; ctx.globalAlpha *= (0.6 + 0.4 * Math.sin(t * 6)); ctx.beginPath(); ctx.arc(ox, oy, 2.5, 0, 6.28); ctx.fill(); ctx.globalAlpha = ctx.globalAlpha;
  eyes(ctx, x, y - r * 0.6 + float, 1.4, 1.2, '#E9D5FF', t);
}

// 🦅 storm raptor — wide wings, beak
function drawEagle(ctx, x, y, r, color, t, flash, hurt, face) {
  const flap = Math.sin(t * 12) * 3, fly = Math.sin(t * 5) * 2;
  shadow(ctx, x, y + 2, r, ctx.globalAlpha * 0.5);
  const body = flash ? '#fff' : color, dark = shade(color, -0.3);
  // wings
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.moveTo(x, y + fly); ctx.lineTo(x - r * 1.6, y - r * 0.6 + flap + fly); ctx.lineTo(x - r * 0.4, y + r * 0.3 + fly); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x, y + fly); ctx.lineTo(x + r * 1.6, y - r * 0.6 - flap + fly); ctx.lineTo(x + r * 0.4, y + r * 0.3 + fly); ctx.fill();
  // body
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(x, y + fly, r * 0.5, r * 0.7, 0, 0, 6.28); ctx.fill();
  // head + beak
  ctx.fillStyle = shade(body, 0.1); ctx.beginPath(); ctx.arc(x, y - r * 0.5 + fly, r * 0.35, 0, 6.28); ctx.fill();
  ctx.fillStyle = '#FBBF24'; ctx.beginPath(); ctx.moveTo(x + face * 2, y - r * 0.5 + fly); ctx.lineTo(x + face * (r * 0.7), y - r * 0.35 + fly); ctx.lineTo(x + face * 2, y - r * 0.25 + fly); ctx.fill();
  eyes(ctx, x, y - r * 0.55 + fly, 1.2, 1.4, '#FDE68A', t);
}

// ⚔️ warlord (boss) — armored brute + greatsword
function drawWarlord(ctx, x, y, r, color, t, flash, hurt, face) {
  const breath = Math.sin(t * 3);
  shadow(ctx, x, y, r * 1.2, ctx.globalAlpha);
  const armor = flash ? '#fff' : shade(color, -0.1), dark = shade(color, -0.45);
  // legs
  ctx.fillStyle = dark; ctx.fillRect(x - r * 0.6, y + r * 0.5, r * 0.5, r * 0.7); ctx.fillRect(x + r * 0.1, y + r * 0.5, r * 0.5, r * 0.7);
  // torso
  ctx.fillStyle = armor; ctx.fillRect(x - r * 0.9, y - r * 0.7 + breath, r * 1.8, r * 1.4);
  ctx.fillStyle = shade(armor, -0.2); ctx.fillRect(x - r * 0.9, y - r * 0.1, r * 1.8, 2);
  // pauldrons
  ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(x - r * 0.9, y - r * 0.5 + breath, r * 0.4, 0, 6.28); ctx.fill(); ctx.beginPath(); ctx.arc(x + r * 0.9, y - r * 0.5 + breath, r * 0.4, 0, 6.28); ctx.fill();
  // horned helm
  ctx.fillStyle = shade(armor, -0.1); ctx.fillRect(x - r * 0.45, y - r * 1.3 + breath, r * 0.9, r * 0.7);
  ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(x - r * 0.45, y - r * 1.2 + breath); ctx.lineTo(x - r * 0.8, y - r * 1.6 + breath); ctx.lineTo(x - r * 0.2, y - r * 1.2 + breath); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + r * 0.45, y - r * 1.2 + breath); ctx.lineTo(x + r * 0.8, y - r * 1.6 + breath); ctx.lineTo(x + r * 0.2, y - r * 1.2 + breath); ctx.fill();
  // greatsword
  ctx.strokeStyle = '#9CA3AF'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + face * r, y + r * 0.4); ctx.lineTo(x + face * (r + 4), y - r * 1.5); ctx.stroke();
  // visor glow
  ctx.fillStyle = '#F87171'; ctx.globalAlpha *= (0.6 + 0.4 * Math.sin(t * 8)); ctx.fillRect(x - r * 0.35, y - r * 1.05 + breath, r * 0.7, 1.5); ctx.globalAlpha = ctx.globalAlpha;
}

// 🌳 forest ancient (boss) — gnarled treant, glowing eyes in bark
function drawTreant(ctx, x, y, r, color, t, flash, hurt, face) {
  const sway = Math.sin(t * 2) * 2;
  shadow(ctx, x, y, r * 1.3, ctx.globalAlpha);
  const bark = flash ? '#fff' : '#3B2A1A';
  // trunk
  ctx.fillStyle = bark; ctx.fillRect(x - r * 0.7, y - r, r * 1.4, r * 2);
  ctx.fillStyle = shade(bark, -0.3); ctx.fillRect(x - r * 0.2, y - r, 2, r * 2);
  // roots
  ctx.fillStyle = bark; for (let i = -1; i <= 1; i++) ctx.fillRect(x + i * r * 0.5, y + r * 0.8, 3, 4);
  // branch arms
  ctx.strokeStyle = bark; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r * 0.3); ctx.lineTo(x - r - 3 + sway, y - r * 0.8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + r * 0.6, y - r * 0.3); ctx.lineTo(x + r + 3 - sway, y - r * 0.8); ctx.stroke();
  // canopy (sickly)
  ctx.fillStyle = shade(color, -0.2); ctx.beginPath(); ctx.arc(x, y - r * 1.1 + sway, r * 0.8, 0, 6.28); ctx.fill();
  ctx.fillStyle = shade(color, 0.1); ctx.beginPath(); ctx.arc(x - r * 0.4, y - r * 1.3 + sway, r * 0.4, 0, 6.28); ctx.fill();
  // hollow glowing eyes + maw
  eyes(ctx, x, y - r * 0.2, 2.4, 2.2, '#A3E635', t);
  ctx.fillStyle = '#1a1208'; ctx.fillRect(x - 2, y + r * 0.3, 4, 3);
  ctx.fillStyle = '#84CC16'; ctx.globalAlpha *= 0.5; ctx.fillRect(x - 2, y + r * 0.3, 4, 1); ctx.globalAlpha /= 0.5;
}

// 👸 frost queen (boss) — ice crown, flowing gown, shards
function drawQueen(ctx, x, y, r, color, t, flash, hurt, face) {
  const float = Math.sin(t * 3) * 1.5;
  shadow(ctx, x, y + 1, r, ctx.globalAlpha);
  const gown = flash ? '#fff' : shade(color, 0.15);
  // orbiting ice shards
  for (let i = 0; i < 4; i++) { const a = t * 2 + i * 1.57; const sx = x + Math.cos(a) * (r + 4), sy = y - r * 0.3 + Math.sin(a) * (r * 0.6) + float; ctx.fillStyle = '#BAE6FD'; ctx.globalAlpha *= 0.8; ctx.fillRect(sx - 1, sy - 1, 2, 3); ctx.globalAlpha /= 0.8; }
  // gown
  ctx.fillStyle = gown; ctx.beginPath(); ctx.moveTo(x, y - r * 0.5 + float); ctx.lineTo(x - r, y + r + float); ctx.lineTo(x + r, y + r + float); ctx.fill();
  ctx.fillStyle = shade(gown, 0.2); ctx.fillRect(x - 1, y - r * 0.5 + float, 2, r * 1.4);
  // head
  ctx.fillStyle = '#E5E7EB'; ctx.beginPath(); ctx.arc(x, y - r * 0.7 + float, r * 0.38, 0, 6.28); ctx.fill();
  // ice crown
  ctx.fillStyle = '#7DD3FC'; for (let i = -2; i <= 2; i++) ctx.fillRect(x + i * 2, y - r * 1.1 + float - (2 - Math.abs(i)), 1.4, 4 + (2 - Math.abs(i)) * 2);
  eyes(ctx, x, y - r * 0.72 + float, 1.4, 1.4, '#E0F2FE', t);
}

// 🐉 void dragon (boss) — winged serpent, horned head, maw glow
function drawDragon(ctx, x, y, r, color, t, flash, hurt, face) {
  const flap = Math.sin(t * 6) * 4, breath = Math.sin(t * 4);
  shadow(ctx, x, y, r * 1.4, ctx.globalAlpha);
  const scale = flash ? '#fff' : shade(color, -0.2), dark = shade(color, -0.5);
  // wings
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.moveTo(x, y - r * 0.4); ctx.lineTo(x - r * 1.8, y - r - flap); ctx.lineTo(x - r * 1.4, y + r * 0.2); ctx.lineTo(x - r * 0.3, y); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x, y - r * 0.4); ctx.lineTo(x + r * 1.8, y - r + flap); ctx.lineTo(x + r * 1.4, y + r * 0.2); ctx.lineTo(x + r * 0.3, y); ctx.fill();
  // body
  ctx.fillStyle = scale; ctx.beginPath(); ctx.ellipse(x, y + breath, r * 0.7, r, 0, 0, 6.28); ctx.fill();
  // belly scutes
  ctx.fillStyle = shade(scale, 0.15); ctx.fillRect(x - 2, y - r * 0.6 + breath, 4, r * 1.4);
  // neck + head
  const hx = x + face * r * 0.3, hy = y - r * 0.9 + breath;
  ctx.fillStyle = scale; ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.5, r * 0.4, 0, 0, 6.28); ctx.fill();
  // horns
  ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(hx - 2, hy - r * 0.3); ctx.lineTo(hx - 4, hy - r * 0.8); ctx.lineTo(hx, hy - r * 0.3); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + 2, hy - r * 0.3); ctx.lineTo(hx + 4, hy - r * 0.8); ctx.lineTo(hx, hy - r * 0.3); ctx.fill();
  // maw glow
  ctx.fillStyle = '#FCD34D'; ctx.globalAlpha *= (0.5 + 0.5 * Math.sin(t * 9)); ctx.fillRect(hx + face * 2, hy + 1, face * 4, 2); ctx.globalAlpha = ctx.globalAlpha;
  eyes(ctx, hx, hy - 1, 2, 2, '#FDE047', t);
}

// 👑💀 emperor (boss) — crowned wraith / death lord
function drawEmperor(ctx, x, y, r, color, t, flash, hurt, face, variant) {
  const float = Math.sin(t * 3) * 1.5;
  shadow(ctx, x, y + 1, r * 1.2, ctx.globalAlpha);
  const robe = flash ? '#fff' : '#1A1530';
  // robe
  ctx.fillStyle = robe; ctx.beginPath(); ctx.moveTo(x, y - r * 0.7 + float); ctx.lineTo(x - r * 1.1, y + r + float); ctx.lineTo(x + r * 1.1, y + r + float); ctx.fill();
  ctx.fillStyle = '#F59E0B'; ctx.fillRect(x - 0.5, y - r * 0.4 + float, 1, r * 1.2); // gold trim
  // collar
  ctx.fillStyle = shade(robe, 0.2); ctx.beginPath(); ctx.moveTo(x - r * 0.5, y - r * 0.5 + float); ctx.lineTo(x, y - r + float); ctx.lineTo(x + r * 0.5, y - r * 0.5 + float); ctx.fill();
  // skull/face
  ctx.fillStyle = variant === 2 ? '#E5E7EB' : '#0C0C18'; ctx.beginPath(); ctx.arc(x, y - r * 0.7 + float, r * 0.4, 0, 6.28); ctx.fill();
  if (variant === 2) { ctx.fillStyle = '#000'; ctx.fillRect(x - 2.5, y - r * 0.75 + float, 2, 2); ctx.fillRect(x + 0.5, y - r * 0.75 + float, 2, 2); ctx.fillRect(x - 2, y - r * 0.5 + float, 4, 1); }
  // crown
  ctx.fillStyle = '#F59E0B'; for (let i = -2; i <= 2; i++) ctx.fillRect(x + i * 2, y - r * 1.1 + float - (2 - Math.abs(i)), 1.4, 3 + (2 - Math.abs(i)));
  ctx.fillStyle = '#DC2626'; ctx.fillRect(x - 0.5, y - r * 1.0 + float, 1.5, 1.5); // central ruby
  if (variant !== 2) eyes(ctx, x, y - r * 0.72 + float, 1.6, 1.6, '#FCD34D', t);
}

// generic fallback monster (jagged blob with eyes)
function drawFiend(ctx, x, y, r, color, t, flash, hurt, face) {
  const bob = Math.sin(t * 6) * 1.2;
  shadow(ctx, x, y, r, ctx.globalAlpha);
  ctx.fillStyle = flash ? '#fff' : shade(color, -0.15);
  ctx.beginPath();
  const spikes = 9; ctx.moveTo(x + r, y + bob);
  for (let i = 1; i <= spikes; i++) { const a = (i / spikes) * 6.28; const rr = r * (i % 2 ? 0.78 : 1); ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr + bob); }
  ctx.closePath(); ctx.fill();
  eyes(ctx, x, y - 1 + bob, 2, 2, '#F87171', t);
}

// ───────────── archetype lookup ─────────────
const SPRITE_BY_EMOJI = {
  '🐺': drawWolf, '🐍': drawSerpent, '🧚': drawFairy, '🔥': drawGolem,
  '🌑': drawShadow, '🌒': drawShadow, '👥': drawShadow,
  '🤖': drawTitan, '🧙‍♀️': drawWitch, '🦅': drawEagle,
  '⚔️': drawWarlord, '🌳': drawTreant, '👸': drawQueen, '🐉': drawDragon,
  '👑': (c, x, y, r, col, t, f, h, fa) => drawEmperor(c, x, y, r, col, t, f, h, fa, 1),
  '💀': (c, x, y, r, col, t, f, h, fa) => drawEmperor(c, x, y, r, col, t, f, h, fa, 2),
};

export function drawCreature(ctx, emoji, x, y, r, color, t, flash, hurt, facing = 1) {
  const fn = SPRITE_BY_EMOJI[emoji] || drawFiend;
  fn(ctx, x, y, r, color, t, flash, hurt, facing);
}

export function hasSprite(emoji) { return !!SPRITE_BY_EMOJI[emoji]; }
