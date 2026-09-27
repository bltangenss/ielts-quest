import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimeCreature } from '../../components/game/AnimeCreature';
import { useArenaRun } from '../../hooks/useArenaRun';
import { useUser } from '../../hooks/useUser';
import { DOMAIN_TO_TYPE } from '../../data/arenaAbilities';
import { Icon } from '../../components/Icon';

const CRIMSON = '#DC2626';
const AMBER = '#B45309';

const TITLES = { 2: 'Arena Novice', 3: 'Arena Warrior', 4: 'Arena Champion', 5: 'Arena Legend' };

function Particle({ color, delay }) {
  return (
    <motion.div initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{ y: Math.random() * -400 - 100, x: (Math.random() - 0.5) * 600, opacity: 0, scale: 0 }}
      transition={{ duration: 2, delay, ease: 'easeOut' }}
      style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: color, top: '50%', left: '50%', pointerEvents: 'none' }} />
  );
}

export default function ArenaResult() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const outcome = params.get('outcome') || 'lose';
  const isWin = outcome === 'win';

  const { run, endRun } = useArenaRun();
  const { addChest, addXP, unlockAchievement } = useUser();
  const [claimed, setClaimed] = useState(false);
  const [snapshot] = useState(() => run ? { ...run } : null);

  const floorReached = snapshot?.floor || 1;
  const title = isWin ? TITLES[5] : TITLES[floorReached];

  const handleClaim = () => {
    if (claimed) return;
    setClaimed(true);
    if (isWin) {
      addChest('gold');
      addXP(200);
      unlockAchievement && unlockAchievement('arena_legend');
    } else if (floorReached >= 3) {
      addChest('silver'); addXP(80);
    } else if (floorReached >= 2) {
      addChest('bronze'); addXP(40);
    } else {
      addXP(15);
    }
    endRun(isWin ? 'win' : 'lose', title ? [title] : []);
  };

  const handleNav = (path) => { if (!claimed) handleClaim(); navigate(path); };

  const stats = snapshot?.runStats || {};
  const statList = [
    { label: 'Floors Cleared', value: isWin ? 5 : floorReached, icon: 'castle' },
    { label: 'Enemies Defeated', value: stats.enemiesDefeated || 0, icon: 'attack' },
    { label: 'Abilities Used', value: stats.abilitiesUsed || 0, icon: 'sparkle' },
    { label: 'Damage Dealt', value: stats.damageDealt || 0, icon: 'fire' },
  ];

  const survivors = (snapshot?.team || []).filter(c => c.isAlive && c.currentHP > 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: isWin
        ? 'radial-gradient(ellipse at center, rgba(245,158,11,0.14), #0D0608 70%)'
        : 'radial-gradient(ellipse at center, rgba(127,29,29,0.18), #0D0608 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
    }}>
      {isWin && Array.from({ length: 30 }).map((_, i) => <Particle key={i} color={i % 2 === 0 ? '#F59E0B' : CRIMSON} delay={i * 0.04} />)}

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
        style={{ background: '#1C0A0A', border: `2px solid ${isWin ? '#F59E0B66' : `${CRIMSON}66`}`, boxShadow: `0 0 60px ${isWin ? 'rgba(245,158,11,0.2)' : 'rgba(220,38,38,0.2)'}`, borderRadius: 20, padding: '2.5rem', maxWidth: 480, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <motion.div animate={isWin ? { rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] } : { scale: [1, 0.95, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ marginBottom: 16, color: isWin ? '#F59E0B' : CRIMSON, display: 'flex', justifyContent: 'center' }}>
          <Icon name={isWin ? 'crown' : 'skull'} size={72} />
        </motion.div>

        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', fontWeight: 900, color: isWin ? '#F59E0B' : CRIMSON, margin: '0 0 6px', textShadow: `0 0 30px ${isWin ? 'rgba(245,158,11,0.6)' : 'rgba(220,38,38,0.6)'}` }}>
          {isWin ? 'VICTORY!' : 'DEFEATED'}
        </h1>

        {title && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 100, padding: '4px 14px', marginBottom: 16, color: '#F59E0B', fontFamily: 'Cinzel', fontWeight: 700, fontSize: '0.85rem' }}>
            <Icon name="trophy" size={14} /> {title}{floorReached === 5 && isWin ? <Icon name="sparkle" size={13} /> : ''}
          </div>
        )}

        <p style={{ color: '#9CA3AF', fontSize: '0.9rem', margin: '0 0 24px', fontStyle: 'italic' }}>
          {isWin ? 'You have conquered The Final Sanctum and defeated the Eternal Emperor!' : `Your warriors fell on Floor ${floorReached}.`}
        </p>

        {/* Survivors victory dance */}
        {isWin && survivors.length > 0 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            {survivors.map((c, i) => (
              <AnimeCreature key={i} emoji={c.emoji} type={DOMAIN_TO_TYPE[c.ieltsDomain]} size="preview" animState="victory" />
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {statList.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              style={{ background: '#0D0608', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.75rem' }}>
              <div style={{ marginBottom: 4, color: '#9CA3AF', display: 'flex', justifyContent: 'center' }}><Icon name={s.icon} size={18} /></div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.25rem', color: '#F5F0F0' }}>{s.value}</div>
              <div style={{ fontSize: '0.6rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Rewards */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          style={{ background: isWin ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isWin ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '1rem', marginBottom: 20 }}>
          {isWin ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}><Icon name="gift" size={15} /> Rewards</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#F59E0B', fontSize: '0.875rem' }}><Icon name="trophy" size={14} /> Gold Chest</span>
                <span style={{ color: '#A78BFA', fontSize: '0.875rem' }}>+200 XP</span>
              </div>
            </>
          ) : floorReached >= 3 ? (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#C0C0C0', fontSize: '0.875rem' }}><Icon name="gift" size={14} /> Silver Chest</span>
              <span style={{ color: '#A78BFA', fontSize: '0.875rem' }}>+80 XP</span>
            </div>
          ) : floorReached >= 2 ? (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#CD7F32', fontSize: '0.875rem' }}><Icon name="box" size={14} /> Bronze Chest</span>
              <span style={{ color: '#A78BFA', fontSize: '0.875rem' }}>+40 XP</span>
            </div>
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>+15 XP for the attempt</div>
          )}
        </motion.div>

        <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
          {!claimed ? (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleClaim}
              style={{ background: isWin ? `linear-gradient(135deg, #F59E0B, ${AMBER})` : `linear-gradient(135deg, ${CRIMSON}, #7F1D1D)`, border: 'none', borderRadius: 12, padding: '0.9rem', color: isWin ? '#0D0608' : 'white', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', fontFamily: 'Cinzel', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name={isWin ? 'sparkle' : 'skull'} size={16} /> {isWin ? 'Claim Rewards' : 'Accept Defeat'}
            </motion.button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#4ADE80', fontSize: '0.875rem', fontWeight: 600 }}><Icon name="check" size={15} /> Rewards claimed!</div>
          )}
          <button onClick={() => handleNav('/game')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.75rem', color: '#F5F0F0', fontWeight: 600, cursor: 'pointer', fontFamily: 'Cinzel', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <Icon name="attack" size={15} /> {isWin ? 'Return to Hub' : 'Try Again'}
          </button>
          <button onClick={() => handleNav('/dashboard')} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.8rem' }}>Back to Dashboard</button>
        </div>
      </motion.div>
    </div>
  );
}
