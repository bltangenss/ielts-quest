import { useState, useCallback } from 'react';
import { getBossForFloor, pickRandomEnemy } from '../data/enemies';

const RUN_KEY = 'dungeonRun';
const HISTORY_KEY = 'dungeonHistory';

export function generateMapNodes(floor) {
  // 4 rows: [2, 3, 2, 1] nodes
  const nodeTypes = {
    row0: ['battle', 'battle', 'event', 'shop', 'rest'],
    row1: ['battle', 'battle', 'elite', 'event', 'rest', 'shop'],
    row2: ['battle', 'battle', 'elite', 'elite', 'event'],
    row3: ['boss'],
  };

  function pickType(row) {
    const pool = nodeTypes[`row${row}`];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const nodes = [];
  const rows = [
    { count: 2, y: 520 },
    { count: 3, y: 360 },
    { count: 2, y: 200 },
    { count: 1, y: 60 },
  ];

  const nodeGrid = [];
  let nodeIndex = 0;

  rows.forEach((row, rowIdx) => {
    const rowNodes = [];
    const spacing = 380 / (row.count + 1);
    for (let i = 0; i < row.count; i++) {
      const type = rowIdx === 3 ? 'boss' : pickType(rowIdx);
      let enemyId = null;
      if (type === 'battle') {
        const enemy = pickRandomEnemy(floor, 'normal');
        enemyId = enemy?.id;
      } else if (type === 'elite') {
        const enemy = pickRandomEnemy(floor, 'elite');
        enemyId = enemy?.id;
      } else if (type === 'boss') {
        const boss = getBossForFloor(floor);
        enemyId = boss?.id;
      }

      const node = {
        id: `f${floor}_n${nodeIndex}`,
        type,
        x: spacing * (i + 1) + 10,
        y: row.y,
        connections: [],
        completed: false,
        enemyId,
        rowIdx,
      };
      rowNodes.push(node);
      nodes.push(node);
      nodeIndex++;
    }
    nodeGrid.push(rowNodes);
  });

  // Connect rows: each node connects to 1-2 nodes in the next row
  for (let r = 0; r < nodeGrid.length - 1; r++) {
    const currentRow = nodeGrid[r];
    const nextRow = nodeGrid[r + 1];
    currentRow.forEach((node, i) => {
      // Connect to nearest node(s) in next row
      if (nextRow.length === 1) {
        node.connections.push(nextRow[0].id);
      } else {
        // Connect to closest and maybe one adjacent
        const idx = Math.round((i / (currentRow.length - 1 || 1)) * (nextRow.length - 1));
        node.connections.push(nextRow[idx].id);
        // Occasionally connect to adjacent
        if (Math.random() > 0.5 && idx + 1 < nextRow.length) {
          node.connections.push(nextRow[idx + 1].id);
        }
      }
    });
  }

  return nodes;
}

function loadRun() {
  try {
    const raw = localStorage.getItem(RUN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveRun(run) {
  localStorage.setItem(RUN_KEY, JSON.stringify(run));
}

function clearRun() {
  localStorage.removeItem(RUN_KEY);
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

export function useDungeonRun() {
  const [run, setRunState] = useState(() => loadRun());

  const setRun = useCallback((updater) => {
    setRunState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next === null) {
        clearRun();
      } else {
        saveRun(next);
      }
      return next;
    });
  }, []);

  const startRun = useCallback((selectedCards) => {
    const hpValues = selectedCards.map(c => c.hp || 80);
    const avgHP = hpValues.reduce((a, b) => a + b, 0) / hpValues.length;
    const maxHP = Math.round(avgHP * 1.5);

    const floor1Nodes = generateMapNodes(1);
    const newRun = {
      active: true,
      floor: 1,
      currentNodeId: null,
      playerHP: maxHP,
      playerMaxHP: maxHP,
      gold: 0,
      selectedCards,
      relics: [],
      mapNodes: floor1Nodes,
      completedNodeIds: [],
      runLog: ['⚔️ You enter the dungeon...'],
      enemiesDefeated: 0,
      questionsCorrect: 0,
      questionsAnswered: 0,
    };
    setRun(newRun);
    return newRun;
  }, [setRun]);

  const completeNode = useCallback((nodeId, rewards = {}) => {
    setRun(prev => {
      if (!prev) return prev;
      const nodes = prev.mapNodes.map(n =>
        n.id === nodeId ? { ...n, completed: true } : n
      );
      const completedNodeIds = [...prev.completedNodeIds, nodeId];
      const log = [...prev.runLog];

      let gold = prev.gold;
      let hp = prev.playerHP;
      let enemiesDefeated = prev.enemiesDefeated || 0;

      if (rewards.gold) {
        gold += rewards.gold;
        log.push(`💰 Earned ${rewards.gold} gold`);
      }
      if (rewards.heal) {
        hp = Math.min(prev.playerMaxHP, hp + rewards.heal);
        log.push(`❤️ Healed ${rewards.heal} HP`);
      }
      if (rewards.enemy) {
        enemiesDefeated += 1;
      }

      return {
        ...prev,
        mapNodes: nodes,
        completedNodeIds,
        currentNodeId: null,
        gold,
        playerHP: hp,
        enemiesDefeated,
        runLog: log.slice(-50),
      };
    });
  }, [setRun]);

  const setCurrentNode = useCallback((nodeId) => {
    setRun(prev => prev ? { ...prev, currentNodeId: nodeId } : prev);
  }, [setRun]);

  const updateHP = useCallback((newHP) => {
    setRun(prev => prev ? { ...prev, playerHP: Math.max(0, newHP) } : prev);
  }, [setRun]);

  const updateGold = useCallback((newGold) => {
    setRun(prev => prev ? { ...prev, gold: Math.max(0, newGold) } : prev);
  }, [setRun]);

  const addRelic = useCallback((relic) => {
    setRun(prev => {
      if (!prev) return prev;
      return { ...prev, relics: [...prev.relics, relic] };
    });
  }, [setRun]);

  const addLog = useCallback((message) => {
    setRun(prev => {
      if (!prev) return prev;
      return { ...prev, runLog: [...(prev.runLog || []), message].slice(-50) };
    });
  }, [setRun]);

  const incrementQuestionsCorrect = useCallback(() => {
    setRun(prev => prev ? { ...prev, questionsCorrect: (prev.questionsCorrect || 0) + 1, questionsAnswered: (prev.questionsAnswered || 0) + 1 } : prev);
  }, [setRun]);

  const incrementQuestionsAnswered = useCallback(() => {
    setRun(prev => prev ? { ...prev, questionsAnswered: (prev.questionsAnswered || 0) + 1 } : prev);
  }, [setRun]);

  const advanceFloor = useCallback(() => {
    setRun(prev => {
      if (!prev) return prev;
      const nextFloor = prev.floor + 1;
      if (nextFloor > 3) return prev; // shouldn't happen
      const newNodes = generateMapNodes(nextFloor);
      return {
        ...prev,
        floor: nextFloor,
        mapNodes: newNodes,
        completedNodeIds: [],
        currentNodeId: null,
        runLog: [...prev.runLog, `🏆 Floor ${prev.floor} cleared! Entering Floor ${nextFloor}...`],
      };
    });
  }, [setRun]);

  const endRun = useCallback((result) => {
    const currentRun = loadRun();
    if (currentRun) {
      saveHistory({
        date: new Date().toISOString(),
        result,
        floorReached: currentRun.floor,
        enemiesDefeated: currentRun.enemiesDefeated || 0,
        questionsCorrect: currentRun.questionsCorrect || 0,
        cardsUsed: currentRun.selectedCards?.map(c => c.name) || [],
      });
    }
    setRun(null);
  }, [setRun]);

  const abandonRun = useCallback(() => {
    endRun('abandoned');
  }, [endRun]);

  // Get available nodes (connected to a completed node, or row 0 if none completed)
  const getAvailableNodes = useCallback(() => {
    if (!run) return [];
    const { mapNodes, completedNodeIds } = run;

    // If no nodes completed, first row is available
    if (completedNodeIds.length === 0) {
      const minY = Math.max(...mapNodes.map(n => n.y));
      return mapNodes.filter(n => n.y === minY);
    }

    // Find nodes connected from completed nodes that aren't themselves completed
    const available = new Set();
    completedNodeIds.forEach(id => {
      const node = mapNodes.find(n => n.id === id);
      node?.connections?.forEach(connId => {
        if (!completedNodeIds.includes(connId)) {
          available.add(connId);
        }
      });
    });
    return mapNodes.filter(n => available.has(n.id));
  }, [run]);

  return {
    run,
    setRun,
    startRun,
    completeNode,
    setCurrentNode,
    updateHP,
    updateGold,
    addRelic,
    addLog,
    advanceFloor,
    endRun,
    abandonRun,
    getAvailableNodes,
    incrementQuestionsCorrect,
    incrementQuestionsAnswered,
  };
}
