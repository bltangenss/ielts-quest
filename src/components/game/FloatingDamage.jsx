import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../Icon';

// numbers: array of { id, value, kind } where kind = 'damage'|'crit'|'heal'|'status'|'shield'
export function FloatingDamage({ numbers = [] }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
      <AnimatePresence>
        {numbers.map(num => {
          const styles = {
            damage: { color: '#F87171', size: '1.5rem', prefix: '' },
            crit: { color: '#FB923C', size: '2.2rem', prefix: '' },
            heal: { color: '#4ADE80', size: '1.5rem', prefix: '+' },
            status: { color: '#C084FC', size: '1.1rem', prefix: '' },
            shield: { color: '#7DD3FC', size: '1.3rem', prefix: '' },
          };
          const s = styles[num.kind] || styles.damage;
          return (
            <motion.div
              key={num.id}
              initial={{ y: 0, opacity: 1, scale: num.kind === 'crit' ? 1.3 : 1 }}
              animate={{ y: -60, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${num.x || 50}%`,
                top: `${num.y || 40}%`,
                transform: 'translateX(-50%)',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 900,
                fontSize: s.size,
                color: s.color,
                textShadow: `0 2px 8px ${s.color}88, 0 0 2px #000`,
                whiteSpace: 'nowrap',
              }}
            >
              {num.kind === 'crit' && <span style={{ fontSize: '0.6em' }}>CRIT! </span>}
              {num.kind === 'shield' && <Icon name="defense" size={14} style={{ marginRight: 3 }} />}
              {s.prefix}{num.value}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
