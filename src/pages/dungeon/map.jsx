import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NodeMap } from '../../components/dungeon/NodeMap';
import { RunStats } from '../../components/dungeon/RunStats';
import { useDungeonRun } from '../../hooks/useDungeonRun';
import { Icon } from '../../components/Icon';

const NODE_LABELS = {
  battle: 'Battle',
  elite: 'Elite Enemy',
  boss: 'Boss',
  event: 'Event',
  rest: 'Rest Site',
  shop: 'Shop',
};

const NODE_ROUTES = {
  battle: '/dungeon/battle',
  elite: '/dungeon/battle',
  boss: '/dungeon/battle',
  event: '/dungeon/event',
  rest: '/dungeon/rest',
  shop: '/dungeon/shop',
};

export default function DungeonMap() {
  const navigate = useNavigate();
  const { run, setCurrentNode, getAvailableNodes } = useDungeonRun();

  if (!run?.active) {
    navigate('/dungeon');
    return null;
  }

  const availableNodes = getAvailableNodes();
  const availableNodeIds = availableNodes.map(n => n.id);

  const handleNodeClick = (node) => {
    setCurrentNode(node.id);
    const route = NODE_ROUTES[node.type] || '/dungeon/battle';
    navigate(route);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#0D1117' }}>
      <RunStats run={run} />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontFamily: 'Cinzel', fontSize: '1.5rem', fontWeight: 700, color: '#E6EDF3', margin: 0 }}>
            Floor {run.floor} Map
          </h1>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3].map(f => (
              <div key={f} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: f === run.floor ? 'rgba(124,58,237,0.3)' : f < run.floor ? 'rgba(63,185,80,0.2)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${f === run.floor ? '#7C3AED' : f < run.floor ? '#3FB950' : '#2D3748'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', color: f === run.floor ? '#A78BFA' : f < run.floor ? '#3FB950' : '#4B5563',
                fontFamily: 'JetBrains Mono', fontWeight: 700,
              }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Available nodes reminder */}
        {availableNodes.length > 0 && (
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: 8, padding: '0.5rem 0.875rem', marginBottom: 16,
              fontSize: '0.75rem', color: '#A78BFA', textAlign: 'center',
            }}
          >
            <Icon name="sparkle" size={13} /> {availableNodes.length} path{availableNodes.length > 1 ? 's' : ''} available — choose your next node
          </motion.div>
        )}

        {/* Map SVG */}
        <div style={{
          background: 'rgba(22,27,34,0.8)',
          border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 16,
          padding: '1rem',
          overflowX: 'auto',
        }}>
          <NodeMap
            nodes={run.mapNodes}
            availableNodeIds={availableNodeIds}
            completedNodeIds={run.completedNodeIds}
            currentNodeId={run.currentNodeId}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
          {[
            { icon: 'attack', label: 'Battle', color: '#3B82F6' },
            { icon: 'skull', label: 'Elite', color: '#EF4444' },
            { icon: 'crown', label: 'Boss', color: '#F59E0B' },
            { icon: 'question', label: 'Event', color: '#A78BFA' },
            { icon: 'fire', label: 'Rest', color: '#3FB950' },
            { icon: 'cart', label: 'Shop', color: '#F97316' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem' }}>
              <span style={{ color: item.color, display: 'grid', placeItems: 'center' }}><Icon name={item.icon} size={13} /></span>
              <span style={{ color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Run log snippet */}
        {run.runLog && run.runLog.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: '0.65rem', color: '#4B5563', marginBottom: 6, fontFamily: 'JetBrains Mono' }}>
              RECENT LOG
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono', color: '#8B949E' }}>
              {run.runLog.slice(-3).map((entry, i) => (
                <div key={i}>{entry}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
