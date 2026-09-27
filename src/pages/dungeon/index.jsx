import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/Card';
import { useDungeonRun, loadHistory } from '../../hooks/useDungeonRun';
import { useCards } from '../../hooks/useCards';
import { getCardById, RARITY_COLORS } from '../../data/cards';
import { Icon } from '../../components/Icon';

function RunHistoryItem({ run, index }) {
  const date = new Date(run.date).toLocaleDateString();
  const isWin = run.result === 'win';
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{
        background: '#161B22',
        border: `1px solid ${isWin ? 'rgba(63,185,80,0.3)' : 'rgba(248,81,73,0.2)'}`,
        borderRadius: 8, padding: '0.75rem 1rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ color: isWin ? '#3FB950' : '#F85149', display: 'grid', placeItems: 'center' }}><Icon name={isWin ? 'trophy' : 'skull'} size={18} /></span>
        <div>
          <div style={{ fontWeight: 600, color: isWin ? '#3FB950' : '#F85149', fontSize: '0.85rem' }}>
            {isWin ? 'Victory' : run.result === 'abandoned' ? 'Abandoned' : 'Defeated'} — Floor {run.floorReached}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#8B949E' }}>
            {run.enemiesDefeated} enemies · {run.questionsCorrect} correct · {date}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {run.cardsUsed?.slice(0, 5).map((name, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3, padding: '1px 5px',
            fontSize: '0.6rem', color: '#8B949E',
          }} title={name}>
            {name.split(' ')[0]}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function DungeonHub() {
  const navigate = useNavigate();
  const { run, startRun, abandonRun } = useDungeonRun();
  const { collection } = useCards();
  const [phase, setPhase] = useState('hub'); // hub | selecting
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  const history = loadHistory().slice(0, 5);

  const ownedCards = collection.cards.map(c => {
    const master = getCardById(c.cardId);
    if (!master) return null;
    const stats = c.evolutionLevel === 0 ? master.baseStats : c.evolutionLevel === 1 ? master.evolvedStats : master.maxStats;
    return { ...master, instanceId: c.instanceId, evolutionLevel: c.evolutionLevel, hp: stats.hp, attack: stats.attack, defense: stats.defense, speed: stats.speed };
  }).filter(Boolean);

  const handleToggleCard = (card) => {
    setSelectedIds(prev =>
      prev.includes(card.id)
        ? prev.filter(id => id !== card.id)
        : prev.length < 5 ? [...prev, card.id] : prev
    );
  };

  const handleStartRun = () => {
    const cards = selectedIds.map(id => {
      const card = ownedCards.find(c => c.id === id);
      return card;
    }).filter(Boolean);

    if (cards.length !== 5) return;
    startRun(cards);
    navigate('/dungeon/map');
  };

  if (phase === 'selecting') {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setPhase('hub')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'none', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '0.35rem 0.75rem', color: '#8B949E', cursor: 'pointer', fontSize: '0.8rem',
          }}><Icon name="left" size={14} /> Back</button>
          <h2 style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '1.25rem', color: '#E6EDF3', margin: 0 }}>
            Choose Your 5 Cards
          </h2>
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'JetBrains Mono', fontWeight: 700,
            color: selectedIds.length === 5 ? '#3FB950' : '#F59E0B',
          }}>
            {selectedIds.length}/5 selected
          </span>
        </div>

        {ownedCards.length < 5 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ color: '#7C3AED', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Icon name="sparkle" size={44} /></div>
            <p style={{ color: '#8B949E', marginBottom: 16 }}>
              You need at least 5 cards to start a run. Collect more cards by completing learning modules.
            </p>
            <Link to="/learn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              color: 'white', textDecoration: 'none',
              padding: '0.75rem 1.5rem', borderRadius: 10,
              fontWeight: 700, fontSize: '0.875rem',
            }}>
              Start Learning <Icon name="right" size={15} />
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
              {ownedCards.map(card => {
                const isSelected = selectedIds.includes(card.id);
                return (
                  <motion.div
                    key={card.id}
                    onClick={() => handleToggleCard(card)}
                    whileHover={{ y: -4 }}
                    style={{
                      cursor: 'pointer',
                      outline: isSelected ? `3px solid ${RARITY_COLORS[card.rarity]}` : 'none',
                      outlineOffset: 3,
                      borderRadius: 12,
                      position: 'relative',
                    }}
                  >
                    <Card card={card} evolutionLevel={card.evolutionLevel} owned size="md" />
                    {isSelected && (
                      <div style={{
                        position: 'absolute', top: 6, left: 6,
                        width: 22, height: 22, borderRadius: '50%',
                        background: RARITY_COLORS[card.rarity],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: '0.75rem', color: '#0D1117',
                      }}>
                        {selectedIds.indexOf(card.id) + 1}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center' }}>
              <motion.button
                onClick={handleStartRun}
                disabled={selectedIds.length !== 5}
                whileHover={selectedIds.length === 5 ? { scale: 1.05 } : {}}
                whileTap={selectedIds.length === 5 ? { scale: 0.97 } : {}}
                style={{
                  background: selectedIds.length === 5
                    ? 'linear-gradient(135deg, #7C3AED, #5B21B6)'
                    : 'rgba(255,255,255,0.06)',
                  border: 'none', borderRadius: 12,
                  padding: '0.875rem 2.5rem',
                  color: selectedIds.length === 5 ? 'white' : '#4B5563',
                  fontWeight: 700, fontSize: '1rem',
                  cursor: selectedIds.length === 5 ? 'pointer' : 'not-allowed',
                  fontFamily: 'Cinzel, serif',
                  boxShadow: selectedIds.length === 5 ? '0 0 30px rgba(124,58,237,0.5)' : 'none',
                }}
              >
                {selectedIds.length === 5 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Icon name="attack" size={16} /> Enter the Dungeon <Icon name="right" size={15} /></span> : `Select ${5 - selectedIds.length} more cards`}
              </motion.button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Hub view
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div style={{ color: '#A78BFA', marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Icon name="castle" size={60} /></div>
        <h1 style={{
          fontFamily: 'Cinzel, serif', fontSize: '2.5rem', fontWeight: 900,
          color: '#E6EDF3', margin: '0 0 8px',
          textShadow: '0 0 40px rgba(124,58,237,0.5)',
        }}>
          The Dungeon
        </h1>
        <p style={{ color: '#8B949E', fontSize: '1rem', fontStyle: 'italic', margin: 0 }}>
          "Only those who dare to enter shall emerge stronger."
        </p>
      </motion.div>

      {/* Active run or start */}
      {run?.active ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#161B22',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 14, padding: '1.5rem',
            marginBottom: 28, textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '1.1rem', fontWeight: 700, color: '#E6EDF3', marginBottom: 8 }}><Icon name="attack" size={20} /> Run In Progress</div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#A78BFA', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.25rem' }}>
                {run.floor}/3
              </div>
              <div style={{ color: '#8B949E', fontSize: '0.7rem' }}>FLOOR</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#3FB950', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.25rem' }}>
                {run.playerHP}/{run.playerMaxHP}
              </div>
              <div style={{ color: '#8B949E', fontSize: '0.7rem' }}>HP</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#F59E0B', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.25rem' }}>
                {run.gold}
              </div>
              <div style={{ color: '#8B949E', fontSize: '0.7rem' }}>GOLD</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => navigate('/dungeon/map')}
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                border: 'none', borderRadius: 10,
                padding: '0.75rem 1.75rem',
                color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
                fontFamily: 'Cinzel, serif',
                display: 'inline-flex', alignItems: 'center', gap: 7,
              }}
            >
              <Icon name="play" size={15} /> Continue Run
            </motion.button>
            <button
              onClick={() => setConfirmAbandon(true)}
              style={{
                background: 'rgba(248,81,73,0.1)',
                border: '1px solid rgba(248,81,73,0.3)',
                borderRadius: 10, padding: '0.75rem 1.25rem',
                color: '#F85149', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
              }}
            >
              Abandon Run
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase('selecting')}
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              border: '1px solid rgba(124,58,237,0.5)',
              borderRadius: 14, padding: '1.1rem 3rem',
              color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '1.1rem',
              fontFamily: 'Cinzel, serif',
              boxShadow: '0 0 40px rgba(124,58,237,0.4)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            <Icon name="attack" size={18} /> Start New Run
          </motion.button>
          <p style={{ color: '#4B5563', fontSize: '0.75rem', marginTop: 10 }}>
            Select 5 cards from your collection
          </p>
        </motion.div>
      )}

      {/* Confirm abandon modal */}
      <AnimatePresence>
        {confirmAbandon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                background: '#161B22',
                border: '1px solid rgba(248,81,73,0.3)',
                borderRadius: 14, padding: '2rem',
                textAlign: 'center', maxWidth: 360,
              }}
            >
              <div style={{ color: '#F85149', marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Icon name="warning" size={40} /></div>
              <h3 style={{ fontFamily: 'Cinzel', color: '#E6EDF3', margin: '0 0 8px' }}>Abandon Run?</h3>
              <p style={{ color: '#8B949E', fontSize: '0.875rem', marginBottom: 20 }}>
                All progress will be lost. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => { abandonRun(); setConfirmAbandon(false); }} style={{
                  background: 'rgba(248,81,73,0.2)', border: '1px solid rgba(248,81,73,0.5)',
                  borderRadius: 8, padding: '0.6rem 1.25rem',
                  color: '#F85149', fontWeight: 700, cursor: 'pointer',
                }}>
                  Abandon
                </button>
                <button onClick={() => setConfirmAbandon(false)} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '0.6rem 1.25rem',
                  color: '#E6EDF3', fontWeight: 600, cursor: 'pointer',
                }}>
                  Keep Going
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run history */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ fontFamily: 'Cinzel', fontSize: '0.875rem', fontWeight: 700, color: '#8B949E', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>
            Recent Runs
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((run, i) => (
              <RunHistoryItem key={i} run={run} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
