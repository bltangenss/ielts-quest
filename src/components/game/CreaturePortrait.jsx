import { useRef, useEffect } from 'react';
import { drawCreature } from './bestiary';
import { TYPE_COLORS } from '../../data/arenaAbilities';

// Animated canvas portrait of a creature/hero for menus & cards.
// Uses the same procedural bestiary sprites as combat (no emoji).
export function CreaturePortrait({ emoji, type, color, size = 64, hero = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const W = 64, H = 64; cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    const col = color || TYPE_COLORS[type] || '#DC2626';
    let raf, start = performance.now();
    const loop = (now) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      // soft aura
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 30);
      g.addColorStop(0, col + '33'); g.addColorStop(1, col + '00');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (hero) drawHeroPortrait(ctx, W / 2, H / 2 + 6, 13, col, t, emoji);
      else drawCreature(ctx, emoji, W / 2, H / 2 + 4, 14, col, t, false, false, 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [emoji, type, color, hero]);
  return <canvas ref={ref} style={{ width: size, height: size, imageRendering: 'pixelated' }} />;
}

// detailed ninja portrait (matches in-game hero look)
function drawHeroPortrait(ctx, x, y, r, col, t, emoji) {
  const shadowStyle = col === '#A78BFA';
  const pal = shadowStyle
    ? { cloth: '#1E1B4B', cloth2: '#312E81', trim: '#A78BFA', glow: '#C4B5FD', scarf: '#6D28D9', blade: '#C4B5FD', rim: '#A78BFA', eye: '#E0E7FF' }
    : { cloth: '#15151F', cloth2: '#26222E', trim: '#DC2626', glow: '#F87171', scarf: '#B91C1C', blade: '#FCA5A5', rim: '#DC2626', eye: '#FCA5A5' };
  const bob = Math.sin(t * 3) * 1.2, sway = Math.sin(t * 6) * 2;
  // scarf
  ctx.fillStyle = pal.scarf;
  ctx.beginPath(); ctx.moveTo(x - 2, y - r + 2 + bob); ctx.quadraticCurveTo(x - r - 5, y - 1 + bob + sway, x - r - 7, y + r - 1 + bob + sway); ctx.quadraticCurveTo(x - r - 2, y + r + bob, x - 1, y + 2 + bob); ctx.closePath(); ctx.fill();
  // cloak
  ctx.fillStyle = pal.cloth; ctx.beginPath(); ctx.moveTo(x - r + 1, y - r + 3 + bob); ctx.lineTo(x - r - 1, y + r + 1 + bob); ctx.lineTo(x + r + 1, y + r + 1 + bob); ctx.lineTo(x + r - 1, y - r + 3 + bob); ctx.closePath(); ctx.fill();
  // gi
  ctx.fillStyle = pal.cloth2; ctx.fillRect(x - r + 2, y - 2 + bob, (r - 2) * 2, r + 2);
  ctx.fillStyle = pal.cloth; ctx.fillRect(x - r + 2, y - 2 + bob, r - 1, r + 2);
  ctx.strokeStyle = pal.trim; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - r + 3, y - 1 + bob); ctx.lineTo(x + r - 3, y + r - 2 + bob); ctx.stroke();
  ctx.fillStyle = pal.trim; ctx.fillRect(x - r + 3, y + r - 3 + bob, (r - 3) * 2, 1.5);
  // head + hood
  ctx.fillStyle = '#0C0C12'; ctx.beginPath(); ctx.arc(x, y - r + bob, r - 1.5, 0, 6.28); ctx.fill();
  ctx.fillStyle = pal.cloth; ctx.beginPath(); ctx.moveTo(x - (r - 1), y - r + bob); ctx.lineTo(x, y - r - r * 0.8 + bob); ctx.lineTo(x + (r - 1), y - r + bob); ctx.closePath(); ctx.fill();
  ctx.fillStyle = pal.trim; ctx.fillRect(x - (r - 2), y - r - 1.5 + bob, (r - 2) * 2, 2);
  ctx.fillStyle = '#000'; ctx.fillRect(x - (r - 2.5), y - r + 1 + bob, (r - 2.5) * 2, 2.5);
  // eyes
  const ex = 1.2;
  ctx.fillStyle = pal.eye; ctx.fillRect(x - 2.4 + ex, y - r - 0.2 + bob, 1.6, 1.5); ctx.fillRect(x + 0.9 + ex, y - r - 0.2 + bob, 1.6, 1.5);
  // blade across
  ctx.strokeStyle = '#0A0A0F'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + r - 2, y + 1 + bob); ctx.lineTo(x + r + 6, y - r + bob); ctx.stroke();
  ctx.strokeStyle = pal.blade; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x + r - 2, y + 1 + bob); ctx.lineTo(x + r + 6, y - r + bob); ctx.stroke();
  const gl = (Math.sin(t * 9) + 1) / 2; ctx.globalAlpha = 0.4 + gl * 0.6; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + r + 6, y - r + bob, 1.6, 0, 6.28); ctx.fill(); ctx.globalAlpha = 1;
}
