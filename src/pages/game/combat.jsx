import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopDownArena } from '../../components/game/TopDownArena';
import { VictoryScreen } from '../../components/game/VictoryScreen';
import { DefeatScreen } from '../../components/game/DefeatScreen';
import { useArenaRun, FLOOR_NAMES } from '../../hooks/useArenaRun';
import { getArenaEnemyById } from '../../data/arenaEnemies';
import { DOMAIN_TO_TYPE } from '../../data/arenaAbilities';
import { Icon } from '../../components/Icon';

const CRIMSON = '#DC2626';

export default function Combat() {
  const navigate = useNavigate();
  const { run, completeNode, advanceFloor, endRun, recordStats } = useArenaRun();
  const [phase, setPhase] = useState('battle'); // battle | victory | defeat
  const [finalStats, setFinalStats] = useState(null);

  const node = run?.mapNodes?.find(n => n.id === run.currentNodeId);
  const enemy = node?.enemyId ? getArenaEnemyById(node.enemyId) : null;

  // Build player combatants from team (alive only) — each becomes a "life"
  const playerCreatures = useMemo(() => {
    if (!run) return [];
    return run.team
      .filter(c => c.isAlive && c.currentHP > 0)
      .sort((a, b) => (b.attack + b.maxHP) - (a.attack + a.maxHP)) // strongest leads
      .map(c => ({
        name: c.name, emoji: c.emoji, type: DOMAIN_TO_TYPE[c.ieltsDomain] || 'Void',
        hp: c.currentHP, maxHP: c.maxHP, currentHP: c.currentHP,
        attack: c.attack, defense: c.defense, speed: c.speed,
      }));
  }, [run]);

  const enemyCreatures = useMemo(() => {
    if (!enemy) return [];
    return enemy.creatures.map(c => ({
      name: c.name, emoji: c.emoji, type: c.type,
      hp: c.hp, maxHP: c.hp, currentHP: c.hp,
      attack: c.attack, defense: c.defense, speed: c.speed,
    }));
  }, [enemy]);

  if (!run?.active || !enemy) { navigate('/game/arena-map'); return null; }

  const handleVictory = (stats) => {
    setFinalStats(stats);
    if (stats) recordStats({ damageDealt: stats.damageDealt || 0, enemiesDefeated: stats.enemiesDefeated || 0, abilitiesUsed: stats.abilitiesUsed || 0, damageTaken: stats.damageTaken || 0 });
    setPhase('victory');
  };
  const handleDefeat = (stats) => {
    setFinalStats(stats);
    if (stats) recordStats({ damageDealt: stats.damageDealt || 0, enemiesDefeated: stats.enemiesDefeated || 0 });
    setPhase('defeat');
  };

  const confirmVictory = () => {
    const gold = enemy.goldReward.min + Math.floor(Math.random() * (enemy.goldReward.max - enemy.goldReward.min + 1));
    // Surviving team keeps approximate HP: simplistic — keep current values, refill MP elsewhere
    completeNode(run.currentNodeId, { gold, enemyDefeated: true });
    if (node?.type === 'boss' && run.floor === 5) {
      navigate('/game/arena-result?outcome=win');
    } else if (node?.type === 'boss') {
      advanceFloor();
      navigate('/game/arena-map');
    } else {
      navigate('/game/arena-map');
    }
  };
  const confirmDefeat = () => {
    endRun('lose');
    navigate('/game/arena-result?outcome=lose');
  };

  const isBoss = node?.type === 'boss';
  const isElite = node?.type === 'elite';

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D0608' }}>
      {phase === 'victory' && <VictoryScreen onContinue={confirmVictory} />}
      {phase === 'defeat' && <DefeatScreen onContinue={confirmDefeat} floorReached={run.floor} />}

      {/* Top status bar */}
      <div style={{ background: 'rgba(13,6,8,0.95)', borderBottom: `1px solid ${CRIMSON}33`, padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: CRIMSON, fontFamily: 'Cinzel', fontWeight: 700 }}><Icon name="attack" size={14} /> Floor {run.floor} — {FLOOR_NAMES[run.floor]}</span>
        <span style={{
          padding: '2px 10px', borderRadius: 100, fontWeight: 700, fontSize: '0.7rem',
          background: isBoss ? 'rgba(245,158,11,0.15)' : isElite ? 'rgba(185,28,28,0.15)' : 'rgba(220,38,38,0.12)',
          color: isBoss ? '#F59E0B' : isElite ? '#F87171' : '#F87171',
          border: `1px solid ${isBoss ? '#F59E0B55' : '#DC262655'}`,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          {isBoss ? <><Icon name="crown" size={12} /> BOSS</> : isElite ? <><Icon name="skull" size={12} /> ELITE</> : <><Icon name="attack" size={12} /> BATTLE</>}
        </span>
        <span style={{ color: '#9CA3AF', marginLeft: 'auto' }}>{enemy.name}</span>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '1rem' }}>
        {/* Enemy lore banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ color: CRIMSON, display: 'flex', justifyContent: 'center' }}><Icon glyph={enemy.emoji} size={30} /></div>
          <div style={{ fontStyle: 'italic', color: '#9CA3AF', fontSize: '0.8rem' }}>"{enemy.lore}"</div>
        </motion.div>

        {/* The top-down dungeon shooter */}
        <TopDownArena
          key={run.currentNodeId}
          playerTeam={playerCreatures}
          enemyCreatures={enemyCreatures}
          tier={node?.type || 'normal'}
          floor={run.floor}
          onVictory={handleVictory}
          onDefeat={handleDefeat}
        />

        <div style={{ textAlign: 'center', marginTop: 14, color: '#6B7280', fontSize: '0.72rem' }}>
          You control the hero. When a card falls, the next one from your squad steps in (lives = your cards).
        </div>
      </div>
    </div>
  );
}
