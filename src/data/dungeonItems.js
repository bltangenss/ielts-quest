export const DUNGEON_ITEMS = [
  {
    id: "iron_ring",
    name: "Iron Ring",
    emoji: "💍",
    description: "+5 shield at start of each battle",
    cost: 20,
    effect: { type: "battle_start_shield", value: 5 }
  },
  {
    id: "health_potion",
    name: "Health Potion",
    emoji: "🧪",
    description: "Instantly restore 25 HP",
    cost: 15,
    effect: { type: "instant_heal", value: 25 }
  },
  {
    id: "scholars_lens",
    name: "Scholar's Lens",
    emoji: "🔍",
    description: "IELTS challenges eliminate 1 wrong option",
    cost: 25,
    effect: { type: "ielts_hint", value: 1 }
  },
  {
    id: "golden_hourglass",
    name: "Golden Hourglass",
    emoji: "⏳",
    description: "+10 extra seconds on IELTS challenge timer",
    cost: 30,
    effect: { type: "ielts_time_bonus", value: 10 }
  },
  {
    id: "berserker_charm",
    name: "Berserker Charm",
    emoji: "🪬",
    description: "All cards deal +3 bonus damage",
    cost: 35,
    effect: { type: "global_attack_bonus", value: 3 }
  },
  {
    id: "thorn_armor",
    name: "Thorn Armor",
    emoji: "🌵",
    description: "Reflect 5 damage to enemy when you take damage",
    cost: 30,
    effect: { type: "thorns", value: 5 }
  },
  {
    id: "vampiric_fang",
    name: "Vampiric Fang",
    emoji: "🦷",
    description: "Heal 2 HP each time you deal damage",
    cost: 35,
    effect: { type: "lifesteal", value: 2 }
  },
  {
    id: "energy_crystal",
    name: "Energy Crystal",
    emoji: "💎",
    description: "Start every battle with +1 extra energy",
    cost: 40,
    effect: { type: "bonus_energy", value: 1 }
  },
  {
    id: "ancient_scroll",
    name: "Ancient Scroll",
    emoji: "📜",
    description: "Reduce all card energy costs by 1 (min 1)",
    cost: 38,
    effect: { type: "cost_reduction", value: 1 }
  },
  {
    id: "lucky_coin",
    name: "Lucky Coin",
    emoji: "🪙",
    description: "+50% gold from all sources this run",
    cost: 28,
    effect: { type: "gold_multiplier", value: 0.5 }
  },
];

export function getShopItems(count = 3) {
  const shuffled = [...DUNGEON_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
