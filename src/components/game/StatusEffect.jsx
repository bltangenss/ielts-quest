import { STATUS_INFO } from '../../data/arenaAbilities';

export function StatusEffect({ type, stacks, turnsRemaining, size = 'sm' }) {
  const info = STATUS_INFO[type];
  if (!info) return null;
  const dim = size === 'sm' ? { box: 22, font: '0.7rem', badge: '0.5rem' } : { box: 30, font: '0.95rem', badge: '0.6rem' };

  return (
    <div
      title={`${info.name} ×${stacks} — ${turnsRemaining ?? ''} turns — ${info.desc}`}
      style={{
        position: 'relative',
        width: dim.box, height: dim.box,
        borderRadius: 6,
        background: `${info.color}22`,
        border: `1px solid ${info.color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: dim.font,
        boxShadow: `0 0 6px ${info.color}66`,
      }}
    >
      {info.icon}
      {stacks > 1 && (
        <span style={{
          position: 'absolute', bottom: -4, right: -4,
          background: info.color, color: '#0D0608',
          borderRadius: '50%', minWidth: 14, height: 14,
          fontSize: dim.badge, fontWeight: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'JetBrains Mono', padding: '0 2px',
        }}>
          {stacks}
        </span>
      )}
    </div>
  );
}

export function StatusEffectRow({ statusEffects = [], size = 'sm' }) {
  if (!statusEffects || statusEffects.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
      {statusEffects.map((se, i) => (
        <StatusEffect key={i} type={se.type} stacks={se.stacks} turnsRemaining={se.turnsRemaining} size={size} />
      ))}
    </div>
  );
}
