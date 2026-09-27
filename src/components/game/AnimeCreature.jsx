import { motion } from 'framer-motion';
import { TYPE_COLORS, TYPE_ICONS, STATUS_INFO } from '../../data/arenaAbilities';
import { Icon } from '../Icon';
import { CreaturePortrait } from './CreaturePortrait';

const SIZES = {
  selector: { w: 120, h: 150, emoji: '3rem' },
  playerCombat: { w: 200, h: 250, emoji: '5rem' },
  enemyCombat: { w: 220, h: 280, emoji: '5.5rem' },
  preview: { w: 80, h: 100, emoji: '2rem' },
};

// animState: 'idle' | 'attack' | 'damage' | 'heal' | 'death' | 'cast' | 'victory'
export function AnimeCreature({
  emoji = '🃏',
  type = 'Void',
  size = 'selector',
  animState = 'idle',
  statusEffects = [],
  facing = 'right',
  isDead = false,
}) {
  const dim = SIZES[size] || SIZES.selector;
  const color = TYPE_COLORS[type] || '#F59E0B';
  const typeIcon = TYPE_ICONS[type] || '🌌';

  const animVariants = {
    idle: { y: [0, -4, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
    victory: { y: [0, -10, 0], transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' } },
    attack: { x: facing === 'right' ? [0, 40, 0] : [0, -40, 0], transition: { duration: 0.3 } },
    damage: { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } },
    heal: { scale: [1, 1.12, 1], transition: { duration: 0.4 } },
    cast: { scale: [1, 1.1, 1], transition: { duration: 0.2 } },
    death: { y: 30, opacity: 0, transition: { duration: 0.6 } },
  };

  const flashOverlay =
    animState === 'damage' ? 'rgba(220,38,38,0.5)'
    : animState === 'heal' ? 'rgba(34,197,94,0.5)'
    : animState === 'cast' ? 'rgba(255,255,255,0.6)'
    : 'transparent';

  return (
    <motion.div
      animate={isDead ? 'death' : animState}
      variants={animVariants}
      style={{
        width: dim.w, height: dim.h,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: isDead ? 0.3 : 1,
        filter: isDead ? 'grayscale(100%)' : 'none',
      }}
    >
      {/* SVG layered composition */}
      <svg width={dim.w} height={dim.h} viewBox={`0 0 ${dim.w} ${dim.h}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id={`aura-${type}-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="70%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Layer 1: aura */}
        <circle
          cx={dim.w / 2} cy={dim.h / 2} r={dim.w * 0.42}
          fill={`url(#aura-${type}-${size})`}
          style={{ animation: 'arenaAuraPulse 1.5s ease-in-out infinite', transformOrigin: 'center' }}
        />

        {/* Layer 2: body silhouette */}
        <ellipse
          cx={dim.w / 2} cy={dim.h / 2 + dim.h * 0.05} rx={dim.w * 0.30} ry={dim.h * 0.30}
          fill="#1C0A0A" stroke={color} strokeWidth="2" strokeOpacity="0.5"
        />
      </svg>

      {/* Layer 3: procedural creature sprite (no emoji) */}
      <div style={{ position: 'relative', zIndex: 2, lineHeight: 1, userSelect: 'none', display: 'flex' }}>
        <CreaturePortrait emoji={emoji} type={type} size={Math.round(dim.w * 0.55)} />
      </div>

      {/* Damage/heal flash overlay */}
      {flashOverlay !== 'transparent' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: flashOverlay, zIndex: 3, pointerEvents: 'none',
          }}
        />
      )}

      {/* Layer 4: type badge */}
      <div style={{
        position: 'absolute', bottom: dim.h * 0.08, right: dim.w * 0.12,
        width: 26, height: 26, borderRadius: '50%',
        background: '#0D0608', border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, zIndex: 4,
        boxShadow: `0 0 10px ${color}`,
      }}>
        <Icon glyph={typeIcon} size={15} />
      </div>

      {/* Layer 5: status effect particles */}
      {statusEffects && statusEffects.length > 0 && (
        <div style={{
          position: 'absolute', top: 4, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 3, zIndex: 5,
        }}>
          {statusEffects.slice(0, 4).map((se, i) => {
            const info = STATUS_INFO[se.type];
            if (!info) return null;
            return (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                style={{ color: info.color, filter: `drop-shadow(0 0 3px ${info.color})`, display: 'grid', placeItems: 'center' }}
                title={`${info.name} (${se.stacks})`}
              >
                <Icon glyph={info.icon} size={13} />
              </motion.div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes arenaAuraPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </motion.div>
  );
}
