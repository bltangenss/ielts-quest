import { motion } from 'framer-motion';
import { Icon } from '../Icon';

const TIER_COLORS = {
  normal: '#8B949E',
  elite: '#EF4444',
  boss: '#F59E0B',
};

export function EnemySprite({ enemy, currentHP, maxHP, shaking, intent, intentValue, buffCount = 0 }) {
  if (!enemy) return null;
  const hpPct = (currentHP / maxHP) * 100;
  const hpColor = hpPct > 60 ? '#3FB950' : hpPct > 30 ? '#F59E0B' : '#F85149';
  const tierColor = TIER_COLORS[enemy.tier] || '#8B949E';

  const renderIntent = () => {
    if (intent === 'attack') return <><Icon name="attack" size={14} /> {intentValue}</>;
    if (intent === 'defend') return <><Icon name="defense" size={14} /> {intentValue || ''}</>;
    if (intent === 'buff') return <><Icon name="sparkle" size={14} /> Buffing</>;
    return <Icon name="question" size={14} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* Intent badge */}
      <div style={{
        background: intent === 'attack' ? 'rgba(248,81,73,0.15)'
          : intent === 'defend' ? 'rgba(59,130,246,0.15)'
          : 'rgba(245,158,11,0.15)',
        border: `1px solid ${intent === 'attack' ? '#F85149' : intent === 'defend' ? '#3B82F6' : '#F59E0B'}`,
        borderRadius: 8, padding: '0.3rem 0.75rem',
        fontSize: '0.8rem', fontWeight: 700,
        color: intent === 'attack' ? '#F85149' : intent === 'defend' ? '#3B82F6' : '#F59E0B',
        display: 'inline-flex', alignItems: 'center', gap: 5,
      }}>
        {renderIntent()}
      </div>

      {/* Enemy sprite */}
      <motion.div
        animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { y: [0, -6, 0] }}
        transition={shaking ? { duration: 0.4 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          color: tierColor,
          filter: currentHP <= 0 ? 'grayscale(100%) opacity(0.3)' : `drop-shadow(0 0 20px ${tierColor}66)`,
          lineHeight: 1,
          userSelect: 'none',
          display: 'flex', justifyContent: 'center',
        }}
      >
        <Icon glyph={enemy.emoji} size={enemy.tier === 'boss' ? 76 : enemy.tier === 'elite' ? 60 : 52} />
      </motion.div>

      {/* Buff indicator */}
      {buffCount > 0 && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#F59E0B' }}>
          <Icon name="sparkle" size={12} /> Buffed ×{buffCount}
        </div>
      )}

      {/* Name and tier */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cinzel', fontWeight: 700, color: tierColor, fontSize: '0.85rem' }}>
          {enemy.name}
        </div>
        <div style={{
          fontSize: '0.6rem', color: tierColor,
          background: `${tierColor}22`, border: `1px solid ${tierColor}44`,
          borderRadius: 100, padding: '1px 6px', display: 'inline-block', marginTop: 2,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          {enemy.tier}
        </div>
      </div>

      {/* HP bar */}
      <div style={{ width: 160 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: '0.7rem' }}>
          <span style={{ color: '#8B949E' }}>HP</span>
          <span style={{ fontFamily: 'JetBrains Mono', color: hpColor, fontWeight: 700 }}>
            {Math.max(0, currentHP)}/{maxHP}
          </span>
        </div>
        <div style={{ background: '#1F2937', borderRadius: 4, height: 8, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${Math.max(0, hpPct)}%` }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%', background: hpColor, borderRadius: 4 }}
          />
        </div>
      </div>
    </div>
  );
}
