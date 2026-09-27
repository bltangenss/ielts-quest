import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDungeonRun } from '../../hooks/useDungeonRun';
import { useUser } from '../../hooks/useUser';
import { Icon } from '../../components/Icon';

function Particle({ color, style }) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{
        y: Math.random() * -400 - 100,
        x: (Math.random() - 0.5) * 600,
        opacity: 0, scale: 0,
      }}
      transition={{ duration: 2, ease: 'easeOut', delay: Math.random() * 0.5 }}
      style={{
        position: 'absolute', width: 8, height: 8,
        borderRadius: '50%', background: color,
        top: '50%', left: '50%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

export default function DungeonResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const outcome = searchParams.get('outcome') || 'lose';
  const isWin = outcome === 'win';

  const { run, endRun } = useDungeonRun();
  const { addChest, addXP } = useUser();
  const [claimed, setClaimed] = useState(false);
  const [runSnapshot] = useState(() => run ? { ...run } : null);

  useEffect(() => {
    if (!run && !runSnapshot) navigate('/dungeon');
  }, []);

  const handleClaim = () => {
    if (claimed) return;
    setClaimed(true);

    if (isWin) {
      addChest('silver');
      addXP(150);
    } else if (runSnapshot?.floor >= 2) {
      addChest('bronze');
      addXP(50);
    } else {
      addXP(20);
    }

    endRun(isWin ? 'win' : 'lose');
  };

  const handleNavigate = (path) => {
    if (!claimed) handleClaim();
    navigate(path);
  };

  const stats = [
    { label: 'Floor Reached', value: runSnapshot?.floor || 1, icon: 'castle' },
    { label: 'Enemies Defeated', value: runSnapshot?.enemiesDefeated || 0, icon: 'attack' },
    { label: 'Gold Collected', value: runSnapshot?.gold || 0, icon: 'gold' },
    { label: 'IELTS Questions Correct', value: runSnapshot?.questionsCorrect || 0, icon: 'check' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: isWin
        ? 'radial-gradient(ellipse at center, rgba(245,158,11,0.12) 0%, #0D1117 70%)'
        : 'radial-gradient(ellipse at center, rgba(248,81,73,0.12) 0%, #0D1117 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Particles for win */}
      {isWin && Array.from({ length: 30 }).map((_, i) => (
        <Particle key={i} color={i % 2 === 0 ? '#F59E0B' : '#7C3AED'} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: '#161B22',
          border: `2px solid ${isWin ? 'rgba(245,158,11,0.4)' : 'rgba(248,81,73,0.4)'}`,
          boxShadow: `0 0 60px ${isWin ? 'rgba(245,158,11,0.2)' : 'rgba(248,81,73,0.15)'}`,
          borderRadius: 20, padding: '2.5rem',
          maxWidth: 480, width: '100%', textAlign: 'center',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Icon */}
        <motion.div
          animate={isWin ? { rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] } : { scale: [1, 0.95, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginBottom: 16, color: isWin ? '#F59E0B' : '#F85149', display: 'flex', justifyContent: 'center' }}
        >
          <Icon name={isWin ? 'sparkle' : 'skull'} size={72} />
        </motion.div>

        <h1 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '2rem', fontWeight: 900,
          color: isWin ? '#F59E0B' : '#F85149',
          margin: '0 0 8px',
          textShadow: `0 0 30px ${isWin ? 'rgba(245,158,11,0.6)' : 'rgba(248,81,73,0.6)'}`,
        }}>
          {isWin ? 'Dungeon Conquered!' : 'Your Journey Ends Here'}
        </h1>

        <p style={{ color: '#8B949E', fontSize: '0.9rem', margin: '0 0 24px', fontStyle: 'italic' }}>
          {isWin
            ? 'You have conquered all three floors. The dungeon bows before you.'
            : `You fell on Floor ${runSnapshot?.floor || 1}. The dungeon claims another soul.`
          }
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              style={{
                background: '#0D1117',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '0.75rem',
              }}
            >
              <div style={{ marginBottom: 4, color: '#8B949E', display: 'flex', justifyContent: 'center' }}><Icon name={s.icon} size={18} /></div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '1.25rem', color: '#E6EDF3' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.6rem', color: '#8B949E', textTransform: 'uppercase', letterSpacing: 1 }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reward */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            background: isWin ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isWin ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12, padding: '1rem', marginBottom: 20,
          }}
        >
          {isWin ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>
                <Icon name="gift" size={15} /> Rewards
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#C0C0C0', fontSize: '0.875rem' }}><Icon name="gift" size={14} /> Silver Chest</span>
                <span style={{ color: '#A78BFA', fontSize: '0.875rem' }}>+150 XP</span>
              </div>
            </>
          ) : runSnapshot?.floor >= 2 ? (
            <>
              <div style={{ fontWeight: 700, color: '#CD7F32', marginBottom: 4 }}>
                Consolation Reward
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#CD7F32', fontSize: '0.875rem' }}><Icon name="box" size={14} /> Bronze Chest</span>
                <span style={{ color: '#A78BFA', fontSize: '0.875rem' }}>+50 XP</span>
              </div>
            </>
          ) : (
            <div style={{ color: '#8B949E', fontSize: '0.875rem' }}>
              +20 XP for the attempt
            </div>
          )}
        </motion.div>

        {/* Cards used */}
        {runSnapshot?.selectedCards && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.65rem', color: '#4B5563', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
              Cards Used
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {runSnapshot.selectedCards.map((card, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 4, padding: '2px 8px',
                  fontSize: '0.65rem', color: '#8B949E',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Icon glyph={card.artEmoji} name={card.artEmoji ? undefined : 'sparkle'} size={12} />
                  <span>{card.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
          {!claimed ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClaim}
              style={{
                background: isWin
                  ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                  : 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                border: 'none', borderRadius: 12, padding: '0.9rem',
                color: isWin ? '#0D1117' : 'white',
                fontWeight: 800, cursor: 'pointer', fontSize: '1rem',
                fontFamily: 'Cinzel',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Icon name={isWin ? 'sparkle' : 'skull'} size={16} /> {isWin ? 'Claim Rewards' : 'Accept Defeat'}
            </motion.button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#3FB950', fontSize: '0.875rem', fontWeight: 600 }}>
              <Icon name="check" size={15} /> Rewards claimed!
            </div>
          )}

          <button
            onClick={() => handleNavigate('/dungeon')}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '0.75rem',
              color: '#E6EDF3', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Cinzel',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            <Icon name={isWin ? 'castle' : 'attack'} size={15} /> {isWin ? 'Return to Dungeon' : 'Try Again'}
          </button>

          <button
            onClick={() => handleNavigate('/dashboard')}
            style={{
              background: 'none', border: 'none',
              color: '#8B949E', cursor: 'pointer', fontSize: '0.8rem',
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
