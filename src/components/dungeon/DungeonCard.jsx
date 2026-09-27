import { motion } from 'framer-motion';
import { RARITY_COLORS } from '../../data/cards';
import { Icon } from '../Icon';

const DOMAIN_ACTIONS = {
  reading: { name: 'Analyze', icon: 'search' },
  listening: { name: 'Echo', icon: 'sparkle' },
  vocabulary: { name: 'Curse', icon: 'chat' },
  grammar: { name: 'Correct', icon: 'check' },
  universal: { name: 'Mastery', icon: 'star' },
};

export function DungeonCard({ card, energyCost, canAfford, onClick, isPlaying }) {
  if (!card) return null;
  const color = RARITY_COLORS[card.rarity] || '#8B949E';
  const domain = card.ieltsDomain || 'universal';
  const action = DOMAIN_ACTIONS[domain] || DOMAIN_ACTIONS.universal;

  const attackVal = card.battleAttack || card.baseStats?.attack || 0;
  const shieldVal = card.battleShield || Math.floor((card.baseStats?.defense || 0) / 10);

  return (
    <motion.div
      onClick={canAfford ? onClick : undefined}
      whileHover={canAfford ? { y: -12, scale: 1.05 } : {}}
      whileTap={canAfford ? { scale: 0.97 } : {}}
      animate={isPlaying ? { x: 60, y: -30, opacity: 0, scale: 0.8 } : { x: 0, y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        width: 90,
        height: 120,
        borderRadius: 8,
        border: `2px solid ${canAfford ? color : '#2D3748'}`,
        background: canAfford ? 'linear-gradient(160deg, #161B22, #0D1117)' : '#0D1117',
        cursor: canAfford ? 'pointer' : 'not-allowed',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: canAfford ? 1 : 0.45,
        boxShadow: canAfford ? `0 0 12px ${color}44` : 'none',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Energy cost */}
      <div style={{
        position: 'absolute', top: 3, right: 3,
        width: 18, height: 18, borderRadius: '50%',
        background: canAfford ? '#7C3AED' : '#374151',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.6rem', fontWeight: 900, color: 'white',
        fontFamily: 'JetBrains Mono',
      }}>
        {energyCost}
      </div>

      {/* Art */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: canAfford ? color : '#4B5563',
      }}>
        <Icon glyph={card.artEmoji} name={card.artEmoji ? undefined : 'monster'} size={30} />
      </div>

      {/* Card name */}
      <div style={{
        padding: '2px 4px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontSize: '0.5rem',
        fontFamily: 'Cinzel',
        color: canAfford ? '#E6EDF3' : '#4B5563',
        textAlign: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}>
        {card.name}
      </div>

      {/* Stats bar */}
      <div style={{
        padding: '3px 4px',
        display: 'flex', justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.3)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '0.55rem', color: '#F85149', fontFamily: 'JetBrains Mono' }}>
          <Icon name="attack" size={9} />{attackVal}
        </span>
        {shieldVal > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '0.55rem', color: '#3B82F6', fontFamily: 'JetBrains Mono' }}>
            <Icon name="defense" size={9} />{shieldVal}
          </span>
        )}
        <span style={{ color: canAfford ? color : '#4B5563', display: 'grid', placeItems: 'center' }} title={action.name}>
          <Icon name={action.icon} size={10} />
        </span>
      </div>
    </motion.div>
  );
}
