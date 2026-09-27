export const ARENA_ITEMS = [
  { id: "dragons_scale", name: "Dragon's Scale", emoji: "🐲", cost: 30,
    description: "All creatures gain +10 DEF", effect: { type: "team_def_bonus", value: 10 } },
  { id: "berserker_blood", name: "Berserker's Blood", emoji: "🩸", cost: 35,
    description: "All creatures deal +8 ATK but lose 5 DEF", effect: { type: "team_atk_bonus", value: 8 } },
  { id: "phoenix_feather", name: "Phoenix Feather", emoji: "🪶", cost: 50,
    description: "Once per run: revive a fallen creature at 30% HP", effect: { type: "revive_one", value: 30 } },
  { id: "time_crystal", name: "Time Crystal", emoji: "💎", cost: 45,
    description: "All creatures gain +1 MP at battle start", effect: { type: "battle_start_mp", value: 1 } },
  { id: "shadow_cloak", name: "Shadow Cloak", emoji: "🌑", cost: 28,
    description: "First attack each battle always crits (+50% dmg)", effect: { type: "first_attack_crit", value: 50 } },
  { id: "healing_spring", name: "Healing Spring Vial", emoji: "💧", cost: 20,
    description: "All creatures regen 5 HP per turn", effect: { type: "team_regen", value: 5 } },
  { id: "warlords_banner", name: "Warlord's Banner", emoji: "🚩", cost: 40,
    description: "All creatures start battle with +1 Enrage", effect: { type: "battle_start_enrage", value: 1 } },
  { id: "frost_amulet", name: "Frost Amulet", emoji: "🔵", cost: 32,
    description: "Basic attacks have 30% chance to Freeze", effect: { type: "freeze_chance", value: 30 } },
  { id: "venom_vial", name: "Venom Vial", emoji: "🧪", cost: 30,
    description: "All attacks apply 1 stack of Poison", effect: { type: "attack_poison", value: 1 } },
  { id: "guardian_totem", name: "Guardian Totem", emoji: "🗿", cost: 38,
    description: "All creatures start each battle with 15 shield", effect: { type: "battle_start_shield", value: 15 } },
  { id: "soul_gem", name: "Soul Gem", emoji: "🔮", cost: 55,
    description: "Gain +50% gold from all sources", effect: { type: "gold_multiplier", value: 0.5 } },
  { id: "titan_heart", name: "Titan's Heart", emoji: "❤️‍🔥", cost: 60,
    description: "All creatures gain +25 Max HP", effect: { type: "team_hp_bonus", value: 25 } },
];

export function getArenaShopItems(count = 3) {
  const shuffled = [...ARENA_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
