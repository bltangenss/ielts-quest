import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBack } from '../components/Card';
import { useUser } from '../hooks/useUser';
import { useCards } from '../hooks/useCards';
import { useToast } from '../components/ToastNotification';
import { openChest, CHEST_INFO } from '../utils/cardDrop';
import { RARITY_COLORS } from '../data/cards';
import { Icon } from '../components/Icon';

function Particle({ color, delay }) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{
        y: Math.random() * -300 - 100,
        x: (Math.random() - 0.5) * 400,
        opacity: 0,
        scale: 0,
      }}
      transition={{ duration: 1.5, delay, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        width: 8, height: 8,
        borderRadius: '50%',
        background: color,
        top: '50%', left: '50%',
        pointerEvents: 'none',
      }}
    />
  );
}

function CardReveal({ card, onDone, dustGained, isDuplicate }) {
  const [flipped, setFlipped] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const rarityColor = RARITY_COLORS[card.rarity];

  useEffect(() => {
    const t1 = setTimeout(() => setFlipped(true), 800);
    const t2 = setTimeout(() => setShowParticles(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 20, position: 'relative',
    }}>
      {/* Particle burst */}
      {showParticles && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Particle key={i} color={rarityColor} delay={i * 0.05} />
          ))}
          {card.rarity === 'legendary' && Array.from({ length: 20 }).map((_, i) => (
            <Particle key={`g${i}`} color="#F59E0B" delay={i * 0.03} />
          ))}
        </div>
      )}

      {/* Rarity label for epic/legendary */}
      {showParticles && (card.rarity === 'legendary' || card.rarity === 'epic') && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 900,
            fontSize: card.rarity === 'legendary' ? '2rem' : '1.5rem',
            color: rarityColor,
            textShadow: `0 0 30px ${rarityColor}`,
            letterSpacing: 4,
            textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}
        >
          <Icon name="sparkle" size={card.rarity === 'legendary' ? 24 : 18} /> {card.rarity === 'legendary' ? 'LEGENDARY!' : 'EPIC!'} <Icon name="sparkle" size={card.rarity === 'legendary' ? 24 : 18} />
        </motion.div>
      )}

      {/* Card flip */}
      <motion.div
        style={{ perspective: 1000, cursor: 'pointer' }}
        onClick={() => !flipped && setFlipped(true)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', width: 220, height: 308 }}
        >
          {/* Back */}
          <div style={{ position: 'absolute', backfaceVisibility: 'hidden', width: '100%', height: '100%' }}>
            <CardBack size="lg" />
          </div>
          {/* Front */}
          <div style={{ position: 'absolute', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', width: '100%', height: '100%' }}>
            <Card card={card} size="lg" owned evolutionLevel={0} />
          </div>
        </motion.div>
      </motion.div>

      {/* Duplicate / result message */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily: 'Bricolage Grotesque, sans-serif',
              fontWeight: 700, fontSize: '1.1rem',
              color: rarityColor, marginBottom: 4,
            }}>
              {card.name}
            </div>
            <div style={{
              display: 'inline-block',
              background: `${rarityColor}22`,
              border: `1px solid ${rarityColor}44`,
              borderRadius: 100, padding: '2px 10px',
              fontSize: '0.7rem', color: rarityColor, marginBottom: 8,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              {card.rarity}
            </div>
            {isDuplicate && (
              <div style={{
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 8, padding: '0.5rem 1rem',
                color: '#F59E0B', fontSize: '0.8rem', fontWeight: 600,
              }}>
                Duplicate, +{dustGained} Dust
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ChestPage() {
  const location = useLocation();
  const { profile, useChest } = useUser();
  const { addCard, collection } = useCards();
  const toast = useToast();

  const [selectedChest, setSelectedChest] = useState(
    location.state?.chestType || null
  );
  const [phase, setPhase] = useState('select'); // select | opening | results
  const [results, setResults] = useState(null); // { cards, dustBonus }
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [chestShaking, setChestShaking] = useState(false);
  const [chestExploding, setChestExploding] = useState(false);

  const chestTypes = ['bronze', 'silver', 'gold', 'legendary'];

  const handleOpenChest = () => {
    if (!selectedChest) return;
    const count = profile.chestsAvailable[selectedChest] || 0;
    if (count <= 0) return;

    useChest(selectedChest);
    setChestShaking(true);

    setTimeout(() => {
      setChestShaking(false);
      setChestExploding(true);
    }, 600);

    setTimeout(() => {
      setChestExploding(false);
      const { cards, dustBonus } = openChest(selectedChest);
      const cardResults = cards.map(card => {
        const result = addCard(card.id);
        return { card, isDuplicate: result.isDuplicate, dustGained: result.dustGained };
      });
      setResults({ cards: cardResults, dustBonus });
      setCurrentCardIdx(0);
      setPhase('revealing');
    }, 1200);
  };

  const handleNextCard = () => {
    if (results && currentCardIdx + 1 < results.cards.length) {
      setCurrentCardIdx(i => i + 1);
    } else {
      setPhase('done');
    }
  };

  const handleReset = () => {
    setPhase('select');
    setSelectedChest(location.state?.chestType || null);
    setResults(null);
    setCurrentCardIdx(0);
  };

  if (phase === 'revealing' && results) {
    const current = results.cards[currentCardIdx];
    return (
      <div style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 32, padding: '2rem',
        background: 'radial-gradient(ellipse at center, rgba(109,94,246,0.1) 0%, transparent 70%)',
      }}>
        <CardReveal
          card={current.card}
          isDuplicate={current.isDuplicate}
          dustGained={current.dustGained}
          onDone={handleNextCard}
        />
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={handleNextCard}
          style={{
            background: 'linear-gradient(135deg, #6D5EF6, #5B21B6)',
            border: 'none', borderRadius: 10, padding: '0.75rem 2rem',
            color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
          }}
        >
          {currentCardIdx + 1 < results.cards.length ? `Next Card (${currentCardIdx + 2}/${results.cards.length})` : 'Collect Cards'}
        </motion.button>
      </div>
    );
  }

  if (phase === 'done' && results) {
    return (
      <div style={{
        maxWidth: 600, margin: '0 auto', padding: '3rem 1.5rem',
        textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'Bricolage Grotesque', fontSize: '1.5rem', fontWeight: 700, color: '#221A5B', marginBottom: 8 }}>
            <Icon name="sparkle" size={20} color="#F59E0B" /> Cards Collected! <Icon name="sparkle" size={20} color="#F59E0B" />
          </h2>
          {results.dustBonus > 0 && (
            <p style={{ color: '#F59E0B', fontSize: '0.875rem', marginBottom: 20 }}>
              +{results.dustBonus} dust bonus from chest!
            </p>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {results.cards.map(({ card, isDuplicate }, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <Card card={card} size="md" owned evolutionLevel={0} />
                {isDuplicate && (
                  <div style={{ fontSize: '0.65rem', color: '#F59E0B', marginTop: 4 }}>DUPLICATE</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={handleReset} style={{
              background: 'linear-gradient(135deg, #6D5EF6, #5B21B6)',
              border: 'none', borderRadius: 10, padding: '0.75rem 1.5rem',
              color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
            }}>
              Open Another Chest
            </button>
            <Link to="/collection" style={{
              background: 'rgba(34,26,91,0.05)',
              border: '1px solid rgba(34,26,91,0.08)',
              borderRadius: 10, padding: '0.75rem 1.5rem',
              color: '#221A5B', textDecoration: 'none',
              fontWeight: 600, fontSize: '0.9rem',
            }}>
              View Collection
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Select phase
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: '1.75rem', fontWeight: 700, color: '#221A5B', marginBottom: 8 }}>
        Open Chests
      </h1>
      <p style={{ color: '#6A6F9C', marginBottom: 32, fontSize: '0.875rem' }}>
        Open your collected chests to discover new cards.
      </p>

      {/* Chest selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
        {chestTypes.map(type => {
          const info = CHEST_INFO[type];
          const count = profile.chestsAvailable[type] || 0;
          const isSelected = selectedChest === type;

          return (
            <motion.div
              key={type}
              onClick={() => count > 0 && setSelectedChest(type)}
              whileHover={count > 0 ? { y: -4 } : {}}
              style={{
                background: isSelected ? info.bgColor : 'rgba(255,255,255,0.03)',
                border: `2px solid ${isSelected ? info.borderColor : 'rgba(34,26,91,0.05)'}`,
                borderRadius: 14, padding: '1.5rem',
                textAlign: 'center', cursor: count > 0 ? 'pointer' : 'not-allowed',
                opacity: count > 0 ? 1 : 0.4,
                transition: 'all 0.2s',
              }}
            >
              <motion.div
                animate={count > 0 ? { y: [0, -6, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ marginBottom: 8, color: info.color, display: 'flex', justifyContent: 'center' }}
              >
                <Icon glyph={info.emoji} size={40} />
              </motion.div>
              <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: info.color, marginBottom: 4 }}>
                {info.name}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.5rem', fontWeight: 700, color: count > 0 ? '#221A5B' : '#4B5563' }}>
                {count}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#6A6F9C', marginTop: 4 }}>
                {info.cardCount} card{info.cardCount > 1 ? 's' : ''}
                {info.dustBonus > 0 ? ` + ${info.dustBonus} dust` : ''}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Open button / chest animation area */}
      <div style={{ textAlign: 'center' }}>
        {selectedChest && phase === 'select' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <motion.div
              animate={chestShaking ? {
                x: [0, -10, 10, -10, 10, -5, 5, 0],
                rotate: [0, -5, 5, -5, 5, -2, 2, 0],
              } : {}}
              transition={{ duration: 0.6 }}
              style={{ color: CHEST_INFO[selectedChest].color, display: 'flex', justifyContent: 'center', filter: chestShaking ? `drop-shadow(0 0 30px ${CHEST_INFO[selectedChest].color})` : 'none' }}
            >
              {chestExploding ? null : <Icon glyph={CHEST_INFO[selectedChest].emoji} size={88} />}
            </motion.div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '1.1rem', color: CHEST_INFO[selectedChest].color }}>
                {CHEST_INFO[selectedChest].name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6A6F9C', marginTop: 4 }}>
                {CHEST_INFO[selectedChest].description}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenChest}
              disabled={chestShaking || chestExploding}
              style={{
                background: `linear-gradient(135deg, ${CHEST_INFO[selectedChest].color}, ${CHEST_INFO[selectedChest].color}99)`,
                border: 'none', borderRadius: 12,
                padding: '0.875rem 2.5rem',
                color: '#F5F7FE', fontWeight: 800, cursor: 'pointer', fontSize: '1rem',
                fontFamily: 'Bricolage Grotesque, sans-serif',
                boxShadow: `0 0 30px ${CHEST_INFO[selectedChest].color}66`,
                opacity: chestShaking || chestExploding ? 0.5 : 1,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {chestShaking ? 'Opening...' : <><Icon name="box" size={16} /> Open Chest</>}
            </motion.button>
          </div>
        )}

        {!selectedChest && (
          <p style={{ color: '#4B5563', fontSize: '0.875rem' }}>
            Select a chest above to open it
          </p>
        )}

        {Object.values(profile.chestsAvailable).every(v => v === 0) && (
          <div style={{ marginTop: 20 }}>
            <p style={{ color: '#6A6F9C', marginBottom: 12 }}>No chests available. Complete learning modules to earn more!</p>
            <Link to="/learn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, #6D5EF6, #5B21B6)',
              color: 'white', textDecoration: 'none',
              padding: '0.75rem 1.5rem', borderRadius: 10,
              fontWeight: 600, fontSize: '0.875rem',
            }}>
              Start Learning <Icon name="right" size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
