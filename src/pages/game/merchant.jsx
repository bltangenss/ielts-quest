import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useArenaRun } from '../../hooks/useArenaRun';
import { getArenaShopItems } from '../../data/arenaItems';
import { Icon } from '../../components/Icon';

const CRIMSON = '#DC2626';
const AMBER = '#B45309';

export default function ArenaMerchant() {
  const navigate = useNavigate();
  const { run, completeNode, updateGold, addRelic, updateTeam } = useArenaRun();
  const [items] = useState(() => getArenaShopItems(3));
  const [purchased, setPurchased] = useState([]);
  const [toast, setToast] = useState(null);

  if (!run?.active) { navigate('/game'); return null; }

  const showToast = (msg, color = '#4ADE80') => { setToast({ msg, color }); setTimeout(() => setToast(null), 1800); };

  const handleBuy = (item) => {
    if (run.gold < item.cost) { showToast('Not enough gold!', CRIMSON); return; }
    if (purchased.includes(item.id)) return;
    updateGold(run.gold - item.cost);

    // Instant-effect items modify team now
    if (item.effect.type === 'team_hp_bonus') {
      const team = run.team.map(c => ({ ...c, maxHP: c.maxHP + item.effect.value, currentHP: c.currentHP + item.effect.value }));
      updateTeam(team);
    }
    addRelic(`${item.emoji}|${item.id}`);
    setPurchased(prev => [...prev, item.id]);
    showToast(`${item.name} acquired!`);
  };

  const handleLeave = () => { completeNode(run.currentNodeId, {}); navigate('/game/arena-map'); };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D0608' }}>
      {toast && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', background: '#1C0A0A', border: `1px solid ${toast.color}`, borderRadius: 8, padding: '0.5rem 1rem', color: toast.color, fontWeight: 700, fontSize: '0.875rem', zIndex: 100 }}>
          {toast.msg}
        </motion.div>
      )}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ marginBottom: 8, color: '#F59E0B', display: 'flex', justifyContent: 'center' }}><Icon name="cart" size={56} /></div>
          <h2 style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '1.5rem', color: '#F5F0F0', margin: '0 0 6px' }}>The Merchant</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.875rem', fontStyle: 'italic', margin: '0 0 12px' }}>"Rare relics for rare warriors. Choose wisely."</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '0.3rem 0.875rem' }}>
            <span style={{ color: '#F59E0B', display: 'grid', placeItems: 'center' }}><Icon name="gold" size={15} /></span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#F59E0B' }}>{run.gold} gold</span>
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {items.map((item, i) => {
            const bought = purchased.includes(item.id);
            const afford = run.gold >= item.cost;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                style={{ background: bought ? 'rgba(255,255,255,0.02)' : '#1C0A0A', border: `1px solid ${bought ? 'rgba(34,197,94,0.2)' : afford ? `${AMBER}44` : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 14, opacity: bought ? 0.5 : 1 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(180,83,9,0.12)', border: `1px solid ${AMBER}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', flexShrink: 0 }}><Icon glyph={item.emoji} size={26} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Cinzel', fontWeight: 700, color: '#F5F0F0', marginBottom: 3, fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.75rem', lineHeight: 1.5 }}>{item.description}</div>
                </div>
                <button onClick={() => !bought && handleBuy(item)} disabled={bought || !afford}
                  style={{ background: bought ? 'rgba(34,197,94,0.1)' : afford ? `linear-gradient(135deg, ${AMBER}, #92400E)` : 'rgba(255,255,255,0.04)', border: `1px solid ${bought ? '#22C55E33' : afford ? `${AMBER}66` : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '0.5rem 0.875rem', color: bought ? '#22C55E' : afford ? '#fff' : '#6B7280', fontWeight: 700, cursor: !bought && afford ? 'pointer' : 'not-allowed', fontSize: '0.75rem', minWidth: 72, textAlign: 'center', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  {bought ? <><Icon name="check" size={13} /> Bought</> : <>{item.cost} <Icon name="gold" size={13} /></>}
                </button>
              </motion.div>
            );
          })}
        </div>

        <button onClick={handleLeave} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.875rem', color: '#F5F0F0', fontWeight: 600, cursor: 'pointer', fontFamily: 'Cinzel', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          Leave Merchant <Icon name="right" size={15} />
        </button>
      </div>
    </div>
  );
}
