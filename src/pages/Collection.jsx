import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { useCards } from '../hooks/useCards';
import { CARDS, RARITY_COLORS, DOMAIN_COLORS, getCardById } from '../data/cards';

function CardModal({ card, instance, onClose }) {
  if (!card) return null;
  const rarityColor = RARITY_COLORS[card.rarity];
  const statsToShow = instance
    ? (instance.evolutionLevel === 0 ? card.baseStats : instance.evolutionLevel === 1 ? card.evolvedStats : card.maxStats)
    : card.baseStats;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          border: `2px solid ${rarityColor}`,
          boxShadow: `0 0 40px ${rarityColor}44`,
          borderRadius: 16,
          padding: '1.5rem',
          maxWidth: 480, width: '100%',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
          <Card card={card} evolutionLevel={instance?.evolutionLevel || 0} owned size="md" />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.1rem', fontWeight: 700, color: '#221A5B', margin: '0 0 6px' }}>
              {card.name}
            </h2>
            <div style={{ display: 'inline-block', background: `${rarityColor}22`, border: `1px solid ${rarityColor}44`, borderRadius: 100, padding: '2px 10px', fontSize: '0.65rem', color: rarityColor, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>
              {card.rarity}
            </div>
            <p style={{ color: '#6A6F9C', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 12px', fontStyle: 'italic' }}>
              {card.description}
            </p>

            {instance && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.7rem', color: '#6A6F9C', marginBottom: 4 }}>Evolution</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['Base', 'Evolved', 'Max'].map((label, i) => (
                    <div key={i} style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: '0.65rem',
                      background: instance.evolutionLevel === i ? `${rarityColor}22` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${instance.evolutionLevel === i ? rarityColor : 'rgba(34,26,91,0.06)'}`,
                      color: instance.evolutionLevel === i ? rarityColor : '#4B5563',
                    }}>
                      {label}
                    </div>
                  ))}
                </div>
                {instance.duplicateCount > 0 && (
                  <div style={{ fontSize: '0.7rem', color: '#6A6F9C', marginTop: 6 }}>
                    Duplicates: <span style={{ color: '#F59E0B', fontWeight: 700 }}>{instance.duplicateCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.7rem', color: '#6A6F9C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Stats
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['HP', statsToShow.hp, '#3FB950'],
              ['ATK', statsToShow.attack, '#F85149'],
              ['DEF', statsToShow.defense, '#3B82F6'],
              ['SPD', statsToShow.speed, '#F59E0B'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background: '#F5F7FE', borderRadius: 8, padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6A6F9C', fontSize: '0.75rem' }}>{label}</span>
                <span style={{ color, fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '0.875rem' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Abilities */}
        {card.abilities && card.abilities.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.7rem', color: '#6A6F9C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Abilities
            </div>
            {card.abilities.map((ab, i) => (
              <div key={i} style={{ background: '#F5F7FE', borderRadius: 8, padding: '0.5rem 0.75rem', marginBottom: 6 }}>
                <div style={{ color: rarityColor, fontWeight: 700, fontSize: '0.75rem', marginBottom: 2 }}>
                   {ab.name}
                </div>
                <div style={{ color: '#6A6F9C', fontSize: '0.7rem' }}>{ab.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Evolution cost */}
        <div>
          <div style={{ fontSize: '0.7rem', color: '#6A6F9C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Evolution Cost
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ background: '#F5F7FE', borderRadius: 8, padding: '0.5rem 0.75rem', flex: 1, textAlign: 'center' }}>
              <div style={{ color: '#221A5B', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{card.evolutionCost.duplicatesRequired}</div>
              <div style={{ color: '#6A6F9C', fontSize: '0.65rem' }}>duplicates</div>
            </div>
            <div style={{ background: '#F5F7FE', borderRadius: 8, padding: '0.5rem 0.75rem', flex: 1, textAlign: 'center' }}>
              <div style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{card.evolutionCost.dustRequired}</div>
              <div style={{ color: '#6A6F9C', fontSize: '0.65rem' }}> dust</div>
            </div>
          </div>
        </div>

        <button onClick={onClose} style={{
          width: '100%', marginTop: 20,
          background: 'rgba(34,26,91,0.05)', border: '1px solid rgba(34,26,91,0.08)',
          borderRadius: 8, padding: '0.6rem', color: '#221A5B',
          cursor: 'pointer', fontWeight: 600,
        }}>
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Collection() {
  const { collection } = useCards();
  const [rarityFilter, setRarityFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const ownedMap = {};
  collection.cards.forEach(c => { ownedMap[c.cardId] = c; });

  const filtered = CARDS.filter(card => {
    if (rarityFilter !== 'all' && card.rarity !== rarityFilter) return false;
    if (domainFilter !== 'all' && card.ieltsDomain !== domainFilter) return false;
    if (search) {
      const isOwned = !!ownedMap[card.id];
      if (!isOwned) return false;
      if (!card.name.toLowerCase().includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const rarityCounts = {};
  ['common', 'uncommon', 'rare', 'epic', 'legendary'].forEach(r => {
    rarityCounts[r] = { owned: 0, total: CARDS.filter(c => c.rarity === r).length };
  });
  collection.cards.forEach(c => {
    const card = getCardById(c.cardId);
    if (card) rarityCounts[card.rarity].owned += 1;
  });

  const handleCardClick = (card) => {
    const instance = ownedMap[card.id];
    if (instance) setSelectedCard({ card, instance });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', margin: '0 0 4px' }}>
            Collection
          </h1>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.875rem', color: '#6D5EF6' }}>
            {collection.cards.length} / {CARDS.length} cards collected
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '0.4rem 0.75rem' }}>
            <span style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono', fontSize: '0.875rem', fontWeight: 700 }}>
               {collection.dustAmount} dust
            </span>
          </div>
        </div>
      </div>

      {/* Rarity progress */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(rarityCounts).map(([rarity, { owned, total }]) => (
          <div key={rarity} style={{
            background: '#FFFFFF', border: `1px solid ${RARITY_COLORS[rarity]}33`,
            borderRadius: 8, padding: '0.4rem 0.75rem',
            fontSize: '0.7rem',
          }}>
            <span style={{ color: RARITY_COLORS[rarity], textTransform: 'capitalize', fontWeight: 600 }}>
              {rarity}:
            </span>
            <span style={{ color: '#221A5B', fontFamily: 'JetBrains Mono', marginLeft: 4 }}>
              {owned}/{total}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cards..."
          style={{
            background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.08)',
            borderRadius: 8, padding: '0.5rem 0.75rem',
            color: '#221A5B', fontSize: '0.875rem',
            outline: 'none', width: 200,
          }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map(r => (
            <button key={r} onClick={() => setRarityFilter(r)} style={{
              background: rarityFilter === r ? (r === 'all' ? 'rgba(109,94,246,0.3)' : `${RARITY_COLORS[r]}22`) : 'rgba(255,255,255,0.04)',
              border: `1px solid ${rarityFilter === r ? (r === 'all' ? '#6D5EF6' : RARITY_COLORS[r]) : 'rgba(34,26,91,0.06)'}`,
              borderRadius: 6, padding: '0.35rem 0.75rem',
              color: rarityFilter === r ? (r === 'all' ? '#A78BFA' : RARITY_COLORS[r]) : '#6A6F9C',
              cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
            }}>
              {r}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'reading', 'listening', 'vocabulary', 'grammar', 'universal'].map(d => (
            <button key={d} onClick={() => setDomainFilter(d)} style={{
              background: domainFilter === d ? `${DOMAIN_COLORS[d] || '#6D5EF6'}22` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${domainFilter === d ? (DOMAIN_COLORS[d] || '#6D5EF6') : 'rgba(34,26,91,0.06)'}`,
              borderRadius: 6, padding: '0.35rem 0.75rem',
              color: domainFilter === d ? (DOMAIN_COLORS[d] || '#A78BFA') : '#6A6F9C',
              cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
            }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <motion.div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'flex-start' }}
      >
        {filtered.map((card, i) => {
          const instance = ownedMap[card.id];
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                card={card}
                evolutionLevel={instance?.evolutionLevel || 0}
                owned={!!instance}
                size="md"
                onClick={() => handleCardClick(card)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#4B5563' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}></div>
          <p>No cards match your filters.</p>
        </div>
      )}

      {/* Card modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardModal
            card={selectedCard.card}
            instance={selectedCard.instance}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
