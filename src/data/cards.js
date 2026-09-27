export const CARDS = [
  // ═══════════════════════════════ COMMON (8) ═══════════════════════════════
  {
    id: "page_goblin", name: "Page Goblin", rarity: "common", type: "creature",
    ieltsDomain: "reading",
    description: "A small creature obsessed with ancient scrolls and forgotten tomes.",
    baseStats: { hp: 80, attack: 25, defense: 20, speed: 40 },
    evolvedStats: { hp: 112, attack: 35, defense: 28, speed: 56 },
    maxStats: { hp: 157, attack: 49, defense: 39, speed: 78 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 50 },
    artColor: "#4B5563", artEmoji: "👺",
    abilities: [{ name: "Scroll Sense", description: "Can find hidden passages in any text" }]
  },
  {
    id: "echo_sprite", name: "Echo Sprite", rarity: "common", type: "creature",
    ieltsDomain: "listening",
    description: "Born from sound waves, it mimics everything it hears with perfect fidelity.",
    baseStats: { hp: 70, attack: 30, defense: 15, speed: 50 },
    evolvedStats: { hp: 98, attack: 42, defense: 21, speed: 70 },
    maxStats: { hp: 137, attack: 59, defense: 29, speed: 98 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 50 },
    artColor: "#374151", artEmoji: "🔊",
    abilities: [{ name: "Sound Mirror", description: "Repeats every word with crystal clarity" }]
  },
  {
    id: "ink_worm", name: "Ink Worm", rarity: "common", type: "creature",
    ieltsDomain: "vocabulary",
    description: "It devours dictionaries whole and grows stronger with every word consumed.",
    baseStats: { hp: 90, attack: 20, defense: 25, speed: 30 },
    evolvedStats: { hp: 126, attack: 28, defense: 35, speed: 42 },
    maxStats: { hp: 176, attack: 39, defense: 49, speed: 59 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 50 },
    artColor: "#4B5563", artEmoji: "🐛",
    abilities: [{ name: "Word Feast", description: "Absorbs new vocabulary on contact" }]
  },
  {
    id: "rule_rat", name: "Rule Rat", rarity: "common", type: "creature",
    ieltsDomain: "grammar",
    description: "Enforces the laws of language with iron paws and relentless precision.",
    baseStats: { hp: 85, attack: 22, defense: 30, speed: 35 },
    evolvedStats: { hp: 119, attack: 31, defense: 42, speed: 49 },
    maxStats: { hp: 167, attack: 43, defense: 59, speed: 69 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 50 },
    artColor: "#374151", artEmoji: "🐀",
    abilities: [{ name: "Error Detect", description: "Instantly finds grammatical mistakes" }]
  },
  {
    id: "scroll_bat", name: "Scroll Bat", rarity: "common", type: "creature",
    ieltsDomain: "reading",
    description: "Hunts in libraries by night, devouring passages from academic journals.",
    baseStats: { hp: 75, attack: 28, defense: 18, speed: 45 },
    evolvedStats: { hp: 105, attack: 39, defense: 25, speed: 63 },
    maxStats: { hp: 147, attack: 55, defense: 35, speed: 88 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 50 },
    artColor: "#1F2937", artEmoji: "🦇",
    abilities: [{ name: "Night Reading", description: "Processes text twice as fast in darkness" }]
  },
  {
    id: "murmur_moth", name: "Murmur Moth", rarity: "common", type: "creature",
    ieltsDomain: "listening",
    description: "Its wings carry whispered conversations across vast distances.",
    baseStats: { hp: 65, attack: 32, defense: 12, speed: 55 },
    evolvedStats: { hp: 91, attack: 45, defense: 17, speed: 77 },
    maxStats: { hp: 127, attack: 63, defense: 24, speed: 108 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 50 },
    artColor: "#374151", artEmoji: "🦋",
    abilities: [{ name: "Wing Whisper", description: "Amplifies faint audio signals threefold" }]
  },
  {
    id: "glyph_gecko", name: "Glyph Gecko", rarity: "common", type: "creature",
    ieltsDomain: "vocabulary",
    description: "Camouflages itself among written words, absorbing meanings by osmosis.",
    baseStats: { hp: 78, attack: 18, defense: 28, speed: 42 },
    evolvedStats: { hp: 109, attack: 25, defense: 39, speed: 59 },
    maxStats: { hp: 153, attack: 35, defense: 55, speed: 83 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 50 },
    artColor: "#4B5563", artEmoji: "🦎",
    abilities: [{ name: "Word Blend", description: "Blends into any vocabulary context seamlessly" }]
  },
  {
    id: "comma_crab", name: "Comma Crab", rarity: "common", type: "creature",
    ieltsDomain: "grammar",
    description: "Its claws snap shut at every misplaced punctuation mark it finds.",
    baseStats: { hp: 95, attack: 16, defense: 35, speed: 25 },
    evolvedStats: { hp: 133, attack: 22, defense: 49, speed: 35 },
    maxStats: { hp: 186, attack: 31, defense: 69, speed: 49 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 50 },
    artColor: "#374151", artEmoji: "🦀",
    abilities: [{ name: "Punctuation Pinch", description: "Corrects punctuation errors instantly" }]
  },

  // ═══════════════════════════════ UNCOMMON (7) ═══════════════════════════════
  {
    id: "stone_sentinel", name: "Stone Sentinel", rarity: "uncommon", type: "creature",
    ieltsDomain: "reading",
    description: "An ancient golem that has guarded the great library for ten thousand years.",
    baseStats: { hp: 160, attack: 45, defense: 55, speed: 45 },
    evolvedStats: { hp: 224, attack: 63, defense: 77, speed: 63 },
    maxStats: { hp: 314, attack: 88, defense: 108, speed: 88 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 150 },
    artColor: "#6B7280", artEmoji: "🗿",
    abilities: [{ name: "Ancient Wisdom", description: "Unlocks sealed passages in complex texts" }]
  },
  {
    id: "wind_whisperer", name: "Wind Whisperer", rarity: "uncommon", type: "creature",
    ieltsDomain: "listening",
    description: "A sound elemental that rides acoustic waves through the atmosphere.",
    baseStats: { hp: 130, attack: 60, defense: 35, speed: 65 },
    evolvedStats: { hp: 182, attack: 84, defense: 49, speed: 91 },
    maxStats: { hp: 255, attack: 118, defense: 69, speed: 127 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 150 },
    artColor: "#4B5563", artEmoji: "💨",
    abilities: [{ name: "Frequency Ride", description: "Detects meaning in any frequency of sound" }]
  },
  {
    id: "lexicon_fox", name: "Lexicon Fox", rarity: "uncommon", type: "creature",
    ieltsDomain: "vocabulary",
    description: "A cunning fox that collects rare words and trades them for power.",
    baseStats: { hp: 120, attack: 55, defense: 40, speed: 60 },
    evolvedStats: { hp: 168, attack: 77, defense: 56, speed: 84 },
    maxStats: { hp: 235, attack: 108, defense: 78, speed: 118 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 150 },
    artColor: "#78350F", artEmoji: "🦊",
    abilities: [{ name: "Word Hoard", description: "Steals rare vocabulary from defeated foes" }]
  },
  {
    id: "syntax_serpent", name: "Syntax Serpent", rarity: "uncommon", type: "creature",
    ieltsDomain: "grammar",
    description: "A snake that coils around sentences and ties them into grammatical knots.",
    baseStats: { hp: 140, attack: 50, defense: 45, speed: 55 },
    evolvedStats: { hp: 196, attack: 70, defense: 63, speed: 77 },
    maxStats: { hp: 274, attack: 98, defense: 88, speed: 108 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 150 },
    artColor: "#064E3B", artEmoji: "🐍",
    abilities: [{ name: "Clause Coil", description: "Restructures any sentence into perfect grammar" }]
  },
  {
    id: "kage_severed", name: "Kage, the Severed Shadow", rarity: "legendary", type: "creature",
    ieltsDomain: "universal",
    description: "A rogue shinobi clad in a torn black hood and a crimson-edged scarf. He fractures into shadow-clones mid-dash and strikes from the blind spot, twin kunai trailing violet smoke.",
    baseStats: { hp: 150, attack: 76, defense: 40, speed: 100 },
    evolvedStats: { hp: 210, attack: 106, defense: 56, speed: 140 },
    maxStats: { hp: 294, attack: 148, defense: 78, speed: 196 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 300 },
    artColor: "#0F0F1A", artEmoji: "🥷",
    abilities: [
      { name: "Shadow Split", description: "Dashes leave a shadow-clone that strikes nearby foes" },
      { name: "Blind Spot", description: "Attacks from behind cut deeper, ignoring part of armor" }
    ]
  },
  {
    id: "raiden_ronin", name: "Raiden the Storm Ronin", rarity: "legendary", type: "creature",
    ieltsDomain: "universal",
    description: "A masked lightning swordsman who blinks across the battlefield in a crackle of thunder, leaving afterimages and a trail of sparks. His blade hums with raw voltage.",
    baseStats: { hp: 140, attack: 70, defense: 38, speed: 95 },
    evolvedStats: { hp: 196, attack: 98, defense: 53, speed: 133 },
    maxStats: { hp: 274, attack: 137, defense: 74, speed: 186 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 300 },
    artColor: "#1E1B4B", artEmoji: "🥷",
    abilities: [
      { name: "Thunder Step", description: "Teleport-dashes through enemies in a flash of lightning" },
      { name: "Voltage Edge", description: "His electrified blade chains lightning between foes" }
    ]
  },
  {
    id: "rune_owl", name: "Rune Owl", rarity: "uncommon", type: "creature",
    ieltsDomain: "universal",
    description: "An owl whose feathers are inscribed with the runes of all four IELTS skills.",
    baseStats: { hp: 150, attack: 48, defense: 50, speed: 52 },
    evolvedStats: { hp: 210, attack: 67, defense: 70, speed: 73 },
    maxStats: { hp: 294, attack: 94, defense: 98, speed: 102 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 150 },
    artColor: "#1E3A5F", artEmoji: "🦉",
    abilities: [{ name: "All-Sight", description: "Sees weakness in any language task" }]
  },
  {
    id: "cipher_cat", name: "Cipher Cat", rarity: "uncommon", type: "creature",
    ieltsDomain: "universal",
    description: "A mysterious feline that decodes hidden messages within any text or speech.",
    baseStats: { hp: 125, attack: 52, defense: 42, speed: 62 },
    evolvedStats: { hp: 175, attack: 73, defense: 59, speed: 87 },
    maxStats: { hp: 245, attack: 102, defense: 83, speed: 122 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 150 },
    artColor: "#312E81", artEmoji: "🐱",
    abilities: [{ name: "Code Break", description: "Deciphers any encoded language instantly" }]
  },
  {
    id: "prism_parrot", name: "Prism Parrot", rarity: "uncommon", type: "creature",
    ieltsDomain: "universal",
    description: "A rainbow-feathered bird that speaks fluently in every language and accent.",
    baseStats: { hp: 135, attack: 58, defense: 37, speed: 63 },
    evolvedStats: { hp: 189, attack: 81, defense: 52, speed: 88 },
    maxStats: { hp: 265, attack: 113, defense: 73, speed: 123 },
    evolutionCost: { duplicatesRequired: 3, dustRequired: 150 },
    artColor: "#7C2D12", artEmoji: "🦜",
    abilities: [{ name: "Polyglot Echo", description: "Repeats any phrase in perfect accent" }]
  },

  // ═══════════════════════════════ RARE (7) ═══════════════════════════════
  {
    id: "tome_dragon", name: "Tome Dragon", rarity: "rare", type: "creature",
    ieltsDomain: "reading",
    description: "A magnificent dragon whose scales are made from compressed book pages.",
    baseStats: { hp: 260, attack: 95, defense: 85, speed: 75 },
    evolvedStats: { hp: 416, attack: 152, defense: 136, speed: 120 },
    maxStats: { hp: 666, attack: 243, defense: 218, speed: 192 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 400 },
    artColor: "#1E3A8A", artEmoji: "🐉",
    abilities: [{ name: "Chapter Breath", description: "Burns through passages with fire and fury" }]
  },
  {
    id: "storm_listener", name: "Storm Listener", rarity: "rare", type: "creature",
    ieltsDomain: "listening",
    description: "A storm elemental that perceives conversations across dimensional barriers.",
    baseStats: { hp: 220, attack: 100, defense: 70, speed: 90 },
    evolvedStats: { hp: 352, attack: 160, defense: 112, speed: 144 },
    maxStats: { hp: 563, attack: 256, defense: 179, speed: 230 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 400 },
    artColor: "#1E3A5F", artEmoji: "⛈️",
    abilities: [{ name: "Thunder Ear", description: "Hears every nuance hidden in the storm" }]
  },
  {
    id: "word_witch", name: "Word Witch", rarity: "rare", type: "creature",
    ieltsDomain: "vocabulary",
    description: "A sorceress who casts devastating spells woven from rare academic vocabulary.",
    baseStats: { hp: 200, attack: 100, defense: 70, speed: 88 },
    evolvedStats: { hp: 320, attack: 160, defense: 112, speed: 141 },
    maxStats: { hp: 512, attack: 256, defense: 179, speed: 226 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 400 },
    artColor: "#4C1D95", artEmoji: "🧙‍♀️",
    abilities: [{ name: "Lexical Hex", description: "Curses foes with incomprehensible vocabulary" }]
  },
  {
    id: "grammar_knight", name: "Grammar Knight", rarity: "rare", type: "creature",
    ieltsDomain: "grammar",
    description: "A legendary armored knight wielding a sacred sword of grammatical correction.",
    baseStats: { hp: 250, attack: 80, defense: 90, speed: 70 },
    evolvedStats: { hp: 400, attack: 128, defense: 144, speed: 112 },
    maxStats: { hp: 640, attack: 205, defense: 230, speed: 179 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 400 },
    artColor: "#1F2937", artEmoji: "⚔️",
    abilities: [{ name: "Correction Slash", description: "Slices through grammatical errors with precision" }]
  },
  {
    id: "crystal_phoenix", name: "Crystal Phoenix", rarity: "rare", type: "creature",
    ieltsDomain: "universal",
    description: "A phoenix whose crystal feathers contain the wisdom of every exam ever written.",
    baseStats: { hp: 230, attack: 90, defense: 80, speed: 80 },
    evolvedStats: { hp: 368, attack: 144, defense: 128, speed: 128 },
    maxStats: { hp: 589, attack: 230, defense: 205, speed: 205 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 400 },
    artColor: "#0C4A6E", artEmoji: "🦅",
    abilities: [{ name: "Exam Rebirth", description: "Rises from failure stronger each time" }]
  },
  {
    id: "mnemonic_monk", name: "Mnemonic Monk", rarity: "rare", type: "creature",
    ieltsDomain: "universal",
    description: "An ancient monk who has memorized every word in the English language.",
    baseStats: { hp: 240, attack: 85, defense: 85, speed: 72 },
    evolvedStats: { hp: 384, attack: 136, defense: 136, speed: 115 },
    maxStats: { hp: 614, attack: 218, defense: 218, speed: 184 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 400 },
    artColor: "#292524", artEmoji: "🧘",
    abilities: [{ name: "Total Recall", description: "Never forgets a single vocabulary item" }]
  },
  {
    id: "cipher_sphinx", name: "Cipher Sphinx", rarity: "rare", type: "creature",
    ieltsDomain: "universal",
    description: "A riddle-weaving sphinx that guards the secrets of academic English.",
    baseStats: { hp: 255, attack: 88, defense: 88, speed: 73 },
    evolvedStats: { hp: 408, attack: 141, defense: 141, speed: 117 },
    maxStats: { hp: 653, attack: 226, defense: 226, speed: 187 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 400 },
    artColor: "#78350F", artEmoji: "🦁",
    abilities: [{ name: "Riddle Weave", description: "Transforms any question into a solvable puzzle" }]
  },

  // ═══════════════════════════════ EPIC (5) ═══════════════════════════════
  {
    id: "ancient_librarian", name: "Ancient Librarian", rarity: "epic", type: "creature",
    ieltsDomain: "reading",
    description: "An immortal scholar who has read every text ever written by humankind.",
    baseStats: { hp: 420, attack: 150, defense: 145, speed: 105 },
    evolvedStats: { hp: 714, attack: 255, defense: 247, speed: 179 },
    maxStats: { hp: 1214, attack: 434, defense: 420, speed: 304 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 1000 },
    artColor: "#1E3A5F", artEmoji: "📚",
    abilities: [
      { name: "Omniscient Read", description: "Comprehends any passage in an instant" },
      { name: "Library Seal", description: "Locks knowledge away from those unworthy" }
    ]
  },
  {
    id: "echo_titan", name: "Echo Titan", rarity: "epic", type: "creature",
    ieltsDomain: "listening",
    description: "A colossal giant formed entirely from crystallized sound energy and music.",
    baseStats: { hp: 380, attack: 160, defense: 130, speed: 115 },
    evolvedStats: { hp: 646, attack: 272, defense: 221, speed: 196 },
    maxStats: { hp: 1098, attack: 462, defense: 376, speed: 333 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 1000 },
    artColor: "#1E3A8A", artEmoji: "🔱",
    abilities: [
      { name: "Sonic Boom", description: "Shatters barriers with pure sound force" },
      { name: "Echo Chamber", description: "Amplifies every spoken word a thousandfold" }
    ]
  },
  {
    id: "lexicon_phoenix", name: "Lexicon Phoenix", rarity: "epic", type: "creature",
    ieltsDomain: "vocabulary",
    description: "A phoenix reborn from the ashes of burning dictionaries and thesauruses.",
    baseStats: { hp: 360, attack: 155, defense: 135, speed: 120 },
    evolvedStats: { hp: 612, attack: 264, defense: 230, speed: 204 },
    maxStats: { hp: 1040, attack: 449, defense: 391, speed: 347 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 1000 },
    artColor: "#7C2D12", artEmoji: "🔥",
    abilities: [
      { name: "Word Inferno", description: "Burns away confusion with blazing vocabulary" },
      { name: "Ash Rebirth", description: "Every destroyed word becomes a new one" }
    ]
  },
  {
    id: "syntax_overlord", name: "Syntax Overlord", rarity: "epic", type: "creature",
    ieltsDomain: "grammar",
    description: "The dark ruler of all language law, feared by every sentence and clause.",
    baseStats: { hp: 400, attack: 145, description: 140, speed: 100 },
    evolvedStats: { hp: 680, attack: 247, defense: 238, speed: 170 },
    maxStats: { hp: 1156, attack: 420, defense: 405, speed: 289 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 1000 },
    artColor: "#1F2937", artEmoji: "👑",
    abilities: [
      { name: "Rule of Law", description: "Forces perfect grammar on all within range" },
      { name: "Correction Decree", description: "Rewrites flawed syntax with one command" }
    ]
  },
  {
    id: "the_polyglot", name: "The Polyglot", rarity: "epic", type: "creature",
    ieltsDomain: "universal",
    description: "A mysterious wandering figure who speaks every language of mortals and gods.",
    baseStats: { hp: 350, attack: 155, defense: 130, speed: 110 },
    evolvedStats: { hp: 595, attack: 264, defense: 221, speed: 187 },
    maxStats: { hp: 1012, attack: 449, defense: 376, speed: 318 },
    evolutionCost: { duplicatesRequired: 2, dustRequired: 1000 },
    artColor: "#312E81", artEmoji: "🌐",
    abilities: [
      { name: "Lingua Mastery", description: "Commands any language with absolute fluency" },
      { name: "Universal Tongue", description: "Bridges all communication gaps instantly" }
    ]
  },

  // ═══════════════════════════════ LEGENDARY (3) ═══════════════════════════════
  {
    id: "ielts_sovereign", name: "IELTS Sovereign", rarity: "legendary", type: "creature",
    ieltsDomain: "universal",
    description: "The ultimate master of English — an immortal being who achieved Band 9 before English was even invented.",
    baseStats: { hp: 700, attack: 260, defense: 240, speed: 180 },
    evolvedStats: { hp: 1190, attack: 442, defense: 408, speed: 306 },
    maxStats: { hp: 2023, attack: 751, defense: 694, speed: 520 },
    evolutionCost: { duplicatesRequired: 1, dustRequired: 3000 },
    artColor: "#78350F", artEmoji: "⚜️",
    abilities: [
      { name: "Band 9", description: "Overwhelms all opponents with the power of perfect English" },
      { name: "Sovereign Decree", description: "Rewrites the rules of language at will" },
      { name: "Immortal Fluency", description: "Cannot be silenced by any force in existence" }
    ]
  },
  {
    id: "the_examiner", name: "The Examiner", rarity: "legendary", type: "creature",
    ieltsDomain: "universal",
    description: "An ancient god-like figure who has judged every English examination since the dawn of time.",
    baseStats: { hp: 650, attack: 240, defense: 230, speed: 160 },
    evolvedStats: { hp: 1105, attack: 408, defense: 391, speed: 272 },
    maxStats: { hp: 1879, attack: 694, defense: 665, speed: 462 },
    evolutionCost: { duplicatesRequired: 1, dustRequired: 3000 },
    artColor: "#1F2937", artEmoji: "🏛️",
    abilities: [
      { name: "Final Judgment", description: "Delivers the ultimate verdict on all language use" },
      { name: "Criterion Gaze", description: "Sees every flaw in grammar, vocabulary, and structure" },
      { name: "Marking Seal", description: "Stamps a perfect score on those deemed worthy" }
    ]
  },
  {
    id: "eternal_scholar", name: "Eternal Scholar", rarity: "legendary", type: "creature",
    ieltsDomain: "universal",
    description: "A being who has studied for ten thousand millennia, absorbing the wisdom of every civilization.",
    baseStats: { hp: 620, attack: 225, defense: 235, speed: 150 },
    evolvedStats: { hp: 1054, attack: 383, defense: 400, speed: 255 },
    maxStats: { hp: 1792, attack: 651, defense: 680, speed: 434 },
    evolutionCost: { duplicatesRequired: 1, dustRequired: 3000 },
    artColor: "#1E3A5F", artEmoji: "✨",
    abilities: [
      { name: "Infinite Study", description: "Knowledge accumulates without limit or end" },
      { name: "Ancient Insight", description: "Reveals the deep structure of any language pattern" },
      { name: "Eternal Memory", description: "Never forgets a single thing learned in ten millennia" }
    ]
  }
];

export const RARITY_COLORS = {
  common: '#6B7280',
  uncommon: '#3FB950',
  rare: '#3B82F6',
  epic: '#7C3AED',
  legendary: '#F59E0B'
};

export const RARITY_STARS = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5
};

export const DOMAIN_COLORS = {
  reading: '#3B82F6',
  listening: '#10B981',
  vocabulary: '#F59E0B',
  grammar: '#EF4444',
  universal: '#7C3AED'
};

export function getCardById(id) {
  return CARDS.find(c => c.id === id);
}

export function getCardsByRarity(rarity) {
  return CARDS.filter(c => c.rarity === rarity);
}
