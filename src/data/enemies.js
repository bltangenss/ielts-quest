export const ENEMIES = [
  // ═══ NORMAL ENEMIES ═══
  {
    id: "shadow_wisp", name: "Shadow Wisp", emoji: "👻", tier: "normal",
    floorRange: [1], maxHP: 30, attack: 8, defense: 5,
    intentPattern: ["attack", "attack", "defend"],
    attackValues: [8, 8, 0],
    description: "A wisp of shadow that drains courage.",
    goldReward: { min: 5, max: 10 }
  },
  {
    id: "stone_golem", name: "Stone Golem", emoji: "🗿", tier: "normal",
    floorRange: [1, 2], maxHP: 45, attack: 12, defense: 15,
    intentPattern: ["defend", "attack", "attack"],
    attackValues: [0, 12, 14],
    description: "A hulking guardian of ancient stone.",
    goldReward: { min: 7, max: 12 }
  },
  {
    id: "flame_imp", name: "Flame Imp", emoji: "😈", tier: "normal",
    floorRange: [2], maxHP: 35, attack: 14, defense: 3,
    intentPattern: ["attack", "buff", "attack"],
    attackValues: [14, 0, 20],
    description: "Cackling fire demon with unpredictable bursts.",
    goldReward: { min: 8, max: 14 }
  },
  {
    id: "forest_troll", name: "Forest Troll", emoji: "🧌", tier: "normal",
    floorRange: [1, 2], maxHP: 50, attack: 10, defense: 8,
    intentPattern: ["attack", "attack", "defend", "attack"],
    attackValues: [10, 12, 0, 15],
    description: "A lumbering brute from the dark forest.",
    goldReward: { min: 6, max: 11 }
  },
  {
    id: "dark_archer", name: "Dark Archer", emoji: "🏹", tier: "normal",
    floorRange: [2, 3], maxHP: 40, attack: 16, defense: 4,
    intentPattern: ["attack", "attack", "buff", "attack"],
    attackValues: [16, 16, 0, 22],
    description: "Silent and deadly, strikes from the shadows.",
    goldReward: { min: 9, max: 15 }
  },
  {
    id: "cursed_skull", name: "Cursed Skull", emoji: "💀", tier: "normal",
    floorRange: [2, 3], maxHP: 38, attack: 13, defense: 6,
    intentPattern: ["attack", "buff", "attack", "attack"],
    attackValues: [13, 0, 17, 17],
    description: "An animated skull imbued with dark magic.",
    goldReward: { min: 8, max: 13 }
  },

  // ═══ ELITE ENEMIES ═══
  {
    id: "iron_knight", name: "Iron Knight", emoji: "🛡️", tier: "elite",
    floorRange: [1, 2, 3], maxHP: 75, attack: 18, defense: 20,
    intentPattern: ["defend", "defend", "attack", "buff", "attack"],
    attackValues: [0, 0, 18, 0, 28],
    description: "A fallen knight in enchanted iron armour.",
    goldReward: { min: 15, max: 25 }
  },
  {
    id: "void_mage", name: "Void Mage", emoji: "🧙", tier: "elite",
    floorRange: [2, 3], maxHP: 60, attack: 22, defense: 8,
    intentPattern: ["buff", "attack", "attack", "buff", "attack"],
    attackValues: [0, 22, 25, 0, 30],
    description: "A sorcerer who draws power from the void.",
    goldReward: { min: 18, max: 28 }
  },
  {
    id: "blood_vampire", name: "Blood Vampire", emoji: "🧛", tier: "elite",
    floorRange: [1, 2, 3], maxHP: 65, attack: 20, defense: 10,
    intentPattern: ["attack", "buff", "attack", "attack"],
    attackValues: [20, 0, 20, 25],
    description: "An immortal bloodsucker who grows stronger with each kill.",
    goldReward: { min: 16, max: 26 }
  },
  {
    id: "plague_witch", name: "Plague Witch", emoji: "🧟", tier: "elite",
    floorRange: [2, 3], maxHP: 70, attack: 19, defense: 12,
    intentPattern: ["buff", "attack", "attack", "defend", "attack"],
    attackValues: [0, 19, 24, 0, 28],
    description: "A cursed witch who spreads pestilence.",
    goldReward: { min: 17, max: 27 }
  },

  // ═══ BOSSES ═══
  {
    id: "dungeon_warden", name: "Dungeon Warden", emoji: "⚓", tier: "boss",
    floorRange: [1], maxHP: 120, attack: 25, defense: 15,
    intentPattern: ["attack", "defend", "buff", "attack", "attack"],
    attackValues: [25, 0, 0, 30, 35],
    description: "The iron guardian of the first gate.",
    goldReward: { min: 30, max: 50 }
  },
  {
    id: "chaos_dragon", name: "Chaos Dragon", emoji: "🐲", tier: "boss",
    floorRange: [2], maxHP: 180, attack: 35, defense: 20,
    intentPattern: ["buff", "attack", "attack", "defend", "attack"],
    attackValues: [0, 35, 40, 0, 50],
    description: "An ancient dragon whose breath sunders the earth.",
    goldReward: { min: 50, max: 80 }
  },
  {
    id: "shadow_overlord", name: "Shadow Overlord", emoji: "👁️", tier: "boss",
    floorRange: [3], maxHP: 250, attack: 45, defense: 25,
    intentPattern: ["buff", "attack", "buff", "attack", "attack", "defend"],
    attackValues: [0, 45, 0, 50, 60, 0],
    description: "The all-seeing darkness that devours souls.",
    goldReward: { min: 80, max: 120 }
  },
];

export function getEnemyById(id) {
  return ENEMIES.find(e => e.id === id);
}

export function getEnemiesForFloor(floor, tier) {
  return ENEMIES.filter(e =>
    e.floorRange.includes(floor) && e.tier === tier
  );
}

export function pickRandomEnemy(floor, tier) {
  const pool = getEnemiesForFloor(floor, tier);
  if (pool.length === 0) return ENEMIES.find(e => e.tier === tier);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getBossForFloor(floor) {
  return ENEMIES.find(e => e.tier === 'boss' && e.floorRange.includes(floor));
}
