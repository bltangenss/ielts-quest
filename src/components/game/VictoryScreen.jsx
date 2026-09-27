import { motion } from 'framer-motion';
import { Icon } from '../Icon';

function Particle({ color, delay }) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{ y: Math.random() * -400 - 100, x: (Math.random() - 0.5) * 600, opacity: 0, scale: 0 }}
      transition={{ duration: 2, delay, ease: 'easeOut' }}
      style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: color, top: '50%', left: '50%', pointerEvents: 'none' }}
    />
  );
}

export function VictoryScreen({ onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.2), rgba(13,6,8,0.95) 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <Particle key={i} color={i % 2 === 0 ? '#F59E0B' : '#DC2626'} delay={i * 0.04} />
      ))}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ textAlign: 'center', zIndex: 1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ marginBottom: 12, color: '#F59E0B', display: 'flex', justifyContent: 'center' }}
        >
          <Icon name="trophy" size={72} />
        </motion.div>
        <h1 style={{
          fontFamily: 'Cinzel, serif', fontSize: '3rem', fontWeight: 900,
          color: '#F59E0B', margin: 0,
          textShadow: '0 0 40px rgba(245,158,11,0.8)',
        }}>
          VICTORY!
        </h1>
        <button onClick={onContinue} style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, #F59E0B, #B45309)',
          border: 'none', borderRadius: 12, padding: '0.875rem 2.5rem',
          color: '#0D0608', fontWeight: 800, cursor: 'pointer', fontSize: '1rem',
          fontFamily: 'Cinzel',
          display: 'inline-flex', alignItems: 'center', gap: 7,
        }}>
          Continue <Icon name="right" size={15} />
        </button>
      </motion.div>
    </motion.div>
  );
}
