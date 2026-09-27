export const ARENA_ENEMIES = [
  // ═══ FLOOR 1-2 NORMAL ═══
  {
    id: "crimson_wolf", name: "Crimson Wolf Pack", emoji: "🐺",
    type: "Iron", tier: "normal", floorRange: [1],
    creatures: [
      { name: "Alpha Wolf", emoji: "🐺", hp: 45, attack: 14, defense: 8, speed: 60, type: "Iron",
        movePattern: [
          { name: "Bite", type: "attack", damage: 14 },
          { name: "Howl", type: "buff", effect: "enrage", effectStacks: 1 },
          { name: "Savage Bite", type: "attack", damage: 20 },
        ] },
    ],
    goldReward: { min: 8, max: 15 },
    lore: "A wolf empowered by crimson energy.",
  },
  {
    id: "frost_fairy", name: "Frost Fairy", emoji: "🧚",
    type: "Wind", tier: "normal", floorRange: [1, 2],
    creatures: [
      { name: "Frost Fairy", emoji: "🧚", hp: 35, attack: 18, defense: 5, speed: 75, type: "Wind",
        movePattern: [
          { name: "Ice Shard", type: "attack", damage: 18 },
          { name: "Freeze", type: "debuff", effect: "freeze", effectStacks: 1 },
          { name: "Blizzard", type: "attack", damage: 25, effect: "freeze", effectStacks: 1 },
        ] },
    ],
    goldReward: { min: 7, max: 13 },
    lore: "A fairy touched by eternal winter.",
  },
  {
    id: "poison_serpent", name: "Poison Serpent", emoji: "🐍",
    type: "Poison", tier: "normal", floorRange: [1, 2],
    creatures: [
      { name: "Venom Serpent", emoji: "🐍", hp: 40, attack: 12, defense: 10, speed: 55, type: "Poison",
        movePattern: [
          { name: "Venom Strike", type: "attack", damage: 12, effect: "poison", effectStacks: 2 },
          { name: "Coil", type: "buff", effect: "shield", effectStacks: 15 },
          { name: "Death Fang", type: "attack", damage: 18, effect: "poison", effectStacks: 3 },
        ] },
    ],
    goldReward: { min: 9, max: 14 },
    lore: "A serpent whose venom corrupts the soul.",
  },
  {
    id: "fire_golem", name: "Fire Golem", emoji: "🔥",
    type: "Arcane", tier: "normal", floorRange: [2],
    creatures: [
      { name: "Fire Golem", emoji: "🔥", hp: 65, attack: 16, defense: 18, speed: 30, type: "Arcane",
        movePattern: [
          { name: "Flame Punch", type: "attack", damage: 16, effect: "burn", effectStacks: 1 },
          { name: "Heat Aura", type: "buff", effect: "enrage", effectStacks: 1 },
          { name: "Magma Slam", type: "attack", damage: 28, effect: "burn", effectStacks: 2 },
        ] },
    ],
    goldReward: { min: 10, max: 18 },
    lore: "A golem forged from living magma.",
  },
  {
    id: "shadow_twins", name: "Shadow Twins", emoji: "👥",
    type: "Void", tier: "normal", floorRange: [2, 3],
    creatures: [
      { name: "Shadow A", emoji: "🌑", hp: 30, attack: 20, defense: 6, speed: 70, type: "Void",
        movePattern: [
          { name: "Shadow Strike", type: "attack", damage: 20 },
          { name: "Vanish", type: "buff", effect: "shield", effectStacks: 10 },
        ] },
      { name: "Shadow B", emoji: "🌒", hp: 30, attack: 15, defense: 8, speed: 65, type: "Void",
        movePattern: [
          { name: "Dark Slash", type: "attack", damage: 15 },
          { name: "Life Drain", type: "attack", damage: 10, effect: "poison", effectStacks: 1 },
        ] },
    ],
    goldReward: { min: 12, max: 20 },
    lore: "Twin shadows born from the same void.",
  },

  // ═══ FLOOR 2-4 ELITE ═══
  {
    id: "iron_titan", name: "Iron Titan", emoji: "🤖",
    type: "Iron", tier: "elite", floorRange: [2, 3, 4],
    creatures: [
      { name: "Iron Titan", emoji: "🤖", hp: 120, attack: 25, defense: 35, speed: 25, type: "Iron",
        movePattern: [
          { name: "Iron Fist", type: "attack", damage: 25 },
          { name: "Fortress", type: "buff", effect: "shield", effectStacks: 40 },
          { name: "Titan Slam", type: "attack", damage: 45 },
          { name: "Shockwave", type: "ability", damage: 20, effect: "stun", effectStacks: 1 },
        ] },
    ],
    goldReward: { min: 25, max: 40 },
    lore: "A mechanical colossus built for endless war.",
  },
  {
    id: "arcane_witch", name: "Arcane Witch", emoji: "🧙‍♀️",
    type: "Arcane", tier: "elite", floorRange: [3, 4],
    creatures: [
      { name: "Arcane Witch", emoji: "🧙‍♀️", hp: 85, attack: 35, defense: 12, speed: 60, type: "Arcane",
        movePattern: [
          { name: "Hex", type: "debuff", effect: "silence", effectStacks: 1 },
          { name: "Arcane Blast", type: "attack", damage: 35 },
          { name: "Curse", type: "debuff", effect: "burn", effectStacks: 2 },
          { name: "Arcane Nova", type: "attack", damage: 55 },
        ] },
    ],
    goldReward: { min: 30, max: 45 },
    lore: "A witch who bends reality with forbidden spells.",
  },
  {
    id: "storm_eagle", name: "Storm Eagle", emoji: "🦅",
    type: "Wind", tier: "elite", floorRange: [2, 3, 4],
    creatures: [
      { name: "Storm Eagle", emoji: "🦅", hp: 95, attack: 30, defense: 15, speed: 90, type: "Wind",
        movePattern: [
          { name: "Talon Strike", type: "attack", damage: 30 },
          { name: "Wind Blade", type: "attack", damage: 22, effect: "stun", effectStacks: 1 },
          { name: "Thunder Dive", type: "attack", damage: 50 },
        ] },
    ],
    goldReward: { min: 28, max: 42 },
    lore: "An eagle that rides the eye of a living storm.",
  },

  // ═══ FLOOR BOSSES ═══
  {
    id: "crimson_warlord", name: "Crimson Warlord", emoji: "⚔️",
    type: "Iron", tier: "boss", floorRange: [1],
    creatures: [
      { name: "Crimson Warlord", emoji: "⚔️", hp: 200, attack: 30, defense: 20, speed: 40, type: "Iron",
        movePattern: [
          { name: "War Cry", type: "buff", effect: "enrage", effectStacks: 2 },
          { name: "Crimson Slash", type: "attack", damage: 30 },
          { name: "Blade Storm", type: "attack", damage: 45 },
          { name: "Execute", type: "attack", damage: 70 },
        ] },
    ],
    goldReward: { min: 50, max: 80 },
    lore: "A warlord who has never tasted defeat.",
  },
  {
    id: "forest_ancient", name: "Ancient Forest Spirit", emoji: "🌳",
    type: "Poison", tier: "boss", floorRange: [2],
    creatures: [
      { name: "Forest Ancient", emoji: "🌳", hp: 280, attack: 28, defense: 25, speed: 35, type: "Poison",
        movePattern: [
          { name: "Root Bind", type: "debuff", effect: "stun", effectStacks: 1 },
          { name: "Thorn Whip", type: "attack", damage: 28, effect: "poison", effectStacks: 2 },
          { name: "Spore Cloud", type: "ability", effect: "poison", effectStacks: 3 },
          { name: "Ancient Wrath", type: "attack", damage: 55 },
        ] },
    ],
    goldReward: { min: 70, max: 110 },
    lore: "A spirit as old as the forest itself.",
  },
  {
    id: "frost_queen", name: "Frost Queen", emoji: "👸",
    type: "Wind", tier: "boss", floorRange: [3],
    creatures: [
      { name: "Frost Queen", emoji: "👸", hp: 350, attack: 38, defense: 22, speed: 55, type: "Wind",
        movePattern: [
          { name: "Blizzard", type: "attack", damage: 38, effect: "freeze", effectStacks: 1 },
          { name: "Ice Armor", type: "buff", effect: "shield", effectStacks: 60 },
          { name: "Frost Nova", type: "ability", damage: 25, effect: "freeze", effectStacks: 1 },
          { name: "Absolute Zero", type: "attack", damage: 80 },
        ] },
    ],
    goldReward: { min: 90, max: 140 },
    lore: "She who froze an entire kingdom with a single breath.",
  },
  {
    id: "void_dragon", name: "Void Dragon", emoji: "🐉",
    type: "Void", tier: "boss", floorRange: [4],
    creatures: [
      { name: "Void Dragon", emoji: "🐉", hp: 450, attack: 50, defense: 30, speed: 60, type: "Void",
        movePattern: [
          { name: "Void Breath", type: "attack", damage: 50, effect: "burn", effectStacks: 2 },
          { name: "Reality Tear", type: "debuff", effect: "silence", effectStacks: 2 },
          { name: "Shadow Form", type: "buff", effect: "shield", effectStacks: 80 },
          { name: "Annihilation", type: "attack", damage: 100 },
        ] },
    ],
    goldReward: { min: 120, max: 180 },
    lore: "Born from the collapse of a dying universe.",
  },
  {
    id: "eternal_emperor", name: "The Eternal Emperor", emoji: "👑",
    type: "Void", tier: "boss", floorRange: [5],
    creatures: [
      { name: "Emperor Phase 1", emoji: "👑", hp: 300, attack: 55, defense: 35, speed: 65, type: "Void",
        movePattern: [
          { name: "Imperial Strike", type: "attack", damage: 55 },
          { name: "Edict of Pain", type: "debuff", effect: "burn", effectStacks: 3 },
          { name: "Royal Guard", type: "buff", effect: "shield", effectStacks: 100 },
          { name: "Judgment", type: "attack", damage: 85 },
        ] },
      { name: "Emperor Phase 2", emoji: "💀", hp: 250, attack: 70, defense: 20, speed: 80, type: "Void",
        movePattern: [
          { name: "Rage", type: "buff", effect: "enrage", effectStacks: 3 },
          { name: "Death Blow", type: "attack", damage: 90 },
          { name: "Chaos Nova", type: "ability", damage: 50, effect: "poison", effectStacks: 3 },
          { name: "Oblivion", type: "attack", damage: 130 },
        ] },
    ],
    goldReward: { min: 200, max: 300 },
    lore: "He who has ruled since before time began. The final challenge.",
  },
];

export function getArenaEnemyById(id) {
  return ARENA_ENEMIES.find(e => e.id === id);
}

export function pickArenaEnemy(floor, tier) {
  const pool = ARENA_ENEMIES.filter(e => e.floorRange.includes(floor) && e.tier === tier);
  if (pool.length === 0) {
    const any = ARENA_ENEMIES.filter(e => e.tier === tier);
    return any[Math.floor(Math.random() * any.length)] || ARENA_ENEMIES[0];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getArenaBoss(floor) {
  return ARENA_ENEMIES.find(e => e.tier === 'boss' && e.floorRange.includes(floor));
}
