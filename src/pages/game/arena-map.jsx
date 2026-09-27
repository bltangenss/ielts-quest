import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArenaNodeMap } from '../../components/game/ArenaNodeMap';
import { useArenaRun, FLOOR_NAMES } from '../../hooks/useArenaRun';
import { Icon } from '../../components/Icon';

const CRIMSON = '#DC2626';

const NODE_ROUTES = {
  battle: '/game/combat', elite: '/game/combat', boss: '/game/combat',
  mystery: '/game/arena-map', camp: '/game/arena-map', merchant: '/game/arena-map',
};

export default function ArenaMap() {
  const navigate = useNavigate();
  const { run, setCurrentNode, getAvailableNodes, completeNode, updateTeam, updateGold, addRelic } = useArenaRun();

  if (!run?.active) { navigate('/game'); return null; }

  const availableNodes = getAvailableNodes();
  const availableNodeIds = availableNodes.map(n => n.id);

  // Inline handling for non-combat nodes (mystery/camp/merchant) via simple prompts
  const handleNodeClick = (node) => {
    setCurrentNode(node.id);
    if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
      navigate('/game/combat');
    } else if (node.type === 'camp') {
      // Heal team 30%
      const team = run.team.map(c => c.isAlive ? { ...c, currentHP: Math.min(c.maxHP, c.currentHP + Math.round(c.maxHP * 0.3)), statusEffects: [] } : c);
      updateTeam(team);
      completeNode(node.id, {});
      navigate('/game/arena-map');
    } else if (node.type === 'merchant') {
      navigate('/game/merchant');
    } else if (node.type === 'mystery') {
      navigate('/game/mystery');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D0608' }}>
      {/* Status bar */}
      <div style={{ background: 'rgba(13,6,8,0.95)', borderBottom: `1px solid ${CRIMSON}33`, padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: CRIMSON, fontFamily: 'Cinzel', fontWeight: 700 }}><Icon name="attack" size={14} /> Floor {run.floor}/5</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#F59E0B', fontFamily: 'JetBrains Mono', fontWeight: 700 }}><Icon name="gold" size={14} /> {run.gold}</span>
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          {run.team.map((c, i) => {
            const dead = !c.isAlive || c.currentHP <= 0;
            return <span key={i} style={{ display: 'grid', placeItems: 'center', color: '#F5F0F0', opacity: dead ? 0.3 : 1, filter: dead ? 'grayscale(100%)' : 'none' }} title={`${c.name}: ${c.currentHP}/${c.maxHP}`}><Icon glyph={c.emoji} size={16} /></span>;
          })}
        </div>
        {run.relics?.length > 0 && (
          <div style={{ display: 'flex', gap: 4 }}>
            {run.relics.map((r, i) => <span key={i} style={{ display: 'grid', placeItems: 'center', color: '#F59E0B' }} title={r}><Icon glyph={r.split('|')[0]} size={15} /></span>)}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'Cinzel', fontSize: '1.4rem', fontWeight: 700, color: '#F5F0F0', margin: 0 }}>
            Floor {run.floor} — {FLOOR_NAMES[run.floor]}
          </h1>
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 8 }}>
            {[1, 2, 3, 4, 5].map(f => (
              <div key={f} style={{
                width: 24, height: 24, borderRadius: '50%',
                background: f === run.floor ? `${CRIMSON}33` : f < run.floor ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${f === run.floor ? CRIMSON : f < run.floor ? '#22C55E' : '#3A1515'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', color: f === run.floor ? CRIMSON : f < run.floor ? '#22C55E' : '#6B7280',
                fontFamily: 'JetBrains Mono', fontWeight: 700,
              }}>{f}</div>
            ))}
          </div>
        </div>

        {availableNodes.length > 0 && (
          <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: `${CRIMSON}11`, border: `1px solid ${CRIMSON}33`, borderRadius: 8, padding: '0.5rem', marginBottom: 16, fontSize: '0.75rem', color: '#F87171', textAlign: 'center' }}>
            <Icon name="attack" size={13} /> {availableNodes.length} path{availableNodes.length > 1 ? 's' : ''} await
          </motion.div>
        )}

        <div style={{ background: 'rgba(28,10,10,0.6)', border: `1px solid ${CRIMSON}22`, borderRadius: 16, padding: '1rem', overflowX: 'auto' }}>
          <ArenaNodeMap nodes={run.mapNodes} availableNodeIds={availableNodeIds} completedNodeIds={run.completedNodeIds} currentNodeId={run.currentNodeId} onNodeClick={handleNodeClick} />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
          {[['attack', 'Battle', CRIMSON], ['skull', 'Elite', '#B91C1C'], ['crown', 'Boss', '#F59E0B'], ['orb', 'Mystery', '#A78BFA'], ['camp', 'Camp', '#16A34A'], ['cart', 'Merchant', AMBER_COLOR()]].map(([icon, label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem' }}>
              <span style={{ color, display: 'grid', placeItems: 'center' }}><Icon name={icon} size={13} /></span><span style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AMBER_COLOR() { return '#B45309'; }
