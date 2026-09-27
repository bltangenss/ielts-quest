import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CHEST_INFO } from '../utils/cardDrop';
import { Icon } from './Icon';

export function ResultsScreen({ correct, total, xpEarned, isPerfect, moduleKey, onContinue }) {
  const acc = Math.round((correct / total) * 100);
  const chestEarned = 'bronze'; // always earn a bronze chest for completing a level

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        maxWidth: 500, margin: '0 auto',
        background: '#FFFFFF',
        border: `1px solid ${isPerfect ? '#F59E0B44' : 'rgba(34,26,91,0.06)'}`,
        borderRadius: 16,
        padding: '2.5rem',
        textAlign: 'center',
      }}
    >
      {/* Score circle */}
      <div style={{
        width: 120, height: 120, borderRadius: '50%',
        background: acc >= 80 ? 'rgba(63,185,80,0.15)' : acc >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(248,81,73,0.15)',
        border: `3px solid ${acc >= 80 ? '#3FB950' : acc >= 60 ? '#F59E0B' : '#F85149'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '2rem', color: acc >= 80 ? '#3FB950' : acc >= 60 ? '#F59E0B' : '#F85149' }}>
          {correct}/{total}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#6A6F9C' }}>correct</div>
      </div>

      <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: '1.25rem', color: '#221A5B', margin: '0 0 8px' }}>
        {isPerfect ? <><Icon name="sparkle" size={18} color="#F59E0B" /> Perfect Score! <Icon name="sparkle" size={18} color="#F59E0B" /></> : acc >= 80 ? 'Great Job!' : acc >= 60 ? 'Keep Practicing!' : 'Try Again!'}
      </h2>

      <p style={{ color: '#6A6F9C', fontSize: '0.875rem', marginBottom: 24 }}>
        {acc}% accuracy — {acc >= 60 ? 'Level Complete!' : 'Needs improvement'}
      </p>

      {/* XP earned */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{
          background: 'rgba(109,94,246,0.1)', border: '1px solid rgba(109,94,246,0.3)',
          borderRadius: 8, padding: '0.5rem 1rem',
        }}>
          <span style={{ color: '#A78BFA', fontWeight: 700 }}>+{xpEarned} XP</span>
        </div>
        {isPerfect && (
          <div style={{
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 8, padding: '0.5rem 1rem',
          }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>+50 Bonus XP (Perfect!)</span>
          </div>
        )}
      </div>

      {/* Chest earned */}
      {acc >= 60 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(205,127,50,0.1)',
            border: '1px solid rgba(205,127,50,0.3)',
            borderRadius: 12, padding: '1rem',
            marginBottom: 24,
          }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ marginBottom: 6, color: '#CD7F32', display: 'flex', justifyContent: 'center' }}
          >
            <Icon name="box" size={36} />
          </motion.div>
          <div style={{ color: '#CD7F32', fontWeight: 700, marginBottom: 2 }}>Bronze Chest Earned!</div>
          <div style={{ color: '#6A6F9C', fontSize: '0.75rem' }}>Added to your chest inventory</div>
        </motion.div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
        {acc >= 60 && (
          <Link to="/chest" state={{ chestType: 'bronze' }} style={{
            background: 'linear-gradient(135deg, #CD7F32, #B8651F)',
            border: 'none', borderRadius: 10, padding: '0.75rem',
            color: 'white', fontWeight: 700, cursor: 'pointer',
            fontSize: '0.9rem', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            <Icon name="box" size={16} /> Open Chest Now
          </Link>
        )}
        <button onClick={onContinue} style={{
          background: 'linear-gradient(135deg, #6D5EF6, #5B21B6)',
          border: 'none', borderRadius: 10, padding: '0.75rem',
          color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          {acc >= 60 ? <><Icon name="play" size={14} /> Next Level</> : <><Icon name="refresh" size={14} /> Try Again</>}
        </button>
        <Link to={`/learn`} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(34,26,91,0.08)',
          borderRadius: 10, padding: '0.75rem',
          color: '#6A6F9C', textDecoration: 'none',
          fontWeight: 600, fontSize: '0.875rem',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <Icon name="left" size={14} /> Back to Modules
        </Link>
      </div>
    </motion.div>
  );
}
