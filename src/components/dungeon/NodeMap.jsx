import { motion } from 'framer-motion';
import { Icon } from '../Icon';

const NODE_ICONS = {
  battle: 'attack',
  elite: 'skull',
  boss: 'crown',
  event: 'question',
  rest: 'fire',
  shop: 'cart',
};

const NODE_COLORS = {
  battle: '#3B82F6',
  elite: '#EF4444',
  boss: '#F59E0B',
  event: '#A78BFA',
  rest: '#3FB950',
  shop: '#F97316',
};

export function NodeMap({ nodes, availableNodeIds, completedNodeIds, currentNodeId, onNodeClick }) {
  if (!nodes || nodes.length === 0) return null;

  // Build connection lines
  const lines = [];
  nodes.forEach(node => {
    node.connections?.forEach(connId => {
      const target = nodes.find(n => n.id === connId);
      if (!target) return;
      const isCompleted = completedNodeIds.includes(node.id) && completedNodeIds.includes(connId);
      const isAvailable = completedNodeIds.includes(node.id) && availableNodeIds.includes(connId);
      lines.push({
        id: `${node.id}-${connId}`,
        x1: node.x + 20, y1: node.y + 20,
        x2: target.x + 20, y2: target.y + 20,
        isCompleted, isAvailable,
      });
    });
  });

  return (
    <svg
      viewBox="0 0 420 600"
      style={{ width: '100%', maxWidth: 420, height: 'auto' }}
    >
      {/* Connection lines */}
      {lines.map(line => (
        <line
          key={line.id}
          x1={line.x1} y1={line.y1}
          x2={line.x2} y2={line.y2}
          stroke={line.isCompleted ? '#7C3AED' : line.isAvailable ? '#A78BFA' : '#2D3748'}
          strokeWidth={line.isCompleted ? 3 : 2}
          strokeDasharray={(!line.isCompleted && !line.isAvailable) ? '6,4' : 'none'}
          opacity={(!line.isCompleted && !line.isAvailable) ? 0.4 : 1}
        />
      ))}

      {/* Nodes */}
      {nodes.map(node => {
        const isCompleted = completedNodeIds.includes(node.id);
        const isAvailable = availableNodeIds.includes(node.id);
        const isCurrent = currentNodeId === node.id;
        const color = NODE_COLORS[node.type] || '#7C3AED';
        const isClickable = isAvailable;

        return (
          <g key={node.id}>
            {/* Pulse ring for available nodes */}
            {isAvailable && (
              <circle
                cx={node.x + 20} cy={node.y + 20} r={28}
                fill="none"
                stroke={color}
                strokeWidth={2}
                opacity={0.4}
                style={{ animation: 'dungeonNodePulse 1.5s ease-in-out infinite' }}
              />
            )}

            {/* Current node ring */}
            {isCurrent && (
              <circle
                cx={node.x + 20} cy={node.y + 20} r={24}
                fill="none"
                stroke="#7C3AED"
                strokeWidth={3}
                opacity={0.8}
              />
            )}

            {/* Node background circle */}
            <circle
              cx={node.x + 20} cy={node.y + 20} r={20}
              fill={isCompleted ? '#1A1A2E' : isAvailable ? '#161B22' : '#0D1117'}
              stroke={isCompleted ? '#4B5563' : isAvailable ? color : '#2D3748'}
              strokeWidth={isAvailable ? 2 : 1}
              opacity={(!isCompleted && !isAvailable) ? 0.4 : 1}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
              onClick={() => isClickable && onNodeClick(node)}
            />

            {/* Node icon */}
            <foreignObject
              x={node.x + 8} y={node.y + 8} width={24} height={24}
              opacity={(!isCompleted && !isAvailable) ? 0.35 : isCompleted ? 0.5 : 1}
              style={{ pointerEvents: 'none' }}
            >
              <div style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', color: isCompleted ? '#9CA3AF' : color }}>
                <Icon name={isCompleted ? 'check' : (NODE_ICONS[node.type] || 'attack')} size={18} />
              </div>
            </foreignObject>
          </g>
        );
      })}

      <style>{`
        @keyframes dungeonNodePulse {
          0%, 100% { r: 26; opacity: 0.3; }
          50% { r: 30; opacity: 0.6; }
        }
      `}</style>
    </svg>
  );
}
