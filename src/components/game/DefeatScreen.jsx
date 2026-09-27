import { motion } from 'framer-motion';
import { Icon } from '../Icon';

function Ember({ delay, left }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 600, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute', left: `${left}%`, top: 0,
        width: 4, height: 4, borderRadius: '50%',
        background: '#DC2626', boxShadow: '0 0 6px #DC2626',
        pointerEvents: 'none',
      }}
    />
  );
}

export function DefeatScreen({ onContinue, floorReached }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'radial-gradient(ellipse at center, rgba(127,29,29,0.3), #0D0608 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <Ember key={i} delay={Math.random() * 3} left={Math.random() * 100} />
      ))}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', zIndex: 1 }}
      >
        <motion.div
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ marginBottom: 12, color: '#DC2626', display: 'flex', justifyContent: 'center' }}
        >
          <Icon name="skull" size={64} />
        </motion.div>
        <h1 style={{
          fontFamily: 'Cinzel, serif', fontSize: '2.75rem', fontWeight: 900,
          color: '#DC2626', margin: 0,
          textShadow: '0 0 30px rgba(220,38,38,0.7)',
        }}>
          DEFEATED
        </h1>
        <p style={{ color: '#9CA3AF', marginTop: 12, fontStyle: 'italic' }}>
          You fell on Floor {floorReached}.
        </p>
        <button onClick={onContinue} style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, #DC2626, #7F1D1D)',
          border: 'none', borderRadius: 12, padding: '0.875rem 2.5rem',
          color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '1rem',
          fontFamily: 'Cinzel',
        }}>
          See Results
        </button>
      </motion.div>
    </motion.div>
  );
}
