const TAU = Math.PI * 2;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function shade(hex, factor) {
  if (!hex || hex[0] !== '#') return hex || '#A78BFA';
  const value = parseInt(hex.slice(1), 16);
  let r = (value >> 16) & 255;
  let g = (value >> 8) & 255;
  let b = value & 255;
  r = clamp(Math.round(r + (factor < 0 ? r : 255 - r) * factor), 0, 255);
  g = clamp(Math.round(g + (factor < 0 ? g : 255 - g) * factor), 0, 255);
  b = clamp(Math.round(b + (factor < 0 ? b : 255 - b) * factor), 0, 255);
  return `rgb(${r},${g},${b})`;
}

function withAlpha(hex, amount) {
  if (!hex) return `rgba(167,139,250,${amount})`;
  const rgb = /^rgb\((\d+),(\d+),(\d+)\)$/.exec(hex);
  if (rgb) return `rgba(${rgb[1]},${rgb[2]},${rgb[3]},${amount})`;
  if (hex[0] !== '#') return `rgba(167,139,250,${amount})`;
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${amount})`;
}

function heroPalette(g) {
  const accent = g.weapon?.color || g.heroColor || '#A78BFA';
  if (g.heroId === 'kage_severed') {
    return {
      accent: '#F87171',
      glow: '#FCA5A5',
      base: '#08080E',
      mid: '#15151F',
      cloth: '#211827',
      trim: '#DC2626',
      scarf: '#B91C1C',
      metal: '#F3F4F6',
      skin: '#2A1115',
      eye: '#FCA5A5',
      aura: 'rgba(220,38,38,0.34)',
      shadow: 'rgba(127,29,29,0.45)',
    };
  }
  if (g.heroId === 'raiden_ronin') {
    return {
      accent: '#A78BFA',
      glow: '#C4B5FD',
      base: '#111032',
      mid: '#1E1B4B',
      cloth: '#2D256F',
      trim: '#7DD3FC',
      scarf: '#6D28D9',
      metal: '#E0E7FF',
      skin: '#1B1740',
      eye: '#E0F2FE',
      aura: 'rgba(125,211,252,0.30)',
      shadow: 'rgba(76,29,149,0.45)',
    };
  }
  return {
    accent,
    glow: shade(accent, 0.45),
    base: '#101018',
    mid: '#1B1B2A',
    cloth: shade(accent, -0.58),
    trim: shade(accent, 0.22),
    scarf: shade(accent, -0.18),
    metal: '#F3F4F6',
    skin: '#F1C27D',
    eye: '#FFF7ED',
    aura: withAlpha(accent, 0.28),
    shadow: 'rgba(0,0,0,0.46)',
  };
}

function roundedRect(ctx, x, y, w, h, radius) {
  const r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCape(ctx, x, y, r, face, bob, walk, pal, t, legendary) {
  const sway = Math.sin(t * 5.4) * r * 0.16 + walk * r * 0.1;
  const capeDrop = legendary ? r * 1.7 : r * 1.35;
  ctx.fillStyle = pal.shadow;
  ctx.beginPath();
  ctx.moveTo(x - face * r * 0.2, y - r * 0.92 + bob);
  ctx.quadraticCurveTo(x - face * r * 1.55, y - r * 0.1 + bob + sway, x - face * r * 1.25, y + capeDrop + bob);
  ctx.quadraticCurveTo(x - face * r * 0.1, y + r * 1.42 + bob, x + face * r * 0.76, y + r * 1.2 + bob);
  ctx.quadraticCurveTo(x + face * r * 0.45, y + r * 0.2 + bob, x - face * r * 0.2, y - r * 0.92 + bob);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = withAlpha(pal.trim, 0.65);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - face * r * 0.75, y - r * 0.35 + bob);
  ctx.quadraticCurveTo(x - face * r * 1.25, y + r * 0.52 + bob + sway, x - face * r * 0.86, y + r * 1.28 + bob);
  ctx.stroke();
}

function drawBoots(ctx, x, y, r, bob, walk, pal) {
  const stride = walk * r * 0.22;
  const bootY = y + r * 0.98 + bob;
  ctx.fillStyle = shade(pal.base, -0.2);
  roundedRect(ctx, x - r * 0.48, bootY - stride, r * 0.34, r * 0.72, r * 0.12);
  ctx.fill();
  roundedRect(ctx, x + r * 0.14, bootY + stride, r * 0.34, r * 0.72, r * 0.12);
  ctx.fill();
  ctx.fillStyle = pal.trim;
  ctx.fillRect(x - r * 0.5, bootY + r * 0.28 - stride, r * 0.42, 1);
  ctx.fillRect(x + r * 0.1, bootY + r * 0.28 + stride, r * 0.42, 1);
}

function drawTorso(ctx, x, y, r, bob, pal, fl, legendary) {
  const bodyTop = y - r * 0.25 + bob;
  const bodyHeight = legendary ? r * 1.45 : r * 1.28;
  const armor = ctx.createLinearGradient(x - r, bodyTop, x + r, bodyTop + bodyHeight);
  armor.addColorStop(0, fl ? '#FFFFFF' : shade(pal.mid, 0.08));
  armor.addColorStop(0.55, fl ? '#FFFFFF' : pal.cloth);
  armor.addColorStop(1, fl ? '#FFFFFF' : shade(pal.base, -0.08));
  ctx.fillStyle = armor;
  roundedRect(ctx, x - r * 0.72, bodyTop, r * 1.44, bodyHeight, r * 0.24);
  ctx.fill();

  ctx.strokeStyle = withAlpha(pal.trim, 0.92);
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.52, bodyTop + r * 0.16);
  ctx.lineTo(x + r * 0.48, bodyTop + bodyHeight - r * 0.22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + r * 0.52, bodyTop + r * 0.22);
  ctx.lineTo(x - r * 0.34, bodyTop + bodyHeight - r * 0.08);
  ctx.stroke();

  ctx.fillStyle = fl ? '#FFFFFF' : shade(pal.base, -0.18);
  roundedRect(ctx, x - r * 0.34, bodyTop + r * 0.46, r * 0.68, r * 0.38, r * 0.08);
  ctx.fill();
  ctx.fillStyle = pal.glow;
  ctx.globalAlpha *= 0.82;
  ctx.fillRect(x - r * 0.24, bodyTop + r * 0.58, r * 0.48, 1.2);
  ctx.globalAlpha /= 0.82;

  if (legendary) {
    ctx.strokeStyle = withAlpha(pal.glow, 0.7);
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(x, bodyTop + r * 0.46, r * 0.24, 0, TAU);
    ctx.stroke();
  }
}

function drawShouldersAndHands(ctx, x, y, r, face, bob, pal, aimX, aimY, fl) {
  const shoulderY = y - r * 0.05 + bob;
  ctx.fillStyle = fl ? '#FFFFFF' : shade(pal.mid, 0.16);
  ctx.beginPath();
  ctx.ellipse(x - r * 0.78, shoulderY, r * 0.34, r * 0.24, -0.25, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + r * 0.78, shoulderY, r * 0.34, r * 0.24, 0.25, 0, TAU);
  ctx.fill();

  const ux = aimX || face;
  const uy = aimY || 0;
  const handX = x + ux * r * 0.62;
  const handY = y + uy * r * 0.35 + bob + r * 0.26;
  ctx.strokeStyle = fl ? '#FFFFFF' : shade(pal.cloth, 0.16);
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x + face * r * 0.35, shoulderY + r * 0.18);
  ctx.lineTo(handX, handY);
  ctx.stroke();

  ctx.fillStyle = pal.metal;
  ctx.beginPath();
  ctx.arc(handX, handY, r * 0.16, 0, TAU);
  ctx.fill();
}

function drawHead(ctx, x, y, r, face, bob, walk, pal, g, fl) {
  const headX = x + face * walk * r * 0.04;
  const headY = y - r * 0.88 + bob;
  ctx.fillStyle = fl ? '#FFFFFF' : pal.base;
  ctx.beginPath();
  ctx.arc(headX, headY, r * 0.72, 0, TAU);
  ctx.fill();

  ctx.fillStyle = fl ? '#FFFFFF' : shade(pal.mid, 0.08);
  ctx.beginPath();
  ctx.moveTo(headX - r * 0.72, headY - r * 0.14);
  ctx.lineTo(headX, headY - r * 1.08);
  ctx.lineTo(headX + r * 0.72, headY - r * 0.14);
  ctx.quadraticCurveTo(headX + r * 0.22, headY - r * 0.34, headX - r * 0.72, headY - r * 0.14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = fl ? '#FFFFFF' : shade(pal.base, -0.22);
  roundedRect(ctx, headX - r * 0.54, headY - r * 0.12, r * 1.08, r * 0.34, r * 0.08);
  ctx.fill();

  if (!fl) {
    const look = clamp(g.p?.aimX || 0, -0.7, 0.7) * r * 0.08;
    ctx.fillStyle = pal.eye;
    ctx.fillRect(headX - r * 0.3 + look, headY - r * 0.03, r * 0.17, r * 0.12);
    ctx.fillRect(headX + r * 0.14 + look, headY - r * 0.03, r * 0.17, r * 0.12);
    ctx.globalAlpha *= 0.54;
    ctx.fillStyle = pal.glow;
    ctx.fillRect(headX - r * 0.35 + look, headY - r * 0.06, r * 0.27, r * 0.18);
    ctx.fillRect(headX + r * 0.09 + look, headY - r * 0.06, r * 0.27, r * 0.18);
    ctx.globalAlpha /= 0.54;
  }

  ctx.strokeStyle = withAlpha(pal.trim, 0.9);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(headX, headY, r * 0.77, Math.PI * 0.08, Math.PI * 0.92, true);
  ctx.stroke();
}

function drawScarf(ctx, x, y, r, face, bob, walk, pal, t) {
  const flutter = Math.sin(t * 8.5) * r * 0.18 + walk * r * 0.12;
  ctx.strokeStyle = pal.scarf;
  ctx.lineWidth = r * 0.24;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - face * r * 0.14, y - r * 0.72 + bob);
  ctx.quadraticCurveTo(x - face * r * 1.12, y - r * 0.42 + bob + flutter, x - face * r * 1.42, y + r * 0.32 + bob + flutter * 0.5);
  ctx.stroke();
  ctx.strokeStyle = withAlpha(pal.glow, 0.72);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - face * r * 0.26, y - r * 0.72 + bob);
  ctx.quadraticCurveTo(x - face * r * 1.04, y - r * 0.42 + bob + flutter, x - face * r * 1.32, y + r * 0.26 + bob + flutter * 0.5);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

function drawCardSigil(ctx, g, x, y, r, bob, pal) {
  const img = g.cardImage;
  const art = g.cardArt;
  if (!img || !art || !img.complete || !img.naturalWidth) return;

  const cellW = img.naturalWidth / art.columns;
  const cellH = img.naturalHeight / art.rows;
  const sx = art.column * cellW;
  const sy = art.row * cellH;
  const sigilX = x;
  const sigilY = y + r * 0.28 + bob;

  ctx.save();
  ctx.globalAlpha *= 0.92;
  ctx.beginPath();
  ctx.arc(sigilX, sigilY, r * 0.27, 0, TAU);
  ctx.clip();
  ctx.drawImage(img, sx, sy, cellW, cellH, sigilX - r * 0.34, sigilY - r * 0.34, r * 0.68, r * 0.68);
  ctx.restore();

  ctx.strokeStyle = withAlpha(pal.glow, 0.86);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(sigilX, sigilY, r * 0.31, 0, TAU);
  ctx.stroke();
}

function drawMuzzleFlash(ctx, x, y, r, color, power = 1) {
  ctx.save();
  ctx.globalAlpha *= clamp(power, 0, 1);
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.26, 0, TAU);
  ctx.fill();
  ctx.fillStyle = color;
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * TAU;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a - 0.18) * r * 0.18, y + Math.sin(a - 0.18) * r * 0.18);
    ctx.lineTo(x + Math.cos(a) * r * 0.68, y + Math.sin(a) * r * 0.68);
    ctx.lineTo(x + Math.cos(a + 0.18) * r * 0.18, y + Math.sin(a + 0.18) * r * 0.18);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawWeapon(ctx, x, y, r, bob, pal, p, g) {
  const aimLen = Math.hypot(p.aimX || 0, p.aimY || 0) || 1;
  const ux = (p.aimX || 0) / aimLen;
  const uy = (p.aimY || -1) / aimLen;
  const angle = Math.atan2(uy, ux);
  const recoil = p.recoil > 0 ? r * 0.2 : 0;
  const weapon = g.weapon?.id || 'bare';
  const color = g.weapon?.color || pal.accent;
  const handX = x + ux * (r * 0.58 - recoil);
  const handY = y + bob + r * 0.18 + uy * (r * 0.38 - recoil);

  ctx.save();
  ctx.translate(handX, handY);
  ctx.rotate(angle);

  if (weapon === 'shadow_kunai') {
    ctx.strokeStyle = withAlpha('#000000', 0.72);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.42, -r * 0.2);
    ctx.lineTo(r * 1.34, -r * 0.2);
    ctx.moveTo(-r * 0.34, r * 0.24);
    ctx.lineTo(r * 1.14, r * 0.24);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.7;
    ctx.stroke();
    ctx.fillStyle = pal.metal;
    ctx.beginPath();
    ctx.moveTo(r * 1.38, -r * 0.2);
    ctx.lineTo(r * 0.78, -r * 0.46);
    ctx.lineTo(r * 0.92, r * 0.04);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(r * 1.18, r * 0.24);
    ctx.lineTo(r * 0.64, r * 0.02);
    ctx.lineTo(r * 0.76, r * 0.46);
    ctx.closePath();
    ctx.fill();
  } else if (weapon === 'volt_edge') {
    ctx.strokeStyle = '#05050A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.42, 0);
    ctx.lineTo(r * 1.92, 0);
    ctx.stroke();
    ctx.strokeStyle = pal.metal;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(r * 0.16, -r * 0.28);
    ctx.lineTo(r * 0.52, r * 0.18);
    ctx.lineTo(r * 0.84, -r * 0.18);
    ctx.lineTo(r * 1.22, r * 0.16);
    ctx.stroke();
  } else if (weapon === 'rail_lance') {
    ctx.fillStyle = '#0F172A';
    roundedRect(ctx, -r * 0.35, -r * 0.16, r * 1.86, r * 0.32, r * 0.08);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, 0);
    ctx.lineTo(r * 2.12, 0);
    ctx.stroke();
    ctx.fillStyle = pal.metal;
    ctx.beginPath();
    ctx.moveTo(r * 2.22, 0);
    ctx.lineTo(r * 1.42, -r * 0.28);
    ctx.lineTo(r * 1.42, r * 0.28);
    ctx.closePath();
    ctx.fill();
  } else if (weapon === 'prism_staff') {
    ctx.strokeStyle = '#120B20';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.58, 0);
    ctx.lineTo(r * 1.7, 0);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    const orb = ctx.createRadialGradient(r * 1.78, 0, 0, r * 1.78, 0, r * 0.45);
    orb.addColorStop(0, '#FFFFFF');
    orb.addColorStop(0.35, color);
    orb.addColorStop(1, withAlpha(color, 0));
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(r * 1.78, 0, r * 0.45, 0, TAU);
    ctx.fill();
  } else if (weapon === 'cinder_cannon') {
    ctx.fillStyle = '#1F1209';
    roundedRect(ctx, -r * 0.32, -r * 0.34, r * 1.7, r * 0.68, r * 0.18);
    ctx.fill();
    ctx.fillStyle = color;
    roundedRect(ctx, r * 0.74, -r * 0.22, r * 0.86, r * 0.44, r * 0.1);
    ctx.fill();
    ctx.fillStyle = pal.metal;
    ctx.fillRect(r * 0.02, -r * 0.42, r * 0.16, r * 0.84);
  } else {
    ctx.fillStyle = '#111827';
    roundedRect(ctx, -r * 0.25, -r * 0.2, r * 1.18, r * 0.4, r * 0.09);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillRect(r * 0.52, -r * 0.11, r * 0.62, r * 0.22);
    ctx.fillStyle = pal.metal;
    ctx.fillRect(-r * 0.4, r * 0.12, r * 0.46, r * 0.18);
  }

  if (p.muzzle > 0) {
    const flashPower = p.muzzle / 0.08;
    drawMuzzleFlash(ctx, r * 1.9, 0, r, color, flashPower);
  }

  ctx.restore();
}

function drawAfterimages(ctx, g, x, y, r, alpha, pal) {
  const trail = g.p?.trail || [];
  const visible = trail.slice(-4);
  visible.forEach((point, index) => {
    const k = (index + 1) / visible.length;
    ctx.globalAlpha = alpha * point.life * 0.22 * k;
    ctx.fillStyle = pal.glow;
    ctx.beginPath();
    ctx.ellipse(x + (point.x - g.p.x), y + (point.y - g.p.y), r * (0.9 + k * 0.35), r * (1.15 + k * 0.25), 0, 0, TAU);
    ctx.fill();
  });
  ctx.globalAlpha = alpha;
}

export function drawDetailedHeroModel(ctx, g, x, y, r, alpha = 1, bob = 0, fl = false) {
  const p = g?.p;
  if (!p) return false;

  const pal = heroPalette(g);
  const t = g.t || 0;
  const face = p.aimX < -0.16 ? -1 : p.aimX > 0.16 ? 1 : (p.face || 1);
  const walk = Math.sin(p.walkT || 0);
  const dash = clamp((p.dashT || 0) / 0.18, 0, 1);
  const legendary = g.heroRarity === 'legendary' || g.isNinja;
  const sizeBoost = legendary ? 1.08 : 1;
  const rr = r * sizeBoost;
  const coreY = y - rr * 0.1;

  ctx.save();
  ctx.globalAlpha = alpha;

  const aura = ctx.createRadialGradient(x, coreY + bob, 0, x, coreY + bob, rr * (3.1 + dash * 1.4));
  aura.addColorStop(0, dash ? withAlpha(pal.glow, 0.48) : pal.aura);
  aura.addColorStop(0.52, withAlpha(pal.accent, 0.16));
  aura.addColorStop(1, withAlpha(pal.accent, 0));
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(x, coreY + bob, rr * (3.1 + dash * 1.4), 0, TAU);
  ctx.fill();

  drawAfterimages(ctx, g, x, coreY, rr, alpha, pal);

  ctx.fillStyle = 'rgba(0,0,0,0.52)';
  ctx.beginPath();
  ctx.ellipse(x, y + rr * 1.22, rr * 1.42, rr * 0.5, 0, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = withAlpha(pal.glow, 0.28 + dash * 0.38);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y + rr * 1.2, rr * (1.6 + dash * 0.4), rr * 0.62, 0, 0, TAU);
  ctx.stroke();

  drawCape(ctx, x, coreY, rr, face, bob, walk, pal, t, legendary);
  drawBoots(ctx, x, coreY, rr, bob, walk, pal);
  drawTorso(ctx, x, coreY, rr, bob, pal, fl, legendary);
  drawShouldersAndHands(ctx, x, coreY, rr, face, bob, pal, p.aimX, p.aimY, fl);
  drawScarf(ctx, x, coreY, rr, face, bob, walk, pal, t);
  drawHead(ctx, x, coreY, rr, face, bob, walk, pal, g, fl);
  drawCardSigil(ctx, g, x, coreY, rr, bob, pal);
  drawWeapon(ctx, x, coreY, rr, bob, pal, p, g);

  if (dash > 0) {
    ctx.globalAlpha = alpha * dash * 0.55;
    ctx.strokeStyle = pal.glow;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(x, coreY + bob, rr * (1.45 + i * 0.38 + dash * 0.45), -0.5 + i * 0.4, Math.PI * 1.2 + i * 0.4);
      ctx.stroke();
    }
    ctx.globalAlpha = alpha;
  }

  if (fl) {
    ctx.globalAlpha = alpha * 0.42;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x, coreY + bob, rr * 1.38, rr * 2.05, 0, 0, TAU);
    ctx.fill();
  }

  ctx.strokeStyle = withAlpha(pal.trim, 0.84);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, coreY + bob, rr * 1.2, 0, TAU);
  ctx.stroke();

  ctx.restore();
  return true;
}
