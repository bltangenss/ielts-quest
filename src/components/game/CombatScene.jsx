import { AnimeCreature } from './AnimeCreature';
import { StatusEffectRow } from './StatusEffect';
import { DOMAIN_TO_TYPE, TYPE_COLORS } from '../../data/arenaAbilities';
import { Icon } from '../Icon';

function Bar({ value, max, color, bg = '#1C0A0A', height = 8 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ background: bg, borderRadius: 4, height, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
    </div>
  );
}

function shieldOf(c) {
  const s = c.statusEffects?.find(e => e.type === 'shield');
  return s ? s.stacks : 0;
}

// Active combatant panel
function Combatant({ creature, type, side, animState, isActive }) {
  const color = TYPE_COLORS[type] || '#F59E0B';
  const shield = shieldOf(creature);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <StatusEffectRow statusEffects={creature.statusEffects} size="sm" />
      <AnimeCreature
        emoji={creature.emoji}
        type={type}
        size={side === 'enemy' ? 'enemyCombat' : 'playerCombat'}
        animState={animState}
        statusEffects={creature.statusEffects}
        facing={side === 'enemy' ? 'left' : 'right'}
        isDead={!creature.isAlive || creature.currentHP <= 0}
      />
      <div style={{ textAlign: 'center', width: side === 'enemy' ? 200 : 180 }}>
        <div style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '0.85rem', color: '#F5F0F0', marginBottom: 4 }}>
          {creature.name}
        </div>
        {/* HP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: '0.6rem', color: '#9CA3AF', width: 18 }}>HP</span>
          <Bar value={creature.currentHP} max={creature.maxHP} color="#DC2626" />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: '#F87171', minWidth: 56, textAlign: 'right' }}>
            {Math.max(0, creature.currentHP)}/{creature.maxHP}
          </span>
        </div>
        {/* Shield indicator */}
        {shield > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.62rem', color: '#7DD3FC', marginBottom: 3 }}><Icon name="defense" size={11} /> {shield} shield</div>
        )}
        {/* MP (player only) */}
        {side === 'player' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.6rem', color: '#9CA3AF', width: 18 }}>MP</span>
            <Bar value={creature.currentMP} max={creature.maxMP} color="#3B82F6" height={6} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: '#60A5FA', minWidth: 56, textAlign: 'right' }}>
              {creature.currentMP}/{creature.maxMP}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Bench row (non-active creatures)
function Bench({ creatures, getType, side, activeIndex, onSwitch, canSwitch }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
      {creatures.map((c, i) => {
        if (i === activeIndex) return null;
        const type = getType(c);
        const color = TYPE_COLORS[type] || '#F59E0B';
        const dead = !c.isAlive || c.currentHP <= 0;
        const clickable = side === 'player' && canSwitch && !dead;
        return (
          <div
            key={c.instanceId || i}
            onClick={() => clickable && onSwitch(i)}
            style={{
              width: 46, height: 58, borderRadius: 8,
              background: '#1C0A0A',
              border: `1px solid ${dead ? '#3A1515' : color + '66'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: clickable ? 'pointer' : 'default',
              opacity: dead ? 0.35 : 1,
              position: 'relative',
            }}
            title={dead ? `${c.name} (fallen)` : c.name}
          >
            <span style={{ color: color, filter: dead ? 'grayscale(100%)' : 'none', display: 'grid', placeItems: 'center' }}><Icon glyph={c.emoji} size={20} /></span>
            <div style={{ width: '80%', marginTop: 2 }}>
              <Bar value={c.currentHP} max={c.maxHP} color="#DC2626" height={3} />
            </div>
            {dead && <span style={{ position: 'absolute', color: '#9CA3AF', display: 'grid', placeItems: 'center' }}><Icon name="skull" size={16} /></span>}
          </div>
        );
      })}
    </div>
  );
}

export function CombatScene({
  playerTeam, playerActiveIndex, playerAnim,
  enemyTeam, enemyActiveIndex, enemyAnim,
  getPlayerType, getEnemyType,
  onSwitch, canSwitch,
}) {
  const activePlayer = playerTeam[playerActiveIndex];
  const activeEnemy = enemyTeam[enemyActiveIndex];
  const playerType = getPlayerType(activePlayer);
  const enemyType = getEnemyType(activeEnemy);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      position: 'relative',
      background: `linear-gradient(90deg, ${TYPE_COLORS[enemyType]}0D 0%, transparent 45%, transparent 55%, ${TYPE_COLORS[playerType]}0D 100%)`,
      borderRadius: 16, padding: '1rem 0.5rem',
      minHeight: 360,
    }}>
      {/* Enemy side (left) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: '0.6rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2 }}>Enemy</div>
        {activeEnemy && (
          <Combatant creature={activeEnemy} type={enemyType} side="enemy" animState={enemyAnim} isActive />
        )}
        <Bench creatures={enemyTeam} getType={getEnemyType} side="enemy" activeIndex={enemyActiveIndex} />
      </div>

      {/* Player side (right) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: '0.6rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2 }}>Your Team</div>
        {activePlayer && (
          <Combatant creature={activePlayer} type={playerType} side="player" animState={playerAnim} isActive />
        )}
        <Bench creatures={playerTeam} getType={getPlayerType} side="player" activeIndex={playerActiveIndex} onSwitch={onSwitch} canSwitch={canSwitch} />
      </div>

      {/* VS divider */}
      <div style={{
        position: 'absolute', left: '50%', top: '40%', transform: 'translateX(-50%)',
        fontFamily: 'Cinzel', fontWeight: 900, fontSize: '1.5rem', color: '#3A1515',
        pointerEvents: 'none',
      }}>
        VS
      </div>
    </div>
  );
}
