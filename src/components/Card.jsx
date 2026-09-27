import { motion } from 'framer-motion';
import { RARITY_COLORS, DOMAIN_COLORS } from '../data/cards';
import { CardArt } from './CardArt';

const RARITY_GLOW = {
  common:    '0 0 8px #6B7280, 0 0 20px rgba(107,114,128,0.3)',
  uncommon:  '0 0 12px #3FB950, 0 0 30px rgba(63,185,80,0.4)',
  rare:      '0 0 15px #3B82F6, 0 0 40px rgba(59,130,246,0.5)',
  epic:      '0 0 20px #6D5EF6, 0 0 60px rgba(109,94,246,0.6)',
  legendary: '0 0 30px #F59E0B, 0 0 80px rgba(245,158,11,0.7)',
};

function RarityStars({ rarity }) {
  const counts = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
  const color = RARITY_COLORS[rarity];
  return (
    <span style={{ color, fontSize: '0.6rem', letterSpacing: '1px' }}>
      {'★'.repeat(counts[rarity] || 1)}
    </span>
  );
}

function EvolutionBadge({ level }) {
  if (level === 0) return null;
  const stars = level === 1 ? '★★' : '★★★';
  return (
    <div style={{
      position: 'absolute', top: 4, right: 4,
      background: 'rgba(0,0,0,0.7)', borderRadius: 4,
      padding: '1px 4px', fontSize: '0.6rem', color: '#F59E0B',
      fontFamily: 'JetBrains Mono, monospace', zIndex: 10,
    }}>
      {stars}
    </div>
  );
}

export function Card({
  card,
  evolutionLevel = 0,
  owned = true,
  size = 'md',
  onClick,
  showStats = true,
  className = '',
  style = {},
}) {
  if (!card) return null;

  const dims = {
    sm: { w: 140, h: 196, emoji: '2.5rem', name: '0.55rem', stat: '0.5rem' },
    md: { w: 180, h: 252, emoji: '3.5rem', name: '0.65rem', stat: '0.58rem' },
    lg: { w: 220, h: 308, emoji: '4.5rem', name: '0.75rem', stat: '0.65rem' },
  }[size] || { w: 180, h: 252, emoji: '3.5rem', name: '0.65rem', stat: '0.58rem' };

  const color = RARITY_COLORS[card.rarity];
  const glow = RARITY_GLOW[card.rarity];
  const domainColor = DOMAIN_COLORS[card.ieltsDomain];

  const statsToShow = evolutionLevel === 0 ? card.baseStats
    : evolutionLevel === 1 ? card.evolvedStats
    : card.maxStats;

  const isLegendary = card.rarity === 'legendary';
  const isEpic = card.rarity === 'epic';

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { y: -8, scale: 1.03 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
      style={{
        width: dims.w,
        height: dims.h,
        borderRadius: 12,
        border: `2px solid ${owned ? color : '#2D3748'}`,
        boxShadow: owned ? glow : 'none',
        background: owned
          ? `linear-gradient(160deg, #FFFFFF 0%, #F5F7FE 100%)`
          : '#F5F7FE',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        animation: isEpic && owned ? 'epicPulse 2s ease-in-out infinite' : undefined,
        ...style,
      }}
    >
      {/* Legendary shimmer overlay */}
      {isLegendary && owned && (
        <div style={{
          position: 'absolute', top: 0, left: '-100%',
          width: '200%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent)',
          animation: 'legendaryShimmer 2s linear infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />
      )}

      {/* Evolution badge */}
      {owned && <EvolutionBadge level={evolutionLevel} />}

      {/* Header: Name + Rarity */}
      <div style={{
        padding: '8px 10px 4px',
        borderBottom: `1px solid rgba(34,26,91,0.05)`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: dims.name,
          fontWeight: 700,
          color: owned ? '#221A5B' : '#4B5563',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          maxWidth: '75%',
        }}>
          {owned ? card.name : '???'}
        </span>
        {owned && <RarityStars rarity={card.rarity} />}
      </div>

      {/* Character art */}
      <div style={{
        flex: 1,
        minHeight: 0,
        background: '#11152d',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <CardArt card={card} revealed={owned} />
        {!owned && (
          <div style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            color: 'rgba(255,255,255,0.5)', fontSize: '1.3rem', fontWeight: 900,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}>?</div>
        )}
      </div>

      {/* Domain + description */}
      <div style={{
        padding: '4px 8px',
        borderTop: `1px solid rgba(34,26,91,0.05)`,
      }}>
        {owned && (
          <>
            <span style={{
              display: 'inline-block',
              background: `${domainColor}22`,
              border: `1px solid ${domainColor}55`,
              color: domainColor,
              borderRadius: 4,
              padding: '1px 6px',
              fontSize: '0.5rem',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: 3,
            }}>
              {card.ieltsDomain}
            </span>
            {size !== 'sm' && (
              <p style={{
                fontSize: '0.55rem', color: '#6A6F9C',
                fontStyle: 'italic', margin: 0,
                lineHeight: 1.3,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {card.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Stats */}
      {showStats && owned && statsToShow && (
        <div style={{
          padding: '4px 8px 6px',
          borderTop: `1px solid rgba(34,26,91,0.05)`,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '2px',
        }}>
          {[
            ['HP', statsToShow.hp, '#3FB950'],
            ['ATK', statsToShow.attack, '#F85149'],
            ['DEF', statsToShow.defense, '#3B82F6'],
            ['SPD', statsToShow.speed, '#F59E0B'],
          ].map(([label, val, clr]) => (
            <div key={label} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: dims.stat,
              color: clr,
              display: 'flex', gap: 4,
            }}>
              <span style={{ color: '#6A6F9C' }}>{label}:</span>
              <span style={{ fontWeight: 700 }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Card back for chest reveal
export function CardBack({ size = 'md', style = {} }) {
  const dims = {
    sm: { w: 140, h: 196 },
    md: { w: 180, h: 252 },
    lg: { w: 220, h: 308 },
  }[size];

  return (
    <div style={{
      width: dims.w, height: dims.h,
      borderRadius: 12,
      border: '2px solid #6D5EF6',
      boxShadow: '0 0 20px rgba(109,94,246,0.5)',
      background: 'linear-gradient(160deg, #FFFFFF, #F5F7FE)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      ...style,
    }}>
      <div style={{
        fontFamily: 'Bricolage Grotesque, sans-serif',
        fontSize: '1rem',
        fontWeight: 900,
        color: '#6D5EF6',
        textShadow: '0 0 15px rgba(109,94,246,0.8)',
        textAlign: 'center',
        lineHeight: 1.2,
      }}>
        IELTS<br />QUEST
      </div>
    </div>
  );
}
