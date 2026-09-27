import { Icon } from '../Icon';

const NODE_ICONS = {
  battle: 'attack', elite: 'skull', boss: 'crown', mystery: 'orb', camp: 'camp', merchant: 'cart',
};
const NODE_COLORS = {
  battle: '#DC2626', elite: '#B91C1C', boss: '#F59E0B', mystery: '#A78BFA', camp: '#16A34A', merchant: '#B45309',
};

export function ArenaNodeMap({ nodes, availableNodeIds, completedNodeIds, currentNodeId, onNodeClick }) {
  if (!nodes || nodes.length === 0) return null;

  const lines = [];
  nodes.forEach(node => {
    node.connections?.forEach(connId => {
      const target = nodes.find(n => n.id === connId);
      if (!target) return;
      const done = completedNodeIds.includes(node.id) && completedNodeIds.includes(connId);
      const avail = completedNodeIds.includes(node.id) && availableNodeIds.includes(connId);
      lines.push({ id: `${node.id}-${connId}`, x1: node.x + 20, y1: node.y + 20, x2: target.x + 20, y2: target.y + 20, done, avail });
    });
  });

  return (
    <svg viewBox="0 0 420 600" style={{ width: '100%', maxWidth: 420, height: 'auto' }}>
      <defs>
        <radialGradient id="arenaFog" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="420" height="600" fill="url(#arenaFog)" />

      {lines.map(line => (
        <line key={line.id}
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke={line.done ? '#DC2626' : line.avail ? '#F87171' : '#3A1515'}
          strokeWidth={line.done ? 3 : 2}
          strokeDasharray={(!line.done && !line.avail) ? '6,4' : 'none'}
          opacity={(!line.done && !line.avail) ? 0.4 : 1}
        />
      ))}

      {nodes.map(node => {
        const isCompleted = completedNodeIds.includes(node.id);
        const isAvailable = availableNodeIds.includes(node.id);
        const isCurrent = currentNodeId === node.id;
        const color = NODE_COLORS[node.type] || '#DC2626';
        const clickable = isAvailable;

        return (
          <g key={node.id}>
            {isAvailable && (
              <circle cx={node.x + 20} cy={node.y + 20} r={28} fill="none" stroke={color} strokeWidth={2} opacity={0.4}
                style={{ animation: 'arenaNodePulse 1.5s ease-in-out infinite' }} />
            )}
            {isCurrent && (
              <circle cx={node.x + 20} cy={node.y + 20} r={24} fill="none" stroke="#F59E0B" strokeWidth={3} opacity={0.8} />
            )}
            <circle cx={node.x + 20} cy={node.y + 20} r={20}
              fill={isCompleted ? '#1C0A0A' : isAvailable ? '#1C0A0A' : '#0D0608'}
              stroke={isCompleted ? '#4B5563' : isAvailable ? color : '#3A1515'}
              strokeWidth={isAvailable ? 2 : 1}
              opacity={(!isCompleted && !isAvailable) ? 0.4 : 1}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
              onClick={() => clickable && onNodeClick(node)} />
            <foreignObject x={node.x + 8} y={node.y + 8} width={24} height={24}
              opacity={(!isCompleted && !isAvailable) ? 0.35 : isCompleted ? 0.5 : 1}
              style={{ pointerEvents: 'none' }}>
              <div style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', color: isCompleted ? '#9CA3AF' : color }}>
                <Icon name={isCompleted ? 'check' : (NODE_ICONS[node.type] || 'attack')} size={18} />
              </div>
            </foreignObject>
          </g>
        );
      })}

      <style>{`
        @keyframes arenaNodePulse {
          0%, 100% { r: 26; opacity: 0.3; }
          50% { r: 30; opacity: 0.6; }
        }
      `}</style>
    </svg>
  );
}
