import { motion } from 'framer-motion';
import { AnimeCreature } from './AnimeCreature';
import { DOMAIN_TO_TYPE, TYPE_COLORS } from '../../data/arenaAbilities';
import { Icon } from '../Icon';

export function CreatureSelector({ ownedCards, selectedIds, onToggle }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {ownedCards.map(card => {
        const type = DOMAIN_TO_TYPE[card.ieltsDomain] || 'Void';
        const color = TYPE_COLORS[type];
        const isSelected = selectedIds.includes(card.id);
        const order = selectedIds.indexOf(card.id) + 1;

        return (
          <motion.div
            key={card.id}
            onClick={() => onToggle(card)}
            whileHover={{ y: -6 }}
            style={{
              cursor: 'pointer',
              borderRadius: 14,
              border: `2px solid ${isSelected ? color : 'rgba(255,255,255,0.1)'}`,
              background: isSelected ? `${color}11` : '#1C0A0A',
              padding: 8,
              position: 'relative',
              boxShadow: isSelected ? `0 0 20px ${color}55` : 'none',
              width: 136,
            }}
          >
            {isSelected && (
              <div style={{
                position: 'absolute', top: 6, left: 6, zIndex: 10,
                width: 24, height: 24, borderRadius: '50%',
                background: color, color: '#0D0608',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.8rem', fontFamily: 'JetBrains Mono',
              }}>
                {order}
              </div>
            )}

            <AnimeCreature emoji={card.artEmoji} type={type} size="selector" animState="idle" />

            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <div style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '0.7rem', color: '#F5F0F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.name}
              </div>
              <div style={{
                display: 'inline-block', marginTop: 3,
                background: `${color}22`, border: `1px solid ${color}55`,
                borderRadius: 100, padding: '0px 7px',
                fontSize: '0.55rem', color, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700,
              }}>
                {type}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 4, fontSize: '0.55rem', fontFamily: 'JetBrains Mono' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#4ADE80' }}><Icon name="hp" size={10} />{card.hp}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#F87171' }}><Icon name="attack" size={10} />{card.attack}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#7DD3FC' }}><Icon name="defense" size={10} />{card.defense}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
