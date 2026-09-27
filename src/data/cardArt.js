import commonAtlas from '../assets/cards/common-atlas.webp';
import uncommonAtlas from '../assets/cards/uncommon-atlas.webp';
import rareAtlas from '../assets/cards/rare-atlas.webp';
import epicAtlas from '../assets/cards/epic-atlas.webp';
import legendaryAtlas from '../assets/cards/legendary-atlas.webp';

const makeEntry = (atlas, columns, row, column) => ({ atlas, columns, rows: 2, row, column });

export const CARD_ART = {
  page_goblin: makeEntry(commonAtlas, 4, 0, 0),
  echo_sprite: makeEntry(commonAtlas, 4, 0, 1),
  ink_worm: makeEntry(commonAtlas, 4, 0, 2),
  rule_rat: makeEntry(commonAtlas, 4, 0, 3),
  scroll_bat: makeEntry(commonAtlas, 4, 1, 0),
  murmur_moth: makeEntry(commonAtlas, 4, 1, 1),
  glyph_gecko: makeEntry(commonAtlas, 4, 1, 2),
  comma_crab: makeEntry(commonAtlas, 4, 1, 3),

  stone_sentinel: makeEntry(uncommonAtlas, 4, 0, 0),
  wind_whisperer: makeEntry(uncommonAtlas, 4, 0, 1),
  lexicon_fox: makeEntry(uncommonAtlas, 4, 0, 2),
  syntax_serpent: makeEntry(uncommonAtlas, 4, 0, 3),
  rune_owl: makeEntry(uncommonAtlas, 4, 1, 0),
  cipher_cat: makeEntry(uncommonAtlas, 4, 1, 1),
  prism_parrot: makeEntry(uncommonAtlas, 4, 1, 2),

  tome_dragon: makeEntry(rareAtlas, 4, 0, 0),
  storm_listener: makeEntry(rareAtlas, 4, 0, 1),
  word_witch: makeEntry(rareAtlas, 4, 0, 2),
  grammar_knight: makeEntry(rareAtlas, 4, 0, 3),
  crystal_phoenix: makeEntry(rareAtlas, 4, 1, 0),
  mnemonic_monk: makeEntry(rareAtlas, 4, 1, 1),
  cipher_sphinx: makeEntry(rareAtlas, 4, 1, 2),

  ancient_librarian: makeEntry(epicAtlas, 3, 0, 0),
  echo_titan: makeEntry(epicAtlas, 3, 0, 1),
  lexicon_phoenix: makeEntry(epicAtlas, 3, 0, 2),
  syntax_overlord: makeEntry(epicAtlas, 3, 1, 0),
  the_polyglot: makeEntry(epicAtlas, 3, 1, 1),

  kage_severed: makeEntry(legendaryAtlas, 3, 0, 0),
  raiden_ronin: makeEntry(legendaryAtlas, 3, 0, 1),
  ielts_sovereign: makeEntry(legendaryAtlas, 3, 0, 2),
  the_examiner: makeEntry(legendaryAtlas, 3, 1, 0),
  eternal_scholar: makeEntry(legendaryAtlas, 3, 1, 1),
};

export function getCardArt(cardId) {
  return CARD_ART[cardId] || null;
}

