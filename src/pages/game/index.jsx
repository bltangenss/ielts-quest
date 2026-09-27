import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreatureSelector } from '../../components/game/CreatureSelector';
import { CreaturePortrait } from '../../components/game/CreaturePortrait';
import { CardArt } from '../../components/CardArt';
import { Icon } from '../../components/Icon';
import { useArenaRun, loadArenaHistory } from '../../hooks/useArenaRun';
import { useCards } from '../../hooks/useCards';
import { getCardById } from '../../data/cards';
import { DOMAIN_TO_TYPE, TYPE_COLORS } from '../../data/arenaAbilities';

const CRIMSON = '#DC2626';
const AMBER = '#B45309';

function buildOwnedCreatures(collection) {
  return collection.cards.map(c => {
    const master = getCardById(c.cardId);
    if (!master) return null;
    const stats = c.evolutionLevel === 0 ? master.baseStats : c.evolutionLevel === 1 ? master.evolvedStats : master.maxStats;
    return {
      ...master,
      instanceId: c.instanceId,
      evolutionLevel: c.evolutionLevel,
      hp: stats.hp, attack: stats.attack, defense: stats.defense, speed: stats.speed,
    };
  }).filter(Boolean);
}

export default function ArenaHub() {
  const navigate = useNavigate();
  const { run, startRun, abandonRun } = useArenaRun();
  const { collection, ensureCard } = useCards();
  const [phase, setPhase] = useState('hub');
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  useEffect(() => {
    ensureCard('kage_severed');
    ensureCard('raiden_ronin');
  }, [ensureCard]);

  const ownedCreatures = buildOwnedCreatures(collection);
  const history = loadArenaHistory();
  const wins = history.filter(h => h.result === 'win').length;
  const losses = history.filter(h => h.result === 'lose' || h.result === 'defeated').length;
  const bestFloor = history.reduce((max, h) => Math.max(max, h.floorReached || 0), 0);
  const totalEnemies = history.reduce((sum, h) => sum + (h.enemiesDefeated || 0), 0);

  const handleToggle = (card) => {
    setSelectedIds(prev =>
      prev.includes(card.id) ? prev.filter(id => id !== card.id)
      : prev.length < 5 ? [...prev, card.id] : prev
    );
  };

  const handleStart = () => {
    const cards = selectedIds.map(id => ownedCreatures.find(c => c.id === id)).filter(Boolean);
    if (cards.length !== 5) return;
    startRun(cards);
    navigate('/game/arena-map');
  };

  // Team synergy calc
  const selectedCards = selectedIds.map(id => ownedCreatures.find(c => c.id === id)).filter(Boolean);
  const typeCounts = {};
  selectedCards.forEach(c => {
    const t = DOMAIN_TO_TYPE[c.ieltsDomain] || 'Void';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  const synergies = Object.entries(typeCounts).filter(([, n]) => n >= 3).map(([t]) => t);
  const totalHP = selectedCards.reduce((s, c) => s + c.hp, 0);
  const avgATK = selectedCards.length ? Math.round(selectedCards.reduce((s, c) => s + c.attack, 0) / selectedCards.length) : 0;
  const avgDEF = selectedCards.length ? Math.round(selectedCards.reduce((s, c) => s + c.defense, 0) / selectedCards.length) : 0;
  const avgSPD = selectedCards.length ? Math.round(selectedCards.reduce((s, c) => s + c.speed, 0) / selectedCards.length) : 0;

  // ─── TEAM SELECTION SCREEN ───
  if (phase === 'selecting') {
    return (
      <div style={{ background: '#0D0608', minHeight: 'calc(100vh - 60px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button onClick={() => setPhase('hub')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '0.35rem 0.75rem', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.8rem' }}><Icon name="left" size={14} /> Back</button>
            <h2 style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '1.4rem', color: '#F5F0F0', margin: 0 }}>Assemble Your Team</h2>
          </div>

          {ownedCreatures.length < 5 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ color: CRIMSON, marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Icon name="attack" size={46} /></div>
              <p style={{ color: '#9CA3AF', marginBottom: 16 }}>You need at least 5 creatures to enter the Arena. Collect cards on the main site first.</p>
              <button onClick={() => navigate('/learn')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `linear-gradient(135deg, ${CRIMSON}, ${AMBER})`, color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Collect Cards <Icon name="right" size={15} /></button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
              <CreatureSelector ownedCards={ownedCreatures} selectedIds={selectedIds} onToggle={handleToggle} />

              {/* Team preview panel */}
              <div style={{ position: 'sticky', top: 80, background: '#1C0A0A', border: `1px solid ${CRIMSON}33`, borderRadius: 14, padding: '1.25rem' }}>
                <div style={{ fontFamily: 'Cinzel', fontWeight: 700, color: '#F5F0F0', marginBottom: 12, fontSize: '0.9rem' }}>
                  Team ({selectedIds.length}/5)
                </div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const c = selectedCards[i];
                    return (
                      <div key={i} style={{
                        width: 44, height: 54, borderRadius: 8,
                        border: `1px solid ${c ? TYPE_COLORS[DOMAIN_TO_TYPE[c.ieltsDomain]] : 'rgba(255,255,255,0.1)'}`,
                        background: '#0D0608',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', color: '#5A3535',
                      }}>
                        {c ? <CardArt card={c} style={{ borderRadius: 6 }} /> : '+'}
                      </div>
                    );
                  })}
                </div>

                {selectedCards.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    {[['Total HP', totalHP, '#DC2626'], ['Avg ATK', avgATK, '#F87171'], ['Avg DEF', avgDEF, '#7DD3FC'], ['Avg SPD', avgSPD, '#FBBF24']].map(([label, val, color]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '0.75rem' }}>
                        <span style={{ color: '#9CA3AF' }}>{label}</span>
                        <span style={{ fontFamily: 'JetBrains Mono', color, fontWeight: 700 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {synergies.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    {synergies.map(t => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${TYPE_COLORS[t]}15`, border: `1px solid ${TYPE_COLORS[t]}44`, borderRadius: 6, padding: '4px 8px', fontSize: '0.65rem', color: TYPE_COLORS[t], marginBottom: 4 }}>
                        <Icon name="sparkle" size={12} /> {typeCounts[t]} {t} types: +15% ATK bonus
                      </div>
                    ))}
                  </div>
                )}

                <motion.button
                  onClick={handleStart}
                  disabled={selectedIds.length !== 5}
                  whileHover={selectedIds.length === 5 ? { scale: 1.03 } : {}}
                  style={{
                    width: '100%',
                    background: selectedIds.length === 5 ? `linear-gradient(135deg, ${CRIMSON}, ${AMBER})` : 'rgba(255,255,255,0.06)',
                    border: 'none', borderRadius: 10, padding: '0.8rem',
                    color: selectedIds.length === 5 ? 'white' : '#6B7280',
                    fontWeight: 800, cursor: selectedIds.length === 5 ? 'pointer' : 'not-allowed',
                    fontFamily: 'Cinzel', fontSize: '0.9rem',
                    boxShadow: selectedIds.length === 5 ? `0 0 25px ${CRIMSON}55` : 'none',
                  }}
                >
                  {selectedIds.length === 5 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>Enter the Arena <Icon name="right" size={15} /></span> : `Select ${5 - selectedIds.length} more`}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── HUB SCREEN ───
  return (
    <div style={{ background: '#0D0608', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: 'Cinzel, serif', fontSize: '2.75rem', fontWeight: 900, color: CRIMSON, margin: '0 0 6px', textShadow: `0 0 40px ${CRIMSON}77` }}>
            <Icon name="attack" size={38} /> THE ARENA
          </h1>
          <p style={{ color: '#9CA3AF', fontStyle: 'italic', margin: 0 }}>Where legends are forged in battle</p>
        </motion.div>

        {run?.active ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#1C0A0A', border: `1px solid ${CRIMSON}44`, borderRadius: 16, padding: '1.5rem', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'Cinzel', fontWeight: 700, color: '#F5F0F0', marginBottom: 14 }}>
              <Icon name="attack" size={16} /> Run In Progress — Floor {run.floor}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
              {run.team.map((c, i) => {
                const dead = !c.isAlive || c.currentHP <= 0;
                const pct = (c.currentHP / c.maxHP) * 100;
                return (
                  <div key={i} style={{ textAlign: 'center', opacity: dead ? 0.4 : 1 }}>
                    <div style={{ filter: dead ? 'grayscale(100%)' : 'none', display: 'flex', justifyContent: 'center' }}><CreaturePortrait emoji={c.emoji} type={c.type || DOMAIN_TO_TYPE[c.ieltsDomain]} size={34} /></div>
                    <div style={{ width: 40, marginTop: 2 }}>
                      <div style={{ background: '#0D0608', borderRadius: 2, height: 4 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#DC2626', borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate('/game/arena-map')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `linear-gradient(135deg, ${CRIMSON}, ${AMBER})`, border: 'none', borderRadius: 10, padding: '0.75rem 1.75rem', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cinzel' }}>
                <Icon name="play" size={15} /> Continue Run
              </motion.button>
              <button onClick={() => setConfirmAbandon(true)}
                style={{ background: 'rgba(220,38,38,0.1)', border: `1px solid ${CRIMSON}55`, borderRadius: 10, padding: '0.75rem 1.25rem', color: CRIMSON, fontWeight: 600, cursor: 'pointer' }}>
                Abandon Run
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Collection section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#1C0A0A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem', marginBottom: 16 }}>
              <div style={{ fontFamily: 'Cinzel', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Your Collection</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ color: '#F5F0F0', fontSize: '0.9rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: CRIMSON, fontSize: '1.5rem' }}>{ownedCreatures.length}</span> creatures available for battle
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {ownedCreatures.slice(0, 3).map(c => (
                    <div key={c.instanceId} title={c.name} style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', border: `1px solid ${TYPE_COLORS[DOMAIN_TO_TYPE[c.ieltsDomain]]}66` }}>
                      <CardArt card={c} />
                    </div>
                  ))}
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/game/play')}
                style={{ width: '100%', marginTop: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: `linear-gradient(135deg, ${CRIMSON}, #7F1D1D)`, border: '2px solid #F59E0B', borderRadius: 12, padding: '1rem', color: 'white', fontWeight: 900, cursor: 'pointer', fontFamily: 'Cinzel', fontSize: '1.1rem', boxShadow: `0 0 34px ${CRIMSON}66` }}>
                <Icon name="play" size={18} /> ENTER SOLO ARENA
              </motion.button>
              <div style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.68rem', marginTop: 6 }}>
                Choose Expedition or Dungeon · one hero · endless rooms
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setPhase('selecting')}
                style={{ width: '100%', marginTop: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.7rem', color: '#9CA3AF', fontWeight: 600, cursor: 'pointer', fontFamily: 'Cinzel', fontSize: '0.85rem' }}>
                <Icon name="attack" size={14} /> Squad mode (5 cards, floor map)
              </motion.button>
            </motion.div>

            {/* Records section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ background: '#1C0A0A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ fontFamily: 'Cinzel', fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Arena Records</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {[['Best Floor', bestFloor || '—', '#F59E0B'], ['Enemies Slain', totalEnemies, '#DC2626'], ['W / L', `${wins}/${losses}`, '#4ADE80']].map(([label, val, color]) => (
                  <div key={label} style={{ textAlign: 'center', background: '#0D0608', borderRadius: 10, padding: '0.75rem' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.25rem', color }}>{val}</div>
                    <div style={{ fontSize: '0.6rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                  </div>
                ))}
              </div>
              {history.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {history.slice(0, 5).map((h, i) => {
                    const win = h.result === 'win';
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0D0608', borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: win ? '#4ADE80' : '#F87171', fontWeight: 600 }}>
                          <Icon name={win ? 'trophy' : h.result === 'abandoned' ? 'cross' : 'skull'} size={13} /> {win ? 'Victory' : h.result === 'abandoned' ? 'Abandoned' : 'Defeated'} — Floor {h.floorReached}
                        </span>
                        <span style={{ color: '#9CA3AF', fontSize: '0.65rem' }}>{new Date(h.date).toLocaleDateString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Abandon modal */}
        <AnimatePresence>
          {confirmAbandon && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                style={{ background: '#1C0A0A', border: `1px solid ${CRIMSON}55`, borderRadius: 14, padding: '2rem', textAlign: 'center', maxWidth: 340 }}>
                <div style={{ color: CRIMSON, marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Icon name="warning" size={40} /></div>
                <h3 style={{ fontFamily: 'Cinzel', color: '#F5F0F0', margin: '0 0 8px' }}>Abandon Run?</h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: 20 }}>All progress will be lost.</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => { abandonRun(); setConfirmAbandon(false); }} style={{ background: 'rgba(220,38,38,0.2)', border: `1px solid ${CRIMSON}`, borderRadius: 8, padding: '0.6rem 1.25rem', color: CRIMSON, fontWeight: 700, cursor: 'pointer' }}>Abandon</button>
                  <button onClick={() => setConfirmAbandon(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.6rem 1.25rem', color: '#F5F0F0', fontWeight: 600, cursor: 'pointer' }}>Keep Going</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
