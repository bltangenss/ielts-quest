import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RunStats } from '../../components/dungeon/RunStats';
import { useDungeonRun } from '../../hooks/useDungeonRun';
import { getShopItems } from '../../data/dungeonItems';
import { Icon } from '../../components/Icon';

export default function ShopPage() {
  const navigate = useNavigate();
  const { run, completeNode, updateGold, addRelic, updateHP } = useDungeonRun();
  const [shopItems] = useState(() => getShopItems(3));
  const [purchased, setPurchased] = useState([]);
  const [toast, setToast] = useState(null);

  if (!run?.active) { navigate('/dungeon'); return null; }

  const showToast = (msg, color = '#3FB950') => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2000);
  };

  const handleBuy = (item) => {
    if (run.gold < item.cost) {
      showToast('Not enough gold!', '#F85149');
      return;
    }
    if (purchased.includes(item.id)) return;

    updateGold(run.gold - item.cost);

    // Apply instant effects
    if (item.effect.type === 'instant_heal') {
      updateHP(Math.min(run.playerMaxHP, run.playerHP + item.effect.value));
    } else {
      // Add as relic (emoji + id for identification)
      const relicEntry = `${item.emoji}|${item.id}`;
      addRelic(relicEntry);
    }

    setPurchased(prev => [...prev, item.id]);
    showToast(`${item.name} purchased!`);
  };

  const handleLeave = () => {
    completeNode(run.currentNodeId);
    navigate('/dungeon/map');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D1117' }}>
      <RunStats run={run} />

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
            background: '#161B22', border: `1px solid ${toast.color}`,
            borderRadius: 8, padding: '0.5rem 1rem',
            color: toast.color, fontWeight: 700, fontSize: '0.875rem',
            zIndex: 100,
          }}
        >
          {toast.msg}
        </motion.div>
      )}

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Merchant header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 28 }}
        >
          <div style={{ marginBottom: 8, color: '#F59E0B', display: 'flex', justifyContent: 'center' }}><Icon name="cart" size={56} /></div>
          <h2 style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '1.5rem', color: '#E6EDF3', margin: '0 0 6px' }}>
            The Dungeon Shop
          </h2>
          <p style={{ color: '#8B949E', fontSize: '0.875rem', fontStyle: 'italic', margin: '0 0 12px' }}>
            "Welcome, traveler. Gold speaks louder than words here."
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 100, padding: '0.3rem 0.875rem',
          }}>
            <span style={{ color: '#F59E0B', display: 'grid', placeItems: 'center' }}><Icon name="gold" size={15} /></span>
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#F59E0B', fontSize: '1rem' }}>
              {run.gold} gold
            </span>
          </div>
        </motion.div>

        {/* Shop items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {shopItems.map((item, i) => {
            const bought = purchased.includes(item.id);
            const canAfford = run.gold >= item.cost;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: bought ? 'rgba(255,255,255,0.02)' : '#161B22',
                  border: `1px solid ${bought ? 'rgba(63,185,80,0.2)' : canAfford ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 12, padding: '1.25rem',
                  display: 'flex', alignItems: 'center', gap: 14,
                  opacity: bought ? 0.5 : 1,
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#F59E0B', flexShrink: 0,
                }}>
                  <Icon glyph={item.emoji} size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cinzel', fontWeight: 700, color: '#E6EDF3', marginBottom: 3, fontSize: '0.95rem' }}>
                    {item.name}
                  </div>
                  <div style={{ color: '#8B949E', fontSize: '0.75rem', lineHeight: 1.5 }}>
                    {item.description}
                  </div>
                </div>
                <motion.button
                  onClick={() => !bought && handleBuy(item)}
                  disabled={bought || !canAfford}
                  whileHover={!bought && canAfford ? { scale: 1.05 } : {}}
                  whileTap={!bought && canAfford ? { scale: 0.97 } : {}}
                  style={{
                    background: bought ? 'rgba(63,185,80,0.1)'
                      : canAfford ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${bought ? '#3FB95033' : canAfford ? '#F59E0B66' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 8, padding: '0.5rem 0.875rem',
                    color: bought ? '#3FB950' : canAfford ? '#0D1117' : '#4B5563',
                    fontWeight: 700, cursor: !bought && canAfford ? 'pointer' : 'not-allowed',
                    fontSize: '0.75rem', flexShrink: 0,
                    minWidth: 72, textAlign: 'center',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}
                >
                  {bought ? <><Icon name="check" size={13} /> Bought</> : <>{item.cost} <Icon name="gold" size={13} /></>}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={handleLeave}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '0.875rem',
            color: '#E6EDF3', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
            fontFamily: 'Cinzel',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}
        >
          Leave Shop <Icon name="right" size={15} />
        </button>
      </div>
    </div>
  );
}
