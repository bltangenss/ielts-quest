import { motion } from 'framer-motion';
import { TYPE_COLORS, TYPE_ICONS } from '../../data/arenaAbilities';
import { Icon } from '../Icon';

export function AbilityCard({ ability, type, currentMP, onClick, disabled, silenced }) {
  const color = TYPE_COLORS[type] || '#F59E0B';
  const canAfford = currentMP >= ability.mpCost;
  const isLocked = disabled || !canAfford || (silenced && ability.slot > 1);
  const clickable = !isLocked;

  // MP cost dots
  const dots = [];
  for (let i = 0; i < 5; i++) {
    dots.push(i < ability.mpCost);
  }

  return (
    <motion.div
      onClick={clickable ? onClick : undefined}
      whileHover={clickable ? { scale: 1.05, y: -4 } : {}}
      whileTap={clickable ? { scale: 0.97 } : {}}
      style={{
        width: 120, height: 88,
        borderRadius: 10,
        border: `2px solid ${clickable ? color : '#3A1515'}`,
        background: clickable
          ? `linear-gradient(160deg, #1C0A0A, #0D0608)`
          : '#0D0608',
        cursor: clickable ? 'pointer' : 'not-allowed',
        padding: '6px 8px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: clickable ? `0 0 12px ${color}44` : 'none',
        opacity: isLocked ? 0.5 : 1,
        flexShrink: 0,
      }}
    >
      {/* Locked overlay */}
      {isLocked && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(13,6,8,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, color: '#9CA3AF',
        }}>
          <Icon name="lock" size={20} />
        </div>
      )}

      {/* Type icon + slot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <span style={{ color, display: 'grid', placeItems: 'center' }}><Icon glyph={TYPE_ICONS[type]} size={15} /></span>
        {ability.slot === 4 && (
          <span style={{ fontSize: '0.5rem', color: '#FBBF24', fontWeight: 900, letterSpacing: 1 }}>ULT</span>
        )}
      </div>

      {/* Ability name */}
      <div style={{
        fontFamily: 'Cinzel, serif', fontWeight: 700,
        fontSize: '0.62rem', color: clickable ? '#F5F0F0' : '#6B7280',
        lineHeight: 1.15, marginBottom: 3,
        minHeight: '1.6em',
      }}>
        {ability.name}
      </div>

      {/* MP cost dots */}
      <div style={{ display: 'flex', gap: 2, position: 'absolute', bottom: 6, left: 8 }}>
        {ability.mpCost === 0 ? (
          <span style={{ fontSize: '0.5rem', color: '#9CA3AF', fontFamily: 'JetBrains Mono' }}>FREE</span>
        ) : (
          dots.map((filled, i) => (
            <span key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: filled ? (canAfford ? '#3B82F6' : '#6B7280') : 'transparent',
              border: `1px solid ${filled ? (canAfford ? '#3B82F6' : '#6B7280') : '#3A1515'}`,
              display: filled || i < ability.mpCost ? 'block' : 'none',
            }} />
          ))
        )}
      </div>

      {/* Damage hint */}
      {ability.damage > 0 && (
        <div style={{
          position: 'absolute', bottom: 5, right: 8,
          fontFamily: 'JetBrains Mono', fontSize: '0.6rem',
          color: '#F87171', fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', gap: 2,
        }}>
          {ability.damage}{ability.target === 'all' ? <Icon name="target" size={9} /> : ''}
        </div>
      )}
    </motion.div>
  );
}
