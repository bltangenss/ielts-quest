import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { useCards } from '../hooks/useCards';
import { useToast } from '../components/ToastNotification';
import { CARDS, RARITY_COLORS, getCardById } from '../data/cards';
import { Icon } from '../components/Icon';

// ──────────────────────────────────────
// TAB 1: MERGE (original system)
// ──────────────────────────────────────
function MergeTab() {
  const { collection, evolveCard, canEvolve, getOwnedCard } = useCards();
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [evolving, setEvolving] = useState(false);
  const [justEvolved, setJustEvolved] = useState(false);

  const ownedCards = collection.cards.map(c => ({
    instance: c,
    master: getCardById(c.cardId),
  })).filter(x => x.master);

  const canEvolveCard = selected ? canEvolve(selected.instance.cardId) : false;
  const selectedMaster = selected?.master;

  const getStatsForLevel = (card, level) => {
    if (level === 0) return card.baseStats;
    if (level === 1) return card.evolvedStats;
    return card.maxStats;
  };

  const handleEvolve = () => {
    if (!selected || !canEvolveCard) return;
    setEvolving(true);
    setTimeout(() => {
      evolveCard(selected.instance.cardId);
      setJustEvolved(true);
      setEvolving(false);
      toast('Card evolved!', 'success');
      setTimeout(() => setJustEvolved(false), 2000);
    }, 1500);
  };

  const currentStats = selected ? getStatsForLevel(selectedMaster, selected.instance.evolutionLevel) : null;
  const nextStats = selected && selected.instance.evolutionLevel < 2
    ? getStatsForLevel(selectedMaster, selected.instance.evolutionLevel + 1)
    : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, alignItems: 'start' }}>
      <div>
        <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.8rem', color: '#6A6F9C', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Your Cards</div>
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '0.5rem 0.75rem', marginBottom: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#F59E0B', fontSize: '0.875rem', fontWeight: 700 }}><Icon name="sparkle" size={13} /> {collection.dustAmount} Dust</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, maxHeight: 600, overflowY: 'auto' }}>
          {ownedCards.length === 0 ? (
            <p style={{ color: '#4B5563', fontSize: '0.875rem' }}>No cards yet. Open chests!</p>
          ) : (
            ownedCards.map(({ instance, master }) => {
              const isSelected = selected?.instance?.cardId === instance.cardId;
              const eligible = canEvolve(instance.cardId);
              return (
                <motion.div key={instance.instanceId} onClick={() => setSelected({ instance, master })} whileHover={{ y: -4 }}
                  style={{ cursor: 'pointer', outline: isSelected ? `2px solid ${RARITY_COLORS[master.rarity]}` : 'none', outlineOffset: 3, borderRadius: 12, position: 'relative' }}>
                  <Card card={master} evolutionLevel={instance.evolutionLevel} owned size="sm" showStats={false} />
                  {eligible && <div style={{ position: 'absolute', top: 2, left: 2, background: '#3FB950', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={12} /></div>}
                  {instance.evolutionLevel >= 2 && <div style={{ position: 'absolute', bottom: 2, left: 2, background: '#F59E0B', color: '#F5F7FE', borderRadius: 4, padding: '1px 4px', fontSize: '0.5rem', fontWeight: 700 }}>MAX</div>}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <div>
        {!selected ? (
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.05)', borderRadius: 14, padding: '3rem', textAlign: 'center', color: '#4B5563' }}>
            <div style={{ marginBottom: 12, color: '#A78BFA', display: 'flex', justifyContent: 'center' }}><Icon name="sparkle" size={44} /></div>
            <p>Select a card to view evolution options</p>
          </div>
        ) : (
          <motion.div key={selected.instance.cardId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#FFFFFF', border: `1px solid ${RARITY_COLORS[selectedMaster.rarity]}33`, borderRadius: 14, padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: '#221A5B', margin: '0 0 16px', fontSize: '1rem' }}>Evolution Preview</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginBottom: 6 }}>{['Base', 'Evolved', 'Max'][selected.instance.evolutionLevel]}</div>
                <motion.div animate={justEvolved ? { scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] } : {}}>
                  <Card card={selectedMaster} evolutionLevel={selected.instance.evolutionLevel} owned size="sm" />
                </motion.div>
              </div>
              {selected.instance.evolutionLevel < 2 && nextStats && (
                <>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: '#A78BFA', display: 'flex', justifyContent: 'center' }}><Icon name="right" size={28} /></motion.div>
                    <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginTop: 4 }}>{selectedMaster.evolutionCost.duplicatesRequired} dupes</div>
                    <div style={{ fontSize: '0.65rem', color: '#F59E0B' }}>{selectedMaster.evolutionCost.dustRequired} dust</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginBottom: 6 }}>{['Evolved', 'Max'][selected.instance.evolutionLevel]}</div>
                    <div style={{ filter: canEvolveCard ? 'none' : 'blur(3px) opacity(0.5)' }}>
                      <Card card={selectedMaster} evolutionLevel={selected.instance.evolutionLevel + 1} owned size="sm" />
                    </div>
                  </div>
                </>
              )}
              {selected.instance.evolutionLevel >= 2 && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '1rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ display: 'grid', placeItems: 'center', color: '#F59E0B' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4 3 5-6 5 6 4-3-2 11H5L3 8Z"/></svg>
                  </div>
                  <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.875rem', marginTop: 4 }}>MAX EVOLVED</div>
                </div>
              )}
            </div>
            {currentStats && nextStats && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Stat Comparison</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['HP', currentStats.hp, nextStats.hp, '#3FB950'], ['ATK', currentStats.attack, nextStats.attack, '#F85149'], ['DEF', currentStats.defense, nextStats.defense, '#3B82F6'], ['SPD', currentStats.speed, nextStats.speed, '#F59E0B']].map(([label, cur, next, color]) => (
                    <div key={label} style={{ background: '#F5F7FE', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#6A6F9C', fontSize: '0.7rem' }}>{label}</span>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#6A6F9C' }}>{cur}</span>
                          <span style={{ color: '#4B5563', fontSize: '0.65rem' }}>→</span>
                          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color, fontWeight: 700 }}>{next}</span>
                          <span style={{ color: '#3FB950', fontSize: '0.6rem' }}>+{next - cur}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selected.instance.evolutionLevel < 2 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Requirements</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { label: 'duplicates', have: selected.instance.duplicateCount || 0, need: selectedMaster.evolutionCost.duplicatesRequired, color: '#221A5B' },
                    { label: 'dust', have: collection.dustAmount, need: selectedMaster.evolutionCost.dustRequired, color: '#F59E0B' },
                  ].map(({ label, have, need, color }) => {
                    const met = have >= need;
                    return (
                      <div key={label} style={{ flex: 1, background: '#F5F7FE', borderRadius: 8, padding: '0.5rem 0.75rem', textAlign: 'center', border: `1px solid ${met ? '#3FB95033' : '#F8514933'}` }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: met ? (color === '#F59E0B' ? '#F59E0B' : '#3FB950') : '#F85149' }}>{have} / {need}</div>
                        <div style={{ fontSize: '0.65rem', color: '#6A6F9C' }}>{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {selected.instance.evolutionLevel < 2 && (
              <motion.button onClick={handleEvolve} disabled={!canEvolveCard || evolving}
                whileHover={canEvolveCard && !evolving ? { scale: 1.02 } : {}}
                style={{
                  width: '100%', background: canEvolveCard ? `linear-gradient(135deg, ${RARITY_COLORS[selectedMaster.rarity]}, ${RARITY_COLORS[selectedMaster.rarity]}99)` : 'rgba(34,26,91,0.05)',
                  border: 'none', borderRadius: 10, padding: '0.875rem',
                  color: canEvolveCard ? '#F5F7FE' : '#4B5563', fontWeight: 800,
                  cursor: canEvolveCard && !evolving ? 'pointer' : 'not-allowed', fontSize: '0.95rem', fontFamily: 'Bricolage Grotesque, sans-serif',
                }}>
                {evolving ? 'Evolving...' : canEvolveCard ? 'Evolve Card!' : 'Requirements Not Met'}
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// TAB 2: FUSION (new)
// ──────────────────────────────────────
function FusionTab() {
  const { collection, dustAmount } = useCards();
  const toast = useToast();
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [fusing, setFusing] = useState(false);
  const [fusedCard, setFusedCard] = useState(null);

  const ownedCards = collection.cards.map(c => {
    const master = getCardById(c.cardId);
    if (!master) return null;
    return { instance: c, master };
  }).filter(Boolean);

  const canFuse = slot1 && slot2
    && slot1.master.id !== slot2.master.id
    && slot1.master.rarity === slot2.master.rarity
    && dustAmount >= 200;

  const getPreview = () => {
    if (!slot1 || !slot2) return null;
    const s1 = slot1.master.baseStats;
    const s2 = slot2.master.baseStats;
    const word1 = slot1.master.name.split(' ')[0];
    const word2 = slot2.master.name.split(' ')[0];
    return {
      name: `${word1} ${word2}`,
      rarity: slot1.master.rarity,
      artEmoji: `${slot1.master.artEmoji}${slot2.master.artEmoji}`,
      artColor: slot1.master.artColor,
      ieltsDomain: 'universal',
      description: `A fusion of ${slot1.master.name} and ${slot2.master.name}.`,
      baseStats: {
        hp: Math.round(((s1.hp + s2.hp) / 2) * 1.2),
        attack: Math.round(((s1.attack + s2.attack) / 2) * 1.2),
        defense: Math.round(((s1.defense + s2.defense) / 2) * 1.2),
        speed: Math.round(((s1.speed + s2.speed) / 2) * 1.2),
      },
    };
  };

  const preview = getPreview();

  const handleFuse = () => {
    if (!canFuse) return;
    setFusing(true);
    setTimeout(() => {
      setFusedCard(preview);
      setFusing(false);
      toast('Cards fused!', 'success');
    }, 1500);
  };

  const handleSlotClick = (card, slot) => {
    if (slot === 1) {
      if (slot2?.master.id === card.master.id) return;
      setSlot1(card);
    } else {
      if (slot1?.master.id === card.master.id) return;
      setSlot2(card);
    }
  };

  if (fusedCard) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ marginBottom: 12, color: '#F59E0B', display: 'flex', justifyContent: 'center' }}><Icon name="sparkle" size={32} /></div>
        <h3 style={{ fontFamily: 'Bricolage Grotesque', color: '#F59E0B', margin: '0 0 16px' }}>Fusion Complete!</h3>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ padding: 8, border: '2px solid #F59E0B', borderRadius: 14, boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}>
            <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: '#F59E0B', marginBottom: 6, fontSize: '0.9rem' }}>{fusedCard.name}</div>
            <div style={{ color: '#F59E0B', display: 'flex', justifyContent: 'center' }}><Icon name="monster" size={44} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 8, fontSize: '0.7rem', fontFamily: 'JetBrains Mono' }}>
              <span style={{ color: '#3FB950' }}>HP: {fusedCard.baseStats.hp}</span>
              <span style={{ color: '#F85149' }}>ATK: {fusedCard.baseStats.attack}</span>
              <span style={{ color: '#3B82F6' }}>DEF: {fusedCard.baseStats.defense}</span>
              <span style={{ color: '#F59E0B' }}>SPD: {fusedCard.baseStats.speed}</span>
            </div>
          </div>
        </div>
        <p style={{ color: '#6A6F9C', fontSize: '0.8rem', marginBottom: 20 }}>
          Note: Fused cards are preview only in this build — full persistence coming soon!
        </p>
        <button onClick={() => { setSlot1(null); setSlot2(null); setFusedCard(null); }} style={{
          background: 'linear-gradient(135deg, #6D5EF6, #5B21B6)', border: 'none', borderRadius: 10, padding: '0.75rem 2rem',
          color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'Bricolage Grotesque',
        }}>
          Fuse Again
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      <p style={{ color: '#6A6F9C', fontSize: '0.8rem', marginBottom: 20, lineHeight: 1.6 }}>
        Combine two <strong style={{ color: '#221A5B' }}>different cards of the same rarity</strong> to create a powerful fused card with combined stats +20% bonus. Costs 200 dust.
      </p>

      {/* Slots */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 24 }}>
        {[slot1, slot2].map((slot, i) => (
          <div key={i} style={{
            background: '#FFFFFF', border: `2px dashed ${slot ? RARITY_COLORS[slot.master.rarity] : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 14, padding: '1rem', textAlign: 'center', minHeight: 120,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {slot ? (
              <div>
                <div style={{ color: RARITY_COLORS[slot.master.rarity], display: 'flex', justifyContent: 'center' }}><Icon glyph={slot.master.artEmoji} size={30} /></div>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.7rem', color: RARITY_COLORS[slot.master.rarity], marginTop: 4 }}>{slot.master.name}</div>
                <button onClick={() => i === 0 ? setSlot1(null) : setSlot2(null)} style={{ background: 'none', border: 'none', color: '#F85149', cursor: 'pointer', fontSize: '0.65rem', marginTop: 4 }}>Remove</button>
              </div>
            ) : (
              <div style={{ color: '#4B5563', fontSize: '0.8rem' }}>
                <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'center', opacity: 0.5 }}><Icon name="sparkle" size={22} /></div>
                Card Slot {i + 1}
              </div>
            )}
          </div>
        ))}

        {/* Center arrow / preview */}
        <div style={{ textAlign: 'center' }}>
          {preview ? (
            <div>
              <div style={{ fontSize: '0.7rem', color: '#6A6F9C', marginBottom: 4 }}>Fusion Result</div>
              <div style={{ color: '#F59E0B', display: 'flex', justifyContent: 'center' }}><Icon name="monster" size={30} /></div>
              <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: '0.65rem', color: '#F59E0B' }}>{preview.name}</div>
            </div>
          ) : (
            <div style={{ color: '#4B5563', display: 'flex', justifyContent: 'center' }}><Icon name="right" size={24} /></div>
          )}
        </div>
      </div>

      {/* Card picker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[1, 2].map(slotNum => (
          <div key={slotNum}>
            <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginBottom: 6, textTransform: 'uppercase' }}>
              Slot {slotNum} — click to assign
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
              {ownedCards.map(({ instance, master }) => {
                const isInOtherSlot = slotNum === 1 ? slot2?.master.id === master.id : slot1?.master.id === master.id;
                const isSelected = slotNum === 1 ? slot1?.master.id === master.id : slot2?.master.id === master.id;
                return (
                  <motion.div key={instance.instanceId}
                    onClick={() => !isInOtherSlot && handleSlotClick({ instance, master }, slotNum)}
                    whileHover={!isInOtherSlot ? { scale: 1.05 } : {}}
                    style={{
                      padding: 4, borderRadius: 8, cursor: isInOtherSlot ? 'not-allowed' : 'pointer',
                      outline: isSelected ? `2px solid ${RARITY_COLORS[master.rarity]}` : 'none',
                      outlineOffset: 2, opacity: isInOtherSlot ? 0.3 : 1,
                    }}
                  >
                    <Card card={master} evolutionLevel={instance.evolutionLevel} owned size="sm" showStats={false} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fuse button */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: dustAmount >= 200 ? '#F59E0B' : '#F85149', marginBottom: 10 }}>
          <Icon name="sparkle" size={12} /> {dustAmount} / 200 dust required
        </div>
        <motion.button
          onClick={handleFuse}
          disabled={!canFuse || fusing}
          whileHover={canFuse ? { scale: 1.04 } : {}}
          style={{
            background: canFuse ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(34,26,91,0.05)',
            border: 'none', borderRadius: 12, padding: '0.875rem 2.5rem',
            color: canFuse ? '#F5F7FE' : '#4B5563',
            fontWeight: 800, cursor: canFuse && !fusing ? 'pointer' : 'not-allowed',
            fontSize: '0.95rem', fontFamily: 'Bricolage Grotesque',
          }}
        >
          {fusing ? 'Fusing...' : !slot1 || !slot2 ? 'Select 2 Cards' : !canFuse ? (dustAmount < 200 ? 'Need More Dust' : 'Different Rarity Required') : 'Fuse Cards!'}
        </motion.button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// TAB 3: AWAKENING (new)
// ──────────────────────────────────────
function AwakeningTab() {
  const { collection, dustAmount } = useCards();
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [awakening, setAwakening] = useState(false);
  const [awoken, setAwoken] = useState([]);

  const maxEvolvedCards = collection.cards.filter(c => c.evolutionLevel >= 2).map(c => {
    const master = getCardById(c.cardId);
    if (!master) return null;
    return { instance: c, master };
  }).filter(Boolean);

  const canAwaken = selected
    && dustAmount >= 500
    && (selected.instance.duplicateCount || 0) >= 1
    && !awoken.includes(selected.instance.cardId);

  const handleAwaken = () => {
    if (!canAwaken) return;
    setAwakening(true);
    setTimeout(() => {
      setAwoken(prev => [...prev, selected.instance.cardId]);
      setAwakening(false);
      toast('Card Awakened!', 'chest');
    }, 2000);
  };

  return (
    <div>
      <p style={{ color: '#6A6F9C', fontSize: '0.8rem', marginBottom: 20, lineHeight: 1.6 }}>
        Only <strong style={{ color: '#221A5B' }}>MAX evolved (★★★) cards</strong> can be Awakened. Costs 500 dust + 1 duplicate. Awakened cards gain a golden outline, +30% stats, and regenerate 2 HP per dungeon turn.
      </p>

      {maxEvolvedCards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#4B5563' }}>
          <div style={{ marginBottom: 12, color: '#F59E0B', display: 'flex', justifyContent: 'center' }}><Icon name="sparkle" size={44} /></div>
          <p>No max-evolved cards yet. Evolve cards to level ★★★ to unlock Awakening.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
          {/* Card list */}
          <div>
            <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              Max Evolved Cards
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {maxEvolvedCards.map(({ instance, master }) => {
                const isAwoken = awoken.includes(instance.cardId);
                const isSelected = selected?.instance.cardId === instance.cardId;
                return (
                  <motion.div key={instance.instanceId} onClick={() => setSelected({ instance, master })} whileHover={{ y: -4 }}
                    style={{
                      cursor: 'pointer',
                      outline: isSelected ? `2px solid ${RARITY_COLORS[master.rarity]}` : 'none',
                      outlineOffset: 3, borderRadius: 12, position: 'relative',
                      boxShadow: isAwoken ? '0 0 20px rgba(245,158,11,0.6)' : 'none',
                    }}
                  >
                    <Card card={master} evolutionLevel={2} owned size="sm" showStats={false} />
                    {isAwoken && (
                      <div style={{ position: 'absolute', top: 2, left: 2, color: '#F59E0B', display: 'grid', placeItems: 'center', filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.8))' }}><Icon name="sparkle" size={14} /></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Awakening panel */}
          <div>
            {!selected ? (
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(34,26,91,0.05)', borderRadius: 14, padding: '2rem', textAlign: 'center', color: '#4B5563' }}>
                <div style={{ marginBottom: 8, color: '#F59E0B', display: 'flex', justifyContent: 'center' }}><Icon name="sparkle" size={44} /></div>
                <p>Select a max-evolved card to awaken it</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#FFFFFF', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 14, padding: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', color: '#F59E0B', margin: '0 0 16px', fontSize: '1rem' }}>
                  Awakening: {selected.master.name}
                </h3>

                {awoken.includes(selected.instance.cardId) ? (
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{ marginBottom: 8, color: '#F59E0B', display: 'flex', justifyContent: 'center', animation: 'legendaryShimmer 1s linear infinite' }}><Icon name="sparkle" size={44} /></div>
                    <div style={{ color: '#F59E0B', fontFamily: 'Bricolage Grotesque', fontWeight: 700 }}>AWAKENED</div>
                    <p style={{ color: '#6A6F9C', fontSize: '0.75rem', marginTop: 8 }}>
                      This card now regenerates 2 HP per dungeon turn and has +30% stats.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Bonus preview */}
                    <div style={{ background: '#F5F7FE', borderRadius: 10, padding: '0.875rem', marginBottom: 16 }}>
                      <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Awakening Bonuses</div>
                      {[
                        ['Golden outline + star symbol', '#F59E0B'],
                        ['+30% all stats', '#3FB950'],
                        ['Regen 2 HP per dungeon turn', '#3B82F6'],
                        ['"Awakened" prefix on name', '#A78BFA'],
                      ].map(([text, color], i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color, marginBottom: 4 }}><Icon name="check" size={12} /> {text}</div>
                      ))}
                    </div>

                    {/* Requirements */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Requirements</div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {[
                          { label: 'duplicates', have: selected.instance.duplicateCount || 0, need: 1, color: '#221A5B' },
                          { label: 'dust', have: dustAmount, need: 500, color: '#F59E0B' },
                        ].map(({ label, have, need, color }) => {
                          const met = have >= need;
                          return (
                            <div key={label} style={{ flex: 1, background: '#F5F7FE', borderRadius: 8, padding: '0.5rem 0.75rem', textAlign: 'center', border: `1px solid ${met ? '#3FB95033' : '#F8514933'}` }}>
                              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: met ? '#3FB950' : '#F85149' }}>{have} / {need}</div>
                              <div style={{ fontSize: '0.65rem', color: '#6A6F9C' }}>{label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <motion.button
                      onClick={handleAwaken}
                      disabled={!canAwaken || awakening}
                      whileHover={canAwaken ? { scale: 1.03 } : {}}
                      style={{
                        width: '100%',
                        background: awakening
                          ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                          : canAwaken
                          ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                          : 'rgba(34,26,91,0.05)',
                        border: 'none', borderRadius: 10, padding: '0.875rem',
                        color: canAwaken ? '#F5F7FE' : '#4B5563',
                        fontWeight: 800, cursor: canAwaken && !awakening ? 'pointer' : 'not-allowed',
                        fontSize: '0.95rem', fontFamily: 'Bricolage Grotesque',
                        animation: awakening ? 'legendaryShimmer 0.5s linear infinite' : 'none',
                      }}
                    >
                      {awakening ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name="sparkle" size={15} /> Awakening...</span> : canAwaken ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name="sparkle" size={15} /> Awaken Card!</span> : 'Requirements Not Met'}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────
// MAIN EVOLUTION PAGE
// ──────────────────────────────────────
const TABS = [
  { id: 'merge', label: 'Merge', desc: 'Evolve with duplicates' },
  { id: 'fusion', label: 'Fusion', desc: 'Combine 2 different cards' },
  { id: 'awakening', label: 'Awakening', desc: 'Transcend MAX cards' },
];

export default function Evolution() {
  const [activeTab, setActiveTab] = useState('merge');

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', marginBottom: 8 }}>
        Evolution Chamber
      </h1>
      <p style={{ color: '#6A6F9C', marginBottom: 24, fontSize: '0.875rem' }}>
        Three paths to power. Merge, fuse, or awaken your cards.
      </p>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(109,94,246,0.25)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeTab === tab.id ? 'rgba(109,94,246,0.5)' : 'rgba(34,26,91,0.06)'}`,
              borderRadius: 10, padding: '0.6rem 1.25rem',
              color: activeTab === tab.id ? '#221A5B' : '#6A6F9C',
              cursor: 'pointer', fontFamily: 'Bricolage Grotesque', fontWeight: activeTab === tab.id ? 700 : 400,
              fontSize: '0.85rem',
            }}
          >
            {tab.label}
            <div style={{ fontSize: '0.6rem', color: '#6A6F9C', fontFamily: 'Inter', marginTop: 1 }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'merge' && <MergeTab />}
          {activeTab === 'fusion' && <FusionTab />}
          {activeTab === 'awakening' && <AwakeningTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
