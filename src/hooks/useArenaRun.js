import { useState, useCallback } from 'react';
import { getArenaBoss, pickArenaEnemy } from '../data/arenaEnemies';

const RUN_KEY = 'arenaRun';
const HISTORY_KEY = 'arenaHistory';

export const FLOOR_NAMES = {
  1: 'The Crimson Fields',
  2: 'The Haunted Forest',
  3: 'The Frozen Peaks',
  4: 'The Void Realm',
  5: 'The Final Sanctum',
};

export function generateArenaMap(floor) {
  const rows = [
    { count: 2, y: 520 },
    { count: 3, y: 360 },
    { count: 2, y: 200 },
    { count: 1, y: 60 },
  ];

  const pickType = (rowIdx) => {
    if (rowIdx === 3) return 'boss';
    const pools = {
      0: ['battle', 'battle', 'mystery', 'merchant', 'camp'],
      1: ['battle', 'elite', 'mystery', 'camp', 'merchant'],
      2: ['battle', 'elite', 'elite', 'mystery'],
    };
    const pool = pools[rowIdx] || ['battle'];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const nodes = [];
  const grid = [];
  let idx = 0;

  rows.forEach((row, rowIdx) => {
    const rowNodes = [];
    const spacing = 380 / (row.count + 1);
    for (let i = 0; i < row.count; i++) {
      const type = pickType(rowIdx);
      let enemyId = null;
      if (type === 'battle') enemyId = pickArenaEnemy(floor, 'normal')?.id;
      else if (type === 'elite') enemyId = pickArenaEnemy(floor, 'elite')?.id;
      else if (type === 'boss') enemyId = getArenaBoss(floor)?.id;

      const node = {
        id: `af${floor}_n${idx}`,
        type, x: spacing * (i + 1) + 10, y: row.y,
        connections: [], completed: false, enemyId, rowIdx,
      };
      rowNodes.push(node);
      nodes.push(node);
      idx++;
    }
    grid.push(rowNodes);
  });

  for (let r = 0; r < grid.length - 1; r++) {
    const cur = grid[r], next = grid[r + 1];
    cur.forEach((node, i) => {
      if (next.length === 1) {
        node.connections.push(next[0].id);
      } else {
        const ni = Math.round((i / (cur.length - 1 || 1)) * (next.length - 1));
        node.connections.push(next[ni].id);
        if (Math.random() > 0.5 && ni + 1 < next.length) node.connections.push(next[ni + 1].id);
      }
    });
  }

  return nodes;
}

function loadRun() {
  try { const raw = localStorage.getItem(RUN_KEY); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
function saveRun(run) { localStorage.setItem(RUN_KEY, JSON.stringify(run)); }
function clearRun() { localStorage.removeItem(RUN_KEY); }

export function loadArenaHistory() {
  try { const raw = localStorage.getItem(HISTORY_KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
function saveArenaHistory(entry) {
  const h = loadArenaHistory();
  h.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 20)));
}

export function useArenaRun() {
  const [run, setRunState] = useState(() => loadRun());

  const setRun = useCallback((updater) => {
    setRunState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next === null) clearRun(); else saveRun(next);
      return next;
    });
  }, []);

  const startRun = useCallback((teamCards) => {
    const team = teamCards.map(c => ({
      cardId: c.id,
      instanceId: c.instanceId || `${c.id}_${Date.now()}`,
      name: c.name,
      emoji: c.artEmoji || '🃏',
      rarity: c.rarity,
      ieltsDomain: c.ieltsDomain || 'universal',
      artColor: c.artColor || '#7C3AED',
      attack: c.attack,
      defense: c.defense,
      speed: c.speed,
      currentHP: c.hp,
      maxHP: c.hp,
      currentMP: 0,
      maxMP: 5,
      statusEffects: [],
      isAlive: true,
    }));

    const newRun = {
      active: true,
      floor: 1,
      currentNodeId: null,
      team,
      activeCreatureIndex: 0,
      gold: 0,
      relics: [],
      mapNodes: generateArenaMap(1),
      completedNodeIds: [],
      turnCount: 0,
      runStats: { enemiesDefeated: 0, damageDealt: 0, damageTaken: 0, abilitiesUsed: 0, ultimatesUsed: 0 },
      titlesEarned: [],
    };
    setRun(newRun);
    return newRun;
  }, [setRun]);

  const setCurrentNode = useCallback((nodeId) => {
    setRun(prev => prev ? { ...prev, currentNodeId: nodeId } : prev);
  }, [setRun]);

  const completeNode = useCallback((nodeId, { gold = 0, enemyDefeated = false, teamState = null } = {}) => {
    setRun(prev => {
      if (!prev) return prev;
      const goldMult = prev.relics?.some(r => r.includes('soul_gem')) ? 1.5 : 1;
      const nodes = prev.mapNodes.map(n => n.id === nodeId ? { ...n, completed: true } : n);
      return {
        ...prev,
        mapNodes: nodes,
        completedNodeIds: [...prev.completedNodeIds, nodeId],
        currentNodeId: null,
        gold: prev.gold + Math.round(gold * goldMult),
        team: teamState || prev.team,
        runStats: {
          ...prev.runStats,
          enemiesDefeated: prev.runStats.enemiesDefeated + (enemyDefeated ? 1 : 0),
        },
      };
    });
  }, [setRun]);

  const updateTeam = useCallback((team) => {
    setRun(prev => prev ? { ...prev, team } : prev);
  }, [setRun]);

  const updateGold = useCallback((gold) => {
    setRun(prev => prev ? { ...prev, gold: Math.max(0, gold) } : prev);
  }, [setRun]);

  const addRelic = useCallback((relic) => {
    setRun(prev => prev ? { ...prev, relics: [...prev.relics, relic] } : prev);
  }, [setRun]);

  const recordStats = useCallback((patch) => {
    setRun(prev => {
      if (!prev) return prev;
      const s = { ...prev.runStats };
      Object.keys(patch).forEach(k => { s[k] = (s[k] || 0) + patch[k]; });
      return { ...prev, runStats: s };
    });
  }, [setRun]);

  const advanceFloor = useCallback(() => {
    setRun(prev => {
      if (!prev) return prev;
      const nextFloor = prev.floor + 1;
      if (nextFloor > 5) return prev;
      // heal team 20% between floors
      const team = prev.team.map(c => c.isAlive ? { ...c, currentHP: Math.min(c.maxHP, c.currentHP + Math.round(c.maxHP * 0.2)) } : c);
      return {
        ...prev,
        floor: nextFloor,
        mapNodes: generateArenaMap(nextFloor),
        completedNodeIds: [],
        currentNodeId: null,
        team,
      };
    });
  }, [setRun]);

  const endRun = useCallback((result, titlesEarned = []) => {
    const cur = loadRun();
    if (cur) {
      saveArenaHistory({
        date: new Date().toISOString(),
        result,
        floorReached: cur.floor,
        enemiesDefeated: cur.runStats?.enemiesDefeated || 0,
        damageDealt: cur.runStats?.damageDealt || 0,
        teamUsed: cur.team?.map(c => c.cardId) || [],
        titlesEarned,
      });
    }
    setRun(null);
  }, [setRun]);

  const abandonRun = useCallback(() => { endRun('abandoned'); }, [endRun]);

  const getAvailableNodes = useCallback(() => {
    if (!run) return [];
    const { mapNodes, completedNodeIds } = run;
    if (completedNodeIds.length === 0) {
      const maxY = Math.max(...mapNodes.map(n => n.y));
      return mapNodes.filter(n => n.y === maxY);
    }
    const avail = new Set();
    completedNodeIds.forEach(id => {
      const node = mapNodes.find(n => n.id === id);
      node?.connections?.forEach(c => { if (!completedNodeIds.includes(c)) avail.add(c); });
    });
    return mapNodes.filter(n => avail.has(n.id));
  }, [run]);

  return {
    run, setRun, startRun, setCurrentNode, completeNode, updateTeam,
    updateGold, addRelic, recordStats, advanceFloor, endRun, abandonRun, getAvailableNodes,
  };
}
